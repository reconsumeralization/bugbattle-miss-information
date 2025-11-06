## Part 3: The Formal VRP Addendum

**To:** Google Trust & Safety Team
**From:** David Amber “WebDUH LLC” Weatherspoon
**Subject:** VRP Submission Addendum: Re: Issue 423273488 – Critical Impact via IDOR & Precedent Analysis

Thank you for the opportunity to provide further clarification. This addendum demonstrates that the client-side API key exposure enables a critical Broken Object Level Authorization (BOLA/IDOR) attack.

### 1. The Direct Attack Scenario: Cross-Tenant Data Exfiltration

An attacker, logged into their own AI Studio account, can perform the following:

*   **Reconnaissance:** Extract the static API Key (`PeqOqb`), API Endpoint (`CoJqbf`), and their User ID (`S06Grb`) from `window.WIZ_global_data`.
*   **Exploitation:** Use a tool like `curl` to make a direct request to the backend, using the static API key but replacing their own User ID with an enumerated victim ID.

```bash
# Attacker uses the stolen API key to request the VICTIM's private data
curl "https://alkalimakersuite-pa.clients6.google.com/_/MakerSuite/v1/users/112185183313702653438/prompts" \
  -H "X-Goog-Api-Key: AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8"
```

### 2. The Security Failure (Demonstrable Harm)

*   **Expected Behavior:** The server should return a 403 Forbidden error.
*   **Actual Behavior:** The server returns a 200 OK with the victim's private JSON data (e.g., their prompts).

This confirms a critical BOLA/IDOR flaw: the backend validates the application's API key (`Authenticate(K_STATIC)`) but fails to authorize that the requester has permission to access the specified user's data (`Authorize(Session_User, Resource_Owner)`).

### 3. Severity Benchmarking & Industry Precedent

This vulnerability pattern is consistently treated as High or Critical. Precedents like the Peloton API breach (client-side key + IDOR allowing access to any user's data) and HackerOne Report #843865 (Slack API token abuse for unauthorized data access) show that when a client-side credential can be leveraged to access another user's data due to a server-side authorization failure, the impact is critical. The ability to enumerate User IDs (even if they are long numbers) combined with a static key that doesn't change per user or session makes this highly exploitable.