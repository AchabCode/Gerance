/*
  # Add Live Simulator Table

  1. New Tables
    - `simulator_cashgame_live`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount_of_bb` (integer)
      - `bb_won` (integer)
      - `rb_percent` (integer)
      - `month_hours` (integer)
      - `mensual_fees` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS simulator_cashgame_live (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    amount_of_bb integer,
    bb_won integer,
    rb_percent integer,
    month_hours integer,
    mensual_fees integer,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE simulator_cashgame_live ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulator data"
    ON simulator_cashgame_live
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulator data"
    ON simulator_cashgame_live
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulator data"
    ON simulator_cashgame_live
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulator data"
    ON simulator_cashgame_live
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);