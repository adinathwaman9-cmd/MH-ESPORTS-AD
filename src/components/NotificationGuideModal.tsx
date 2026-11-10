import React from 'react';
import { X, Bell, BellRing, BellOff, ShieldAlert, Smartphone, ExternalLink, Volume2, CheckCircle2, RotateCcw, AlertTriangle, Lock } from 'lucide-react';
import { playRoomAlertSound } from '../utils/soundAlert';

interface NotificationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: NotificationPermission;
  onRetryPermission: () => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const NotificationGuideModal: React.FC<NotificationGuideModalProps> = ({
  isOpen,
  onClose,
  permission,
  onRetryPermission,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleTestSound = () => {
    playRoomAlertSound();
    onShowToast('🔊 Gaming alert chime played & mobile vibration triggered!');
  };

  const handleOpenStandalone = () => {
    try {
      window.open(window.location.href, '_blank');
      onShowToast('🚀 Opening in new tab for direct Chrome permissions...');
    } catch {
      onShowToast('Please open the URL directly in Chrome.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121626] border border-orange-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-950 via-[#181C30] to-[#121626] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              permission === 'granted'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : permission === 'denied'
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}>
              {permission === 'granted' ? (
                <BellRing className="w-5 h-5" />
              ) : permission === 'denied' ? (
                <BellOff className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5 animate-bounce" />
              )}
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl text-white font-bold">
                {permission === 'granted'
                  ? 'Mobile Notifications Active! ✅'
                  : 'Notification Permission Status & Guide'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {permission === 'granted'
                  ? 'Your phone will receive Room ID & Password alerts'
                  : 'Room ID & Password अलर्ट्स मोबाईलमध्ये कसे चालू करावे'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Badge */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            permission === 'granted'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : permission === 'denied'
              ? 'bg-red-950/30 border-red-500/40 text-red-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            {permission === 'granted' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs uppercase tracking-wider">Current Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  permission === 'granted'
                    ? 'bg-emerald-500 text-white'
                    : permission === 'denied'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-black'
                }`}>
                  {permission.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {permission === 'granted'
                  ? 'परवानगी मिळालेली आहे! जेव्हा ॲडमिन Room ID देईल तेव्हा तुमच्या फोनच्या नोटिफिकेशन बारमध्ये मेसेज येईल.'
                  : permission === 'denied'
                  ? 'ब्राउझरमध्ये "Notification Permission was not granted" येत आहे, कारण Chrome किंवा Android Settings मध्ये या साइटसाठी नोटिफिकेशन्स "Blocked" आहेत.'
                  : 'अद्याप परवानगी मागितलेली नाही. खालील बटणावर क्लिक करून "Allow" करा.'}
              </p>
            </div>
          </div>

          {/* Guide Steps to Unblock in Chrome */}
          {permission !== 'granted' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider text-orange-400">
                <Smartphone className="w-4 h-4" /> Chrome मध्ये Permissions कसे Unblock (Allow) करावे:
              </h4>

              <div className="space-y-2 bg-[#0B0E17] p-3.5 rounded-xl border border-gray-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <p className="text-white font-semibold">Chrome URL बार मधील आयकॉनवर टॅप करा</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      वर डाव्या बाजूला असलेल्या <Lock className="w-3 h-3 text-amber-400 inline" /> <strong>Lock</strong> किंवा <strong>Site Settings</strong> वर क्लिक करा.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-gray-800/80">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <p className="text-white font-semibold">"Permissions" ➔ "Notifications" वर जा</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      तिथे <strong>Notifications</strong> पर्याय निवडून <strong>"Allow" (परवानगी द्या)</strong> वर सेट करा.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-gray-800/80">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <p className="text-white font-semibold">पेज रिफ्रेश करा (Refresh Page)</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      रिफ्रेश केल्यावर नोटिफिकेशन बार सक्रिय होईल!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {permission !== 'granted' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await onRetryPermission();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुन्हा प्रयत्न करा (Try Request)</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenStandalone}
                  className="py-2.5 px-3 rounded-xl bg-[#182138] hover:bg-[#1E2B4B] border border-orange-500/40 text-orange-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-orange-400" />
                  <span>Open in Chrome Tab</span>
                </button>
              </div>
            )}

            {/* Test Audio & Vibration Button */}
            <button
              type="button"
              onClick={handleTestSound}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B0E17] hover:bg-gray-800/80 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>🔊 Test Gaming Sound & Phone Vibration (कोणतीही अडचण नाही)</span>
            </button>
          </div>

          {/* Guarantee Box */}
          <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/30 text-gray-300 text-[11px] space-y-1">
            <span className="font-bold text-orange-400 block">✨ खेळाडूंसाठी खात्री (100% Guaranteed):</span>
            <p className="leading-relaxed">
              जरी ब्राउझरमध्ये नोटिफिकेशन परवानगी नाकारली गेली असेल (Denied), तरी <strong>MH ESPORTS ॲपमध्ये Live Sticky Notification Bar</strong> लगेच सक्रिय होतो आणि मोठा गेमिंग अलार्म वाजवतो. त्यामुळे कोणतीही रूम किंवा मॅच कधीही सुटणार नाही!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#0B0E17] border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition-colors"
          >
            समजले (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
