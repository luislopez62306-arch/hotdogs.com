import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (stars: number, comment?: string) => void;
}

const RATING_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Mala experiencia',
    subtitle: 'Lamentamos que no haya sido lo esperado. Cuéntanos qué pasó.',
  },
  2: {
    title: 'Puede mejorar',
    subtitle: 'Tu comentario nos ayuda a afinar detalles en cocina y atención.',
  },
  3: {
    title: 'Estuvo bien',
    subtitle: '¡Gracias! Seguimos trabajando para sorprenderte más.',
  },
  4: {
    title: '¡Muy bueno!',
    subtitle: 'Qué gusto saber que disfrutaste tu pedido.',
  },
  5: {
    title: '¡Excelente, estilo Sinaloa!',
    subtitle: '¡Gracias por elegir Hot Dog’s El Carballito!',
  },
};

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoveredStars, setHoveredStars] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStars(0);
      setHoveredStars(0);
      setComment('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeStars = hoveredStars || selectedStars;
  const activeCopy = activeStars > 0 ? RATING_LABELS[activeStars] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStars < 1) return;
    onSubmitRating(selectedStars, comment.trim() || undefined);
    setIsSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white dark:bg-[#121215] text-zinc-950 dark:text-zinc-50 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h2 id="rating-modal-title" className="font-black text-base sm:text-lg leading-tight font-serif">
                Califica tu experiencia
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hot Dog&apos;s El Carballito · Estilo Sinaloa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar calificación"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black font-serif text-zinc-950 dark:text-zinc-50">
                  ¡Gracias por tu calificación!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                  Valoramos muchísimo tu opinión para seguir preparando los mejores hot dogs y antojitos de Las Canteras.
                </p>
              </div>

              {/* Selected Stars Display */}
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= selectedStars
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-zinc-300 dark:text-zinc-700'
                    }`}
                  />
                ))}
                <span className="ml-1.5 text-xs font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
                  {selectedStars}/5
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-sm transition-colors shadow-xs"
                >
                  Volver al menú
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-5"
            >
              {/* Stars Selector */}
              <div className="text-center space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  ¿Qué tal estuvo tu experiencia al ordenar con nosotros?
                </p>

                <div
                  className="flex items-center justify-center gap-2 sm:gap-3 py-1"
                  onMouseLeave={() => setHoveredStars(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= activeStars;
                    return (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.14 }}
                        whileTap={{ scale: 0.92 }}
                        onMouseEnter={() => setHoveredStars(star)}
                        onClick={() => setSelectedStars(star)}
                        aria-label={`Calificar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                        aria-pressed={selectedStars === star}
                        className="p-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
                      >
                        <Star
                          className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-150 ${
                            isActive
                              ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_6px_rgba(245,158,11,0.35)]'
                              : 'text-zinc-300 dark:text-zinc-700 hover:text-amber-300'
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Dynamic Rating Label */}
                <div className="min-h-[40px] flex flex-col items-center justify-center">
                  {activeCopy ? (
                    <motion.div
                      key={activeStars}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-0.5"
                    >
                      <p className="text-sm font-black text-amber-600 dark:text-amber-400">
                        {activeCopy.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {activeCopy.subtitle}
                      </p>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-zinc-400">
                      Toca una estrella del 1 al 5 para evaluar
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Comment */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rating-comment"
                  className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
                >
                  <MessageSquareHeart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Comentario adicional (opcional)</span>
                </label>
                <textarea
                  id="rating-comment"
                  rows={3}
                  maxLength={280}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos sobre el sabor, la rapidez o la atención..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Ahora no
                </button>
                <button
                  type="submit"
                  disabled={selectedStars < 1}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-zinc-950 font-black text-sm shadow-sm transition-all disabled:cursor-not-allowed"
                >
                  Enviar calificación
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
