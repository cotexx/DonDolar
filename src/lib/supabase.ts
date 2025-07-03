import { createClient } from '@supabase/supabase-js';

// ✅ Valores por defecto para Bolt.new u otros entornos sin .env
const fallbackUrl = "https://TU_PROYECTO.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // tu clave anon

// ✅ Usa variables de entorno si existen (Netlify, Vite), o fallback si estás en Bolt
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || fallbackUrl;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || fallbackKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials missing.");
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);