import React, { useState, useEffect } from 'react';
import { X, Swords, Wallet, AlertCircle, Shield, Gamepad2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tournament, Registration } from '../types';
import { useAuth } from '../context/AuthContext';

interface JoinModalProps {
  tournament: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
  tournamentRegistrations?: Registration[];
  onConfirmJoin: (tournament: Tournament, details: { ign: string; selectedSlot: number }) => Promise<void>;
  onOpenWallet: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  tournament,
  isOpen,
  onClose,
  tournamentRegistrations = [],
  onConfirmJoin,
  onOpenWallet,
}) => {
  const { profile } = useAuth();
  const [ign, setIgn] = useState(profile?.ffIgn || '');
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map of taken slots -> player IGN
  const takenSlotsMap = new Map<number, string>();
  tournamentRegistrations.forEach((r) => {
    if (r.slotNumber) {
      takenSlotsMap.set(r.slotNumber, r.ffIgn || r.userName || 'Booked');
    }
  });

  // Automatically pick the first free slot when opening
  useEffect(() => {
    if (!tournament) return;
    const maxSlots = tournament.maxSlots || 48;
    for (let s = 1; s <= maxSlots; s++) {
      if (!takenSlotsMap.has(s)) {
        setSelectedSlot(s);
        break;
      }
    }
  }, [tournament?.id, tournamentRegistrations.length]);

  if (!isOpen || !tournament) return null;

  const currentBalance = profile?.walletBalance || 0;
  const isFree = tournament.entryFee === 0;
  const hasEnoughBalance = isFree || currentBalance >= tournament.entryFee;
  const totalSlots = tournament.maxSlots || 48;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ign.trim()) {
      setError('Please enter your Free Fire In-Game Name (IGN).');
      return;
    }

    if (takenSlotsMap.has(selectedSlot)) {
      setError(`Slot #${selectedSlot} was just taken. Please pick another available slot.`);
      return;
    }

    if (!hasEnoughBalance) {
      setError(`Insufficient wallet balance. You need ₹${tournament.entryFee - currentBalance} more.`);
      return;
    }

    try {
      setLoading(true);
      await onConfirmJoin(tournament, {
        ign: ign.trim(),
        selectedSlot,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FFD000', '#00F0FF', '#10B981'],
      });

      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to join tournament. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white tracking-wide">
                Join Match Registration
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-[260px] sm:max-w-xs">{tournament.title}</p>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Match summary card */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#0B0E17] border border-gray-800 text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-400">Mode & Map</span>
              <p className="font-semibold text-white">{tournament.gameMode} • {tournament.map}</p>
            </div>
            <div className="border-x border-gray-800">
              <span className="text-[10px] text-gray-400">Prize Pool</span>
              <p className="font-bold text-yellow-400">₹{tournament.prizePool}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400">Entry Fee</span>
              <p className="font-bold text-orange-400">{isFree ? 'FREE' : `₹${tournament.entryFee}`}</p>
            </div>
          </div>

          {/* Wallet check alert */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            hasEnoughBalance ? 'bg-[#141B30] border-gray-800 text-gray-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-400" />
              <div>
                <span>Wallet Balance: </span>
                <span className="font-bold text-white">₹{currentBalance}</span>
              </div>
            </div>

            {!hasEnoughBalance && (
              <button
                type="button"
                onClick={onOpenWallet}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-[11px] transition-colors"
              >
                + Add Cash
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Game Name (Free Fire IGN) Only */}
          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-orange-400" />
              <span>Game Name (Free Fire In-Game Name) <span className="text-orange-400">*</span></span>
            </label>
            <input
              type="text"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full bg-[#0B0E17] border border-gray-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 font-medium"
              placeholder="Enter your Free Fire player name (e.g. TSG_JASH_OP)"
              required
              autoFocus
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Enter your exact Free Fire nickname so the referee can identify you in the room.
            </span>
          </div>

          {/* Slot Selection Grid (Any player can choose any slot!) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Select Your Slot Number ({totalSlots} Slots)</span>
              </label>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Free
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Booked
                </span>
                <span className="flex items-center gap-1 text-orange-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> Selected
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B0E17] border border-gray-800">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotNum) => {
                  const isTaken = takenSlotsMap.has(slotNum);
                  const takenBy = takenSlotsMap.get(slotNum);
                  const isSelected = selectedSlot === slotNum;

                  return (
                    <button
                      key={slotNum}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedSlot(slotNum)}
                      title={isTaken ? `Slot #${slotNum} booked by ${takenBy}` : `Click to choose Slot #${slotNum}`}
                      className={`p-1 rounded-lg text-center font-gaming text-xs font-bold transition-all flex flex-col items-center justify-center min-h-[42px] cursor-pointer ${
                        isTaken
                          ? 'bg-red-950/25 text-red-400/50 border border-red-900/30 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white border-2 border-yellow-300 shadow-lg shadow-orange-600/40 scale-105 z-10'
                          : 'bg-[#141B30] text-gray-300 border border-gray-700/70 hover:border-orange-500 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-[9px] leading-none opacity-75">SLOT</span>
                      <span className="text-sm leading-tight font-extrabold">{slotNum}</span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-yellow-200 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs">
              <span className="text-gray-300">Your Chosen Slot:</span>
              <span className="font-gaming font-bold text-sm text-orange-400">
                Slot #{selectedSlot} ({tournament.gameMode})
              </span>
            </div>
          </div>

          {/* Room release note */}
          <div className="p-2.5 rounded-xl bg-[#141B30] border border-gray-800 text-gray-400 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Custom Room ID & Password will be published by Admin 1 minute before match start.
            </span>
          </div>

          {/* Submit button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || !hasEnoughBalance}
              className={`w-full py-3.5 px-4 rounded-xl font-heading text-xl uppercase font-bold tracking-wider shadow-lg transition-all ${
                hasEnoughBalance
                  ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white shadow-orange-600/30 cursor-pointer active:scale-98'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Slot #{selectedSlot}...</span>
                </div>
              ) : hasEnoughBalance ? (
                <span>Confirm Slot #{selectedSlot} • Pay {isFree ? 'FREE' : `₹${tournament.entryFee}`}</span>
              ) : (
                <span>Add Cash to Register</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
