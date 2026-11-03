/**
 * components/layout/Sidebar.tsx
 * شريط التنقل الجانبي لنظام "السماحي OS"
 * يدعم الشاشات المكتبية والمتحركة مع مؤشرات حية لكل قسم
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  FolderGit2,
  Lightbulb,
  Flame,
  FileCheck2,
  CalendarDays,
  Clock,
  Wallet,
  Briefcase,
  Settings,
  X,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  highlightBadge?: boolean;
  isTimerLive?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    todayFocusTasks,
    activeProjects,
    state,
    activeTimer,
    financialSummary,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDoneToday = state.habits.filter((h) => h.completedDates.includes(todayStr)).length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'القيادة اليومية',
      items: [
        {
          id: 'dashboard',
          label: 'لوحة التحكم',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'today',
          label: 'خطة اليوم (Plan My Day)',
          icon: CheckSquare,
          badge: `${todayFocusTasks.length}/3`,
          highlightBadge: todayFocusTasks.length > 0,
        },
        {
          id: 'habits',
          label: 'العادات والروتين',
          icon: Flame,
          badge: `${habitsDoneToday}/${state.habits.length}`,
        },
        {
          id: 'calendar',
          label: 'التقويم والكتل الزمنية',
          icon: CalendarDays,
          badge: null,
        },
      ],
    },
    {
      groupTitle: 'سنة البناء 2027',
      items: [
        {
          id: 'goals',
          label: 'الأهداف السنوية',
          icon: Target,
          badge: `${state.goals.length}`,
        },
        {
          id: 'projects',
          label: 'المشاريع والتجارب',
          icon: FolderGit2,
          badge: `${activeProjects.length}/3`,
          highlightBadge: activeProjects.length >= 3,
        },
        {
          id: 'review',
          label: 'المراجعة الأسبوعية',
          icon: FileCheck2,
          badge: `${state.weeklyReviews.length}`,
        },
        {
          id: 'ideas',
          label: 'الـ Parking Lot (الأفكار)',
          icon: Lightbulb,
          badge: `${state.ideas.length}`,
        },
      ],
    },
    {
      groupTitle: 'المال والوقت (Execution)',
      items: [
        {
          id: 'time',
          label: 'تتبع الوقت الفعلي',
          icon: Clock,
          badge: activeTimer.isRunning ? 'مؤقت نشط' : null,
          isTimerLive: activeTimer.isRunning,
        },
        {
          id: 'money',
          label: 'المال والتدفق النقدي',
          icon: Wallet,
          badge: `${financialSummary.netProfit.toLocaleString()} ج`,
        },
        {
          id: 'business',
          label: 'مختبر تجارب الدخل',
          icon: Briefcase,
          badge: `${state.incomeExperiments.length}`,
        },
      ],
    },
    {
      groupTitle: 'النظام',
      items: [
        {
          id: 'settings',
          label: 'الإعدادات والبيانات',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full justify-between py-4 px-3 select-none">
      <div className="space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#666666]">
              {group.groupTitle}
            </div>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#161616] text-[#D4AF37] border border-[#2a2a2a]'
                        : 'text-[#999999] hover:bg-[#0f0f0f] hover:text-[#f5f5f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#D4AF37]'
                            : item.isTimerLive
                            ? 'text-emerald-400 animate-pulse'
                            : 'text-[#666666]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                          item.isTimerLive
                            ? 'bg-emerald-500/20 text-emerald-400 font-bold animate-pulse'
                            : item.highlightBadge
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                            : 'bg-[#141414] text-[#666666]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* شارة الهوية في الأسفل */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-3 text-center space-y-1">
        <div className="text-[11px] font-semibold text-[#D4AF37]">
          السماحي OS v0.2
        </div>
        <div className="text-[10px] font-mono text-[#666666]">
          2027 — سنة البناء
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* للشاشات الكبيرة (Desktop Sidebar) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-[#1a1a1a] bg-[#080808] overflow-y-auto">
        {content}
      </aside>

      {/* للشاشات الصغيرة (Mobile Drawer) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-72 bg-[#080808] border-l border-[#1a1a1a] flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
              <span className="text-xs font-mono text-[#D4AF37] font-bold">
                قائمة السماحي OS
              </span>
              <button
                onClick={onCloseMobile}
                className="text-[#777777] hover:text-[#F5F5F5] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
