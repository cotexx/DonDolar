/*
  # Create news table and policies

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)
      - `published` (boolean)

  2. Security
    - Enable RLS on `news` table
    - Add policies for:
      - Public can read published news
      - Authenticated admin can manage all news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  published boolean DEFAULT false
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published news
CREATE POLICY "Public can read published news"
  ON news
  FOR SELECT
  TO public
  USING (published = true);

-- Policy for admin to manage all news
CREATE POLICY "Admin can manage all news"
  ON news
  TO authenticated
  USING (true)
  WITH CHECK (true);