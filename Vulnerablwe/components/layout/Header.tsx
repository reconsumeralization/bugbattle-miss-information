
import React from 'react';
import { IconType, Page } from '../../types';
import { useAuth } from '../../contexts/AuthContext'; // New
import { Button } from '../common/Button'; // For logout button

interface HeaderProps {
  title: string;
  MenuIcon: IconType;
  onMenuClick: () => void;
}

const UserCircleIcon: IconType = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ArrowRightStartOnRectangleIcon: IconType = (props) => ( // Logout Icon
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ title, MenuIcon, onMenuClick }) => {
  const { currentUser, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    // App.tsx's useEffect will handle navigation to LoginPage
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-on-surface-muted hover:text-on-surface hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-on-surface ml-3 md:ml-0">{title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            {currentUser && (
              <>
                <span className="text-sm text-on-surface-muted hidden sm:block" aria-label="Current user email">
                  {currentUser.email}
                </span>
                <UserCircleIcon className="h-8 w-8 text-on-surface-muted" aria-hidden="true" />
              </>
            )}
            <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                isLoading={isLoading}
                aria-label="Logout"
                icon={<ArrowRightStartOnRectangleIcon className="h-5 w-5"/>}
            >
                <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
