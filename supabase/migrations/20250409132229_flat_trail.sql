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

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create news_tags junction table
CREATE TABLE IF NOT EXISTS news_tags (
  news_id uuid REFERENCES news(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (news_id, tag_id)
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;

-- Policies for tags
CREATE POLICY "Public can read tags"
  ON tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for news_tags
CREATE POLICY "Public can read news_tags"
  ON news_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage news_tags"
  ON news_tags
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some sample tags
INSERT INTO tags (name) VALUES
  ('Dólar Blue'),
  ('Mercado Cambiario'),
  ('Economía'),
  ('Banco Central'),
  ('Inflación'),
  ('Política Monetaria'),
  ('Reservas'),
  ('Tipo de Cambio'),
  ('Mercado Financiero'),
  ('Divisas')
ON CONFLICT (name) DO NOTHING;

-- Add tags to existing news
DO $$
DECLARE
  news_record RECORD;
  tag_ids uuid[];
BEGIN
  FOR news_record IN SELECT id FROM news LOOP
    -- Get 2-4 random tag IDs
    SELECT ARRAY(
      SELECT id 
      FROM tags 
      ORDER BY random() 
      LIMIT floor(random() * 3 + 2)::int
    ) INTO tag_ids;
    
    -- Insert into news_tags
    INSERT INTO news_tags (news_id, tag_id)
    SELECT news_record.id, tag_id
    FROM unnest(tag_ids) AS tag_id
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;