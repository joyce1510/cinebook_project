import React, { useState } from 'react';
import { Booking, CanteenOrder } from '../types';
import { PosterArtwork } from './PosterArtwork';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  FileText,
  Popcorn,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  BarChart3,
  History,
  Bot
} from 'lucide-react';

interface BookingsDashboardProps {
  bookings: Booking[];
  canteenOrders: CanteenOrder[];
  onOpenTicket: (booking: Booking) => void;
  onOpenRateModal: (booking: Booking) => void;
  onExploreMovies: () => void;
  onOpenCineBotHelp?: (query: string) => void;
}

export const BookingsDashboard: React.FC<BookingsDashboardProps> = ({
  bookings,
  canteenOrders,
  onOpenTicket,
  onOpenRateModal,
  onExploreMovies,
  onOpenCineBotHelp
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'upcoming' | 'past'>('all');

  // Separate Upcoming vs Past
  // "Yesterday" or explicitly marked isWatched is Past; "Today", "Tomorrow", etc. are Upcoming
  const isPastBooking = (b: Booking) => {
    return Boolean(b.isWatched || b.date.toLowerCase().includes('yesterday'));
  };

  const upcomingBookings = bookings.filter((b) => !isPastBooking(b));
  const pastBookings = bookings.filter((b) => isPastBooking(b));

  const displayedBookings =
    activeSection === 'upcoming'
      ? upcomingBookings
      : activeSection === 'past'
      ? pastBookings
      : bookings;

  return (
    <div data-tour="bookings-dashboard" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>My Bookings Dashboard</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              </h1>
              {onOpenCineBotHelp && (
                <button
                  type="button"
                  onClick={() => onOpenCineBotHelp("Need help finding your ticket or invoice? How does QR verification work?")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 text-xs font-medium transition-all cursor-pointer"
                  title="Ask CineBot about tickets"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need help finding your ticket? Ask CineBot</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            View your upcoming showtimes, access cryptographically verified digital tickets, and review past cinema memories.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'upcoming'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Upcoming ({upcomingBookings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'past'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3 h-3 text-zinc-400" />
            <span>Past ({pastBookings.length})</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {displayedBookings.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-5 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-zinc-900 to-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
            <Ticket className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeSection === 'upcoming'
                ? 'No Upcoming Bookings'
                : activeSection === 'past'
                ? 'No Past Cinema Bookings'
                : 'No Bookings Found'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Explore 16 critically acclaimed releases across IMAX and Dolby Atmos. Choose your preferred seats with live hold protection.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreMovies}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-zinc-950" />
              <span>Book Your First Movie</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>
      ) : (
        /* Bookings Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedBookings.map((b) => {
            const isPast = isPastBooking(b);
            const formattedBookedDate = new Date(b.bookedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={b.id}
                className="bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 group backdrop-blur-sm"
              >
                {/* Top Row: Movie Poster + Core Details */}
                <div className="flex gap-4">
                  {/* Poster Thumbnail */}
                  <div className="w-20 sm:w-24 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-zinc-700/80 shadow-md">
                    <PosterArtwork movie={b.movie} className="w-full h-full rounded-xl" />
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400">
                        {b.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPast
                            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {isPast ? 'Show Completed' : 'Confirmed & Active'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate group-hover:text-amber-400 transition-colors">
                      {b.movie.title}
                    </h3>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{b.theatre.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                        <span className="text-amber-400/90 font-medium">{b.theatre.screen}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs pt-0.5">
                        <span className="flex items-center gap-1 text-zinc-200 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {b.date}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="flex items-center gap-1 text-zinc-200 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {b.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Seats, Category & Food Orders */}
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Reserved Seats:</span>
                    <span className="font-mono font-bold text-white tracking-wide">
                      {b.seats.join(', ')} ({b.seats.length} {b.seats.length === 1 ? 'Seat' : 'Seats'})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500">Tier Breakdown:</span>
                    <span className="text-zinc-300">
                      {b.categoryBreakdown.map((cb) => `${cb.count}x ${cb.category}`).join(' · ')}
                    </span>
                  </div>

                  {b.canteenItems && b.canteenItems.length > 0 && (
                    <div className="pt-1.5 border-t border-zinc-850 flex items-start justify-between text-[11px]">
                      <span className="text-amber-400/90 flex items-center gap-1">
                        <Popcorn className="w-3 h-3 text-amber-400" />
                        <span>Food Orders:</span>
                      </span>
                      <span className="text-zinc-300 text-right truncate max-w-[200px]">
                        {b.canteenItems.map((ci) => `${ci.count}x ${ci.item.name}`).join(', ')}
                      </span>
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-zinc-850 flex items-center justify-between">
                    <span className="text-zinc-400">Total Paid:</span>
                    <span className="text-sm font-extrabold text-amber-400 tabular-nums">
                      ₹{b.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Booked on {formattedBookedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rate & Review Button for past bookings */}
                    {isPast && (
                      <button
                        type="button"
                        onClick={() => onOpenRateModal(b)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Review and rate this movie"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{b.rating ? `Rated ★ ${b.rating}` : 'Rate Movie'}</span>
                      </button>
                    )}

                    {/* View Digital Ticket / Invoice */}
                    <button
                      type="button"
                      onClick={() => onOpenTicket(b)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
                      title="View digital barcode ticket and invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
