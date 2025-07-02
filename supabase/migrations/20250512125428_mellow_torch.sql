/*
  # Rename 'current' type to 'actualidad' in news table
  
  1. Changes
    - Update existing news items with type 'current' to 'actualidad'
    
  2. Notes
    - Safe update that preserves all existing data
    - Only affects news items with type = 'current'
*/

UPDATE news 
SET type = 'actualidad'
WHERE type = 'current';