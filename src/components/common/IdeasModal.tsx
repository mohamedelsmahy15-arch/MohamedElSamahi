/**
 * components/common/IdeasModal.tsx
 * نافذة تدوين الأفكار والـ Parking Lot السريعة
 * تمنع تشتيت المستخدم أثناء ساعات العمل العميق
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb } from 'lucide-react';

export const IdeasModal: React.FC = () => {
  const { isIdeaModalOpen, setIsIdeaModalOpen, addIdea } = useApp();
  const [content, setContent] = useState('');

  if (!isIdeaModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addIdea({
      title: content.trim(),
      problem: 'فكرة سريعة تم رصدها',
      targetAudience: 'قيد الدراسة',
      requiredSkill: 'عامة',
      notes: '',
    });
    setContent('');
    setIsIdeaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              تدوين فكرة في الـ Parking Lot
            </h2>
          </div>
          <button
            onClick={() => setIsIdeaModalOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ✕
          </button>
        </div>

        <div className="rounded-lg bg-[#14120a] border border-[var(--accent-gold)]/20 p-3 text-xs text-[#cccccc]">
          💡 <span className="text-[var(--accent-gold)] font-semibold">مبدأ التركيز:</span> أي فكرة مشروع، أداة، أو دورة تخطر ببالك الآن، دوّنها هنا ولا تبدأ فيها حتى نهاية الأسبوع لتفادي التشتت.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">ما هي الفكرة؟</label>
            <textarea
              rows={4}
              required
              placeholder="اكتب الفكرة بكل تفاصيلها هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setIsIdeaModalOpen(false)}
              className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
            >
              حفظ في الـ Parking Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
