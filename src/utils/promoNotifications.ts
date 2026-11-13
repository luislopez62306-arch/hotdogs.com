import { CartItem, CategoryId } from '../types';

export interface SpecialOffer {
  id: string;
  tag: string;
  title: string;
  body: string;
  emoji: string;
  promoPrice: number;
  originalPrice: number;
  targetCategoryId: CategoryId;
  comboItem: Omit<CartItem, 'cartItemId'>;
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-combo-duo',
    tag: 'Nueva oferta especial',
    title: 'Combo Dúo Sinaloense · $175',
    body: '2 Hot Dogs Especiales con papas a la francesa + 2 Aguas Frescas (antes $190).',
    emoji: '🌭',
    promoPrice: 175,
    originalPrice: 190,
    targetCategoryId: 'hot-dogs',
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
    id: 'offer-combo-salchicarne',
    tag: 'Oferta nocturna',
    title: 'Salchicarne Grande + Bebida · $160',
    body: 'Salchicarnes Especial Grande con carne asada gratinada + Agua de Cebada o Horchata.',
    emoji: '🥩',
    promoPrice: 160,
    originalPrice: 175,
    targetCategoryId: 'salchicarnes',
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
    id: 'offer-combo-boneless',
    tag: 'Favorito en promo',
    title: 'Combo Boneless Sazonados · $155',
    body: '1 Orden de Boneless con Papas Sazonadas (salsa a elegir) + Coca-Cola fría.',
    emoji: '🍗',
    promoPrice: 155,
    originalPrice: 168,
    targetCategoryId: 'antojitos',
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
];

const SESSION_SHOWN_KEY = 'el_carballito_offer_shown_session';
const ROTATION_IDX_KEY = 'el_carballito_offer_rotation_idx';

export function getNextSpecialOfferOnOpen(): SpecialOffer | null {
  if (typeof window === 'undefined') return null;
  try {
    if (sessionStorage.getItem(SESSION_SHOWN_KEY) === '1') {
      return null;
    }

    const rawIdx = localStorage.getItem(ROTATION_IDX_KEY);
    const currentIdx = rawIdx ? Number.parseInt(rawIdx, 10) : 0;
    const safeIdx = Number.isNaN(currentIdx) ? 0 : currentIdx % SPECIAL_OFFERS.length;
    const offer = SPECIAL_OFFERS[safeIdx];

    localStorage.setItem(ROTATION_IDX_KEY, String((safeIdx + 1) % SPECIAL_OFFERS.length));
    sessionStorage.setItem(SESSION_SHOWN_KEY, '1');
    return offer;
  } catch {
    return SPECIAL_OFFERS[0];
  }
}

export async function registerBasicServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return registration;
  } catch {
    return null;
  }
}

export function getNotificationPermissionState(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export async function dispatchServiceWorkerNotification(
  offer: SpecialOffer,
  registration?: ServiceWorkerRegistration | null
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const swReg =
      registration ||
      ('serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null);

    const payload = {
      type: 'SHOW_PROMO_NOTIFICATION',
      offerId: offer.id,
      tag: `el-carballito-${offer.id}`,
      title: `${offer.emoji} ${offer.title}`,
      body: offer.body,
    };

    if (swReg?.active) {
      swReg.active.postMessage(payload);
      return true;
    }

    if (swReg && 'showNotification' in swReg) {
      await swReg.showNotification(payload.title, {
        body: payload.body,
        icon: '/assets/aistudio/IMG_6395_bb79ef09.jpeg',
        badge: '/assets/aistudio/IMG_6395_bb79ef09.jpeg',
        tag: payload.tag,
        data: { offerId: offer.id, url: '/' },
      });
      return true;
    }

    new Notification(payload.title, {
      body: payload.body,
      icon: '/assets/aistudio/IMG_6395_bb79ef09.jpeg',
      tag: payload.tag,
    });
    return true;
  } catch {
    return false;
  }
}
