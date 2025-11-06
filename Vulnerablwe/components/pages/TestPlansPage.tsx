import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card';
import { ChecklistDisplay } from '../common/ChecklistDisplay';
import { ApiResponse } from '../../types'; // Ensure ApiResponse is imported
import { ApiTestPlan } from '../../types/apiTypes'; // Ensure ApiTestPlan is imported
import { SelectField } from '../common/SelectField';
import { CodeBlock } from '../common/CodeBlock';
import { testPlanService } from '../../services/testPlan.service'; // New service import
import { Button } from '../common/Button'; // For retry button

export const TestPlansPage: React.FC = () => {
  const [allPlans, setAllPlans] = useState<ApiTestPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestPlans();
  }, []);

  const fetchTestPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<ApiTestPlan[]> = await testPlanService.getTestPlans();
      if (response.success && response.data) {
        setAllPlans(response.data);
        if (response.data.length > 0 && !selectedPlanId) {
          setSelectedPlanId(response.data[0].id);
        }
      } else {
        setError(response.error?.message || 'Failed to fetch test plans.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };


  const selectedPlan = useMemo(() => {
    return allPlans.find(plan => plan.id === selectedPlanId) || null;
  }, [selectedPlanId, allPlans]);

  const planOptions = allPlans.map(plan => ({
    value: plan.id,
    label: plan.title,
  }));

  const renderAnalysisNotes = (notes?: string) => {
    if (!notes) return null;
    const sections = notes.split(/(\`\`\`python\n[\s\S]*?\n\`\`\`|\`\`\`bash\n[\s\S]*?\n\`\`\`|\`\`\`\n[\s\S]*?\n\`\`\`)/g);
    
    return sections.map((section, index) => {
      if (section.startsWith('```python')) {
        const codeContent = section.replace(/^```python\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="python" />;
      } else if (section.startsWith('```bash')) {
        const codeContent = section.replace(/^```bash\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} language="bash" />;
      } else if (section.startsWith('```')) {
        const codeContent = section.replace(/^```\n|```$/g, '').replace(/^\n+|\n+$/g, '');
        return <CodeBlock key={index} code={codeContent} />;
      }
      if (section.trim() === '') return null;
      return (
        <div key={index} className="prose prose-sm prose-invert max-w-none text-on-surface-muted mb-4">
          <pre className="whitespace-pre-wrap font-sans text-sm">{section}</pre>
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-on-surface-muted">Loading test plans...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400">Error: {error}</p>
        <Button onClick={fetchTestPlans} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  if (allPlans.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-on-surface mb-6">Test Plans</h2>
        <p className="text-on-surface-muted">No test plans available.</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <h2 className="text-3xl font-semibold text-on-surface mb-4 sm:mb-0">Test Plans</h2>
        <SelectField 
            label="Select Test Plan"
            options={planOptions}
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            containerClassName="mb-0 sm:w-72"
            aria-controls="test-plan-details"
        />
      </div>
      
      {selectedPlan ? (
        <div id="test-plan-details" role="region" aria-live="polite">
          <h3 className="text-2xl font-medium text-primary mt-4">{selectedPlan.title}</h3>
          <Card title="Plan Description">
            <p className="text-on-surface-muted">{selectedPlan.description}</p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChecklistDisplay items={selectedPlan.checklist} title="Implementation Checklist" />
            
            {selectedPlan.analysisNotes && (
              <Card title="Plan Analysis & Overview" className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {renderAnalysisNotes(selectedPlan.analysisNotes)}
              </Card>
            )}
          </div>
        </div>
      ) : (
         <p className="text-on-surface-muted">Select a test plan to view details.</p>
      )}
    </div>
  );
};

