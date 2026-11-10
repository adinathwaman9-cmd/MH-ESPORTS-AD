import React from 'react';
import { Flame, Wallet, Download, Github, Database, Shield, Globe, LogIn, Bell, BellRing } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenWallet: () => void;
  onOpenApkModal: () => void;
  onOpenGitHubFirebase: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onOpenPublish: () => void;
  onRequestNotification?: () => void;
  notificationPermission?: NotificationPermission;
  currentView?: 'website' | 'app';
  onToggleView?: (view: 'website' | 'app') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWallet,
  onOpenApkModal,
  onOpenGitHubFirebase,
  onOpenAdmin,
  onOpenProfile,
  onOpenPublish,
  onRequestNotification,
  notificationPermission = 'default',
  currentView = 'app',
  onToggleView,
}) => {
  const { profile, signInWithGoogle, isGuest, isAdminUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E17]/95 backdrop-blur-md border-b border-gray-800/80 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/mh_esports_logo.jpg"
              alt="MH ESPORTS Logo"
              className="w-full h-full object-cover rounded-[9px]"
              onError={(e) => {
                // fallback if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl tracking-wider text-white font-bold leading-none">
                MH<span className="text-orange-500"> ESPORTS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
                MH FF MAX
              </span>
            </div>
            <p className="text-[10px] text-gray-400 leading-none">Free Fire Esports Tournaments</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Website & App Switcher Pill */}
          {onToggleView && (
            <div className="flex items-center bg-[#121626] p-0.5 sm:p-1 rounded-xl border border-cyan-500/40 text-xs font-semibold">
              <button
                onClick={() => onToggleView('website')}
                className={`py-1 px-2 sm:px-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  currentView === 'website'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="View Official Website & Download Portal"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website</span>
              </button>
              <button
                onClick={() => onToggleView('app')}
                className={`py-1 px-2 sm:px-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  currentView === 'app'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Play Tournaments in App Lobby"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matches</span>
              </button>
            </div>
          )}
          {/* Mobile Notification Status Bell */}
          {onRequestNotification && (
            <button
              onClick={onRequestNotification}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 animate-pulse'
              }`}
              title={
                notificationPermission === 'granted'
                  ? 'Mobile Notification Alerts Active (Tap to test)'
                  : 'Turn ON mobile notification bar alerts for Room ID'
              }
            >
              {notificationPermission === 'granted' ? (
                <BellRing className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              )}
              <span className="hidden md:inline text-[11px]">
                {notificationPermission === 'granted' ? 'Alerts ON' : 'Alerts'}
              </span>
            </button>
          )}

          {/* Publish App Guide Button - ONLY FOR ADMIN */}
          {isAdminUser && (
            <button
              onClick={onOpenPublish}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-medium transition-all"
              title="How to publish this app to Web & Android APK"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Publish Guide</span>
            </button>
          )}

          {/* APK Download Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-xs shadow-md shadow-emerald-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            title="Download MH ESPORTS Android APK"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download</span> APK
          </button>

          {/* GitHub & Firebase Console Link - ONLY FOR ADMIN */}
          {isAdminUser && (
            <button
              onClick={onOpenGitHubFirebase}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-xs transition-colors"
              title="GitHub & Firebase Console"
            >
              <div className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-orange-400" />
                <Database className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-[11px] font-medium">Console & Git</span>
            </button>
          )}

          {/* Admin Panel button - ONLY FOR ADMIN */}
          {isAdminUser && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 text-xs font-semibold transition-all shadow-md shadow-purple-900/40"
              title="Full Admin Access (adinathwaman9@gmail.com)"
            >
              <Shield className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden md:inline">Admin Panel</span>
            </button>
          )}

          {/* Wallet Balance Pill */}
          <div
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#151B2E] border border-orange-500/40 hover:border-orange-500 cursor-pointer transition-all shadow-sm group"
          >
            <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">Wallet</span>
              <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                ₹{profile ? profile.walletBalance : 0}
              </span>
            </div>
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold ml-0.5">
              +
            </div>
          </div>

          {/* Profile or Login */}
          {profile ? (
            <button
              onClick={onOpenProfile}
              className="relative rounded-full ring-2 ring-orange-500/50 hover:ring-orange-400 transition-all p-0.5"
              title="View Profile & Stats"
            >
              <img
                src={profile.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'}
                alt={profile.displayName}
                className="w-8 h-8 rounded-full object-cover bg-gray-800"
              />
              {isGuest && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-[#0B0E17] rounded-full" title="Guest Mode" />
              )}
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
