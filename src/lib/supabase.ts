import { createClient } from '@supabase/supabase-js';

// ✅ Valores por defecto para Bolt.new u otros entornos sin .env
const fallbackUrl = "https://nrqquokeqnxfowpjndhy.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycXF1b2tlcW54Zm93cGpuZGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTc3NTYsImV4cCI6MjA1ODA3Mzc1Nn0.BqQlsuzsHkEhtXwMRIsFBrhbYb4hDiW2GbLme-UeB_8"; // tu clave anon

// ✅ Usa variables de entorno si existen (Netlify, Vite), o fallback si estás en Bolt
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || fallbackUrl;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || fallbackKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials missing.");
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);