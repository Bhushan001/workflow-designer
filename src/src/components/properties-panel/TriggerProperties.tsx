import React from 'react';
import { TriggerNodeConfig } from '../../types/workflow.types';

interface TriggerPropertiesProps {
  config: TriggerNodeConfig;
  onChange: (config: TriggerNodeConfig) => void;
}

export function TriggerProperties({ config, onChange }: TriggerPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Trigger Type</label>
        <select
          value={config.triggerType}
          onChange={(e) =>
            onChange({
              ...config,
              triggerType: e.target.value as 'MANUAL' | 'SCHEDULE' | 'WEBHOOK',
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="MANUAL">Manual</option>
          <option value="SCHEDULE">Schedule</option>
          <option value="WEBHOOK">Webhook</option>
        </select>
      </div>

      {config.triggerType === 'SCHEDULE' && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cron Expression</label>
          <input
            type="text"
            value={config.cron || ''}
            onChange={(e) => onChange({ ...config, cron: e.target.value })}
            placeholder="0 0 * * *"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Example: 0 0 * * * (daily at midnight)</p>
        </div>
      )}

      {config.triggerType === 'WEBHOOK' && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Webhook Path</label>
          <input
            type="text"
            value={config.webhookPath || ''}
            onChange={(e) => onChange({ ...config, webhookPath: e.target.value })}
            placeholder="/webhook/my-workflow"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      )}
    </div>
  );
}
