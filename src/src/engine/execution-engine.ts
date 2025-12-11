import {
  WorkflowNode,
  WorkflowEdge,
  NodeRunResult,
  ExecutionResult,
  TriggerNodeConfig,
  ApiNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  CodeNodeConfig,
} from '../types/workflow.types';
import { ExecutionContext } from './context';
import { topologicalSort } from '../utils/topologicalSort';
import { runTriggerNode } from './runners/trigger';
import { runApiNode } from './runners/api';
import { runConditionNode } from './runners/condition';
import { runDoNothingNode } from './runners/nothing';
import { runCodeNode } from './runners/code';

export class ExecutionEngine {
  async execute(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[]
  ): Promise<ExecutionResult> {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const context = new ExecutionContext(runId);
    const results: NodeRunResult[] = [];

    // Validation
    const validationError = this.validateWorkflow(nodes);
    if (validationError) {
      throw new Error(validationError);
    }

    // Topological sort
    const { sorted, hasCycle } = topologicalSort(nodes, edges);
    if (hasCycle) {
      throw new Error('Cycle detected in workflow graph');
    }

    // Find trigger node to start execution
    const triggerNode = sorted.find(n => n.type === 'TRIGGER');
    if (!triggerNode) {
      throw new Error('No trigger node found');
    }

    // Execute nodes in topological order
    for (const node of sorted) {
      const snapshot = context.snapshot();
      let result: NodeRunResult;

      // Check if this node should be executed based on condition branches
      const shouldExecute = this.shouldExecuteNode(node, edges, context);
      
      if (!shouldExecute) {
        result = {
          nodeId: node.id,
          outputs: {},
          status: 'skipped',
          timestamp: new Date().toISOString(),
        };
        results.push(result);
        continue;
      }

      // Execute based on node type
      switch (node.type) {
        case 'TRIGGER':
          result = await runTriggerNode(
            node.id,
            node.data.config as TriggerNodeConfig,
            snapshot
          );
          break;
        case 'API':
          result = await runApiNode(
            node.id,
            node.data.config as ApiNodeConfig,
            snapshot
          );
          break;
        case 'CONDITION':
          result = await runConditionNode(
            node.id,
            node.data.config as ConditionNodeConfig,
            snapshot
          );
          break;
        case 'DO_NOTHING':
          result = await runDoNothingNode(
            node.id,
            node.data.config as DoNothingNodeConfig,
            snapshot
          );
          break;
        case 'CODE':
          result = await runCodeNode(
            node.id,
            node.data.config as CodeNodeConfig,
            snapshot
          );
          break;
        default:
          result = {
            nodeId: node.id,
            outputs: {},
            status: 'failed',
            error: `Unknown node type: ${node.type}`,
            timestamp: new Date().toISOString(),
          };
      }

      context.addNodeResult(result);
      results.push(result);

      // Halt execution on failure
      if (result.status === 'failed') {
        break;
      }
    }

    return {
      runId,
      results,
    };
  }

  private shouldExecuteNode(
    node: WorkflowNode,
    edges: WorkflowEdge[],
    context: ExecutionContext
  ): boolean {
    // Find incoming edges
    const incomingEdges = edges.filter(e => e.target === node.id);
    
    // If no incoming edges, always execute (e.g., trigger node)
    if (incomingEdges.length === 0) {
      return true;
    }

    // Check if any parent is a condition node
    for (const edge of incomingEdges) {
      const sourceNodeOutputs = context.nodeOutputs[edge.source];
      
      // If parent hasn't executed yet, skip this node
      if (!sourceNodeOutputs) {
        return false;
      }

      // If parent is a condition node, check the branch
      if (sourceNodeOutputs.branch !== undefined) {
        const expectedBranch = edge.sourceHandle || 'true';
        if (sourceNodeOutputs.branch !== expectedBranch) {
          return false;
        }
      }
    }

    return true;
  }

  private validateWorkflow(nodes: WorkflowNode[]): string | null {
    // Check for at least one trigger
    const triggerNodes = nodes.filter(n => n.type === 'TRIGGER');
    if (triggerNodes.length === 0) {
      return 'Workflow must have at least one Trigger node';
    }

    // Validate API nodes
    for (const node of nodes) {
      if (node.type === 'API') {
        const config = node.data.config as ApiNodeConfig;
        if (!config.url || config.url.trim() === '') {
          return `API node ${node.id} must have a URL`;
        }
      }
    }

    // Validate condition nodes
    for (const node of nodes) {
      if (node.type === 'CONDITION') {
        const config = node.data.config as ConditionNodeConfig;
        if (!config.expression || config.expression.trim() === '') {
          return `Condition node ${node.id} must have an expression`;
        }
        
        // Validate JS syntax
        try {
          new Function('snapshot', `return ${config.expression}`);
        } catch (error) {
          return `Condition node ${node.id} has invalid JS syntax: ${error}`;
        }
      }
    }

    return null;
  }
}
