# Onboarding: Demystifying PoC Scripts

This guide breaks down Proof-of-Concept (PoC) scripts, explaining their purpose, common structures, and how they are simulated within the Vulnerability Testing Framework (VTF) "PoC Development" page, especially when targeting the VTF's local vulnerable backend server (`services/api/server.js`).

## 1. What is a Proof-of-Concept (PoC) Script?

A Proof-of-Concept (PoC) script is a piece of code written to demonstrate that a vulnerability exists and can be exploited. Its main purposes are:

*   **Verification:** To confirm a suspected vulnerability.
*   **Demonstration:** To show how an attacker could exploit the flaw.
*   **Communication:** To clearly explain the vulnerability to developers or security teams for remediation.

PoCs are generally kept simple and focused on the specific vulnerability they aim to prove. In VTF, they demonstrate flaws like the IDOR against the local `services/api/server.js`.

## 2. Common Languages for PoC Scripts

As seen in the VTF (`PocPage.tsx`), PoCs can be written in various languages. Our simulation includes:

*   **Python:** Very popular for security scripting. The "Definitive & Unified PoC Toolkit" (simulated in `constants/poc.constants.ts` and detailed in `submission_package/04_definitive_poc_toolkit.md`) is a key Python example, capable of targeting the local `services/api/server.js` using its `--local-api-url` flag.
*   **JavaScript:** Useful for demonstrating client-side vulnerabilities.
*   **Bash:** Good for command-line automation and simple HTTP requests using tools like `curl`.

## 3. Anatomy of a VTF Simulated PoC Script

Let's dissect the structure of a typical PoC script as simulated in the VTF, using the Python IDOR PoC from `constants/poc.constants.ts` (which forms the basis of the Unified Toolkit) and its interaction with the local vulnerable server (`services/api/server.js`).

```python
# Python PoC for AI Studio IDOR (Conceptual, from constants/poc.constants.ts)
# Simulates exploiting a leaked API key to access another user's data.
# Placeholders {user_id}, {api_key}, {target_url} will be replaced.
# In the Unified Toolkit, {target_url} could be http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts
import sys
import json 

# === 3.1. Placeholders ===
user_id_placeholder = "{user_id}"         # e.g., "112185183313702653438" (victim ID from server.js)
api_key_placeholder = "{api_key}"         # e.g., "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8" (static key from WIZ_global_data)
target_url_placeholder = "{target_url}"   # e.g., "http://localhost:3001/_/MakerSuite/v1/users/{user_id}/prompts"

# === 3.2. Simulating Network Requests (Conceptually targeting services/api/server.js) ===
sys.stdout.write(f"Python PoC: Attempting IDOR on target user: {user_id_placeholder}\\n")
sys.stdout.write(f"Using API Key: {api_key_placeholder[:10]}... for URL: {target_url_placeholder}\\n")
# A real PoC (like the full Unified Toolkit) would use:
# import requests
# headers = {'X-Goog-Api-Key': api_key_placeholder} # server.js checks this header
# response = requests.get(target_url_placeholder, headers=headers)
# simulated_response_content = response.json() # The data from server.js

# === 3.3. Simulating Responses & Conditional Logic (The "Calculation" reflecting server.js logic) ===
simulated_response = {} 
output_message_type = "INFO"
output_message_content = f"Unspecific outcome for user {user_id_placeholder}"

# This logic now directly reflects how services/api/server.js would respond:
if api_key_placeholder != "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8": # server.js's checkApiKey
    simulated_response = { "error": "authentication_failed", "user_id": user_id_placeholder }
    output_message_type = "ERROR"
    output_message_content = f"Authentication failed (API Key mismatch for server.js) for user {user_id_placeholder}"
# Assuming API key is correct, server.js checks if user_id_placeholder exists in its USER_PROMPTS_DB
elif user_id_placeholder == "admin_vulnerable_001" or user_id_placeholder == "user_unexp_vuln_004" or user_id_placeholder == "112185183313702653438":
    # These users ARE VULNERABLE because server.js will serve their data
    simulated_response = { "user_id": user_id_placeholder, "sensitive_data": f"secret_info_for_{user_id_placeholder}" } # Mock of data from server.js
    output_message_type = "SUCCESS" # Indicates successful exploit against server.js
    output_message_content = f"Potential IDOR found for user {user_id_placeholder} (data obtained from server.js)"
elif user_id_placeholder == "user_secure_002": # This user might not be in server.js DB or server.js has specific logic for it (hypothetically)
    simulated_response = { "user_id": user_id_placeholder, "data": f"regular_user_info_for_{user_id_placeholder}" }
    output_message_type = "INFO" # server.js might return 404 if not found, or 200 if found but no special data.
    output_message_content = f"No direct IDOR / or normal access for user {user_id_placeholder} on server.js"
else: # For other user IDs, server.js would likely return 404 if not in its DB
    simulated_response = { "message": f"Resource not found or access denied for {user_id_placeholder} by server.js" }
    output_message_type = "INFO" # Or "ERROR" if a 404 is considered an error in PoC context
    output_message_content = f"User {user_id_placeholder} likely not found in server.js mock DB."


# === 3.4. Outputting Results (Standardized Format) ===
sys.stdout.write(f"SIMULATED_RESPONSE: {json.dumps(simulated_response)}\\n")
sys.stdout.write(f"OUTPUT: {output_message_type}: {output_message_content}\\n")
```

