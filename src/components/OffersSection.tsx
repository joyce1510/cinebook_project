import React, { useState } from 'react';
import { CINEBOOK_OFFERS } from '../data/offers';
import { AppliedOffer } from '../types';
import { validateCouponCode } from '../data/offers';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  Tag,
  Copy,
  Check,
  CreditCard,
  AlertCircle,
  X
} from 'lucide-react';

interface OffersSectionProps {
  currentTicketCount?: number;
  canteenTotal?: number;
  ticketSubtotal?: number;
  appliedOffer?: AppliedOffer | null;
  onApplyOffer?: (offer: AppliedOffer) => void;
  onRemoveOffer?: () => void;
  isCompact?: boolean;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  currentTicketCount = 0,
  canteenTotal = 0,
  ticketSubtotal = 0,
  appliedOffer = null,
  onApplyOffer,
  onRemoveOffer,
  isCompact = false
}) => {
  const [manualCode, setManualCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyManualCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);

    if (!onApplyOffer) return;

    if (ticketSubtotal === 0) {
      setCouponError('Please select at least 1 seat before applying coupons.');
      return;
    }

    const result = validateCouponCode(manualCode, ticketSubtotal);
    if (!result.valid || !result.offer) {
      setCouponError(result.error || 'Invalid code.');
      return;
    }

    onApplyOffer(result.offer);
    setManualCode('');
  };

  const handleApplyQuickCode = (code: string) => {
    setCouponError(null);
    if (!onApplyOffer) return;
    if (ticketSubtotal === 0) {
      setCouponError('Please select seats before applying this coupon.');
      return;
    }

    const result = validateCouponCode(code, ticketSubtotal);
    if (result.valid && result.offer) {
      onApplyOffer(result.offer);
    } else {
      setCouponError(result.error || 'Could not apply coupon.');
    }
  };

  return (
    <div className={`space-y-4 ${isCompact ? '' : 'pt-2'}`}>
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>CineBook Rewards & Offers</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                Exclusive Deals
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Unlock free dining & popcorn rewards or apply instant partner discounts
            </p>
          </div>
        </div>

        {/* Applied Coupon Pill */}
        {appliedOffer && (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-300">
                {appliedOffer.code} Applied
              </span>{' '}
              <span className="text-emerald-400/90 font-mono">
                (-₹{appliedOffer.discountAmount})
              </span>
            </div>
            {onRemoveOffer && (
              <button
                type="button"
                onClick={onRemoveOffer}
                className="text-zinc-400 hover:text-white p-0.5 rounded-md hover:bg-emerald-900/50 transition-colors ml-1 cursor-pointer"
                title="Remove offer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Manual Coupon Input Form (for CINE20) */}
      {onApplyOffer && (
        <form
          onSubmit={handleApplyManualCoupon}
          className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value.toUpperCase());
                setCouponError(null);
              }}
              placeholder="Enter coupon code (e.g. CINE20)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white uppercase font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Apply Coupon
          </button>
        </form>
      )}

      {couponError && (
        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{couponError}</span>
        </div>
      )}

      {/* Offers Cards Grid */}
      <div
        className={`grid gap-3 ${
          isCompact
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {CINEBOOK_OFFERS.map((offer) => {
          // Determine status dynamically
          let isUnlocked = false;
          let progressInfo = '';

          if (offer.type === 'group') {
            isUnlocked = currentTicketCount >= 5;
            progressInfo = isUnlocked
              ? 'Unlocked!'
              : `${Math.max(0, 5 - currentTicketCount)} more ticket(s) needed`;
          } else if (offer.type === 'canteen') {
            isUnlocked = canteenTotal >= 300;
            progressInfo = isUnlocked
              ? 'Unlocked!'
              : `₹${Math.max(0, 300 - canteenTotal)} more spend needed`;
          } else if (offer.type === 'card') {
            isUnlocked = true;
            progressInfo = 'Available at Checkout';
          } else if (offer.type === 'fashion') {
            isUnlocked = true;
            progressInfo = 'Code: CINE20';
          }

          const isCurrentApplied =
            appliedOffer?.code === offer.couponCode ||
            (offer.type === 'card' && appliedOffer?.type === 'partner_card');

          return (
            <div
              key={offer.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isCurrentApplied
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : isUnlocked
                  ? 'bg-zinc-950/90 border-zinc-700/80 hover:border-amber-500/40'
                  : 'bg-zinc-950/50 border-zinc-800/80 opacity-85'
              }`}
            >
              {/* Top ambient highlight */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
                  isUnlocked ? 'bg-amber-500/10' : 'bg-transparent'
                }`}
              />

              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl leading-none" role="img" aria-label={offer.title}>
                    {offer.emoji}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold ${
                      isUnlocked
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Unlock className="w-2.5 h-2.5" /> Unlocked
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {offer.title}
                  </h4>
                  <div className="text-[11px] font-semibold text-amber-400 mt-0.5">
                    {offer.rewardText}
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Action / Requirement Footnote */}
              <div className="pt-3 mt-3 border-t border-zinc-800/80 relative z-10 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">{progressInfo}</span>

                {offer.type === 'fashion' && onApplyOffer && (
                  <button
                    type="button"
                    onClick={() => handleApplyQuickCode('CINE20')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      isCurrentApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                    }`}
                  >
                    {isCurrentApplied ? 'Applied' : 'Apply CINE20'}
                  </button>
                )}

                {offer.couponCode && offer.type !== 'fashion' && (
                  <button
                    type="button"
                    onClick={() => handleCopy(offer.couponCode!)}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white font-mono bg-zinc-900 border border-zinc-700 px-2 py-1 rounded cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode === offer.couponCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{offer.couponCode}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
