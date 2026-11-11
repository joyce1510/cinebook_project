import { Movie, Booking } from '../types';

export interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  queryLabel: string;
  description: string;
  movieIds: string[];
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    queryLabel: 'Feeling Happy? 😊',
    description: 'Uplifting, heartwarming films to keep your spirits soaring',
    movieIds: ['elemental', 'doraemon-art-world-tales', 'tangled', 'geetha-govindam', 'remo', 'hi-nanna']
  },
  {
    id: 'fun',
    emoji: '😂',
    label: 'Fun',
    queryLabel: 'In the mood for Fun? 😂',
    description: 'Hilarious punchlines, laugh-out-loud moments & breezy comedies',
    movieIds: ['doraemon-art-world-tales', 'spiderman-no-way-home', 'remo', 'geetha-govindam', 'tangled']
  },
  {
    id: 'emotional',
    emoji: '🥹',
    label: 'Emotional',
    queryLabel: 'Feeling Emotional? 🥹',
    description: 'Profound human connections, heartwarming tears & timeless bonds',
    movieIds: ['sita-ramam', 'amaran', 'hi-nanna', 'vaaranam-aayiram', 'minmini', 'the-chosen']
  },
  {
    id: 'thriller',
    emoji: '😱',
    label: 'Thriller',
    queryLabel: 'Craving a Thriller? 😱',
    description: 'Nail-biting suspense, eerie paranormal horrors & edge-of-seat mysteries',
    movieIds: ['the-conjuring', 'doctor-strange-multiverse', 'avengers-age-of-ultron', 'avengers-endgame']
  },
  {
    id: 'romantic',
    emoji: '❤️',
    label: 'Romantic',
    queryLabel: 'Feeling Romantic? ❤️',
    description: 'Enchanting love letters, breezy heartbeats & classic chemistry',
    movieIds: ['sita-ramam', 'elemental', 'remo', 'hi-nanna', 'vaaranam-aayiram', 'geetha-govindam']
  },
  {
    id: 'excited',
    emoji: '⚡',
    label: 'Excited',
    queryLabel: 'Pumped Up & Excited? ⚡',
    description: 'High-octane mass action, roar-worthy heroics & adrenaline rushes',
    movieIds: ['spiderman-no-way-home', 'avengers-age-of-ultron', 'avengers-endgame', 'doctor-strange-multiverse', 'amaran']
  },
  {
    id: 'chill',
    emoji: '🧘',
    label: 'Chill',
    queryLabel: 'Looking to Chill? 🧘',
    description: 'Scenic journeys, soul-soothing acoustics & relaxing escapes',
    movieIds: ['elemental', 'minmini', 'doraemon-art-world-tales', 'tangled', 'vaaranam-aayiram', 'hi-nanna']
  }
];

export interface SeatRecommendationRequest {
  ticketCount: number;
  preferredArea: 'front' | 'middle' | 'back';
  preference: 'best_view' | 'more_privacy' | 'normal';
}

export interface SeatRecommendationResult {
  seats: string[];
  explanation: string;
  category: 'Premium' | 'Regular';
  rowName: string;
}

/**
 * Smart Seat Recommendation Engine
 */
