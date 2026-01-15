import { Observable, of, delay, map } from 'rxjs';
import { ExecutionSnapshot } from '../../models/workflow.types';

// Mock code execution returning an observable; does NOT evaluate user code.
export function mockCodeExecution(
  code: string,
  snapshot: ExecutionSnapshot,
  timeoutMs?: number
): Observable<{ result: string; inputSnapshot: ExecutionSnapshot }> {
  const delayMs = Math.min(timeoutMs ?? 1000, 100);
  return of(null).pipe(
    delay(delayMs),
    map(() => ({
      result: 'mock-code-execution',
      inputSnapshot: snapshot
    }))
  );
}

