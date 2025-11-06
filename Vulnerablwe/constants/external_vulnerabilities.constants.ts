
// constants/external_vulnerabilities.constants.ts
import { VulnerabilitySourceInput } from '../types';

export const EXTERNAL_VULNERABILITIES_DATA: VulnerabilitySourceInput[] = [
  // AI Studio Vulnerabilities (from VRP context)
  {
    organization: "Google AI Studio",
    projectPath: "session page / window.WIZ_global_data",
    vulnerabilityName: "Hardcoded Static API Keys Exposed Client-Side",
    severity: "Critical",
    details: "Static API keys (PeqOqb, WIu0Nc) are embedded in client-side JavaScript, accessible via window.WIZ_global_data. These keys are used for backend authentication.",
  },
  {
    organization: "Google AI Studio",
    projectPath: "session page / window.WIZ_global_data",
    vulnerabilityName: "Exposure of User-Specific Identifiers (S06Grb)",
    severity: "High",
    details: "User's unique Google Account ID (S06Grb) and PII (email oPEP7c) exposed client-side, enabling targeted attacks.",
  },
  {
    organization: "Google AI Studio",
    projectPath: "backend API (/v1/users/{USER_ID}/prompts)",
    vulnerabilityName: "IDOR / Broken Object Level Authorization",
    severity: "Critical",
    details: "Backend fails to authorize if the session (authenticated by static API key) can access the specific USER_ID's data.",
  },
  {
    organization: "Google AI Studio",
    projectPath: "Hypothetical Image Generation Service",
    vulnerabilityName: "AI Service Abuse for Data Exfiltration",
    severity: "High",
    details: "A compromised static API key could potentially be used to abuse AI services (like image generation) to exfiltrate other discovered secrets.",
  },
  {
    organization: "Google AI Studio",
    projectPath: "index.html / gtm-loader.js",
    vulnerabilityName: "Sensitive Data Exfiltration via GTM Simulation",
    severity: "Critical",
    details: "Simulated GTM script (gtm-loader.js) reads client-side secrets (API Key, User ID) from window.WIZ_global_data and sends them to an external analytics endpoint."
  },

  // From reconsumeralization organization
  {
    organization: "reconsumeralization organization",
    projectPath: "Alttra-Development/Cerebro:Logos/dev-folder/requirements.txt",
    vulnerabilityName: "Insertion of Sensitive Information Into Sent Data - Vulnerability in requests 2.31.0",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "reconsumeralization/create-react-app-auth-amplify:package.json",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) - Vulnerability in brace-expansion 1.1.11",
    severity: "Low",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "Webduh/wappalyzer:package.json",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) - Vulnerability in brace-expansion 1.1.11",
    severity: "Low",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "Alttra-Development/Cerebro:Logos/dev-folder/napalm/requirements.txt",
    vulnerabilityName: "Uncontrolled Search Path Element - Vulnerability in jupyter-core 4.12.0",
    severity: "High",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "Alttra-Development/Cerebro:Logos/dev-folder/napalm/requirements.txt",
    vulnerabilityName: "Insertion of Sensitive Information Into Sent Data - Vulnerability in requests 2.14.2",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "Alttra-Development/Cerebro:Logos/dev-folder/napalm/requirements.txt",
    vulnerabilityName: "Improper Output Neutralization for Logs - Vulnerability in django 3.2.25",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "reconsumeralization/module-base:Dockerfile",
    vulnerabilityName: "Vulnerability in python3.11/python3.11-minimal 3.11.2-6+deb12u6",
    cve: "CVE-2024-12718",
    severity: "Low",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "reconsumeralization/hackaru-desktop:package.json",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) - Vulnerability in brace-expansion 1.1.11",
    severity: "Low",
  },
  {
    organization: "reconsumeralization organization",
    projectPath: "reconsumeralization/intergrateful3:package.json",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) - Vulnerability in brace-expansion 1.1.11",
    severity: "Low",
  },

  // From reconsumeralization/hackaru-web
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Incomplete List of Disallowed Inputs in babel/traverse",
    snykId: "SNYK-JS-BABELTRAVERSE-5962462",
    severity: "Critical",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in cross-spawn",
    snykId: "SNYK-JS-CROSSSPAWN-8303230",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in ansi-regex",
    snykId: "SNYK-JS-ANSIREGEX-1583908",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in semver",
    snykId: "SNYK-JS-SEMVER-3247795",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Uncontrolled Resource Consumption ('Resource Exhaustion') in tar",
    snykId: "SNYK-JS-TAR-6476909",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Arbitrary File Write in tar (1)",
    snykId: "SNYK-JS-TAR-1579147",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Arbitrary File Write in tar (2)",
    snykId: "SNYK-JS-TAR-1579152",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Arbitrary File Write in tar (3)",
    snykId: "SNYK-JS-TAR-1579155",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Denial of Service (DoS) in trim-newlines",
    snykId: "SNYK-JS-TRIMNEWLINES-1298042",
    severity: "High",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in hosted-git-info",
    snykId: "SNYK-JS-HOSTEDGITINFO-1088355",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in path-parse",
    snykId: "SNYK-JS-PATHPARSE-1077067",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in minimatch",
    snykId: "SNYK-JS-MINIMATCH-3050818",
    severity: "Medium",
  },
  {
    organization: "reconsumeralization/hackaru-web",
    projectPath: "package.json (dependency)",
    vulnerabilityName: "Regular Expression Denial of Service (ReDoS) in tar",
    snykId: "SNYK-JS-TAR-1536758",
    severity: "Low",
  },
];