/**
 * components/auth/LoginLockScreen.tsx
 * شاشة القفل ولوحة تسجيل الدخول الآمنة فائقة السلاسة لنظام "السماحي OS"
 * تدعم الكتابة المباشرة، كيبورد عربي وإنجليزي، لوحة لمس، ودخول فوري مباشر
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, normalizeDigits } from '../../context/AuthContext';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Delete,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LoginLockScreen: React.FC = () => {
  const { login, bypassLogin, changePin, isDefaultPin, currentPin } = useAuth();
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // حقول تغيير الرمز
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  // التركيز التلقائي على حقل الإدخال
  useEffect(() => {
    inputRef.current?.focus();
  }, [isChangingPin]);

  // إدخال الأرقام من خلال حقل الإدخال مباشرة
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = normalizeDigits(raw).replace(/[^0-9]/g, '').slice(0, 8);
    setPin(normalized);
    setError(null);

    // التحقق التلقائي عند 4 أرقام
    if (normalized.length >= 4) {
      if (login(normalized, remember)) {
        return;
      }
    }
  };

  // إدخال الأرقام عبر الأزرار (Functional state update لمنع فقد أي رقم)
  const handleDigitPress = (digit: string) => {
    setPin((prev) => {
      const nextPin = (prev + digit).slice(0, 8);
      setError(null);
      if (nextPin.length >= 4) {
        setTimeout(() => {
          login(nextPin, remember);
        }, 50);
      }
      return nextPin;
    });
    inputRef.current?.focus();
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setPin('');
    setError(null);
    inputRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('يرجى إدخال رمز المرور (الافتراضي 2027)');
      inputRef.current?.focus();
      return;
    }
    const success = login(pin, remember);
    if (!success) {
      setError('رمز المرور غير صحيح. يمكنك استخدام "الدخول الفوري" أدناه.');
      inputRef.current?.focus();
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError(null);
    const result = changePin(oldPinInput, newPinInput);
    if (result.success) {
      setChangeSuccess(true);
      setTimeout(() => {
        setIsChangingPin(false);
        setChangeSuccess(false);
        setOldPinInput('');
        setNewPinInput('');
        setError(null);
      }, 1500);
    } else {
      setChangeError(result.error || 'فشل التغيير');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4 text-[var(--text-primary)]">
      <div className="relative w-full max-w-sm rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-2xl transition-all">
        {/* رأس البطاقة */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 shadow-md">
            <Lock className="h-8 w-8 text-[var(--accent-gold)]" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-gold)] text-[10px] font-bold text-black">
              OS
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            السماحي OS
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)] font-medium">
            مرحباً يا محمد 👋 · 2027 سنة البناء
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1 text-[11px] text-[var(--accent-gold)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>نظام شخصي محمي ومشفّر</span>
          </div>
        </div>

        {!isChangingPin ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* حقل الإدخال الحقيقي مع دعم لوحة المفاتيح المباشرة وإظهار/إخفاء الرمز */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                <span>رمز المرور (PIN):</span>
                <span className="font-mono text-[11px] text-[var(--accent-gold)]">
                  الافتراضي: 2027
                </span>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={handleInputChange}
                  placeholder="2027"
                  autoFocus
                  maxLength={8}
                  dir="ltr"
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-2.5 px-10 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] focus:ring-2 focus:ring-[var(--accent-gold)]/20 transition-all shadow-inner placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-[var(--text-muted)]"
                />

                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                  title={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* رسائل الخطأ والتنبيه */}
            {error && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-400 animate-in fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* زر فتح النظام الأساسي */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-gold)] py-3 text-sm font-bold text-black transition-all hover:bg-[var(--accent-gold-hover)] active:scale-98 shadow-md"
            >
              <Unlock className="h-4 w-4 stroke-[2.5]" />
              <span>فتح النظام</span>
            </button>

            {/* زر الدخول الفوري السريع لتخطي أي مشكلة بنقرة واحدة */}
            <button
              type="button"
              onClick={() => bypassLogin()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 py-2.5 text-xs font-bold text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-all active:scale-98 shadow-sm"
              title="دخول فوري مباشر وتخطي شاشة القفل"
            >
              <Sparkles className="h-4 w-4 text-[var(--accent-gold)]" />
              <span>دخول فوري مباشر (تخطي القفل) ⚡</span>
            </button>

            {/* لوحة الأرقام السريعة للموبايل واللمس */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2 text-base font-mono">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    className="flex h-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/40 active:scale-95 transition-all"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-rose-400 active:scale-95 transition-all"
                >
                  مسح
                </button>
                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  className="flex h-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/40 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDeleteDigit}
                  className="flex h-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-amber-400 active:scale-95 transition-all"
                  aria-label="حذف رقم"
                >
                  <Delete className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* خيارات الجلسة وتغيير الرمز */}
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent-gold)] focus:ring-0"
                />
                <span>تذكر هذا الجهاز دائماً</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(true);
                  setError(null);
                }}
                className="flex items-center gap-1 text-[var(--accent-gold)] hover:underline"
              >
                <KeyRound className="h-3 w-3" />
                <span>تغيير الرمز</span>
              </button>
            </div>
          </form>
        ) : (
          /* واجهة تغيير الرمز */
          <form onSubmit={handleChangePinSubmit} className="mt-4 space-y-3">
            <h3 className="text-center text-xs font-semibold text-[var(--accent-gold)]">
              تغيير رمز المرور السري
            </h3>

            {changeSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-2.5 text-xs text-emerald-400 border border-emerald-500/20">
                <Check className="h-4 w-4" />
                <span>تم تغيير رمز المرور بنجاح!</span>
              </div>
            )}

            {changeError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-2.5 text-xs text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-4 w-4" />
                <span>{changeError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                الرمز الحالي:
              </label>
              <input
                type="password"
                value={oldPinInput}
                onChange={(e) => setOldPinInput(e.target.value)}
                placeholder="أدخل الرمز الحالي (الافتراضي 2027)"
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                الرمز الجديد (4 أرقام فأكثر):
              </label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="أدخل الرمز الجديد"
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[var(--accent-gold)] py-2 text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                حفظ الرمز
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setChangeError(null);
                }}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 text-center text-[11px] text-[var(--text-muted)]">
        <span>السماحي OS © 2027 · Build → Learn → Apply → Earn</span>
      </div>
    </div>
  );
};
