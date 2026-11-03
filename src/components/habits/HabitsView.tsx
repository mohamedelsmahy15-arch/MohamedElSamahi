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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>بناء الهوية والانضباط</span>
            <span>·</span>
            <span>Habit System</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            العادات والروتين اليومي
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "أنت لا ترتقي لمستوى أهدافك، بل تهبط لمستوى أنظمتك وعاداتك اليومية."
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة عادة يومية</span>
        </button>
      </div>

      {/* شريط الإنجاز اليومي للعادات */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">إنجاز عادات اليوم:</div>
            <div className="text-sm md:text-base font-bold text-[var(--text-primary)]">
              {todayCompletedCount} من {state.habits.length} عادات أنجزت اليوم
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
          <span className="text-[var(--accent-gold)]">تأثير العادات:</span>
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
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-color)]'
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
                          : 'text-[var(--text-muted)] hover:text-[var(--accent-gold)]'
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
                          isDoneToday ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5">
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
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                      title="تعديل العادة"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل تريد حذف هذه العادة؟')) deleteHabit(habit.id);
                      }}
                      className="text-[var(--text-muted)] hover:text-red-400 p-1"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* سجل الأيام السبعة المتتالية */}
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
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
                                ? 'bg-[var(--accent-gold)] text-black font-bold'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                            } ${isToday ? 'ring-1 ring-[#D4AF37]/50' : ''}`}
                          >
                            {completed ? '✓' : ''}
                          </div>
                          <span className="text-[9px] text-[var(--text-muted)] font-mono">
                            {getDayName(day)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent-gold)]">
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
          <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">إضافة عادة يومية جديدة</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم العادة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قراءة 20 صفحة يومياً"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">المجال:</label>
                  <select
                    value={lifeArea}
                    onChange={(e) => setLifeArea(e.target.value as LifeArea)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    {allLifeAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوقت المستهدف:</label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
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
          <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">تعديل العادة</h2>
              <button onClick={() => setEditingHabitLocal(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم العادة:</label>
                <input
                  type="text"
                  required
                  value={editingHabitLocal.title}
                  onChange={(e) =>
                    setEditingHabitLocal({ ...editingHabitLocal, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">المجال:</label>
                  <select
                    value={editingHabitLocal.lifeArea}
                    onChange={(e) =>
                      setEditingHabitLocal({
                        ...editingHabitLocal,
                        lifeArea: e.target.value as LifeArea,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    {allLifeAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوقت المستهدف:</label>
                  <input
                    type="time"
                    value={editingHabitLocal.targetTime || '06:00'}
                    onChange={(e) =>
                      setEditingHabitLocal({ ...editingHabitLocal, targetTime: e.target.value })
                    }
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setEditingHabitLocal(null)}
                  className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
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
