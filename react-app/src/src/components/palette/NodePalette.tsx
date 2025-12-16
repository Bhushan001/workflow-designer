import React, { useState } from 'react';
import { Zap, Globe, GitBranch, Circle, Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { NodeType } from '../../types/workflow.types';

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const nodeTypes: Array<{ type: NodeType; icon: React.ReactNode; label: string; color: string }> = [
  { type: 'TRIGGER', icon: <Zap className="w-5 h-5" />, label: 'Trigger', color: 'text-yellow-500' },
  { type: 'API', icon: <Globe className="w-5 h-5" />, label: 'API Call', color: 'text-blue-500' },
  { type: 'CONDITION', icon: <GitBranch className="w-5 h-5" />, label: 'Condition', color: 'text-purple-500' },
  { type: 'DO_NOTHING', icon: <Circle className="w-5 h-5" />, label: 'Do Nothing', color: 'text-gray-400' },
  { type: 'CODE', icon: <Code className="w-5 h-5" />, label: 'Code', color: 'text-orange-500' },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="bg-gray-50 border-r border-gray-200 flex flex-col items-center p-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Expand Node Palette"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-gray-700 font-medium">Node Palette</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Collapse Node Palette"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className={nodeType.color}>{nodeType.icon}</div>
              <div className="text-sm text-gray-700">{nodeType.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            Click a node type to add it to the canvas at the center.
          </p>
        </div>
      </div>
    </div>
  );
}
