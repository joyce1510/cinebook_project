import React, { useState, useMemo, useEffect } from 'react';
import { Movie, Theatre, TicketCategory, Booking, AppliedOffer, CanteenItem, UnlockedReward } from '../types';
import { validateCouponCode } from '../data/offers';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Tag,
  Popcorn,
  Gift,
  BadgePercent,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface PaymentModalProps {
  movie: Movie;
  theatre: Theatre;
  dateStr: string;
  timeStr: string;
  selectedSeats: string[];
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
  canteenItems?: { item: CanteenItem; count: number }[];
  canteenTotal?: number;
  initialAppliedOffer?: AppliedOffer | null;
  unlockedRewards?: UnlockedReward[];
  holdToken?: string;
  expiresAt?: number;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  movie,
  theatre,
  dateStr,
  timeStr,
  selectedSeats,
  categoryBreakdown,
  subtotal,
  convenienceFee,
  gst,
  totalAmount,
  canteenItems = [],
  canteenTotal = 0,
  initialAppliedOffer = null,
  unlockedRewards = [],
  holdToken,
  expiresAt,
  onClose,
  onPaymentSuccess
}) => {
  const [method, setMethod] = useState<'upi' | 'partner_card' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('demo.student@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [partnerCardNumber, setPartnerCardNumber] = useState('6071 •••• •••• 4429');
  const [cardHolder, setCardHolder] = useState('Joyce S');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [customerName, setCustomerName] = useState('Joyce S');
  const [customerEmail, setCustomerEmail] = useState('joyce.cse@college.edu');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 23456');

  // Coupon state: Only ONE discount coupon can be applied per booking
  const [activeOffer, setActiveOffer] = useState<AppliedOffer | null>(initialAppliedOffer);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Reservation hold countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (expiresAt) {
      return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    }
    return 300; // 5 mins fallback
  });

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const banks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'];

  // Safely release hold on user cancellation
  const handleCancelAndClose = () => {
    if (holdToken) {
      fetch('/api/bookings/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdToken })
      }).catch(() => {});
    }
    onClose();
  };

  // Switch payment method with automatic Partner Card discount handling
  const handleSelectMethod = (newMethod: 'upi' | 'partner_card' | 'card' | 'netbanking') => {
    setMethod(newMethod);
    setCouponError(null);

    if (newMethod === 'partner_card') {
      // Apply Partner Card ₹50 discount (replacing any other coupon as only ONE coupon allowed)
      setActiveOffer({
        code: 'PARTNER50',
        title: 'Partner Card Offer',
        type: 'partner_card',
        discountAmount: 50,
        description: 'Flat ₹50 OFF with CineBook Partner Card'
      });
    } else if (method === 'partner_card' && activeOffer?.type === 'partner_card') {
      // Revert to initial offer if returning from partner_card
      setActiveOffer(initialAppliedOffer);
    }
  };

  // Manual coupon entry inside modal
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const result = validateCouponCode(couponInput, subtotal);
    if (result.valid && result.offer) {
      setActiveOffer(result.offer);
      setCouponInput('');
      // If was partner_card, switch method to general card to reflect coupon
      if (method === 'partner_card') {
        setMethod('card');
      }
    } else {
      setCouponError(result.error || 'Invalid coupon.');
    }
  };

  // Calculated totals
  const currentDiscount = activeOffer ? activeOffer.discountAmount : 0;
  const currentTotal = Math.max(0, subtotal + canteenTotal - currentDiscount) + convenienceFee + gst;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (secondsRemaining <= 0) {
      setPaymentError('Seat reservation hold has expired. The reserved seats have been returned to the available pool. Please return to seat selection.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Connecting to simulated payment gateway...');

    // Generate clean unique booking ID
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `CB-${movie.id.substring(0, 3).toUpperCase()}-${randomCode}`;

    let methodLabel = '';
    if (method === 'upi') {
      methodLabel = `UPI (${upiId})`;
    } else if (method === 'partner_card') {
      methodLabel = `Partner Card (•• 4429 · ₹50 OFF)`;
    } else if (method === 'card') {
      methodLabel = `Credit Card (${cardNumber.slice(-4)})`;
    } else {
      methodLabel = `Net Banking (${selectedBank})`;
    }

    const draftBooking: Booking = {
      id: bookingId,
      movie,
      theatre,
      date: dateStr,
      time: timeStr,
      seats: [...selectedSeats].sort(),
      categoryBreakdown,
      subtotal,
      convenienceFee,
      gst,
      totalAmount: currentTotal,
      bookedAt: new Date().toISOString(),
      paymentMethod: `${methodLabel} · Demo Gateway`,
      customerName: customerName.trim() || 'Guest Cinephile',
      customerEmail: customerEmail.trim() || 'guest@cinebook.in',
      customerPhone: customerPhone.trim() || '+91 98765 43210',
      canteenItems: canteenItems.length > 0 ? canteenItems : undefined,
      canteenTotal: canteenTotal > 0 ? canteenTotal : undefined,
      appliedOffer: activeOffer ? { ...activeOffer, discountAmount: currentDiscount } : undefined,
      unlockedRewards: unlockedRewards.length > 0 ? unlockedRewards : undefined
    };

    try {
      setProcessingStep('Validating server seat reservation & committing booking...');
      const response = await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdToken,
          booking: draftBooking
        })
      });

      if (!response.ok) {
        setIsProcessing(false);
        const errData = await response.json().catch(() => ({}));
        setPaymentError(errData.error || 'Server validation failed. Seat reservation could not be confirmed.');
        return;
      }

      const confirmedData = await response.json();
      setIsProcessing(false);
      onPaymentSuccess(confirmedData.booking || draftBooking);
    } catch {
      setIsProcessing(false);
      // STRICT REQUIREMENT 1: Prevent client-side booking confirmation when the server is unavailable
      setPaymentError('Booking server is currently unreachable. To protect against duplicate bookings, confirmation cannot proceed without server validation.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              CineBook Secure Checkout
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 border ${
                secondsRemaining <= 60
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
              title="Time remaining on temporary server seat hold"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor(secondsRemaining / 60)}:
                {String(secondsRemaining % 60).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={handleCancelAndClose}
              disabled={isProcessing}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Test Mode / Simulated Payment Notice */}
        <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex flex-wrap items-center justify-between text-[11px] text-amber-300/90 gap-2">
          <span className="font-semibold">🛡️ Test Mode · Simulated Payment Gateway</span>
          <span className="text-zinc-400">Zero real money charged · Verified by server seat reservation</span>
        </div>

        {isProcessing ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Processing Your Payment</h4>
            <p className="text-sm text-amber-400 font-medium animate-pulse">{processingStep}</p>
            <p className="text-xs text-zinc-500 mt-4">
              Please do not close or refresh this window.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-6">
            {/* Payment Error Alert */}
            {paymentError && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2.5 shadow-lg">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-rose-300">Confirmation Blocked:</span>
                  <span>{paymentError}</span>
                </div>
              </div>
            )}
            {/* Quick Order Summary Pill */}
            <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">{movie.title}</span>
                <span className="text-zinc-400">
                  {theatre.name} · {dateStr} at {timeStr}
                </span>
                <div className="text-amber-400 font-medium mt-0.5">
                  Seats: {selectedSeats.join(', ')} ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'})
                  {canteenTotal > 0 && ` · Snacks: ₹${canteenTotal}`}
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">Total Payable</span>
                <span className="text-lg font-extrabold text-white tabular-nums">
                  ₹{currentTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Attendee Contact Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Email ID</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="name@email.com"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="+91..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Payment Mode
                </span>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3" /> Partner Card saves ₹50
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center sm:items-start gap-1.5 transition-all cursor-pointer ${
                    method === 'upi'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 ${method === 'upi' ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">UPI / QR</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:block">GPay, PhonePe</span>
                </button>

                {/* PARTNER CARD OPTION */}
                <button
                  type="button"
                  onClick={() => handleSelectMethod('partner_card')}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center sm:items-start gap-1.5 transition-all cursor-pointer relative overflow-hidden ${
                    method === 'partner_card'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/15 ring-1 ring-amber-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500/40'
                  }`}
                >
                  <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-zinc-950">
                    -₹50
                  </div>
                  <CreditCard className={`w-5 h-5 ${method === 'partner_card' ? 'text-amber-400' : 'text-amber-500/80'}`} />
                  <span className="text-xs font-bold text-amber-300">Partner Card</span>
                  <span className="text-[10px] text-amber-400/80 hidden sm:block">Flat ₹50 OFF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectMethod('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center sm:items-start gap-1.5 transition-all cursor-pointer ${
                    method === 'card'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">Other Cards</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:block">Visa, Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectMethod('netbanking')}
                  className={`p-3 rounded-xl border text-left flex flex-col items-center sm:items-start gap-1.5 transition-all cursor-pointer ${
                    method === 'netbanking'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Building className={`w-5 h-5 ${method === 'netbanking' ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">Net Banking</span>
                  <span className="text-[10px] text-zinc-500 hidden sm:block">All Banks</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            <div className="p-4 bg-zinc-950/90 rounded-xl border border-zinc-800/80">
              {method === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-300 font-medium">Virtual Payment Address (UPI ID)</label>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Auto-Verified
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="username@bank"
                  />
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                    <span className="text-zinc-500">Popular handles:</span>
                    <button
                      type="button"
                      onClick={() => setUpiId('joyce.cse@okaxis')}
                      className="hover:text-amber-400 underline cursor-pointer"
                    >
                      @okaxis
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiId('joyce.cse@okhdfcbank')}
                      className="hover:text-amber-400 underline cursor-pointer"
                    >
                      @okhdfcbank
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiId('joyce.cse@ybl')}
                      className="hover:text-amber-400 underline cursor-pointer"
                    >
                      @ybl
                    </button>
                  </div>
                </div>
              )}

              {method === 'partner_card' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">
                        CineBook Co-Branded Partner Card
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ₹50 OFF APPLIED
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-1">
                      Partner Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerCardNumber}
                      onChange={(e) => setPartnerCardNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-300 font-medium block mb-1">Valid Thru</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-300 font-medium block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-300 font-medium block mb-1">Valid Thru</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-300 font-medium block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-3">
                  <label className="text-xs text-zinc-300 font-medium block">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {banks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* In-Modal Coupon Entry (Rule: Only ONE discount coupon can be applied per booking) */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Have a Coupon Code?
                </span>
                <span className="text-[10px] text-zinc-500">1 discount per booking</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  placeholder="Try code CINE20..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-bold border border-zinc-700 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-400">{couponError}</p>
              )}

              {activeOffer && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/30">
                  <span className="font-semibold">
                    ✓ {activeOffer.title} ({activeOffer.code})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">-₹{currentDiscount}</span>
                    <button
                      type="button"
                      onClick={() => setActiveOffer(null)}
                      className="text-zinc-400 hover:text-white"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price breakdown pill */}
            <div className="pt-2 text-xs space-y-1.5 text-zinc-400 border-t border-zinc-800">
              <div className="flex justify-between">
                <span>Tickets Subtotal</span>
                <span className="text-zinc-200 tabular-nums">₹{subtotal.toLocaleString()}</span>
              </div>
              {canteenTotal > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Canteen Snacks</span>
                  <span className="tabular-nums font-semibold">+₹{canteenTotal.toLocaleString()}</span>
                </div>
              )}
              {currentDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount ({activeOffer?.code})</span>
                  <span className="tabular-nums font-bold">-₹{currentDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Convenience Fee (10%) + 18% GST</span>
                <span className="text-zinc-200 tabular-nums">₹{(convenienceFee + gst).toLocaleString()}</span>
              </div>

              {/* Unlocked Rewards Reminder in Checkout */}
              {unlockedRewards.length > 0 && (
                <div className="py-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                  <span>Rewards Unlocked:</span>
                  <span className="font-bold">{unlockedRewards.map(r => r.badge).join(' · ')}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-zinc-800">
                <span>Grand Total</span>
                <span className="text-amber-400 tabular-nums text-lg font-extrabold">
                  ₹{currentTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelAndClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={secondsRemaining <= 0}
                className={`flex-[2] px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                  secondsRemaining > 0
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 hover:from-amber-400 hover:to-amber-300 active:scale-98 shadow-amber-500/20 cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
              >
                {secondsRemaining > 0 ? (
                  <>
                    <span>Authorize & Pay ₹{currentTotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>Hold Expired · Please Reselect</span>
                )}
              </button>
            </div>

            <div className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated 256-bit bank encrypted payment environment</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
