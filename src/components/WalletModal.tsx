import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  QrCode,
  CheckCircle2,
  AlertCircle,
  History,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const { profile, settings, submitRealUpiDeposit, requestWithdrawal } = useAuth();
  const [activeTab, setActiveTab] = useState<'add' | 'withdraw' | 'history'>('add');
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [playerUpiName, setPlayerUpiName] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('50');
  const [withdrawUpiId, setWithdrawUpiId] = useState<string>('');

  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen || !profile) return null;

  const totalBalance = profile.walletBalance || 0;
  const winningBalance = profile.winningBalance || 0;
  const bonusBalance = profile.bonusBalance || 0;
  const depositBalance = Math.max(0, totalBalance - winningBalance - bonusBalance);

  // Real NPCI standard UPI Payment link
  const adminUpi = settings.adminUpiId || 'adinathwaman9@okhdfcbank';
  const merchantName = settings.merchantName || 'MH ESPORTS';
  const upiDeepLink = `upi://pay?pa=${adminUpi}&pn=${encodeURIComponent(merchantName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent('Deposit-Wallet')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleRealUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setStatusMessage({
        text: 'Please enter valid 12-digit UPI UTR / Reference number from your PhonePe/GPay/Paytm payment receipt.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await submitRealUpiDeposit(depositAmount, cleanUtr, playerUpiName.trim());
    setIsSubmitting(false);

    if (result.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#FBBF24'],
      });
      setStatusMessage({ text: result.message, type: 'success' });
      setUtrNumber('');
    } else {
      setStatusMessage({ text: result.message, type: 'error' });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum < 50) {
      setStatusMessage({ text: 'Minimum withdrawal is ₹50 from Winning Cash.', type: 'error' });
      return;
    }
    if (!withdrawUpiId.trim() || !withdrawUpiId.includes('@')) {
      setStatusMessage({ text: 'Please enter a valid UPI ID (e.g., name@okaxis or 9876543210@paytm)', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await requestWithdrawal(amountNum, withdrawUpiId.trim());
    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({ text: result.message, type: 'success' });
      setWithdrawAmount('50');
    } else {
      setStatusMessage({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F1424] border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#141B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white tracking-wide">
                Real UPI Wallet & Payments
              </h3>
              <p className="text-xs text-gray-400">Scan UPI QR or 1-Tap Pay via PhonePe / GPay / Paytm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Balance Overview */}
        <div className="p-4 pb-2">
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-600/30 via-[#161D32] to-[#141B30] border border-orange-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase font-semibold">Total Balance</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Real UPI Verified
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-4xl text-white font-bold tracking-tight">₹{totalBalance}</span>
            </div>

            {/* Split Balances */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800/80 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#0B0E17]/60">
                <span className="text-[10px] text-gray-400 block">Deposit Cash</span>
                <span className="font-bold text-white">₹{depositBalance}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B0E17]/60 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-semibold">Winning Cash</span>
                <span className="font-bold text-emerald-400">₹{winningBalance}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B0E17]/60">
                <span className="text-[10px] text-amber-400 block font-semibold">Bonus Cash</span>
                <span className="font-bold text-amber-400">₹{bonusBalance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pt-2 flex border-b border-gray-800 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('add'); setStatusMessage(null); }}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'add' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Add Money (Real UPI)</span>
          </button>

          <button
            onClick={() => { setActiveTab('withdraw'); setStatusMessage(null); }}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'withdraw' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw to UPI</span>
          </button>

          <button
            onClick={() => { setActiveTab('history'); setStatusMessage(null); }}
            className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Passbook</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {statusMessage && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-red-500/15 border-red-500/40 text-red-300'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="space-y-4">
              {/* Select amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Select Amount to Deposit:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                        depositAmount === amt
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md'
                          : 'bg-[#0B0E17] border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Real UPI Payment Gateway Box */}
              <div className="p-4 rounded-xl bg-[#0B0E17] border border-orange-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                    <QrCode className="w-4 h-4" />
                    <span>Real Dynamic UPI QR Code (₹{depositAmount})</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Scan & Pay</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                  {/* Real Dynamic QR Code */}
                  <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="UPI Payment QR Code"
                      className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                    />
                  </div>

                  <div className="space-y-2 text-left flex-1 min-w-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">UPI Payee ID (Official)</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-white text-xs font-bold truncate bg-[#141B30] px-2 py-1 rounded border border-gray-700">
                          {adminUpi}
                        </span>
                        <button
                          onClick={handleCopyUpi}
                          className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-orange-400"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-tight">
                      Open <strong>PhonePe, Google Pay, Paytm, or BHIM</strong>, scan this QR code, and pay ₹{depositAmount}.
                    </p>

                    {/* 1-Tap Mobile UPI Intent Button */}
                    <a
                      href={upiDeepLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>1-Tap Pay on Phone</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2: Enter Real UTR / Reference */}
              <form onSubmit={handleRealUpiSubmit} className="p-4 rounded-xl bg-[#141B30] border border-gray-700 space-y-3">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Step 2: Enter 12-Digit UTR / Reference Number</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">
                    UPI Reference / UTR Number <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. 412893849102"
                    maxLength={16}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Found in your payment app under 'Transaction details'</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">
                    Your Name or UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={playerUpiName}
                    onChange={(e) => setPlayerUpiName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white font-heading text-xl uppercase font-bold tracking-wider shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Payment...</span>
                    </div>
                  ) : (
                    <span>Confirm Real Payment of ₹{depositAmount}</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <span>Withdrawable Winning Cash:</span>
                <span className="font-bold text-sm text-emerald-400">₹{winningBalance}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Withdrawal Amount (Min ₹50)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    min={50}
                    max={winningBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Your Bank UPI ID
                </label>
                <input
                  type="text"
                  value={withdrawUpiId}
                  onChange={(e) => setWithdrawUpiId(e.target.value)}
                  className="w-full bg-[#0B0E17] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                  required
                />
                <span className="text-[10px] text-gray-400">Payment will be transferred directly to your bank account via UPI</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || winningBalance < 50}
                className={`w-full py-3 px-4 rounded-xl font-heading text-xl uppercase font-bold tracking-wider shadow-lg transition-all ${
                  winningBalance >= 50
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-600/30'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting Request...' : `Withdraw ₹${withdrawAmount || 0} to Bank UPI`}
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-[#0B0E17] border border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'DEPOSIT' || tx.type === 'WINNING' || tx.type === 'BONUS'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {tx.type === 'DEPOSIT' || tx.type === 'WINNING' || tx.type === 'BONUS' ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{tx.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                          <span className={tx.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400 font-semibold'}>
                            {tx.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className={`font-bold font-gaming text-sm ${
                      tx.type === 'DEPOSIT' || tx.type === 'WINNING' || tx.type === 'BONUS'
                        ? 'text-emerald-400'
                        : 'text-orange-400'
                    }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'WINNING' || tx.type === 'BONUS' ? '+' : '-'}₹{tx.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                  <History className="w-8 h-8 mx-auto text-gray-600" />
                  <p>No transaction history yet.</p>
                </div>
              )}
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
