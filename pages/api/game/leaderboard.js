import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get top 10 scores, sorted by score descending
      const topScores = db.get('game_scores')
        .orderBy(['score'], ['desc'])
        .take(10)
        .value();

      res.status(200).json(topScores);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 