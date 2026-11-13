import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShoppingBag, PhoneCall, MapPin, Settings, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESTAURANT_WHATSAPP, RESTAURANT_LOGO } from '../data/menuData';
import { useRestaurantStatus } from '../utils/hours';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  mesaNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenInfo,
  onOpenSettings,
  mesaNumber,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const status = useRestaurantStatus();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 32) return true;
        if (prev && y < 12) return false;
        return prev;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Slim Sinaloa Heritage & Live Status Top Strip */}
      <div className="bg-zinc-950 dark:bg-black text-zinc-300 text-[11px] sm:text-xs font-medium px-4 py-1.5 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <p className="truncate mx-auto sm:mx-0 text-zinc-300">
            Auténtico estilo Sinaloa · Reforma y Pasadena (en la pura esquina), Las Canteras
          </p>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
            <button
              type="button"
              onClick={onOpenInfo}
              className={`flex items-center gap-1.5 font-semibold transition-colors hover:underline ${
                status.isOpen ? 'text-emerald-400' : 'text-rose-300'
              }`}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{status.label}</span>
            </button>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <button
              type="button"
              onClick={onOpenInfo}
              className="hover:text-white transition-colors flex items-center gap-1 text-zinc-300"
            >
              <MapPin className="w-3 h-3" />
              <span>Ver ubicación y horario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Editorial Header with smooth compact scroll transition */}
      <header
        className={`sticky top-0 z-30 w-full backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled
            ? 'h-[52px] sm:h-16 bg-white/95 dark:bg-[#09090B]/95 border-zinc-200 dark:border-zinc-800 shadow-[0_1px_12px_rgba(9,9,11,0.06)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.45)]'
            : 'h-[72px] sm:h-[78px] bg-[#F9FAFB]/90 dark:bg-[#09090B]/90 border-transparent shadow-none'
        }`}
      >
        <div className="max-w-6xl mx-auto h-full px-3.5 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`bg-white border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 transition-all duration-300 shadow-xs ${
                isScrolled
                  ? 'w-8 h-8 sm:w-10 sm:h-10 rounded-lg'
                  : 'w-11 h-11 sm:w-12 sm:h-12 rounded-xl'
              }`}
            >
              <img
                src={RESTAURANT_LOGO}
                alt="Logo Hot Dog's El Carballito"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1
                  className={`font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif leading-none truncate transition-all duration-300 ${
                    isScrolled ? 'text-[15px] sm:text-xl' : 'text-lg sm:text-2xl'
                  }`}
                >
                  Hot Dog&apos;s El Carballito
                </h1>
                {mesaNumber && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap shrink-0">
                    · Mesa {mesaNumber}
                  </span>
                )}
              </div>
              <p
                className={`text-zinc-500 dark:text-zinc-400 truncate overflow-hidden transition-all duration-300 ${
                  isScrolled
                    ? 'max-h-0 opacity-0 mt-0 sm:max-h-5 sm:opacity-100 sm:text-xs sm:mt-0.5'
                    : 'max-h-5 opacity-100 text-xs sm:text-[13px] mt-1'
                }`}
              >
                Reforma y Pasadena (esquina), Las Canteras · Hot Dogs, Tortas y Antojitos
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile compact info trigger */}
            <button
              type="button"
              onClick={onOpenInfo}
              aria-label="Ver horario y ubicación"
              title={status.label}
              className={`sm:hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-500 transition-all duration-300 ${
                isScrolled ? 'p-2' : 'p-2.5'
              }`}
            >
              <Clock className={`w-4 h-4 ${status.isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`} />
            </button>

            {/* Quick WhatsApp Contact */}
            <a
              href={`https://wa.me/${RESTAURANT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Contacto directo WhatsApp"
              className={`hidden sm:flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:border-emerald-600/50 hover:text-emerald-700 dark:hover:text-emerald-400 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 whitespace-nowrap shrink-0 ${
                isScrolled ? 'py-1.5' : 'py-2'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Abrir configuración"
              title="Configuración de fuentes y tema"
              className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ${
                isScrolled ? 'p-2' : 'p-2.5'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Alternar modo oscuro"
              className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ${
                isScrolled ? 'p-2' : 'p-2.5'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Cart Action with Notification Bubble */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Ver carrito (${cartCount} ${cartCount === 1 ? 'artículo' : 'artículos'})`}
              className={`relative flex items-center gap-2.5 rounded-xl bg-zinc-950 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 active:scale-95 text-white dark:text-zinc-950 font-bold text-sm shadow-xs transition-all duration-300 whitespace-nowrap shrink-0 ${
                isScrolled ? 'px-3 py-2' : 'px-3.5 py-2.5'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                      className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 dark:bg-zinc-950 text-zinc-950 dark:text-amber-400 text-[10px] font-black leading-none ring-2 ring-zinc-950 dark:ring-amber-500 shadow-sm tabular-nums"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="hidden sm:inline">Pedido</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-extrabold text-amber-300 dark:text-zinc-900 text-xs border-l border-white/20 dark:border-zinc-950/20 pl-2.5 tabular-nums">
                  ${cartTotal.toFixed(0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
