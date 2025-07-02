/*
  # Update current news items to ensure all have subtitles
  
  1. Changes
    - Add or update subtitles for all current news items
    - Ensure descriptive and relevant subtitles for each article
    
  2. Notes
    - Only updates news items of type 'current'
    - Only updates items with missing or empty subtitles
*/

DO $$ 
BEGIN
  -- Update news items of type 'current' that don't have subtitles
  UPDATE news 
  SET subtitle = CASE 
    WHEN title LIKE '%infraestructura%'
    THEN 'Modernización urbana impulsa el desarrollo y mejora la calidad de vida de los ciudadanos'
    WHEN title LIKE '%educativa%'
    THEN 'Revolución digital en la educación marca un antes y después en el sistema educativo'
    WHEN title LIKE '%arqueológico%'
    THEN 'Importante hallazgo revela nuevos detalles sobre el pasado de nuestra región'
    WHEN title LIKE '%inteligencia artificial%'
    THEN 'La IA marca el comienzo de una nueva era en la optimización industrial'
    WHEN title LIKE '%Festival cultural%'
    THEN 'Celebración artística reúne lo mejor del talento local y regional'
    WHEN title LIKE '%tecnología sostenible%'
    THEN 'Avance científico promete revolucionar la industria con soluciones eco-amigables'
    WHEN title LIKE '%espacios urbanos%'
    THEN 'Transformación urbana genera nuevos espacios de encuentro y desarrollo comunitario'
    ELSE subtitle
  END
  WHERE type = 'current' 
  AND (subtitle IS NULL OR subtitle = '');
END $$;