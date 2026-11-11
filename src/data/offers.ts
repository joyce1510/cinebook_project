import { CanteenItem, UnlockedReward, AppliedOffer } from '../types';

export const CANTEEN_MENU: CanteenItem[] = [
  {
    id: 'popcorn-caramel',
    name: 'Caramel Gold Popcorn Tub',
    category: 'Popcorn',
    price: 180,
    description: 'Slow-popped artisan kernels tossed in warm golden sea-salt caramel.',
    imageEmoji: '🍿'
  },
  {
    id: 'popcorn-cheese',
    name: 'Cheddar Cheese Popcorn (Large)',
    category: 'Popcorn',
    price: 160,
    description: 'Fresh warm popcorn tossed in gourmet sharp white cheddar dust.',
    imageEmoji: '🧀'
  },
  {
    id: 'nachos-deluxe',
    name: 'Crispy Tortilla Nachos & Warm Salsa',
    category: 'Snacks',
    price: 150,
    description: 'Crispy stone-ground corn chips served with jalapeño cheese dip and spicy salsa.',
    imageEmoji: '🌮'
  },
  {
    id: 'combo-cinema-duo',
    name: 'Cinema Duo Combo (Popcorn + Drink)',
    category: 'Combos',
    price: 110,
    description: 'Fresh butter popcorn tub with chilled Coca-Cola. Save ₹20 on combo!',
    imageEmoji: '🍿🥤'
  },
  {
    id: 'combo-blockbuster-pair',
    name: 'Blockbuster Pair Combo (Popcorn + 2 Drinks)',
    category: 'Combos',
    price: 150,
    description: 'Golden popcorn tub with two chilled soft drinks. Save ₹30 on pair combo!',
    imageEmoji: '🍿🥤🥤'
  },
  {
    id: 'combo-family-snack',
    name: 'Family Snack Feast (Popcorn + Fries + 2 Drinks + Sandwich)',
    category: 'Combos',
    price: 250,
    description: 'Full celebration combo with popcorn, crispy fries, sandwich and 2 drinks. Save ₹60!',
    imageEmoji: '🍿🍟🥪'
  },
  {
    id: 'duo-combo',
    name: 'Jumbo Blockbuster Combo',
    category: 'Combos',
    price: 320,
    description: '1 Jumbo Butter Popcorn Tub + 2 Large Fountain Sodas (Unlocks Popcorn Coupon!).',
    imageEmoji: '🥤'
  },
  {
    id: 'soda-fountain',
    name: 'Chilled Fountain Cola / Sprite (650ml)',
    category: 'Beverages',
    price: 90,
    description: 'Icy cold premium fountain soft drink served with lemon twist.',
    imageEmoji: '🥤'
  },
  {
    id: 'samosa-platter',
    name: 'Crispy Corn & Paneer Samosas (3 Pcs)',
    category: 'Snacks',
    price: 110,
    description: 'Flaky golden hand-made triangular pastries with mint & tamarind chutneys.',
    imageEmoji: '🥟'
  }
];

export interface OfferDefinition {
  id: string;
  emoji: string;
  title: string;
  badge: string;
  description: string;
  conditionDescription: string;
  rewardText: string;
  type: 'group' | 'card' | 'canteen' | 'fashion';
  couponCode?: string;
}

export const CINEBOOK_OFFERS: OfferDefinition[] = [
  {
    id: 'group-booking',
    emoji: '🎟️',
    title: 'Group Booking Reward',
    badge: 'Group Special',
    conditionDescription: 'Book 5 or more tickets in a single reservation',
    rewardText: 'FREE DINNER COUPON',
    description: 'Bring the squad! Reserve 5 or more seats to instantly unlock a complimentary dining voucher.',
    type: 'group',
    couponCode: 'DINNERFREE'
  },
  {
    id: 'partner-card',
    emoji: '💳',
    title: 'Partner Card Offer',
    badge: 'Card Discount',
    conditionDescription: 'Pay using CineBook Partner Card at checkout',
    rewardText: 'FLAT ₹50 OFF',
    description: 'Select the Partner Card option in payment methods to enjoy an instant ₹50 deduction on your bill.',
    type: 'card',
    couponCode: 'PARTNER50'
  },
  {
    id: 'canteen-reward',
    emoji: '🍿',
    title: 'Canteen Gourmet Reward',
    badge: 'F&B Perk',
    conditionDescription: 'Add ₹300 or more in cinema snacks & drinks',
    rewardText: 'FREE POPCORN COUPON',
    description: 'Spend ₹300 or more at our gourmet counter to earn a free large popcorn voucher for your next show.',
    type: 'canteen',
    couponCode: 'FREEPOPCORN'
  },
  {
    id: 'fashion-offer',
    emoji: '👗',
    title: 'Fashion Partner Offer',
    badge: 'Code: CINE20',
    conditionDescription: 'Enter promo code CINE20 during booking',
    rewardText: '20% OFF ON BOOKING',
    description: 'Enjoy 20% off on your booking plus an exclusive 20% partner fashion discount code.',
    type: 'fashion',
    couponCode: 'CINE20'
  }
];

/**
 * Checks unlocked rewards based on seats count and canteen spend
 */
export function evaluateUnlockedRewards(
  ticketCount: number,
  canteenTotal: number
): UnlockedReward[] {
  const rewards: UnlockedReward[] = [];

  // 1. Group Booking reward (5+ tickets)
  if (ticketCount >= 5) {
    rewards.push({
      id: 'reward-dinner',
      title: 'Free Gourmet Dinner Voucher',
      badge: '🎟️ FREE DINNER COUPON',
      couponCode: 'DINNERFREE-2026',
      description: 'Complimentary chef table dinner voucher for you & friend at partnered dining lounges.',
      category: 'dinner'
    });
  }

  // 3. Canteen reward (₹300+ in canteen)
  if (canteenTotal >= 300) {
    rewards.push({
      id: 'reward-popcorn',
      title: 'Free Jumbo Popcorn Coupon',
      badge: '🍿 FREE POPCORN COUPON',
      couponCode: 'POPCORN-FREE26',
      description: 'Complimentary Jumbo Caramel/Butter Popcorn Tub redeemable on your next visit.',
      category: 'popcorn'
    });
  }

  return rewards;
}

/**
 * Validates promo code CINE20
 */
export function validateCouponCode(
  rawCode: string,
  ticketSubtotal: number
): { valid: boolean; offer?: AppliedOffer; error?: string } {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: 'Please enter a coupon code.' };
  }

  if (code === 'CINE20') {
    const discount = Math.round(ticketSubtotal * 0.2);
    return {
      valid: true,
      offer: {
        code: 'CINE20',
        title: 'Fashion Partner 20% OFF',
        type: 'coupon',
        discountAmount: discount,
        description: '20% OFF on booking + Trends Fashion Voucher'
      }
    };
  }

  return {
    valid: false,
    error: 'Invalid coupon code. Try CINE20 for 20% off!'
  };
}
