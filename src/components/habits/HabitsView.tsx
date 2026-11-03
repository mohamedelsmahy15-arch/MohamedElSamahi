/**
 * components/habits/HabitsView.tsx
 * نظام العادات اليومية والانضباط (Habit & Discipline System)
 * يركز على تثبيت الهوية اليومية، الاستمرارية (Streaks)، وتأثير العادات على الـ Daily Score
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Sparkles,
  RotateCcw,
  Edit3,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Habit, LifeArea } from '../../types';

export const HabitsView: React.FC = () => {
  const { state, toggleHabitToday, addHabit, updateHabit, deleteHabit } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabitLocal, setEditingHabitLocal] = useState<Habit | null>(null);

  // حقول إضافة عادة
  const [title, setTitle] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [targetTime, setTargetTime] = useState('06:00');

  const todayStr = new Date().toISOString().split('T')[0];

  // توليد آخر 7 أيام للرسم البياني المصغر
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', { weekday: 'narrow' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      lifeArea,
      frequency: 'daily',
      targetTime,
    });

    setTitle('');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabitLocal || !editingHabitLocal.title.trim()) return;

    updateHabit(editingHabitLocal);
    setEditingHabitLocal(null);
  };

  const allLifeAreas: LifeArea[] = [
    'الدين',
    'الصحة',
    'البرمجة',
    'التعلم',
    'العمل',
    'التجارة',
    'التطوير الشخصي',
  ];

  const todayCompletedCount = state.habits.filter((h) =>
    h.completedDates.includes(todayStr)
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>بناء الهوية والانضباط</span>
            <span>·</span>
            <span>Habit System</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            العادات والروتين اليومي
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "أنت لا ترتقي لمستوى أهدافك، بل تهبط لمستوى أنظمتك وعاداتك اليومية."
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة عادة يومية</span>
        </button>
      </div>

      {/* شريط الإنجاز اليومي للعادات */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-[#888888]">إنجاز عادات اليوم:</div>
            <div className="text-sm md:text-base font-bold text-[#F5F5F5]">
              {todayCompletedCount} من {state.habits.length} عادات أنجزت اليوم
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#888888] font-mono">
          <span className="text-[#D4AF37]">تأثير العادات:</span>
          <span>تساهم بنسبة 25% مباشرة في مؤشر اليوم التنفيذي</span>
        </div>
      </div>

      {/* قائمة العادات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(todayStr);

          return (
            <div
              key={habit.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all ${
                isDoneToday
                  ? 'border-[#1a291f] bg-[#0b140e]'
                  : 'border-[#222222] bg-[#0c0c0c] hover:border-[#2f2f2f]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isDoneToday
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-[#555555] hover:text-[#D4AF37]'
                      }`}
                      title={isDoneToday ? 'إلغاء التحديد' : 'تعليم كمكتملة اليوم'}
                    >
                      {isDoneToday ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>

                    <div>
                      <h3
                        className={`text-sm md:text-base font-medium ${
                          isDoneToday ? 'line-through text-[#777777]' : 'text-[#F5F5F5]'
                        }`}
                      >
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[#777777] mt-0.5">
                        <span>{habit.lifeArea}</span>
                        {habit.targetTime && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="font-mono">{habit.targetTime}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start">
                    <button
                      onClick={() => setEditingHabitLocal(habit)}
                      className="text-[#555555] hover:text-[#F5F5F5] p-1"
                      title="تعديل العادة"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذه العادة؟')) deleteHabit(habit.id);
                      }}
                      className="text-[#555555] hover:text-red-400 p-1"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* سجل الأيام السبعة المتتالية */}
                <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {last7Days.map((day) => {
                      const completed = habit.completedDates.includes(day);
                      const isToday = day === todayStr;

                      return (
                        <div
                          key={day}
                          className="flex flex-col items-center gap-1"
                          title={`${day}: ${completed ? 'أنجزت' : 'لم تنجز'}`}
                        >
                          <div
                            className={`h-4 w-4 rounded-sm flex items-center justify-center text-[9px] ${
                              completed
                                ? 'bg-[#D4AF37] text-black font-bold'
                                : 'bg-[#181818] text-[#555555]'
                            } ${isToday ? 'ring-1 ring-[#D4AF37]/50' : ''}`}
                          >
                            {completed ? '✓' : ''}
                          </div>
                          <span className="text-[9px] text-[#555555] font-mono">
                            {getDayName(day)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#D4AF37]">
                    <Flame className="h-4 w-4" />
                    <span className="tabular-nums font-bold">{habit.streak} يوم</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة إضافة عادة جديدة */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold text-[#F5F5F5]">إضافة عادة يومية جديدة</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#777777] hover:text-[#F5F5F5]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">اسم العادة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قراءة 20 صفحة يومياً"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">المجال:</label>
                  <select
                    value={lifeArea}
                    onChange={(e) => setLifeArea(e.target.value as LifeArea)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    {allLifeAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">الوقت المستهدف:</label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  حفظ العادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تعديل عادة موجودة */}
      {editingHabitLocal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold text-[#F5F5F5]">تعديل العادة</h2>
              <button onClick={() => setEditingHabitLocal(null)} className="text-[#777777] hover:text-[#F5F5F5]">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">اسم العادة:</label>
                <input
                  type="text"
                  required
                  value={editingHabitLocal.title}
                  onChange={(e) =>
                    setEditingHabitLocal({ ...editingHabitLocal, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">المجال:</label>
                  <select
                    value={editingHabitLocal.lifeArea}
                    onChange={(e) =>
                      setEditingHabitLocal({
                        ...editingHabitLocal,
                        lifeArea: e.target.value as LifeArea,
                      })
                    }
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    {allLifeAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">الوقت المستهدف:</label>
                  <input
                    type="time"
                    value={editingHabitLocal.targetTime || '06:00'}
                    onChange={(e) =>
                      setEditingHabitLocal({ ...editingHabitLocal, targetTime: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setEditingHabitLocal(null)}
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
