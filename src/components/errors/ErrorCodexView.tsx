/**
 * components/errors/ErrorCodexView.tsx
 * سجل الأخطاء والدروس المستفادة (Error & Bug Codex)
 * مساحة احترافية لتوثيق المشاكل البرمجية والتشغيلية، أسبابها الجذرية،
 * وطرق حلها، مع إمكانية التصدير كملف Markdown (MD) بضغطة زر واحدة.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ErrorLogItem, ErrorCategory, ErrorSeverity } from '../../types';
import {
  ShieldAlert,
  Plus,
  FileDown,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Tag,
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
} from 'lucide-react';

const CATEGORIES: ErrorCategory[] = [
  'برمجة وكود',
  'بيئة وتشغيل',
  'تصميم وواجهة',
  'قواعد بيانات وتخزين',
  'سيرفر وAPI',
  'أخرى',
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
      : `samahy-os-error-codex-${new Date().toISOString().split('T')[0]}.md`;

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
    setPreventionRule(item.preventionRule);
    setTagsInput(item.tags.join(' '));
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <ShieldAlert className="h-4 w-4" />
            <span>السجل المعرفي للأخطاء والحلول</span>
            <span>·</span>
            <span>Bug & Error Codex</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mt-1">
            سجل الأخطاء والدروس المستفادة
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            وثّق أي خطأ أو مشكلة واجهتك مع السبب والحل، لتصبح مرجعك الذهبي وتُصدّرها كملف Markdown (MD) فوراً.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* زر تصدير الكل إلى MD */}
          <button
            onClick={() => handleDownloadMarkdown()}
            disabled={errorLogs.length === 0}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] transition-all shadow-sm disabled:opacity-50"
            title="تصدير كامل سجل الأخطاء كملف Markdown"
          >
            <FileDown className="h-4 w-4 text-[var(--accent-gold)]" />
            <span>تصدير الكل (.MD)</span>
          </button>

          {/* زر إضافة خطأ جديد */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-[var(--accent-gold)] px-4 py-2.5 text-xs font-bold text-black hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[var(--accent-gold)]/15"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>توثيق خطأ جديد</span>
          </button>
        </div>
      </div>

      {/* بطاقات الإحصاء السريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5">
          <span className="text-[11px] text-[var(--text-muted)] block">إجمالي المشاكل الموثقة</span>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1 block">
            {stats.total}
          </span>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <span className="text-[11px] text-emerald-400 block">تم حلها بنجاح ✓</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {stats.resolved}
          </span>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <span className="text-[11px] text-amber-400 block">قيد المتابعة أو التحسين</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
            {stats.pending}
          </span>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
          <span className="text-[11px] text-rose-400 block">أخطاء حرجة / عالية</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
            {stats.critical}
          </span>
        </div>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="ابحث في عنوان الخطأ، الأعراض، الحل، أو الوسوم (#vite #react)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] py-2.5 pr-10 pl-4 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] transition-colors placeholder:text-[var(--text-muted)]"
          />
        </div>

        {/* تصفية التصنيف */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
        >
          <option value="all">كل التصنيفات</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* تصفية الخطورة */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
        >
          <option value="all">كل درجات الخطورة</option>
          {SEVERITIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* قائمة الأخطاء والتوثيق */}
      {filteredErrors.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center">
          <ShieldAlert className="h-10 w-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">لا توجد أخطاء مسجلة تطابق بحثك</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            اضغط على "توثيق خطأ جديد" لإضافة أول درس مستفاد في سجلك.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredErrors.map((item) => {
            const isExpanded = expandedId === item.id;
            const sevInfo = SEVERITIES.find((s) => s.id === item.severity) || SEVERITIES[1];

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md overflow-hidden transition-all duration-200 hover:border-[var(--accent-gold)]/40"
              >
                {/* رأس العنصر */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleErrorResolved(item.id);
                      }}
                      className="mt-0.5 text-xs shrink-0"
                      title={item.isResolved ? 'تم الحل (اضغط للتبديل)' : 'قيد الحل (اضغط للتبديل)'}
                    >
                      {item.isResolved ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {item.title}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sevInfo.color}`}>
                          {sevInfo.label.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
                        <span className="font-mono text-[11px]">{item.date}</span>
                        {item.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.tags.map((t: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-1.5 py-0.2 rounded"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* أزرار الإجراءات السريعة */}
                  <div className="flex items-center gap-1.5 shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                    {/* نسخ Markdown */}
                    <button
                      onClick={() => handleCopyMarkdown(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
                      title="نسخ محتوى المشكلة بصيغة Markdown"
                    >
                      {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>

                    {/* تحميل كملف MD */}
                    <button
                      onClick={() => handleDownloadMarkdown(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
                      title="تحميل كملف .MD منفصل"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>

                    {/* تعديل */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      title="تعديل التوثيق"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* حذف */}
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف توثيق الخطأ: "${item.title}"؟`)) {
                          deleteErrorLog(item.id);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)]"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* التفاصيل القابلة للتوسيع (Expanded Section) */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] bg-[var(--bg-elevated)]/40 p-5 space-y-4 text-xs animate-in fade-in duration-150">
                    {/* الأعراض / المشكلة */}
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-1 text-xs">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        <span>الأعراض ورسالة الخطأ (Symptoms & What Happened):</span>
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
                          <span>السبب الجذري (Root Cause):</span>
                        </h4>
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] leading-relaxed">
                          {item.rootCause}
                        </div>
                      </div>
                    )}

                    {/* الحل المنفذ */}
                    {item.solution && (
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-1 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>الحل الفعلي (Solution):</span>
                        </h4>
                        <pre className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                          {item.solution}
                        </pre>
                      </div>
                    )}

                    {/* القاعدة الذهبية للمستقبل */}
                    {item.preventionRule && (
                      <div className="p-3 rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
                        <span className="font-bold block mb-0.5">🏆 القاعدة الذهبية لعدم التكرار مستقبلاً:</span>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                          {item.preventionRule}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* نافذة التوثيق (إضافة / تعديل) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[var(--accent-gold)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {editingItem ? 'تعديل توثيق الخطأ' : 'توثيق خطأ / مشكلة برمجية جديدة'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-xs text-[var(--text-muted)] hover:text-white">
                إلغاء ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  عنوان المشكلة أو الخطأ: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تعارض حزم Vite مع esbuild، أو خطأ استدعاء دالة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">التصنيف:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ErrorCategory)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-1">درجة الخطورة:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as ErrorSeverity)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  الأعراض / ماذا حدث؟ (أو انسخ رسالة الخطأ هنا): *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="انسخ رسالة الخطأ من الـ Console أو اشرح ما ظهر لك على الشاشة..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  السبب الجذري (Root Cause):
                </label>
                <textarea
                  rows={2}
                  placeholder="لماذا حدثت هذه المشكلة تقنياً؟"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  الحل المنفذ (Solution & Fix):
                </label>
                <textarea
                  rows={3}
                  placeholder="كيف تم حل المشكلة بالضبط؟ الكود أو الأمر الذي قمت بتنفيذه..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  القاعدة الذهبية لعدم التكرار (Prevention Rule):
                </label>
                <input
                  type="text"
                  placeholder="ما هي القاعدة التي تتبعها مستقبلاً لتجنب هذا الخطأ؟"
                  value={preventionRule}
                  onChange={(e) => setPreventionRule(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-primary)] font-semibold mb-1">
                  الوسوم للبحث السريع (Tags):
                </label>
                <input
                  type="text"
                  placeholder="مثال: react vite build error (افصل بمسافة أو فاصلة)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[var(--accent-gold)] py-2.5 text-xs font-bold text-black hover:opacity-95 transition-opacity"
                >
                  {editingItem ? 'حفظ التعديلات' : 'توثيق المشكلة في السجل'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
