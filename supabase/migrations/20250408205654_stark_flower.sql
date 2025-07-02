/*
  # Insert sample news articles

  1. Changes
    - Insert 3 sample news articles with realistic content about the dollar market
    - All articles are set as published
    - Include relevant images from Unsplash
*/

INSERT INTO news (title, content, image_url, published, created_at)
VALUES
  (
    'El dólar blue alcanza nuevo récord histórico',
    'El mercado cambiario argentino experimentó hoy una jornada de alta volatilidad, con el dólar blue alcanzando un nuevo máximo histórico. Analistas atribuyen este comportamiento a la incertidumbre económica y las expectativas inflacionarias. Los operadores del mercado sugieren que esta tendencia podría mantenerse en el corto plazo, mientras los inversores buscan refugio en la divisa estadounidense.',
    'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80',
    true,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Medidas económicas impactan en la cotización del dólar',
    'El gobierno anunció un nuevo paquete de medidas económicas que busca estabilizar el mercado cambiario. Entre las principales disposiciones se encuentra el refuerzo de los controles sobre la compra de divisas y nuevos incentivos para la liquidación de exportaciones. El mercado reaccionó con cautela ante estos anuncios, mientras los especialistas analizan el posible impacto en el corto y mediano plazo.',
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80',
    true,
    NOW() - INTERVAL '1 day'
  ),
  (
    'Análisis: Perspectivas del mercado cambiario para 2025',
    'Expertos del mercado financiero presentaron sus proyecciones para el comportamiento del dólar durante el resto del año. Las estimaciones consideran variables como la política monetaria, el nivel de reservas internacionales y el contexto económico global. La mayoría coincide en que la volatilidad seguirá siendo una característica predominante, aunque con posibles períodos de estabilización dependiendo de la efectividad de las medidas económicas implementadas.',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80',
    true,
    NOW()
  );