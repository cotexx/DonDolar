/*
  # Add support for current events and international news
  
  1. Changes
    - Add sample news for 'current' and 'international' types
    - Uses existing news table structure with type field
    
  2. Notes
    - Maintains existing table structure
    - Adds specific content for new sections
    - Uses safe inserts with duplicate checking
*/

DO $$ 
DECLARE
  v_count integer;
BEGIN
  -- Check if any of these news items already exist
  SELECT COUNT(*) INTO v_count
  FROM news 
  WHERE title IN (
    'Avances en infraestructura: Nuevas obras transforman el paisaje urbano',
    'Innovación educativa: Implementan nuevas tecnologías en escuelas públicas',
    'Europa avanza en políticas de energía renovable',
    'Avances científicos prometen revolucionar la medicina',
    'Acuerdos comerciales fortalecen lazos entre Asia y América',
    'Innovaciones tecnológicas transforman la industria automotriz'
  );

  -- Only proceed with inserts if none of these news items exist
  IF v_count = 0 THEN
    -- Insert sample current events news
    INSERT INTO news (title, content, subtitle, image_url, published, type, created_at)
    VALUES
    (
      'Avances en infraestructura: Nuevas obras transforman el paisaje urbano',
      '<p>Las obras de infraestructura en curso están transformando significativamente el paisaje urbano, con proyectos que prometen mejorar la calidad de vida de los ciudadanos.</p>',
      'Importantes inversiones en obras públicas marcan un hito en el desarrollo urbano',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
      true,
      'current',
      NOW()
    ),
    (
      'Innovación educativa: Implementan nuevas tecnologías en escuelas públicas',
      '<p>El sistema educativo da un salto cualitativo con la incorporación de herramientas digitales y metodologías innovadoras de enseñanza.</p>',
      'La transformación digital llega a las aulas con un ambicioso programa de modernización',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      true,
      'current',
      NOW() - INTERVAL '1 day'
    ),
    (
      'Europa avanza en políticas de energía renovable',
      '<p>La Unión Europea establece nuevos objetivos ambiciosos para la transición hacia energías limpias.</p>',
      'Nuevas medidas buscan acelerar la adopción de energías sostenibles en el continente',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7',
      true,
      'international',
      NOW()
    ),
    (
      'Avances científicos prometen revolucionar la medicina',
      '<p>Investigadores logran importantes descubrimientos en el tratamiento de enfermedades crónicas.</p>',
      'Nuevas terapias muestran resultados prometedores en ensayos clínicos',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
      true,
      'international',
      NOW() - INTERVAL '2 hours'
    ),
    (
      'Acuerdos comerciales fortalecen lazos entre Asia y América',
      '<p>Nuevos tratados comerciales prometen impulsar el intercambio económico entre ambos continentes.</p>',
      'Las negociaciones culminan con importantes acuerdos de cooperación económica',
      'https://images.unsplash.com/photo-1554774853-719586f82d77',
      true,
      'international',
      NOW() - INTERVAL '4 hours'
    ),
    (
      'Innovaciones tecnológicas transforman la industria automotriz',
      '<p>Fabricantes de vehículos anuncian importantes avances en movilidad eléctrica y autónoma.</p>',
      'El futuro del transporte toma forma con nuevos desarrollos tecnológicos',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
      true,
      'international',
      NOW() - INTERVAL '6 hours'
    );
  END IF;
END $$;