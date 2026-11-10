import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup, signOut, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, Transaction, AppSetting } from '../types';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  isAdminUser: boolean;
  settings: AppSetting;
  updateSettings: (newSettings: Partial<AppSetting>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (name: string, ffIgn: string, ffUid: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  submitRealUpiDeposit: (amount: number, utrNumber: string, playerUpiName?: string) => Promise<{ success: boolean; message: string }>;
  requestWithdrawal: (amount: number, upiId: string) => Promise<{ success: boolean; message: string }>;
  deductEntryFee: (amount: number, tournamentTitle: string) => Promise<boolean>;
  creditWinning: (amount: number, matchTitle: string) => Promise<void>;
  approveDepositTransaction: (transaction: Transaction) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_GUEST_KEY = 'cb_guest_player';
const ADMIN_EMAIL = 'adinathwaman9@gmail.com';

const DEFAULT_SETTINGS: AppSetting = {
  adminUpiId: 'adinathwaman9@okhdfcbank', // Admin's real UPI ID to receive player payments
  merchantName: 'MH ESPORTS',
  whatsappGroupUrl: 'https://chat.whatsapp.com/freefire-tournaments-official',
  supportPhone: '+91 98765 43210',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSetting>(DEFAULT_SETTINGS);

  const isAdminUser = (currentUser?.email?.toLowerCase() === ADMIN_EMAIL) || (profile?.email?.toLowerCase() === ADMIN_EMAIL);

  // Load global app settings (Admin UPI ID, Merchant name)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as AppSetting);
      } else {
        setDoc(doc(db, 'settings', 'global'), DEFAULT_SETTINGS).catch(() => {});
      }
    }, () => {});
    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSetting>) => {
    const merged = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(merged);
    try {
      await setDoc(doc(db, 'settings', 'global'), merged, { merge: true });
    } catch (e) {
      console.warn('Settings updated locally:', e);
    }
  };

  // Sync profile when Firebase User changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsGuest(false);
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const isUserAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;

        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            // Always ensure adinathwaman9@gmail.com has admin role
            if (isUserAdmin && data.role !== 'admin') {
              data.role = 'admin';
              await updateDoc(userDocRef, { role: 'admin' });
            }
            setProfile(data);
          } else {
            // New user registration
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Player',
              photoURL: user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.uid,
              ffIgn: '',
              ffUid: '',
              githubUsername: 'adinathwaman9',
              githubRepoUrl: 'https://github.com/adinathwaman9',
              walletBalance: 0,
              winningBalance: 0,
              bonusBalance: 0,
              totalMatches: 0,
              totalKills: 0,
              totalWinnings: 0,
              role: isUserAdmin ? 'admin' : 'player',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }

          // Real-time listener for user profile changes
          const unsubProfile = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const uData = snap.data() as UserProfile;
              if (isUserAdmin) {
                uData.role = 'admin';
              }
              setProfile(uData);
            }
          }, (err) => {
            handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          });

          setLoading(false);
          return () => unsubProfile();
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        // Check if saved guest player
        const savedGuest = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
        if (savedGuest) {
          try {
            setProfile(JSON.parse(savedGuest));
            setIsGuest(true);
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
          }
        } else {
          // Default visitor profile
          const freshVisitor: UserProfile = {
            uid: 'player_' + Math.floor(1000 + Math.random() * 9000),
            displayName: 'Player',
            photoURL: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
            ffIgn: '',
            ffUid: '',
            githubUsername: 'adinathwaman9',
            githubRepoUrl: 'https://github.com/adinathwaman9',
            walletBalance: 0,
            winningBalance: 0,
            bonusBalance: 0,
            totalMatches: 0,
            totalKills: 0,
            totalWinnings: 0,
            role: 'player',
            createdAt: new Date().toISOString(),
          };
          setProfile(freshVisitor);
          setIsGuest(true);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signInAsGuest = async (name: string, ffIgn: string, ffUid: string) => {
    const guestData: UserProfile = {
      uid: 'player_' + Date.now(),
      displayName: name || 'Player',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ffIgn: ffIgn || '',
      ffUid: ffUid || '',
      githubUsername: 'adinathwaman9',
      walletBalance: 0,
      winningBalance: 0,
      bonusBalance: 0,
      totalMatches: 0,
      totalKills: 0,
      totalWinnings: 0,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    setProfile(guestData);
    setIsGuest(true);
    localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(guestData));
  };

  const logout = async () => {
    if (currentUser) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
    setProfile(null);
    setIsGuest(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);

    if (currentUser && !isGuest) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await updateDoc(userRef, updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(updated));
    }
  };

  // Real UPI Deposit flow: Player pays to Admin's UPI and submits real 12-digit UTR
  const submitRealUpiDeposit = async (
    amount: number,
    utrNumber: string,
    playerUpiName?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!profile) return { success: false, message: 'Please sign in first.' };
    if (amount <= 0) return { success: false, message: 'Invalid deposit amount.' };
    if (!utrNumber || utrNumber.length < 8) {
      return { success: false, message: 'Please enter valid 12-digit UPI UTR / Reference number from PhonePe/GPay/Paytm.' };
    }

    const currentUserId = currentUser?.uid || profile.uid;
    const txId = 'tx_' + Date.now();

    const transactionData: Transaction = {
      id: txId,
      userId: currentUserId,
      userDisplayName: profile.displayName || playerUpiName || 'Player',
      type: 'DEPOSIT',
      amount,
      status: 'PENDING',
      title: `Real UPI Deposit (₹${amount})`,
      details: `UTR Ref: ${utrNumber} ${playerUpiName ? `• ${playerUpiName}` : ''}`,
      utrNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'transactions', txId), transactionData);
    } catch (e) {
      console.warn('Real deposit recorded locally:', e);
    }

    return {
      success: true,
      message: `Deposit request for ₹${amount} submitted with UTR ${utrNumber}! It will be verified and credited to your wallet in 5-10 minutes.`,
    };
  };

  // Admin approves real UPI deposit and credits player wallet
  const approveDepositTransaction = async (transaction: Transaction) => {
    try {
      await updateDoc(doc(db, 'transactions', transaction.id), {
        status: 'COMPLETED',
      });

      // Credit target user wallet
      const targetUserDoc = doc(db, 'users', transaction.userId);
      const snap = await getDoc(targetUserDoc);
      if (snap.exists()) {
        const uData = snap.data() as UserProfile;
        const newBal = (uData.walletBalance || 0) + transaction.amount;
        await updateDoc(targetUserDoc, {
          walletBalance: newBal,
        });
      } else if (profile && profile.uid === transaction.userId) {
        const newBal = (profile.walletBalance || 0) + transaction.amount;
        setProfile({ ...profile, walletBalance: newBal });
      }
    } catch (e) {
      console.warn('Approve deposit note:', e);
      // Fallback local update if user is same
      if (profile && profile.uid === transaction.userId) {
        const newBal = (profile.walletBalance || 0) + transaction.amount;
        setProfile({ ...profile, walletBalance: newBal });
      }
    }
  };

  const requestWithdrawal = async (amount: number, upiId: string): Promise<{ success: boolean; message: string }> => {
    if (!profile) return { success: false, message: 'Not logged in' };
    const currentWinning = profile.winningBalance || 0;
    if (amount < 50) {
      return { success: false, message: 'Minimum withdrawal amount is ₹50' };
    }
    if (currentWinning < amount) {
      return { success: false, message: `Insufficient winning balance. Available: ₹${currentWinning}` };
    }

    const newWinning = currentWinning - amount;
    const newTotal = (profile.walletBalance || 0) - amount;
    const updated = { ...profile, winningBalance: newWinning, walletBalance: newTotal };
    setProfile(updated);

    const txId = 'tx_wd_' + Date.now();
    const currentUserId = currentUser?.uid || profile.uid;

    if (currentUser && !isGuest) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          winningBalance: newWinning,
          walletBalance: newTotal,
        });
        await setDoc(doc(db, 'transactions', txId), {
          id: txId,
          userId: currentUserId,
          userDisplayName: profile.displayName,
          type: 'WITHDRAW',
          amount,
          status: 'PENDING',
          title: `Withdrawal Request to UPI`,
          details: `UPI ID: ${upiId} • Processing bank transfer`,
          upiId,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'users/transactions');
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(updated));
    }

    return { success: true, message: `Withdrawal request of ₹${amount} submitted! Sent to ${upiId}` };
  };

  const deductEntryFee = async (amount: number, tournamentTitle: string): Promise<boolean> => {
    if (!profile) return false;
    if (amount <= 0) return true; // Free tournament
    if ((profile.walletBalance || 0) < amount) {
      return false;
    }

    const newBalance = (profile.walletBalance || 0) - amount;
    const newMatches = (profile.totalMatches || 0) + 1;
    const updated = { ...profile, walletBalance: newBalance, totalMatches: newMatches };
    setProfile(updated);

    const currentUserId = currentUser?.uid || profile.uid;
    const txId = 'tx_fee_' + Date.now();

    if (currentUser && !isGuest) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          walletBalance: newBalance,
          totalMatches: newMatches,
        });
        await setDoc(doc(db, 'transactions', txId), {
          id: txId,
          userId: currentUserId,
          userDisplayName: profile.displayName,
          type: 'ENTRY_FEE',
          amount,
          status: 'COMPLETED',
          title: `Entry Fee: ${tournamentTitle}`,
          details: 'Match seat confirmed',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'users/transactions');
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(updated));
    }

    return true;
  };

  const creditWinning = async (amount: number, matchTitle: string) => {
    if (!profile) return;
    const newWinning = (profile.winningBalance || 0) + amount;
    const newTotal = (profile.walletBalance || 0) + amount;
    const totalWinnings = (profile.totalWinnings || 0) + amount;
    const updated = {
      ...profile,
      winningBalance: newWinning,
      walletBalance: newTotal,
      totalWinnings,
    };
    setProfile(updated);

    const currentUserId = currentUser?.uid || profile.uid;
    const txId = 'tx_win_' + Date.now();

    if (currentUser && !isGuest) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          winningBalance: newWinning,
          walletBalance: newTotal,
          totalWinnings,
        });
        await setDoc(doc(db, 'transactions', txId), {
          id: txId,
          userId: currentUserId,
          userDisplayName: profile.displayName,
          type: 'WINNING',
          amount,
          status: 'COMPLETED',
          title: `Match Reward: ${matchTitle} 🏆`,
          details: 'Prize / Kill bounty credited to winnings',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'users/transactions');
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isGuest,
        isAdminUser,
        settings,
        updateSettings,
        signInWithGoogle,
        signInAsGuest,
        logout,
        updateProfile,
        submitRealUpiDeposit,
        requestWithdrawal,
        deductEntryFee,
        creditWinning,
        approveDepositTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
