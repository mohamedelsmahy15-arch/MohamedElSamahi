/**
 * components/errors/ErrorCodexView.tsx
 * سجل الأخطاء والدروس المستفادة وتعديل المسار (Universal Life & Code Codex)
 * مساحة شاملة لتوثيق أي خطأ يواجهك: سواء في الكود والبرمجة، أو تواصل وعلاقات،
 * أو انضباط وعادات، أو قرارات عمل.. لتخرج منه بالبديل الأفضل والدرس الذهبي
 * وتضمن عدم تكراره أبداً، مع تصدير Markdown (.md) بضغطة زر واحدة.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ErrorLogItem, ErrorCategory, ErrorSeverity } from '../../types';
import {
  ShieldAlert,
  Plus,
  FileDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Trash2,
  Edit3,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Users,
  Code,
  HeartHandshake,
} from 'lucide-react';

const CATEGORIES: { id: ErrorCategory; label: string }[] = [
  { id: 'برمجة وكود', label: '💻 برمجة وكود' },
  { id: 'تواصل وعلاقات', label: '🤝 تواصل وعلاقات (تعامل/رد فعل)' },
  { id: 'انضباط وعادات وسلوك', label: '🧘 انضباط وعادات وسلوك' },
  { id: 'قرارات عمل وتجارة', label: '💼 قرارات عمل وبزنس' },
  { id: 'إدارة وقت وتركيز', label: '⏳ إدارة وقت وتشتت' },
  { id: 'بيئة وتشغيل', label: '⚙️ بيئة وتشغيل ونظام' },
  { id: 'تصميم وواجهة', label: '🎨 تصميم وواجهة' },
  { id: 'قواعد بيانات وتخزين', label: '🗄️ قواعد بيانات وتخزين' },
  { id: 'سيرفر وAPI', label: '🌐 سيرفر وAPI' },
  { id: 'أخرى', label: '📌 أخرى' },
];

const SEVERITIES: { id: ErrorSeverity; label: string; color: string }[] = [
  { id: 'low', label: 'بسيط (Low)', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'medium', label: 'متوسط (Medium)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'high', label: 'مرتفع (High)', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  { id: 'critical', label: 'حرج (Critical)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
];

export const ErrorCodexView: React.FC = () => {
  const {
    errorLogs,
    addErrorLog,
    updateErrorLog,
    deleteErrorLog,
    toggleErrorResolved,
    exportErrorLogToMarkdown,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ErrorLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ErrorCategory>('برمجة وكود');
  const [severity, setSeverity] = useState<ErrorSeverity>('medium');
  const [symptoms, setSymptoms] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [solution, setSolution] = useState('');
  const [betterAlternative, setBetterAlternative] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [preventionRule, setPreventionRule] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // تفاصيل الخطأ المفتوح (Accordion/Expand)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // تصفية الأخطاء
  const filteredErrors = useMemo(() => {
    return errorLogs.filter((item) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.lessonLearned && item.lessonLearned.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;

      return matchSearch && matchCategory && matchSeverity;
    });
  }, [errorLogs, searchQuery, selectedCategory, selectedSeverity]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const total = errorLogs.length;
    const resolved = errorLogs.filter((e) => e.isResolved).length;
    const pending = total - resolved;
    const critical = errorLogs.filter((e) => e.severity === 'critical' || e.severity === 'high').length;
    return { total, resolved, pending, critical };
  }, [errorLogs]);

  // تصدير وتحميل ملف Markdown
  const handleDownloadMarkdown = (id?: string) => {
    const mdContent = exportErrorLogToMarkdown(id);
    const fileName = id
      ? `error-log-${id}.md`
      : `samahy-os-wisdom-codex-${new Date().toISOString().split('T')[0]}.md`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // نسخ محتوى الـ Markdown إلى الحافظة
  const handleCopyMarkdown = (id: string) => {
    const md = exportErrorLogToMarkdown(id);
    navigator.clipboard.writeText(md);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // حفظ الخطأ (إضافة أو تعديل)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !symptoms.trim()) return;

    const tags = tagsInput
      .split(/[,،\s]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingItem) {
      updateErrorLog({
        ...editingItem,
        title: title.trim(),
        category,
        severity,
        symptoms: symptoms.trim(),
        rootCause: rootCause.trim(),
        solution: solution.trim(),
        betterAlternative: betterAlternative.trim() || undefined,
        lessonLearned: lessonLearned.trim() || undefined,
        preventionRule: preventionRule.trim(),
        tags,
      });
    } else {
      addErrorLog({
        title: title.trim(),
        category,
        severity,
        date: new Date().toISOString().split('T')[0],
        symptoms: symptoms.trim(),
        rootCause: rootCause.trim(),
        solution: solution.trim(),
        betterAlternative: betterAlternative.trim() || undefined,
        lessonLearned: lessonLearned.trim() || undefined,
        preventionRule: preventionRule.trim(),
        tags,
        isResolved: true,
      });
    }

    closeModal();
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('برمجة وكود');
    setSeverity('medium');
    setSymptoms('');
    setRootCause('');
    setSolution('');
    setBetterAlternative('');
    setLessonLearned('');
    setPreventionRule('');
    setTagsInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: ErrorLogItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setSeverity(item.severity);
    setSymptoms(item.symptoms);
    setRootCause(item.rootCause);
    setSolution(item.solution);
    setBetterAlternative(item.betterAlternative || '');
    setLessonLearned(item.lessonLearned || '');
    setPreventionRule(item.preventionRule);
    setTagsInput(item.tags.join(' '));
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <span>سجل الأخطاء والحكمة والدروس</span>
            <span>·</span>
            <span>Universal Wisdom Codex</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            سجل الأخطاء والدروس وتعديل المسار
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            "لا بأس أن تخطئ، لكن المحرم هو تكرار نفس الخطأ مرتين.. وثّق أي عثرة في الكود، أو التعامل مع الناس، أو العادات، واخرج منها بالحكمة والبديل الأفضل."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {errorLogs.length > 0 && (
            <button
              onClick={() => handleDownloadMarkdown()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] transition-colors shadow-sm"
              title="تصدير السجل بالكامل كملف Markdown"
            >
              <FileDown className="h-4 w-4" />
              <span>تصدير الكل (MD)</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[var(--accent-gold)] px-4 py-2 text-xs font-bold text-black hover:bg-[#e0bc45] transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ توثيق خطأ / موقف جديد</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
          <div className="text-[11px] font-mono text-[var(--text-muted)]">إجمالي الأخطاء والدروس</div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono mt-1">
            {stats.total}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm">
          <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400">تم حلها وتداركها</div>
          <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-400 font-mono mt-1">
            {stats.resolved}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
          <div className="text-[11px] font-mono text-amber-800 dark:text-amber-400">قيد المتابعة والتثبيت</div>
          <div className="text-xl font-extrabold text-amber-800 dark:text-amber-400 font-mono mt-1">
            {stats.pending}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 shadow-sm">
          <div className="text-[11px] font-mono text-rose-800 dark:text-rose-400">عثرات حرجة / عالية التأثير</div>
          <div className="text-xl font-extrabold text-rose-800 dark:text-rose-400 font-mono mt-1">
            {stats.critical}
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="ابحث في الأخطاء، الدروس، أو الكلمات المفتاحية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] pr-9 pl-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* تصنيف */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
          >
            <option value="all">كل المجالات</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* درجة الخطورة */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
          >
            <option value="all">كل درجات التأثير</option>
            {SEVERITIES.map((sev) => (
              <option key={sev.id} value={sev.id}>
                {sev.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. List of Error & Lesson Items */}
      {filteredErrors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)] space-y-3">
          <BookOpen className="h-8 w-8 mx-auto text-[var(--accent-gold)]/60" />
          <div className="font-semibold text-sm text-[var(--text-primary)]">
            السجل نظيف ولا توجد عثرات مطابقة للبحث
          </div>
          <p className="max-w-md mx-auto text-[var(--text-secondary)]">
            أي خطأ ترتكبه (كود ما اشتغلش، تعاملت بحدة مع شخص، تكاسلت عن عادة، أو تسرعت في قرار).. افتح واضغط "+ توثيق خطأ / موقف جديد" لتوثيقه ومعرفة الحل والبديل الأفضل.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-4 py-2 text-xs font-bold text-black hover:bg-[#e0bc45] transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>توثيق أول تجربة / درس</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredErrors.map((item) => {
            const isExpanded = expandedId === item.id;
            const sevConfig = SEVERITIES.find((s) => s.id === item.severity) || SEVERITIES[1];

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-sm hover:border-[var(--border-color)] transition-all"
              >
                {/* Header Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleErrorResolved(item.id)}
                      className={`mt-0.5 shrink-0 rounded-lg p-1.5 transition-colors ${
                        item.isResolved
                          ? 'text-emerald-800 dark:text-emerald-400 bg-emerald-500/10'
                          : 'text-[var(--text-muted)] hover:text-amber-800 dark:hover:text-amber-400 bg-[var(--bg-elevated)]'
                      }`}
                      title={item.isResolved ? 'تم الحل والتدارك (اضغط لتغيير الحالة)' : 'قيد المتابعة (اضغط للتعليم كمنتهي)'}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors">
                          {item.title}
                        </span>

                        <span className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-color)] px-2 py-0.5 text-[10px] font-mono text-[var(--accent-gold)]">
                          {item.category}
                        </span>

                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${sevConfig.color}`}>
                          {sevConfig.label}
                        </span>

                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {item.date}
                        </span>
                      </div>

                      {/* Lesson Preview if exists */}
                      {item.lessonLearned && (
                        <p className="text-xs text-[var(--accent-gold)] font-medium line-clamp-1 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3 shrink-0" />
                          <span>الدرس المستفاد: {item.lessonLearned}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleCopyMarkdown(item.id)}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                      title="نسخ التوثيق كـ Markdown"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadMarkdown(item.id)}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                      title="تحميل كملف .md"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا التوثيق؟')) {
                          deleteErrorLog(item.id);
                        }
                      }}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-1.5 text-xs text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)]/40 transition-colors"
                    >
                      <span>{isExpanded ? 'طي التفاصيل' : 'عرض التفاصيل'}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] bg-[var(--bg-elevated)]/40 p-5 space-y-4 text-xs animate-in fade-in duration-150">
                    {/* ماذا حدث بالتفصيل */}
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-1 text-xs">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        <span>ماذا حدث بالتفصيل؟ (الموقف أو الأعراض أو رسالة الخطأ):</span>
                      </h4>
                      <pre className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] font-mono text-[11px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                        {item.symptoms}
                      </pre>
                    </div>

                    {/* السبب الجذري */}
                    {item.rootCause && (
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-1 text-xs">
                          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                          <span>السبب الجذري الحقيقي (Root Cause — لماذا حدث ذلك؟):</span>
                        </h4>
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] leading-relaxed">
                          {item.rootCause}
                        </div>
                      </div>
                    )}

                    {/* الحل الفعلي أو كيف تداركت الأمر */}
                    {item.solution && (
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-1 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
                          <span>الحل الفعلي أو كيف تم التدارك:</span>
                        </h4>
                        <pre className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                          {item.solution}
                        </pre>
                      </div>
                    )}

                    {/* البديل الأفضل مستقبلاً */}
                    {item.betterAlternative && (
                      <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-1">
                        <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>🔄 التصرف أو البديل الأفضل مستقبلاً (لو تكرر الموقف ماذا سأفعل؟):</span>
                        </span>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                          {item.betterAlternative}
                        </p>
                      </div>
                    )}

                    {/* الدرس المستفاد الذهبي */}
                    {item.lessonLearned && (
                      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                        <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5" />
                          <span>🧠 الدرس المستفاد الذهبي (الحكمة التراكمية):</span>
                        </span>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                          {item.lessonLearned}
                        </p>
                      </div>
                    )}

                    {/* القاعدة الذهبية للمستقبل */}
                    {item.preventionRule && (
                      <div className="p-3.5 rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] space-y-1">
                        <span className="font-bold block">🏆 القاعدة الصارمة لعدم التكرار نهائياً (Commitment):</span>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                          {item.preventionRule}
                        </p>
                      </div>
                    )}

                    {/* الوسوم */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-[var(--bg-surface)] border border-[var(--border-color)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] font-mono"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Modal: Add / Edit Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[var(--accent-gold)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {editingItem ? 'تعديل توثيق الخطأ / الدرس' : 'توثيق خطأ أو موقف جديد لاستخلاص العبرة'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                إلغاء ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  عنوان المشكلة أو الموقف: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رد فعل متسرع أثناء مكالمة، أو خطأ في تعارض مكتبات Vite، أو كسر عادة النوم"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">
                    تصنيف المجال:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ErrorCategory)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">
                    درجة التأثير / الخطورة:
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as ErrorSeverity)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                  >
                    {SEVERITIES.map((sev) => (
                      <option key={sev.id} value={sev.id}>
                        {sev.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ما حدث بالتفصيل */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  ماذا حدث بالتفصيل؟ (الأعراض / الموقف / رسالة الخطأ): *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اوصف المشكلة بوضوح: ما الذي فعلته؟ ما الذي حدث نتيجة لذلك؟ ما رسالة الخطأ أو الموقف المحرج؟"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-mono"
                />
              </div>

              {/* السبب الجذري */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  السبب الجذري الحقيقي (Root Cause — لماذا تصرفت أو حدث ذلك؟):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: غضب وتسرع، قلة نوم وإرهاق، عدم قراءة التوثيق الرسمي، أو التردد في الحسم..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              {/* الحل الفعلي أو كيف تداركت الأمر */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  الحل المباشر أو كيف تداركت الأمر:
                </label>
                <textarea
                  rows={2}
                  placeholder="كيف أصلحت الكود؟ أو كيف اعتذرت وتداركت الموقف؟ أو كيف أنقذت المهمة؟"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-mono"
                />
              </div>

              {/* البديل الأفضل مستقبلاً */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1 text-blue-800 dark:text-blue-300">
                  🔄 التصرف أو البديل الأفضل مستقبلاً (لو تكرر نفس الموقف ماذا سأفعل بدلاً من ذلك؟):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: سأتوقف 10 ثوانٍ للتنفس قبل الرد، أو سأختبر الكود في بيئة معزولة أولاً، أو سأسأل قبل أن أفتي..."
                  value={betterAlternative}
                  onChange={(e) => setBetterAlternative(e.target.value)}
                  className="w-full rounded-xl border border-blue-500/30 bg-blue-500/5 p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* الدرس المستفاد الذهبي */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1 text-amber-800 dark:text-amber-400">
                  🧠 الدرس المستفاد الذهبي (الحكمة التراكمية التي خرجت بها):
                </label>
                <input
                  type="text"
                  placeholder="مثال: الصمت عند الغضب قوة وليس ضعفاً، أو قراءة التوثيق توفر 5 ساعات تجارب عشوائية"
                  value={lessonLearned}
                  onChange={(e) => setLessonLearned(e.target.value)}
                  className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* القاعدة لعدم التكرار */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1 text-[var(--accent-gold)]">
                  🏆 القاعدة الصارمة لعدم التكرار نهائياً (Commitment):
                </label>
                <input
                  type="text"
                  placeholder="مثال: لن أقوم بعمل git push قبل إجراء tsc build، أو لن أتحدث في موضوع حساس وأنا متعب"
                  value={preventionRule}
                  onChange={(e) => setPreventionRule(e.target.value)}
                  className="w-full rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] font-medium"
                />
              </div>

              {/* الوسوم */}
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  وسوم للبحث السريع (مفصولة بمسافة):
                </label>
                <input
                  type="text"
                  placeholder="مثال: كود رياكت تواصل عادات عميل غضب"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--accent-gold)] px-5 py-2 text-xs font-bold text-black hover:bg-[#e0bc45] transition-all shadow-sm"
                >
                  {editingItem ? 'حفظ التعديلات' : 'توثيق وحفظ الحكمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
