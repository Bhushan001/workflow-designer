import React, { useState } from 'react';
import { ApiNodeConfig } from '../../types/workflow.types';

interface ApiPropertiesProps {
  config: ApiNodeConfig;
  onChange: (config: ApiNodeConfig) => void;
}

export function ApiProperties({ config, onChange }: ApiPropertiesProps) {
  const [headersJson, setHeadersJson] = useState(
    JSON.stringify(config.headers || {}, null, 2)
  );
  const [queryJson, setQueryJson] = useState(
    JSON.stringify(config.query || {}, null, 2)
  );
  const [bodyJson, setBodyJson] = useState(
    JSON.stringify(config.body || {}, null, 2)
  );

  const handleHeadersChange = (value: string) => {
    setHeadersJson(value);
    try {
      const parsed = JSON.parse(value);
      onChange({ ...config, headers: parsed });
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  const handleQueryChange = (value: string) => {
    setQueryJson(value);
    try {
      const parsed = JSON.parse(value);
      onChange({ ...config, query: parsed });
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  const handleBodyChange = (value: string) => {
    setBodyJson(value);
    try {
      const parsed = JSON.parse(value);
      onChange({ ...config, body: parsed });
    } catch (e) {
      // Invalid JSON, don't update
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">URL *</label>
        <input
          type="text"
          value={config.url}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://api.example.com/data"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Method</label>
        <select
          value={config.method}
          onChange={(e) =>
            onChange({
              ...config,
              method: e.target.value as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Headers (JSON)</label>
        <textarea
          value={headersJson}
          onChange={(e) => handleHeadersChange(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Query Params (JSON)</label>
        <textarea
          value={queryJson}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder='{"page": "1", "limit": "10"}'
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Body (JSON)</label>
        <textarea
          value={bodyJson}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder='{"key": "value"}'
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Timeout (ms)</label>
        <input
          type="number"
          value={config.timeoutMs || 5000}
          onChange={(e) =>
            onChange({ ...config, timeoutMs: parseInt(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-xs text-yellow-800">
          Note: API calls are mocked and will not make real network requests.
        </p>
      </div>
    </div>
  );
}
