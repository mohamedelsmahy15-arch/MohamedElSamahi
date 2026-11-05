/**
 * components/dashboard/DailyPlannedVsActualChart.tsx
 * عرض مرئي لتلخيص توزيع ساعات العمل اليومي
 * مقارنة دقيقة بين الوقت المخطط له (Planned) مقابل الوقت الفعلي المستغرق (Actual)
 */

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AppState, LifeArea } from '../../types';
import { Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Layers, BarChart3, PieChart as PieIcon } from 'lucide-react';

interface DailyPlannedVsActualChartProps {
  state: AppState;
  activeTimerSeconds?: number;
}

export const DailyPlannedVsActualChart: React.FC<DailyPlannedVsActualChartProps> = ({
  state,
  activeTimerSeconds = 0,
}) => {
  const [viewMode, setViewMode] = useState<'categories' | 'tasks' | 'distribution'>('categories');
  const todayStr = new Date().toISOString().split('T')[0];

  // تصفية مهام اليوم (مهام التركيز أو المهام المضافة لليوم)
  const todayTasks = useMemo(() => {
    return state.tasks.filter((t) => t.isTodayFocus || t.createdAt.startsWith(todayStr));
  }, [state.tasks, todayStr]);

  // سجلات الوقت المنفذة لليوم
  const todayTimeLogs = useMemo(() => {
    return state.timeLogs.filter((log) => log.date === todayStr);
  }, [state.timeLogs, todayStr]);

  // حساب المقارنة حسب مجالات الحياة (Categories)
  const categoryComparisonData = useMemo(() => {
    const areaMap: {
      [area: string]: {
        area: string;
        plannedMinutes: number;
        actualMinutes: number;
        taskCount: number;
      };
    } = {};

    // تجميع الوقت المخطط من مهام اليوم
    todayTasks.forEach((task) => {
      const area = task.lifeArea;
      if (!areaMap[area]) {
        areaMap[area] = { area, plannedMinutes: 0, actualMinutes: 0, taskCount: 0 };
      }
      areaMap[area].plannedMinutes += task.estimatedMinutes || 0;
      areaMap[area].taskCount += 1;

      // إذا كانت المهمة تحتوي على actualMinutes مسجلة
      if (task.actualMinutes !== undefined) {
        areaMap[area].actualMinutes += task.actualMinutes;
      } else if (task.status === 'completed') {
        // افتراض اكتمال الوقت المقدر إذا لم يدخل المستخدم زمناً يدوياً
        areaMap[area].actualMinutes += task.estimatedMinutes || 0;
      }
    });

    // إضافة أوقات السجلات الفعلية من TimeLogs التي تنتمي لنفس اليوم
    const categoryToAreaMap: Record<string, LifeArea> = {
      Programming: 'البرمجة',
      AI: 'البرمجة',
      Business: 'التجارة',
      Work: 'العمل',
      Learning: 'التعلم',
      Exercise: 'الصحة',
      Family: 'العائلة',
      Rest: 'التطوير الشخصي',
      'Social Media': 'التطوير الشخصي',
      'Wasted Time': 'التطوير الشخصي',
    };

    todayTimeLogs.forEach((log) => {
      const area = categoryToAreaMap[log.category] || 'البرمجة';
      if (!areaMap[area]) {
        areaMap[area] = { area, plannedMinutes: 0, actualMinutes: 0, taskCount: 0 };
      }
      // لضمان عدم ازدواجية الحساب، إذا كان الوقت الفعلي أكبر نأخذ القيمة الأكبر
      if (areaMap[area].actualMinutes < log.durationMinutes) {
        areaMap[area].actualMinutes = Math.max(areaMap[area].actualMinutes, log.durationMinutes);
      }
    });

    // تضمين المؤقت الحي الجاري تشغيله حالياً
    if (activeTimerSeconds > 60) {
      const timerMins = Math.floor(activeTimerSeconds / 60);
      const defaultArea = 'البرمجة';
      if (!areaMap[defaultArea]) {
        areaMap[defaultArea] = { area: defaultArea, plannedMinutes: 0, actualMinutes: 0, taskCount: 0 };
      }
      areaMap[defaultArea].actualMinutes += timerMins;
    }

    // إذا لم تكن هناك مهام اليوم بعد، إظهار نموذج تمثيلي استرشادي
    if (Object.keys(areaMap).length === 0) {
      return [
        { area: 'البرمجة', plannedMinutes: 120, actualMinutes: 110, plannedHours: 2.0, actualHours: 1.8, variance: -10 },
        { area: 'التجارة', plannedMinutes: 90, actualMinutes: 75, plannedHours: 1.5, actualHours: 1.25, variance: -15 },
        { area: 'التعلم', plannedMinutes: 60, actualMinutes: 50, plannedHours: 1.0, actualHours: 0.8, variance: -10 },
        { area: 'الصحة', plannedMinutes: 45, actualMinutes: 45, plannedHours: 0.75, actualHours: 0.75, variance: 0 },
      ];
    }

    return Object.values(areaMap).map((item) => ({
      ...item,
      plannedHours: +(item.plannedMinutes / 60).toFixed(1),
      actualHours: +(item.actualMinutes / 60).toFixed(1),
      variance: item.actualMinutes - item.plannedMinutes, // موجب يعني استهلك وقت أكثر، سالب يعني وفر وقتاً
    }));
  }, [todayTasks, todayTimeLogs, activeTimerSeconds]);

  // حساب المقارنة المباشرة على مستوى مهام اليوم (Tasks)
  const taskComparisonData = useMemo(() => {
    if (todayTasks.length === 0) {
      return [
        { name: 'بناء واجهة النظام', planned: 90, actual: 85, status: 'completed' },
        { name: 'تصميم نموذج العرض', planned: 60, actual: 50, status: 'in_progress' },
        { name: 'مذاكرة الدوال البرمجية', planned: 45, actual: 45, status: 'todo' },
      ];
    }

    return todayTasks.map((t, idx) => {
      const planned = t.estimatedMinutes || 30;
      let actual = t.actualMinutes;
      if (actual === undefined) {
        actual = t.status === 'completed' ? planned : (t.status === 'in_progress' ? Math.round(planned * 0.6) : 0);
      }
      return {
        name: t.title.length > 24 ? t.title.slice(0, 24) + '...' : t.title,
        fullName: t.title,
        planned,
        actual,
        area: t.lifeArea,
        status: t.status,
        variance: actual - planned,
      };
    });
  }, [todayTasks]);

  // حساب الإجماليات ودقة التقدير
  const totals = useMemo(() => {
    const totalPlannedMins = categoryComparisonData.reduce((sum, d) => sum + d.plannedMinutes, 0);
    const totalActualMins = categoryComparisonData.reduce((sum, d) => sum + d.actualMinutes, 0);

    const plannedHours = +(totalPlannedMins / 60).toFixed(1);
    const actualHours = +(totalActualMins / 60).toFixed(1);
    const diffMins = totalActualMins - totalPlannedMins;

    // حساب نسبة دقة التقدير (Planning Accuracy)
    let accuracy = 100;
    if (totalPlannedMins > 0) {
      const diffAbs = Math.abs(totalActualMins - totalPlannedMins);
      accuracy = Math.max(0, Math.round(100 - (diffAbs / totalPlannedMins) * 100));
    }

    return {
      plannedHours,
      actualHours,
      totalPlannedMins,
      totalActualMins,
      diffMins,
      accuracy,
    };
  }, [categoryComparisonData]);

  // بيانات التوزيع الدائري (Donut Chart)
  const pieColors = ['#D4AF37', '#10b981', '#38bdf8', '#a855f7', '#f97316', '#ec4899'];
  const pieData = useMemo(() => {
    return categoryComparisonData
      .filter((d) => d.actualMinutes > 0)
      .map((d, index) => ({
        name: d.area,
        value: d.actualMinutes,
        hours: d.actualHours,
        color: pieColors[index % pieColors.length],
      }));
  }, [categoryComparisonData]);

  // Custom Tooltip لمقارنة المجالات
  const CategoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs shadow-2xl">
          <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-2">
            المجال: {label}
          </div>
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[var(--accent-gold)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-gold)]" />
                <span>الوقت المخطط (Planned):</span>
              </span>
              <span className="font-bold text-[var(--text-primary)]">{data.plannedHours} ساعة ({data.plannedMinutes} د)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>الوقت الفعلي (Actual):</span>
              </span>
              <span className="font-bold text-[var(--text-primary)]">{data.actualHours} ساعة ({data.actualMinutes} د)</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--border-color)] text-[11px]">
              <span className="text-[var(--text-muted)]">الفارق الزمني:</span>
              <span className={data.variance > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {data.variance > 0 ? `+${data.variance} دقيقة إضافية` : `${data.variance} دقيقة (توفير)`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip لمهام اليوم
  const TaskTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs shadow-2xl max-w-xs">
          <div className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 mb-1.5">
            <span className="text-xs text-[var(--text-primary)]">{data.fullName || label}</span>
          </div>
          <div className="space-y-1 font-mono pt-1 text-xs">
            <div className="flex items-center justify-between gap-3 text-[var(--accent-gold)]">
              <span>الوقت المخطط:</span>
              <span className="font-bold">{data.planned} دقيقة</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-400">
              <span>الوقت المستغرق فعلياً:</span>
              <span className="font-bold">{data.actual} دقيقة</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[var(--text-muted)] text-[11px] pt-1 border-t border-[var(--border-color)]">
              <span>حالة المهمة:</span>
              <span className="text-[var(--text-primary)]">
                {data.status === 'completed' ? 'تمت بنجاح' : (data.status === 'in_progress' ? 'قيد التنفيذ' : 'لم تبدأ')}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xl">
      {/* رأس القسم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <Clock className="h-3.5 w-3.5" />
            <span>انضباط التنفيذ اليومي</span>
            <span>·</span>
            <span>Planned vs. Actual Daily Work</span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] mt-1">
            توزيع ساعات العمل: الوقت المخطط مقابل الفعلي
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            مقارنة فورية بين الساعات المقدرة مسبقاً والوقت الحقيقي المنفذ على أرض الواقع
          </p>
        </div>

        {/* فلاتر العرض */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('categories')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-all ${
              viewMode === 'categories'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
            <span>حسب المجالات</span>
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-all ${
              viewMode === 'tasks'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>حسب المهام</span>
          </button>
          <button
            onClick={() => setViewMode('distribution')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-all ${
              viewMode === 'distribution'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <PieIcon className="h-3 w-3" />
            <span>النسبة المئوية</span>
          </button>
        </div>
      </div>

      {/* شريط الإحصاءات المقارنة السريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* الوقت المخطط له */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>إجمالي المخطط اليوم</span>
            <Clock className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-[var(--text-primary)] tabular-nums">
            {totals.plannedHours} <span className="text-xs font-normal text-[var(--text-muted)]">ساعة</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
            {totals.totalPlannedMins} دقيقة مجدولة
          </div>
        </div>

        {/* الوقت الفعلي المستغرق */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>الفعلي المستغرق</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
            {totals.actualHours} <span className="text-xs font-normal text-[var(--text-muted)]">ساعة</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
            {totals.totalActualMins} دقيقة إنجاز حقيقي
          </div>
        </div>

        {/* دقة التقدير والتنفيذ */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>دقة التقدير الزمني</span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent-gold)]" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-[var(--accent-gold)] tabular-nums">
            {totals.accuracy}%
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
            {totals.accuracy >= 80 ? 'تقدير دقيق ومتقن' : 'يحتاج ضبط التقديرات'}
          </div>
        </div>

        {/* الفارق الزمني (الانحراف) */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>الفارق الزمني (Variance)</span>
            {totals.diffMins <= 0 ? (
              <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
            )}
          </div>
          <div
            className={`mt-1 font-mono text-lg font-bold tabular-nums ${
              totals.diffMins <= 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {totals.diffMins <= 0 ? `${Math.abs(totals.diffMins)} د` : `+${totals.diffMins} د`}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
            {totals.diffMins <= 0 ? 'إنجاز ضمن الوقت أو أسرع' : 'تجاوز للوقت المقدر'}
          </div>
        </div>
      </div>

      {/* منطقة الرسم البياني */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
        {/* العرض 1: حسب مجالات الحياة (ساعات مخطط مقابل ساعات فعلي) */}
        {viewMode === 'categories' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[var(--accent-gold)]" />
                  <span>المقارنة المباشرة حسب مجالات العمل (ساعات)</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  أعمدة متجاورة تقارن المخطط له (ذهبي) مقابل المنفذ فعلياً (أخضر زمردي)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-[var(--accent-gold)]">
                  <span className="h-2.5 w-2.5 rounded bg-[var(--accent-gold)]" />
                  <span>المخطط (ساعة)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded bg-[#10b981]" />
                  <span>الفعلي (ساعة)</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full min-w-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryComparisonData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis
                    dataKey="area"
                    stroke="#666666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222222' }}
                  />
                  <YAxis
                    stroke="#666666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222222' }}
                    unit="س"
                  />
                  <Tooltip content={<CategoryTooltip />} />
                  <Bar
                    dataKey="plannedHours"
                    fill="#D4AF37"
                    radius={[4, 4, 0, 0]}
                    name="المخطط"
                  />
                  <Bar
                    dataKey="actualHours"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="الفعلي"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* العرض 2: حسب مهام اليوم المحددة (دقائق مخطط مقابل دقائق فعلي) */}
        {viewMode === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[var(--accent-gold)]" />
                  <span>مقارنة مهام اليوم: المخطط مقابل المستغرق (بالدقائق)</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  تفصيل زمني لكل مهمة مبرمجة لليوم لمعرفة أين يذهب الوقت بدقة
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-[var(--accent-gold)]">
                  <span className="h-2.5 w-2.5 rounded bg-[var(--accent-gold)]" />
                  <span>مقدر (د)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded bg-[#10b981]" />
                  <span>مستغرق (د)</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full min-w-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskComparisonData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#666666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222222' }}
                  />
                  <YAxis
                    stroke="#666666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222222' }}
                    unit="د"
                  />
                  <Tooltip content={<TaskTooltip />} />
                  <Bar
                    dataKey="planned"
                    fill="#D4AF37"
                    radius={[4, 4, 0, 0]}
                    name="المقدر"
                  />
                  <Bar
                    dataKey="actual"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="المستغرق"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* العرض 3: التوزيع الدائري النسبي للوقت الفعلي */}
        {viewMode === 'distribution' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-[var(--accent-gold)]" />
                  <span>توزيع الحصص النسبية للوقت المستغرق اليوم</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  نسبة ما تم استثماره في كل مجال من مجالات البناء
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-60 w-full min-w-0" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c0c0c" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value} دقيقة (${item.payload.hours} ساعة)`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#0c0c0c',
                        borderColor: '#262626',
                        borderRadius: '8px',
                        color: '#F5F5F5',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* بطاقات النسب التفصيلية */}
              <div className="space-y-2">
                {pieData.map((item) => {
                  const percentage = totals.totalActualMins > 0
                    ? Math.round((item.value / totals.totalActualMins) * 100)
                    : 0;
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[var(--text-muted)]">{item.hours} س</span>
                        <span className="font-bold text-[var(--accent-gold)]">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* الملاحظة التوجيهية في أسفل المخطط */}
        <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--accent-gold)] font-semibold">قاعدة التقدير:</span>
            <span>
              {totals.accuracy >= 80
                ? 'تقديراتك الزمنية واقعية جداً وتتوافق مع طاقتك التنفيذية اليومية.'
                : 'يُفضل إضافة هامش 15 دقيقة إضافي للمهام المعقدة لتجنب الاحتراق أو ترحيل المهام.'}
            </span>
          </div>
          <span className="font-mono text-[var(--text-muted)] shrink-0">
            سنة البناء 2027
          </span>
        </div>
      </div>
    </section>
  );
};
