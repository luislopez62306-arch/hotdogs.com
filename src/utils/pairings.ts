import { MENU_ITEMS } from '../data/menuData';
import { CartItem, MenuItem, VariantOption } from '../types';

export interface PairingSuggestion {
  label: string;
  targetItem: MenuItem;
  variant?: VariantOption;
  displayName: string;
  price: number;
  emoji: string;
}

export interface SmartCartComplement {
  id: string;
  kind: 'Bebida' | 'Entrada';
  targetItem: MenuItem;
  variant?: VariantOption;
  displayName: string;
  price: number;
  emoji: string;
  reason: string;
}

function createPairing(
  label: string,
  menuItemId: string,
  emoji: string,
  variantId?: string,
  customName?: string
): PairingSuggestion | null {
  const found = MENU_ITEMS.find((item) => item.id === menuItemId);
  if (!found) return null;

  let variant: VariantOption | undefined;
  if (variantId && found.variants) {
    variant = found.variants.options.find((opt) => opt.id === variantId);
  }

  return {
    label,
    targetItem: found,
    variant,
    displayName: customName || (variant ? `${found.name} (${variant.name})` : found.name),
    price: variant ? variant.price : found.basePrice,
    emoji,
  };
}

export function getPairingSuggestion(item: MenuItem): PairingSuggestion | null {
  // Specific dish pairings
  switch (item.id) {
    case 'hd-normal':
      return createPairing('Bebida recomendada', 'coca-vidrio', '🍾');
    case 'hd-especial':
      return createPairing('Bebida recomendada', 'agua-cebada', '🥤');
    case 'hd-jumbo-doble':
      return createPairing('Entrada recomendada', 'aros-cebolla', '🧅');
    case 'hd-ranchero':
    case 'hd-ranchero-especial':
      return createPairing('Bebida recomendada', 'agua-cebada', '🥤');
    case 'hd-camaron':
    case 'hd-mar-y-tierra':
    case 'torta-mar-y-tierra':
    case 'sp-camaron':
    case 'sc-mar-y-tierra':
      return createPairing('Bebida recomendada', 'agua-naranjita', '🍊');
    case 'hd-hawaiano':
      return createPairing('Bebida recomendada', 'agua-pina-coco', '🍍');
    case 'hd-pastor':
    case 'torta-pastor':
      return createPairing('Bebida recomendada', 'agua-pina', '🍍');
    case 'hd-asada':
    case 'torta-asada':
      return createPairing('Entrada recomendada', 'papas-sazonadas', '🍟', 'media', '1/2 Papas Sazonadas');
    case 'hd-italiano':
    case 'hd-tres-quesos':
    case 'hd-philadelphia':
    case 'hd-quesidogo':
      return createPairing('Bebida recomendada', 'agua-jamaica', '🌺');
    case 'hd-boneless':
    case 'hd-pollo':
      return createPairing('Bebida recomendada', 'limonada-fresa', '🍓');
    case 'hd-embarazado':
    case 'hd-tocinudo':
      return createPairing('Bebida recomendada', 'te-helado', '🧊');
    case 'torta-ranchera':
      return createPairing('Bebida recomendada', 'agua-cebada', '🥤');
    case 'aros-cebolla':
    case 'papas-sazonadas':
    case 'papas-francesa':
      return createPairing('Complemento recomendado', 'salch-especial', '🥓', 'sola', 'Salchicha Especial');
    default:
      break;
  }

  // Category-level fallbacks
  switch (item.categoryId) {
    case 'salchipapas':
      return createPairing('Bebida recomendada', 'agua-jamaica', '🌺');
    case 'salchicarnes':
      return createPairing('Entrada recomendada', 'aros-cebolla', '🧅');
    case 'antojitos':
      return createPairing('Bebida recomendada', 'limonada-fresa', '🍓');
    case 'salchichas':
      return createPairing('Entrada recomendada', 'papas-francesa', '🍟', 'media', '1/2 Papas a la Francesa');
    case 'bebidas':
      if (item.id === 'coca-vidrio' || item.id === 'coca-cola') {
        return createPairing('Para acompañar', 'aros-cebolla', '🧅');
      }
      return createPairing('Para acompañar', 'papas-francesa', '🍟', 'media', '1/2 Papas a la Francesa');
    default:
      return createPairing('Bebida recomendada', 'agua-cebada', '🥤');
  }
}

function buildComplement(
  kind: 'Bebida' | 'Entrada',
  menuItemId: string,
  emoji: string,
  reason: string,
  variantId?: string,
  customName?: string
): SmartCartComplement | null {
  const found = MENU_ITEMS.find((item) => item.id === menuItemId);
  if (!found) return null;

  let variant: VariantOption | undefined;
  if (variantId && found.variants) {
    variant = found.variants.options.find((opt) => opt.id === variantId);
  }

  return {
    id: `${found.id}-${variant?.id || 'base'}`,
    kind,
    targetItem: found,
    variant,
    displayName: customName || (variant ? `${found.name} (${variant.name})` : found.name),
    price: variant ? variant.price : found.basePrice,
    emoji,
    reason,
  };
}

export function getSmartCartComplements(cartItems: CartItem[]): SmartCartComplement[] {
  if (cartItems.length === 0) return [];

  const existingIds = new Set(cartItems.map((it) => it.menuItemId));
  const hasDrinkInCart = cartItems.some((it) => it.categoryId === 'bebidas');
  const starterIds = new Set(['aros-cebolla', 'papas-sazonadas', 'papas-francesa', 'salch-especial', 'salch-ranchera']);
  const hasStarterInCart = cartItems.some((it) => starterIds.has(it.menuItemId));

  const candidates: SmartCartComplement[] = [];
  const pushCandidate = (candidate: SmartCartComplement | null) => {
    if (!candidate) return;
    if (existingIds.has(candidate.targetItem.id)) return;
    if (candidates.some((c) => c.targetItem.id === candidate.targetItem.id)) return;
    candidates.push(candidate);
  };

  for (const cartItem of cartItems) {
    const id = cartItem.menuItemId;

    if (id === 'hd-ranchero' || id === 'hd-ranchero-especial' || id === 'torta-ranchera' || id === 'sp-rancheras' || id === 'sc-rancheras') {
      pushCandidate(
        buildComplement('Bebida', 'agua-cebada', '🥤', `Ideal para acompañar tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'aros-cebolla', '🧅', 'Crujientes para compartir con lo ranchero')
      );
    } else if (id === 'hd-camaron' || id === 'hd-mar-y-tierra' || id === 'torta-mar-y-tierra' || id === 'sp-camaron' || id === 'sc-mar-y-tierra') {
      pushCandidate(
        buildComplement('Bebida', 'agua-naranjita', '🍊', `Frescura cítrica para tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'papas-sazonadas', '🍟', 'Sabor especiado perfecto con camarón', 'media', '1/2 Orden Papas Sazonadas')
      );
    } else if (id === 'hd-pastor' || id === 'torta-pastor' || id === 'hd-hawaiano') {
      pushCandidate(
        buildComplement('Bebida', 'agua-pina', '🍍', `Combina natural con tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'aros-cebolla', '🧅', 'Entrada doradita para abrir apetito')
      );
    } else if (id === 'hd-asada' || id === 'torta-asada' || cartItem.categoryId === 'salchicarnes') {
      pushCandidate(
        buildComplement('Bebida', 'coca-vidrio', '🍾', `Clásica bien helada para tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'aros-cebolla', '🧅', 'Complemento crujiente para la carne asada')
      );
    } else if (id === 'hd-italiano' || id === 'hd-tres-quesos' || id === 'hd-philadelphia' || id === 'hd-quesidogo') {
      pushCandidate(
        buildComplement('Bebida', 'agua-jamaica', '🌺', `Equilibra el queso de tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'papas-francesa', '🍟', 'Porción extra para botanear', 'media', '1/2 Orden Papas a la Francesa')
      );
    } else if (id === 'hd-boneless' || id === 'hd-pollo' || cartItem.categoryId === 'antojitos') {
      pushCandidate(
        buildComplement('Bebida', 'limonada-fresa', '🍓', `Refrescante para tus salsas y ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'salch-especial', '🥓', 'Extra asado envuelto en tocino', 'sola', 'Salchicha Especial')
      );
    } else if (cartItem.categoryId === 'hot-dogs' || cartItem.categoryId === 'salchipapas') {
      pushCandidate(
        buildComplement('Bebida', 'agua-cebada', '🥤', `Tradición sinaloense para tu ${cartItem.name}`)
      );
      pushCandidate(
        buildComplement('Entrada', 'aros-cebolla', '🧅', 'Entrada crujiente para tu orden')
      );
    } else if (cartItem.categoryId === 'bebidas') {
      pushCandidate(
        buildComplement('Entrada', 'papas-sazonadas', '🍟', 'Para acompañar tu bebida fría', 'media', '1/2 Orden Papas Sazonadas')
      );
      pushCandidate(
        buildComplement('Entrada', 'aros-cebolla', '🧅', 'Botana recién hecha')
      );
    }
  }

  // Fallback suggestions if cart only had extras/salchichas or candidates were already in cart
  if (candidates.length < 3) {
    pushCandidate(buildComplement('Bebida', 'agua-cebada', '🥤', 'Clásica agua fresca estilo Sinaloa'));
    pushCandidate(buildComplement('Bebida', 'agua-horchata', '🥛', 'Cremosa y recién hecha'));
    pushCandidate(buildComplement('Entrada', 'aros-cebolla', '🧅', 'Aros doraditos para botanear'));
    pushCandidate(buildComplement('Entrada', 'papas-sazonadas', '🍟', 'Porción ideal para compartir', 'media', '1/2 Orden Papas Sazonadas'));
  }

  // Prioritize missing category (if user has no drink, surface a drink first; if no starter, include a starter)
  const drinks = candidates.filter((c) => c.kind === 'Bebida');
  const starters = candidates.filter((c) => c.kind === 'Entrada');

  const prioritized: SmartCartComplement[] = [];
  if (!hasDrinkInCart && drinks.length > 0) {
    prioritized.push(drinks[0]);
  }
  if (!hasStarterInCart && starters.length > 0) {
    prioritized.push(starters[0]);
  }

  for (const item of candidates) {
    if (!prioritized.some((p) => p.id === item.id)) {
      prioritized.push(item);
    }
  }

  return prioritized.slice(0, 3);
}

