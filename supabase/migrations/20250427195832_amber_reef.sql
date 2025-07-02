/*
  # Create storage bucket for news images
  
  1. Changes
    - Create a public bucket for news images
    - Set up policies for public access and authenticated user management
    
  2. Security
    - Public can view images
    - Only authenticated users can upload, update, and delete images
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow public access to images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING ( bucket_id = 'news-images' );
  END IF;
END $$;

-- Allow authenticated users to upload images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'news-images' );
  END IF;
END $$;

-- Allow authenticated users to update their images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update their images'
  ) THEN
    CREATE POLICY "Authenticated users can update their images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( bucket_id = 'news-images' );
  END IF;
END $$;

-- Allow authenticated users to delete their images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete their images'
  ) THEN
    CREATE POLICY "Authenticated users can delete their images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( bucket_id = 'news-images' );
  END IF;
END $$;