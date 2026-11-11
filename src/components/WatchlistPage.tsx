import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { Heart, Compass, Trash2, Film, Sparkles, ArrowRight } from 'lucide-react';

interface WatchlistPageProps {
  watchlistMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
  onClearWatchlist?: () => void;
  onExploreMovies: () => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  watchlistMovies,
  onSelectMovie,
  onToggleWatchlist,
  onClearWatchlist,
  onExploreMovies
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>My Watchlist</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {watchlistMovies.length} {watchlistMovies.length === 1 ? 'Movie' : 'Movies'}
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Keep track of upcoming releases and cinematic stories you plan to experience on the big screen.
          </p>
        </div>

        {watchlistMovies.length > 0 && onClearWatchlist && (
          <button
            type="button"
            onClick={onClearWatchlist}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            title="Remove all saved movies from watchlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {watchlistMovies.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-5 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-zinc-900 to-amber-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-500/10">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Your Watchlist is Empty
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Discover blockbusters across Tamil, Telugu, and English. Tap the heart icon on any poster to save it here for later booking.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreMovies}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 text-zinc-950" />
              <span>Explore All Movies</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>
      ) : (
        /* Populated Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isWatchlisted={true}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
