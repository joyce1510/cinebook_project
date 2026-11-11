import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { generateTicketQRCodeDataUrl, getTicketVerificationUrl } from '../utils/qrCode';
import {
  Printer,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  Download,
  Sparkles,
  Gift,
  Popcorn,
  UtensilsCrossed,
  Tag,
  ShieldCheck,
  ExternalLink,
  Bot
} from 'lucide-react';

interface TicketConfirmationProps {
  booking: Booking;
  onBookAnother: () => void;
  onOpenCineBotHelp?: (query: string) => void;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  booking,
  onBookAnother,
  onOpenCineBotHelp
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Generate real, genuine, scannable QR code on mount or when booking changes
  useEffect(() => {
    let isMounted = true;
    generateTicketQRCodeDataUrl(booking.id, booking.verificationToken)
      .then((dataUrl) => {
        if (isMounted) setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('Error generating genuine ticket QR code:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [booking.id, booking.verificationToken]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDetails = () => {
    let text = `🎬 CineBook E-Ticket Confirmation\nBooking ID: ${booking.id}\nMovie: ${booking.movie.title} (${booking.movie.displayLanguage})\nTheatre: ${booking.theatre.name} (${booking.theatre.screen})\nDate & Time: ${booking.date} at ${booking.time}\nSeats: ${booking.seats.join(', ')}\nTotal Paid: ₹${booking.totalAmount}`;
    if (booking.appliedOffer) {
      text += `\nApplied Offer: ${booking.appliedOffer.title} (-₹${booking.appliedOffer.discountAmount})`;
    }
    if (booking.unlockedRewards && booking.unlockedRewards.length > 0) {
      text += `\n🎁 Unlocked Rewards:\n` + booking.unlockedRewards.map(r => `  • ${r.badge} (Code: ${r.couponCode})`).join('\n');
    }
    text += `\nEnjoy the show!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Genuine high-contrast, scannable QR Code Generator component
  const renderQRCode = () => {
    const verificationUrl = getTicketVerificationUrl(booking.id, booking.verificationToken);
    return (
      <div className="flex flex-col items-center gap-1.5">
        <a
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Click to preview gate turnstile verification"
          className="w-28 h-28 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center border border-zinc-200 hover:ring-2 hover:ring-amber-400 transition-all cursor-pointer group"
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`CineBook Gate Pass QR for ${booking.id}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-500 font-mono animate-pulse text-center p-1">
              Generating Gate Pass QR...
            </div>
          )}
        </a>
        <a
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-amber-400/90 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors no-print"
          title="Test turnstile validation"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Verify Gate Pass</span>
          <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
        </a>
      </div>
    );
  };

  // Barcode visualization
  const renderBarcode = () => {
    return (
      <div className="flex items-end justify-center gap-[2.5px] h-9 w-full opacity-85 px-4 overflow-hidden">
        {[
          3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 5, 1, 3, 2, 4, 2, 1, 3, 4, 1, 2,
          5, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 5, 2, 1, 4, 3, 2, 1, 4, 2
        ].map((w, idx) => (
          <div
            key={idx}
            className="bg-zinc-800 dark:bg-zinc-400"
            style={{
              width: `${w * 1.5}px`,
              height: `${24 + (idx % 3) * 4}px`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 animate-in fade-in duration-300">
      {/* Success Banner */}
      <div className="text-center mb-8 no-print">
        <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Booking Confirmed!
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Your e-ticket has been generated and confirmed with the theatre.
        </p>
      </div>

      {/* Realistic Ticket Voucher Card */}
      <div
        id="printable-ticket"
        className="relative bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl overflow-hidden print:border-black print:text-black print:bg-white"
      >
        {/* Top Header of Ticket */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                CineBook E-Ticket
              </span>
              <span className="text-sm font-semibold text-zinc-300">
                Admit {booking.seats.length} {booking.seats.length === 1 ? 'Person' : 'Persons'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-mono">
              Booking Ref
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
              {booking.id}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Movie Details */}
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>{booking.movie.displayLanguage}</span>
              <span>·</span>
              <span>{booking.movie.genres.join(', ')}</span>
              <span>·</span>
              <span>{booking.movie.duration}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {booking.movie.title}
            </h3>
          </div>

          {/* Grid of Key Ticket Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Date
              </span>
              <span className="text-xs sm:text-sm font-bold text-white block">
                {booking.date}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-amber-400" /> Time
              </span>
              <span className="text-xs sm:text-sm font-bold text-white block">
                {booking.time}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block flex items-center gap-1 mb-1">
                <Ticket className="w-3 h-3 text-amber-400" /> Seats
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-400 block font-mono">
                {booking.seats.join(', ')}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block flex items-center gap-1 mb-1">
                Amount Paid
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 block tabular-nums">
                ₹{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Applied Offer Banner */}
          {booking.appliedOffer && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-300 block">
                    {booking.appliedOffer.title} ({booking.appliedOffer.code})
                  </span>
                  <span className="text-emerald-400/80 text-[11px]">
                    {booking.appliedOffer.description}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-emerald-400 tabular-nums">
                -₹{booking.appliedOffer.discountAmount}
              </span>
            </div>
          )}

          {/* Canteen Order Summary (if any snacks included) */}
          {booking.canteenItems && booking.canteenItems.length > 0 && (
            <div className="p-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Popcorn className="w-3.5 h-3.5" /> Cinema Canteen Order (₹{booking.canteenTotal})
              </span>
              <div className="flex flex-wrap gap-2 text-zinc-300">
                {booking.canteenItems.map((c) => (
                  <span
                    key={c.item.id}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]"
                  >
                    {c.item.name} × {c.count} (₹{c.item.price * c.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Unlocked Rewards & Perks Vouchers */}
          {booking.unlockedRewards && booking.unlockedRewards.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Unlocked CineBook Reward Vouchers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {booking.unlockedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-zinc-950 border border-amber-500/40 relative overflow-hidden flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300">
                        {reward.badge}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        CLAIMABLE
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-tight">
                      {reward.description}
                    </p>
                    <div className="pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Voucher Code:</span>
                      <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                        {reward.couponCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theatre and Screen Details */}
          <div className="flex items-start gap-2.5 text-xs text-zinc-300">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">{booking.theatre.name}</span>
              <span className="text-zinc-400">
                {booking.theatre.screen} · {booking.theatre.location} · Payment: {booking.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Stub Line with Circles */}
        <div className="relative flex items-center justify-between my-2">
          {/* Left Notch */}
          <div className="w-6 h-6 rounded-r-full bg-zinc-950 -ml-3 border-r border-zinc-800" />
          {/* Dashed line */}
          <div className="flex-1 border-t-2 border-dashed border-zinc-800 mx-2" />
          {/* Right Notch */}
          <div className="w-6 h-6 rounded-l-full bg-zinc-950 -mr-3 border-l border-zinc-800" />
        </div>

        {/* Ticket Bottom Stub with QR Code & Barcode */}
        <div data-tour="ticket-qr-info" className="p-6 sm:p-7 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {renderQRCode()}
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">
                Official Digital Gate Pass
              </span>
              <p className="text-[11px] text-zinc-400 leading-tight max-w-[200px]">
                Scan with mobile phone camera at cinema turnstile for instant admission.
              </p>
              <span className="text-[10px] text-zinc-500 font-mono block pt-1">
                REF: {booking.id}
              </span>
              {booking.verificationHash && (
                <span className="text-[9px] text-emerald-400/80 font-mono block">
                  SIG: {booking.verificationHash}
                </span>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col items-center sm:items-end">
            <div className="text-[10px] text-zinc-500 font-mono mb-1 text-center sm:text-right">
              SERIAL: {booking.id}
            </div>
            {renderBarcode()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Ticket</span>
        </button>

        <button
          onClick={handleCopyDetails}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Copy Details</span>
            </>
          )}
        </button>

        {onOpenCineBotHelp && (
          <button
            onClick={() => onOpenCineBotHelp("How do I download my invoice and how does QR verification work?")}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            title="Ask CineBot about ticket verification or invoices"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Ask CineBot</span>
          </button>
        )}

        <button
          onClick={onBookAnother}
          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Book Another Movie</span>
        </button>
      </div>
    </div>
  );
};
