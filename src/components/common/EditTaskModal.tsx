/**
 * components/common/EditTaskModal.tsx
 * تعديل أي مهمة بسهولة وسرعة (العنوان، الوقت، الأولوية، المجال، الربط بمشروع)
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeArea, TaskPriority, TaskStatus } from '../../types';
import { Edit3, Trash2 } from 'lucide-react';

export const EditTaskModal: React.FC = () => {
  const { editingTask, setEditingTask, updateTask, deleteTask, state } = useApp();

  const [title, setTitle] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [actualMinutes, setActualMinutes] = useState<number | ''>('');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [linkedProjectId, setLinkedProjectId] = useState<string>('');
  const [isTodayFocus, setIsTodayFocus] = useState(false);
  const [resourceLink, setResourceLink] = useState('');
  const [executionGuide, setExecutionGuide] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setLifeArea(editingTask.lifeArea);
      setEstimatedMinutes(editingTask.estimatedMinutes);
      setActualMinutes(editingTask.actualMinutes !== undefined ? editingTask.actualMinutes : '');
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setLinkedProjectId(editingTask.linkedProjectId || '');
      setIsTodayFocus(editingTask.isTodayFocus);
      setResourceLink(editingTask.resourceLink || '');
      setExecutionGuide(editingTask.executionGuide || '');
    }
  }, [editingTask]);

  if (!editingTask) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask({
      ...editingTask,
      title: title.trim(),
      lifeArea,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      actualMinutes: actualMinutes !== '' ? Number(actualMinutes) : undefined,
      priority,
      status,
      linkedProjectId: linkedProjectId || undefined,
      isTodayFocus,
      resourceLink: resourceLink.trim() || undefined,
      executionGuide: executionGuide.trim() || undefined,
    });

    setEditingTask(null);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      deleteTask(editingTask.id);
      setEditingTask(null);
    }
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
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-[var(--accent-gold)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">تعديل بيانات المهمة</h2>
          </div>
          <button onClick={() => setEditingTask(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم المهمة:</label>
            <input
              type="text"
              required
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
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوقت المخطط (دقيقة):</label>
              <input
                type="number"
                min={5}
                max={360}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوقت الفعلي المستغرق (دقيقة):</label>
              <input
                type="number"
                min={0}
                max={600}
                placeholder="مثال: 45 (اختياري)"
                value={actualMinutes}
                onChange={(e) => setActualMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="strategic">استراتيجية (عالية القيمة)</option>
                <option value="high">عالية</option>
                <option value="normal">عادية</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-medium">الحالة:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="todo">لم تبدأ بعد</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">تمت بنجاح</option>
                <option value="deferred">مؤجلة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-1 font-medium">المشروع المرتبط:</label>
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

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-[#cccccc] cursor-pointer">
              <input
                type="checkbox"
                checked={isTodayFocus}
                onChange={(e) => setIsTodayFocus(e.target.checked)}
                className="h-4 w-4 rounded accent-[#D4AF37]"
              />
              <span>تثبيت كإحدى أهم 3 مهام لليوم (Today's Focus)</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>حذف المهمة</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
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
