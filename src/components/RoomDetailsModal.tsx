import React, { useState } from 'react';
import { X, Key, Copy, Check, ExternalLink, ShieldAlert, Smartphone, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import { Tournament, Registration } from '../types';

interface RoomDetailsModalProps {
  tournament: Tournament | null;
  registration?: Registration;
  isOpen: boolean;
  onClose: () => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  tournament,
  registration,
  isOpen,
  onClose,
}) => {
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [countdownText, setCountdownText] = useState<string>('');
  const [isPastTarget, setIsPastTarget] = useState<boolean>(false);

  React.useEffect(() => {
    if (!tournament) return;
    const calculateTime = () => {
      const matchTime = new Date(tournament.startTime).getTime();
      const targetReleaseTime = matchTime - 1 * 60 * 1000; // 1 minute before scheduled start time
      const now = Date.now();
      const diff = targetReleaseTime - now;

      if (diff <= 0) {
        setIsPastTarget(true);
        const matchDiff = matchTime - now;
        if (matchDiff > 0) {
          const s = Math.floor(matchDiff / 1000);
          setCountdownText(`Match in ${s}s • Awaiting Host`);
        } else {
          setCountdownText('Awaiting Host Room ID & Pass');
        }
      } else {
        setIsPastTarget(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setCountdownText(`${hours}h ${minutes}m ${String(seconds).padStart(2, '0')}s`);
        } else {
          setCountdownText(`${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [tournament?.startTime]);

  if (!isOpen || !tournament) return null;

  const hasRoomCredentials = Boolean(tournament.roomId && tournament.roomId.trim().length > 0);

  const handleCopyRoom = () => {
    if (tournament.roomId) {
      navigator.clipboard.writeText(tournament.roomId);
      setCopiedRoom(true);
      setTimeout(() => setCopiedRoom(false), 2000);
    }
  };

  const handleCopyPass = () => {
    if (tournament.roomPassword) {
      navigator.clipboard.writeText(tournament.roomPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleOpenFreeFire = () => {
    // Attempt custom intent or direct app link, with fallback to web
    window.location.href = 'freefire://';
    setTimeout(() => {
      // In case deep link fails or in desktop browser, prompt
      alert('If Free Fire did not open automatically, please open the Free Fire / FF MAX game on your phone and enter the Room ID.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-950/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Key className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl text-white tracking-wide">
                  Custom Room Credentials
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate max-w-xs">{tournament.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {hasRoomCredentials ? (
            <>
              {/* Room ID and Password Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Room ID Card */}
                <div className="p-4 rounded-xl bg-[#0B0E17] border border-emerald-500/40 relative group">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-emerald-400">ROOM ID</span>
                    <span className="text-[10px] text-gray-500">1-Tap Copy</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-2xl font-bold text-white tracking-wider">
                      {tournament.roomId}
                    </span>
                    <button
                      onClick={handleCopyRoom}
                      className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all active:scale-90"
                      title="Copy Room ID"
                    >
                      {copiedRoom ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Card */}
                <div className="p-4 rounded-xl bg-[#0B0E17] border border-emerald-500/40 relative group">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-emerald-400">PASSWORD</span>
                    <span className="text-[10px] text-gray-500">1-Tap Copy</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-2xl font-bold text-white tracking-wider">
                      {tournament.roomPassword || '1234'}
                    </span>
                    <button
                      onClick={handleCopyPass}
                      className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all active:scale-90"
                      title="Copy Password"
                    >
                      {copiedPass ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Slot Number Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-transparent border border-orange-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400">YOUR DESIGNATED POSITION</span>
                  <p className="font-gaming font-bold text-lg text-white">
                    Slot #{registration?.slotNumber || 7} {registration?.teamName ? `(${registration.teamName})` : ''}
                  </p>
                  <p className="text-[11px] text-gray-300">
                    IGN: <span className="font-mono text-orange-300 font-bold">{registration?.ffIgn || 'WARRIOR_PRO'}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Game Mode</span>
                  <span className="font-bold text-xs text-amber-300">{tournament.gameMode} • {tournament.map}</span>
                </div>
              </div>

              {/* Launch Game Quick Button */}
              <button
                onClick={handleOpenFreeFire}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-gaming text-base font-bold tracking-wider uppercase shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 transition-transform transform active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Free Fire / FF MAX</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>

              {/* Room Guidelines */}
              <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-gray-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Custom Room Rules:</span>
                </div>
                <ul className="space-y-1.5 text-gray-300 text-[11px] list-disc list-inside">
                  <li>
                    Strictly sit in your <strong>Assigned Slot #{registration?.slotNumber || 7}</strong>. Players sitting in wrong slots will be kicked by the referee.
                  </li>
                  <li>
                    Room starts exactly at the scheduled time. Host will not wait for offline players.
                  </li>
                  <li>
                    Take a clear screenshot of the end-match scoreboard (showing your kills) to claim kill bonuses.
                  </li>
                  <li>Hacking, teaming up in Solo matches, or emulator use results in immediate disqualification.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-10 h-10 animate-pulse text-amber-400" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  Room ID Release Countdown
                </span>
                <h4 className="font-heading text-3xl text-white font-bold tracking-wider">
                  {countdownText}
                </h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  {isPastTarget ? (
                    <span className="text-amber-300 font-semibold">
                      Host (Admin adinathwaman9) is creating the Free Fire MAX custom room right now. Room ID & Password will appear here the instant admin submits them!
                    </span>
                  ) : (
                    <span>
                      Room ID & Password will be unlocked <strong>1 minute before match start</strong> once submitted by the Admin from the Host Panel.
                    </span>
                  )}
                </p>
              </div>

              {/* Slot and Host Info Card */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Your Slot Number</span>
                  <p className="text-base font-bold text-orange-400 font-gaming mt-0.5">
                    Slot #{registration?.slotNumber || 1}
                  </p>
                  <span className="text-[10px] text-gray-400">Join this slot in room</span>
                </div>

                <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Match Format</span>
                  <p className="text-base font-bold text-white font-gaming mt-0.5">
                    {tournament.gameMode} ({tournament.maxSlots} Slots)
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">Map: {tournament.map}</span>
                </div>
              </div>

              {/* Live status banner */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  <span>Admin: <strong className="font-mono text-purple-300">adinathwaman9@gmail.com</strong></span>
                </div>
                <span className="text-[10px] text-gray-400">Live Auto-Sync Active</span>
              </div>
            </div>
          )}

          {/* Customer Support WhatsApp */}
          <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Need help or referee support?</span>
            </div>
            <a
              href="https://chat.whatsapp.com/sample-freefire-tournaments"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-medium text-[11px] transition-colors"
            >
              WhatsApp Group
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-[#141B30] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
