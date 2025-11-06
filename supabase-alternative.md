# Supabase Alternative to lowdb

## Why Supabase?
- Production-ready PostgreSQL database
- Built-in authentication (can replace NextAuth.js)
- Real-time subscriptions for live leaderboards
- Row Level Security (RLS) for data protection
- Free tier includes 500MB database

## Setup Commands
```bash
npm install @supabase/supabase-js
# Create .env.local with your Supabase credentials
```

## Database Schema
```sql
-- Users table (handled by Supabase Auth)
-- Custom user_progress table
CREATE TABLE user_progress (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  items integer DEFAULT 0,
  misinformation_best_score integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Game scores for leaderboard
CREATE TABLE game_scores (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text,
  score integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view leaderboard" ON game_scores
  FOR SELECT USING (true);
```

## Simplified API Route Example
```javascript
// pages/api/game/progress.js with Supabase
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message })
    }
    
    return res.json(data || { items: 0, misinformation_best_score: 0 })
  }
  
  // POST logic for updates...
}
```  