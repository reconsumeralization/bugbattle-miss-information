
export const MOCK_MARKDOWN_REPORT_TEMPLATE = `
# Security Test Report

**Project:** {projectName}
**Date:** {date}
**Framework Version:** 1.0.0

## Summary
This report details the findings from the automated security testing process, focusing on vulnerabilities like client-side API key exposure and Insecure Direct Object Reference (IDOR) as observed in Google AI Studio.

## Test Configuration
- **Target Endpoints (Examples):**
{targetEndpointsList}
- **Test Parameters:**
\\\`\\\`\\\`json
{testParameters}
\\\`\\\`\\\`

## Findings
{findingsSection}

## Evidence Log
{evidenceSection}

## Safe Harbor Compliance
All tests were conducted in accordance with predefined safe harbor rules.
`;

export const MOCK_CSV_REPORT_HEADER = "ID,Timestamp,Severity,Description,AffectedEndpoint,EvidenceLink\\n";

// These constants were moved to constants/vrp_submission.constants.ts and are imported there by testplans.constants.ts
// To avoid duplication, they are removed from here.
// MOCK_WIZ_GLOBAL_DATA_ANALYSIS_TEXT
// CONSOLIDATED_EVIDENCE_SUMMARY_TEXT

// For reporting page, we can use smaller, specific mock texts if needed for its direct display
export const MOCK_WIZ_GLOBAL_DATA_ANALYSIS_TEXT = "Detailed analysis of WIZ_global_data revealed consistent patterns of static API key (PeqOqb) and user ID (S06Grb) exposure across sessions, enabling IDOR. Full analysis in VRP Submission Preview.";
export const CONSOLIDATED_EVIDENCE_SUMMARY_TEXT = "Consolidated evidence confirms critical client-side secret exposure leading to potential cross-tenant data breaches. Key items: PeqOqb (API Key), S06Grb (User ID), CoJqbf (Endpoint). Full summary in VRP Submission Preview.";
