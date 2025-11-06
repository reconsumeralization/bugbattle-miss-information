
import React, { useState } from 'react';
import { TestConfiguration } from '../../types';
import { DEFAULT_TEST_CONFIGURATION } from '../../constants/config.constants'; 
import { Card } from '../common/Card';
import { InputField } from '../common/InputField';
import { TextareaField } from '../common/TextareaField';
import { Button } from '../common/Button';
import { ToggleSwitch } from '../common/ToggleSwitch';

export const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<TestConfiguration>(DEFAULT_TEST_CONFIGURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleEndpointChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, targetEndpoints: e.target.value.split('\\n') }));
  };
  
  const handleToggleChange = (field: keyof TestConfiguration, enabled: boolean) => {
    setConfig(prev => ({ ...prev, [field]: enabled }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMessage(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      let testParamsToSave = config.testParameters;
      try {
        // Attempt to parse JSON for testParameters, but don't block if invalid for simulation.
        if (config.testParameters.trim() !== '') {
          JSON.parse(config.testParameters);
        }
        setFeedbackMessage('Configuration saved successfully!');
         console.log('Saved configuration:', {...config, testParameters: testParamsToSave});
      } catch (error) {
        console.warn('Test Parameters JSON is invalid. Saving as raw string for simulation.', error);
        setFeedbackMessage('Configuration saved (Test Parameters JSON was invalid, saved as raw string).');
         console.log('Saved configuration (with potentially invalid JSON):', {...config, testParameters: testParamsToSave});
      }
      
      setTimeout(() => setFeedbackMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface">Test Configuration</h2>
      <form onSubmit={handleSubmit}>
        <Card title="Project & Endpoints">
          <InputField
            label="Project Name"
            name="projectName"
            value={config.projectName}
            onChange={handleChange}
            required
          />
          <TextareaField
            label="Target Endpoints (one per line)"
            name="targetEndpoints"
            value={config.targetEndpoints.join('\\n')}
            onChange={handleEndpointChange}
            rows={4}
            // Not strictly required for simulation flexibility
          />
        </Card>

        <Card title="Test Parameters & Rules" className="mt-6">
          <TextareaField
            label="Test Parameters (JSON format)"
            name="testParameters"
            value={config.testParameters}
            onChange={handleChange}
            rows={6}
            className="font-mono text-sm"
            placeholder='e.g., {"userIdRange": {"min": 1000, "max": 1010}} or leave empty'
          />
          <TextareaField
            label="Safe Harbor Rules"
            name="safeHarborRules"
            value={config.safeHarborRules}
            onChange={handleChange}
            rows={4}
          />
        </Card>
        
        <Card title="Credentials (Mock)" className="mt-6">
            <p className="text-sm text-on-surface-muted mb-2">
                This section is for illustrative purposes. In a real application, credentials would be managed securely.
                The API key for services like Gemini would be sourced from <code>process.env.API_KEY</code> by the backend/tool.
            </p>
            <ToggleSwitch
                label="Mock Credentials Configured"
                enabled={config.credentialsConfigured}
                onChange={(enabled) => handleToggleChange('credentialsConfigured', enabled)}
                description="Simulates if necessary credentials for tests are available."
            />
            {config.credentialsConfigured && (
                <div className="p-3 bg-gray-700 rounded mt-2">
                    <p className="text-sm text-green-400">Mock API Key: ********-****-****-****-********eyJQ</p>
                    <p className="text-xs text-on-surface-muted">This is a placeholder and not a real key.</p>
                </div>
            )}
        </Card>

        <div className="mt-8 flex justify-end items-center">
          {feedbackMessage && (
            <span className={`mr-4 text-sm ${feedbackMessage.includes('invalid') || feedbackMessage.startsWith('Error:') ? 'text-yellow-400' : 'text-green-400'}`}>
              {feedbackMessage}
            </span>
          )}
          <Button type="submit" isLoading={isLoading} size="lg">
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
