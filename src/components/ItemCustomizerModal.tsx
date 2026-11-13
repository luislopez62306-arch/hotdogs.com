import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Check, Flame, Sparkles, Star } from 'lucide-react';
import { MenuItem, VariantOption, SauceOption, CartItem, DishRatingSummary } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { getCustomizerAddons, CustomizerAddon } from '../utils/pairings';
import { formatRatingCountLabel } from '../utils/dishRatings';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: Omit<CartItem, 'cartItemId'>) => void;
  initialVariantId?: string;
  ratingSummary?: DishRatingSummary | null;
  onOpenDishRating?: (item: MenuItem) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  initialVariantId,
  ratingSummary,
  onOpenDishRating,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | undefined>(undefined);
  const [selectedSauce, setSelectedSauce] = useState<SauceOption | undefined>(undefined);
  const [customNotes, setCustomNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddonKeys, setSelectedAddonKeys] = useState<string[]>([]);

  // Reset state when modal opens with a new item or initialVariantId
  useEffect(() => {
    if (item && isOpen) {
      if (item.variants && item.variants.options.length > 0) {
        if (initialVariantId) {
          const found = item.variants.options.find((o) => o.id === initialVariantId);
          setSelectedVariant(found || item.variants.options[0]);
        } else {
          const def = item.variants.options.find((o) => o.id === item.variants?.defaultOptionId);
          setSelectedVariant(def || item.variants.options[0]);
        }
      } else {
        setSelectedVariant(undefined);
      }

      if (item.hasSauces && item.sauces && item.sauces.length > 0) {
        setSelectedSauce(item.sauces[0]);
      } else {
        setSelectedSauce(undefined);
      }

      setCustomNotes('');
      setQuantity(1);
      setSelectedAddonKeys([]);
    }
  }, [item, initialVariantId, isOpen]);

  const { primaryRecommendation, addons: secondaryAddons } = useMemo(
    () => getCustomizerAddons(item),
    [item]
  );

  const allSuggestedAddons: CustomizerAddon[] = useMemo(() => {
    const list: CustomizerAddon[] = [];
    if (primaryRecommendation) list.push(primaryRecommendation);
    list.push(...secondaryAddons);
    return list;
  }, [primaryRecommendation, secondaryAddons]);

  if (!isOpen || !item) return null;

  const currentUnitPrice = selectedVariant ? selectedVariant.price : item.basePrice;
  const selectedAddons = allSuggestedAddons.filter((a) => selectedAddonKeys.includes(a.key));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const grandTotal = currentUnitPrice * quantity + addonsTotal;

  const toggleAddon = (key: string) => {
    setSelectedAddonKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleAdd = () => {
    onAddToCart({
      menuItemId: item.id,
      name: item.name,
      categoryId: item.categoryId,
      selectedVariant,
      selectedSauce,
      customNotes: customNotes.trim() || undefined,
      pricePerUnit: currentUnitPrice,
      quantity,
      image: item.image,
      includesFries: item.includesFries,
    });

    selectedAddons.forEach((addon) => {
      onAddToCart({
        menuItemId: addon.menuItem.id,
        name: addon.menuItem.name,
        categoryId: addon.menuItem.categoryId,
        selectedVariant: addon.variant,
        pricePerUnit: addon.price,
        quantity: 1,
        image: addon.menuItem.image,
        includesFries: addon.menuItem.includesFries,
      });
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
    >
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header without photo */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] relative shrink-0">
          <div className="pr-10">
            {(item.includesFries || item.badge) && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold tracking-wide text-amber-700 dark:text-amber-400">
                {item.badge && <span>{item.badge}</span>}
                {item.badge && item.includesFries && <span aria-hidden="true">·</span>}
                {item.includesFries && <span>Incluye papas a la francesa</span>}
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 leading-tight text-balance">
              {item.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {item.description}
            </p>
            {ratingSummary && (
              <button
                type="button"
                onClick={() => onOpenDishRating?.(item)}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-extrabold text-zinc-950 dark:text-zinc-100 tabular-nums">
                  {ratingSummary.average.toFixed(1)}
                </span>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                <span className="tabular-nums">{formatRatingCountLabel(ratingSummary.totalCount)}</span>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 underline underline-offset-2">
                  {ratingSummary.userReview
                    ? `Tu voto: ${ratingSummary.userReview.stars}★ (Editar)`
                    : 'Calificar platillo'}
                </span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Variants Selector (Size / Preparation / Extra) */}
          {item.variants && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>{item.variants.label}</span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Requerido</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.variants.options.map((option) => {
                  const isSelected = selectedVariant?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedVariant(option)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-zinc-950 dark:border-amber-400 bg-zinc-950 dark:bg-amber-500/15 ring-2 ring-amber-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold ${
                            isSelected
                              ? 'text-white dark:text-amber-300'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}
                        >
                          {option.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-black mt-1 tabular-nums ${
                          isSelected
                            ? 'text-amber-400 dark:text-amber-300'
                            : 'text-zinc-950 dark:text-zinc-100'
                        }`}
                      >
                        {formatCurrency(option.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sauces Selector (for Boneless and Alitas) */}
          {item.hasSauces && item.sauces && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Salsa a elegir
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Elige 1</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {item.sauces.map((sauce) => {
                  const isSelected = selectedSauce === sauce;
                  return (
                    <button
                      key={sauce}
                      type="button"
                      onClick={() => setSelectedSauce(sauce)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-zinc-950 dark:border-amber-500 bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-medium hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs block">{sauce}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Notes / Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Instrucciones especiales para este platillo
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ej. Sin cebolla, cátsup aparte, bien dorado..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          {/* Dynamic Dish-Specific Recommendation & Popular Add-ons */}
          {allSuggestedAddons.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acompaña tu orden</span>
                </label>
                {selectedAddons.length > 0 ? (
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-md tabular-nums">
                    {selectedAddons.length} {selectedAddons.length === 1 ? 'agregado' : 'agregados'}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Opcional</span>
                )}
              </div>

              {/* Primary Dish-Specific Highlighted Recommendation */}
              {primaryRecommendation && (() => {
                const isSelected = selectedAddonKeys.includes(primaryRecommendation.key);
                return (
                  <button
                    type="button"
                    onClick={() => toggleAddon(primaryRecommendation.key)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/90 dark:bg-amber-500/15 ring-1 ring-amber-500/40'
                        : 'border-amber-300/80 dark:border-amber-500/35 bg-amber-50/50 dark:bg-amber-500/5 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-lg shrink-0">
                        {primaryRecommendation.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                          <span className="text-amber-700 dark:text-amber-400">
                            Recomendado para este platillo:{' '}
                          </span>
                          <span>{primaryRecommendation.displayName}</span>
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                          {primaryRecommendation.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-zinc-950 dark:text-amber-400 tabular-nums">
                        +${primaryRecommendation.price}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950'
                            : 'bg-amber-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-amber-300'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </span>
                    </div>
                  </button>
                );
              })()}

              {/* Secondary Matching Drinks & Add-ons */}
              {secondaryAddons.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {secondaryAddons.map((addon) => {
                    const isSelected = selectedAddonKeys.includes(addon.key);
                    return (
                      <button
                        key={addon.key}
                        type="button"
                        onClick={() => toggleAddon(addon.key)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-500/10 ring-1 ring-amber-500/30'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-base shrink-0">
                            {addon.emoji}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                              {addon.displayName}
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                              {addon.subtitle}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-black text-zinc-950 dark:text-amber-400 tabular-nums">
                            +${addon.price}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with quantity and add to cart button */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-zinc-950 dark:text-zinc-100 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-amber-500 dark:hover:bg-amber-400 active:scale-98 text-white dark:text-zinc-950 font-bold text-sm shadow-sm transition-all"
          >
            <span>
              {selectedAddons.length > 0
                ? `Agregar (${quantity + selectedAddons.length} artículos)`
                : 'Agregar al pedido'}
            </span>
            <span className="tabular-nums font-black">{formatCurrency(grandTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
