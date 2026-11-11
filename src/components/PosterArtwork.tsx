import React, { useState } from 'react';
import { Movie } from '../types';
import {
  Heart,
  Zap,
  Mail,
  Sparkles,
  Mountain,
  Smile,
  Shield,
  Sun,
  Music,
  Film,
  Award,
  Anchor,
  Lock,
  Ghost,
  Trophy,
  Flame,
  Palette,
  Eye,
  Bot
} from 'lucide-react';

interface PosterArtworkProps {
  movie: Movie;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'detail';
}

export const PosterArtwork: React.FC<PosterArtworkProps> = ({
  movie,
  className = '',
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false);
  const showPosterImage = Boolean(movie.posterUrl && !imageError);

  // Render bespoke movie visual elements (safe fallback)
  const renderVisualMotif = () => {
    switch (movie.id) {
      case 'elemental':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-orange-500/25 via-cyan-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-cyan-400 p-0.5 shadow-xl shadow-orange-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-10 h-10 text-orange-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-orange-300 uppercase">Fire & Water · Element City</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-orange-200/60 font-mono">
              <span>EMBER & WADE</span>
              <span>PETER SOHN · PIXAR</span>
            </div>
          </div>
        );

      case 'avengers-age-of-ultron':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-red-600/25 via-zinc-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 p-0.5 shadow-xl shadow-red-600/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-10 h-10 text-red-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-red-300 uppercase">Ultron Awakening · Sokovia</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-red-200/60 font-mono">
              <span>AVENGERS ASSEMBLE</span>
              <span>MARVEL STUDIOS 2015</span>
            </div>
          </div>
        );

      case 'doctor-strange-multiverse':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-purple-600/25 via-red-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-500 p-0.5 shadow-xl shadow-purple-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Eye className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-purple-300 uppercase">Eye of Agamotto · Multiverse</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-purple-200/60 font-mono">
              <span>DR. STRANGE · SCARLET WITCH</span>
              <span>SAM RAIMI DIRECTION</span>
            </div>
          </div>
        );

      case 'spiderman-no-way-home':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-blue-600/25 via-red-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-blue-500 p-0.5 shadow-xl shadow-blue-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-10 h-10 text-blue-400 fill-blue-500/40" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase">Web-Slingers · Multiverse</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-blue-200/60 font-mono">
              <span>PETER PARKER</span>
              <span>MARVEL & SONY</span>
            </div>
          </div>
        );

      case 'doraemon-art-world-tales':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-sky-500/25 via-blue-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 p-0.5 shadow-xl shadow-sky-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Palette className="w-10 h-10 text-sky-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-sky-300 uppercase">Artelia · Magical Canvas</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-sky-200/60 font-mono">
              <span>DORAEMON & NOBITA</span>
              <span>45TH ANNIVERSARY 2025</span>
            </div>
          </div>
        );

      case 'the-chosen':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-600/25 via-stone-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-xl shadow-amber-600/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sun className="w-10 h-10 text-amber-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                The Life of Jesus · TV Series
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-amber-200/60 font-mono">
              <span>4 SEASONS · 32 EPS</span>
              <span>DALLAS JENKINS</span>
            </div>
          </div>
        );

      case 'gatta-kushti-2':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-orange-600/25 via-amber-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-xl shadow-orange-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-10 h-10 text-orange-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-orange-300 uppercase">Wrestling Champions · Ring Showdown</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-orange-200/60 font-mono">
              <span>VISHNU VISHAL · AISHWARYA LEKSHMI</span>
              <span>JUSTIN PRABHAKARAN</span>
            </div>
          </div>
        );

      case 'mandaadi':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-sky-600/25 via-cyan-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-xl shadow-sky-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Anchor className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-cyan-300 uppercase">Sailboat Racing · Coastal Legacy</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-cyan-200/60 font-mono">
              <span>SOORI · SATHYARAJ</span>
              <span>GV PRAKASH MUSICAL</span>
            </div>
          </div>
        );

      case 'd-block':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-purple-600/25 via-violet-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-violet-400 p-0.5 shadow-xl shadow-purple-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Lock className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-purple-300 uppercase">Hostel Mystery Thriller</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-purple-200/60 font-mono">
              <span>ARULNITHI · AVANTIKA</span>
              <span>RON ETHAN YOHANN</span>
            </div>
          </div>
        );

      case 'the-conjuring':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-600/25 via-stone-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 p-0.5 shadow-xl shadow-amber-600/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Ghost className="w-10 h-10 text-amber-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">Warren Paranormal Case Files</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-amber-200/60 font-mono">
              <span>VERA FARMIGA · PATRICK WILSON</span>
              <span>JAMES WAN HORROR</span>
            </div>
          </div>
        );

      case 'amaran':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-red-600/25 via-stone-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-xl shadow-red-600/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Award className="w-10 h-10 text-red-400 fill-red-500/40" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-red-300 uppercase">Major Mukund Varadarajan AC</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-red-200/60 font-mono">
              <span>SIVAKARTHIKEYAN · SAI PALLAVI</span>
              <span>GV PRAKASH MUSICAL</span>
            </div>
          </div>
        );

      case 'remo':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-pink-500/20 via-rose-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 p-0.5 shadow-xl shadow-pink-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-10 h-10 text-pink-400 fill-pink-500/40 animate-pulse" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-pink-300 uppercase">Nurse Avatar & Romance</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-pink-200/60 font-mono">
              <span>SK & KEERTHY</span>
              <span>ANIRUDH MUSICAL</span>
            </div>
          </div>
        );

      case 'ghilli':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-500/25 via-orange-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-10 h-10 text-amber-400 fill-amber-500/50" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">Kabaddi Match · Madurai</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-amber-200/60 font-mono">
              <span>THALAPATHY VIJAY</span>
              <span>VIDYASAGAR HITS</span>
            </div>
          </div>
        );

      case 'sita-ramam':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-rose-500/20 via-red-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-400 p-0.5 shadow-xl shadow-rose-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Mail className="w-10 h-10 text-rose-400" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-rose-300 uppercase">Lt. Ram & Sita Mahalakshmi</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-rose-200/60 font-mono">
              <span>KASHMIR 1965</span>
              <span>DULQUER · MRUNAL</span>
            </div>
          </div>
        );

      case 'hi-nanna':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-sky-500/20 via-blue-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-400 p-0.5 shadow-xl shadow-sky-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-10 h-10 text-sky-400 fill-sky-500/40" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-sky-300 uppercase">A Father’s Bedtime Story</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-sky-200/60 font-mono">
              <span>NATURAL STAR NANI</span>
              <span>HESHAM MUSICAL</span>
            </div>
          </div>
        );

      case 'minmini':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-emerald-500/20 via-teal-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 p-0.5 shadow-xl shadow-emerald-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Mountain className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-emerald-300 uppercase">Himalayan Motorcycle Expedition</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-emerald-200/60 font-mono">
              <span>HALITHA SHAMEEM</span>
              <span>KHATIJA RAHMAN</span>
            </div>
          </div>
        );

      case 'geetha-govindam':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-orange-500/20 via-amber-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-300 p-0.5 shadow-xl shadow-orange-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Smile className="w-10 h-10 text-orange-400" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-orange-300 uppercase">Inkem Inkem Kavale</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-orange-200/60 font-mono">
              <span>DEVERAKONDA · RASHMIKA</span>
              <span>GOPI SUNDAR</span>
            </div>
          </div>
        );

      case 'avengers-endgame':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-purple-500/25 via-indigo-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-400 p-0.5 shadow-xl shadow-purple-500/25 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-purple-300 uppercase">Quantum Realm · Endgame</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-purple-200/60 font-mono">
              <span>AVENGERS ASSEMBLE</span>
              <span>MARVEL STUDIOS</span>
            </div>
          </div>
        );

      case 'tangled':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-yellow-500/20 via-amber-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-300 p-0.5 shadow-xl shadow-yellow-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sun className="w-10 h-10 text-yellow-300 fill-yellow-400/40" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-yellow-200 uppercase">Floating Sky Lanterns</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-yellow-200/60 font-mono">
              <span>DISNEY ANIMATION</span>
              <span>ALAN MENKEN</span>
            </div>
          </div>
        );

      case 'vaaranam-aayiram':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-cyan-500/20 via-teal-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-300 p-0.5 shadow-xl shadow-cyan-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Music className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-widest text-cyan-300 uppercase">Mundhinam Parthene</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-cyan-200/60 font-mono">
              <span>SURIYA DUAL ROLE</span>
              <span>HARRIS JAYARAJ</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Film className="w-12 h-12 text-zinc-600 mb-2" />
            <span className="text-xs text-zinc-400">CineBook Feature</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-b ${movie.bgGradient} border border-zinc-800 shadow-2xl flex flex-col justify-between p-4 group select-none transition-all duration-300 ${className}`}
    >
      {/* Real Movie Poster Image */}
      {showPosterImage && (
        <img
          src={movie.posterUrl}
          alt={`${movie.title} Official Theatrical Poster`}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}

      {/* Subtle top vignette for badge contrast when poster is active */}
      {showPosterImage ? (
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_rgba(9,9,11,0.85)_100%)] pointer-events-none" />
      )}

      {/* Top Badges inside Poster */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-black/75 backdrop-blur-md border border-zinc-700/60 text-zinc-200 shadow-sm">
          {movie.certificate}
        </span>
        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-sm">
          ★ {movie.rating}
        </span>
      </div>

      {/* Fallback Artwork and Title (shown only if poster fails to load) */}
      {!showPosterImage && (
        <>
          <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
            {renderVisualMotif()}
          </div>

          <div className="relative z-10 pt-2 border-t border-zinc-800/80 bg-zinc-950/80 -mx-4 -mb-4 p-3 backdrop-blur-xs">
            <div className="text-[11px] text-zinc-300 font-medium truncate">
              {movie.genres.join(' · ')}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-300">{movie.displayLanguage}</span>
              <span>{movie.duration}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
