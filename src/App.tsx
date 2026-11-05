/**
 * App.tsx
 * نقطة الدخول الرئيسية لنظام "السماحي OS"
 * يربط بين جميع الموديولات التنفيذية والنوافذ المنبثقة للتعديل السريع مع نظام القفل الأمني
 * ✅ تم تفعيل Lazy Loading لتحسين الأداء وتقليل استهلاك الذاكرة
 */

import React, { useState, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginLockScreen } from './components/auth/LoginLockScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
// المكونات المشتركة (دائماً محملة)
import { TopActionNotificationBar } from './components/common/TopActionNotificationBar';
import { ActionDetailsModal } from './components/common/ActionDetailsModal';
import { QuickTaskModal } from './components/common/QuickTaskModal';
import { IdeasModal } from './components/common/IdeasModal';
import { EditTaskModal } from './components/common/EditTaskModal';
import { EditProjectModal } from './components/common/EditProjectModal';
import { EditGoalModal } from './components/common/EditGoalModal';

// ✅ Lazy Loading — كل صفحة بتتحمل بس لما المستخدم يفتحها
const DashboardView = lazy(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const TodayView = lazy(() => import('./components/today/TodayView').then(m => ({ default: m.TodayView })));
const GoalsView = lazy(() => import('./components/goals/GoalsView').then(m => ({ default: m.GoalsView })));
const ProjectsView = lazy(() => import('./components/projects/ProjectsView').then(m => ({ default: m.ProjectsView })));
const IdeasView = lazy(() => import('./components/ideas/IdeasView').then(m => ({ default: m.IdeasView })));
const HabitsView = lazy(() => import('./components/habits/HabitsView').then(m => ({ default: m.HabitsView })));
const WeeklyReviewView = lazy(() => import('./components/review/WeeklyReviewView').then(m => ({ default: m.WeeklyReviewView })));
const TimeTrackingView = lazy(() => import('./components/time/TimeTrackingView').then(m => ({ default: m.TimeTrackingView })));
const MoneyView = lazy(() => import('./components/money/MoneyView').then(m => ({ default: m.MoneyView })));
const BusinessView = lazy(() => import('./components/business/BusinessView').then(m => ({ default: m.BusinessView })));
const CalendarView = lazy(() => import('./components/calendar/CalendarView').then(m => ({ default: m.CalendarView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));
const ErrorCodexView = lazy(() => import('./components/errors/ErrorCodexView').then(m => ({ default: m.ErrorCodexView })));
const TrashView = lazy(() => import('./components/trash/TrashView').then(m => ({ default: m.TrashView })));
const ManbaView = lazy(() => import('./components/manba/ManbaView').then(m => ({ default: m.ManbaView })));
const LearningView = lazy(() => import('./components/learning/LearningView').then(m => ({ default: m.LearningView })));
const AssistantView = lazy(() => import('./components/assistant/AssistantView').then(m => ({ default: m.AssistantView })));

// مؤشر تحميل خفيف لما صفحة بتتحمل
const ViewLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-[var(--text-secondary)] text-lg">جاري التحميل...</div>
  </div>
);

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
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<ViewLoader />}>
              {renderActiveView()}
            </Suspense>
          </div>
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
