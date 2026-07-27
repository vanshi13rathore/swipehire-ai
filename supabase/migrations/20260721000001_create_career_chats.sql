-- Create career_chats table
CREATE TABLE career_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE career_chats ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own career chats"
  ON career_chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career chats"
  ON career_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career chats"
  ON career_chats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own career chats"
  ON career_chats FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON career_chats
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
