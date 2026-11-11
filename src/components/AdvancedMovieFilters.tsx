import React, { useState } from 'react';
import { Movie } from '../types';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Film,
  Star,
  Check
} from 'lucide-react';

export interface MovieFilterState {
  searchQuery: string;
  genre: string;
  language: string;
  releaseYearRange: string;
  ratingThreshold: number;
  certificate: string;
  contentType: string;
  showtimePeriod: string;
}

export const INITIAL_MOVIE_FILTERS: MovieFilterState = {
  searchQuery: '',
  genre: 'All',
  language: 'All',
  releaseYearRange: 'All',
  ratingThreshold: 0,
  certificate: 'All',
  contentType: 'All',
  showtimePeriod: 'All'
};

interface AdvancedMovieFiltersProps {
  filters: MovieFilterState;
  onChangeFilters: (newFilters: MovieFilterState) => void;
  totalMoviesCount: number;
  filteredCount: number;
  onClearAll: () => void;
}

export function applyMovieFilters(movies: Movie[], filters: MovieFilterState): Movie[] {
  return movies.filter((movie) => {
    // 1. Text Search (title, cast, director, synopsis)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
      const matchDirector = movie.director.toLowerCase().includes(q);
      const matchGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
      const matchSynopsis = movie.synopsis.toLowerCase().includes(q);
      if (!matchTitle && !matchCast && !matchDirector && !matchGenre && !matchSynopsis) {
        return false;
      }
    }

    // 2. Genre
    if (filters.genre !== 'All') {
      if (!movie.genres.includes(filters.genre)) {
        return false;
      }
    }

    // 3. Language
    if (filters.language !== 'All') {
      if (!movie.languages.includes(filters.language)) {
        return false;
      }
    }

    // 4. Release Year
    if (filters.releaseYearRange !== 'All') {
      const year = movie.releaseYear;
      if (filters.releaseYearRange === '2025+' && year < 2025) return false;
      if (filters.releaseYearRange === '2020-2024' && (year < 2020 || year > 2024)) return false;
      if (filters.releaseYearRange === '2010-2019' && (year < 2010 || year > 2019)) return false;
      if (filters.releaseYearRange === 'pre-2010' && year >= 2010) return false;
    }

    // 5. Rating Threshold
    if (filters.ratingThreshold > 0) {
      if (movie.rating < filters.ratingThreshold) {
        return false;
      }
    }

    // 6. Certificate / Age classification
    if (filters.certificate !== 'All') {
      if (movie.certificate !== filters.certificate) {
        return false;
      }
    }

    // 7. Content Type (Movie vs TV Series for The Chosen)
    if (filters.contentType !== 'All') {
      const isSeries =
        movie.id === 'the-chosen' ||
        movie.duration.includes('Season') ||
        (movie.subtitle && movie.subtitle.includes('TV Series'));
      if (filters.contentType === 'series' && !isSeries) return false;
      if (filters.contentType === 'movie' && isSeries) return false;
    }

    // 8. Showtime Period (Morning, Matinee, Evening, Night)
    // All partner theatres have shows across all 4 periods, but user can filter
    return true;
  });
}

export const AdvancedMovieFilters: React.FC<AdvancedMovieFiltersProps> = ({
  filters,
  onChangeFilters,
  totalMoviesCount,
  filteredCount,
  onClearAll
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any filter is active
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.genre !== 'All' ||
    filters.language !== 'All' ||
    filters.releaseYearRange !== 'All' ||
    filters.ratingThreshold > 0 ||
    filters.certificate !== 'All' ||
    filters.contentType !== 'All' ||
    filters.showtimePeriod !== 'All';

  const update = (partial: Partial<MovieFilterState>) => {
    onChangeFilters({ ...filters, ...partial });
  };

  const GENRES = [
    'All',
    'Action',
    'Drama',
    'Romance',
    'Comedy',
    'Animation',
    'Adventure',
    'Sci-Fi',
    'Horror',
    'Historical',
    'Musical'
  ];

  const LANGUAGES = ['All', 'Tamil', 'Telugu', 'English'];
  const CERTIFICATES = ['All', 'U', 'U/A', 'A'];
  const YEARS = [
    { label: 'All Years', value: 'All' },
    { label: '2025+ New Releases', value: '2025+' },
    { label: '2020 – 2024', value: '2020-2024' },
    { label: '2010 – 2019', value: '2010-2019' },
    { label: 'Classics (Pre-2010)', value: 'pre-2010' }
  ];
  const RATINGS = [
    { label: 'Any Rating', value: 0 },
    { label: '★ 8.5 & Above', value: 8.5 },
    { label: '★ 9.0 & Above', value: 9.0 }
  ];
  const TYPES = [
    { label: 'All Formats', value: 'All' },
    { label: 'Theatrical Movies', value: 'movie' },
    { label: 'TV Series / Shows', value: 'series' }
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 backdrop-blur-md">
      {/* Search Input Bar + Quick Genre Badges + Expand Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search titles, actors, directors, stories..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all outline-none"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => update({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Language Toggle & More Filters Button */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {/* Language Selector */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {LANGUAGES.map((lang) => {
              const active = filters.language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => update({ language: lang })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {lang === 'All' ? 'All Languages' : lang}
                </button>
              );
            })}
          </div>

          {/* Expand Filter Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isExpanded || hasActiveFilters
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Advanced Filters</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Horizontal Quick Genre Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {GENRES.map((g) => {
          const isSelected = filters.genre === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => update({ genre: g })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border select-none ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/15 font-bold'
                  : 'bg-zinc-950/70 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Expandable Multi-Facet Filter Drawer */}
      {isExpanded && (
        <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 1. Release Era */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Release Period
            </label>
            <select
              value={filters.releaseYearRange}
              onChange={(e) => update({ releaseYearRange: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Rating Threshold */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Minimum Rating
            </label>
            <select
              value={filters.ratingThreshold}
              onChange={(e) => update({ ratingThreshold: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {RATINGS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Age Classification */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Censor Certificate
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CERTIFICATES.map((cert) => {
                const active = filters.certificate === cert;
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => update({ certificate: cert })}
                    className={`py-1.5 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-zinc-950 border-amber-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {cert}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Format / Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Show Format
            </label>
            <select
              value={filters.contentType}
              onChange={(e) => update({ contentType: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Footer Info: Match count + Clear All */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/60">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-white font-bold">{filteredCount}</strong> of{' '}
            <strong className="text-white font-bold">{totalMoviesCount}</strong> titles
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Active Filters
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
