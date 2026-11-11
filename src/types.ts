export type Language = 'Tamil' | 'Telugu' | 'English';

export type TicketCategory = 'Premium' | 'Regular';

export interface Movie {
  id: string;
  title: string;
  subtitle?: string;
  languages: string[];
  displayLanguage: string;
  genres: string[];
  duration: string;
  certificate: 'U' | 'U/A' | 'A';
  rating: number;
  votes: string;
  releaseYear: number;
  synopsis: string;
  cast: string[];
  director: string;
  musicDirector?: string;
  accentColor: string;
  bgGradient: string;
  accentBadgeColor: string;
  themeSymbol: string;
  posterUrl?: string;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  screen: string;
  soundSystem: string;
  shows: string[];
}

export interface Seat {
  id: string; // e.g. "A5"
  row: string;
  number: number;
  category: TicketCategory;
  price: number;
  isBooked: boolean;
}

export interface CanteenItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Snacks' | 'Beverages' | 'Combos';
  price: number;
  description: string;
  imageEmoji: string;
}

export interface AppliedOffer {
  code: string;
  title: string;
  type: 'coupon' | 'partner_card';
  discountAmount: number;
  description: string;
}

export interface UnlockedReward {
  id: string;
  title: string;
  badge: string;
  couponCode: string;
  description: string;
  category: 'dinner' | 'popcorn' | 'fashion';
}

export interface Booking {
  id: string;
  movie: Movie;
  theatre: Theatre;
  date: string;
  time: string;
  seats: string[];
  categoryBreakdown: {
    category: TicketCategory;
    count: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  convenienceFee: number;
  gst: number;
  totalAmount: number;
  bookedAt: string;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  canteenItems?: { item: CanteenItem; count: number }[];
  canteenTotal?: number;
  appliedOffer?: AppliedOffer;
  unlockedRewards?: UnlockedReward[];
  isWatched?: boolean;
  rating?: number;
  review?: string;
  ratedAt?: string;
  watchedAt?: string;
  verificationHash?: string;
  verificationToken?: string;
}

export interface TicketVerificationResult {
  valid: boolean;
  status: 'confirmed' | 'cancelled' | 'checked_in' | 'invalid' | 'rejected';
  bookingId?: string;
  movieTitle?: string;
  theatreName?: string;
  screen?: string;
  date?: string;
  time?: string;
  seats?: string[];
  totalAmount?: number;
  bookedAt?: string;
  message?: string;
  error?: string;
  verificationHash?: string;
}

export type CanteenFoodCategory = 'All' | 'Combos' | 'Snacks' | 'Drinks' | 'Pizza' | 'Burger';

export interface SmartCombo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  originalPrice: number;
  comboPrice: number;
  savings: number;
  badge?: string;
  imageUrl: string;
  includedItems: string[];
  popular?: boolean;
}

export interface CanteenFoodItem {
  id: string;
  name: string;
  category: 'Combos' | 'Snacks' | 'Drinks' | 'Pizza' | 'Burger';
  price: number;
  imageUrl: string;
  description: string;
  popular?: boolean;
  savings?: number;
  originalPrice?: number;
}

export interface CanteenCartItem {
  food: CanteenFoodItem;
  quantity: number;
}

export interface CanteenOrder {
  id: string; // e.g. "FD-849201"
  items: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  totalAmount: number;
  status: 'Preparing' | 'Ready' | 'Delivered';
  estimatedTime: string;
  orderedAt: string;
  pickupCounter: string;
}

export type OnboardingStatus = 'unseen' | 'completed' | 'skipped';

export type AppView = 'welcome' | 'home' | 'movies' | 'watchlist' | 'bookings' | 'canteen' | 'verify';

export interface TourStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  highlightSelector?: string;
  viewRequired?: 'welcome' | 'home' | 'movies' | 'watchlist' | 'bookings' | 'canteen';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionTip?: string;
}

