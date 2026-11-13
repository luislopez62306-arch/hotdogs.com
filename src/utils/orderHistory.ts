import { OrderModality, PastOrder } from '../types';

export function formatOrderTimestamp(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Reciente';

    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const timeStr = date.toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (isSameDay) {
      return `Hoy · ${timeStr}`;
    }

    const dateStr = date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    });

    return `${dateStr} · ${timeStr}`;
  } catch {
    return 'Reciente';
  }
}

export function formatModalityLabel(modality: OrderModality): string {
  switch (modality) {
    case 'mesa':
      return 'En mesa';
    case 'llevar':
      return 'Para llevar';
    case 'domicilio':
      return 'A domicilio';
    default:
      return 'Pedido';
  }
}

export function formatOrderSummary(order: PastOrder): string {
  return order.items
    .map((item) => {
      const variantPart = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
      return `${item.quantity}× ${item.name}${variantPart}`;
    })
    .join(', ');
}
