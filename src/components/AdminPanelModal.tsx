import React, { useState } from 'react';
import {
  X,
  Shield,
  Plus,
  Key,
  Trophy,
  CheckCircle2,
  Trash2,
  DollarSign,
  CreditCard,
  Settings,
  ExternalLink,
  Check,
  AlertOctagon,
  Calendar,
  Clock,
  Image as ImageIcon,
  Sparkles,
  Users,
  Copy,
  Search,
  UserX,
  Bell,
  Smartphone
} from 'lucide-react';
import { Tournament, GameMode, MapType, Transaction, Registration } from '../types';
import { FREE_FIRE_POSTERS } from '../data/initialTournaments';
import { useAuth } from '../context/AuthContext';
import firebaseConfig from '../../firebase-applet-config.json';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournaments: Tournament[];
  allTransactions?: Transaction[];
  allRegistrations?: Registration[];
  onKickRegistration?: (registrationId: string, tournamentId: string) => Promise<void>;
  onCreateTournament: (tourn: Omit<Tournament, 'id' | 'registeredCount' | 'createdAt'>) => Promise<void>;
  onDeleteTournament: (tournamentId: string) => Promise<void>;
  onUpdateRoomCredentials: (tournamentId: string, roomId: string, password: string, status: Tournament['status']) => Promise<void>;
  onDeclareWinner: (tournamentId: string, winnerName: string, mvpName: string, prize: number) => Promise<void>;
  onTestNotification?: (title: string, body: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  tournaments,
  allTransactions = [],
  allRegistrations = [],
  onKickRegistration,
  onCreateTournament,
  onDeleteTournament,
  onUpdateRoomCredentials,
  onDeclareWinner,
  onTestNotification,
}) => {
  const { settings, updateSettings, approveDepositTransaction, isAdminUser, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'roster' | 'payments' | 'rooms' | 'create' | 'settings' | 'winner'>('roster');
  const [selectedTournId, setSelectedTournId] = useState<string>(tournaments[0]?.id || '');

  // Roster Tab Search & Filter state
  const [rosterSearch, setRosterSearch] = useState('');
  const [showOnlyBooked, setShowOnlyBooked] = useState(false);
  const [copiedRoster, setCopiedRoster] = useState(false);

  // Room Credentials state
  const [roomId, setRoomId] = useState<string>('');
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [matchStatus, setMatchStatus] = useState<Tournament['status']>('ROOM_OUT');

  // Create form state
  const [newTitle, setNewTitle] = useState('🔥 MH ESPORTS Free Fire Match');
  const [newMode, setNewMode] = useState<GameMode>('SQUAD');
  const [newMap, setNewMap] = useState<MapType>('Bermuda');
  const [newEntryFee, setNewEntryFee] = useState(20);
  const [newPrizePool, setNewPrizePool] = useState(800);
  const [newPerKill, setNewPerKill] = useState(15);
  const [newMaxSlots, setNewMaxSlots] = useState(48);

  // Match Date & Time state
  const getInitialDate = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getInitialTime = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const [matchDate, setMatchDate] = useState<string>(getInitialDate());
  const [matchTime, setMatchTime] = useState<string>(getInitialTime());
  const [selectedPoster, setSelectedPoster] = useState<string>(FREE_FIRE_POSTERS[0]?.url || '');
  const [customPosterUrl, setCustomPosterUrl] = useState<string>('');

  const setQuickTime = (minutesAhead: number) => {
    const d = new Date(Date.now() + minutesAhead * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setMatchDate(`${year}-${month}-${day}`);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    setMatchTime(`${hours}:${mins}`);
  };

  const setQuickPreset = (hour: number, minute: number) => {
    const d = new Date();
    if (d.getHours() > hour || (d.getHours() === hour && d.getMinutes() >= minute)) {
      d.setDate(d.getDate() + 1);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setMatchDate(`${year}-${month}-${day}`);
    setMatchTime(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  // Winner form state
  const [winnerName, setWinnerName] = useState('');
  const [mvpName, setMvpName] = useState('');
  const [prizeDistributed, setPrizeDistributed] = useState(500);

  // Settings form state
  const [adminUpiInput, setAdminUpiInput] = useState(settings.adminUpiId || 'adinathwaman9@okhdfcbank');
  const [merchantNameInput, setMerchantNameInput] = useState(settings.merchantName || 'MH ESPORTS');
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappGroupUrl || '');

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!isAdminUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#0F1424] border border-purple-500/50 rounded-2xl shadow-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading text-2xl text-white">Admin Access Restricted</h3>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              Host Panel access is securely granted only to Google account: <strong className="text-purple-300 font-mono">adinathwaman9@gmail.com</strong>.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors shadow-lg shadow-purple-900/40"
          >
            Sign In with Google (adinathwaman9@gmail.com)
          </button>

          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentTourn = tournaments.find((t) => t.id === selectedTournId) || tournaments[0];
  const pendingDeposits = allTransactions.filter((tx) => tx.type === 'DEPOSIT' && tx.status === 'PENDING');
  const currentTournRegistrations = allRegistrations.filter((r) => r.tournamentId === currentTourn?.id);

  const handleCopyRoster = () => {
    if (!currentTourn) return;
    const maxSlots = currentTourn.maxSlots || 48;
    const lines: string[] = [
      `🔥 MH ESPORTS - FREE FIRE OFFICIAL ROOM ROSTER`,
      `🏆 Match: ${currentTourn.title} (${currentTourn.gameMode})`,
      `🗺️ Map: ${currentTourn.map} | Status: ${currentTourn.status}`,
      `🕒 Match Time: ${new Date(currentTourn.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`,
      `🔑 Room ID: ${currentTourn.roomId || '[Pending Admin Upload]'} | Pass: ${currentTourn.roomPassword || '[Pending]'}`,
      `==========================================`,
      `SLOT LIST (${currentTournRegistrations.length}/${maxSlots} Players Registered):`,
    ];

    for (let slot = 1; slot <= maxSlots; slot++) {
      const reg = currentTournRegistrations.find((r) => r.slotNumber === slot);
      if (reg) {
        lines.push(`Slot #${String(slot).padStart(2, '0')}: ${reg.ffIgn} (${reg.userName || 'Player'})`);
      } else {
        lines.push(`Slot #${String(slot).padStart(2, '0')}: [VACANT / EMPTY]`);
      }
    }

    lines.push(`==========================================`);
    lines.push(`⚠️ ATTENTION ALL PLAYERS:`);
    lines.push(`1. Join ONLY your designated slot in the Free Fire custom room!`);
    lines.push(`2. Any random, unlisted, or wrong slot player will be KICKED immediately!`);
    lines.push(`3. Good luck & Booyah! - MH ESPORTS`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedRoster(true);
    setNotice('Room Roster copied! You can now paste this on WhatsApp or Free Fire chat.');
    setTimeout(() => setCopiedRoster(false), 3000);
  };

  const handleKick = async (reg: Registration) => {
    if (!currentTourn || !onKickRegistration) return;
    const confirmed = window.confirm(
      `Are you sure you want to kick "${reg.ffIgn}" from Slot #${reg.slotNumber}? This will free up the slot.`
    );
    if (!confirmed) return;

    setSaving(true);
    await onKickRegistration(reg.id, currentTourn.id);
    setSaving(false);
    setNotice(`Kicked ${reg.ffIgn} from Slot #${reg.slotNumber}. Slot is now open for other players.`);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTourn) return;
    setSaving(true);
    setNotice(null);

    await onUpdateRoomCredentials(currentTourn.id, roomId, roomPassword, matchStatus);
    setSaving(false);
    setNotice('Room ID & Password published! Registered players can now view it.');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    // Compute exact ISO timestamp from date & time pickers
    const combinedDate = new Date(`${matchDate}T${matchTime}`);
    const startTime = isNaN(combinedDate.getTime())
      ? new Date(Date.now() + 60 * 60 * 1000).toISOString()
      : combinedDate.toISOString();

    const bannerUrl = customPosterUrl.trim() || selectedPoster;

    await onCreateTournament({
      title: newTitle,
      gameMode: newMode,
      map: newMap,
      version: 'Free Fire / FF MAX',
      entryFee: Number(newEntryFee),
      prizePool: Number(newPrizePool),
      perKill: Number(newPerKill),
      maxSlots: Number(newMaxSlots),
      status: 'REGISTRATION_OPEN',
      startTime,
      bannerUrl,
      roomId: '',
      roomPassword: '',
      rules: 'MH ESPORTS Official Competitive Rules. No emulators, no teaming up.',
    });

    setSaving(false);
    setNotice('New Free Fire tournament published to lobby!');
    setActiveTab('rooms');
  };

  const handleWinnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTourn || !winnerName.trim()) return;
    setSaving(true);
    setNotice(null);

    await onDeclareWinner(currentTourn.id, winnerName, mvpName || winnerName, prizeDistributed);
    setSaving(false);
    setNotice(`Declared ${winnerName} as winner! Prize recorded.`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    await updateSettings({
      adminUpiId: adminUpiInput.trim(),
      merchantName: merchantNameInput.trim(),
      whatsappGroupUrl: whatsappInput.trim(),
    });

    setSaving(false);
    setNotice('Real UPI Settings saved! Players will now pay directly to this UPI ID.');
  };

  const handleApproveDeposit = async (tx: Transaction) => {
    setSaving(true);
    await approveDepositTransaction(tx);
    setSaving(false);
    setNotice(`Approved ₹${tx.amount} deposit for ${tx.userDisplayName || 'player'}! Wallet credited.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl text-white tracking-wide">
                  Organizer & Payment Admin Panel
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  REAL UPI & MATCHES
                </span>
              </div>
              <p className="text-xs text-gray-400">Approve real UPI deposits, manage custom rooms, and configure payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pt-3 flex border-b border-gray-800 text-xs font-semibold gap-1.5 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('roster'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'roster' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Player Slots List</span>
            <span className="px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[10px] border border-orange-500/40">
              {currentTournRegistrations.length}/{currentTourn?.maxSlots || 48}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('payments'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'payments' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>UPI Approvals</span>
            {pendingDeposits.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-bold text-[10px]">
                {pendingDeposits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('rooms'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'rooms' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Room ID & Pass</span>
          </button>

          <button
            onClick={() => { setActiveTab('create'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'create' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Match</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'settings' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Real UPI Settings</span>
          </button>

          <button
            onClick={() => { setActiveTab('winner'); setNotice(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'winner' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Declare Winners</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {notice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* TAB: PLAYER ROSTER / SLOTS LIST */}
          {activeTab === 'roster' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-gray-800 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-400" />
                      Player Slots List & Anti-Random Verification
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      View every player's exact slot # and In-Game Name (IGN) to verify them in Free Fire custom room.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyRoster}
                    type="button"
                    className="py-1.5 px-3 rounded-lg bg-orange-600/30 hover:bg-orange-600/40 border border-orange-500/40 text-orange-300 font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
                  >
                    {copiedRoster ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRoster ? 'Copied Roster!' : 'Copy Slot List for WhatsApp'}</span>
                  </button>
                </div>

                {/* Tournament Selector */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Select Tournament:</label>
                  <select
                    value={selectedTournId}
                    onChange={(e) => {
                      setSelectedTournId(e.target.value);
                      const selected = tournaments.find((t) => t.id === e.target.value);
                      if (selected) {
                        setRoomId(selected.roomId || '');
                        setRoomPassword(selected.roomPassword || '');
                        setMatchStatus(selected.status);
                      }
                    }}
                    className="w-full bg-[#141B30] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.gameMode} • {t.registeredCount}/{t.maxSlots} Slots)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-[#141B30] border border-gray-800">
                    <span className="text-[10px] text-gray-400 block">Total Slots</span>
                    <span className="font-heading text-base font-bold text-white">{currentTourn?.maxSlots || 48}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141B30] border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 block">Booked Players</span>
                    <span className="font-heading text-base font-bold text-emerald-400">{currentTournRegistrations.length}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#141B30] border border-gray-800">
                    <span className="text-[10px] text-gray-400 block">Vacant Slots</span>
                    <span className="font-heading text-base font-bold text-orange-400">
                      {Math.max(0, (currentTourn?.maxSlots || 48) - currentTournRegistrations.length)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anti-Random Instructions Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-2 leading-relaxed">
                <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">कस्टम रूममध्ये Random खेळाडू येऊ नये म्हणून: </strong>
                  <span>
                    Free Fire Custom Room तयार करताना ही यादी तपासा. रूम लॉबीमध्ये खेळाडूंचे In-Game Name (IGN) आणि Slot तपासा. जर कोणी अनधिकृत किंवा चुकीच्या स्लॉटमध्ये आले तर त्याला लगेच Free Fire लॉबीतून <strong>Kick</strong> करा!
                  </span>
                </div>
              </div>

              {/* Filter & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by In-Game Name or Slot #..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full bg-[#0B0E17] border border-gray-800 focus:border-orange-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowOnlyBooked(false)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      !showOnlyBooked ? 'bg-orange-600 text-white font-bold' : 'bg-[#0B0E17] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    All {currentTourn?.maxSlots || 48} Slots
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOnlyBooked(true)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      showOnlyBooked ? 'bg-emerald-600 text-white font-bold' : 'bg-[#0B0E17] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Booked Only ({currentTournRegistrations.length})
                  </button>
                </div>
              </div>

              {/* Slots List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {(() => {
                  const maxSlots = currentTourn?.maxSlots || 48;
                  const slotsArray = Array.from({ length: maxSlots }, (_, i) => i + 1);

                  const filteredSlots = slotsArray.filter((slotNum) => {
                    const reg = currentTournRegistrations.find((r) => r.slotNumber === slotNum);
                    if (showOnlyBooked && !reg) return false;
                    if (!rosterSearch.trim()) return true;

                    const term = rosterSearch.toLowerCase().trim();
                    const slotMatches = String(slotNum) === term || `slot ${slotNum}`.includes(term);
                    const ignMatches = reg?.ffIgn?.toLowerCase().includes(term);
                    const nameMatches = reg?.userName?.toLowerCase().includes(term);
                    return slotMatches || ignMatches || nameMatches;
                  });

                  if (filteredSlots.length === 0) {
                    return (
                      <div className="p-8 text-center rounded-xl bg-[#0B0E17] border border-gray-800 text-gray-400 space-y-1">
                        <Users className="w-6 h-6 mx-auto text-gray-500" />
                        <p className="text-white font-semibold">No players match the search</p>
                        <p className="text-[11px]">Try clearing your search query.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredSlots.map((slotNum) => {
                        const reg = currentTournRegistrations.find((r) => r.slotNumber === slotNum);
                        const isBooked = !!reg;

                        return (
                          <div
                            key={slotNum}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                              isBooked
                                ? 'bg-[#141B30] border-orange-500/40 shadow-sm'
                                : 'bg-[#0B0E17]/60 border-gray-800 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`px-2 py-1 rounded font-mono font-bold text-xs shrink-0 ${
                                  isBooked
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow'
                                    : 'bg-gray-800 text-gray-400'
                                }`}
                              >
                                Slot #{String(slotNum).padStart(2, '0')}
                              </span>

                              <div className="min-w-0">
                                {isBooked ? (
                                  <>
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="font-heading font-bold text-yellow-300 text-sm truncate">
                                        🎮 {reg.ffIgn}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5">
                                      <span>{reg.userName || 'Player'}</span>
                                      <span>•</span>
                                      <span className="text-emerald-400 font-semibold">CONFIRMED</span>
                                      {reg.registeredAt && (
                                        <>
                                          <span>•</span>
                                          <span>{new Date(reg.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div>
                                    <span className="text-gray-400 text-xs italic">[Empty Slot]</span>
                                    <p className="text-[10px] text-gray-500">Free for any player to join</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {isBooked && onKickRegistration && (
                              <button
                                type="button"
                                onClick={() => handleKick(reg)}
                                disabled={saving}
                                className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 flex items-center gap-1 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                                title={`Kick ${reg.ffIgn} & free up Slot #${slotNum}`}
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Kick</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB: PAYMENTS APPROVAL */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-gray-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Real UPI Deposits Approval</h4>
                  <p className="text-[11px] text-gray-400">
                    When players pay via PhonePe/GPay/Paytm, their 12-digit UTR reference arrives here for instant verification.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Receiving UPI:</span>
                  <span className="font-mono text-emerald-400 font-bold">{settings.adminUpiId}</span>
                </div>
              </div>

              {pendingDeposits.length > 0 ? (
                <div className="space-y-2.5">
                  {pendingDeposits.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-xl bg-[#141B30] border border-orange-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-xl text-yellow-400 font-bold">₹{tx.amount}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            PENDING VERIFICATION
                          </span>
                        </div>
                        <p className="text-white font-semibold">{tx.userDisplayName || 'Player'}</p>
                        <p className="font-mono text-emerald-400 text-xs">
                          UTR Reference: <strong>{tx.utrNumber || 'N/A'}</strong>
                        </p>
                        <p className="text-[10px] text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => handleApproveDeposit(tx)}
                        disabled={saving}
                        className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-gaming font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Credit ₹{tx.amount}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-[#0B0E17] border border-gray-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-white font-semibold">No Pending Deposit Requests</p>
                  <p className="text-gray-400 text-[11px]">
                    All player payments are up to date! New UTR submissions will appear here instantly.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: REAL UPI SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-200">
                <span className="font-bold text-white block mb-0.5">Real Money Receiver Configuration</span>
                <p className="text-[11px] text-gray-300">
                  Enter your real bank UPI ID (Google Pay, PhonePe, Paytm, or BHIM). All player payments will be sent directly to this address.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Real Receiving UPI ID <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  value={adminUpiInput}
                  onChange={(e) => setAdminUpiInput(e.target.value)}
                  placeholder="e.g. adinathwaman9@okhdfcbank or 9876543210@paytm"
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[10px] text-gray-400">Payments will generate dynamic QR codes pointing to this UPI ID</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Esports Business / Merchant Name
                </label>
                <input
                  type="text"
                  value={merchantNameInput}
                  onChange={(e) => setMerchantNameInput(e.target.value)}
                  placeholder="e.g. MH ESPORTS"
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Official WhatsApp Community Link
                </label>
                <input
                  type="text"
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors"
              >
                {saving ? 'Saving...' : 'Save Real UPI Payment Settings'}
              </button>
            </form>
          )}

          {/* TAB: ROOM CREDENTIALS */}
          {activeTab === 'rooms' && (
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-300">
                  Select Active Match
                </label>
                {currentTourn && (
                  <button
                    type="button"
                    onClick={() => onDeleteTournament(currentTourn.id)}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Match</span>
                  </button>
                )}
              </div>

              <select
                value={selectedTournId}
                onChange={(e) => {
                  setSelectedTournId(e.target.value);
                  const selected = tournaments.find((t) => t.id === e.target.value);
                  if (selected) {
                    setRoomId(selected.roomId || '');
                    setRoomPassword(selected.roomPassword || '');
                    setMatchStatus(selected.status);
                  }
                }}
                className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.gameMode} • {t.status})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Free Fire Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="e.g. 8839201"
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Created inside Free Fire Custom Room</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Room Password
                  </label>
                  <input
                    type="text"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="e.g. ff99"
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Password set by room creator</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Match Status
                </label>
                <select
                  value={matchStatus}
                  onChange={(e) => setMatchStatus(e.target.value as any)}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN (Upcoming)</option>
                  <option value="ROOM_OUT">ROOM_OUT (Credentials visible to players!)</option>
                  <option value="LIVE">LIVE (Match in progress)</option>
                  <option value="COMPLETED">COMPLETED (Finished)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-950/60 to-purple-950/60 border border-orange-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Mobile Phone Notification Bar Alert
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  When you click <strong>"Publish Room ID & Password"</strong>, all players who joined will receive an immediate native alert in their Android/mobile status bar drawer with vibration and 1-tap copy!
                </p>
                {onTestNotification && (
                  <button
                    type="button"
                    onClick={() => {
                      const testId = roomId.trim() || '8839201';
                      const testPass = roomPassword.trim() || 'ff99';
                      const title = currentTourn?.title || 'MH ESPORTS Free Fire Match';
                      onTestNotification(
                        `🔥 FREE FIRE ROOM ID: ${title}`,
                        `🔑 Room ID: ${testId} | Pass: ${testPass}\nJoin your slot in Free Fire MAX now!`
                      );
                      setNotice('🔔 Test notification sent to your phone notification bar! Check your top screen drawer.');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-orange-400" />
                    <span>🔔 Test Notification On My Phone Status Bar</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors"
                >
                  {saving ? 'Publishing...' : 'Publish Room ID & Password to Players'}
                </button>
                {(roomId || currentTourn?.roomId) && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!currentTourn) return;
                      setRoomId('');
                      setRoomPassword('');
                      setMatchStatus('REGISTRATION_OPEN');
                      await onUpdateRoomCredentials(currentTourn.id, '', '', 'REGISTRATION_OPEN');
                      setNotice(`Room ID & Password cleared for "${currentTourn.title}". Room is now back in countdown!`);
                    }}
                    className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-red-300 hover:text-red-200 border border-gray-700 text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    Clear Room ID
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB: CREATE NEW MATCH */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tournament Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Game Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => {
                      const mode = e.target.value as GameMode;
                      setNewMode(mode);
                      if (mode === 'CS_4V4') {
                        setNewMaxSlots(8);
                      } else {
                        setNewMaxSlots(48); // Standard 48 players for Battle Royale SOLO, DUO, SQUAD
                      }
                    }}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="SOLO">SOLO (48 Players)</option>
                    <option value="DUO">DUO (48 Players / 24 Teams)</option>
                    <option value="SQUAD">SQUAD (48 Players / 12 Squads)</option>
                    <option value="CS_4V4">CS 4v4 Ranked (8 Players)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Map</label>
                  <select
                    value={newMap}
                    onChange={(e) => setNewMap(e.target.value as MapType)}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="Nexterra">Nexterra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(Number(e.target.value))}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newPrizePool}
                    onChange={(e) => setNewPrizePool(Number(e.target.value))}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Per Kill (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newPerKill}
                    onChange={(e) => setNewPerKill(Number(e.target.value))}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-300">Max Slots (Players / Teams)</label>
                  <span className="text-[10px] text-amber-400 font-bold">BR Standard: 48 Slots</span>
                </div>
                <input
                  type="number"
                  min={2}
                  value={newMaxSlots}
                  onChange={(e) => setNewMaxSlots(Number(e.target.value))}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setNewMaxSlots(48)}
                    className="text-[10px] px-2 py-0.5 rounded bg-orange-600/30 hover:bg-orange-600/40 text-orange-300 border border-orange-500/40 cursor-pointer"
                  >
                    48 Slots (Battle Royale)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMaxSlots(24)}
                    className="text-[10px] px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 cursor-pointer"
                  >
                    24 Slots (DUO Teams)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMaxSlots(12)}
                    className="text-[10px] px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 cursor-pointer"
                  >
                    12 Slots (Squads)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMaxSlots(8)}
                    className="text-[10px] px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 cursor-pointer"
                  >
                    8 Slots (CS 4v4)
                  </button>
                </div>
              </div>

              {/* Match Date & Time */}
              <div className="bg-[#0B0E17]/80 border border-gray-800 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Tournament Date & Time (IST)
                  </label>
                  <span className="text-[10px] text-gray-400">Credentials release 1m before start</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      Match Date
                    </label>
                    <input
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      required
                      className="w-full bg-[#141B30] border border-gray-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Match Time
                    </label>
                    <input
                      type="time"
                      value={matchTime}
                      onChange={(e) => setMatchTime(e.target.value)}
                      required
                      className="w-full bg-[#141B30] border border-gray-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuickTime(30)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      +30 Mins
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(10, 0)}
                      className="text-[10px] px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 cursor-pointer"
                    >
                      10:00 AM (1st Match)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(10, 30)}
                      className="text-[10px] px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 cursor-pointer"
                    >
                      10:30 AM (2nd Match)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(11, 0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      11:00 AM (3rd Match)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(11, 30)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      11:30 AM (4th Match)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(12, 0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      12:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(19, 0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-purple-300 border border-gray-700 cursor-pointer"
                    >
                      7:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(20, 0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-amber-300 border border-gray-700 cursor-pointer"
                    >
                      8:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(20, 30)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-amber-300 border border-gray-700 cursor-pointer"
                    >
                      8:30 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(21, 0)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-amber-300 border border-gray-700 cursor-pointer"
                    >
                      9:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPreset(21, 30)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-amber-300 border border-gray-700 cursor-pointer"
                    >
                      9:30 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime(30)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      +30 Mins
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime(60)}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer"
                    >
                      +1 Hour
                    </button>
                  </div>
                </div>
              </div>

              {/* Free Fire Tournament Background Poster */}
              <div className="bg-[#0B0E17]/80 border border-gray-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                    Tournament Background Poster (Free Fire)
                  </label>
                  <span className="text-[10px] text-gray-400">Card wallpaper</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FREE_FIRE_POSTERS.map((poster) => {
                    const isSelected = !customPosterUrl.trim() && selectedPoster === poster.url;
                    return (
                      <div
                        key={poster.name}
                        onClick={() => {
                          setSelectedPoster(poster.url);
                          setCustomPosterUrl('');
                        }}
                        className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all group ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/50 scale-[1.02]'
                            : 'border-gray-800 hover:border-gray-700 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="h-16 w-full overflow-hidden bg-black">
                          <img
                            src={poster.url}
                            alt={poster.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-1.5 bg-[#141B30]/95 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-white truncate">{poster.tag}</span>
                          {isSelected && <Check className="w-3 h-3 text-orange-400 shrink-0" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Poster URL */}
                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Or enter custom Free Fire poster image URL..."
                    value={customPosterUrl}
                    onChange={(e) => setCustomPosterUrl(e.target.value)}
                    className="w-full bg-[#141B30] border border-gray-800 focus:border-orange-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors"
              >
                {saving ? 'Creating Match...' : 'Publish Tournament to App'}
              </button>
            </form>
          )}

          {/* TAB: DECLARE WINNERS */}
          {activeTab === 'winner' && (
            <form onSubmit={handleWinnerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Select Completed Match</label>
                <select
                  value={selectedTournId}
                  onChange={(e) => setSelectedTournId(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Winner Team / Player IGN</label>
                <input
                  type="text"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  placeholder="e.g. TEAM GODLIKE or BOOYAH_PRO"
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Match MVP (Most Kills)</label>
                  <input
                    type="text"
                    value={mvpName}
                    onChange={(e) => setMvpName(e.target.value)}
                    placeholder="e.g. TSG_Ritik (8 Kills)"
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Prize Distributed (₹)</label>
                  <input
                    type="number"
                    value={prizeDistributed}
                    onChange={(e) => setPrizeDistributed(Number(e.target.value))}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !winnerName.trim()}
                className="w-full py-3 px-4 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-gaming text-sm font-bold tracking-wider uppercase transition-colors"
              >
                {saving ? 'Processing...' : 'Confirm Winner & Publish to Leaderboard'}
              </button>
            </form>
          )}

          {/* Quick link to live Firestore DB */}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
            <span>Direct database administration:</span>
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium"
            >
              <span>Open Firebase Firestore</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
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
