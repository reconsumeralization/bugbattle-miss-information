import React from 'react';

interface LogViewerProps {
  logs: string[];
  title?: string;
  maxHeight?: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, title = "Logs", maxHeight = "300px" }) => {
  return (
    <div className="mt-4">
      {title && <h4 className="text-md font-semibold text-on-surface-muted mb-2">{title}</h4>}
      <div 
        className="bg-gray-900 p-3 rounded-md border border-gray-700 overflow-y-auto text-sm font-mono"
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs to display.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap break-all">
              <span className="text-gray-500 mr-2">{`[${new Date().toLocaleTimeString()}]`}</span>
              <span className="text-gray-300">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
