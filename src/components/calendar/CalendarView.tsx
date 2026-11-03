/**
 * components/calendar/CalendarView.tsx
 * التقويم التفاعلي وجدول المواعيد (Calendar & Schedule)
 * يربط بين كتل اليوم الزمنية، مواعيد تسليم المشاريع، ونهايات دورات تجارب الدخل
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  FolderGit2,
  TrendingUp,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { state, toggleTimeBlock } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());

  // أيام الأسبوع الحالي
  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>الجدول الزمني والتسليمات</span>
            <span>·</span>
            <span>Execution Calendar</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            التقويم وجدول المواعيد
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            توزيع ساعات العمل العميق ومتابعة مواعيد انتهاء تجارب الدخل ومحطات المشاريع.
          </p>
        </div>
      </div>

      {/* توزيع كتل الوقت لليوم الحالي */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              جدول كتل اليوم الزمني (Time Blocks Schedule)
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            اليوم: {todayStr}
          </span>
        </div>

        <div className="space-y-2.5">
          {state.timeBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                block.completed
                  ? 'border-emerald-500/30 bg-emerald-500/10 opacity-75'
                  : 'border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--border-color)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button className="text-xs">
                  {block.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-[var(--text-muted)]" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs md:text-sm font-semibold ${
                      block.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {block.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <span className="font-mono text-[var(--accent-gold)]">{block.timeRange}</span>
                    <span aria-hidden="true">·</span>
                    <span>{block.category}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {block.completed ? 'أنجزت' : 'مجدولة'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* مواعيد تسليم المشاريع وتجارب الدخل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* تسليمات المشاريع */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            <FolderGit2 className="h-4 w-4 text-[var(--accent-gold)]" />
            <span>مواعيد تسليم المشاريع النشطة</span>
          </div>

          <div className="space-y-2">
            {state.projects
              .filter((p) => p.status === 'active')
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 text-xs"
                >
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{p.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">التقدم: {p.progress}%</div>
                  </div>
                  <span className="font-mono text-xs text-[var(--accent-gold)] tabular-nums">
                    {p.targetDate || 'مستمر'}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* دورات تجارب الدخل الـ 14 يوماً */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            <TrendingUp className="h-4 w-4 text-[var(--accent-gold)]" />
            <span>نهايات دورات تجارب الدخل (14 يوماً)</span>
          </div>

          <div className="space-y-2">
            {state.incomeExperiments.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-[var(--text-primary)]">{exp.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    تواصل: {exp.actualClientsContacted}/20 عميل
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-400">
                  {exp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
