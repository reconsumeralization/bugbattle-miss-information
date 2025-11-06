// A simulated backend server to demonstrate the IDOR vulnerability.
require('dotenv').config({ path: './.env.development' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Mock Database ---
// Contains private data for different users.
const USER_PROMPTS_DB = {
  // Attacker's User ID (from wiz_data.json - S06Grb)
  "MOCK_USER_ID_112233445566778899": { // Matches MOCK_USER_ID_112233445566778899 from index.html (S06Grb)
    prompts: [{ id: "prompt-att-1", name: "My vacation plans", content: "Plan a trip to Hawaii." }]
  },
  // Victim's User ID (from our PoC script and VRP addendum)
  "112185183313702653438": { 
    prompts: [
      { id: "prompt-vic-1", name: "Q3 Business Strategy", content: "Draft a memo for the new marketing campaign." },
      { id: "prompt-vic-2", name: "Super Secret Project", content: "My private key is sk-live-abcdefghijklmnopqrstuvwx. Use it to deploy the prototype." }
    ]
  },
  // Victim ID from DummyAccounts in PoC constants
   "admin_vulnerable_001": { 
    prompts: [
        { id: "prompt-admin-v1", text: "Admin special notes - contains secondary_api_key_for_admin_blah_blah" },
    ]
  },
  // Another victim ID that can be used for testing
  "user_unexp_vuln_004": {
    prompts: [
        { id: "prompt-uuv-1", text: "Ultra confidential merger details for Project Skyfall."}
    ]
  }
};

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// --- Authentication Middleware (The "Correct" Part) ---
// This middleware checks for the static API key.
// A real application would have more robust auth, but this simulates the first gate.
const checkApiKey = (req, res, next) => {
  const apiKey = req.get('X-Goog-Api-Key'); // PoC script uses this header
  // Static API Key from window.WIZ_global_data.PeqOqb
  if (apiKey && apiKey === 'AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8') {
    return next(); // Key is valid, proceed.
  }
  // Key is missing or invalid
  res.status(401).send({ error: 'Authentication failure: Invalid API Key.' });
};

// --- The Vulnerable API Endpoint ---
// Path matches what the real frontend would call, e.g., CoJqbf + /_/MakerSuite/v1/users/...
app.get('/_/MakerSuite/v1/users/:userId/prompts', checkApiKey, (req, res) => {
  const requestedUserId = req.params.userId;
  
  console.log(`[LOG] Vulnerable Server: Received request for user ID: ${requestedUserId}`);

  // =========================================================================
  // !!! THE IDOR / BOLA VULNERABILITY IS HERE !!!
  // The server correctly authenticated the request with \`checkApiKey\`,
  // but it FAILS TO AUTHORIZE if the requester is allowed to see this data.
  // It blindly trusts the \`userId\` from the URL.
  // An attacker can substitute their own ID with a victim's ID to steal data.
  // =========================================================================

  const userData = USER_PROMPTS_DB[requestedUserId];

  if (userData) {
    console.log(`[LOG] Vulnerable Server: [SUCCESS] Found and returned data for user ${requestedUserId}. (IDOR Successful)`);
    res.status(200).json(userData);
  } else {
    console.log(`[LOG] Vulnerable Server: [NOT FOUND] No data found for user ${requestedUserId}.`);
    res.status(404).send({ error: 'User data not found.' });
  }
});


app.listen(PORT, () => {
  console.log(`Vulnerable API server simulation running on http://localhost:${PORT}`);
  console.log('Static API Key for testing (X-Goog-Api-Key): AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8');
  console.log('Mock data available for User IDs:', Object.keys(USER_PROMPTS_DB).join(', '));
});