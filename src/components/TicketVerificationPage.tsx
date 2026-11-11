/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TicketVerificationResult } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Film,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  RotateCw,
  ArrowLeft,
  Sparkles,
  Ticket,
  Lock,
  Smartphone
} from 'lucide-react';

interface TicketVerificationPageProps {
  bookingId: string;
  token: string;
  onBackToHome: () => void;
}

export const TicketVerificationPage: React.FC<TicketVerificationPageProps> = ({
  bookingId,
  token,
  onBackToHome
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TicketVerificationResult | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const verifyTicket = async () => {
    if (!bookingId) {
      setLoading(false);
      setResult({
        valid: false,
        status: 'invalid',
        error: 'Missing Booking ID. A valid CineBook booking reference is required for turnstile admission.'
      });
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const url = `/api/bookings/verify/${encodeURIComponent(bookingId.trim())}?token=${encodeURIComponent((token || '').trim())}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.valid === true) {
        setResult(data);
      } else {
        setResult({
          valid: false,
          status: data.status || 'invalid',
          bookingId: data.bookingId || bookingId,
          movieTitle: data.movieTitle,
          error: data.error || data.message || 'Ticket verification failed. Token mismatch or unknown booking.'
        });
      }
    } catch (err: any) {
      console.error('Network error during ticket verification:', err);
      setFetchError('Unable to reach CineBook Verification Registry. Please check network connection and try again.');
      setResult({
        valid: false,
        status: 'invalid',
        bookingId,
        error: 'CineBook gate verification server is currently unreachable. Tickets cannot be cleared without server authentication.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyTicket();
  }, [bookingId, token]);

  const isValid = result?.valid === true;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-zinc-900/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-300">
              CineBook Gate Registry
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Turnstile Auth</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-10 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Ticket className="w-6 h-6 text-amber-400 absolute" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Validating Ticket Credentials...
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Cryptographically verifying ticket token with CineBook server registry.
              </p>
            </div>
          </div>
        ) : isValid && result ? (
          /* SUCCESS: TICKET VALID & ADMITTED */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Hero Badge */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  Turnstile Clearance
                </span>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  TICKET VALID &middot; ADMITTED
                </h2>
                <p className="text-[11px] text-zinc-300">
                  Cryptographically verified gate pass for cinema entry.
                </p>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-850">
                <span className="text-zinc-400">Booking Reference</span>
                <span className="font-mono font-bold text-amber-400 text-sm tracking-wide">
                  {result.bookingId}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-400">Feature Movie</span>
                <span className="font-extrabold text-white text-right text-sm">
                  {result.movieTitle}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-400">Multiplex &amp; Screen</span>
                <div className="text-right">
                  <div className="font-semibold text-zinc-200">{result.theatreName}</div>
                  {result.screen && (
                    <div className="text-[11px] text-amber-400 font-mono">{result.screen}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Date &amp; Showtime</span>
                <span className="font-semibold text-zinc-200">
                  {result.date} &middot; {result.time}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-850">
                <span className="text-zinc-400">Confirmed Seats</span>
                <span className="font-mono font-bold text-white text-sm bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-700">
                  {result.seats?.join(', ')} ({result.seats?.length} {result.seats?.length === 1 ? 'Seat' : 'Seats'})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Gate Status</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed &amp; Cleared</span>
                </span>
              </div>

              {result.verificationHash && (
                <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Cryptographic Sig:</span>
                  <span>{result.verificationHash}</span>
                </div>
              )}
            </div>

            {/* Turnstile Operator Note */}
            <div className="text-center text-[11px] text-zinc-400 space-y-1">
              <p>Scan successful on turnstile scanner &middot; Entry permitted</p>
            </div>
          </div>
        ) : (
          /* REJECTED: TICKET INVALID */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Hero Badge */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/10">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 block">
                  Turnstile Clearance Failed
                </span>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  TICKET INVALID &middot; REJECTED
                </h2>
                <p className="text-[11px] text-zinc-300">
                  Admission denied. Pass cannot be verified against CineBook server registry.
                </p>
              </div>
            </div>

            {/* Rejection Details */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Target Reference</span>
                <span className="font-mono font-bold text-zinc-300">
                  {bookingId || 'NONE SPECIFIED'}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-zinc-400 block">Rejection Reason:</span>
                <p className="text-rose-300 text-xs font-medium leading-relaxed bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl">
                  {result?.error || fetchError || 'Cryptographic token validation failed.'}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-zinc-500 leading-relaxed">
                Security Warning: Digital tickets must contain a genuine, unexpired cryptographic verification token issued by the CineBook booking server.
              </div>
            </div>

            {/* Operator Warning */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
              <span className="text-[11px] font-bold text-rose-400 tracking-wide uppercase">
                DO NOT ADMIT &middot; PRESENT TICKET CANNOT BE AUTHENTICATED
              </span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-950/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={verifyTicket}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-800"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-verify</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CineBook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
