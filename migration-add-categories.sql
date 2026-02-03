-- Migration: Add category and notes columns to expenses table
-- Run this if you already have the expenses table set up

-- Add category column (defaults to 'other')
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other';

-- Add notes column for optional expense notes
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Update any existing expenses without categories to 'other'
UPDATE expenses 
SET category = 'other' 
WHERE category IS NULL;
