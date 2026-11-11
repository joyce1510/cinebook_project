import React, { useState } from 'react';
import { Booking, CanteenOrder } from '../types';
import { PosterArtwork } from './PosterArtwork';
import { MovieInsightsView } from './MovieInsightsView';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Film,
  Star,
  CheckCircle2,
  Eye,
  MessageSquare,
  Popcorn,
  Utensils,
  Receipt,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface MyBookingsModalProps {
  bookings: Booking[];
  canteenOrders: CanteenOrder[];
  onClose: () => void;
  onViewBooking: (booking: Booking) => void;
  onClearBookings: () => void;
  onClearCanteenOrders: () => void;
  onMarkAsWatched: (bookingId: string) => void;
  onRateBooking: (bookingId: string, rating: number, review: string) => void;
  onViewCanteenOrder: (order: CanteenOrder) => void;
  initialTab?: 'tickets' | 'canteen' | 'insights';
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  canteenOrders,
  onClose,
  onViewBooking,
  onClearBookings,
  onClearCanteenOrders,
  onMarkAsWatched,
  onRateBooking,
  onViewCanteenOrder,
  initialTab = 'tickets'
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'canteen' | 'insights'>(initialTab);

  // Track which booking has an open rating input box
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [tempReview, setTempReview] = useState<string>('');

  const handleOpenRating = (booking: Booking) => {
    setRatingBookingId(booking.id);
    setTempRating(booking.rating || 5);
    setTempReview(booking.review || '');
  };

  const handleSaveRating = (bookingId: string) => {
    if (tempRating > 0) {
      onRateBooking(bookingId, tempRating, tempReview.trim());
      setRatingBookingId(null);
    }
  };

  const handleMarkWatchedAndRate = (bookingId: string) => {
    onMarkAsWatched(bookingId);
    setRatingBookingId(bookingId);
    setTempRating(5);
    setTempReview('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white tracking-wide">
              My Orders & Bookings
            </h3>

            {/* Tab Switcher */}
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'tickets'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Movie Tickets</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-950/40">
                  {bookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('canteen')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'canteen'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Popcorn className="w-3.5 h-3.5" />
                <span>Canteen Orders</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-950/40">
                  {canteenOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>My Movie Insights</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'tickets' && bookings.length > 0 && (
              <button
                onClick={onClearBookings}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all booking history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}

            {activeTab === 'canteen' && canteenOrders.length > 0 && (
              <button
                onClick={onClearCanteenOrders}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear canteen order history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Movie Tickets */}
        {activeTab === 'tickets' && (
          <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
            {bookings.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3">
                  <Ticket className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-200">No bookings yet 🎬</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Explore the latest blockbusters and reserve your seats now!
                </p>
              </div>
            ) : (
              bookings.map((b) => {
                const isWatched = Boolean(b.isWatched);
                const hasRating = typeof b.rating === 'number' && b.rating > 0;
                const isRatingOpen = ratingBookingId === b.id;

                return (
                  <div
                    key={b.id}
                    className="p-4 bg-zinc-950/90 rounded-2xl border border-zinc-800/90 hover:border-zinc-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Movie poster & Basic Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-20 shrink-0 rounded-xl overflow-hidden shadow-md border border-zinc-800">
                          <PosterArtwork movie={b.movie} size="sm" className="w-full h-full" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {b.id}
                            </span>

                            {/* Watched / Not Watched Status Badge */}
                            {isWatched ? (
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Watched</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Not Watched</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-white tracking-tight">
                            {b.movie.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400">
                            <span className="text-zinc-300 font-medium">{b.theatre.name}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" /> {b.date}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" /> {b.time}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-300 pt-0.5 flex flex-wrap items-center gap-2">
                            <span>
                              Seats:{' '}
                              <span className="font-bold text-amber-400 font-mono">
                                {b.seats.join(', ')}
                              </span>{' '}
                              ({b.seats.length} {b.seats.length === 1 ? 'ticket' : 'tickets'})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Price & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800 shrink-0">
                        <div className="text-base font-extrabold text-white tabular-nums">
                          ₹{b.totalAmount.toLocaleString()}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onViewBooking(b);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border border-zinc-700"
                          >
                            <span>View Pass</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {/* "Mark as Watched" button if not watched */}
                          {!isWatched && (
                            <button
                              onClick={() => handleMarkWatchedAndRate(b.id)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Mark as Watched</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Watched & Rating Section */}
                    {isWatched && (
                      <div className="pt-2 border-t border-zinc-800/80 bg-zinc-900/60 rounded-xl p-3 space-y-2">
                        {hasRating && !isRatingOpen ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                  Your Rating:
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= (b.rating || 0)
                                          ? 'text-amber-400 fill-amber-400'
                                          : 'text-zinc-600'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs font-bold text-amber-400 ml-1 font-mono">
                                    {b.rating}/5
                                  </span>
                                </div>
                              </div>

                              {b.review && (
                                <p className="text-xs text-zinc-300 italic flex items-start gap-1.5 pt-0.5">
                                  <MessageSquare className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                  <span>&ldquo;{b.review}&rdquo;</span>
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenRating(b)}
                              className="text-[11px] text-zinc-400 hover:text-amber-400 underline self-start sm:self-auto cursor-pointer"
                            >
                              Edit Rating
                            </button>
                          </div>
                        ) : (
                          <div>
                            {!isRatingOpen ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Watched! Share your rating with fellow cinephiles:</span>
                                </div>
                                <button
                                  onClick={() => handleOpenRating(b)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                                >
                                  ⭐ Rate Movie
                                </button>
                              </div>
                            ) : (
                              /* Inline Rating Box */
                              <div className="space-y-2.5 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>Rate {b.movie.title}:</span>
                                  </span>
                                  <button
                                    onClick={() => setRatingBookingId(null)}
                                    className="text-zinc-400 hover:text-white text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {[1, 2, 3, 4, 5].map((starVal) => {
                                    const isFilled = (hoverRating || tempRating) >= starVal;
                                    return (
                                      <button
                                        type="button"
                                        key={starVal}
                                        onClick={() => setTempRating(starVal)}
                                        onMouseEnter={() => setHoverRating(starVal)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 cursor-pointer focus:outline-none"
                                        title={`${starVal} Star`}
                                      >
                                        <Star
                                          className={`w-5 h-5 transition-colors ${
                                            isFilled
                                              ? 'text-amber-400 fill-amber-400'
                                              : 'text-zinc-600 hover:text-zinc-400'
                                          }`}
                                        />
                                      </button>
                                    );
                                  })}
                                  <span className="text-xs font-mono text-amber-400 font-bold ml-1.5">
                                    {tempRating}/5
                                  </span>
                                </div>

                                <input
                                  type="text"
                                  value={tempReview}
                                  onChange={(e) => setTempReview(e.target.value)}
                                  placeholder="Add an optional short review (e.g. thrilling climax, superb BGM)..."
                                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                                />

                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setRatingBookingId(null)}
                                    className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveRating(b.id)}
                                    className="px-3.5 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
                                  >
                                    Save Rating
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Canteen Orders */}
        {activeTab === 'canteen' && (
          <div className="p-6 max-h-[72vh] overflow-y-auto space-y-4">
            {canteenOrders.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3">
                  <Popcorn className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-200">No Canteen Orders Yet</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Hungry? Grab popcorn, burgers, pizzas and fountain drinks from the Canteen Food Ordering section!
                </p>
              </div>
            ) : (
              canteenOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-zinc-950/90 rounded-2xl border border-zinc-800/90 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        #{order.id}
                      </span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>{order.status}</span>
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(order.orderedAt).toLocaleDateString()} at{' '}
                        {new Date(order.orderedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Ordered items breakdown */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {order.items.map((i) => (
                        <span
                          key={i.id}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium"
                        >
                          {i.name} × {i.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center gap-3 pt-0.5">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Clock className="w-3 h-3 text-amber-400" /> Ready in {order.estimatedTime}
                      </span>
                      <span>·</span>
                      <span className="text-zinc-400">{order.pickupCounter}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800 shrink-0">
                    <div className="text-base font-extrabold text-white tabular-nums">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <button
                      onClick={() => onViewCanteenOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Personal Movie Analytics */}
        {activeTab === 'insights' && (
          <div className="p-6 max-h-[72vh] overflow-y-auto">
            <MovieInsightsView bookings={bookings} canteenOrders={canteenOrders} />
          </div>
        )}
      </div>
    </div>
  );
};
