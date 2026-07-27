-- Create career_goals table
CREATE TABLE career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  target_value integer NOT NULL DEFAULT 100,
  current_value integer NOT NULL DEFAULT 0,
  metric text NOT NULL, -- e.g. "ATS Score", "Interviews", "Applications", "Custom"
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create dashboard_shares table for read-only access
CREATE TABLE dashboard_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  token text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_shares ENABLE ROW LEVEL SECURITY;

-- Goals Policies
CREATE POLICY "Users can view own goals" ON career_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON career_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON career_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON career_goals FOR DELETE USING (auth.uid() = user_id);

-- Shares Policies
CREATE POLICY "Users can manage own shares" ON dashboard_shares FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active shares by token" ON dashboard_shares FOR SELECT USING (is_active = true);

-- Create triggers
CREATE TRIGGER handle_updated_at_goals BEFORE UPDATE ON career_goals
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
