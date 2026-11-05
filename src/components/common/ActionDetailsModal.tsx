/**
 * components/common/ActionDetailsModal.tsx
 * نافذة فحص تفاصيل الخطوة المنجزة ومقارنة ما قبل وبعد
 * تتيح لمحمد السماحي رؤية كل البيانات الدقيقة للخطوة،
 * مع زر فوري لاسترجاع أي شيء لمكانه الأصلي "بحيث اقدر ارجع اى حاجه مكانها".
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Tag,
  Info,
  ExternalLink,
} from 'lucide-react';
import { ActionCategory, ActionType } from '../../types';

export const ActionDetailsModal: React.FC = () => {
  const {
    selectedActionDetails,
    setSelectedActionDetails,
    undoAction,
    setActiveTab,
  } = useApp();

  if (!selectedActionDetails) return null;

  const action = selectedActionDetails;

  const handleClose = () => {
    setSelectedActionDetails(null);
  };

  const handleUndo = () => {
    if (action.canUndo && !action.undone) {
      undoAction(action.id);
      // Close modal after undoing or update current snapshot
      setSelectedActionDetails({
        ...action,
        undone: true,
        undoneAt: new Date().toISOString(),
      });
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getCategoryLabel = (category: ActionCategory) => {
    switch (category) {
      case 'task':
        return 'مهمة عمل';
      case 'habit':
        return 'عادة يومية';
      case 'project':
        return 'مشروع تنفيذي';
      case 'goal':
        return 'هدف سنوي 2027';
      case 'idea':
        return 'فكرة في الـ Parking Lot';
      case 'timeLog':
        return 'سجل عمل ووقت';
      case 'transaction':
        return 'معاملة مالية';
      case 'experiment':
        return 'تجربة دخل مصغرة';
      case 'review':
        return 'مراجعة أسبوعية';
      default:
        return 'سجل نظام';
    }
  };

  const getActionTypeLabel = (type: ActionType) => {
    switch (type) {
      case 'complete':
        return 'إنجاز واكتمال';
      case 'uncomplete':
        return 'إلغاء اكتمال';
      case 'create':
        return 'إضافة جديدة';
      case 'update':
        return 'تعديل وتحديث';
      case 'delete':
        return 'حذف إلى السلة';
      case 'restore':
        return 'استرجاع من السلة';
      case 'focus':
        return 'تعديل تركيز اليوم';
      case 'move':
        return 'نقل وتحويل';
      default:
        return 'عملية';
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl transition-all"
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/25 text-[var(--accent-gold)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-primary)] font-sans">
                  تفاصيل الخطوة المنجزة
                </h3>
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 text-[11px] font-mono text-[var(--accent-gold)] border border-[var(--border-color)]">
                  {getCategoryLabel(action.category)}
                </span>
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 text-[11px] font-mono text-[var(--text-secondary)]">
                  {getActionTypeLabel(action.actionType)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                توثيق كامل للبيانات مع إمكانية استرجاع العنصر إلى مكانه بدقة
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border-color)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* محتوى التفاصيل */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {/* إشعار حالة الاسترجاع */}
          {action.undone && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-300">
              <RotateCcw className="h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <span className="font-bold">تم التراجع عن هذه الخطوة مسبقاً!</span>
                <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">
                  تم استرجاع العنصر بنجاح إلى مكانه الأصلي وإلغاء هذا التغيير في: {action.undoneAt ? formatTimestamp(action.undoneAt) : 'سجل سابق'}.
                </p>
              </div>
            </div>
          )}

          {/* بطاقة العنصر الأساسي */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4">
            <div className="text-xs text-[var(--text-muted)]">عنوان العنصر المستهدف:</div>
            <div className="mt-1 text-lg font-bold text-[var(--text-primary)] font-sans">
              {action.itemTitle}
            </div>
            <div className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
              {action.description}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-3">
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
                <span>{formatTimestamp(action.timestamp)}</span>
              </div>
              {action.metadata?.lifeArea && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-[var(--text-secondary)]" />
                    <span>المجال: {action.metadata.lifeArea}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* جدول أو بطاقات مقارنة التغييرات (قبل vs بعد) */}
          {action.changes && action.changes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#dddddd]">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
                  <span>ما تم تغييره في هذه الخطوة (المقارنة الدقيقة):</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)] font-mono text-[11px] border-b border-[var(--border-color)]">
                    <tr>
                      <th className="py-2.5 px-3">الخاصية</th>
                      <th className="py-2.5 px-3">الحالة السابقة (قبل)</th>
                      <th className="py-2.5 px-3">الحالة الجديدة (بعد)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {action.changes.map((change, idx) => (
                      <tr key={idx} className="hover:bg-[var(--bg-elevated)]">
                        <td className="py-2.5 px-3 font-medium text-[#f0f0f0]">
                          {change.label}
                        </td>
                        <td className="py-2.5 px-3 text-[var(--text-muted)] font-mono">
                          {change.oldValue !== undefined ? String(change.oldValue) : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-400 font-mono">
                          {change.newValue !== undefined ? String(change.newValue) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* البيانات الوصفية الإضافية (Metadata) */}
          {action.metadata && Object.keys(action.metadata).length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#bbbbbb]">
                بيانات إضافية عن العنصر:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {action.metadata.priority && (
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono">الأولوية</span>
                    <span className="font-medium text-[var(--text-primary)] mt-0.5 block">
                      {action.metadata.priority === 'high' ? 'عالية (High Focus)' : action.metadata.priority}
                    </span>
                  </div>
                )}
                {action.metadata.durationMinutes !== undefined && (
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono">المدة المستغرقة</span>
                    <span className="font-medium text-[var(--accent-gold)] mt-0.5 block font-mono">
                      {action.metadata.durationMinutes} دقيقة
                    </span>
                  </div>
                )}
                {action.metadata.streak !== undefined && (
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono">أيام الالتزام (Streak)</span>
                    <span className="font-medium text-orange-400 mt-0.5 block font-mono">
                      {action.metadata.streak} يوماً متتالياً
                    </span>
                  </div>
                )}
                {action.metadata.progress !== undefined && (
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono">نسبة الإنجاز</span>
                    <span className="font-medium text-emerald-400 mt-0.5 block font-mono">
                      {action.metadata.progress}%
                    </span>
                  </div>
                )}
                {action.metadata.amount !== undefined && (
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-2.5">
                    <span className="text-[10px] text-[var(--text-muted)] block font-mono">المبلغ المالي</span>
                    <span className="font-medium text-emerald-400 mt-0.5 block font-mono">
                      {action.metadata.amount.toLocaleString()} ج.م
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* توضيح السيادة والتحكم الذاتي */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-[var(--text-primary)] font-semibold">تحكم كامل وسيادة ذاتية:</span> يمكنك دائماً التراجع عن أي خطوة في أي وقت لاسترجاع العنصر إلى وضعه وحالته بدقة تامة دون فقدان أي بيانات.
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات في أسفل المودال */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 py-4">
          <button
            onClick={() => {
              setActiveTab('manba');
              handleClose();
            }}
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
            <span>فتح منبع الإنجازات والأنشطة الكامل</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleClose}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
            >
              إغلاق النافذة
            </button>

            {action.canUndo && !action.undone && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] hover:bg-[#e2bd46] active:scale-95 px-4 py-2 text-xs font-bold text-black transition-all shadow-md"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>تراجع عن هذه الخطوة واسترجاع العنصر لمكانه</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
