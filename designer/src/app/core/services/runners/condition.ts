import { catchError, defer, Observable, of, from } from 'rxjs';
import { ConditionNodeConfig, ExecutionSnapshot, NodeRunResult } from '../../models/workflow.types';

export function runConditionNode(
  nodeId: string,
  config: ConditionNodeConfig,
  snapshot: ExecutionSnapshot
): Observable<NodeRunResult> {
  return defer(() => {
    if (!config.expression || config.expression.trim() === '') {
      throw new Error('Condition expression is required');
    }

    try {
      // Validate syntax
      new Function('snapshot', `return ${config.expression}`);
    } catch (syntaxError) {
      throw new Error(`Invalid JS syntax: ${syntaxError}`);
    }

    const evalFunc = new Function('snapshot', `return ${config.expression}`);
    const result = evalFunc(snapshot);
    const conditionMet = Boolean(result);

    return of({
      nodeId,
      outputs: {
        expression: config.expression,
        result: conditionMet,
        branch: conditionMet ? 'true' : 'false',
        evaluatedAt: new Date().toISOString()
      },
      status: 'success',
      timestamp: new Date().toISOString()
    } as NodeRunResult);
  }).pipe(
    catchError((error): Observable<NodeRunResult> =>
      of({
        nodeId,
        outputs: {},
        status: 'failed',
        error: String(error),
        timestamp: new Date().toISOString()
      })
    )
  );
}

