/*
  # Add more current news articles
  
  1. Changes
    - Add more diverse content to the current news section
    - Include articles about technology, society, and culture
    - Ensure proper formatting and rich content
    
  2. Notes
    - All articles are set as published
    - Uses high-quality Unsplash images
    - Includes detailed content with proper HTML formatting
*/

DO $$ 
DECLARE
  v_count integer;
BEGIN
  -- Check if any of these news items already exist
  SELECT COUNT(*) INTO v_count
  FROM news 
  WHERE title IN (
    'Descubrimiento arqueológico revela nueva perspectiva histórica',
    'Avances en inteligencia artificial prometen revolucionar la industria',
    'Festival cultural celebra la diversidad artística local',
    'Investigadores desarrollan nueva tecnología sostenible',
    'Proyecto innovador transforma espacios urbanos abandonados'
  );

  -- Only proceed with inserts if none of these news items exist
  IF v_count = 0 THEN
    INSERT INTO news (title, content, subtitle, image_url, published, type, created_at)
    VALUES
    (
      'Descubrimiento arqueológico revela nueva perspectiva histórica',
      '<p>Un equipo de arqueólogos ha realizado un hallazgo sin precedentes que podría cambiar nuestra comprensión de la historia regional. Los artefactos encontrados sugieren conexiones culturales previamente desconocidas entre antiguas civilizaciones.</p><p>El descubrimiento incluye una serie de objetos ceremoniales y herramientas que datan de hace más de 2,000 años, proporcionando nueva información sobre las prácticas culturales y comerciales de la época.</p>',
      'Hallazgo histórico aporta nuevas evidencias sobre antiguas civilizaciones',
      'https://images.unsplash.com/photo-1544015759-237f87b95e79',
      true,
      'current',
      NOW() - INTERVAL '2 hours'
    ),
    (
      'Avances en inteligencia artificial prometen revolucionar la industria',
      '<p>Nuevos desarrollos en el campo de la inteligencia artificial están transformando la manera en que las empresas operan. Las innovaciones recientes permiten una mayor eficiencia y precisión en procesos industriales complejos.</p><p>Expertos señalan que estas tecnologías podrían generar importantes beneficios económicos y mejoras en la productividad durante los próximos años.</p>',
      'Innovaciones tecnológicas marcan un punto de inflexión en la producción industrial',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      true,
      'current',
      NOW() - INTERVAL '3 hours'
    ),
    (
      'Festival cultural celebra la diversidad artística local',
      '<p>La ciudad se prepara para acoger un importante festival cultural que reunirá a artistas locales y regionales. El evento, que se extenderá durante una semana, incluirá exposiciones de arte, presentaciones musicales y talleres interactivos.</p><p>Los organizadores esperan que esta iniciativa fortalezca el tejido cultural de la comunidad y promueva el intercambio artístico.</p>',
      'Evento cultural promete enriquecer la escena artística de la región',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      true,
      'current',
      NOW() - INTERVAL '4 hours'
    ),
    (
      'Investigadores desarrollan nueva tecnología sostenible',
      '<p>Un equipo de científicos ha presentado una innovadora solución tecnológica que promete reducir significativamente el impacto ambiental en procesos industriales. La nueva tecnología utiliza materiales reciclados y reduce el consumo energético en hasta un 60%.</p><p>Los primeros resultados muestran un potencial significativo para su implementación en diversos sectores industriales.</p>',
      'Innovación tecnológica marca un hito en la lucha contra el cambio climático',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
      true,
      'current',
      NOW() - INTERVAL '5 hours'
    ),
    (
      'Proyecto innovador transforma espacios urbanos abandonados',
      '<p>Una iniciativa ciudadana está revitalizando áreas urbanas en desuso, convirtiéndolas en espacios comunitarios vibrantes. El proyecto incluye la creación de jardines urbanos, áreas recreativas y espacios culturales.</p><p>La transformación de estos espacios ha generado un impacto positivo en la calidad de vida de los residentes y ha fortalecido los lazos comunitarios.</p>',
      'Iniciativa comunitaria revitaliza el paisaje urbano con proyectos sostenibles',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      true,
      'current',
      NOW() - INTERVAL '6 hours'
    );
  END IF;
END $$;