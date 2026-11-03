/**
 * components/layout/Header.tsx
 * شريط الرأس العلوي لنظام "السماحي OS"
 * ينفذ قاعدة Top Bar Contract بدقة: كلمة البراند + الروابط/الحالة + أزرار الإجراء السريع
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Lightbulb, Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const { setIsIdeaModalOpen, setIsQuickTaskModalOpen, dailyScoreBreakdown } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#222222] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-md md:px-8">
      {/* المنطقة 1: كلمة البراند فقط */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded border border-[#222222] bg-[#111111] text-[#F5F5F5] md:hidden"
          aria-label="القائمة"
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-sm tracking-widest font-mono">
            OS
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#F5F5F5] font-sans">
              السماحي OS
            </span>
          </div>
        </div>
      </div>

      {/* المنطقة 2: مؤشر سنة البناء والتركيز */}
      <div className="hidden items-center gap-3 text-xs text-[#999999] md:flex">
        <span className="font-mono text-[#D4AF37]">2027</span>
        <span aria-hidden="true">·</span>
        <span>سنة البناء</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums text-[#F5F5F5]">
          تركيز اليوم: {dailyScoreBreakdown.focusTasksRatio}
        </span>
      </div>

      {/* المنطقة 3: أزرار الإجراء السريع (ضغطة واحدة لإضافة فكرة أو مهمة) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsIdeaModalOpen(true)}
          className="flex items-center gap-1.5 rounded border border-[#333333] bg-[#111111] px-3 py-1.5 text-xs font-medium text-[#F5F5F5] transition-colors hover:border-[#D4AF37]/50 hover:bg-[#1a1a1a] hover:text-[#D4AF37] whitespace-nowrap"
          title="تسجيل فكرة سريعة في الـ Parking Lot حتى لا تشتتك"
        >
          <Lightbulb className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>+ فكرة</span>
        </button>

        <button
          onClick={() => setIsQuickTaskModalOpen(true)}
          className="flex items-center gap-1.5 rounded bg-[#D4AF37] px-3.5 py-1.5 text-xs font-semibold text-black transition-all hover:bg-[#e0bc45] whitespace-nowrap shadow-sm active:scale-98"
        >
          <Plus className="h-3.5 w-3.5 text-black stroke-[3]" />
          <span>+ مهمة</span>
        </button>
      </div>
    </header>
  );
};
