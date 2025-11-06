
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LogViewer } from '../common/LogViewer';
import { StatusIndicator } from '../common/StatusIndicator';
// Ensure this import path is correct and StatusIndicatorProps is exported from StatusIndicator.tsx
// If StatusIndicatorProps is not explicitly exported, we can define a local type or infer.
// For now, assuming StatusIndicatorProps is available or we define it locally.

// Local type for StatusIndicator status prop, if not directly importable
type LocalStatusIndicatorStatus = 'Compliant' | 'Non-Compliant' | 'Pending' | 'Active' | 'Inactive' | 'Running' | 'Idle' | 'Success' | 'Failure' | 'Warning';


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
const getStatusFromSeverity = (severity: Finding['severity']): LocalStatusIndicatorStatus => {
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
    addLog('Starting Third-Party Script Security Scan...');

    try {
      addLog('Fetching application entry point (index.html)...');
      const indexHtmlResponse = await fetch('/'); 
      if (!indexHtmlResponse.ok) {
        throw new Error(`Failed to fetch index.html: ${indexHtmlResponse.statusText}`);
      }
      const indexHtml = await indexHtmlResponse.text();

      const scriptRegex = /<script.*?src=["'](.*?)["'].*?>/ig;
      let match;
      const scriptUrls: string[] = [];
      
      while ((match = scriptRegex.exec(indexHtml)) !== null) {
        if (match[1] && !match[1].startsWith('http') && !match[1].startsWith('//') && match[1].endsWith('.js')) {
          scriptUrls.push(match[1]);
        }
      }
      
      if (scriptUrls.length === 0) {
        addLog('No local third-party JavaScript files found linked in index.html.');
        setIsScanning(false);
        return;
      }

      addLog(`Found ${scriptUrls.length} local script(s) to analyze: ${scriptUrls.join(', ')}`);

      for (const relativeUrl of scriptUrls) {
        const url = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
        try {
          addLog(`Fetching and analyzing script: ${url}...`);
          const scriptResponse = await fetch(url);
          if (!scriptResponse.ok) {
            addLog(`[ERROR] Failed to fetch script: ${url} - Status: ${scriptResponse.status}`);
            continue;
          }
          const scriptContent = await scriptResponse.text();

          DANGEROUS_PATTERNS.forEach(pattern => {
            const scriptMatches = [...scriptContent.matchAll(pattern.regex)];
            if (scriptMatches.length > 0) {
              scriptMatches.forEach(m => {
                const lines = scriptContent.split('\\n');
                let lineNumber = "N/A";
                for(let i=0; i < lines.length; i++) {
                    if (lines[i].includes(m[0])) {
                        lineNumber = `~L${i+1}`;
                        break;
                    }
                }

                const finding: Finding = {
                  file: url,
                  line: `${lineNumber} (Pattern: ${m[0].substring(0,50)}${m[0].length > 50 ? '...' : ''})`,
                  description: pattern.description,
                  severity: pattern.severity as Finding['severity'],
                };
                addLog(`[VULNERABILITY DETECTED] ${pattern.name} in ${url}`);
                setFindings(prev => [...prev, finding]);
              });
            }
          });
        } catch (scriptError: any) {
          addLog(`[ERROR] Failed to fetch or analyze script ${url}: ${scriptError.message}`);
        }
      }

    } catch (error: any) {
      addLog(`[FATAL] Error during scan setup: ${error.message}`);
    }

    addLog('Third-Party Script Security Scan complete.');
    setIsScanning(false);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 text-on-surface">Security Scanners</h1>
      <p className="mb-6 text-on-surface-muted">
        Simulate security scanners that analyze the application for common vulnerabilities.
      </p>

      <Card title="Third-Party Script Security Scanner">
        <div className="p-4">
          <p className="mb-4 text-gray-300">
            This scanner inspects local JavaScript files loaded by the application (like marketing or analytics tags found in <code>index.html</code>)
            for patterns that indicate sensitive data leakage (e.g., accessing <code>window.WIZ_global_data</code>) or other risky behaviors.
          </p>
          <Button onClick={runThirdPartyScriptScan} disabled={isScanning} variant="secondary">
            {isScanning ? 'Scanning...' : 'Run Third-Party Script Scan'}
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Scan Findings">
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {findings.length === 0 && !isScanning && <p className="text-on-surface-muted">No findings yet. Run a scan.</p>}
            {isScanning && <p className="text-on-surface-muted">Scanning in progress...</p>}
            {findings.map((finding, index) => (
              <div key={index} className="border border-gray-700 rounded p-3 bg-gray-800">
                <div className="flex items-center mb-2">
                  <StatusIndicator status={getStatusFromSeverity(finding.severity)} />
                  <h3 className="ml-2 font-semibold text-on-surface">{finding.file}</h3>
                </div>
                <p className="text-sm text-on-surface-muted mb-1"><strong>Description:</strong> {finding.description}</p>
                <p className="text-sm text-gray-400 bg-gray-900 p-1 rounded font-mono"><strong>Evidence:</strong> {finding.line}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Scanner Logs">
          <LogViewer logs={logs} maxHeight="500px" />
        </Card>
      </div>
    </div>
  );
};
