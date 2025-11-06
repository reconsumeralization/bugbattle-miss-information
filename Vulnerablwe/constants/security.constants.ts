import { SecurityComplianceItem } from '../types';

export const INITIAL_SECURITY_COMPLIANCE_ITEMS: SecurityComplianceItem[] = [
  { id: 'network_isolation', name: 'Network Isolation (Docker Policies)', status: 'Active', details: 'All tests run in isolated Docker containers with strict network policies.', lastCheck: new Date() },
  { id: 'audit_logging', name: 'Comprehensive Audit Logging', status: 'Active', details: 'All actions and test results are logged.', lastCheck: new Date() },
  { id: 'safe_harbor_checker', name: 'Automated Safe Harbor Compliance Checker', status: 'Pending', details: 'Checks test configurations against safe harbor rules before execution.', lastCheck: new Date() },
  { id: 'cleanup_routines', name: 'Secure Cleanup Routines', status: 'Pending', details: 'Automated cleanup of test data and artifacts post-execution.', lastCheck: new Date() },
  { id: 'credential_encryption', name: 'Credential Encryption at Rest', status: 'Active', details: 'Mock credentials are conceptually secured.', lastCheck: new Date() },
];
