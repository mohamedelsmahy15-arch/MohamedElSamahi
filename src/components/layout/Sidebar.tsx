/**
 * components/layout/Sidebar.tsx
 * شريط التنقل الجانبي الاحترافي لنظام "السماحي OS"
 * ينفذ معايير التصميم العالمية المستوحاة من Linear و Apple
 * يدعم الشاشات المكتبية (RTL ثابت على اليمين) والشاشات المتحركة
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  Target,
  FolderGit2,
  CalendarDays,
  Clock,
  Briefcase,
  Wallet,
  GraduationCap,
  FileCheck2,
  Settings,
  Lock,
  ShieldAlert,
  Trash2,
  Sparkles,
  Flame,
  Lightbulb,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number | null;
  badgeHighlight?: boolean;
  isLive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    todayFocusTasks,
    activeProjects,
    state,
    activeTimer,
    trashItems,
    learningSkills,
  } = useApp();
  const { logout } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDoneToday = state.habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const focusDoneCount = todayFocusTasks.filter((t) => t.status === 'completed').length;

  // The core navigation items per company-level dashboard specification
  const primaryNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'نظرة عامة',
      icon: LayoutDashboard,
    },
    {
      id: 'assistant',
      label: 'المساعد الذكي',
      icon: Bot,
      badge: 'AI',
      badgeHighlight: true,
    },
    {
      id: 'today',
      label: 'تركيز اليوم',
      icon: CheckSquare,
      badge: `${focusDoneCount}/${todayFocusTasks.length || 3}`,
      badgeHighlight: todayFocusTasks.length > 0,
    },
    {
      id: 'goals',
      label: 'الأهداف',
      icon: Target,
      badge: state.goals.length,
    },
    {
      id: 'projects',
      label: 'المشاريع',
      icon: FolderGit2,
      badge: `${activeProjects.length}/3`,
      badgeHighlight: activeProjects.length >= 3,
    },
    {
      id: 'calendar',
      label: 'التقويم',
      icon: CalendarDays,
    },
    {
      id: 'time',
      label: 'تتبع الوقت',
      icon: Clock,
      badge: activeTimer.isRunning ? 'نشط' : null,
      isLive: activeTimer.isRunning,
    },
    {
      id: 'business',
      label: 'معمل الأعمال',
      icon: Briefcase,
      badge: state.incomeExperiments.length,
    },
    {
      id: 'money',
      label: 'المال والميزانية',
      icon: Wallet,
    },
    {
      id: 'learning',
      label: 'التعلم والتطبيق',
      icon: GraduationCap,
      badge: learningSkills.length,
    },
    {
      id: 'review',
      label: 'المراجعة الأسبوعية',
      icon: FileCheck2,
      badge: state.weeklyReviews.length,
    },
    {
      id: 'trash',
      label: 'سلة المحذوفات',
      icon: Trash2,
      badge: trashItems.length ? trashItems.length : null,
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  // Secondary tactical modules
  const secondaryNavItems: NavItem[] = [
    {
      id: 'manba',
      label: 'منبع الإنجازات والأنشطة',
      icon: Sparkles,
      badge: state.actionHistory?.length ? state.actionHistory.length : null,
      badgeHighlight: (state.actionHistory?.length || 0) > 0,
    },
    {
      id: 'habits',
      label: 'العادات والروتين',
      icon: Flame,
      badge: `${habitsDoneToday}/${state.habits.length}`,
    },
    {
      id: 'ideas',
      label: 'بنك الأفكار (Parking Lot)',
      icon: Lightbulb,
      badge: state.ideas.length,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between py-4 px-3 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-3 pt-1 pb-2 flex items-center justify-between border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-gold)] text-black font-bold font-mono text-xs shadow-sm">
              OS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                السماحي OS
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                2027 · سنة البناء
              </span>
            </div>
          </div>
        </div>

        {/* Core Company-Level Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            النظام الرئيسي
          </div>
          <div className="space-y-0.5 pt-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] border border-[var(--border-color)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  {/* Subtle active indicator bar */}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-l-full bg-[var(--accent-gold)]" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[var(--accent-gold)]'
                          : item.isLive
                          ? 'text-emerald-400 animate-pulse'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                        item.isLive
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold animate-pulse'
                          : item.badgeHighlight
                          ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-semibold'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
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

        {/* Secondary Modules */}
        <div className="space-y-1 pt-2 border-t border-[var(--border-color)]">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            أدوات التركيز والأنشطة
          </div>
          <div className="space-y-0.5 pt-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] border border-[var(--border-color)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[var(--accent-gold)]'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                        item.badgeHighlight
                          ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
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
      </div>

      {/* Bottom Identity & Principle Card */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-center space-y-1">
        <div className="text-[11px] font-semibold text-[var(--accent-gold)]">
          السماحي OS
        </div>
        <div className="text-[10px] font-mono text-[var(--text-muted)]">
          Build · Learn · Earn
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] py-1.5 text-xs text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-400/30 transition-colors"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>قفل النظام</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Right Sidebar in RTL */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-72 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <span className="text-xs font-mono text-[var(--accent-gold)] font-bold">
                قائمة السماحي OS
              </span>
              <button
                onClick={onCloseMobile}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
