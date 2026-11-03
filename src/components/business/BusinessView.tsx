/**
 * components/business/BusinessView.tsx
 * مختبر الدخل وتجارب المشاريع (Income Lab & Income Experiments)
 * تحويل الأفكار إلى تجارب سريعة مدتها 14 يوماً مع التواصل مع 20 عميل وتحقيق أول إيراد
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
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ExperimentStatus, IncomeExperiment } from '../../types';

export const BusinessView: React.FC = () => {
  const {
    state,
    addIncomeExperiment,
    updateIncomeExperiment,
    deleteIncomeExperiment,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // حقول نموذج التجربة
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [targetClient, setTargetClient] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [requiredCapital, setRequiredCapital] = useState('300');
  const [requiredTimeHours, setRequiredTimeHours] = useState('15');
  const [monetizationSource, setMonetizationSource] = useState('');
  const [testDurationDays, setTestDurationDays] = useState('14');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addIncomeExperiment({
      name: name.trim(),
      problem: problem.trim() || 'مشكلة سوق حقيقية',
      targetClient: targetClient.trim() || 'متاجر أو أفراد',
      requiredSkill: requiredSkill.trim() || 'مهارة تقنية أو تسويقية',
      requiredCapital: Number(requiredCapital) || 0,
      requiredTimeHours: Number(requiredTimeHours) || 10,
      monetizationSource: monetizationSource.trim() || 'رسوم خدمة مدفوعة',
      startDate: new Date().toISOString().split('T')[0],
      testDurationDays: Number(testDurationDays) || 14,
      targetClientsContacted: 20,
      status: 'اختبار جاري (14 يوم)',
      learningsNotes: '',
    });

    setName('');
    setProblem('');
    setTargetClient('');
    setRequiredSkill('');
    setIsModalOpen(false);
  };

  const handleUpdateContacted = (exp: IncomeExperiment, delta: number) => {
    const nextVal = Math.max(0, exp.actualClientsContacted + delta);
    updateIncomeExperiment({
      ...exp,
      actualClientsContacted: nextVal,
      status:
        nextVal >= 20 && exp.revenueEarned > 0
          ? 'مربح ومستمر'
          : nextVal > 0 && exp.revenueEarned > 0
          ? 'أول عميل تحقق'
          : exp.status,
    });
  };

  const handleUpdateRevenue = (exp: IncomeExperiment) => {
    const amountStr = prompt('أدخل قيمة الإيراد الجديد المتحقق (ج.م):', '1000');
    if (amountStr) {
      const added = Number(amountStr);
      if (!isNaN(added) && added > 0) {
        updateIncomeExperiment({
          ...exp,
          revenueEarned: exp.revenueEarned + added,
          status: 'أول عميل تحقق',
        });
      }
    }
  };

  const handleStatusChange = (exp: IncomeExperiment, nextStatus: ExperimentStatus) => {
    updateIncomeExperiment({
      ...exp,
      status: nextStatus,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>بناء الثروة بالقيمة</span>
            <span>·</span>
            <span>Income Lab</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            مختبر مصادر الدخل والتجارب
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "لا تبحث عن فكرة مثالية بمليون جنيه من البداية. اختبر خدمة بسيطة، تواصل مع 20 عميل، واكسب أول جنيه."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إطلاق تجربة دخل جديدة (14 يوم)</span>
        </button>
      </div>

      {/* ميثاق تجارب الدخل */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 space-y-1 text-xs">
          <div className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            <span>قاعدة الـ 20 عميل</span>
          </div>
          <p className="text-[#888888] leading-relaxed">
            لا تحكم على أي خدمة أو فكرة بالفشل قبل عرضها مباشرة على 20 عميل مستهدف على الأقل وتدوين اعتراضاتهم.
          </p>
        </div>

        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 space-y-1 text-xs">
          <div className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>دورة الـ 14 يوماً</span>
          </div>
          <p className="text-[#888888] leading-relaxed">
            كل تجربة يجب أن تبدأ وتختبر وتصل لنتيجتها في أسبوعين. لا تمضِ 6 أشهر في بناء شيء لم يطلبه أحد.
          </p>
        </div>

        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 space-y-1 text-xs">
          <div className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>معيار النجاح الصريح</span>
          </div>
          <p className="text-[#888888] leading-relaxed">
            النجاح ليس الإعجاب أو المديح. النجاح هو عميل يدفع لك مالاً مقابل القيمة التي قدمتها له.
          </p>
        </div>
      </div>

      {/* قائمة التجارب */}
      <div className="space-y-4">
        {state.incomeExperiments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#222222] bg-[#090909] p-12 text-center text-xs text-[#777777]">
            لم تطلق أي تجربة دخل بعد. اضغط زر الإطلاق بالأعلى لبدء أول اختبار لمهارتك في السوق.
          </div>
        ) : (
          state.incomeExperiments.map((exp) => {
            const clientsProgress = Math.min(
              100,
              Math.round((exp.actualClientsContacted / exp.targetClientsContacted) * 100)
            );

            return (
              <div
                key={exp.id}
                className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4 hover:border-[#2f2f2f] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[#D4AF37] font-semibold">{exp.status}</span>
                      <span aria-hidden="true" className="text-[#444444]">·</span>
                      <span className="text-[#888888]">بدأت: {exp.startDate}</span>
                      <span aria-hidden="true" className="text-[#444444]">·</span>
                      <span className="text-[#888888]">المدة: {exp.testDurationDays} يوماً</span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-[#F5F5F5]">
                      {exp.name}
                    </h3>

                    <p className="text-xs text-[#888888] leading-relaxed max-w-3xl">
                      <span className="text-[#aaaaaa]">المشكلة: </span>
                      {exp.problem}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('حذف هذه التجربة؟')) deleteIncomeExperiment(exp.id);
                    }}
                    className="text-[#555555] hover:text-red-400 p-1 self-start"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* مقاييس التجربة: التواصل مع العملاء + الإيراد المتحقق */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1a1a1a]">
                  {/* عداد العملاء */}
                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888] flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>العملاء المتواصل معهم:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateContacted(exp, -1)}
                          className="h-6 w-6 rounded border border-[#222222] bg-[#141414] text-xs text-[#888888] hover:text-white flex items-center justify-center font-mono"
                        >
                          -
                        </button>
                        <span className="font-mono text-[#F5F5F5] font-bold tabular-nums">
                          {exp.actualClientsContacted} / {exp.targetClientsContacted}
                        </span>
                        <button
                          onClick={() => handleUpdateContacted(exp, 1)}
                          className="h-6 w-6 rounded border border-[#222222] bg-[#141414] text-xs text-[#888888] hover:text-white flex items-center justify-center font-mono"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] transition-all"
                        style={{ width: `${clientsProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* الإيراد المالي المتحقق */}
                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#888888]">الإيراد المالي من التجربة:</div>
                      <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums mt-0.5">
                        {exp.revenueEarned.toLocaleString()} ج.م
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdateRevenue(exp)}
                      className="rounded border border-[#2a2a2a] bg-[#161616] px-2.5 py-1.5 text-xs text-[#D4AF37] hover:border-[#D4AF37]/50"
                    >
                      + تسجيل إيراد
                    </button>
                  </div>
                </div>

                {/* تفاصيل المهارة والعميل المستهدف */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#777777]">
                  <span>العميل: {exp.targetClient}</span>
                  <span aria-hidden="true">·</span>
                  <span>المهارة: {exp.requiredSkill}</span>
                  <span aria-hidden="true">·</span>
                  <span>المصدر: {exp.monetizationSource}</span>
                </div>

                {/* تغيير حالة التجربة */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] text-xs">
                  <span className="text-[#666666]">تحديث مسار التجربة:</span>
                  <div className="flex items-center gap-1.5">
                    {(['اختبار جاري (14 يوم)', 'أول عميل تحقق', 'مربح ومستمر', 'متوقف'] as ExperimentStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(exp, st)}
                          className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                            exp.status === st
                              ? 'bg-[#262626] text-[#D4AF37] font-semibold'
                              : 'text-[#777777] hover:text-[#cccccc]'
                          }`}
                        >
                          {st}
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

      {/* نافذة إطلاق تجربة جديدة */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-[#2a2a2a] bg-[#0e0e0e] p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold text-[#F5F5F5]">إطلاق تجربة دخل مصغرة (14 يوماً)</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#777777] hover:text-[#F5F5F5]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">اسم الخدمة أو التجربة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خدمة برمجة حاسبة أسعار للمصممين"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">ما المشكلة الحقيقية التي تحلها؟</label>
                <input
                  type="text"
                  placeholder="مثال: صعوبة تسعير المشاريع وإهدار الوقت في المفاوضات"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">العميل المستهدف:</label>
                  <input
                    type="text"
                    placeholder="مثال: المصممون الأحرار"
                    value={targetClient}
                    onChange={(e) => setTargetClient(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">المهارة المطلوبة:</label>
                  <input
                    type="text"
                    placeholder="مثال: JavaScript, Tailwind"
                    value={requiredSkill}
                    onChange={(e) => setRequiredSkill(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">الساعات المطلوبة للتجهيز:</label>
                  <input
                    type="number"
                    value={requiredTimeHours}
                    onChange={(e) => setRequiredTimeHours(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">رأس المال المطلوب (ج.م):</label>
                  <input
                    type="number"
                    value={requiredCapital}
                    onChange={(e) => setRequiredCapital(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="rounded border border-[#1f1f1f] bg-[#080808] p-3 text-[11px] text-[#888888] leading-relaxed">
                🎯 <span className="text-[#D4AF37]">الالتزام بالتجربة:</span> ستقوم بإنشاء نموذج تجريبي سريع والتواصل المباشر مع 20 عميل مستهدف لتقييم النتيجة الواقعية.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  اعتماد وبدء التجربة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
