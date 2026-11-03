/**
 * components/common/EditProjectModal.tsx
 * تعديل أي مشروع وتحديث مراحله ومساره بسهولة
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeArea, ProjectStatus } from '../../types';
import { Edit3, Trash2 } from 'lucide-react';

export const EditProjectModal: React.FC = () => {
  const { editingProject, setEditingProject, updateProject, deleteProject } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description);
      setLifeArea(editingProject.lifeArea);
      setStatus(editingProject.status);
      setTargetDate(editingProject.targetDate || '');
    }
  }, [editingProject]);

  if (!editingProject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateProject({
      ...editingProject,
      title: title.trim(),
      description: description.trim(),
      lifeArea,
      status,
      targetDate: targetDate || undefined,
    });

    setEditingProject(null);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع بالكامل؟')) {
      deleteProject(editingProject.id);
      setEditingProject(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">تعديل بيانات المشروع</h2>
          </div>
          <button onClick={() => setEditingProject(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم المشروع:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوصف والهدف:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">مسار المشروع:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="active">نشط (Active — أقصى 3 مشاريع)</option>
                <option value="next">القادم (Next)</option>
                <option value="parking_lot">مؤجل (Parking Lot)</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">تاريخ الإنجاز المستهدف:</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
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
              <span>حذف المشروع</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
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
          </div>
        </form>
      </div>
    </div>
  );
};
