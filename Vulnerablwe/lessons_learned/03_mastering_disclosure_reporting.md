## Mastering Vulnerability Disclosure & Reporting (Inspired by Section 7)

Effectively communicating vulnerabilities is as important as finding them. This section covers lessons in disclosure and reporting.

### Key Learnings:

*   **The Evolution of a PoC:** Witnessing the lifecycle from a text description to a formal logical proof, and finally to a comprehensive, automated toolkit.

*   **The "Money Shot" is Non-Negotiable:** VRPs need undeniable proof of impact (e.g., the `curl` command or Python script successfully fetching victim data).

*   **Structured Reporting is King:** Clear headings (Summary, PoC, Impact, Mitigation) are more effective than long narratives.

*   **Anticipate and Rebut:** Preemptively address potential counter-arguments (e.g., analyzing the "physically local attack" threat model).

*   **Speak the Language of Risk (CWE, CVSS):** Referencing standard frameworks translates technical findings into universal risk language.

*   **Benchmark Against Precedent:** Citing previously rewarded similar bugs builds an objective, data-driven case for severity.

*   **Importance of Safe Harbor:** Demonstrating exploits and adhering to Safe Harbor are not mutually exclusive. PoCs can be designed to be responsible yet powerful.

*   **Automate the Evidence:** The best PoC automates the evidence-gathering process for the VRP analyst, making their job easier.

*   **Clarity through Abstraction (e.g., Mixins):** Structuring complex code (like PoCs) with abstractions enhances clarity and credibility.

*   **Professional Communication:** Professionalism, conciseness, and a focus on facts are crucial for building credibility.