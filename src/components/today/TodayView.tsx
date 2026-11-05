/**
 * components/today/TodayView.tsx
 * شاشة تنفيذ اليوم (Today's Execution Hub)
 * بمستوى منتجات SaaS العالمية (Linear / Apple)
 * تقسيم واضح ومريح: Morning Focus · Schedule · Quick Capture · Daily Review
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Edit3,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  Target,
  Compass,
  ExternalLink,
  Moon,
  Bot,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    state,
    todayFocusTasks,
    toggleTaskStatus,
    setTaskTodayFocus,
    moveTaskToParkingLot,
    toggleTimeBlock,
    setIsQuickTaskModalOpen,
    dailyScoreBreakdown,
    setEditingTask,
    addTask,
    addIdea,
    saveDailyReport,
  } = useApp();

  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [quickInput, setQuickInput] = useState('');
  const [quickMode, setQuickMode] = useState<'task' | 'idea'>('task');
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);

  // Daily review inline states
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const existingReport = state.dailyReports?.find((r) => r.date === todayStr);
  const [strengths, setStrengths] = useState(existingReport?.userStrengths || '');
  const [improvements, setImprovements] = useState(existingReport?.userImprovements || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(existingReport?.userTomorrowFocus || '');
  const [rating, setRating] = useState(existingReport?.overallRating || 8);
  const [reviewSavedMessage, setReviewSavedMessage] = useState(false);

  const filteredTasks = state.tasks.filter((task) => {
    if (filterArea !== 'all' && task.lifeArea !== filterArea) return false;
    if (filterStatus === 'pending' && task.status === 'completed') return false;
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    return true;
  });

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    if (quickMode === 'task') {
      addTask({
        title: quickInput.trim(),
        lifeArea: 'البرمجة',
        estimatedMinutes: 30,
        priority: 'high',
        status: 'todo',
        isTodayFocus: todayFocusTasks.length < 3,
      });
    } else {
      addIdea({
        title: quickInput.trim(),
        problem: 'فكرة ملتقطة سريعاً لمنع تشتت اليوم',
        targetAudience: 'المستخدم',
        requiredSkill: 'تطوير',
        notes: 'التقاط فوري أثناء يوم العمل',
      });
    }

    setQuickInput('');
  };

  const handleSaveReview = () => {
    saveDailyReport({
      date: todayStr,
      userStrengths: strengths || 'الالتزام بمهام التركيز والعمل العميق.',
      userImprovements: improvements || 'سرعة حسم التواصل مع العملاء وتقليل التردد.',
      userTomorrowFocus: tomorrowFocus || 'البدء بالمهمة الأكثر استراتيجية في أول الصباح.',
      overallRating: rating,
      isManualOverride: true,
    });
    setReviewSavedMessage(true);
    setTimeout(() => setReviewSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Daily Principle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>التنفيذ اليومي</span>
            <span>·</span>
            <span>Today's Focus</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            يوم البناء والتركيز
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "لا تجمع أهدافاً كثيرة. 3 نتائج استراتيجية فقط تصنع فارق المستقبل."
          </p>
        </div>

        {/* Daily Score Pill-free Meter */}
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2.5 self-start sm:self-auto shadow-sm">
          <div className="text-right">
            <div className="text-xs text-[var(--text-secondary)] font-bold">مؤشر الإنجاز اليومي</div>
            <div className="text-sm font-extrabold text-[var(--text-primary)]">
              {dailyScoreBreakdown.verdict}
            </div>
          </div>
          <div className="font-mono text-xl font-extrabold text-[var(--accent-gold)] tabular-nums border-r border-[var(--border-color)] pr-3 mr-1">
            {dailyScoreBreakdown.score}%
          </div>
        </div>
      </div>

      {/* 2. Quick Capture Bar */}
      <form
        onSubmit={handleQuickCapture}
        className="relative flex items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 focus-within:border-[var(--accent-gold)]/60 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-1 px-2 border-l border-[var(--border-color)] ml-2 text-xs">
          <button
            type="button"
            onClick={() => setQuickMode('task')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              quickMode === 'task'
                ? 'bg-[var(--accent-gold)] text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            مهمة
          </button>
          <button
            type="button"
            onClick={() => setQuickMode('idea')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              quickMode === 'idea'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            فكرة
          </button>
        </div>

        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder={
            quickMode === 'task'
              ? 'التقاط مهمة سريعة لليوم (اضغط Enter للإضافة)...'
              : 'التقاط فكرة خاطفة لحفظها في الـ Parking Lot...'
          }
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />

        <button
          type="button"
          onClick={() => setIsQuickTaskModalOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 px-3 text-xs font-semibold text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-all shrink-0"
          title="تحضير مهمة ليلية مع رابط وخطة تنفيذ"
        >
          <Moon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">+ مهمة مع رابط 🌙</span>
        </button>

        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="flex h-8 items-center gap-1.5 rounded-xl bg-[var(--bg-elevated)] px-3.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--accent-gold)] hover:text-black transition-all disabled:opacity-40 disabled:hover:bg-[var(--bg-elevated)] disabled:hover:text-[var(--text-primary)]"
        >
          <span>تسجيل</span>
          <Send className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </form>

      {/* بطاقة المهمة النشطة المحضّرة لصباح اليوم مع رابطها المباشر */}
      {todayFocusTasks.find((t) => t.status !== 'completed' && t.resourceLink) && (() => {
        const missionTask = todayFocusTasks.find((t) => t.status !== 'completed' && t.resourceLink)!;
        return (
          <div className="rounded-2xl border-2 border-sky-500/50 bg-gradient-to-r from-sky-950/20 via-[var(--bg-surface)] to-[var(--bg-elevated)] p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="font-bold">المهمة النشطة المحضّرة لصباح اليوم (Active Morning Mission)</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                {missionTask.title}
              </h3>
              {missionTask.executionGuide && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  💡 <span className="font-semibold text-[var(--accent-gold)]">خطتك الصباحية:</span> {missionTask.executionGuide}
                </p>
              )}
            </div>

            <a
              href={missionTask.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black px-5 py-2.5 text-xs font-bold transition-all shadow-md shrink-0"
            >
              <span>🚀 افتح رابط التعلم وابدأ الآن</span>
              <ExternalLink className="h-4 w-4 stroke-[2.5]" />
            </a>
          </div>
        );
      })()}

      {/* 3. Morning Focus (Top 3 Priority Tasks) */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-mono font-bold shadow-inner">
              3
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                Morning Focus — أهم 3 نتائج لليوم
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                المهام الاستراتيجية المحركة لسنة البناء 2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-[var(--accent-gold)] font-bold bg-[var(--accent-gold)]/10 px-2.5 py-1 rounded-lg border border-[var(--accent-gold)]/20">
              {dailyScoreBreakdown.focusTasksRatio} أنجزت
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[0, 1, 2].map((slotIndex) => {
            const task = todayFocusTasks[slotIndex];

            if (!task) {
              return (
                <button
                  key={`empty-${slotIndex}`}
                  onClick={() => setIsQuickTaskModalOpen(true)}
                  className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-elevated)]/40 p-6 text-center text-xs text-[var(--text-muted)] hover:border-[var(--accent-gold)]/50 hover:bg-[var(--accent-gold)]/5 hover:text-[var(--accent-gold)] transition-all min-h-[150px]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] group-hover:border-[var(--accent-gold)]/40 transition-colors">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">تحديد نتيجة رئيسية #{slotIndex + 1}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    اضغط لتخصيص مهمة
                  </span>
                </button>
              );
            }

            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-sm ${
                  isDone
                    ? 'border-emerald-500/25 bg-emerald-950/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--accent-gold)]/40 hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[var(--accent-gold)] font-semibold">
                      0{slotIndex + 1} · {task.lifeArea}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 transition-colors"
                        title="تعديل المهمة"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveTaskToParkingLot(task.id)}
                        className="text-[10px] text-[var(--text-muted)] hover:text-amber-400 p-0.5"
                        title="نقل للـ Parking Lot"
                      >
                        نقل
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-sm md:text-base font-bold leading-normal ${
                      isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] pt-1.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="font-mono tabular-nums">{task.estimatedMinutes} دقيقة</span>
                    <span>·</span>
                    <span className={task.priority === 'strategic' ? 'text-[var(--accent-gold)]' : ''}>
                      {task.priority === 'strategic'
                        ? 'استراتيجية'
                        : task.priority === 'high'
                        ? 'أولوية عالية'
                        : 'عادية'}
                    </span>
                  </div>
                </div>

                
                  {/* دليل التنفيذ الصباحي ورابط التعلم */}
                  {(task.resourceLink || task.executionGuide) && (
                    <div className="mt-2.5 p-2.5 rounded-xl border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/5 space-y-1.5 text-xs">
                      {task.executionGuide && (
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          <span className="font-bold text-[var(--accent-gold)] block mb-0.5">💡 خطة التنفيذ المباشرة:</span>
                          {task.executionGuide}
                        </p>
                      )}
                      {task.resourceLink && (
                        <a
                          href={task.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 hover:text-sky-300 hover:underline pt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span>فتح رابط التعلم أو المهمة ↗</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* اقتراح الذكاء الاصطناعي للخطوة التالية إذا كانت منجزة */}
                  {isDone && (
                    <div className="mt-2.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-950 dark:text-sky-200 flex items-start gap-2.5 shadow-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-sky-950 dark:text-sky-100 block">
                          الخطوة الذكية التالية:
                        </span>
                        <p className="text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed font-medium">
                          {task.aiNextSuggestion || 'أحسنت يا محمد! سجّل الآن ما تعلمته في معمل التعلم، أو وثّق أي خطأ واجهك في سجل الأخطاء.'}
                        </p>
                      </div>
                    </div>
                  )}

                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isDone ? 'text-emerald-400' : 'text-[var(--text-secondary)] hover:text-emerald-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                    <span>{isDone ? 'تم الإنجاز' : 'تعليم كمكتمل'}</span>
                  </button>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isDone ? 'منجزة ⚡' : 'قيد التنفيذ'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Schedule & Timeline Blocks */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Schedule — جدول الكتل الزمنية
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            العمل العميق وحماية الطاقة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.timeBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                block.completed
                  ? 'border-[var(--border-color)] bg-[var(--bg-elevated)]/40 text-[var(--text-muted)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[var(--accent-gold)] font-extrabold">
                    {block.timeRange}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    · {block.category}
                  </span>
                </div>
                <div className={`text-sm font-bold ${block.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                  {block.title}
                </div>
              </div>

              <div className="mr-2">
                {block.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--accent-gold)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. All Day Tasks with Filters */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              كافة مهام اليوم والـ Backlog
            </h2>
            <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
              ({filteredTasks.length})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border-color)] text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-[var(--accent-gold)] text-black font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-[var(--accent-gold)] text-black font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                المتبقية
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-[var(--accent-gold)] text-black font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                المكتملة
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              لا توجد مهام مطابقة للفلتر. استخدم شريط الالتقاط بالأعلى لإضافة مهمة جديدة.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${
                    isDone
                      ? 'border-[var(--border-color)] bg-[var(--bg-elevated)]/30 opacity-70'
                      : 'border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--accent-gold)]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isDone ? 'text-emerald-400' : 'text-[var(--text-muted)] hover:text-[var(--accent-gold)]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>

                    <div className="space-y-0.5">
                      <div
                        className={`text-xs md:text-sm font-medium ${
                          isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span>{task.lifeArea}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{task.estimatedMinutes} دقيقة</span>
                        <span>·</span>
                        <span className={task.priority === 'strategic' ? 'text-[var(--accent-gold)]' : ''}>
                          {task.priority === 'strategic' ? 'استراتيجية' : task.priority === 'high' ? 'عالية' : 'عادية'}
                        </span>
                        {task.isTodayFocus && (
                          <>
                            <span>·</span>
                            <span className="text-[var(--accent-gold)] font-medium">ضمن أهم 3 مهام</span>
                          </>
                        )}
                      {/* روابط وإرشادات التعلم المباشرة */}
                      {(task.resourceLink || task.executionGuide) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {task.resourceLink && (
                            <a
                              href={task.resourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>فتح الرابط ↗</span>
                            </a>
                          )}
                          {task.executionGuide && (
                            <span className="text-[11px] text-[var(--accent-gold)]">
                              💡 {task.executionGuide}
                            </span>
                          )}
                        </div>
                      )}

                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center text-xs">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="تعديل المهمة"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {!task.isTodayFocus && !isDone && (
                      <button
                        onClick={() => setTaskTodayFocus(task.id, true)}
                        className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-[11px] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] transition-colors"
                      >
                        تركيز اليوم (Top 3)
                      </button>
                    )}

                    <button
                      onClick={() => moveTaskToParkingLot(task.id)}
                      className="text-[11px] text-[var(--text-muted)] hover:text-amber-400 px-2 py-1"
                      title="استبعاد إلى الـ Parking Lot"
                    >
                      Parking Lot
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 6. Daily Review (Progressive Disclosure) */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
        <button
          onClick={() => setIsDailyReviewOpen(!isDailyReviewOpen)}
          className="w-full flex items-center justify-between p-4 text-right hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-[var(--accent-gold)]" />
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Daily Review — المراجعة المسائية لليوم
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                تقييم ذاتي سريع قبل إنهاء اليوم وإغلاق الشاشات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--accent-gold)]">
              {existingReport ? 'تم تسجيل مراجعة اليوم' : 'غير مسجل'}
            </span>
            {isDailyReviewOpen ? (
              <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
            )}
          </div>
        </button>

        {isDailyReviewOpen && (
          <div className="p-5 border-t border-[var(--border-color)] space-y-4 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[var(--text-primary)] font-medium">
                  أهم ما أنجزته اليوم بنجاح:
                </label>
                <textarea
                  rows={3}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="مثال: التزمت بكتلة الفجر البرمجية وأنهيت تصميم واجهة Today بالكامل..."
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-primary)] font-medium">
                  أكبر نقطة تحتاج تحسين أو مشتت ظهر اليوم:
                </label>
                <textarea
                  rows={3}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="مثال: استغرقت وقتاً طويلاً في تعديل الألوان قبل كتابة الكود الفعلي..."
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-primary)] font-medium">
                  أول خطوة ستبدأ بها صباح الغد:
                </label>
                <textarea
                  rows={3}
                  value={tomorrowFocus}
                  onChange={(e) => setTomorrowFocus(e.target.value)}
                  placeholder="مثال: كتلة 90 دقيقة مخصصة لاختبار الدخل والتواصل مع أول متجرين..."
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-muted)]">تقييمي العام لليوم (1-10):</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="accent-[var(--accent-gold)] w-28"
                />
                <span className="font-mono text-sm font-bold text-[var(--accent-gold)] tabular-nums">
                  {rating}/10
                </span>
              </div>

              <div className="flex items-center gap-3">
                {reviewSavedMessage && (
                  <span className="text-emerald-400 text-xs animate-in fade-in">
                    ✓ تم حفظ المراجعة وتوثيقها في المنبع!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:opacity-90 transition-opacity"
                >
                  حفظ المراجعة اليومية
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
