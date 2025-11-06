import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface PlayerProgress {
  items: number;
  updateItems: (count: number) => Promise<void>;
  misinformationBestScore: number;
  recordMisinformationScore: (score: number) => Promise<void>;
  isLoadingProgress: boolean;
}

export default function usePlayerProgress(): PlayerProgress {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<number>(0);
  const [misinformationBestScore, setMisinformationBestScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch progress from server or localStorage
  const fetchProgress = useCallback(async (): Promise<void> => {
    if (status === 'authenticated' && (session?.user as SessionUser)?.id) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/game/progress');
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || 0);
          setMisinformationBestScore(data.misinformationBestScore || 0);
        } else {
          console.error('Failed to fetch progress from server');
          loadLocalProgress();
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        loadLocalProgress();
      } finally {
        setIsLoading(false);
      }
    } else if (status === 'unauthenticated') {
      loadLocalProgress();
      setIsLoading(false);
    }
  }, [session, status]);

  // Load progress from localStorage
  const loadLocalProgress = (): void => {
    const savedItems = localStorage.getItem('solar_panel_items') || '0';
    const savedScore = localStorage.getItem('misinformation_best_score') || '0';
    setItems(parseInt(savedItems, 10));
    setMisinformationBestScore(parseInt(savedScore, 10));
  };

  // Initialize progress on component mount
  useEffect(() => {
    if (status !== 'loading') {
      fetchProgress();
    }
  }, [status, fetchProgress]);

  // Update items count
  const updateItems = async (count: number): Promise<void> => {
    setItems(count);
    
    if ((session?.user as SessionUser)?.id) {
      try {
        await fetch('/api/game/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: count }),
        });
      } catch (error) {
        console.error('Failed to save items to server:', error);
        localStorage.setItem('solar_panel_items', count.toString());
      }
    } else {
      localStorage.setItem('solar_panel_items', count.toString());
    }
  };

  // Record and save misinformation game score
  const recordMisinformationScore = async (score: number): Promise<void> => {
    if (score > misinformationBestScore) {
      setMisinformationBestScore(score);
    }
    
    if ((session?.user as SessionUser)?.id) {
      try {
        await fetch('/api/game/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ misinformationScore: score }),
        });
      } catch (error) {
        console.error('Failed to save score to server:', error);
        const currentBest = parseInt(localStorage.getItem('misinformation_best_score') || '0');
        if (score > currentBest) {
          localStorage.setItem('misinformation_best_score', score.toString());
        }
      }
    } else {
      const currentBest = parseInt(localStorage.getItem('misinformation_best_score') || '0');
      if (score > currentBest) {
        localStorage.setItem('misinformation_best_score', score.toString());
      }
    }
  };

  return { 
    items, 
    updateItems, 
    misinformationBestScore, 
    recordMisinformationScore, 
    isLoadingProgress: isLoading 
  };
} 