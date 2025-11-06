

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LogViewer } from '../common/LogViewer';
import { StatusIndicator, StatusIndicatorProps } from '../common/StatusIndicator';


interface Finding {
  file: string;
  line: string; // For pattern matched
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

const DANGEROUS_PATTERNS = [
  {
    name: 'WIZ Global Data Access',
    regex: /window\.WIZ_global_data\.(PeqOqb|S06Grb|WIu0Nc|oPEP7c|CoJqbf)/g,
    severity: 'Critical',
    description: 'This script directly accesses sensitive session/API data from the global window object (WIZ_global_data), likely for exfiltration to a third-party service.',
  },
  {
    name: 'Potential DOM Clobbering Target Access',
    regex: /document\.getElementById\(['"`](?:user-input|sensitive-form|profile-data)['"`]\)/g,
    severity: 'Medium',
    description: 'Script interacts with DOM elements by potentially sensitive ID, which could be involved in DOM Clobbering if IDs are user-controlled or dynamically generated near user content.',
  },
  {
    name: 'navigator.sendBeacon Usage',
    regex: /navigator\.sendBeacon\s*\(/g,
    severity: 'Low', // Informational, as sendBeacon is legitimate but can be used for exfil
    description: 'This script uses navigator.sendBeacon. Review the data being sent to ensure no sensitive information is inadvertently exfiltrated.',
  }
];

// Helper to map severity to StatusIndicator status
const getStatusFromSeverity = (severity: Finding['severity']): StatusIndicatorProps['status'] => {
  switch (severity) {
    case 'Critical':
      return 'Failure';
    case 'High':
      return 'Failure'; // Treat High as Failure for indicator color
    case 'Medium':
      return 'Warning';
    case 'Low':
      return 'Compliant'; // Or 'Idle' if 'Compliant' seems too strong. 'Compliant' often green.
    default:
      return 'Idle';
  }
};


export const ScannersPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const runThirdPartyScriptScan = async () => {
    setIsScanning(true);
    setFindings([]);
    setLogs([]); // Clear previous logs
    addLog('Starting Third