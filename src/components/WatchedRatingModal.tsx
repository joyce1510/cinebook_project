import React, { useState } from 'react';
import { Booking } from '../types';
import { PosterArtwork } from './PosterArtwork';
import { Star, X, Film, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

interface WatchedRatingModalProps {
  unratedBookings: Booking[];
  onSubmitRating: (bookingId: string, rating: number, review: string) => void;
  onMaybeLater: (bookingId: string) => void;
}

export const WatchedRatingModal: React.FC<WatchedRatingModalProps> = ({
  unratedBookings,
  onSubmitRating,
  onMaybeLater
}) => {
  // Show one unrated movie at a time
  const currentBooking = unratedBookings[0];

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!currentBooking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please tap a star to select a rating (1 to 5 stars).');
      return;
    }
    onSubmitRating(currentBooking.id, rating, review.trim());
    // Reset local inputs for potential next unrated booking in the queue
    setRating(0);
    setHoverRating(0);
    setReview('');
    setError(null);
  };

  const handleSkip = () => {
    onMaybeLater(currentBooking.id);
    setRating(0);
    setHoverRating(0);
    setReview('');
    setError(null);
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return 'Masterpiece! Loved every second 🌟';
      case 4:
        return 'Great movie! Highly recommended 👍';
      case 3:
        return 'Good watch, enjoyed it! 🍿';
      case 2:
        return 'Just okay, had some flaws 🤔';
      case 1:
        return 'Disappointed, not my taste 👎';
      default:
        return 'Select your rating';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Glow backdrop effect */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">🎬</span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                How was your movie?
              </h3>
              <p className="text-xs text-amber-400/90 font-medium">
                Your recent movie is waiting for a rating!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unratedBookings.length > 1 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                1 of {unratedBookings.length}
              </span>
            )}
            <button
              onClick={handleSkip}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Maybe Later"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Movie Info & Rating Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
          <div className="flex gap-4 items-center bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3.5">
            <div className="w-16 h-24 shrink-0 rounded-xl overflow-hidden shadow-lg border border-zinc-700/60">
              <PosterArtwork movie={currentBooking.movie} size="sm" className="w-full h-full" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
                Marked as Watched
              </span>
              <h4 className="text-base font-extrabold text-white tracking-tight">
                {currentBooking.movie.title}
              </h4>
              <p className="text-xs text-zinc-400">
                {currentBooking.theatre.name} · {currentBooking.theatre.screen}
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                {currentBooking.date} at {currentBooking.time} · {currentBooking.seats.length} {currentBooking.seats.length === 1 ? 'ticket' : 'tickets'}
              </p>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center py-2 space-y-2 bg-zinc-950/40 rounded-2xl border border-zinc-800/50 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Rate Your Theatrical Experience
            </span>

            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    type="button"
                    key={starValue}
                    onClick={() => {
                      setRating(starValue);
                      setError(null);
                    }}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-xl hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                    title={`${starValue} Star${starValue > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-medium text-amber-300/90 h-5">
              {(hoverRating || rating) > 0 ? getRatingLabel(hoverRating || rating) : 'Click to rate 1 to 5 stars'}
            </div>
          </div>

          {/* Optional Review Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Short Review
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you think of the direction, music, performances, or climax? Write a few words..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none transition-all"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Rating</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