export interface CustomizerAddon {
  key: string;
  menuItem: MenuItem;
  variant?: VariantOption;
  displayName: string;
  subtitle: string;
  price: number;
  emoji: string;
  kind: 'Bebida' | 'Entrada' | 'Extra';
  isRecommended: boolean;
}

function createCustomizerAddon(
  key: string,
  kind: 'Bebida' | 'Entrada' | 'Extra',
  menuItemId: string,
  subtitle: string,
  emoji: string,
  variantId?: string,
  customName?: string,
  isRecommended = false
): CustomizerAddon | null {
  const found = MENU_ITEMS.find((m) => m.id === menuItemId);
  if (!found) return null;

  let variant: VariantOption | undefined;
  if (variantId && found.variants) {
    variant = found.variants.options.find((o) => o.id === variantId);
  }

  return {
    key,
    menuItem: found,
    variant,
    displayName: customName || (variant ? `${found.name} (${variant.name})` : found.name),
    subtitle,
    price: variant ? variant.price : found.basePrice,
    emoji,
    kind,
    isRecommended,
  };
}

export function getCustomizerAddons(item: MenuItem | null): {
  primaryRecommendation: CustomizerAddon | null;
  addons: CustomizerAddon[];
} {
  if (!item) {
    return { primaryRecommendation: null, addons: [] };
  }

  const pairing = getPairingSuggestion(item);
  const candidates: CustomizerAddon[] = [];

  const pushAddon = (addon: CustomizerAddon | null) => {
    if (!addon) return;
    if (addon.menuItem.id === item.id && addon.variant?.id === item.variants?.defaultOptionId) return;
    if (addon.menuItem.id === item.id && !addon.variant) return;
    if (candidates.some((c) => c.menuItem.id === addon.menuItem.id && c.variant?.id === addon.variant?.id)) {
      return;
    }
    candidates.push(addon);
  };

  // 1. Always lead with the specific dish's best pairing
  if (pairing) {
    const kind: 'Bebida' | 'Entrada' | 'Extra' =
      pairing.targetItem.categoryId === 'bebidas'
        ? 'Bebida'
        : pairing.targetItem.id === 'porcion-extra'
          ? 'Extra'
          : 'Entrada';

    const reasonByDish =
      kind === 'Bebida'
        ? `Combina perfecto con ${item.name}`
        : `Acompañamiento ideal para ${item.name}`;

    pushAddon({
      key: `rec-${pairing.targetItem.id}-${pairing.variant?.id || 'base'}`,
      menuItem: pairing.targetItem,
      variant: pairing.variant,
      displayName: pairing.displayName,
      subtitle: reasonByDish,
      price: pairing.price,
      emoji: pairing.emoji,
      kind,
      isRecommended: true,
    });
  }

  // 2. Dish-level & flavor-profile dynamic add-ons
  const id = item.id;
  const isCheesy =
    id.includes('queso') ||
    id === 'hd-italiano' ||
    id === 'hd-philadelphia' ||
    id === 'hd-quesidogo';
  const isSpicyOrSauced =
    item.hasSauces ||
    id.includes('ranchero') ||
    id.includes('ranchera') ||
    id.includes('boneless');
  const isSeafood = id.includes('camaron') || id.includes('mar-y-tierra');
  const isPastorOrSweet = id.includes('pastor') || id.includes('hawaiano');
  const isMeatHeavy =
    id.includes('asada') ||
    id.includes('embarazad') ||
    id.includes('tocinudo') ||
    item.categoryId === 'salchicarnes';

  if (isCheesy) {
    pushAddon(createCustomizerAddon('jamaica', 'Bebida', 'agua-jamaica', 'Acidez fresca que corta el queso', '🌺'));
    pushAddon(createCustomizerAddon('coca-vidrio', 'Bebida', 'coca-vidrio', 'Botella de vidrio 500 ml bien fría', '🍾'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Dorados y crujientes', '🧅'));
    pushAddon(createCustomizerAddon('extra-tocino-salch', 'Extra', 'porcion-extra', 'Más queso gratinado derretido', '🧀', 'queso-gratinado', 'Extra: Queso gratinado'));
  } else if (isSeafood) {
    pushAddon(createCustomizerAddon('naranjita', 'Bebida', 'agua-naranjita', 'Cítrico sinaloense para mar y tierra', '🍊'));
    pushAddon(createCustomizerAddon('limonada-fresa', 'Bebida', 'limonada-fresa', 'Limonada fresca con fresa', '🍓'));
    pushAddon(createCustomizerAddon('papas-saz-media', 'Entrada', 'papas-sazonadas', '1/2 Orden con especias', '🍟', 'media', '1/2 Papas Sazonadas'));
    pushAddon(createCustomizerAddon('extra-queso', 'Extra', 'porcion-extra', 'Queso gratinado extra', '🧀', 'queso-gratinado', 'Extra: Queso gratinado'));
  } else if (isPastorOrSweet) {
    pushAddon(createCustomizerAddon('pina', 'Bebida', 'agua-pina', 'Piña natural bien helada', '🍍'));
    pushAddon(createCustomizerAddon('jamaica', 'Bebida', 'agua-jamaica', 'Flor de jamaica refrescante', '🌺'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Crujientes para acompañar', '🧅'));
    pushAddon(createCustomizerAddon('extra-carne', 'Extra', 'porcion-extra', 'Porción extra de carne', '🥩', 'carne', 'Extra: Carne asada'));
  } else if (isSpicyOrSauced) {
    pushAddon(createCustomizerAddon('horchata', 'Bebida', 'agua-horchata', 'Suaviza el picante con canela', '🥛'));
    pushAddon(createCustomizerAddon('limonada-fresa', 'Bebida', 'limonada-fresa', 'Natural con fresa fresca', '🍓'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Aros rebozados crujientes', '🧅'));
    pushAddon(createCustomizerAddon('extra-phila', 'Extra', 'porcion-extra', 'Toque cremoso Philadelphia', '🧀', 'queso-philadelphia', 'Extra: Queso Philadelphia'));
  } else if (isMeatHeavy) {
    pushAddon(createCustomizerAddon('cebada', 'Bebida', 'agua-cebada', 'Clásica de Sinaloa con canela', '🥤'));
    pushAddon(createCustomizerAddon('coca-vidrio', 'Bebida', 'coca-vidrio', 'Botella de vidrio 500 ml', '🍾'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Ideal para compartir', '🧅'));
    pushAddon(createCustomizerAddon('extra-carne', 'Extra', 'porcion-extra', 'Más carne asada a la plancha', '🥩', 'carne', 'Extra: Carne asada'));
  } else if (item.categoryId === 'bebidas') {
    pushAddon(createCustomizerAddon('papas-fran-media', 'Entrada', 'papas-francesa', '1/2 Orden recién hechas', '🍟', 'media', '1/2 Papas a la Francesa'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Orden dorada y crujiente', '🧅'));
    pushAddon(createCustomizerAddon('salch-esp', 'Entrada', 'salch-especial', 'Con jamón, queso y tocino', '🥓', 'sola', 'Salchicha Especial'));
    pushAddon(createCustomizerAddon('hd-normal', 'Entrada', 'hd-normal', 'Incluye papas a la francesa', '🌭'));
  } else {
    pushAddon(createCustomizerAddon('jamaica', 'Bebida', 'agua-jamaica', 'Agua fresca natural de jamaica', '🌺'));
    pushAddon(createCustomizerAddon('cebada', 'Bebida', 'agua-cebada', 'Tradicional estilo Sinaloa', '🥤'));
    pushAddon(createCustomizerAddon('aros', 'Entrada', 'aros-cebolla', 'Orden dorada y crujiente', '🧅'));
    pushAddon(createCustomizerAddon('extra-queso', 'Extra', 'porcion-extra', 'Complemento de queso derretido', '🧀', 'queso-gratinado', 'Extra: Queso gratinado'));
  }

  // Ensure a drink is present for food items if not already included
  if (item.categoryId !== 'bebidas' && !candidates.some((c) => c.kind === 'Bebida')) {
    pushAddon(createCustomizerAddon('fallback-jamaica', 'Bebida', 'agua-jamaica', 'Agua fresca natural bien helada', '🌺'));
  }

  const trimmed = candidates.slice(0, 4);
  const primaryRecommendation = trimmed.find((c) => c.isRecommended) || trimmed[0] || null;
  const addons = primaryRecommendation
    ? trimmed.filter((c) => c.key !== primaryRecommendation.key)
    : trimmed;

  return { primaryRecommendation, addons };
}
