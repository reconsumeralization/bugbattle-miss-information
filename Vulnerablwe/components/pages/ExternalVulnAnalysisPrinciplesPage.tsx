// components/pages/ExternalVulnAnalysisPrinciplesPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { CodeBlock } from '../common/CodeBlock'; // For any potential code snippets

// Mock fetch function for markdown content
const fetchMarkdownContent = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.text();
};

interface Section {
  id: string;
  title: string;
  path: string;
  content?: string;
}

const ExternalVulnAnalysisPrinciplesPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    { id: 'intro', title: 'Applying VTF Principles to External Vulnerabilities', path: '/external_analysis_principles/00_introduction.md' },
    // Add more sections if breaking down further, e.g., by vulnerability type
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadedSections = await Promise.all(
          sections.map(async (section) => {
            const content = await fetchMarkdownContent(section.path);
            return { ...section, content };
          })
        );
        setSections(loadedSections);
      } catch (e: any) {
        setError(e.message || 'Failed to load content.');
        console.error("Error loading external analysis principles:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Basic Markdown-like renderer
  const renderMarkdown = (markdownText?: string) => {
    if (!markdownText) return null;
    
    const lines = markdownText.split('\\n');
    return lines.map((line, index) => {
      if (line.startsWith('#### ')) return <h4 key={index} className="text-md font-semibold mt-3 mb-1 text-on-surface">{line.substring(5)}</h4>;
      if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold text-primary-light mt-4 mb-2">{line.substring(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-primary mt-6 mb-3">{line.substring(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-primary-dark mt-8 mb-4">{line.substring(2)}</h1>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={index} className="my-2 text-sm text-on-surface leading-relaxed"><strong>{line.slice(2,-2)}</strong></p>;
      if (line.startsWith('*   ')) return <li key={index} className="ml-6 list-disc text-sm text-on-surface-muted leading-relaxed">{line.substring(4)}</li>;
      if (line.trim() === '') return <br key={index} />;
      return <p key={index} className="my-2 text-sm text-on-surface-muted leading-relaxed">{line}</p>;
    });
  };

  const renderSectionContent = (content?: string) => {
    if (!content) return <p className="text-on-surface-muted">Content loading or not available...</p>;
    
    const parts = content.split(/(\`\`\`(?:python|javascript|bash|text|json|diff)?\n[\s\S]*?\n\`\`\`)/g);
    
    return parts.map((part, index) => {
      let language = 'text';
      let codeContent = part;

      if (part.startsWith('```')) {
        const firstLine = part.split('\\n')[0];
        const match = firstLine.match(/^```(\w+)?/);
        if (match && match[1]) {
          language = match[1];
        }
        codeContent = part.replace(/^```\w*\n?|\n?```$/g, '');
        return <CodeBlock key={index} code={codeContent} language={language} />;
      }
      return <div key={index} className="prose prose-sm prose-invert max-w-none">{renderMarkdown(part)}</div>;
    });
  };


  if (isLoading) {
    return <div className="p-6 text-center text-on-surface-muted">Loading External Vulnerability Analysis Principles...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400">Error loading content: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      <header className="text-center border-b border-gray-700 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">External Vulnerability Analysis Principles</h1>
        <p className="text-lg text-on-surface-muted mt-2">
          Conceptual Application of VTF Methodologies to Broader Vulnerability Types.
        </p>
      </header>

      {sections.map((section) => (
        <Card key={section.id} title={section.title} className="bg-gray-800 shadow-xl">
          <div className="p-2 md:p-4 text-on-surface-muted">
            {renderSectionContent(section.content)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExternalVulnAnalysisPrinciplesPage;