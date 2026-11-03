/**
 * components/goals/GoalsView.tsx
 * نظام الأهداف الهرمي (Hierarchical Goals System)
 * Vision → Year Goal (2027) → Quarterly Goal (Q1-Q4) → Monthly Goal → Projects → Tasks
 * مع ميزة التحضير المسائي وتثبيت روابط التعلم المباشرة لخطة الصباح
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Plus,
  Compass,
  ArrowUpRight,
  FolderGit2,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  Moon,
  Sparkles,
  Send,
  Check,
  Link as LinkIcon,
  BookOpen,
} from 'lucide-react';
import { Goal, GoalQuarter, LifeArea } from '../../types';

export const GoalsView: React.FC = () => {
  const { state, addGoal, updateGoal, deleteGoal, setActiveTab, setEditingGoal, addTask } = useApp();

  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // حقول نموذج إضافة هدف جديد
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newQuarter, setNewQuarter] = useState<GoalQuarter>('Q1');
  const [newLifeArea, setNewLifeArea] = useState<LifeArea>('البرمجة');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [newExecutionGuide, setNewExecutionGuide] = useState('');

  // حالة كارت التحضير المسائي (Nightly Learning & Mission Prep)
  const [nightMissionTitle, setNightMissionTitle] = useState('');
  const [nightResourceLink, setNightResourceLink] = useState('');
  const [nightGuide, setNightGuide] = useState('');
  const [nightLinkedGoalId, setNightLinkedGoalId] = useState('');
  const [prepSuccessMessage, setPrepSuccessMessage] = useState(false);

  const filteredGoals = state.goals.filter((g) => {
    if (selectedQuarter !== 'all' && g.quarter !== selectedQuarter) return false;
    if (selectedArea !== 'all' && g.lifeArea !== selectedArea) return false;
    return true;
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const quarterThemes: Record<GoalQuarter, string> = {
      Q1: 'BUILD',
      Q2: 'APPLY',
      Q3: 'EARN',
      Q4: 'SCALE',
    };

    addGoal({
      title: newTitle.trim(),
      description: newDescription.trim() || 'هدف استراتيجي ضمن سنة البناء 2027',
      year: 2027,
      quarter: newQuarter,
      quarterTheme: quarterThemes[newQuarter],
      lifeArea: newLifeArea,
      progress: 0,
      status: 'not_started',
      resourceLink: newResourceLink.trim() || undefined,
      executionGuide: newExecutionGuide.trim() || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewResourceLink('');
    setNewExecutionGuide('');
    setIsAddModalOpen(false);
  };

  const handleQuickNightPrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nightMissionTitle.trim() && !nightResourceLink.trim()) return;

    const goalObj = state.goals.find((g) => g.id === nightLinkedGoalId);

    addTask({
      title: nightMissionTitle.trim() || (goalObj ? `تنفيذ مهمة تعلم: ${goalObj.title}` : 'جلسة تعلم وتنفيذ صباحية'),
      lifeArea: goalObj?.lifeArea || 'البرمجة',
      estimatedMinutes: 45,
      priority: 'high',
      status: 'todo',
      isTodayFocus: true,
      linkedGoalId: nightLinkedGoalId || undefined,
      resourceLink: nightResourceLink.trim() || undefined,
      executionGuide: nightGuide.trim() || undefined,
    });

    setNightMissionTitle('');
    setNightResourceLink('');
    setNightGuide('');
    setPrepSuccessMessage(true);
    setTimeout(() => setPrepSuccessMessage(false), 4500);
  };

  const handleProgressChange = (goal: Goal, delta: number) => {
    const nextProgress = Math.max(0, Math.min(100, goal.progress + delta));
    const nextStatus =
      nextProgress === 100
        ? 'completed'
        : nextProgress > 0
        ? 'in_progress'
        : 'not_started';

    updateGoal({
      ...goal,
      progress: nextProgress,
      status: nextStatus,
    });
  };

  const allLifeAreas: LifeArea[] = [
    'الدين',
    'الصحة',
    'التعلم',
    'البرمجة',
    'العمل',
    'المال',
    'التجارة',
    'المشروع',
    'العائلة',
    'العلاقات',
    'التطوير الشخصي',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* رأس نظام الأهداف */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>الهرم التنفيذي</span>
            <span>·</span>
            <span>Hierarchical Goals & Learning Pipeline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            أهداف سنة 2027 — سنة البناء
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            ربط الرؤية الكبرى بروابط التعلم اليومية وخطة التنفيذ الصباحية المباشرة.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة هدف سنوي</span>
        </button>
      </div>

      {/* كارت التحضير المسائي لمهام الغد والتعلم (Nightly Mission Prep Hub) */}
      <section className="rounded-2xl border-2 border-[var(--accent-gold)]/40 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] p-5 md:p-6 space-y-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>التحضير المسائي لمهام الغد والتعلم</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">
                  Nightly Routine
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                ضع الرابط قبل النوم (يوتيوب، كورس، توثيق، مقال) واكتب خطتك الصباحية؛ لتصحو صباحاً فتجد الرابط جاهزاً وتبدأ فوراً!
              </p>
            </div>
          </div>
          {prepSuccessMessage && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>تم إرسال المهمة لـ Morning Focus في شاشة اليوم! 🚀</span>
            </div>
          )}
        </div>

        <form onSubmit={handleQuickNightPrep} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                📌 عنوان المهمة أو موضوع التعلم:
              </label>
              <input
                type="text"
                placeholder="مثال: مذاكرة وتطبيق الـ React Server Components"
                value={nightMissionTitle}
                onChange={(e) => setNightMissionTitle(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                🔗 رابط المرجع أو الكورس (YouTube, GitHub, Docs, Article):
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... أو https://github.com/..."
                value={nightResourceLink}
                onChange={(e) => setNightResourceLink(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none font-mono text-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                📝 خطة وتوجيه التنفيذ الصباحي (أول ما أفتح التطبيق هعمل إيه؟):
              </label>
              <input
                type="text"
                placeholder="مثال: سأفتح الفيديو عند الدقيقة 15 وأكتب الكود داخل المشروع وأجربه عملياً..."
                value={nightGuide}
                onChange={(e) => setNightGuide(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                🎯 ربط بهدف من أهداف 2027:
              </label>
              <select
                value={nightLinkedGoalId}
                onChange={(e) => setNightLinkedGoalId(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="">(اختياري) اختر الهدف المرتبط...</option>
                {state.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.quarter})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-[var(--text-muted)]">
              💡 بمجرد الضغط على الحفظ، ستستيقظ صباحاً وتجد المهمة مع رابطها المباشر في شاشة <span className="text-[var(--accent-gold)] font-semibold">«تركيز اليوم (Morning Focus)»</span> بضغطة زر واحدة.
            </span>

            <button
              type="submit"
              disabled={!nightMissionTitle.trim() && !nightResourceLink.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-gold)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#e0bc45] transition-all disabled:opacity-40 shadow-sm shrink-0"
            >
              <Send className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>🌙 حفظ وتثبيت في خطة الصباح</span>
            </button>
          </div>
        </form>
      </section>

      {/* خريطة الفصول الأربعة لسنة 2027 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { q: 'Q1', theme: 'BUILD', desc: 'الأساسيات، البرمجة، وبناء النظام' },
          { q: 'Q2', theme: 'APPLY', desc: 'مشاريع واقعية، AI، وأول خدمة' },
          { q: 'Q3', theme: 'EARN', desc: 'أول دخل حقيقي، أول عملاء، وتجارة' },
          { q: 'Q4', theme: 'SCALE', desc: 'أتمتة العمليات ومراجعة الإنجازات' },
        ].map((item) => (
          <div
            key={item.q}
            onClick={() => setSelectedQuarter(selectedQuarter === item.q ? 'all' : item.q)}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              selectedQuarter === item.q
                ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 shadow-sm'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-color)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[var(--accent-gold)]">{item.q}</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">{item.theme}</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-medium mt-2">{item.desc}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-2">
              {state.goals.filter((g) => g.quarter === item.q).length} أهداف مسجلة
            </div>
          </div>
        ))}
      </div>

      {/* شريط الفلاتر */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs text-[var(--text-muted)] ml-2">فلترة حسب المجال:</span>
        <button
          onClick={() => setSelectedArea('all')}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            selectedArea === 'all'
              ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] font-medium'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          كل المجالات
        </button>
        {allLifeAreas.map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(selectedArea === area ? 'all' : area)}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              selectedArea === area
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* قائمة الأهداف */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)]">
            لا توجد أهداف تطابق الفلتر الحالي.
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const linkedProjects = state.projects.filter((p) => p.linkedGoalId === goal.id);

            return (
              <div
                key={goal.id}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 hover:border-[var(--accent-gold)]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[var(--accent-gold)] font-bold">
                        {goal.quarter} — {goal.quarterTheme}
                      </span>
                      <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-muted)]">{goal.lifeArea}</span>
                      <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-muted)] font-mono">{goal.year}</span>
                    </div>

                    <h3 className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                      {goal.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-3xl">
                      {goal.description}
                    </p>

                    {/* رابط المرجع وخطة التنفيذ إذا كان مسجلاً بالهدف */}
                    {(goal.resourceLink || goal.executionGuide) && (
                      <div className="mt-2 p-3 rounded-xl border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/5 space-y-1.5 text-xs max-w-3xl">
                        {goal.executionGuide && (
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            <span className="font-bold text-[var(--accent-gold)] block mb-0.5">💡 خطة وتوجيه التنفيذ:</span>
                            {goal.executionGuide}
                          </p>
                        )}
                        {goal.resourceLink && (
                          <a
                            href={goal.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline pt-0.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            <span>فتح رابط المرجع والتعلم المباشر ↗</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 self-start shrink-0">
                    <button
                      onClick={() => {
                        setNightLinkedGoalId(goal.id);
                        setNightMissionTitle(`مهمة تطبيقية لهدف: ${goal.title}`);
                        if (goal.resourceLink) setNightResourceLink(goal.resourceLink);
                        if (goal.executionGuide) setNightGuide(goal.executionGuide);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
                      title="تحضير مهمة لهذا الهدف للغد"
                    >
                      <Moon className="h-3 w-3" />
                      <span>تحضير ليلة</span>
                    </button>
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-elevated)]"
                      title="تعديل الهدف"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('حذف هذا الهدف؟')) deleteGoal(goal.id);
                      }}
                      className="text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-[var(--bg-elevated)]"
                      title="حذف الهدف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* نسبة الإنجاز والتحكم اليدوي السريع */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">مستوى التقدم الفعلي:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProgressChange(goal, -10)}
                        className="h-6 w-6 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono"
                      >
                        -
                      </button>
                      <span className="font-mono tabular-nums text-[var(--accent-gold)] font-semibold min-w-[40px] text-center">
                        {goal.progress}%
                      </span>
                      <button
                        onClick={() => handleProgressChange(goal, 10)}
                        className="h-6 w-6 rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-gold)] transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* المشاريع المرتبطة بهذا الهدف */}
                {linkedProjects.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                      <FolderGit2 className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
                      <span>المشاريع النشطة المنفذة لهذا الهدف ({linkedProjects.length}):</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {linkedProjects.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setActiveTab('projects')}
                          className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5 text-xs cursor-pointer hover:border-[var(--accent-gold)]/40 transition-colors"
                        >
                          <span className="font-medium text-[var(--text-primary)]">{p.title}</span>
                          <span className="font-mono text-[10px] text-[var(--accent-gold)]">{p.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* نافذة إضافة هدف جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--accent-gold)]" />
                <span>إضافة هدف استراتيجي لسنة 2027</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">اسم الهدف:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إتقان أساسيات JavaScript وبناء تطبيقات تفاعلية"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">الوصف والنتيجة المرجوة:</label>
                <textarea
                  rows={2}
                  placeholder="ما هو الأثر الذي سيتركه هذا الهدف على حياتك ودخلك؟"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">الربع السنوي (2027):</label>
                  <select
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value as GoalQuarter)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    <option value="Q1">Q1 — BUILD (البناء والتأسيس)</option>
                    <option value="Q2">Q2 — APPLY (التطبيق والذكاء الاصطناعي)</option>
                    <option value="Q3">Q3 — EARN (أول دخل وعملاء)</option>
                    <option value="Q4">Q4 — SCALE (التحسين والأتمتة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">مجال الحياة:</label>
                  <select
                    value={newLifeArea}
                    onChange={(e) => setNewLifeArea(e.target.value as LifeArea)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    {allLifeAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* حقول رابط التعلم وخطة التنفيذ في الهدف */}
              <div className="space-y-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
                    🔗 رابط المرجع أو الكورس الأساسي (اختياري):
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newResourceLink}
                    onChange={(e) => setNewResourceLink(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none font-mono text-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1 font-medium">
                    💡 خطة وتوجيه التنفيذ (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مذاكرة ساعة يومياً وتطبيق مشروع كل أسبوعين..."
                    value={newExecutionGuide}
                    onChange={(e) => setNewExecutionGuide(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[var(--border-color)] px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  حفظ الهدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
