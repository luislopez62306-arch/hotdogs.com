import React from 'react';
import { motion } from 'framer-motion';
import { Heart, LayoutGrid, MapPin, Star } from 'lucide-react';
import { CategoryFilter } from '../types';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';

interface DesktopCategorySidebarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  favoritesCount: number;
  onOpenInfo: () => void;
}

export const DesktopCategorySidebar: React.FC<DesktopCategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  favoritesCount,
  onOpenInfo,
}) => {
  return (
    <aside
      aria-label="Índice de la carta"
      className="hidden lg:flex flex-col gap-4 sticky top-36 shrink-0"
    >
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-3 space-y-2">
        <div className="px-2.5 pt-1 pb-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Secciones
          </span>
          <span className="text-[11px] font-medium text-zinc-400 tabular-nums">
            {MENU_ITEMS.length} platillos
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {/* Todos */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`relative w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              selectedCategory === 'all'
                ? 'text-white dark:text-zinc-950 font-bold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
            }`}
          >
            {selectedCategory === 'all' && (
              <motion.span
                layoutId="activeDesktopSidebarPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-zinc-950 dark:bg-amber-500"
              />
            )}
            <span className="relative z-10 flex items-center gap-2.5 min-w-0">
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span className="truncate">Todo el menú</span>
            </span>
            <span className="relative z-10 text-[11px] opacity-75 tabular-nums shrink-0">
              {CATEGORIES.length}
            </span>
          </button>

          {/* Mis Favoritos */}
          <button
            type="button"
            onClick={() => onSelectCategory('favorites')}
            className={`relative w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              selectedCategory === 'favorites'
                ? 'text-white font-bold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            {selectedCategory === 'favorites' && (
              <motion.span
                layoutId="activeDesktopSidebarPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-rose-600"
              />
            )}
            <span className="relative z-10 flex items-center gap-2.5 min-w-0">
              <Heart
                className={`w-4 h-4 shrink-0 ${
                  selectedCategory === 'favorites'
                    ? 'fill-white text-white'
                    : favoritesCount > 0
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-rose-500'
                }`}
              />
              <span className="truncate">Mis Favoritos</span>
            </span>
            <span className="relative z-10 text-[11px] opacity-80 tabular-nums shrink-0">
              {favoritesCount}
            </span>
          </button>

          {/* Mejor calificados */}
          <button
            type="button"
            onClick={() => onSelectCategory('top-rated')}
            className={`relative w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
              selectedCategory === 'top-rated'
                ? 'text-zinc-950 font-bold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            {selectedCategory === 'top-rated' && (
              <motion.span
                layoutId="activeDesktopSidebarPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-amber-400"
              />
            )}
            <span className="relative z-10 flex items-center gap-2.5 min-w-0">
              <Star
                className={`w-4 h-4 shrink-0 ${
                  selectedCategory === 'top-rated'
                    ? 'fill-zinc-950 text-zinc-950'
                    : 'fill-amber-400 text-amber-500'
                }`}
              />
              <span className="truncate">Mejor calificados</span>
            </span>
          </button>

          <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

          {/* Menu Categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = MENU_ITEMS.filter((it) => it.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`relative w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isSelected
                    ? 'text-zinc-950 font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeDesktopSidebarPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-amber-400"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5 min-w-0">
                  <span className="text-sm leading-none shrink-0">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="relative z-10 text-[11px] opacity-75 tabular-nums shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subtle Corner Location Reference */}
      <button
        type="button"
        onClick={onOpenInfo}
        className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/60 text-left transition-colors space-y-1 group"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Reforma y Pasadena</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
          En la pura esquina, Las Canteras · Mié–Lun 7:00 PM – 12:00 AM
        </p>
      </button>
    </aside>
  );
};
