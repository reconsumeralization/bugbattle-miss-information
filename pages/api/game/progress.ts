import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import db from '../../../lib/db';

interface Session {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

interface UserProgress {
  userId: string;
  items: number;
  misinformationBestScore: number;
}

interface ScoreEntry {
  userId: string;
  userName: string;
  score: number;
  timestamp: string;
}

interface ProgressRequestBody {
  items?: number;
  misinformationScore?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req }) as Session | null;

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = session.user.id;

  try {
    if (req.method === 'GET') {
      // Get user progress
      const userProgress = db.get('users_progress')
        .find({ userId })
        .value() as UserProgress | undefined;

      if (userProgress) {
        res.status(200).json(userProgress);
      } else {
        // Return default progress if none found
        res.status(200).json({ 
          userId, 
          items: 0, 
          misinformationBestScore: 0 
        } as UserProgress);
      }
    } else if (req.method === 'POST') {
      const { items, misinformationScore } = req.body as ProgressRequestBody;

      // Find or create user progress
      let userProgress = db.get('users_progress')
        .find({ userId })
        .value() as UserProgress | undefined;

      if (userProgress) {
        // Update existing progress
        if (items !== undefined) {
          db.get('users_progress')
            .find({ userId })
            .assign({ items })
            .write();
        }
        
        if (misinformationScore !== undefined && 
            misinformationScore > (userProgress.misinformationBestScore || 0)) {
          db.get('users_progress')
            .find({ userId })
            .assign({ misinformationBestScore: misinformationScore })
            .write();
        }
        
        // Get updated progress
        userProgress = db.get('users_progress')
          .find({ userId })
          .value() as UserProgress;
      } else {
        // Create new progress
        userProgress = {
          userId,
          items: items !== undefined ? items : 0,
          misinformationBestScore: misinformationScore !== undefined ? misinformationScore : 0,
        };
        
        db.get('users_progress')
          .push(userProgress)
          .write();
      }

      // Add to game scores for leaderboard
      if (misinformationScore !== undefined) {
        const scoreEntry: ScoreEntry = {
          userId,
          userName: session.user.name || session.user.email || 'Anonymous',
          score: misinformationScore,
          timestamp: new Date().toISOString()
        };
        
        db.get('game_scores')
          .push(scoreEntry)
          .write();

        // Keep only top 100 scores to prevent database bloat
        const allScores = db.get('game_scores')
          .orderBy(['score'], ['desc'])
          .value() as ScoreEntry[];
          
        if (allScores.length > 100) {
          db.set('game_scores', allScores.slice(0, 100))
            .write();
        }
      }

      res.status(200).json(userProgress);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling progress request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 