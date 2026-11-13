import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Header 
} from './components/Header';
import {
  PromoBanner
} from './components/PromoBanner';
import { 
  CategoryNav 
} from './components/CategoryNav';
import {
  DesktopCategorySidebar
} from './components/DesktopCategorySidebar';
import { 
  MenuItemCard 
} from './components/MenuItemCard';
import { 
  ItemCustomizerModal 
} from './components/ItemCustomizerModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  FloatingCartButton 
} from './components/FloatingCartButton';
import { 
  HoursAndLocationModal 
} from './components/HoursAndLocationModal';
import {
  SettingsModal
} from './components/SettingsModal';
import {
  RatingModal
} from './components/RatingModal';
import {
  DishRatingModal
} from './components/DishRatingModal';
import {
  CartAddToast,
  CartToastData
} from './components/CartAddToast';
import {
  MenuSkeleton
} from './components/MenuSkeleton';
import {
  OfferNotificationToast
} from './components/OfferNotificationToast';
import { 
  CATEGORIES, 
  MENU_ITEMS, 
  RESTAURANT_WHATSAPP,
  RESTAURANT_LOGO,
  RESTAURANT_ADDRESS
} from './data/menuData';
import { 
  CategoryFilter,
  CategoryInfo,
  MenuItem, 
  CartItem,
  FontPreset,
  PastOrder,
  ExperienceRating,
  DishReview,
  DishRatingSummary
} from './types';
import { formatCurrency } from './utils/whatsapp';
import { formatOrderTimestamp, formatModalityLabel, formatOrderSummary } from './utils/orderHistory';
import {
  loadUserDishRatings,
  saveUserDishRatings,
  getDishRatingSummary,
} from './utils/dishRatings';
import {
  SpecialOffer,
  SPECIAL_OFFERS,
  registerBasicServiceWorker,
  getNextSpecialOfferOnOpen,
  getNotificationPermissionState,
  requestNotificationPermission,
  dispatchServiceWorkerNotification,
} from './utils/promoNotifications';
import { 
  SearchX, 
  PhoneCall, 
  UtensilsCrossed, 
  Clock,
  Settings,
  Heart,
  History,
  RotateCcw,
  Star
} from 'lucide-react';

