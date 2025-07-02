/*
  # Create webhook_logs table for Make integration

  1. New Tables
    - `webhook_logs`
      - `id` (uuid, primary key)
      - `source` (text, not null)
      - `payload` (jsonb, not null)
      - `signature` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS
    - Only authenticated users can read logs
    - System can insert logs
*/

CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  payload jsonb NOT NULL,
  signature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read logs
CREATE POLICY "Authenticated users can read webhook logs"
  ON webhook_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow system to insert logs
CREATE POLICY "System can insert webhook logs"
  ON webhook_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);