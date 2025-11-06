import { TestConfiguration } from '../types';

export const DEFAULT_TEST_CONFIGURATION: TestConfiguration = {
  projectName: 'AI Studio IDOR Test',
  targetEndpoints: ['https://ai.google.dev/api/v1/projects/{projectId}/models', 'https://ai.google.dev/api/v1/user/settings'],
  testParameters: JSON.stringify({
    userIdRange: { min: 1000, max: 2000 },
    commonParameters: { timeout: 5000 },
  }, null, 2),
  safeHarborRules: '1. Test only within designated accounts.\\n2. Do not exfiltrate PII.\\n3. Report all findings promptly.',
  credentialsConfigured: true,
};
