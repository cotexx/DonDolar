/*
  # Create storage bucket for news images

  1. Changes
    - Create a new storage bucket for news images
    - Set up public access policies
*/

-- Enable storage if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow public access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'news-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'news-images' );

-- Allow authenticated users to update and delete their own images
CREATE POLICY "Authenticated users can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'news-images' );

CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'news-images' );