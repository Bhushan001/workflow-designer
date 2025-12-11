import React from 'react';
import { Settings, Trash2 } from 'lucide-react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  onConfigure: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function NodeContextMenu({
  x,
  y,
  nodeId,
  onConfigure,
  onDelete,
  onClose,
}: NodeContextMenuProps) {
  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[160px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onConfigure();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Configure
      </button>
      <div className="h-px bg-gray-200 my-1" />
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}

