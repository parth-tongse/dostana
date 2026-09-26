import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Zap, Copy, Check, ExternalLink, ShieldCheck, Crown, Flame, MessageSquare, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { DiscordServerData } from '../types';

interface HeroBannerProps {
  serverData: DiscordServerData | null;
  darkMode: boolean;
  onScrollToLeadership: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  serverData,
  darkMode,
  onScrollToLeadership
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullBannerModal, setShowFullBannerModal] = useState(false);

  const inviteLink = "https://discord.gg/dostana";
  const memberCount = serverData?.approximateMemberCount ?? 3324;
  const boostCount = serverData?.premiumSubscriptionCount ?? 26;
  const bannerImgUrl = "/dostana-banner.png";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section 
      id="overview"
      className="relative pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      {/* GRAND HERO CARD WITH BANNER DIRECTLY IN THE BACKGROUND BEHIND LOGO AND NAME */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl shadow-black/70 bg-slate-950 flex flex-col justify-between p-6 sm:p-10 md:p-12 min-h-[490px] sm:min-h-[550px] md:min-h-[580px]"
      >
        {/* THE OFFICIAL BANNER AS BACKGROUND BEHIND LOGO AND NAME (Minimal blur so artwork is completely visible) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img 
            src={bannerImgUrl} 
            alt="Dostana Official Server Banner" 
            className="w-full h-full object-cover object-center filter blur-[1px] brightness-[0.88] contrast-[1.05] transition-transform duration-700 hover:scale-[1.02]"
          />
          {/* Subtle soft gradient overlay so banner artwork & DOSTANA letters are 100% visible while logo & text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 via-50% to-slate-950/90" />
        </div>

        {/* Top Header Row inside banner: Status Pill & View Full Banner Button */}
        <div className="w-full flex items-center justify-between gap-3 flex-wrap z-10 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-extrabold uppercase tracking-wider">Live Discord Server</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-pink-400">
              <Flame className="w-3.5 h-3.5 fill-pink-400" />
              Level 3 Boosted
            </span>
          </div>

          <button
            id="btn-view-server-banner"
            onClick={() => setShowFullBannerModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all active:scale-95 hover:border-white/40"
            title="Click to view full original banner"
          >
            <ImageIcon className="w-4 h-4 text-amber-300" />
            <span>View Full Banner Art</span>
          </button>
        </div>

        {/* CENTER: Main Server Logo and Name (Sitting right in front of the banner!) */}
        <div className="my-auto flex flex-col items-center text-center z-10 py-3 sm:py-6">
          
          {/* Animated Server Avatar / Logo */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative inline-block mb-4 sm:mb-5 group cursor-pointer"
            onClick={() => setShowFullBannerModal(true)}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-white/40 bg-slate-900 group-hover:scale-105 transition-transform duration-300 ring-4 ring-white/15">
              <img 
                src={serverData?.guild?.icon || "/dostana-icon.gif"} 
                alt="Dostana Official Community Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + "/dostana-icon.png") {
                    target.src = "/dostana-icon.png";
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#5865F2] text-white p-1.5 sm:p-2 rounded-xl shadow-xl border-2 border-slate-950">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </motion.div>

          {/* Server Heading / Name right over the banner */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(251,191,36,0.4)]">
              {serverData?.guild?.name || "Dostana"}
            </span>
          </h1>

          {/* Server Description Tagline */}
          <p className="text-sm sm:text-lg max-w-2xl font-medium leading-relaxed text-slate-100 mt-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {serverData?.guild?.description || 
              "Official Dostana Discord Server — India's friendliest hangout community. Late-night voice sessions, gaming lobbies, chill music vibes, and genuine friendships 24/7."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <a
              id="btn-hero-join-server"
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white shadow-xl bg-gradient-to-r from-[#5865F2] to-indigo-600 hover:from-[#4752C4] hover:to-indigo-700 shadow-[#5865F2]/40 hover:shadow-[#5865F2]/60 hover:-translate-y-0.5 transition-all duration-200 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Join Dostana Discord</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              id="btn-copy-invite-link"
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm sm:text-base font-semibold bg-black/60 hover:bg-black/80 border border-white/25 text-white shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95 hover:border-white/40"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Invite Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>discord.gg/dostana</span>
                </>
              )}
            </button>

            <button
              id="btn-view-leadership"
              onClick={onScrollToLeadership}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm sm:text-base font-semibold bg-white/15 hover:bg-white/25 border border-white/25 text-white shadow-lg backdrop-blur-md transition-all duration-200"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Meet Leadership</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* METRICS ROW SITTING CLEANLY BELOW THE BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 mt-6"
      >
        {/* Stat 1: Total Members */}
        <div 
          id="stat-card-total-members"
          className="p-5 sm:p-6 rounded-2xl border border-white/10 dark:border-slate-800/80 text-left bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-amber-500/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Total Members
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {memberCount.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Active verified community members</p>
        </div>

        {/* Stat 2: Active Channels & Lounges */}
        <div 
          id="stat-card-channels"
          className="p-5 sm:p-6 rounded-2xl border border-white/10 dark:border-slate-800/80 text-left bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-sky-500/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Hub & Lounges
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/25">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            35+ Rooms
          </div>
          <p className="text-xs text-slate-400 mt-1">Social, gaming, late-night VCs & music</p>
        </div>

        {/* Stat 3: Nitro Boost Level */}
        <div 
          id="stat-card-boosts"
          className="p-5 sm:p-6 rounded-2xl border border-white/10 dark:border-slate-800/80 text-left bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-rose-400/50 hover:shadow-rose-500/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Nitro Boost Level
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25">
              <Zap className="w-5 h-5 fill-rose-400/30" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Level 3 ({boostCount})
          </div>
          <p className="text-xs text-slate-400 mt-1">384Kbps crystal audio & 1080p 60fps</p>
        </div>
      </motion.div>

      {/* FULL BANNER MODAL PREVIEW */}
      <AnimatePresence>
        {showFullBannerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowFullBannerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <ImageIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Official Dostana Server Banner</h3>
                    <p className="text-xs text-slate-400">Collage: Goldfish, Flower Mobile, Traffic Light Blooms, Bicycle & Butterfly</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullBannerModal(false)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] shadow-inner bg-black">
                <img
                  src={bannerImgUrl}
                  alt="Dostana Server Banner Full"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                <span>Dostana Discord Server • Official Aesthetic Banner</span>
                <a
                  href={inviteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#5865F2] hover:text-indigo-300 font-bold"
                >
                  <span>Join Server</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
