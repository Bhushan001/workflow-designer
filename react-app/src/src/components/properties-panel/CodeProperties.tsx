import React from 'react';
import { CodeNodeConfig } from '../../types/workflow.types';

interface CodePropertiesProps {
  config: CodeNodeConfig;
  onChange: (config: CodeNodeConfig) => void;
}

export function CodeProperties({ config, onChange }: CodePropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Code *</label>
        <textarea
          value={config.code}
          onChange={(e) => onChange({ ...config, code: e.target.value })}
          placeholder="// Your code here&#10;const result = snapshot.nodeOutputs;&#10;return result;"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          rows={10}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Timeout (ms)</label>
        <input
          type="number"
          value={config.timeoutMs || 1000}
          onChange={(e) =>
            onChange({ ...config, timeoutMs: parseInt(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-yellow-800">
          Note: Code execution is mocked for security. Real execution would use a sandboxed iframe or web worker.
        </p>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          Access previous node outputs via <code className="bg-white px-1 rounded">snapshot</code> parameter.
        </p>
      </div>
    </div>
  );
}
