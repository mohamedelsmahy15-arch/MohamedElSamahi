/**
 * components/review/WeeklyReviewView.tsx
 * نظام المراجعة الأسبوعية التنفيذية (Weekly Review System)
 * جلسة مغلقة بـ 8 أسئلة صريحة تمنع ضياع سنة 2027 وتحافظ على بوصلة البناء
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { WeeklyReviewReport } from '../../types';

export const WeeklyReviewView: React.FC = () => {
  const { state, addWeeklyReview, deleteWeeklyReview } = useApp();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReviewReport | null>(
    state.weeklyReviews[0] || null
  );

  // حقول الأسئلة الـ 8
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [q6, setQ6] = useState('');
  const [q7, setQ7] = useState('');
  const [q8, setQ8] = useState('');
  const [satisfaction, setSatisfaction] = useState(8);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim()) return;

    const currentWeekNum = state.weeklyReviews.length + 1;
    const today = new Date();
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    addWeeklyReview({
      weekNumber: currentWeekNum,
      startDate: weekAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      q1_biggestAchievement: q1.trim(),
      q2_missedThings: q2.trim() || 'لا يوجد تقصير جوهري',
      q3_reasonForMissed: q3.trim() || 'تنظيم الوقت',
      q4_biggestTimeWaster: q4.trim() || 'السوشيال ميديا والتصفح العشوائي',
      q5_whatBroughtResults: q5.trim() || 'كتل العمل العميق الصباحية',
      q6_incomeProximity: q6.trim() || 'مستمر في بناء واختبار الخدمة',
      q7_learnedOrApplied: q7.trim() || 'تطبيق عملي 70%',
      q8_nextWeekTop3: q8.trim(),
      overallSatisfaction: Number(satisfaction),
    });

    setIsWizardOpen(false);
    // تفريغ
    setQ1('');
    setQ2('');
    setQ3('');
    setQ4('');
    setQ5('');
    setQ6('');
    setQ7('');
    setQ8('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>البوصلة التنفيذية</span>
            <span>·</span>
            <span>Weekly Review</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            المراجعة الأسبوعية
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "بدون مراجعة أسبوعية صريحة، ستمر سنة 2027 كأنها شهر واحد دون إنجاز حقيقي."
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <FileCheck2 className="h-4 w-4 stroke-[2.5]" />
          <span>+ بدء مراجعة أسبوع جديد</span>
        </button>
      </div>

      {/* معالج كتابة المراجعة بأسئلتها الثمانية */}
      {isWizardOpen && (
        <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0e0e0a] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#22221b] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#F5F5F5]">
                جلسة المراجعة الأسبوعية (8 أسئلة صريحة)
              </h2>
              <p className="text-xs text-[#888888]">
                الإجابة بصدق هي مفتاح نموك الشخصي والمالي.
              </p>
            </div>
            <button
              onClick={() => setIsWizardOpen(false)}
              className="text-xs text-[#888888] hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  1. إيه أهم حاجة أنجزتها الأسبوع ده؟
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="أهم إنجاز حقيقي تحركت به للأمام..."
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  2. إيه اللي كنت ناوي أعمله وما عملتهوش؟
                </label>
                <textarea
                  rows={2}
                  placeholder="المهام أو الالتزامات المؤجلة..."
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  3. إيه السبب الحقيقي وراء التقصير؟
                </label>
                <textarea
                  rows={2}
                  placeholder="تسويف؟ خطة غير واقعية؟ أم تشتت؟"
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  4. أكتر حاجة ضيعت وقتي الأسبوع ده؟
                </label>
                <textarea
                  rows={2}
                  placeholder="السوشيال ميديا، التفكير الزائد، كثرة التجارب..."
                  value={q4}
                  onChange={(e) => setQ4(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  5. إيه اللي جاب نتيجة واضحة؟
                </label>
                <textarea
                  rows={2}
                  placeholder="ما النشاط الذي شعرت بأثره المباشر؟"
                  value={q5}
                  onChange={(e) => setQ5(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  6. هل قربت من مصدر دخل فعلي؟
                </label>
                <textarea
                  rows={2}
                  placeholder="هل تواصلت مع عميل؟ هل جهزت نموذجاً مدفوعاً؟"
                  value={q6}
                  onChange={(e) => setQ6(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  7. هل تعلمت فقط أم طبقت في كود ومشاريع؟
                </label>
                <textarea
                  rows={2}
                  placeholder="ما نسبة التطبيق الفعلي مقابل مشاهدة الكورسات؟"
                  value={q7}
                  onChange={(e) => setQ7(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D4AF37] font-medium mb-1">
                  8. ما هي أهم 3 نتائج للأسبوع الجديد؟
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="1. ...&#10;2. ...&#10;3. ..."
                  value={q8}
                  onChange={(e) => setQ8(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#999999]">تقييم الرضا عن الأسبوع:</span>
                <span className="font-mono text-[#D4AF37] font-bold">{satisfaction} / 10</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={satisfaction}
                  onChange={(e) => setSatisfaction(Number(e.target.value))}
                  className="w-32 accent-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-[#D4AF37] px-5 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45]"
              >
                اعتماد وحفظ تقرير الأسبوع
              </button>
            </div>
          </form>
        </div>
      )}

      {/* استعراض أرشيف المراجعات السابقة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة التقارير المسجلة */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#F5F5F5]">أرشيف التقارير الأسبوعية</h2>
          {state.weeklyReviews.length === 0 ? (
            <div className="rounded-lg border border-[#222222] bg-[#0c0c0c] p-6 text-center text-xs text-[#777777]">
              لم تسجل أي مراجعات أسبوعية بعد. اضغط زر البدء بالأعلى لتوثيق أسبوعك الأول.
            </div>
          ) : (
            state.weeklyReviews.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? 'border-[#D4AF37] bg-[#14120a]'
                    : 'border-[#222222] bg-[#0c0c0c] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#D4AF37]">
                    الأسبوع #{report.weekNumber}
                  </span>
                  <span className="text-[11px] text-[#777777] font-mono">
                    {report.startDate} ← {report.endDate}
                  </span>
                </div>
                <p className="text-xs text-[#cccccc] line-clamp-1 mt-2">
                  {report.q1_biggestAchievement}
                </p>
                <div className="mt-2 text-[10px] text-[#888888] flex items-center justify-between">
                  <span>الرضا: {report.overallSatisfaction}/10</span>
                  <span className="text-[#D4AF37]">عرض التفاصيل ←</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* تفاصيل التقرير المحدد */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#F5F5F5]">
                    تقرير الأسبوع #{selectedReport.weekNumber}
                  </h3>
                  <div className="text-xs text-[#777777] font-mono mt-0.5">
                    الفترة: {selectedReport.startDate} إلى {selectedReport.endDate}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-1 rounded">
                    تقييم الأسبوع: {selectedReport.overallSatisfaction}/10
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('حذف هذا التقرير؟')) deleteWeeklyReview(selectedReport.id);
                    }}
                    className="text-[#555555] hover:text-red-400 p-1"
                    title="حذف التقرير"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                  <div className="font-semibold text-[#D4AF37] mb-1">1. أهم إنجاز تحقق:</div>
                  <p className="text-[#F5F5F5] leading-relaxed">
                    {selectedReport.q1_biggestAchievement}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">2. ما لم ينجز:</div>
                    <p className="text-[#cccccc]">{selectedReport.q2_missedThings}</p>
                  </div>

                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">3. السبب الحقيقي:</div>
                    <p className="text-[#cccccc]">{selectedReport.q3_reasonForMissed}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">4. أكبر مضيعة للوقت:</div>
                    <p className="text-[#cccccc]">{selectedReport.q4_biggestTimeWaster}</p>
                  </div>

                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">5. ما جلب النتيجة:</div>
                    <p className="text-[#cccccc]">{selectedReport.q5_whatBroughtResults}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">6. القرب من مصدر الدخل:</div>
                    <p className="text-[#cccccc]">{selectedReport.q6_incomeProximity}</p>
                  </div>

                  <div className="rounded-lg bg-[#111111] p-3 border border-[#1a1a1a]">
                    <div className="font-semibold text-[#999999] mb-1">7. تعلم أم تطبيق؟</div>
                    <p className="text-[#cccccc]">{selectedReport.q7_learnedOrApplied}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#14120a] p-3.5 border border-[#D4AF37]/30">
                  <div className="font-semibold text-[#D4AF37] mb-1">
                    8. أهم 3 نتائج للأسبوع التالي:
                  </div>
                  <p className="text-[#F5F5F5] whitespace-pre-line leading-relaxed font-mono">
                    {selectedReport.q8_nextWeekTop3}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#222222] bg-[#0c0c0c] p-12 text-center text-xs text-[#777777]">
              اختر تقريراً من القائمة لعرض تفاصيله أو أنشئ مراجعة أسبوعية جديدة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
