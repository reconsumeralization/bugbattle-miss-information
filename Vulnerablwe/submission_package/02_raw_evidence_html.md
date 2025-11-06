## Part 2: The Raw Evidence - Unabridged HTML Source Code Highlight

The following is the critical snippet from the raw HTML source code of the Google AI Studio page (as simulated in `index.html`). This `window.WIZ_global_data` object contains the exposed static API key, user ID, and backend endpoint that are central to the vulnerability analysis.

The full `index.html` (provided in the application's file structure) contains more context, but this object is the primary source of the leaked credentials.

```html
<script data-id="_gd" nonce="sim-wiz-nonce">
  window.WIZ_global_data = {
    "PeqOqb": "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8", // Static API Key (Observed)
    "WIu0Nc": "AIzaSyDdP816MREB3SkjZO04QXbjsigfcI0GWOs", // Static API Key (Observed)
    "S06Grb": "MOCK_USER_ID_112233445566778899",         // Mock User ID (Google Account ID format)
    "oPEP7c": "mockuser@example.com",                     // Mock PII (email)
    "CoJqbf": "https://alkalimakersuite-pa.clients6.google.com", // Static Endpoint (Observed)
    "EBvNTe": "823511539352-ojaretejk1s95sdvkic0te923pt7knpu.apps.googleusercontent.com", // Static OAuth Client ID (Observed)
    "FdrFJe": "MOCK_SESSION_ID_" + Date.now(), // Mock Session-specific ID
    "SNlM0e": "MOCK_SESSION_TOKEN:" + Date.now(), // Mock Session-specific Token
    "WZsZ1e": "MOCK_ALTERNATE_SESSION_TOKEN_" + Math.random().toString(36).substring(2), // Mock for another session-like token
    "W3Yyqf": "MOCK_USER_ID_112233445566778899", // Often mirrors S06Grb
    "Im6cmf": "/_/MakerSuite",                   // Common base path for resources
    "appVersion": "sim-1.0.0",
    "isDebug": false
  };
  window.WIZ_global_data.W3Yyqf = window.WIZ_global_data.S06Grb;
</script>
```

**Key Leaked Items from `window.WIZ_global_data`:**

*   **`PeqOqb`**: A static Google API Key (Format: `AIza...`). This is the primary leaked credential.
*   **`S06Grb`**: The current user's unique Google User ID (21-digit number). This is used to target specific user resources.
*   **`CoJqbf`**: The base URL for the AI Studio backend API. This tells an attacker where to send requests.

The presence of these items directly in client-side accessible JavaScript is the foundation of the IDOR vulnerability.