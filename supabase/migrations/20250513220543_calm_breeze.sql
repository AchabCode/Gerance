/*
  # Add Simulator Configurations Table

  1. New Tables
    - `simulator_configs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `bb_amount` (numeric)
      - `bb_per_hour` (numeric)
      - `rakeback_hourly` (numeric)
      - `monthly_hours` (numeric)
      - `monthly_expenses` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS simulator_configs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    bb_amount numeric NOT NULL DEFAULT 0,
    bb_per_hour numeric NOT NULL DEFAULT 0,
    rakeback_hourly numeric NOT NULL DEFAULT 0,
    monthly_hours numeric NOT NULL DEFAULT 0,
    monthly_expenses numeric NOT NULL DEFAULT 0,
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

CREATE TRIGGER update_simulator_configs_updated_at
    BEFORE UPDATE ON simulator_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();