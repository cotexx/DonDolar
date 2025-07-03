import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, DollarSign } from 'lucide-react';

interface Rate {
  compra: number;
  venta: number;
  nombre: string;
}

interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function Navbar({ darkMode, onDarkModeToggle }: NavbarProps) {
  const [rates, setRates] = useState<Rate[]>([]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 300000); // Actualizar cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) throw new Error('Error fetching rates');
      const data = await response.json();
      setRates(data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Theme Toggle */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-blue-900 dark:text-white">
                Don Dólar
              </span>
            </Link>
            <button
              onClick={onDarkModeToggle}
              className="ml-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/dolar-blue-hoy"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Dólar Blue Hoy
            </Link>
            <Link
              to="/noticias"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Últimas Noticias
            </Link>
            <Link
              to="/crypto"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Crypto
            </Link>
            <Link
              to="/economia"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Economía y Finanzas
            </Link>
            <Link
              to="/actualidad"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Actualidad
            </Link>
          </div>
        </div>
      </div>

      {/* Ticker Bar */}
      <div className="bg-blue-600 dark:bg-blue-800 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap py-2">
          <div className="inline-block">
            {rates.map((rate, index) => (
              <span key={rate.nombre} className="inline-flex items-center mx-4">
                <strong className="mr-2 text-yellow-300 dark:text-yellow-200 font-mono">
                  {rate.nombre}:
                </strong>
                <span className="font-mono text-white">
                  {formatCurrency(rate.compra)} / {formatCurrency(rate.venta)}
                </span>
                {index < rates.length - 1 && (
                  <span className="mx-2 text-yellow-300 dark:text-yellow-200">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}