/**
 * components/ideas/IdeasView.tsx
 * شاشة بنك الأفكار ومصيدة التشتت (Parking Lot)
 * مكان آمن لجمع كل ومضات الأفكار دون إفساد التركيز اليومي
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb, Plus, Trash2, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const IdeasView: React.FC = () => {
  const { state, setIsIdeaModalOpen, deleteIdea, convertIdeaToProject } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>مصيدة التشتت</span>
            <span>·</span>
            <span>Parking Lot</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            بنك الأفكار والـ Parking Lot
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            احفظ أفكارك هنا فوراً. لا تبدأ مشروعاً جديداً حتى تنهي ما بين يديك!
          </p>
        </div>

        <button
          onClick={() => setIsIdeaModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ تسجيل فكرة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.ideas.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-[#222222] bg-[#090909] p-12 text-center text-xs text-[#777777]">
            الـ Parking Lot فارغ حالياً. أي فكرة تخطر ببالك، اضغط "+ فكرة" لتفريغ ذهنك والاستمرار في التنفيذ.
          </div>
        ) : (
          state.ideas.map((idea) => (
            <div
              key={idea.id}
              className="flex flex-col justify-between rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4 hover:border-[#2f2f2f] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#777777]">
                  <span className="font-mono text-[#D4AF37]">{idea.createdAt}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#666666]">
                      {idea.status === 'converted' ? 'تم تحويلها لمشروع' : 'في الانتظار'}
                    </span>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-[#555555] hover:text-red-400 p-1"
                      title="حذف الفكرة"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-semibold text-[#F5F5F5]">
                  {idea.title}
                </h3>

                {idea.problem && (
                  <p className="text-xs text-[#aaaaaa]">
                    <span className="text-[#666666]">المشكلة: </span>
                    {idea.problem}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#777777] pt-1">
                  {idea.targetAudience && (
                    <span>العميل: {idea.targetAudience}</span>
                  )}
                  {idea.requiredSkill && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>المهارة: {idea.requiredSkill}</span>
                    </>
                  )}
                </div>

                {idea.notes && (
                  <div className="rounded bg-[#111111] p-2.5 text-[11px] text-[#888888] leading-relaxed border border-[#1a1a1a]">
                    {idea.notes}
                  </div>
                )}
              </div>

              {idea.status !== 'converted' && (
                <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                  <span className="text-[11px] text-[#666666]">هل حان وقت اختبارها؟</span>
                  <button
                    onClick={() => convertIdeaToProject(idea.id)}
                    className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
                  >
                    <span>تحويل لتجربة مشروع مصغر (Next)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
