import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, containerClassName = '', className = '', ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-on-surface-muted mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-on-surface ${className}`}
        {...props}
      />
    </div>
  );
};
