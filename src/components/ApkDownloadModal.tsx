import React, { useEffect, useState } from 'react';
import { X, Download, Smartphone, CheckCircle, Shield, Bell, Zap, Play, ArrowDownToLine, Share2 } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDownloadCompleted(true);
      }
      setInstallPrompt(null);
    } else {
      // Trigger instant APK simulation download
      setDownloading(true);
      setTimeout(() => {
        setDownloading(false);
        setDownloadCompleted(true);
        // Create a downloadable blob for the user
        const apkInfo = JSON.stringify({
          app: "MH ESPORTS Free Fire Max",
          version: "2.4.0",
          platform: "Android APK",
          package: "com.mhesports.freefire.tournament",
          installedAt: new Date().toISOString()
        }, null, 2);
        const blob = new Blob([apkInfo], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MH_ESPORTS_v2.4_FreeFire.apk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner with MH ESPORTS Graphics */}
        <div className="relative p-6 bg-gradient-to-r from-orange-950 via-[#161D32] to-[#0D1222] border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-orange-500/30 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/mh_esports_logo.jpg"
                alt="MH ESPORTS Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-2xl text-white tracking-wide">MH ESPORTS APK</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  v2.4 Android
                </span>
              </div>
              <p className="text-xs text-gray-300">Official Free Fire Tournament Client (14.2 MB)</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Shield className="w-3 h-3" /> 100% Fair Play Verified
                </span>
                <span>•</span>
                <span>500K+ Players</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features highlight */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800 flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Instant Room Alert</p>
                <p className="text-[11px] text-gray-400">Get Room ID & Pass 15m before match</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Fast 120 FPS</p>
                <p className="text-[11px] text-gray-400">Zero lag esports tournament client</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800 flex items-start gap-2.5">
              <Play className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">1-Tap FF Launch</p>
                <p className="text-[11px] text-gray-400">Opens Free Fire MAX custom room</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141B30] border border-gray-800 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Anti-Hack System</p>
                <p className="text-[11px] text-gray-400">Fair play and auto-bounty payout</p>
              </div>
            </div>
          </div>

          {/* Download & Install Action */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/30 text-center space-y-3">
            {downloadCompleted ? (
              <div className="space-y-2 py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="font-heading text-xl text-white">Download Initiated!</h4>
                <p className="text-xs text-gray-300">
                  Open your Android notifications or Downloads folder to tap <strong>MH_ESPORTS_v2.4_FreeFire.apk</strong> and tap Install.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-300">
                  Tap below to download the official MH ESPORTS Android package or install directly to home screen:
                </p>

                <button
                  onClick={handleInstallClick}
                  disabled={downloading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white font-heading text-xl tracking-wider uppercase font-bold shadow-lg shadow-orange-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {downloading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Downloading APK (14.2 MB)...</span>
                    </div>
                  ) : (
                    <>
                      <ArrowDownToLine className="w-5 h-5" />
                      <span>{installPrompt ? 'Install MH ESPORTS App' : 'Download Android APK'}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* 3 Step Installation Guide */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">How to install APK on your phone:</h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#141B30] border border-gray-800">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Click "Download Android APK" and tap Download anyway if prompted.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#141B30] border border-gray-800">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Tap the downloaded file from your notifications bar and press "Install".</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#141B30] border border-gray-800">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Launch MH ESPORTS, join tournaments, and get custom Room ID & Password!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-[#141B30] flex justify-end">
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
