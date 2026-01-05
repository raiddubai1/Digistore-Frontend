'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CURRENCIES, CurrencyCode, getCurrentCurrency, setCurrency, initializeCurrency } from '@/lib/utils';

export default function CurrencySelector() {
  const [current, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-detect currency on first visit
    const init = async () => {
      const currency = await initializeCurrency();
      setCurrentCurrency(currency);
      setIsInitialized(true);
      // Trigger update for other components
      window.dispatchEvent(new Event('currencyChange'));
    };
    init();

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

  // Show loading state briefly during initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-400">
        <span className="w-4 h-4 animate-pulse bg-gray-200 rounded"></span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <span className="text-base">{CURRENCIES[current].flag}</span>
        <span>{CURRENCIES[current].symbol}</span>
        <span className="hidden sm:inline font-semibold">{current}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Select Currency</p>
          </div>
          {Object.entries(CURRENCIES).map(([code, { symbol, name, flag }]) => (
            <button
              key={code}
              onClick={() => handleSelect(code as CurrencyCode)}
              className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                current === code ? 'bg-orange-50 dark:bg-orange-900/20' : ''
              }`}
            >
              <span className="text-lg">{flag}</span>
              <div className="flex-1">
                <span className={`font-medium ${current === code ? 'text-[#FF6B35]' : 'text-gray-900 dark:text-white'}`}>
                  {code}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1.5">{symbol}</span>
              </div>
              {current === code && (
                <Check className="w-4 h-4 text-[#FF6B35]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

