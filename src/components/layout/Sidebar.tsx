/**
 * components/layout/Sidebar.tsx
 * شريط التنقل الجانبي الاحترافي لنظام "السماحي OS"
 * ينفذ معايير التصميم الهرمي الواضح والمريح للعين
 * مقسم إلى مسارات دقيقة لمنع التشتت والكعبلة
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
  ChevronDown,
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

interface NavSection {
  title: string;
  badge?: string;
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
    trashItems,
    learningSkills,
  } = useApp();
  const { logout } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDoneToday = state.habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const focusDoneCount = todayFocusTasks.filter((t) => t.status === 'completed').length;
  const unresolvedErrors = state.errorLogs?.filter((e) => !e.isResolved).length || 0;

  // 1. المسار اليومي الحاسم (القصوى - Daily Non-Negotiables)
  const dailyCoreItems: NavItem[] = [
    {
      id: 'today',
      label: 'تركيز اليوم والتحضير',
      icon: CheckSquare,
      badge: `${focusDoneCount}/${todayFocusTasks.length || 3}`,
      badgeHighlight: todayFocusTasks.length > 0,
    },
    {
      id: 'habits',
      label: 'العادات والروتين',
      icon: Flame,
      badge: `${habitsDoneToday}/${state.habits.length}`,
      badgeHighlight: habitsDoneToday > 0,
    },
    {
      id: 'learning',
      label: 'التعلم والتطبيق',
      icon: GraduationCap,
      badge: learningSkills.length ? learningSkills.length : null,
    },
    {
      id: 'errors',
      label: 'سجل الأخطاء والدروس',
      icon: ShieldAlert,
      badge: state.errorLogs?.length || null,
      badgeHighlight: unresolvedErrors > 0,
    },
  ];

  // 2. مسار التخطيط وبنك الأفكار (المهم - Growth & Future)
  const planningItems: NavItem[] = [
    {
      id: 'goals',
      label: 'الأهداف الكبرى',
      icon: Target,
      badge: state.goals.length ? state.goals.length : null,
    },
    {
      id: 'projects',
      label: 'المشاريع الفعالة',
      icon: FolderGit2,
      badge: `${activeProjects.length}/3`,
      badgeHighlight: activeProjects.length >= 3,
    },
    {
      id: 'ideas',
      label: 'بنك الأفكار (Parking Lot)',
      icon: Lightbulb,
      badge: state.ideas.length ? state.ideas.length : null,
      badgeHighlight: state.ideas.length > 0,
    },
    {
      id: 'business',
      label: 'العملاء وتجارب الدخل',
      icon: Briefcase,
      badge: state.incomeExperiments.length ? state.incomeExperiments.length : null,
    },
  ];

  // 3. مسار التحليل والمتابعة (عند الحاجة - Strategic & Analytics)
  const analyticsItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'لوحة القيادة والمؤشرات',
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
      id: 'review',
      label: 'المراجعة الأسبوعية',
      icon: FileCheck2,
      badge: state.weeklyReviews.length ? state.weeklyReviews.length : null,
    },
    {
      id: 'calendar',
      label: 'التقويم الزمني',
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
      id: 'money',
      label: 'المال والميزانية',
      icon: Wallet,
    },
  ];

  // 4. مسار النظام والدعم (System)
  const systemItems: NavItem[] = [
    {
      id: 'settings',
      label: 'الإعدادات وبدء صفحة بيضاء',
      icon: Settings,
    },
    {
      id: 'manba',
      label: 'منبع الإنجازات والأنشطة',
      icon: Sparkles,
      badge: state.actionHistory?.length ? state.actionHistory.length : null,
    },
    {
      id: 'trash',
      label: 'سلة المحذوفات',
      icon: Trash2,
      badge: trashItems.length ? trashItems.length : null,
    },
  ];

  const sections: NavSection[] = [
    {
      title: 'الروتين والتركيز اليومي',
      badge: 'القصوى',
      items: dailyCoreItems,
    },
    {
      title: 'التخطيط وبنك الأفكار',
      badge: 'المهم',
      items: planningItems,
    },
    {
      title: 'التحليل والمتابعة',
      items: analyticsItems,
    },
    {
      title: 'النظام والبيانات',
      items: systemItems,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const renderNavGroup = (section: NavSection) => (
    <div key={section.title} className="space-y-1">
      <div className="px-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold pt-2.5 pb-1">
        <span>{section.title}</span>
        {section.badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-extrabold">
            {section.badge}
          </span>
        )}
      </div>
      <div className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] transition-all ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] border border-[var(--border-color)] font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] border border-transparent font-semibold'
              }`}
            >
              {/* Subtle active indicator bar */}
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-1.5 rounded-l-full bg-[var(--accent-gold)]" />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 stroke-[2.2] transition-colors ${
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
                  className={`font-mono text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-lg ${
                    item.isLive
                      ? 'bg-emerald-500/20 text-emerald-400 font-extrabold animate-pulse'
                      : item.badgeHighlight
                      ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold'
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
  );

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between py-4 px-3 select-none">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="px-3 pt-1 pb-2 flex items-center justify-between border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-gold)] text-black font-extrabold font-mono text-sm shadow-sm">
              OS
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
                السماحي OS
              </span>
              <span className="text-xs font-mono font-semibold text-[var(--accent-gold)]">
                2027 · سنة البناء
              </span>
            </div>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-3">
          {sections.map(renderNavGroup)}
        </div>
      </div>

      {/* Bottom Identity & Principle Card */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-center space-y-1.5 mt-4">
        <div className="text-xs font-bold text-[var(--accent-gold)]">
          السماحي OS
        </div>
        <div className="text-xs font-mono font-medium text-[var(--text-secondary)]">
          Build · Learn · Earn
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-amber-400 hover:border-amber-400/40 transition-colors"
        >
          <Lock className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/70 animate-in fade-in duration-150">
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
