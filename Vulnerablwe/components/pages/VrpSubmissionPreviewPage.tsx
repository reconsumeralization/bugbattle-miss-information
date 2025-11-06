
import React from 'react';
import { Card } from '../common/Card';
import { DEFINITIVE_VRP_SUBMISSION_TEXT } from '../../constants/vrp_submission.constants';
import { CodeBlock } from '../common/CodeBlock';

const VrpSubmissionPreviewPage: React.FC = () => {

  const renderVrpContent = (text: string) => {
    // Split by code blocks first to handle them separately
    const parts = text.split(/(\`\`\`(?:python|bash|json|text|html)?\n[\s\S]*?\n\`\`\`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```python')) {
        const codeContent = part.replace(/^```python\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="python" className="my-4"/>;
      } else if (part.startsWith('```bash')) {
        const codeContent = part.replace(/^```bash\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="bash" className="my-4"/>;
      } else if (part.startsWith('```json')) {
        const codeContent = part.replace(/^```json\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="json" className="my-4"/>;
      } else if (part.startsWith('```html')) {
        const codeContent = part.replace(/^```html\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="html" className="my-4"/>;
      } else if (part.startsWith('```')) { // Generic code block
        const codeContent = part.replace(/^```(?:text)?\n?|\n?```$/g, '');
        return <CodeBlock key={index} code={codeContent} language="text" className="my-4"/>;
      }

      // Process non-code parts for basic Markdown-like formatting
      if (part.trim() === '') return null;

      return part.split('\\n').map((line, lineIndex) => {
        const key = `line-${index}-${lineIndex}`;
        if (line.startsWith('**To:**') || line.startsWith('**From:**') || line.startsWith('**Subject:**')) {
          return <p key={key} className="text-on-surface mb-0.5">{line}</p>;
        }
        // More specific title handling
        if (line.match(/^I\. /) || line.match(/^II\. /) || line.match(/^III\. /) || line.match(/^IV\. /) || line.match(/^V\. /)) {
            return <h2 key={key} className="text-2xl font-semibold text-primary-light mt-6 mb-3 border-b border-gray-700 pb-1">{line}</h2>;
        }
        if (line.match(/^[A-Z]\. Features of the Toolkit/) || line.match(/^[A-Z]\. Prerequisites/) || line.match(/^[A-Z]\. The Python Script/) || line.match(/^[A-Z]\. How to Use/)) {
            return <h3 key={key} className="text-xl font-semibold text-on-surface mt-4 mb-2">{line}</h3>;
        }
        if (line.startsWith('### ')) { // Markdown H3
          return <h3 key={key} className="text-xl font-semibold text-on-surface mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) { // Markdown H2
          return <h2 key={key} className="text-2xl font-semibold text-primary-light my-4">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) { // Markdown H1 (might not be used much in body)
          return <h1 key={key} className="text-3xl font-bold text-primary my-5">{line.substring(2)}</h1>;
        }
        if (line.startsWith('> ')) { // Blockquote
            return (
                <blockquote key={key} className="my-2 pl-4 border-l-4 border-gray-500 italic text-on-surface-muted">
                    {line.substring(2)}
                </blockquote>
            );
        }
        if (line.startsWith('---')) { // Horizontal Rule
            return <hr key={key} className="my-6 border-gray-600" />;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={key} className="font-sans text-sm text-on-surface-muted whitespace-pre-wrap leading-relaxed mb-2"><strong>{line.slice(2, -2)}</strong></p>;
        }
         if (line.startsWith('* ') && !(line.startsWith('* **Scope & Reward:**') || line.startsWith('* **Fix Prioritisation:**') || line.startsWith('* **Report Clarity:**'))) { // general list item, avoiding specific bolded list items
          return <li key={key} className="ml-6 list-disc text-sm text-on-surface-muted">{line.substring(2)}</li>;
        }
        if (line.startsWith('* **')) { // Bolded list item (for Appendix C distinction points)
             return <li key={key} className="ml-6 list-disc text-sm text-on-surface-muted"><strong className="text-on-surface">{line.substring(2, line.indexOf('**', 2) + 2)}</strong>{line.substring(line.indexOf('**', 2) + 2)}</li>;
        }
        if (line.startsWith('  - ')) {
          return <li key={key} className="ml-8 list-disc text-xs text-on-surface-muted">{line.substring(4)}</li>;
        }
         if (line.startsWith('| :---')) return null; // Skip table header separator for this basic renderer
        if (line.startsWith('| ')) { // Basic table row
          const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
          // Check if this is a header row (e.g., contains '**')
          const isHeaderRow = cells.some(cell => cell.includes('**') || cell.includes('Detail') || cell.includes('Why It Was Truly Surprising'));

          return (
            <tr key={key} className={`border-b border-gray-700 hover:bg-gray-700/30 text-xs ${isHeaderRow ? 'bg-gray-700/50 font-semibold' : ''}`}>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-1.5 align-top" dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/<br>/g, '<br />') }}></td>
              ))}
            </tr>
          );
        }
        if (line.trim() === '') return <div key={key} className="my-2"></div>; // Preserve paragraph breaks
        
        return (
           <p key={key} className="font-sans text-sm text-on-surface-muted whitespace-pre-wrap leading-relaxed mb-2">{line}</p>
        );
      });
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <header className="text-center border-b border-gray-700 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Vulnerability Reward Program (VRP) Submission Preview
        </h1>
        <p className="text-lg text-on-surface-muted mt-2">
          This page previews the consolidated VRP submission document, including the definitive PoC script and detailed analysis.
          The Python script is intended for external execution to provide concrete proof of the vulnerabilities.
        </p>
      </header>
      
      <Card className="bg-gray-800 shadow-2xl">
        <div className="p-3 md:p-5 prose prose-sm prose-invert max-w-none">
          {/* Basic table structure for content that might be tabular */}
          <table className="w-full text-left border-collapse">
            <tbody>
              {renderVrpContent(DEFINITIVE_VRP_SUBMISSION_TEXT)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default VrpSubmissionPreviewPage;