### 3.1. Placeholders

*   **`{user_id}`**, **`{api_key}`**, **`{target_url}`**: Template markers.
*   **How VTF uses them:** When "Validate with Account" is used, or when the external Python PoC is run with arguments:
    1.  Values from a `DummyAccount` (for UI simulation) or command-line arguments (for external script) are taken.
    2.  These values are substituted into the script. For local testing, `{target_url}` might become `http://localhost:3001/_/MakerSuite/v1/users/{user_id_value}/prompts`.

### 3.2. Simulating Network Requests

*   **VTF Simulation:** The `PocPage.tsx` simulates the PoC script's execution by capturing its `stdout`.
*   **External Python PoC:** The actual "Definitive & Unified PoC Toolkit" uses the `requests` library to make real HTTP calls to the specified endpoint (which can be `http://localhost:3001` to target `services/api/server.js`).
*   **Interaction with `services/api/server.js`:**
    *   The PoC sends a `GET` request.
    *   The `X-Goog-Api-Key` header is set to the static API key (`AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8`).
    *   `server.js`'s `checkApiKey` middleware validates this key.
    *   If valid, the main route handler in `server.js` directly uses the `userId` from the URL path to fetch data from `USER_PROMPTS_DB` **without further authorization checks.**

### 3.3. Simulating Responses & Conditional Logic (The "Calculation")

This is where the PoC script's logic meets the (flawed) logic of `services/api/server.js`.
*   **`services/api/server.js` Behavior:**
    1.  Authenticates the static API key.
    2.  If the `userId` in the URL exists in its `USER_PROMPTS_DB`, it returns that user's data with HTTP 200.
    3.  If the `userId` doesn't exist, it returns HTTP 404.
*   **PoC Script Conditional Logic (Step-by-Step "Calculation"):**
    1.  The script anticipates the server's behavior.
    2.  If the API key used is incorrect, it expects an authentication error (simulated as `output_message_type = "ERROR"`).
    3.  If a known "vulnerable" User ID (one present in `server.js`'s mock DB and intended for IDOR demonstration) is targeted with the correct API key, the PoC script expects to receive data. It then sets `output_message_type` to `"SUCCESS"` because the IDOR attempt (getting data not belonging to the "attacker's original session context," which is ambiguous with a static key) is considered successful.
    4.  The PoC script prepares a `simulated_response` that mirrors what `server.js` would send.
*   The "calculation" in the PoC is its interpretation of the (real or simulated) response from `server.js` based on the inputs.

### 3.4. Outputting Results (Standardized Format)

*   **`SIMULATED_RESPONSE: {json_data}`:** The PoC script prints mock JSON data that would resemble the actual response from `services/api/server.js`.
*   **`OUTPUT: {TYPE}: {MESSAGE}`:** This standardized line allows the `PocPage.tsx` simulation (or an automated test runner for the external script) to determine the outcome. `SUCCESS` indicates the IDOR was proven against the server's logic.

## 4. Running PoCs in VTF (`PocPage.tsx`)

### 4.1. Selecting Language and Script

*   Users choose a language. The "Definitive & Unified PoC Toolkit" Python script is the most comprehensive for demonstrating the IDOR against `services/api/server.js`.

### 4.2. "Run Generic PoC Sim"

*   This does a basic run. For the Unified Toolkit, it might show the help message or a conceptual flow without specific targeting.

### 4.3. "Validate with Account"

*   **Purpose:** To test the PoC against a `DummyAccount` whose `mockUserId` and `mockApiKey` are used to simulate an attack.
*   **Process (Step-by-Step):**
    1.  User selects a `DummyAccount`.
    2.  `PocPage` substitutes placeholders. Crucially, the `target_url_placeholder` (or equivalent in the script) can be set to the local `services/api/server.js` endpoint.
    3.  The script's (simulated) execution now directly reflects an attempt against the known behavior of `services/api/server.js`.
    4.  **Validation "Calculation":**
        *   The `PocPage` parses the `OUTPUT: {TYPE}: ...` line.
        *   It compares `TYPE` (e.g., `SUCCESS` from the PoC if it "received" data for a victim ID from the `server.js` simulation) with `dummyAccount.expectedOutcome` (e.g., `ExpectedPocOutcome.Vulnerable`).
        *   A match means the PoC successfully demonstrated the expected interaction with the (simulated or real) vulnerable server.
    5.  The result and full simulated log are displayed.

## 5. Key Takeaways for PoC Scripts

*   PoCs demonstrate specific vulnerabilities, like the IDOR in `services/api/server.js`.
*   Placeholders and arguments (like `--local-api-url`, `--api-key`, `--victim-id` for the Python PoC) make them adaptable.
*   Standardized output facilitates automated validation.
*   VTF's simulation, especially with the local vulnerable server, allows for a concrete understanding of how PoCs prove vulnerabilities by interacting with flawed backend logic.

This guide should clarify how PoC scripts function within the VTF, particularly in exploiting the simulated vulnerabilities of the local backend server. The next guide will explore the "Unified Exploit Toolkit" in greater depth.