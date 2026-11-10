import React, { useState } from 'react';
import { BellRing, Bell, Key, Copy, Check, X, ShieldAlert, Smartphone } from 'lucide-react';
import { Tournament } from '../types';

interface RoomNotificationBarProps {
  activeTournament: Tournament | null;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => Promise<void>;
  onDismissRoom: () => void;
  onViewRoom: (tourn: Tournament) => void;
  onSendToPhoneBar: (tourn: Tournament) => void;
}

export const RoomNotificationBar: React.FC<RoomNotificationBarProps> = ({
  activeTournament,
  notificationPermission,
  onRequestPermission,
  onDismissRoom,
  onViewRoom,
  onSendToPhoneBar,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [dismissPermissionPrompt, setDismissPermissionPrompt] = useState(false);

  const copyText = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  // Case 1: Room ID & Password is live and published
  if (activeTournament && activeTournament.roomId) {
    return (
      <div className="sticky top-[57px] z-30 w-full bg-gradient-to-r from-orange-950 via-[#181126] to-[#120F24] border-b-2 border-orange-500 shadow-2xl animate-fadeIn">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
            {/* Alert Header */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 animate-pulse">
                <BellRing className="w-4 h-4 text-orange-400 animate-bounce" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    🔥 ROOM ID & PASS RELEASED:
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    STATUS BAR ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-medium truncate">
                  {activeTournament.title}
                </p>
              </div>
            </div>

            {/* Room Credentials Cards */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <div className="flex items-center gap-1.5 bg-[#0B0E17] border border-orange-500/40 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Room ID:</span>
                <span className="font-mono text-sm font-bold text-yellow-300 select-all">
                  {activeTournament.roomId}
                </span>
                <button
                  onClick={() => copyText(activeTournament.roomId || '', 'id')}
                  className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Copy Room ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0E17] border border-orange-500/40 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Pass:</span>
                <span className="font-mono text-sm font-bold text-emerald-300 select-all">
                  {activeTournament.roomPassword || 'None'}
                </span>
                <button
                  onClick={() => copyText(activeTournament.roomPassword || '', 'pass')}
                  className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                  title="Copy Password"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => onSendToPhoneBar(activeTournament)}
                className="py-1 px-2.5 rounded-lg bg-orange-600/30 hover:bg-orange-600/40 text-orange-300 border border-orange-500/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Send notification to phone status bar again"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Alert</span>
              </button>

              <button
                onClick={() => onViewRoom(activeTournament)}
                className="py-1 px-3 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-gaming text-xs font-bold uppercase tracking-wider shadow transition-colors cursor-pointer"
              >
                Open Free Fire
              </button>

              <button
                onClick={onDismissRoom}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                title="Dismiss Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Notification Permission Prompt (if not yet granted)
  if (notificationPermission !== 'granted' && !dismissPermissionPrompt) {
    const isDenied = notificationPermission === 'denied';
    return (
      <div className="sticky top-[57px] z-30 w-full bg-[#141B30] border-b border-orange-500/30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Bell className={`w-4 h-4 shrink-0 ${isDenied ? 'text-red-400' : 'text-amber-400'}`} />
            <span className="text-gray-200 truncate">
              🔔 <strong>Mobile Notifications:</strong> {isDenied ? 'Notifications are blocked in Chrome. Tap to see how to enable.' : 'Turn on notifications to get Room ID & Password directly in your phone status bar!'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRequestPermission}
              className={`py-1 px-3 rounded-lg text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm ${
                isDenied
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400'
              }`}
            >
              {isDenied ? 'How to Enable' : 'Enable Notifications'}
            </button>
            <button
              onClick={() => setDismissPermissionPrompt(true)}
              className="p-1 text-gray-400 hover:text-white rounded cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
