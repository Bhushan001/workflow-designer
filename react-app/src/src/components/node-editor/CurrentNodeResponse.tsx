import React from 'react';
import { useWorkflowStore } from '../../state/workflow.store';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { generateSchema, convertToTable } from '../../utils/dataViewer';

export function CurrentNodeResponse() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const executionResults = useWorkflowStore((state) => state.executionResults);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  // Find execution result for current node
  const currentResult = selectedNodeId
    ? executionResults.find((r) => r.nodeId === selectedNodeId)
    : null;

  if (!selectedNodeId || !selectedNode) {
    return (
      <div className="flex-1 h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Current Node Response</span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">Select a node to view its execution response</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Current Node Response</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </div>
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <p className="text-xs font-medium text-blue-900">{selectedNode.data.label}</p>
        <p className="text-xs text-blue-700">{selectedNode.type}</p>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {!currentResult ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-sm text-gray-500">
              No execution result available. Run the workflow to see this node's output.
            </p>
          </div>
        ) : currentResult.status === 'failed' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-600">Execution Failed</div>
              {currentResult.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 font-mono">
                  {currentResult.error}
                </div>
              )}
            </div>
          </div>
        ) : currentResult.status === 'skipped' ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-sm text-gray-500">This node was skipped during execution</p>
          </div>
        ) : (
          <Tabs defaultValue="json" className="flex-1 flex flex-col h-full">
            <div className="px-4 pt-3 border-b border-gray-200 flex items-center justify-between">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                <TabsTrigger value="schema" className="px-3 py-1.5 text-xs">Schema</TabsTrigger>
                <TabsTrigger value="json" className="px-3 py-1.5 text-xs">JSON</TabsTrigger>
                <TabsTrigger value="table" className="px-3 py-1.5 text-xs">Table</TabsTrigger>
              </TabsList>
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {currentResult.status.toUpperCase()}
              </div>
            </div>
            
            <TabsContent value="schema" className="flex-1 overflow-y-auto p-4 mt-0">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Data Schema:</div>
                <div className="border border-gray-200 rounded">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">Key</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">Type</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">Path</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateSchema(currentResult.outputs).map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono text-gray-800">{item.key}</td>
                          <td className="px-3 py-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-500 font-mono">{item.path}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="json" className="flex-1 overflow-y-auto p-4 mt-0">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Output Data:</div>
                <pre className="p-3 bg-gray-50 border border-gray-200 rounded text-xs font-mono overflow-x-auto">
                  {JSON.stringify(currentResult.outputs, null, 2)}
                </pre>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Executed at: {new Date(currentResult.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="table" className="flex-1 overflow-y-auto p-4 mt-0">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Table View:</div>
                {(() => {
                  const { columns, rows } = convertToTable(currentResult.outputs);
                  if (columns.length === 0) {
                    return <div className="text-sm text-gray-500">No table data available</div>;
                  }
                  return (
                    <div className="border border-gray-200 rounded overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            {columns.map((col, idx) => (
                              <th
                                key={idx}
                                className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-3 py-2 text-gray-800">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

