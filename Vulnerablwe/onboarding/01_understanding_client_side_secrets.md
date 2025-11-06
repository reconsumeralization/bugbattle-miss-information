# Onboarding: Understanding Client-Side Secret Exposure

This guide will walk you through the concept of client-side secret exposure, how it's simulated in the Vulnerability Testing Framework (VTF), and the associated security risks.

## 1. What is Client-Side Data and Secret Exposure?

Web applications often store and manage data directly in the user's browser (the client-side). This can include user preferences, session information, and sometimes, unfortunately, sensitive data like API keys or user identifiers.

**Secret Exposure** occurs when this sensitive data is accessible in a way that an attacker could potentially retrieve it. One common way this happens is through global JavaScript objects. Other scripts running on the page, including legitimate third-party scripts (like analytics or tag managers, simulated by `gtm-loader.js` in this VTF) or malicious ones (e.g., via XSS), can access this data.

## 2. The `window.WIZ_global_data` Simulation

In our VTF application, the `index.html` file includes a script tag that simulates a global JavaScript object often found in complex web applications (inspired by patterns observed in some Google services):

```html
  <script data-id="_gd" nonce="sim-wiz-nonce">
    window.WIZ_global_data = {
      "PeqOqb": "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8", // Static API Key (Observed)
      "WIu0Nc": "AIzaSyDdP816MREB3SkjZO04QXbjsigfcI0GWOs", // Static API Key (Observed)
      "S06Grb": "MOCK_USER_ID_112233445566778899",         // Mock User ID
      "oPEP7c": "mockuser@example.com",                     // Mock PII (email)
      "CoJqbf": "https://alkalimakersuite-pa.clients6.google.com", // Static Endpoint
      // ... and other mock data
    };
  </script>
```

This `window.WIZ_global_data` object is now accessible to any JavaScript running on the page. For instance, the simulated `public/gtm-loader.js` in this VTF is designed to read from this object, demonstrating how a third-party script could access these secrets. The "Third-Party Script Security Scanner" on the `ScannersPage.tsx` can detect such access.

## 3. Step-by-Step: Finding `window.WIZ_global_data`

You can easily inspect this simulated global object using your browser's Developer Tools:

1.  **Open Developer Tools:** Right-click anywhere on the VTF application page in your browser and select "Inspect" or "Inspect Element". Alternatively, press F12.
2.  **Go to the Console Tab:** In the Developer Tools panel, find and click on the "Console" tab.
3.  **Access the Object:** In the console input line, type the following and press Enter:
    ```javascript
    console.log(window.WIZ_global_data);
    ```
    This will print the entire object structure to the console.
4.  **Copy the Object (Optional):** For easier analysis, you can copy the object's content as a JSON string. Type the following and press Enter:
    ```javascript
    copy(JSON.stringify(window.WIZ_global_data, null, 2)); // Pretty print for easier reading
    ```
    Then, you can paste this into a text editor.

## 4. Step-by-Step: Analyzing the Simulated `WIZ_global_data` Content

Let's break down the key pieces of information in our simulated `window.WIZ_global_data` and their security significance:

*   **`"PeqOqb": "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8"`**
    *   **Represents:** A static API Key. The `AIza...` prefix is characteristic of some Google API keys.
    *   **Security Significance:** If this were a real, powerful API key exposed client-side, an attacker could copy it and use it to make requests to Google services on behalf of the application or, in some misconfigurations, even as the user. This is a **CRITICAL** finding, especially as it's used by the vulnerable backend (`services/api/server.js`) for authentication.
    *   **"Calculation"/Extraction:** The VTF's `simulateSecretHuntFromPocConstants` function (in `constants/poc.constants.ts`), used by the `LoginPage.tsx` "Login via Secret Hunt" feature, simulates extracting this value. It's not a mathematical calculation but a targeted lookup for the key `"PeqOqb"`. The more advanced PoC script in `constants/poc.constants.ts` also demonstrates this extraction.

