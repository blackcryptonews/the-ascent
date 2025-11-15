-- Giant Within Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding data table
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  goals TEXT[] NOT NULL, -- Array of goal categories
  satisfaction JSONB NOT NULL, -- { health, career, relationships, personal, finances }
  motivation_style TEXT NOT NULL,
  challenge TEXT NOT NULL,
  checkin_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom goals table (user-created goals)
CREATE TABLE custom_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  description TEXT,
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affirmations completion tracking
CREATE TABLE affirmations_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  affirmation_text TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily journal entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_text TEXT NOT NULL,
  sentiment TEXT, -- positive, negative, neutral
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transformation exercises log
CREATE TABLE transformation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER
);

-- Streak tracking
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_points INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_completed ON goals(completed);
CREATE INDEX idx_onboarding_user_id ON onboarding_data(user_id);
CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_transformation_user_id ON transformation_log(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own onboarding" ON onboarding_data FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own onboarding" ON onboarding_data FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own onboarding" ON onboarding_data FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own custom goals" ON custom_goals FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own affirmations" ON affirmations_log FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own journal" ON journal_entries FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own transformations" ON transformation_log FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid()::text = user_id::text);

-- Insert default goal templates
INSERT INTO goals (id, user_id, name, category, is_custom, completed) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Exercise 3x per week', 'health', false, false),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Drink 8 glasses of water daily', 'health', false, false),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Complete one online course', 'career', false, false),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Network with 3 new people', 'career', false, false),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'Weekly quality time with family', 'relationships', false, false),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'Call an old friend', 'relationships', false, false),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'Meditate for 10 minutes daily', 'personal', false, false),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'Read for 30 minutes daily', 'personal', false, false),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'Create a monthly budget', 'finances', false, false),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'Save 10% of income', 'finances', false, false);
