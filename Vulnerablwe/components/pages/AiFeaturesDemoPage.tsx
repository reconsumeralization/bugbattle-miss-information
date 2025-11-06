
// components/pages/AiFeaturesDemoPage.tsx
import React, { useState, useCallback } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TextareaField } from '../common/TextareaField';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { geminiService } from '../../services/gemini.service';
import { 
    GeminiTextResponse, 
    GeminiImageResponse, 
    GeminiFileAnalysisResponse,
    GeminiPocGenResponse,
    GeminiPocGenRequest
} from '../../types/apiTypes';
import { LogViewer } from '../common/LogViewer';
import { CodeBlock } from '../common/CodeBlock';

export const AiFeaturesDemoPage: React.FC = () => {
  const [textToAnalyze, setTextToAnalyze] = useState<string>("This is a sample text for analysis by the simulated Gemini model. It mentions happiness and some keywords.");
  const [imagePrompt, setImagePrompt] = useState<string>("A futuristic cityscape with flying cars");
  
  const [textAnalysisResult, setTextAnalysisResult] = useState<GeminiTextResponse | null>(null);
  const [imageGenerationResult, setImageGenerationResult] = useState<GeminiImageResponse | null>(null);
  
  const [isAnalyzingText, setIsAnalyzingText] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileAnalysisResult, setFileAnalysisResult] = useState<GeminiFileAnalysisResponse | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [selectedVulnerabilityType, setSelectedVulnerabilityType] = useState<GeminiPocGenRequest['vulnerabilityType']>('idor-local');
  const [pocGenerationResult, setPocGenerationResult] = useState<GeminiPocGenResponse | null>(null);
  const [isGeneratingPoc, setIsGeneratingPoc] = useState<boolean>(false);
  const [pocError, setPocError] = useState<string | null>(null);


  const handleAnalyzeText = async () => {
    setIsAnalyzingText(true);
    setError(null);
    setTextAnalysisResult(null);
    try {
      const response = await geminiService.simulateGeminiTextAnalysis({ text: textToAnalyze });
      if (response.success && response.data) {
        setTextAnalysisResult(response.data);
      } else {
        setError(response.error?.message || "Text analysis failed.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during text analysis.");
    } finally {
      setIsAnalyzingText(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setError(null);
    setImageGenerationResult(null);
    try {
      const response = await geminiService.simulateGeminiImageGeneration({ prompt: imagePrompt });
      if (response.success && response.data) {
        setImageGenerationResult(response.data);
      } else {
        setError(response.error?.message || "Image generation failed.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during image generation.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileAnalysisResult(null);
    setFileError(null);
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAnalyzeFile = useCallback(async () => {
    if (!selectedFile) {
      setFileError("Please select a file first.");
      return;
    }
    setIsAnalyzingFile(true);
    setFileError(null);
    setFileAnalysisResult(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string;
        if (!fileContent) throw new Error("File content could not be read.");
        const response = await geminiService.simulateGeminiFileAnalysis({ fileName: selectedFile.name, fileContent });
        if (response.success && response.data) setFileAnalysisResult(response.data);
        else setFileError(response.error?.message || "File analysis failed.");
      } catch (err: any) { setFileError(err.message || "An error occurred during file analysis."); } 
      finally { setIsAnalyzingFile(false); }
    };
    reader.onerror = () => { setFileError("Failed to read file."); setIsAnalyzingFile(false); };
    reader.readAsText(selectedFile);
  }, [selectedFile]);

  const handleGeneratePoc = useCallback(async () => {
    setIsGeneratingPoc(true);
    setPocError(null);
    setPocGenerationResult(null);
    try {
      const response = await geminiService.simulateGeminiPocGeneration({ 
          vulnerabilityType: selectedVulnerabilityType,
          targetUrl: selectedVulnerabilityType === 'idor-local' ? 'http://localhost:3001' : undefined 
      });
      if (response.success && response.data) setPocGenerationResult(response.data);
      else setPocError(response.error?.message || "PoC generation failed.");
    } catch (e: any) { setPocError(e.message || "An error occurred during PoC generation."); } 
    finally { setIsGeneratingPoc(false); }
  }, [selectedVulnerabilityType]);

  const vulnerabilityTypeOptions: { label: string; value: GeminiPocGenRequest['vulnerabilityType'] }[] = [
    { label: "IDOR against Local Server (services/api/server.js)", value: "idor-local" },
    { label: "Client-Side Secret Extraction (from window.WIZ_global_data)", value: "client-secret-extraction" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface">Simulated Gemini AI Features</h2>
      <Card title="Important Disclaimer: All Features on This Page are SIMULATIONS" className="border-yellow-500 border-2 bg-yellow-900/30">
        <p className="text-yellow-300 text-sm">
          The features presented below are **client-side simulations** designed to conceptually demonstrate how AI *could* be used for various tasks, including security analysis and Proof-of-Concept (PoC) script generation.
        </p>
        <p className="text-yellow-300 text-sm mt-2">
          **No Real AI Calls:** These demos **do not make any actual calls to live Google Gemini API endpoints.** All responses and generated content are pre-defined or created by mock logic within this frontend application. The purpose is to illustrate potential AI applications in security without incurring API costs or requiring API key setup for this VTF.
        </p>
        <p className="text-yellow-300 text-sm mt-2">
          **API Key Security for Real Integration:** To use the actual Gemini API (e.g., with <code>@google/genai</code> SDK for real analysis or PoC generation), a secure backend service is essential. This backend would be responsible for managing the <code>process.env.API_KEY</code>, making requests to Google's services, and then relaying responses to the client. **API keys must never be exposed or used directly in client-side code.**
        </p>
         <p className="text-yellow-300 text-sm mt-2">
          **PoC Script Generation & Execution:** Any PoC scripts "generated" here are conceptual and produced by pre-defined templates. For actual vulnerability verification (e.g., the IDOR PoC against `services/api/server.js`), such scripts (especially Python) should be carefully reviewed and **run externally from your terminal**, targeting the appropriate environment. This provides real proof, whereas the generation here is illustrative of AI's potential role.
        </p>
      </Card>

      {error && <Card title="Error" className="bg-red-900 border-red-700"><p className="text-red-300">{error}</p></Card>}
      {fileError && <Card title="File Analysis Error" className="bg-red-900 border-red-700"><p className="text-red-300">{fileError}</p></Card>}
      {pocError && <Card title="PoC Generation Error" className="bg-red-900 border-red-700"><p className="text-red-300">{pocError}</p></Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Text Analysis (Simulated)">
          <TextareaField label="Text to Analyze" value={textToAnalyze} onChange={(e) => setTextToAnalyze(e.target.value)} rows={5} containerClassName="mb-3"/>
          <Button onClick={handleAnalyzeText} isLoading={isAnalyzingText} disabled={isAnalyzingText}>Analyze Text (Simulated)</Button>
          {textAnalysisResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <h4 className="font-semibold text-primary mb-2">Analysis Result:</h4>
              <p className="text-sm text-on-surface-muted whitespace-pre-wrap"><strong>Analyzed Text (Simulated):</strong> {textAnalysisResult.analyzedText}</p>
              <LogViewer logs={[JSON.stringify(textAnalysisResult.insights, null, 2)]} title="Simulated Insights" maxHeight="200px"/>
            </div>
          )}
        </Card>

        <Card title="Image Generation (Simulated)">
          <InputField label="Image Prompt" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} containerClassName="mb-3"/>
          <Button onClick={handleGenerateImage} isLoading={isGeneratingImage} disabled={isGeneratingImage}>Generate Image (Simulated)</Button>
          {imageGenerationResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <h4 className="font-semibold text-primary mb-2">Generated Image:</h4>
              <p className="text-sm text-on-surface-muted mb-2"><strong>Prompt Used:</strong> {imageGenerationResult.promptUsed}</p>
              <img src={imageGenerationResult.imageUrl} alt="Simulated generated image" className="rounded-md border border-gray-600 max-w-full h-auto"/>
            </div>
          )}
        </Card>
      </div>

      <Card title="File Vulnerability Analysis (Simulated AI - Large Context Concept)">
        <p className="text-sm text-on-surface-muted mb-3">
          Upload a JavaScript, HTML, or similar text-based file (e.g., <code>gtm-loader.js</code>, <code>services/api/server.js</code>, <code>index.html</code> from this VTF project).
          The simulated AI will "analyze" its content for potential vulnerabilities based on known patterns within this VTF. This is a conceptual demonstration of how a large context window might be used.
        </p>
        <InputField label="Select File for Analysis" type="file" onChange={handleFileChange} accept=".js,.html,.md,.json,.txt" containerClassName="mb-3"/>
        {selectedFile && <p className="text-sm text-on-surface-muted mb-3">Selected file: <strong>{selectedFile.name}</strong></p>}
        <Button onClick={handleAnalyzeFile} isLoading={isAnalyzingFile} disabled={isAnalyzingFile || !selectedFile}>Analyze File (Simulated AI)</Button>
        {fileAnalysisResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
                <h4 className="font-semibold text-primary mb-1">Simulated AI Analysis Report for: {fileAnalysisResult.fileName}</h4>
                <p className="text-sm text-on-surface-muted mb-2"><strong>Summary:</strong> {fileAnalysisResult.summary}</p>
                <LogViewer logs={fileAnalysisResult.findings} title="Potential Findings (Simulated)" maxHeight="250px"/>
            </div>
        )}
      </Card>

      <Card title="AI-Powered PoC Generation (Conceptual Simulation)">
        <p className="text-sm text-on-surface-muted mb-3">
          Select a vulnerability type relevant to this VTF. The simulated AI will "generate" a conceptual Python PoC script.
          This illustrates how AI might assist in security testing. The generated script is pre-defined for this demo.
          <strong className="block mt-1 text-yellow-400">For actual verification, this script MUST be reviewed and run externally (e.g., from your terminal against the local vulnerable server `services/api/server.js`).</strong>
        </p>
        <SelectField label="Select Vulnerability Type" options={vulnerabilityTypeOptions} value={selectedVulnerabilityType} onChange={(e) => setSelectedVulnerabilityType(e.target.value as GeminiPocGenRequest['vulnerabilityType'])} containerClassName="mb-3"/>
        <Button onClick={handleGeneratePoc} isLoading={isGeneratingPoc} disabled={isGeneratingPoc}>Generate Python PoC (Simulated AI)</Button>
        {pocGenerationResult && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
                <h4 className="font-semibold text-primary mb-1">Simulated AI PoC Generation Result for: {pocGenerationResult.vulnerabilityType}</h4>
                <p className="text-sm text-on-surface-muted mt-2 mb-1"><strong>PoC Description:</strong> {pocGenerationResult.description}</p>
                <p className="text-sm text-on-surface-muted mb-2"><strong>Execution Hints (for external use):</strong> {pocGenerationResult.executionHints}</p>
                <h5 className="text-md font-semibold text-on-surface-muted my-2">Generated Python PoC Script (Review and Run Externally):</h5>
                <CodeBlock language="python" code={pocGenerationResult.generatedPocScript} />
            </div>
        )}
      </Card>
    </div>
  );
};