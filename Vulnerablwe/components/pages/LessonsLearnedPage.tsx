// components/pages/LessonsLearnedPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { CodeBlock } from '../common/CodeBlock';

// Mock fetch function for markdown content
const fetchMarkdownContent = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.text();
};

interface LessonSection {
  id: string;
  title: string;
  path: string;
  content?: string;
}

const LessonsLearnedPage: React.FC = () => {
  const [sections, setSections] = useState<LessonSection[]>([
    { id: 'intro', title: 'Introduction to Security Insights', path: '/lessons_learned/00_introduction.md' },
    { id: 'tech_analysis', title: 'Deepening Technical Vulnerability Analysis', path: '/lessons_learned/01_deepening_technical_analysis.md' },
    { id: 'threat_modeling', title: 'Advanced Threat Modeling & Attacker Mindset', path: '/lessons_learned/02_advanced_threat_modeling.md' },
    { id: 'disclosure_reporting', title: 'Mastering Vulnerability Disclosure & Reporting', path: '/lessons_learned/03_mastering_disclosure_reporting.md' },
    { id: 'proactive_security', title: 'Proactive Security & Secure System Design', path: '/lessons_learned/04_proactive_security_design.md' },
    { id: 'human_ai_collab', title: 'Synergy of Human-AI Collaboration in Security', path: '/lessons_learned/05_synergy_human_ai_collaboration.md' },
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
        setError(e.message || 'Failed to load lessons learned content.');
        console.error("Error loading lessons learned:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load content once

  const renderSectionContent = (content?: string) => {
    if (!content) return <p className="text-on-surface-muted">Content loading or not available...</p>;
    // Basic Markdown-like renderer
    return content.split('\\n').map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold text-primary-light mt-4 mb-2">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold text-primary mt-6 mb-3">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-primary-dark mt-8 mb-4">{line.substring(2)}</h1>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={index} className="my-2 text-sm text-on-surface leading-relaxed"><strong>{line.slice(2,-2)}</strong></p>;
        if (line.startsWith('*   ')) return <li key={index} className="ml-6 list-disc text-sm text-on-surface-muted leading-relaxed">{line.substring(4)}</li>;
        if (line.trim() === '') return <br key={index} />;
        return <p key={index} className="my-2 text-sm text-on-surface-muted leading-relaxed">{line}</p>;
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center text-on-surface-muted">Loading Security Insights...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400">Error loading content: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      <header className="text-center border-b border-gray-700 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Security Insights & Lessons Learned</h1>
        <p className="text-lg text-on-surface-muted mt-2">
          Key takeaways and deeper understanding gained through the Vulnerability Testing Framework development.
        </p>
      </header>

      {sections.map((section) => (
        <Card key={section.id} title={section.title} className="bg-gray-800 shadow-xl">
          <div className="prose prose-sm prose-invert max-w-none p-2 md:p-4 text-on-surface-muted">
            {renderSectionContent(section.content)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LessonsLearnedPage;