import React from 'react';
import { Link } from 'react-router-dom';
import { GiMoneyStack } from 'react-icons/gi';
import { BsCurrencyDollar } from 'react-icons/bs';

export default function Header() {
  return (
    <div className="text-center mb-12">
      <Link to="/" className="inline-block">
        <div className="flex justify-center items-center gap-6 mb-4">
          <GiMoneyStack size={64} className="text-green-400 transform -rotate-12" />
          <h1 className="text-5xl font-bold text-white">Don Dólar</h1>
          <GiMoneyStack size={64} className="text-green-400 transform rotate-12" />
        </div>
      </Link>
      <p className="text-blue-100 dark:text-gray-300 text-lg flex items-center justify-center gap-2">
        <BsCurrencyDollar className="text-green-400" />
        Información actualizada del mercado financiero, economico y cambiario argentino
      </p>
    </div>
  );
}