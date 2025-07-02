/*
  # Add type column to news table

  1. Changes
    - Add nullable 'type' column to 'news' table to match crypto_news table structure
    - Column will store the type of news (e.g., 'market', 'bitcoin', etc.) when needed
    - Default value is NULL to maintain compatibility with existing records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'type'
  ) THEN
    ALTER TABLE news ADD COLUMN type text;
  END IF;
END $$;