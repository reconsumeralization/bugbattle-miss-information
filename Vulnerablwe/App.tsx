

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Page, IconType } from './types';
import { DashboardPage } from './components/pages/DashboardPage';
import { ConfigPage } from './components/pages/ConfigPage';
import { ScannersPage } from './components/pages/ScannersPage';
import { PocPage } from './components/pages/PocPage';
import { ReportingPage } from './components/pages/ReportingPage';
import { SecurityPage } from './components/pages/SecurityPage';
import { TestPlansPage } from './components/pages/TestPlansPage';
import VrpSubmissionPreviewPage from './components/pages/VrpSubmissionPreviewPage';
import TextProcessingPlanPage from './components/pages/TextProcessingPlanPage';
import { LoginPage } from './components/pages/LoginPage'; 
import { AiFeaturesDemoPage } from './components/pages/AiFeaturesDemoPage'; 
import ManifestoPage from './components/pages/ManifestoPage';
import SubmissionPackagePage from './components/pages/SubmissionPackagePage';
import ExploitChainProofPage from './components/pages/ExploitChainProofPage';
import LessonsLearnedPage from './components/pages/LessonsLearnedPage';
import ExternalVulnAnalysisPrinciplesPage from './components/pages/ExternalVulnAnalysisPrinciplesPage';
import VulnerabilityUniversePage from './components/pages/VulnerabilityUniversePage'; // New Import
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { ProtectedRoute } from './components/common/ProtectedRoute'; 

const Bars3Icon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login); // Start with Login
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); 
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn && currentPage !== Page.Login) {
      setCurrentPage(Page.Login);
    }
    if (!isAuthLoading && isLoggedIn && currentPage === Page.Login) {
        setCurrentPage(Page.Dashboard); 
    }
  }, [isAuthLoading, isLoggedIn, currentPage]);


  const renderPage = () => {
    if (currentPage === Page.Login) {
      return <LoginPage onNavigate={handleNavigate} />;
    }

    let pageComponent: React.ReactElement | null = null;
    switch (currentPage) {
      case Page.Dashboard:
        pageComponent = <DashboardPage onNavigate={handleNavigate} />;
        break;
      case Page.Configuration:
        pageComponent = <ConfigPage />;
        break;
      case Page.Scanners:
        pageComponent = <ScannersPage />;
        break;
      case Page.PoC:
        pageComponent = <PocPage />;
        break;
      case Page.VulnerabilityUniverse: // New Case
        pageComponent = <VulnerabilityUniversePage />;
        break;
      case Page.Reporting:
        pageComponent = <ReportingPage />;
        break;
      case Page.Security:
        pageComponent = <SecurityPage />;
        break;
      case Page.TestPlans:
        pageComponent = <TestPlansPage />;
        break;
      case Page.VrpSubmissionPreview:
        pageComponent = <VrpSubmissionPreviewPage />;
        break;
      case Page.TextProcessingPlan:
        pageComponent = <TextProcessingPlanPage />;
        break;
      case Page.AiFeaturesDemo:
        pageComponent = <AiFeaturesDemoPage />;
        break;
      case Page.Manifesto:
        pageComponent = <ManifestoPage />;
        break;
      case Page.SubmissionPackage:
        pageComponent = <SubmissionPackagePage />;
        break;
      case Page.ExploitChainProof:
        pageComponent = <ExploitChainProofPage />;
        break;
      case Page.LessonsLearned:
        pageComponent = <LessonsLearnedPage />;
        break;
      case Page.ExternalVulnAnalysisPrinciples:
        pageComponent = <ExternalVulnAnalysisPrinciplesPage />;
        break;
      default:
        pageComponent = isLoggedIn ? <DashboardPage onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleNavigate} />;
    }
    
    if (pageComponent) {
        return <ProtectedRoute onNavigate={handleNavigate}>{pageComponent}</ProtectedRoute>;
    }
    return null; 
  };
  
  if (isAuthLoading && currentPage !== Page.Login) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-on-surface">
        <p>Loading application...</p>
      </div>
    );
  }

  if (!isLoggedIn && currentPage !== Page.Login) {
      return <LoginPage onNavigate={handleNavigate} />; 
  }


  return (
    <div className="flex h-screen bg-background text-on-surface">
      {isLoggedIn && currentPage !== Page.Login && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoggedIn && currentPage !== Page.Login && (
          <Header title={currentPage} MenuIcon={Bars3Icon} onMenuClick={toggleSidebar} />
        )}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${currentPage !== Page.Login ? 'bg-background' : ''}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
