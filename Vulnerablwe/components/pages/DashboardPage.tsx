

import React from 'react';
import { Card } from '../common/Card';
import { StatusIndicator } from '../common/StatusIndicator';
import { Page } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext'; 

// Heroicons
const ArrowTrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);
const BugAntIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.362 5.214A12.035 12.035 0 0 1 17.15 4.076a11.948 11.948 0 0 1 4.076 1.784m-4.076-1.784A11.928 11.928 0 0 0 12.636 1.25a11.928 11.928 0 0 0-4.482 1.07M15.362 5.214A11.935 11.935 0 0 0 12.636 4.5a11.935 11.935 0 0 0-2.726.714m2.726-.714A12.016 12.016 0 0 0 9.074 2.05M12.636 4.5A11.935 11.935 0 0 1 9.91 5.214m0 0A11.96 11.96 0 0 0 5.636 7.932m4.274-2.718A12.016 12.016 0 0 1 12.636 4.5m-3.562 2.718A11.955 11.955 0 0 1 6.842 9.05M15.362 5.214 12.636 4.5m2.726.714 2.726 2.726M9.91 5.214 7.184 7.94m2.726-2.726L9.91 2.488M12.636 1.25 9.91 2.488m2.726-.714-2.726.714M3.25 9A11.953 11.953 0 0 1 5.636 7.932m-2.386.953A11.953 11.953 0 0 0 1.25 12.636M12.636 22.75A11.928 11.928 0 0 0 17.15 21.93m0 0A11.95 11.95 0 0 0 21.225 20.148M17.15 21.93a11.948 11.948 0 0 1-4.514.82m4.514-.82A11.963 11.963 0 0 1 12.636 22.75m0 0A11.963 11.963 0 0 1 8.362 21.93m4.274.82A11.928 11.928 0 0 0 8.362 21.93m0 0A11.953 11.953 0 0 1 6.842 19.5m1.52.43A11.953 11.953 0 0 1 5.636 16.068m0 0A11.953 11.953 0 0 1 3.25 15.115M20.75 15.115A11.953 11.953 0 0 1 18.364 16.068M8.362 21.93 7.184 20.148m1.178 1.782L8.362 19.5m0 2.43a11.953 11.953 0 0 0 2.386-.953m0 0A11.953 11.953 0 0 0 12.636 22.75m0-4.682A11.953 11.953 0 0 0 15.115 20.75M12.636 18.068A11.953 11.953 0 0 1 10.25 19.115m2.386-1.047A11.953 11.953 0 0 0 15.115 15.362M12.636 18.068 14.42 19.246m-1.784-1.178L9.074 19.246m0 0-1.784-1.178m1.784 1.178L8.362 21.93" />
  </svg>
);
const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Vulnerability Universe
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const DocumentChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Reports
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5V7.5c0-1.313 1.063-2.375 2.375-2.375h1.5c1.313 0 2.375 1.062 2.375 2.375v1.125c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V7.5c0-1.313 1.063-2.375 2.375-2.375h1.5C19.688 5.125 20.75 6.187 20.75 7.5v10.875c0 .621-.504 1.125-1.125 1.125M3.375 19.5h1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 19.5h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5M9.375 15.75h1.5m1.5 0h1.5m1.5 0h1.5M9.375 12h1.5m1.5 0h1.5m1.5 0h1.5" />
  </svg>
);


interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth(); 
  const summaryStats = [
    { title: 'Active Vulnerability Scans', value: '2', icon: <ArrowTrendingUpIcon className="h-8 w-8 text-primary" />, status: 'Running', details: 'IDOR Enumeration, GTM Script Analysis' },
    { title: 'Critical Findings (Simulated)', value: '3', icon: <BugAntIcon className="h-8 w-8 text-red-500" />, status: 'Warning', details: 'Exposed Static API Key, IDOR in User Prompts API, GTM Data Leak' },
    { title: 'Comprehensive Analysis Progress', value: '75%', icon: <EyeIcon className="h-8 w-8 text-secondary" />, status: 'Active', details: 'Deep dive into exploit chains and systemic risks.' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <h2 className="text-3xl font-semibold text-on-surface mb-2 sm:mb-0">Vulnerability Analysis Dashboard</h2>
        {currentUser && (
          <p className="text-on-surface-muted text-sm">Welcome, {currentUser.name || currentUser.email}!</p>
        )}
      </div>
      
      <Card title="Security Posture Overview">
        <p className="text-sm text-on-surface-muted mb-4">
          This dashboard provides a simulated overview of the ongoing vulnerability assessment. 
          Explore the various sections to understand the discovered vulnerabilities, their potential impact, and the methodologies used for analysis.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryStats.map((stat, index) => (
          <Card key={index} title={stat.title} className="hover:shadow-primary/50 transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              {stat.icon}
              <div>
                <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
                <StatusIndicator 
                  status={stat.status as 'Running' | 'Warning' | 'Success' | 'Active'} 
                  text={stat.details}
                  size="sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Guided Exploration & Key Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" onClick={() => onNavigate(Page.ExploitChainProof)} 
            icon={<PuzzlePieceIcon className="h-5 w-5"/>}
            className="flex-col h-24 text-center"
          >
            <span className="block text-sm">Exploit Chain</span>
            <span className="block text-xs opacity-80">Full Analysis</span>
          </Button>
          <Button variant="secondary" onClick={() => onNavigate(Page.VulnerabilityUniverse)}
            icon={<ShareIcon className="h-5 w-5"/>}
            className="flex-col h-24 text-center"
          >
             <span className="block text-sm">Vuln Universe</span>
            <span className="block text-xs opacity-80">Visualize Data</span>
          </Button>
          <Button onClick={() => onNavigate(Page.PoC)}
            icon={<CodeBracketIcon className="h-5 w-5"/>}
            className="flex-col h-24 text-center"
          >
            <span className="block text-sm">PoC Development</span>
            <span className="block text-xs opacity-80">Test Scripts</span>
          </Button>
          <Button onClick={() => onNavigate(Page.Reporting)}
            icon={<DocumentChartBarIcon className="h-5 w-5"/>}
            className="flex-col h-24 text-center"
          >
            <span className="block text-sm">View Reports</span>
            <span className="block text-xs opacity-80">Evidence Locker</span>
          </Button>
        </div>
      </Card>

      <Card title="Recent Activity & Insights (Simulated)">
        <ul className="space-y-3">
          {[
            { id: 1, text: "Critical: IDOR vulnerability confirmed in local API server.", time: "5 mins ago", status: "Failure" as const, page: Page.ExploitChainProof, pageText: "View Analysis" },
            { id: 2, text: "GTM script scan detected potential data leakage.", time: "25 mins ago", status: "Warning" as const, page: Page.Scanners, pageText: "See Scanner" },
            { id: 3, text: "Manifesto Part I: 'The Finding' updated with PoC details.", time: "1 hour ago", status: "Success" as const, page: Page.Manifesto, pageText: "Read Manifesto"},
            { id: 4, text: "Vulnerability Universe graph generated, showing 5 critical links.", time: "2 hours ago", status: "Active" as const, page: Page.VulnerabilityUniverse, pageText: "Explore Universe"},
          ].map(activity => (
            <li key={activity.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600/70 transition-colors">
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-on-surface">{activity.text}</span>
                <div className="flex items-center mt-1">
                    <span className="text-xs text-on-surface-muted mr-2">{activity.time}</span>
                    <StatusIndicator status={activity.status} size="sm" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate(activity.page)}>
                {activity.pageText || "View Details"}
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

// Placeholder icons if not available from Sidebar.tsx or elsewhere
const PuzzlePieceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.083A11.952 11.952 0 0118.75 9.75M14.25 6.083c-1.148-.652-2.44-.984-3.75-.984S7.898 5.43 6.75 6.083M14.25 6.083A11.938 11.938 0 0012 5.25c-1.218 0-2.39.319-3.44.87M1.5 9.75A11.953 11.953 0 006.75 13.5M1.5 9.75c0-1.11.242-2.16.667-3.125M1.5 9.75A11.938 11.938 0 015.25 6c1.218 0 2.39.319 3.44.87M22.5 9.75c0-1.11-.242-2.16-.667-3.125M22.5 9.75A11.938 11.938 0 0018.75 6c-1.218 0-2.39.319-3.44.87M15 13.5c-.69.03-1.37.053-2.062.053s-1.372-.023-2.062-.053M15 13.5A11.953 11.953 0 0122.5 9.75M15 13.5A11.953 11.953 0 0018.75 18c1.552 0 2.995-.41 4.25-1.125M15 15.75a3 3 0 01-6 0M15 15.75a3 3 0 00-6 0M6.75 18.75c0-1.002.163-1.97.457-2.896M6.75 18.75A11.953 11.953 0 011.5 15M6.75 18.75A11.953 11.953 0 0012 22.5c1.552 0 2.995-.41 4.25-1.125M9 13.5c.69.03 1.37.053 2.062.053s1.372-.023 2.062-.053" />
  </svg>
);
const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.516-.205 1.073-.356 1.657-.444m0 0a2.25 2.25 0 01.342 0m1.963 0c.584.087 1.141.24 1.657.444m0 0a2.25 2.25 0 010 2.186m0 0c-.516.205-1.073.356-1.657.444m0 0a2.25 2.25 0 00-.342 0m-1.963 0c-.584-.087-1.141-.24-1.657-.444M11.25 12l-3.86 2.145A2.25 2.25 0 013.75 12m0 0a2.25 2.25 0 012.617-2.145L11.25 12M12 15v.01M12 9v.01M15 12v.01M18 15v.01M18 9v.01M21 12v.01M3.75 6.75v.01M3.75 17.25v.01" />
  </svg>
);
const CodeBracketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);