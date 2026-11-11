import React, { useState } from 'react';
import { CanteenOrder } from '../types';
import {
  CheckCircle2,
  X,
  Clock,
  MapPin,
  Popcorn,
  Utensils,
  Receipt,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

interface CanteenOrderConfirmationModalProps {
  order: CanteenOrder;
  onClose: () => void;
  onViewAllOrders?: () => void;
}

export const CanteenOrderConfirmationModal: React.FC<CanteenOrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewAllOrders
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Glowing aura */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍿</span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Order Confirmed!
              </h3>
              <p className="text-xs text-amber-400 font-mono">
                Order #{order.id}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 relative z-10 max-h-[75vh] overflow-y-auto">
          {/* Success Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Sent to Cinema Kitchen
              </h4>
              <p className="text-xs text-zinc-400">
                Your snacks & drinks are freshly being prepped for your show!
              </p>
            </div>
          </div>

          {/* Status & Estimated Time Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Order Status
              </span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {order.status}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                Kitchen in progress
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Est. Preparation Time
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{order.estimatedTime}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {order.pickupCounter}
              </span>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" /> Ordered Items ({order.items.length})
              </span>
              <button
                onClick={handleCopyOrderId}
                className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Copy Order ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied ID</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-zinc-950/80 rounded-2xl border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{item.name}</h5>
                      <span className="text-[10px] text-zinc-400">
                        ₹{item.price} × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-amber-400 tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Total Breakdown */}
          <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Items Subtotal</span>
              <span className="text-zinc-200 tabular-nums font-mono">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Packaging & Kitchen Service</span>
              <span className="text-emerald-400 font-medium">FREE</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="font-bold text-white text-sm">Total Paid</span>
              <span className="text-xl font-extrabold text-amber-400 tabular-nums">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pick-up instructions */}
          <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Show this token #{order.id} at <span className="text-white font-semibold">{order.pickupCounter}</span> or flash to theatre usher for in-seat delivery during the intermission.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-3">
          {onViewAllOrders ? (
            <button
              onClick={() => {
                onClose();
                onViewAllOrders();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              View Canteen Orders
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
