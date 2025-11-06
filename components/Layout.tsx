import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import ExpertAdminPanel from './ExpertAdminPanel';
import CompetitionEnhancements from './CompetitionEnhancements';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  
  // Check if user is admin (you can customize this logic)
  const isAdmin = session?.user?.email?.includes('admin') || 
                  session?.user?.name?.toLowerCase().includes('admin') ||
                  session?.user?.email === 'admin@example.com';

  return (
    <>
      <Head>
        <title>Miss Information - Educational Fact-Checking Game</title>
        <meta name="description" content="An AI-powered educational game to combat misinformation with expert analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-900">
        {/* Header */}
        <header className="header sticky top-0 z-50">
          <div className="container flex justify-between items-center">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors" style={{ textDecoration: 'none' }}>
              <h1 className="text-2xl font-bold gradient-text flex items-center gap-3">
                🎯 Miss Information
              </h1>
            </Link>
            
            <nav className="nav">
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="spinner"></div>
                  <span className="text-gray-400">Loading...</span>
                </div>
              )}
              
              {!loading && !session && (
                <button 
                  onClick={() => signIn()}
                  className="btn-primary"
                >
                  Sign In
                </button>
              )}
              
              {session && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm hidden sm:block">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  
                  {isAdmin && (
                    <button
                      onClick={() => setShowAdminPanel(true)}
                      className="expert-admin-btn"
                    >
                      🎓 Experts
                    </button>
                  )}
                  
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="btn-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 main-content">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p className="text-gray-400 text-sm mb-2">
              © {new Date().getFullYear()} Miss Information Game
              <span className="mx-2">•</span>
              Combat Misinformation with AI-Powered Education
            </p>
            <p className="text-gray-500 text-xs">
              Powered by advanced AI analysis and expert knowledge systems
            </p>
          </div>
        </footer>
        
        {/* Expert Admin Panel */}
        <ExpertAdminPanel 
          isVisible={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
        
        {/* Competition Enhancements */}
        <CompetitionEnhancements />
      </div>
    </>
  );
} 