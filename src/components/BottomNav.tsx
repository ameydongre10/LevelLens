import React from 'react';
import { Users, Zap, ClipboardCheck, Sparkles, TrendingUp } from 'lucide-react';

export type ActiveTab = 'groups' | 'tagging' | 'assess' | 'activities' | 'progress';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingPromoCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingPromoCount = 0
}) => {
  const tabs = [
    {
      id: 'groups' as ActiveTab,
      label: 'Groups',
      icon: Users
    },
    {
      id: 'tagging' as ActiveTab,
      label: 'Live Tag',
      icon: Zap,
      badge: pendingPromoCount > 0 ? pendingPromoCount : undefined
    },
    {
      id: 'assess' as ActiveTab,
      label: 'Assess',
      icon: ClipboardCheck
    },
    {
      id: 'activities' as ActiveTab,
      label: 'Activities',
      icon: Sparkles
    },
    {
      id: 'progress' as ActiveTab,
      label: 'Progress',
      icon: TrendingUp
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg">
      <div className="max-w-2xl mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors select-none ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-700 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
