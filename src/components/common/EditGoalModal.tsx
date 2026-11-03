/**
 * components/common/EditGoalModal.tsx
 * تعديل أي هدف سنوي أو ربع سنوي بسهولة تامة
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalQuarter, LifeArea } from '../../types';
import { Edit3, Trash2 } from 'lucide-react';

export const EditGoalModal: React.FC = () => {
  const { editingGoal, setEditingGoal, updateGoal, deleteGoal } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quarter, setQuarter] = useState<GoalQuarter>('Q1');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [progress, setProgress] = useState(0);
  const [resourceLink, setResourceLink] = useState('');
  const [actionPlanNotes, setActionPlanNotes] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setQuarter(editingGoal.quarter);
      setLifeArea(editingGoal.lifeArea);
      setProgress(editingGoal.progress);
      setResourceLink(editingGoal.resourceLink || '');
      setActionPlanNotes(editingGoal.actionPlanNotes || '');
    }
  }, [editingGoal]);

  if (!editingGoal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const quarterThemes: Record<GoalQuarter, string> = {
      Q1: 'BUILD',
      Q2: 'APPLY',
      Q3: 'EARN',
      Q4: 'SCALE',
    };

    updateGoal({
      ...editingGoal,
      title: title.trim(),
      description: description.trim(),
      quarter,
      quarterTheme: quarterThemes[quarter],
      lifeArea,
      progress: Number(progress) || 0,
      resourceLink: resourceLink.trim() || undefined,
      actionPlanNotes: actionPlanNotes.trim() || undefined,
    });

    setEditingGoal(null);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا الهدف؟')) {
      deleteGoal(editingGoal.id);
      setEditingGoal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">تعديل بيانات الهدف</h2>
          </div>
          <button onClick={() => setEditingGoal(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم الهدف:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوصف والنتيجة المرجوة:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الربع السنوي:</label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as GoalQuarter)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="Q1">Q1 — BUILD (البناء)</option>
                <option value="Q2">Q2 — APPLY (التطبيق)</option>
                <option value="Q3">Q3 — EARN (الدخل)</option>
                <option value="Q4">Q4 — SCALE (التوسع)</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">نسبة الإنجاز ({progress}%):</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>حذف الهدف</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-white"
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
          </div>
        </form>
      </div>
    </div>
  );
};
