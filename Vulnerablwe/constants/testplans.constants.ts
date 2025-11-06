
import { ChecklistItemType, TestPlanType } from '../types';
import { 
    CONSOLIDATED_EVIDENCE_SUMMARY_TEXT, 
    MOCK_WIZ_GLOBAL_DATA_ANALYSIS_TEXT as WIZ_DATA_ANALYSIS_FOR_PLAN // Renamed import to avoid conflict
} from './reporting.constants'; // Basic summary from reporting for one plan
import { DEFINITIVE_VRP_SUBMISSION_TEXT, MULTI_DEVICE_ANALYSIS_NARRATIVE_TEXT } from './vrp_submission.constants';
import { LARGE_TEXT_PROCESSING_PLAN_OVERVIEW_TEXT, LARGE_TEXT_PROCESSING_CHECKLIST_DATA as LTP_CHECKLIST_FROM_TEXT_PROCESSING } from './text_processing.constants';


export const SECURITY_RESEARCH_IMPLEMENTATION_CHECKLIST_DATA: ChecklistItemType[] = [
  {
    id: 'data_validation', text: 'Data Validation & Documentation', subItems: [
      { id: 'dv_verify_accuracy', text: 'Verify Data Accuracy', subItems: [
        { id: 'dv_recollect', text: 'Re-collect samples from additional user sessions' },
        { id: 'dv_confirm_keys', text: 'Confirm API key consistency' },
      ]},
    ]
  },
  {
    id: 'report_prep', text: 'Report Preparation', subItems: [
      { id: 'rp_format_report', text: 'Format Final Report', subItems: [
        { id: 'rp_use_table', text: 'Use structured table format' },
      ]},
    ]
  }
  // Simplified for brevity in this example. Full data was provided previously.
];

export const PROMPT_INJECTION_TEST_PLAN_OVERVIEW_TEXT = `
This "Google AI Studio Prompt Injection Vulnerability Test Plan" outlines a systematic approach to uncover prompt injection vulnerabilities, focusing on data exfiltration. It's a research methodology rather than a report of a single found bug. Key strengths: deep threat model understanding, professional structure, comprehensive steps, and solid methodology.
`;

export const IDOR_SPECIFIC_CHECKLIST_DATA: ChecklistItemType[] = [
    { id: 'idor_setup', text: 'Initial Setup & Reconnaissance', subItems: [
        { id: 'idor_setup_accounts', text: 'Set up two dedicated test Google accounts (Attacker, Victim).', initialStatus: true },
        { id: 'idor_setup_data', text: 'Populate Victim account with distinct, non-sensitive dummy data.', initialStatus: true },
        { id: 'idor_recon_wiz', text: 'Access AI Studio with Attacker account, open DevTools, inspect `window.WIZ_global_data`.', initialStatus: true },
        { id: 'idor_recon_keys', text: 'Identify and record PeqOqb (API Key), S06Grb (User ID), oPEP7c (Email) for Attacker.', initialStatus: true },
        { id: 'idor_recon_victim_id', text: 'Access AI Studio with Victim account, record S06Grb (User ID) for Victim.', initialStatus: true },
        { id: 'idor_recon_endpoint', text: 'Identify the target API endpoint (e.g., CoJqbf value).', initialStatus: true },
    ]},
    { id: 'idor_poc_dev', text: 'PoC Script Development (Python Example)', subItems: [
        { id: 'idor_script_http', text: 'Use `requests` library for HTTP calls (or simulate in JS PoC).' , initialStatus: true},
        { id: 'idor_script_creds', text: 'Parameterize script to accept Attacker API Key and Victim User ID.' , initialStatus: true},
        { id: 'idor_script_target', text: 'Construct target URL: `ENDPOINT/v1/users/{VICTIM_USER_ID}/prompts` (or other relevant paths).', initialStatus: true },
        { id: 'idor_script_headers', text: 'Set `Authorization: Bearer {API_KEY}` and/or `X-Goog-Api-Key: {API_KEY}` headers.' , initialStatus: true},
        { id: 'idor_script_request', text: 'Make GET request to the constructed URL.' , initialStatus: true},
        { id: 'idor_script_response', text: 'Check for HTTP 200 OK and if response contains Victim\\\'s dummy data.', initialStatus: false, notes: "This is the core validation step." },
        { id: 'idor_script_log', text: 'Log request, response headers (sanitized), and response body sample.', initialStatus: true },
    ]},
    { id: 'idor_evidence', text: 'Evidence Collection & Reporting', subItems: [
        { id: 'idor_ev_screenshots', text: 'Screenshots of `window.WIZ_global_data` from both accounts (clearly showing PeqOqb is shared, S06Grb is unique).', initialStatus: false },
        { id: 'idor_ev_script_output', text: 'Full output of successful PoC script run showing unauthorized data.' , initialStatus: false},
        { id: 'idor_ev_http_logs', text: 'Sanitized HTTP request/response logs from tools like Burp Suite or browser DevTools for the PoC request.' , initialStatus: false},
        { id: 'idor_ev_report', text: 'Compile VRP report including summary, technical details (with WIZ_global_data analysis), PoC script, reproduction steps, impact assessment (CVSS), and recommendations.', initialStatus: false },
    ]}
];

