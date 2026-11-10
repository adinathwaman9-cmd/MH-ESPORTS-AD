import React, { useState } from 'react';
import {
  X,
  Globe,
  Smartphone,
  Github,
  Database,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Play,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAuth();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activePublishTab, setActivePublishTab] = useState<'apk' | 'web' | 'github' | 'checklist'>('apk');

  if (!isOpen) return null;

  const rawOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicAppUrl = rawOrigin.includes('ais-dev-')
    ? rawOrigin.replace('ais-dev-', 'ais-pre-')
    : rawOrigin || 'https://ais-pre-drgwj3cxs2d6ogl3elsctj-239253576150.asia-southeast1.run.app';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl text-white tracking-wide">
                  How to Publish MH ESPORTS App & APK
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  APK & Play Store
                </span>
              </div>
              <p className="text-xs text-gray-400">Deploy to Android Play Store, generate APK & host on custom domain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 flex border-b border-gray-800 text-xs font-semibold gap-2">
          <button
            onClick={() => setActivePublishTab('apk')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activePublishTab === 'apk' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Generate Android APK</span>
          </button>

          <button
            onClick={() => setActivePublishTab('web')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activePublishTab === 'web' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Host & Custom Domain</span>
          </button>

          <button
            onClick={() => setActivePublishTab('github')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activePublishTab === 'github' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Publish to GitHub</span>
          </button>

          <button
            onClick={() => setActivePublishTab('checklist')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activePublishTab === 'checklist' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Go-Live Checklist</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: GENERATE ANDROID APK */}
          {activePublishTab === 'apk' && (
            <div className="space-y-4">
              {/* Solution to User's Screenshot Error */}
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/40 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white text-sm">
                    404 एरर आणि PWABuilder एररचे नेमके कारण व उपाय:
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  स्क्रीनशॉटमध्ये <strong>"HTTP ERROR 404"</strong> आणि PWABuilder वर <strong>"Timed out"</strong> येण्याचे कारण म्हणजे:
                  Google AI Studio मध्ये ही लिंक चालू करण्यासाठी <strong>AI Studio च्या वरच्या उजव्या कोपऱ्यात असलेले "Share" बटण</strong> दाबून <strong>"Anyone with the link"</strong> सेव्ह करावे लागते.
                </p>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-amber-500/40 space-y-2">
                  <span className="text-amber-300 font-bold block text-xs">
                    👉 लिंक Active करण्यासाठी फक्त २ स्टेप्स करा:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px]">
                    <li>
                      AI Studio स्क्रीनच्या <strong>सर्वात वर उजव्या कोपऱ्यात (Top-Right)</strong> असलेले <strong>"Share"</strong> (किंवा <strong>"Publish"</strong>) बटण दाबा.
                    </li>
                    <li>
                      तिथे <strong>"Anyone with the link"</strong> निवडून <strong>"Save / Update"</strong> करा.
                    </li>
                    <li>
                      एवढे करताच खालील <strong>Public Link</strong> लगेच ॲक्टिव्ह होईल आणि 404 एरर निघून जाईल!
                    </li>
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-orange-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 block font-semibold">Official Public URL for PWABuilder:</span>
                    <span className="font-mono text-emerald-400 text-xs truncate block font-bold select-all">
                      {publicAppUrl}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyToClipboard(publicAppUrl, 'publicUrl')}
                      className="py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCmd === 'publicUrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCmd === 'publicUrl' ? 'Copied Link!' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(publicAppUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Open on PWABuilder</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#141B30] to-[#0D1222] border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    पायरी-दर-पायरी APK डाउनलोड करण्याची पद्धत:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    100% Guaranteed
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800 space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-300 text-[11px]">
                    <li>
                      वरील <strong>"Copy Link"</strong> बटण दाबा किंवा थेट <strong>"Open on PWABuilder"</strong> वर क्लिक करा.
                    </li>
                    <li>
                      PWABuilder वर तुमचे <strong>Manifest, Service Worker आणि Security</strong> हे सर्व हिरवे (Passed) दिसतील.
                    </li>
                    <li>
                      खाली दिलेल्या <strong>"Package For Stores"</strong> बटणावर क्लिक करा आणि <strong>"Android"</strong> निवडा.
                    </li>
                    <li>
                      तुमची <strong>MH ESPORTS Signed APK / AAB</strong> फाईल लगेच डाउनलोड होईल!
                    </li>
                    <li>
                      ही APK तुम्ही थेट Free Fire खेळाडूंना WhatsApp/Telegram वर पाठवून इन्स्टॉल करायला सांगू शकता किंवा Google Play Console वर अपलोड करू शकता!
                    </li>
                  </ol>
                </div>
              </div>

              {/* Method 2: Official Google Bubblewrap CLI */}
              <div className="p-4 rounded-xl bg-[#141B30] border border-gray-700 space-y-2.5">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-orange-400" /> Method 2: Google Bubblewrap (Android CLI)
                </h4>
                <p className="text-gray-300 text-[11px]">
                  If you have Node.js and Android SDK on your PC, you can generate the production APK via terminal:
                </p>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800 font-mono text-[11px] text-gray-300 space-y-1.5">
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>CLI Commands:</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `npm install -g @bubblewrap/cli\nbubblewrap init --manifest=${publicAppUrl}/manifest.json\nbubblewrap build`,
                          'bubblewrap'
                        )
                      }
                      className="text-orange-400 hover:text-orange-300"
                    >
                      {copiedCmd === 'bubblewrap' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-orange-300">npm install -g @bubblewrap/cli</p>
                  <p className="text-orange-300">bubblewrap init --manifest={publicAppUrl}/manifest.json</p>
                  <p className="text-orange-300">bubblewrap build</p>
                  <p className="text-gray-500"># Output: app-release-signed.apk</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB HOSTING & CUSTOM DOMAIN */}
          {activePublishTab === 'web' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141B30] border border-gray-700 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-400" /> Connect Your Custom Domain (e.g., clashbattle.com)
                </h4>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  You can deploy this React/Vite web application to <strong>Firebase Hosting</strong>, <strong>Vercel</strong>, or <strong>Cloud Run</strong> with SSL encryption and your custom domain:
                </p>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800">
                    <span className="font-semibold text-emerald-400 block mb-1">Option A: Firebase Hosting (Same project)</span>
                    <p className="text-gray-300 text-[11px] mb-2">
                      Because your Firebase database is already provisioned in project <code>{firebaseConfig.projectId}</code>, deploy with one command:
                    </p>
                    <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-orange-300 flex items-center justify-between">
                      <span>npm run build && firebase deploy --only hosting</span>
                      <button
                        onClick={() => copyToClipboard('npm run build && firebase deploy --only hosting', 'fbdeploy')}
                        className="text-gray-400 hover:text-white ml-2"
                      >
                        {copiedCmd === 'fbdeploy' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800">
                    <span className="font-semibold text-sky-400 block mb-1">Option B: Vercel / Netlify Deploy</span>
                    <p className="text-gray-300 text-[11px]">
                      1. Push this project to your GitHub account (<code>adinathwaman9</code>).<br />
                      2. Open vercel.com &rarr; "Import Git Repository" &rarr; Click <strong>Deploy</strong>.<br />
                      3. In Vercel Domain Settings, add your custom domain (e.g. <code>clashbattle.com</code>).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB PUSH */}
          {activePublishTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141B30] border border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Github className="w-4 h-4 text-white" /> Push Code to Your GitHub
                  </span>
                  <span className="text-orange-400 font-mono text-[11px]">@adinathwaman9</span>
                </div>

                <p className="text-gray-300 text-[11px]">
                  All files (React, Vite, Tailwind, Firebase rules, PWA manifest) are ready in your workspace. Run these commands to commit and push to your repository:
                </p>

                <div className="p-3 rounded-lg bg-[#0B0E17] border border-gray-800 font-mono text-[11px] text-gray-300 space-y-1.5">
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>Git terminal commands:</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `git add .\ngit commit -m "feat: complete Free Fire esports tournament app with real UPI and Firebase"\ngit branch -M main\ngit remote add origin https://github.com/adinathwaman9/clashbattle-freefire-app.git\ngit push -u origin main`,
                          'gitall'
                        )
                      }
                      className="text-orange-400 hover:text-orange-300"
                    >
                      {copiedCmd === 'gitall' ? 'Copied All!' : 'Copy All'}
                    </button>
                  </div>
                  <p className="text-orange-300">git add .</p>
                  <p className="text-orange-300">git commit -m "feat: complete Free Fire tournament platform"</p>
                  <p className="text-orange-300">git branch -M main</p>
                  <p className="text-orange-300">git remote add origin https://github.com/adinathwaman9/clashbattle-freefire-app.git</p>
                  <p className="text-orange-300">git push -u origin main</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Create new repo on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GO-LIVE CHECKLIST */}
          {activePublishTab === 'checklist' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#141B30] border border-gray-700 space-y-2.5">
                <h4 className="font-bold text-white text-sm">Official Launch Checklist:</h4>
                <div className="space-y-2 text-gray-300 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">1. Configure Your Real UPI ID: </strong>
                      <span>Open the <strong>Host Panel</strong> & update your real receiving UPI ID (e.g. <code>yourname@okhdfcbank</code> or <code>phone@paytm</code>). All player deposits will go directly to your bank account.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">2. Create Real Tournaments: </strong>
                      <span>In the Host Panel, delete dummy matches and schedule your real Free Fire matches with entry fees (₹10, ₹20, etc.) and match times.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">3. Connect WhatsApp / Telegram Group: </strong>
                      <span>Add your official player WhatsApp community link so gamers can reach you for customer support.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">4. Distribute Room ID on Time: </strong>
                      <span>15 minutes before match start, create the Custom Room in Free Fire, enter the Room ID and Password in Host Panel, and it will immediately unlock on players' cards!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
