/*
  # Update policies for service role access
  
  1. Changes
    - Add comprehensive policies for service role
    - Ensure service role can manage both news and storage
    
  2. Security
    - Service role gets full access to required resources
    - Maintains existing security for other roles
*/

-- Allow service role to manage news
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'news' 
    AND policyname = 'Service role can manage news'
  ) THEN
    CREATE POLICY "Service role can manage news"
      ON news
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Allow service role to manage storage
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Service role can manage storage'
  ) THEN
    CREATE POLICY "Service role can manage storage"
      ON storage.objects
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;