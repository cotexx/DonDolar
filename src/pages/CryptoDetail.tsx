import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import SidebarRates from '../components/SidebarRates';
import TagsSidebar from '../components/TagsSidebar';
import SidebarBanner from '../components/SidebarBanner';
import Navbar from '../components/Navbar';
import ShareButtons from '../components/ShareButtons';
import Footer from '../components/Footer';
import { slugify } from '../utils/slugify';

interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  created_at: string;
  type?: string;
  news_tags?: {
    tags: {
      id: string;
      name: string;
    };
  }[];
}

interface Rate {
  compra: number;
  venta: number;
  nombre: string;
}

export default function CryptoDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
      fetchRates();
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  async function fetchLatestNews() {
    try {
      if (!news) return;

      const { data } = await supabase
        .from('news')
        .select(`
          *,
          news_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('type', 'crypto')
        .eq('published', true)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (data) {
        setLatestNews(data);
      }
    } catch (err) {
      console.error('Error fetching latest news:', err);
    }
  }

  async function fetchRates() {
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) {
        throw new Error('Error fetching rates');
      }
      const data = await response.json();
      const updatedData = data.map((rate: Rate) => {
        if (rate.nombre.toLowerCase() === 'bolsa') {
          return { ...rate, nombre: 'Bolsa / MEP' };
        }
        return rate;
      });
      setRates(updatedData);
    } catch (err) {
      console.error('Error fetching rates:', err);
    }
  }

  async function fetchNewsDetail() {
    try {
      setLoading(true);
      
      const { data: currentNews, error: currentError } = await supabase
        .from('news')
        .select(`
          *,
          news_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .eq('type', 'crypto')
        .eq('published', true)
        .single();

      if (currentError) throw currentError;
      if (!currentNews) throw new Error('Noticia no encontrada');

      setNews(currentNews);
      fetchLatestNews();
    } catch (err) {
      setError('Error al cargar la noticia. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
        <div className="container mx-auto px-4 py-8">
          <Header />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
        <div className="container mx-auto px-4 py-8">
          <Header />
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error || 'Noticia no encontrada'}</p>
          </div>
          <Link 
            to="/crypto"
            className="inline-flex items-center gap-2 mt-4 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a crypto</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
      <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/crypto"
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a crypto</span>
          </Link>
        </div>

        <div className="block lg:flex lg:gap-8">
          <article className="w-full lg:w-[70%]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
              {news.image_url && (
                <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 dark:text-white mb-4">
                  {news.title}
                </h1>
                {news.subtitle && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4 md:mb-6 italic">
                    {news.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar size={20} />
                  <time>
                    {format(new Date(news.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </time>
                </div>
                <ShareButtons 
                  url={window.location.href} 
                  title={news.title}
                />
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none mt-6"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>
            </div>

            {latestNews.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">
                  Más noticias de Crypto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestNews.map((item) => (
                    <article
                      key={item.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      <Link to={`/noticias/${item.id}/${slugify(item.title)}`}>
                        {item.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-blue-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {item.subtitle}
                            </p>
                          )}
                          <div 
                            className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 text-sm"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          <div className="flex justify-between items-center">
                            <time className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                            </time>
                            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                              Leer más
                              <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="w-full lg:w-[30%] space-y-6 mt-8 lg:mt-0">
            <SidebarBanner />
            <SidebarRates rates={rates} />
            {news.news_tags && <TagsSidebar tags={news.news_tags} />}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}