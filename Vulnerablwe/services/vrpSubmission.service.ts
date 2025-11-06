
// services/vrpSubmission.service.ts
import { apiClient } from './apiClient';
import { ApiReport } from '../types/apiTypes';
import { ApiResponse, Report } from '../types';
import { 
    MOCK_CSV_REPORT_HEADER, 
    MOCK_MARKDOWN_REPORT_TEMPLATE,
    CONSOLIDATED_EVIDENCE_SUMMARY_TEXT,
    MOCK_WIZ_GLOBAL_DATA_ANALYSIS_TEXT
} from '../constants/reporting.constants';

// Maintain a mock list of reports in memory for this service
let mockReports: ApiReport[] = [];

export const vrpSubmissionService = {
  getReports: async (): Promise<ApiResponse<ApiReport[]>> => {
    console.log('[VrpSubmissionService] Fetching reports...');
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: [...mockReports] }; // Return a copy
  },

  createReport: async (format: 'Markdown' | 'CSV', mockEvidenceIds: string[]): Promise<ApiResponse<ApiReport>> => {
    console.log(`[VrpSubmissionService] Creating ${format} report...`);
    await new Promise(resolve => setTimeout(resolve, 700));

    const newReportId = `rep_mock_${Date.now()}`;
    let content = '';

    if (format === 'Markdown') {
      content = MOCK_MARKDOWN_REPORT_TEMPLATE
        .replace('{projectName}', 'AI Studio IDOR Test - Mock')
        .replace('{date}', new Date().toLocaleDateString())
        .replace('{targetEndpointsList}', mockEvidenceIds.map(id => `- Mock Endpoint for Evidence ${id}`).join('\\n'))
        .replace('{testParameters}', JSON.stringify({ "simulatedParam": "value" }, null, 2))
        .replace('{findingsSection}', `Simulated findings based on mock data.\\n\\n${MOCK_WIZ_GLOBAL_DATA_ANALYSIS_TEXT}\\n\\n${CONSOLIDATED_EVIDENCE_SUMMARY_TEXT}`)
        .replace('{evidenceSection}', mockEvidenceIds.map(id => `- Mock Evidence Item (ID: ${id})`).join('\\n'));
    } else {
      content = MOCK_CSV_REPORT_HEADER;
      mockEvidenceIds.forEach(id => {
        content += `${id},${new Date().toISOString()},High,"Mock CSV Description for ${id}","mock/endpoint/${id}",details_link\\n`;
      });
    }

    const newReport: ApiReport = {
      id: newReportId,
      generatedAt: new Date(),
      format,
      content,
      evidenceIds: mockEvidenceIds,
    };
    
    mockReports.unshift(newReport); // Add to the start of the list
    return { success: true, data: newReport };
  },
};
