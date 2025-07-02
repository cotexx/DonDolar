import React from 'react';
import { Share2, Facebook, Instagram, Mail, Send } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    instagram: `instagram://share?url=${encodedUrl}`
  };

  return (
    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <Share2 className="w-5 h-5" />
        <span className="font-medium">Compartir</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title="Compartir en Facebook"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          title="Compartir en X"
        >
          <FaXTwitter className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
          title="Compartir en WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          title="Compartir en Telegram"
        >
          <Send className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white hover:opacity-90 transition-opacity"
          title="Compartir en Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href={shareLinks.email}
          className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          title="Compartir por Email"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}