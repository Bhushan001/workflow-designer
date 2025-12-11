import { TriggerNodeConfig, NodeRunResult, ExecutionSnapshot } from '../../types/workflow.types';

export async function runTriggerNode(
  nodeId: string,
  config: TriggerNodeConfig,
  snapshot: ExecutionSnapshot
): Promise<NodeRunResult> {
  try {
    const outputs: Record<string, any> = {
      triggerType: config.triggerType,
      timestamp: new Date().toISOString(),
      triggeredBy: 'MANUAL_EXECUTION',
    };

    if (config.triggerType === 'SCHEDULE' && config.cron) {
      outputs.schedule = config.cron;
    }

    if (config.triggerType === 'WEBHOOK' && config.webhookPath) {
      outputs.webhookPath = config.webhookPath;
      outputs.mockWebhookData = {
        method: 'POST',
        body: { event: 'test_event', data: { value: 42 } },
      };
    }

    return {
      nodeId,
      outputs,
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
