import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Newspaper, ArrowRight, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { slugify } from '../utils/slugify';

interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  created_at: string;
  news_tags?: {
    tags: {
      id: string;
      name: string;
    };
  }[];
}

const ITEMS_PER_PAGE = 22;

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const tagFilter = searchParams.get('tag');

  useEffect(() => {
    fetchNews();
  }, [currentPage, tagFilter]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  async function fetchNews() {
    try {
      setLoading(true);
      
      let query = supabase
        .from('news')
        .select(`
          *,
          news_tags (
            tags (
              id,
              name
            )
          )
        `, { count: 'exact' })
        .eq('published', true)
        .is('type', null)
        .order('created_at', { ascending: false });

      if (tagFilter) {
        query = query.eq('news_tags.tags.name', tagFilter);
      }

      // Calculate the range for pagination
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query.range(start, end);

      if (error) {
        throw error;
      }

      if (count !== null) {
        setTotalItems(count);
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

      setNews(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Error al cargar las noticias. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const handleTagClick = (tagName: string) => {
    setSearchParams({ tag: tagName });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
        <div className="container mx-auto px-4 py-12">
          <Header />
          <div id="loading-section" className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  const featuredNews = news[0];
  const sidebarNews = news.slice(1, 4);
  const remainingNews = news.slice(4);

  return (
    <div id="latest-news-page" className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
      <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
      <div className="container mx-auto px-4 py-12">
        <Header />
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <div id="news-header" className="flex items-center gap-3 mb-8">
          <Newspaper className="w-10 h-10 text-yellow-400" />
          <div>
            <h2 className="text-4xl font-bold text-white">
              {tagFilter ? `Noticias sobre ${tagFilter}` : 'Últimas Noticias'}
            </h2>
            <p className="text-blue-100 dark:text-gray-300 mt-2">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} encontrados
            </p>
          </div>
        </div>

        {error && (
          <div id="error-section" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Featured Article */}
          <article className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <Link to={`/noticias/${featuredNews.id}/${slugify(featuredNews.title)}`}>
              {featuredNews.image_url && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={featuredNews.image_url}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-3">
                  {featuredNews.title}
                </h3>
                {featuredNews.subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    {featuredNews.subtitle}
                  </p>
                )}
                <div 
                  className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: featuredNews.content }}
                />
                {featuredNews.news_tags && featuredNews.news_tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                    <div className="flex flex-wrap gap-2">
                      {featuredNews.news_tags.map((nt) => (
                        <button
                          key={nt.tags.id}
                          onClick={() => handleTagClick(nt.tags.name)}
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          {nt.tags.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(featuredNews.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                </time>
              </div>
            </Link>
          </article>

          {/* Sidebar News */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-white mb-6">
              Últimas Noticias
            </h4>
            <div className="space-y-6">
              {sidebarNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/noticias/${item.id}/${slugify(item.title)}`}
                  className="block group"
                >
                  <div className="flex gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-blue-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                      {item.subtitle && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.subtitle}
                        </p>
                      )}
                      <time className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                        {format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid News */}
        <div id="news-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {remainingNews.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              {item.image_url && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Link to={`/noticias/${item.id}/${slugify(item.title)}`}>{item.title}</Link>
                </h2>
                {item.subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 italic">
                    {item.subtitle}
                  </p>
                )}
                <div 
                  className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                {item.news_tags && item.news_tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                    <div className="flex flex-wrap gap-2">
                      {item.news_tags.map((nt) => (
                        <button
                          key={nt.tags.id}
                          onClick={() => handleTagClick(nt.tags.name)}
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          {nt.tags.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </time>
                  <Link
                    to={`/noticias/${item.id}/${slugify(item.title)}`}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Leer más
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div id="pagination-section" className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}