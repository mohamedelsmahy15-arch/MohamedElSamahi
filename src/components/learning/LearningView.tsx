/**
 * components/learning/LearningView.tsx
 * معمل التعلم والتطبيق (Learning & Practice Lab)
 * يحمي محمد من فخ "التعلم السلبي" بربط كل مهارة برمجية أو تجارية بمشروع تطبيقي مباشر
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  Target,
  Clock,
  BookOpen,
  ArrowUpRight,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { LearningSkill } from '../../types';

export const LearningView: React.FC = () => {
  const {
    learningSkills,
    addLearningSkill,
    updateLearningSkill,
    deleteLearningSkill,
    setActiveTab,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingSkill, setEditingSkill] = useState<LearningSkill | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'برمجة وذكاء اصطناعي' | 'تجارة وبزنس' | 'تسويق ومبيعات' | 'إنتاجية وفكر'>('برمجة وذكاء اصطناعي');
  const [masteryPercentage, setMasteryPercentage] = useState(50);
  const [targetProject, setTargetProject] = useState('');
  const [status, setStatus] = useState<'active' | 'applied' | 'mastered'>('applied');
  const [hoursLogged, setHoursLogged] = useState(10);
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setName('');
    setCategory('برمجة وذكاء اصطناعي');
    setMasteryPercentage(50);
    setTargetProject('');
    setStatus('applied');
    setHoursLogged(10);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: LearningSkill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setMasteryPercentage(skill.masteryPercentage);
    setTargetProject(skill.targetProject);
    setStatus(skill.status);
    setHoursLogged(skill.hoursLogged);
    setNotes(skill.notes);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSkill) {
      updateLearningSkill({
        ...editingSkill,
        name: name.trim(),
        category,
        masteryPercentage: Number(masteryPercentage),
        targetProject: targetProject.trim() || 'مشروع تطبيقي مباشر',
        status,
        hoursLogged: Number(hoursLogged),
        notes: notes.trim(),
      });
    } else {
      addLearningSkill({
        name: name.trim(),
        category,
        masteryPercentage: Number(masteryPercentage),
        targetProject: targetProject.trim() || 'مشروع تطبيقي مباشر',
        status,
        hoursLogged: Number(hoursLogged),
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleAdjustHours = (skill: LearningSkill, delta: number) => {
    const nextHours = Math.max(0, skill.hoursLogged + delta);
    updateLearningSkill({
      ...skill,
      hoursLogged: nextHours,
    });
  };

  const filteredSkills = learningSkills.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    return true;
  });

  const totalPracticeHours = learningSkills.reduce((acc, curr) => acc + curr.hoursLogged, 0);
  const avgMastery =
    learningSkills.length > 0
      ? Math.round(learningSkills.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / learningSkills.length)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>التعلم والتطبيق</span>
            <span>·</span>
            <span>Learning Lab</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            معمل المهارات والتطبيق العملي
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "مشاهدة الكورسات دون كتابة كود أو بناء مشروع تساوي صفراً. كل مهارة هنا مرتبطة بمشروع حي تدعمه."
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black transition-all hover:opacity-90 self-start sm:self-auto shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة مهارة جديدة</span>
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">المهارات النشطة</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            {learningSkills.length}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">مهارات تحت التطوير والتطبيق</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">ساعات الممارسة الفعلية</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-[var(--accent-gold)] tabular-nums">
            {totalPracticeHours} <span className="text-xs font-normal">ساعة</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">تطبيق عملي وكتابة كود</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">متوسط الإتقان</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-emerald-400 tabular-nums">
            {avgMastery}%
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">مقياس الجاهزية للسوق</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">القاعدة الذهبية</div>
          <div className="text-xs font-semibold text-[var(--text-primary)] truncate mt-1">
            Build First
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">لا تتعلم شيئاً لا تحتاجه اليوم</div>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 flex items-center justify-center shrink-0">
            <Target className="h-4 w-4 text-[var(--accent-gold)]" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              سؤال النظام الإجباري لمكافحة التشتت
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              "إيه المشروع اللي هتستخدم فيه المهارة دي فوراً؟ إذا لم يكن هناك مشروع تنفيذي، لا تهدر وقتك في دراستها الآن."
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('projects')}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <span>تصفح المشاريع المرتبطة</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[var(--text-muted)] shrink-0">التصنيف:</span>
        {[
          { id: 'all', label: 'الكل' },
          { id: 'برمجة وذكاء اصطناعي', label: 'برمجة وذكاء اصطناعي' },
          { id: 'تجارة وبزنس', label: 'تجارة وبزنس' },
          { id: 'تسويق ومبيعات', label: 'تسويق ومبيعات' },
          { id: 'إنتاجية وفكر', label: 'إنتاجية وفكر' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterCategory(f.id)}
            className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
              filterCategory === f.id
                ? 'bg-[var(--accent-gold)] text-black font-semibold'
                : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)]">
            لا توجد مهارات مسجلة في هذا التصنيف. اضغط زر الإضافة بالأعلى للبدء.
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const isMastered = skill.status === 'mastered';
            const isApplied = skill.status === 'applied';

            return (
              <div
                key={skill.id}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 hover:border-[var(--accent-gold)]/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="font-mono text-[var(--accent-gold)]">{skill.category}</span>
                        <span>·</span>
                        <span>
                          {skill.status === 'mastered'
                            ? 'مهارة مثبتة'
                            : skill.status === 'applied'
                            ? 'قيد التطبيق العملي'
                            : 'قيد التعلم'}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] leading-snug">
                        {skill.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition-colors"
                        title="تعديل المهارة"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`حذف مهارة "${skill.name}"؟`)) deleteLearningSkill(skill.id);
                        }}
                        className="text-[var(--text-muted)] hover:text-red-400 p-1 transition-colors"
                        title="حذف المهارة"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Linked Project Anchor */}
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 text-xs space-y-1">
                    <div className="text-[10px] text-[var(--accent-gold)] font-medium flex items-center gap-1.5">
                      <Code2 className="h-3 w-3" />
                      <span>المشروع التطبيقي المباشر:</span>
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">
                      {skill.targetProject}
                    </p>
                  </div>

                  {skill.notes && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {skill.notes}
                    </p>
                  )}
                </div>

                {/* Progress & Practice Hours */}
                <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                  {/* Mastery Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">نسبة الإتقان:</span>
                      <span className="font-mono text-[var(--text-primary)] font-bold tabular-nums">
                        {skill.masteryPercentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-gold)] transition-all duration-300"
                        style={{ width: `${skill.masteryPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Practice Hours Counter & Status */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)]">الممارسة:</span>
                      <button
                        onClick={() => handleAdjustHours(skill, -1)}
                        className="h-5 w-5 rounded border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
                        {skill.hoursLogged} س
                      </span>
                      <button
                        onClick={() => handleAdjustHours(skill, 1)}
                        className="h-5 w-5 rounded border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const nextStatus =
                          skill.status === 'active'
                            ? 'applied'
                            : skill.status === 'applied'
                            ? 'mastered'
                            : 'active';
                        updateLearningSkill({ ...skill, status: nextStatus });
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                        isMastered
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : isApplied
                          ? 'border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {skill.status === 'mastered'
                        ? 'متقنة ⚡'
                        : skill.status === 'applied'
                        ? 'قيد التطبيق'
                        : 'قيد التعلم'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {editingSkill ? 'تعديل بيانات المهارة' : 'إضافة مهارة جديدة للتعلم'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">اسم المهارة:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: TypeScript Advanced Generics أو WhatsApp API"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">التصنيف:</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  >
                    <option value="برمجة وذكاء اصطناعي">برمجة وذكاء اصطناعي</option>
                    <option value="تجارة وبزنس">تجارة وبزنس</option>
                    <option value="تسويق ومبيعات">تسويق ومبيعات</option>
                    <option value="إنتاجية وفكر">إنتاجية وفكر</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">الحالة:</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  >
                    <option value="active">قيد التعلم</option>
                    <option value="applied">قيد التطبيق العملي</option>
                    <option value="mastered">مهارة مثبتة</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">
                  المشروع التطبيقي المباشر (إلزامي لضمان التطبيق):
                </label>
                <input
                  type="text"
                  required
                  value={targetProject}
                  onChange={(e) => setTargetProject(e.target.value)}
                  placeholder="مثال: السماحي OS أو نموذج خدمة Landing Page لعميل"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">نسبة الإتقان ({masteryPercentage}%):</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={masteryPercentage}
                    onChange={(e) => setMasteryPercentage(Number(e.target.value))}
                    className="w-full accent-[var(--accent-gold)] mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">ساعات الممارسة:</label>
                  <input
                    type="number"
                    min="0"
                    value={hoursLogged}
                    onChange={(e) => setHoursLogged(Number(e.target.value))}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">ملاحظات ومصادر التطبيق:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات مهمة، روابط توثيق، أو أخطاء تم حلها أثناء كتابة الكود"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--accent-gold)] text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingSkill ? 'حفظ التعديلات' : 'إضافة المهارة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
