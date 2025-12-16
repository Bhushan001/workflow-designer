import { CodeNodeConfig, NodeRunResult, ExecutionSnapshot } from '../../types/workflow.types';
import { mockCodeExecution } from '../../utils/mock/mockCodeRunner';

export async function runCodeNode(
  nodeId: string,
  config: CodeNodeConfig,
  snapshot: ExecutionSnapshot
): Promise<NodeRunResult> {
  try {
    if (!config.code || config.code.trim() === '') {
      throw new Error('Code is required');
    }

    // Mock code execution - does not use eval for security
    const result = await mockCodeExecution(config.code, snapshot, config.timeoutMs);

    return {
      nodeId,
      outputs: {
        result: result.result,
        inputSnapshot: result.inputSnapshot,
        executedAt: new Date().toISOString(),
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
