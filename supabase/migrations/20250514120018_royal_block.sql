/*
  # Add Cash Game Online Simulator Table

  1. New Tables
    - `simulator_cashgame_online`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `rake` (numeric)
      - `rakeback` (numeric)
      - `winrate` (numeric)
      - `hours_per_week` (numeric)
      - `limit` (integer)
      - `tables` (integer)
      - `bankroll` (numeric)
      - `cashout_monthly` (numeric)
      - `start_date` (date)
      - `duration_choice` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS simulator_cashgame_online (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    rake numeric,
    rakeback numeric,
    winrate numeric,
    hours_per_week numeric,
    limit integer,
    tables integer,
    bankroll numeric,
    cashout_monthly numeric,
    start_date date,
    duration_choice text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE simulator_cashgame_online ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulator data"
    ON simulator_cashgame_online
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulator data"
    ON simulator_cashgame_online
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulator data"
    ON simulator_cashgame_online
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulator data"
    ON simulator_cashgame_online
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);