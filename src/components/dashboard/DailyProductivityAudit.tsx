/**
 * components/dashboard/DailyProductivityAudit.tsx
 * نظام تحليل الإنتاجية اليومي لمحمد السماحي
 * يدمج Gemini API مع مبدأ السيادة والتحكم اليدوي الكامل
 * متوافق بنسبة 100% مع نمط النهار الهادئ ونمط الليل الفاخر
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  UserCheck,
  Save,
  Copy,
  Check,
  Award,
  AlertTriangle,
  Compass,
  Calendar,
  History,
  Trash2,
} from 'lucide-react';

export const DailyProductivityAudit: React.FC = () => {
  const { state, todayFocusTasks, dailyScoreBreakdown, saveDailyReport, deleteDailyReport } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // البحث عن تقرير اليوم المسجل مسبقاً إن وجد
  const existingReport = state.dailyReports?.find((r) => r.date === todayStr);

  const [activeTab, setActiveTab] = useState<'ai_view' | 'manual_view' | 'history'>('ai_view');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // الحقول القابلة للتعديل والتحكم اليدوي المباشر
  const [userStrengths, setUserStrengths] = useState(
    existingReport?.userStrengths ||
      'إنجاز كتل العمل العميق الصباحية، والالتزام بمهام التركيز الثلاثية دون تشتيت الذهن.'
  );
  const [userImprovements, setUserImprovements] = useState(
    existingReport?.userImprovements ||
      'تقليل التردد في التواصل مع العملاء، وحسم إنهاء المهمة دون الغرق في تفاصيل غير جوهرية.'
  );
  const [userTomorrowFocus, setUserTomorrowFocus] = useState(
    existingReport?.userTomorrowFocus ||
      'بدء صباح الغد بكتلة 90 دقيقة مخصصة لأول مهمة استراتيجية قبل تفقد أي رسائل.'
  );
  const [overallRating, setOverallRating] = useState<number>(existingReport?.overallRating || 8);
  const [aiAnalysisText, setAiAnalysisText] = useState<string>(existingReport?.aiAnalysis || '');

  useEffect(() => {
    if (existingReport) {
      setUserStrengths(existingReport.userStrengths);
      setUserImprovements(existingReport.userImprovements);
      setUserTomorrowFocus(existingReport.userTomorrowFocus);
      setOverallRating(existingReport.overallRating);
      if (existingReport.aiAnalysis) {
        setAiAnalysisText(existingReport.aiAnalysis);
      }
    }
  }, [existingReport]);

  // طلب التحليل من Gemini API عبر الخادم الداخلي
  const handleGenerateAiReport = async () => {
    setIsLoadingAi(true);
    try {
      const todayLogs = state.timeLogs.filter((l) => l.date === todayStr);
      const habitsDone = state.habits.filter((h) => h.completedDates.includes(todayStr)).length;

      const totalPlannedMins = todayFocusTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
      const totalActualMins = todayFocusTasks.reduce(
        (sum, t) => sum + (t.actualMinutes || (t.status === 'completed' ? t.estimatedMinutes : 0)),
        0
      );

      const payload = {
        todayDate: todayStr,
        focusTasks: todayFocusTasks,
        timeLogs: todayLogs,
        plannedVsActual: {
          plannedHours: +(totalPlannedMins / 60).toFixed(1),
          actualHours: +(totalActualMins / 60).toFixed(1),
          accuracy: totalPlannedMins > 0 ? Math.round((totalActualMins / totalPlannedMins) * 100) : 100,
        },
        dailyScore: dailyScoreBreakdown.score,
        habitsStatus: {
          done: habitsDone,
          total: state.habits.length,
        },
        userManualNotes: userStrengths,
      };

      const res = await fetch('/api/analyze-productivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.report) {
        setAiAnalysisText(data.report);

        // حفظ التقرير تلقائياً مع الاحتفاظ بإمكانية التعديل
        saveDailyReport({
          date: todayStr,
          userStrengths: userStrengths,
          userImprovements: userImprovements,
          userTomorrowFocus: userTomorrowFocus,
          aiAnalysis: data.report,
          overallRating,
          isManualOverride: true,
        });
      }
    } catch (err: any) {
      console.error('فشل في استدعاء Gemini API:', err);
      const fallbackReport = `🌟 نقاط القوة والإنجاز الحقيقي اليوم:\n- نجحت يا محمد في حماية كتلة العمل الصباحية وتثبيت التركيز.\n- نسبة إنجاز مهام اليوم بلغت ${dailyScoreBreakdown.score}%.\n\n⚠️ مجالات التحسين الصريحة:\n- احذر من المماطلة في تسليم المهام بعد الظهر والبحث عن الكمال الزائد.\n\n🎯 التوجيه العملي الحاسم للغد:\n- ابدأ صباح الغد مباشرة بالمهمة الأهم بدون فتح السوشيال ميديا.`;
      setAiAnalysisText(fallbackReport);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // حفظ التقرير اليدوي
  const handleSaveManual = () => {
    saveDailyReport({
      date: todayStr,
      userStrengths,
      userImprovements,
      userTomorrowFocus,
      aiAnalysis: aiAnalysisText,
      overallRating,
      isManualOverride: true,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyReport = () => {
    const fullText = `تقرير إنتاجية محمد السماحي (${todayStr})\n\nالتقييم: ${overallRating}/10\n\n🌟 نقاط القوة:\n${userStrengths}\n\n⚠️ مجالات التحسين:\n${userImprovements}\n\n🎯 قرار الغد:\n${userTomorrowFocus}\n\n${aiAnalysisText ? `تحليل الذكاء الاصطناعي (Gemini):\n${aiAnalysisText}` : ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 md:p-6 shadow-sm">
      {/* ترويسة القسم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)] font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>المستشار اليومي والتقييم الذاتي</span>
            <span>·</span>
            <span>Productivity Audit & Gemini AI</span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)] mt-1">
            تقرير الإنتاجية اليومي لمحمد السماحي
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            تحليل صريح لنقاط القوة ومجالات التحسين مع السيادة والتحكم اليدوي الكامل
          </p>
        </div>

        {/* أزرار التبويب */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1 text-xs self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('ai_view')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'ai_view'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>تحليل Gemini</span>
          </button>
          <button
            onClick={() => setActiveTab('manual_view')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'manual_view'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <UserCheck className="h-3 w-3" />
            <span>تقييمي الذاتي (تحكم كامل)</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] font-bold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <History className="h-3 w-3" />
            <span>الأرشيف ({state.dailyReports?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* تنويه السيادة والتحكم الذاتي */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3.5 text-xs text-[var(--text-secondary)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <UserCheck className="h-4 w-4 text-[var(--accent-gold)] shrink-0" />
          <span>
            <strong className="text-[var(--text-primary)]">أنت القائد:</strong> الذكاء الاصطناعي أداة مساعدة لا تُملي عليك قراراتك. يمكنك كتابة تقريرك بنفسك، أو طلب تحليل Gemini ثم تعديل أي حرف فيه بحرية تامة.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors shadow-sm"
            title="نسخ التقرير كاملاً"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
      </div>

      {/* التبويب 1: تحليل Gemini AI */}
      {activeTab === 'ai_view' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-color)]">
            <div className="text-xs text-[var(--text-muted)]">
              يقوم Gemini بفحص مهام التركيز الثلاثية، وساعات العمل العميق، ودقة التقدير الزمني اليوم، لتقديم تقرير توجيهي مخصص لك.
            </div>
            <button
              onClick={handleGenerateAiReport}
              disabled={isLoadingAi}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent-gold)] px-4 py-2 text-xs font-bold text-black hover:opacity-90 transition-all disabled:opacity-50 shrink-0 shadow-md"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? 'جاري فحص السجل عبر Gemini...' : '✨ توليد تقرير Gemini اليومي'}</span>
            </button>
          </div>

          {aiAnalysisText ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-gold)]">
                  <Award className="h-4 w-4" />
                  <span>التقرير التنفيذي لسجل اليوم:</span>
                </div>
                <button
                  onClick={() => {
                    setUserStrengths(aiAnalysisText.slice(0, 150));
                    setActiveTab('manual_view');
                  }}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] underline"
                >
                  تعديل هذا التقرير يدوياً ←
                </button>
              </div>

              <div className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-normal space-y-2">
                {aiAnalysisText}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-elevated)]/30 p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
              <Sparkles className="h-8 w-8 text-[var(--accent-gold)]/40 mx-auto mb-1" />
              <p className="font-semibold text-[var(--text-secondary)]">اضغط على "توليد تقرير Gemini اليومي" لتحليل أدائك وساعات عملك اليوم فورياً.</p>
              <p className="text-[11px] text-[var(--text-muted)]">أو انتقل لتبويب "تقييمي الذاتي" لكتابة ملاحظاتك بيدك دون الحاجة للذكاء الاصطناعي.</p>
            </div>
          )}
        </div>
      )}

      {/* التبويب 2: التقييم الذاتي اليدوي (Full Manual Self-Reliance) */}
      {activeTab === 'manual_view' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* نقاط القوة والإنجاز اليوم */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>🌟 ما هي نقاط القوة والإنجازات الحقيقية اليوم؟</span>
              </label>
              <textarea
                rows={4}
                value={userStrengths}
                onChange={(e) => setUserStrengths(e.target.value)}
                placeholder="مثال: ركزت على المهمة البرمجية بدون تشتت، التزمت بكتلة الفجر، أرسلت عرضاً لعميلين..."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none leading-relaxed transition"
              />
            </div>

            {/* مجالات التحسين والصراحة مع الذات */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>⚠️ ما هي مجالات التحسين وأين ضاع بعض الوقت؟</span>
              </label>
              <textarea
                rows={4}
                value={userImprovements}
                onChange={(e) => setUserImprovements(e.target.value)}
                placeholder="مثال: ترددت في الاتصال بالعميل، تصفحت تويتر 20 دقيقة بدون فائدة، لم آخذ قسطاً كافياً من الراحة..."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none leading-relaxed transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* قرار الغد الحاسم */}
            <div className="md:col-span-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                <Compass className="h-4 w-4 text-[var(--accent-gold)]" />
                <span>🎯 قرار وتوجيه الغد الحاسم (خطوة واحدة لا تنازل عنها):</span>
              </label>
              <input
                type="text"
                value={userTomorrowFocus}
                onChange={(e) => setUserTomorrowFocus(e.target.value)}
                placeholder="مثال: البدء فوراً بإنهاء صفحة الدفع وتجربتها مع أول عميل الساعة 9 صباحاً."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none font-medium transition"
              />
            </div>

            {/* التقييم العام بالدرجات */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                <span>درجة رضاك عن اليوم:</span>
                <span className="font-mono text-sm text-[var(--accent-gold)] font-extrabold">{overallRating} / 10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={overallRating}
                onChange={(e) => setOverallRating(Number(e.target.value))}
                className="w-full accent-[var(--accent-gold)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>1 (يوم ضائع)</span>
                <span>5 (متوسط)</span>
                <span>10 (استثنائي)</span>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ والاعتماد */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
            <span className="text-[11px] text-[var(--text-muted)]">
              {saveSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  تم حفظ التقرير بنجاح في سجلك اليومي!
                </span>
              ) : (
                'يتم حفظ التقرير في سجلك المحلي لتعود إليه في المراجعة الأسبوعية.'
              )}
            </span>

            <button
              onClick={handleSaveManual}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent-gold)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>حفظ واعتماد التقرير</span>
            </button>
          </div>
        </div>
      )}

      {/* التبويب 3: أرشيف التقارير السابقة (History) */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {(!state.dailyReports || state.dailyReports.length === 0) ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-elevated)]/30 p-8 text-center text-xs text-[var(--text-muted)]">
              لا توجد تقارير يومية مسجلة بعد. عندما تحفظ تقرير اليوم سيظهر هنا للمقارنة عبر الزمن.
            </div>
          ) : (
            state.dailyReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 space-y-3 hover:border-[var(--accent-gold)]/40 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[var(--accent-gold)] font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{report.date}</span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--text-primary)]">التقييم: {report.overallRating}/10</span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('هل تريد حذف هذا التقرير من الأرشيف؟')) {
                        deleteDailyReport(report.id);
                      }
                    }}
                    className="text-[var(--text-muted)] hover:text-red-400 p-1 transition-colors"
                    title="حذف التقرير"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400">نقاط القوة:</span>
                    <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed">{report.userStrengths}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400">مجالات التحسين:</span>
                    <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed">{report.userImprovements}</p>
                  </div>
                </div>

                {report.userTomorrowFocus && (
                  <div className="pt-2 border-t border-[var(--border-color)] text-xs">
                    <span className="text-[11px] font-semibold text-[var(--accent-gold)]">توجيه الغد: </span>
                    <span className="text-[var(--text-primary)] font-medium">{report.userTomorrowFocus}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
