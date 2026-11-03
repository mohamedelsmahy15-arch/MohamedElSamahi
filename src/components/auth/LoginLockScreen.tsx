/**
 * components/auth/LoginLockScreen.tsx
 * شاشة القفل ولوحة تسجيل الدخول الآمنة لنظام "السماحي OS"
 * مصممة بدقة لتناسب الاستخدام من الموبايل أو شاشة الكمبيوتر
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
} from 'lucide-react';

export const LoginLockScreen: React.FC = () => {
  const { login, changePin, isDefaultPin } = useAuth();
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // حقول تغيير الرمز
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  // إدخال الأرقام
  const handleDigitPress = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);
      // تجربة التحقق التلقائي عند 4 أرقام
      if (nextPin.length === 4) {
        setTimeout(() => {
          if (!login(nextPin, remember)) {
            // إن لم يكن الرمز 4 أرقام، ننتظر أن يدخل المزيد أو يضغط دخول
          }
        }, 150);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('يرجى إدخال رمز المرور');
      return;
    }
    const success = login(pin, remember);
    if (!success) {
      setError('رمز المرور غير صحيح، حاول مرة أخرى');
      setPin('');
    }
  };

  // دعم الكتابة المباشرة من لوحة مفاتيح الكمبيوتر
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChangingPin) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, remember, isChangingPin]);

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4 text-[var(--text-primary)] select-none">
      {/* خلفية جمالية بتوهج ذهبي خفيف */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      <div className="relative w-full max-w-sm rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* رأس البطاقة */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 shadow-lg">
            <Lock className="h-8 w-8 text-[var(--accent-gold)] animate-pulse" />
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
          <>
            {/* مؤشر النقاط الرقمية (PIN Indicator) */}
            <div className="my-6 flex justify-center items-center gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-[var(--accent-gold)] scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                        : 'border border-[var(--border-color)] bg-[var(--bg-surface)]'
                    }`}
                  />
                );
              })}
            </div>

            {/* رسائل الخطأ والتنبيه */}
            {error && (
              <div className="mb-4 flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-400 animate-in fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isDefaultPin && !error && (
              <div className="mb-4 text-center text-[11px] text-[var(--text-muted)] bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-color)]">
                الرمز الافتراضي المبدئي هو: <span className="font-mono font-bold text-[var(--accent-gold)]">2027</span>
              </div>
            )}

            {/* لوحة الأرقام اللمسية للهاتف والكمبيوتر */}
            <div className="grid grid-cols-3 gap-2.5 text-lg font-mono">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitPress(digit)}
                  className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/40 active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:text-rose-400 active:scale-95"
              >
                مسح
              </button>
              <button
                onClick={() => handleDigitPress('0')}
                className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/40 active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleDeleteDigit}
                className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-amber-400 active:scale-95"
                aria-label="حذف"
              >
                <Delete className="h-5 w-5" />
              </button>
            </div>

            {/* زر فتح النظام */}
            <button
              onClick={() => handleSubmit()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-gold)] py-3 text-sm font-bold text-black transition-all hover:opacity-95 active:scale-98 shadow-md"
            >
              <Unlock className="h-4 w-4 stroke-[2.5]" />
              <span>فتح النظام</span>
            </button>

            {/* خيارات الجلسة وتغيير الرمز */}
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent-gold)] focus:ring-0"
                />
                <span>تذكر هذا الجهاز</span>
              </label>

              <button
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
          </>
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
