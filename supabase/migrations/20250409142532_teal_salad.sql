/*
  # Add tags support for news articles

  1. New Tables
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp with time zone)

    - `news_tags` (junction table)
      - `news_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Public can read tags
      - Authenticated users can manage tags
*/

DO $$ BEGIN
  -- Create tags table if it doesn't exist
  CREATE TABLE IF NOT EXISTS tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  -- Create news_tags junction table if it doesn't exist
  CREATE TABLE IF NOT EXISTS news_tags (
    news_id uuid REFERENCES news(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (news_id, tag_id)
  );

  -- Enable RLS
  ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tags' 
    AND policyname = 'Public can read tags'
  ) THEN
    CREATE POLICY "Public can read tags"
      ON tags
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tags' 
    AND policyname = 'Authenticated users can manage tags'
  ) THEN
    CREATE POLICY "Authenticated users can manage tags"
      ON tags
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'news_tags' 
    AND policyname = 'Public can read news_tags'
  ) THEN
    CREATE POLICY "Public can read news_tags"
      ON news_tags
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'news_tags' 
    AND policyname = 'Authenticated users can manage news_tags'
  ) THEN
    CREATE POLICY "Authenticated users can manage news_tags"
      ON news_tags
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;