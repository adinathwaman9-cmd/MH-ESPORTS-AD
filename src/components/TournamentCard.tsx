import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Users, Clock, Key, ShieldCheck, MapPin, ChevronRight, CheckCircle2, Zap, Calendar } from 'lucide-react';
import { Tournament, Registration } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  matchIndex?: number;
  userRegistration?: Registration;
  onJoin: (tournament: Tournament) => void;
  onViewRoom: (tournament: Tournament) => void;
  onViewRules: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  matchIndex,
  userRegistration,
  onJoin,
  onViewRoom,
  onViewRules,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatMatchTimeOnly = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const formatMatchDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const matchTime = new Date(tournament.startTime).getTime();
      const now = Date.now();
      const diff = matchTime - now;

      if (diff <= 0) {
        setTimeLeft('Match Starting / In Progress');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [tournament.startTime]);

  const isFull = tournament.registeredCount >= tournament.maxSlots;
  const isRegistered = !!userRegistration;
  // Room credentials are only considered ready when the admin actually entered them
  const hasRealRoom = Boolean(tournament.roomId && tournament.roomId.trim().length > 0);

  // Map image fallbacks
  const mapBackgrounds: Record<string, string> = {
    Bermuda: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    Purgatory: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    Kalahari: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    Alpine: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    Nexterra: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  };

  const bgImage = tournament.bannerUrl || mapBackgrounds[tournament.map] || mapBackgrounds['Bermuda'];

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#121626] border transition-all duration-300 hover:border-orange-500/60 shadow-xl ${
      isRegistered ? 'border-orange-500/70 ring-1 ring-orange-500/30' : 'border-gray-800'
    }`}>
      {/* Top Graphic Header */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden">
        <img
          src={bgImage}
          alt={tournament.title}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121626] via-[#121626]/60 to-transparent" />

        {/* Badges on Banner */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {matchIndex !== undefined && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-black uppercase shadow-md flex items-center gap-1 font-heading font-extrabold">
                <Clock className="w-3 h-3 text-black" />
                {formatMatchTimeOnly(tournament.startTime) ? `${formatMatchTimeOnly(tournament.startTime)} • ` : ''}
                {getOrdinal(matchIndex)} Match
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-orange-600 text-white uppercase shadow-md">
              {tournament.gameMode}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {tournament.map}
            </span>
          </div>

          {/* Status badge */}
          <div>
            {tournament.status === 'COMPLETED' ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700">
                FINISHED
              </span>
            ) : hasRealRoom ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 animate-pulse shadow-lg shadow-emerald-500/40">
                <Key className="w-3 h-3" /> ROOM ID OUT
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                REGISTRATION OPEN
              </span>
            )}
          </div>
        </div>

        {/* Title and Countdown over header */}
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <div className="max-w-[70%]">
            <h3 className="font-gaming font-bold text-base sm:text-lg text-white leading-tight drop-shadow truncate">
              {tournament.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] flex-wrap mt-0.5">
              {formatMatchDateTime(tournament.startTime) && (
                <span className="inline-flex items-center gap-1 text-amber-300 font-semibold bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {formatMatchDateTime(tournament.startTime)}
                </span>
              )}
              <div className="flex items-center gap-1 text-orange-400 font-medium bg-black/60 px-1.5 py-0.5 rounded border border-orange-500/30">
                <Clock className="w-3 h-3 text-orange-400" />
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>

          {isRegistered && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Slot #{userRegistration.slotNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Prize & Bounty Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#0B0E17]/80 border border-gray-800/80 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1">
              <Trophy className="w-2.5 h-2.5 text-yellow-400" /> Prize Pool
            </span>
            <span className="font-heading text-xl text-yellow-400 font-bold leading-tight">
              ₹{tournament.prizePool}
            </span>
          </div>

          <div className="flex flex-col border-x border-gray-800">
            <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center justify-center gap-1">
              <Swords className="w-2.5 h-2.5 text-red-400" /> Per Kill
            </span>
            <span className="font-heading text-xl text-white font-bold leading-tight">
              ₹{tournament.perKill}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Entry Fee</span>
            <span className={`font-heading text-xl font-bold leading-tight ${tournament.entryFee === 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>
        </div>

        {/* Room 1-min release notice */}
        {!hasRealRoom && (
          <div className="p-2 rounded-lg bg-[#0B0E17] border border-gray-800 text-[10px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-300">
              <Zap className="w-3 h-3" /> Room ID & Pass:
            </span>
            <span>1 min before match by Host</span>
          </div>
        )}

        {/* Slots progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Users className="w-3 h-3 text-gray-400" />
              <span>Spots Filled</span>
            </span>
            <span className="font-medium text-white text-[11px]">
              {tournament.registeredCount} / {tournament.maxSlots} {tournament.gameMode === 'SQUAD' ? 'Teams' : 'Players'}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tournament.registeredCount / tournament.maxSlots > 0.8
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{
                width: `${Math.min(100, Math.round((tournament.registeredCount / tournament.maxSlots) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => onViewRules(tournament)}
            className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-xs transition-colors"
            title="Match Rules & Points"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
          </button>

          {isRegistered ? (
            hasRealRoom ? (
              <button
                onClick={() => onViewRoom(tournament)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-gaming font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5 animate-bounce-subtle"
              >
                <Key className="w-4 h-4" />
                <span>VIEW ROOM ID & PASS</span>
              </button>
            ) : (
              <button
                onClick={() => onViewRoom(tournament)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#182138] border border-orange-500/40 text-orange-300 font-gaming font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#1E2947] transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ROOM COUNTDOWN (RELEASES AT 1M)</span>
              </button>
            )
          ) : tournament.status === 'COMPLETED' ? (
            <button
              onClick={() => onViewRules(tournament)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800 text-gray-300 text-xs font-gaming font-bold flex items-center justify-center gap-1"
            >
              <span>MATCH FINISHED - VIEW WINNERS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : isFull ? (
            <button
              disabled
              className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800/60 text-gray-500 text-xs font-gaming font-bold cursor-not-allowed text-center"
            >
              SLOTS FULL
            </button>
          ) : (
            <button
              onClick={() => onJoin(tournament)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white font-gaming font-bold text-sm tracking-wider uppercase shadow-lg shadow-orange-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1"
            >
              <span>JOIN MATCH {tournament.entryFee === 0 ? '(FREE)' : `(₹${tournament.entryFee})`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
