import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, DishRatingSummary } from '../types';
import { formatRatingCountLabel } from '../utils/dishRatings';

interface DishRatingModalProps {
  item: MenuItem | null;
  summary: DishRatingSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitDishRating: (
    menuItemId: string,
    stars: number,
    comment?: string,
    authorName?: string
  ) => void;
  onRemoveDishRating: (menuItemId: string) => void;
}

const DISH_RATING_COPY: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'No fue de mi agrado',
    subtitle: 'Gracias por tu honestidad, nos ayuda a mejorar la receta.',
  },
  2: {
    title: 'Regular',
    subtitle: 'Tomaremos en cuenta tu opinión para afinar el sazón.',
  },
  3: {
    title: 'Bueno',
    subtitle: '¡Gracias! Siempre buscamos darle ese toque especial.',
  },
  4: {
    title: '¡Muy rico!',
    subtitle: 'Qué gusto que hayas disfrutado este platillo.',
  },
  5: {
    title: '¡Buenísimo, estilo Sinaloa!',
    subtitle: 'De los favoritos de la casa en Las Canteras.',
  },
};

export const DishRatingModal: React.FC<DishRatingModalProps> = ({
  item,
  summary,
  isOpen,
  onClose,
  onSubmitDishRating,
  onRemoveDishRating,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoveredStars, setHoveredStars] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && item) {
      const existing = summary?.userReview;
      setSelectedStars(existing?.stars || 0);
      setHoveredStars(0);
      setComment(existing?.comment || '');
      setAuthorName(existing?.authorName || '');
      setIsSubmitted(false);
    }
  }, [isOpen, item?.id]);

  if (!isOpen || !item || !summary) return null;

  const activeStars = hoveredStars || selectedStars;
  const activeCopy = activeStars > 0 ? DISH_RATING_COPY[activeStars] : null;
  const hasExistingVote = Boolean(summary.userReview);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStars < 1) return;
    onSubmitDishRating(
      item.id,
      selectedStars,
      comment.trim() || undefined,
      authorName.trim() || undefined
    );
    setIsSubmitted(true);
  };

  const handleRemoveVote = () => {
    onRemoveDishRating(item.id);
    setSelectedStars(0);
    setComment('');
    setAuthorName('');
    setIsSubmitted(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-rating-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white dark:bg-[#121215] text-zinc-950 dark:text-zinc-50 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wide text-amber-700 dark:text-amber-400">
              Puntuación del platillo
            </p>
            <h2
              id="dish-rating-modal-title"
              className="font-black text-lg sm:text-xl leading-tight font-serif text-balance mt-0.5"
            >
              {item.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar puntuación"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Dish Rating Summary Strip */}
          <div className="flex items-center gap-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="shrink-0 text-center">
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 tabular-nums leading-none">
                {summary.average.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(summary.average)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-zinc-300 dark:text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 tabular-nums">
                {formatRatingCountLabel(summary.totalCount)}
              </p>
            </div>

            {/* Compact Star Distribution Bars */}
            <div className="flex-1 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((bucket) => {
                const count = summary.distribution[bucket] || 0;
                const pct = summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0;
                return (
                  <div key={bucket} className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 font-bold text-zinc-600 dark:text-zinc-400 tabular-nums text-right">
                      {bucket}★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="py-3 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black font-serif text-zinc-950 dark:text-zinc-50">
                    ¡Puntuación guardada!
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                    Tu calificación para <strong>{item.name}</strong> ya se refleja en el menú.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
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

                {comment.trim() && (
                  <p className="text-xs italic text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-left">
                    &ldquo;{comment.trim()}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Editar voto
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm transition-colors"
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
                className="space-y-4"
              >
                <div className="text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      {hasExistingVote ? 'Tu calificación actual' : '¿Qué calificación le das a este platillo?'}
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-center gap-2 py-1"
                    onMouseLeave={() => setHoveredStars(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= activeStars;
                      return (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.92 }}
                          onMouseEnter={() => setHoveredStars(star)}
                          onClick={() => setSelectedStars(star)}
                          aria-label={`Dar ${star} ${star === 1 ? 'estrella' : 'estrellas'} a ${item.name}`}
                          aria-pressed={selectedStars === star}
                          className="p-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 sm:w-9 sm:h-9 transition-all duration-150 ${
                              isActive
                                ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_6px_rgba(245,158,11,0.3)]'
                                : 'text-zinc-300 dark:text-zinc-700 hover:text-amber-300'
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="min-h-[36px] flex flex-col items-center justify-center">
                    {activeCopy ? (
                      <motion.div
                        key={activeStars}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-0.5"
                      >
                        <p className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                          {activeCopy.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {activeCopy.subtitle}
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-xs text-zinc-400">
                        Elige de 1 a 5 estrellas
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional note */}
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="dish-rating-comment"
                      className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Nota sobre el platillo (opcional)</span>
                    </label>
                    <textarea
                      id="dish-rating-comment"
                      rows={2}
                      maxLength={220}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ej. Excelente porción, tocino bien dorado, salsa en su punto..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none transition-all"
                    />
                  </div>

                  <input
                    type="text"
                    maxLength={50}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    aria-label="Tu nombre (opcional)"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {hasExistingVote && (
                    <button
                      type="button"
                      onClick={handleRemoveVote}
                      title="Eliminar mi calificación"
                      aria-label="Eliminar mi calificación"
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={selectedStars < 1}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-zinc-950 font-black text-xs sm:text-sm shadow-sm transition-all disabled:cursor-not-allowed"
                  >
                    {hasExistingVote ? 'Actualizar puntuación' : 'Guardar puntuación'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
