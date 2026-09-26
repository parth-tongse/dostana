import React from 'react';
import { ExternalLink, Heart, Shield, Sparkles, MessageCircle, Copy, Check } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
  serverLogo?: string;
}

export const Footer: React.FC<FooterProps> = ({ darkMode, serverLogo }) => {
  const [copied, setCopied] = React.useState(false);
  const logoSrc = serverLogo || "/dostana-icon.gif";

  const handleCopy = () => {
    navigator.clipboard.writeText("https://discord.gg/dostana");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-[#5865F2]/20 border-2 border-[#5865F2]/50 bg-slate-900 group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={logoSrc} 
                  alt="Dostana Official Logo"
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
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">Dostana Discord Community</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/40 uppercase tracking-wide">
                  Official
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Official Server Portal • discord.gg/dostana</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Invite!' : 'Copy Invite Link'}</span>
            </button>

            <a
              href="https://discord.gg/dostana"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Join Server</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-inherit flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dostana Discord Server. All Rights Reserved to <span className="font-bold text-slate-300">PARTH TONGSE</span>. Not affiliated with Discord Inc.</p>
          <p className="flex items-center gap-1.5">
            <span>Created & Owned by</span>
            <span className="font-semibold text-slate-300">PARTH TONGSE</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