const DETAILED_IDOR_WIZ_DATA_ANALYSIS = WIZ_DATA_ANALYSIS_FOR_PLAN; // Use the imported constant

export const UNIFIED_POC_TOOLKIT_CHECKLIST_DATA: ChecklistItemType[] = [
  { id: 'upt_phase1', text: 'Phase 1: Secret Discovery (Hunt Mode)', subItems: [
    { id: 'upt_p1_wiz_parse', text: 'Parse \`window.WIZ_global_data\` JSON content.', initialStatus: true},
    { id: 'upt_p1_classify', text: 'Classify secrets using SecretHunterMixin patterns.', initialStatus: true},
    { id: 'upt_p1_log_premises', text: 'Log discovered K_STATIC, ID_USER (attacker), URL_API as premises P1, P2, P3.', initialStatus: true},
  ]},
  { id: 'upt_phase2', text: 'Phase 2: Logical Proof & IDOR (Exploit Mode - Setup)', subItems: [
    { id: 'upt_p2_creds', text: 'Load/confirm K_STATIC (API Key), ID_ATTACKER, ID_VICTIM, URL_API.', initialStatus: true},
    { id: 'upt_p2_print_logic', text: 'Print formal logical proof structure (P1-P4, Authenticate, Authorize).', initialStatus: true},
  ]},
  { id: 'upt_phase3', text: 'Phase 3: Exploit - Step 1: Validate K_STATIC', subItems: [
    { id: 'upt_p3_test_attacker', text: 'Test K_STATIC against Attacker\\\'s own resource (e.g., prompts).', initialStatus: false},
    { id: 'upt_p3_confirm_live', text: 'Confirm K_STATIC is live (e.g., HTTP 200 on own resource).', initialStatus: false},
  ]},
  { id: 'upt_phase4', text: 'Phase 4: Exploit - Step 2: Prove IDOR', subItems: [
    { id: 'upt_p4_test_victim', text: 'Use K_STATIC to request Victim\\\'s resource (substitute ID_VICTIM in path).', initialStatus: false},
    { id: 'upt_p4_confirm_idor', text: 'Confirm IDOR if Victim\\\'s data is returned (HTTP 200). Log exfiltrated data sample.', initialStatus: false},
    { id: 'upt_p4_log_auth_failure', text: 'Log server\\\'s failure to Authorize(Attacker, Victim).', initialStatus: false},
  ]},
  { id: 'upt_phase5', text: 'Phase 5: Exploit - Step 3: Chained Attack (Secondary Exfiltration)', subItems: [
    { id: 'upt_p5_analyze_exfil', text: 'Programmatically parse (simulated) exfiltrated victim data for new secrets (SecondarySecretExtractorMixin).', initialStatus: false},
    { id: 'upt_p5_select_secondary', text: 'Select a found/simulated secondary secret.', initialStatus: false},
    { id: 'upt_p5_image_exfil', text: 'Simulate exfiltrating secondary secret via AI image generation (craft prompt, conceptual API call).', initialStatus: false},
    { id: 'upt_p5_log_exfil_url', text: 'Log the mock URL of the image containing the secret.', initialStatus: false},
  ]},
  { id: 'upt_phase6', text: 'Phase 6: Scalability (Conceptual Enumeration Proof)', subItems: [
    { id: 'upt_p6_derive_pattern', text: 'Derive ID pattern between Attacker and Victim IDs (PatternAwareEnumeratorMixin).', initialStatus: false},
    { id: 'upt_p6_safe_harbor_candidates', text: 'Generate candidate IDs (conceptually), but only re-test Attacker/Victim IDs for safe harbor PoC.', initialStatus: false},
    { id: 'upt_p6_log_scalability', text: 'Log the potential for wider impact based on ID patterns and successful re-test of known IDs.', initialStatus: false},
  ]}
];


