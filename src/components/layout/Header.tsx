/**
 * components/layout/Header.tsx
 * شريط الرأس العلوي الاحترافي بمستوى أنظمة الشركات العالمية (Linear / Apple)
 * يدعم Breadcrumbs، تاريخ اليوم الديناميكي بالعربية، البحث السريع، زر الإضافة الموحد، تبديل المظهر، والبروفايل
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Search,
  Sun,
  Moon,
  Sparkles,
  Bot,
  Menu,
  X,
  ChevronLeft,
  CheckCircle2,
  FolderGit2,
  Target,
  Lightbulb,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setIsQuickTaskModalOpen,
    setIsIdeaModalOpen,
    actionHistory,
    state,
  } = useApp();
  const { logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddMenuOpen, setIsQuickAddMenuOpen] = useState(false);

  // Dynamic Arabic date format
  const formattedArabicDate = useMemo(() => {
    try {
      const now = new Date();
      return new Intl.DateTimeFormat('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
    } catch {
      return '2027 · سنة البناء';
    }
  }, []);

  // Breadcrumbs title mapping
  const breadcrumbTitle = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return 'نظرة عامة';
      case 'assistant':
        return 'المساعد التنفيذي الذكي';
      case 'today':
        return 'تركيز اليوم';
      case 'goals':
        return 'الأهداف السنوية';
      case 'projects':
        return 'المشاريع والتجارب';
      case 'calendar':
        return 'التقويم وجدول الكتل';
      case 'time':
        return 'تتبع الوقت الفعلي';
      case 'business':
        return 'معمل الأعمال';
      case 'money':
        return 'المال والميزانية';
      case 'learning':
        return 'التعلم والتطبيق';
      case 'review':
        return 'المراجعة الأسبوعية';
      case 'trash':
        return 'سلة المحذوفات والتعديلات';
      case 'manba':
        return 'منبع الإنجازات والأنشطة';
      case 'habits':
        return 'العادات والروتين';
      case 'ideas':
        return 'بنك الأفكار (Parking Lot)';
      case 'settings':
        return 'الإعدادات';
      default:
        return 'الرئيسية';
    }
  }, [activeTab]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const tasks = state.tasks.filter((t) => t.title.toLowerCase().includes(q)).map((t) => ({ type: 'مهمة', title: t.title, tab: 'today' }));
    const projects = state.projects.filter((p) => p.title.toLowerCase().includes(q)).map((p) => ({ type: 'مشروع', title: p.title, tab: 'projects' }));
    const goals = state.goals.filter((g) => g.title.toLowerCase().includes(q)).map((g) => ({ type: 'هدف', title: g.title, tab: 'goals' }));
    const ideas = state.ideas.filter((i) => i.title.toLowerCase().includes(q)).map((i) => ({ type: 'فكرة', title: i.title, tab: 'ideas' }));
    return [...tasks, ...projects, ...goals, ...ideas].slice(0, 8);
  }, [searchQuery, state]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 px-4 py-2.5 backdrop-blur-md md:px-8 transition-colors duration-150">
        {/* Left Side (in RTL): Mobile toggle, Breadcrumbs & Dynamic Date */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileNav}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] lg:hidden"
            aria-label="القائمة الجانبية"
          >
            {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] min-w-0">
            <span
              onClick={() => setActiveTab('dashboard')}
              className="cursor-pointer hover:text-[var(--text-primary)] transition-colors font-medium hidden sm:inline"
            >
              السماحي OS
            </span>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
            <span className="font-semibold text-[var(--text-primary)] truncate">
              {breadcrumbTitle}
            </span>
          </nav>

          <span className="text-[var(--border-color)] hidden md:inline">|</span>

          {/* Dynamic Arabic Date */}
          <div className="hidden md:flex items-center text-xs text-[var(--text-secondary)] font-medium">
            <span>{formattedArabicDate}</span>
          </div>
        </div>

        {/* Right Side (in RTL): Search, Action Stream, Theme Toggle, Quick Add, Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 transition-colors"
            title="بحث سريع (Ctrl + K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">بحث...</span>
            <kbd className="hidden lg:inline-block font-mono text-[9px] px-1 py-0.2 rounded border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* AI Assistant Quick Launcher */}
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'assistant'
                ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/60'
            }`}
            title="المساعد التنفيذي الذكي لنظام السماحي OS"
          >
            <Bot className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
            <span className="hidden sm:inline font-semibold">المساعد</span>
            <span className="font-mono text-[10px] bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] px-1.5 py-0.2 rounded font-bold">
              AI
            </span>
          </button>

          {/* Action Stream / Undo Button ("منبع الإنجازات") */}
          <button
            onClick={() => setActiveTab('manba')}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/60 transition-all"
            title="منبع الإنجازات وسجل الخطوات مع إمكانية التراجع الفوري"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">المنبع</span>
            {actionHistory && actionHistory.length > 0 && (
              <span className="font-mono text-[10px] bg-[var(--accent-gold)] text-black px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                {actionHistory.length}
              </span>
            )}
          </button>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 transition-colors"
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[var(--accent-gold)]" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--accent-gold)]" />
            )}
          </button>

          {/* Unified Quick Add Button */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddMenuOpen(!isQuickAddMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-3 py-1.5 text-xs font-semibold text-black transition-all hover:opacity-90 active:scale-95 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span className="hidden sm:inline">إضافة</span>
            </button>

            {/* Quick Add Dropdown Menu */}
            {isQuickAddMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsQuickAddMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <button
                    onClick={() => {
                      setIsQuickAddMenuOpen(false);
                      setIsQuickTaskModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
                    <span>مهمة جديدة</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsQuickAddMenuOpen(false);
                      setIsIdeaModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span>فكرة في الـ Parking Lot</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsQuickAddMenuOpen(false);
                      setActiveTab('projects');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  >
                    <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>مشروع جديد</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsQuickAddMenuOpen(false);
                      setActiveTab('goals');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  >
                    <Target className="h-3.5 w-3.5 text-emerald-400" />
                    <span>هدف سنوي 2027</span>
                  </button>
                </div>
              </>
            )}
          </div>

                    {/* Lock Screen Button */}
          <button
            onClick={logout}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/40 transition-colors"
            title="قفل النظام"
          >
            <Lock className="h-4 w-4 text-[var(--accent-gold)]" />
          </button>

{/* User Profile Avatar */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]/60 transition-colors"
            title="محمد السماحي (الملف الشخصي والإعدادات)"
          >
            <span className="font-mono text-xs font-bold text-[var(--accent-gold)]">
              MS
            </span>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3">
              <Search className="h-4 w-4 text-[var(--accent-gold)] shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="ابحث في المهام، المشاريع، الأهداف، أو الأفكار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded border border-[var(--border-color)]"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                  اكتب أي كلمة للبحث الفوري في كافة عناصر النظام...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                  لا توجد نتائج مطابقة لـ "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors text-right"
                    >
                      <span className="truncate">{res.title}</span>
                      <span className="font-mono text-[10px] text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded shrink-0 mr-2">
                        {res.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            className="fixed inset-0 -z-10"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
          />
        </div>
      )}
    </>
  );
};
