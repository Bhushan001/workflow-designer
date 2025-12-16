import { ConditionNodeConfig, NodeRunResult, ExecutionSnapshot } from '../../types/workflow.types';

export async function runConditionNode(
  nodeId: string,
  config: ConditionNodeConfig,
  snapshot: ExecutionSnapshot
): Promise<NodeRunResult> {
  try {
    if (!config.expression || config.expression.trim() === '') {
      throw new Error('Condition expression is required');
    }

    // Validate JS syntax by attempting to create a function
    try {
      new Function('snapshot', `return ${config.expression}`);
    } catch (syntaxError) {
      throw new Error(`Invalid JS syntax: ${syntaxError}`);
    }

    // Evaluate the expression against the snapshot
    const evalFunc = new Function('snapshot', `return ${config.expression}`);
    const result = evalFunc(snapshot);
    const conditionMet = Boolean(result);

    return {
      nodeId,
      outputs: {
        expression: config.expression,
        result: conditionMet,
        branch: conditionMet ? 'true' : 'false',
        evaluatedAt: new Date().toISOString(),
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
