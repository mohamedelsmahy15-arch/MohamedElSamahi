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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>إضافة مهمة جديدة</span>
          </h2>
          <button
            onClick={() => setIsQuickTaskModalOpen(false)}
            className="text-[#777777] hover:text-[#F5F5F5]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#999999] mb-1 font-medium">اسم المهمة التنفيذية:</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: كتابة دوال حفظ البيانات في LocalStorage"
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
              <label className="block text-[#999999] mb-1 font-medium">الوقت المتوقع (دقيقة):</label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
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
              <label className="block text-[#999999] mb-1 font-medium">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="strategic">استراتيجية (تحرك إبرة الدخل)</option>
                <option value="high">عالية</option>
                <option value="normal">عادية</option>
              </select>
            </div>

            <div>
              <label className="block text-[#999999] mb-1 font-medium">ربط بمشروع نشط:</label>
              <select
                value={linkedProjectId}
                onChange={(e) => setLinkedProjectId(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
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
            <label className="flex items-center gap-2 text-xs text-[#cccccc] cursor-pointer">
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

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsQuickTaskModalOpen(false)}
              className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
            >
              حفظ المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
