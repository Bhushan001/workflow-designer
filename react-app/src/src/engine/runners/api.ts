import { ApiNodeConfig, NodeRunResult, ExecutionSnapshot } from '../../types/workflow.types';
import { mockApiCall } from '../../utils/mock/mockApi';

export async function runApiNode(
  nodeId: string,
  config: ApiNodeConfig,
  snapshot: ExecutionSnapshot
): Promise<NodeRunResult> {
  try {
    if (!config.url || config.url.trim() === '') {
      throw new Error('API URL is required');
    }

    // Mock API call - does not make real network requests
    const mockResponse = await mockApiCall(config);

    return {
      nodeId,
      outputs: {
        mock: true,
        request: {
          url: config.url,
          method: config.method,
          headers: config.headers,
          query: config.query,
          body: config.body,
        },
        response: mockResponse,
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
