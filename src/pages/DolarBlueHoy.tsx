import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { FaChartLine, FaArrowDown } from 'react-icons/fa';
import { FcMoneyTransfer, FcLibrary, FcCandleSticks, FcBullish, FcConferenceCall, FcBearish } from 'react-icons/fc';
import { CreditCard } from 'grommet-icons';
import { SiTether } from 'react-icons/si';
import { Bitcoin, ArrowRight } from 'lucide-react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DolarRate {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  fechaActualizacion: string;
  variacion?: number;
}

interface CryptoRate {
  nombre: string;
  compraUSD: number;
  ventaUSD: number;
  symbol: string;
  icon: React.ReactNode;
}

interface News {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  published: boolean;
  subtitle?: string;
  type?: string;
}

export default function DolarBlueHoy() {
  const [rates, setRates] = useState<DolarRate[]>([]);
  const [cryptoRates, setCryptoRates] = useState<CryptoRate[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getIconForRate = (rateName: string) => {
    switch (rateName.toLowerCase()) {
      case 'oficial':
        return <FcLibrary className="text-3xl" />;
      case 'blue':
        return <FcMoneyTransfer className="text-3xl" />;
      case 'bolsa':
      case 'bolsa / mep':
        return <FcCandleSticks className="text-3xl" />;
      case 'contado con liqui':
      case 'contado con liquidación':
        return <FcBullish className="text-3xl" />;
      case 'mayorista':
        return <FcConferenceCall className="text-3xl" />;
      case 'tarjeta':
        return <CreditCard className="text-3xl" color="#568c30" />;
      case 'usdt':
        return <SiTether className="text-3xl text-green-500" />;
      default:
        return <FcBearish className="text-3xl" />;
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .is('type', null)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const latestNews = data.slice(0, 5);
        setNews(latestNews);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Error al cargar las noticias');
    }
  };

  const fetchCryptoRates = async () => {
    try {
      const dolarBlueResponse = await fetch('https://dolarapi.com/v1/dolares/blue');
      if (!dolarBlueResponse.ok) {
        throw new Error(`Error fetching dolar blue rate: ${dolarBlueResponse.statusText}`);
      }
      const dolarBlueData = await dolarBlueResponse.ok ? await dolarBlueResponse.json() : null;

      if (!dolarBlueData) {
        throw new Error('Could not fetch dolar blue rate');
      }

      const fetchWithRetry = async (url: string, retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      };

      const [btcData, ethData] = await Promise.all([
        fetchWithRetry('https://criptoya.com/api/binance/btc/ars/0.1'),
        fetchWithRetry('https://criptoya.com/api/binance/eth/ars/0.1')
      ]);

      const dolarBlueRate = dolarBlueData.venta;

      const btcUSDCompra = btcData.bid / dolarBlueRate;
      const btcUSDVenta = btcData.ask / dolarBlueRate;
      const ethUSDCompra = ethData.bid / dolarBlueRate;
      const ethUSDVenta = ethData.ask / dolarBlueRate;

      setCryptoRates([
        {
          nombre: 'Bitcoin',
          compraUSD: btcUSDCompra,
          ventaUSD: btcUSDVenta,
          symbol: 'BTC',
          icon: <FaBitcoin className="text-3xl text-yellow-500" />
        },
        {
          nombre: 'Ethereum',
          compraUSD: ethUSDCompra,
          ventaUSD: ethUSDVenta,
          symbol: 'ETH',
          icon: <FaEthereum className="text-3xl text-blue-500" />
        }
      ]);
    } catch (err) {
      console.error('Error fetching crypto rates:', err);
      setCryptoRates([
        {
          nombre: 'Bitcoin',
          compraUSD: 0,
          ventaUSD: 0,
          symbol: 'BTC',
          icon: <FaBitcoin className="text-3xl text-yellow-500" />
        },
        {
          nombre: 'Ethereum',
          compraUSD: 0,
          ventaUSD: 0,
          symbol: 'ETH',
          icon: <FaEthereum className="text-3xl text-blue-500" />
        }
      ]);
    }
  };

  const fetchRates = async () => {
    setIsRefreshing(true);
    try {
      const dolarResponse = await fetch('https://dolarapi.com/v1/dolares');
      
      if (!dolarResponse.ok) {
        throw new Error('Error fetching dollar rates');
      }

      const contentType = dolarResponse.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format from dollar API');
      }

      const data = await dolarResponse.json();
      const updatedData = data.map((rate: DolarRate) => {
        if (rate.nombre.toLowerCase() === 'bolsa') {
          return { ...rate, nombre: 'Bolsa / MEP' };
        }
        if (rate.nombre.toLowerCase() === 'cripto') {
          return { ...rate, nombre: 'USDT' };
        }
        return rate;
      });
      
      setRates(updatedData);
      setLastUpdate(new Date().toLocaleString('es-AR'));
      setError(null);
      setCountdown(60);
      setIsButtonDisabled(true);

      await Promise.all([
        fetchCryptoRates(),
        fetchNews()
      ]);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          setIsButtonDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isButtonDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsButtonDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isButtonDisabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number, currency: string = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
    }).format(value);
  };

  const getVariationColor = (variacion?: number) => {
    if (!variacion) return darkMode ? 'bg-gray-800' : 'bg-gray-100';
    return variacion > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
        
        <div className="container mx-auto px-4 py-12">
          {/* Títulos principales */}
          <div id="main-titles-section" className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cotización dolar blue hoy y más...
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-100 dark:text-gray-300 font-medium">
              Cotización actualizada minuto a minuto del dolar blue, oficial, cripto, blue, tarjeta, y más...
            </h2>
          </div>

          {/* Botón de actualización */}
          <div id="update-button-section" className="flex flex-col items-center gap-2 mb-8">
            <button
              onClick={fetchRates}
              disabled={isButtonDisabled || isRefreshing}
              className={`flex items-center gap-2 px-6 py-3 bg-yellow-400 dark:bg-yellow-500 text-blue-900 dark:text-gray-900 rounded-full font-semibold hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                isRefreshing ? 'animate-pulse' : ''
              }`}
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Actualizando...' : 'Actualizar Cotizaciones'}
            </button>
            {isButtonDisabled && (
              <div className="text-yellow-400 dark:text-yellow-500 text-sm font-medium">
                Próxima actualización en: {formatTime(countdown)}
              </div>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div id="error-alert-section" className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded">
                <AlertCircle size={24} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div id="loading-section" className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
              <p className="text-blue-100 dark:text-gray-300">Cargando cotizaciones...</p>
            </div>
          ) : (
            <>
              {/* Tarjetas de cotizaciones */}
              <div id="exchange-rates-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {rates.map((rate) => (
                  <div
                    key={rate.casa}
                    className="bg-white dark:bg-gray-800 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {getIconForRate(rate.nombre)}
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">{rate.nombre}</h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-blue-800 dark:text-gray-200 font-medium">Compra</span>
                          <span className="text-xl font-bold text-blue-900 dark:text-white">{formatCurrency(rate.compra)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-blue-800 dark:text-gray-200 font-medium">Venta</span>
                          <span className="text-xl font-bold text-blue-900 dark:text-white">{formatCurrency(rate.venta)}</span>
                        </div>
                        {rate.variacion !== undefined && (
                          <div className={`flex justify-between items-center p-3 rounded-lg ${getVariationColor(rate.variacion)}`}>
                            <span className="text-blue-800 dark:text-gray-200 font-medium">Variación</span>
                            <div className={`flex items-center ${rate.variacion > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {rate.variacion > 0 ? (
                                <FaChartLine size={20} className="mr-1" />
                              ) : (
                                <FaArrowDown size={20} className="mr-1" />
                              )}
                              <span className="text-lg font-bold">{rate.variacion}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {cryptoRates.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="bg-white dark:bg-gray-800 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {crypto.icon}
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">{crypto.nombre}</h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-blue-800 dark:text-gray-200 font-medium">Compra</span>
                          <span className="text-xl font-bold text-blue-900 dark:text-white">{formatCurrency(crypto.compraUSD, 'USD')}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-blue-800 dark:text-gray-200 font-medium">Venta</span>
                          <span className="text-xl font-bold text-blue-900 dark:text-white">{formatCurrency(crypto.ventaUSD, 'USD')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Última actualización */}
              <div id="last-update-section" className="flex flex-col items-center gap-4 mt-12">
                <div className="flex items-center gap-2 text-blue-100 dark:text-gray-300">
                  <Clock size={16} />
                  <p className="text-sm">
                    Última actualización: <span className="font-semibold">{lastUpdate}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <Footer />
      </div>
  );
} 