import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { slugify } from '../utils/slugify';

interface News {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  created_at: string;
  type?: string;
}

interface RelatedArticlesProps {
  news: News[];
  type?: string;
}

export default function RelatedArticles({ news, type }: RelatedArticlesProps) {
  const getSectionTitle = () => {
    switch (type) {
      case 'actualidad':
        return 'Más noticias de Actualidad';
      case 'economy':
        return 'Más noticias de Economía';
      case 'crypto':
        return 'Más noticias de Crypto';
      default:
        return 'Más noticias relacionadas';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">
        {getSectionTitle()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
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
  );
}