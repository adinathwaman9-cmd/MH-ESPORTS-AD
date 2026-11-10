import React, { useState } from 'react';
import { Trophy, Swords, Medal, Crown, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { MatchResultRecord } from '../types';

interface LeaderboardViewProps {
  results: MatchResultRecord[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'results' | 'killers' | 'earners'>('results');

  const topKillers = [
    { rank: 1, name: 'TSG_Ritik_OP', uid: '1098274431', kills: 42, winnings: 1450, badge: 'Grandmaster' },
    { rank: 2, name: 'RASTAR_ARMY', uid: '2093847112', kills: 38, winnings: 1280, badge: 'Heroic' },
    { rank: 3, name: 'TOTAL_AJJU_FAN', uid: '3049182049', kills: 31, winnings: 1100, badge: 'Heroic' },
    { rank: 4, name: 'VINCENZO_99', uid: '4091827361', kills: 27, winnings: 920, badge: 'Diamond IV' },
    { rank: 5, name: 'SK_SABIR_FAN', uid: '5019283746', kills: 24, winnings: 850, badge: 'Diamond III' },
  ];

  const topEarners = [
    { rank: 1, name: 'TEAM GODLIKE', matchesWon: 14, earnings: 4200, badge: 'Pro Squad' },
    { rank: 2, name: 'TSG_Ritik_OP', matchesWon: 11, earnings: 3850, badge: 'Grandmaster' },
    { rank: 3, name: 'CRX_ELITE', matchesWon: 9, earnings: 2900, badge: 'Tournament King' },
    { rank: 4, name: 'RASTAR_ARMY', matchesWon: 7, earnings: 2400, badge: 'Bounty Hunter' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab filter */}
      <div className="flex items-center gap-2 p-1 bg-[#121626] border border-gray-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'results' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Match Results & Proofs</span>
        </button>

        <button
          onClick={() => setActiveTab('killers')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'killers' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Top Killers</span>
        </button>

        <button
          onClick={() => setActiveTab('earners')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'earners' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Top Earners</span>
        </button>
      </div>

      {/* Tab: Match Results */}
      {activeTab === 'results' && (
        results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#121626] border border-gray-800 hover:border-orange-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-gaming font-bold text-white text-sm truncate max-w-[220px]">
                    {res.tournamentTitle}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{res.completedAt}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-yellow-400 uppercase font-semibold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-400" /> Booyah #1 Winner
                    </span>
                    <p className="font-bold text-white mt-0.5 truncate">{res.winnerName}</p>
                    <p className="text-[10px] text-gray-400">UID: {res.winnerUid}</p>
                  </div>

                  <div className="border-l border-gray-800 pl-2">
                    <span className="text-[10px] text-orange-400 uppercase font-semibold flex items-center gap-1">
                      <Swords className="w-3 h-3 text-red-400" /> Match MVP
                    </span>
                    <p className="font-bold text-white mt-0.5">{res.mvpName}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">{res.mvpKills} Kills • Payout Sent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-gray-400">
                  <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Referee Verified & Paid</span>
                  </div>
                  <span className="font-bold text-yellow-400">₹{res.winnerPrize} Won</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-[#121626] border border-gray-800 text-center space-y-3">
            <Trophy className="w-10 h-10 text-yellow-400 mx-auto opacity-50" />
            <h4 className="font-heading text-xl text-white">No Match Results Yet</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Completed match outcomes and Booyah winners declared by the tournament host will appear here with kill counts and payouts.
            </p>
          </div>
        )
      )}

      {/* Tab: Top Killers */}
      {activeTab === 'killers' && (
        <div className="space-y-2">
          {topKillers.map((k) => (
            <div
              key={k.rank}
              className="p-3 rounded-xl bg-[#121626] border border-gray-800 flex items-center justify-between text-xs hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-heading text-lg font-bold ${
                  k.rank === 1
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : k.rank === 2
                    ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                    : k.rank === 3
                    ? 'bg-amber-700/20 text-amber-500 border border-amber-600/40'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  #{k.rank}
                </div>
                <div>
                  <p className="font-gaming font-bold text-white text-sm">{k.name}</p>
                  <p className="text-[10px] text-gray-400">UID: {k.uid} • {k.badge}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-heading text-lg text-red-400 font-bold block">{k.kills} Kills</span>
                <span className="text-[10px] text-emerald-400 font-semibold">₹{k.winnings} won</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Top Earners */}
      {activeTab === 'earners' && (
        <div className="space-y-2">
          {topEarners.map((e) => (
            <div
              key={e.rank}
              className="p-3 rounded-xl bg-[#121626] border border-gray-800 flex items-center justify-between text-xs hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-heading text-lg font-bold ${
                  e.rank === 1
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  #{e.rank}
                </div>
                <div>
                  <p className="font-gaming font-bold text-white text-sm">{e.name}</p>
                  <p className="text-[10px] text-gray-400">{e.matchesWon} Tournaments Won • {e.badge}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-heading text-xl text-yellow-400 font-bold block">₹{e.earnings}</span>
                <span className="text-[10px] text-gray-400">Total Payout</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
