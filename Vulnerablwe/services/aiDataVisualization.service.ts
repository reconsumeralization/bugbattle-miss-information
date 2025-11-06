// services/aiDataVisualization.service.ts
import {
  VulnerabilitySourceInput,
  ProcessedVulnerability,
  ExploitCardData,
  VulnerabilityGraphData,
  AppendixAVisualizationData,
  HistogramDataPoint,
  MonteCarloResult
} from '../types';
import { EXTERNAL_VULNERABILITIES_DATA } from '../constants/external_vulnerabilities.constants';

// Helper to create a unique ID for graph nodes
const generateNodeId = (vulnName: string, projectPath?: string, index?: number): string => {
  const namePart = vulnName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  const projectPart = projectPath ? projectPath.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20) : 'general';
  return `${projectPart}_${namePart}_${index !== undefined ? index : ''}`.replace(/__+/g, '_').replace(/_$/, ''); // Add index and clean up underscores
};

// Helper to extract vulnerability type
const extractVulnType = (vulnName: string): string => {
  if (vulnName.includes("IDOR")) return "IDOR";
  if (vulnName.includes("ReDoS")) return "ReDoS";
  if (vulnName.includes("API Key") || vulnName.includes("Hardcoded Key")) return "Hardcoded Key";
  if (vulnName.includes("Insertion of Sensitive Information")) return "Sensitive Data Insertion";
  if (vulnName.includes("Uncontrolled Search Path")) return "Path Traversal";
  if (vulnName.includes("Arbitrary File Write")) return "Arbitrary File Write";
  if (vulnName.includes("Exfiltration")) return "Data Exfiltration";
  if (vulnName.includes("Resource Consumption")) return "Resource Exhaustion";
  const match = vulnName.match(/Vulnerability in ([\w.-]+)/);
  if (match) return `Dependency Vuln (${match[1]})`;
  return "Generic";
};

// Simulate processing and enriching vulnerability data
const processVulnerabilities = (inputs: VulnerabilitySourceInput[]): ProcessedVulnerability[] => {
  return inputs.map((input, index) => {
    const id = generateNodeId(input.vulnerabilityName, input.projectPath || input.organization, index);
    const type = extractVulnType(input.vulnerabilityName);
    let description = input.details || `A ${input.severity.toLowerCase()} ${type} vulnerability.`;
    if (input.cve) description += ` CVE: ${input.cve}.`;
    if (input.snykId) description += ` Snyk ID: ${input.snykId}.`;
    
    const sourceSystem = input.organization ? `${input.organization} - ${input.projectPath || 'N/A'}` : input.projectPath || 'Unknown System';
    const group = input.organization || (input.projectPath ? input.projectPath.split(':')[0] : 'General');

    return {
      id,
      label: `${type} (${input.severity.substring(0,1)})`,
      fullVulnerabilityName: input.vulnerabilityName,
      sourceSystem: sourceSystem,
      type,
      severity: input.severity,
      description,
      group,
      connections: [] // Connections will be added based on simulated analysis
    };
  });
};


const generateExploitCardData = (vuln: ProcessedVulnerability): ExploitCardData => {
  const titles: Record<string, string> = {
    "IDOR": "The All-Access Pass",
    "ReDoS": "The Regex Regex-haustion",
    "Hardcoded Key": "The Skeleton Key",
    "Data Exfiltration": "The Great Escape",
    "Sensitive Data Insertion": "The Tainted Stream"
  };

  const conceptualImagePrompts: Record<string, string> = {
    "IDOR": "A shadowy figure swapping ID cards on a futuristic data server rack, gaining access to glowing data streams. Style: Cyberpunk, neon.",
    "ReDoS": "An infinitely complex, glowing red regular expression pattern consuming a server icon, causing digital smoke. Style: Abstract tech.",
    "Hardcoded Key": "A single, ornate antique key lying exposed on a modern circuit board. Style: Symbolic, high contrast.",
    "Data Exfiltration": "Digital data packets with tiny wings flying out of a broken computer screen towards a distant, dark cloud. Style: Whimsical tech.",
    "Sensitive Data Insertion": "A clear stream of water being polluted by a single drop of black ink, with data bits visible in the water. Style: Symbolic, minimalist."
  };

  return {
    id: vuln.id,
    title: titles[vuln.type] || vuln.type,
    system: vuln.sourceSystem,
    type: vuln.type,
    severity: vuln.severity,
    description: vuln.description,
    keyComponents: vuln.fullVulnerabilityName.split(' - ')[0].split(' '),
    conceptualImagePrompt: conceptualImagePrompts[vuln.type] || `A digital baseball card illustration representing a ${vuln.type} vulnerability, focusing on ${vuln.severity} impact. Keywords: ${vuln.label}, security.`,
    attackerStats: {
      exploitability: vuln.severity === 'Critical' ? 9 : vuln.severity === 'High' ? 7 : vuln.severity === 'Medium' ? 5 : 3,
      impactScale: vuln.severity === 'Critical' ? 10 : vuln.severity === 'High' ? 8 : vuln.severity === 'Medium' ? 6 : 4,
      stealthFactor: vuln.type === "Data Exfiltration" ? 8 : vuln.type === "ReDoS" ? 3 : 6,
    },
    cve: vuln.fullVulnerabilityName.includes("CVE-") ? vuln.fullVulnerabilityName.split("CVE-")[1].split(" ")[0] : undefined,
    snykId: vuln.fullVulnerabilityName.includes("SNYK-") ? vuln.fullVulnerabilityName.split("SNYK-")[1].split(" ")[0] : undefined,
  };
};

