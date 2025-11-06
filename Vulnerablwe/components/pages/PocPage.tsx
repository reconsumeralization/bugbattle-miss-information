
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PoCScript, PoCLanguage, DummyAccount, ExpectedPocOutcome, PocValidationResult } from '../../types';
import { MOCK_POC_SCRIPTS, MOCK_DUMMY_ACCOUNTS, AI_STUDIO_VULN_DESCRIPTION } from '../../constants/poc.constants';
import { SelectField } from '../common/SelectField';
import { LogViewer } from '../common/LogViewer';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { StatusIndicator } from '../common/StatusIndicator';
import { CodeBlock } from '../common/CodeBlock';
import { Modal } from '../common/Modal';

export const PocPage: React.FC = () => {
  const [pocScripts, setPocScripts] = useState<PoCScript[]>(MOCK_POC_SCRIPTS);
  const [selectedLanguage, setSelectedLanguage] = useState<PoCLanguage>(PoCLanguage.Python);
  const [overallPocOutput, setOverallPocOutput] = useState<string[]>([]);
  
  const unifiedExploitScriptNamePart = "Definitive & Unified PoC Toolkit";
  const pythonUnifiedExploit = pocScripts.find(s => s.language === PoCLanguage.Python && s.description?.includes(unifiedExploitScriptNamePart));

  const [selectedScriptDescription, setSelectedScriptDescription] = useState<string | undefined>(
    (pythonUnifiedExploit && selectedLanguage === PoCLanguage.Python) ? pythonUnifiedExploit.description : pocScripts.find(s => s.language === selectedLanguage)?.description
  );
  const [selectedScriptContent, setSelectedScriptContent] = useState<string>(
    (pythonUnifiedExploit && selectedLanguage === PoCLanguage.Python) ? pythonUnifiedExploit.content : pocScripts.find(s => s.language === selectedLanguage)?.content || ''
  );
  
  const [dummyAccounts] = useState<DummyAccount[]>(MOCK_DUMMY_ACCOUNTS);
  const [validationResults, setValidationResults] = useState<Record<string, PocValidationResult>>({});
  const [isSimulatingValidation, setIsSimulatingValidation] = useState<Record<string, boolean>>({});
  const [showExternalPocInstructions, setShowExternalPocInstructions] = useState<boolean>(false);


   useEffect(() => {
    const currentScript = pocScripts.find(s => s.language === selectedLanguage && s.description === selectedScriptDescription);
    setSelectedScriptContent(currentScript?.content || '');
  }, [selectedLanguage, selectedScriptDescription, pocScripts]); 

  useEffect(() => {
    setValidationResults({});
  }, [selectedScriptContent, selectedLanguage]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as PoCLanguage;
    setSelectedLanguage(lang);
    const firstScriptOfLang = pocScripts.find(s => s.language === lang);
    // Default to the Unified PoC Toolkit if Python is selected and no specific script is selected for Python
    if (lang === PoCLanguage.Python && pythonUnifiedExploit && (!selectedScriptDescription || !pocScripts.find(s => s.description === selectedScriptDescription && s.language === lang))) {
        setSelectedScriptDescription(pythonUnifiedExploit.description);
        setSelectedScriptContent(pythonUnifiedExploit.content);
    } else {
        setSelectedScriptDescription(firstScriptOfLang?.description);
        setSelectedScriptContent(firstScriptOfLang?.content || '');
    }
    setOverallPocOutput([]);
    setValidationResults({});
  };

  const handleScriptSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const description = e.target.value;
    const script = pocScripts.find(s => s.language === selectedLanguage && s.description === description);
    setSelectedScriptDescription(script?.description);
    setSelectedScriptContent(script?.content || '');
  };

  const toggleScriptValidationFlag = useCallback(() => {
    setPocScripts(prev => prev.map(s =>
      (s.language === selectedLanguage && s.description === selectedScriptDescription) ? { ...s, isValidated: !s.isValidated } : s
    ));
    setOverallPocOutput(prev => [...prev, `PoC script validation flag toggled for ${selectedLanguage} - ${selectedScriptDescription || 'Custom Script'}.`]);
  }, [selectedLanguage, selectedScriptDescription]);


  const simulatePocValidationWithAccount = useCallback((account: DummyAccount) => {
    if (!selectedScriptContent || !selectedScriptContent.trim()) {
        setOverallPocOutput(prev => [...prev, `[UI CONCEPTUAL SIM] Cannot validate with account ${account.name}: PoC script content is empty.`]);
        setValidationResults(prev => ({
            ...prev,
            [account.id]: { accountId: account.id, status: 'error', message: 'PoC script empty.', simulatedOutput: [] }
        }));
        return;
    }
    const currentScript = pocScripts.find(s => s.language === selectedLanguage && s.description === selectedScriptDescription);
    if (!currentScript) {
        setOverallPocOutput(prev => [...prev, `[UI CONCEPTUAL SIM ERROR] Current script context not found for validation with ${account.name}.`]);
        return;
    }

    setIsSimulatingValidation(prev => ({ ...prev, [account.id]: true }));
    setValidationResults(prev => ({
      ...prev,
      [account.id]: { accountId: account.id, status: 'pending', message: 'Simulating Validation (UI Conceptual Placeholder Replacement)...', simulatedOutput: [] }
    }));

    const initialLog = `--- UI CONCEPTUAL SIMULATION for ${selectedLanguage} PoC: "${currentScript.description || 'Custom Script'}" with account: ${account.name} (ID: ${account.mockUserId}) ---`;
    setOverallPocOutput(prev => [initialLog, ...prev].slice(0, 100));
    const validationRunLogs: string[] = [initialLog, "NOTE: This is a UI-based conceptual simulation of placeholder replacement. No actual network calls are made by this UI simulation for the Definitive Toolkit."];

    let processedPocContent = selectedScriptContent;
    const targetUrlWithUser = (account.targetUrlPlaceholder || 'https://api.example.com/users/{user_id}/default_resource').replace('{user_id}', account.mockUserId);

    // Placeholder replacement for UI simulation
    processedPocContent = processedPocContent.replace(/{api_key}/g, account.mockApiKey);
    processedPocContent = processedPocContent.replace(/{user_id}/g, account.mockUserId); 
    processedPocContent = processedPocContent.replace(/{target_url}/g, targetUrlWithUser);
    
    const attackerSimId = "ATTACKER_SIM_ID_001"; 
    processedPocContent = processedPocContent.replace(/{user_id_victim}/g, account.mockUserId);
    processedPocContent = processedPocContent.replace(/{user_id_attacker}/g, attackerSimId);
    processedPocContent = processedPocContent.replace(/{endpoint_base}/g, account.targetUrlPlaceholder || "https://alkalimakersuite-pa.clients6.google.com");
    
    const mockWizDataJsonString = JSON.stringify({
        GoogleAPIKey_Full: account.mockApiKey, 
        GoogleUserID_Full: attackerSimId, 
        InternalEndpoint_Full: (account.targetUrlPlaceholder || "https://alkalimakersuite-pa.clients6.google.com")
    });
    const escapedMockWizData = JSON.stringify(mockWizDataJsonString).slice(1, -1); 
    processedPocContent = processedPocContent.replace(/{wiz_data_json_content_mock}/g, escapedMockWizData);

    if (currentScript.language === PoCLanguage.Bash) {
         processedPocContent = processedPocContent
            .replace(/\\$USER_ID_TO_TARGET/g, account.mockUserId)
            .replace(/\\$API_KEY_TO_USE/g, account.mockApiKey)
            .replace(/\\$TARGET_URL_WITH_USER_ID/g, targetUrlWithUser);
    }
    
    validationRunLogs.push(`UI Simulating PoC script execution for account: ${account.name}`);
    validationRunLogs.push(`Target User ID: ${account.mockUserId}, API Key: ${account.mockApiKey.substring(0,10)}...`);
    validationRunLogs.push(`Target URL (Conceptual): ${targetUrlWithUser}`);
    validationRunLogs.push(`--- Simulated Script Output (from UI logic, placeholder replacement) ---`);

    const scriptOutputLines = processedPocContent.split('\\n'); 
    scriptOutputLines.forEach(line => {
      if (line.trim() && (!line.trim().startsWith('#') || line.includes("OUTPUT:")) && (!line.trim().startsWith('//') || line.includes("OUTPUT:"))) {
          validationRunLogs.push(line);
      }
    });
    validationRunLogs.push(`--- End of Simulated Script Output ---`);
    
    setTimeout(() => {
      let simulatedOutcomeFromScript: ExpectedPocOutcome = ExpectedPocOutcome.Unspecified;
      let specificOutcomeMessage = "No specific OUTPUT line found by UI simulation parser.";

      const outputLines = validationRunLogs.filter(line => line.includes("OUTPUT:"));

      if (outputLines.length > 0) {
        const successLine = outputLines.find(line => line.includes("OUTPUT: SUCCESS:"));
        const errorLine = outputLines.find(line => line.includes("OUTPUT: ERROR:"));
        const infoLine = outputLines.find(line => line.includes("OUTPUT: INFO:"));

        if (successLine) {
            simulatedOutcomeFromScript = ExpectedPocOutcome.Vulnerable;
            specificOutcomeMessage = successLine;
        } else if (errorLine) {
            simulatedOutcomeFromScript = ExpectedPocOutcome.Error;
            specificOutcomeMessage = errorLine;
        } else if (infoLine) { 
            simulatedOutcomeFromScript = ExpectedPocOutcome.NotVulnerable;
            specificOutcomeMessage = infoLine;
        }
      }
      
      // Specific logic for the Definitive Toolkit against local server
      if (currentScript.description?.includes(unifiedExploitScriptNamePart) && account.targetUrlPlaceholder?.includes("localhost")) {
          if (account.mockApiKey === "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8") { // Key for local server
              if (account.mockUserId === "112185183313702653438" || account.mockUserId === "admin_vulnerable_001") { // Victim IDs in server.js
                  simulatedOutcomeFromScript = ExpectedPocOutcome.Vulnerable;
                  specificOutcomeMessage = `UI SIM PARSED: Python PoC likely SUCCESS against local server for vulnerable ID ${account.mockUserId}. Real proof via external script.`;
              } else if (account.mockUserId === "MOCK_USER_ID_112233445566778899") { // Attacker's own ID in server.js
                  simulatedOutcomeFromScript = ExpectedPocOutcome.NotVulnerable; 
                  specificOutcomeMessage = `UI SIM PARSED: Python PoC likely INFO (own data access) for ID ${account.mockUserId} on local server. Real proof via external script.`;
              } else { // Other IDs might be 404 on local server
                   simulatedOutcomeFromScript = ExpectedPocOutcome.NotVulnerable; 
                   specificOutcomeMessage = `UI SIM PARSED: Python PoC likely INFO (e.g. 404) for ID ${account.mockUserId} on local server. Real proof via external script.`;
              }
          } else { // Wrong API key for local server
              simulatedOutcomeFromScript = ExpectedPocOutcome.Error; 
              specificOutcomeMessage = `UI SIM PARSED: Python PoC likely ERROR (auth fail) due to wrong API key for local server. Real proof via external script.`;
          }
      } else if (simulatedOutcomeFromScript === ExpectedPocOutcome.Unspecified) { // Generic fallback for other scripts
         if (account.mockApiKey === "INVALID_OR_EXPIRED_API_KEY_TOKEN_123") {
            simulatedOutcomeFromScript = ExpectedPocOutcome.Error;
            specificOutcomeMessage = `Implicit Error: API key ${account.mockApiKey} likely caused error.`;
        } else if ((account.mockUserId === "admin_vulnerable_001" || account.mockUserId === "user_unexp_vuln_004")) {
            simulatedOutcomeFromScript = ExpectedPocOutcome.Vulnerable;
            specificOutcomeMessage = `Implicit Success: User ${account.mockUserId} is likely vulnerable.`;
        }
      }

      validationRunLogs.push(`[UI CONCEPTUAL SIM PARSED] Outcome hint: ${specificOutcomeMessage}`);
      let resultStatus: PocValidationResult['status'];
      let resultMessage: string;

      if (simulatedOutcomeFromScript === ExpectedPocOutcome.Unspecified && account.expectedOutcome !== ExpectedPocOutcome.Unspecified) {
        resultStatus = 'failure';
        resultMessage = `Failure: UI Sim yielded unspecified outcome, but expected ${account.expectedOutcome}.`;
      } else if (simulatedOutcomeFromScript === account.expectedOutcome) {
        resultStatus = 'success';
        resultMessage = `Success: UI Sim PoC behaved as expected (Outcome: ${simulatedOutcomeFromScript}).`;
      } else {
        resultStatus = 'failure';
        resultMessage = `Failure: UI Sim PoC outcome (\`${simulatedOutcomeFromScript}\`) did not match expected (\`${account.expectedOutcome}\`).`;
      }

      validationRunLogs.push(`Expected PoC Outcome: ${account.expectedOutcome}, Actual Simulated Script Outcome: ${simulatedOutcomeFromScript}`);
      validationRunLogs.push(`Validation Result (UI Conceptual Sim): ${resultStatus.toUpperCase()} - ${resultMessage}`);
      validationRunLogs.push(`--- UI Conceptual Validation finished for ${account.name} ---`);

      setOverallPocOutput(prev => [...validationRunLogs.slice(1), ...prev].slice(0,200)); 
      setValidationResults(prev => ({
        ...prev,
        [account.id]: { accountId: account.id, status: resultStatus, message: resultMessage, simulatedOutput: validationRunLogs }
      }));
      setIsSimulatingValidation(prevLoading => ({ ...prevLoading, [account.id]: false }));
    }, 2500);
  }, [selectedScriptContent, selectedLanguage, selectedScriptDescription, pocScripts, dummyAccounts, unifiedExploitScriptNamePart]);

  const languageOptions = Object.values(PoCLanguage).map(lang => ({ value: lang, label: lang }));
  const scriptsForSelectedLanguage = pocScripts.filter(s => s.language === selectedLanguage);
  const currentActualScript = pocScripts.find(s => s.language === selectedLanguage && s.description === selectedScriptDescription);

  const isDefinitiveToolkitSelected = currentActualScript?.description?.includes(unifiedExploitScriptNamePart);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface">PoC Development & Validation</h2>

      <Card title="Vulnerability Scenario & Real Proof Instructions">
        <div className="prose prose-sm prose-invert max-w-none text-on-surface-muted" dangerouslySetInnerHTML={{ __html: AI_STUDIO_VULN_DESCRIPTION.replace(/\\n/g, '<br />').replace(/\\`/g, '`') }}></div>
         <div className="mt-4 text-sm text-yellow-300 bg-yellow-900/50 p-3 rounded-md">
            <p className="font-bold">Important: Achieving Real Proof</p>
            <p className="mt-1">
                The UI simulations below help understand script logic and placeholder replacement.
                For **actual vulnerability verification** of the IDOR, use the "Definitive & Unified PoC Toolkit" (Python script).
            </p>
            <p className="mt-2">
                Click the **"Show External Execution Instructions"** button (available when the Python Definitive Toolkit is selected) for detailed steps.
                This involves running the Python script from your terminal against the local vulnerable server (`services/api/server.js`).
                Ensure the local server is running: <code>cd services/api && npm install && npm start</code>.
            </p>
            <p className="mt-2">
                The full Python script is also available on the "VRP Submission Preview" page.
            </p>
          </div>
      </Card>

      <Card title="Select PoC Language & Script Template">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SelectField
            label="PoC Language"
            options={languageOptions}
            value={selectedLanguage}
            onChange={handleLanguageChange}
          />
          {scriptsForSelectedLanguage.length > 0 && (
            <SelectField
              label="Select Script Template"
              options={scriptsForSelectedLanguage.map(s => ({ value: s.description || s.content.substring(0,50), label: s.description || s.language + " PoC" }))}
              value={selectedScriptDescription || (scriptsForSelectedLanguage[0]?.description || scriptsForSelectedLanguage[0]?.content.substring(0,50))}
              onChange={handleScriptSelectionChange}
            />
          )}
        </div>
        {currentActualScript && (
          <div>
            <p className="text-xs text-on-surface-muted mb-1">
                {currentActualScript.description || `Review the ${selectedLanguage} script below.`}
            </p>
            <CodeBlock 
                code={selectedScriptContent} 
                language={currentActualScript.language.toLowerCase() as 'python' | 'javascript' | 'bash'}
                className="max-h-[500px] overflow-y-auto"
            />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ToggleSwitch
                label="Mark Script as Validated (Conceptual Syntax/Logic)"
                enabled={!!currentActualScript?.isValidated}
                onChange={toggleScriptValidationFlag}
                description="Manually flag if the PoC script's general structure seems sound."
              />
              {isDefinitiveToolkitSelected ? (
                <Button 
                    onClick={() => setShowExternalPocInstructions(true)}
                    variant="secondary"
                    title="Show instructions for running the definitive Python PoC externally for real proof."
                >
                    Show External Execution Instructions
                </Button>
              ) : (
                <Button 
                    onClick={() => { 
                        setOverallPocOutput([`[UI CONCEPTUAL SIM] Generic run for script "${currentActualScript.description || 'Custom'}". This does not make network calls.`]);
                    }} 
                    title="Run general UI-based simulation (no real network calls)"
                >
                    Run Conceptual UI Sim
                </Button>
              )}
            </div>
          </div>
        )}
         {(!selectedScriptContent || !selectedScriptContent.trim()) && !currentActualScript && (
            <p className="text-on-surface-muted p-3 bg-gray-800 rounded-md">Please select a language/template to view or simulate script logic.</p>
        )}
      </Card>

      {selectedScriptContent && selectedScriptContent.trim() && !isDefinitiveToolkitSelected && ( // Only show dummy accounts for non-definitive scripts for now
        <Card title="Dummy Account Validation (UI Conceptual Simulation)">
          <p className="text-sm text-on-surface-muted mb-1">
            Conceptually test the current <strong>{selectedLanguage}</strong> PoC script template (<em>{selectedScriptDescription || "Custom"}</em>) against predefined dummy accounts.
            The UI will substitute placeholders. This is a client-side simulation to understand script behavior.
          </p>
          {dummyAccounts.length === 0 && <p>No dummy accounts configured.</p>}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {dummyAccounts.map(account => (
              <div key={account.id} className="p-3 bg-gray-700 rounded-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                  <div>
                    <h4 className="font-semibold text-primary">{account.name}</h4>
                    <p className="text-xs text-on-surface-muted">Target User ID: {account.mockUserId}, API Key Hint: {account.mockApiKey.substring(0,5)}...</p>
                    <p className="text-xs text-on-surface-muted">Expected PoC Outcome: {account.expectedOutcome}</p>
                    <p className="text-xs text-on-surface-muted mt-1">{account.description}</p>
                     {account.targetUrlPlaceholder && <p className="text-xs text-cyan-400 mt-1">Conceptual Target: {account.targetUrlPlaceholder.replace('{user_id}', account.mockUserId)}</p>}
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-2 flex flex-col items-start sm:items-end space-y-2">
                     <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulatePocValidationWithAccount(account)}
                        isLoading={isSimulatingValidation[account.id]}
                        disabled={isSimulatingValidation[account.id] || !selectedScriptContent.trim()}
                        title="Run UI-based conceptual simulation with this account's values"
                      >
                        Conceptual Sim with Account
                      </Button>
                      {validationResults[account.id] && (
                        <StatusIndicator
                            status={validationResults[account.id]?.status === 'success' ? 'Success' : validationResults[account.id]?.status === 'failure' ? 'Failure' : validationResults[account.id]?.status === 'error' ? 'Warning' : 'Pending'}
                            text={validationResults[account.id]?.message}
                            size="sm"
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(overallPocOutput.length > 0) && (
        <Card title="PoC UI Conceptual Simulation & Validation Log">
          <LogViewer logs={overallPocOutput} maxHeight="400px" />
        </Card>
      )}
      
      <Modal isOpen={showExternalPocInstructions} onClose={() => setShowExternalPocInstructions(false)} title="External Python PoC Execution Instructions">
        <div className="text-sm text-on-surface-muted space-y-3 max-h-[70vh] overflow-y-auto">
            <p className="font-bold text-lg text-primary">Achieving Real Proof of IDOR Vulnerability</p>
            <p>To provide concrete, verifiable evidence of the IDOR vulnerability, you must run the "Definitive & Unified PoC Toolkit" Python script externally from your terminal. This script will interact with the local vulnerable server (`services/api/server.js`) included in this VTF.</p>
            
            <p className="font-semibold mt-2">Steps:</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>
                    <strong>Copy the Python Script:</strong>
                    <p className="text-xs">The full "Definitive & Unified PoC Toolkit" script is provided on the "VRP Submission Preview" page. You can also find it in the codebase at `constants/vrp_submission.constants.ts` (within `DEFINITIVE_VRP_SUBMISSION_TEXT`). Copy its content into a new file named `Unified-Exploit-Full-Chain.py` on your local machine.</p>
                </li>
                <li>
                    <strong>Install Prerequisites:</strong>
                    <p className="text-xs">If you haven't already, install the required Python libraries:</p>
                    <CodeBlock code="pip install requests pandas matplotlib seaborn numpy" language="bash" className="text-xs" />
                </li>
                <li>
                    <strong>Start the Local Vulnerable Server:</strong>
                    <p className="text-xs">Open a new terminal, navigate to the VTF project's `services/api` directory, and run:</p>
                    <CodeBlock code="npm install\nnpm start" language="bash" className="text-xs" />
                    <p className="text-xs">The server should start on `http://localhost:3001` (or as configured in `services/api/.env.development`). This server simulates the vulnerable backend.</p>
                </li>
                 <li>
                    <strong>(Optional) Prepare `wiz_data.json` for Attacker Details:</strong>
                    <p className="text-xs">
                        If you want the script to auto-extract your "attacker" API key and User ID for targeting the local server (or a remote one, with caution):
                        Log into this VTF application. Open your browser's developer console and type:
                        <code>copy(JSON.stringify(window.WIZ_global_data))</code>. Paste this into a file named <code>wiz_data.json</code> in the same directory as your Python script.
                        The script will use `MOCK_USER_ID_112233445566778899` and the static API key from this mock data if arguments are not provided.
                    </p>
                </li>
                <li>
                    <strong>Run the Python PoC Script (Exploit Mode against Local Server):</strong>
                    <p className="text-xs">Open another terminal, navigate to where you saved `Unified-Exploit-Full-Chain.py`. An example command to target the local server is:</p>
                    <CodeBlock 
                        code={'python Unified-Exploit-Full-Chain.py exploit \\\n' +
                              '  --victim-id "112185183313702653438" \\\n' + // Victim ID from server.js
                              '  --local-api-url http://localhost:3001 \\\n' +
                              '  --api-key "AIzaSyBMkT3C6wEWAJmpaF6WXKs1W9CThdaYuq8" \\\n' + // Static API key from server.js & WIZ_global_data
                              '  --attacker-id "MOCK_USER_ID_112233445566778899"'} // Attacker ID from server.js or WIZ_global_data
                        language="bash"
                        className="text-xs"
                    />
                    <ul className="list-disc list-inside text-xs ml-4 mt-1">
                        <li>The `--victim-id` should be one of the user IDs defined in `services/api/server.js`'s `USER_PROMPTS_DB` (e.g., "112185183313702653438" or "admin_vulnerable_001").</li>
                        <li>The `--api-key` is the static key used by `server.js`.</li>
                        <li>The `--attacker-id` is used by the script to first test fetching its own data.</li>
                        <li>You can use `--wiz-file path/to/your/wiz_data.json` to let the script attempt auto-extraction of attacker API key, ID, and remote endpoint, but for local testing, providing explicit args with `--local-api-url` is clearest.</li>
                        <li>Refer to the script's `--help` output for all options and detailed explanations.</li>
                    </ul>
                </li>
                <li>
                    <strong>Observe Output:</strong>
                    <p className="text-xs">The Python script will print its actions, API calls, and if successful, the exfiltrated data from the victim ID on the local server. This output constitutes your **real proof** of the IDOR vulnerability.</p>
                </li>
            </ol>
            <p className="mt-4 text-yellow-400 bg-yellow-900/40 p-2 rounded-md text-xs">
                <strong>This external execution provides concrete, verifiable evidence</strong> by interacting with the actual (though mock) vulnerable backend, demonstrating the full impact of the client-side secret exposure and server-side authorization flaw.
            </p>
        </div>
         <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowExternalPocInstructions(false)}>Close</Button>
        </div>
      </Modal>

    </div>
  );
};