/**
 * components/settings/SettingsView.tsx
 * إعدادات النظام وإدارة البيانات والنسخ الاحتياطي
 * مع استعراض فلسفة المنتج وركائز بناء 2027
 */

import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Code,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { exportBackup, importBackup, resetToDefault } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportStatus('تم استيراد البيانات بنجاح!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('فشل استيراد الملف. تأكد من صحة الملف.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط البيانات إلى الوضع التجريبي الافتراضي؟')) {
      resetToDefault();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="border-b border-[#1f1f1f] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
          <span>الإعدادات والبيانات</span>
          <span>·</span>
          <span>System Settings</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
          إدارة النظام والنسخ الاحتياطي
        </h1>
        <p className="text-xs text-[#999999] mt-0.5">
          بياناتك مخزنة محلياً في متصفحك (LocalStorage) بسرعة وأمان تام.
        </p>
      </div>

      {/* قسم النسخ الاحتياطي والاستيراد */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
          <Download className="h-4 w-4 text-[#D4AF37]" />
          <span>النسخ الاحتياطي للبيانات (Backup & Restore)</span>
        </h2>

        <p className="text-xs text-[#888888] leading-relaxed">
          يمكنك تصدير ملف JSON كامل يحتوي على كل أهدافك ومشاريعك ومهامك وأفكارك للرجوع إليها أو نقلها لجهاز آخر في أي وقت.
        </p>

        {importStatus && (
          <div className="rounded-lg bg-[#141414] border border-[#333333] p-3 text-xs text-[#D4AF37]">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportBackup}
            className="flex items-center gap-2 rounded-lg bg-[#141414] border border-[#2a2a2a] px-4 py-2 text-xs font-medium text-[#F5F5F5] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-[#141414] border border-[#2a2a2a] px-4 py-2 text-xs font-medium text-[#F5F5F5] hover:border-[#2f2f2f] hover:text-white transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>استيراد بيانات من ملف JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-red-950/40 bg-red-950/10 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>إعادة ضبط البيانات التجريبية</span>
          </button>
        </div>
      </div>

      {/* ميثاق وفلسفة السماحي OS (Section 30) */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#D4AF37]" />
          <span>دستور وفلسفة النظام (System Philosophy)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs leading-relaxed">
          <div className="rounded-lg border border-[#1a1a1a] bg-[#101010] p-3.5 space-y-1">
            <div className="font-semibold text-[#D4AF37]">1. لا تجمع أهدافاً، ابنِ نتائج.</div>
            <p className="text-[#888888]">
              قائمة أهداف طويلة تعطي شعوراً زائفاً بالإنجاز. النتيجة الملموسة هي المقياس الحقيقي.
            </p>
          </div>

          <div className="rounded-lg border border-[#1a1a1a] bg-[#101010] p-3.5 space-y-1">
            <div className="font-semibold text-[#D4AF37]">2. لا تتعلم فقط، طبّق فوراً.</div>
            <p className="text-[#888888]">
              أي مهارة برمجية أو تسويقية تتعلمها دون تطبيقها في مشروع أو خدمة، ستنساها خلال أسبوع.
            </p>
          </div>

          <div className="rounded-lg border border-[#1a1a1a] bg-[#101010] p-3.5 space-y-1">
            <div className="font-semibold text-[#D4AF37]">3. لا تبدأ 20 مشروعاً، أكمل الحالي.</div>
            <p className="text-[#888888]">
              المشاريع غير المكتملة تستهلك طاقتك الذهنية. أغلق جبهات العمل قبل فتح جبهات جديدة.
            </p>
          </div>

          <div className="rounded-lg border border-[#1a1a1a] bg-[#101010] p-3.5 space-y-1">
            <div className="font-semibold text-[#D4AF37]">4. اختبر مصادر دخل صغيرة وسريعة.</div>
            <p className="text-[#888888]">
              لا تبحث عن مشروع مثالي بمليون جنيه من البداية. اختبر خدمة بسيطة تحقق أول 500 أو 1000 جنيه.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#14120a] border border-[#D4AF37]/20 p-4 text-center">
          <div className="text-xs font-semibold text-[#D4AF37]">
            "لا تعتمد على الحماس، اعتمد على النظام."
          </div>
          <div className="text-[11px] text-[#888888] mt-1">
            السماحي OS — رفيقك اليومي في سنة البناء 2027
          </div>
        </div>
      </div>
    </div>
  );
};
