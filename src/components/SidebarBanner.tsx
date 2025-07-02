import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SidebarBanner() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <a 
        href="https://www.saldoya.net"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 hover:opacity-95 transition-opacity text-center"
      >
        <img 
          src="https://saldoya.net/app/templates/CryptoExchanger/assets/img/site_logo_2.png"
          alt="Saldoya.net Logo"
          className="h-15 mb-4 mx-auto"
        />
        <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">
          Obtén la mejor cotización del mercado
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Intercambiá tu saldo <strong>Payoneer</strong>, <strong>Wise</strong> y <strong>Paypal</strong> a la mejor cotización.
        </p>
        <img 
          src="https://saldoya.net/app/templates/CryptoExchanger/assets/img/trustpilot-placeholder03.png"
          alt="Trustpilot Rating"
          className="mb-4 w-full"
        />
        <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
          COTIZA AHORA
          <ExternalLink className="ml-2 w-4 h-4" />
        </div>
      </a>
    </div>
  );
}