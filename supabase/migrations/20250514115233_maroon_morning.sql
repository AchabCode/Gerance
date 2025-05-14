/*
  # Update Simulator Configurations Table

  1. New Tables
    - `simulator_configs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `rake` (numeric)
      - `rakeback` (numeric)
      - `winrate` (numeric)
      - `hours_per_week` (numeric)
      - `nl_limit` (integer)
      - `table_count` (integer)
      - `current_bankroll` (numeric)
      - `monthly_withdrawal` (numeric)
      - `start_date` (timestamptz)
      - `simulation_period` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own configs
*/

CREATE TABLE IF NOT EXISTS simulator_configs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    rake numeric,
    rakeback numeric,
    winrate numeric,
    hours_per_week numeric,
    nl_limit integer,
    table_count integer,
    current_bankroll numeric,
    monthly_withdrawal numeric,
    start_date timestamptz,
    simulation_period text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE simulator_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulator configs"
    ON simulator_configs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulator configs"
    ON simulator_configs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulator configs"
    ON simulator_configs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulator configs"
    ON simulator_configs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_simulator_configs_updated_at
    BEFORE UPDATE ON simulator_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();