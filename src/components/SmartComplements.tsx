import React, { useMemo, useState } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { CartItem } from '../types';
import { getSmartCartComplements, SmartCartComplement } from '../utils/pairings';
import { formatCurrency } from '../utils/whatsapp';

interface SmartComplementsProps {
  cartItems: CartItem[];
  onAddComplement: (item: Omit<CartItem, 'cartItemId'>) => void;
}

export const SmartComplements: React.FC<SmartComplementsProps> = ({
  cartItems,
  onAddComplement,
}) => {
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const suggestions = useMemo(() => getSmartCartComplements(cartItems), [cartItems]);

  if (cartItems.length === 0 || suggestions.length === 0) {
    return null;
  }

  const handleAdd = (complement: SmartCartComplement) => {
    onAddComplement({
      menuItemId: complement.targetItem.id,
      name: complement.targetItem.name,
      categoryId: complement.targetItem.categoryId,
      selectedVariant: complement.variant,
      pricePerUnit: complement.price,
      quantity: 1,
      image: complement.targetItem.image,
      includesFries: complement.targetItem.includesFries,
    });

    setRecentlyAddedId(complement.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === complement.id ? null : prev));
    }, 1200);
  };

  return (
    <section
      aria-label="Complementos Inteligentes"
      className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
            Complementos Inteligentes
          </h3>
        </div>
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Según tu pedido
        </span>
      </div>

      <div className="space-y-2">
        {suggestions.map((complement) => {
          const isAdded = recentlyAddedId === complement.id;
          return (
            <div
              key={complement.id}
              className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-base shrink-0">
                  {complement.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {complement.kind}
                    </span>
                    <span aria-hidden="true" className="text-[10px] text-zinc-400">·</span>
                    <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 truncate">
                      {complement.displayName}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {complement.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-zinc-950 dark:text-amber-400 tabular-nums">
                  {formatCurrency(complement.price)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdd(complement)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Listo</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
