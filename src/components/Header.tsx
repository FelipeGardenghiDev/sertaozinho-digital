import React from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeTabTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 px-4 py-3">
      <div className="max-w-4xl mx-auto space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/20">
              <span className="text-xl font-black text-white">S</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Sertãozinho <span className="text-emerald-400 font-extrabold">Digital</span>
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  SP
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[190px] sm:max-w-xs">{activeTabTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-[11px]">Vivo</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por ofertas, vagas do PAT, UPA, farmácias, chaveiros..."
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-9 py-2 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
