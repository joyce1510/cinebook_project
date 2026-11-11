import React from 'react';
import { Ticket, Film, Sparkles, Search, Gift, Popcorn, BarChart3, Heart } from 'lucide-react';

interface NavbarProps {
  bookingCount: number;
  watchlistCount?: number;
  canteenOrderCount?: number;
  onOpenMyBookings?: () => void;
  onNavigateHome: () => void;
  onNavigateWelcome?: () => void;
  onNavigateMovies: () => void;
  onNavigateWatchlist: () => void;
  onNavigateBookings: () => void;
  onNavigateCanteen: () => void;
  onFocusSearch: () => void;
  onOpenOffers: () => void;
  onOpenInsights?: () => void;
  currentView?: string;
  onStartTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  bookingCount,
  watchlistCount = 0,
  canteenOrderCount = 0,
  onNavigateHome,
  onNavigateWelcome,
  onNavigateMovies,
  onNavigateWatchlist,
  onNavigateBookings,
  onNavigateCanteen,
  onFocusSearch,
  onOpenOffers,
  currentView = 'home',
  onStartTour
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand wordmark */}
        <button
          onClick={onNavigateWelcome || onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            CineBook
          </span>
        </button>

        {/* Clean text navigation links: Home, Movies, My Watchlist, My Bookings, Canteen */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-300">
          <button
            onClick={onNavigateHome}
            data-tour="navbar-home"
            className={`hover:text-amber-400 transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={onNavigateMovies}
            data-tour="navbar-movies"
            className={`hover:text-amber-400 transition-colors cursor-pointer ${
              currentView === 'movies' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Movies
          </button>

          <button
            onClick={onNavigateWatchlist}
            data-tour="watchlist-nav"
            className={`hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'watchlist' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${watchlistCount > 0 ? 'text-rose-400 fill-rose-400/40' : 'text-zinc-400'}`} />
            <span>My Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onNavigateBookings}
            data-tour="my-bookings-nav"
            className={`hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'bookings' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {bookingCount}
              </span>
            )}
          </button>

          <button
            onClick={onNavigateCanteen}
            data-tour="canteen-nav"
            className={`hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'canteen' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Popcorn className="w-3.5 h-3.5 text-amber-400" />
            <span>Canteen</span>
          </button>

          <button
            onClick={onOpenOffers}
            data-tour="offers-nav"
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Offers</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all cursor-pointer font-medium"
              title="Restart Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Guided Tour</span>
            </button>
          )}

          <button
            onClick={onFocusSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all cursor-pointer"
            title="Search movies (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Ctrl K
            </kbd>
          </button>

          {/* Mobile Watchlist Icon */}
          <button
            onClick={onNavigateWatchlist}
            className="md:hidden relative p-2 text-zinc-400 hover:text-rose-400 bg-zinc-900 border border-zinc-800 rounded-lg transition-all cursor-pointer"
            title="My Watchlist"
          >
            <Heart className={`w-4 h-4 ${watchlistCount > 0 ? 'text-rose-400 fill-rose-400/40' : ''}`} />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* My Bookings CTA */}
          <button
            onClick={onNavigateBookings}
            className="relative px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            title="View booked movie tickets"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">My Bookings</span>
            {(bookingCount > 0 || canteenOrderCount > 0) && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                {bookingCount + canteenOrderCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

