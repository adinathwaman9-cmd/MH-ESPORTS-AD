export type GameMode = 'SOLO' | 'DUO' | 'SQUAD' | 'CS_4V4';
export type MatchStatus = 'UPCOMING' | 'REGISTRATION_OPEN' | 'ROOM_OUT' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
export type MapType = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra';

export interface Tournament {
  id: string;
  title: string;
  gameMode: GameMode;
  map: MapType;
  version: 'Free Fire / FF MAX';
  entryFee: number;
  prizePool: number;
  perKill: number;
  maxSlots: number;
  registeredCount: number;
  status: MatchStatus;
  startTime: string; // ISO string
  roomId?: string;
  roomPassword?: string;
  rules?: string;
  winnerTeam?: string;
  topKiller?: string;
  bannerUrl?: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  userId: string;
  userName: string;
  ffIgn: string;
  ffUid?: string;
  teamName?: string;
  slotNumber: number;
  paidFee: number;
  registeredAt: string;
}

export interface UserProfile {
  uid: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  ffIgn?: string;
  ffUid?: string;
  githubUsername?: string;
  githubRepoUrl?: string;
  walletBalance: number;
  winningBalance: number;
  bonusBalance: number;
  totalMatches: number;
  totalKills: number;
  totalWinnings: number;
  role: 'admin' | 'player';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userDisplayName?: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'ENTRY_FEE' | 'WINNING' | 'BONUS';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  title: string;
  details?: string;
  utrNumber?: string;
  upiId?: string;
  createdAt: string;
}

export interface MatchResultRecord {
  tournamentId: string;
  tournamentTitle: string;
  completedAt: string;
  winnerName: string;
  winnerUid: string;
  winnerPrize: number;
  mvpName: string;
  mvpKills: number;
  screenshotUrl?: string;
}

export interface AppSetting {
  adminUpiId: string;
  merchantName: string;
  whatsappGroupUrl?: string;
  supportPhone?: string;
  updatedAt?: string;
}