export const aiDataVisualizationService = {
  getAllVulnerabilities: async (): Promise<ProcessedVulnerability[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return processVulnerabilities(EXTERNAL_VULNERABILITIES_DATA);
  },

  generateVulnerabilityGraphData: async (selectedVulnIds?: string[]): Promise<VulnerabilityGraphData> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let processedVulns = processVulnerabilities(EXTERNAL_VULNERABILITIES_DATA);

    // Filter based on selectedVulnIds if provided
    if (selectedVulnIds && selectedVulnIds.length > 0) {
      const selectedSet = new Set(selectedVulnIds);
      processedVulns = processedVulns.filter(v => selectedSet.has(v.id));
      
      // Also include any vulnerabilities that are connected to the selected ones
      const connectedVulns: ProcessedVulnerability[] = [];
      // To correctly identify and include connected vulnerabilities, we need to iterate through the *original* set of all processed vulnerabilities
      // and check their 'connections' property. Then, if a connected vulnerability is in our 'selectedSet', we add it.
      const allProcessedVulns = processVulnerabilities(EXTERNAL_VULNERABILITIES_DATA);

      allProcessedVulns.forEach(potentialConnection => {
        if (potentialConnection.connections) {
          potentialConnection.connections.forEach(connectedId => {
            if (selectedSet.has(connectedId) && !selectedSet.has(potentialConnection.id)) {
              connectedVulns.push(potentialConnection);
              selectedSet.add(potentialConnection.id); // Add to set to avoid duplicates
            }
          });
        }
      });
      processedVulns = [...processedVulns, ...connectedVulns];
    }


    let mermaidSyntax = 'graph LR;\\n';
    const exploitCards: Record<string, ExploitCardData> = {};

    // Group vulnerabilities for subgraphs
    const groups: Record<string, ProcessedVulnerability[]> = {};
    processedVulns.forEach(v => {
      if (!groups[v.group]) groups[v.group] = [];
      groups[v.group].push(v);
    });

    let groupIndex = 0;
    for (const groupName in groups) {
      mermaidSyntax += `  subgraph TD_${groupIndex} ["${groupName.replace(/"/g, '#quot;')}"]\n`; // Escape quotes for subgraph title
      groups[groupName].forEach(vuln => {
        mermaidSyntax += `    ${vuln.id}["${vuln.id.replace(/"/g, '#quot;')}\n(${vuln.label.replace(/"/g, '#quot;')})"];\n`; // Use \n for newlines and escape quotes
        exploitCards[vuln.id] = generateExploitCardData(vuln);
      });
      mermaidSyntax += `  end\n`; // Use \n for newlines
      groupIndex++;
    }
    
    // Simulate more sophisticated connections based on vulnerability types and potential exploit chains
    const connectionsToAdd: [string, string, string][] = []; // [sourceId, targetId, label]

    // Example: Hardcoded keys often lead to IDOR or other unauthorized access
    processedVulns.filter(v => v.type === "Hardcoded Key").forEach(hk => {
      processedVulns.filter(v => v.type === "IDOR").forEach(idor => {
        if (hk.group === idor.group) { // Connect if they are in the same conceptual project/system
          connectionsToAdd.push([hk.id, idor.id, "Enables Access"]);
        }
      });
      processedVulns.filter(v => v.type === "Sensitive Data Insertion" || v.type === "Data Exfiltration").forEach(dataLeak => {
        if (hk.group === dataLeak.group) {
          connectionsToAdd.push([hk.id, dataLeak.id, "Leads To Data Leak"]);
        }
      });
    });

    // Example: IDOR can enable data exfiltration or privilege escalation
    processedVulns.filter(v => v.type === "IDOR").forEach(idor => {
      processedVulns.filter(v => v.type === "Data Exfiltration" || v.fullVulnerabilityName.includes("Privilege Escalation")).forEach(escalation => {
        if (idor.group === escalation.group) {
          connectionsToAdd.push([idor.id, escalation.id, "Escalates To"]);
        }
      });
    });

    // Example: Sensitive Data Insertion can lead to Data Exfiltration or expose more vulnerabilities
    processedVulns.filter(v => v.type === "Sensitive Data Insertion").forEach(sdi => {
      processedVulns.filter(v => v.type === "Data Exfiltration" || v.type === "Hardcoded Key").forEach(target => {
        if (sdi.group === target.group) {
          connectionsToAdd.push([sdi.id, target.id, "Exposes Further"]);
        }
      });
    });

    // Example: ReDoS can be part of a DoS chain
    processedVulns.filter(v => v.type === "ReDoS").forEach(redos => {
      processedVulns.filter(v => v.fullVulnerabilityName.includes("Resource Consumption") || v.fullVulnerabilityName.includes("Denial of Service")).forEach(dos => {
        if (redos.group === dos.group) {
          connectionsToAdd.push([redos.id, dos.id, "Contributes To DoS"]);
        }
      });
    });

    // Add all collected connections to the mermaid syntax, ensuring no duplicates and only if both nodes are selected
    const addedConnections = new Set<string>();
    connectionsToAdd.forEach(([sourceId, targetId, label]) => {
      const connectionString = `${sourceId} -->|${label}| ${targetId};\n`; // Use \n for newlines
      if (!addedConnections.has(connectionString) && 
          processedVulns.some(v => v.id === sourceId) && 
          processedVulns.some(v => v.id === targetId)) {
        mermaidSyntax += `  ${connectionString}`;
        addedConnections.add(connectionString);
      }
    });

    // Style nodes based on severity
    processedVulns.forEach(vuln => {
        let style = 'fill:#555,stroke:#333,stroke-width:2px,color:#fff'; // default
        if (vuln.severity === 'Critical') style = 'fill:#D32F2F,stroke:#B71C1C,stroke-width:2px,color:#fff';
        else if (vuln.severity === 'High') style = 'fill:#F57C00,stroke:#E65100,stroke-width:2px,color:#000';
        else if (vuln.severity === 'Medium') style = 'fill:#FBC02D,stroke:#F9A825,stroke-width:2px,color:#000';
        else if (vuln.severity === 'Low') style = 'fill:#7CB342,stroke:#558B2F,stroke-width:2px,color:#000';
        mermaidSyntax += `  style ${vuln.id} ${style};\\n`;
    });


    return { mermaidSyntax, exploitCards };
  },

  getAppendixAVisualizationData: async (): Promise<AppendixAVisualizationData> => {
    // Simulate fetching/processing data from Python PoC's analyze-ids mode
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data for histograms (User ID First 3 & Last 3 Digits)
    const firstDigitsData: HistogramDataPoint[] = [
      { name: "100-199", count: 5 }, { name: "200-299", count: 12 },
      { name: "300-399", count: 8 }, { name: "400-499", count: 15 },
      { name: "500-599", count: 3 },
    ].sort((a,b) => a.name.localeCompare(b.name));

    const lastDigitsData: HistogramDataPoint[] = [
      { name: "0-99", count: 10 }, { name: "100-199", count: 7 },
      { name: "200-299", count: 5 }, { name: "300-399", count: 8 },
      { name: "800-899", count: 6 }, { name: "900-999", count: 7 },
    ].sort((a,b) => a.name.localeCompare(b.name));

    // Mock data for Monte Carlo Simulation Results
    const monteCarloResults: MonteCarloResult[] = [
      { batchSize: 100, hitProbability: 0.52 },
      { batchSize: 1000, hitProbability: 4.98 },
      { batchSize: 10000, hitProbability: 39.80 },
      { batchSize: 100000, hitProbability: 95.00 }, // Conceptual high probability with large batch
    ];
    
    return {
      histograms: [
        { title: "Distribution of First 3 Digits (Sample User IDs)", data: firstDigitsData },
        { title: "Distribution of Last 3 Digits (Sample User IDs)", data: lastDigitsData },
      ],
      monteCarloResults,
      summary: "Conceptual visualization of User ID enumerability analysis. Histograms show potential clustering in ID prefixes/suffixes. Monte Carlo simulation estimates probability of hitting a target ID suffix with batch guessing."
    };
  },
};