*   **`"S06Grb": "MOCK_USER_ID_112233445566778899"`**
    *   **Represents:** A unique user identifier, often a numerical ID (like a Google Account ID).
    *   **Security Significance:** While user IDs themselves might not always be secret, their exposure alongside an API key can be dangerous. It provides an attacker with a direct handle to target a specific user's resources. This is crucial for IDOR (Insecure Direct Object Reference) attacks, as demonstrated against the VTF's local vulnerable server (`services/api/server.js`).
    *   **"Calculation"/Extraction:** Similar to the API key, `simulateSecretHuntFromPocConstants` looks for the key `"S06Grb"` to retrieve this value.

*   **`"oPEP7c": "mockuser@example.com"`**
    *   **Represents:** Personally Identifiable Information (PII), in this case, an email address.
    *   **Security Significance:** Exposing PII client-side can lead to privacy violations, spam, or targeted phishing attacks.
    *   **"Calculation"/Extraction:** Hunted by looking for the `"oPEP7c"` key.

*   **`"CoJqbf": "https://alkalimakersuite-pa.clients6.google.com"`**
    *   **Represents:** A base URL for an API endpoint. In our VTF, PoC scripts can be configured to target this or, more revealingly, the local vulnerable server at `http://localhost:3001`.
    *   **Security Significance:** While API endpoints are often public, exposing them in this context confirms to an attacker where the leaked API key and User ID might be used. It helps them map out the application's attack surface.
    *   **"Calculation"/Extraction:** Hunted by looking for the `"CoJqbf"` key.

## 5. The "Hunt to Login" Simulation in VTF

The `LoginPage.tsx` component in VTF has a "Login via Secret Hunt (Simulated)" button. Here's how it works step-by-step:

1.  **Mock Data:** It uses a hardcoded JSON string that mimics `window.WIZ_global_data`.
2.  **Extraction:** It calls `simulateSecretHuntFromPocConstants(mockWizDataString)`.
    *   This function (defined in `constants/poc.constants.ts`) parses the JSON string.
    *   It then directly attempts to access values using known keys like `blob.PeqOqb` and `blob.S06Grb`. This is a simplified simulation of more complex regex-based hunting that a real `SecretHunterMixin` (from the VRP PoC script, detailed in `submission_package/04_definitive_poc_toolkit.md`) would perform. The "Definitive & Unified PoC Toolkit" script available on the `PocPage.tsx` also has a `hunt` mode that simulates this more thoroughly.
3.  **Login Attempt:** The extracted (mock) API key and User ID are then passed to the `authContext.login()` function.
    *   The `auth.service.ts` simulates validating these "hunted" credentials. If they match the predefined "SIM_EXTRACTED_API_KEY" and "SIM_EXTRACTED_USER_ID", the login is considered successful.

This simulates an attacker:
    a. Finding leaked credentials on a page (e.g., from `window.WIZ_global_data` or exfiltrated by `gtm-loader.js`).
    b. Using those credentials to try and authenticate or access resources.

## 6. Risks of Client-Side Secret Exposure

*   **Account Compromise:** Attackers can use leaked API keys to impersonate the application or user.
*   **Data Breach:** Leaked keys and User IDs can lead to IDOR attacks, allowing attackers to access other users' data. This is directly demonstrable in the VTF using the PoC scripts against the local vulnerable server (`services/api/server.js`), as detailed in the next onboarding guide.
*   **Financial Loss:** If API keys are for paid services, an attacker can abuse them, leading to high costs.
*   **Reputation Damage:** Security incidents damage user trust and company reputation.
*   **Data Exfiltration via Third-Party Scripts:** Scripts like the simulated `gtm-loader.js` can read these exposed secrets and send them to attacker-controlled endpoints, bypassing many traditional security measures. This is detailed in the "Chained Exploit: Sensitive Data Exfiltration via Third-Party Script" document within the Submission Package.

## 7. Key Takeaways

*   Sensitive data like API keys should **never** be stored or exposed directly in client-side JavaScript.
*   Authentication and API calls involving sensitive operations should be proxied through a secure backend server where API keys are stored securely (e.g., as environment variables).
*   Regularly audit client-side code and third-party script integrations (like GTM configurations) for any accidental data leakage. The "Third-Party Script Security Scanner" on the `ScannersPage.tsx` helps simulate this audit for scripts like `gtm-loader.js`.

This concludes the onboarding for understanding client-side secret exposure. The next guide will delve into IDOR vulnerabilities, which often exploit the kind of information discussed here, now with a concrete local backend to test against.