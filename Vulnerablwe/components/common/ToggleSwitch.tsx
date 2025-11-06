import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, description }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="flex-grow flex flex-col">
        <span className="text-sm font-medium text-on-surface">{label}</span>
        {description && <span className="text-xs text-on-surface-muted">{description}</span>}
      </span>
      <button
        type="button"
        className={`${
          enabled ? 'bg-primary' : 'bg-gray-600'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary`}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </button>
    </div>
  );
};
