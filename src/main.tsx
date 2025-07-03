import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Legal from './pages/Legal.tsx';
import Admin from './pages/Admin.tsx';
import Login from './pages/Login.tsx';
import News from './pages/News.tsx';
import DolarBlueHoy from './pages/DolarBlueHoy.tsx';
import NewsDetail from './pages/NewsDetail.tsx';
import Crypto from './pages/Crypto.tsx';
import CryptoDetail from './pages/CryptoDetail.tsx';
import Economy from './pages/Economy.tsx';
import Current from './pages/Current.tsx';
import './index.css';
console.log("🔍 VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("🔍 VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("🔍 ENTORNO COMPLETO:", import.meta.env);
console.log("Netlify: VITE_SUPABASE_URL =", import.meta.env.VITE_SUPABASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dolar-blue-hoy" element={<DolarBlueHoy />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/noticias/:id/:slug" element={<NewsDetail />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/crypto/:id" element={<CryptoDetail />} />
        <Route path="/economia" element={<Economy />} />
        <Route path="/actualidad" element={<Current />} />
      </Routes>
    </Router>
  </StrictMode>
);