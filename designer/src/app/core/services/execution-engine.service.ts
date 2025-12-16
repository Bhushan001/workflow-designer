import { Injectable } from '@angular/core';
import {
  HttpNodeConfig,
  CodeNodeConfig,
  ConditionNodeConfig,
  DoNothingNodeConfig,
  ExecutionResult,
  NodeRunResult,
  TriggerNodeConfig,
  WorkflowEdge,
  WorkflowNode
} from '../models/workflow.types';
import { ExecutionContext } from './execution-context';
import { topologicalSort } from '../utils/topological-sort';
import { runTriggerNode } from './runners/trigger';
import { runHttpNode } from './runners/http-post';
import { runConditionNode } from './runners/condition';
import { runDoNothingNode } from './runners/nothing';
import { runCodeNode } from './runners/code';
import {
  concatMap,
  defer,
  from,
  map,
  Observable,
  of,
  takeWhile,
  tap,
  toArray
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExecutionEngineService {
  execute(nodes: WorkflowNode[], edges: WorkflowEdge[]): Observable<ExecutionResult> {
    return defer(() => {
      const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const context = new ExecutionContext(runId);
      const validationError = this.validateWorkflow(nodes);
      if (validationError) {
        throw new Error(validationError);
      }

      const { sorted, hasCycle } = topologicalSort(nodes, edges);
      if (hasCycle) {
        throw new Error('Cycle detected in workflow graph');
      }

      const triggerNode = sorted.find((n: WorkflowNode) => n.type === 'TRIGGER');
      if (!triggerNode) {
        throw new Error('No trigger node found');
      }

      return from(sorted).pipe(
        concatMap(node => {
          const snapshot = context.snapshot();
          const shouldExecute = this.shouldExecuteNode(node, edges, context);

          if (!shouldExecute) {
            const skipped: NodeRunResult = {
              nodeId: node.id,
              outputs: {},
              status: 'skipped',
              timestamp: new Date().toISOString()
            };
            context.addNodeResult(skipped);
            return of(skipped);
          }

          let runner$: Observable<NodeRunResult>;
          switch (node.type) {
            case 'TRIGGER':
              runner$ = runTriggerNode(node.id, node.data.config as TriggerNodeConfig, snapshot);
              break;
            case 'CIBIL':
            case 'CRIF':
            case 'EXPERIAN':
            case 'EQUIFIX':
              runner$ = runHttpNode(node.id, node.data.config as HttpNodeConfig, snapshot);
              break;
            case 'CONDITION':
              runner$ = runConditionNode(node.id, node.data.config as ConditionNodeConfig, snapshot);
              break;
            case 'DO_NOTHING':
              runner$ = runDoNothingNode(node.id, node.data.config as DoNothingNodeConfig, snapshot);
              break;
            case 'CODE':
              runner$ = runCodeNode(node.id, node.data.config as CodeNodeConfig, snapshot);
              break;
            default:
              runner$ = of({
                nodeId: node.id,
                outputs: {},
                status: 'failed',
                error: `Unknown node type: ${node.type}`,
                timestamp: new Date().toISOString()
              });
          }

          return runner$.pipe(
            tap((result: NodeRunResult) => context.addNodeResult(result)),
            takeWhile((result: NodeRunResult) => result.status !== 'failed', true) // include failing result then stop
          );
        }),
        toArray(),
        map(results => ({
          runId,
          results
        }))
      );
    });
  }

  private shouldExecuteNode(
    node: WorkflowNode,
    edges: WorkflowEdge[],
    context: ExecutionContext
  ): boolean {
    const incomingEdges = edges.filter(e => e.target === node.id);
    if (incomingEdges.length === 0) return true;

    for (const edge of incomingEdges) {
      const sourceOutputs = context.nodeOutputs[edge.source];
      if (!sourceOutputs) return false;

      if (Object.prototype.hasOwnProperty.call(sourceOutputs, 'branch')) {
        const expectedBranch = edge.sourceHandle ?? 'true';
        if ((sourceOutputs as Record<string, unknown>)['branch'] !== expectedBranch) {
          return false;
        }
      }
    }

    return true;
  }

  private validateWorkflow(nodes: WorkflowNode[]): string | null {
    const triggerNodes = nodes.filter((n: WorkflowNode) => n.type === 'TRIGGER');
    if (triggerNodes.length === 0) {
      return 'Workflow must have at least one Trigger node';
    }

    for (const node of nodes) {
      if (node.type === 'CIBIL' || node.type === 'CRIF' || node.type === 'EXPERIAN' || node.type === 'EQUIFIX') {
        const config = node.data.config as HttpNodeConfig;
        if (!config.url || config.url.trim() === '') {
          return `${node.type} node ${node.id} must have a URL`;
        }
      }
    }

    for (const node of nodes) {
      if (node.type === 'CONDITION') {
        const config = node.data.config as ConditionNodeConfig;
        if (!config.expression || config.expression.trim() === '') {
          return `Condition node ${node.id} must have an expression`;
        }
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

