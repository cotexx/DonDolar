import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import SidebarRates from '../components/SidebarRates';
import TagsSidebar from '../components/TagsSidebar';
import SidebarBanner from '../components/SidebarBanner';
import LatestNewsSidebar from '../components/LatestNewsSidebar';
import RelatedArticles from '../components/RelatedArticles';
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

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [siteLatestNews, setSiteLatestNews] = useState<News[]>([]);
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
      fetchSiteLatestNews();
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

  async function fetchSiteLatestNews() {
    try {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setSiteLatestNews(data);
      }
    } catch (err) {
      console.error('Error fetching site latest news:', err);
    }
  }

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
        .eq('type', news.type || null)
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

  const getBackLink = () => {
    if (!news) return '/noticias';
    
    switch (news.type) {
      case 'actualidad':
        return '/actualidad';
      case 'economy':
        return '/economia';
      case 'crypto':
        return '/crypto';
      default:
        return '/noticias';
    }
  };

  const getBackText = () => {
    if (!news) return 'Noticias';
    
    switch (news.type) {
      case 'actualidad':
        return 'Actualidad';
      case 'economy':
        return 'Economía';
      case 'crypto':
        return 'Crypto';
      default:
        return 'Noticias';
    }
  };

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
          <div className="flex items-center gap-2 mt-4">
            <Link 
              to="/"
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Home size={20} />
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              to={getBackLink()}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              {getBackText()}
            </Link>
          </div>
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
        <div className="flex items-center gap-2 mb-6">
          <Link 
            to="/"
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <Home size={20} />
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            to={getBackLink()}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a {getBackText()}</span>
          </Link>
        </div>

        <div className="block lg:flex lg:gap-8">
          <div className="w-full lg:w-[70%]">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
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
            </article>

            {latestNews.length > 0 && (
              <RelatedArticles news={latestNews} type={news.type} />
            )}
          </div>

          <aside className="w-full lg:w-[30%] space-y-6 mt-8 lg:mt-0">
            <SidebarBanner />
            <SidebarRates rates={rates} />
            <LatestNewsSidebar news={siteLatestNews} />
            {news.news_tags && <TagsSidebar tags={news.news_tags} />}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}