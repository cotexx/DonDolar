/*
  # Fix service role policies for all tables
  
  1. Changes
    - Add comprehensive policies for service role
    - Ensure service role has full access to all tables
    
  2. Security
    - Service role gets unrestricted access
    - Maintains existing security for other roles
*/

-- Drop existing policies for service role to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Service role can manage news" ON news;
  DROP POLICY IF EXISTS "Service role can manage storage" ON storage.objects;
END $$;

-- Create new comprehensive policies for service role
DO $$ 
BEGIN
  -- News table policy
  CREATE POLICY "Service role can manage news"
    ON news
    AS PERMISSIVE
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

  -- Storage objects policy
  CREATE POLICY "Service role can manage storage"
    ON storage.objects
    AS PERMISSIVE
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
    
  -- News tags policy
  CREATE POLICY "Service role can manage news_tags"
    ON news_tags
    AS PERMISSIVE
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
    
  -- Tags policy
  CREATE POLICY "Service role can manage tags"
    ON tags
    AS PERMISSIVE
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
END $$;