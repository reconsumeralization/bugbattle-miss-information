// types/apiTypes.ts
import { User, TestPlanType as AppTestPlanType, Report as AppReport, ScannerType } from '../types';

export interface LoginRequest {
  email?: string; // Optional if using API key
  password?: string; // Optional if using API key
  apiKey?: string; // For hunt-to-login
  userId?: string; // For hunt-to-login
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface UserProfile extends User {
  preferences?: Record<string, any>;
  lastLogin?: string;
}

// More specific types for services
export type ApiTestPlan = AppTestPlanType;
export type ApiReport = AppReport;


export interface GeminiTextRequest {
    text: string;
    config?: Record<string, any>;
}
export interface GeminiTextResponse {
    analyzedText: string;
    insights: Record<string, any>;
}

export interface GeminiImageRequest {
    prompt: string;
    config?: Record<string, any>;
}
export interface GeminiImageResponse {
    imageUrl: string; // mock image URL
    promptUsed: string;
}

// Scanner related API types
export type ApiScannerType = ScannerType; // Use the main ScannerType enum

export interface ApiScannerStatus {
    type: ApiScannerType;
    isRunning: boolean;
    lastRun: Date | string | null; // Date can be string from API
    log: string[];
    progress?: number; // 0-100. Optional as not all scanners might report progress.
    resultsSummary?: string;
}

export interface StartScannerRequest {
    type: ApiScannerType;
    params?: Record<string, any>; // Optional parameters for the scanner
}

// For AI File Analysis Demo
export interface GeminiFileAnalysisRequest {
    fileName: string;
    fileContent: string;
}

export interface GeminiFileAnalysisResponse {
    findings: string[];
    summary: string;
    fileName: string;
}

// For AI PoC Generation Demo
export interface GeminiPocGenRequest {
    vulnerabilityType: 'idor-local' | 'client-secret-extraction'; // Add more as needed
    targetUrl?: string; // Optional, might be inferred
    apiKey?: string; // Optional, might be inferred or hardcoded in PoC
}

export interface GeminiPocGenResponse {
    generatedPocScript: string; // The Python code
    description: string;        // Description of what the PoC does
    executionHints: string;     // How to run it, prerequisites
    vulnerabilityType: 'idor-local' | 'client-secret-extraction';
}