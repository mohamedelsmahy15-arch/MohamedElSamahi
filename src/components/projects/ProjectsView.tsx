/**
 * components/projects/ProjectsView.tsx
 * نظام إدارة المشاريع والتنفيذ (Projects & Milestones Engine)
 * يفرض قاعدة: "أقصى 3 مشاريع نشطة في نفس الوقت" لمنع التشتت والاحتراق
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Calendar,
  Layers,
  Edit3,
  LayoutGrid,
  List,
} from 'lucide-react';
import { LifeArea, Project, ProjectStatus } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    state,
    activeProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectMilestone,
    setEditingProject,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('active');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // حقول إضافة مشروع
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('البرمجة');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [targetDate, setTargetDate] = useState('2027-03-31');

  // إضافة مرحلة لمشروع
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<{ [projectId: string]: string }>({});

  const filteredProjects = state.projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject({
      title: title.trim(),
      description: description.trim() || 'مشروع تنفيذي لسنة 2027',
      lifeArea,
      status,
      targetDate,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'التخطيط وتحديد المتطلبات', completed: true },
        { id: `m-${Date.now()}-2`, title: 'بناء النموذج الأولي (Prototype)', completed: false },
        { id: `m-${Date.now()}-3`, title: 'الإطلاق والاختبار الواقعي', completed: false },
      ],
    });

    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  const handleAddMilestone = (projectId: string) => {
    const mTitle = newMilestoneTitle[projectId]?.trim();
    if (!mTitle) return;

    const proj = state.projects.find((p) => p.id === projectId);
    if (!proj) return;

    updateProject({
      ...proj,
      milestones: [
        ...proj.milestones,
        { id: `m-${Date.now()}`, title: mTitle, completed: false },
      ],
    });

    setNewMilestoneTitle({ ...newMilestoneTitle, [projectId]: '' });
  };

  const handleStatusChange = (project: Project, newStatus: ProjectStatus) => {
    updateProject({
      ...project,
      status: newStatus,
    });
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
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة وقاعدة الـ 3 مشاريع */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>التنفيذ والمحطات</span>
            <span>·</span>
            <span>Execution Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            المشاريع النشطة والتجارب
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "لا تبدأ 20 مشروعاً. أنهِ المشروع الحالي وانتقل للتالي."
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إنشاء مشروع جديد</span>
        </button>
      </div>

      {/* شريط حالة المشاريع النشطة (مكافحة التشتت) */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--accent-gold)]">
            {activeProjects.length}/3
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              المشاريع قيد التنفيذ الآن: {activeProjects.length} من أصل 3
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {activeProjects.length >= 3
                ? 'وصلت للحد الأقصى المسموح لضمان الجودة وتركيز الطاقة.'
                : `يمكنك تفعيل ${3 - activeProjects.length} مشروع إضافي.`}
            </div>
          </div>
        </div>

        {activeProjects.length >= 3 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>نظام منع التشتت مفعل</span>
          </div>
        )}
      </div>

      {/* فلاتر الحالات ونمط العرض (Grid / List) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border-color)] self-start w-fit text-xs">
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'active'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            النشطة ({state.projects.filter((p) => p.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveFilter('next')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'next'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            القادمة Next ({state.projects.filter((p) => p.status === 'next').length})
          </button>
          <button
            onClick={() => setActiveFilter('parking_lot')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'parking_lot'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            المؤجلة Parking Lot ({state.projects.filter((p) => p.status === 'parking_lot').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'completed'
                ? 'bg-[var(--bg-elevated)] text-emerald-400'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            المكتملة ({state.projects.filter((p) => p.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded transition-colors ${
              activeFilter === 'all'
                ? 'bg-[var(--bg-elevated)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            الكل ({state.projects.length})
          </button>
        </div>

        {/* View Switcher: Grid vs List */}
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border-color)] self-start sm:self-auto text-xs">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              layoutMode === 'grid'
                ? 'bg-[var(--accent-gold)] text-black font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="عرض شبكي (Grid View)"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>شبكة</span>
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              layoutMode === 'list'
                ? 'bg-[var(--accent-gold)] text-black font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="عرض قائمة (List View)"
          >
            <List className="h-3.5 w-3.5" />
            <span>قائمة</span>
          </button>
        </div>
      </div>

      {/* قائمة المشاريع في نمط القائمة (List View) */}
      {layoutMode === 'list' && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden divide-y divide-[#1a1a1a]">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--text-muted)]">
              لا توجد مشاريع في هذا القسم حالياً.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const completedCount = project.milestones.filter((m) => m.completed).length;
              const remainingCount = project.milestones.length - completedCount;

              return (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <div className="space-y-1 min-w-0 max-w-md">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[var(--accent-gold)] font-semibold text-[11px]">
                        {project.status.toUpperCase()}
                      </span>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-muted)]">{project.lifeArea}</span>
                      {project.targetDate && (
                        <>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-[var(--text-muted)] font-mono text-[11px]">
                            التسليم: {project.targetDate}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {project.description}
                    </p>
                  </div>

                  {/* Progress Bar & Milestones Remaining */}
                  <div className="flex items-center gap-6 text-xs">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[var(--text-muted)]">المراحل: {completedCount}/{project.milestones.length}</span>
                        <span className="text-[var(--accent-gold)] font-bold tabular-nums">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent-gold)] transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-center font-mono text-xs">
                      <div className="text-[10px] text-[var(--text-muted)]">المتبقي</div>
                      <div className="font-bold text-[var(--text-primary)]">{remainingCount} مهام</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40"
                        title="تعديل المشروع"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) deleteProject(project.id);
                        }}
                        className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-2 text-[var(--text-muted)] hover:text-red-400"
                        title="حذف المشروع"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* قائمة بطاقات المشاريع والمراحل (Grid View) */}
      {layoutMode === 'grid' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)]">
            لا توجد مشاريع في هذا القسم حالياً.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const completedCount = project.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 hover:border-[var(--border-color)] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[var(--accent-gold)] font-semibold">
                          {project.status.toUpperCase()}
                        </span>
                        <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                        <span className="text-[var(--text-muted)]">{project.lifeArea}</span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                        title="تعديل المشروع"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) deleteProject(project.id);
                        }}
                        className="text-[var(--text-muted)] hover:text-red-400 p-1"
                        title="حذف المشروع"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* شريط الإنجاز الرقمي */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">المراحل المنجزة: {completedCount}/{project.milestones.length}</span>
                      <span className="text-[var(--accent-gold)] font-bold tabular-nums">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-gold)] transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* المراحل التنفيذية (Milestones Checklist) */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center justify-between">
                      <span>محطات المشروع (Milestones):</span>
                      {project.targetDate && (
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          تاريخ التسليم: {project.targetDate}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {project.milestones.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => toggleProjectMilestone(project.id, m.id)}
                          className="flex w-full items-center gap-2.5 rounded-lg bg-[var(--bg-elevated)] p-2 text-right text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                          )}
                          <span className={`flex-1 truncate ${m.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                            {m.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* إضافة مرحلة جديدة سريعة للمشروع */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="+ إضافة محطة جديدة للمشروع..."
                        value={newMilestoneTitle[project.id] || ''}
                        onChange={(e) =>
                          setNewMilestoneTitle({
                            ...newMilestoneTitle,
                            [project.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddMilestone(project.id);
                        }}
                        className="flex-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddMilestone(project.id)}
                        className="rounded-md bg-[var(--bg-elevated)] px-2.5 py-1 text-xs text-[var(--accent-gold)] hover:bg-[var(--bg-elevated)]"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>

                {/* تغيير حالة ومسار المشروع */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs">
                  <span className="text-[var(--text-muted)]">المسار:</span>
                  <div className="flex items-center gap-1">
                    {(['active', 'next', 'parking_lot', 'completed'] as ProjectStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(project, st)}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            project.status === st
                              ? 'bg-[var(--bg-elevated)] text-[var(--accent-gold)] font-semibold'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                          }`}
                        >
                          {st === 'active'
                            ? 'نشط'
                            : st === 'next'
                            ? 'Next'
                            : st === 'parking_lot'
                            ? 'مؤجل'
                            : 'مكتمل'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* نافذة إنشاء مشروع جديد */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                إنشاء مشروع جديد
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم المشروع:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تطبيق متجر إلكتروني مصغر مع ربط الدفع"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوصف والنتيجة المرجوة:</label>
                <textarea
                  rows={2}
                  placeholder="ما الذي ستحققه بهذا المشروع؟"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">الحالة الأولية:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    <option value="active">نشط (Active — أقصى 3 مشاريع)</option>
                    <option value="next">القادم (Next)</option>
                    <option value="parking_lot">مؤجل (Parking Lot)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">تاريخ الإنجاز المستهدف:</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  إنشاء المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
