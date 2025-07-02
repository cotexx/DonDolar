/*
  # Add crypto news support
  
  1. New Tables
    - `crypto_news`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `subtitle` (text)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)
      - `published` (boolean)
      - `type` (text) - For different types of crypto news (e.g., 'bitcoin', 'ethereum', 'defi')

  2. Security
    - Enable RLS
    - Public can read published news
    - Authenticated users can manage news
    - Service role has full access
*/

CREATE TABLE IF NOT EXISTS crypto_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  subtitle text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  published boolean DEFAULT false,
  type text
);

ALTER TABLE crypto_news ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published news
CREATE POLICY "Public can read published crypto news"
  ON crypto_news
  FOR SELECT
  TO public
  USING (published = true);

-- Policy for authenticated users to manage news
CREATE POLICY "Authenticated users can manage crypto news"
  ON crypto_news
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for service role
CREATE POLICY "Service role can manage crypto news"
  ON crypto_news
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert sample crypto news
INSERT INTO crypto_news (title, content, image_url, published, type, created_at) VALUES
(
  'Bitcoin y Ethereum alcanzan nuevos máximos mientras el mercado crypto se dispara',
  'Las principales criptomonedas continúan su tendencia alcista, impulsadas por la creciente adopción institucional y la mejora en las condiciones macroeconómicas globales. Los analistas sugieren que este rally podría extenderse.',
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80',
  true,
  'market',
  NOW()
),
(
  'Ethereum 2.0 supera expectativas de rendimiento',
  'La actualización de la red muestra resultados prometedores en términos de escalabilidad y eficiencia energética.',
  'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80',
  true,
  'ethereum',
  NOW() - INTERVAL '5 hours'
),
(
  'USDT mantiene su dominio en el mercado de stablecoins',
  'Tether continúa liderando el mercado de stablecoins a pesar de la creciente competencia.',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80',
  true,
  'stablecoin',
  NOW() - INTERVAL '8 hours'
),
(
  'DeFi alcanza nuevo récord de valor bloqueado',
  'El sector DeFi continúa creciendo con nuevos protocolos y mayor adopción.',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80',
  true,
  'defi',
  NOW() - INTERVAL '12 hours'
),
(
  'El mercado NFT muestra señales de recuperación',
  'Después de un período de baja actividad, el mercado de NFTs comienza a mostrar signos de recuperación.',
  'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80',
  true,
  'nft',
  NOW() - INTERVAL '1 day'
);