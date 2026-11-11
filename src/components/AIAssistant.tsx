import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Film,
  Popcorn,
  Gift,
  BarChart3,
  HelpCircle,
  Minimize2,
  Maximize2,
  RefreshCw,
  Star,
  ChevronRight,
  Clock,
  Ticket,
  Smile,
  AlertCircle,
  Compass,
  Bot,
  Heart
} from 'lucide-react';
import { Movie, Booking, CanteenOrder } from '../types';
import {
  generateAssistantResponse,
  AssistantMessage,
  AssistantAction,
  getUnratedWatchedBooking
} from '../utils/aiAssistantService';
import { PosterArtwork } from './PosterArtwork';

interface AIAssistantProps {
  bookings: Booking[];
  canteenOrders: CanteenOrder[];
  selectedMovie?: Movie | null;
  onSelectMovie: (movie: Movie) => void;
  onNavigateCanteen: () => void;
  onOpenOffers: () => void;
  onOpenInsights: () => void;
  onOpenMyBookings: () => void;
  onSelectMood: (moodId: string) => void;
  onOpenRatingModal?: (bookingId: string) => void;
  onStartTour?: () => void;
  onNavigateWatchlist?: () => void;
  onNavigateMovies?: () => void;
  externalQuery?: string | null;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
}

