// API utility functions for the Miss Information platform

// Types for API responses
interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  category: string;
  importance: string;
}

interface NewsResponse {
  articles: NewsArticle[];
  lastUpdated: string;
}

interface ProgressData {
  level?: number;
  score?: number;
  achievements?: string[];
  timestamp?: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
}

export const fetchMockPage = async (): Promise<any> => {
  try {
    const response = await fetch('/api/mock-page');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mock page:', error);
    throw error;
  }
};

export const fetchNews = async (): Promise<NewsResponse> => {
  try {
    const response = await fetch('/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: NewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const saveProgress = async (progressData: ProgressData): Promise<any> => {
  try {
    const response = await fetch('/api/game/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch('/api/game/leaderboard');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// X.ai API integration for fact-checking
export const factCheckContent = async (content: string): Promise<any> => {
  try {
    const response = await fetch('/api/fact-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fact-checking content:', error);
    throw error;
  }
};

// Tavus API integration for expert video generation
export const generateExpertVideo = async (topic: string, expertType: string): Promise<any> => {
  try {
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, expertType }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating expert video:', error);
    throw error;
  }
};