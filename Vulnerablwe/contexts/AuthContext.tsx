
// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types';
import { LoginRequest } from '../types/apiTypes';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to check initial auth status

  useEffect(() => {
    // Check for existing token and user in localStorage on initial load
    const existingToken = authService.getToken();
    const existingUser = authService.getCurrentUser();
    if (existingToken && existingUser) {
      setToken(existingToken);
      setCurrentUser(existingUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setCurrentUser(response.data.user);
        setToken(response.data.token);
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", response.error?.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login exception:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Still proceed to clear client-side state
    } finally {
      setCurrentUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };
  
  const isLoggedIn = !!token && !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
