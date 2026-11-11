import React from 'react';
import { OffersSection } from './OffersSection';
import { X, Sparkles, Gift } from 'lucide-react';

interface OffersModalProps {
  onClose: () => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                CineBook Rewards & Offers
              </h3>
              <p className="text-xs text-zinc-400">
                Exclusive partner benefits, dining vouchers & canteen perks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                Save & Earn With Every Show
              </span>
              <h2 className="text-lg font-extrabold text-white">
                Unlock Unrivaled Movie Perks
              </h2>
              <p className="text-xs text-zinc-300 max-w-md">
                Group reservations unlock free dinners, canteen spending unlocks free popcorn, and our partner card saves ₹50 instantly.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300">Code:</span>
              <span className="text-amber-400 font-bold">CINE20</span>
              <span className="text-zinc-500">(20% OFF)</span>
            </div>
          </div>

          {/* Offers Grid Display */}
          <OffersSection />

          {/* Terms & Guidelines */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-1.5">
            <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
              Offers & Rewards Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Only ONE discount coupon can be applied per booking transaction.</li>
              <li>Group Booking free dinner voucher unlocks automatically upon selecting 5 or more seats.</li>
              <li>Canteen reward unlocks immediately when canteen snacks total reaches ₹300 or above.</li>
              <li>Partner Card flat ₹50 discount applies when selecting &apos;Partner Card&apos; at checkout.</li>
              <li>All unlocked coupon codes will be printed on your digital e-ticket pass.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950/90 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
