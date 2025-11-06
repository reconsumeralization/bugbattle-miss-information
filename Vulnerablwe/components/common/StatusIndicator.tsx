import React from 'react';

export interface StatusIndicatorProps { // Added export here
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Active' | 'Inactive' | 'Running' | 'Idle' | 'Success' | 'Failure' | 'Warning';
  text?: string;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, text, size = 'md' }) => {
  const statusColors: Record<typeof status, string> = {
    'Compliant': 'bg-green-500',
    'Active': 'bg-green-500',
    'Running': 'bg-blue-500 animate-pulse-fast',
    'Success': 'bg-green-500',
    'Non-Compliant': 'bg-red-500',
    'Failure': 'bg-red-500',
    'Pending': 'bg-yellow-500',
    'Warning': 'bg-yellow-500',
    'Inactive': 'bg-gray-500',
    'Idle': 'bg-gray-500',
  };

  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center">
      <span className={`${dotSize} ${statusColors[status]} rounded-full mr-2`}></span>
      <span className={`${textSize} text-on-surface-muted`}>{text || status}</span>
    </div>
  );
};