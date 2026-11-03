/**
 * components/trash/TrashView.tsx
 * سلة المهملات وسجل التعديلات (Recycle Bin & Version History)
 * يتيح لمحمد السماحي استرجاع أي عنصر محذوف أو معدل لمكانه الأصلي،
 * أو مسحه نهائياً مع السيادة والتحكم الكامل.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trash2,
  RotateCcw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  Lightbulb,
  DollarSign,
  Flame,
  FileText,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { TrashItem, TrashItemType } from '../../types';

export const TrashView: React.FC = () => {
  const { trashItems, restoreFromTrash, deletePermanently, emptyTrash, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TrashItemType | 'all'>('all');
  const [selectedReason, setSelectedReason] = useState<'all' | 'deleted' | 'previous_version'>('all');
  const [previewItem, setPreviewItem] = useState<TrashItem | null>(null);

  // تصفية العناصر
  const filteredItems = useMemo(() => {
    return (trashItems || []).filter((item) => {
      // تصفية النوع
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      // تصفية السبب (محذوف أم نسخة سابقة)
      if (selectedReason !== 'all' && item.reason !== selectedReason) {
        return false;
      }
      // البحث بالاسم
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          (item.categoryOrArea && item.categoryOrArea.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [trashItems, selectedType, selectedReason, searchQuery]);

  // إحصائيات سريعة
  const totalCount = trashItems?.length || 0;
  const deletedCount = (trashItems || []).filter((t) => t.reason === 'deleted').length;
  const revisionsCount = (trashItems || []).filter((t) => t.reason === 'previous_version').length;

  const getTypeLabel = (type: TrashItemType) => {
    switch (type) {
      case 'task':
        return 'مهمة';
      case 'project':
        return 'مشروع';
      case 'goal':
        return 'هدف 2027';
      case 'idea':
        return 'فكرة Parking Lot';
      case 'habit':
        return 'عادة';
      case 'timeLog':
        return 'سجل وقت';
      case 'transaction':
        return 'معاملة مالية';
      case 'experiment':
        return 'تجربة دخل';
      default:
        return 'عنصر';
    }
  };

  const getTypeColor = (type: TrashItemType) => {
    switch (type) {
      case 'task':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'project':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'goal':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'idea':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'habit':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'timeLog':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'transaction':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-color)]';
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleEmptyTrashConfirm = () => {
    if (confirm('هل أنت متأكد تماماً من تفريغ سلة المهملات بالكامل؟ لن يمكن استرجاع هذه العناصر بعد ذلك.')) {
      emptyTrash();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>نظام الأمان واسترجاع البيانات</span>
            <span>·</span>
            <span>Recycle Bin & Revisions</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            سلة المهملات وسجل التعديلات
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            كل عنصر تم حذفه أو تعديله يُحفظ هنا بأمان؛ يمكنك استرجاعه لمكانه فوراً أو مسحه نهائياً.
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={handleEmptyTrashConfirm}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/40 transition-all self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>تفريغ السلة نهائياً</span>
          </button>
        )}
      </div>

      {/* شريط الإحصاءات */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
          <div className="text-[11px] text-[var(--text-muted)]">إجمالي المحفوظات في السلة</div>
          <div className="mt-1 font-mono text-xl font-bold text-[var(--accent-gold)] tabular-nums">
            {totalCount}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
            محمية من الفقدان العشوائي
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
          <div className="text-[11px] text-[var(--text-muted)]">عناصر محذوفة (يمكن استرجاعها)</div>
          <div className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)] tabular-nums">
            {deletedCount}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            استرجاع بنقرة واحدة
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-[var(--text-muted)]">نسخ سابقة من التعديلات</div>
          <div className="mt-1 font-mono text-xl font-bold text-[#38bdf8] tabular-nums">
            {revisionsCount}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
            تاريخ التعديلات السابقة
          </div>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--bg-surface)] p-3 rounded-xl border border-[#202020]">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="ابحث في سلة المهملات بالاسم أو المجال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pr-9 pl-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* فلتر السبب */}
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value as any)}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-secondary)] focus:border-[var(--accent-gold)] focus:outline-none"
          >
            <option value="all">كل الحالات (محذوف + نسخ سابقة)</option>
            <option value="deleted">محذوفات فقط</option>
            <option value="previous_version">نسخ التعديل السابقة فقط</option>
          </select>

          {/* فلتر النوع */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-secondary)] focus:border-[var(--accent-gold)] focus:outline-none"
          >
            <option value="all">كل الأنواع</option>
            <option value="task">المهام</option>
            <option value="project">المشاريع</option>
            <option value="goal">الأهداف</option>
            <option value="idea">الأفكار</option>
            <option value="habit">العادات</option>
            <option value="timeLog">سجلات الوقت</option>
            <option value="transaction">المعاملات المالية</option>
            <option value="experiment">تجارب الدخل</option>
          </select>
        </div>
      </div>

      {/* قائمة العناصر في سلة المهملات */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center text-xs text-[var(--text-muted)] space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">سلة المهملات فارغة</p>
            <p className="text-[var(--text-muted)]">
              {searchQuery || selectedType !== 'all' || selectedReason !== 'all'
                ? 'لا توجد عناصر تطابق معايير البحث الحالية.'
                : 'كل بياناتك ومهامك ومشاريعك في مكانها الصحيح دون أي عناصر محذوفة.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#202020] bg-[var(--bg-surface)] p-4 hover:border-[var(--border-color)] transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {getTypeLabel(item.type)}
                    </span>

                    {item.reason === 'previous_version' ? (
                      <span className="rounded bg-sky-950/30 text-sky-400 border border-sky-800/20 px-2 py-0.5 text-[10px] font-mono">
                        نسخة قبل التعديل
                      </span>
                    ) : (
                      <span className="rounded bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono">
                        عنصر محذوف
                      </span>
                    )}

                    {item.categoryOrArea && (
                      <span className="text-[11px] text-[var(--text-muted)]">
                        · {item.categoryOrArea}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                    <Clock className="h-3 w-3" />
                    <span>تاريخ الحفظ: {formatDate(item.deletedAt)}</span>
                  </div>
                </div>

                {/* أزرار الاسترجاع والحذف النهائي */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)] w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    معاينة البيانات
                  </button>

                  <button
                    onClick={() => restoreFromTrash(item.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all"
                    title="استرجاع العنصر إلى مكانه الأصلي"
                  >
                    <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>استرجاع لمكانه</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف "${item.title}" نهائياً من النظام؟`)) {
                        deletePermanently(item.id);
                      }
                    }}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    title="مسح نهائي لا رجعة فيه"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* نافذة معاينة بيانات العنصر قبل الاسترجاع */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[var(--accent-gold)]">
                  معاينة العنصر المحفوظ
                </span>
                <h2 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                  {previewItem.title}
                </h2>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)] space-y-1.5">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>النوع:</span>
                  <span className="text-[var(--text-primary)] font-semibold">{getTypeLabel(previewItem.type)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>الحالة:</span>
                  <span className="text-[var(--accent-gold)]">
                    {previewItem.reason === 'deleted' ? 'عنصر محذوف' : 'نسخة سابقة من التعديل'}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>وقت الحفظ في السلة:</span>
                  <span className="font-mono text-[var(--text-secondary)]">{formatDate(previewItem.deletedAt)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] mb-1 font-mono">
                  البيانات الكاملة بصيغة JSON الأصلية:
                </label>
                <pre className="max-h-48 overflow-y-auto rounded-lg bg-[var(--bg-surface)] p-3 text-[11px] font-mono text-[#a0a0a0] border border-[var(--border-color)] dir-ltr text-left">
                  {JSON.stringify(previewItem.originalData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => {
                  restoreFromTrash(previewItem.id);
                  setPreviewItem(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>استرجاع الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
