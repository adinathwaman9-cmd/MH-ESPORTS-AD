/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Wallet,
  Users,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  Ticket,
  Clock,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  Database,
  Github,
  Globe,
  Plus
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { TournamentCard } from './components/TournamentCard';
import { JoinModal } from './components/JoinModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { WalletModal } from './components/WalletModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { GitHubFirebaseModal } from './components/GitHubFirebaseModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProfileModal } from './components/ProfileModal';
import { RulesModal } from './components/RulesModal';
import { LeaderboardView } from './components/LeaderboardView';
import { PublishModal } from './components/PublishModal';
import { RoomNotificationBar } from './components/RoomNotificationBar';
import { NotificationGuideModal } from './components/NotificationGuideModal';
import { LandingPageWebsite } from './components/LandingPageWebsite';
import { playRoomAlertSound } from './utils/soundAlert';
import { INITIAL_TOURNAMENTS, INITIAL_RESULTS } from './data/initialTournaments';
import { Tournament, Registration, Transaction, MatchResultRecord, GameMode } from './types';
import firebaseConfig from '../firebase-applet-config.json';

function MainApp() {
  const { profile, currentUser, deductEntryFee, isGuest, settings, isAdminUser } = useAuth();

  // State (Only Admin-created tournaments will be present, sorted time-wise)
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [results, setResults] = useState<MatchResultRecord[]>(INITIAL_RESULTS);

  // Mobile Status Bar Notification & Active Room Alert State
  const [activeRoomBanner, setActiveRoomBanner] = useState<Tournament | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Main View Switcher: App Lobby vs Official Landing Website
  const [mainView, setMainView] = useState<'app' | 'website'>('app');

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'matches' | 'my-matches' | 'leaderboard' | 'rules'>('matches');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SOLO' | 'DUO' | 'SQUAD' | 'CS_4V4' | 'FREE'>('ALL');

  // Modals
  const [joinModalTourn, setJoinModalTourn] = useState<Tournament | null>(null);
  const [roomModalTourn, setRoomModalTourn] = useState<Tournament | null>(null);
  const [rulesModalTourn, setRulesModalTourn] = useState<Tournament | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isApkOpen, setIsApkOpen] = useState(false);
  const [isGitFirebaseOpen, setIsGitFirebaseOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isNotifGuideOpen, setIsNotifGuideOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Set of known demo tournament IDs to purge permanently
  const DEMO_TOURNAMENT_IDS = new Set([
    'ff-tourn-1',
    'ff-tourn-2',
    'ff-tourn-3',
    'ff-br-solo-48',
    'ff-br-duo-48',
    'ff-br-squad-48',
    'ff-tourn-cs4v4',
    'ff-tourn-cs4v4-ranked',
    'ff-br-solo-1',
    'ff-br-duo-1',
    'ff-br-squad-1',
  ]);

  // Sync Tournaments with Firestore (Only tournaments created by Admin, sorted time-wise)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      const loaded: Tournament[] = [];

      snapshot.forEach((d) => {
        // If it's a demo tournament, delete it from Firestore permanently so it never reappears
        if (DEMO_TOURNAMENT_IDS.has(d.id)) {
          deleteDoc(doc(db, 'tournaments', d.id)).catch(() => {});
          return;
        }

        const itemData = d.data();

        // Clear any fake auto-generated room IDs
        let cleanRoomId = itemData.roomId || '';
        let cleanRoomPass = itemData.roomPassword || '';
        let cleanStatus = itemData.status;

        if (cleanRoomId && cleanRoomId.startsWith('81') && cleanRoomId.length === 7) {
          cleanRoomId = '';
          cleanRoomPass = '';
          if (cleanStatus === 'ROOM_OUT') cleanStatus = 'REGISTRATION_OPEN';
        }

        loaded.push({
          ...itemData,
          id: d.id,
          roomId: cleanRoomId,
          roomPassword: cleanRoomPass,
          status: cleanStatus,
        } as Tournament);
      });

      // Sort tournaments time-wise in ascending order (10:00 1st, 10:30 2nd, etc.)
      loaded.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        if (isNaN(timeA) && isNaN(timeB)) return 0;
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;
        return timeA - timeB;
      });

      setTournaments(loaded);
    }, (error) => {
      console.warn('Firestore tournaments sync fallback:', error);
    });

    return () => unsub();
  }, []);

  // Sync Registrations for active player
  useEffect(() => {
    const currentUserId = currentUser?.uid || profile?.uid;
    if (!currentUserId) return;

    const unsub = onSnapshot(collection(db, 'registrations'), (snapshot) => {
      const all: Registration[] = [];
      const userRegs: Registration[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Registration;
        const item = { ...data, id: d.id };
        all.push(item);
        if (data.userId === currentUserId) {
          userRegs.push(item);
        }
      });
      setAllRegistrations(all);
      setRegistrations(userRegs);
    }, (error) => {
      console.warn('Firestore registrations fallback:', error);
    });

    return () => unsub();
  }, [currentUser?.uid, profile?.uid]);

  // Sync Transactions
  useEffect(() => {
    const currentUserId = currentUser?.uid || profile?.uid;

    const unsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Transaction;
        list.push({ ...data, id: d.id });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllTransactions(list);

      if (currentUserId) {
        setTransactions(list.filter((tx) => tx.userId === currentUserId));
      }
    }, (error) => {
      console.warn('Firestore transactions fallback:', error);
    });

    return () => unsub();
  }, [currentUser?.uid, profile?.uid]);

  // Join Tournament Handler
  const handleConfirmJoin = async (
    tourn: Tournament,
    details: { ign: string; selectedSlot: number }
  ) => {
    const currentUserId = currentUser?.uid || profile?.uid || 'guest_user';
    const isFeeDeducted = await deductEntryFee(tourn.entryFee, tourn.title);
    if (!isFeeDeducted) {
      throw new Error('Insufficient wallet balance to pay entry fee. Please deposit via Real UPI first.');
    }

    const assignedSlot = details.selectedSlot;
    const regId = `reg_${tourn.id}_slot${assignedSlot}`;
    const newReg: Registration = {
      id: regId,
      tournamentId: tourn.id,
      userId: currentUserId,
      userName: profile?.displayName || details.ign,
      ffIgn: details.ign,
      slotNumber: assignedSlot,
      paidFee: tourn.entryFee,
      registeredAt: new Date().toISOString(),
    };

    setRegistrations((prev) => [...prev.filter((r) => r.id !== regId), newReg]);
    setAllRegistrations((prev) => [...prev.filter((r) => r.id !== regId), newReg]);

    const updatedTourn: Tournament = {
      ...tourn,
      registeredCount: Math.min(tourn.maxSlots, tourn.registeredCount + 1),
    };

    setTournaments((prev) => prev.map((t) => (t.id === tourn.id ? updatedTourn : t)));

    try {
      await setDoc(doc(db, 'registrations', regId), newReg);
      await updateDoc(doc(db, 'tournaments', tourn.id), {
        registeredCount: updatedTourn.registeredCount,
      });
    } catch (err) {
      console.warn('Firestore registration write note:', err);
    }

    showToast(`Slot #${assignedSlot} Confirmed for ${details.ign}! Room details release 1m before match.`);
  };

  // Admin: Update Room Credentials (Only real credentials entered by admin)
  const handleUpdateRoomCredentials = async (
    tournamentId: string,
    roomId: string,
    password: string,
    status: Tournament['status']
  ) => {
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournamentId
          ? { ...t, roomId, roomPassword: password, status }
          : t
      )
    );

    try {
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        roomId,
        roomPassword: password,
        status,
      });
    } catch (e) {
      console.warn('Room update sync note:', e);
    }

    if (roomId && roomId.trim().length > 0) {
      showToast(`Room ID (${roomId}) & Password published to players!`);
      const targetTourn = tournaments.find((t) => t.id === tournamentId);
      triggerSystemNotification(
        `🔥 FREE FIRE ROOM ID: ${targetTourn?.title || 'MH ESPORTS Match'}`,
        `🔑 Room ID: ${roomId} | Pass: ${password}\nJoin your slot in Free Fire MAX now!`,
        `room-${tournamentId}-${roomId}`,
        { url: '/', roomId, roomPassword: password }
      );
    } else {
      showToast(`Room credentials cleared. Waiting for Admin to enter details.`);
    }
  };

  // Trigger Native Mobile System Notification in Status Bar
  const triggerSystemNotification = (title: string, body: string, tag: string, data?: any) => {
    // 1. Guaranteed audible game sound and mobile vibration
    playRoomAlertSound();

    try {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      // Mobile device vibration alert
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([300, 150, 300, 150, 400]);
        } catch {}
      }

      // Check if service worker is available for full Android drawer notifications
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [300, 150, 300, 150, 400],
            tag,
            renotify: true,
            requireInteraction: true,
            data: data || { url: '/' },
            actions: [
              { action: 'open_app', title: 'Open MH ESPORTS' },
              { action: 'copy_creds', title: 'Copy Room ID' },
            ],
          } as any);
        }).catch(() => {
          new Notification(title, { body, icon: '/icon-192.png', tag });
        });
      } else {
        new Notification(title, { body, icon: '/icon-192.png', tag });
      }
    } catch (err) {
      console.warn('System notification error:', err);
    }
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Notifications are not supported in this browser.');
      return;
    }

    // Play chime sound so user has audio confirmation
    playRoomAlertSound();

    // If currently denied, Chrome will not re-prompt; open guide immediately
    if (Notification.permission === 'denied') {
      setNotificationPermission('denied');
      setIsNotifGuideOpen(true);
      showToast('⚠️ Notifications are blocked in Chrome. Tap for guide.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        showToast('🔔 Phone Notification Bar Alerts Enabled!');
        triggerSystemNotification(
          '🔥 MH ESPORTS Notifications Active!',
          'Room ID & Password will appear right here in your mobile notification bar 2 min before match!',
          'mh-test-perm'
        );
      } else if (perm === 'denied') {
        setIsNotifGuideOpen(true);
        showToast('⚠️ Notification permission blocked. Guide opened.');
      } else {
        showToast('Notification permission was not granted. Tap to see guide.');
        setIsNotifGuideOpen(true);
      }
    } catch (e) {
      console.warn('Notification permission error:', e);
      setIsNotifGuideOpen(true);
    }
  };

  // Watch for newly published rooms and notify in phone status bar
  useEffect(() => {
    const activeWithRoom = tournaments.find(
      (t) => t.roomId && t.roomId.trim().length > 0 && t.status !== 'COMPLETED'
    );

    if (activeWithRoom) {
      setActiveRoomBanner(activeWithRoom);

      const notifyKey = `notified_room_${activeWithRoom.id}_${activeWithRoom.roomId}`;
      const hasNotified = sessionStorage.getItem(notifyKey);

      if (!hasNotified) {
        sessionStorage.setItem(notifyKey, 'true');
        triggerSystemNotification(
          `🔥 FREE FIRE ROOM ID: ${activeWithRoom.title}`,
          `🔑 Room ID: ${activeWithRoom.roomId} | Pass: ${activeWithRoom.roomPassword}\nJoin your slot in Free Fire MAX now!`,
          `room-${activeWithRoom.id}-${activeWithRoom.roomId}`,
          { url: '/', roomId: activeWithRoom.roomId, roomPassword: activeWithRoom.roomPassword }
        );
      }
    }
  }, [tournaments]);

  // Admin: Kick / Remove Registration
  const handleKickRegistration = async (registrationId: string, tournamentId: string) => {
    try {
      const tourn = tournaments.find((t) => t.id === tournamentId);
      const newCount = Math.max(0, (tourn?.registeredCount || 1) - 1);

      await deleteDoc(doc(db, 'registrations', registrationId));
      setAllRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
      setTournaments((prev) =>
        prev.map((t) =>
          t.id === tournamentId ? { ...t, registeredCount: newCount } : t
        )
      );

      await updateDoc(doc(db, 'tournaments', tournamentId), {
        registeredCount: newCount,
      });

      showToast('Player removed from slot successfully!');
    } catch (e) {
      console.warn('Kick error:', e);
      showToast('Player removed from slot.');
    }
  };

  // Admin: Create Tournament
  const handleCreateTournament = async (
    newTourn: Omit<Tournament, 'id' | 'registeredCount' | 'createdAt'>
  ) => {
    const id = 'ff-tourn-' + Date.now();
    const fullTourn: Tournament = {
      ...newTourn,
      id,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };

    setTournaments((prev) => [fullTourn, ...prev]);

    try {
      await setDoc(doc(db, 'tournaments', id), fullTourn);
    } catch (e) {
      console.warn('Tournament created locally:', e);
    }

    showToast(`"${newTourn.title}" created & open for registrations!`);
  };

  // Admin: Delete Tournament
  const handleDeleteTournament = async (tournamentId: string) => {
    setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
    try {
      await deleteDoc(doc(db, 'tournaments', tournamentId));
    } catch (e) {
      console.warn('Delete tournament note:', e);
    }
    showToast('Match deleted successfully.');
  };

  // Admin: Declare Winner
  const handleDeclareWinner = async (
    tournamentId: string,
    winnerName: string,
    mvpName: string,
    prize: number
  ) => {
    const tourn = tournaments.find((t) => t.id === tournamentId);
    if (!tourn) return;

    const newResult: MatchResultRecord = {
      tournamentId,
      tournamentTitle: tourn.title,
      completedAt: 'Just Now',
      winnerName,
      winnerUid: '109' + Math.floor(1000000 + Math.random() * 9000000),
      winnerPrize: prize,
      mvpName,
      mvpKills: Math.floor(6 + Math.random() * 8),
    };

    setResults((prev) => [newResult, ...prev]);
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournamentId
          ? { ...t, status: 'COMPLETED', winnerTeam: winnerName, topKiller: mvpName }
          : t
      )
    );

    try {
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        status: 'COMPLETED',
        winnerTeam: winnerName,
        topKiller: mvpName,
      });
    } catch (e) {
      console.warn('Winner update sync:', e);
    }

    showToast(`Booyah recorded! ${winnerName} won ₹${prize}.`);
  };

  // Filter tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'FREE') return t.entryFee === 0;
    return t.gameMode === selectedFilter;
  });

  const myRegisteredTournaments = tournaments.filter((t) =>
    registrations.some((r) => r.tournamentId === t.id)
  );

  return (
    <div className="min-h-screen bg-[#0B0E17] text-gray-100 flex flex-col selection:bg-orange-500 selection:text-white pb-20 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-medium text-xs sm:text-sm shadow-xl shadow-orange-950/40 border border-orange-400 flex items-center gap-2 animate-bounce-subtle">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenApkModal={() => setIsApkOpen(true)}
        onOpenGitHubFirebase={() => setIsGitFirebaseOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPublish={() => setIsPublishOpen(true)}
        onRequestNotification={handleRequestNotificationPermission}
        notificationPermission={notificationPermission}
        currentView={mainView}
        onToggleView={(view) => setMainView(view)}
      />

      {/* Live Room Notification Alert Bar & Mobile Status Bar Trigger */}
      <RoomNotificationBar
        activeTournament={activeRoomBanner}
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestNotificationPermission}
        onDismissRoom={() => setActiveRoomBanner(null)}
        onViewRoom={(t) => setRoomModalTourn(t)}
        onSendToPhoneBar={(t) => {
          triggerSystemNotification(
            `🔥 MH ESPORTS: Custom Room ID Alert!`,
            `🏆 ${t.title}\n🔑 Room ID: ${t.roomId} | Password: ${t.roomPassword}\nJoin your slot in Free Fire MAX now!`,
            `mh-room-${t.id}-${Date.now()}`,
            { url: '/', roomId: t.roomId, roomPassword: t.roomPassword }
          );
          showToast('🔔 Room credentials sent to your phone notification bar!');
        }}
      />

      {/* View Switch: Website vs App Lobby */}
      {mainView === 'website' ? (
        <LandingPageWebsite
          onOpenAppLobby={() => setMainView('app')}
          onOpenApkModal={() => setIsApkOpen(true)}
        />
      ) : (
        <>
          {/* Hero Banner / APK & Publish CTA */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 w-full">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-950/90 via-[#161D32] to-[#0D1222] border border-orange-500/40 p-4 sm:p-6 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <img
                src="/mh_esports_logo.jpg"
                alt="MH ESPORTS Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-500/50 shadow-xl shadow-orange-950/50 shrink-0"
              />
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                    MH ESPORTS MAHARASHTRA 2026
                  </span>
                  <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Real UPI Payouts & Custom Rooms
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-wide font-bold">
                  MH ESPORTS Free Fire Tournament Platform
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Join Free Fire Max Solo, Duo & Squad tournaments across Maharashtra. Win real cash rewards per kill, get automatic custom Room ID & Password 2 minutes before match start, and withdraw instantly via UPI!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setIsApkOpen(true)}
                className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-gaming text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK</span>
              </button>

              {isAdminUser && (
                <button
                  onClick={() => setIsPublishOpen(true)}
                  className="flex-1 md:flex-none py-2.5 px-3.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 font-gaming text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>Publish Guide</span>
                </button>
              )}

              <button
                onClick={() => setMainView('website')}
                className="flex-1 md:flex-none py-2.5 px-3.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-gaming text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="View ClashBattle-style Official Website & Download Portal"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Official Website</span>
              </button>

              <button
                onClick={() => setIsWalletOpen(true)}
                className="flex-1 md:flex-none py-2.5 px-3.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-white font-gaming text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Add Money / UPI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-1 space-y-5">
        {/* Navigation Tabs (Desktop & Tablet) */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-[#121626] p-1 rounded-xl border border-gray-800/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('matches')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'matches'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>All Matches</span>
            </button>

            <button
              onClick={() => setActiveTab('my-matches')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all relative ${
                activeTab === 'my-matches'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Matches</span>
              {registrations.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {registrations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Winners & Results</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all hidden sm:flex ${
                activeTab === 'rules'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Rulebook</span>
            </button>
          </div>

          {/* Quick Payee Info */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-gray-400 hidden md:inline">
              Receiving UPI: <strong className="text-emerald-400 font-mono">{settings.adminUpiId}</strong>
            </span>
          </div>
        </div>

        {/* Matches View */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0 font-medium">
                <Filter className="w-3 h-3 text-orange-400" /> Filter:
              </span>

              {[
                { label: 'All Formats', val: 'ALL' },
                { label: 'FREE Matches', val: 'FREE' },
                { label: 'Solo', val: 'SOLO' },
                { label: 'Duo', val: 'DUO' },
                { label: 'Squad', val: 'SQUAD' },
                { label: 'CS 4v4 Ranked', val: 'CS_4V4' },
              ].map((f) => (
                <button
                  key={f.val}
                  onClick={() => setSelectedFilter(f.val as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedFilter === f.val
                      ? 'bg-orange-600 text-white font-semibold shadow-md shadow-orange-950/40'
                      : 'bg-[#121626] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tournaments Grid */}
            {filteredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTournaments.map((tourn, index) => {
                  const userReg = registrations.find((r) => r.tournamentId === tourn.id);
                  return (
                    <TournamentCard
                      key={tourn.id}
                      matchIndex={index + 1}
                      tournament={tourn}
                      userRegistration={userReg}
                      onJoin={(t) => setJoinModalTourn(t)}
                      onViewRoom={(t) => setRoomModalTourn(t)}
                      onViewRules={(t) => setRulesModalTourn(t)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#121626] border border-gray-800 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-white">सध्या कोणतीही मॅच उपलब्ध नाही</h3>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                    सर्व डेमो मॅचेस काढून टाकल्या आहेत. ॲडमिन (adinathwaman9@gmail.com) जेव्हा Host Panel मधून स्पर्धा तयार करतील, तेव्हा त्या मॅच वेळेनुसार (उदा. 10:00 1st, 10:30 2nd) येथे दिसतील.
                  </p>
                </div>
                {isAdminUser && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-gaming text-xs font-bold tracking-wider uppercase shadow-lg shadow-orange-950/40 inline-flex items-center gap-2 transition-transform transform hover:scale-105 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ पहिली मॅच तयार करा (Create Match)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Registered Matches View */}
        {activeTab === 'my-matches' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#121626] border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-gaming font-bold text-base text-white">Your Registered Tournaments</h3>
                <p className="text-[11px] text-gray-400">
                  Custom Room ID & Password will be published by Admin 1 minute before match start. Room details refresh live on your screen.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                {myRegisteredTournaments.length} Active Slots
              </span>
            </div>

            {myRegisteredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myRegisteredTournaments.map((tourn, index) => {
                  const userReg = registrations.find((r) => r.tournamentId === tourn.id);
                  const originalIndex = tournaments.findIndex((t) => t.id === tourn.id);
                  return (
                    <TournamentCard
                      key={tourn.id}
                      matchIndex={originalIndex >= 0 ? originalIndex + 1 : index + 1}
                      tournament={tourn}
                      userRegistration={userReg}
                      onJoin={(t) => setJoinModalTourn(t)}
                      onViewRoom={(t) => setRoomModalTourn(t)}
                      onViewRules={(t) => setRulesModalTourn(t)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#121626] border border-gray-800 space-y-4">
                <Ticket className="w-12 h-12 text-orange-400 mx-auto opacity-50" />
                <div>
                  <h3 className="font-heading text-2xl text-white">No Registered Matches Yet</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    You haven't joined any tournament yet. Browse active Free Fire matches and claim your slot!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors"
                >
                  Explore Free Fire Matches
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard & Results View */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView results={results} />
        )}

        {/* Rulebook View */}
        {activeTab === 'rules' && (
          <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-[#121626] border border-gray-800 space-y-4 text-xs">
            <h3 className="font-heading text-2xl text-white tracking-wide">
              MH ESPORTS Free Fire Tournament Guidelines
            </h3>
            <p className="text-gray-300 leading-relaxed">
              To ensure a fair and competitive environment, all players participating in MH ESPORTS matches must abide by the following official esports tournament rules:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
                <h4 className="font-bold text-orange-400 text-sm">1. Room Joining & Slot Discipline</h4>
                <p className="text-gray-300 mt-1">
                  Custom Room ID and Password are automatically released 2 minutes prior to match start time. Players must enter Free Fire MAX, go to Custom Room, enter Room ID & Password, and join their assigned slot number.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
                <h4 className="font-bold text-red-400 text-sm">2. Anti-Cheat & Ban Policy</h4>
                <p className="text-gray-300 mt-1">
                  Use of any third-party mods, auto-aim, scripts, wall-hacks, or PC emulators is permanently banned. Players caught cheating will have their wallet balances forfeited and accounts banned.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800">
                <h4 className="font-bold text-yellow-400 text-sm">3. Payouts & Kill Bounty Verification</h4>
                <p className="text-gray-300 mt-1">
                  Kill rewards and winning prizes are credited directly to your MH ESPORTS wallet within 15-30 minutes after match conclusion. Players can withdraw directly to PhonePe, Google Pay, or Paytm UPI (minimum ₹50).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
        </>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E17]/95 backdrop-blur-md border-t border-gray-800 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => {
            setMainView('app');
            setActiveTab('matches');
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            mainView === 'app' && activeTab === 'matches' ? 'text-orange-500 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => {
            setMainView('app');
            setActiveTab('my-matches');
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium relative transition-colors ${
            mainView === 'app' && activeTab === 'my-matches' ? 'text-orange-500 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Ticket className="w-5 h-5" />
          <span>My Slots</span>
          {registrations.length > 0 && (
            <span className="absolute top-0 right-3 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
              {registrations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setMainView((prev) => (prev === 'website' ? 'app' : 'website'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            mainView === 'website' ? 'text-cyan-400 font-bold' : 'text-gray-400 hover:text-cyan-400'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span>Website</span>
        </button>

        <button
          onClick={() => setIsWalletOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium text-gray-400 hover:text-orange-400 transition-colors"
        >
          <Wallet className="w-5 h-5 text-orange-400" />
          <span>Wallet</span>
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium text-gray-400 hover:text-white transition-colors"
        >
          <img
            src={profile?.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80'}
            alt="profile"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-orange-500/50"
          />
          <span>Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <JoinModal
        tournament={joinModalTourn}
        isOpen={!!joinModalTourn}
        onClose={() => setJoinModalTourn(null)}
        tournamentRegistrations={allRegistrations.filter((r) => r.tournamentId === joinModalTourn?.id)}
        onConfirmJoin={handleConfirmJoin}
        onOpenWallet={() => {
          setJoinModalTourn(null);
          setIsWalletOpen(true);
        }}
      />

      <RoomDetailsModal
        tournament={roomModalTourn}
        registration={registrations.find((r) => r.tournamentId === roomModalTourn?.id)}
        isOpen={!!roomModalTourn}
        onClose={() => setRoomModalTourn(null)}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        transactions={transactions}
      />

      <ApkDownloadModal
        isOpen={isApkOpen}
        onClose={() => setIsApkOpen(false)}
      />

      <GitHubFirebaseModal
        isOpen={isGitFirebaseOpen}
        onClose={() => setIsGitFirebaseOpen(false)}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        tournaments={tournaments}
        allTransactions={allTransactions}
        allRegistrations={allRegistrations}
        onKickRegistration={handleKickRegistration}
        onCreateTournament={handleCreateTournament}
        onDeleteTournament={handleDeleteTournament}
        onUpdateRoomCredentials={handleUpdateRoomCredentials}
        onDeclareWinner={handleDeclareWinner}
        onTestNotification={(title, body) => {
          triggerSystemNotification(
            title,
            body,
            `mh-admin-test-${Date.now()}`,
            { url: '/' }
          );
          showToast('🔔 Test notification sent to your phone notification bar!');
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenGitHubFirebase={() => setIsGitFirebaseOpen(true)}
      />

      <RulesModal
        tournament={rulesModalTourn}
        isOpen={!!rulesModalTourn}
        onClose={() => setRulesModalTourn(null)}
      />

      <NotificationGuideModal
        isOpen={isNotifGuideOpen}
        onClose={() => setIsNotifGuideOpen(false)}
        permission={notificationPermission}
        onRetryPermission={handleRequestNotificationPermission}
        onShowToast={showToast}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
