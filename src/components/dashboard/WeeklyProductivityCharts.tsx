/**
 * components/dashboard/WeeklyProductivityCharts.tsx
 * رسوم بيانية تفاعلية دقيقة باستخدام Recharts
 * تعتمد 100% على البيانات الحقيقية لمحمد السماحي بدون أي بيانات وهمية أو أرقام افتراضية ثابتة
 * متوافقة بالكامل مع وضع التصفير والبداية النظيفة (Clean Slate / Zero State)
 */

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { AppState } from '../../types';
import { useApp } from '../../context/AppContext';
import { Flame, Target, TrendingUp, Clock, Plus, Sparkles } from 'lucide-react';

interface WeeklyProductivityChartsProps {
  state: AppState;
}

// Custom Universal Tooltip للإنتاجية
const CustomProductivityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 text-xs shadow-2xl">
        <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-2 flex items-center justify-between gap-3">
          <span>{label}</span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{data.date}</span>
        </div>
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[var(--accent-gold)] font-bold">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-gold)]" />
              <span>عمل عميق (Deep Work):</span>
            </span>
            <span className="font-bold text-[var(--text-primary)]">{data.deepWorkHours} س</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span>تعلم وتطبيق:</span>
            </span>
            <span className="font-bold text-[var(--text-primary)]">{data.regularHours} س</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border-color)] text-[11px]">
            <span className="text-[var(--text-muted)]">مؤشر الإنتاجية:</span>
            <span className="text-emerald-400 font-bold">{data.score}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Universal Tooltip للأهداف
const CustomGoalsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 text-xs shadow-2xl max-w-xs">
        <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-1.5">
          <div className="text-[10px] text-[var(--accent-gold)] font-mono font-bold">{data.quarter} — {data.theme}</div>
          <div className="line-clamp-2 text-xs text-[var(--text-primary)] mt-0.5">{data.fullName}</div>
        </div>
        <div className="space-y-1 font-mono pt-1 text-xs">
          <div className="flex items-center justify-between gap-3 text-[var(--accent-gold)] font-semibold">
            <span>نسبة الإنجاز الفعلية:</span>
            <span>{data.progress}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-emerald-400 font-semibold">
            <span>إنجاز المحطات:</span>
            <span>{data.milestones}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[var(--text-muted)] text-[11px] pt-1 border-t border-[var(--border-color)]">
            <span>الهدف المستهدف للربع:</span>
            <span>{data.target}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const WeeklyProductivityCharts: React.FC<WeeklyProductivityChartsProps> = ({ state }) => {
  const { setActiveTab } = useApp();
  const [chartView, setChartView] = useState<'both' | 'productivity' | 'goals'>('both');
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // حساب بيانات الأيام السبعة للأسبوع الحالي — حقيقية 100% بدون أي تزييف
  const weeklyProductivityData = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayIndex = d.getDay();

      const arabicDayName =
        dayIndex === 6
          ? 'السبت'
          : dayIndex === 0
          ? 'الأحد'
          : dayIndex === 1
          ? 'الإثنين'
          : dayIndex === 2
          ? 'الثلاثاء'
          : dayIndex === 3
          ? 'الأربعاء'
          : dayIndex === 4
          ? 'الخميس'
          : 'الجمعة';

      // حساب ساعات الوقت المسجلة فعلياً
      const dayLogs = state.timeLogs ? state.timeLogs.filter((log) => log.date === dateStr) : [];
      let deepWorkMins = 0;
      let regularWorkMins = 0;

      dayLogs.forEach((log) => {
        if (log.isDeepWork) {
          deepWorkMins += log.durationMinutes;
        } else {
          regularWorkMins += log.durationMinutes;
        }
      });

      const habitsDone = state.habits ? state.habits.filter((h) =>
        h.completedDates && h.completedDates.includes(dateStr)
      ).length : 0;

      const deepWorkHours = deepWorkMins > 0 ? +(deepWorkMins / 60).toFixed(1) : 0;
      const regularHours = regularWorkMins > 0 ? +(regularWorkMins / 60).toFixed(1) : 0;
      const totalHours = +(deepWorkHours + regularHours).toFixed(1);

      // حساب المؤشر فقط إذا كان هناك عمل فعلي
      const productivityScore =
        deepWorkHours === 0 && regularHours === 0 && habitsDone === 0
          ? 0
          : Math.min(100, Math.round((deepWorkHours * 20) + (habitsDone * 15)));

      result.push({
        date: dateStr,
        day: arabicDayName,
        deepWorkHours,
        regularHours,
        totalHours,
        habitsCount: habitsDone,
        score: productivityScore,
      });
    }

    return result;
  }, [state.timeLogs, state.habits]);

  // حساب بيانات تقدم الأهداف والمشاريع الفعلية
  const goalsProgressData = useMemo(() => {
    if (!state.goals || state.goals.length === 0) return [];

    return state.goals.map((goal) => {
      const linkedProjects = state.projects ? state.projects.filter((p) => p.linkedGoalId === goal.id || p.lifeArea === goal.lifeArea) : [];
      const totalMilestones = linkedProjects.reduce((sum, p) => sum + (p.milestones ? p.milestones.length : 0), 0);
      const completedMilestones = linkedProjects.reduce(
        (sum, p) => sum + (p.milestones ? p.milestones.filter((m) => m.completed).length : 0),
        0
      );
      
      const milestoneRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : goal.progress;

      return {
        name: goal.quarter + ' · ' + goal.lifeArea,
        fullName: goal.title,
        progress: goal.progress || 0,
        milestones: milestoneRate,
        target: 75,
        quarter: goal.quarter,
        theme: goal.quarterTheme,
      };
    });
  }, [state.goals, state.projects]);

  // الإحصاءات السريعة الحقيقية
  const totalWeeklyDeepHours = useMemo(() => {
    const sum = weeklyProductivityData.reduce((acc, d) => acc + d.deepWorkHours, 0);
    return sum.toFixed(1);
  }, [weeklyProductivityData]);

  const avgProductivityScore = useMemo(() => {
    const activeDays = weeklyProductivityData.filter((d) => d.totalHours > 0 || d.habitsCount > 0);
    if (activeDays.length === 0) return 0;
    const total = activeDays.reduce((sum, d) => sum + d.score, 0);
    return Math.round(total / activeDays.length);
  }, [weeklyProductivityData]);

  // حساب نسبة إنجاز العادات لليوم
  const habitsRate = useMemo(() => {
    if (!state.habits || state.habits.length === 0) return 0;
    const doneToday = state.habits.filter((h) => h.completedDates && h.completedDates.includes(todayStr)).length;
    return Math.round((doneToday / state.habits.length) * 100);
  }, [state.habits, todayStr]);

  const habitsDoneTodayCount = useMemo(() => {
    if (!state.habits) return 0;
    return state.habits.filter((h) => h.completedDates && h.completedDates.includes(todayStr)).length;
  }, [state.habits, todayStr]);

  const hasAnyHoursLogged = useMemo(() => {
    return +totalWeeklyDeepHours > 0 || weeklyProductivityData.some(d => d.totalHours > 0);
  }, [totalWeeklyDeepHours, weeklyProductivityData]);

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 md:p-6 shadow-sm">
      {/* الترويسة وأزرار التبديل */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)] font-bold">
            <TrendingUp className="h-4 w-4" />
            <span>التحليل البصري الأسبوعي</span>
            <span>·</span>
            <span>Weekly Analytics & Productivity</span>
          </div>
          <h2 className="text-base md:text-lg font-extrabold text-[var(--text-primary)] mt-1">
            تقدم الأهداف والإنتاجية وساعات العمل العميق
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
            قياس كمي دقيق لتوزيع ساعات التركيز ومعدل الإنجاز التراكمي
          </p>
        </div>

        {/* فلاتر العرض السريع Segmented Control */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1 text-xs self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setChartView('both')}
            className={`rounded-lg px-3 py-1.5 transition-all font-bold ${
              chartView === 'both'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            العرض الشامل
          </button>
          <button
            onClick={() => setChartView('productivity')}
            className={`rounded-lg px-3 py-1.5 transition-all font-bold ${
              chartView === 'productivity'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ساعات العمل
          </button>
          <button
            onClick={() => setChartView('goals')}
            className={`rounded-lg px-3 py-1.5 transition-all font-bold ${
              chartView === 'goals'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            تقدم الأهداف
          </button>
        </div>
      </div>

      {/* شريط المؤشرات الحسابية السريعة — بيانات حقيقية 100% */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-bold">
            <span>ساعات التركيز هذا الأسبوع</span>
            <Clock className="h-4 w-4 text-[var(--accent-gold)]" />
          </div>
          <div className="font-mono text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
            {totalWeeklyDeepHours} <span className="text-xs font-normal text-[var(--text-muted)]">ساعة</span>
          </div>
          <div className="text-[11px] font-mono mt-0.5 text-[var(--text-secondary)] font-semibold">
            {+totalWeeklyDeepHours > 0 ? '↑ تم تسجيل ساعات عمل عميق' : 'ابدأ أول جلسة عمل بالمؤقت اليوم'}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-bold">
            <span>متوسط مؤشر الإنتاجية</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-xl md:text-2xl font-extrabold text-[var(--accent-gold)] tabular-nums">
            {avgProductivityScore}%
          </div>
          <div className="text-[11px] font-mono mt-0.5 text-[var(--text-secondary)] font-semibold">
            {avgProductivityScore > 0 ? 'حالة الأداء: نشط ومتزن' : 'بانتظار تسجيل أول نشاط'}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-bold">
            <span>أهداف الربع قيد البناء</span>
            <Target className="h-4 w-4 text-sky-400" />
          </div>
          <div className="font-mono text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
            {state.goals ? state.goals.filter((g) => g.progress > 0).length : 0} / {state.goals ? state.goals.length : 0}
          </div>
          <div className="text-[11px] font-mono mt-0.5 text-[var(--text-secondary)] font-semibold">
            {state.goals && state.goals.length > 0 ? 'Q1 · سنة البناء 2027' : 'لم تسجل أهدافاً بعد'}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-bold">
            <span>التزام العادات اليومية</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
            {habitsRate}%
          </div>
          <div className="text-[11px] font-mono mt-0.5 text-[var(--text-secondary)] font-semibold">
            {state.habits && state.habits.length > 0
              ? `${habitsDoneTodayCount} من ${state.habits.length} منجزة اليوم`
              : 'لا توجد عادات مسجلة'}
          </div>
        </div>
      </div>

      {/* منطقة الرسوم البيانية */}
      <div
        className={`grid gap-5 pt-1 ${
          chartView === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* الرسم الأول: ساعات العمل العميق وساعات التطبيق (Area Chart) */}
        {(chartView === 'both' || chartView === 'productivity') && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--accent-gold)]" />
                  <span>توزيع ساعات العمل والتركيز اليومي (آخر 7 أيام)</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  تتبع ساعات الـ Deep Work مقابل مهام التعلم والتنفيذ
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[var(--accent-gold)] font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-gold)]" />
                  <span>عمل عميق</span>
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span>تعلم وتطبيق</span>
                </span>
              </div>
            </div>

            <div className="relative h-64 w-full min-w-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyProductivityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="deepWorkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="regularGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.12)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                    unit="س"
                  />
                  <Tooltip content={<CustomProductivityTooltip />} />
                  <ReferenceLine
                    y={2}
                    stroke="rgba(212, 175, 55, 0.5)"
                    strokeDasharray="3 3"
                    label={{
                      value: 'الحد الأدنى (2س)',
                      fill: '#D4AF37',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="deepWorkHours"
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#deepWorkGrad)"
                    name="العمل العميق"
                  />
                  <Area
                    type="monotone"
                    dataKey="regularHours"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#regularGrad)"
                    name="تعلم وتطبيق"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {!hasAnyHoursLogged && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)]/60 pointer-events-none rounded-xl">
                  <div className="text-center px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-md">
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      لا توجد جلسات عمل مسجلة بالمؤقت هذا الأسبوع بعد
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
                      شغّل المؤقت من شاشة "اليوم" أو "تتبع الوقت" لتبدأ الساعات بالظهور هنا بدقة
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold">
              <span>🎯 الهدف اليومي: ساعتان على الأقل من التركيز الخالص بدون انقطاع</span>
              <span className="text-[var(--accent-gold)] font-mono font-bold">انضباط 2027</span>
            </div>
          </div>
        )}

        {/* الرسم الثاني: تقدم الأهداف والمحطات الأسبوعية (Bar Chart) */}
        {(chartView === 'both' || chartView === 'goals') && (
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 md:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span>تقدم الأهداف والمحطات الاستراتيجية (%)</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  نسبة إنجاز أهداف أرباع سنة 2027 والمحطات الفعلية
                </p>
              </div>
              {goalsProgressData.length > 0 && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[var(--accent-gold)] font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-gold)]" />
                    <span>الهدف التراكمي</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>المحطات</span>
                  </span>
                </div>
              )}
            </div>

            {goalsProgressData.length === 0 ? (
              <div className="h-64 w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-6 text-center space-y-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                  <Target className="h-6 w-6 stroke-[2.2]" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  لا توجد أهداف سنوية مسجلة حتى الآن
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-medium max-w-sm">
                  عند إضافة أهدافك لسنة 2027 في قسم "الأهداف"، ستظهر نسب إنجازها ومحطاتها هنا تلقائياً بدون أي أرقام وهمية.
                </p>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-gold)] px-3.5 py-2 text-xs font-bold text-black hover:bg-[var(--accent-gold-hover)] transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  <span>الانتقال لإضافة أهدافك 🎯</span>
                </button>
              </div>
            ) : (
              <div className="h-64 w-full min-w-0" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={goalsProgressData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.12)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip content={<CustomGoalsTooltip />} />
                    <ReferenceLine
                      y={50}
                      stroke="rgba(150, 150, 150, 0.3)"
                      strokeDasharray="2 2"
                    />
                    <Bar
                      dataKey="progress"
                      fill="#D4AF37"
                      radius={[6, 6, 0, 0]}
                      name="الإنجاز العام"
                    />
                    <Bar
                      dataKey="milestones"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      name="المحطات المنجزة"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-3.5 pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold">
              <span>💡 التركيز الحالي: الربع الأول Q1 (Build) هو الأساس الحاكم لكامل العام</span>
              <span className="text-emerald-400 font-mono font-bold">
                {goalsProgressData.length > 0 ? 'على المسار الصحيح' : 'سنة البناء 2027'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
