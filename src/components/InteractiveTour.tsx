import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TourStep, AppView } from '../types';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  Film,
  Search,
  Heart,
  Ticket,
  Popcorn,
  Gift,
  CreditCard,
  QrCode,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface InteractiveTourProps {
  isActive: boolean;
  onFinishTour: () => void;
  onSkipTour: () => void;
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
  onOpenCineBotChat?: () => void;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    stepNumber: 1,
    title: '1. Welcome to CineBook',
    description:
      'This is the grand entrance! Experience curated highlights, sound format tags (IMAX, Dolby Atmos), and click "Explore CineBook" to step into our full cinema catalogue.',
    highlightSelector: '[data-tour="welcome-explore"]',
    viewRequired: 'welcome',
    position: 'bottom',
    actionTip: 'Clicking Explore CineBook takes you directly into the main movie experience.'
  },
  {
    id: 'step-catalogue',
    stepNumber: 2,
    title: '2. Movie Catalogue & Showcases',
    description:
      'Browse 16 critically acclaimed blockbusters across Tamil, Telugu, and English. The Hero Spotlight highlights top theatrical releases showing right now.',
    highlightSelector: '[data-tour="movie-catalogue"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Every title shows authentic audience ratings, official age ratings, and durations.'
  },
  {
    id: 'step-search-filters',
    stepNumber: 3,
    title: '3. Search & Mood Discovery',
    description:
      'Search instantly with Ctrl+K or / keyboard shortcuts. Filter by Language, Certificate, or pick your feeling with our 7 curated "What\'s Your Mood?" options!',
    highlightSelector: '[data-tour="search-filters"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Try Emotional 🥹, Fun 😂, Excited ⚡, or Romantic ❤️ for instant mood matching.'
  },
  {
    id: 'step-movie-details',
    stepNumber: 4,
    title: '4. Movie Details & Showtimes',
    description:
      'Each movie card lets you inspect high-definition posters, cast, synopsis, and showtimes across our partner multiplexes like PVR INOX and Cinepolis.',
    highlightSelector: '[data-tour="movie-card-first"]',
    viewRequired: 'home',
    position: 'right',
    actionTip: 'Click "Select Showtimes" on any card to choose your date, screen, and seats.'
  },
  {
    id: 'step-watchlist',
    stepNumber: 5,
    title: '5. My Watchlist',
    description:
      'Tap the Heart icon (❤️) on any movie to save it to your personal Watchlist. Access your saved movies anytime from the top navigation bar.',
    highlightSelector: '[data-tour="watchlist-nav"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Your Watchlist persists automatically in your browser across sessions.'
  },
  {
    id: 'step-seats',
    stepNumber: 6,
    title: '6. Seat Selection & 5-Min Hold',
    description:
      'Choose between plush Premium Recliners (Rows A & B, ₹250) and Regular Executive seats (Rows C to H, ₹190). When selected, your seats are secured by a 5-minute server hold!',
    highlightSelector: '[data-tour="pricing-section"], [data-tour="seat-selection-view"], [data-tour="spotlight-book-btn"]',
    viewRequired: 'home',
    position: 'top',
    actionTip: 'Use "✨ Find My Best Seat" in the seat map for smart automated group placement.'
  },
  {
    id: 'step-food',
    stepNumber: 7,
    title: '7. Express Canteen & Combos',
    description:
      'Order hot butter popcorn, nachos, and cold drinks. Save with Smart Combos like Couple Movie Night (Save ₹50) and Family Snack Feast (Save ₹60) for express counter pickup.',
    highlightSelector: '[data-tour="canteen-nav"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Spend ₹300+ in the canteen to unlock a complimentary Popcorn Reward Voucher!'
  },
  {
    id: 'step-offers',
    stepNumber: 8,
    title: '8. Offers, Rewards & Promo Codes',
    description:
      'Apply verified promo codes like CINE20 for 20% off (up to ₹100), DINNERFREE on 5+ tickets, or PARTNER50 for 50% off convenience fees on partner cards.',
    highlightSelector: '[data-tour="offers-nav"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Discounts apply automatically at checkout before simulated payment.'
  },
  {
    id: 'step-payment',
    stepNumber: 9,
    title: '9. Transparent Simulated Payment',
    description:
      'CineBook uses a safe, simulated checkout gateway. You can test UPI (GPay/PhonePe) or Card payments with zero real charges or real bank information needed.',
    highlightSelector: '[data-tour="spotlight-book-btn"], [data-tour="pricing-section"]',
    viewRequired: 'home',
    position: 'top',
    actionTip: 'Enjoy instant confirmation and real cryptographic ticket generation immediately.'
  },
  {
    id: 'step-my-bookings',
    stepNumber: 10,
    title: '10. My Bookings Dashboard',
    description:
      'Track all your upcoming admissions, past bookings, and active canteen orders. You can view your digital gate passes and rate watched movies anytime.',
    highlightSelector: '[data-tour="my-bookings-nav"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Tap on any booking card to open your complete ticket pass.'
  },
  {
    id: 'step-tickets-qr',
    stepNumber: 11,
    title: '11. Cryptographic QR Gate Pass',
    description:
      'Every CineBook ticket comes with a genuine, scannable QR code backed by an unpredictable cryptographic token hash. Multiplex turnstiles scan it to confirm live entry!',
    highlightSelector: '[data-tour="my-bookings-nav"], [data-tour="ticket-qr-info"]',
    viewRequired: 'home',
    position: 'bottom',
    actionTip: 'Click "Print / Save Invoice" on any confirmed ticket for an official tax invoice.'
  }
];

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isActive,
  onFinishTour,
  onSkipTour,
  currentView,
  onNavigateView,
  onOpenCineBotChat
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 120, left: 120 });
  const activeElementRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Helper to locate target element with multi-selector fallback and non-zero dimension check
  const findTargetElement = useCallback((selector?: string): HTMLElement | null => {
    if (!selector) return null;
    const parts = selector.split(',').map((s) => s.trim());
    for (const part of parts) {
      const el = document.querySelector(part) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        // Element must be rendered and have measurable dimensions
        if (rect.width > 0 && rect.height > 0) {
          return el;
        }
      }
    }
    return null;
  }, []);

  // Compute collision-free tooltip position relative to the target element
  const computePositions = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = Math.min(420, window.innerWidth - 32);
    const tooltipHeight = 270;
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // On mobile viewports: dock to whichever half of the screen does not cover the element
      const elementCenterY = rect.top + rect.height / 2;
      const left = Math.max(16, (window.innerWidth - tooltipWidth) / 2);

      if (elementCenterY < window.innerHeight / 2) {
        // Element is in top half: place tooltip below it or docked at bottom
        const top = Math.min(
          window.innerHeight - tooltipHeight - 16,
          Math.max(rect.bottom + 16, window.innerHeight - 340)
        );
        setTooltipPos({ top, left });
      } else {
        // Element is in bottom half: place tooltip above it
        const top = Math.max(76, Math.min(rect.top - tooltipHeight - 16, 80));
        setTooltipPos({ top, left });
      }
    } else {
      // Desktop & Tablet positioning: calculate space above and below to prevent element overlap
      let left = Math.max(
        16,
        Math.min(window.innerWidth - tooltipWidth - 24, rect.left + (rect.width - tooltipWidth) / 2)
      );
      let top = 100;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (step.position === 'top') {
        if (spaceAbove >= tooltipHeight + 20) {
          top = Math.max(20, rect.top - tooltipHeight - 14);
        } else if (spaceBelow >= tooltipHeight + 20) {
          top = rect.bottom + 14;
        } else {
          top = Math.max(80, window.innerHeight - tooltipHeight - 20);
        }
      } else {
        // Default: bottom
        if (spaceBelow >= tooltipHeight + 20) {
          top = rect.bottom + 14;
        } else if (spaceAbove >= tooltipHeight + 20) {
          top = Math.max(20, rect.top - tooltipHeight - 14);
        } else {
          top = Math.max(80, (window.innerHeight - tooltipHeight) / 2);
        }
      }

      setTooltipPos({ top, left });
    }
  }, [step]);

  // Continuously track element during smooth scrolling so the spotlight stays attached
  const trackElementScroll = useCallback((el: HTMLElement) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();
    const duration = 850; // Follow during smooth scroll duration

    const loop = (currentTime: number) => {
      computePositions(el);
      if (currentTime - startTime < duration) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  }, [computePositions]);

  // Update target rectangle and position on demand
  const updatePosition = useCallback(() => {
    if (!step) return;
    const el = activeElementRef.current || findTargetElement(step.highlightSelector);
    if (el) {
      computePositions(el);
    }
  }, [step, findTargetElement, computePositions]);

  // Handle step activation, view navigation, and polling wait loop
  useEffect(() => {
    if (!isActive || !step) return;

    // 1. Ensure the required view is active
    if (step.viewRequired && currentView !== step.viewRequired) {
      onNavigateView(step.viewRequired);
    }

    let attempts = 0;
    const maxAttempts = 35; // 35 * 50ms = 1.75s polling window for async renders
    let pollInterval: NodeJS.Timeout | null = null;

    const tryFindAndFocus = () => {
      attempts++;
      const el = findTargetElement(step.highlightSelector);

      if (el) {
        activeElementRef.current = el;
        if (pollInterval) clearInterval(pollInterval);

        // Check if element is currently visible in viewport
        const rect = el.getBoundingClientRect();
        const isNicelyInView =
          rect.top >= 80 &&
          rect.bottom <= window.innerHeight - 80 &&
          rect.left >= 0 &&
          rect.right <= window.innerWidth;

        if (!isNicelyInView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Track positions smoothly during scroll
        trackElementScroll(el);
        return;
      }

      if (attempts >= maxAttempts) {
        if (pollInterval) clearInterval(pollInterval);
        setTargetRect(null);
        // Fallback center modal if element could not be found
        setTooltipPos({
          top: Math.max(90, window.innerHeight / 2 - 140),
          left: Math.max(16, (window.innerWidth - Math.min(420, window.innerWidth - 32)) / 2)
        });
      }
    };

    // First attempt immediately
    tryFindAndFocus();

    // Poll until element is mounted and rendered with non-zero dimensions
    pollInterval = setInterval(tryFindAndFocus, 50);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [
    isActive,
    currentStepIndex,
    step,
    currentView,
    onNavigateView,
    findTargetElement,
    trackElementScroll
  ]);

  // Window resize and scroll event listeners
  useEffect(() => {
    if (!isActive) return;
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isActive, updatePosition]);

  if (!isActive || !step) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinishTour();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* 
        TRUE CUTOUT SPOTLIGHT:
        Uses an infinite box-shadow mask projecting outward from the target element.
        Inside the target rectangle, the background is 100% TRANSPARENT so the highlighted
        section (booking, seats, buttons, cards) is crystal clear and NEVER covered by a black overlay.
      */}
      {targetRect ? (
        <div
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 0 35px rgba(245, 158, 11, 0.65)'
          }}
          className="fixed rounded-2xl border-2 border-amber-400 pointer-events-none transition-all duration-150 z-50 animate-pulse"
        />
      ) : (
        /* Fallback dark ambient backdrop while waiting for target element to mount */
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm pointer-events-auto transition-all duration-200" />
      )}

      {/* Interactive Floating Tooltip Card */}
      <div
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: Math.min(420, window.innerWidth - 32)
        }}
        className="fixed z-50 pointer-events-auto transition-all duration-200 transform animate-in fade-in zoom-in-95"
      >
        <div className="rounded-2xl bg-zinc-900/98 border border-amber-500/50 shadow-2xl shadow-black/95 p-5 space-y-4 backdrop-blur-xl text-left">
          {/* Header Row: Step counter & Skip Button */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Step {step.stepNumber} of {TOUR_STEPS.length}
              </span>
            </div>

            <button
              onClick={onSkipTour}
              className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Body */}
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{step.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {step.description}
            </p>
          </div>

          {/* Action Tip */}
          {step.actionTip && (
            <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{step.actionTip}</span>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              onClick={onSkipTour}
              className="text-xs text-zinc-400 hover:text-zinc-200 font-medium cursor-pointer"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                disabled={isFirstStep}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <span>{isLastStep ? 'Finish Tour' : 'Next'}</span>
                {isLastStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
