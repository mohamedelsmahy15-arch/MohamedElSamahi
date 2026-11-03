/**
 * components/time/TimeTrackingView.tsx
 * نظام تتبع الوقت الفعلي (Time Tracking & Deep Work)
 * مؤقت حي بضغطة واحدة يقارن المخطط بالواقع ويكشف أين يضيع الوقت.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Square,
  RotateCcw,
  Clock,
  Plus,
  Trash2,
  PieChart,
  Zap,
} from 'lucide-react';
import { TimeCategory } from '../../types';

export const TimeTrackingView: React.FC = () => {
  const {
    activeTimer,
    startTimer,
    stopTimer,
    resetTimer,
    state,
    addManualTimeLog,
    deleteTimeLog,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<TimeCategory>(activeTimer.category);
  const [sessionDesc, setSessionDesc] = useState(activeTimer.description);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // حقول الإدخال اليدوي
  const [manualMinutes, setManualMinutes] = useState('60');
  const [manualCategory, setManualCategory] = useState<TimeCategory>('Programming');
  const [manualDesc, setManualDesc] = useState('');

  // تنسيق الثواني إلى HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startTimer(selectedCategory, sessionDesc);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDesc.trim()) return;

    addManualTimeLog({
      category: manualCategory,
      description: manualDesc.trim(),
      durationMinutes: Number(manualMinutes) || 30,
      date: new Date().toISOString().split('T')[0],
      isDeepWork: ['Programming', 'AI', 'Business'].includes(manualCategory),
    });

    setManualDesc('');
    setIsManualModalOpen(false);
  };

  const allCategories: TimeCategory[] = [
    'Programming',
    'AI',
    'Business',
    'Learning',
    'Work',
    'Exercise',
    'Social Media',
    'Wasted Time',
  ];

  // تجميع الساعات الإجمالية المسجلة
  const totalMinutes = state.timeLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const deepWorkMinutes = state.timeLogs
    .filter((l) => l.isDeepWork)
    .reduce((acc, l) => acc + l.durationMinutes, 0);
  const deepWorkHours = (deepWorkMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>الوعي الزمني والعمل العميق</span>
            <span>·</span>
            <span>Time Tracking</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            تتبع الوقت وساعات العمل العميق
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "ما لا يُقاس لا يُدار. الوقت هو رأسمالك الحقيقي الذي تبني به سنة 2027."
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ تسجيل جلسة يدوية</span>
        </button>
      </div>

      {/* شاشة المؤقت الحي الفاخرة (Live Stopwatch) */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 md:p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-3 py-1 text-xs text-[var(--accent-gold)] font-mono">
          <Zap className="h-3.5 w-3.5" />
          <span>{activeTimer.isRunning ? 'المؤقت قيد التشغيل الآن...' : 'المؤقت في وضع الاستعداد'}</span>
        </div>

        {/* الأرقام الكبرى للأميال الزمنية */}
        <div className="font-mono text-5xl md:text-7xl font-bold tracking-wider text-[var(--text-primary)] tabular-nums">
          {formatTime(activeTimer.elapsedSeconds)}
        </div>

        {/* مدخلات الجلسة أثناء التشغيل أو قبل البدء */}
        <div className="max-w-md mx-auto space-y-3 text-xs">
          {!activeTimer.isRunning ? (
            <>
              <input
                type="text"
                placeholder="ما الذي تعمل عليه الآن؟ (مثال: بناء واجهة المستخدم في React)"
                value={sessionDesc}
                onChange={(e) => setSessionDesc(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-center text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />

              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[var(--accent-gold)] text-black font-semibold'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-xs text-[var(--text-muted)]">
              الجلسة الحالية: <span className="text-[var(--text-primary)] font-semibold">{activeTimer.description || activeTimer.category}</span>
              {' · '}
              <span className="text-[var(--accent-gold)] font-mono">{activeTimer.category}</span>
            </div>
          )}
        </div>

        {/* أزرار التحكم في المؤقت */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!activeTimer.isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent-gold)] px-8 py-3 text-sm font-bold text-black hover:bg-[#e0bc45] transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/10"
            >
              <Play className="h-4 w-4 fill-black" />
              <span>ابدأ جلسة العمل</span>
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3 text-sm font-bold text-white hover:bg-red-500 transition-transform active:scale-95 shadow-lg shadow-red-600/20"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>إنهاء وحفظ الجلسة</span>
            </button>
          )}

          {activeTimer.elapsedSeconds > 0 && !activeTimer.isRunning && (
            <button
              onClick={resetTimer}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>تصفير</span>
            </button>
          )}
        </div>
      </div>

      {/* مؤشرات الوقت المنجز (Planned vs Actual) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-1">
          <div className="text-xs text-[var(--text-muted)]">إجمالي الساعات المسجلة</div>
          <div className="font-mono text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {totalHours} ساعة
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">موزعة على كافة الأنشطة</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-1">
          <div className="text-xs text-[var(--text-muted)]">ساعات العمل العميق (Deep Work)</div>
          <div className="font-mono text-2xl font-bold text-[var(--accent-gold)] tabular-nums">
            {deepWorkHours} ساعة
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">في البرمجة والبزنس والذكاء الاصطناعي</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-1">
          <div className="text-xs text-[var(--text-muted)]">نسبة الإنتاجية الحقيقية</div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {totalMinutes > 0 ? Math.round((deepWorkMinutes / totalMinutes) * 100) : 0}%
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">نسبة الساعات الاستثمارية من الإجمالي</p>
        </div>
      </div>

      {/* سجل الجلسات المسجلة */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">سجل الجلسات الحديثة</h2>

        <div className="space-y-2">
          {state.timeLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-[var(--text-muted)]">
              لا توجد جلسات مسجلة بعد. شغّل المؤقت الآن لبدء أول جلسة.
            </div>
          ) : (
            state.timeLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-semibold text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-1 rounded">
                    {log.durationMinutes} دقيقة
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{log.description}</div>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5 font-mono">
                      <span>{log.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{log.date}</span>
                      {log.isDeepWork && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--accent-gold)]">Deep Work</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTimeLog(log.id)}
                  className="text-[var(--text-muted)] hover:text-red-400 p-1"
                  title="حذف الجلسة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* نافذة التسجيل اليدوي */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">تسجيل جلسة عمل يدوياً</h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">وصف النشاط:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قراءة وثائق React وبناء أول كمبوننت"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">التصنيف:</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as TimeCategory)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">المدة (بالدقائق):</label>
                  <input
                    type="number"
                    min={5}
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  حفظ الجلسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
