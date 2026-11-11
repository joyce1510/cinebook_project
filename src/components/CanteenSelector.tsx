import React from 'react';
import { CanteenItem } from '../types';
import { CANTEEN_MENU } from '../data/offers';
import { Popcorn, Plus, Minus, CheckCircle2, Sparkles } from 'lucide-react';

interface CanteenSelectorProps {
  selectedItems: Record<string, number>;
  onUpdateQuantity: (item: CanteenItem, delta: number) => void;
  onClearCanteen?: () => void;
}

export const CanteenSelector: React.FC<CanteenSelectorProps> = ({
  selectedItems,
  onUpdateQuantity,
  onClearCanteen
}) => {
  // Compute total
  const canteenTotal = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = CANTEEN_MENU.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const targetAmount = 300;
  const isRewardUnlocked = canteenTotal >= targetAmount;
  const progressPercent = Math.min(100, Math.round((canteenTotal / targetAmount) * 100));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Popcorn className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Cinema Canteen & Snacks</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-normal">
                Optional
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Fresh hot popcorn, gourmet nachos & fountain beverages
            </p>
          </div>
        </div>

        {canteenTotal > 0 && onClearCanteen && (
          <button
            onClick={onClearCanteen}
            className="text-xs text-zinc-400 hover:text-amber-400 underline self-start sm:self-auto cursor-pointer"
          >
            Clear snacks
          </button>
        )}
      </div>

      {/* Canteen Reward Milestone Banner */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          isRewardUnlocked
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
            : 'bg-zinc-950/70 border-zinc-800 text-zinc-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <div className="flex items-center gap-1.5">
            {isRewardUnlocked ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">
                  🎉 FREE POPCORN COUPON UNLOCKED!
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Canteen Reward Progress:</span>
                <span className="text-amber-400 font-bold">
                  ₹{canteenTotal} / ₹{targetAmount}
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {isRewardUnlocked
              ? 'Unlocked!'
              : `Add ₹${targetAmount - canteenTotal} to unlock`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isRewardUnlocked
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1.5">
          <span>Spend ₹300 or more in Canteen</span>
          <span className="font-semibold text-amber-300">
            Reward: Free Popcorn Voucher on Next Show 🍿
          </span>
        </div>
      </div>

      {/* Canteen Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CANTEEN_MENU.map((item) => {
          const count = selectedItems[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                count > 0
                  ? 'bg-zinc-950 border-amber-500/40 shadow-sm'
                  : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg leading-none" role="img" aria-label={item.name}>
                      {item.imageEmoji}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.name}
                    </h4>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 tabular-nums shrink-0">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="pt-2.5 mt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {count > 0 ? `Subtotal: ₹${count * item.price}` : item.category}
                </span>

                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item, -1)}
                      className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}

                  {count > 0 && (
                    <span className="text-xs font-bold text-white tabular-nums w-4 text-center">
                      {count}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item, 1)}
                    className={`h-6 px-2 rounded-md font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                      count > 0
                        ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700'
                    }`}
                    title="Add item"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{count === 0 ? 'Add' : ''}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
