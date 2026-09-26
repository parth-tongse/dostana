import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Shield, 
  UserPlus, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Settings, 
  Flame,
  Hash,
  Code2,
  Terminal
} from 'lucide-react';
import { LeadershipData, LeadershipProfile } from '../types';

interface LeadershipSectionProps {
  leadership: LeadershipData;
  darkMode: boolean;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  leadership,
  darkMode
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusColor = (status: LeadershipProfile['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500 border-slate-950 shadow-emerald-500/50';
      case 'idle':
        return 'bg-amber-500 border-slate-950 shadow-amber-500/50';
      case 'dnd':
        return 'bg-rose-500 border-slate-950 shadow-rose-500/50';
      default:
        return 'bg-slate-500 border-slate-950';
    }
  };

  const getStatusText = (status: LeadershipProfile['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'idle': return 'Away / Idle';
      case 'dnd': return 'Do Not Disturb';
      default: return 'Offline';
    }
  };

  const { owner, coOwners, developers = [] } = leadership;

  return (
    <section 
      id="leadership"
      className="py-16 sm:py-24 border-t transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/25">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Dostana Server Administration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Server Owner & Co-Owners
            </h2>
            <p className={`mt-2 text-sm sm:text-base max-w-2xl ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Meet the core leadership behind the Dostana community. Click on any profile to send a direct friend request or open their Discord profile.
            </p>
          </div>
        </div>

        {/* OWNER SPOTLIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div 
            id="owner-card"
            className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 transition-all duration-300 shadow-xl ${
              darkMode 
                ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border-[#5865F2]/40 shadow-[#5865F2]/10' 
                : 'bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-indigo-200 shadow-indigo-100/50'
            }`}
          >
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#5865F2] to-purple-500" />
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
              {/* Profile Avatar & Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-[#5865F2] to-purple-500 shadow-xl">
                    <img 
                      src={owner.avatar || "/naruto-avatar.png"} 
                      alt={owner.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + "/naruto-avatar.png") {
                          target.src = "/naruto-avatar.png";
                        }
                      }}
                      className="w-full h-full object-cover rounded-[20px] bg-slate-900"
                    />
                  </div>
                  {/* Status Indicator */}
                  <span className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-4 ${getStatusColor(owner.status)} shadow-md`} />
                  {/* Crown Icon */}
                  <div className="absolute -top-3 -left-3 p-1.5 rounded-xl bg-amber-400 text-slate-950 shadow-md">
                    <Crown className="w-4 h-4 fill-slate-950" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {owner.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/15 text-amber-400 border border-amber-400/30">
                      <Crown className="w-3 h-3 fill-amber-400" />
                      SERVER OWNER
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#5865F2]/15 text-[#5865F2] border border-[#5865F2]/30">
                      @{owner.tag}
                    </span>
                  </div>

                  <p className={`mt-2 text-sm sm:text-base max-w-xl ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {owner.bio}
                  </p>

                  {/* Status / Activity preview */}
                  {owner.customStatus && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-800/40 text-slate-300 border border-slate-700/50">
                      <span className={`w-2 h-2 rounded-full ${owner.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      <span>{owner.customStatus}</span>
                    </div>
                  )}

                  {/* User ID display with quick copy */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-slate-500" />
                      ID: <span className="text-slate-300 font-semibold">{owner.userId}</span>
                    </span>
                    <button
                      id="btn-copy-owner-id"
                      onClick={() => handleCopyId(owner.userId)}
                      title="Copy Discord User ID"
                      className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === owner.userId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedId === owner.userId && (
                      <span className="text-[11px] text-emerald-400 font-medium">Copied ID!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Owner */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <a
                  id="btn-owner-friend-request"
                  href={owner.profileLink || `https://discord.com/users/${owner.userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/30 hover:shadow-[#5865F2]/50 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Friend Request</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  id="btn-owner-copy-id-action"
                  onClick={() => handleCopyId(owner.userId)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold border transition-all duration-200 ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copiedId === owner.userId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">User ID Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy ID to Add on Discord</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 CO-OWNERS SECTION */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#5865F2]" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Co-Owners (4 Core Pillars)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coOwners.map((coOwner, idx) => {
              const isCopied = copiedId === coOwner.userId;
              const directLink = coOwner.profileLink || `https://discord.com/users/${coOwner.userId}`;

              return (
                <motion.div
                  key={coOwner.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  id={`co-owner-card-${idx}`}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    darkMode 
                      ? 'bg-slate-900/60 border-slate-800/90 hover:border-[#5865F2]/50 hover:shadow-xl hover:shadow-[#5865F2]/10' 
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100'
                  }`}
                >
                  <div>
                    {/* Header with Avatar and Role */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#5865F2]/30 p-0.5 bg-slate-900 shadow-md">
                          <img 
                            src={coOwner.avatar} 
                            alt={coOwner.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (coOwner.name === 'ERYX' && target.src !== window.location.origin + "/eryx-avatar.png") {
                                target.src = "/eryx-avatar.png";
                              } else if ((coOwner.name === 'Sʜᴀᴅᴏᴡ_X' || coOwner.userId === '1003619499418849330') && target.src !== window.location.origin + "/shadow-avatar.png") {
                                target.src = "/shadow-avatar.png";
                              } else if ((coOwner.name === '! Kitkat' || coOwner.userId === '1501494756587343995') && target.src !== window.location.origin + "/kitkat-avatar.webp") {
                                target.src = "/kitkat-avatar.webp";
                              } else if ((coOwner.name === 'SHANAYA' || coOwner.userId === '1492110373141090334') && target.src !== window.location.origin + "/shanaya-avatar.jpg") {
                                target.src = "/shanaya-avatar.jpg";
                              }
                            }}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${getStatusColor(coOwner.status)} shadow-sm`} />
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20">
                        <Shield className="w-3 h-3 text-[#5865F2]" />
                        CO-OWNER
                      </span>
                    </div>

                    {/* Names */}
                    <h4 className="text-lg font-bold tracking-tight">{coOwner.name}</h4>
                    <p className="text-xs text-[#5865F2] font-semibold">@{coOwner.tag}</p>

                    {/* User ID */}
                    <div className="mt-3 flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <span className="text-[11px] font-mono text-slate-400 truncate">
                        ID: <span className="text-slate-300 font-semibold">{coOwner.userId}</span>
                      </span>
                      <button
                        onClick={() => handleCopyId(coOwner.userId)}
                        title="Copy User ID"
                        className="p-1 hover:text-white text-slate-400 transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 space-y-2">
                    <a
                      id={`btn-co-owner-friend-${idx}`}
                      href={directLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md shadow-[#5865F2]/20 transition-all duration-200"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Send Friend Request</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    <button
                      onClick={() => handleCopyId(coOwner.userId)}
                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-semibold border transition-colors ${
                        darkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isCopied ? 'User ID Copied!' : 'Copy Discord ID'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* DEVELOPERS SECTION */}
        {developers.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-inherit">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Developer
                    </h3>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                      Technical Team
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Bot Development, Web Systems & Technical Infrastructure
                  </p>
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${developers.length === 1 ? 'max-w-md mx-auto sm:max-w-lg' : developers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
              {developers.map((dev, idx) => {
                const isCopied = copiedId === dev.userId;
                const directLink = dev.profileLink || (dev.userId ? `https://discord.com/users/${dev.userId}` : "https://discord.gg/dostana");

                return (
                  <motion.div
                    key={dev.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    id={`developer-card-${idx}`}
                    className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 relative group overflow-hidden ${
                      darkMode
                        ? 'bg-slate-900/60 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10'
                        : 'bg-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10'
                    }`}
                  >
                    {/* Glowing Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                    <div>
                      {/* Header with Avatar and Role */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400/40 p-0.5 bg-slate-900 shadow-md">
                            <img 
                              src={dev.avatar} 
                              alt={dev.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (dev.name === 'DEV PARTH' || dev.userId === '1379403772287127552') {
                                  target.src = '/dev-parth-avatar-new.png';
                                }
                              }}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${getStatusColor(dev.status)} shadow-sm`} />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            DEVELOPER
                          </span>
                          <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
                            {idx === 0 ? "System Lead" : "Developer"}
                          </span>
                        </div>
                      </div>

                      {/* Names */}
                      <h4 className="text-lg font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                        {dev.name}
                      </h4>
                      <p className="text-xs text-emerald-400 font-semibold font-mono">
                        @{dev.tag}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        {dev.role || "Lead Developer & System Architect"}
                      </p>

                      {/* User ID */}
                      <div className={`mt-3 flex items-center justify-between py-1.5 px-2 rounded-lg border font-mono ${
                        darkMode ? 'bg-slate-800/30 border-slate-700/30' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="text-[11px] text-slate-400 truncate">
                          ID: <span className="text-slate-300 font-semibold">{dev.userId}</span>
                        </span>
                        <button
                          onClick={() => handleCopyId(dev.userId)}
                          title="Copy User ID"
                          className="p-1 hover:text-white text-slate-400 transition-colors"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 space-y-2">
                      <a
                        id={`btn-dev-friend-${idx}`}
                        href={directLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all duration-200"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Send Friend Request</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>

                      <button
                        onClick={() => handleCopyId(dev.userId)}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-semibold border transition-colors ${
                          darkMode
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isCopied ? 'User ID Copied!' : 'Copy Discord ID'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
