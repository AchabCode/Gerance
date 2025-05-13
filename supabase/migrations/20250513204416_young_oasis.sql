/*
  # Initial Schema Setup for Poker Bankroll Manager

  1. New Tables
    - `bankroll_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (enum: cash, poker_site, bank_account, crypto)
      - `name` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bankroll_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (timestamptz)
      - `amount` (numeric)
      - `created_at` (timestamptz)

    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (timestamptz)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `hourly_rate_params`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `bb_amount` (numeric)
      - `bb_per_hour` (numeric)
      - `rakeback_hourly` (numeric)
      - `monthly_hours` (numeric)
      - `monthly_expenses` (numeric)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE bankroll_item_type AS ENUM ('cash', 'poker_site', 'bank_account', 'crypto');

-- Create bankroll_items table
CREATE TABLE IF NOT EXISTS bankroll_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    type bankroll_item_type NOT NULL,
    name text NOT NULL,
    amount numeric NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create bankroll_history table
CREATE TABLE IF NOT EXISTS bankroll_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    date timestamptz NOT NULL DEFAULT now(),
    amount numeric NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    date timestamptz NOT NULL DEFAULT now(),
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create hourly_rate_params table
CREATE TABLE IF NOT EXISTS hourly_rate_params (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
    bb_amount numeric NOT NULL DEFAULT 0,
    bb_per_hour numeric NOT NULL DEFAULT 0,
    rakeback_hourly numeric NOT NULL DEFAULT 0,
    monthly_hours numeric NOT NULL DEFAULT 0,
    monthly_expenses numeric NOT NULL DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bankroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bankroll_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_rate_params ENABLE ROW LEVEL SECURITY;

-- Create policies for bankroll_items
CREATE POLICY "Users can view their own bankroll items"
    ON bankroll_items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bankroll items"
    ON bankroll_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bankroll items"
    ON bankroll_items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bankroll items"
    ON bankroll_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for bankroll_history
CREATE POLICY "Users can view their own bankroll history"
    ON bankroll_history
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bankroll history"
    ON bankroll_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policies for journal_entries
CREATE POLICY "Users can view their own journal entries"
    ON journal_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
    ON journal_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON journal_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON journal_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for hourly_rate_params
CREATE POLICY "Users can view their own hourly rate params"
    ON hourly_rate_params
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own hourly rate params"
    ON hourly_rate_params
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hourly rate params"
    ON hourly_rate_params
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bankroll_items_updated_at
    BEFORE UPDATE ON bankroll_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hourly_rate_params_updated_at
    BEFORE UPDATE ON hourly_rate_params
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();