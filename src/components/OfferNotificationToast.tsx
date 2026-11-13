import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, Plus, X, Check } from 'lucide-react';
import { SpecialOffer } from '../utils/promoNotifications';
import { formatCurrency } from '../utils/whatsapp';

interface OfferNotificationToastProps {
  offer: SpecialOffer | null;
  permissionState: NotificationPermission | 'unsupported';
  hasCartItems: boolean;
  onDismiss: () => void;
  onClaimOffer: (offer: SpecialOffer) => void;
  onEnableNotifications: () => Promise<void>;
}

export const OfferNotificationToast: React.FC<OfferNotificationToastProps> = ({
  offer,
  permissionState,
  hasCartItems,
  onDismiss,
  onClaimOffer,
  onEnableNotifications,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [notifJustEnabled, setNotifJustEnabled] = useState(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!offer || isPaused) return;
    const timer = window.setTimeout(() => {
      onDismissRef.current();
    }, 11000);
    return () => window.clearTimeout(timer);
  }, [offer, isPaused]);

  const handleEnableClick = async () => {
    await onEnableNotifications();
    setNotifJustEnabled(true);
    window.setTimeout(() => setNotifJustEnabled(false), 2000);
  };

  return (
    <div
      className={`fixed left-4 right-4 sm:right-auto sm:w-[390px] z-40 pointer-events-none transition-all ${
        hasCartItems ? 'bottom-24 sm:bottom-5' : 'bottom-4 sm:bottom-5'
      }`}
    >
      <AnimatePresence>
        {offer && (
          <motion.div
            key={offer.id}
            role="region"
            aria-label="Aviso de nueva oferta especial"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            className="pointer-events-auto rounded-2xl bg-zinc-950 dark:bg-[#141418] text-zinc-50 border border-zinc-800 shadow-2xl shadow-zinc-950/35 overflow-hidden"
          >
            <div className="p-3.5 sm:p-4 space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <BellRing className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 truncate">
                    {offer.tag}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onDismiss}
                  aria-label="Cerrar aviso de oferta"
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Offer Body */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">
                  {offer.emoji}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="text-sm font-black text-white leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                    {offer.body}
                  </p>
                  <div className="flex items-baseline gap-2 pt-0.5 tabular-nums">
                    <span className="text-sm font-black text-amber-400">
                      {formatCurrency(offer.promoPrice)}
                    </span>
                    <span className="text-[11px] text-zinc-500 line-through">
                      {formatCurrency(offer.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onClaimOffer(offer)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 text-xs font-black transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.75]" />
                  <span>Agregar oferta</span>
                </button>

                {permissionState === 'default' && (
                  <button
                    type="button"
                    onClick={handleEnableClick}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    {notifJustEnabled ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span>Listo</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Activar avisos</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
