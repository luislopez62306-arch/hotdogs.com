import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Check, ArrowRight } from 'lucide-react';
import { CartItem, CategoryId } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface PromoSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  price?: number;
  originalPrice?: number;
  emoji: string;
  actionType: 'add-combo' | 'go-category';
  targetCategoryId?: CategoryId;
  comboItem?: Omit<CartItem, 'cartItemId'>;
  ctaLabel: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'combo-pareja',
    tag: 'Combo del Día',
    title: 'Combo Dúo Sinaloense',
    description: '2 Hot Dogs Especiales (con papas a la francesa) + 2 Aguas Frescas de 1/2 L a elegir.',
    price: 175,
    originalPrice: 190,
    emoji: '🌭',
    actionType: 'add-combo',
    ctaLabel: 'Agregar combo',
    comboItem: {
      menuItemId: 'promo-combo-duo',
      name: 'Combo Dúo Sinaloense',
      categoryId: 'hot-dogs',
      pricePerUnit: 175,
      quantity: 1,
      image: '',
      includesFries: true,
      customNotes: '2 Hot Dogs Especiales + 2 Aguas Frescas (indicar sabores en notas)',
    },
  },
  {
    id: 'combo-monchoso',
    tag: 'Tiempo Limitado',
    title: 'Combo Salchicarne + Bebida',
    description: 'Salchicarnes Especial Grande con carne asada gratinada + Agua de Cebada o Horchata.',
    price: 160,
    originalPrice: 175,
    emoji: '🥩',
    actionType: 'add-combo',
    ctaLabel: 'Agregar combo',
    comboItem: {
      menuItemId: 'promo-combo-salchicarne',
      name: 'Combo Salchicarne Especial Grande + Bebida',
      categoryId: 'salchicarnes',
      pricePerUnit: 160,
      quantity: 1,
      image: '',
      customNotes: 'Incluye Agua de Cebada o Horchata (especificar en notas)',
    },
  },
  {
    id: 'combo-boneless',
    tag: 'Favorito de la Casa',
    title: 'Combo Boneless Sazonados',
    description: '1 Orden de Boneless con Papas Sazonadas (BBQ, Búfalo o Mango Habanero) + Coca-Cola.',
    price: 155,
    originalPrice: 168,
    emoji: '🍗',
    actionType: 'add-combo',
    ctaLabel: 'Agregar combo',
    comboItem: {
      menuItemId: 'promo-combo-boneless',
      name: 'Combo Boneless con Papas Sazonadas + Coca-Cola',
      categoryId: 'antojitos',
      selectedSauce: 'Búfalo',
      pricePerUnit: 155,
      quantity: 1,
      image: '',
      customNotes: 'Salsa Búfalo por defecto (puedes cambiarla en notas)',
    },
  },
  {
    id: 'promo-aguas',
    tag: '100% Naturales',
    title: 'Aguas Frescas Estilo Sinaloa a $25',
    description: 'Prueba nuestra clásica Cebada, Naranjita, Plátano, Horchata, Jamaica o Limonada de Fresa.',
    emoji: '🥤',
    actionType: 'go-category',
    targetCategoryId: 'bebidas',
    ctaLabel: 'Ver bebidas',
  },
];

interface PromoBannerProps {
  onAddCombo: (item: Omit<CartItem, 'cartItemId'>) => void;
  onSelectCategory: (category: CategoryId) => void;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
  }),
};

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onAddCombo,
  onSelectCategory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [addedSlideId, setAddedSlideId] = useState<string | null>(null);

  const goToSlide = useCallback((nextIndex: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex((nextIndex + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  }, []);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1, 1);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1, -1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      handleNext();
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      handlePrev();
    }
  };

  const currentSlide = PROMO_SLIDES[currentIndex];

  const handleAction = () => {
    if (currentSlide.actionType === 'add-combo' && currentSlide.comboItem) {
      onAddCombo(currentSlide.comboItem);
      setAddedSlideId(currentSlide.id);
      setTimeout(() => setAddedSlideId(null), 1100);
    } else if (currentSlide.actionType === 'go-category' && currentSlide.targetCategoryId) {
      onSelectCategory(currentSlide.targetCategoryId);
    }
  };

  return (
    <section
      aria-label="Promociones y combos del día"
      className="w-full max-w-6xl mx-auto px-4 pt-3 pb-1.5 sm:pt-4 sm:pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl bg-zinc-950 dark:bg-[#121215] text-zinc-50 border border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 sm:px-6 sm:py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 cursor-grab active:cursor-grabbing"
            >
              {/* Left: Clean Emoji Emblem + Unboxed Metadata + Copy */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">
                  {currentSlide.emoji}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-amber-400">
                    <span>{currentSlide.tag}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-zinc-400 tabular-nums">
                      {currentIndex + 1} / {PROMO_SLIDES.length}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-serif text-white leading-snug truncate">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-zinc-300 line-clamp-2 sm:line-clamp-1">
                    {currentSlide.description}
                  </p>
                </div>
              </div>

              {/* Right: Tabular Price + Action + Arrows */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                {currentSlide.price !== undefined && (
                  <div className="flex items-baseline gap-2 tabular-nums">
                    {currentSlide.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through font-medium">
                        ${currentSlide.originalPrice}
                      </span>
                    )}
                    <span className="text-lg sm:text-xl font-black text-amber-400">
                      {formatCurrency(currentSlide.price)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                      addedSlideId === currentSlide.id
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                    }`}
                  >
                    {addedSlideId === currentSlide.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>¡Agregado!</span>
                      </>
                    ) : currentSlide.actionType === 'add-combo' ? (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{currentSlide.ctaLabel}</span>
                      </>
                    ) : (
                      <>
                        <span>{currentSlide.ctaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="hidden md:flex items-center gap-1 ml-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Promoción anterior"
                      className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Siguiente promoción"
                      className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Slide Progress Bars */}
        <div className="flex items-center justify-center gap-1.5 pb-2.5">
          {PROMO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx, idx > currentIndex ? 1 : -1)}
                aria-label={`Ir a promoción ${idx + 1}: ${slide.title}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-6 bg-amber-400'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
