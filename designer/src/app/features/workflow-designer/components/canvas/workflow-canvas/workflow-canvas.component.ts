import { Component, OnInit, OnDestroy, inject, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStateService } from '@core/services/workflow-state.service';
import { WorkflowNode, WorkflowEdge, NodeType } from '@core/models/workflow.types';
import { WorkflowNodeTemplateComponent } from '../../nodes/workflow-node-template/workflow-node-template.component';
import { FFlowModule } from '@foblex/flow';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearchPlus, faSearchMinus, faExpand } from '@fortawesome/free-solid-svg-icons';
import { NodeContextMenuComponent } from '../node-context-menu/node-context-menu.component';

interface GraphNode {
  id: string;
  label: string;
  position: { x: number; y: number };
  data: WorkflowNode;
  outputId: string; // Single output port (for most nodes)
  outputIds?: { true: string; false: string }; // Dual output ports (for condition nodes)
  inputId: string;
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  sourceOutputId: string;
  targetInputId: string;
  label?: string;
}

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule, WorkflowNodeTemplateComponent, FFlowModule, FontAwesomeModule, NodeContextMenuComponent],
  templateUrl: './workflow-canvas.component.html',
  styleUrl: './workflow-canvas.component.scss',
})
export class WorkflowCanvasComponent implements OnInit, OnDestroy {
  nodes: GraphNode[] = [];
  links: GraphLink[] = [];
  // Canvas transform state
  panX = 0;
  panY = 0;
  zoom = 1;
  stateService = inject(WorkflowStateService);
  
  // Icons
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;
  faExpand = faExpand;
  
  // Connection creation state
  isConnecting = false;
  connectingFromPort: string | null = null;
  connectingFromNodeId: string | null = null;
  
  // Context menu state
  contextMenu: { x: number; y: number; nodeId: string } | null = null;

  // Debug: Track if component is initialized
  isInitialized = false;

  constructor() {
    // Watch for changes to nodes and edges signals
    effect(() => {
      // Read signals to establish reactive dependency
      const nodes = this.stateService.nodes();
      const edges = this.stateService.edges();
      const selectedNodeId = this.stateService.selectedNodeId();
      
      // Update graph when signals change
      this.updateGraph();
    });
  }

  ngOnInit(): void {
    this.isInitialized = true;
    this.updateGraph();
    console.log('WorkflowCanvasComponent initialized', { nodes: this.nodes.length, links: this.links.length });
  }
  
  ngOnDestroy(): void {
    // Clean up global event listener
    this.cancelConnection();
  }

