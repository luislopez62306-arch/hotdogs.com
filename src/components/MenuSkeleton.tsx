import React from 'react';

const SKELETON_ROWS = [
  { hasVariants: true, widthClass: 'w-44 sm:w-56' },
  { hasVariants: false, widthClass: 'w-36 sm:w-48' },
  { hasVariants: true, widthClass: 'w-48 sm:w-64' },
  { hasVariants: false, widthClass: 'w-40 sm:w-52' },
];

export const MenuSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando menú"
      className="animate-pulse"
    >
      <span className="sr-only">Cargando platillos y categorías del menú...</span>

      {/* Promo Banner Skeleton */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-1">
        <div className="h-[92px] sm:h-[76px] rounded-2xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-300 dark:bg-zinc-800 shrink-0" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-3.5 w-48 sm:w-64 rounded-md bg-zinc-300 dark:bg-zinc-800" />
              <div className="h-2.5 w-36 sm:w-80 rounded-md bg-zinc-300/70 dark:bg-zinc-800/70" />
            </div>
          </div>
          <div className="h-8 w-24 sm:w-28 rounded-xl bg-amber-300/60 dark:bg-amber-500/25 shrink-0" />
        </div>
      </section>

      {/* Search & Mobile Category Bar Skeleton */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-[#F9FAFB]/95 dark:bg-[#09090B]/95 mt-2">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2.5">
          <div className="h-10 w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
          <div className="flex lg:hidden items-center gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800/80 shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout Skeleton */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-5 sm:pt-7">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 items-start">
          {/* Desktop Left Category Rail Skeleton */}
          <aside className="hidden lg:flex flex-col gap-3">
            <div className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-3 space-y-2">
              <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800 mx-2 my-1.5" />
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-9 rounded-xl px-2.5 flex items-center justify-between ${
                    idx === 0
                      ? 'bg-zinc-900/10 dark:bg-amber-500/15'
                      : 'bg-zinc-100/70 dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-zinc-300 dark:bg-zinc-700" />
                    <div className="h-3 w-24 rounded bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                  <div className="w-5 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-3.5 space-y-2">
              <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-2.5 w-40 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
              <div className="h-2.5 w-32 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </aside>

          {/* Menu Ledger Sheets Skeleton */}
          <div className="min-w-0 space-y-8 sm:space-y-10">
            {[0, 1].map((sheetIdx) => (
              <section
                key={sheetIdx}
                className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-[0_1px_3px_rgba(9,9,11,0.04)]"
              >
                {/* Sheet Masthead */}
                <div className="px-4 py-4 sm:px-6 bg-zinc-50/90 dark:bg-[#16161B] border-b border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3.5 w-6 rounded bg-amber-300/70 dark:bg-amber-500/30" />
                    <div className="w-6 h-6 rounded-md bg-zinc-300 dark:bg-zinc-700" />
                    <div className="h-5 w-36 sm:w-44 rounded-md bg-zinc-300 dark:bg-zinc-700" />
                    <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <div className="h-3 w-3/4 max-w-md rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {/* Fries Notice Strip on First Sheet */}
                {sheetIdx === 0 && (
                  <div className="px-4 py-2.5 sm:px-6 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/30">
                    <div className="h-3 w-64 rounded bg-amber-200/80 dark:bg-amber-800/40" />
                  </div>
                )}

                {/* Hairline-Divided Dish Rows */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {SKELETON_ROWS.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      {/* Dish Content */}
                      <div className="flex-1 min-w-0 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 rounded bg-zinc-300 dark:bg-zinc-700 ${row.widthClass}`} />
                          <div className="h-3.5 w-16 rounded bg-amber-200/70 dark:bg-amber-500/20" />
                        </div>

                        <div className="space-y-1.5">
                          <div className="h-3 w-full max-w-lg rounded bg-zinc-200 dark:bg-zinc-800" />
                          <div className="h-3 w-2/3 max-w-sm rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                        </div>

                        {(row.hasVariants || sheetIdx === 1) && (
                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="h-7 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-7 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
                          </div>
                        )}

                        {/* Dashed Pairing Strip Placeholder */}
                        <div className="pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                          <div className="h-3 w-52 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                          <div className="h-5 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                        </div>
                      </div>

                      {/* Price + Actions Column */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:w-[144px] shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-14 rounded bg-zinc-300 dark:bg-zinc-700" />
                          <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                        <div className="h-9 w-28 sm:w-full rounded-xl bg-zinc-900/15 dark:bg-amber-500/25" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
