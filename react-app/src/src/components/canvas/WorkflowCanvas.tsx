import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../state/workflow.store';
import { TriggerNode } from '../nodes/TriggerNode';
import { ApiNode } from '../nodes/ApiNode';
import { ConditionNode } from '../nodes/ConditionNode';
import { DoNothingNode } from '../nodes/DoNothingNode';
import { CodeNode } from '../nodes/CodeNode';
import { NodeContextMenu } from './NodeContextMenu';

const nodeTypes = {
  TRIGGER: TriggerNode,
  API: ApiNode,
  CONDITION: ConditionNode,
  DO_NOTHING: DoNothingNode,
  CODE: CodeNode,
};

interface WorkflowCanvasProps {
  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
}

export function WorkflowCanvas({
  reactFlowInstance,
  setReactFlowInstance,
}: WorkflowCanvasProps) {
  const [contextMenu, setContextMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);

  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const addEdgeToStore = useWorkflowStore((state) => state.addEdge);
  const removeEdge = useWorkflowStore((state) => state.removeEdge);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const openNodeEditor = useWorkflowStore((state) => state.openNodeEditor);

  const onNodesChange = useCallback(
    (changes: any) => {
      // Handle node position changes
      changes.forEach((change: any) => {
        if (change.type === 'position' && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            updateNode({
              ...node,
              position: change.position,
            });
          }
        }
      });
    },
    [nodes, updateNode]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      // Handle edge removal
      changes.forEach((change: any) => {
        if (change.type === 'remove') {
          removeEdge(change.id);
        }
      });
    },
    [removeEdge]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
      };
      addEdgeToStore(edge);
    },
    [addEdgeToStore]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setContextMenu(null);
  }, [setSelectedNodeId]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenu({
        nodeId: node.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const handleConfigure = useCallback(() => {
    if (contextMenu) {
      setSelectedNodeId(contextMenu.nodeId);
      openNodeEditor();
    }
  }, [contextMenu, setSelectedNodeId, openNodeEditor]);

  const handleDelete = useCallback(() => {
    if (contextMenu) {
      removeNode(contextMenu.nodeId);
    }
  }, [contextMenu, removeNode]);

  // Convert workflow nodes to React Flow nodes
  const reactFlowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  }));

  // Convert workflow edges to React Flow edges
  const reactFlowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    label: edge.label,
    animated: true,
  }));

  return (
    <div className="w-full h-full" onClick={() => setContextMenu(null)}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onConfigure={handleConfigure}
          onDelete={handleDelete}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
