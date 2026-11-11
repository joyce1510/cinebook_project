import React, { useState, useMemo } from 'react';
import { Movie, Booking } from '../types';
import { MovieCard } from './MovieCard';
import { Sparkles, Heart, Star, Film, Flame, Compass } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  movies: Movie[];
  watchlistMovieIds: string[];
  bookings: Booking[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  movies,
  watchlistMovieIds,
  bookings,
  onSelectMovie,
  onToggleWatchlist
}) => {
  const [activeTab, setActiveTab] = useState<'for_you' | 'watchlist_match' | 'trending' | 'critics'>('for_you');

  // Derive user preferences
  const watchlistedMovies = useMemo(
    () => movies.filter((m) => watchlistMovieIds.includes(m.id)),
    [movies, watchlistMovieIds]
  );

  const watchedOrBookedMovies = useMemo(
    () => bookings.map((b) => b.movie),
    [bookings]
  );

  // 1. "Because You Watchlisted..." recommendations
  const watchlistRecommended = useMemo(() => {
    if (watchlistedMovies.length === 0) return [];
    const preferredGenres = new Set(watchlistedMovies.flatMap((m) => m.genres));
    const preferredLangs = new Set(watchlistedMovies.flatMap((m) => m.languages));

    return movies
      .filter((m) => !watchlistMovieIds.includes(m.id))
      .filter((m) => m.genres.some((g) => preferredGenres.has(g)) || m.languages.some((l) => preferredLangs.has(l)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [movies, watchlistedMovies, watchlistMovieIds]);

  // 2. "Because You Watched..." recommendations
  const historyRecommended = useMemo(() => {
    if (watchedOrBookedMovies.length === 0) return [];
    const bookedIds = new Set(watchedOrBookedMovies.map((m) => m.id));
    const bookedGenres = new Set(watchedOrBookedMovies.flatMap((m) => m.genres));

    return movies
      .filter((m) => !bookedIds.has(m.id))
      .filter((m) => m.genres.some((g) => bookedGenres.has(g)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [movies, watchedOrBookedMovies]);

  // 3. Trending & Highly Rated (9.0+ or top rating)
  const trendingRecommended = useMemo(() => {
    return [...movies]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [movies]);

  // 4. Curated Critics' Choice (Ideal for new users)
  const criticsChoice = useMemo(() => {
    // Select diverse 4 acclaimed gems across genres
    const ids = ['amaran', 'spiderman-no-way-home', 'the-chosen', 'tangled'];
    const chosen = movies.filter((m) => ids.includes(m.id));
    if (chosen.length >= 4) return chosen;
    return movies.slice(0, 4);
  }, [movies]);

  // Determine current active list
  const currentList = useMemo(() => {
    if (activeTab === 'watchlist_match' && watchlistRecommended.length > 0) {
      return watchlistRecommended;
    }
    if (activeTab === 'trending') {
      return trendingRecommended;
    }
    if (activeTab === 'critics') {
      return criticsChoice;
    }
    // 'for_you'
    if (historyRecommended.length > 0) {
      return historyRecommended;
    }
    if (watchlistRecommended.length > 0) {
      return watchlistRecommended;
    }
    return criticsChoice;
  }, [activeTab, historyRecommended, watchlistRecommended, trendingRecommended, criticsChoice]);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-md">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Recommended For You</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Personalized
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Curated from your viewing tastes, watchlist preferences, and top box-office ratings
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('for_you')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'for_you'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Top Picks
          </button>

          {watchlistRecommended.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('watchlist_match')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'watchlist_match'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>From Watchlist</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('trending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'trending'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Highest Rated</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('critics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'critics'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Critics&apos; Choice
          </button>
        </div>
      </div>

      {/* Recommended Movie Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentList.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelectMovie={onSelectMovie}
            bookings={bookings}
            isWatchlisted={watchlistMovieIds.includes(movie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
};
