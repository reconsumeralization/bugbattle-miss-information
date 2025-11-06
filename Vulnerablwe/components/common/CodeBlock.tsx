import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      // You could add a user-facing error message here
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-md my-4 ${className}`}>
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-green-400" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {language && (
        <span className="absolute top-2 left-2 px-2 py-0.5 text-xs text-gray-300 bg-gray-700 rounded-sm">
          {language}
        </span>
      )}
      <pre className="p-4 pt-10 text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap break-all font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};