const QUICK_SUGGESTIONS = [
  { label: '🚀 Start Guided Tour', query: 'Start guided tour' },
  { label: '🎫 How to book?', query: 'How do I book a movie?' },
  { label: '💺 Seat selection', query: 'How do I select seats?' },
  { label: '👑 Premium seats', query: 'What are premium seats?' },
  { label: '🛡️ QR verification', query: 'How does QR verification work?' },
  { label: '🎁 How to use coupons?', query: 'How do I use a coupon?' },
  { label: '🍿 Food combos', query: 'How do I add food combos?' },
  { label: '🎟️ My bookings', query: 'Where can I find my bookings?' },
  { label: '📄 Tax invoice', query: 'How do I download my invoice?' },
  { label: '❤️ Watchlist help', query: 'How do I use the watchlist?' },
  { label: '🎭 Mood search', query: 'How do I find movies based on my mood?' },
  { label: '🎬 Recommend movie', query: 'Recommend a movie for me' }
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  bookings,
  canteenOrders,
  selectedMovie,
  onSelectMovie,
  onNavigateCanteen,
  onOpenOffers,
  onOpenInsights,
  onOpenMyBookings,
  onSelectMood,
  onOpenRatingModal,
  onStartTour,
  onNavigateWatchlist,
  onNavigateMovies,
  externalQuery,
  isOpenControlled,
  onCloseControlled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownRatingReminder, setHasShownRatingReminder] = useState(false);

  // Check for unrated watched movie
  const unratedBooking = getUnratedWatchedBooking(bookings);

  // Default welcome message
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hey there! 👋 I'm CineBot, your personal cinema guide. I can help you discover movies, pick seats, order canteen combos, apply coupons, find invoices, or take an interactive guided tour!\n\nWhat would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external controlled open state
  useEffect(() => {
    if (typeof isOpenControlled === 'boolean') {
      setIsOpen(isOpenControlled);
      if (isOpenControlled) setIsMinimized(false);
    }
  }, [isOpenControlled]);

  // Support external queries (e.g. from Contextual Help prompts)
  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      setIsOpen(true);
      setIsMinimized(false);
      handleSendMessage(externalQuery);
    }
  }, [externalQuery]);

  // Scroll to bottom whenever messages change or typing state changes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  // Provide initial rating reminder when opening if applicable and unrated
  useEffect(() => {
    if (isOpen && unratedBooking && !hasShownRatingReminder) {
      setHasShownRatingReminder(true);
      // Add rating prompt if not already in messages
      const reminderExists = messages.some((m) => m.text.includes('waiting for your rating'));
      if (!reminderExists) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-rating-${Date.now()}`,
            sender: 'assistant',
            text: `You have a movie waiting for your rating! 🎬⭐\n\nYou recently watched **${unratedBooking.movie.title}**. Share your rating to help tailor your personal cinema recommendations!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              {
                type: 'rate_movie',
                label: `⭐ Rate "${unratedBooking.movie.title}"`,
                bookingId: unratedBooking.id
              }
            ]
          }
        ]);
      }
    }
  }, [isOpen, unratedBooking, hasShownRatingReminder, messages]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseControlled) onCloseControlled();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Natural assistant thinking delay (500ms to 750ms)
    setTimeout(async () => {
      try {
        const response = await generateAssistantResponse(text, {
          bookings,
          canteenOrders,
          selectedMovie
        });

        const assistantMsg: AssistantMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedMovies: response.recommendedMovies,
          actions: response.actions
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error('Error generating AI response:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: `I’m CineBot 🤖🎬. I can help you with movies, seats, booking steps, ratings, canteen items, discounts, and website tours. Please ask me again!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  const handleActionClick = (action: AssistantAction) => {
    switch (action.type) {
      case 'start_tour':
        if (onStartTour) {
          onStartTour();
        }
        handleClose();
        break;

      case 'open_watchlist':
        if (onNavigateWatchlist) {
          onNavigateWatchlist();
        }
        handleClose();
        break;

      case 'open_movies':
        if (onNavigateMovies) {
          onNavigateMovies();
        }
        handleClose();
        break;

      case 'select_movie':
        if (action.movieId) {
          // Find in MOVIES
          import('../data/movies').then(({ MOVIES }) => {
            const found = MOVIES.find((m) => m.id === action.movieId);
            if (found) {
              onSelectMovie(found);
              handleClose();
            }
          });
        }
        break;

      case 'open_canteen':
        onNavigateCanteen();
        handleClose();
        break;

      case 'open_offers':
        onOpenOffers();
        handleClose();
        break;

      case 'open_insights':
        onOpenInsights();
        handleClose();
        break;

      case 'open_my_bookings':
        onOpenMyBookings();
        handleClose();
        break;

      case 'rate_movie':
        if (action.bookingId && onOpenRatingModal) {
          onOpenRatingModal(action.bookingId);
        } else {
          onOpenMyBookings();
        }
        handleClose();
        break;

      case 'set_mood':
        if (action.moodId) {
          onSelectMood(action.moodId);
          handleClose();
        }
        break;

      default:
        break;
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation restarted! 🎬 Hey there, I'm CineBot! What would you like to explore in CineBook today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLOATING AI ASSISTANT BUTTON (Bottom-Right)
          🎬 “Ask CineBook AI”
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!isOpen && (
        <aside
          aria-label="CineBot AI Cinema Guide"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 no-print flex items-center"
        >
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/60 cursor-pointer"
            title="Ask CineBot AI Guide"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-60 blur-xs group-hover:opacity-100 transition-opacity animate-pulse" />

            <div className="relative flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-zinc-950/90 text-amber-400 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-300">
                <Bot className="w-4 h-4 text-amber-400" />
              </span>
              <span className="text-zinc-950 font-extrabold tracking-tight text-sm sm:text-base">
                Ask CineBot AI
              </span>
            </div>

            {/* Notification Badge if user has an unrated movie */}
            {unratedBooking && (
              <span
                className="relative -mr-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-sm animate-bounce"
                title="Movie waiting for rating!"
              >
                <Star className="w-2.5 h-2.5 fill-white" />
                <span>1</span>
              </span>
            )}
          </button>
        </aside>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODERN CHAT PANEL
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isOpen && (
        <section
          aria-label="CineBot AI Assistant Window"
          className={`fixed z-50 transition-all duration-300 no-print ${
            isMinimized
              ? 'bottom-5 right-5 w-72 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] md:w-[440px] h-[580px] sm:h-[630px] max-h-[88vh]'
          } rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-2xl shadow-black/80 flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20">
                  <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">CineBot</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                    AI Guide
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Personal cinema guide &amp; tour assistant
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              {onStartTour && (
                <button
                  onClick={() => {
                    handleClose();
                    onStartTour();
                  }}
                  className="p-1.5 text-amber-400 hover:text-white hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold mr-1"
                  title="Start Interactive Guided Tour"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Tour</span>
                </button>
              )}
              <button
                onClick={handleResetChat}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Optional Rating Reminder Alert Bar */}
              {unratedBooking && (
                <div className="bg-amber-950/40 border-b border-amber-800/40 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">
                      Watched <strong>{unratedBooking.movie.title}</strong>? Waiting for your rating!
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenRatingModal) onOpenRatingModal(unratedBooking.id);
                      else onOpenMyBookings();
                      setIsOpen(false);
                    }}
                    className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Rate Now
                  </button>
                </div>
              )}

              {/* Message History Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-zinc-700">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-sm ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-zinc-950 font-medium rounded-br-xs shadow-md shadow-amber-500/10'
                          : 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 rounded-bl-xs shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line break-words">{msg.text}</div>

                      {/* Recommended Movie Cards within response */}
                      {msg.recommendedMovies && msg.recommendedMovies.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-zinc-700/60 pt-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                            Recommended Titles:
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.recommendedMovies.map((movie) => (
                              <div
                                key={movie.id}
                                className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/90 border border-zinc-700/70 hover:border-amber-500/60 transition-all group/card text-left"
                              >
                                <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-950 relative border border-zinc-800">
                                  <PosterArtwork
                                    movie={movie}
                                    size="sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white group-hover/card:text-amber-400 transition-colors truncate">
                                    {movie.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                                      {movie.rating}
                                    </span>
                                    <span>·</span>
                                    <span className="truncate">{movie.displayLanguage}</span>
                                    <span>·</span>
                                    <span className="truncate">{movie.genres[0]}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    onSelectMovie(movie);
                                    setIsOpen(false);
                                  }}
                                  className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Book</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-zinc-700/50">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(act)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-700/80 hover:bg-amber-500 hover:text-zinc-950 text-white font-medium text-[11px] border border-zinc-600 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {/* Friendly Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 rounded-2xl rounded-bl-xs px-3.5 py-2 flex items-center gap-2 shadow-sm">
                      <span className="text-xs text-amber-400 font-medium">CineBook AI is typing</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Suggestions Strip */}
              <div className="px-3 py-2 bg-zinc-950/70 border-t border-zinc-800/80 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
                {QUICK_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300 text-zinc-300 text-[11px] font-medium border border-zinc-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about movies, seats, canteen, offers..."
                  className="flex-1 bg-zinc-950 border border-zinc-700/80 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md shadow-amber-500/10"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </>
  );
};
