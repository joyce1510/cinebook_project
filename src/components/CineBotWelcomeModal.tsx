import React from 'react';
import { Sparkles, Bot, Compass, MessageSquareText, X, ArrowRight, Film, ShieldCheck } from 'lucide-react';

interface CineBotWelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onChatWithCineBot: () => void;
  onSkip: () => void;
}

export const CineBotWelcomeModal: React.FC<CineBotWelcomeModalProps> = ({
  isOpen,
  onStartTour,
  onChatWithCineBot,
  onSkip
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinebot-welcome-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden transform animate-in zoom-in-95 duration-300">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close / Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer z-10"
          title="Skip welcome guide"
          aria-label="Skip welcome guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* CineBot Avatar Character */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 opacity-30 blur-lg animate-pulse" />

            <div className="relative w-full h-full rounded-3xl bg-zinc-950 border-2 border-amber-400/80 p-3 shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center">
              {/* Antenna */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="w-0.5 h-2 bg-amber-400" />
              </div>

              {/* Bot Face Screen */}
              <div className="w-full h-full rounded-2xl bg-zinc-900 border border-amber-500/40 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Glowing Projector Eyes */}
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80 flex items-center justify-center animate-bounce [animation-delay:-0.2s]">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80 flex items-center justify-center animate-bounce">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  </div>
                </div>
                {/* Robot Smile */}
                <div className="w-5 h-1.5 rounded-full bg-amber-400/80 mt-1.5" />
              </div>

              {/* Cinema Clapperboard Badge */}
              <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-[9px] font-black tracking-widest flex items-center gap-0.5 shadow-sm">
                <Film className="w-2.5 h-2.5 fill-zinc-950" />
                <span>AI</span>
              </div>
            </div>
          </div>

          {/* Heading & Introduction */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Meet CineBot &middot; Your Cinema Guide</span>
            </div>

            <h2 id="cinebot-welcome-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to CineBook!
            </h2>

            {/* Exact Required Welcome Copy */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md mx-auto pt-1 font-normal">
              {"“Hey there! 👋 Welcome to CineBook! I'm CineBot, your personal cinema guide. I'll help you discover movies and book your first ticket. Shall we explore?”"}
            </p>
          </div>

          {/* Three Options Requested */}
          <div className="space-y-3 pt-2">
            {/* Option 1: Start Guided Tour */}
            <button
              onClick={onStartTour}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:via-amber-300 hover:to-amber-400 text-zinc-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all duration-200 cursor-pointer active:scale-[0.98] group"
            >
              <Compass className="w-5 h-5 text-zinc-950 transition-transform group-hover:rotate-45" />
              <span>Start Guided Tour</span>
              <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Option 2: Chat with CineBot */}
            <button
              onClick={onChatWithCineBot}
              className="w-full py-3.5 px-5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500/40 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <MessageSquareText className="w-5 h-5 text-amber-400" />
              <span>Chat with CineBot</span>
            </button>

            {/* Option 3: Skip for Now */}
            <button
              onClick={onSkip}
              className="w-full py-2.5 px-4 text-xs sm:text-sm text-zinc-400 hover:text-zinc-200 font-medium transition-colors cursor-pointer"
            >
              Skip for Now
            </button>
          </div>

          {/* Security & Non-Destructive Guarantee Note */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
            <span>Interactive tour &middot; zero real charges &middot; restart anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
