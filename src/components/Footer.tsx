import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import { FaFacebook, FaInstagram, FaXTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa6';

export default function Footer() {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/dondolar',
      icon: <FaFacebook className="w-5 h-5" />,
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/dondolar',
      icon: <FaInstagram className="w-5 h-5" />,
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/dondolar',
      icon: <FaXTwitter className="w-5 h-5" />,
    },
    {
      name: 'Telegram',
      url: 'https://t.me/dondolar',
      icon: <FaTelegram className="w-5 h-5" />,
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/message/dondolar',
      icon: <FaWhatsapp className="w-5 h-5" />,
    },
  ];

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Dólar Blue Hoy', path: '/dolar-blue-hoy' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Crypto', path: '/crypto' },
    { name: 'Economía', path: '/economia' },
    { name: 'Actualidad', path: '/actualidad' },
    { name: 'Legal', path: '/legal' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-blue-900 dark:text-white">
                Don Dólar
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
              Información actualizada del mercado económico, financiero y cambiario argentino
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 text-center md:text-left">
              Navegación
            </h3>
            <ul className="space-y-2 text-center md:text-left">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 text-center md:text-left">
              Seguinos en
            </h3>
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Don Dólar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}