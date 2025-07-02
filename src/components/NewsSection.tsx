import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';

interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  created_at: string;
}

interface NewsSectionProps {
  news: News[];
}

const stripHtmlTags = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function NewsSection({ news }: NewsSectionProps) {
  if (!Array.isArray(news) || news.length === 0) {
    return null;
  }

  const newsToShow = news.slice(0, 5);
  const featuredNews = newsToShow.slice(0, 3);
  const miniNews = newsToShow.slice(3, 5);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Últimas noticias del dólar</h2>
        </div>
        <Link
          to="/noticias"
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
        >
          Ver todas las noticias
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredNews.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
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
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {truncateText(item.title, 100)}
                </h3>
                {item.subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {truncateText(item.subtitle, 150)}
                  </p>
                )}
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {miniNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {miniNews.map((item) => (
            <Link
              key={item.id}
              to={`/noticias/${item.id}/${slugify(item.title)}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex p-4 gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {truncateText(item.title, 80)}
                  </h3>
                  {item.subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {truncateText(item.subtitle, 150)}
                    </p>
                  )}
                  <time className="text-sm text-gray-500 dark:text-gray-400 block">
                    {format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}