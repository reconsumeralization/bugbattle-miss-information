# Onboarding: Mastering IDOR Vulnerabilities

This guide explains Insecure Direct Object References (IDORs), how they are often linked to leaked user identifiers, and how the Vulnerability Testing Framework (VTF) simulates testing for and exploiting them, particularly against its own local vulnerable backend server.

## 1. What is an IDOR?

**Insecure Direct Object Reference (IDOR)** is a type of access control vulnerability that arises when an application uses user-supplied input to access objects directly. The term "object" can refer to database entries, files, or any other resource.

**Example:**
Imagine an application retrieves user profiles via a URL like:
`https://example.com/api/users/123/profile`

If the application doesn't properly check if the currently logged-in user is authorized to view profile `123`, an attacker could change the `123` to another user's ID, say `456`:
`https://example.com/api/users/456/profile`

If the attacker successfully retrieves user `456`'s profile, an IDOR vulnerability exists.

## 2. The Role of Leaked User IDs in IDORs

As discussed in the "Understanding Client-Side Secret Exposure" guide, User IDs (like `S06Grb` from `window.WIZ_global_data`) leaked on the client-side are a critical ingredient for IDOR attacks. Attackers need these identifiers to know which "objects" (other users' data) to target. The local vulnerable server in VTF (`services/api/server.js`) uses such IDs as keys in its mock database.

## 3. Simulating IDOR Testing in the VTF Application (`ScannersPage.tsx`)

The "Scanners" page in the VTF simulates various tools a security tester might use to find IDORs. These simulations primarily use logic from `constants/poc.constants.ts`.

### 3.1. IDOR User ID Enumerator

*   **Concept:** This scanner simulates trying to discover valid user IDs. Real-world enumeration can involve looking for patterns, trying sequential IDs, or using lists of common IDs.
*   **VTF Simulation (`simulatePatternAwareEnumeration`):**
    1.  **Input:** The UI takes "Seed User IDs" (e.g., `1001,1005`) and a conceptual "radius".
    2.  **Logic (Step-by-Step "Calculation"):**
        *   The `simulatePatternAwareEnumeration` function (in `poc.constants.ts`) gets these seed IDs.
        *   For each numeric seed ID, it generates candidate IDs by adding and subtracting numbers within the given `radius`.
        *   Example: If a seed ID is `1005` and radius is `3`, it generates `1002` through `1008`.
        *   It also simulates deriving a pattern (e.g., common prefix, length) if multiple seeds suggest one.
        *   The function returns a unique list of these generated candidate IDs. These IDs can then be conceptually used to target the local vulnerable server (`services/api/server.js`).
    3.  **Output:** The UI displays the number of candidate IDs found and a summary of any (mock) pattern detected.

### 3.2. IDOR Request Generator (Conceptual)

*   **Concept:** Once potential User IDs are enumerated, this tool would craft HTTP requests to target endpoints, substituting the enumerated IDs into the URL or request body. In VTF, these requests would target the simulated vulnerable backend.
*   **VTF Simulation:** The VTF doesn't deeply simulate the output of individual generated requests from this specific scanner. The actual request simulation against the local server (`services/api/server.js`) is demonstrated on the "PoC Development" page.

### 3.3. IDOR Evidence Collector (Conceptual)

*   **Concept:** After requests are made (e.g., to `services/api/server.js`), this tool would analyze the HTTP responses. It looks for signs of successful IDOR.
*   **VTF Simulation:** This is conceptual in the `ScannersPage`. The "Reporting & Evidence" page simulates collected evidence.

## 4. Exploiting IDOR with PoC Scripts (`PocPage.tsx`) and the Local Vulnerable Server

The "PoC Development" page is where the VTF truly simulates the exploitation of an IDOR vulnerability, now with a concrete backend target: `services/api/server.js`.

### 4.1. The Vulnerable Backend (`services/api/server.js`)

The VTF includes a simple Node.js Express server that simulates the AI Studio backend:
*   **Authentication:** It has a `checkApiKey` middleware that *correctly* verifies the static API key (`AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8` from `window.WIZ_global_data.PeqOqb`). This simulates the first gate of authentication.
*   **The IDOR Flaw:** The endpoint `/v1/users/:userId/prompts` (and others like it) **FAILS to perform authorization**. After the API key is validated, it blindly trusts the `userId` from the URL and serves data from its `USER_PROMPTS_DB` mock database if the `userId` exists. This is the critical IDOR vulnerability.
*   **Targeting:** The PoC scripts can be configured to target this server at `http://localhost:3001` (or the port defined in `services/api/.env.development`).

### 4.2. The PoC Script Logic (e.g., "Definitive & Unified PoC Toolkit")

The primary PoC script (Python, detailed in `submission_package/04_definitive_poc_toolkit.md` and `manifesto/01_part_i_the_finding.md`) is designed to exploit this:
*   It can accept a `--local-api-url http://localhost:3001` argument.
*   It uses the provided static API key (`--api-key`) for the `X-Goog-Api-Key` header.
*   It targets a specific victim User ID (`--victim-id`).

### 4.3. Step-by-Step Exploitation Simulation:

1.  **Setup:**
    *   The local vulnerable server (`services/api/server.js`) is running.
    *   The attacker (simulated by you) has the static API key (`AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8`).
    *   The attacker targets a victim's User ID present in the `server.js` mock database (e.g., `112185183313702653438`).
2.  **Script Execution (Simulated by `PocPage.tsx` or by running the Python script externally):**
    *   The `PocPage` (or the external Python script) takes the PoC script content.
    *   Placeholders are replaced:
        *   `{user_id}` (or equivalent in the script) becomes the victim's ID.
        *   `{api_key}` becomes the static API key.
        *   `{target_url}` (or `endpoint_base` + path) becomes, e.g., `http://localhost:3001/_/MakerSuite/v1/users/112185183313702653438/prompts`.
3.  **Conditional Logic & Server Interaction (The "Calculation"):**
    *   The PoC script sends a request to the local server.
    *   **`services/api/server.js` Behavior:**
        1.  The `checkApiKey` middleware validates the `X-Goog-Api-Key`. It matches `AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8`, so authentication passes.
        2.  The route handler for `/v1/users/:userId/prompts` receives the `userId` (e.g., `112185183313702653438`) from the URL.
        3.  **CRITICAL FLAW:** It directly looks up `USER_PROMPTS_DB[requestedUserId]`. There is NO check to see if the session (authenticated only by the shared static API key) is *authorized* to see data for `requestedUserId`.
        4.  If `USER_PROMPTS_DB[requestedUserId]` exists, it returns the data with HTTP 200 OK.
    *   **PoC Script Logic (e.g., Python "Definitive & Unified PoC Toolkit"):**
        *   The `test_idor_on_prompts_endpoint` function simulates/makes this call.
        *   If it receives HTTP 200 and victim's data (as the local server would provide due to the flaw), it considers the IDOR successful.
        *   It then prints `OUTPUT: SUCCESS: Primary IDOR Confirmed...`
4.  **Output & Validation in VTF:**
    *   The `PocPage` simulation captures the `OUTPUT:` line.
    *   It compares the script's outcome (`SUCCESS`) with the `DummyAccount`'s `expectedOutcome` (`Vulnerable`).
    *   This confirms the PoC behaved as expected against the local vulnerable server.

## 5. Key Defense Strategies Against IDOR

*   **Strong Access Control Checks:** Always verify on the server-side that the logged-in user (identified by a secure session token, NOT a shared static API key for user-specific data access) has explicit permission to access or modify the requested resource/object.
*   **Use Session-Based Resource Access:** Instead of passing object IDs directly in URLs if possible for user-specific data, associate resources with the user's server-side session object.
*   **Avoid Predictable IDs:** Use non-sequential, random identifiers (e.g., UUIDs) for resources where possible. This makes enumeration harder but doesn't replace proper access control.
*   **Principle of Least Privilege:** Users should only have access to the resources absolutely necessary for their functions. Shared static API keys should not grant access to individual user data.

This guide provides a foundational understanding of IDORs and how they are simulated and proven within the VTF, leveraging the newly added local vulnerable backend server to make the demonstration concrete. The next guide will explore PoC scripts in more detail in this context.