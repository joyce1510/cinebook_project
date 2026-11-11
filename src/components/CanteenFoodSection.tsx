import React, { useState } from 'react';
import { CanteenFoodCategory, CanteenFoodItem, CanteenCartItem, CanteenOrder } from '../types';
import { CANTEEN_FOOD_MENU } from '../data/canteenMenu';
import {
  Utensils,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Filter,
  Bot
} from 'lucide-react';

interface CanteenFoodSectionProps {
  onOrderPlaced: (order: CanteenOrder) => void;
  onOpenCineBotHelp?: (query: string) => void;
}

const CATEGORIES: CanteenFoodCategory[] = ['All', 'Combos', 'Snacks', 'Drinks', 'Pizza', 'Burger'];

export const CanteenFoodSection: React.FC<CanteenFoodSectionProps> = ({
  onOrderPlaced,
  onOpenCineBotHelp
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CanteenFoodCategory>('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Filter items by category
  const filteredItems = selectedCategory === 'All'
    ? CANTEEN_FOOD_MENU
    : CANTEEN_FOOD_MENU.filter((item) => item.category === selectedCategory);

  // Calculate cart quantities and totals
  const cartEntries: { item: CanteenFoodItem; quantity: number; subtotal: number }[] = [];
  let cartTotal = 0;
  let totalItemCount = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    if (qty > 0) {
      const item = CANTEEN_FOOD_MENU.find((f) => f.id === id);
      if (item) {
        cartEntries.push({
          item,
          quantity: qty,
          subtotal: item.price * qty
        });
        cartTotal += item.price * qty;
        totalItemCount += qty;
      }
    }
  });

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleAddToCart = (itemId: string) => {
    handleUpdateQuantity(itemId, 1);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart({});
    setIsCartModalOpen(false);
  };

  // Place order simulated checkout
  const handlePlaceOrder = () => {
    if (cartEntries.length === 0) return;

    setIsPlacingOrder(true);

    setTimeout(() => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newOrder: CanteenOrder = {
        id: `FD-${randomNum}`,
        items: cartEntries.map((entry) => ({
          id: entry.item.id,
          name: entry.item.name,
          category: entry.item.category,
          price: entry.item.price,
          quantity: entry.quantity,
          imageUrl: entry.item.imageUrl
        })),
        totalAmount: cartTotal,
        status: 'Preparing',
        estimatedTime: '10 - 15 mins',
        orderedAt: new Date().toISOString(),
        pickupCounter: 'Express Counter 2'
      };

      // Reset cart and loading
      setCart({});
      setIsPlacingOrder(false);
      setIsCartModalOpen(false);

      // Trigger callback to save and open confirmation
      onOrderPlaced(newOrder);
    }, 700);
  };

  return (
    <section id="canteen" data-tour="canteen-section" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="text-base">🍿</span>
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              CineBook Concessions
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Canteen Food Ordering
            </h2>
            {onOpenCineBotHelp && (
              <button
                type="button"
                onClick={() => onOpenCineBotHelp("Want to explore our combos? What are the best food deals?")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 text-xs font-medium transition-all cursor-pointer"
                title="Ask CineBot about food combos"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Want to explore our combos? Ask CineBot</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Order gourmet cinema snacks, sizzling stone pizzas, crispy burgers & chilled fountain sodas delivered hot to your seat or ready at the express counter.
          </p>
        </div>

        {/* View Cart Button (when items are added) */}
        {totalItemCount > 0 && (
          <button
            onClick={() => setIsCartModalOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer self-start md:self-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Canteen Cart</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-950 text-amber-400 text-[11px] font-mono font-extrabold">
              {totalItemCount}
            </span>
            <span className="font-mono font-extrabold">
              · ₹{cartTotal}
            </span>
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{cat}</span>
              {cat === 'All' ? (
                <span className="text-[10px] opacity-75 font-mono">({CANTEEN_FOOD_MENU.length})</span>
              ) : (
                <span className="text-[10px] opacity-75 font-mono">
                  ({CANTEEN_FOOD_MENU.filter((m) => m.category === cat).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const quantity = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group ${
                quantity > 0
                  ? 'border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              <div>
                {/* Food Image with Category Badge */}
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wide bg-zinc-950/80 backdrop-blur-sm border border-zinc-700/80 text-zinc-300">
                    {item.category}
                  </span>

                  <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                    {item.savings && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono bg-emerald-500 text-zinc-950 shadow-md">
                        Save ₹{item.savings}
                      </span>
                    )}
                    {item.popular && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-amber-500 text-zinc-950 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                  </div>

                  {/* Price Tag in Image */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-zinc-950/90 backdrop-blur-sm border border-amber-500/40 text-amber-400 font-extrabold text-sm tabular-nums flex items-center gap-1.5">
                    {item.originalPrice && (
                      <span className="text-[11px] text-zinc-500 line-through font-normal">
                        ₹{item.originalPrice}
                      </span>
                    )}
                    <span>₹{item.price}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Add to Cart */}
              <div className="p-4 pt-0">
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item.id)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700 hover:border-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-zinc-950 border border-amber-500/40 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono font-bold text-white tabular-nums">
                        {quantity}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        (₹{quantity * item.price})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center justify-center transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar (shows if items > 0) */}
      {totalItemCount > 0 && !isCartModalOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-3 bg-zinc-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in Canteen Cart
                </div>
                <div className="text-xs font-extrabold text-amber-400 font-mono">
                  Total: ₹{cartTotal.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Canteen Cart Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Your Canteen Cart
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 font-mono font-bold">
                  {totalItemCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {cartEntries.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                )}
                <button
                  onClick={() => setIsCartModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {cartEntries.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-200">Your cart is empty</h4>
                  <p className="text-xs text-zinc-400">
                    Add popcorn, burgers, pizzas or cold beverages from the menu!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartEntries.map(({ item, quantity, subtotal }) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-zinc-950/90 rounded-2xl border border-zinc-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            ₹{item.price} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-amber-400 font-mono tabular-nums w-12 text-right">
                          ₹{subtotal}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Subtotal summary */}
                  <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Food Items Subtotal</span>
                      <span className="text-zinc-200 tabular-nums font-mono font-semibold">
                        ₹{cartTotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Express Food Prep Fee</span>
                      <span className="text-emerald-400 font-medium">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                      <span className="font-bold text-white text-sm">Total Amount</span>
                      <span className="text-xl font-extrabold text-amber-400 tabular-nums">
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Place Order Button */}
            {cartEntries.length > 0 && (
              <div className="px-6 py-4 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCartModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>

                <button
                  type="button"
                  disabled={isPlacingOrder}
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Place Order (₹{cartTotal.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
