/**
 * components/dashboard/NeuralBrainHub.tsx
 * العقل التنفيذي الرابط لنظام "السماحي OS"
 * مستوحى من أمهات كتب الإنتاجية والقيادة الاستراتيجية:
 * - Atomic Habits (James Clear)
 * - Deep Work (Cal Newport)
 * - Principles (Ray Dalio)
 * - The 7 Habits of Highly Effective People (Stephen Covey)
 * - The 12 Week Year (Brian Moran)
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Flame,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  BookOpen
} from 'lucide-react';

export const NeuralBrainHub: React.FC = () => {
  const { state, todayFocusTasks, setActiveTab } = useApp();

  // 1. حساب مؤشر التناغم الإدراكي (Cognitive Alignment Score)
  const stats = useMemo(() => {
    // نسبة إنجاز مهام التركيز (Cal Newport: Deep Work Focus)
    const completedFocus = todayFocusTasks.filter(t => t.status === 'completed').length;
    const focusRatio = todayFocusTasks.length > 0 ? (completedFocus / todayFocusTasks.length) * 100 : 0;

    // نسبة الالتزام بالعادات (James Clear: Atomic Habit Identity)
    const todayStr = new Date().toISOString().split('T')[0];
    const totalHabits = state.habits.length;
    const habitsDone = state.habits.filter(h => h.completedDates.includes(todayStr)).length;
    const habitsRatio = totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0;

    // ترابط المشاريع بالأهداف (Stephen Covey: First Things First & Quadrant II)
    const totalProjects = state.projects.length;
    const alignedProjects = state.projects.filter(p => p.linkedGoalId).length;
    const alignmentRatio = totalProjects > 0 ? (alignedProjects / totalProjects) * 100 : 0;

    // ساعات العمل العميق المسجلة (Cal Newport Metric)
    const deepWorkMinutes = state.timeLogs
      .filter(l => l.isDeepWork)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const deepWorkHours = (deepWorkMinutes / 60).toFixed(1);

    // المعدل العام لقوة النظام
    const systemScore = Math.round((focusRatio * 0.4) + (habitsRatio * 0.3) + (alignmentRatio * 0.3));

    // استخلاص النصيحة الإدراكية من المبادئ العلمية
    let insightTitle = 'مبدأ البداية النظيفة (First Principles)';
    let insightText = 'النظام جاهز ونظيف تماماً يا محمد. ابدأ الآن بتسجيل أول هدف أو تنفيذ أول عادة لبناء الزخم.';
    let bookRef = 'دستور السماحي OS';

    if (habitsDone === 0 && totalHabits > 0) {
      insightTitle = 'مبدأ بناء الهوية اليومية (James Clear)';
      insightText = 'أنت لا ترتقي لمستوى أهدافك، بل تهبط لمستوى أنظمتك وعاداتك اليومية الصغرى.';
      bookRef = 'كتاب Atomic Habits';
    } else if (todayFocusTasks.length === 0) {
      insightTitle = 'مصفوفة الأهمية الاستراتيجية (Stephen Covey)';
      insightText = 'حدد فوراً مهام الربع الثاني الهامة غير العاجلة قبل أن يبتلع الروتين طاقتك.';
      bookRef = 'كتاب العادات السبع';
    } else if (alignedProjects < totalProjects) {
      insightTitle = 'مبدأ الواقعية والتحكّم (Ray Dalio)';
      insightText = 'كل مشروع لا يخدم هدفاً سنوياً صريحاً هو تسريب لطاقتك ووقتك التنفيذي.';
      bookRef = 'كتاب Principles';
    }

    return {
      focusRatio: Math.round(focusRatio),
      completedFocus,
      totalFocus: todayFocusTasks.length,
      habitsDone,
      totalHabits,
      habitsRatio: Math.round(habitsRatio),
      alignedProjects,
      totalProjects,
      alignmentRatio: Math.round(alignmentRatio),
      deepWorkHours,
      systemScore,
      insightTitle,
      insightText,
      bookRef,
    };
  }, [state, todayFocusTasks]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-lg transition-all duration-300">
      {/* توهج ضوئي خفيف مستوحى من الذكاء الاصطناعي */}
      <div className="absolute top-0 right-1/4 -mt-12 h-32 w-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 -mt-12 h-32 w-72 rounded-full bg-[var(--accent-gold)]/10 blur-3xl pointer-events-none" />

      {/* الرأس: هوية العقل الإدراكي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 via-[var(--bg-elevated)] to-[var(--accent-gold)]/20 border border-sky-400/30 text-sky-400 shadow-sm">
            <Brain className="h-6 w-6 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[var(--bg-surface)]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                العقل التنفيذي الموحد (Neural Executive Brain)
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono text-sky-400 border border-sky-500/20">
                <Sparkles className="h-2.5 w-2.5" />
                AI Synced
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              ربط استراتيجي بين الأهداف السنوية، كتل العمل العميق، والعادات اليومية
            </p>
          </div>
        </div>

        {/* مؤشر صحة وتناغم النظام الكلي */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-[var(--bg-elevated)] px-3.5 py-1.5 rounded-xl border border-[var(--border-color)]">
          <Activity className="h-4 w-4 text-[var(--accent-gold)]" />
          <div className="text-right">
            <span className="text-[10px] text-[var(--text-muted)] block font-mono">مؤشر التناغم الإدراكي</span>
            <span className="text-sm font-extrabold text-[var(--accent-gold)] font-mono">
              {stats.systemScore}%
            </span>
          </div>
        </div>
      </div>

      {/* الروابط الأربعة الكبرى للعقل البشري (Grid of Cognitive Connectors) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* الرابط 1: التركيز اليومي */}
        <div
          onClick={() => setActiveTab('today')}
          className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 hover:border-[var(--accent-gold)]/40 hover:bg-[var(--accent-gold)]/5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Target className="h-3.5 w-3.5 text-rose-400" />
              التركيز اليومي
            </span>
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-gold)]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.completedFocus}/{stats.totalFocus}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">مهام منجزة</span>
          </div>
          <div className="mt-2 h-1 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 transition-all duration-500"
              style={{ width: `${stats.focusRatio}%` }}
            />
          </div>
        </div>

        {/* الرابط 2: العمل العميق */}
        <div
          onClick={() => setActiveTab('time')}
          className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 hover:border-sky-400/40 hover:bg-sky-400/5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-sky-400" />
              العمل العميق
            </span>
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.deepWorkHours}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">ساعة استثمارية</span>
          </div>
          <div className="mt-2 text-[10px] text-sky-400/90 font-mono">
            Cal Newport Protocol
          </div>
        </div>

        {/* الرابط 3: العادات الذرية */}
        <div
          onClick={() => setActiveTab('habits')}
          className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              العادات الذرية
            </span>
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.habitsDone}/{stats.totalHabits}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">عادات اليوم</span>
          </div>
          <div className="mt-2 h-1 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${stats.habitsRatio}%` }}
            />
          </div>
        </div>

        {/* الرابط 4: مصفوفة الأهداف والمشاريع */}
        <div
          onClick={() => setActiveTab('projects')}
          className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 hover:border-emerald-400/40 hover:bg-emerald-400/5 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              ربط المشاريع
            </span>
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.alignedProjects}/{stats.totalProjects}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">مشروع مرتبط بهدف</span>
          </div>
          <div className="mt-2 h-1 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${stats.alignmentRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* الومضة المعرفية الاستراتيجية (Executive Wisdom Capsule) */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/5 p-3.5 text-xs text-[var(--text-primary)]">
        <BookOpen className="h-4 w-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--accent-gold)]">{stats.insightTitle}</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
              {stats.bookRef}
            </span>
          </div>
          <p className="mt-1 text-[var(--text-secondary)] leading-relaxed">
            {stats.insightText}
          </p>
        </div>
      </div>
    </div>
  );
};
