import React from 'react';
import { ConditionNodeConfig } from '../../types/workflow.types';

interface ConditionPropertiesProps {
  config: ConditionNodeConfig;
  onChange: (config: ConditionNodeConfig) => void;
}

export function ConditionProperties({ config, onChange }: ConditionPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          JavaScript Expression *
        </label>
        <textarea
          value={config.expression}
          onChange={(e) => onChange({ ...config, expression: e.target.value })}
          placeholder="snapshot.nodeOutputs['node-id']?.value > 10"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          Use <code className="bg-gray-100 px-1 rounded">snapshot</code> to access previous node outputs
        </p>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800 mb-2">Examples:</p>
        <code className="block text-xs bg-white p-2 rounded mb-1">
          snapshot.nodeOutputs['trigger-1']?.value &gt; 50
        </code>
        <code className="block text-xs bg-white p-2 rounded">
          true
        </code>
      </div>

      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-xs text-green-800">
          The condition node has two output handles: <strong>green (true)</strong> and <strong>red (false)</strong>. Connect to the appropriate branch.
        </p>
      </div>
    </div>
  );
}
