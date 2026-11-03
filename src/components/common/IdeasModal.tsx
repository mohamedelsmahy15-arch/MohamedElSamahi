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
      <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#F5F5F5]">
              تدوين فكرة في الـ Parking Lot
            </h2>
          </div>
          <button
            onClick={() => setIsIdeaModalOpen(false)}
            className="text-[#777777] hover:text-[#F5F5F5]"
          >
            ✕
          </button>
        </div>

        <div className="rounded-lg bg-[#14120a] border border-[#D4AF37]/20 p-3 text-xs text-[#cccccc]">
          💡 <span className="text-[#D4AF37] font-semibold">مبدأ التركيز:</span> أي فكرة مشروع، أداة، أو دورة تخطر ببالك الآن، دوّنها هنا ولا تبدأ فيها حتى نهاية الأسبوع لتفادي التشتت.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#999999] mb-1 font-medium">ما هي الفكرة؟</label>
            <textarea
              rows={4}
              required
              placeholder="اكتب الفكرة بكل تفاصيلها هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
            />
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
