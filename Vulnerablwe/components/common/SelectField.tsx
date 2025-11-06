import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, containerClassName = '', className = '', ...props }) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={selectId} className="block text-sm font-medium text-on-surface-muted mb-1">
        {label}
      </label>
      <select
        id={selectId}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-on-surface ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
