import React from 'react';
import { Movie, Booking } from '../types';
import { PosterArtwork } from './PosterArtwork';
import { Star, Clock, Ticket, Heart } from 'lucide-react';
import { getWhyYouMightLikeThis, RecommendationReason } from '../utils/recommendations';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  bookings?: Booking[];
  recommendationReason?: RecommendationReason;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  bookings,
  recommendationReason,
  isWatchlisted = false,
  onToggleWatchlist
}) => {
  const recommendation =
    recommendationReason || (bookings ? getWhyYouMightLikeThis(movie, bookings) : null);

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group relative bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      {/* Poster Section */}
      <div className="relative aspect-[3/4] w-full p-2.5 pb-0">
        <PosterArtwork
          movie={movie}
          className="w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Watchlist Quick Toggle Button */}
        {onToggleWatchlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie.id);
            }}
            className={`absolute top-4.5 right-4.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
              isWatchlisted
                ? 'bg-rose-500/25 border-rose-500/60 text-rose-400 hover:scale-110 shadow-lg shadow-rose-500/20'
                : 'bg-zinc-950/70 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-900/90 hover:scale-105'
            }`}
            title={isWatchlisted ? 'Remove from My Watchlist' : 'Add to My Watchlist'}
            aria-label={isWatchlisted ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isWatchlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pills (zero-pill rule) */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5 font-medium">
            <span className="text-amber-400 font-semibold">{movie.displayLanguage}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{movie.genres[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.duration}</span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 tracking-tight">
            {movie.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {movie.synopsis}
          </p>

          {/* Feature 4: Why You Might Like This Recommendation Explanation */}
          {recommendation && !recommendation.isFallback && (
            <div className="mt-3 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 group-hover:border-amber-500/25 transition-colors">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                <span role="img" aria-label="Heart">❤️</span>
                <span>{recommendation.highlightTag || 'Why you might like this'}</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          )}
        </div>

        {/* Action Footnote */}
        <div className="pt-3.5 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-zinc-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{movie.rating}</span>
            <span className="text-[11px] text-zinc-500 font-normal">({movie.votes})</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMovie(movie);
            }}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/15"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
