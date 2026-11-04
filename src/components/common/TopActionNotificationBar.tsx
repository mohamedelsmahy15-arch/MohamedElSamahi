/**
 * components/common/TopActionNotificationBar.tsx
 * شريط الإشعار العلوي التفاعلي لنظام "السماحي OS"
 * يظهر في أعلى الشاشة عند إنجاز أي خطوة أو تعديل،
 * ويوفر أزرار:
 * 1. "تراجع عن الخطوة" (Undo): استرجاع العنصر لمكانه وحالته فوراً
 * 2. "عرض تفاصيل الخطوة": فتح نافذة التفاصيل والمقارنة قبل وبعد
 * 3. "إغلاق": إخفاء الشريط
 * 4. الانتقال إلى "منبع الإنجازات"
 */

import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  RotateCcw,
  Eye,
  X,
  Sparkles,
  AlertCircle,
  PlusCircle,
  Edit3,
  Trash2,
  FolderGit2,
  Flame,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ActionHistoryItem, ActionCategory } from '../../types';

export const TopActionNotificationBar: React.FC = () => {
  const {
    latestAction,
    dismissLatestAction,
    undoAction,
    setSelectedActionDetails,
    setActiveTab,
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const DURATION_MS = 12000; // 12 seconds auto-dismiss
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(DURATION_MS);

  // إعادة ضبط المؤقت عند تغير آخر عملية
  useEffect(() => {
    if (!latestAction) return;

    setProgress(100);
    remainingTimeRef.current = DURATION_MS;
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          const next = prev - (100 / (DURATION_MS / 100));
          if (next <= 0) {
            clearInterval(interval);
            dismissLatestAction();
            return 0;
          }
          return next;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [latestAction?.id, isHovered]);

  if (!latestAction) return null;

  const getActionIcon = () => {
    if (latestAction.undone) {
      return <RotateCcw className="h-5 w-5 text-amber-400" />;
    }
    switch (latestAction.actionType) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'uncomplete':
        return <RotateCcw className="h-5 w-5 text-blue-400" />;
      case 'create':
        return <PlusCircle className="h-5 w-5 text-[var(--accent-gold)]" />;
      case 'update':
        return <Edit3 className="h-5 w-5 text-sky-400" />;
      case 'delete':
        return <Trash2 className="h-5 w-5 text-rose-400" />;
      case 'focus':
        return <Sparkles className="h-5 w-5 text-amber-300" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    }
  };

  const getCategoryBadgeLabel = (cat: ActionCategory) => {
    switch (cat) {
      case 'task':
        return 'مهمة';
      case 'habit':
        return 'عادة';
      case 'project':
        return 'مشروع';
      case 'goal':
        return 'هدف';
      case 'idea':
        return 'Parking Lot';
      case 'timeLog':
        return 'وقت';
      case 'transaction':
        return 'مالية';
      case 'experiment':
        return 'تجربة دخل';
      case 'review':
        return 'مراجعة';
      default:
        return 'إجراء';
    }
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation();
    undoAction(latestAction.id);
  };

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActionDetails(latestAction);
  };

  const handleOpenManba = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('manba');
    dismissLatestAction();
  };

  return (
    <div
      dir="rtl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-2 left-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 transform transition-all duration-300 ease-out"
      role="alert"
    >
      <div className="relative overflow-hidden rounded-xl border border-[var(--accent-gold)]/40 bg-[var(--bg-elevated)]/95 px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl md:px-5 md:py-3.5">
        {/* شريط التقدم الزمني للإغلاق التلقائي */}
        {!latestAction.undone && (
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--bg-elevated)]">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-300 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* الجانب الأيمن: الأيقونة وشرح ما تم إنجازه */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] shadow-inner">
              {getActionIcon()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-[var(--text-primary)] font-sans text-sm">
                  {latestAction.undone ? 'تم التراجع عن الخطوة:' : 'أنجزت خطوة:'} {latestAction.title}
                </span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[11px] font-mono text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded border border-[var(--accent-gold)]/20">
                  {getCategoryBadgeLabel(latestAction.category)}
                </span>
                {latestAction.undone && (
                  <span className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                    مُسترجع لمكانه
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#bbbbbb] truncate">
                <span className="font-medium text-[#f0f0f0] truncate max-w-[280px] md:max-w-md">
                  "{latestAction.itemTitle}"
                </span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-muted)] text-[11px] truncate hidden sm:inline">
                  {latestAction.description}
                </span>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: أزرار التراجع والتفاصيل والإغلاق والمنبع */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
            {/* زر التراجع عن الخطوة */}
            {latestAction.canUndo && !latestAction.undone && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] hover:bg-[#e0bc45] active:scale-95 px-3 py-1.5 text-xs font-bold text-black transition-all shadow-sm"
                title="تراجع فوراً واسترجع العنصر إلى مكانه وحالته السابقة"
              >
                <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>تراجع عن الخطوة</span>
              </button>
            )}

            {/* زر تفاصيل الخطوة */}
            <button
              onClick={handleOpenDetails}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-color)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors"
              title="عرض كل ما حدث في هذه الخطوة ومقارنة ما قبلها وبعدها"
            >
              <Eye className="h-3.5 w-3.5 text-sky-400" />
              <span>تفاصيل الخطوة</span>
            </button>

            {/* زر الذهاب للمنبع */}
            <button
              onClick={handleOpenManba}
              className="hidden lg:flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-gold)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors"
              title="الانتقال إلى منبع الإنجازات والأنشطة"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
              <span>المنبع</span>
            </button>

            {/* زر إغلاق */}
            <button
              onClick={dismissLatestAction}
              className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors"
              aria-label="إغلاق الإشعار"
              title="إغلاق الإشعار"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">إغلاق</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
