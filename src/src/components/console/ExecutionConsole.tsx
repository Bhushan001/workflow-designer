import React, { useEffect, useRef } from 'react';
import { useWorkflowStore } from '../../state/workflow.store';
import { Terminal } from 'lucide-react';

export function ExecutionConsole() {
  const executionLogs = useWorkflowStore((state) => state.executionLogs);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [executionLogs]);

  return (
    <div className="h-48 bg-gray-900 border-t border-gray-700 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm text-gray-300">Execution Console</span>
      </div>
      
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300"
      >
        {executionLogs.length === 0 ? (
          <div className="text-gray-500">No execution logs yet. Click Execute to run the workflow.</div>
        ) : (
          executionLogs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
