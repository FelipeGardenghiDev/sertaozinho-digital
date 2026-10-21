import React from 'react';
import { Home, ShoppingBag, Briefcase, PhoneCall, Newspaper, Music } from 'lucide-react';

export type TabType = 'home' | 'mercados' | 'vagas' | 'guia' | 'noticias' | 'cultura';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  vagasCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  vagasCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Início', icon: Home },
    { id: 'mercados' as TabType, label: 'Mercados', icon: ShoppingBag },
    { id: 'vagas' as TabType, label: 'Vagas PAT', icon: Briefcase, badge: vagasCount },
    { id: 'guia' as TabType, label: 'Guia SOS', icon: PhoneCall },
    { id: 'noticias' as TabType, label: 'Notícias', icon: Newspaper },
    { id: 'cultura' as TabType, label: 'Cultura', icon: Music },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 sm:py-2">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
