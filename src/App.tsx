/**
 * App.tsx
 * نقطة الدخول الرئيسية لنظام "السماحي OS"
 * يربط بين جميع الموديولات التنفيذية والنوافذ المنبثقة للتعديل السريع مع نظام القفل الأمني
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginLockScreen } from './components/auth/LoginLockScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { TodayView } from './components/today/TodayView';
import { GoalsView } from './components/goals/GoalsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { IdeasView } from './components/ideas/IdeasView';
import { HabitsView } from './components/habits/HabitsView';
import { WeeklyReviewView } from './components/review/WeeklyReviewView';
import { TimeTrackingView } from './components/time/TimeTrackingView';
import { MoneyView } from './components/money/MoneyView';
import { BusinessView } from './components/business/BusinessView';
import { CalendarView } from './components/calendar/CalendarView';
import { SettingsView } from './components/settings/SettingsView';
import { ErrorCodexView } from './components/errors/ErrorCodexView';
import { TrashView } from './components/trash/TrashView';
import { ManbaView } from './components/manba/ManbaView';
import { LearningView } from './components/learning/LearningView';
import { AssistantView } from './components/assistant/AssistantView';
import { TopActionNotificationBar } from './components/common/TopActionNotificationBar';
import { ActionDetailsModal } from './components/common/ActionDetailsModal';
import { QuickTaskModal } from './components/common/QuickTaskModal';
import { IdeasModal } from './components/common/IdeasModal';
import { EditTaskModal } from './components/common/EditTaskModal';
import { EditProjectModal } from './components/common/EditProjectModal';
import { EditGoalModal } from './components/common/EditGoalModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // إذا لم يكن مسجل الدخول، يتم عرض لوحة تسجيل الدخول والقفل الأمني
  if (!isAuthenticated) {
    return <LoginLockScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'assistant':
        return <AssistantView />;
      case 'today':
        return <TodayView />;
      case 'goals':
        return <GoalsView />;
      case 'projects':
        return <ProjectsView />;
      case 'habits':
        return <HabitsView />;
      case 'calendar':
        return <CalendarView />;
      case 'review':
        return <WeeklyReviewView />;
      case 'time':
        return <TimeTrackingView />;
      case 'money':
        return <MoneyView />;
      case 'business':
        return <BusinessView />;
      case 'learning':
        return <LearningView />;
      case 'ideas':
        return <IdeasView />;
      case 'trash':
        return <TrashView />;
      case 'manba':
        return <ManbaView />;
      case 'settings':
        return <SettingsView />;
      case 'errors':
        return <ErrorCodexView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* شريط الإشعار العلوي للخطوات المنجزة مع زر التراجع وتفاصيل الخطوة */}
      <TopActionNotificationBar />

      {/* الشريط الجانبي */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          onToggleMobileNav={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileNavOpen={isMobileMenuOpen}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">{renderActiveView()}</div>
        </main>
      </div>

      {/* النوافذ العائمة ومودالات الإضافة والتعديل السهل وفحص الخطوات */}
      <ActionDetailsModal />
      <QuickTaskModal />
      <IdeasModal />
      <EditTaskModal />
      <EditProjectModal />
      <EditGoalModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
