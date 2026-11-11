import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Movie, Theatre, TicketCategory, Booking, AppliedOffer, CanteenItem, UnlockedReward } from '../types';
import { THEATRES, TICKET_PRICING, getShowDates, getInitialBookedSeats } from '../data/movies';
import { CANTEEN_MENU, evaluateUnlockedRewards, validateCouponCode } from '../data/offers';
import { SeatMap } from './SeatMap';
import { PosterArtwork } from './PosterArtwork';
import { CanteenSelector } from './CanteenSelector';
import { OffersSection } from './OffersSection';
import { SmartSeatModal } from './SmartSeatModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Film,
  Info,
  Popcorn,
  Gift,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Heart,
  Bot
} from 'lucide-react';

interface BookingViewProps {
  movie: Movie;
  onBack: () => void;
  onProceedToPayment: (bookingDetails: {
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
    appliedOffer?: AppliedOffer | null;
    unlockedRewards?: UnlockedReward[];
    holdToken?: string;
    expiresAt?: number;
  }) => void;
  existingBookings: Booking[];
  isWatchlisted?: boolean;
  onToggleWatchlist?: (movieId: string) => void;
  onOpenCineBotHelp?: (query: string) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  movie,
  onBack,
  onProceedToPayment,
  existingBookings,
  isWatchlisted = false,
  onToggleWatchlist,
  onOpenCineBotHelp
}) => {
  const dates = useMemo(() => getShowDates(), []);
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTheatre, setSelectedTheatre] = useState<Theatre>(THEATRES[0]);
  const [selectedTime, setSelectedTime] = useState<string>(THEATRES[0].shows[1] || THEATRES[0].shows[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Server-synchronized seat tracking & health
  const [serverBookedSeats, setServerBookedSeats] = useState<string[]>([]);
  const [serverHeldSeats, setServerHeldSeats] = useState<string[]>([]);
  const [serverStatus, setServerStatus] = useState<'connected' | 'offline' | 'checking'>('checking');
  const [isReserving, setIsReserving] = useState(false);

  // Canteen & Offers States
  const [selectedCanteenItems, setSelectedCanteenItems] = useState<Record<string, number>>({});
  const [appliedOffer, setAppliedOffer] = useState<AppliedOffer | null>(null);

  // Smart Seat Recommendation State
  const [isSmartSeatOpen, setIsSmartSeatOpen] = useState(false);
  const [recommendedSeats, setRecommendedSeats] = useState<string[]>([]);

  // Fetch live seat status from CineBook server
  const refreshSeatStatus = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        movieId: movie.id,
        theatreId: selectedTheatre.id,
        date: selectedDate.dateLabel,
        time: selectedTime
      });
      const res = await fetch(`/api/seats/status?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServerBookedSeats(data.bookedSeats || []);
        setServerHeldSeats(data.heldSeats || []);
        setServerStatus('connected');
      } else {
        setServerStatus('offline');
      }
    } catch {
      setServerStatus('offline');
    }
  }, [movie.id, selectedTheatre.id, selectedDate.dateLabel, selectedTime]);

  useEffect(() => {
    refreshSeatStatus();
    const interval = setInterval(refreshSeatStatus, 8000);
    return () => clearInterval(interval);
  }, [refreshSeatStatus]);

  // Compute booked seats dynamically incorporating static demo, local session, and server records
  const bookedSeats = useMemo(() => {
    // 1. Initial simulated booked seats
    const initial = getInitialBookedSeats(movie.id, selectedDate.id, selectedTime);
    
    // 2. Also incorporate any seats booked by the user in this session
    existingBookings.forEach((b) => {
      if (
        b.movie.id === movie.id &&
        b.date === selectedDate.dateLabel &&
        b.time === selectedTime &&
        b.theatre.id === selectedTheatre.id
      ) {
        b.seats.forEach((s) => initial.add(s));
      }
    });

    // 3. Incorporate permanently booked seats validated on the server
    serverBookedSeats.forEach((s) => initial.add(s));

    return initial;
  }, [movie.id, selectedDate.id, selectedDate.dateLabel, selectedTime, selectedTheatre.id, existingBookings, serverBookedSeats]);

  const heldSeatsSet = useMemo(() => {
    return new Set(serverHeldSeats);
  }, [serverHeldSeats]);

  // Handle seat click
  const handleToggleSeat = (seatId: string, category: TicketCategory) => {
    setValidationError(null);
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setValidationError('You can select a maximum of 8 seats in a single reservation.');
        return;
      }
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  // Switch showtime
  const handleSelectTime = (t: Theatre, showTime: string) => {
    setSelectedTheatre(t);
    setSelectedTime(showTime);
    setSelectedSeats([]); // Reset seats on show switch for accuracy
    setValidationError(null);
  };

  // Canteen quantity handlers
  const handleUpdateCanteenQuantity = (item: CanteenItem, delta: number) => {
    setSelectedCanteenItems((prev) => {
      const current = prev[item.id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: next };
    });
  };

  const handleClearCanteen = () => {
    setSelectedCanteenItems({});
  };

  // Offer handlers
  const handleApplyOffer = (offer: AppliedOffer) => {
    setAppliedOffer(offer);
  };

  const handleRemoveOffer = () => {
    setAppliedOffer(null);
  };

  // Calculate pricing breakdown
  const pricing = useMemo(() => {
    let premiumCount = 0;
    let regularCount = 0;

    selectedSeats.forEach((seat) => {
      const row = seat.charAt(0);
      if (row === 'A' || row === 'B') {
        premiumCount++;
      } else {
        regularCount++;
      }
    });

    const categoryBreakdown = [];
    if (premiumCount > 0) {
      categoryBreakdown.push({
        category: 'Premium' as TicketCategory,
        count: premiumCount,
        price: TICKET_PRICING.Premium,
        subtotal: premiumCount * TICKET_PRICING.Premium
      });
    }
    if (regularCount > 0) {
      categoryBreakdown.push({
        category: 'Regular' as TicketCategory,
        count: regularCount,
        price: TICKET_PRICING.Regular,
        subtotal: regularCount * TICKET_PRICING.Regular
      });
    }

    const ticketSubtotal =
      premiumCount * TICKET_PRICING.Premium + regularCount * TICKET_PRICING.Regular;

    // Canteen breakdown
    const canteenList: { item: CanteenItem; count: number }[] = [];
    let canteenTotal = 0;
    Object.entries(selectedCanteenItems).forEach(([id, qty]) => {
      const menuItem = CANTEEN_MENU.find((m) => m.id === id);
      if (menuItem && qty > 0) {
        canteenList.push({ item: menuItem, count: qty });
        canteenTotal += menuItem.price * qty;
      }
    });

    // Discount
    let discountAmount = 0;
    if (appliedOffer) {
      if (appliedOffer.code === 'CINE20') {
        discountAmount = Math.round(ticketSubtotal * 0.2);
      } else {
        discountAmount = appliedOffer.discountAmount;
      }
    }

    const convenienceFee = selectedSeats.length > 0 ? Math.round(ticketSubtotal * TICKET_PRICING.convenienceFeePercentage) : 0;
    const gst = selectedSeats.length > 0 ? Math.round(convenienceFee * TICKET_PRICING.gstPercentage) : 0;
    const totalAmount = Math.max(0, ticketSubtotal + canteenTotal - discountAmount) + convenienceFee + gst;

    // Evaluated Unlocked Rewards
    const unlockedRewards = evaluateUnlockedRewards(selectedSeats.length, canteenTotal);

    return {
      premiumCount,
      regularCount,
      categoryBreakdown,
      ticketSubtotal,
      canteenTotal,
      canteenList,
      discountAmount,
      convenienceFee,
      gst,
      totalAmount,
      unlockedRewards
    };
  }, [selectedSeats, selectedCanteenItems, appliedOffer]);

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setValidationError('Please select at least one seat to proceed to payment.');
      return;
    }

    setValidationError(null);
    setIsReserving(true);

    try {
      const res = await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.id,
          theatreId: selectedTheatre.id,
          date: selectedDate.dateLabel,
          time: selectedTime,
          seats: selectedSeats
        })
      });

      if (!res.ok) {
        setIsReserving(false);
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 409) {
          const conflicts = [...(errJson.conflictBooked || []), ...(errJson.conflictHeld || [])];
          setValidationError(`Seat Conflict: Seat(s) ${conflicts.join(', ')} were just reserved or confirmed by another customer. Please select different seats.`);
          // Remove conflicting seats from current selection
          setSelectedSeats((prev) => prev.filter((s) => !conflicts.includes(s)));
          refreshSeatStatus();
        } else {
          setValidationError(errJson.error || 'Server validation error. Booking cannot proceed without seat validation.');
        }
        return;
      }

      const reserveData = await res.json();
      setIsReserving(false);

      onProceedToPayment({
        movie,
        theatre: selectedTheatre,
        dateStr: selectedDate.dateLabel,
        timeStr: selectedTime,
        selectedSeats,
        categoryBreakdown: pricing.categoryBreakdown,
        subtotal: pricing.ticketSubtotal,
        convenienceFee: pricing.convenienceFee,
        gst: pricing.gst,
        totalAmount: pricing.totalAmount,
        canteenItems: pricing.canteenList,
        canteenTotal: pricing.canteenTotal,
        appliedOffer: appliedOffer
          ? {
              ...appliedOffer,
              discountAmount: pricing.discountAmount
            }
          : null,
        unlockedRewards: pricing.unlockedRewards,
        holdToken: reserveData.holdToken,
        expiresAt: reserveData.expiresAt
      });
    } catch {
      setIsReserving(false);
      // STRICT REQUIREMENT 1: Do not fall back to client confirmation on server failure!
      setValidationError('Booking server is currently unavailable. To protect against duplicate seat bookings, reservations require server validation. Please check your connection and try again.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Movie Listings</span>
        </button>
      </div>

      {/* Movie Details Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Poster Preview */}
          <div className="w-full sm:w-44 aspect-[3/4] shrink-0">
            <PosterArtwork movie={movie} className="w-full h-full rounded-2xl" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                {movie.certificate}
              </span>
              <span className="text-amber-400 font-bold">{movie.displayLanguage}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{movie.genres.join(', ')}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{movie.duration}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-amber-400 font-bold">★ {movie.rating} ({movie.votes})</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>

              {onToggleWatchlist && (
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(movie.id)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isWatchlisted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-600'
                  }`}
                  aria-label={isWatchlisted ? 'Remove from My Watchlist' : 'Add to My Watchlist'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {movie.synopsis}
            </p>

            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <div>
                <span className="text-zinc-500 font-semibold">Starring:</span>{' '}
                <span className="text-zinc-300">{movie.cast.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-semibold">Director:</span>{' '}
                <span className="text-zinc-300">{movie.director}</span>
                {movie.musicDirector && (
                  <>
                    <span className="text-zinc-600 mx-2">·</span>
                    <span className="text-zinc-500 font-semibold">Music:</span>{' '}
                    <span className="text-zinc-300">{movie.musicDirector}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Date */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Step 1 · Select Date
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {dates.map((d) => {
            const isSelected = selectedDate.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSeats([]); // reset seats on date change
                  setValidationError(null);
                }}
                className={`px-4 py-3 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[100px] ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-[11px] block uppercase tracking-wider opacity-80">
                  {d.dayLabel}
                </span>
                <span className="text-base font-extrabold block mt-0.5">
                  {d.dateLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Theatre & Showtime */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Step 2 · Select Cinema & Show Time
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEATRES.map((theatre) => (
            <div
              key={theatre.id}
              className={`p-4 rounded-2xl border transition-all ${
                selectedTheatre.id === theatre.id
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="mb-3">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {theatre.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{theatre.location}</span>
                </div>
                <div className="text-[10px] text-amber-400 font-mono mt-1">
                  {theatre.screen} · {theatre.soundSystem}
                </div>
              </div>

              {/* Showtimes for this theatre */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80">
                {theatre.shows.map((time) => {
                  const isCurrentSelected =
                    selectedTheatre.id === theatre.id && selectedTime === time;

                  return (
                    <button
                      key={time}
                      onClick={() => handleSelectTime(theatre, time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrentSelected
                          ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300 shadow-md shadow-amber-400/20'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Interactive Seat Map & Live Summary */}
      <div className="mb-10" data-tour="seat-selection-view">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Step 3 · Choose Seats ({selectedTheatre.name} · {selectedTime})
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {onOpenCineBotHelp && (
              <button
                type="button"
                onClick={() => onOpenCineBotHelp("How do I select seats and what are premium seats?")}
                className="px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-amber-500/20 border border-zinc-700/80 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Ask CineBot about seat selection"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Need help choosing a seat?</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSmartSeatOpen(true)}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/20 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>✨ Find My Best Seat</span>
            </button>

            {selectedSeats.length > 0 && (
              <button
                onClick={() => setSelectedSeats([])}
                className="text-xs text-zinc-400 hover:text-amber-400 underline cursor-pointer"
              >
                Clear selected seats
              </button>
            )}
          </div>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {serverStatus === 'offline' && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between text-amber-300 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Seat reservation server is currently offline. You can browse movies, seating layouts, and canteen menus, but checkout requires an active server connection.</span>
            </div>
            <button
              type="button"
              onClick={() => refreshSeatStatus()}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Seating Layout Canvas & Additional Booking Steps */}
          <div className="lg:col-span-8 space-y-8">
            <SeatMap
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              heldSeats={heldSeatsSet}
              onToggleSeat={handleToggleSeat}
              maxSeats={8}
              recommendedSeats={recommendedSeats}
              onOpenSmartSeat={() => setIsSmartSeatOpen(true)}
            />

            {/* Step 4: Cinema Canteen & Snacks */}
            <div id="canteen-step">
              <div className="flex items-center gap-2 mb-3">
                <Popcorn className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Step 4 · Cinema Canteen & Snacks (Optional)
                </h2>
              </div>
              <CanteenSelector
                selectedItems={selectedCanteenItems}
                onUpdateQuantity={handleUpdateCanteenQuantity}
                onClearCanteen={handleClearCanteen}
              />
            </div>

            {/* Step 5: CineBook Rewards & Offers */}
            <div id="offers-step">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Step 5 · CineBook Rewards & Offers
                </h2>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
                <OffersSection
                  currentTicketCount={selectedSeats.length}
                  canteenTotal={pricing.canteenTotal}
                  ticketSubtotal={pricing.ticketSubtotal}
                  appliedOffer={appliedOffer}
                  onApplyOffer={handleApplyOffer}
                  onRemoveOffer={handleRemoveOffer}
                />
              </div>
            </div>
          </div>

          {/* Real-time Order Summary Card */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-20 shadow-xl space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Booking Calculation
              </span>
              <h3 className="text-lg font-bold text-white">{movie.title}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedDate.dayLabel}, {selectedDate.dateLabel} · {selectedTime}
              </p>
              <p className="text-xs text-zinc-400">{selectedTheatre.name}</p>
            </div>

            {/* Selected Seats pills */}
            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80">
              <div className="text-[11px] text-zinc-400 font-medium mb-1.5 flex items-center justify-between">
                <span>Selected Seats</span>
                <span className="text-white font-mono font-bold">
                  {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                </span>
              </div>
              {selectedSeats.length === 0 ? (
                <span className="text-xs text-zinc-500 italic">
                  Tap any available seat from the seat map
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.sort().map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-zinc-300 pt-1">
              {pricing.categoryBreakdown.map((c) => (
                <div key={c.category} className="flex justify-between items-center">
                  <span>
                    {c.category} (₹{c.price} × {c.count})
                  </span>
                  <span className="font-semibold text-white tabular-nums">
                    ₹{c.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}

              {pricing.canteenTotal > 0 && (
                <div className="flex justify-between items-center text-amber-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Popcorn className="w-3.5 h-3.5 text-amber-400" /> Canteen Snacks
                  </span>
                  <span className="tabular-nums font-semibold">
                    +₹{pricing.canteenTotal.toLocaleString()}
                  </span>
                </div>
              )}

              {appliedOffer && pricing.discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-500/30">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Offer: {appliedOffer.code}
                  </span>
                  <span className="tabular-nums">
                    -₹{pricing.discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {selectedSeats.length > 0 && (
                <>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Convenience Fee (10%)</span>
                    <span className="tabular-nums">₹{pricing.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>GST (18% on fee)</span>
                    <span className="tabular-nums">₹{pricing.gst}</span>
                  </div>
                </>
              )}

              {/* Unlocked Rewards Alert in Sidebar */}
              {pricing.unlockedRewards.length > 0 && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Unlocked Rewards!
                  </div>
                  {pricing.unlockedRewards.map((r) => (
                    <div
                      key={r.id}
                      className="text-[11px] font-semibold text-white flex items-center justify-between"
                    >
                      <span>{r.badge}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Included</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
                  ₹{pricing.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Payment CTA */}
            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0 || isReserving || serverStatus === 'offline'}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                selectedSeats.length > 0 && !isReserving && serverStatus !== 'offline'
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-500/20 active:scale-98'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              {isReserving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>Locking Seats on Server...</span>
                </>
              ) : serverStatus === 'offline' ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Server Offline · Cannot Reserve</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant seat reservation & digital e-ticket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Seat Recommendation Modal */}
      {isSmartSeatOpen && (
        <SmartSeatModal
          bookedSeats={bookedSeats}
          onApplyRecommendedSeats={(seats) => {
            setSelectedSeats(seats);
            setRecommendedSeats(seats);
            setValidationError(null);
          }}
          onClose={() => setIsSmartSeatOpen(false)}
        />
      )}
    </div>
  );
};
