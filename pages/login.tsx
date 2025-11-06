import React, { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

interface DemoAccount {
  email: string;
  password: string;
  role: string;
}

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts: DemoAccount[] = [
    { email: 'student@greenplanet.edu', password: 'student123', role: 'Student' },
    { email: 'teacher@greenplanet.edu', password: 'teacher123', role: 'Teacher' },
    { email: 'admin@greenplanet.edu', password: 'admin123', role: 'Admin' }
  ];

  const fillDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 0.5rem 0'
          }}>
            🌍 Sign In
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Access your Green Planet game progress
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: 0, color: '#dc2626', fontSize: '0.9rem' }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 1rem 0',
            textAlign: 'center'
          }}>
            Demo Accounts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                }}
              >
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {account.role}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  {account.email}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <p style={{ margin: 0 }}>
            New to Miss Information?{' '}
            <span 
              style={{ 
                color: '#2563eb', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
              onClick={() => router.push('/')}
            >
              Start playing now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 