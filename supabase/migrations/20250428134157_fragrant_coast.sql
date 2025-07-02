/*
  # Update news table policies to allow service role access
  
  1. Changes
    - Add policy to allow service role to manage news entries
    
  2. Security
    - Service role can perform all operations on news table
    - Maintains existing policies for other roles
*/

-- Allow service role to manage news
CREATE POLICY "Service role can manage news"
  ON news
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);