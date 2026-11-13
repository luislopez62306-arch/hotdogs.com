import { DishRatingSummary, DishReview } from '../types';

const STORAGE_KEY = 'el_carballito_dish_ratings';

type StarBucket = 1 | 2 | 3 | 4 | 5;
type Distribution = Record<StarBucket, number>;

const FEATURED_DISTRIBUTIONS: Record<string, Distribution> = {
  'hd-especial': { 5: 39, 4: 6, 3: 1, 2: 0, 1: 0 },
  'hd-mar-y-tierra': { 5: 34, 4: 4, 3: 1, 2: 0, 1: 0 },
  'hd-ranchero-especial': { 5: 25, 4: 4, 3: 1, 2: 0, 1: 0 },
  'hd-boneless': { 5: 28, 4: 5, 3: 1, 2: 0, 1: 0 },
  'hd-embarazado': { 5: 22, 4: 5, 3: 1, 2: 0, 1: 0 },
  'hd-camaron': { 5: 21, 4: 4, 3: 1, 2: 0, 1: 0 },
  'hd-asada': { 5: 24, 4: 5, 3: 1, 2: 0, 1: 0 },
  'torta-mar-y-tierra': { 5: 23, 4: 4, 3: 1, 2: 0, 1: 0 },
  'torta-asada': { 5: 21, 4: 5, 3: 1, 2: 0, 1: 0 },
  'sc-boneless': { 5: 30, 4: 3, 3: 1, 2: 0, 1: 0 },
  'sc-especiales': { 5: 22, 4: 4, 3: 1, 2: 0, 1: 0 },
  'sp-boneless': { 5: 24, 4: 4, 3: 1, 2: 0, 1: 0 },
  'sp-especiales': { 5: 19, 4: 5, 3: 1, 2: 0, 1: 0 },
  'bl-sazonadas': { 5: 23, 4: 4, 3: 1, 2: 0, 1: 0 },
  'alitas-sazonadas': { 5: 21, 4: 5, 3: 1, 2: 0, 1: 0 },
  'agua-cebada': { 5: 28, 4: 3, 3: 0, 2: 0, 1: 0 },
  'limonada-fresa': { 5: 20, 4: 3, 3: 1, 2: 0, 1: 0 },
};

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getBaseDistribution(menuItemId: string): Distribution {
  if (FEATURED_DISTRIBUTIONS[menuItemId]) {
    return { ...FEATURED_DISTRIBUTIONS[menuItemId] };
  }

  const h = hashString(menuItemId);
  const five = 10 + (h % 14); // 10..23
  const four = 2 + ((h >>> 4) % 5); // 2..6
  const three = (h >>> 8) % 2; // 0..1
  return {
    5: five,
    4: four,
    3: three,
    2: 0,
    1: 0,
  };
}

export function loadUserDishRatings(): Record<string, DishReview> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const clean: Record<string, DishReview> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (
        val &&
        typeof val === 'object' &&
        typeof (val as DishReview).stars === 'number' &&
        (val as DishReview).stars >= 1 &&
        (val as DishReview).stars <= 5
      ) {
        clean[key] = val as DishReview;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function saveUserDishRatings(ratings: Record<string, DishReview>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch (e) {
    console.error('Error saving dish ratings', e);
  }
}

export function getDishRatingSummary(
  menuItemId: string,
  userRatings: Record<string, DishReview>
): DishRatingSummary {
  const distribution = getBaseDistribution(menuItemId);
  const userReview = userRatings[menuItemId];

  if (userReview) {
    const bucket = Math.min(5, Math.max(1, Math.round(userReview.stars))) as StarBucket;
    distribution[bucket] = (distribution[bucket] || 0) + 1;
  }

  const totalCount =
    distribution[5] +
    distribution[4] +
    distribution[3] +
    distribution[2] +
    distribution[1];

  const weightedSum =
    distribution[5] * 5 +
    distribution[4] * 4 +
    distribution[3] * 3 +
    distribution[2] * 2 +
    distribution[1] * 1;

  const average = totalCount > 0 ? Math.round((weightedSum / totalCount) * 10) / 10 : 0;

  return {
    average,
    totalCount,
    distribution,
    userReview,
  };
}

export function formatRatingCountLabel(count: number): string {
  return count === 1 ? '1 calificación' : `${count} calificaciones`;
}
