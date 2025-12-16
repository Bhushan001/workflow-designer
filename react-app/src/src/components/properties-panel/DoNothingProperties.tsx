import React from 'react';
import { DoNothingNodeConfig } from '../../types/workflow.types';

interface DoNothingPropertiesProps {
  config: DoNothingNodeConfig;
  onChange: (config: DoNothingNodeConfig) => void;
}

export function DoNothingProperties({ config, onChange }: DoNothingPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Note</label>
        <textarea
          value={config.note || ''}
          onChange={(e) => onChange({ ...config, note: e.target.value })}
          placeholder="Add an optional note about this node..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          rows={4}
        />
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-xs text-gray-600">
          This node performs no operation and simply passes through the workflow.
          Use it as a placeholder or for workflow organization.
        </p>
      </div>
    </div>
  );
}
