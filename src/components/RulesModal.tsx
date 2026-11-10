import React from 'react';
import { X, ShieldAlert, Award, FileText, CheckCircle2, AlertOctagon, Smartphone } from 'lucide-react';
import { Tournament } from '../types';

interface RulesModalProps {
  tournament: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ tournament, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white tracking-wide">
                Tournament Rulebook & Points
              </h3>
              <p className="text-xs text-gray-400">Official MH ESPORTS Free Fire Regulations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Points Table */}
          <div className="p-4 rounded-xl bg-[#0B0E17] border border-gray-800 space-y-2.5">
            <div className="flex items-center gap-2 text-yellow-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>Official Esports Points Breakdown</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded bg-gray-900 border border-gray-800">
                <span className="text-yellow-400 font-bold block text-xs">#1 Booyah</span>
                <span className="text-white">12 Points</span>
              </div>
              <div className="p-2 rounded bg-gray-900 border border-gray-800">
                <span className="text-gray-300 font-bold block text-xs">#2 Place</span>
                <span className="text-white">9 Points</span>
              </div>
              <div className="p-2 rounded bg-gray-900 border border-gray-800">
                <span className="text-gray-300 font-bold block text-xs">#3 Place</span>
                <span className="text-white">8 Points</span>
              </div>
              <div className="p-2 rounded bg-gray-900 border border-gray-800">
                <span className="text-red-400 font-bold block text-xs">Per Kill</span>
                <span className="text-white">1 Point + ₹Cash</span>
              </div>
            </div>
          </div>

          {/* Specific match rules */}
          {tournament?.rules && (
            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 space-y-1">
              <span className="font-semibold text-orange-300 block">Host Instructions for this match:</span>
              <p className="text-[11px] leading-relaxed">{tournament.rules}</p>
            </div>
          )}

          {/* Standard Regulations */}
          <div className="space-y-2.5 text-gray-300">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Crucial Fair-Play Rules:</h4>

            <div className="p-2.5 rounded-lg bg-[#141B30] border border-gray-800 flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Emulators: </strong>
                <span>PC emulators (Bluestacks, LDPlayer, etc.) are strictly prohibited. Mobile devices only.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#141B30] border border-gray-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Assigned Slot Discipline: </strong>
                <span>You must sit in the exact slot assigned to your registration. If you occupy another team's slot, you will be kicked before start.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#141B30] border border-gray-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Screenshot of Result: </strong>
                <span>Take a screenshot of the match score screen (showing your placement & kills). In case of disputes, submit screenshot to the host.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-[#141B30] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
