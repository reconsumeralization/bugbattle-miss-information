
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { EvidenceItem, Report, ApiResponse } from '../../types';
import { ApiReport } from '../../types/apiTypes';
import { Modal } from '../common/Modal'; 
import { LogViewer } from '../common/LogViewer';
import { vrpSubmissionService } from '../../services/vrpSubmission.service'; // New service

const createMockEvidence = (): EvidenceItem[] => [
  { id: 'ev_mock_001', timestamp: new Date(Date.now() - 100000), type: 'HTTP Log', description: 'Request to /api/users/123 (mock)', data: 'GET /api/users/123 HTTP/1.1\\nHost: example.com\\nAuthorization: Bearer mock_token_valid_for_123_but_accessing_456' },
  { id: 'ev_mock_002', timestamp: new Date(Date.now() - 200000), type: 'JSON Diff', description: 'Profile data mismatch for user 456 (mock)', data: '{\\n  "accessed_user_id": "456",\\n  "accessor_user_id": "123",\\n  "data_leaked": ["email", "address"]\\n}' },
  { id: 'ev_mock_003', timestamp: new Date(Date.now() - 300000), type: 'Screenshot', description: 'User 456 profile page loaded (mock)', data: 'https://picsum.photos/seed/report_ev3/600/400' },
];

export const ReportingPage: React.FC = () => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>(createMockEvidence());
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // Combined loading state
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ApiReport | null>(null);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);

  const fetchReports = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await vrpSubmissionService.getReports();
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setError(response.error?.message || "Failed to fetch reports.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred fetching reports.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const generateReport = useCallback(async (format: 'Markdown' | 'CSV') => {
    setIsProcessing(true);
    setError(null);
    try {
      // Use a few mock evidence IDs for the report content
      const mockEvidenceIdsForReport = evidence.slice(0, 2).map(e => e.id);
      const response = await vrpSubmissionService.createReport(format, mockEvidenceIdsForReport);
      if (response.success && response.data) {
        setReports(prev => [response.data!, ...prev]); // Add new report to the top
        setSelectedReport(response.data);
      } else {
        setError(response.error?.message || `Failed to generate ${format} report.`);
      }
    } catch (e: any) {
      setError(e.message || `An error occurred generating ${format} report.`);
    } finally {
      setIsProcessing(false);
    }
  }, [evidence]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-on-surface">Reporting & Evidence Management</h2>

      {error && (
        <Card title="Error" className="bg-red-900 border border-red-700">
          <p className="text-red-300">{error}</p>
        </Card>
      )}

      <Card title="Evidence Locker (Mock Data)">
        <div className="max-h-96 overflow-y-auto pr-2">
          {evidence.length === 0 ? <p className="text-on-surface-muted">No evidence collected yet.</p> : null}
          <ul className="space-y-3">
            {evidence.map(item => (
              <li key={item.id} className="p-3 bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary">{item.type}</span>
                    <p className="text-sm text-on-surface">{item.description}</p>
                    <p className="text-xs text-on-surface-muted">{item.timestamp.toLocaleString()}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedEvidenceItem(item)}>View Details</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Report Generation">
        <div className="flex space-x-4">
          <Button onClick={() => generateReport('Markdown')} isLoading={isProcessing} disabled={isProcessing}>
            Generate Markdown Report
          </Button>
          <Button onClick={() => generateReport('CSV')} isLoading={isProcessing} disabled={isProcessing} variant="secondary">
            Generate CSV Report
          </Button>
        </div>
         {isProcessing && reports.length === 0 && <p className="text-on-surface-muted mt-2">Loading reports...</p>}
        {reports.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-medium text-on-surface-muted mb-2">Generated Reports:</h4>
            <ul className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {reports.map(r => (
                <li key={r.id} className="text-sm p-1.5 hover:bg-gray-700 rounded-md">
                  <button onClick={() => setSelectedReport(r)} className="text-primary hover:underline w-full text-left">
                    {r.id} - {r.format} - {new Date(r.generatedAt).toLocaleString()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      
      <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title={`Report: ${selectedReport?.id} (${selectedReport?.format})`}>
        {selectedReport && (
          <div className="max-h-[70vh] overflow-y-auto">
             <LogViewer logs={[selectedReport.content]} title="Report Content" maxHeight="65vh"/>
          </div>
        )}
         <div className="mt-4 flex justify-end">
            <Button onClick={() => setSelectedReport(null)}>Close</Button>
        </div>
      </Modal>

      <Modal isOpen={!!selectedEvidenceItem} onClose={() => setSelectedEvidenceItem(null)} title={`Evidence: ${selectedEvidenceItem?.id} (${selectedEvidenceItem?.type})`}>
        {selectedEvidenceItem && (
          <div>
            <p className="text-on-surface-muted mb-1"><strong>Timestamp:</strong> {new Date(selectedEvidenceItem.timestamp).toLocaleString()}</p>
            <p className="text-on-surface-muted mb-3"><strong>Description:</strong> {selectedEvidenceItem.description}</p>
            {selectedEvidenceItem.type === 'Screenshot' ? (
                <img src={selectedEvidenceItem.data} alt="Evidence Screenshot" className="max-w-full h-auto rounded-md border border-gray-600"/>
            ) : (
                <LogViewer logs={[selectedEvidenceItem.data]} title="Data" maxHeight="40vh"/>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-end">
            <Button onClick={() => setSelectedEvidenceItem(null)}>Close</Button>
        </div>
      </Modal>

    </div>
  );
};
