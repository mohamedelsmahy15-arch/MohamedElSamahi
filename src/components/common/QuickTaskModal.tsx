/**
 * components/common/QuickTaskModal.tsx
 * نافذة إضافة مهمة سريعة بأقل عدد ممكن من الخطوات (2-3 نقرات)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeArea, TaskPriority } from '../../types';
import { Plus, CheckSquare } from 'lucide-react';

export const QuickTaskModal: React.FC = () => {
  const {
    isQuickTaskModalOpen,
    setIsQuickTaskModalOpen,
    addTask,
    state,
    todayFocusTasks,
  } = useApp();

  const [title, setTitle] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [estimatedMinutes, setEstimatedMinutes] = useState('45');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [linkedProjectId, setLinkedProjectId] = useState<string>('');
  const [isTodayFocus, setIsTodayFocus] = useState<boolean>(todayFocusTasks.length < 3);
  const [resourceLink, setResourceLink] = useState('');
  const [executionGuide, setExecutionGuide] = useState('');

  if (!isQuickTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      lifeArea,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      priority,
      linkedProjectId: linkedProjectId || undefined,
      status: 'todo',
      isTodayFocus,
      resourceLink: resourceLink.trim() || undefined,
      executionGuide: executionGuide.trim() || undefined,
    });

    setTitle('');
    setIsQuickTaskModalOpen(false);
  };

  const allLifeAreas: LifeArea[] = [
    'البرمجة',
    'التعلم',
    'العمل',
    'التجارة',
    'المشروع',
    'الصحة',
    'الدين',
    'المال',
    'التطوير الشخصي',
    'العائلة',
    'العلاقات',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Plus className="h-4 w-4 text-[var(--accent-gold)]" />
            <span>إضافة مهمة جديدة</span>
          </h2>
          <button
            onClick={() => setIsQuickTaskModalOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم المهمة التنفيذية:</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: كتابة دوال حفظ البيانات في LocalStorage"
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
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوقت المتوقع (دقيقة):</label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="15">15 دقيقة</option>
                <option value="30">30 دقيقة</option>
                <option value="45">45 دقيقة</option>
                <option value="60">60 دقيقة (ساعة)</option>
                <option value="90">90 دقيقة (جلسة عميقة)</option>
                <option value="120">120 دقيقة (ساعتان)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="strategic">استراتيجية (تحرك إبرة الدخل)</option>
                <option value="high">عالية</option>
                <option value="normal">عادية</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">ربط بمشروع نشط:</label>
              <select
                value={linkedProjectId}
                onChange={(e) => setLinkedProjectId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="">بدون مشروع محدد</option>
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* تفعيل أو إلغاء تفعيل وضعها في أهم 3 مهام لليوم */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={isTodayFocus}
                onChange={(e) => setIsTodayFocus(e.target.checked)}
                className="h-4 w-4 rounded accent-[#D4AF37]"
              />
              <span>تحديد كإحدى أهم 3 مهام لليوم (Today's Focus)</span>
            </label>
            {todayFocusTasks.length >= 3 && isTodayFocus && (
              <p className="text-[11px] text-amber-400 mt-1">
                تنبيه: لديك 3 مهام في تركيز اليوم بالفعل! سيقترح النظام استبدال مهمة لحماية تركيزك.
              </p>
            )}
          </div>

                    {/* رابط المرجع والتحضير المسائي لمهام الغد */}
          <div className="space-y-2.5 rounded-xl border border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/5 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent-gold)]">
              <span>🌙 التحضير المسائي ورابط التعلم (Nightly Mission Prep)</span>
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
                🔗 رابط المرجع أو الكورس أو الفيديو (YouTube, GitHub, Documentation):
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... أو https://github.com/..."
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
                📝 خطة التنفيذ المباشرة (أول ما تفتح الصبح هتعمل إيه خطوة بخطوة؟):
              </label>
              <textarea
                rows={2}
                placeholder="مثال: سأفتح الفيديو عند الدقيقة 12 وأطبق كتابة الكود عملياً لتنفيذ شاشة تسجيل الدخول..."
                value={executionGuide}
                onChange={(e) => setExecutionGuide(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setIsQuickTaskModalOpen(false)}
              className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
            >
              حفظ المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
