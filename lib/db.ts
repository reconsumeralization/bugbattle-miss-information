const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

interface UserProgress {
  userId: string;
  level: number;
  score: number;
  achievements: string[];
}

interface GameScore {
  userId: string;
  score: number;
  timestamp: string;
  gameMode: string;
}

interface DatabaseSchema {
  users_progress: UserProgress[];
  game_scores: GameScore[];
}

// Create database adapter
const adapter = new FileSync(path.join(process.cwd(), 'data', 'db.json'));
const db = low(adapter);

// Set default database structure
db.defaults({ 
  users_progress: [], 
  game_scores: [] 
}).write();

export default db; 