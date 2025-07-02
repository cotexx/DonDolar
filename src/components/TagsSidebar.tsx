import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tag } from 'lucide-react';

interface TagType {
  id: string;
  name: string;
}

interface TagsSidebarProps {
  tags: { tags: TagType }[];
}

export default function TagsSidebar({ tags }: TagsSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag');

  if (!tags || tags.length === 0) return null;

  const handleTagClick = (tagName: string) => {
    setSearchParams({ tag: tagName });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-white">
          Tags
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.tags.id}
            onClick={() => handleTagClick(tag.tags.name)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
              currentTag === tag.tags.name
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
            }`}
          >
            {tag.tags.name}
          </button>
        ))}
      </div>
    </div>
  );
}