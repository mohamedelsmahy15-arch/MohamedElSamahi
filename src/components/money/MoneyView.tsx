/**
 * components/money/MoneyView.tsx
 * لوحة التدفق المالي (Money Ledger & Financial Clarity)
 * تتبع الإيرادات، المصروفات، وفصل أموال البزنس عن المصاريف الشخصية
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Trash2,
  Filter,
  CreditCard,
  Building2,
} from 'lucide-react';
import { MoneyCategory, TransactionType } from '../../types';

export const MoneyView: React.FC = () => {
  const { state, addTransaction, deleteTransaction, financialSummary } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // حقول إضافة معاملة
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<MoneyCategory>('خدمات ومستقل (Services)');
  const [sourceOrPayee, setSourceOrPayee] = useState('');
  const [notes, setNotes] = useState('');
  const [isBusiness, setIsBusiness] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !sourceOrPayee.trim()) return;

    addTransaction({
      amount: Number(amount),
      type,
      category,
      sourceOrPayee: sourceOrPayee.trim(),
      notes: notes.trim(),
      isBusiness,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setSourceOrPayee('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredTransactions = state.transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    return true;
  });

  const allCategories: MoneyCategory[] = [
    'خدمات ومستقل (Services)',
    'مشاريع وبزنس (Business)',
    'عمل أساسي (Work)',
    'أدوات واشتراكات (Tools & Tech)',
    'معيشة ومصاريف شخصية (Personal)',
    'تعليم وتطوير (Education)',
    'ادخار واستثمار (Savings)',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span>التدفق المالي والبزنس</span>
            <span>·</span>
            <span>Money Dashboard</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F5] mt-1">
            المال والتدفق النقدي
          </h1>
          <p className="text-xs text-[#999999] mt-0.5">
            "المال يتبع القيمة. افصل أموال البزنس عن الشخصي، وتتبع كل جنيه يدخل أو يخرج."
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-black hover:bg-[#e0bc45] transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ إضافة حركة مالية</span>
        </button>
      </div>

      {/* بطاقات الإحصائيات الأربع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* إجمالي الدخل */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>إجمالي الدخل المحقق</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {financialSummary.totalIncome.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-[#666666]">
            منها {financialSummary.businessIncome.toLocaleString()} ج.م دخل بزنس/خدمات
          </div>
        </div>

        {/* إجمالي المصروفات */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>إجمالي المصروفات</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#F5F5F5] tabular-nums">
            {financialSummary.totalExpense.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-[#666666]">شخصية واستثمارية</div>
        </div>

        {/* صافي الربح */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>صافي الفائض النقدي</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">
            {financialSummary.netProfit.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-[#666666]">الفائض القابل للادخار أو إعادة الاستثمار</div>
        </div>

        {/* معدل الادخار */}
        <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>معدل الادخار</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-blue-400 tabular-nums">
            {financialSummary.savingsRate}%
          </div>
          <div className="text-[11px] text-[#666666]">المستهدف في 2027: 30%+</div>
        </div>
      </div>

      {/* جدول الحركات المالية */}
      <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a] pb-3">
          <h2 className="text-sm font-semibold text-[#F5F5F5]">سجل المعاملات المالية</h2>

          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#222222] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'all'
                  ? 'bg-[#222222] text-[#F5F5F5]'
                  : 'text-[#777777] hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'income'
                  ? 'bg-[#222222] text-emerald-400'
                  : 'text-[#777777] hover:text-white'
              }`}
            >
              دخل (+)
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'expense'
                  ? 'bg-[#222222] text-red-400'
                  : 'text-[#777777] hover:text-white'
              }`}
            >
              مصروف (-)
            </button>
            <button
              onClick={() => setFilterType('savings')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'savings'
                  ? 'bg-[#222222] text-blue-400'
                  : 'text-[#777777] hover:text-white'
              }`}
            >
              ادخار
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#777777]">
              لا توجد حركات مالية مسجلة في هذا القسم.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[#1a1a1a] bg-[#111111] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : isExpense
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {isIncome ? '+' : isExpense ? '-' : '★'}
                    </div>

                    <div>
                      <div className="font-medium text-[#F5F5F5]">{tx.sourceOrPayee}</div>
                      <div className="flex items-center gap-2 text-[11px] text-[#777777] mt-0.5">
                        <span>{tx.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{tx.date}</span>
                        {tx.isBusiness && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#D4AF37]">بزنس</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`font-mono font-bold text-sm tabular-nums ${
                        isIncome
                          ? 'text-emerald-400'
                          : isExpense
                          ? 'text-[#F5F5F5]'
                          : 'text-blue-400'
                      }`}
                    >
                      {isIncome ? '+' : isExpense ? '-' : ''}
                      {tx.amount.toLocaleString()} ج.م
                    </span>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-[#555555] hover:text-red-400 p-1"
                      title="حذف الحركة"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* نافذة إضافة حركة مالية */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-bold text-[#F5F5F5]">إضافة حركة مالية جديدة</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#777777] hover:text-[#F5F5F5]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">نوع الحركة:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="income">إيراد ودخل (+)</option>
                    <option value="expense">مصروف (-)</option>
                    <option value="savings">ادخار واستثمار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#999999] mb-1 font-medium">المبلغ (ج.م):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="مثال: 3500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">البيان أو الطرف الآخر:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دفعة تصميم موقع لعميل متجر ملابس"
                  value={sourceOrPayee}
                  onChange={(e) => setSourceOrPayee(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">التصنيف:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MoneyCategory)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBusiness}
                    onChange={(e) => setIsBusiness(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#D4AF37]"
                  />
                  <span>خاصة بالبزنس والعمل الحر (فصل عن المصاريف الشخصية)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#333333] px-3 py-1.5 text-xs text-[#888888] hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#e0bc45]"
                >
                  حفظ الحركة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
