/**
 * components/business/BusinessView.tsx
 * معمل الأعمال ومختبر تجارب الدخل (Business & Income Lab)
 * مصمم كلوحة إدارة شركات ناشئة لاختبار الفرص التجارية الواقعية
 * بنظام المراحل السبعة: Idea · Research · Testing · First Customer · Validated · Profitable · Stopped
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Users,
  Target,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ExperimentStatus, IncomeExperiment } from '../../types';

const STAGES: { id: ExperimentStatus; labelAr: string; color: string }[] = [
  { id: 'Idea', labelAr: 'فكرة (Idea)', color: 'text-neutral-400 border-neutral-700 bg-neutral-900/50' },
  { id: 'Research', labelAr: 'بحث ودراسة (Research)', color: 'text-sky-400 border-sky-800/40 bg-sky-950/20' },
  { id: 'Testing', labelAr: 'اختبار بالسوق (Testing)', color: 'text-amber-400 border-amber-800/40 bg-amber-950/20' },
  { id: 'First Customer', labelAr: 'أول عميل تحقق (First Customer)', color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20' },
  { id: 'Validated', labelAr: 'مثبتة تجارياً (Validated)', color: 'text-teal-400 border-teal-800/40 bg-teal-950/20' },
  { id: 'Profitable', labelAr: 'مربحة ومستدامة (Profitable)', color: 'text-[var(--accent-gold)] border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10' },
  { id: 'Stopped', labelAr: 'متوقفة (Stopped)', color: 'text-rose-400 border-rose-900/40 bg-rose-950/20' },
];

export const BusinessView: React.FC = () => {
  const {
    state,
    addIncomeExperiment,
    updateIncomeExperiment,
    deleteIncomeExperiment,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStage, setFilterStage] = useState<string>('all');

  // Form states
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [targetClient, setTargetClient] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [requiredCapital, setRequiredCapital] = useState('300');
  const [requiredTimeHours, setRequiredTimeHours] = useState('15');
  const [monetizationSource, setMonetizationSource] = useState('رسوم خدمة مدفوعة أو باقة عمل');
  const [testDurationDays, setTestDurationDays] = useState('14');
  const [status, setStatus] = useState<ExperimentStatus>('Testing');
  const [nextStep, setNextStep] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addIncomeExperiment({
      name: name.trim(),
      problem: problem.trim() || 'مشكلة سوق حقيقية يبحث أصحابها عن حل سريع',
      targetClient: targetClient.trim() || 'الشركات أو المتاجر المحلية',
      requiredSkill: requiredSkill.trim() || 'مهارة تقنية أو تسويقية عملية',
      requiredCapital: Number(requiredCapital) || 0,
      requiredTimeHours: Number(requiredTimeHours) || 15,
      monetizationSource: monetizationSource.trim() || 'تعاقد مباشر لكل مشروع',
      startDate: new Date().toISOString().split('T')[0],
      testDurationDays: Number(testDurationDays) || 14,
      targetClientsContacted: 20,
      status,
      learningsNotes: '',
      nextStep: nextStep.trim() || 'إعداد قائمة بأول 5 عملاء والتواصل معهم فوراً',
      outcomeNotes: 'بدأت التجربة حديثاً في معمل الأعمال',
    });

    setName('');
    setProblem('');
    setTargetClient('');
    setRequiredSkill('');
    setNextStep('');
    setIsModalOpen(false);
  };

  const handleUpdateContacted = (exp: IncomeExperiment, delta: number) => {
    const nextVal = Math.max(0, exp.actualClientsContacted + delta);
    let nextStatus = exp.status;
    if (nextVal >= 20 && exp.revenueEarned > 0) {
      nextStatus = 'Validated';
    } else if (nextVal > 0 && exp.revenueEarned > 0 && exp.status === 'Testing') {
      nextStatus = 'First Customer';
    }

    updateIncomeExperiment({
      ...exp,
      actualClientsContacted: nextVal,
      status: nextStatus,
    });
  };

  const handleUpdateRevenue = (exp: IncomeExperiment) => {
    const amountStr = prompt('أدخل قيمة الإيراد الجديد المتحقق بالجنيه (ج.م):', '2000');
    if (amountStr) {
      const added = Number(amountStr);
      if (!isNaN(added) && added > 0) {
        const nextRev = exp.revenueEarned + added;
        let nextStatus = exp.status;
        if (exp.status === 'Idea' || exp.status === 'Research' || exp.status === 'Testing') {
          nextStatus = 'First Customer';
        }
        updateIncomeExperiment({
          ...exp,
          revenueEarned: nextRev,
          status: nextStatus,
        });
      }
    }
  };

  const handleUpdateNextStep = (exp: IncomeExperiment) => {
    const newStep = prompt('حدّد الخطوة القادمة المحسومة لهذه التجربة:', exp.nextStep || '');
    if (newStep !== null) {
      updateIncomeExperiment({
        ...exp,
        nextStep: newStep.trim(),
      });
    }
  };

  const handleAdvanceStage = (exp: IncomeExperiment) => {
    const stageIds: ExperimentStatus[] = ['Idea', 'Research', 'Testing', 'First Customer', 'Validated', 'Profitable'];
    const currentIdx = stageIds.indexOf(exp.status as any);
    if (currentIdx !== -1 && currentIdx < stageIds.length - 1) {
      updateIncomeExperiment({
        ...exp,
        status: stageIds[currentIdx + 1],
      });
    }
  };

  // Aggregated Stats
  const totalRevenue = state.incomeExperiments.reduce((acc, curr) => acc + curr.revenueEarned, 0);
  const totalContacted = state.incomeExperiments.reduce((acc, curr) => acc + curr.actualClientsContacted, 0);
  const activeCount = state.incomeExperiments.filter((e) => e.status !== 'Stopped').length;

  const filteredExperiments = state.incomeExperiments.filter((exp) => {
    if (filterStage === 'all') return true;
    return exp.status === filterStage;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>معمل الأعمال</span>
            <span>·</span>
            <span>Startup & Income Incubator</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            مختبر مصادر الدخل والتجارب التجارية
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "لا تبنِ منتجاً في الظل لشهور. اختبر فرضيتك، تواصل مع 20 عميلاً مستهدفاً، وحقق أول إيراد حقيقي."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--accent-gold)] px-4 py-2 text-xs font-semibold text-black transition-all hover:opacity-90 self-start sm:self-auto shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إطلاق تجربة عمل جديدة</span>
        </button>
      </div>

      {/* 2. Startup Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">إجمالي الإيرادات المتحققة</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-emerald-400 tabular-nums">
            {totalRevenue.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">مال حقيقي مدفوع مقابل القيمة</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">التواصل مع العملاء</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {totalContacted} <span className="text-xs font-normal text-[var(--text-muted)]">اتصال</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">اختبارات مباشرة مع السوق</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">التجارب النشطة</div>
          <div className="font-mono text-xl md:text-2xl font-bold text-[var(--accent-gold)] tabular-nums">
            {activeCount}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">فرص قيد الاختبار والتحقق</div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-1">
          <div className="text-[11px] text-[var(--text-muted)] font-medium">معيار النجاح الصريح</div>
          <div className="text-xs font-bold text-[var(--text-primary)] truncate mt-1">
            20 عميل · أول جنيه
          </div>
          <div className="text-[10px] text-[var(--text-secondary)]">لا نجاح دون دفع مالي صريح</div>
        </div>
      </div>

      {/* 3. Stage Pipeline Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[var(--text-muted)] shrink-0 flex items-center gap-1">
          <Filter className="h-3 w-3" />
          <span>المرحلة:</span>
        </span>
        <button
          onClick={() => setFilterStage('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            filterStage === 'all'
              ? 'bg-[var(--accent-gold)] text-black font-semibold'
              : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          كافة التجارب ({state.incomeExperiments.length})
        </button>

        {STAGES.map((s) => {
          const count = state.incomeExperiments.filter((e) => e.status === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setFilterStage(s.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterStage === s.id
                  ? 'bg-[var(--accent-gold)] text-black font-semibold'
                  : 'border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {s.labelAr} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* 4. Startup Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredExperiments.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)]">
            لا توجد تجارب في هذه المرحلة حالياً. اضغط "+ إطلاق تجربة عمل جديدة" لبدء اختبار فرضية تجارية في السوق.
          </div>
        ) : (
          filteredExperiments.map((exp) => {
            const currentStageObj = STAGES.find((s) => s.id === exp.status) || STAGES[2];
            const clientsProgress = Math.min(
              100,
              Math.round((exp.actualClientsContacted / exp.targetClientsContacted) * 100)
            );

            return (
              <div
                key={exp.id}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 hover:border-[var(--accent-gold)]/40 transition-all flex flex-col justify-between shadow-sm"
              >
                {/* Card Header: Title & Stage */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${currentStageObj.color}`}
                        >
                          {currentStageObj.labelAr}
                        </span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span className="text-[var(--text-muted)] font-mono text-[11px]">
                          دورة {exp.testDurationDays || 14} يوماً
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight pt-1">
                        {exp.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`حذف تجربة "${exp.name}" ونقلها لسلة المهملات؟`)) {
                          deleteIncomeExperiment(exp.id);
                        }
                      }}
                      className="text-[var(--text-muted)] hover:text-rose-400 p-1 transition-colors"
                      title="حذف ونقل للسلة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Core Problem & Target Customer */}
                  <div className="space-y-2 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3">
                    <div>
                      <span className="text-[var(--text-muted)] font-medium">العميل المستهدف: </span>
                      <span className="text-[var(--text-primary)] font-semibold">{exp.targetClient}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-medium">المشكلة بالسوق: </span>
                      <span className="text-[var(--text-secondary)]">{exp.problem}</span>
                    </div>
                  </div>

                  {/* Metrics Row: Customer Touches & Revenue */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Customer Touches */}
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)] flex items-center gap-1">
                          <Users className="h-3 w-3 text-[var(--accent-gold)]" />
                          <span>العملاء:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateContacted(exp, -1)}
                            className="h-5 w-5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-[var(--text-primary)] font-bold tabular-nums">
                            {exp.actualClientsContacted}/{exp.targetClientsContacted}
                          </span>
                          <button
                            onClick={() => handleUpdateContacted(exp, 1)}
                            className="h-5 w-5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-mono text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent-gold)] transition-all duration-300"
                          style={{ width: `${clientsProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue Earned */}
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)]">الإيرادات المحققة:</div>
                        <div className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                          {exp.revenueEarned.toLocaleString()} ج.م
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateRevenue(exp)}
                        className="rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-[11px] text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/50 transition-colors"
                      >
                        + إيراد
                      </button>
                    </div>
                  </div>

                  {/* Next Step Banner */}
                  <div className="flex items-start justify-between gap-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] p-2.5 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[var(--accent-gold)] font-medium">الخطوة القادمة:</span>
                      <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                        {exp.nextStep || 'تحديد أول خطوة تواصل مع العملاء.'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleUpdateNextStep(exp)}
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline shrink-0 mt-0.5"
                    >
                      تعديل
                    </button>
                  </div>
                </div>

                {/* Card Footer: Stage Stepper & Outcome */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--text-muted)] text-[11px]">المرحلة:</span>
                    <select
                      value={exp.status}
                      onChange={(e) => updateIncomeExperiment({ ...exp, status: e.target.value as ExperimentStatus })}
                      className="rounded border border-[var(--border-color)] bg-[var(--bg-elevated)] px-2 py-1 text-[11px] text-[var(--text-primary)] outline-none"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.labelAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {exp.status !== 'Profitable' && exp.status !== 'Stopped' && (
                    <button
                      onClick={() => handleAdvanceStage(exp)}
                      className="flex items-center gap-1 text-[11px] text-[var(--accent-gold)] hover:underline font-medium"
                    >
                      <span>الترقية للمرحلة التالية</span>
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Modal: Launch New Income Experiment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[var(--accent-gold)]" />
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  إطلاق تجربة عمل جديدة في المعمل
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">اسم التجربة / العرض التجاري:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: خدمة أتمتة الردود على الواتساب للمتاجر المحلية"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">العميل المستهدف:</label>
                  <input
                    type="text"
                    required
                    value={targetClient}
                    onChange={(e) => setTargetClient(e.target.value)}
                    placeholder="مثال: متاجر الملابس على إنستغرام"
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">المرحلة الابتدائية:</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.labelAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">المشكلة الحقيقية التي تحلها للعميل:</label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="مثال: المتجر يفقد 40% من مبيعات السلة المتروكة بسبب تأخر الرد البشري"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">مدة الاختبار (أيام):</label>
                  <input
                    type="number"
                    value={testDurationDays}
                    onChange={(e) => setTestDurationDays(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[var(--text-secondary)]">طريقة التسعير والإيراد:</label>
                  <input
                    type="text"
                    value={monetizationSource}
                    onChange={(e) => setMonetizationSource(e.target.value)}
                    placeholder="مثال: 1500 ج.م إعداد + 500 ج.م شهرياً"
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[var(--text-secondary)]">الخطوة القادمة المحسومة (Next Step):</label>
                <input
                  type="text"
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  placeholder="مثال: إعداد قائمة بـ 10 متاجر والتواصل مع أول 3 غداً"
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
                  إطلاق التجربة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