  updateGraph(): void {
    // This will be called when signals change via template binding
    const workflowNodes = this.stateService.nodes();
    const workflowEdges = this.stateService.edges();
    const selectedNodeId = this.stateService.selectedNodeId();

    // Convert workflow nodes to graph nodes with input/output IDs
    this.nodes = workflowNodes.map((node) => {
      const baseNode: Partial<GraphNode> = {
        id: node.id,
        label: node.data.label,
        position: node.position,
        data: node,
        inputId: `input-${node.id}`,
      };
      
      // Condition nodes have 2 output ports (true/false)
      if (node.type === 'CONDITION') {
        const conditionNode: GraphNode = {
          ...baseNode,
          outputId: `output-${node.id}-true`, // Default for backward compatibility
          outputIds: {
            true: `output-${node.id}-true`,
            false: `output-${node.id}-false`,
          },
        } as GraphNode;
        console.log('Created condition node with dual ports:', {
          id: conditionNode.id,
          type: node.type,
          outputIds: conditionNode.outputIds,
          hasOutputIds: !!conditionNode.outputIds
        });
        return conditionNode;
      }
      
      // All other nodes have single output port
      const regularNode: GraphNode = {
        ...baseNode,
        outputId: `output-${node.id}`,
      } as GraphNode;
      return regularNode;
    });
    
    console.log('Updated graph nodes:', this.nodes.map(n => ({
      id: n.id,
      type: n.data.type,
      hasOutputIds: !!n.outputIds,
      outputIds: n.outputIds
    })));

    // Convert workflow edges to graph links with port IDs
    this.links = workflowEdges.map((edge) => {
      const sourceNode = this.nodes.find(n => n.id === edge.source);
      const targetNode = this.nodes.find(n => n.id === edge.target);
      
      // Determine source output port ID
      let sourceOutputId: string;
      if (sourceNode?.outputIds && edge.sourceHandle) {
        // Condition node with true/false branches
        const branch = edge.sourceHandle === 'true' ? 'true' : 'false';
        sourceOutputId = sourceNode.outputIds[branch] || sourceNode.outputId;
      } else {
        // Regular node or fallback
        sourceOutputId = sourceNode?.outputId || `output-${edge.source}`;
      }
      
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceOutputId,
        targetInputId: targetNode?.inputId || `input-${edge.target}`,
        label: edge.label,
      };
    });
  }

  onNodeClick(node: GraphNode, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.stateService.setSelectedNodeId(node.id);
    // Close context menu on left click
    this.contextMenu = null;
  }
  
  onNodeContextMenu(node: GraphNode, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.contextMenu = {
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    };
    
    // Select the node when showing context menu
    this.stateService.setSelectedNodeId(node.id);
  }
  
  onCanvasClick(event: MouseEvent): void {
    // Only close context menu if clicking on canvas background, not on nodes or ports
    const target = event.target as HTMLElement;
    if (target.classList.contains('canvas-container') || target.tagName === 'F-CANVAS' || target.tagName === 'F-FLOW') {
      this.contextMenu = null;
    }
  }
  
  // Context menu actions
  onConfigureNode(): void {
    if (this.contextMenu) {
      this.stateService.setSelectedNodeId(this.contextMenu.nodeId);
      this.stateService.openNodeEditor();
      this.contextMenu = null;
    }
  }
  
  onRenameNode(): void {
    if (this.contextMenu) {
      const node = this.stateService.nodes().find(n => n.id === this.contextMenu!.nodeId);
      if (node) {
        const newName = prompt('Enter new node name:', node.data.label);
        if (newName !== null && newName.trim() !== '') {
          this.stateService.updateNode({
            ...node,
            data: {
              ...node.data,
              label: newName.trim(),
            },
          });
        }
      }
      this.contextMenu = null;
    }
  }
  
  onDeleteNode(): void {
    if (this.contextMenu) {
      if (confirm('Are you sure you want to delete this node?')) {
        this.stateService.removeNode(this.contextMenu.nodeId);
      }
      this.contextMenu = null;
    }
  }
  
  onCloseContextMenu(): void {
    this.contextMenu = null;
  }

  onNodePositionChange(node: GraphNode, position: { x: number; y: number }): void {
    // Update node position in state when dragged
    this.stateService.updateNode({
      ...node.data,
      position,
    });
  }

  getNodeById(id: string): GraphNode | undefined {
    return this.nodes.find(n => n.id === id);
  }
  
  // Port interaction handlers for manual connection creation
  onPortMouseDown(portType: 'input' | 'output', portId: string, nodeId: string, event: MouseEvent): void {
    event.stopPropagation();
    
    if (portType === 'output') {
      // Start connection from output port
      this.isConnecting = true;
      this.connectingFromPort = portId;
      this.connectingFromNodeId = nodeId;
      console.log('Starting connection from:', portId, 'node:', nodeId);
      
      // Add global mouseup listener to cancel connection if released outside
      document.addEventListener('mouseup', this.handleGlobalMouseUp);
    }
  }
  
  onPortMouseUp(portType: 'input' | 'output', portId: string, nodeId: string, event: MouseEvent): void {
    event.stopPropagation();
    
    if (portType === 'input' && this.isConnecting && this.connectingFromPort && this.connectingFromNodeId) {
      // Complete connection to input port
      if (this.connectingFromNodeId !== nodeId) {
        this.createConnection(this.connectingFromPort, portId, this.connectingFromNodeId, nodeId);
      }
      this.cancelConnection();
    }
  }
  
  private handleGlobalMouseUp = (event: MouseEvent): void => {
    // Cancel connection if mouse is released outside a port
    if (this.isConnecting) {
      const target = event.target as HTMLElement;
      const isPort = target.closest('[fNodeOutput], [fNodeInput]');
      if (!isPort) {
        console.log('Connection cancelled - released outside port');
        this.cancelConnection();
      }
    }
  };
  
  cancelConnection(): void {
    this.isConnecting = false;
    this.connectingFromPort = null;
    this.connectingFromNodeId = null;
    document.removeEventListener('mouseup', this.handleGlobalMouseUp);
  }
  
  createConnection(outputId: string, inputId: string, sourceNodeId: string, targetNodeId: string): void {
    console.log('Creating connection:', { outputId, inputId, sourceNodeId, targetNodeId });
    
    // Prevent self-connections
    if (sourceNodeId === targetNodeId) {
      console.warn('Self-connection prevented');
      return;
    }
    
    // Determine sourceHandle based on output port ID
    let sourceHandle: string | undefined;
    const sourceNode = this.nodes.find(n => n.id === sourceNodeId);
    if (sourceNode?.outputIds) {
      // Condition node - determine which branch (true/false)
      if (outputId === sourceNode.outputIds.true) {
        sourceHandle = 'true';
      } else if (outputId === sourceNode.outputIds.false) {
        sourceHandle = 'false';
      }
    } else {
      // Regular node - use outputId as sourceHandle
      sourceHandle = outputId;
    }
    
    // Check if connection already exists (for condition nodes, check sourceHandle too)
    const existingEdge = this.stateService.edges().find(
      e => e.source === sourceNodeId && 
           e.target === targetNodeId && 
           (sourceHandle ? e.sourceHandle === sourceHandle : true)
    );
    
    if (existingEdge) {
      console.warn('Connection already exists');
      return;
    }
    
    const newEdge: WorkflowEdge = {
      id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      source: sourceNodeId,
      target: targetNodeId,
      sourceHandle: sourceHandle,
      targetHandle: inputId,
    };
    
    console.log('Adding edge to state:', newEdge);
    this.stateService.addEdge(newEdge);
  }
  
  // Test port click handler (kept for debugging)
  onPortClick(portType: 'input' | 'output', portId: string, event: MouseEvent): void {
    event.stopPropagation();
    // Don't prevent default - allow mousedown to handle it
  }
  
  onConnectionStart(event: any): void {
    console.log('Connection start:', event);
  }
  
  onConnectionEnd(event: any): void {
    console.log('Connection end:', event);
  }
  
  // Connection handlers (for Foblex Flow events - kept as fallback)
  onConnectionCreate(event: any): void {
    console.log('=== Foblex Flow Connection create event received ===');
    console.log('Event:', event);
    
    // Foblex Flow may emit different event structures
    // Handle both custom event objects and standard events
    let outputId: string = '';
    let inputId: string = '';
    
    // Try multiple possible event structures
    if (event) {
      // Direct object with properties
      if (typeof event === 'object' && !(event instanceof Event)) {
        outputId = event.outputId || event.sourceOutputId || event.output?.id || '';
        inputId = event.inputId || event.targetInputId || event.input?.id || '';
      }
      // CustomEvent with detail
      else if (event instanceof CustomEvent && event.detail) {
        outputId = event.detail.outputId || event.detail.sourceOutputId || event.detail.output?.id || '';
        inputId = event.detail.inputId || event.detail.targetInputId || event.detail.input?.id || '';
      }
      // Standard Event - try to get from target
      else if (event.target) {
        const target = event.target as HTMLElement;
        outputId = target.getAttribute('fOutputId') || target.getAttribute('data-output-id') || '';
        inputId = target.getAttribute('fInputId') || target.getAttribute('data-input-id') || '';
      }
    }
    
    console.log('Extracted IDs:', { outputId, inputId });
    
    if (!outputId || !inputId) {
      console.warn('Invalid connection event - missing outputId or inputId:', event);
      return;
    }
    
    const sourceNodeId = outputId.replace('output-', '');
    const targetNodeId = inputId.replace('input-', '');
    
    this.createConnection(outputId, inputId, sourceNodeId, targetNodeId);
  }
  
  onConnectionRemove(event: any): void {
    // Foblex Flow may emit different event structures
    let connectionId: string;
    
    if (event && typeof event === 'object') {
      connectionId = event.connectionId || event.id || '';
    } else {
      // If event is a standard Event, try to extract from detail
      const customEvent = event as CustomEvent;
      connectionId = customEvent.detail?.connectionId || customEvent.detail?.id || '';
    }
    
    if (!connectionId) {
      // Try to find connection by matching output/input IDs
      const outputId = event?.outputId || event?.detail?.outputId || '';
      const inputId = event?.inputId || event?.detail?.inputId || '';
      
      if (outputId && inputId) {
        const edge = this.stateService.edges().find(
          e => e.sourceHandle === outputId && e.targetHandle === inputId
        );
        if (edge) {
          connectionId = edge.id;
        }
      }
    }
    
    if (connectionId) {
      this.stateService.removeEdge(connectionId);
    } else {
      console.warn('Could not determine connection ID from event:', event);
    }
  }
  
  // Check if node has output connections
  hasOutputConnection(nodeId: string, outputId?: string): boolean {
    if (outputId) {
      // Check specific output port
      return this.stateService.edges().some(e => 
        e.source === nodeId && e.sourceHandle === outputId
      );
    }
    // Check any output connection
    return this.stateService.edges().some(e => e.source === nodeId);
  }
  
  // Check if node has input connections
  hasInputConnection(nodeId: string): boolean {
    return this.stateService.edges().some(e => e.target === nodeId);
  }
  
  // Check if connection should be animated (e.g., during execution)
  isConnectionAnimated(connectionId: string): boolean {
    // Can be enhanced to check execution state
    return false;
  }
  
  // Zoom controls
  onZoomIn(): void {
    this.zoom = Math.min(this.zoom + 0.1, 2);
    // Foblex Flow may handle zoom internally, but we track it for display
  }
  
  onZoomOut(): void {
    this.zoom = Math.max(this.zoom - 0.1, 0.5);
  }
  
  onFitView(): void {
    this.zoom = 1;
    // Foblex Flow may handle fit view internally
  }
  
  // Keyboard shortcuts for zoom
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === '=' || event.key === '+') {
        event.preventDefault();
        this.onZoomIn();
      } else if (event.key === '-') {
        event.preventDefault();
        this.onZoomOut();
      } else if (event.key === '0') {
        event.preventDefault();
        this.onFitView();
      }
    }
  }
}
