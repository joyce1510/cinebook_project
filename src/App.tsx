/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Movie, Theatre, TicketCategory, Booking, AppliedOffer, CanteenItem, UnlockedReward, CanteenOrder, AppView } from './types';
import { MOVIES, THEATRES, TICKET_PRICING, getMovieById } from './data/movies';
import { Navbar } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { BookingView } from './components/BookingView';
import { PaymentModal } from './components/PaymentModal';
import { TicketConfirmation } from './components/TicketConfirmation';
import { MyBookingsModal } from './components/MyBookingsModal';
import { OffersModal } from './components/OffersModal';
import { OffersSection } from './components/OffersSection';
import { CanteenFoodSection } from './components/CanteenFoodSection';
import { WatchedRatingModal } from './components/WatchedRatingModal';
import { CanteenOrderConfirmationModal } from './components/CanteenOrderConfirmationModal';
import { MoodRecommendationSection } from './components/MoodRecommendationSection';
import { AIAssistant } from './components/AIAssistant';
import { WelcomePage } from './components/WelcomePage';
import { WatchlistPage } from './components/WatchlistPage';
import { BookingsDashboard } from './components/BookingsDashboard';
import { TicketVerificationPage } from './components/TicketVerificationPage';
import { CineBotWelcomeModal } from './components/CineBotWelcomeModal';
import { InteractiveTour } from './components/InteractiveTour';
import {
  AdvancedMovieFilters,
  MovieFilterState,
  INITIAL_MOVIE_FILTERS,
  applyMovieFilters
} from './components/AdvancedMovieFilters';
import { PersonalizedRecommendations } from './components/PersonalizedRecommendations';
import { MOOD_OPTIONS } from './utils/recommendations';
import {
  Search,
  Filter,
  Film,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CheckCircle2,
  Tv,
  Volume2,
  X,
  Layers,
  ChevronRight,
  Info,
  Gift,
  Popcorn,
  ArrowLeft,
  Star,
  Heart
} from 'lucide-react';

export type { AppView };

