import { DoNothingNodeConfig, NodeRunResult, ExecutionSnapshot } from '../../types/workflow.types';

export async function runDoNothingNode(
  nodeId: string,
  config: DoNothingNodeConfig,
  snapshot: ExecutionSnapshot
): Promise<NodeRunResult> {
  try {
    return {
      nodeId,
      outputs: {
        note: config.note || 'No operation performed',
        timestamp: new Date().toISOString(),
      },
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      nodeId,
      outputs: {},
      status: 'failed',
      error: String(error),
      timestamp: new Date().toISOString(),
    };
  }
}
