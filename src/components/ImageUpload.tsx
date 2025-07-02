import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageUploadProps {
  onImageUrl: (url: string) => void;
  initialUrl?: string;
}

export default function ImageUpload({ onImageUrl, initialUrl }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialUrl || '');

  useEffect(() => {
    if (initialUrl) {
      setImageUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageUrl(url);
  };

  const clearImage = () => {
    setImageUrl('');
    onImageUrl('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {imageUrl && (
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}