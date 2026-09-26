import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Hash, 
  Megaphone, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  Crown,
  HeartHandshake,
  Copy,
  Check,
  Link2
} from 'lucide-react';

interface CommunityHubSectionProps {
  darkMode: boolean;
}

export interface FeaturedChannel {
  id: string;
  name: string;
  tag: string;
  badge: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  description: string;
  link: string;
  inviteCode: string;
}

export const CommunityHubSection: React.FC<CommunityHubSectionProps> = ({ darkMode }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // The 4 official channels requested with permanent invite links
  const channels: FeaturedChannel[] = [
    {
      id: 'vanity-channel',
      name: 'vanity channel',
      tag: '#vanity',
      badge: 'Official Vanity',
      icon: <Crown className="w-5 h-5" />,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border-amber-500/30',
      description: 'Official Dostana vanity invite links, custom branding, and server vanity showcase.',
      link: 'https://discord.gg/V676dSdp9',
      inviteCode: 'V676dSdp9'
    },
    {
      id: 'announcement',
      name: 'Announcement',
      tag: '#announcement',
      badge: 'Updates',
      icon: <Megaphone className="w-5 h-5" />,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/15 border-rose-500/30',
      description: 'Official announcements, important news, events, and notices directly from server leadership.',
      link: 'https://discord.gg/nd8ynPKEf',
      inviteCode: 'nd8ynPKEf'
    },
    {
      id: 'rules',
      name: 'Rules',
      tag: '#rules',
      badge: 'Guidelines',
      icon: <ShieldCheck className="w-5 h-5" />,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30',
      description: 'Community guidelines, safety policies, discord etiquette, and rules to keep the server friendly.',
      link: 'https://discord.gg/BNFMp3y9u',
      inviteCode: 'BNFMp3y9u'
    },
    {
      id: 'chat',
      name: 'chat',
      tag: '#chat',
      badge: 'Main Lounge',
      icon: <MessageSquare className="w-5 h-5" />,
      iconColor: 'text-[#5865F2]',
      iconBg: 'bg-[#5865F2]/15 border-[#5865F2]/30',
      description: 'Main general chat for all community conversations, daily banter, chilling, and late-night talks.',
      link: 'https://discord.gg/BmxaRZ7KCC',
      inviteCode: 'BmxaRZ7KCC'
    }
  ];

  return (
    <section 
      id="community"
      className="py-16 sm:py-24 border-t transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore The Community Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Server Channels
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-2xl ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Direct access to the core channels of Dostana. Connect, read announcements, check guidelines, and chat with members.
            </p>
          </div>

          <a
            id="btn-join-community-cta"
            href="https://discord.gg/dostana"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/25 transition-all duration-200 active:scale-95"
          >
            <span>Hop into Discord</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* 4 CORE CHANNELS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {channels.map((chan, idx) => (
            <motion.div
              key={chan.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              id={`channel-card-${chan.id}`}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                darkMode 
                  ? 'bg-slate-900/70 border-slate-800/80 hover:border-[#5865F2]/50 hover:bg-slate-900/95 hover:shadow-xl hover:shadow-[#5865F2]/10' 
                  : 'bg-white border-slate-200 hover:border-[#5865F2]/50 hover:shadow-xl hover:shadow-indigo-500/10'
              }`}
            >
              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className={`p-2.5 rounded-xl border ${chan.iconBg} ${chan.iconColor}`}>
                    {chan.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5865F2]/15 text-[#5865F2] border border-[#5865F2]/30">
                    {chan.badge}
                  </span>
                </div>

                {/* Channel Name & Tag */}
                <h3 className="font-bold text-lg tracking-tight group-hover:text-[#5865F2] transition-colors">
                  {chan.name}
                </h3>
                <span className={`inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded-md mt-1 ${
                  darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  {chan.tag}
                </span>

                {/* Channel Description */}
                <p className={`text-xs leading-relaxed mt-3 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {chan.description}
                </p>
              </div>

              {/* Permanent Invite Link Display & Action Buttons */}
              <div className="pt-4 mt-5 border-t border-dashed border-inherit space-y-2.5">
                {/* Permanent Invite Pill with Copy Button */}
                <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-mono border ${
                  darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="truncate flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>discord.gg/{chan.inviteCode}</span>
                  </span>
                  <button
                    id={`btn-copy-channel-${chan.id}`}
                    onClick={() => handleCopyLink(chan.id, chan.link)}
                    title="Copy Permanent Invite Link"
                    className="p-1 rounded hover:bg-slate-700/30 text-slate-400 hover:text-emerald-400 transition-colors ml-1"
                  >
                    {copiedId === chan.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Direct Open Button */}
                <a
                  id={`btn-open-channel-${chan.id}`}
                  href={chan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white transition-all duration-200 group/btn"
                >
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Open in Discord</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3-Step Onboarding Roadmap */}
        <div className={`p-8 sm:p-10 rounded-3xl border relative overflow-hidden ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-900/90 border-slate-800' 
            : 'bg-gradient-to-br from-slate-100/90 via-white to-slate-100/90 border-slate-200'
        }`}>
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Fast Onboarding</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Join the Dostana Family in 3 Simple Steps
            </h3>
            <p className={`text-xs sm:text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              No complex tests or waiting lists. You can be chatting with friendly folks in less than 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center font-extrabold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold mb-1.5">Click Invite & Accept</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Hit any join button or navigate to <code className="text-[#5865F2] font-semibold">discord.gg/dostana</code> to accept your server invite.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-extrabold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold mb-1.5">Read Server Guidelines</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Check the <a href="https://discord.gg/BNFMp3y9u" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:underline">#rules</a> channel to keep our community positive, respectful, and safe.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-extrabold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold mb-1.5">Say Hi & Connect</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Drop a "Hello" in <a href="https://discord.gg/Vn3jBXnSm" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#5865F2] hover:underline">#chat</a>. Our founders, co-owners, and members will give you a warm welcome!
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