export function findBestSeats(
  request: SeatRecommendationRequest,
  bookedSeats: Set<string>
): SeatRecommendationResult | null {
  const { ticketCount, preferredArea, preference } = request;

  // Row mapping based on area
  const areaRows: Record<'front' | 'middle' | 'back', string[]> = {
    front: ['A', 'B', 'C'], // A & B are Premium recliners, C is front Regular
    middle: ['D', 'E'],      // Prime center regular
    back: ['F', 'G', 'H']    // Back elevated regular
  };

  const primaryRows = areaRows[preferredArea] || ['D', 'E'];
  const allRowsOrdered = ['D', 'E', 'F', 'G', 'H', 'C', 'B', 'A'];

  // Columns preference priority
  // Total columns are 1 to 14
  // Center is around 7-8
  const centerCols = [7, 8, 6, 9, 5, 10];
  const privacyCols = [1, 2, 13, 14, 3, 4, 11, 12];
  const normalCols = [6, 7, 8, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14];

  // Search candidate rows
  const candidateRows = [...primaryRows, ...allRowsOrdered.filter((r) => !primaryRows.includes(r))];

  for (const row of candidateRows) {
    const isPremium = row === 'A' || row === 'B';
    const totalCols = 14;

    // Check possible consecutive starting columns: c from 1 to 14 - ticketCount + 1
    const validSpans: { startCol: number; seats: string[]; score: number }[] = [];

    for (let c = 1; c <= totalCols - ticketCount + 1; c++) {
      const spanSeats: string[] = [];
      let allAvailable = true;

      for (let i = 0; i < ticketCount; i++) {
        const colNum = c + i;
        const seatId = `${row}${colNum}`;
        if (bookedSeats.has(seatId)) {
          allAvailable = false;
          break;
        }
        spanSeats.push(seatId);
      }

      if (allAvailable) {
        // Compute alignment score
        const spanCenter = c + (ticketCount - 1) / 2;
        let score = 0;

        if (preference === 'best_view') {
          // Center preference (7.5 is ideal center)
          score = -Math.abs(spanCenter - 7.5);
        } else if (preference === 'more_privacy') {
          // Edge preference (closer to 1 or 14)
          const distToLeft = Math.abs(spanCenter - 1);
          const distToRight = Math.abs(spanCenter - 14);
          score = -Math.min(distToLeft, distToRight);
        } else {
          // Normal balanced score
          score = -Math.abs(spanCenter - 7.5) * 0.5;
        }

        // Slight bonus if row matches preferred area exactly
        if (primaryRows.includes(row)) {
          score += 10;
        }

        validSpans.push({ startCol: c, seats: spanSeats, score });
      }
    }

    if (validSpans.length > 0) {
      // Pick best span in this row
      validSpans.sort((a, b) => b.score - a.score);
      const best = validSpans[0];

      let explanation = '';
      if (preference === 'best_view') {
        explanation = `Center position with a balanced screen view and optimal viewing symmetry.`;
      } else if (preference === 'more_privacy') {
        explanation = `Corner edge position offering maximum privacy with quick aisle access.`;
      } else {
        explanation = `Comfortable ${preferredArea} section seating with generous sightlines.`;
      }

      if (isPremium) {
        explanation += ` Includes luxury premium recliner leatherette comfort.`;
      }

      return {
        seats: best.seats,
        explanation,
        category: isPremium ? 'Premium' : 'Regular',
        rowName: row
      };
    }
  }

  return null;
}

export interface RecommendationReason {
  reason: string;
  isFallback: boolean;
  highlightTag?: string;
}

/**
 * Generate "Why You Might Like This" explanation for a movie card
 */
export function getWhyYouMightLikeThis(
  targetMovie: Movie,
  bookings: Booking[]
): RecommendationReason {
  // If user has zero ratings or bookings
  if (!bookings || bookings.length === 0) {
    return {
      reason: 'Rate a few more movies to get personalized recommendations.',
      isFallback: true
    };
  }

  // 1. Look for highly rated movies (rating >= 4 or 5)
  const ratedBookings = bookings.filter((b) => typeof b.rating === 'number' && b.rating >= 4);

  if (ratedBookings.length > 0) {
    // Check if there is a rated movie with overlapping genre or language
    for (const rb of ratedBookings) {
      // Find common genres
      const commonGenres = targetMovie.genres.filter((g) => rb.movie.genres.includes(g));
      const commonLanguages = targetMovie.languages.filter((l) => rb.movie.languages.includes(l));

      if (commonGenres.length > 0 && commonLanguages.length > 0) {
        const genreStr = commonGenres.slice(0, 2).join(' & ').toLowerCase();
        const langStr = commonLanguages[0];
        return {
          reason: `You rated ${rb.movie.title} highly and often choose ${langStr} ${genreStr} movies.`,
          isFallback: false,
          highlightTag: `Because you liked ${rb.movie.title}`
        };
      }
    }

    // Check language match with top rated
    for (const rb of ratedBookings) {
      const commonLanguages = targetMovie.languages.filter((l) => rb.movie.languages.includes(l));
      if (commonLanguages.length > 0) {
        return {
          reason: `You rated ${rb.movie.title} ${rb.rating}★ and usually enjoy ${commonLanguages[0]} movies with high ratings.`,
          isFallback: false,
          highlightTag: `${commonLanguages[0]} Cinema`
        };
      }
    }

    // Check genre match with top rated
    for (const rb of ratedBookings) {
      const commonGenres = targetMovie.genres.filter((g) => rb.movie.genres.includes(g));
      if (commonGenres.length > 0) {
        return {
          reason: `You enjoyed ${rb.movie.title} and share a strong taste for ${commonGenres[0]} narratives.`,
          isFallback: false,
          highlightTag: `Matches your ${commonGenres[0]} preference`
        };
      }
    }
  }

  // 2. Fall back to watched or booked movies if rating is not yet given
  const anyBookings = bookings.filter((b) => b.movie.id !== targetMovie.id);
  if (anyBookings.length > 0) {
    const recentBooking = anyBookings[0];
    const commonLanguages = targetMovie.languages.filter((l) =>
      recentBooking.movie.languages.includes(l)
    );
    if (commonLanguages.length > 0) {
      return {
        reason: `You usually enjoy ${commonLanguages[0]} movies with high ratings.`,
        isFallback: false,
        highlightTag: `Curated for you`
      };
    }
  }

  return {
    reason: 'Rate a few more movies to get personalized recommendations.',
    isFallback: true
  };
}

