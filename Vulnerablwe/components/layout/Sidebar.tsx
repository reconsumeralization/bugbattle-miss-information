

import React from 'react';
import { Page, IconType } from '../../types';
import { useAuth } from '../../contexts/AuthContext'; 

// Heroicons SVGs
const HomeIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
const CogIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m18 0h-1.5m-1.543-6.974A7.5 7.5 0 0 1 19.5 12h1.5M6.974 7.543A7.5 7.5 0 0 1 12 4.5v1.5m0 15v-1.5a7.5 7.5 0 0 1-5.026-1.974M12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
  </svg>
);
const MagnifyingGlassIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);
const CodeBracketIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);
const DocumentTextIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);
const ShieldCheckIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);
const ClipboardDocumentListIcon: IconType = (props) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6.108V18.75c0 1.243.872 2.258 2.012 2.339M17.25 12a4.5 4.5 0 0 1-4.5 4.5M15 9.75a4.5 4.5 0 1 1-4.5-4.5 4.5 4.5 0 0 1 4.5 4.5Z" />
  </svg>
);
const DocumentMagnifyingGlassIcon: IconType = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25V11.25a4.5 4.5 0 00-4.5-4.5h-3.875a3.375 3.375 0 01-3.375-3.375V2.25m0 19.5h13.5A2.25 2.25 0 0021.75 19.5V11.25M2.25 4.5h7.5m0 0V2.25M9.75 4.5h1.125M9.75 4.5C8.672 4.5 7.523 4.622 6.375 5.06M2.25 9.75h7.5m0 0v1.125c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V9.75m0 0a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Zm0 0H21M5.625 13.875a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25Z" />
    </svg>
);
const CpuChipIcon: IconType = (props) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-7.5h12.75c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Zm0 0h12.75M12 15V9.75M8.25 9.75V15M15.75 9.75V15m1.5-3.06a2.99 2.99 0 0 1 .814-2.058M4.5 11.94a2.99 2.99 0 0 1-.814-2.058" />
    </svg>
);
const SparklesIcon: IconType = (props) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M17 13.75L15.75 12M17 13.75L18.25 15M15.75 12L17 10.25m-7.5 0L9 7.5M9 7.5L7.5 9M9 7.5L10.5 9m6.75-1.5L15.75 9l-1.5.75" />
    </svg>
);
const ArrowLeftStartOnRectangleIcon: IconType = (props) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H15" />
    </svg>
);
const BookOpenIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const ArchiveBoxIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);
const PuzzlePieceIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.083A11.952 11.952 0 0118.75 9.75M14.25 6.083c-1.148-.652-2.44-.984-3.75-.984S7.898 5.43 6.75 6.083M14.25 6.083A11.938 11.938 0 0012 5.25c-1.218 0-2.39.319-3.44.87M1.5 9.75A11.953 11.953 0 006.75 13.5M1.5 9.75c0-1.11.242-2.16.667-3.125M1.5 9.75A11.938 11.938 0 015.25 6c1.218 0 2.39.319 3.44.87M22.5 9.75c0-1.11-.242-2.16-.667-3.125M22.5 9.75A11.938 11.938 0 0018.75 6c-1.218 0-2.39.319-3.44.87M15 13.5c-.69.03-1.37.053-2.062.053s-1.372-.023-2.062-.053M15 13.5A11.953 11.953 0 0122.5 9.75M15 13.5A11.953 11.953 0 0018.75 18c1.552 0 2.995-.41 4.25-1.125M15 15.75a3 3 0 01-6 0M15 15.75a3 3 0 00-6 0M6.75 18.75c0-1.002.163-1.97.457-2.896M6.75 18.75A11.953 11.953 0 011.5 15M6.75 18.75A11.953 11.953 0 0012 22.5c1.552 0 2.995-.41 4.25-1.125M9 13.5c.69.03 1.37.053 2.062.053s1.372-.023 2.062-.053" />
  </svg>
);
const BeakerIcon: IconType = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.25H5.25A2.25 2.25 0 003 10.5v8.25A2.25 2.25 0 005.25 21h8.25A2.25 2.25 0 0015.75 18.75V10.5A2.25 2.25 0 0013.5 8.25H12.75M15.75 10.5H13.5V8.25m2.25 0c0-.828-.672-1.5-1.5-1.5h-3c-.828 0-1.5.672-1.5 1.5m6 0v-.083c0-.724.586-1.309 1.309-1.309h.485c.724 0 1.309.586 1.309 1.309V10.5M15.75 10.5v2.25M13.5 8.25V4.5M8.25 10.5v3.75m0 0v3M8.25 10.5V4.5m0 6h2.25m0 0h2.25M10.5 4.5V3M4.834 6.375A2.25 2.25 0 017.084 4.5h2.166M9.75 18.75h.008v.008H9.75v-.008Zm0 0c.022.05.046.1.072.146M12 18.75h.008v.008H12v-.008Zm0 0c.022.05.046.1.072.146" />
    </svg>
);
const LightBulbIcon: IconType = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a11.955 11.955 0 01-4.5 0M8.25 12.75A3.75 3.75 0 0112 9m0 0A3.75 3.75 0 0115.75 12.75M12 9v2.25m0-2.25h1.5a1.5 1.5 0 010 3H12m0 0H9.75a1.5 1.5 0 010-3H12Zm0 0V6.75m0 0H9.75M12 6.75H14.25" />
    </svg>
);
const ShareIcon: IconType = (props) => ( // Icon for VulnerabilityUniverse
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.516-.205 1.073-.356 1.657-.444m0 0a2.25 2.25 0 01.342 0m1.963 0c.584.087 1.141.24 1.657.444m0 0a2.25 2.25 0 010 2.186m0 0c-.516.205-1.073.356-1.657.444m0 0a2.25 2.25 0 00-.342 0m-1.963 0c-.584-.087-1.141-.24-1.657-.444M11.25 12l-3.86 2.145A2.25 2.25 0 013.75 12m0 0a2.25 2.25 0 012.617-2.145L11.25 12M12 15v.01M12 9v.01M15 12v.01M18 15v.01M18 9v.01M21 12v.01M3.75 6.75v.01M3.75 17.25v.01" />
  </svg>
);


interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; icon: IconType; text: string; onCloseSidebar: () => void; isHidden?: boolean }> = 
({ page, currentPage, onNavigate, icon: Icon, text, onCloseSidebar, isHidden }) => {
  if (isHidden) return null;
  const isActive = currentPage === page;
  return (
    <li>
      <button
        onClick={() => { onNavigate(page); onCloseSidebar(); }}
        className={`flex items-center p-3 rounded-lg w-full text-left
                    ${isActive ? 'bg-primary text-white shadow-lg' : 'text-on-surface-muted hover:bg-gray-700 hover:text-on-surface'}
                    transition-colors duration-150 ease-in-out`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={`h-6 w-6 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" />
        <span className="text-sm font-medium">{text}</span>
      </button>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { isLoggedIn, logout } = useAuth();

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout().then(() => onNavigate(Page.Login)); 
    } else {
      onNavigate(Page.Login);
    }
    onClose();
  };
  
  const pageDefinitions: { page: Page; icon: IconType; text: string; requiresAuth: boolean }[] = [
    { page: Page.Login, icon: ArrowLeftStartOnRectangleIcon, text: "Login / Guest Access", requiresAuth: false },
    { page: Page.Dashboard, icon: HomeIcon, text: "Dashboard", requiresAuth: true },
    { page: Page.Configuration, icon: CogIcon, text: "Framework Configuration", requiresAuth: true },
    { page: Page.Scanners, icon: MagnifyingGlassIcon, text: "Security Scanners", requiresAuth: true },
    { page: Page.PoC, icon: CodeBracketIcon, text: "PoC Development", requiresAuth: true },
    { page: Page.VulnerabilityUniverse, icon: ShareIcon, text: "Vulnerability Universe", requiresAuth: true },
    { page: Page.ExploitChainProof, icon: PuzzlePieceIcon, text: "Exploit Chain Synthesis", requiresAuth: true },
    { page: Page.Reporting, icon: DocumentTextIcon, text: "Reporting & Evidence", requiresAuth: true },
    { page: Page.TestPlans, icon: ClipboardDocumentListIcon, text: "Security Test Plans", requiresAuth: true },
    { page: Page.TextProcessingPlan, icon: CpuChipIcon, text: "Large Text Processing", requiresAuth: true },
    { page: Page.AiFeaturesDemo, icon: SparklesIcon, text: "AI Features Demo", requiresAuth: true },
    { page: Page.Security, icon: ShieldCheckIcon, text: "Security & Compliance", requiresAuth: true },
    { page: Page.Manifesto, icon: BookOpenIcon, text: "Security Manifesto", requiresAuth: true },
    { page: Page.SubmissionPackage, icon: ArchiveBoxIcon, text: "VRP Submission Package", requiresAuth: true},
    { page: Page.VrpSubmissionPreview, icon: DocumentMagnifyingGlassIcon, text: "VRP Submission Preview", requiresAuth: true },
    { page: Page.LessonsLearned, icon: LightBulbIcon, text: "Security Insights", requiresAuth: true },
    { page: Page.ExternalVulnAnalysisPrinciples, icon: BeakerIcon, text: "External Vuln Analysis", requiresAuth: true },
  ];


  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-surface shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 md:static md:inset-0 transition-transform duration-300 ease-in-out flex flex-col`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700 px-4">
          <span className="text-xl font-bold text-primary truncate">Vulnerability Test Framework</span>
        </div>
        <nav className="flex-grow p-3 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wider">Core Features</p>
          <ul>
            {[Page.Dashboard, Page.Configuration, Page.Scanners, Page.PoC, Page.VulnerabilityUniverse].map(p => {
                const def = pageDefinitions.find(item => item.page === p);
                return def && <NavItem key={p} {...def} currentPage={currentPage} onNavigate={onNavigate} onCloseSidebar={onClose} isHidden={(def.requiresAuth && !isLoggedIn)}/>;
            })}
          </ul>
          <p className="px-3 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wider mt-3">Analysis & Reporting</p>
          <ul>
             {[Page.ExploitChainProof, Page.Reporting, Page.TestPlans, Page.TextProcessingPlan, Page.AiFeaturesDemo].map(p => {
                const def = pageDefinitions.find(item => item.page === p);
                return def && <NavItem key={p} {...def} currentPage={currentPage} onNavigate={onNavigate} onCloseSidebar={onClose} isHidden={(def.requiresAuth && !isLoggedIn)}/>;
            })}
          </ul>
           <p className="px-3 py-2 text-xs font-semibold text-on-surface-muted uppercase tracking-wider mt-3">Knowledge Base</p>
          <ul>
             {[Page.Manifesto, Page.SubmissionPackage, Page.VrpSubmissionPreview, Page.LessonsLearned, Page.ExternalVulnAnalysisPrinciples, Page.Security].map(p => {
                const def = pageDefinitions.find(item => item.page === p);
                return def && <NavItem key={p} {...def} currentPage={currentPage} onNavigate={onNavigate} onCloseSidebar={onClose} isHidden={(def.requiresAuth && !isLoggedIn)}/>;
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <NavItem
              page={Page.Login} // This will be dynamically handled for logout/login text
              currentPage={currentPage}
              onNavigate={handleAuthAction}
              icon={isLoggedIn ? ArrowLeftStartOnRectangleIcon : ArrowLeftStartOnRectangleIcon} // Icon might need adjustment for login
              text={isLoggedIn ? 'Logout' : 'Login'}
              onCloseSidebar={onClose}
              isHidden={false} // Always show auth action
            />
          <p className="text-xs text-on-surface-muted text-center mt-4">&copy; {new Date().getFullYear()} VTF Simulation</p>
        </div>
      </aside>
    </>
  );
};
