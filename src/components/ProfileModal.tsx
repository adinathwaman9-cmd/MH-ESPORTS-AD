import React, { useState } from 'react';
import { X, User, Shield, Github, Database, Trophy, Swords, Wallet, LogOut, Check, Edit2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWallet: () => void;
  onOpenGitHubFirebase: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenWallet,
  onOpenGitHubFirebase,
}) => {
  const { profile, logout, updateProfile, isGuest, signInWithGoogle, isAdminUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [ign, setIgn] = useState(profile?.ffIgn || '');
  const [uid, setUid] = useState(profile?.ffUid || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      ffIgn: ign.trim(),
      ffUid: uid.trim(),
    });
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const AVATARS = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white tracking-wide">
                Player Profile & Gaming ID
              </h3>
              <p className="text-xs text-gray-400">Free Fire Esports Identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Avatar and IGN summary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-600/20 via-[#161D32] to-[#121626] border border-orange-500/30 flex items-center gap-4">
            <img
              src={profile.photoURL || AVATARS[0]}
              alt={profile.displayName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/50 shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-gaming font-bold text-lg text-white truncate">{profile.displayName}</h4>
                {profile.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    HOST / ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-gray-300 text-xs">
                <span>Free Fire IGN:</span>
                <strong className="text-orange-400 font-mono">{profile.ffIgn || 'Not set'}</strong>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <span>FF UID:</span>
                <strong className="text-white font-mono">{profile.ffUid || 'Not set'}</strong>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              title="Edit In-Game Name"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSave} className="p-3.5 rounded-xl bg-[#0B0E17] border border-orange-500/40 space-y-3">
              <span className="font-semibold text-white block">Update Free Fire Details:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">In-Game Name (IGN)</label>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full bg-[#141B30] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">FF UID</label>
                  <input
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className="w-full bg-[#141B30] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              {/* Avatar picker */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Choose Character Avatar</label>
                <div className="flex items-center gap-2">
                  {AVATARS.map((av, i) => (
                    <img
                      key={i}
                      src={av}
                      alt="avatar"
                      onClick={() => updateProfile({ photoURL: av })}
                      className="w-9 h-9 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all border border-gray-700"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-400" /> Matches
              </span>
              <span className="font-heading text-2xl text-white font-bold block">{profile.totalMatches || 0}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">
                <Swords className="w-3 h-3 text-red-400" /> Kills
              </span>
              <span className="font-heading text-2xl text-red-400 font-bold block">{profile.totalKills || 0}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-400" /> Winnings
              </span>
              <span className="font-heading text-2xl text-emerald-400 font-bold block">₹{profile.totalWinnings || 0}</span>
            </div>
          </div>

          {/* Connected Developer Credentials - ONLY FOR ADMIN */}
          {isAdminUser && (
            <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-gray-800 space-y-2">
              <span className="text-[11px] font-semibold text-gray-300 block">Connected Cloud & Code:</span>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#141B30] border border-gray-800">
                <div className="flex items-center gap-2 text-gray-300">
                  <Github className="w-4 h-4 text-orange-400" />
                  <span>GitHub: <strong className="text-white">adinathwaman9</strong></span>
                </div>
                <button
                  onClick={onOpenGitHubFirebase}
                  className="text-[11px] text-orange-400 hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#141B30] border border-gray-800">
                <div className="flex items-center gap-2 text-gray-300">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Firebase: <strong className="text-white font-mono text-[10px]">{firebaseConfig.projectId}</strong></span>
                </div>
                <a
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Console</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}

          {/* Quick Wallet Action */}
          <button
            onClick={() => { onClose(); onOpenWallet(); }}
            className="w-full py-2.5 rounded-xl bg-[#141B30] hover:bg-[#182138] border border-orange-500/40 text-orange-400 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>Open Wallet (Current: ₹{profile.walletBalance})</span>
          </button>

          {/* Logout or Google Link */}
          {isGuest ? (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-2">
              <p className="text-[11px] text-blue-200">Playing as Guest. Link your Google account to secure your winnings.</p>
              <button
                onClick={signInWithGoogle}
                className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full py-2 rounded-xl bg-gray-800 hover:bg-red-950/40 hover:text-red-400 text-gray-400 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
