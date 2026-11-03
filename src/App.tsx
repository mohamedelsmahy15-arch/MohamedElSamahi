/**
 * App.tsx
 * نقطة الدخول الرئيسية لنظام "السماحي OS"
 * يربط بين جميع الموديولات التنفيذية والنوافذ المنبثقة للتعديل السريع
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { QuickTaskModal } from './components/common/QuickTaskModal';
import { IdeasModal } from './components/common/IdeasModal';
import { EditTaskModal } from './components/common/EditTaskModal';
import { EditProjectModal } from './components/common/EditProjectModal';
import { EditGoalModal } from './components/common/EditGoalModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
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
      case 'ideas':
        return <IdeasView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050505] text-[#F5F5F5]">
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

      {/* النوافذ العائمة ومودالات الإضافة والتعديل السهل */}
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
