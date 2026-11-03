/**
 * components/dashboard/DashboardView.tsx
 * لوحة القيادة التنفيذية بمستوى عالمي لمحمد السماحي (SAMAHY OS — 2027)
 * تصميم هجين يجمع بين راحة وضع النهار (DealDeck) وفخامة وعمق وضع الليل (Stovest & TradeVision)
 * يحافظ على صفاء الذهن، مكافحة التشتت، والتركيز على الإنجاز الفعلي
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Flame,
  Plus,
  Edit3,
  ChevronLeft,
  Sparkles,
  Target,
  FolderGit2,
  Wallet,
  Calendar,
  Layers,
  ArrowUpRight,
  Shield,
  Zap,
} from 'lucide-react';
import { WeeklyProductivityCharts } from './WeeklyProductivityCharts';
import { DailyProductivityAudit } from './DailyProductivityAudit';
import { NeuralBrainHub } from './NeuralBrainHub';

export const DashboardView: React.FC = () => {
  const {
    todayFocusTasks,
    toggleTaskStatus,
    setTaskTodayFocus,
    moveTaskToParkingLot,
    dailyScoreBreakdown,
    activeProjects,
    state,
    setActiveTab,
    setIsQuickTaskModalOpen,
    distractionAlert,
    dismissDistractionAlert,
    setEditingTask,
    financialSummary,
  } = useApp();

  // Dynamic Arabic Date
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

  // Goals & Projects stats
  const totalGoals = state.goals.length;
  const avgGoalProgress =
    totalGoals > 0
      ? Math.round(state.goals.reduce((acc, curr) => acc + curr.progress, 0) / totalGoals)
      : 0;

  // Time metrics
  const totalFocusMinutesThisWeek = useMemo(() => {
    return state.timeLogs
      .filter((l) => l.isDeepWork)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [state.timeLogs]);

  const focusHoursThisWeek = (totalFocusMinutesThisWeek / 60).toFixed(1);

  // Latest weekly review highlights for Weekly Focus Card
  const latestWeeklyReview = state.weeklyReviews[state.weeklyReviews.length - 1];

  // Income stream highlights
  const topExperiment = state.incomeExperiments[0];

  // Completed focus count
  const completedFocusCount = todayFocusTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-20">
      {/* تحذير مكافحة التشتت (إن وجد) */}
      {distractionAlert && (
        <div className="flex items-start justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 animate-in fade-in shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="leading-relaxed">{distractionAlert}</p>
          </div>
          <button
            onClick={dismissDistractionAlert}
            className="text-amber-300 hover:text-white mr-2 underline text-xs whitespace-nowrap"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* 1. Header — World-Class Clean Typography with Ambient Glow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              أهلاً يا محمد
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-gold)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-gold)] border border-[var(--accent-gold)]/25">
              <Sparkles className="h-3 w-3" />
              2027 · سنة البناء
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] font-medium">
            كل يوم خطوة. كل خطوة تبني المستقبل.
          </p>

          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-0.5 font-mono">
            <Calendar className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
            <span>{formattedArabicDate}</span>
            <span>·</span>
            <span>الربع الأول Q1: التأسيس والبناء</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/50 hover:bg-[var(--accent-gold)]/10 transition-all shadow-sm"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>المساعد الذكي</span>
          </button>

          <button
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 hover:text-[var(--accent-gold)] transition-colors shadow-sm"
          >
            <span>خطة اليوم المباشرة</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsQuickTaskModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--accent-gold)] px-4 py-2.5 text-xs font-bold text-black transition-all hover:opacity-95 active:scale-95 shadow-lg shadow-[var(--accent-gold)]/15"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* العقل التنفيذي الموحد (Neural Executive Brain Hub) */}
      <NeuralBrainHub />

      {/* 2. Main Focus Area — Today's Focus (Top 3 Priority Tasks Only) */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-4 shadow-lg shadow-black/5 relative overflow-hidden">
        {/* Subtle background highlight for visual comfort */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-mono font-bold shadow-inner">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                  Today's Focus — تركيز اليوم
                </h2>
                <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                  أهم 3 نتائج
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                الأولويات الاستراتيجية الثلاث المحركة لليوم — ابدأ بالأثقل أولاً دون تشتت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-[var(--accent-gold)] font-bold bg-[var(--accent-gold)]/10 px-2.5 py-1 rounded-lg border border-[var(--accent-gold)]/20">
              {completedFocusCount} من {todayFocusTasks.length || 3} أنجزت
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
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
                  <span className="text-[11px] text-[var(--text-muted)]">اضغط للتعيين من مهامك</span>
                </button>
              );
            }

            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-sm ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--accent-gold)]/40 hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-xs text-[var(--accent-gold)] font-bold tracking-wide">
                      0{slotIndex + 1} · {task.lifeArea}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="تعديل المهمة"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveTaskToParkingLot(task.id)}
                        className="rounded-md px-1.5 py-0.5 text-[11px] text-[var(--text-muted)] hover:text-amber-400 hover:bg-[var(--bg-surface)] transition-colors"
                        title="نقل للـ Parking Lot لمنع التشتت"
                      >
                        نقل
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-sm md:text-[15px] font-bold leading-snug ${
                      isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-0.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--accent-gold)]" />
                    <span className="font-mono tabular-nums">{task.estimatedMinutes} دقيقة</span>
                    <span>·</span>
                    <span className={task.priority === 'strategic' ? 'text-[var(--accent-gold)] font-semibold' : ''}>
                      {task.priority === 'strategic'
                        ? 'أولوية استراتيجية قصوى'
                        : task.priority === 'high'
                        ? 'أولوية عالية'
                        : 'عادية'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isDone ? 'text-emerald-400' : 'text-[var(--text-secondary)] hover:text-emerald-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                    <span>{isDone ? 'تم الإنجاز بنجاح' : 'تعليم كمكتمل'}</span>
                  </button>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {isDone ? 'مكتملة ⚡' : 'قيد التنفيذ'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Progress Overview — Balanced Data Cards (Inspired by DealDeck & Stovest) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            نظرة عامة على التقدم (Progress Overview)
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            مؤشرات القيادة والنتائج الحية
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Month Goals */}
          <div
            onClick={() => setActiveTab('goals')}
            className="cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 md:p-5 space-y-2 hover:border-[var(--accent-gold)]/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">أهداف الربع Q1</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
              {avgGoalProgress}%
            </div>
            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-gold)] rounded-full transition-all duration-500"
                style={{ width: `${avgGoalProgress}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span>{totalGoals} أهداف معتمدة</span>
              <span className="text-[var(--accent-gold)]">BUILD</span>
            </div>
          </div>

          {/* Active Projects */}
          <div
            onClick={() => setActiveTab('projects')}
            className="cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 md:p-5 space-y-2 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">المشاريع النشطة</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FolderGit2 className="h-4 w-4" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
              {activeProjects.length} <span className="text-sm font-normal text-[var(--text-muted)]">/ 3</span>
            </div>
            {/* Active dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < activeProjects.length ? 'bg-blue-500' : 'bg-[var(--bg-elevated)]'
                  }`}
                />
              ))}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              انضباط التركيز لحماية طاقتك
            </div>
          </div>

          {/* Focus Hours */}
          <div
            onClick={() => setActiveTab('time')}
            className="cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 md:p-5 space-y-2 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">ساعات التركيز</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-extrabold text-[var(--accent-gold)] tabular-nums">
              {focusHoursThisWeek} <span className="text-xs font-normal text-[var(--text-muted)]">ساعة</span>
            </div>
            {/* Progress gauge */}
            <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (Number(focusHoursThisWeek) / 20) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              عمل عميق خلال هذا الأسبوع
            </div>
          </div>

          {/* Execution Rate */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 md:p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">معدل الإنجاز</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tabular-nums">
              {dailyScoreBreakdown.score}%
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${dailyScoreBreakdown.score}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] truncate">
              {dailyScoreBreakdown.verdict}
            </div>
          </div>

          {/* Income Stream Progress */}
          <div
            onClick={() => setActiveTab('business')}
            className="col-span-2 md:col-span-1 cursor-pointer rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 md:p-5 space-y-2 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-medium">معمل الدخل</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {financialSummary.businessIncome.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">ج</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] truncate">
              {topExperiment ? topExperiment.name : 'تجارب أول عميل'}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Weekly Focus Summary Card */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                Weekly Focus — ملخص الأسبوع الاستراتيجي
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                مراجعة الأداء الأسبوعي وتثبيت البوصلة
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('review')}
            className="flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline font-semibold"
          >
            <span>جلسة المراجعة الكاملة</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs">
          {/* Planned vs Actual Time */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-2">
            <div className="text-[11px] text-[var(--text-muted)] font-semibold">الوقت المخطط مقابل الفعلي</div>
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-xl font-extrabold text-[var(--accent-gold)]">
                {focusHoursThisWeek} س
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">فعلي / 20 س هدف</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[var(--accent-gold)] rounded-full"
                style={{ width: `${Math.min(100, (Number(focusHoursThisWeek) / 20) * 100)}%` }}
              />
            </div>
          </div>

          {/* Top Achievement */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>أهم إنجاز تحقق</span>
            </div>
            <p className="text-[var(--text-primary)] font-medium leading-relaxed line-clamp-3">
              {latestWeeklyReview?.q1_biggestAchievement ||
                'تثبيت هيكل نظام التشغيل الشخصي، وانضباط جلسة الفجر البرمجية (90 دقيقة).'}
            </p>
          </div>

          {/* Biggest Problem / Time Waster */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>أكبر عائق / وقت ضائع</span>
            </div>
            <p className="text-amber-200/90 font-medium leading-relaxed line-clamp-3">
              {latestWeeklyReview?.q4_biggestTimeWaster ||
                'التردد في إرسال عروض الخدمات للمتاجر والبحث عن الكمال الزائد قبل الإطلاق.'}
            </p>
          </div>

          {/* Next Strategic Step */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>الخطوة القادمة المحسومة</span>
            </div>
            <p className="text-blue-200/90 font-medium leading-relaxed line-clamp-3">
              {latestWeeklyReview?.q8_nextWeekTop3?.split('\n')[0] ||
                'التواصل المباشر مع 10 عملاء محتملين لخدمة صفحات الهبوط خلال 48 ساعة.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Recharts Productivity Charts */}
      <WeeklyProductivityCharts state={state} />

      {/* 6. Daily Productivity Audit (Gemini API + Manual Sovereign Control) */}
      <DailyProductivityAudit />
    </div>
  );
};
