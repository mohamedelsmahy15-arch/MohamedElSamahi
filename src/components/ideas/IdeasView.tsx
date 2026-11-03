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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>مصيدة التشتت</span>
            <span>·</span>
            <span>Parking Lot</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            بنك الأفكار والـ Parking Lot
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            احفظ أفكارك هنا فوراً. لا تبدأ مشروعاً جديداً حتى تنهي ما بين يديك!
          </p>
        </div>

        <button
          onClick={() => setIsIdeaModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ تسجيل فكرة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.ideas.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)]">
            الـ Parking Lot فارغ حالياً. أي فكرة تخطر ببالك، اضغط "+ فكرة" لتفريغ ذهنك والاستمرار في التنفيذ.
          </div>
        ) : (
          state.ideas.map((idea) => (
            <div
              key={idea.id}
              className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 hover:border-[var(--border-color)] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="font-mono text-[var(--accent-gold)]">{idea.createdAt}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {idea.status === 'converted' ? 'تم تحويلها لمشروع' : 'في الانتظار'}
                    </span>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-[var(--text-muted)] hover:text-red-400 p-1"
                      title="حذف الفكرة"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                  {idea.title}
                </h3>

                {idea.problem && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)]">المشكلة: </span>
                    {idea.problem}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)] pt-1">
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
                  <div className="rounded bg-[var(--bg-elevated)] p-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed border border-[var(--border-color)]">
                    {idea.notes}
                  </div>
                )}
              </div>

              {idea.status !== 'converted' && (
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">هل حان وقت اختبارها؟</span>
                  <button
                    onClick={() => convertIdeaToProject(idea.id)}
                    className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)] hover:underline"
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
