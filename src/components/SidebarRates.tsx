import React from 'react';

interface Rate {
  compra: number;
  venta: number;
  nombre: string;
}

interface SidebarRatesProps {
  rates: Rate[];
}

export default function SidebarRates({ rates }: SidebarRatesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4">
        Cotizaciones
      </h3>
      <div className="space-y-2">
        {rates.map((rate) => (
          <div
            key={rate.nombre}
            className="text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 py-2"
          >
            <div className="text-gray-700 dark:text-gray-200 font-medium mb-1">
              {rate.nombre}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Compra: {formatCurrency(rate.compra)}</span>
              <span>Venta: {formatCurrency(rate.venta)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}