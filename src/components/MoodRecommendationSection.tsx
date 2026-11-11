import React from 'react';
import { MOOD_OPTIONS, MoodOption } from '../utils/recommendations';
import { Sparkles, X, Heart, Smile, Zap } from 'lucide-react';

interface MoodRecommendationSectionProps {
  selectedMoodId: string | null;
  onSelectMood: (moodId: string | null) => void;
  matchingCount?: number;
}

export const MoodRecommendationSection: React.FC<MoodRecommendationSectionProps> = ({
  selectedMoodId,
  onSelectMood,
  matchingCount
}) => {
  const activeMood = MOOD_OPTIONS.find((m) => m.id === selectedMoodId) || null;

  return (
    <div id="mood-section" className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-64 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="text-base">🎭</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>What&apos;s Your Mood?</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Curated Cinema
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Pick how you feel right now — we&apos;ll curate the perfect movie from our theatre lineup
            </p>
          </div>
        </div>

        {selectedMoodId && (
          <button
            type="button"
            onClick={() => onSelectMood(null)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Show All Movies</span>
          </button>
        )}
      </div>

      {/* Mood Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMoodId === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(isSelected ? null : mood.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border select-none ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-zinc-950/80 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <span className="text-base leading-none" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Mood Feedback Banner */}
      {activeMood && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-zinc-950 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-3xl leading-none">{activeMood.emoji}</span>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>{activeMood.queryLabel}</span>
                {typeof matchingCount === 'number' && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {matchingCount} {matchingCount === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                Here are some movies you might enjoy. {activeMood.description}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectMood(null)}
            className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto border border-zinc-700"
          >
            Clear Mood
          </button>
        </div>
      )}
    </div>
  );
};
