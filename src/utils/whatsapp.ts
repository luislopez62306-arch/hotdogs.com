import { CartItem, OrderDetails } from '../types';
import { RESTAURANT_WHATSAPP } from '../data/menuData';

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(0)} MXN`;
}

export function generateWhatsAppMessage(
  cartItems: CartItem[],
  orderDetails: OrderDetails,
  totalAmount: number
): string {
  const dateStr = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [];

  lines.push('🌭 *NUEVO PEDIDO - HOT DOG\'S EL CARBALLITO* 🌭');
  lines.push('────────────────────────');

  // Modality details
  if (orderDetails.modality === 'mesa') {
    lines.push(`🍽️ *Servicio:* EN MESA #${orderDetails.mesaNumber || 'Sin especificar'}`);
    if (orderDetails.customerName.trim()) {
      lines.push(`👤 *A nombre de:* ${orderDetails.customerName.trim()}`);
    }
  } else if (orderDetails.modality === 'llevar') {
    lines.push('🛍️ *Servicio:* PARA LLEVAR (Pick-up)');
    lines.push(`👤 *Cliente:* ${orderDetails.customerName.trim() || 'No especificado'}`);
    lines.push(`💳 *Método de Pago:* ${orderDetails.paymentMethod}`);
  } else if (orderDetails.modality === 'domicilio') {
    lines.push('🛵 *Servicio:* A DOMICILIO');
    lines.push(`👤 *Cliente:* ${orderDetails.customerName.trim() || 'No especificado'}`);
    lines.push(`💳 *Método de Pago:* ${orderDetails.paymentMethod}`);
    lines.push(`📍 *Dirección:* ${orderDetails.deliveryAddress.streetAndNumber.trim()}`);
    if (orderDetails.deliveryAddress.neighborhood.trim()) {
      lines.push(`   *Colonia:* ${orderDetails.deliveryAddress.neighborhood.trim()}`);
    }
    if (orderDetails.deliveryAddress.references.trim()) {
      lines.push(`   *Referencias:* ${orderDetails.deliveryAddress.references.trim()}`);
    }
  }

  lines.push(`⏰ *Hora:* ${dateStr}`);
  lines.push('────────────────────────');
  lines.push('🛒 *RESUMEN DE ARTÍCULOS:*');
  lines.push('');

  cartItems.forEach((item, index) => {
    let itemLine = `${index + 1}. *${item.quantity}x ${item.name}*`;
    if (item.selectedVariant) {
      itemLine += ` (${item.selectedVariant.name})`;
    }
    itemLine += ` — ${formatCurrency(item.pricePerUnit * item.quantity)}`;
    lines.push(itemLine);

    if (item.selectedSauce) {
      lines.push(`   ↳ *Salsa:* ${item.selectedSauce}`);
    }
    if (item.includesFries) {
      lines.push('   ↳ _(Incluye papas a la francesa)_');
    }
    if (item.customNotes && item.customNotes.trim()) {
      lines.push(`   ↳ *Detalle:* ${item.customNotes.trim()}`);
    }
  });

  lines.push('────────────────────────');

  if (orderDetails.generalNotes && orderDetails.generalNotes.trim()) {
    lines.push(`📝 *Notas generales:*`);
    lines.push(`"${orderDetails.generalNotes.trim()}"`);
    lines.push('────────────────────────');
  }

  lines.push(`💰 *TOTAL A PAGAR: ${formatCurrency(totalAmount)}*`);
  lines.push('────────────────────────');
  lines.push(`⭐ *Califica tu experiencia aquí:* ${getRatingShareUrl()}`);
  lines.push('✨ _Enviado desde el Menú Digital_');

  return lines.join('\n');
}

export function getRatingShareUrl(): string {
  if (typeof window === 'undefined') return '?calificar=1';
  const url = new URL(window.location.href);
  url.searchParams.set('calificar', '1');
  return url.toString();
}

export function getWhatsAppUrl(
  cartItems: CartItem[],
  orderDetails: OrderDetails,
  totalAmount: number
): string {
  const message = generateWhatsAppMessage(cartItems, orderDetails, totalAmount);
  return `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

