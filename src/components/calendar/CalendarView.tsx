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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>الجدول الزمني والتسليمات</span>
            <span>·</span>
            <span>Execution Calendar</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            التقويم وجدول المواعيد
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            توزيع ساعات العمل العميق ومتابعة مواعيد انتهاء تجارب الدخل ومحطات المشاريع.
          </p>
        </div>
      </div>

      {/* توزيع كتل الوقت لليوم الحالي */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              جدول كتل اليوم الزمني (Time Blocks Schedule)
            </h2>
          </div>
          <span className="text-xs text-[#888888] font-mono">
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
                  ? 'border-[#1b261e] bg-[#0b130e] opacity-75'
                  : 'border-[#222222] bg-[#111111] hover:border-[#333333]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button className="text-xs">
                  {block.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-[#555555]" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs md:text-sm font-semibold ${
                      block.completed ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'
                    }`}
                  >
                    {block.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                    <span className="font-mono text-[#D4AF37]">{block.timeRange}</span>
                    <span aria-hidden="true">·</span>
                    <span>{block.category}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#666666]">
                {block.completed ? 'أنجزت' : 'مجدولة'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* مواعيد تسليم المشاريع وتجارب الدخل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* تسليمات المشاريع */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F5F5] border-b border-[#1a1a1a] pb-2">
            <FolderGit2 className="h-4 w-4 text-[#D4AF37]" />
            <span>مواعيد تسليم المشاريع النشطة</span>
          </div>

          <div className="space-y-2">
            {state.projects
              .filter((p) => p.status === 'active')
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-[#1a1a1a] bg-[#111111] p-3 text-xs"
                >
                  <div>
                    <div className="font-medium text-[#F5F5F5]">{p.title}</div>
                    <div className="text-[11px] text-[#777777]">التقدم: {p.progress}%</div>
                  </div>
                  <span className="font-mono text-xs text-[#D4AF37] tabular-nums">
                    {p.targetDate || 'مستمر'}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* دورات تجارب الدخل الـ 14 يوماً */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F5F5] border-b border-[#1a1a1a] pb-2">
            <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
            <span>نهايات دورات تجارب الدخل (14 يوماً)</span>
          </div>

          <div className="space-y-2">
            {state.incomeExperiments.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-lg border border-[#1a1a1a] bg-[#111111] p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-[#F5F5F5]">{exp.name}</div>
                  <div className="text-[11px] text-[#777777]">
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
