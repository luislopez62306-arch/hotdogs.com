import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  UtensilsCrossed, 
  ShoppingBag, 
  Bike, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowRight,
  AlertCircle,
  RotateCcw,
  History,
  Star,
  ExternalLink
} from 'lucide-react';
import { CartItem, OrderDetails, OrderModality, PaymentMethod, PastOrder } from '../types';
import { formatCurrency, getWhatsAppUrl, generateWhatsAppMessage, getRatingShareUrl } from '../utils/whatsapp';
import { formatOrderTimestamp, formatModalityLabel, formatOrderSummary } from '../utils/orderHistory';
import { SmartComplements } from './SmartComplements';

const CATEGORY_ICONS: Record<string, string> = {
  'hot-dogs': '🌭',
  'tortas': '🥖',
  'salchipapas': '🍟',
  'salchicarnes': '🥩',
  'antojitos': '🍗',
  'salchichas': '🥓',
  'bebidas': '🥤',
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  initialMesa?: string;
  orderHistory: PastOrder[];
  onOrderPlaced: (order: Omit<PastOrder, 'id' | 'createdAt'>) => void;
  onReorder: (order: PastOrder) => void;
  onAddItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  onOpenRating: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  initialMesa = '',
  orderHistory,
  onOrderPlaced,
  onReorder,
  onAddItem,
  onOpenRating,
}) => {
  // Order Details State
  const [modality, setModality] = useState<OrderModality>(initialMesa ? 'mesa' : 'mesa');
  const [mesaNumber, setMesaNumber] = useState<string>(initialMesa || '1');
  const [customerName, setCustomerName] = useState<string>('');
  const [deliveryStreet, setDeliveryStreet] = useState<string>('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState<string>('');
  const [deliveryReferences, setDeliveryReferences] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [generalNotes, setGeneralNotes] = useState<string>('');
  
  // UI states
  const [isCopied, setIsCopied] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sentWhatsAppUrl, setSentWhatsAppUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSentWhatsAppUrl(null);
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const orderDetails: OrderDetails = {
    modality,
    mesaNumber,
    customerName,
    deliveryAddress: {
      streetAndNumber: deliveryStreet,
      neighborhood: deliveryNeighborhood,
      references: deliveryReferences,
    },
    paymentMethod,
    generalNotes,
  };

  const validateOrder = (): boolean => {
    if (cartItems.length === 0) {
      setValidationError('Tu carrito está vacío. Agrega al menos un platillo.');
      return false;
    }

    if (modality === 'mesa') {
      if (!mesaNumber.trim()) {
        setValidationError('Por favor ingresa tu número de mesa.');
        return false;
      }
    } else if (modality === 'llevar') {
      if (!customerName.trim()) {
        setValidationError('Por favor escribe tu nombre para identificar tu pedido.');
        return false;
      }
    } else if (modality === 'domicilio') {
      if (!customerName.trim()) {
        setValidationError('Por favor escribe tu nombre para la entrega.');
        return false;
      }
      if (!deliveryStreet.trim()) {
        setValidationError('Por favor escribe tu calle y número para el envío.');
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleSendWhatsApp = () => {
    if (!validateOrder()) return;

    onOrderPlaced({
      items: cartItems,
      totalAmount,
      modality,
    });

    const url = getWhatsAppUrl(cartItems, orderDetails, totalAmount);
    setSentWhatsAppUrl(url);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  };

  const handleCopyTicket = async () => {
    if (!validateOrder()) return;

    onOrderPlaced({
      items: cartItems,
      totalAmount,
      modality,
    });

    const message = generateWhatsAppMessage(cartItems, orderDetails, totalAmount);
    try {
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  const handleReorderClick = (order: PastOrder) => {
    onReorder(order);
    setReorderedId(order.id);
    setTimeout(() => setReorderedId(null), 1300);
  };

  const appendQuickNote = (noteText: string) => {
    if (!generalNotes.includes(noteText)) {
      setGeneralNotes((prev) => (prev ? `${prev}, ${noteText}` : noteText));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg h-full bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 flex flex-col shadow-2xl border-l border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-[#18181B] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-amber-500 text-amber-400 dark:text-zinc-950 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50">Tu Pedido</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                {totalItemCount} {totalItemCount === 1 ? 'producto' : 'productos'} en total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors p-1"
                title="Vaciar carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Validation Banner if error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-3xl">
                🌭
              </div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Tu carrito está vacío
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                Explora el menú y agrega tus hot dogs, tortas, salchipapas y bebidas favoritas.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-amber-400 transition-colors"
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                Platillos seleccionados
              </label>

              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex items-start gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                      {CATEGORY_ICONS[item.categoryId] || '🌭'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {item.name}
                        </h4>
                        <span className="font-black text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 shrink-0">
                          {formatCurrency(item.pricePerUnit * item.quantity)}
                        </span>
                      </div>

                      {/* Variant and sauce tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.selectedVariant && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        {item.selectedSauce && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                            Salsa: {item.selectedSauce}
                          </span>
                        )}
                        {item.includesFries && (
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            + papas
                          </span>
                        )}
                      </div>

                      {/* Item specific notes */}
                      {item.customNotes && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 italic mt-1 line-clamp-1">
                          Nota: "{item.customNotes}"
                        </p>
                      )}

                      {/* Stepper controls */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/60">
                        <span className="text-[11px] text-neutral-400">
                          {formatCurrency(item.pricePerUnit)} c/u
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Eliminar platillo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 px-1 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-0.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-0.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Complements Section */}
          <SmartComplements
            cartItems={cartItems}
            onAddComplement={onAddItem}
          />

          {/* Local History of Last 3 Orders */}
          {orderHistory.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Tus últimos pedidos</span>
                </label>
                <span className="text-[11px] text-zinc-400 tabular-nums">
                  Toca para repetir
                </span>
              </div>

              <div className="space-y-2">
                {orderHistory.slice(0, 3).map((order) => {
                  const isReordered = reorderedId === order.id;
                  const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => handleReorderClick(order)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isReordered
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/35'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-amber-500/70'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                          <span>{formatOrderTimestamp(order.createdAt)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatModalityLabel(order.modality)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">
                            {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100 line-clamp-1">
                          {formatOrderSummary(order)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-zinc-950 dark:text-amber-400 tabular-nums">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                            isReordered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950'
                          }`}
                        >
                          {isReordered ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Añadido</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>Repetir</span>
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Modalidad de pedido */}
          <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
              1. Modalidad de Pedido
            </label>

            {/* 3 Modality Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setModality('mesa')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  modality === 'mesa'
                    ? 'border-zinc-950 dark:border-amber-400 bg-zinc-950 dark:bg-amber-500/15 text-white dark:text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <UtensilsCrossed className={`w-4 h-4 mb-1 ${modality === 'mesa' ? 'text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                <span className="text-xs font-bold">En Mesa</span>
                <span className={`text-[10px] ${modality === 'mesa' ? 'text-zinc-300 dark:text-amber-200/70' : 'text-zinc-400'}`}>
                  En el local
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModality('llevar')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  modality === 'llevar'
                    ? 'border-zinc-950 dark:border-amber-400 bg-zinc-950 dark:bg-amber-500/15 text-white dark:text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 mb-1 ${modality === 'llevar' ? 'text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                <span className="text-xs font-bold">Para Llevar</span>
                <span className={`text-[10px] ${modality === 'llevar' ? 'text-zinc-300 dark:text-amber-200/70' : 'text-zinc-400'}`}>
                  Pasa a recoger
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModality('domicilio')}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  modality === 'domicilio'
                    ? 'border-zinc-950 dark:border-amber-400 bg-zinc-950 dark:bg-amber-500/15 text-white dark:text-amber-300 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <Bike className={`w-4 h-4 mb-1 ${modality === 'domicilio' ? 'text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                <span className="text-xs font-bold">A Domicilio</span>
                <span className={`text-[10px] ${modality === 'domicilio' ? 'text-zinc-300 dark:text-amber-200/70' : 'text-zinc-400'}`}>
                  Te lo llevamos
                </span>
              </button>
            </div>

            {/* Inputs depending on modality */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              {modality === 'mesa' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Número de Mesa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mesaNumber}
                      onChange={(e) => setMesaNumber(e.target.value)}
                      placeholder="Ej. 4"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Nombre del cliente (opcional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {modality === 'llevar' && (
                <div className="space-y-3">
                  <div className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-600 dark:text-zinc-300">
                    <span className="font-bold text-zinc-950 dark:text-zinc-50">Punto para recoger:</span> Reforma y Pasadena, en la pura esquina · Las Canteras
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Tu Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Carlos Ochoa"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Método de pago al recoger:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Efectivo', 'Transferencia', 'Tarjeta'] as PaymentMethod[]).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            paymentMethod === method
                              ? 'bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 border-zinc-950 dark:border-amber-500'
                              : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modality === 'domicilio' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Tu Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Roberto Gastélum"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Calle y Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      placeholder="Ej. Av. Álvaro Obregón #450 Sur"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Colonia
                      </label>
                      <input
                        type="text"
                        value={deliveryNeighborhood}
                        onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                        placeholder="Ej. Las Quintas"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Referencias
                      </label>
                      <input
                        type="text"
                        value={deliveryReferences}
                        onChange={(e) => setDeliveryReferences(e.target.value)}
                        placeholder="Portón blanco, timbre..."
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Método de pago al recibir:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Efectivo', 'Transferencia', 'Tarjeta'] as PaymentMethod[]).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            paymentMethod === method
                              ? 'bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 border-zinc-950 dark:border-amber-500'
                              : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Notas generales */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
              2. Notas Generales para la Cocina
            </label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Ej. Con todo, cátsup aparte, sin chile, sin verdura..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {['Con todo', 'Sin cebolla', 'Cátsup aparte', 'Bien dorado', 'Salsas aparte'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => appendQuickNote(tag)}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-800 transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer with Total & WhatsApp Action */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181B] space-y-3 shrink-0">
          {/* Post-Send Rating Link Banner */}
          {sentWhatsAppUrl && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300/80 dark:border-amber-500/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    <span>¡Pedido listo en WhatsApp!</span>
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                    Al enviar tu mensaje, usa este enlace para calificar tu experiencia con estrellas:
                  </p>
                </div>
                <a
                  href={sentWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>Reabrir chat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <a
                href={getRatingShareUrl()}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenRating();
                }}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 text-xs font-bold transition-colors shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 dark:fill-zinc-950 text-amber-400 dark:text-zinc-950 shrink-0" />
                  <span>Calificar mi experiencia</span>
                </span>
                <span className="flex items-center gap-0.5 text-amber-300 dark:text-zinc-900">
                  <span aria-hidden="true">★★★★★</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Subtotal ({totalItemCount} artículos)</span>
              <span className="tabular-nums">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-black text-zinc-950 dark:text-zinc-50">
              <span>Total a Pagar</span>
              <span className="text-xl text-zinc-950 dark:text-amber-400 tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {/* WhatsApp CTA (Main) */}
            <button
              onClick={handleSendWhatsApp}
              disabled={cartItems.length === 0}
              className="sm:col-span-3 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              <span>Pedir por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Copy Ticket Button */}
            <button
              onClick={handleCopyTicket}
              disabled={cartItems.length === 0}
              title="Copiar texto del pedido"
              className="sm:col-span-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold transition-colors disabled:opacity-40"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="sm:hidden">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="sm:hidden">Copiar</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-neutral-400">
            Al enviar, se abrirá WhatsApp con el número del restaurante <span className="font-semibold text-neutral-600 dark:text-neutral-300">526681732492</span> y tu ticket desglosado.
          </p>
        </div>
      </div>
    </div>
  );
};
