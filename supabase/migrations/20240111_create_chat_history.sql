-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own chat history
CREATE POLICY "Users can view their own chat history" 
ON chat_history FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert into their own chat history
CREATE POLICY "Users can insert into their own chat history" 
ON chat_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);