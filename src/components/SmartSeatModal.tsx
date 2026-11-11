import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Users,
  Eye,
  Shield,
  Compass,
  CheckCircle2,
  X,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  SeatRecommendationRequest,
  SeatRecommendationResult,
  findBestSeats
} from '../utils/recommendations';

interface SmartSeatModalProps {
  bookedSeats: Set<string>;
  onApplyRecommendedSeats: (seats: string[]) => void;
  onClose: () => void;
}

export const SmartSeatModal: React.FC<SmartSeatModalProps> = ({
  bookedSeats,
  onApplyRecommendedSeats,
  onClose
}) => {
  // Input states
  const [ticketMode, setTicketMode] = useState<'solo' | 'group'>('solo');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [preferredArea, setPreferredArea] = useState<'front' | 'middle' | 'back'>('middle');
  const [preference, setPreference] = useState<'best_view' | 'more_privacy' | 'normal'>('best_view');

  // Recommendation output
  const [recommendation, setRecommendation] = useState<SeatRecommendationResult | null>(() => {
    // Generate an initial recommendation with defaults
    return findBestSeats(
      {
        ticketCount: 1,
        preferredArea: 'middle',
        preference: 'best_view'
      },
      bookedSeats
    );
  });

  const handleCalculate = () => {
    const count = ticketMode === 'solo' ? 1 : groupSize;
    const result = findBestSeats(
      {
        ticketCount: count,
        preferredArea,
        preference
      },
      bookedSeats
    );
    setRecommendation(result);
  };

  const handleApply = () => {
    if (recommendation && recommendation.seats.length > 0) {
      onApplyRecommendedSeats(recommendation.seats);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top ambient highlight */}
        <div className="absolute top-0 right-1/4 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Find My Best Seat</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Smart Recommender
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Personalized seat matching based on your viewing style
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 relative z-10 max-h-[75vh] overflow-y-auto">
          {/* Question 1: Solo vs Group */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <span>1. Who are you booking for?</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTicketMode('solo');
                  const result = findBestSeats(
                    { ticketCount: 1, preferredArea, preference },
                    bookedSeats
                  );
                  setRecommendation(result);
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  ticketMode === 'solo'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    ticketMode === 'solo' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Solo Cinephile</div>
                  <div className="text-[10px] text-zinc-500 font-mono">1 Single Seat</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTicketMode('group');
                  const result = findBestSeats(
                    { ticketCount: groupSize, preferredArea, preference },
                    bookedSeats
                  );
                  setRecommendation(result);
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  ticketMode === 'group'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    ticketMode === 'group' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Group / Duo</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Adjacent Seats</div>
                </div>
              </button>
            </div>

            {/* If Group, choose size */}
            {ticketMode === 'group' && (
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Group Size:</span>
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setGroupSize(num);
                      const result = findBestSeats(
                        { ticketCount: num, preferredArea, preference },
                        bookedSeats
                      );
                      setRecommendation(result);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      groupSize === num
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question 2: Preferred Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              2. Preferred Cinema Area
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'front', label: 'Front', sub: 'Rows A, B, C · Screen view', icon: '🎬' },
                { id: 'middle', label: 'Middle', sub: 'Rows D, E · Sweet spot', icon: '🍿' },
                { id: 'back', label: 'Back', sub: 'Rows F, G, H · Wide angle', icon: '🛋️' }
              ].map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => {
                    const nextArea = area.id as 'front' | 'middle' | 'back';
                    setPreferredArea(nextArea);
                    const result = findBestSeats(
                      {
                        ticketCount: ticketMode === 'solo' ? 1 : groupSize,
                        preferredArea: nextArea,
                        preference
                      },
                      bookedSeats
                    );
                    setRecommendation(result);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    preferredArea === area.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-lg mb-1">{area.icon}</div>
                  <div>
                    <div className="text-xs font-bold">{area.label}</div>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight mt-0.5">
                      {area.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              3. Viewing Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'best_view',
                  label: 'Best View',
                  sub: 'Center alignment',
                  icon: <Eye className="w-3.5 h-3.5 text-amber-400" />
                },
                {
                  id: 'more_privacy',
                  label: 'More Privacy',
                  sub: 'Aisle & corner edges',
                  icon: <Shield className="w-3.5 h-3.5 text-amber-400" />
                },
                {
                  id: 'normal',
                  label: 'Normal',
                  sub: 'Any relaxed seats',
                  icon: <Compass className="w-3.5 h-3.5 text-amber-400" />
                }
              ].map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => {
                    const nextPref = pref.id as 'best_view' | 'more_privacy' | 'normal';
                    setPreference(nextPref);
                    const result = findBestSeats(
                      {
                        ticketCount: ticketMode === 'solo' ? 1 : groupSize,
                        preferredArea,
                        preference: nextPref
                      },
                      bookedSeats
                    );
                    setRecommendation(result);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    preference === pref.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">{pref.icon}</div>
                  <div>
                    <div className="text-xs font-bold">{pref.label}</div>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight mt-0.5">
                      {pref.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-950 to-zinc-950 border border-amber-500/40 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Recommended for you
                </span>
              </div>
              {recommendation && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {recommendation.category} Tier
                </span>
              )}
            </div>

            {recommendation ? (
              <div className="space-y-1.5">
                <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
                  <span className="text-amber-400">{recommendation.seats.join(', ')}</span>
                  <span className="text-xs text-zinc-400 font-normal">
                    (Row {recommendation.rowName})
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {recommendation.explanation}
                </p>
              </div>
            ) : (
              <div className="py-2 text-xs text-zinc-400">
                No matching contiguous seats found in this area. Try selecting another area or reducing group size.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {recommendation && (
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Select {recommendation.seats.join(', ')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
