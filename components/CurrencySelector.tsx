'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { CURRENCIES, CurrencyCode, getCurrentCurrency, setCurrency } from '@/lib/utils';

export default function CurrencySelector() {
  const [current, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentCurrency(getCurrentCurrency());
    
    const handleCurrencyChange = () => {
      setCurrentCurrency(getCurrentCurrency());
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => window.removeEventListener('currencyChange', handleCurrencyChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (currency: CurrencyCode) => {
    setCurrency(currency);
    setCurrentCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span>{CURRENCIES[current].symbol}</span>
        <span className="hidden sm:inline">{current}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
          {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
            <button
              key={code}
              onClick={() => handleSelect(code as CurrencyCode)}
              className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${
                current === code ? 'bg-gray-50 text-red-600' : 'text-gray-700'
              }`}
            >
              <span>{name}</span>
              <span className="font-medium">{symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

