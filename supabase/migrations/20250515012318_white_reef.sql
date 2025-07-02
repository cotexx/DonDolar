/*
  # Migrate crypto news to main news table
  
  1. Changes
    - Move all crypto_news data to news table with type='crypto'
    - Drop crypto_news table after migration
    
  2. Notes
    - Preserves all existing data
    - Sets appropriate type field
    - Maintains published status
*/

-- First, migrate the data
INSERT INTO news (
  title,
  content,
  subtitle,
  image_url,
  created_at,
  published,
  type
)
SELECT 
  title,
  content,
  subtitle,
  image_url,
  created_at,
  published,
  COALESCE(type, 'crypto') as type
FROM crypto_news;

-- Drop the old table
DROP TABLE IF EXISTS crypto_news;