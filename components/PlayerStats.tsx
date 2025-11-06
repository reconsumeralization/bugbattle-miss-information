import React from 'react';
import usePlayerProgress from '../hooks/usePlayerProgress';
import { useSession } from 'next-auth/react';

export default function PlayerStats() {
  const { items, updateItems, misinformationBestScore, isLoadingProgress } = usePlayerProgress();
  const { data: session } = useSession();

  if (isLoadingProgress) {
    return (
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '0.5rem',
        padding: '1.5rem', 
        marginBottom: '2rem',
        backgroundColor: '#f9fafb'
      }}>
        <p>Loading player statistics...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '0.5rem',
      padding: '1.5rem', 
      marginBottom: '2rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🔧 Player Inventory
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          Solar Panel Components: <strong style={{ color: '#059669' }}>{items}</strong>
        </p>
        
        {misinformationBestScore > 0 && (
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
            Best Misinformation Score: <strong style={{ color: '#dc2626' }}>{misinformationBestScore}</strong>
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => updateItems(items + 1)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#047857'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#059669'}
        >
          ⚡ Collect Component
        </button>
        
        <button 
          onClick={() => updateItems(0)} 
          disabled={items === 0}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: items === 0 ? '#9ca3af' : '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: items === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (items > 0) (e.target as HTMLButtonElement).style.backgroundColor = '#b91c1c';
          }}
          onMouseOut={(e) => {
            if (items > 0) (e.target as HTMLButtonElement).style.backgroundColor = '#dc2626';
          }}
        >
          🔄 Reset Components
        </button>
      </div>

      {!session && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.375rem'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💡 <strong>Tip:</strong> Sign in to save your progress online and compete on the leaderboard!
          </p>
        </div>
      )}
      
      {session && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '0.375rem'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✅ Progress automatically saved to your account!
          </p>
        </div>
      )}
    </div>
  );
} 