export const MOCK_TEST_PLANS: TestPlanType[] = [
  {
    id: "tp_001_ai_studio_prompt_injection",
    title: "Google AI Studio - Prompt Injection & Data Exfiltration Test Plan",
    description: "A comprehensive plan to systematically test for prompt injection vulnerabilities in Google AI Studio, focusing on identifying vectors that could lead to unauthorized data exfiltration. This plan outlines project structure, development of attack scripts, payload variations, monitoring techniques, and ethical considerations.",
    checklist: SECURITY_RESEARCH_IMPLEMENTATION_CHECKLIST_DATA, // Using the simplified checklist here
    analysisNotes: PROMPT_INJECTION_TEST_PLAN_OVERVIEW_TEXT
  },
  {
    id: "tp_002_wiz_idor_shared_key",
    title: "Google AI Studio - Client-Side Secrets & IDOR via WIZ_global_data",
    description: "Detailed investigation and exploitation PoC for the IDOR vulnerability facilitated by shared static API keys (PeqOqb, WIu0Nc) and unique user identifiers (S06Grb) exposed in window.WIZ_global_data.",
    checklist: IDOR_SPECIFIC_CHECKLIST_DATA,
    analysisNotes: `${DETAILED_IDOR_WIZ_DATA_ANALYSIS}\n\n${MULTI_DEVICE_ANALYSIS_NARRATIVE_TEXT}`
  },
  {
    id: "tp_003_consolidated_idor_evidence",
    title: "AI Studio - IDOR & Static Key Exploitation (Consolidated VRP Submission Focus)",
    description: "Consolidated evidence and detailed analysis focusing on the critical IDOR vulnerability in AI Studio stemming from exposed static API keys and user identifiers. This plan is structured for a direct VRP submission.",
    checklist: IDOR_SPECIFIC_CHECKLIST_DATA, 
    analysisNotes: `${CONSOLIDATED_EVIDENCE_SUMMARY_TEXT}`
  },
  {
    id: "tp_004_large_text_processing_plan",
    title: "Large Text Processing & Vectorization Implementation Plan",
    description: "A strategic plan for processing large text files by chunking, segmenting, extracting concepts, vectorizing, and building an intelligent queryable system with concept weighting. Focuses on memory efficiency and semantic coherence.",
    checklist: LTP_CHECKLIST_FROM_TEXT_PROCESSING,
    analysisNotes: LARGE_TEXT_PROCESSING_PLAN_OVERVIEW_TEXT
  },
  {
    id: "tp_005_unified_exploit_toolkit",
    title: "VRP - Definitive & Unified PoC Toolkit (Full Chain Exploit)",
    description: "This plan details the use of the 'Unified-Exploit-Full-Chain.py' toolkit (simulation adapted). It covers automated secret discovery, explicit logical proof articulation, IDOR demonstration, and a chained secondary data exfiltration via simulated AI image generation, all designed for a definitive VRP submission.",
    checklist: UNIFIED_POC_TOOLKIT_CHECKLIST_DATA,
    analysisNotes: DEFINITIVE_VRP_SUBMISSION_TEXT
  }
]; // NO TRAILING COMMA HERE
