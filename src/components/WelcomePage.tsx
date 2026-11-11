import React from 'react';
import { Movie } from '../types';
import { MOVIES } from '../data/movies';
import {
  Film,
  Sparkles,
  ChevronRight,
  Compass,
  Tv,
  Popcorn,
  Ticket,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';

interface WelcomePageProps {
  onExplore: () => void;
  onSelectMovie: (movie: Movie) => void;
  onNavigateCanteen?: () => void;
  onOpenOffers?: () => void;
  onOpenMyBookings?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onExplore,
  onSelectMovie,
  onNavigateCanteen,
  onOpenOffers
}) => {
  // Highlight 6 top featured movies across diverse genres
  const featuredMovies = MOVIES.slice(0, 6);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Cinematic Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.92)_100%)]" />
      </div>

      {/* Main Welcome Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 text-center space-y-10">
        {/* Curated Pre-title Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-xl shadow-amber-500/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Next-Generation Cinema Experience</span>
        </div>

        {/* Welcome Messaging & Catchy Tagline */}
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Step into the Magic of{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              CineBook
            </span>
          </h1>

          {/* Catchy Tagline */}
          <p className="text-base sm:text-xl font-medium text-amber-300/90 tracking-wide max-w-2xl mx-auto">
            Where Every Seat Tells a Story &middot; Feel Every Beat in Dolby Atmos &amp; IMAX
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            Your premier gateway to blockbuster theatrical entertainment. Discover {MOVIES.length} acclaimed releases, pick your ideal seats with live hold protection, and order hot concessions straight from your mobile screen.
          </p>
        </div>

        {/* Primary Call to Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExplore}
            data-tour="welcome-explore"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:via-orange-400 hover:to-amber-300 text-zinc-950 font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 group"
          >
            <Compass className="w-5 h-5 text-zinc-950 transition-transform group-hover:rotate-45" />
            <span>Explore CineBook</span>
            <ChevronRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {onNavigateCanteen && (
            <button
              onClick={onNavigateCanteen}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 text-zinc-200 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-sm active:scale-95"
            >
              <Popcorn className="w-4 h-4 text-amber-400" />
              <span>Canteen Menu</span>
            </button>
          )}

          {onOpenOffers && (
            <button
              onClick={onOpenOffers}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 text-zinc-200 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Offers & Rewards</span>
            </button>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Curated Blockbusters</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {MOVIES.length} critically acclaimed titles spanning Tamil, Telugu, and English in high-definition digital projection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-sky-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive Seat Map</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time seat reservation with 5-minute hold validation and instant seat-category pricing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Popcorn className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Express Canteen</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pre-order hot butter popcorn, gourmet nachos, and chilled beverages for contactless pickup.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Verified E-Tickets</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cryptographically verified QR digital passes with permanent server-side booking history.
            </p>
          </div>
        </div>

        {/* Featured Movies Showcase Row */}
        <div className="pt-10 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Now Showing in Multiplexes
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Featured Movies
              </h2>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore All {MOVIES.length} Movies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Poster Artwork Thumbnail */}
                <div className="aspect-2/3 relative overflow-hidden bg-zinc-950">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    <span>{movie.rating}</span>
                  </div>

                  {/* Certificate */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[9px] font-bold text-zinc-300 border border-zinc-700">
                    {movie.certificate}
                  </div>
                </div>

                {/* Movie Meta Information */}
                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="truncate">{movie.genres[0]}</span>
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="w-2.5 h-2.5 text-zinc-500" />
                      <span>{movie.duration}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnered Multiplex Footnote */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400/80" />
            <span>Available across PVR INOX Luxe, SPI Cinemas (Palazzo) &amp; Cinepolis Grand</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tickets starting from ₹160</span>
            </span>
            <span>&middot;</span>
            <span>Zero Booking Surcharges on UPI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
