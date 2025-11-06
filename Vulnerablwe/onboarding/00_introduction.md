# Onboarding: Welcome to the Vulnerability Testing Framework (VTF)

This series of guides will walk you through the core concepts and simulated vulnerabilities within the Vulnerability Testing Framework (VTF). Each guide builds upon the last, providing a comprehensive understanding of how client-side data exposure can lead to significant security flaws like Insecure Direct Object References (IDORs), and how these can be demonstrated using Proof-of-Concept (PoC) scripts.

**What you will learn:**

1.  **Understanding Client-Side Secret Exposure:** How applications might inadvertently leak sensitive data like API keys and User IDs on the client-side, and how to find this data using browser developer tools.
2.  **Mastering IDOR Vulnerabilities:** What IDORs are, how they relate to leaked identifiers, and how the VTF simulates IDOR testing and exploitation against its own local vulnerable backend.
3.  **Demystifying PoC Scripts:** The purpose and structure of PoC scripts, with a focus on how they are used in the VTF to demonstrate vulnerabilities by interacting with the local vulnerable server.
4.  **The Unified Exploit Toolkit & VRP Submissions:** An in-depth look at the "Definitive & Unified PoC Toolkit," a comprehensive Python script designed for a full-chain exploit demonstration, and its role in crafting a compelling Vulnerability Reward Program (VRP) submission.
5.  **Large Text Processing Pipeline:** A conceptual overview of a plan for processing and vectorizing large text files, suitable for AI training data generation or advanced Q&A systems, including memory management and performance considerations.

By the end of this onboarding, you'll have a solid grasp of these critical web security concepts and how the VTF serves as an interactive learning and simulation platform for them. The newly added local vulnerable server (`services/api/server.js`) will be a key component in making these demonstrations concrete and verifiable.