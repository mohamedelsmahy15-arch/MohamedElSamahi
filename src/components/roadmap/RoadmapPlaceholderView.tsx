/**
 * components/roadmap/RoadmapPlaceholderView.tsx
 * شاشة استعراض وحدات خارطة الطريق القادمة
 * توضح لمحمد المعمارية المخططة لكل قسم وكيف سيتم بناؤه خطوة بخطوة في الإصدارات التالية.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCcw,
  FileCheck2,
  CalendarDays,
  Clock,
  Wallet,
  Briefcase,
  GraduationCap,
  Bot,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ModuleSpec {
  title: string;
  version: string;
  phase: string;
  summary: string;
  features: string[];
  philosophy: string;
}

const MODULE_SPECS: Record<string, ModuleSpec> = {
  habits: {
    title: 'نظام العادات اليومية (Habit System)',
    version: 'v0.2',
    phase: 'المرحلة القادمة',
    summary: 'متابعة العادات الأساسية مثل الاستيقاظ للفجر، القراءة، الرياضة، والبرمجة مع مقياس الاستمرارية.',
    features: [
      'تسجيل الالتزام اليومي بنقرة واحدة (صلاة الفجر، رياضة، قراءة، تقليل السوشيال ميديا)',
      'عداد الاستمرارية (Streak) مع التركيز على التعافي السريع عند الانقطاع وليس الهوس بالأرقام',
      'تأثير العادات اليومية على مؤشر Daily Score مباشرة',
    ],
    philosophy: 'الهدف من العادات ليس التفاخر برقم الأيام المتتالية، بل حفر الهوية الشخصية كشخص منضبط.',
  },
  review: {
    title: 'المراجعة الأسبوعية (Weekly Review)',
    version: 'v0.2',
    phase: 'المرحلة القادمة',
    summary: 'جلسة مراجعة أسبوعية مغلقة بـ 8 أسئلة صريحة تولد تقرير الأسبوع التنفيذي.',
    features: [
      '1. إيه أهم حاجة أنجزتها؟',
      '2. إيه اللي معملتهوش وليه؟',
      '3. أكتر حاجة ضيعت وقتي الأسبوع ده؟',
      '4. هل قربت من مصدر دخل فعلي؟',
      '5. هل تعلمت فقط أم طبقت؟ وتحديد أهم 3 أهداف للأسبوع الجديد',
    ],
    philosophy: 'بدون مراجعة أسبوعية، ستمر سنة 2027 في غمضة عين كأنها شهر واحد. المراجعة هي بوصلتك.',
  },
  calendar: {
    title: 'التقويم وجدول المواعيد (Calendar)',
    version: 'v0.2',
    phase: 'المرحلة القادمة',
    summary: 'رؤية شاملة للأسبوع والشهر تربط مواعيد تسليم المشاريع بالمراحل السنوية.',
    features: [
      'عرض تقويم الأسبوع والشهر للأهداف والمشاريع',
      'مواعيد انتهاء تجارب الدخل الـ 14 يوماً',
      'توزيع كتل العمل العميق على أيام الأسبوع',
    ],
    philosophy: 'الوقت المتاح ثابت، المهم توزيع طاقتك على ما يثمر نتائج.',
  },
  time: {
    title: 'تتبع الوقت الفعلي (Time Tracking)',
    version: 'v0.3',
    phase: 'الإصدار المالي والزمني',
    summary: 'مؤقت ذكي بنقرة واحدة يقارن المخطط بالواقع (Planned vs Actual) ويكشف أين يضيع الوقت.',
    features: [
      'تشغيل وإيقاف العداد بضغطة واحدة لمجالات: البرمجة، التجارة، التعلم، السوشيال ميديا، الوقت الضائع',
      'مخطط أسبوعي: كم ساعة قضيت فعلاً في كل مجال؟',
      'كشف فجوة الوقت: ماذا كنت تنوي فعله vs ما فعلته فعلاً على أرض الواقع',
    ],
    philosophy: 'ما لا يمكن قياسه لا يمكن إدارته. الوقت هو رأس مالك الوحيد في سنة البناء.',
  },
  money: {
    title: 'لوحة التدفق المالي (Money Dashboard)',
    version: 'v0.3',
    phase: 'الإصدار المالي والزمني',
    summary: 'إدارة الدخل والمصروفات ومعدل الادخار بدون افتراض وجود مرتب ثابت.',
    features: [
      'تسجيل الإيراد والمصروف مع تحديد المصدر (دخل خدمات، دخل مشاريع، مصروفات شخصية، مصروفات بزنس)',
      'صافي التدفق الشهري ومعدل الادخار الفعلي',
      'فصل أموال البزنس عن الأموال الشخصية من اليوم الأول',
    ],
    philosophy: 'المال يتبع القيمة. ركز على تقديم خدمة ممتازة وسيدفع لك الناس عن طيب خاطر.',
  },
  business: {
    title: 'مختبر الدخل وتجارب المشاريع (Income Lab)',
    version: 'v0.3',
    phase: 'الإصدار المالي والزمني',
    summary: 'اختبار مصادر الدخل عبر تجارب سريعة مدتها 7-14 يوماً مع معيار نجاح وتواصل مباشر مع 20 عميل.',
    features: [
      'نموذج دراسة الفرصة: المشكلة، العميل، التكلفة، الإيراد المتوقع',
      'سجل التجارب: فكرة ← بحث ← اختبار ← أول عميل ← مربح',
      'نتيجة التجربة: نجحت، تحتاج تعديل، أوقفها، اختبر نسخة جديدة',
    ],
    philosophy: 'لا تنتظر الفكرة المثالية الخارقة. ابدأ بتجربة بسيطة تكسبك أول عميل واختبر السوق مباشرة.',
  },
  learning: {
    title: 'نظام التعلم والتطبيق (Learning System)',
    version: 'v0.4',
    phase: 'إصدار المهارات والتحليلات',
    summary: 'حماية محمد من فخ "التعلم السلبي" بربط كل مهارة برمجية بمشروع تطبيقي مباشر.',
    features: [
      'إضافة مهارات (مثل: JavaScript, CSS Layouts, Git, Node.js) مع نسبة الإتقان 0-100%',
      'سؤال النظام الإجباري: "إيه المشروع اللي هتستخدم فيه المهارة دي فوراً؟"',
      'مكتبة الدروس والمراجع التطبيقية والملاحظات البرمجية',
    ],
    philosophy: 'مشاهدة 100 ساعة كورسات دون كتابة كود تساوي صفراً. سطر كود واحد يحل مشكلة يساوي ذهباً.',
  },
  coach: {
    title: 'المرشد الذكي (AI Coach)',
    version: 'v0.5',
    phase: 'إصدار الذكاء الاصطناعي',
    summary: 'تحليل موضوعي هادئ لبيانات التطبيق يقدم الملاحظة، والمشكلة، والحل المقترح بدون أحكام.',
    features: [
      'تحليل توازن الوقت: "خلال آخر 7 أيام قضيت 11 ساعة في الكورسات و 3 ساعات فقط في كتابة الكود."',
      'حماية الطاقة: "عندك 7 أفكار جديدة ومشروعان لم ينتهيا، لا تفتح جبهة جديدة الآن."',
      'مقترحات تنفيذية محددة مبنية على بياناتك الحقيقية المسجلة في السماحي OS',
    ],
    philosophy: 'المرشد لا يصدر أحكاماً عاطفية، بل يضع أمامك مرآة بياناتك لتصحح مسارك كل يوم.',
  },
};

interface RoadmapPlaceholderProps {
  tabId: string;
}

export const RoadmapPlaceholderView: React.FC<RoadmapPlaceholderProps> = ({ tabId }) => {
  const { setActiveTab } = useApp();
  const spec = MODULE_SPECS[tabId] || {
    title: 'وحدة النظام القادمة',
    version: 'v0.2+',
    phase: 'خارطة الطريق',
    summary: 'هذه الوحدة مجدولة ضمن خطة التطوير التدريجي لنظام السماحي OS.',
    features: ['بناء تدريجي مدروس', 'تكامل كامل مع التخزين المحلي والواجهة'],
    philosophy: 'نبني خطوة بخطوة، نختبر، ثم نطور.',
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>{spec.phase}</span>
            <span>·</span>
            <span>{spec.version}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            {spec.title}
          </h1>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-xs text-[#cccccc] hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] transition-colors"
        >
          <span>العودة للوحة التحكم</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-5">
        <div className="rounded-lg bg-[#14120a] border border-[var(--accent-gold)]/20 p-4">
          <div className="text-xs font-bold text-[var(--accent-gold)] mb-1">
            لماذا لم نقم ببناء هذا القسم دفعة واحدة؟
          </div>
          <p className="text-xs text-[#cccccc] leading-relaxed">
            وفقاً لتعليماتك الصارمة: <span className="text-[var(--accent-gold)] font-semibold">"ابدأ بـ Version 0.1 فقط (Dashboard + Goals + Today + Projects + LocalStorage)، ثم اجعل التطبيق يعمل فعلاً، وبعد ذلك نطور نسخة وراء نسخة."</span> هذه المعمارية مهيأة بالكامل لاستقبال هذا الموديول في المرحلة القادمة فور اختبار واستقرار الـ MVP.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            نظرة عامة على الموديول:
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {spec.summary}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            الميزات المخططة برمجياً في {spec.version}:
          </h3>
          <div className="space-y-2 pt-1">
            {spec.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#e0e0e0]">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--accent-gold)]">فلسفة التنفيذ: </span>
          {spec.philosophy}
        </div>
      </div>
    </div>
  );
};
