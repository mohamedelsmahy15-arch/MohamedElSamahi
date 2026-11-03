/**
 * components/ideas/IdeasModal.tsx
 * نافذة تسجيل الفكرة السريعة (Idea Capture)
 * تحفظ الفكرة فوراً في Parking Lot لحماية تركيز محمد من التشتت اللحظي.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb, ShieldAlert } from 'lucide-react';

export const IdeasModal: React.FC = () => {
  const { isIdeaModalOpen, setIsIdeaModalOpen, addIdea } = useApp();

  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [notes, setNotes] = useState('');

  if (!isIdeaModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addIdea({
      title: title.trim(),
      problem: problem.trim() || 'فكرة جديدة قيد الاستكشاف',
      targetAudience: targetAudience.trim() || 'عملاء محتملين',
      requiredSkill: requiredSkill.trim() || 'مهارة عامة',
      notes: notes.trim(),
    });

    setTitle('');
    setProblem('');
    setTargetAudience('');
    setRequiredSkill('');
    setNotes('');
    setIsIdeaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F5]">
                تسجيل فكرة سريعة (+ فكرة)
              </h2>
              <p className="text-[10px] text-[#888888]">
                تُحفظ في الـ Parking Lot فوراً دون أن تشتت يومك الحالي
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsIdeaModalOpen(false)}
            className="text-[#777777] hover:text-[#F5F5F5]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#999999] mb-1 font-medium">اسم الفكرة:</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: أداة بسيطة لحساب أسعار صفحات الهبوط"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#999999] mb-1 font-medium">ما المشكلة التي تحلها؟</label>
            <input
              type="text"
              placeholder="مثال: المستقلون يضيعون وقتاً في التسعير العشوائي"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#999999] mb-1 font-medium">العميل المستهدف:</label>
              <input
                type="text"
                placeholder="مثال: مصممون، متاجر..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#999999] mb-1 font-medium">المهارة المطلوبة:</label>
              <input
                type="text"
                placeholder="مثال: JavaScript, APIs"
                value={requiredSkill}
                onChange={(e) => setRequiredSkill(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#999999] mb-1 font-medium">ملاحظات إضافية:</label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل تود تذكرها لاحقاً..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="rounded border border-[#1f1f1f] bg-[#080808] p-2.5 text-[11px] text-[#777777]">
            🔒 <span className="text-[#999999]">أمان التركيز:</span> هذه الفكرة لن تتحول تلقائياً لمشروع ولن تظهر في مهام اليوم، ستنتظر في الـ Parking Lot حتى تقرر اختبارها رسمياً.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222222]">
            <button
              type="button"
              onClick={() => setIsIdeaModalOpen(false)}
              className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
            >
              حفظ في الـ Parking Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
