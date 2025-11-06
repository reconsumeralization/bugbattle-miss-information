
// components/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../types';
import { Card } from '../common/Card';
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { simulateSecretHuntFromPocConstants } from '../../constants/poc.constants';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState(''); // Default to empty for easier "null,null" login
  const [password, setPassword] = useState(''); // Default to empty
  const [error, setError] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Specific client-side check for incomplete standard login
    if ((email && !password) || (!email && password)) {
      setError('For standard login, both email and password are required. To log in as a guest, leave both fields empty.');
      return;
    }

    // If both are empty, or both are filled, proceed to authService.login
    // The authService will handle the "null, null" logic or standard credential check.
    const success = await login({ email, password });
    if (success) {
      onNavigate(Page.Dashboard);
    } else {
      // Error message will now likely come from authService if it's a credential issue
      // or if "null,null" login somehow failed (which it shouldn't in mock).
      setError('Login failed. Please check your credentials or try guest access (both fields empty).');
    }
  };

  const handleSecretHuntLogin = async () => {
    setError(null);
    const mockWizDataString = JSON.stringify({
      "PeqOqb": "SIM_EXTRACTED_API_KEY",
      "S06Grb": "SIM_EXTRACTED_USER_ID",
      "oPEP7c": "sim_hunted_user@example.com",
    });

    try {
        const credentials = simulateSecretHuntFromPocConstants(mockWizDataString);
        if (credentials && credentials.apiKey && credentials.userId) {
            const success = await login({ apiKey: credentials.apiKey, userId: credentials.userId });
            if (success) {
            onNavigate(Page.Dashboard);
            } else {
            setError('Simulated secret hunt login failed.');
            }
        } else {
            setError('Failed to extract credentials via secret hunt simulation.');
        }
    } catch (e: any) {
        console.error("Secret hunt simulation error:", e);
        setError(`Secret hunt error: ${e.message || 'Unknown error'}`);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card title="Login to VTF" className="w-full max-w-md">
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <InputField
            label="Email (leave empty for Guest)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="test@example.com or empty"
          />
          <InputField
            label="Password (leave empty for Guest)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="password or empty"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" isLoading={isLoading} className="w-full" variant="primary">
            {email === '' && password === '' ? 'Login as Guest' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-on-surface-muted mb-2">Or try a simulation:</p>
             <Button 
                onClick={handleSecretHuntLogin} 
                isLoading={isLoading} 
                className="w-full"
                variant="secondary"
            >
                Login via Secret Hunt (Simulated)
            </Button>
        </div>
        <p className="mt-4 text-xs text-center text-on-surface-muted">
          Use test@example.com / password for standard login.
          <br />Leave both fields empty for Guest access.
        </p>
      </Card>
    </div>
  );
};
