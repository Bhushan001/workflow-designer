import React, { useState, useCallback } from 'react';
import { useWorkflowStore } from '../../state/workflow.store';
import { WorkflowNode, NodeRunResult, ExecutionSnapshot, TriggerNodeConfig, ApiNodeConfig, ConditionNodeConfig, DoNothingNodeConfig, CodeNodeConfig } from '../../types/workflow.types';
import { TriggerProperties } from './TriggerProperties';
import { ApiProperties } from './ApiProperties';
import { ConditionProperties } from './ConditionProperties';
import { DoNothingProperties } from './DoNothingProperties';
import { CodeProperties } from './CodeProperties';
import { runTriggerNode } from '../../engine/runners/trigger';
import { runApiNode } from '../../engine/runners/api';
import { runConditionNode } from '../../engine/runners/condition';
import { runDoNothingNode } from '../../engine/runners/nothing';
import { runCodeNode } from '../../engine/runners/code';
import { Play } from 'lucide-react';

export function PropertiesPanel() {
  const [isExecutingNode, setIsExecutingNode] = useState(false);
  
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const executionResults = useWorkflowStore((state) => state.executionResults);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const setExecutionResults = useWorkflowStore((state) => state.setExecutionResults);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700">Node Configuration</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleConfigChange = (config: any) => {
    const updatedNode: WorkflowNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        config,
      },
    };
    updateNode(updatedNode);
  };

  const handleLabelChange = (label: string) => {
    const updatedNode: WorkflowNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label,
      },
    };
    updateNode(updatedNode);
  };

  const handleExecuteNode = useCallback(async () => {
    if (!selectedNode) return;

    setIsExecutingNode(true);

    try {
      // Get previous node outputs from execution results
      const previousEdge = edges.find((e) => e.target === selectedNodeId);
      const previousNodeId = previousEdge?.source;
      const previousResult = previousNodeId
        ? executionResults.find((r) => r.nodeId === previousNodeId)
        : null;

      // Create snapshot from previous node outputs
      const nodeOutputs: Record<string, Record<string, any>> = {};
      if (previousResult) {
        nodeOutputs[previousNodeId!] = previousResult.outputs;
      }

      const snapshot: ExecutionSnapshot = {
        nodeOutputs,
        runId: `single-node-${Date.now()}`,
        startTime: new Date().toISOString(),
      };

      // Execute the node based on type
      let result: NodeRunResult;
      switch (selectedNode.type) {
        case 'TRIGGER':
          result = await runTriggerNode(
            selectedNode.id,
            selectedNode.data.config as TriggerNodeConfig,
            snapshot
          );
          break;
        case 'API':
          result = await runApiNode(
            selectedNode.id,
            selectedNode.data.config as ApiNodeConfig,
            snapshot
          );
          break;
        case 'CONDITION':
          result = await runConditionNode(
            selectedNode.id,
            selectedNode.data.config as ConditionNodeConfig,
            snapshot
          );
          break;
        case 'DO_NOTHING':
          result = await runDoNothingNode(
            selectedNode.id,
            selectedNode.data.config as DoNothingNodeConfig,
            snapshot
          );
          break;
        case 'CODE':
          result = await runCodeNode(
            selectedNode.id,
            selectedNode.data.config as CodeNodeConfig,
            snapshot
          );
          break;
        default:
          result = {
            nodeId: selectedNode.id,
            outputs: {},
            status: 'failed',
            error: `Unknown node type: ${selectedNode.type}`,
            timestamp: new Date().toISOString(),
          };
      }

      // Update execution results - replace existing result for this node or add new one
      const updatedResults = executionResults.filter((r) => r.nodeId !== selectedNode.id);
      updatedResults.push(result);
      setExecutionResults(updatedResults);
    } catch (error) {
      const errorResult: NodeRunResult = {
        nodeId: selectedNode.id,
        outputs: {},
        status: 'failed',
        error: String(error),
        timestamp: new Date().toISOString(),
      };
      const updatedResults = executionResults.filter((r) => r.nodeId !== selectedNode.id);
      updatedResults.push(errorResult);
      setExecutionResults(updatedResults);
    } finally {
      setIsExecutingNode(false);
    }
  }, [selectedNode, selectedNodeId, edges, executionResults, setExecutionResults]);

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Node Configuration</h2>
      </div>
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-blue-900">{selectedNode.data.label}</p>
          <p className="text-xs text-blue-700">{selectedNode.type}</p>
        </div>
        <button
          onClick={handleExecuteNode}
          disabled={isExecutingNode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white transition-colors ${
            isExecutingNode
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          title="Execute this node"
        >
          <Play className="w-4 h-4" />
          {isExecutingNode ? 'Executing...' : 'Execute Node'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Node Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Node Type</label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
            {selectedNode.type}
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

      {selectedNode.type === 'TRIGGER' && (
        <TriggerProperties
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      )}
      {selectedNode.type === 'API' && (
        <ApiProperties
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      )}
      {selectedNode.type === 'CONDITION' && (
        <ConditionProperties
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      )}
      {selectedNode.type === 'DO_NOTHING' && (
        <DoNothingProperties
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      )}
      {selectedNode.type === 'CODE' && (
        <CodeProperties
          config={selectedNode.data.config}
          onChange={handleConfigChange}
        />
      )}
      </div>
    </div>
  );
}
