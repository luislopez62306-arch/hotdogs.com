import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, X } from 'lucide-react';
import { formatCurrency } from '../utils/whatsapp';

export interface CartToastData {
  id: number;
  itemName: string;
  quantity: number;
  variantName?: string;
  subtotal: number;
}

interface CartAddToastProps {
  toast: CartToastData | null;
  onDismiss: () => void;
  onOpenCart: () => void;
}

const CONFETTI_PIECES = [
  { x: -46, y: -26, rotate: -65, color: '#C83E2B', size: 'w-2 h-1.5 rounded-xs' },
  { x: -34, y: -38, rotate: 45, color: '#F59E0B', size: 'w-1.5 h-1.5 rounded-full' },
  { x: -16, y: -42, rotate: -30, color: '#10B981', size: 'w-2 h-1 rounded-xs' },
  { x: 14, y: -44, rotate: 70, color: '#FBBF24', size: 'w-1.5 h-1.5 rounded-full' },
  { x: 36, y: -34, rotate: -50, color: '#C83E2B', size: 'w-2 h-1 rounded-xs' },
  { x: 48, y: -18, rotate: 55, color: '#34D399', size: 'w-1.5 h-1.5 rounded-full' },
  { x: -42, y: 22, rotate: 35, color: '#FBBF24', size: 'w-1.5 h-1 rounded-xs' },
  { x: -20, y: 32, rotate: -80, color: '#34D399', size: 'w-1.5 h-1.5 rounded-full' },
  { x: 24, y: 30, rotate: 40, color: '#F59E0B', size: 'w-2 h-1 rounded-xs' },
  { x: 44, y: 18, rotate: -35, color: '#F06449', size: 'w-1.5 h-1.5 rounded-full' },
];

export const CartAddToast: React.FC<CartAddToastProps> = ({
  toast,
  onDismiss,
  onOpenCart,
}) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const toastId = toast?.id;

  useEffect(() => {
    if (!toastId) return;
    const timer = window.setTimeout(() => {
      onDismissRef.current();
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [toastId]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-[calc(100%-1.5rem)] max-w-md"
    >
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 460, damping: 28 }}
            className="pointer-events-auto relative overflow-visible rounded-2xl bg-zinc-950 dark:bg-[#18181B] text-zinc-50 border border-zinc-800 shadow-[0_14px_34px_rgba(9,9,11,0.32)]"
          >
            <div className="relative px-3.5 py-2.5 flex items-center gap-3">
              {/* Check Icon with Confetti Burst */}
              <div className="relative shrink-0">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {CONFETTI_PIECES.map((piece, idx) => (
                    <motion.span
                      key={`${toast.id}-${idx}`}
                      initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                      animate={{
                        x: piece.x,
                        y: piece.y,
                        scale: [0, 1.25, 0.75],
                        rotate: piece.rotate,
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 0.72,
                        ease: [0.16, 1, 0.3, 1],
                        delay: idx * 0.015,
                      }}
                      style={{ backgroundColor: piece.color }}
                      className={`absolute ${piece.size}`}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0.5, rotate: -18 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                  className="relative z-10 w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </motion.div>
              </div>

              {/* Message Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Agregado al carrito
                  </span>
                  <span className="text-zinc-500" aria-hidden="true">·</span>
                  <span className="text-[11px] font-bold text-amber-400 tabular-nums">
                    +{formatCurrency(toast.subtotal)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white truncate leading-snug">
                  {toast.quantity}x {toast.itemName}
                  {toast.variantName ? (
                    <span className="font-semibold text-zinc-300"> ({toast.variantName})</span>
                  ) : null}
                </p>
              </div>

              {/* Quick Cart Button & Close */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    onOpenCart();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[11px] font-extrabold transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Ver pedido</span>
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  aria-label="Cerrar notificación"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subtle Auto-Dismiss Progress Bar */}
            <div className="px-3.5 pb-1">
              <div className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  key={`bar-${toast.id}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 2.8, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                  className="h-full w-full bg-emerald-400/80"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
