import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Headphones, 
  MessageSquare, 
  Gift, 
  Smile, 
  Check, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ServerFeaturesSectionProps {
  darkMode: boolean;
}

export const ServerFeaturesSection: React.FC<ServerFeaturesSectionProps> = ({ darkMode }) => {
  const [selectedRole, setSelectedRole] = useState(0);

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-pink-400" />,
      title: "Nitro Boosted Level 3",
      desc: "Crystal-clear 384kbps voice bitrate, 1080p 60fps screen-share streams, and custom server vanity link."
    },
    {
      icon: <Headphones className="w-5 h-5 text-indigo-400" />,
      title: "24/7 High-Fidelity Jukebox",
      desc: "Multiple non-stop music bots playing Lo-Fi, Bollywood, Hip-Hop, and requests directly inside dedicated VCs."
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      title: "Weekly Events & Tournaments",
      desc: "Valorant custom matches, BGMI scrims, Anime trivia, and Bollywood quizzes with Nitro giveaways."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Safe & Zero-Toxicity Community",
      desc: "Dedicated moderation team with round-the-clock shift coverage to maintain a welcoming environment for everyone."
    },
    {
      icon: <Smile className="w-5 h-5 text-purple-400" />,
      title: "150+ Custom Emojis & Stickers",
      desc: "Exclusive Dostana animated emotes, desi meme reactions, and funny soundboard clips for all members."
    },
    {
      icon: <Gift className="w-5 h-5 text-rose-400" />,
      title: "Role Leveling & Economy System",
      desc: "Active chatting earns XP and server coins. Unlock VIP voice channels, custom color roles, and badge rewards."
    }
  ];

  const roles = [
    {
      name: "Server Owner",
      color: "text-amber-400",
      border: "border-amber-400/40",
      bg: "bg-amber-400/10",
      desc: "Full administrative control, server vision, and community ambassador.",
      perks: ["Crown badge", "Admin permissions", "Direct DM access", "Custom color role"]
    },
    {
      name: "Co-Owner",
      color: "text-[#5865F2]",
      border: "border-[#5865F2]/40",
      bg: "bg-[#5865F2]/10",
      desc: "Core executive leadership overseeing moderation, bots, events, and partnerships.",
      perks: ["Executive role", "Event organizer", "Bot configurations", "VIP voice privileges"]
    },
    {
      name: "Moderator",
      color: "text-emerald-400",
      border: "border-emerald-400/40",
      bg: "bg-emerald-400/10",
      desc: "Active guardians enforcing rules and guiding new members in chat and voice.",
      perks: ["Timeout / Mute access", "Report resolution", "Event assistance", "Mod lounge access"]
    },
    {
      name: "Server Booster",
      color: "text-pink-400",
      border: "border-pink-400/40",
      bg: "bg-pink-400/10",
      desc: "Members who support Dostana with Discord Nitro Server Boosts.",
      perks: ["Booster icon & pink role", "Exclusive booster lounge", "Soundboard access", "Image upload in chat"]
    }
  ];

  return (
    <section 
      id="perks"
      className="py-16 sm:py-24 border-t transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why Dostana is India's Favorite Hangout
          </h2>
          <p className={`mt-3 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Built from the ground up for authentic connections, seamless gaming, and relaxed conversations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-[#5865F2]/40 ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/30 w-fit mb-4">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">{feat.title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Roles Showcase */}
        <div className={`rounded-3xl border p-6 sm:p-10 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            
            <div className="lg:max-w-md">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5865F2]">Hierarchy & Roles</span>
              <h3 className="text-2xl font-extrabold tracking-tight mt-1 mb-3">
                Server Role Privileges
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a role to inspect special permissions, community standing, and perks granted in the server.
              </p>

              <div className="flex flex-wrap gap-2">
                {roles.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRole(i)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRole === i
                        ? `${r.bg} ${r.border} ${r.color} shadow-sm`
                        : darkMode
                          ? 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    @{r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Role details card */}
            <div className={`flex-1 w-full p-6 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${roles[selectedRole].bg} ${roles[selectedRole].border} ${roles[selectedRole].color}`}>
                  @{roles[selectedRole].name}
                </span>
                <span className="text-xs text-slate-400">Verified Role</span>
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {roles[selectedRole].desc}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Role Perks & Rights:
                </span>
                {roles[selectedRole].perks.map((perk, pi) => (
                  <div key={pi} className="flex items-center gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