export default function App() {
  // Verification URL query state for real-time QR ticket gate validation
  const [verifyParams, setVerifyParams] = useState<{ id: string; token: string }>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const parseQuery = (q: string) => {
        const clean = q.replace(/^[#?]/, '').replace(/^[^?]*\?/, '');
        const params = new URLSearchParams(clean);
        return {
          id: params.get('id') || '',
          token: params.get('token') || ''
        };
      };
      if (hash.toLowerCase().startsWith('#verify')) {
        return parseQuery(hash);
      }
      if (window.location.pathname.startsWith('/verify') || search.includes('token=')) {
        return parseQuery(search);
      }
    }
    return { id: '', token: '' };
  });

  // Navigation / View state with URL hash synchronization for refresh and browser back/forward
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#verify') || window.location.pathname.startsWith('/verify')) return 'verify';
      if (hash === '#watchlist') return 'watchlist';
      if (hash === '#bookings') return 'bookings';
      if (hash === '#movies') return 'movies';
      if (hash === '#canteen') return 'canteen';
      if (
        hash === '#home' ||
        hash === '#theatres' ||
        hash === '#pricing' ||
        hash === '#offers' ||
        hash.startsWith('#movie/')
      ) {
        return 'home';
      }
    }
    return 'welcome';
  });

  // Watchlist state with localStorage persistence
  const [watchlistMovieIds, setWatchlistMovieIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinebook_watchlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse watchlist', e);
    }
    return ['amaran', 'spiderman-no-way-home'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinebook_watchlist', JSON.stringify(watchlistMovieIds));
    } catch (e) {
      console.error('Failed to persist watchlist', e);
    }
  }, [watchlistMovieIds]);

  const handleToggleWatchlist = (movieId: string) => {
    setWatchlistMovieIds((prev) => {
      const exists = prev.includes(movieId);
      const updated = exists ? prev.filter((id) => id !== movieId) : [...prev, movieId];
      const movie = getMovieById(movieId);
      const title = movie ? movie.title : 'Movie';
      showToast(exists ? `Removed "${title}" from Watchlist` : `Added "${title}" to Watchlist ❤️`);
      return updated;
    });
  };

  const handleClearWatchlist = () => {
    setWatchlistMovieIds([]);
    showToast('Watchlist cleared');
  };

  const watchlistMovies = useMemo(() => {
    return MOVIES.filter((m) => watchlistMovieIds.includes(m.id));
  }, [watchlistMovieIds]);

  // Advanced Movie Filters state
  const [movieFilters, setMovieFilters] = useState<MovieFilterState>(INITIAL_MOVIE_FILTERS);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.toLowerCase().startsWith('#movie/')) {
        const movieId = hash.slice(7);
        return getMovieById(movieId) || null;
      }
    }
    return null;
  });
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [myBookingsTab, setMyBookingsTab] = useState<'tickets' | 'canteen' | 'insights'>('tickets');
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  // CineBot Onboarding & Interactive Guided Tour State
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.toLowerCase().startsWith('#verify') || window.location.pathname.startsWith('/verify')) {
        return false;
      }
      try {
        const status = localStorage.getItem('cinebook_onboarding_status');
        return !status; // Show popup only if never completed or skipped
      } catch {
        return false;
      }
    }
    return false;
  });

  const [isTourActive, setIsTourActive] = useState(false);
  const [cinebotQuery, setCinebotQuery] = useState<string | null>(null);
  const [isCinebotOpen, setIsCinebotOpen] = useState(false);

  // Mood-Based Movie Recommendation state
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);

  // Canteen Order state
  const [confirmedCanteenOrder, setConfirmedCanteenOrder] = useState<CanteenOrder | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const searchRef = useRef<HTMLInputElement>(null);

  // Creative Featured-Movie Spotlight state for the Homepage Hero
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightMovies = useMemo(() => {
    return [
      MOVIES.find((m) => m.id === 'spiderman-no-way-home') || MOVIES[0],
      MOVIES.find((m) => m.id === 'elemental') || MOVIES[1],
      MOVIES.find((m) => m.id === 'amaran') || MOVIES[2],
      MOVIES.find((m) => m.id === 'avengers-age-of-ultron') || MOVIES[3]
    ];
  }, []);
  const activeSpotlight = spotlightMovies[spotlightIndex] || spotlightMovies[0];

  // Stored Bookings in localStorage with single consistent source of truth
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      // 1. Check primary key
      const saved = localStorage.getItem('cinebook_bookings');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((b: Booking) => {
            if (b.id === 'CB-GAT-942180') {
              return {
                ...b,
                verificationHash: b.verificationHash || '3556f8a3d55f2d31',
                verificationToken: b.verificationToken || 'cb_tok_gat942180_3556f8a3d55f2d31'
              };
            }
            return b;
          });
        }
      }

      // 2. Check legacy keys if user had bookings stored under an older key
      const legacyKeys = ['bookings', 'cinebook_booking_history', 'booking_history', 'movie_bookings'];
      for (const legacyKey of legacyKeys) {
        const legacyVal = localStorage.getItem(legacyKey);
        if (legacyVal !== null) {
          try {
            const parsed = JSON.parse(legacyVal);
            if (Array.isArray(parsed)) {
              localStorage.setItem('cinebook_bookings', JSON.stringify(parsed));
              localStorage.removeItem(legacyKey);
              return parsed;
            }
          } catch {
            // Ignore malformed legacy data
          }
        }
      }

      // 3. If user has already visited/initialized or previously cleared bookings, keep it empty
      const isInitialized = localStorage.getItem('cinebook_bookings_initialized');
      if (isInitialized) {
        return [];
      }
    } catch (e) {
      console.error('Failed to parse saved bookings', e);
      return [];
    }

    // 4. Default initial booking ONLY on very first fresh launch before any clearing/user action
    const defaultBooking: Booking = {
      id: 'CB-GAT-942180',
      movie: getMovieById('gatta-kushti-2') || MOVIES[0], // Gatta Kusthi 2 (archived record)
      theatre: THEATRES[0],
      date: 'Yesterday',
      time: '06:30 PM',
      seats: ['F4', 'F5'],
      categoryBreakdown: [
        { category: 'Regular', count: 2, price: 190, subtotal: 380 }
      ],
      subtotal: 380,
      convenienceFee: 38,
      gst: 7,
      totalAmount: 425,
      bookedAt: new Date(Date.now() - 86400000).toISOString(),
      paymentMethod: 'UPI (GPay)',
      isWatched: true,
      verificationHash: '3556f8a3d55f2d31',
      verificationToken: 'cb_tok_gat942180_3556f8a3d55f2d31'
    };

    try {
      localStorage.setItem('cinebook_bookings', JSON.stringify([defaultBooking]));
      localStorage.setItem('cinebook_bookings_initialized', 'true');
    } catch (e) {
      console.error('Failed to initialize bookings storage', e);
    }

    return [defaultBooking];
  });

  // Stored Canteen Orders in localStorage
  const [canteenOrders, setCanteenOrders] = useState<CanteenOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cinebook_canteen_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved canteen orders', e);
    }
    return [
      {
        id: 'FD-718294',
        items: [
          {
            id: 'popcorn',
            name: 'Popcorn',
            category: 'Snacks',
            price: 80,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'coca-cola',
            name: 'Coca-Cola',
            category: 'Drinks',
            price: 50,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'
          }
        ],
        totalAmount: 260,
        status: 'Preparing',
        estimatedTime: '10 - 15 mins',
        orderedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        pickupCounter: 'Express Counter 2'
      }
    ];
  });

  // Persist canteen orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinebook_canteen_orders', JSON.stringify(canteenOrders));
    } catch (e) {
      console.error('Failed to store canteen orders', e);
    }
  }, [canteenOrders]);

  // Watched & Rating Prompt tracking (show unrated movies one at a time)
  const [snoozedRatingIds, setSnoozedRatingIds] = useState<string[]>([]);

  const unratedBookings = useMemo(() => {
    return bookings.filter(
      (b) => Boolean(b.isWatched) && (!b.rating || b.rating === 0) && !snoozedRatingIds.includes(b.id)
    );
  }, [bookings, snoozedRatingIds]);

  const handleSubmitRating = (bookingId: string, rating: number, review: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              rating,
              review: review || undefined,
              ratedAt: new Date().toISOString()
            }
          : b
      );
      try {
        localStorage.setItem('cinebook_bookings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save rating in localStorage', err);
      }
      return updated;
    });
    showToast(`⭐ Thank you! Your ${rating}-star rating has been recorded.`);
  };

  const handleMaybeLater = (bookingId: string) => {
    setSnoozedRatingIds((prev) => [...prev, bookingId]);
  };

  const handleMarkAsWatched = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              isWatched: true,
              watchedAt: new Date().toISOString()
            }
          : b
      );
      try {
        localStorage.setItem('cinebook_bookings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save watched status', err);
      }
      return updated;
    });
    showToast('🎬 Marked as Watched! Share your review & rating.');
  };

  const handleCanteenOrderPlaced = (order: CanteenOrder) => {
    setCanteenOrders((prev) => [order, ...prev]);
    setConfirmedCanteenOrder(order);
    showToast(`🍿 Order #${order.id} confirmed! Kitchen is preparing your food.`);
  };

  const handleClearCanteenOrders = () => {
    setCanteenOrders([]);
    try {
      localStorage.removeItem('cinebook_canteen_orders');
    } catch (e) {
      console.error(e);
    }
    showToast('Canteen order history cleared.');
  };

  const handleNavigateHome = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setSelectedMoodId(null);
    setCurrentView('home');
    if (typeof window !== 'undefined' && window.location.hash !== '#home') {
      window.location.hash = '#home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWelcome = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setSelectedMoodId(null);
    setCurrentView('welcome');
    if (typeof window !== 'undefined' && window.location.hash !== '#welcome' && window.location.hash !== '') {
      window.location.hash = '#welcome';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateMovies = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setCurrentView('movies');
    if (typeof window !== 'undefined' && window.location.hash !== '#movies') {
      window.location.hash = '#movies';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWatchlist = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setCurrentView('watchlist');
    if (typeof window !== 'undefined' && window.location.hash !== '#watchlist') {
      window.location.hash = '#watchlist';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBookings = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setCurrentView('bookings');
    if (typeof window !== 'undefined' && window.location.hash !== '#bookings') {
      window.location.hash = '#bookings';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCanteen = () => {
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setCurrentView('canteen');
    if (typeof window !== 'undefined' && window.location.hash !== '#canteen') {
      window.location.hash = '#canteen';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CineBot Tour & Assistant Handlers
  const handleStartTour = () => {
    setShowWelcomeModal(false);
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setIsTourActive(true);
    if (currentView !== 'welcome') {
      setCurrentView('welcome');
      if (typeof window !== 'undefined') window.location.hash = '#welcome';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatWithCineBot = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('cinebook_onboarding_status', 'skipped');
    } catch (e) {
      console.error(e);
    }
    setIsCinebotOpen(true);
    setCinebotQuery('Hey CineBot! 👋 Can you help me discover CineBook?');
  };

  const handleSkipWelcomeModal = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('cinebook_onboarding_status', 'skipped');
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinishTour = () => {
    setIsTourActive(false);
    try {
      localStorage.setItem('cinebook_onboarding_status', 'completed');
    } catch (e) {
      console.error(e);
    }
    showToast('🎉 Guided tour completed! CineBot is always here to help.');
  };

  const handleSkipTour = () => {
    setIsTourActive(false);
    try {
      localStorage.setItem('cinebook_onboarding_status', 'completed');
    } catch (e) {
      console.error(e);
    }
    showToast('Tour skipped. Click "Guided Tour" in the top bar anytime to restart!');
  };

  const handleRestartTour = () => {
    setIsMyBookingsOpen(false);
    setIsOffersModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedMovie(null);
    setConfirmedBooking(null);
    setCurrentView('welcome');
    if (typeof window !== 'undefined') window.location.hash = '#welcome';
    setIsTourActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCineBotHelp = (query: string) => {
    setIsCinebotOpen(true);
    setCinebotQuery(query);
  };

  // Pending payment payload
  const [pendingPayment, setPendingPayment] = useState<{
    movie: Movie;
    theatre: Theatre;
    dateStr: string;
    timeStr: string;
    selectedSeats: string[];
    categoryBreakdown: {
      category: TicketCategory;
      count: number;
      price: number;
      subtotal: number;
    }[];
    subtotal: number;
    convenienceFee: number;
    gst: number;
    totalAmount: number;
    canteenItems?: { item: CanteenItem; count: number }[];
    canteenTotal?: number;
    appliedOffer?: AppliedOffer | null;
    unlockedRewards?: UnlockedReward[];
    holdToken?: string;
    expiresAt?: number;
  } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Persist bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinebook_bookings', JSON.stringify(bookings));
      localStorage.setItem('cinebook_bookings_initialized', 'true');
      ['bookings', 'cinebook_booking_history', 'booking_history', 'movie_bookings'].forEach((k) => {
        localStorage.removeItem(k);
      });
    } catch (e) {
      console.error('Failed to store bookings', e);
    }
  }, [bookings]);

  // Filter movies with multi-facet filters and mood matching
  const filteredMovies = useMemo(() => {
    const baseFiltered = applyMovieFilters(MOVIES, movieFilters);
    if (!selectedMoodId) return baseFiltered;
    const activeMood = MOOD_OPTIONS.find((m) => m.id === selectedMoodId);
    if (!activeMood) return baseFiltered;
    return baseFiltered.filter((m) => activeMood.movieIds.includes(m.id));
  }, [movieFilters, selectedMoodId]);

  // Handle movie selection
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setConfirmedBooking(null);
    setCurrentView('home');
    if (typeof window !== 'undefined' && window.location.hash !== `#movie/${movie.id}`) {
      window.location.hash = `#movie/${movie.id}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize browser history and hash changes for refresh and back/forward navigation
  useEffect(() => {
    const handleHashSync = () => {
      const rawHash = window.location.hash || '';
      const hash = rawHash.toLowerCase();
      if (hash.startsWith('#verify') || window.location.pathname.startsWith('/verify')) {
        const clean = rawHash.replace(/^[#?]/, '').replace(/^[^?]*\?/, '');
        const params = new URLSearchParams(clean || window.location.search);
        setVerifyParams({
          id: params.get('id') || '',
          token: params.get('token') || ''
        });
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('verify');
      } else if (hash === '#welcome' || !hash) {
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('welcome');
      } else if (hash.startsWith('#movie/')) {
        const movieId = rawHash.slice(7);
        const found = getMovieById(movieId);
        if (found) {
          setSelectedMovie(found);
          setCurrentView('home');
        } else {
          setSelectedMovie(null);
          setCurrentView('home');
        }
      } else if (hash === '#watchlist') {
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('watchlist');
      } else if (hash === '#bookings') {
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('bookings');
      } else if (hash === '#movies') {
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('movies');
      } else if (hash === '#canteen') {
        setSelectedMovie(null);
        setConfirmedBooking(null);
        setCurrentView('canteen');
      } else {
        setSelectedMovie(null);
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleHashSync);
    window.addEventListener('hashchange', handleHashSync);
    return () => {
      window.removeEventListener('popstate', handleHashSync);
      window.removeEventListener('hashchange', handleHashSync);
    };
  }, []);

  // Handle Proceed to Payment from BookingView
  const handleOpenPayment = (payload: {
    movie: Movie;
    theatre: Theatre;
    dateStr: string;
    timeStr: string;
    selectedSeats: string[];
    categoryBreakdown: {
      category: TicketCategory;
      count: number;
      price: number;
      subtotal: number;
    }[];
    subtotal: number;
    convenienceFee: number;
    gst: number;
    totalAmount: number;
    canteenItems?: { item: CanteenItem; count: number }[];
    canteenTotal?: number;
    appliedOffer?: AppliedOffer | null;
    unlockedRewards?: UnlockedReward[];
    holdToken?: string;
    expiresAt?: number;
  }) => {
    setPendingPayment(payload);
    setIsPaymentModalOpen(true);
  };

  // Handle Payment Completion
  const handlePaymentSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setIsPaymentModalOpen(false);
    setPendingPayment(null);
    setConfirmedBooking(newBooking);
    showToast(`🎉 Booking Confirmed! ID: ${newBooking.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick focus search helper
  const focusSearch = () => {
    setCurrentView('home');
    if (selectedMovie || confirmedBooking) {
      setSelectedMovie(null);
      setConfirmedBooking(null);
    }
    setTimeout(() => {
      searchRef.current?.focus();
      searchRef.current?.select();
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  // Keyboard shortcut listener for Ctrl+K, Cmd+K, and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      const isSlash =
        e.key === '/' &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        );

      if (isCtrlOrCmdK || isSlash) {
        e.preventDefault();
        focusSearch();
      }

      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMovie, confirmedBooking]);

  // Clear all bookings
  const handleClearBookings = () => {
    let confirmed = true;
    try {
      confirmed = window.confirm('Are you sure you want to clear your booking history?');
    } catch {
      confirmed = true;
    }
    if (!confirmed) return;

    try {
      // 1. Remove actual stored movie booking history from localStorage
      localStorage.setItem('cinebook_bookings', JSON.stringify([]));
      ['bookings', 'cinebook_booking_history', 'booking_history', 'movie_bookings'].forEach((k) => {
        localStorage.removeItem(k);
      });
      localStorage.setItem('cinebook_bookings_initialized', 'true');
      // Local history is cleared without affecting shared server records
    } catch (e) {
      console.error('Failed to clear bookings from localStorage', e);
    }

    // 2. Clear React state immediately
    setBookings([]);
    setSnoozedRatingIds([]);
    setConfirmedBooking(null);

    // 3. Feedback toast
    showToast('Booking history cleared');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Bar Navigation */}
      <Navbar
        bookingCount={bookings.length}
        watchlistCount={watchlistMovieIds.length}
        canteenOrderCount={canteenOrders.length}
        onOpenMyBookings={() => {
          setMyBookingsTab('tickets');
          setIsMyBookingsOpen(true);
        }}
        onOpenInsights={() => {
          setMyBookingsTab('insights');
          setIsMyBookingsOpen(true);
        }}
        onNavigateHome={handleNavigateHome}
        onNavigateWelcome={handleNavigateWelcome}
        onNavigateMovies={handleNavigateMovies}
        onNavigateWatchlist={handleNavigateWatchlist}
        onNavigateBookings={handleNavigateBookings}
        currentView={currentView}
        onNavigateCanteen={handleNavigateCanteen}
        onFocusSearch={focusSearch}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onStartTour={handleRestartTour}
      />

      {/* CineBot First-Time Visitor Welcome Popup */}
      <CineBotWelcomeModal
        isOpen={showWelcomeModal}
        onStartTour={handleStartTour}
        onChatWithCineBot={handleChatWithCineBot}
        onSkip={handleSkipWelcomeModal}
      />

      {/* CineBot 11-Step Interactive Guided Website Tour */}
      <InteractiveTour
        isActive={isTourActive}
        onFinishTour={handleFinishTour}
        onSkipTour={handleSkipTour}
        currentView={currentView}
        onNavigateView={(view) => {
          setSelectedMovie(null);
          setConfirmedBooking(null);
          setCurrentView(view);
          if (typeof window !== 'undefined') window.location.hash = `#${view}`;
        }}
        onOpenCineBotChat={handleChatWithCineBot}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-22 right-6 z-50 bg-zinc-900 border border-amber-500/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: BOOKING CONFIRMATION SCREEN */}
        {confirmedBooking ? (
          <div className="py-8">
            <TicketConfirmation
              booking={confirmedBooking}
              onOpenCineBotHelp={handleOpenCineBotHelp}
              onBookAnother={() => {
                setConfirmedBooking(null);
                setSelectedMovie(null);
                setCurrentView('movies');
                if (typeof window !== 'undefined') window.location.hash = '#movies';
              }}
            />
          </div>
        ) : selectedMovie ? (
          /* VIEW 2: MOVIE BOOKING VIEW (SHOWTIMES & SEAT MAP) */
          <BookingView
            movie={selectedMovie}
            existingBookings={bookings}
            isWatchlisted={watchlistMovieIds.includes(selectedMovie.id)}
            onToggleWatchlist={handleToggleWatchlist}
            onOpenCineBotHelp={handleOpenCineBotHelp}
            onBack={() => {
              setSelectedMovie(null);
              if (typeof window !== 'undefined' && window.location.hash.startsWith('#movie/')) {
                window.location.hash = '#home';
              }
            }}
            onProceedToPayment={handleOpenPayment}
          />
        ) : currentView === 'verify' ? (
          /* VIEW 2.5: REAL TURNSTILE TICKET VERIFICATION PAGE */
          <TicketVerificationPage
            bookingId={verifyParams.id}
            token={verifyParams.token}
            onBackToHome={handleNavigateHome}
          />
        ) : currentView === 'welcome' ? (
          /* VIEW 3: SEPARATE CINEMATIC WELCOME PAGE */
          <WelcomePage
            onExplore={handleNavigateHome}
            onSelectMovie={handleSelectMovie}
            onNavigateCanteen={handleNavigateCanteen}
            onOpenOffers={() => setIsOffersModalOpen(true)}
            onOpenMyBookings={handleNavigateBookings}
          />
        ) : currentView === 'watchlist' ? (
          /* VIEW 4: MY WATCHLIST */
          <WatchlistPage
            watchlistMovies={watchlistMovies}
            onSelectMovie={handleSelectMovie}
            onToggleWatchlist={handleToggleWatchlist}
            onClearWatchlist={handleClearWatchlist}
            onExploreMovies={handleNavigateMovies}
          />
        ) : currentView === 'bookings' ? (
          /* VIEW 5: MY BOOKINGS DASHBOARD */
          <BookingsDashboard
            bookings={bookings}
            canteenOrders={canteenOrders}
            onOpenCineBotHelp={handleOpenCineBotHelp}
            onOpenTicket={(b) => {
              setConfirmedBooking(b);
              setSelectedMovie(null);
            }}
            onOpenRateModal={(b) => {
              setSnoozedRatingIds((prev) => prev.filter((id) => id !== b.id));
            }}
            onExploreMovies={handleNavigateMovies}
          />
        ) : currentView === 'canteen' ? (
          /* VIEW 6: DEDICATED CANTEEN VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-zinc-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Popcorn className="w-4 h-4" />
                <span className="tracking-widest uppercase">Cinema Canteen &amp; Smart Combos</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Gourmet Snacks &amp; Refreshments
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Pre-order chef specials, smart combo deals, and beverages for contactless express counter pickup.
              </p>
            </div>
            <CanteenFoodSection onOrderPlaced={handleCanteenOrderPlaced} onOpenCineBotHelp={handleOpenCineBotHelp} />
          </div>
        ) : currentView === 'movies' ? (
          /* VIEW 7: DEDICATED ALL MOVIES CATALOGUE VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
            <div className="pb-4 border-b border-zinc-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Film className="w-4 h-4" />
                <span className="tracking-widest uppercase">All Movies &amp; Shows</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore All Titles
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Browse our complete collection of 16 blockbusters and acclaimed series with multi-facet filters.
              </p>
            </div>

            <PersonalizedRecommendations
              movies={MOVIES}
              watchlistMovieIds={watchlistMovieIds}
              bookings={bookings}
              onSelectMovie={handleSelectMovie}
              onToggleWatchlist={handleToggleWatchlist}
            />

            <AdvancedMovieFilters
              filters={movieFilters}
              onChangeFilters={setMovieFilters}
              totalMoviesCount={MOVIES.length}
              filteredCount={filteredMovies.length}
              onClearAll={() => {
                setMovieFilters(INITIAL_MOVIE_FILTERS);
                setSelectedMoodId(null);
              }}
            />

            {filteredMovies.length === 0 ? (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center">
                <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Movies Match Your Criteria</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your filter settings or resetting filters to view all movies.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMovieFilters(INITIAL_MOVIE_FILTERS);
                    setSelectedMoodId(null);
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Reset Filters ({MOVIES.length} Movies)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelectMovie={handleSelectMovie}
                    bookings={bookings}
                    isWatchlisted={watchlistMovieIds.includes(movie.id)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 4: MAIN MOVIE CATALOGUE & EXPLORER */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Cinematic Featured-Movie Hero Spotlight */}
            <div data-tour="movie-catalogue" className="relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
              {/* Dynamic ambient backdrop illumination tailored to active featured movie */}
              <div
                className="absolute top-0 right-0 -mt-16 -mr-16 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
                style={{ backgroundColor: activeSpotlight.accentColor }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left 7 Columns: Core Cinematic Headlines, Supporting Text & Stats */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <Film className="w-4 h-4" />
                      <span className="tracking-widest uppercase">
                        Cinema Showcase &amp; Instant Booking
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('welcome');
                        if (typeof window !== 'undefined') window.location.hash = '#welcome';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer py-1 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/30"
                      title="Return to Welcome Experience"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                      <span>Welcome Page</span>
                    </button>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    YOUR ULTIMATE CINEMA EXPERIENCE
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                    Discover incredible stories, explore your favourite movies, and book your perfect seat.
                  </p>

                  {/* Direct Action Row */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSelectMovie(activeSpotlight)}
                      data-tour="spotlight-book-btn"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Ticket className="w-4 h-4 text-zinc-950" />
                      <span>Book Seats &middot; {activeSpotlight.title}</span>
                    </button>

                    <button
                      onClick={focusSearch}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Search All {MOVIES.length} Movies</span>
                    </button>
                  </div>

                  {/* Cinema Showcase Quick Stats */}
                  <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-400 border-t border-zinc-800/80">
                    <div>
                      <span className="text-white font-bold block text-sm tabular-nums">{MOVIES.length} Movies</span>
                      <span>Tamil &middot; Telugu &middot; English</span>
                    </div>
                    <div>
                      <span className="text-white font-bold block text-sm tabular-nums">3 Multiplexes</span>
                      <span>IMAX &amp; Dolby Atmos</span>
                    </div>
                    <div>
                      <span className="text-white font-bold block text-sm tabular-nums">2 Tiers</span>
                      <span>Premium &amp; Regular</span>
                    </div>
                  </div>
                </div>

                {/* Right 5 Columns: Creative Featured-Movie Hero Showcase Card */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                  <div className="w-full max-w-sm rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                    {/* Top Tag & Selector Tabs */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Featured Spotlight</span>
                      </div>
                      {/* Spotlight Movie Switcher */}
                      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                        {spotlightMovies.map((m, idx) => (
                          <button
                            key={m.id}
                            onClick={() => setSpotlightIndex(idx)}
                            className={`w-5 h-5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                              spotlightIndex === idx
                                ? 'bg-amber-500 text-zinc-950 shadow-xs'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                            title={`Switch spotlight to ${m.title}`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Movie Content Row */}
                    <div className="flex gap-4 items-start">
                      {/* Poster Thumbnail */}
                      <div
                        onClick={() => handleSelectMovie(activeSpotlight)}
                        className="relative w-24 sm:w-28 aspect-2/3 shrink-0 rounded-xl overflow-hidden border border-zinc-700/80 shadow-md cursor-pointer group-hover:border-amber-500/50 transition-colors"
                      >
                        <img
                          src={activeSpotlight.posterUrl}
                          alt={activeSpotlight.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-bold text-zinc-200">
                          {activeSpotlight.certificate}
                        </div>
                      </div>

                      {/* Movie Details */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div>
                          <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            <span>{activeSpotlight.rating}</span>
                            <span className="text-[10px] text-zinc-400 font-normal">({activeSpotlight.votes})</span>
                          </div>
                          <h3
                            onClick={() => handleSelectMovie(activeSpotlight)}
                            className="text-base font-extrabold text-white truncate hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            {activeSpotlight.title}
                          </h3>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {activeSpotlight.displayLanguage} &middot; {activeSpotlight.duration}
                          </p>
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {activeSpotlight.synopsis}
                        </p>

                        <button
                          onClick={() => handleSelectMovie(activeSpotlight)}
                          className="w-full mt-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                        >
                          <span>Select Showtimes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Recommendations Section */}
            <PersonalizedRecommendations
              movies={MOVIES}
              watchlistMovieIds={watchlistMovieIds}
              bookings={bookings}
              onSelectMovie={handleSelectMovie}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* Feature 2: What's Your Mood? Mood-Based Movie Recommendation Section */}
            <MoodRecommendationSection
              selectedMoodId={selectedMoodId}
              onSelectMood={setSelectedMoodId}
              matchingCount={filteredMovies.length}
            />

            {/* Advanced Multi-Facet Filter Controls */}
            <div data-tour="search-filters">
              <AdvancedMovieFilters
                filters={movieFilters}
                onChangeFilters={setMovieFilters}
                totalMoviesCount={MOVIES.length}
                filteredCount={filteredMovies.length}
                onClearAll={() => {
                  setMovieFilters(INITIAL_MOVIE_FILTERS);
                  setSelectedMoodId(null);
                }}
              />
            </div>

            {/* Movie Grid */}
            {filteredMovies.length === 0 ? (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center">
                <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Movies Match Your Criteria</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your filter settings or resetting filters to view all movies.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMovieFilters(INITIAL_MOVIE_FILTERS);
                    setSelectedMoodId(null);
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Reset Filters ({MOVIES.length} Movies)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie, idx) => (
                  <div key={movie.id} data-tour={idx === 0 ? "movie-card-first" : undefined}>
                    <MovieCard
                      movie={movie}
                      onSelectMovie={handleSelectMovie}
                      bookings={bookings}
                      isWatchlisted={watchlistMovieIds.includes(movie.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Canteen Food Ordering Section */}
            <div className="pt-8 border-t border-zinc-800/80">
              <CanteenFoodSection onOrderPlaced={handleCanteenOrderPlaced} onOpenCineBotHelp={handleOpenCineBotHelp} />
            </div>

            {/* CineBook Rewards & Offers Showcase Section */}
            <div id="offers" className="pt-8 border-t border-zinc-800/80">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <OffersSection />
              </div>
            </div>

            {/* Theatres Section */}
            <div id="theatres" className="pt-8 border-t border-zinc-800/80">
              <div className="mb-6">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  Partnered Cinema Chains
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  State-of-the-Art Multiplexes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THEATRES.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-400">
                      <Tv className="w-5 h-5" />
                      <span className="font-bold text-sm text-white">{t.name}</span>
                    </div>
                    <div className="text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{t.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-mono text-zinc-300">{t.soundSystem}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                      Daily Showtimes: {t.shows.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & Seat Categories Info */}
            <div id="pricing" data-tour="pricing-section" className="pt-6">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8">
                <div className="max-w-xl mb-6">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                    Transparent Pricing
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Simple Ticket Categories
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Every ticket includes complimentary 3D glasses where applicable and digital gate validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                        Premium Recliner (Rows A & B)
                      </span>
                      <span className="text-lg font-extrabold text-white tabular-nums">
                        ₹{TICKET_PRICING.Premium}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Plush motorized recliners with prime sightline, extra legroom, and personal tray tables.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Regular Executive (Rows C to H)
                      </span>
                      <span className="text-lg font-extrabold text-white tabular-nums">
                        ₹{TICKET_PRICING.Regular}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Comfortable ergonomic cinema seating with dual cup-holders and immersive acoustics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {isPaymentModalOpen && pendingPayment && (
        <PaymentModal
          movie={pendingPayment.movie}
          theatre={pendingPayment.theatre}
          dateStr={pendingPayment.dateStr}
          timeStr={pendingPayment.timeStr}
          selectedSeats={pendingPayment.selectedSeats}
          categoryBreakdown={pendingPayment.categoryBreakdown}
          subtotal={pendingPayment.subtotal}
          convenienceFee={pendingPayment.convenienceFee}
          gst={pendingPayment.gst}
          totalAmount={pendingPayment.totalAmount}
          canteenItems={pendingPayment.canteenItems}
          canteenTotal={pendingPayment.canteenTotal}
          initialAppliedOffer={pendingPayment.appliedOffer}
          unlockedRewards={pendingPayment.unlockedRewards}
          holdToken={pendingPayment.holdToken}
          expiresAt={pendingPayment.expiresAt}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPendingPayment(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Offers & Rewards Modal */}
      {isOffersModalOpen && (
        <OffersModal onClose={() => setIsOffersModalOpen(false)} />
      )}

      {/* Opening Prompt: Watched & Rating Modal */}
      {unratedBookings.length > 0 && (
        <WatchedRatingModal
          unratedBookings={unratedBookings}
          onSubmitRating={handleSubmitRating}
          onMaybeLater={handleMaybeLater}
        />
      )}

      {/* Canteen Order Confirmation Modal */}
      {confirmedCanteenOrder && (
        <CanteenOrderConfirmationModal
          order={confirmedCanteenOrder}
          onClose={() => setConfirmedCanteenOrder(null)}
          onViewAllOrders={() => {
            setMyBookingsTab('canteen');
            setIsMyBookingsOpen(true);
          }}
        />
      )}

      {/* My Bookings History Modal */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          bookings={bookings}
          canteenOrders={canteenOrders}
          initialTab={myBookingsTab}
          onClose={() => setIsMyBookingsOpen(false)}
          onViewBooking={(booking) => {
            setConfirmedBooking(booking);
            setSelectedMovie(null);
          }}
          onClearBookings={handleClearBookings}
          onClearCanteenOrders={handleClearCanteenOrders}
          onMarkAsWatched={handleMarkAsWatched}
          onRateBooking={handleSubmitRating}
          onViewCanteenOrder={(order) => {
            setConfirmedCanteenOrder(order);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-500 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white tracking-tight">CineBook</span>
            <span className="text-zinc-600">·</span>
            <span>Single-Page Cinema Ticket Booking Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>Live Theatrical Booking</span>
            <span>·</span>
            <span>Tamil · Telugu · English Releases</span>
            <span>·</span>
            <span>© 2026 CineBook</span>
          </div>
        </div>
      </footer>

      {/* CineBot AI Cinema Guide & Assistant */}
      <AIAssistant
        bookings={bookings}
        canteenOrders={canteenOrders}
        selectedMovie={selectedMovie}
        onSelectMovie={(movie) => {
          setCurrentView('home');
          setSelectedMovie(movie);
          setConfirmedBooking(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateCanteen={handleNavigateCanteen}
        onNavigateWatchlist={handleNavigateWatchlist}
        onNavigateMovies={handleNavigateMovies}
        onStartTour={handleRestartTour}
        externalQuery={cinebotQuery}
        isOpenControlled={isCinebotOpen}
        onCloseControlled={() => {
          setIsCinebotOpen(false);
          setCinebotQuery(null);
        }}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenInsights={() => {
          setMyBookingsTab('insights');
          setIsMyBookingsOpen(true);
        }}
        onOpenMyBookings={() => {
          setMyBookingsTab('tickets');
          setIsMyBookingsOpen(true);
        }}
        onSelectMood={(moodId) => {
          setCurrentView('home');
          setSelectedMoodId(moodId);
          setSelectedMovie(null);
          setConfirmedBooking(null);
          const el = document.getElementById('mood-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRatingModal={(bookingId) => {
          setSnoozedRatingIds((prev) => prev.filter((id) => id !== bookingId));
        }}
      />
    </div>
  );
}