export interface UserMovieAnalytics {
  moviesWatchedCount: number;
  totalRatingsGiven: number;
  averageRating: string | null;
  mostWatchedGenre: string | null;
  preferredLanguage: string | null;
  mostActivePeriod: string | null;
  canteenOrdersCount: number;
  totalMovieSpending: number;
  totalCanteenSpending: number;
  genreBreakdown: { genre: string; count: number; percent: number }[];
  ratingBreakdown: { stars: number; count: number }[];
  hasEnoughData: boolean;
}

/**
 * Calculates personal analytics from bookings and canteen orders
 */
export function calculateMovieAnalytics(
  bookings: Booking[],
  canteenOrders: any[]
): UserMovieAnalytics {
  const watchedBookings = bookings.filter((b) => Boolean(b.isWatched));
  const ratedBookings = bookings.filter(
    (b) => typeof b.rating === 'number' && b.rating > 0
  );

  const moviesWatchedCount = watchedBookings.length;
  const totalRatingsGiven = ratedBookings.length;

  let averageRating: string | null = null;
  if (ratedBookings.length > 0) {
    const sumRatings = ratedBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
    averageRating = (sumRatings / ratedBookings.length).toFixed(1);
  }

  // Genre frequency
  const genreCounts: Record<string, number> = {};
  (watchedBookings.length > 0 ? watchedBookings : bookings).forEach((b) => {
    b.movie.genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const mostWatchedGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : null;

  // Language frequency
  const langCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    b.movie.languages.forEach((l) => {
      langCounts[l] = (langCounts[l] || 0) + 1;
    });
  });
  const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  const preferredLanguage = sortedLangs.length > 0 ? sortedLangs[0][0] : null;

  // Most active show period
  const periodCounts: Record<string, number> = {
    'Morning (before 12 PM)': 0,
    'Matinee (12 PM - 04 PM)': 0,
    'Evening (04 PM - 08 PM)': 0,
    'Night (after 08 PM)': 0
  };

  bookings.forEach((b) => {
    const timeStr = b.time || '';
    if (timeStr.includes('AM')) {
      periodCounts['Morning (before 12 PM)']++;
    } else {
      const hour = parseInt(timeStr.split(':')[0], 10) || 6;
      if (hour === 12 || hour < 4) {
        periodCounts['Matinee (12 PM - 04 PM)']++;
      } else if (hour >= 4 && hour < 8) {
        periodCounts['Evening (04 PM - 08 PM)']++;
      } else {
        periodCounts['Night (after 08 PM)']++;
      }
    }
  });

  const sortedPeriods = Object.entries(periodCounts).sort((a, b) => b[1] - a[1]);
  const mostActivePeriod =
    sortedPeriods.length > 0 && sortedPeriods[0][1] > 0
      ? sortedPeriods[0][0]
      : 'Evening (05:00 PM - 09:00 PM)';

  // Canteen counts & spendings
  const canteenOrdersCount = (canteenOrders?.length || 0) + bookings.filter(b => (b.canteenTotal || 0) > 0).length;

  const totalMovieSpending = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  const directCanteenSpending = (canteenOrders || []).reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );
  const ticketCanteenSpending = bookings.reduce(
    (sum, b) => sum + (b.canteenTotal || 0),
    0
  );
  const totalCanteenSpending = directCanteenSpending + ticketCanteenSpending;

  // Genre breakdown with percentages
  const totalGenreHits = Object.values(genreCounts).reduce((s, c) => s + c, 0) || 1;
  const genreBreakdown = sortedGenres.slice(0, 5).map(([genre, count]) => ({
    genre,
    count,
    percent: Math.round((count / totalGenreHits) * 100)
  }));

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratedBookings.filter((b) => b.rating === stars).length
  }));

  const hasEnoughData = bookings.length > 0;

  return {
    moviesWatchedCount,
    totalRatingsGiven,
    averageRating,
    mostWatchedGenre,
    preferredLanguage,
    mostActivePeriod,
    canteenOrdersCount,
    totalMovieSpending,
    totalCanteenSpending,
    genreBreakdown,
    ratingBreakdown,
    hasEnoughData
  };
}
