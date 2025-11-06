
// components/common/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  onNavigate: (page: Page) => void; // Callback to navigate
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigate }) => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      onNavigate(Page.Login);
    }
  }, [isLoggedIn, isLoading, onNavigate]);

  if (isLoading) {
    // Optional: Render a loading spinner or a blank screen while auth state is being determined
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-on-surface">Loading authentication...</p>
        </div>
    );
  }

  if (!isLoggedIn) {
    // Typically, the useEffect hook handles navigation, but this is a fallback or for immediate render blocking
    // It's better to let useEffect handle navigation to avoid rendering children transiently
    return null; // Or a redirect component if using a router library
  }

  return children;
};
