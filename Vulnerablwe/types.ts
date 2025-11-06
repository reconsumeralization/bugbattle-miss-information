import React from 'react'; // Ensure React is imported for FC and SVGProps

export enum Page {
  Home = 'home',
  Login = 'Login', 
  Dashboard = 'Dashboard',
  Configuration = 'Configuration',
  Scanners = 'Scanners',
  PoC = 'PoC Development',
  Reporting = 'Reporting & Evidence',
  Security = 'Security & Compliance',
  TestPlans = 'Test Plans',
  VrpSubmissionPreview = 'VRP Submission Preview',
  TextProcessingPlan = 'Text Processing Plan',
  AiFeaturesDemo = 'AI Features Demo',
  Manifesto = 'Security Manifesto',
  SubmissionPackage = 'Submission Package',
  ExploitChainProof = 'Exploit Chain & Proof Synthesis',
  LessonsLearned = 'Security Insights & Lessons Learned',
  ExternalVulnAnalysisPrinciples = 'External Vulnerability Analysis Principles',
  VulnerabilityUniverse = 'Vulnerability Universe Visualizer',
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface TestConfiguration {
  projectName: string;
  targetEndpoints: string[];
  testParameters: string; // JSON string
  safeHarborRules: string;
  credentialsConfigured: boolean;
}

export enum PoCLanguage {
  Python = 'Python',
  JavaScript = 'JavaScript',
  Bash = 'Bash',
  Go = 'Go',
  PowerShell = 'PowerShell',
}

export const createScriptContent = (lines: string[]): string => lines.join('\\n');

export interface PoCScript {
  language: PoCLanguage;
  content: string;
  isValidated: boolean;
  lastRunOutput: string;
  description?: string;
}

export interface EvidenceItem {
  id: string;
  timestamp: Date;
  type: 'HTTP Log' | 'Screenshot' | 'JSON Diff' | 'System Log';
  description: string;
  data: string; // Could be log content, image URL (mock), diff text
}

export interface Report {
  id: string;
  generatedAt: Date;
  format: 'Markdown' | 'CSV';
  content: string;
  evidenceIds: string[];
}

export interface SecurityComplianceItem {
  id: string;
  name: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Active' | 'Inactive';
  details: string;
  lastCheck?: Date;
}

export type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

export enum ExpectedPocOutcome {
  Vulnerable = 'Vulnerable',
  NotVulnerable = 'Not Vulnerable',
  Error = 'Error',
  Unspecified = 'Unspecified'
}

export interface DummyAccount {
  id: string;
  name: string;
  description: string;
  mockUserId: string;
  mockApiKey: string;
  expectedOutcome: ExpectedPocOutcome;
  targetUrlPlaceholder?: string; 
}

export interface PocValidationResult {
  accountId: string;
  status: 'pending' | 'success' | 'failure' | 'error';
  message: string;
  simulatedOutput: string[];
  aiAnalysis?: string;
}

export interface ChecklistItemType {
  id: string;
  text: string;
  subItems?: ChecklistItemType[];
  initialStatus?: boolean;
  notes?: string;
}

export interface TestPlanType {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItemType[];
  analysisNotes?: string;
}

// Base API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message: string;
    details?: any;
  };
}

// Added for scanner.service.ts and related types
export enum ScannerType {
  JavaScript = 'JavaScript Vulnerability Scanner',
  Python = 'Python Static Analyzer',
  IdorEnum = 'IDOR User ID Enumerator',
  IdorRequestGen = 'IDOR Request Generator',
  IdorEvidence = 'IDOR Evidence Collector',
  ContentAnalyzer = 'Sensitive Content Analyzer (SecEx)',
  ThirdPartyScript = 'Third-Party Script Security Scanner',
}

export interface ScannerStatus {
    type: ScannerType;
    isRunning: boolean;
    lastRun: Date | null;
    log: string[];
    progress: number; // 0-100
    resultsSummary?: string;
}

// Types for AI Data Visualization Page
export interface VulnerabilitySourceInput {
  organization?: string; // e.g., "reconsumeralization organization" or "Google AI Studio session page"
  projectPath?: string; // e.g., "Alttra-Development/Cerebro:Logos/dev-folder/requirements.txt" or "package.json"
  vulnerabilityName: string; // e.g., "Insertion of Sensitive Information Into Sent Data - Vulnerability in requests 2.31.0" or "Hardcoded API Keys"
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Unknown';
  cve?: string; // e.g., "CVE-2024-12718"
  snykId?: string; // e.g., "SNYK-JS-BABELTRAVERSE-5962462"
  details?: string; // Any additional details
}

export interface ProcessedVulnerability {
  id: string; // Unique ID for graph node
  label: string; // Short label for graph node
  fullVulnerabilityName: string;
  sourceSystem: string; // Combined org/project for clarity
  type: string; // Extracted type, e.g., ReDoS, IDOR, Hardcoded Key
  severity: VulnerabilitySourceInput['severity'];
  description: string; // A more detailed description or consequence
  group: string; // Group by project/source for Mermaid subgraph
  connections?: string[]; // IDs of vulnerabilities this one connects to or enables
}

export interface ExploitCardData {
  id: string; // Matches ProcessedVulnerability id
  title: string; // Catchy name for the exploit
  system: string; // Source system
  type: string;
  severity: VulnerabilitySourceInput['severity'];
  description: string;
  keyComponents?: string[]; // e.g., "Leaked API Key", "Missing AuthZ"
  // Conceptual "Gemini 2.0 txt+img model" prompt
  conceptualImagePrompt: string;
  attackerStats?: { // Thematic stats
    exploitability: number; // 1-10
    impactScale: number; // 1-10
    stealthFactor: number; // 1-10
  };
  cve?: string;
  snykId?: string;
}

export interface VulnerabilityGraphData {
  mermaidSyntax: string;
  exploitCards: Record<string, ExploitCardData>; // Mapped by ProcessedVulnerability id
}

export interface HistogramDataPoint {
  name: string; // e.g., "000-099" or a specific prefix
  count: number;
}

export interface MonteCarloResult {
  batchSize: number;
  hitProbability: number; // Percentage
}

export interface AppendixAVisualizationData {
  histograms: {
    title: string;
    data: HistogramDataPoint[];
  }[];
  monteCarloResults: MonteCarloResult[];
  summary: string;
}
