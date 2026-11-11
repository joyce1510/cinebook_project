import { CanteenFoodItem, SmartCombo } from '../types';

export const SMART_COMBOS: SmartCombo[] = [
  {
    id: 'combo-cinema-duo',
    name: 'Cinema Duo Combo',
    tagline: 'Popcorn + Chilled Drink',
    description: 'Freshly popped golden butter popcorn paired with a chilled fizzy Coca-Cola.',
    originalPrice: 130,
    comboPrice: 110,
    savings: 20,
    badge: 'Popular Choice',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
    includedItems: ['Butter Popcorn', 'Coca-Cola (500ml)'],
    popular: true
  },
  {
    id: 'combo-blockbuster-pair',
    name: 'Blockbuster Pair Combo',
    tagline: 'Popcorn + 2 Cold Drinks',
    description: 'Generous tub of butter popcorn accompanied by two ice-cold refreshing soft drinks.',
    originalPrice: 180,
    comboPrice: 150,
    savings: 30,
    badge: 'Best For Couples',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    includedItems: ['Butter Popcorn', '2x Coca-Cola / Sprite'],
    popular: true
  },
  {
    id: 'combo-family-snack',
    name: 'Family Snack Feast',
    tagline: 'Popcorn + Fries + Sandwich + 2 Drinks',
    description: 'The ultimate group celebration with butter popcorn, crispy fries, cheese sandwich & 2 soft drinks.',
    originalPrice: 310,
    comboPrice: 250,
    savings: 60,
    badge: 'Super Saver',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
    includedItems: ['Butter Popcorn', 'French Fries', 'Toasted Sandwich', '2x Soft Drinks'],
    popular: true
  },
  {
    id: 'combo-pizza-binge',
    name: 'Pizza & Chill Combo',
    tagline: 'Veg Pizza + Fries + Drink',
    description: 'Stone-baked thin-crust cheese pizza, seasoned crispy French fries and chilled soda.',
    originalPrice: 240,
    comboPrice: 200,
    savings: 40,
    badge: 'Hot Meal Deal',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    includedItems: ['Stone-Baked Veg Pizza', 'French Fries', 'Chilled Drink'],
    popular: false
  },
  {
    id: 'combo-burger-crunch',
    name: 'Crispy Burger Feast',
    tagline: 'Chicken Burger + Fries + Drink',
    description: 'Crispy chicken fillet burger topped with cheddar, served with seasoned fries and Sprite.',
    originalPrice: 240,
    comboPrice: 200,
    savings: 40,
    badge: 'Fan Favourite',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    includedItems: ['Crispy Chicken Burger', 'French Fries', 'Sprite'],
    popular: false
  }
];

export const CANTEEN_FOOD_MENU: CanteenFoodItem[] = [
  // Smart Food Combos
  ...SMART_COMBOS.map((combo) => ({
    id: combo.id,
    name: combo.name,
    category: 'Combos' as const,
    price: combo.comboPrice,
    originalPrice: combo.originalPrice,
    savings: combo.savings,
    imageUrl: combo.imageUrl,
    description: `${combo.description} (Includes: ${combo.includedItems.join(', ')})`,
    popular: combo.popular
  })),

  // Snacks
  {
    id: 'popcorn',
    name: 'Popcorn',
    category: 'Snacks',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly popped golden corn kernels tossed with melted butter and sea salt.',
    popular: true
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    category: 'Snacks',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy golden potato fries served with tangy ketchup and seasoned salt.',
    popular: true
  },
  {
    id: 'samosa',
    name: 'Samosa',
    category: 'Snacks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional spiced potato and peas filled flaky golden fried pastry.',
    popular: false
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    category: 'Snacks',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly toasted bread loaded with crisp cucumber, tomato, mint chutney and cheese.',
    popular: false
  },

  // Drinks
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    category: 'Drinks',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    description: 'Chilled refreshing classic Coca-Cola served ice-cold with fizzy bubbles.',
    popular: true
  },
  {
    id: 'sprite',
    name: 'Sprite',
    category: 'Drinks',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp lemon-lime sparkling fountain drink for a cool refreshment.',
    popular: false
  },
  {
    id: 'fresh-lime',
    name: 'Fresh Lime',
    category: 'Drinks',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly squeezed natural lime cooler with hint of crushed mint and chilled soda.',
    popular: false
  },
  {
    id: 'water-bottle',
    name: 'Water Bottle',
    category: 'Drinks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&auto=format&fit=crop&q=80',
    description: 'Packaged mineral water bottle (1 Litre, chilled or normal).',
    popular: false
  },

  // Pizza
  {
    id: 'veg-pizza',
    name: 'Veg Pizza',
    category: 'Pizza',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    description: 'Stone-baked thin crust pizza topped with mozzarella, bell peppers, corn and olives.',
    popular: true
  },
  {
    id: 'chicken-pizza',
    name: 'Chicken Pizza',
    category: 'Pizza',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    description: 'Loaded with barbecue grilled chicken chunks, smoked cheese and spicy marinara.',
    popular: true
  },

  // Burger
  {
    id: 'veg-burger',
    name: 'Veg Burger',
    category: 'Burger',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy herb potato patty nestled with lettuce, tomato, cheese and house mayo in a brioche bun.',
    popular: false
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    category: 'Burger',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Juicy crispy chicken fillet topped with melted cheddar, pickled gherkins and chipotle sauce.',
    popular: true
  }
];
