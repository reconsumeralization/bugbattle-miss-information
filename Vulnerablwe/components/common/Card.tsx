import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-surface shadow-lg rounded-lg overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-4 sm:px-6 flex justify-between items-center border-b border-gray-700">
          {title && <h3 className="text-lg leading-6 font-medium text-on-surface">{title}</h3>}
          {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};
