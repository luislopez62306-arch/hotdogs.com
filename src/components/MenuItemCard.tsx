import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Check, SlidersHorizontal, Heart, Star } from 'lucide-react';
import { motion, useAnimationControls } from 'framer-motion';
import { MenuItem, VariantOption, CartItem, DishRatingSummary } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { getPairingSuggestion } from '../utils/pairings';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenCustomizer: (item: MenuItem, defaultVariantId?: string) => void;
  onQuickAdd: (cartItem: Omit<CartItem, 'cartItemId'>) => void;
  itemQuantityInCart: number;
  isFavorite: boolean;
  onToggleFavorite: (menuItemId: string) => void;
  ratingSummary?: DishRatingSummary;
  onOpenRatingModal?: (item: MenuItem) => void;
  index?: number;
  transitionKey?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'hot-dogs': '🌭',
  'tortas': '🥖',
  'salchipapas': '🍟',
  'salchicarnes': '🥩',
  'antojitos': '🍗',
  'salchichas': '🥓',
  'bebidas': '🥤',
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onOpenCustomizer,
  onQuickAdd,
  itemQuantityInCart,
  isFavorite,
  onToggleFavorite,
  ratingSummary,
  onOpenRatingModal,
  index = 0,
  transitionKey = 'default',
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(() => {
    return item.variants?.defaultOptionId || item.variants?.options[0]?.id;
  });

  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [isPairingAdded, setIsPairingAdded] = useState(false);

  const pairing = useMemo(() => getPairingSuggestion(item), [item]);

  const controls = useAnimationControls();
  const isFirstRender = useRef(true);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    controls.stop();
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      controls.set({ opacity: 0, y: 14, scale: 0.99 });
    }

    controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.28,
        delay: Math.min(indexRef.current * 0.025, 0.2),
        ease: [0.22, 1, 0.36, 1],
      },
    });

    return () => {
      controls.stop();
    };
  }, [transitionKey, controls]);

  const currentVariant: VariantOption | undefined = item.variants
    ? item.variants.options.find((o) => o.id === selectedVariantId) || item.variants.options[0]
    : undefined;

  const displayPrice = currentVariant ? currentVariant.price : item.basePrice;

  const handleCardClick = () => {
    if (item.hasSauces || item.variants?.type === 'extra-choice') {
      onOpenCustomizer(item, selectedVariantId);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.hasSauces || item.variants?.type === 'extra-choice') {
      onOpenCustomizer(item, selectedVariantId);
      return;
    }

    onQuickAdd({
      menuItemId: item.id,
      name: item.name,
      categoryId: item.categoryId,
      selectedVariant: currentVariant,
      pricePerUnit: displayPrice,
      quantity: 1,
      image: '',
      includesFries: item.includesFries,
    });

    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 900);
  };

  const handleAddPairing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pairing) return;

    onQuickAdd({
      menuItemId: pairing.targetItem.id,
      name: pairing.targetItem.name,
      categoryId: pairing.targetItem.categoryId,
      selectedVariant: pairing.variant,
      pricePerUnit: pairing.price,
      quantity: 1,
      image: '',
      includesFries: pairing.targetItem.includesFries,
    });

    setIsPairingAdded(true);
    setTimeout(() => setIsPairingAdded(false), 900);
  };

  const metaParts: string[] = [];
  if (item.badge) metaParts.push(item.badge);
  if (item.includesFries) metaParts.push('Incluye papas a la francesa');

  return (
    <motion.article
      layout
      layoutId={`menu-card-${item.id}`}
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={controls}
      exit={{
        opacity: 0,
        y: 8,
        scale: 0.98,
        transition: { duration: 0.16, ease: 'easeOut' },
      }}
      transition={{
        layout: { type: 'spring', stiffness: 360, damping: 32 },
      }}
      onClick={handleCardClick}
      className={`group relative flex flex-col sm:flex-row sm:items-stretch justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 bg-white dark:bg-[#121215] hover:bg-zinc-50/90 dark:hover:bg-[#17171B] transition-colors duration-150 ${
        item.hasSauces || item.variants?.type === 'extra-choice' ? 'cursor-pointer' : ''
      }`}
    >
      {/* Left Content Column: Kicker, Title, Description, Variants & Inline Pairing */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          {/* Quiet Unboxed Kicker */}
          {metaParts.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-amber-700 dark:text-amber-400 truncate">
              {metaParts.map((part, i) => (
                <React.Fragment key={part}>
                  {i > 0 && <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Title + Mobile Inline Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base sm:text-[17px] text-zinc-950 dark:text-zinc-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="sm:hidden text-base font-black text-zinc-950 dark:text-amber-400 tabular-nums shrink-0">
              {formatCurrency(displayPrice)}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            {item.description}
          </p>

          {/* Interactive Unboxed Dish Rating Trigger */}
          {ratingSummary && (
            <div className="pt-0.5 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRatingModal?.(item);
                }}
                aria-label={`Puntuación de ${item.name}: ${ratingSummary.average.toFixed(1)} de 5 con ${ratingSummary.totalCount} calificaciones. Toca para calificar`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-extrabold text-zinc-950 dark:text-zinc-100 tabular-nums">
                  {ratingSummary.average.toFixed(1)}
                </span>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                <span className="tabular-nums">
                  {ratingSummary.totalCount} {ratingSummary.totalCount === 1 ? 'voto' : 'votos'}
                </span>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                {ratingSummary.userReview ? (
                  <span className="text-amber-700 dark:text-amber-400 font-bold tabular-nums">
                    Tu voto: {ratingSummary.userReview.stars}★
                  </span>
                ) : (
                  <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 hover:decoration-amber-500">
                    Calificar
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Inline Segmented Variant Selector */}
        {item.variants && item.variants.type !== 'extra-choice' && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              {item.variants.label}:
            </span>
            <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {item.variants.options.map((opt) => {
                const isSelected = selectedVariantId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantId(opt.id);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span className="ml-1.5 font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                      ${opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Inline Hairline Pairing Suggestion (No nested card box) */}
        {pairing && (
          <div className="pt-2.5 mt-1 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <span aria-hidden="true" className="text-sm shrink-0">
                {pairing.emoji}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 shrink-0 hidden sm:inline">
                {pairing.label}:
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {pairing.displayName}
              </span>
              <span className="font-extrabold text-amber-700 dark:text-amber-400 tabular-nums shrink-0">
                {formatCurrency(pairing.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddPairing}
              aria-label={`Agregar ${pairing.displayName} como acompañamiento`}
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 whitespace-nowrap ${
                isPairingAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-amber-400 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950'
              }`}
            >
              {isPairingAdded ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Listo</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Acompañar</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Right Action & Pricing Ledger Column */}
      <div className="sm:w-52 shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800/80 sm:pl-5">
        {/* Desktop Price + Favorite Heart */}
        <div className="flex items-center gap-2.5 sm:w-full sm:justify-end">
          <span className="hidden sm:inline text-lg sm:text-xl font-black text-zinc-950 dark:text-amber-400 tabular-nums leading-none">
            {formatCurrency(displayPrice)}
          </span>

          <motion.button
            type="button"
            whileTap={{ scale: 0.82 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            aria-label={isFavorite ? `Quitar ${item.name} de favoritos` : `Agregar ${item.name} a favoritos`}
            title={isFavorite ? 'Quitar de Mis Favoritos' : 'Guardar en Mis Favoritos'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-500'
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900'
            }`}
          >
            <motion.span
              key={isFavorite ? 'fav' : 'nofav'}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="flex items-center justify-center"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </motion.span>
          </motion.button>

          {itemQuantityInCart > 0 && (
            <span className="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              <Check className="w-3.5 h-3.5 stroke-[2.75]" />
              <span>{itemQuantityInCart}</span>
            </span>
          )}
        </div>

        {/* Status + Customize + Add CTA */}
        <div className="flex flex-col sm:items-end gap-2 ml-auto sm:ml-0">
          {itemQuantityInCart > 0 ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{itemQuantityInCart} en tu pedido</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span aria-hidden="true">{CATEGORY_ICONS[item.categoryId] || '🌭'}</span>
              <span>{item.hasSauces ? 'Salsa a elegir' : 'Al momento'}</span>
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomizer(item, selectedVariantId);
              }}
              title="Personalizar y ver complementos"
              aria-label={`Personalizar ${item.name}`}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="sr-only sm:not-sr-only">Editar</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 whitespace-nowrap ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950'
              }`}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>¡Listo!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
