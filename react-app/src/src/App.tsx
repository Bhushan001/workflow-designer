import React, { useCallback, useState } from 'react';
import { ReactFlowProvider, ReactFlowInstance } from 'reactflow';
import { useWorkflowStore } from './state/workflow.store';
import { NodePalette } from './components/palette/NodePalette';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { PropertiesPanel } from './components/properties-panel/PropertiesPanel';
import { Toolbar } from './components/toolbar/Toolbar';
import { PreviousNodeResponse } from './components/node-editor/PreviousNodeResponse';
import { CurrentNodeResponse } from './components/node-editor/CurrentNodeResponse';
import { ExecutionEngine } from './engine/execution-engine';
import {
  NodeType,
  WorkflowNode,
  TriggerNodeConfig,
  ApiNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  CodeNodeConfig,
} from './types/workflow.types';

function App() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const setWorkflowName = useWorkflowStore((state) => state.setWorkflowName);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const addNode = useWorkflowStore((state) => state.addNode);
  const newWorkflow = useWorkflowStore((state) => state.newWorkflow);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  const exportWorkflow = useWorkflowStore((state) => state.exportWorkflow);
  const setExecutionResults = useWorkflowStore((state) => state.setExecutionResults);
  const addExecutionLog = useWorkflowStore((state) => state.addExecutionLog);
  const clearExecutionLogs = useWorkflowStore((state) => state.clearExecutionLogs);
  const isExecuting = useWorkflowStore((state) => state.isExecuting);
  const setIsExecuting = useWorkflowStore((state) => state.setIsExecuting);
  const isNodeEditorOpen = useWorkflowStore((state) => state.isNodeEditorOpen);
  const closeNodeEditor = useWorkflowStore((state) => state.closeNodeEditor);

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const nodeId = `${type.toLowerCase()}-${Date.now()}`;
      
      // Default configs for each node type
      const defaultConfigs: Record<NodeType, any> = {
        TRIGGER: { triggerType: 'MANUAL' } as TriggerNodeConfig,
        API: { url: '', method: 'GET' } as ApiNodeConfig,
        CONDITION: { expression: 'true' } as ConditionNodeConfig,
        DO_NOTHING: { note: '' } as DoNothingNodeConfig,
        CODE: { code: '// Your code here', timeoutMs: 1000 } as CodeNodeConfig,
      };

      const newNode: WorkflowNode = {
        id: nodeId,
        type,
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 100,
        },
        data: {
          label: `${type} Node`,
          config: defaultConfigs[type],
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleNewWorkflow = useCallback(() => {
    if (confirm('Create a new workflow? Unsaved changes will be lost.')) {
      newWorkflow();
      clearExecutionLogs();
    }
  }, [newWorkflow, clearExecutionLogs]);

  const handleSaveWorkflow = useCallback(() => {
    const workflow = exportWorkflow();
    localStorage.setItem('workflow', JSON.stringify(workflow));
    addExecutionLog(`[${new Date().toLocaleTimeString()}] Workflow saved to localStorage`);
    alert('Workflow saved successfully!');
  }, [exportWorkflow, addExecutionLog]);

  const handleLoadWorkflow = useCallback(() => {
    const saved = localStorage.getItem('workflow');
    if (saved) {
      try {
        const workflow = JSON.parse(saved);
        loadWorkflow(workflow);
        addExecutionLog(`[${new Date().toLocaleTimeString()}] Workflow loaded from localStorage`);
        alert('Workflow loaded successfully!');
      } catch (error) {
        alert('Failed to load workflow: ' + error);
      }
    } else {
      alert('No saved workflow found in localStorage');
    }
  }, [loadWorkflow, addExecutionLog]);

  const handleExecute = useCallback(async () => {
    clearExecutionLogs();
    setIsExecuting(true);
    addExecutionLog(`[${new Date().toLocaleTimeString()}] ========== EXECUTION START ==========`);
    addExecutionLog(`[${new Date().toLocaleTimeString()}] Nodes: ${nodes.length}, Edges: ${edges.length}`);

    try {
      const engine = new ExecutionEngine();
      const result = await engine.execute(nodes, edges);

      addExecutionLog(`[${new Date().toLocaleTimeString()}] Run ID: ${result.runId}`);
      
      result.results.forEach((nodeResult) => {
        const time = new Date(nodeResult.timestamp).toLocaleTimeString();
        const status = nodeResult.status.toUpperCase();
        const icon = nodeResult.status === 'success' ? '✓' : nodeResult.status === 'failed' ? '✗' : '⊘';
        
        addExecutionLog(`[${time}] ${icon} ${nodeResult.nodeId} - ${status}`);
        
        if (nodeResult.error) {
          addExecutionLog(`[${time}]   ERROR: ${nodeResult.error}`);
        } else if (Object.keys(nodeResult.outputs).length > 0) {
          addExecutionLog(`[${time}]   OUTPUT: ${JSON.stringify(nodeResult.outputs, null, 2)}`);
        }
      });

      setExecutionResults(result.results);
      addExecutionLog(`[${new Date().toLocaleTimeString()}] ========== EXECUTION COMPLETE ==========`);
    } catch (error) {
      addExecutionLog(`[${new Date().toLocaleTimeString()}] ✗ EXECUTION FAILED: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, setExecutionResults, addExecutionLog, clearExecutionLogs, setIsExecuting]);

  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut();
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView();
  }, [reactFlowInstance]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative">
      {!isNodeEditorOpen ? (
        <>
          <Toolbar
            workflowName={workflowName}
            onNewWorkflow={handleNewWorkflow}
            onSaveWorkflow={handleSaveWorkflow}
            onLoadWorkflow={handleLoadWorkflow}
            onExecute={handleExecute}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
            onWorkflowNameChange={setWorkflowName}
            isExecuting={isExecuting}
          />
          
          {/* Canvas Area */}
          <div className="flex-1 flex overflow-hidden">
            <NodePalette onAddNode={handleAddNode} />
            
            <ReactFlowProvider>
              <div className="flex-1 bg-white">
                <WorkflowCanvas
                  reactFlowInstance={reactFlowInstance}
                  setReactFlowInstance={setReactFlowInstance}
                />
              </div>
            </ReactFlowProvider>
          </div>
        </>
      ) : (
        <>
          {/* Node Editor - Full Screen 3 Column Layout */}
          <div className="h-screen w-screen flex bg-white relative">
            <button
              onClick={closeNodeEditor}
              className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-md"
              title="Close Node Editor"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <PreviousNodeResponse />
            <PropertiesPanel />
            <CurrentNodeResponse />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
