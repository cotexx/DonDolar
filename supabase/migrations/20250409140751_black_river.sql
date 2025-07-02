/*
  # Add subtitle field to news articles

  1. Changes
    - Add `subtitle` column to news table
    - Update existing news articles with sample subtitles

  2. Notes
    - The subtitle (copete) provides a brief summary of the article
    - Field is optional but recommended for better article presentation
*/

ALTER TABLE news ADD COLUMN IF NOT EXISTS subtitle text;

-- Update existing news with subtitles
UPDATE news SET subtitle = CASE 
  WHEN title LIKE '%récord histórico%' 
  THEN 'La cotización informal de la divisa estadounidense marcó un nuevo máximo en medio de la incertidumbre económica'
  WHEN title LIKE '%Medidas económicas%' 
  THEN 'El gobierno implementa nuevas regulaciones para estabilizar el mercado cambiario mientras los analistas evalúan su efectividad'
  WHEN title LIKE '%Perspectivas%' 
  THEN 'Especialistas analizan las tendencias del mercado y proyectan escenarios para los próximos meses'
  ELSE subtitle 
END
WHERE subtitle IS NULL;