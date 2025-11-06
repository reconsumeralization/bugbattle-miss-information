import React from 'react';
import { Card } from '../common/Card';
import { ChecklistDisplay } from '../common/ChecklistDisplay';
import { LARGE_TEXT_PROCESSING_PLAN_OVERVIEW_TEXT, LARGE_TEXT_PROCESSING_CHECKLIST_DATA } from '../../constants/text_processing.constants';
import { CodeBlock } from '../common/CodeBlock';

const TextProcessingPlanPage: React.FC = () => {

  const renderPlanOverview = (text: string) => {
    const sections = text.split(/(\`\`\`python\n[\s\S]*?\n\`\`\`)/g);

    return sections.map((section, index) => {
      if (section.startsWith('```python')) {
        const codeContent = section.replace(/^```python\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="python" />;
      }
      // For narrative text
      if (section.trim() === '') return null;
      
      if (section.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-primary my-4">{section.substring(2)}</h1>;
      }
      if (section.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-primary-light my-3">{section.substring(3)}</h2>;
      }
       if (section.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-on-surface my-2">{section.substring(4)}</h3>;
      }
      return (
         <p key={index} className="text-on-surface-muted whitespace-pre-wrap leading-relaxed mb-3 text-sm">{section}</p>
      );
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface text-center">
        Large Text Processing & Vectorization Plan
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Plan Overview & Technical Details" className="max-h-[calc(100vh-150px)] overflow-y-auto">
            <div className="p-1"> {/* Minimal padding for prose to handle margins */}
             {renderPlanOverview(LARGE_TEXT_PROCESSING_PLAN_OVERVIEW_TEXT)}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <ChecklistDisplay items={LARGE_TEXT_PROCESSING_CHECKLIST_DATA} title="Implementation Checklist" />
        </div>
      </div>
    </div>
  );
};

export default TextProcessingPlanPage;
