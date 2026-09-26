import React from 'react';
import { Users, Moon, Sun, ExternalLink, Settings, Sparkles, Radio } from 'lucide-react';
import { DiscordServerData } from '../types';

interface NavbarProps {
  serverData: DiscordServerData | null;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverData,
  darkMode,
  setDarkMode,
  onNavigate,
  activeSection
}) => {
  const onlineCount = serverData?.approximatePresenceCount ?? 634;

  return (
    <header 
      id="main-navbar"
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-950/80 border-slate-800/80 text-white' 
          : 'bg-white/80 border-slate-200/90 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Live Indicator */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-[#5865F2]/20 border border-[#5865F2]/30 group-hover:scale-105 transition-transform duration-200 bg-slate-900">
                <img 
                  src={serverData?.guild?.icon || "/dostana-icon.gif"} 
                  alt="Dostana Discord Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + "/dostana-icon.png") {
                      target.src = "/dostana-icon.png";
                    }
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#5865F2] via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {serverData?.guild?.name || "Dostana"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#5865F2]/15 text-[#5865F2] border border-[#5865F2]/30">
                  discord.gg/dostana
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-emerald-400">
                  {onlineCount.toLocaleString()} Online
                </span>
                <span className="hidden md:inline">• Live Server</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'activity-counter', label: 'Live Activity' },
            { id: 'leadership', label: 'Leadership' },
            { id: 'community', label: 'Community Hub' },
            { id: 'perks', label: 'Features' }
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5865F2]/15 text-[#5865F2] font-semibold border border-[#5865F2]/30'
                    : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="Toggle dark/light mode"
            className={`p-2 rounded-xl border transition-all duration-200 ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Join Discord CTA */}
          <a
            id="btn-nav-join-discord"
            href="https://discord.gg/dostana"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/25 hover:shadow-[#5865F2]/40 transition-all duration-200 active:scale-95"
          >
            <span className="hidden sm:inline">Join Server</span>
            <span className="sm:hidden">Join</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
