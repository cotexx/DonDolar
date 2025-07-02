# Dólar Blue Hoy

Este proyecto es una aplicación web que muestra las cotizaciones actualizadas del dólar y otras monedas en Argentina, incluyendo:

- Dólar Blue
- Dólar Oficial
- Dólar MEP
- Dólar CCL
- USDT
- Bitcoin
- Ethereum

## Características

- Cotizaciones en tiempo real
- Conversor de monedas
- Sección de noticias
- Modo oscuro
- Diseño responsive
- Panel de administración

## Estructura del Proyecto

```
src/
├── components/
│   ├── CurrencyConverter.tsx
│   └── NewsSection.tsx
├── pages/
│   ├── Admin.tsx
│   ├── Legal.tsx
│   ├── Login.tsx
│   ├── News.tsx
│   └── NewsDetail.tsx
├── lib/
│   └── supabase.ts
├── App.tsx
└── main.tsx

supabase/
└── migrations/
    ├── 20250408021208_graceful_trail.sql
    ├── 20250408205602_small_rice.sql
    └── 20250408205654_stark_flower.sql
```

## Tecnologías Utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- Lucide React Icons

## Variables de Entorno

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Dependencias Principales

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "date-fns": "^2.30.0"
  }
}
```