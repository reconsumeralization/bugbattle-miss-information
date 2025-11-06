## Part II: Component β (Beta) — The Zero-Trust Authorization Blueprint

This is the **formal specification for the defense**. It is the set of immutable rules the system MUST follow. Component α's "exploit" mode is designed to prove that the current system violates Rule #3.

### Specification:

#### Rule of Authentication (Authenticate):

1.1: The system MUST validate that any API key (`K_STATIC`) used for application-level requests is a valid, trusted credential.
    *   *Verification*: Done by the backend before processing the request.
    *   *VTF Simulation*: `UnifiedPocTool.test_idor_prompts` (when `is_victim_test=False`) simulates this. A 401/403 for the attacker's own data using their key would indicate a failure here.

1.2: A successful application-level authentication (e.g., via `K_STATIC`) DOES NOT imply user-level authorization for specific resources.
    *   *Principle*: Authentication confirms "who you are" (or "what key you have"), Authorization confirms "what you are allowed to do/see." These must be separate checks for multi-tenant resources.

#### Rule of Identification (Identify):

2.1: Every user session, when attempting to access or modify user-specific resources, MUST be strongly and reliably associated with a single, unique, non-malleable identifier for the acting user (`ID_SESSION_USER`).
    *   *Source*: Derived from a secure authentication token (e.g., JWT, OAuth token), not from client-supplied headers or parameters if possible.

2.2: Any user-specific resource on the backend (e.g., a user's prompt, model, or setting) MUST be owned by or unequivocally associated with a single, unique identifier (`ID_RESOURCE_OWNER`).

#### Rule of Authorization (Authorize):

3.1: For **every** request that targets a user-specific resource, the backend MUST perform an explicit authorization check *after* successful authentication.

3.2: This check MUST verify that `ID_SESSION_USER` (derived from the authenticated session) is identical to `ID_RESOURCE_OWNER` (associated with the resource being accessed).
    *   *Logic*: `IF ID_SESSION_USER == ID_RESOURCE_OWNER THEN Allow ELSE Deny.`

3.3: If `ID_SESSION_USER != ID_RESOURCE_OWNER`, the request MUST BE DENIED, typically with an HTTP 403 Forbidden status, regardless of the validity of `K_STATIC` or any other application-level authentication. **There are no exceptions for multi-tenant data.**

#### Rule of Least Privilege & Secure Design:

4.1: Client-side components (e.g., `index.html`, JavaScript) MUST NOT be served secrets or identifiers that are not strictly necessary for their legitimate, intended client-side operation or that grant broad, unmediated access to backend resources.
    *   *Violation Example*: Serving static, powerful API keys like `K_STATIC` directly to the client.

4.2: User-specific resource identifiers exposed to the client (if absolutely necessary) should ideally be opaque or session-relative, not direct, guessable, or globally applicable database keys if this can be avoided. This is a defense-in-depth measure, not a substitute for Rule #3.