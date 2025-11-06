## Proactive Security & Secure System Design (Inspired by Section 8)

Beyond finding flaws, understanding how to build secure systems from the ground up is essential.

### Key Learnings:

*   **The Zero Trust Mandate:** The core failure simulated (IDOR via static key) was a violation of Zero Trust. `Authenticate` must always be followed by `Authorize`.

*   **Client-Side Secrets are an Architectural Failure:** Long-lived, powerful secrets should never be stored or exposed client-side.

*   **The Need for Scoped Tokens:** Short-lived, narrowly-scoped tokens (like JWTs for specific actions) are the alternative to static API keys.

*   **API Gateway as a Security Choke Point:** A secure design uses a gateway for all authentication and authorization, preventing insecure logic in microservices.

*   **Importance of Rate Limiting and Anomaly Detection:** The scalability of IDOR attacks is magnified by a lack of rate limiting. Secure systems monitor for and block anomalous behavior.

*   **Defense-in-Depth in Practice:** Security involves multiple layers: no client-side keys, secure API gateway, strict CSP, hardened GTM, backend anomaly detection.

*   **Immutable Infrastructure and Build Attestations:** Securing the CI/CD pipeline (e.g., via SLSA) prevents malicious code injection.

*   **AI as a DLP Layer:** A conceptual defense is using AI to scan the output of other AI models for PII or secrets.

*   **Statistical Analysis for Security:** Methods like Monte Carlo simulations can quantify the risk of processes like ID enumeration.

*   **The Importance of Clear and Consistent UI:** Minor UI bugs can erode trust and even become part of exploit chains.