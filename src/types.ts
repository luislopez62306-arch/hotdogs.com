export type CategoryId = 
  | 'hot-dogs'
  | 'tortas'
  | 'salchipapas'
  | 'salchicarnes'
  | 'antojitos'
  | 'salchichas'
  | 'bebidas';

export type CategoryFilter = CategoryId | 'all' | 'favorites' | 'top-rated';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  badge?: string;
  bannerNotice?: string;
  description?: string;
}

export type VariantType = 'size' | 'preparation' | 'extra-choice';

export interface VariantOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export type SauceOption = 'BBQ' | 'Búfalo' | 'Mango Habanero';

export interface MenuItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  basePrice: number;
  description: string;
  image: string;
  badge?: string;
  includesFries?: boolean;
  variants?: {
    type: VariantType;
    label: string;
    options: VariantOption[];
    defaultOptionId: string;
  };
  hasSauces?: boolean;
  sauces?: SauceOption[];
}

export interface CartItem {
  cartItemId: string; // unique for item + variant + sauce + customNotes
  menuItemId: string;
  name: string;
  categoryId: CategoryId;
  selectedVariant?: VariantOption;
  selectedSauce?: SauceOption;
  customNotes?: string;
  pricePerUnit: number;
  quantity: number;
  image: string;
  includesFries?: boolean;
}

export type OrderModality = 'mesa' | 'llevar' | 'domicilio';
export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta';

export interface OrderDetails {
  modality: OrderModality;
  mesaNumber: string;
  customerName: string;
  deliveryAddress: {
    streetAndNumber: string;
    neighborhood: string;
    references: string;
  };
  paymentMethod: PaymentMethod;
  generalNotes: string;
}

export interface PastOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  modality: OrderModality;
}

export type FontPreset = 'moderna' | 'clasica';

export interface ExperienceRating {
  id: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface DishReview {
  id: string;
  menuItemId: string;
  stars: number;
  comment?: string;
  authorName?: string;
  createdAt: string;
}

export interface DishRatingSummary {
  average: number;
  totalCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  userReview?: DishReview;
}

