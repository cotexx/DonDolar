/*
  # Add Economy and Finance news support
  
  1. Changes
    - Add 'economy' type to news table
    - Add sample economy news articles
    
  2. Notes
    - Uses existing news table structure
    - Adds economy-specific content
*/

-- Insert sample economy news
INSERT INTO news (title, content, subtitle, image_url, published, type, created_at)
VALUES
(
  'Banco Central ajusta política monetaria ante presiones inflacionarias',
  '<p>El Banco Central de la República Argentina (BCRA) anunció hoy nuevas medidas para contener las presiones inflacionarias y estabilizar el mercado financiero. Entre las principales disposiciones se encuentra un ajuste en las tasas de interés de referencia y nuevos mecanismos de control sobre la liquidez del sistema.</p><p>Los analistas del mercado consideran que estas medidas podrían tener un impacto significativo en el corto plazo, aunque advierten sobre la necesidad de mantener una política monetaria consistente para lograr resultados duraderos.</p>',
  'La autoridad monetaria implementa nuevas medidas para estabilizar el mercado financiero',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
  true,
  'economy',
  NOW()
),
(
  'Mercado bursátil local muestra señales de recuperación',
  '<p>El índice Merval registra un importante repunte impulsado por acciones del sector financiero y energético. Los inversores muestran un renovado optimismo ante las perspectivas de recuperación económica y las nuevas medidas implementadas por el gobierno.</p><p>El volumen de operaciones ha aumentado significativamente en las últimas sesiones, lo que los especialistas interpretan como una señal positiva de confianza en el mercado local.</p>',
  'Acciones líderes muestran importante recuperación en la última semana',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f',
  true,
  'economy',
  NOW() - INTERVAL '1 day'
),
(
  'Nuevas medidas fiscales buscan impulsar la inversión productiva',
  '<p>El Ministerio de Economía anunció un paquete de incentivos fiscales orientados a promover la inversión en sectores productivos clave. Las medidas incluyen beneficios impositivos para empresas que realicen inversiones en tecnología y expansión de capacidad productiva.</p><p>El sector empresario recibió positivamente el anuncio, aunque señala la importancia de mantener reglas claras y estables en el largo plazo para garantizar el éxito de estas iniciativas.</p>',
  'El gobierno implementa beneficios fiscales para estimular el crecimiento económico',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
  true,
  'economy',
  NOW() - INTERVAL '2 days'
);