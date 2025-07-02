import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface Rate {
  compra: number;
  venta: number;
  nombre: string;
}

interface CurrencyConverterProps {
  rates: Rate[];
}

export default function CurrencyConverter({ rates }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('ARS');
  const [toCurrency, setToCurrency] = useState<string>('USD (Blue)');
  const [result, setResult] = useState<number | null>(null);

  const formatCurrency = (value: number, currency: string = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      setResult(null);
      return;
    }

    const numericAmount = Number(amount);

    // Find the rates
    const blueRate = rates.find(r => r.nombre === 'Blue');
    const usdtRate = rates.find(r => r.nombre === 'USDT');
    
    if (!blueRate || !usdtRate) {
      setResult(null);
      return;
    }

    let resultValue: number;

    // USDT to ARS conversion
    if (fromCurrency === 'USDT' && toCurrency === 'ARS') {
      resultValue = numericAmount * usdtRate.compra;
    }
    // ARS to USDT conversion
    else if (fromCurrency === 'ARS' && toCurrency === 'USD (Blue)') {
      resultValue = numericAmount / blueRate.venta;
    }
    // Blue USD to ARS
    else if (fromCurrency === 'USD (Blue)' && toCurrency === 'ARS') {
      resultValue = numericAmount * blueRate.compra;
    }
    // ARS to Blue USD
    else if (fromCurrency === 'ARS' && toCurrency === 'USD (Blue)') {
      resultValue = numericAmount / blueRate.venta;
    }
    else {
      setResult(null);
      return;
    }

    setResult(resultValue);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">
          Conversor de Monedas
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monto
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el monto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MONEDA DE ORIGEN
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ARS">Peso Argentino (ARS)</option>
              <option value="USD (Blue)">Dólar Blue (USD)</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MONEDA DE DESTINO
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ARS">Peso Argentino (ARS)</option>
              <option value="USD (Blue)">Dólar Blue (USD)</option>
            </select>
          </div>
        </div>

        {result !== null && amount && (
          <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {amount} {fromCurrency === 'ARS' ? 'ARS' : fromCurrency} =
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-white">
              {formatCurrency(result, toCurrency)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}