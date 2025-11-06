import React from 'react';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  rows?: number;
  containerClassName?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, rows = 3, containerClassName = '', className = '', ...props }) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={textareaId} className="block text-sm font-medium text-on-surface-muted mb-1">
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={`mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${className}`}
        {...props}
      />
    </div>
  );
};
