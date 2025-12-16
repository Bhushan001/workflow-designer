import { ExecutionSnapshot } from '../../types/workflow.types';

export async function mockCodeExecution(
  code: string,
  snapshot: ExecutionSnapshot,
  timeoutMs?: number
): Promise<{ result: string; inputSnapshot: ExecutionSnapshot }> {
  // Simulate execution delay
  const delay = Math.min(timeoutMs || 1000, 100);
  await new Promise(resolve => setTimeout(resolve, delay));

  // Mock execution - do NOT use eval for security
  // In a real implementation, this would use a sandboxed iframe or web worker
  return {
    result: 'mock-code-execution',
    inputSnapshot: snapshot,
  };
}
