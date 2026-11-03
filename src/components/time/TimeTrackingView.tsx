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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>الوعي الزمني والعمل العميق</span>
            <span>·</span>
            <span>Time Tracking</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            تتبع الوقت وساعات العمل العميق
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "ما لا يُقاس لا يُدار. الوقت هو رأسمالك الحقيقي الذي تبني به سنة 2027."
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#161616] border border-[#2a2a2a] px-4 py-2 text-xs font-semibold text-[#F5F5F5] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ تسجيل جلسة يدوية</span>
        </button>
      </div>

      {/* شاشة المؤقت الحي الفاخرة (Live Stopwatch) */}
      <div className="relative overflow-hidden rounded-2xl border border-[#262626] bg-[#0c0c0c] p-6 md:p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs text-[#D4AF37] font-mono">
          <Zap className="h-3.5 w-3.5" />
          <span>{activeTimer.isRunning ? 'المؤقت قيد التشغيل الآن...' : 'المؤقت في وضع الاستعداد'}</span>
        </div>

        {/* الأرقام الكبرى للأميال الزمنية */}
        <div className="font-mono text-5xl md:text-7xl font-bold tracking-wider text-[#F5F5F5] tabular-nums">
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
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-center text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              />

              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#D4AF37] text-black font-semibold'
                        : 'bg-[#141414] text-[#888888] border border-[#222222] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-xs text-[#888888]">
              الجلسة الحالية: <span className="text-[#F5F5F5] font-semibold">{activeTimer.description || activeTimer.category}</span>
              {' · '}
              <span className="text-[#D4AF37] font-mono">{activeTimer.category}</span>
            </div>
          )}
        </div>

        {/* أزرار التحكم في المؤقت */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!activeTimer.isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black hover:bg-[#e0bc45] transition-transform active:scale-95 shadow-lg shadow-[#D4AF37]/10"
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
              className="flex items-center gap-1.5 rounded-xl border border-[#333333] bg-[#141414] px-4 py-3 text-xs text-[#888888] hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>تصفير</span>
            </button>
          )}
        </div>
      </div>

      {/* مؤشرات الوقت المنجز (Planned vs Actual) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-1">
          <div className="text-xs text-[#888888]">إجمالي الساعات المسجلة</div>
          <div className="font-mono text-2xl font-bold text-[#F5F5F5] tabular-nums">
            {totalHours} ساعة
          </div>
          <p className="text-[11px] text-[#666666]">موزعة على كافة الأنشطة</p>
        </div>

        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-1">
          <div className="text-xs text-[#888888]">ساعات العمل العميق (Deep Work)</div>
          <div className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">
            {deepWorkHours} ساعة
          </div>
          <p className="text-[11px] text-[#666666]">في البرمجة والبزنس والذكاء الاصطناعي</p>
        </div>

        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-1">
          <div className="text-xs text-[#888888]">نسبة الإنتاجية الحقيقية</div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {totalMinutes > 0 ? Math.round((deepWorkMinutes / totalMinutes) * 100) : 0}%
          </div>
          <p className="text-[11px] text-[#666666]">نسبة الساعات الاستثمارية من الإجمالي</p>
        </div>
      </div>

      {/* سجل الجلسات المسجلة */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#F5F5F5]">سجل الجلسات الحديثة</h2>

        <div className="space-y-2">
          {state.timeLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#777777]">
              لا توجد جلسات مسجلة بعد. شغّل المؤقت الآن لبدء أول جلسة.
            </div>
          ) : (
            state.timeLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-[#1a1a1a] bg-[#111111] p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">
                    {log.durationMinutes} دقيقة
                  </div>
                  <div>
                    <div className="font-medium text-[#F5F5F5]">{log.description}</div>
                    <div className="text-[11px] text-[#777777] flex items-center gap-2 mt-0.5 font-mono">
                      <span>{log.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{log.date}</span>
                      {log.isDeepWork && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#D4AF37]">Deep Work</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTimeLog(log.id)}
                  className="text-[#555555] hover:text-red-400 p-1"
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
          <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold text-[#F5F5F5]">تسجيل جلسة عمل يدوياً</h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#777777] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">وصف النشاط:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قراءة وثائق React وبناء أول كمبوننت"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">التصنيف:</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as TimeCategory)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">المدة (بالدقائق):</label>
                  <input
                    type="number"
                    min={5}
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
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
