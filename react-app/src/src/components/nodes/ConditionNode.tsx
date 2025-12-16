import React from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

interface ConditionNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

export function ConditionNode({ data, selected }: ConditionNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-12 h-12 rounded-lg border-2 bg-white shadow-md flex items-center justify-center ${
          selected ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-green-500 !w-3 !h-3"
        />
        
        <GitBranch className="w-6 h-6 text-purple-500" />
        
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          className="!bg-green-500 !w-3 !h-3 !top-[35%]"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="false"
          className="!bg-red-500 !w-3 !h-3 !top-[65%]"
        />
      </div>
      <div className="mt-1 text-xs text-gray-700 font-medium max-w-[80px] text-center truncate">
        {data.label}
      </div>
    </div>
  );
}
