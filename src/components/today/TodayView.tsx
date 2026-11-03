/**
 * components/today/TodayView.tsx
 * شاشة اليوم والتخطيط التنفيذي (Plan My Day)
 * تضمن تركيز محمد على أهم 3 نتائج، مع تنظيم الكتل الزمنية وسهولة تعديل أي مهمة
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Edit3,
  Flame,
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
    toggleHabitToday,
  } = useApp();

  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = state.tasks.filter((task) => {
    if (filterArea !== 'all' && task.lifeArea !== filterArea) return false;
    if (filterStatus === 'pending' && task.status === 'completed') return false;
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة والمبدأ اليومي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>التخطيط اليومي</span>
            <span>·</span>
            <span>Plan My Day</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            يوم البناء والتنفيذ
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "لا تجمع أهدافاً كثيرة. حدد أهم 3 نتائج، وابدأ بالثقيل أولاً."
          </p>
        </div>

        <button
          onClick={() => setIsQuickTaskModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-[#e0bc45] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة مهمة لليوم</span>
        </button>
      </div>

      {/* بطاقة أهم 3 نتائج اليوم (Today's Focus Block) */}
      <div className="rounded-xl border border-[#D4AF37]/30 bg-[#0e0e0a] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#22221b] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono font-bold">
              3
            </span>
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              أهم 3 نتائج يجب أن تتحقق اليوم
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#D4AF37]">
            {dailyScoreBreakdown.focusTasksRatio} أنجزت
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0, 1, 2].map((slotIndex) => {
            const task = todayFocusTasks[slotIndex];

            if (!task) {
              return (
                <button
                  key={`empty-${slotIndex}`}
                  onClick={() => setIsQuickTaskModalOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#080808] p-5 text-center text-xs text-[#666666] hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all min-h-[110px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>تحديد نتيجة رئيسية #{slotIndex + 1}</span>
                </button>
              );
            }

            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`relative flex flex-col justify-between rounded-lg border p-4 transition-all ${
                  isDone
                    ? 'border-emerald-900/40 bg-emerald-950/20 text-[#888888]'
                    : 'border-[#2a2a2a] bg-[#121212] text-[#F5F5F5]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      نتيجة 0{slotIndex + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#777777]">{task.lifeArea}</span>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-[#666666] hover:text-[#F5F5F5] p-0.5"
                        title="تعديل المهمة"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs md:text-sm font-medium ${isDone ? 'line-through text-[#666666]' : ''}`}>
                    {task.title}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex items-center gap-1.5 text-xs text-[#999999] hover:text-emerald-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-[#555555]" />
                    )}
                    <span>{isDone ? 'تم الإنجاز' : 'تعليم كمكتمل'}</span>
                  </button>

                  <button
                    onClick={() => moveTaskToParkingLot(task.id)}
                    className="text-[10px] text-[#666666] hover:text-amber-400"
                    title="انقل للـ Parking Lot لمنع التشتت"
                  >
                    نقل للأفكار
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* تنظيم الكتل الزمنية لليوم (Time Blocks) */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              جدول الكتل الزمنية لليوم (Time Blocks)
            </h2>
          </div>
          <span className="text-xs text-[#888888]">
            التركيز على ساعات العمل العميق
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.timeBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
                block.completed
                  ? 'border-[#1b261e] bg-[#0b130e] opacity-75'
                  : 'border-[#222222] bg-[#111111] hover:border-[#333333]'
              }`}
            >
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#D4AF37] tabular-nums">
                  {block.timeRange}
                </span>
                <div className={`text-xs font-medium ${block.completed ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'}`}>
                  {block.title}
                </div>
                <div className="text-[10px] text-[#777777]">{block.category}</div>
              </div>

              <div className="pr-3">
                {block.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-[#444444]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قائمة كافة المهام اليومية مع فلترة ذكية وتعديل فوري */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a] pb-3">
          <h2 className="text-sm font-semibold text-[#F5F5F5]">
            كافة مهام اليوم والـ Backlog
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#222222] text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-[#222222] text-[#F5F5F5]'
                    : 'text-[#777777] hover:text-[#aaaaaa]'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-[#222222] text-[#F5F5F5]'
                    : 'text-[#777777] hover:text-[#aaaaaa]'
                }`}
              >
                المتبقية
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-[#222222] text-[#F5F5F5]'
                    : 'text-[#777777] hover:text-[#aaaaaa]'
                }`}
              >
                المكتملة
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#777777]">
              لا توجد مهام مطابقة للفلتر المحدد.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5 transition-colors ${
                    isDone
                      ? 'border-[#191919] bg-[#090909] opacity-60'
                      : 'border-[#222222] bg-[#111111] hover:border-[#2f2f2f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isDone ? 'text-emerald-400' : 'text-[#555555] hover:text-[#D4AF37]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>

                    <div className="space-y-0.5">
                      <div className={`text-xs md:text-sm font-medium ${isDone ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                        <span>{task.lifeArea}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.estimatedMinutes} دقيقة</span>
                        <span aria-hidden="true">·</span>
                        <span className={task.priority === 'strategic' ? 'text-[#D4AF37]' : ''}>
                          {task.priority === 'strategic' ? 'أولوية استراتيجية' : task.priority === 'high' ? 'عالية' : 'عادية'}
                        </span>
                        {task.isTodayFocus && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#D4AF37] font-semibold">من أهم 3 مهام</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-[#777777] hover:text-[#F5F5F5]"
                      title="تعديل المهمة"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {!task.isTodayFocus && !isDone && (
                      <button
                        onClick={() => setTaskTodayFocus(task.id, true)}
                        className="rounded border border-[#2a2a2a] px-2 py-1 text-[11px] text-[#999999] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                      >
                        اجعلها في التركيز (Top 3)
                      </button>
                    )}

                    <button
                      onClick={() => moveTaskToParkingLot(task.id)}
                      className="text-[11px] text-[#666666] hover:text-amber-400 px-2 py-1"
                      title="استبعاد إلى الـ Parking Lot لمنع التشتت"
                    >
                      Parking Lot
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
