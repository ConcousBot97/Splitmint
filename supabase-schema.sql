-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase auth handles this, but we'll create a profiles table)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  payer_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  split_mode TEXT CHECK (split_mode IN ('equal', 'custom', 'percentage')) NOT NULL,
  category TEXT DEFAULT 'other',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense splits table
CREATE TABLE expense_splits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_participants_group_id ON participants(group_id);
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX idx_expense_splits_participant_id ON expense_splits(participant_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Users can view own groups" ON groups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own groups" ON groups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own groups" ON groups FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own groups" ON groups FOR DELETE USING (auth.uid() = user_id);

-- Participants policies
CREATE POLICY "Users can view participants in their groups" ON participants 
  FOR SELECT USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert participants in their groups" ON participants 
  FOR INSERT WITH CHECK (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can update participants in their groups" ON participants 
  FOR UPDATE USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete participants in their groups" ON participants 
  FOR DELETE USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));

-- Expenses policies
CREATE POLICY "Users can view expenses in their groups" ON expenses 
  FOR SELECT USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert expenses in their groups" ON expenses 
  FOR INSERT WITH CHECK (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can update expenses in their groups" ON expenses 
  FOR UPDATE USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete expenses in their groups" ON expenses 
  FOR DELETE USING (group_id IN (SELECT id FROM groups WHERE user_id = auth.uid()));

-- Expense splits policies
CREATE POLICY "Users can view expense splits in their groups" ON expense_splits 
  FOR SELECT USING (expense_id IN (SELECT id FROM expenses WHERE group_id IN (SELECT id FROM groups WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert expense splits in their groups" ON expense_splits 
  FOR INSERT WITH CHECK (expense_id IN (SELECT id FROM expenses WHERE group_id IN (SELECT id FROM groups WHERE user_id = auth.uid())));
CREATE POLICY "Users can update expense splits in their groups" ON expense_splits 
  FOR UPDATE USING (expense_id IN (SELECT id FROM expenses WHERE group_id IN (SELECT id FROM groups WHERE user_id = auth.uid())));
CREATE POLICY "Users can delete expense splits in their groups" ON expense_splits 
  FOR DELETE USING (expense_id IN (SELECT id FROM expenses WHERE group_id IN (SELECT id FROM groups WHERE user_id = auth.uid())));