export default function App() {
  // 1. Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('el_carballito_theme');
      if (saved) return saved === 'dark';
    }
    return false; // Light mode by default as requested
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('el_carballito_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('el_carballito_theme', 'light');
    }
  }, [darkMode]);

  // 1b. Font Preset State (moderna vs. clasica)
  const [fontPreset, setFontPreset] = useState<FontPreset>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('el_carballito_font_preset');
      if (saved === 'clasica' || saved === 'moderna') return saved;
    }
    return 'moderna';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (fontPreset === 'clasica') {
      root.classList.add('font-theme-clasica');
    } else {
      root.classList.remove('font-theme-clasica');
    }
    localStorage.setItem('el_carballito_font_preset', fontPreset);
  }, [fontPreset]);

  // 2. Mesa Detection from URL (?mesa=X)
  const [mesaNumber, setMesaNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mesa') || '';
    }
    return '';
  });

  // 3. Cart State (with localStorage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('el_carballito_cart');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('el_carballito_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cartItems]);

  // 3b. Favorites State (with localStorage persistence)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('el_carballito_favorites');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((id): id is string => typeof id === 'string');
          }
        }
      } catch (e) {
        console.error('Error loading favorites', e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('el_carballito_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Error saving favorites', e);
    }
  }, [favoriteIds]);

  const handleToggleFavorite = (menuItemId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(menuItemId)
        ? prev.filter((id) => id !== menuItemId)
        : [...prev, menuItemId]
    );
  };

  // 3b-ii. Dish Ratings State (per-dish scores & reviews persisted locally)
  const [userDishRatings, setUserDishRatings] = useState<Record<string, DishReview>>(() =>
    loadUserDishRatings()
  );

  useEffect(() => {
    saveUserDishRatings(userDishRatings);
  }, [userDishRatings]);

  const handleSubmitDishRating = (
    menuItemId: string,
    stars: number,
    comment?: string,
    authorName?: string
  ) => {
    setUserDishRatings((prev) => ({
      ...prev,
      [menuItemId]: {
        id: prev[menuItemId]?.id || `dr_${Date.now()}`,
        menuItemId,
        stars,
        comment,
        authorName,
        createdAt: new Date().toISOString(),
      },
    }));
  };

  const handleRemoveDishRating = (menuItemId: string) => {
    setUserDishRatings((prev) => {
      const next = { ...prev };
      delete next[menuItemId];
      return next;
    });
  };

  // 3c. Order History State (last 3 orders persisted locally)
  const [orderHistory, setOrderHistory] = useState<PastOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('el_carballito_order_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.slice(0, 3);
          }
        }
      } catch (e) {
        console.error('Error loading order history', e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('el_carballito_order_history', JSON.stringify(orderHistory.slice(0, 3)));
    } catch (e) {
      console.error('Error saving order history', e);
    }
  }, [orderHistory]);

  const handleOrderPlaced = (order: Omit<PastOrder, 'id' | 'createdAt'>) => {
    const clonedItems = order.items.map((it) => ({
      ...it,
      selectedVariant: it.selectedVariant ? { ...it.selectedVariant } : undefined,
    }));

    const signature = clonedItems
      .map((it) => `${it.cartItemId}:${it.quantity}`)
      .join('|');

    setOrderHistory((prev) => {
      const latest = prev[0];
      if (latest) {
        const latestSig = latest.items
          .map((it) => `${it.cartItemId}:${it.quantity}`)
          .join('|');
        const elapsedMs = Date.now() - new Date(latest.createdAt).getTime();
        if (latestSig === signature && elapsedMs < 60000) {
          return prev;
        }
      }

      const newOrder: PastOrder = {
        id: `ord_${Date.now()}`,
        createdAt: new Date().toISOString(),
        items: clonedItems,
        totalAmount: order.totalAmount,
        modality: order.modality,
      };

      return [newOrder, ...prev].slice(0, 3);
    });
  };

  const handleReorder = (pastOrder: PastOrder, openDrawer = false) => {
    setCartItems((prevItems) => {
      const next = prevItems.map((it) => ({ ...it }));
      pastOrder.items.forEach((pastItem) => {
        const existingIndex = next.findIndex((it) => it.cartItemId === pastItem.cartItemId);
        if (existingIndex > -1) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + pastItem.quantity,
          };
        } else {
          next.push({
            ...pastItem,
            selectedVariant: pastItem.selectedVariant ? { ...pastItem.selectedVariant } : undefined,
          });
        }
      });
      return next;
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  // 4. Menu Data Hydration, Navigation & Search State
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCategories(CATEGORIES);
      setMenuItems(MENU_ITEMS);
      setIsMenuLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  // 5. Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('calificar') === '1';
    }
    return false;
  });
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customizingVariantId, setCustomizingVariantId] = useState<string | undefined>(undefined);
  const [ratingTargetItem, setRatingTargetItem] = useState<MenuItem | null>(null);
  const [cartToast, setCartToast] = useState<CartToastData | null>(null);

  // 5b. Basic Service Worker & Emerging Offer Notifications
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const [activeOfferToast, setActiveOfferToast] = useState<SpecialOffer | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionState()
  );

  useEffect(() => {
    let isMounted = true;

    registerBasicServiceWorker().then((registration) => {
      if (isMounted) {
        swRegistrationRef.current = registration;
      }
    });

    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PROMO_NOTIFICATION_CLICKED' && event.data?.offerId) {
        const matched = SPECIAL_OFFERS.find((o) => o.id === event.data.offerId);
        if (matched) {
          setSelectedCategory(matched.targetCategoryId);
          setActiveOfferToast(matched);
        }
      }
    };

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    return () => {
      isMounted = false;
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, []);

  useEffect(() => {
    if (isMenuLoading) return;

    const timer = window.setTimeout(() => {
      const nextOffer = getNextSpecialOfferOnOpen();
      if (nextOffer) {
        setActiveOfferToast(nextOffer);
        dispatchServiceWorkerNotification(nextOffer, swRegistrationRef.current);
      }
    }, 550);

    return () => window.clearTimeout(timer);
  }, [isMenuLoading]);

  const handleEnableOfferNotifications = async () => {
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === 'granted' && activeOfferToast) {
      await dispatchServiceWorkerNotification(activeOfferToast, swRegistrationRef.current);
    }
  };

  const handleClaimOffer = (offer: SpecialOffer) => {
    handleAddToCart(offer.comboItem);
    setActiveOfferToast(null);
  };

  // Clean ?calificar=1 query parameter after initial open so future refreshes stay clean
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('calificar')) {
        url.searchParams.delete('calificar');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }
    }
  }, []);

  const handleSubmitRating = (stars: number, comment?: string) => {
    try {
      const saved = localStorage.getItem('el_carballito_ratings');
      const existing: ExperienceRating[] = saved ? JSON.parse(saved) : [];
      const newEntry: ExperienceRating = {
        id: `rat_${Date.now()}`,
        stars,
        comment,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        'el_carballito_ratings',
        JSON.stringify([newEntry, ...(Array.isArray(existing) ? existing : [])].slice(0, 20))
      );
    } catch (e) {
      console.error('Error saving rating', e);
    }
  };

  // Cart calculations
  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);
  }, [cartItems]);

  // Dish rating summaries map (memoized per dish)
  const dishRatingSummaries = useMemo(() => {
    const map: Record<string, DishRatingSummary> = {};
    menuItems.forEach((item) => {
      map[item.id] = getDishRatingSummary(item.id, userDishRatings);
    });
    return map;
  }, [menuItems, userDishRatings]);

  // Top-rated dishes sorted by average rating descending, then vote count
  const topRatedItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      const sumA = dishRatingSummaries[a.id];
      const sumB = dishRatingSummaries[b.id];
      if (!sumA || !sumB) return 0;
      if (sumB.average !== sumA.average) {
        return sumB.average - sumA.average;
      }
      return sumB.totalCount - sumA.totalCount;
    });
  }, [menuItems, dishRatingSummaries]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category / Favorites filter
      if (selectedCategory === 'favorites') {
        if (!favoriteIds.includes(item.id)) return false;
      } else if (selectedCategory !== 'all' && selectedCategory !== 'top-rated' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchBadge = item.badge?.toLowerCase().includes(query);
        const matchVariant = item.variants?.options.some((v) => v.name.toLowerCase().includes(query));
        return matchName || matchDesc || matchBadge || matchVariant;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery, favoriteIds]);

  // Favorite items list for Mis Favoritos view
  const favoriteItems = useMemo(() => {
    return menuItems.filter((item) => favoriteIds.includes(item.id));
  }, [menuItems, favoriteIds]);

  // Visible category sections when not actively searching or viewing favorites/top-rated
  const visibleCategorySections = useMemo(() => {
    if (searchQuery.trim() || selectedCategory === 'favorites' || selectedCategory === 'top-rated') {
      return [];
    }
    return categories
      .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
      .map((cat) => ({
        ...cat,
        items: menuItems.filter((item) => item.categoryId === cat.id),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, menuItems, selectedCategory, searchQuery]);

  const cardTransitionKey = searchQuery.trim() ? 'search' : selectedCategory;

  const handleSelectCategory = (cat: CategoryFilter) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    if (typeof window !== 'undefined' && window.scrollY > 240) {
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  // Cart Handlers
  const handleAddToCart = (itemToAdd: Omit<CartItem, 'cartItemId'>) => {
    const variantKey = itemToAdd.selectedVariant ? itemToAdd.selectedVariant.id : 'base';
    const sauceKey = itemToAdd.selectedSauce || 'nosauce';
    const notesKey = (itemToAdd.customNotes || '').trim();
    const cartItemId = `${itemToAdd.menuItemId}_${variantKey}_${sauceKey}_${notesKey}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const copy = [...prevItems];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + itemToAdd.quantity,
        };
        return copy;
      }
      return [...prevItems, { ...itemToAdd, cartItemId }];
    });

    setCartToast({
      id: Date.now(),
      itemName: itemToAdd.name,
      quantity: itemToAdd.quantity,
      variantName: itemToAdd.selectedVariant?.name,
      subtotal: itemToAdd.pricePerUnit * itemToAdd.quantity,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Deseas vaciar todos los platillos de tu pedido?')) {
      setCartItems([]);
    }
  };

  const handleOpenCustomizer = (item: MenuItem, defaultVariantId?: string) => {
    setCustomizingItem(item);
    setCustomizingVariantId(defaultVariantId);
  };

  const getItemQuantityInCart = (menuItemId: string): number => {
    return cartItems
      .filter((it) => it.menuItemId === menuItemId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-100 font-sans antialiased transition-colors duration-200 flex flex-col pb-24 selection:bg-amber-400 selection:text-zinc-950">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={totalItemCount}
        cartTotal={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        mesaNumber={mesaNumber}
      />

      {/* Optional Table Banner if mesa param is detected */}
      {mesaNumber && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-amber-950 dark:text-amber-200 font-medium">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Estás ordenando para consumir en la <strong>Mesa #{mesaNumber}</strong></span>
            </div>
            <button
              onClick={() => {
                const newMesa = prompt('Ingresa el número de tu mesa:', mesaNumber);
                if (newMesa !== null) setMesaNumber(newMesa);
              }}
              className="text-[11px] underline font-bold hover:text-amber-700"
            >
              Cambiar mesa
            </button>
          </div>
        </div>
      )}

      {isMenuLoading ? (
        <MenuSkeleton />
      ) : (
        <>
          {/* Minimalist Promotional Carousel Banner */}
          <PromoBanner
            onAddCombo={handleAddToCart}
            onSelectCategory={handleSelectCategory}
          />

          <LayoutGroup>
            {/* Sticky Search + Mobile Category Nav */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalFilteredCount={filteredItems.length}
              favoritesCount={favoriteIds.length}
            />

            {/* Main Container: Sticky Left Category Rail (Desktop) + Menu Ledger Sheets */}
            <main className="max-w-6xl mx-auto w-full px-4 pt-5 sm:pt-7 flex-1">
              <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 items-start">
                <DesktopCategorySidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  favoritesCount={favoriteIds.length}
                  onOpenInfo={() => setIsInfoOpen(true)}
                />

                <div className="min-w-0 space-y-8">
              {/* Local History of Last 3 Orders (Quick Reorder) */}
              {!searchQuery.trim() && selectedCategory === 'all' && orderHistory.length > 0 && (
                <section aria-label="Historial de pedidos recientes" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h2 className="text-sm sm:text-base font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif">
                        Tus últimos pedidos
                      </h2>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                        · Re-añade con un toque
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {orderHistory.slice(0, 3).map((order) => {
                      const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);
                      return (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => handleReorder(order, true)}
                          className="group p-3.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-400 text-left transition-all flex flex-col justify-between gap-2.5 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                              <span className="truncate">
                                {formatOrderTimestamp(order.createdAt)} · {formatModalityLabel(order.modality)}
                              </span>
                              <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums shrink-0">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100 line-clamp-2 leading-snug">
                              {formatOrderSummary(order)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold">
                            <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">
                              {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 group-hover:underline font-bold">
                              <RotateCcw className="w-3 h-3" />
                              <span>Volver a pedir</span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Search mode */}
              {searchQuery.trim() ? (
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                >
                  {/* Header of results */}
                  <div className="px-4 py-4 sm:px-6 bg-zinc-50/90 dark:bg-[#16161B] border-b border-zinc-200 dark:border-zinc-800 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif text-balance">
                        Resultados para &ldquo;{searchQuery}&rdquo;
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 tabular-nums">
                        {filteredItems.length} {filteredItems.length === 1 ? 'platillo encontrado' : 'platillos disponibles'}
                      </p>
                    </div>

                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => handleSelectCategory('all')}
                        className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
                      >
                        Ver todo el menú
                      </button>
                    )}
                  </div>

                  {/* Empty state or divided rows */}
                  {filteredItems.length === 0 ? (
                    <div className="py-16 text-center space-y-3 px-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
                        <SearchX className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">
                        No encontramos resultados
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                        Intenta buscar con otra palabra (ej. &ldquo;salchicha&rdquo;, &ldquo;carne&rdquo;, &ldquo;camarón&rdquo;, &ldquo;papas&rdquo;, &ldquo;jamaica&rdquo;).
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold text-xs hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            index={idx}
                            transitionKey={cardTransitionKey}
                            onOpenCustomizer={handleOpenCustomizer}
                            onQuickAdd={handleAddToCart}
                            itemQuantityInCart={getItemQuantityInCart(item.id)}
                            isFavorite={favoriteIds.includes(item.id)}
                            onToggleFavorite={handleToggleFavorite}
                            ratingSummary={dishRatingSummaries[item.id]}
                            onOpenRatingModal={setRatingTargetItem}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              ) : selectedCategory === 'favorites' ? (
                /* Mis Favoritos Sheet */
                <motion.div layout className="space-y-6">
                  <motion.section
                    key="favorites"
                    layout="position"
                    layoutId="category-section-favorites"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 320, damping: 32 },
                      opacity: { duration: 0.22 },
                      y: { duration: 0.25 },
                    }}
                    id="favorites"
                    className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 overflow-hidden scroll-mt-44"
                  >
                    {/* Favorites Header */}
                    <div className="px-4 py-4 sm:px-6 bg-zinc-50/90 dark:bg-[#16161B] border-b border-zinc-200 dark:border-zinc-800 flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Heart className="w-5 h-5 fill-rose-500 text-rose-500 shrink-0" />
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif text-balance">
                            Mis Favoritos
                          </h2>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
                            · {favoriteItems.length} {favoriteItems.length === 1 ? 'guardado' : 'guardados'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                          Tus platillos favoritos guardados en este dispositivo para ordenar más rápido.
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectCategory('all')}
                        className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
                      >
                        Ver todo el menú
                      </button>
                    </div>

                    {favoriteItems.length === 0 ? (
                      <div className="py-16 text-center space-y-3 px-4">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mx-auto text-rose-500">
                          <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">
                          Aún no tienes favoritos
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                          Toca el ícono de corazón en cualquier platillo del menú para guardarlo aquí y encontrarlo al instante.
                        </p>
                        <button
                          onClick={() => handleSelectCategory('all')}
                          className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold text-xs hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors"
                        >
                          Explorar el menú
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        layout
                        className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                      >
                        <AnimatePresence mode="popLayout">
                          {favoriteItems.map((item, idx) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              index={idx}
                              transitionKey={cardTransitionKey}
                              onOpenCustomizer={handleOpenCustomizer}
                              onQuickAdd={handleAddToCart}
                              itemQuantityInCart={getItemQuantityInCart(item.id)}
                              isFavorite={true}
                              onToggleFavorite={handleToggleFavorite}
                              ratingSummary={dishRatingSummaries[item.id]}
                              onOpenRatingModal={setRatingTargetItem}
                            />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </motion.section>
                </motion.div>
              ) : selectedCategory === 'top-rated' ? (
                /* Mejor calificados Sheet */
                <motion.div layout className="space-y-6">
                  <motion.section
                    key="top-rated"
                    layout="position"
                    layoutId="category-section-top-rated"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 320, damping: 32 },
                      opacity: { duration: 0.22 },
                      y: { duration: 0.25 },
                    }}
                    id="top-rated"
                    className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 overflow-hidden scroll-mt-44"
                  >
                    <div className="px-4 py-4 sm:px-6 bg-zinc-50/90 dark:bg-[#16161B] border-b border-zinc-200 dark:border-zinc-800 flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-500 shrink-0" />
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif text-balance">
                            Mejor calificados
                          </h2>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tabular-nums">
                            · {topRatedItems.length} platillos ordenados por puntuación
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                          Los favoritos de la casa según las calificaciones de nuestros clientes. Toca las estrellas de cualquier platillo para votar.
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectCategory('all')}
                        className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
                      >
                        Ver todo el menú
                      </button>
                    </div>

                    <motion.div
                      layout
                      className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                    >
                      <AnimatePresence mode="popLayout">
                        {topRatedItems.map((item, idx) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            index={idx}
                            transitionKey={cardTransitionKey}
                            onOpenCustomizer={handleOpenCustomizer}
                            onQuickAdd={handleAddToCart}
                            itemQuantityInCart={getItemQuantityInCart(item.id)}
                            isFavorite={favoriteIds.includes(item.id)}
                            onToggleFavorite={handleToggleFavorite}
                            ratingSummary={dishRatingSummaries[item.id]}
                            onOpenRatingModal={setRatingTargetItem}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </motion.section>
                </motion.div>
              ) : (
                /* Category browsing mode: Structured Menu Sheets with organic layoutId transitions */
                <motion.div layout className="space-y-8 sm:space-y-10">
                  <AnimatePresence mode="popLayout">
                    {visibleCategorySections.map((cat, sectionIndex) => (
                      <motion.section
                        key={cat.id}
                        layout="position"
                        layoutId={`category-section-${cat.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{
                          layout: { type: 'spring', stiffness: 320, damping: 32 },
                          opacity: { duration: 0.22 },
                          y: { duration: 0.25 },
                        }}
                        id={cat.id}
                        className="rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 overflow-hidden scroll-mt-44 shadow-[0_1px_3px_rgba(9,9,11,0.04)]"
                      >
                        {/* Category Sheet Masthead */}
                        <motion.div
                          layout="position"
                          layoutId={`category-header-${cat.id}`}
                          className="px-4 py-4 sm:px-6 bg-zinc-50/90 dark:bg-[#16161B] border-b border-zinc-200 dark:border-zinc-800 flex items-end justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums tracking-wider">
                                {String(sectionIndex + 1).padStart(2, '0')}.
                              </span>
                              <motion.span layoutId={`category-icon-${cat.id}`} className="text-xl sm:text-2xl">
                                {cat.icon}
                              </motion.span>
                              <motion.h2
                                layoutId={`category-title-${cat.id}`}
                                className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-serif text-balance"
                              >
                                {cat.name}
                              </motion.h2>
                              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tabular-nums">
                                · {cat.items.length} {cat.items.length === 1 ? 'opción' : 'opciones'}
                                {cat.badge ? ` · ${cat.badge}` : ''}
                              </span>
                            </div>
                            {cat.description && (
                              <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 max-w-2xl">
                                {cat.description}
                              </p>
                            )}
                          </div>

                          {selectedCategory !== 'all' && (
                            <button
                              onClick={() => handleSelectCategory('all')}
                              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
                            >
                              Ver todo el menú
                            </button>
                          )}
                        </motion.div>

                        {/* Category Banner Notice */}
                        {cat.bannerNotice && (
                          <motion.div
                            layout="position"
                            className="px-4 py-2.5 sm:px-6 bg-amber-50/80 dark:bg-amber-950/25 border-b border-amber-200/70 dark:border-amber-900/40 flex items-center gap-2 text-amber-950 dark:text-amber-200 text-xs font-semibold"
                          >
                            <span className="text-sm">🍟</span>
                            <span>{cat.bannerNotice.replace(/^🍟\s*/, '')}</span>
                          </motion.div>
                        )}

                        {/* Hairline-Divided Menu Ledger Rows */}
                        <motion.div
                          layout
                          className="divide-y divide-zinc-100 dark:divide-zinc-800/80"
                        >
                          <AnimatePresence mode="popLayout">
                            {cat.items.map((item, idx) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                index={idx}
                                transitionKey={cardTransitionKey}
                                onOpenCustomizer={handleOpenCustomizer}
                                onQuickAdd={handleAddToCart}
                                itemQuantityInCart={getItemQuantityInCart(item.id)}
                                isFavorite={favoriteIds.includes(item.id)}
                                onToggleFavorite={handleToggleFavorite}
                                ratingSummary={dishRatingSummaries[item.id]}
                                onOpenRatingModal={setRatingTargetItem}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </motion.section>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
                </div>
              </div>
            </main>
          </LayoutGroup>
        </>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0D0D10] py-8 text-zinc-500 dark:text-zinc-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white shrink-0 shadow-xs">
              <img
                src={RESTAURANT_LOGO}
                alt="Logo Hot Dog's El Carballito"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-black text-sm text-zinc-950 dark:text-zinc-50 font-serif">
                Hot Dog&apos;s El Carballito
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {RESTAURANT_ADDRESS}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>Horarios y Servicio</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
            <a
              href={`https://wa.me/${RESTAURANT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp: +52 668 173 2492</span>
            </a>
          </div>

          <p className="text-xs text-zinc-400 text-center md:text-right">
            © {new Date().getFullYear()} Hot Dog&apos;s El Carballito · Pedidos a WhatsApp
          </p>
        </div>
      </footer>

      {/* Customizer Modal for Sauces, Portions & Notes */}
      <ItemCustomizerModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => {
          setCustomizingItem(null);
          setCustomizingVariantId(undefined);
        }}
        onAddToCart={handleAddToCart}
        initialVariantId={customizingVariantId}
        ratingSummary={customizingItem ? dishRatingSummaries[customizingItem.id] : null}
        onOpenDishRating={(itemToRate) => {
          setCustomizingItem(null);
          setRatingTargetItem(itemToRate);
        }}
      />

      {/* Per-Dish Rating Modal */}
      <DishRatingModal
        item={ratingTargetItem}
        summary={ratingTargetItem ? dishRatingSummaries[ratingTargetItem.id] : null}
        isOpen={Boolean(ratingTargetItem)}
        onClose={() => setRatingTargetItem(null)}
        onSubmitDishRating={handleSubmitDishRating}
        onRemoveDishRating={handleRemoveDishRating}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        initialMesa={mesaNumber}
        orderHistory={orderHistory}
        onOrderPlaced={handleOrderPlaced}
        onReorder={(order) => handleReorder(order, false)}
        onAddItem={handleAddToCart}
        onOpenRating={() => {
          setIsCartOpen(false);
          setIsRatingOpen(true);
        }}
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartButton
        totalCount={totalItemCount}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Restaurant Hours & Location Modal */}
      <HoursAndLocationModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Settings Modal (Font presets & Theme) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontPreset={fontPreset}
        onChangeFontPreset={setFontPreset}
        darkMode={darkMode}
        onToggleDarkMode={setDarkMode}
      />

      {/* Experience Star Rating Modal */}
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        onSubmitRating={handleSubmitRating}
      />

      {/* Top Cart Confirmation Toast with Confetti Burst */}
      <CartAddToast
        toast={cartToast}
        onDismiss={() => setCartToast(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Emerging Special Offer Notification (Service Worker + In-App Popup) */}
      <OfferNotificationToast
        offer={activeOfferToast}
        permissionState={notifPermission}
        hasCartItems={totalItemCount > 0}
        onDismiss={() => setActiveOfferToast(null)}
        onClaimOffer={handleClaimOffer}
        onEnableNotifications={handleEnableOfferNotifications}
      />
    </div>
  );
}
