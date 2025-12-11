import { ApiNodeConfig } from '../../types/workflow.types';

export async function mockApiCall(config: ApiNodeConfig): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Generate mock response based on method
  const mockData: Record<string, any> = {
    GET: { success: true, value: 42, items: [1, 2, 3], timestamp: new Date().toISOString() },
    POST: { success: true, id: 'mock-id-12345', created: true },
    PUT: { success: true, updated: true },
    PATCH: { success: true, patched: true },
    DELETE: { success: true, deleted: true },
  };

  return {
    status: 200,
    statusText: 'OK',
    message: 'Mock API response',
    data: mockData[config.method] || { success: true },
    headers: {
      'content-type': 'application/json',
      'x-mock': 'true',
    },
  };
}
