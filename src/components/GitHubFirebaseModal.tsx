import React, { useState } from 'react';
import { X, Github, Database, ExternalLink, Check, Copy, Terminal, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface GitHubFirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubFirebaseModal: React.FC<GitHubFirebaseModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAuth();
  const [githubUser, setGithubUser] = useState(profile?.githubUsername || 'adinathwaman9');
  const [repoName, setRepoName] = useState('clashbattle-freefire-app');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const projectId = firebaseConfig.projectId;
  const dbId = firebaseConfig.firestoreDatabaseId;
  const firestoreConsoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/databases/${dbId}/data`;
  const authConsoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/users`;
  const overviewConsoleUrl = `https://console.firebase.google.com/project/${projectId}/overview`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSaveGithub = async () => {
    await updateProfile({
      githubUsername: githubUser,
      githubRepoUrl: `https://github.com/${githubUser}/${repoName}`,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#141B30]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white tracking-wide">
                Firebase Console & GitHub Connect
              </h3>
              <p className="text-xs text-gray-400">Direct integration links for your MH ESPORTS platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Firebase Console Section */}
          <div className="p-4 rounded-xl bg-[#141B30]/70 border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400">
                <Database className="w-5 h-5" />
                <span className="font-semibold text-sm">Firebase Cloud Console</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Active & Connected
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Your MH ESPORTS live database is provisioned and managed on Google Firebase Console. You can inspect player registrations, custom rooms, wallet transactions, and security rules anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800">
                <span className="text-[10px] uppercase font-bold text-gray-500">Firebase Project ID</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-white text-xs font-semibold">{projectId}</span>
                  <button
                    onClick={() => copyToClipboard(projectId, 'pid')}
                    className="p-1 text-gray-400 hover:text-orange-400"
                  >
                    {copiedItem === 'pid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0B0E17] border border-gray-800">
                <span className="text-[10px] uppercase font-bold text-gray-500">Firestore Rules Status</span>
                <div className="flex items-center gap-1.5 mt-0.5 text-emerald-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Hardened ABAC Rules Deployed</span>
                </div>
              </div>
            </div>

            {/* Direct Firebase Console Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={firestoreConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition-colors shadow-md"
              >
                <span>Open Firestore Database</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={authConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-xs border border-gray-700 transition-colors"
              >
                <span>Firebase Authentication</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={overviewConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-xs border border-gray-700 transition-colors"
              >
                <span>Project Overview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. GitHub Connection Section */}
          <div className="p-4 rounded-xl bg-[#141B30]/70 border border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Github className="w-5 h-5 text-gray-300" />
                <span className="font-semibold text-sm">GitHub Repository & Profile</span>
              </div>
              <span className="text-xs text-gray-400">adinathwaman9</span>
            </div>

            <p className="text-xs text-gray-300">
              Connect your GitHub account to sync your Free Fire tournament app source code, push updates, and display your developer badge.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">GitHub Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-xs">@</span>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="adinathwaman9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  placeholder="clashbattle-freefire-app"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSaveGithub}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs border border-gray-600 transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved to Profile!</span>
                  </>
                ) : (
                  <span>Update GitHub Info</span>
                )}
              </button>

              <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 hover:underline"
              >
                <span>Visit https://github.com/{githubUser}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Git push command instructions */}
            <div className="mt-3 p-3 rounded-lg bg-[#0B0E17] border border-gray-800 text-[11px] font-mono text-gray-300 space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-orange-400" /> Quick Git Setup Commands
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git remote add origin https://github.com/${githubUser}/${repoName}.git\ngit branch -M main\ngit push -u origin main`,
                      'gitcmd'
                    )
                  }
                  className="hover:text-white"
                >
                  {copiedItem === 'gitcmd' ? 'Copied!' : 'Copy commands'}
                </button>
              </div>
              <p className="text-gray-400"># Link local codebase to your repository:</p>
              <p className="text-orange-300 select-all">git remote add origin https://github.com/{githubUser}/{repoName}.git</p>
              <p className="text-orange-300 select-all">git branch -M main</p>
              <p className="text-orange-300 select-all">git push -u origin main</p>
            </div>
          </div>
        </div>

        {/* Footer */}
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
