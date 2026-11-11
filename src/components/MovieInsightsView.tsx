import React from 'react';
import { Booking, CanteenOrder } from '../types';
import { calculateMovieAnalytics } from '../utils/recommendations';
import {
  Film,
  Star,
  Sparkles,
  Languages,
  Calendar,
  Popcorn,
  Ticket,
  TrendingUp,
  BarChart3,
  Award,
  Clock,
  Wallet
} from 'lucide-react';

interface MovieInsightsViewProps {
  bookings: Booking[];
  canteenOrders: CanteenOrder[];
}

export const MovieInsightsView: React.FC<MovieInsightsViewProps> = ({
  bookings,
  canteenOrders
}) => {
  const analytics = calculateMovieAnalytics(bookings, canteenOrders);

  if (!analytics.hasEnoughData) {
    return (
      <div className="py-14 px-4 text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-zinc-800/80 border border-zinc-700/80 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Film className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-white">
          Keep watching and rating movies to unlock your Movie Insights! 🎬
        </h4>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Book your favorite shows, mark movies as watched in My Bookings, and share ratings to generate your personalized cinema profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Intro Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Movie Analytics</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            Your CineBook Film Profile
          </h3>
          <p className="text-xs text-zinc-300">
            Real insights computed from your reservations, watched film logs & gourmet counter orders.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 self-start sm:self-auto shrink-0 text-right">
          <span className="text-[10px] text-zinc-400 font-mono block">Lifetime Total Spend</span>
          <span className="text-base font-black text-amber-400 tabular-nums">
            ₹{(analytics.totalMovieSpending + analytics.totalCanteenSpending).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Movies Watched */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Movies Watched</span>
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {analytics.moviesWatchedCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {analytics.moviesWatchedCount === 1 ? '1 title logged' : `${analytics.moviesWatchedCount} titles logged`}
          </div>
        </div>

        {/* 2. Average Rating Given */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums flex items-baseline gap-1">
            <span>{analytics.averageRating ? analytics.averageRating : '—'}</span>
            {analytics.averageRating && <span className="text-xs text-amber-400 font-normal">/ 5 ★</span>}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {analytics.totalRatingsGiven} {analytics.totalRatingsGiven === 1 ? 'review given' : 'reviews given'}
          </div>
        </div>

        {/* 3. Most Watched Genre */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Genre</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white truncate">
            {analytics.mostWatchedGenre || 'Cinema'}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Favorite category
          </div>
        </div>

        {/* 4. Preferred Language */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Preferred Language</span>
            <Languages className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white truncate">
            {analytics.preferredLanguage || 'All'}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Most booked language
          </div>
        </div>

        {/* 5. Most Active Period */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Show Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-white truncate pt-1">
            {analytics.mostActivePeriod}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Preferred theatre slot
          </div>
        </div>

        {/* 6. Canteen Orders */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Canteen Orders</span>
            <Popcorn className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {analytics.canteenOrdersCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Snack orders placed
          </div>
        </div>

        {/* 7. Total Movie Spending */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Movie Tickets</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
            ₹{analytics.totalMovieSpending.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {bookings.length} {bookings.length === 1 ? 'reservation' : 'reservations'}
          </div>
        </div>

        {/* 8. Total Canteen Spending */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Canteen Spending</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
            ₹{analytics.totalCanteenSpending.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Concession spend
          </div>
        </div>
      </div>

      {/* Visual Analytics Cards: Genre Breakdown & Spending Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Genre Breakdown Progress Bars */}
        <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Genre Breakdown</span>
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Watched Genres</span>
          </div>

          {analytics.genreBreakdown.length === 0 ? (
            <p className="text-xs text-zinc-500">No genres logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {analytics.genreBreakdown.map((item) => (
                <div key={item.genre} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">{item.genre}</span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {item.count} {item.count === 1 ? 'movie' : 'movies'} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                      style={{ width: `${Math.max(10, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Distribution Breakdown */}
        <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Your Star Rating Habits</span>
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Ratings Log</span>
          </div>

          <div className="space-y-2">
            {analytics.ratingBreakdown.map((r) => {
              const maxCount = Math.max(...analytics.ratingBreakdown.map((x) => x.count), 1);
              const barWidth = Math.round((r.count / maxCount) * 100);

              return (
                <div key={r.stars} className="flex items-center gap-2 text-xs">
                  <div className="w-10 text-zinc-400 font-mono flex items-center gap-0.5">
                    <span>{r.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: r.count > 0 ? `${Math.max(15, barWidth)}%` : '0%' }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px] text-zinc-400">
                    {r.count}
                  </span>
                </div>
              );
            })}
          </div>

          {analytics.totalRatingsGiven === 0 && (
            <p className="text-[11px] text-zinc-500 text-center pt-2">
              Mark past movies as watched to rate them and populate this breakdown.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
