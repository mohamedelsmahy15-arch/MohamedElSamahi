/**
 * components/manba/ManbaView.tsx
 * "منبع الإنجازات والأنشطة" (The Achievements & Action Stream)
 * السجل الشامل المتدفق لكل خطوة وإنجاز وعملية أنجزها محمد السماحي،
 * يتيح تصفح، فحص، وتراجع أو استرجاع أي خطوة إلى مكانها في أي لحظة.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Flame,
  FolderGit2,
  Target,
  DollarSign,
  Lightbulb,
  FileCheck2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ActionHistoryItem, ActionCategory, ActionType } from '../../types';

export const ManbaView: React.FC = () => {
  const {
    state,
    actionHistory,
    undoAction,
    setSelectedActionDetails,
    clearActionHistory,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'undone'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // إحصائيات سريعة للمنبع
  const totalCount = actionHistory?.length || 0;
  const completedTasksCount = (actionHistory || []).filter(
    (a) => a.category === 'task' && a.actionType === 'complete' && !a.undone
  ).length;
  const habitsLoggedCount = (actionHistory || []).filter(
    (a) => a.category === 'habit' && !a.undone
  ).length;
  const undoneCount = (actionHistory || []).filter((a) => a.undone).length;

  // تصفية العناصر
  const filteredActions = useMemo(() => {
    return (actionHistory || []).filter((item) => {
      // تصفية الفئة
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // تصفية الحالة (منجزة أم متراجع عنها)
      if (selectedStatus === 'active' && item.undone) return false;
      if (selectedStatus === 'undone' && !item.undone) return false;

      // البحث النصي
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.itemTitle.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.metadata?.lifeArea && item.metadata.lifeArea.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [actionHistory, selectedCategory, selectedStatus, searchQuery]);

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      let relative = '';
      if (diffMins < 2) relative = 'منذ لحظات';
      else if (diffMins < 60) relative = `منذ ${diffMins} دقيقة`;
      else if (diffHours < 24) relative = `منذ ${diffHours} ساعة`;
      else relative = date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });

      const timeStr = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      return { relative, full: `${relative} · ${timeStr}` };
    } catch {
      return { relative: iso, full: iso };
    }
  };

  const getCategoryIcon = (category: ActionCategory) => {
    switch (category) {
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'habit':
        return <Flame className="h-4 w-4 text-orange-400" />;
      case 'project':
        return <FolderGit2 className="h-4 w-4 text-sky-400" />;
      case 'goal':
        return <Target className="h-4 w-4 text-[var(--accent-gold)]" />;
      case 'idea':
        return <Lightbulb className="h-4 w-4 text-purple-400" />;
      case 'timeLog':
        return <Clock className="h-4 w-4 text-cyan-400" />;
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-emerald-300" />;
      case 'review':
        return <FileCheck2 className="h-4 w-4 text-amber-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-[var(--accent-gold)]" />;
    }
  };

  const getCategoryLabel = (category: ActionCategory) => {
    switch (category) {
      case 'task':
        return 'مهمة';
      case 'habit':
        return 'عادة';
      case 'project':
        return 'مشروع';
      case 'goal':
        return 'هدف 2027';
      case 'idea':
        return 'Parking Lot';
      case 'timeLog':
        return 'سجل وقت';
      case 'transaction':
        return 'معاملة مالية';
      case 'experiment':
        return 'تجربة دخل';
      case 'review':
        return 'مراجعة';
      default:
        return 'إجراء';
    }
  };

  const exportManbaLog = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(actionHistory, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `elsamahy-manba-log-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none" dir="rtl">
      {/* رأس الصفحة وبطاقة الترحيب التوجيهية */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-gradient-to-l from-[#141414] via-[#0d0d0d] to-[#070707] p-6 shadow-xl md:p-8">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent to-[#D4AF37]/5 pointer-events-none" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-sans md:text-2xl">
                منبع الإنجازات والأنشطة (Manba' Al-Injazat)
              </h1>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl font-sans">
              النهر المتدفق لكل خطوة أنجزتها، مهمة أتممتها، أو عادة رسختها في سنة البناء 2027.
              يمكنك هنا فحص تفاصيل أي خطوة بدقة، واسترجاع أي عنصر لمكانه وحالته في أي لحظة مع السيادة والتحكم الذاتي الكامل.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportManbaLog}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] px-3.5 py-2 text-xs font-medium text-[#aaaaaa] transition-colors"
              title="تصدير سجل الأنشطة كملف بيانات"
            >
              <Download className="h-3.5 w-3.5" />
              <span>تصدير السجل</span>
            </button>

            {actionHistory?.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('هل تريد مسح سجل الأنشطة القديم في المنبع؟ (لن يتم حذف بياناتك الأساسية)')) {
                    clearActionHistory();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition-colors"
                title="تفريغ سجل المنبع"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>تفريغ المنبع</span>
              </button>
            )}
          </div>
        </div>

        {/* بطاقات الإحصائيات الأربعة */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#1c1c1c] pt-5">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]/80 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">إجمالي الخطوات</span>
              <Sparkles className="h-4 w-4 text-[var(--accent-gold)]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
              {totalCount}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">عملية موثقة في النظام</span>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]/80 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">المهام المنجزة</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {completedTasksCount}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">مهمة مكتملة بنجاح</span>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]/80 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">العادات المنفذة</span>
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-orange-400">
              {habitsLoggedCount}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">توثيق التزام يومي</span>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]/80 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">المسترجعة (Undo)</span>
              <RotateCcw className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-300">
              {undoneCount}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">خطوات أعيدت لمكانها</span>
          </div>
        </div>
      </div>

      {/* شريط البحث وتصفية الفئات والحالات */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* حقل البحث بالاسم والمحتوى */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في منبع الإنجازات (اسم المهمة، العادة، المشروع، أو التعديل)..."
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] py-2.5 pr-10 pl-4 text-xs text-[var(--text-primary)] placeholder-[#555555] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                مسح
              </button>
            )}
          </div>

          {/* تبديل الحالة: الكل / المنجزة فقط / المتراجع عنها */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[#cccccc]'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedStatus === 'active'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'text-[var(--text-muted)] hover:text-emerald-300'
              }`}
            >
              المنجزة والنشطة ({totalCount - undoneCount})
            </button>
            <button
              onClick={() => setSelectedStatus('undone')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedStatus === 'undone'
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  : 'text-[var(--text-muted)] hover:text-amber-300'
              }`}
            >
              المتراجع عنها ({undoneCount})
            </button>
          </div>
        </div>

        {/* أزرار تصفية الأقسام (Interactive Filter Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1c1c1c] text-[var(--accent-gold)] border-[var(--accent-gold)]/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            كافة الأنشطة
          </button>
          <button
            onClick={() => setSelectedCategory('task')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'task'
                ? 'bg-[#1c1c1c] text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>المهام</span>
          </button>
          <button
            onClick={() => setSelectedCategory('habit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'habit'
                ? 'bg-[#1c1c1c] text-orange-400 border-orange-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>العادات</span>
          </button>
          <button
            onClick={() => setSelectedCategory('project')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'project'
                ? 'bg-[#1c1c1c] text-sky-400 border-sky-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>المشاريع</span>
          </button>
          <button
            onClick={() => setSelectedCategory('goal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'goal'
                ? 'bg-[#1c1c1c] text-[var(--accent-gold)] border-[var(--accent-gold)]/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>الأهداف</span>
          </button>
          <button
            onClick={() => setSelectedCategory('transaction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'transaction'
                ? 'bg-[#1c1c1c] text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>المالية</span>
          </button>
          <button
            onClick={() => setSelectedCategory('timeLog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'timeLog'
                ? 'bg-[#1c1c1c] text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>سجلات الوقت</span>
          </button>
          <button
            onClick={() => setSelectedCategory('idea')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'idea'
                ? 'bg-[#1c1c1c] text-purple-400 border-purple-500/40 shadow-sm'
                : 'bg-[#101010] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[#bbbbbb] hover:border-[var(--border-color)]'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Parking Lot</span>
          </button>
        </div>
      </div>

      {/* قائمة تدفق المنبع (The Stream) */}
      <div className="space-y-3">
        {filteredActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#191919] text-[var(--text-muted)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">لا توجد عمليات تطابق البحث في المنبع</h3>
            <p className="mt-1 text-xs text-[var(--text-muted)] max-w-sm">
              كلما أنجزت مهامك اليومية أو عاداتك أو مشروعاتك ستظهر هنا فوراً في المنبع مع إمكانية استرجاعها متى أردت.
            </p>
          </div>
        ) : (
          filteredActions.map((item) => {
            const timeInfo = formatTimestamp(item.timestamp);
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-xl border transition-all ${
                  item.undone
                    ? 'border-[var(--border-color)] bg-[var(--bg-surface)]/80 opacity-75'
                    : 'border-[#242424] bg-[var(--bg-elevated)] hover:border-[#383838] hover:bg-[var(--bg-secondary)]'
                } p-4 md:p-5`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {/* بيانات الخطوة والعنصر */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--text-primary)] font-sans">
                          {item.title}
                        </span>
                        <span aria-hidden="true" className="text-[#444444]">·</span>
                        <span className="text-[11px] font-mono text-[var(--accent-gold)]">
                          {getCategoryLabel(item.category)}
                        </span>
                        <span aria-hidden="true" className="text-[#444444]">·</span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          {timeInfo.full}
                        </span>

                        {item.undone && (
                          <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                            تم التراجع عنها
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-[var(--text-primary)] font-sans truncate">
                        "{item.itemTitle}"
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* إشارات التغيير المباشرة */}
                      {item.changes && item.changes.length > 0 && (
                        <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] text-[var(--text-muted)]">
                          {item.changes.map((c, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 border border-[#242424] font-mono"
                            >
                              {c.label}: <span className="text-emerald-400">{String(c.newValue)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* أزرار الإجراءات على الخطوة */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t border-[#1c1c1c] md:border-none w-full md:w-auto justify-end">
                    {/* زر فحص التفاصيل والمقارنة */}
                    <button
                      onClick={() => setSelectedActionDetails(item)}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[#202020] hover:border-[var(--border-color)] px-3 py-1.5 text-xs font-medium text-[#cccccc] hover:text-[var(--text-primary)] transition-colors"
                      title="عرض كامل التفاصيل قبل وبعد"
                    >
                      <Eye className="h-3.5 w-3.5 text-sky-400" />
                      <span>تفاصيل الخطوة</span>
                    </button>

                    {/* زر التراجع والاسترجاع لمكانه */}
                    {item.canUndo && !item.undone && (
                      <button
                        onClick={() => undoAction(item.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)]/15 hover:bg-[var(--accent-gold)] hover:text-black border border-[var(--accent-gold)]/30 px-3 py-1.5 text-xs font-bold text-[var(--accent-gold)] transition-all shadow-sm active:scale-95"
                        title="استرجاع العنصر إلى مكانه وإلغاء هذه الخطوة فوراً"
                      >
                        <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>استرجاع لمكانه</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
