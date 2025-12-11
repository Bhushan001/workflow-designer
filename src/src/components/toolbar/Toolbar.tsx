import React from 'react';
import {
  FileText,
  Save,
  FolderOpen,
  Play,
  ZoomIn,
  ZoomOut,
  Maximize,
} from 'lucide-react';

interface ToolbarProps {
  workflowName: string;
  onNewWorkflow: () => void;
  onSaveWorkflow: () => void;
  onLoadWorkflow: () => void;
  onExecute: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onWorkflowNameChange: (name: string) => void;
  isExecuting: boolean;
}

export function Toolbar({
  workflowName,
  onNewWorkflow,
  onSaveWorkflow,
  onLoadWorkflow,
  onExecute,
  onZoomIn,
  onZoomOut,
  onFitView,
  onWorkflowNameChange,
  isExecuting,
}: ToolbarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewWorkflow}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <FileText className="w-4 h-4" />
          New
        </button>

        <button
          onClick={onSaveWorkflow}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          onClick={onLoadWorkflow}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <FolderOpen className="w-4 h-4" />
          Load
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onExecute}
          disabled={isExecuting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white ${
            isExecuting
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <Play className="w-4 h-4" />
          {isExecuting ? 'Executing...' : 'Execute'}
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onZoomIn}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onFitView}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
        >
          <Maximize className="w-4 h-4" />
          Fit
        </button>
      </div>
    </div>
  );
}
