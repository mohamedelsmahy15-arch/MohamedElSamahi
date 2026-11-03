/**
 * context/AuthContext.tsx
 * إدارة جلسة الدخول وتأمين نظام "السماحي OS"
 * يدعم رمز المرور السريع (PIN)، القفل الفوري، والحفظ الآمن محلياً
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string, remember?: boolean) => boolean;
  logout: () => void;
  changePin: (currentPin: string, newPin: string) => { success: boolean; error?: string };
  isDefaultPin: boolean;
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
    if (pin === currentPin) {
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

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  };

  const changePin = (oldPin: string, newPin: string) => {
    if (oldPin !== currentPin) {
      return { success: false, error: 'رمز المرور الحالي غير صحيح' };
    }
    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'يجب أن يتكون رمز المرور من 4 أرقام على الأقل' };
    }

    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
      setCurrentPin(newPin);
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
        logout,
        changePin,
        isDefaultPin,
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
