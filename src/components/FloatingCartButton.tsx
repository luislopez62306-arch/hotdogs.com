import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/whatsapp';

interface FloatingCartButtonProps {
  totalCount: number;
  totalAmount: number;
  onOpenCart: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  totalCount,
  totalAmount,
  onOpenCart,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-30 px-4 pointer-events-none flex justify-center animate-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-lg bg-zinc-950/95 dark:bg-amber-500/95 text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-amber-400 active:scale-98 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl shadow-black/25 flex items-center justify-between transition-all border border-white/10 dark:border-amber-300/40"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-500 dark:bg-zinc-950 text-zinc-950 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <ShoppingBag className="w-4 h-4" />
            <motion.span
              key={totalCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-zinc-950 text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none ring-2 ring-zinc-950 dark:ring-amber-500 shadow-sm tabular-nums"
            >
              {totalCount > 99 ? '99+' : totalCount}
            </motion.span>
          </div>
          <div className="text-left">
            <div className="text-xs font-medium text-zinc-300 dark:text-zinc-900 tabular-nums">
              {totalCount} {totalCount === 1 ? 'platillo seleccionado' : 'platillos seleccionados'}
            </div>
            <div className="text-sm font-black text-white dark:text-zinc-950 tabular-nums">
              {formatCurrency(totalAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/12 dark:bg-zinc-950/15 hover:bg-white/20 dark:hover:bg-zinc-950/25 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap">
          <span>Ver pedido</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
