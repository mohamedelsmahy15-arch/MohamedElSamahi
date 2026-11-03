/**
 * components/dashboard/DashboardView.tsx
 * لوحة القيادة التنفيذية الفاخرة لنظام "السماحي OS"
 * تجمع الرؤية، مؤشر اليوم الذكي، أهم 3 نتائج، عداد العادات، والمؤقت الحي
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Plus,
  Compass,
  Edit3,
  Play,
  Square,
  Briefcase,
  ChevronLeft,
} from 'lucide-react';
import { TaskStatus } from '../../types';
import { WeeklyProductivityCharts } from './WeeklyProductivityCharts';

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
    toggleProjectMilestone,
    setEditingTask,
    setEditingProject,
    toggleHabitToday,
    activeTimer,
    startTimer,
    stopTimer,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'تمت';
      case 'in_progress':
        return 'قيد التنفيذ';
      case 'deferred':
        return 'مؤجلة';
      default:
        return 'لم تبدأ';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'in_progress':
        return 'text-amber-400';
      case 'deferred':
        return 'text-neutral-500';
      default:
        return 'text-[#888888]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* تحذير مكافحة التشتت (إن وجد) */}
      {distractionAlert && (
        <div className="flex items-start justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
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

      {/* الرؤية الشخصية والهوية (2027 سنة البناء) */}
      <section className="relative overflow-hidden rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 md:p-7 shadow-xl">
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
              <span>2027</span>
              <span>—</span>
              <span>سنة البناء</span>
            </div>
            <p className="text-base md:text-lg font-medium text-[#F5F5F5] leading-relaxed">
              "أبني نفسي، أتعلم، أعمل، أتاجر بما يرضي الله، وأزرع اليوم ما أريد حصاده غدًا."
            </p>
            <div className="flex items-center gap-2 text-xs text-[#999999] font-mono">
              <span>Build</span>
              <span className="text-[#D4AF37]">→</span>
              <span>Learn</span>
              <span className="text-[#D4AF37]">→</span>
              <span>Apply</span>
              <span className="text-[#D4AF37]">→</span>
              <span>Earn</span>
              <span className="text-[#D4AF37]">→</span>
              <span>Scale</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto border-t md:border-t-0 md:border-r border-[#222222] pt-3 md:pt-0 md:pr-6">
            <button
              onClick={() => setActiveTab('today')}
              className="flex items-center gap-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] px-3.5 py-2 text-xs font-medium text-[#F5F5F5] hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors"
            >
              <span>خطة اليوم الكاملة</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* الترحيب الصباحي ومؤشرات اليوم الذكية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5]">
            صباح الخير يا محمد 👋
          </h1>
          <p className="text-xs text-[#999999] mt-1">
            اليوم هو فرصة جديدة لبناء مهارة، إنجاز التزام، وتثبيت عادة يومية.
          </p>
        </div>

        {/* مؤشر اليوم الرقمي ومؤقت العمل السريع */}
        <div className="flex items-center gap-3">
          {/* مؤقت العمل السريع في الهيدر */}
          <div className="flex items-center gap-2 rounded-lg border border-[#222222] bg-[#0e0e0e] px-3 py-2 text-xs font-mono">
            <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="tabular-nums text-[#F5F5F5]">
              {Math.floor(activeTimer.elapsedSeconds / 60)} دقيقة
            </span>
            {!activeTimer.isRunning ? (
              <button
                onClick={() => startTimer('Programming', 'جلسة عمل سريعة')}
                className="text-emerald-400 hover:text-emerald-300 mr-1"
                title="بدء المؤقت"
              >
                <Play className="h-3.5 w-3.5 fill-emerald-400" />
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="text-red-400 hover:text-red-300 mr-1"
                title="إيقاف وحفظ"
              >
                <Square className="h-3.5 w-3.5 fill-red-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[#222222] bg-[#0e0e0e] px-4 py-2">
            <div className="text-right">
              <div className="text-[10px] text-[#888888] font-medium">مؤشر اليوم</div>
              <div className="font-mono text-sm font-semibold tabular-nums text-[#D4AF37]">
                {dailyScoreBreakdown.score}%
              </div>
            </div>
            <div className="h-8 w-8 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* شريط العادات اليومية السريع (Quick Habit Check-in Row) */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4">
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F5F5]">
            <Flame className="h-4 w-4 text-[#D4AF37]" />
            <span>العادات الصباحية واليومية:</span>
          </div>
          <button
            onClick={() => setActiveTab('habits')}
            className="text-[11px] text-[#D4AF37] hover:underline"
          >
            كل العادات ←
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {state.habits.map((habit) => {
            const isDone = habit.completedDates.includes(todayStr);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabitToday(habit.id)}
                className={`flex items-center justify-between rounded-lg border p-2.5 text-xs text-right transition-all ${
                  isDone
                    ? 'border-emerald-800/40 bg-emerald-950/20 text-[#cccccc]'
                    : 'border-[#1f1f1f] bg-[#111111] text-[#888888] hover:border-[#333333]'
                }`}
              >
                <div className="truncate pr-1">
                  <div className={`truncate font-medium ${isDone ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'}`}>
                    {habit.title}
                  </div>
                  <div className="text-[10px] text-[#666666] font-mono">
                    {habit.streak} يوم متتالي
                  </div>
                </div>

                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-[#444444] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* القسم الأساسي: أهم 3 مهام لليوم + مؤشر التشخيص */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* عمود أهم 3 مهام */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
              <span>Today's Focus</span>
              <span className="text-xs text-[#999999] font-normal">(أهم 3 مهام لليوم فقط)</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#999999]">
              <span className="font-mono tabular-nums text-[#D4AF37]">
                {dailyScoreBreakdown.focusTasksRatio}
              </span>
              <span>مكتملة</span>
            </div>
          </div>

          <div className="space-y-3">
            {todayFocusTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#222222] bg-[#0c0c0c] p-6 text-center">
                <Compass className="h-7 w-7 text-[#555555] mx-auto mb-2" />
                <p className="text-xs text-[#888888]">
                  لم تحدد مهام التركيز الثلاثية بعد. اختر الآن ما يبني يومك!
                </p>
                <button
                  onClick={() => setIsQuickTaskModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>تحديد مهمة تركيز</span>
                </button>
              </div>
            ) : (
              todayFocusTasks.map((task, index) => {
                const isDone = task.status === 'completed';
                const linkedProject = state.projects.find((p) => p.id === task.linkedProjectId);

                return (
                  <div
                    key={task.id}
                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4 transition-all ${
                      isDone
                        ? 'border-[#1a261f] bg-[#0a120e]/60'
                        : 'border-[#222222] bg-[#0e0e0e] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
                          isDone
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-[#555555] hover:text-[#D4AF37]'
                        }`}
                        title={isDone ? 'إلغاء الإنجاز' : 'تعليم كمكتملة'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                            0{index + 1}.
                          </span>
                          <span
                            className={`text-xs md:text-sm font-medium transition-all ${
                              isDone ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#777777]">
                          <span>{task.lifeArea}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-mono tabular-nums">{task.estimatedMinutes} د</span>
                          </span>
                          {linkedProject && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#999999] truncate max-w-[140px]">
                                {linkedProject.title}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className={getStatusColor(task.status)}>
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* خيارات التحكم والتعديل السهل (Edit Task Modal Trigger) */}
                    <div className="flex items-center gap-2 sm:self-center pr-8 sm:pr-0">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-[11px] text-[#777777] hover:text-[#F5F5F5] p-1"
                        title="تعديل بيانات المهمة"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveTaskToParkingLot(task.id)}
                        className="text-[11px] text-[#666666] hover:text-amber-400 transition-colors whitespace-nowrap"
                        title="انقلها إلى الـ Parking Lot إذا لم تكن ضرورية اليوم"
                      >
                        Parking Lot
                      </button>
                      <button
                        onClick={() => setTaskTodayFocus(task.id, false)}
                        className="text-[11px] text-[#555555] hover:text-[#999999] transition-colors"
                        title="إزالة من تركيز اليوم"
                      >
                        إلغاء التركيز
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {todayFocusTasks.length < 3 && (
              <button
                onClick={() => setIsQuickTaskModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#222222] bg-transparent py-3 text-xs text-[#777777] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  أضف مهمة تركيز رقم {todayFocusTasks.length + 1} (الحد الأقصى 3)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* عمود تشخيص اليوم */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#F5F5F5] flex items-center justify-between">
            <span>مؤشر اليوم</span>
            <span className="text-xs text-[#D4AF37] font-mono">Daily Diagnostic</span>
          </h2>

          <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
              <span className="text-xs text-[#999999]">التقييم الحقيقي لليوم:</span>
              <span className="text-xs font-semibold text-[#D4AF37]">
                {dailyScoreBreakdown.verdict}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">إنجاز مهام التركيز:</span>
                <span className="font-mono text-[#F5F5F5] tabular-nums">
                  {dailyScoreBreakdown.focusTasksRatio} ({dailyScoreBreakdown.focusTasksPercent}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#181818] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-300"
                  style={{ width: `${dailyScoreBreakdown.focusTasksPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-[#111111] p-3 border border-[#1f1f1f]">
              <div className="text-[11px] font-semibold text-[#999999] mb-1">توجيه النظام:</div>
              <p className="text-xs text-[#e0e0e0] leading-relaxed">
                {dailyScoreBreakdown.advice}
              </p>
            </div>

            <div className="pt-1 text-[11px] text-[#666666] leading-relaxed">
              💡 <span className="font-medium text-[#888888]">مبدأ اليوم:</span> لا تقضِ اليوم في التشتت بين 10 مهام جانبية، إنهاء 3 مهام استراتيجية يعادل أسبوعاً كاملاً من العمل العشوائي.
            </div>
          </div>
        </div>
      </div>

      {/* قسم التحليل البصري الأسبوعي والإنتاجية (Recharts) */}
      <WeeklyProductivityCharts state={state} />

      {/* خطة 2027 والمشاريع النشطة الثلاثية */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              المشاريع النشطة (حد أقصى 3)
            </h2>
            <span className="font-mono text-xs text-[#999999]">
              ({activeProjects.length}/3)
            </span>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
          >
            <span>إدارة المشاريع</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 hover:border-[#333333] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#777777]">
                  <span>{project.lifeArea}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-[#D4AF37] font-semibold">
                      {project.progress}%
                    </span>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="text-[#555555] hover:text-[#F5F5F5]"
                      title="تعديل المشروع"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xs md:text-sm font-semibold text-[#F5F5F5] leading-snug">
                  {project.title}
                </h3>
                <p className="text-[11px] text-[#777777] line-clamp-2">
                  {project.description}
                </p>

                <div className="h-1 w-full bg-[#1c1c1c] rounded-full overflow-hidden my-2">
                  <div
                    className="h-full bg-[#D4AF37] transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* المراحل المصغرة */}
                <div className="pt-2 space-y-1.5">
                  {project.milestones.slice(0, 3).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleProjectMilestone(project.id, m.id)}
                      className="flex w-full items-center gap-2 text-right text-[11px] text-[#888888] hover:text-[#F5F5F5] transition-colors"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-[#444444] shrink-0" />
                      )}
                      <span className={`truncate ${m.completed ? 'line-through text-[#555555]' : ''}`}>
                        {m.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-[#666666]">
                <span>المراحل: {project.milestones.filter((m) => m.completed).length} / {project.milestones.length}</span>
                <span className="text-[#D4AF37] hover:underline cursor-pointer" onClick={() => setActiveTab('projects')}>
                  عرض التفاصيل ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
