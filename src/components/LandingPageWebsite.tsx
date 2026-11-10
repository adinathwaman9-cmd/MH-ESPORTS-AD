import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Shield,
  Zap,
  Gift,
  CreditCard,
  Lock,
  Headphones,
  Gamepad2,
  Users,
  Coins,
  Trophy,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Flame,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageWebsiteProps {
  onOpenAppLobby: () => void;
  onOpenApkModal: () => void;
}

export const LandingPageWebsite: React.FC<LandingPageWebsiteProps> = ({
  onOpenAppLobby,
  onOpenApkModal,
}) => {
  const { settings } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  const APP_SCREENS = [
    {
      title: 'Free Fire Tournament Lobby',
      desc: 'Browse Solo, Duo & Squad BR 48-player matches with live slot counters and entry fee filters.',
      tag: 'MATCH LOBBY',
      image: '/assets/aistudio/Screenshot_20261109_083224_a27d2ff3.jpg',
    },
    {
      title: 'Real UPI Wallet & Withdrawals',
      desc: 'Instant deposits using Google Pay, PhonePe, and Paytm with 0% fee and direct UPI withdrawals.',
      tag: 'FAST PAYOUTS',
      image: '/assets/aistudio/Screenshot_20261109_083230_2b4fd78d.jpg',
    },
    {
      title: 'Custom Room ID & Password',
      desc: 'Get room credentials 1 minute before match directly in phone notification bar with 1-tap copy.',
      tag: 'SMART NOTIFICATIONS',
      image: '/assets/aistudio/Screenshot_2026_1110_110746_59b6647e.jpg',
    },
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % APP_SCREENS.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + APP_SCREENS.length) % APP_SCREENS.length);
  };

  const whatsappLink = settings?.whatsappGroupUrl || 'https://chat.whatsapp.com/invite';

  return (
    <div className="min-h-screen bg-[#060A14] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Cyber Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 150, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 150, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Radial Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-600/15 via-blue-700/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-orange-600/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Website Top Bar */}
      <header className="sticky top-0 z-40 bg-[#060A14]/90 backdrop-blur-md border-b border-cyan-900/40 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center overflow-hidden">
              <img
                src="/mh_esports_logo.jpg"
                alt="MH ESPORTS Logo"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                MH <span className="text-cyan-400">ESPORTS</span>
              </span>
              <p className="text-[10px] tracking-widest text-cyan-300/80 font-medium uppercase mt-0.5">
                The Ultimate Battleground
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAppLobby}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-gaming text-xs font-bold tracking-wider uppercase shadow-md shadow-orange-950/40 flex items-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play in App</span>
            </button>

            <button
              onClick={onOpenApkModal}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-gaming text-xs font-bold tracking-wider uppercase shadow-md shadow-cyan-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span> APK
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-16 sm:space-y-24">
        {/* ================= HERO SECTION ================= */}
        <section className="text-center pt-2 sm:pt-6 space-y-6">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wider uppercase shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>LIVE TOURNAMENTS RUNNING NOW</span>
          </div>

          {/* Headline */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-white tracking-wider uppercase leading-none drop-shadow-sm">
              MH ESPORTS
            </h1>
            <p className="font-heading text-sm sm:text-lg tracking-[0.25em] text-cyan-200/90 font-bold uppercase">
              THE ULTIMATE BATTLEGROUND
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Your competitive gaming destination. Join daily Free Fire tournaments, earn real rewards
            instantly, and compete on a skill-based platform. Download MH ESPORTS.
          </p>

          {/* Download CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={onOpenApkModal}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0084FF] to-[#00B4FF] hover:from-[#0074E0] hover:to-[#00A0E0] text-white font-gaming text-sm font-bold tracking-wider uppercase shadow-xl shadow-cyan-900/50 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span>DOWNLOAD APP</span>
            </button>

            <button
              onClick={onOpenAppLobby}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#0F182E] hover:bg-[#162344] border border-cyan-500/40 text-white font-gaming text-sm font-bold tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer relative"
            >
              <Play className="w-4 h-4 text-orange-400 fill-current" />
              <span>PLAY IN BROWSER</span>
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-600 text-white uppercase tracking-wider">
                LIVE
              </span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 border-y border-cyan-900/30 py-4">
            <div className="space-y-0.5">
              <span className="font-heading text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                547K<span className="text-white">+</span>
              </span>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                GAMERS
              </p>
            </div>

            <div className="space-y-0.5 border-x border-cyan-900/30">
              <span className="font-heading text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                28K<span className="text-white">+</span>
              </span>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                TOURNAMENTS
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="font-heading text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                ₹1.2L<span className="text-white">+</span>
              </span>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
                DISTRIBUTED
              </p>
            </div>
          </div>

          {/* Mobile Screen Mockup Showcase */}
          <div className="relative pt-6 max-w-sm sm:max-w-md mx-auto">
            <div className="relative mx-auto rounded-[38px] p-2.5 bg-gradient-to-b from-gray-700 via-gray-900 to-black border-4 border-gray-800 shadow-2xl shadow-cyan-950/80">
              {/* Phone Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20" />

              {/* Screen Content Preview */}
              <div className="relative rounded-[30px] overflow-hidden bg-[#0B0E17] border border-gray-800 text-left">
                {/* Mini App Header */}
                <div className="p-3 bg-[#111728] border-b border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src="/mh_esports_logo.jpg" alt="logo" className="w-5 h-5 rounded" />
                    <span className="font-bold text-white text-[11px]">MH ESPORTS</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">
                    ₹ 1,367
                  </span>
                </div>

                {/* Banner inside Phone */}
                <div className="p-3 bg-gradient-to-r from-orange-950/80 to-purple-950/80 border-b border-gray-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-yellow-400">🔥 DAILY TOURNAMENTS</span>
                    <span className="text-[9px] text-gray-400">10:00 AM • 10:30 AM</span>
                  </div>
                  <p className="text-xs font-bold text-white">Free Fire Solo, Duo & Squad BR 48 Slots</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">₹15 Per Kill • ₹800 Prize Pool</p>
                </div>

                {/* Quick Match Cards */}
                <div className="p-3 space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#141B30] border border-orange-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-[11px] block">Bermuda Solo Match</span>
                      <span className="text-[10px] text-gray-400">Entry: ₹20 • Slot #08 Confirmed</span>
                    </div>
                    <button
                      onClick={onOpenAppLobby}
                      className="py-1 px-2.5 rounded-lg bg-orange-600 text-white font-bold text-[10px] uppercase"
                    >
                      Join
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141B30] border border-cyan-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-[11px] block">Squad Clash 48 Players</span>
                      <span className="text-[10px] text-gray-400">Room ID Releases 1 min before</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      OPEN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY MH ESPORTS - BUILT FOR CHAMPIONS ================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
              WHY MH ESPORTS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">
              BUILT FOR CHAMPIONS
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              Everything you need for a fair, fast, and rewarding esports experience.
            </p>
            <div className="w-16 h-1 bg-cyan-500 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Fair Play Guarantee</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Advanced anti-cheat detection ensures a level playing field. Your skill is the only deciding factor — always.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Zero Lag Platform</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                High-performance servers handle registration and real-time results in milliseconds. Pure gaming, zero delays.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Real Rewards</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Win cash prizes, per-kill bonuses, and exclusive tournament rewards. Real prizes, real value — no gimmicks.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Instant Withdrawal</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Transfer winnings directly to your UPI ID (Google Pay, PhonePe, Paytm). Available 24/7 with zero waiting.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Secure & Verified</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Bank-grade encryption protects your wallet and personal data at every step. Your security is our priority.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-5 rounded-2xl bg-[#090E1F]/90 border border-cyan-900/40 hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">24/7 Live Support</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our dedicated support team is available via WhatsApp and in-app chat round the clock to resolve any issue instantly.
              </p>
            </div>
          </div>
        </section>

        {/* ================= EVERYTHING IN ONE APP ================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
              FEATURES
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">
              EVERYTHING IN ONE APP
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              From matchmaking to payouts — one powerful platform for every Free Fire gamer.
            </p>
            <div className="w-16 h-1 bg-cyan-500 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Top Titles & 48-Player Slots</h4>
                <p className="text-xs text-gray-400">
                  Solo, Duo, and Squad modes for Free Fire MAX with dedicated slot reservations so no random player can intrude.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Social Login</h4>
                <p className="text-xs text-gray-400">
                  One-tap sign in via Google. Securely save your Free Fire In-Game Name and wallet balance across all devices.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Instant Real UPI Payouts</h4>
                <p className="text-xs text-gray-400">
                  Withdraw your match winnings and per-kill rewards straight to PhonePe, Google Pay, or Paytm in seconds.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Live Leaderboard</h4>
                <p className="text-xs text-gray-400">
                  Track your kills, match winnings, and MVP rank in real-time as results update immediately after each tournament.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Smart Mobile Status Bar Notifications</h4>
                <p className="text-xs text-gray-400">
                  Never miss a custom match. Receive Room ID and Password directly in your phone status bar 1 minute before start!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/80 border border-cyan-900/30 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Daily Free Matches & Bonuses</h4>
                <p className="text-xs text-gray-400">
                  Play in daily ₹0 entry free matches to win real cash rewards and level up your Free Fire skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE APP SCREEN CAROUSEL ================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
              APP SCREENS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">
              SLEEK. INTUITIVE. POWERFUL.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              A clean, modern interface designed for fast play and instant rewards.
            </p>
            <div className="w-16 h-1 bg-cyan-500 mx-auto rounded-full mt-2" />
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#0A0F21] border border-cyan-500/40 p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                  {APP_SCREENS[activeSlide].tag}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {activeSlide + 1} / {APP_SCREENS.length}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <h3 className="font-heading text-xl text-white font-bold">
                  {APP_SCREENS[activeSlide].title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {APP_SCREENS[activeSlide].desc}
                </p>
              </div>

              {/* Slider image view */}
              <div className="rounded-2xl overflow-hidden bg-black/60 border border-gray-800 aspect-[16/9] flex items-center justify-center relative">
                <img
                  src={APP_SCREENS[activeSlide].image}
                  alt={APP_SCREENS[activeSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handlePrevSlide}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {APP_SCREENS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activeSlide === i ? 'w-8 bg-cyan-400' : 'w-2.5 bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Second Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
            <div className="p-4 rounded-xl bg-[#090E1F]/90 border border-cyan-900/40 text-center space-y-1">
              <Gamepad2 className="w-5 h-5 text-cyan-400 mx-auto" />
              <span className="font-heading text-2xl font-black text-white block">18K+</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">TOURNAMENTS HOSTED</p>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/90 border border-cyan-900/40 text-center space-y-1">
              <Users className="w-5 h-5 text-cyan-400 mx-auto" />
              <span className="font-heading text-2xl font-black text-white block">344K+</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">ACTIVE GAMERS</p>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/90 border border-cyan-900/40 text-center space-y-1">
              <CreditCard className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="font-heading text-2xl font-black text-emerald-400 block">₹1.2L+</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">WINNINGS DISTRIBUTED</p>
            </div>

            <div className="p-4 rounded-xl bg-[#090E1F]/90 border border-cyan-900/40 text-center space-y-1">
              <Gift className="w-5 h-5 text-cyan-400 mx-auto" />
              <span className="font-heading text-2xl font-black text-white block">146K+</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">REWARDS CLAIMED</p>
            </div>
          </div>
        </section>

        {/* ================= BOTTOM DOWNLOAD CTA ================= */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#0F1C38] via-[#091124] to-[#060A14] border border-cyan-500/40 text-center space-y-6 shadow-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
            GET THE APP
          </span>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white uppercase tracking-wide">
              Start Competing Today
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Download the MH ESPORTS app and jump into your first tournament in under 60 seconds.
              Free to join — always.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={onOpenApkModal}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0084FF] to-[#00B4FF] hover:from-[#0074E0] hover:to-[#00A0E0] text-white font-gaming text-sm font-bold tracking-wider uppercase shadow-xl shadow-cyan-900/50 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span>DOWNLOAD APK</span>
            </button>

            <button
              onClick={onOpenAppLobby}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#142347] hover:bg-[#1A2E5C] border border-cyan-500/40 text-white font-gaming text-sm font-bold tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-orange-400 fill-current" />
              <span>OPEN WEB APP</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Version 2.4 • Android 6.0+ • Free Download
          </p>

          {/* WhatsApp Channel Card */}
          <div className="pt-4 max-w-md mx-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl bg-[#0E1F18] border border-emerald-500/40 hover:border-emerald-400 text-left space-y-2 transition-all group"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" />
                <span>Join Our WhatsApp Channel</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Get instant updates on tournaments, custom room passwords, results, and exclusive offers.
              </p>
              <div className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-gaming text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md">
                <MessageCircle className="w-4 h-4" />
                <span>JOIN CHANNEL</span>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-cyan-900/30 text-center space-y-4">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white text-xs">
              MH
            </div>
            <span className="font-heading text-lg font-bold text-white tracking-wider">
              MH <span className="text-cyan-400">ESPORTS</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 max-w-md mx-auto">
            MH ESPORTS is Maharashtra's premier esports tournament platform. Built by gamers, for
            gamers — compete, win, and rise.
          </p>

          <p className="text-[10px] text-gray-500">
            © 2026 MH ESPORTS. Free Fire MAX is a registered trademark of Garena.
          </p>
        </footer>
      </main>
    </div>
  );
};
