import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { slugify } from '../utils/slugify';

interface News {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  created_at: string;
}

interface LatestNewsSidebarProps {
  news: News[];
}

export default function LatestNewsSidebar({ news }: LatestNewsSidebarProps) {
  // Take only the 5 most recent articles
  const latestNews = news.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-white">
          Últimas Noticias
        </h3>
      </div>
      <div className="space-y-4">
        {latestNews.map((item) => (
          <Link
            key={item.id}
            to={`/noticias/${item.id}/${slugify(item.title)}`}
            className="block group"
          >
            <div className="flex gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-blue-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
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
  );
}