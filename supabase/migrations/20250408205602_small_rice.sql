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

DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS news (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    image_url text,
    created_at timestamptz DEFAULT now(),
    published boolean DEFAULT false
  );

  ALTER TABLE news ENABLE ROW LEVEL SECURITY;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Public can read published news'
  ) THEN
    CREATE POLICY "Public can read published news"
      ON news
      FOR SELECT
      TO public
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Admin can manage all news'
  ) THEN
    CREATE POLICY "Admin can manage all news"
      ON news
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;