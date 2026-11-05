/**
 * context/AuthContext.tsx
 * إدارة جلسة الدخول وتأمين نظام "السماحي OS"
 * يدعم رمز المرور السريع (PIN)، القفل الفوري، والحفظ الآمن محلياً
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// تحويل الأرقام العربية والفارسية إلى أرقام إنجليزية موحدة
export function normalizeDigits(input: string): string {
  if (!input) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = input.trim();
  for (let i = 0; i < 10; i++) {
    result = result.split(arabicDigits[i]).join(String(i));
    result = result.split(persianDigits[i]).join(String(i));
  }
  return result;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string, remember?: boolean) => boolean;
  bypassLogin: () => void;
  logout: () => void;
  changePin: (currentPin: string, newPin: string) => { success: boolean; error?: string };
  isDefaultPin: boolean;
  currentPin: string;
}

const PIN_STORAGE_KEY = 'samahy_os_auth_pin';
const SESSION_STORAGE_KEY = 'samahy_os_auth_session';
const DEFAULT_PIN = '2027';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      return savedSession === 'true';
    } catch {
      return false;
    }
  });

  const [currentPin, setCurrentPin] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });

  const isDefaultPin = currentPin === DEFAULT_PIN;

  const login = (pin: string, remember = true): boolean => {
    const normalizedInput = normalizeDigits(pin);
    const normalizedCurrent = normalizeDigits(currentPin);
    const normalizedDefault = normalizeDigits(DEFAULT_PIN);

    // قبول الرمز الحالي أو الرمز الافتراضي 2027
    if (normalizedInput === normalizedCurrent || normalizedInput === normalizedDefault) {
      setIsAuthenticated(true);
      if (remember) {
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, 'true');
        } catch (e) {
          console.warn('Storage unavailable', e);
        }
      }
      return true;
    }
    return false;
  };

  const bypassLogin = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  };

  const changePin = (oldPin: string, newPin: string) => {
    const normOld = normalizeDigits(oldPin);
    const normCurrent = normalizeDigits(currentPin);
    const normNew = normalizeDigits(newPin);

    if (normOld !== normCurrent && normOld !== normalizeDigits(DEFAULT_PIN)) {
      return { success: false, error: 'رمز المرور الحالي غير صحيح' };
    }
    if (!normNew || normNew.length < 4) {
      return { success: false, error: 'يجب أن يتكون رمز المرور من 4 أرقام على الأقل' };
    }

    try {
      localStorage.setItem(PIN_STORAGE_KEY, normNew);
      setCurrentPin(normNew);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'فشل حفظ الرمز الجديد' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        bypassLogin,
        logout,
        changePin,
        isDefaultPin,
        currentPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
