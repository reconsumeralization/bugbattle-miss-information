
// services/scanner.service.ts
import { apiClient } from './apiClient';
import { ApiScannerStatus, StartScannerRequest, ApiScannerType } from '../types/apiTypes';
import { ApiResponse, ScannerType } from '../types'; // Import ScannerType
import { simulatePatternAwareEnumeration, simulateSecondarySecretExtraction } from '../constants/poc.constants';


// In-memory store for scanner statuses for simulation
const scannerStates: Record<string, ApiScannerStatus> = {}; 
// Record<ScannerType string, ApiScannerStatus> - but ScannerType could be dynamic.
// Using a string key for simplicity in simulation. We'll use scannerType.toString() as key.

export const scannerService = {
  startScanner: async (request: StartScannerRequest): Promise<ApiResponse<ApiScannerStatus>> => {
    console.log('[ScannerService] Starting scanner:', request);
    const scannerKey = request.type.toString();

    if (scannerStates[scannerKey]?.isRunning) {
      return { success: false, error: { message: `${request.type} is already running.` } };
    }

    const initialStatus: ApiScannerStatus = {
      type: request.type, 
      isRunning: true,
      lastRun: scannerStates[scannerKey]?.lastRun || null,
      log: [`[${new Date().toLocaleTimeString()}] Starting ${request.type}...`],
      progress: 0,
      resultsSummary: 'Scan in progress...'
    };
    scannerStates[scannerKey] = initialStatus;

    // Simulate async scan process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      const currentLogs = scannerStates[scannerKey]?.log || [];
      const newLogEntry = `[${new Date().toLocaleTimeString()}] Processing... ${currentProgress}% complete.`;
      
      if (currentProgress <= 100) {
        scannerStates[scannerKey] = {
          ...initialStatus,
          ...scannerStates[scannerKey], 
          log: [...currentLogs, newLogEntry].slice(-10), 
          progress: currentProgress,
        };
      } else {
        clearInterval(interval);
        let finalMessage = `${request.type} finished.`;
        let resultsSummary = "Simulated scan complete. No critical issues found in default run.";

        // Simulate specific scanner logic results
        if (request.type === ScannerType.IdorEnum) { 
            const seedIds = request.params?.seedIds || []; // Handle potentially undefined or empty seedIds
            const radius = request.params?.radius || 3;
            if (seedIds.length === 0) {
                 finalMessage += " No seed IDs provided. Used default simulation for enumeration.";
                 resultsSummary = "IDOR Enum: No seed IDs. Mocked 5 candidate IDs (e.g., 1000-1004).";
                 // Simulate some default output if no seeds
                 scannerStates[scannerKey].log.push("Defaulting to mock enumeration as no seed IDs were input.");

            } else {
                const enumResult = simulatePatternAwareEnumeration(seedIds, radius);
                finalMessage += ` Enumerated ${enumResult.candidateIds.length} IDs. Pattern: ${JSON.stringify(enumResult.patternDetails)}.`;
                resultsSummary = `IDOR Enum: Found ${enumResult.candidateIds.length} candidates. Details: ${JSON.stringify(enumResult.patternDetails, null, 2)}`;
            }
        } else if (request.type === ScannerType.ContentAnalyzer) { 
            const contentText = request.params?.contentText || "";
            if (!contentText.trim()) {
                finalMessage += " No text provided for content analysis.";
                resultsSummary = "Content Analysis: No text provided.";
            } else {
                const secExResult = simulateSecondarySecretExtraction(contentText);
                finalMessage += ` Analyzed content. Found ${secExResult.length} potential secondary secrets.`;
                resultsSummary = `Content Analysis: Found ${secExResult.length} secondary secrets. Example: ${secExResult[0]?.type || 'N/A'}`;
            }
        }


        scannerStates[scannerKey] = {
          ...initialStatus,
          ...scannerStates[scannerKey],
          isRunning: false,
          lastRun: new Date(),
          log: [...(scannerStates[scannerKey]?.log || []), newLogEntry, `[${new Date().toLocaleTimeString()}] ${finalMessage}`].slice(-10),
          progress: 100,
          resultsSummary: resultsSummary,
        };
        console.log(`[ScannerService] ${request.type} finished.`);
      }
    }, 500); 

    return { success: true, data: { ...scannerStates[scannerKey] } };
  },

  getScannerStatus: async (type: ApiScannerType): Promise<ApiResponse<ApiScannerStatus | null>> => {
    const scannerKey = type.toString();
    const status = scannerStates[scannerKey];
    
    await new Promise(resolve => setTimeout(resolve, 50)); 

    if (status) {
      return { success: true, data: { ...status } }; 
    } else {
      const defaultStatus: ApiScannerStatus = {
        type: type, 
        isRunning: false,
        lastRun: null,
        log: [`[${new Date().toLocaleTimeString()}] Scanner ${type} is idle. Never run.`],
        progress: 0,
        resultsSummary: "Scanner has not been run yet."
      };
      return { success: true, data: defaultStatus };
    }
  },

  getAllScannerStatuses: async (): Promise<ApiResponse<ApiScannerStatus[]>> => {
    console.log('[ScannerService] Getting all scanner statuses...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const allKnownScannerTypes: ScannerType[] = Object.values(ScannerType);

    const allStatuses: ApiScannerStatus[] = allKnownScannerTypes.map((typeValue: ScannerType) => {
      const key = typeValue.toString(); 
      if (scannerStates[key]) {
        return { ...scannerStates[key] };
      }
      return {
        type: typeValue, 
        isRunning: false,
        lastRun: null,
        log: [`[${new Date().toLocaleTimeString()}] Scanner ${typeValue} is idle. Never run.`],
        progress: 0,
        resultsSummary: "Scanner has not been run yet."
      };
    });
    
    return { success: true, data: allStatuses };
  }
};
