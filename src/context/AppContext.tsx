/**
 * context/AppContext.tsx
 * إدارة الحالة الشاملة للتطبيق (Global State Management)
 * يدعم كامل وحدات السماحي OS مع سهولة فائقة في تعديل أي مدخلات
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppState,
  Task,
  Project,
  Goal,
  IdeaItem,
  TimeBlock,
  Habit,
  WeeklyReviewReport,
  TimeLog,
  ActiveTimer,
  Transaction,
  IncomeExperiment,
  LearningSkill,
  DailyScoreBreakdown,
  TimeCategory,
  TrashItem,
  DailyReportItem,
  ActionHistoryItem,
  ActionCategory,
  ActionType,
  ActionDetailField,
  ErrorLogItem,
} from '../types';
import {
  loadAppState,
  saveAppState,
  resetAppStateToSeed,
  resetAppStateToCleanSlate,
  exportAppStateAsJSON,
  importAppStateFromJSON,
} from '../lib/storage';

interface AppContextType {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // سمة المظهر (Theme)
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // النوافذ المنبثقة
  isIdeaModalOpen: boolean;
  setIsIdeaModalOpen: (open: boolean) => void;
  isQuickTaskModalOpen: boolean;
  setIsQuickTaskModalOpen: (open: boolean) => void;

  // نوافذ التعديل السهل لأي مدخلات (Easy Editing)
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  editingGoal: Goal | null;
  setEditingGoal: (goal: Goal | null) => void;
  editingHabit: Habit | null;
  setEditingHabit: (habit: Habit | null) => void;

  // نظام التنبيه لمكافحة التشتت
  distractionAlert: string | null;
  dismissDistractionAlert: () => void;
  triggerDistractionAlert: (msg: string) => void;

  // المهام
  toggleTaskStatus: (taskId: string) => void;
  setTaskTodayFocus: (taskId: string, isFocus: boolean) => boolean;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTaskToParkingLot: (taskId: string) => void;

  // المشاريع
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'progress'>) => boolean;
  updateProject: (project: Project) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  deleteProject: (projectId: string) => void;

  // الأهداف
  addGoal: (goalData: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;

  // الأفكار والـ Parking Lot
  addIdea: (ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>) => void;
  updateIdea: (idea: IdeaItem) => void;
  deleteIdea: (ideaId: string) => void;
  convertIdeaToProject: (ideaId: string) => void;

  // الكتل الزمنية
  toggleTimeBlock: (blockId: string) => void;
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;

  // العادات
  toggleHabitToday: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;

  // المراجعة الأسبوعية
  addWeeklyReview: (review: Omit<WeeklyReviewReport, 'id' | 'createdAt'>) => void;
  deleteWeeklyReview: (reviewId: string) => void;

  // تتبع الوقت الفعلي (Timer)
  activeTimer: ActiveTimer;
  startTimer: (category: TimeCategory, description: string) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  addManualTimeLog: (log: Omit<TimeLog, 'id' | 'createdAt'>) => void;
  deleteTimeLog: (id: string) => void;

  // التدفق المالي
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  financialSummary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    savingsRate: number;
    businessIncome: number;
  };

  // تجارب مصادر الدخل (Income Experiments)
  addIncomeExperiment: (exp: Omit<IncomeExperiment, 'id' | 'createdAt' | 'revenueEarned' | 'actualClientsContacted'>) => void;
  updateIncomeExperiment: (exp: IncomeExperiment) => void;
  deleteIncomeExperiment: (id: string) => void;

  // نظام التعلم والتطبيق (Learning Skills)
  learningSkills: LearningSkill[];
  addLearningSkill: (skill: Omit<LearningSkill, 'id' | 'createdAt'>) => void;
  updateLearningSkill: (skill: LearningSkill) => void;
  deleteLearningSkill: (id: string) => void;

  // التصدير والاستيراد
  resetToDefault: () => void;
  resetToCleanSlate: () => void;
  exportBackup: () => void;
  importBackup: (jsonText: string) => boolean;

  // سلة المهملات وسجل التعديلات (Recycle Bin & History)
  trashItems: TrashItem[];
  restoreFromTrash: (trashId: string) => void;
  deletePermanently: (trashId: string) => void;
  emptyTrash: () => void;

  // تقارير الإنتاجية اليومية والتقييم الذاتي
  dailyReports: DailyReportItem[];
  saveDailyReport: (report: Omit<DailyReportItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteDailyReport: (reportId: string) => void;

  // منبع الأنشطة والإنجازات ونظام التراجع السريع (Action Stream & Undo)
  actionHistory: ActionHistoryItem[];
  latestAction: ActionHistoryItem | null;
  dismissLatestAction: () => void;
  undoAction: (actionId?: string) => boolean;
  selectedActionDetails: ActionHistoryItem | null;
  setSelectedActionDetails: (item: ActionHistoryItem | null) => void;
  isManbaDrawerOpen: boolean;
  setIsManbaDrawerOpen: (open: boolean) => void;
  clearActionHistory: () => void;
  recordAction: (action: Omit<ActionHistoryItem, 'id' | 'timestamp' | 'undone'>) => ActionHistoryItem;


  // سجل الأخطاء والدروس المستفادة (Error & Bug Codex)
  errorLogs: ErrorLogItem[];
  addErrorLog: (item: Omit<ErrorLogItem, 'id' | 'createdAt'>) => void;
  updateErrorLog: (item: ErrorLogItem) => void;
  deleteErrorLog: (id: string) => void;
  toggleErrorResolved: (id: string) => void;
  exportErrorLogToMarkdown: (id?: string) => string;

  // المؤشرات الحسابية
  todayFocusTasks: Task[];
  activeProjects: Project[];
  dailyScoreBreakdown: DailyScoreBreakdown;
  executionRate: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadAppState());
  // شاشة تركيز اليوم هي الشاشة الافتراضية للتنفيذ المباشر
  const [activeTab, setActiveTab] = useState<string>('today');

  // سمة المظهر (الافتراضي هو الوضع الداكن الفاخر مع دعم التبديل)
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('samahy_theme');
      return stored === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  // تطبيق كلاس المظهر على عنصر الجذر
  useEffect(() => {
    try {
      localStorage.setItem('samahy_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.error('Error syncing theme:', e);
    }
  }, [theme]);

  // نوافذ سريعة
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [distractionAlert, setDistractionAlert] = useState<string | null>(null);

  // حالات التعديل الفردية (Editing state modals)
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // نظام منبع الأنشطة والإنجازات والتراجع السريع (Action Stream & Undo System)
  const [latestAction, setLatestAction] = useState<ActionHistoryItem | null>(null);
  const [selectedActionDetails, setSelectedActionDetails] = useState<ActionHistoryItem | null>(null);
  const [isManbaDrawerOpen, setIsManbaDrawerOpen] = useState(false);

  const dismissLatestAction = () => {
    setLatestAction(null);
  };

  const clearActionHistory = () => {
    setState((prev) => ({
      ...prev,
      actionHistory: [],
    }));
    setLatestAction(null);
  };

  const recordAction = (
    actionData: Omit<ActionHistoryItem, 'id' | 'timestamp' | 'undone'>
  ): ActionHistoryItem => {
    const item: ActionHistoryItem = {
      ...actionData,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      undone: false,
    };

    setState((prev) => ({
      ...prev,
      actionHistory: [item, ...(prev.actionHistory || [])].slice(0, 200),
    }));

    setLatestAction(item);
    return item;
  };

  const undoAction = (actionId?: string): boolean => {
    const targetId = actionId || latestAction?.id;
    if (!targetId) return false;

    const action =
      (state.actionHistory || []).find((a) => a.id === targetId) ||
      (latestAction?.id === targetId ? latestAction : null);

    if (!action || action.undone || !action.canUndo) {
      return false;
    }

    setState((prev) => {
      let newTasks = [...prev.tasks];
      let newProjects = [...prev.projects];
      let newGoals = [...prev.goals];
      let newHabits = [...prev.habits];
      let newIdeas = [...prev.ideas];
      let newTimeLogs = [...prev.timeLogs];
      let newTransactions = [...prev.transactions];
      let newExperiments = [...prev.incomeExperiments];
      let newTrash = [...(prev.trashItems || [])];

      switch (action.category) {
        case 'task': {
          if (action.actionType === 'complete' || action.actionType === 'uncomplete') {
            if (action.previousSnapshot) {
              newTasks = newTasks.map((t) => (t.id === action.entityId ? action.previousSnapshot : t));
            } else {
              newTasks = newTasks.map((t) => {
                if (t.id === action.entityId) {
                  const revertStatus = action.actionType === 'complete' ? 'todo' : 'completed';
                  return {
                    ...t,
                    status: revertStatus,
                    completedAt: revertStatus === 'completed' ? new Date().toISOString() : undefined,
                  };
                }
                return t;
              });
            }
          } else if (action.actionType === 'create') {
            newTasks = newTasks.filter((t) => t.id !== action.entityId);
          } else if (action.actionType === 'update') {
            if (action.previousSnapshot) {
              newTasks = newTasks.map((t) => (t.id === action.entityId ? action.previousSnapshot : t));
            }
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newTasks = [action.previousSnapshot, ...newTasks.filter((t) => t.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          } else if (action.actionType === 'focus') {
            if (action.previousSnapshot) {
              newTasks = newTasks.map((t) => (t.id === action.entityId ? action.previousSnapshot : t));
            }
          } else if (action.actionType === 'move') {
            if (action.previousSnapshot) {
              newTasks = [action.previousSnapshot, ...newTasks];
              newIdeas = newIdeas.filter((i) => i.title !== action.itemTitle);
            }
          }
          break;
        }
        case 'habit': {
          if (action.actionType === 'complete' || action.actionType === 'uncomplete' || action.actionType === 'update') {
            if (action.previousSnapshot) {
              newHabits = newHabits.map((h) => (h.id === action.entityId ? action.previousSnapshot : h));
            }
          } else if (action.actionType === 'create') {
            newHabits = newHabits.filter((h) => h.id !== action.entityId);
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newHabits = [action.previousSnapshot, ...newHabits.filter((h) => h.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'project': {
          if (action.actionType === 'create') {
            newProjects = newProjects.filter((p) => p.id !== action.entityId);
          } else if (action.actionType === 'update') {
            if (action.previousSnapshot) {
              newProjects = newProjects.map((p) => (p.id === action.entityId ? action.previousSnapshot : p));
            }
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newProjects = [action.previousSnapshot, ...newProjects.filter((p) => p.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'goal': {
          if (action.actionType === 'create') {
            newGoals = newGoals.filter((g) => g.id !== action.entityId);
          } else if (action.actionType === 'update') {
            if (action.previousSnapshot) {
              newGoals = newGoals.map((g) => (g.id === action.entityId ? action.previousSnapshot : g));
            }
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newGoals = [action.previousSnapshot, ...newGoals.filter((g) => g.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'idea': {
          if (action.actionType === 'create') {
            newIdeas = newIdeas.filter((i) => i.id !== action.entityId);
          } else if (action.actionType === 'update') {
            if (action.previousSnapshot) {
              newIdeas = newIdeas.map((i) => (i.id === action.entityId ? action.previousSnapshot : i));
            }
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newIdeas = [action.previousSnapshot, ...newIdeas.filter((i) => i.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'transaction': {
          if (action.actionType === 'create') {
            newTransactions = newTransactions.filter((tx) => tx.id !== action.entityId);
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newTransactions = [action.previousSnapshot, ...newTransactions.filter((tx) => tx.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'experiment': {
          if (action.actionType === 'create') {
            newExperiments = newExperiments.filter((e) => e.id !== action.entityId);
          } else if (action.actionType === 'update') {
            if (action.previousSnapshot) {
              newExperiments = newExperiments.map((e) => (e.id === action.entityId ? action.previousSnapshot : e));
            }
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newExperiments = [action.previousSnapshot, ...newExperiments.filter((e) => e.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        case 'timeLog': {
          if (action.actionType === 'create') {
            newTimeLogs = newTimeLogs.filter((l) => l.id !== action.entityId);
          } else if (action.actionType === 'delete') {
            if (action.previousSnapshot) {
              newTimeLogs = [action.previousSnapshot, ...newTimeLogs.filter((l) => l.id !== action.entityId)];
              newTrash = newTrash.filter((tr) => tr.originalId !== action.entityId);
            }
          }
          break;
        }
        default:
          break;
      }

      const updatedHistory = (prev.actionHistory || []).map((h) =>
        h.id === targetId ? { ...h, undone: true, undoneAt: new Date().toISOString() } : h
      );

      return {
        ...prev,
        tasks: newTasks,
        projects: newProjects,
        goals: newGoals,
        habits: newHabits,
        ideas: newIdeas,
        timeLogs: newTimeLogs,
        transactions: newTransactions,
        incomeExperiments: newExperiments,
        trashItems: newTrash,
        actionHistory: updatedHistory,
      };
    });

    setLatestAction((prev) =>
      prev && prev.id === targetId ? { ...prev, undone: true, undoneAt: new Date().toISOString() } : prev
    );

    setDistractionAlert(`تم التراجع عن خطوة "${action.title}" وإعادة كل شيء لمكانه الأصلي بنجاح.`);
    return true;
  };

  // مؤقت الوقت الحي (Live Active Timer)
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>({
    isRunning: false,
    startTime: null,
    elapsedSeconds: 0,
    category: 'Programming',
    description: 'كتابة كود في السماحي OS',
  });

  // حفظ الحالة في LocalStorage عند كل تغيير
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // تشغيل عداد المؤقت
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer.isRunning]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // المهام المحددة للتركيز اليومي
  const todayFocusTasks = useMemo(() => {
    return state.tasks.filter((t) => t.isTodayFocus);
  }, [state.tasks]);

  // المشاريع النشطة
  const activeProjects = useMemo(() => {
    return state.projects.filter((p) => p.status === 'active');
  }, [state.projects]);

  // مؤشر اليوم المحسوب بذكاء
  const dailyScoreBreakdown = useMemo<DailyScoreBreakdown>(() => {
    const focusTotal = todayFocusTasks.length;
    const focusDone = todayFocusTasks.filter((t) => t.status === 'completed').length;
    const focusPercent = focusTotal > 0 ? (focusDone / focusTotal) * 100 : 0;

    // العادات المنجزة لليوم
    const totalHabits = state.habits.length;
    const habitsDone = state.habits.filter((h) => h.completedDates.includes(todayStr)).length;
    const habitsPercent = totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 0;

    // كتل الوقت
    const blocksTotal = state.timeBlocks.length;
    const blocksDone = state.timeBlocks.filter((b) => b.completed).length;
    const blocksPercent = blocksTotal > 0 ? (blocksDone / blocksTotal) * 100 : 0;

    // الوزن: 50% لمهام التركيز الثلاثية + 25% للعادات + 25% للكتل الزمنية
    // إذا لم ينجز أي شيء، يكون المؤشر صفراً حقيقياً
    const finalScore = (focusDone === 0 && habitsDone === 0 && blocksDone === 0)
      ? 0
      : Math.round(focusPercent * 0.5 + habitsPercent * 0.25 + blocksPercent * 0.25);

    let verdict = 'في انتظار بدايتك اليوم ⏳';
    let advice = 'نظامك نظيف وجاهز. ابدأ بتنفيذ أول عادة أو حدد مهمة تركيز لتفعيل مؤشر الإنجاز.';

    if (focusDone === 3 && habitsDone >= Math.min(3, totalHabits)) {
      verdict = 'يوم بناء حقيقي ومحكم ⚡';
      advice = 'حققت نتائجك الثلاث والتزمت بعاداتك! هذا هو جوهر بناء المستقبل.';
    } else if (focusDone >= 1) {
      verdict = 'تقدم إيجابي ومستمر 🎯';
      advice = 'أنهيت مهمة تركيز أساسية. استمر بإنهاء باقي مهام اليوم دون تشتت.';
    } else if (focusTotal > 0) {
      verdict = 'يومك ينتظر التنفيذ ⏳';
      advice = 'لا تتشتت في مهام جانبية. ابدأ بأثقل مهمة الآن.';
    }

    return {
      score: finalScore,
      focusTasksRatio: `${focusDone}/${focusTotal}`,
      focusTasksPercent: Math.round(focusPercent),
      habitsRatio: `${habitsDone}/${totalHabits}`,
      verdict,
      advice,
    };
  }, [todayFocusTasks, state.habits, state.timeBlocks, todayStr]);

  // معدل التنفيذ العام
  const executionRate = useMemo(() => {
    if (state.tasks.length === 0) return 0;
    const done = state.tasks.filter((t) => t.status === 'completed').length;
    return Math.round((done / state.tasks.length) * 100);
  }, [state.tasks]);

  // ملخص التدفق المالي
  const financialSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;
    let businessIncome = 0;

    state.transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        if (tx.isBusiness) businessIncome += tx.amount;
      } else if (tx.type === 'expense') {
        totalExpense += tx.amount;
      } else if (tx.type === 'savings') {
        totalSavings += tx.amount;
      }
    });

    const netProfit = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

    return {
      totalIncome,
      totalExpense,
      netProfit,
      savingsRate,
      businessIncome,
    };
  }, [state.transactions]);

  // عمليات المهام
  const toggleTaskStatus = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    const isCompleted = nextStatus === 'completed';
    const updatedTask: Task = {
      ...task,
      status: nextStatus,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    };

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));

    recordAction({
      title: isCompleted ? 'إنجاز مهمة' : 'إعادة فتح مهمة',
      itemTitle: task.title,
      category: 'task',
      actionType: isCompleted ? 'complete' : 'uncomplete',
      description: isCompleted
        ? 'تم إكمال المهمة بنجاح وتوثيق وقت الإنجاز في المنبع.'
        : 'تم التراجع عن إكمال المهمة وإعادتها إلى قائمة المهام قيد التنفيذ.',
      changes: [
        {
          label: 'الحالة',
          oldValue: task.status === 'completed' ? 'مكتملة' : 'قيد التنفيذ',
          newValue: isCompleted ? 'مكتملة' : 'قيد التنفيذ',
        },
      ],
      metadata: {
        lifeArea: task.lifeArea,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
        status: nextStatus,
      },
      previousSnapshot: task,
      newSnapshot: updatedTask,
      entityId: task.id,
      canUndo: true,
    });
  };

  const setTaskTodayFocus = (taskId: string, isFocus: boolean): boolean => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (isFocus) {
      const currentFocusCount = state.tasks.filter((t) => t.isTodayFocus && t.id !== taskId).length;
      if (currentFocusCount >= 3) {
        setDistractionAlert(
          'قاعدة التركيز الذهبية: أهم 3 مهام فقط لليوم! هل هذه المهمة تقربك فعلاً من هدفك؟ اقترح وضعها في الـ Parking Lot بدلاً من تشتيت تركيزك.'
        );
        return false;
      }
    }

    const updatedTask: Task = { ...task, isTodayFocus: isFocus };
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));

    recordAction({
      title: isFocus ? 'تحديد مهمة للتركيز اليومي' : 'إلغاء تركيز مهمة',
      itemTitle: task.title,
      category: 'task',
      actionType: 'focus',
      description: isFocus
        ? 'تمت إضافة المهمة إلى قائمة أهم 3 مهام تركز عليها اليوم.'
        : 'تمت إزالة المهمة من قائمة تركيز اليوم ونقلها للقائمة العامة.',
      changes: [
        { label: 'ضمن أهم 3 مهام', oldValue: !isFocus ? 'نعم' : 'لا', newValue: isFocus ? 'نعم' : 'لا' },
      ],
      metadata: {
        lifeArea: task.lifeArea,
        priority: task.priority,
      },
      previousSnapshot: task,
      newSnapshot: updatedTask,
      entityId: task.id,
      canUndo: true,
    });

    return true;
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    let finalFocus = taskData.isTodayFocus;
    if (finalFocus) {
      const currentFocusCount = state.tasks.filter((t) => t.isTodayFocus).length;
      if (currentFocusCount >= 3) {
        setDistractionAlert(
          'لديك بالفعل 3 مهام في تركيز اليوم! أضفنا المهمة إلى القائمة العامة لحماية تركيزك.'
        );
        finalFocus = false;
      }
    }

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      isTodayFocus: finalFocus,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));

    recordAction({
      title: 'إضافة مهمة جديدة',
      itemTitle: newTask.title,
      category: 'task',
      actionType: 'create',
      description: `تمت جدولة المهمة بمجال "${newTask.lifeArea}" ووقت متوقع ${newTask.estimatedMinutes} دقيقة.`,
      metadata: {
        lifeArea: newTask.lifeArea,
        priority: newTask.priority,
        estimatedMinutes: newTask.estimatedMinutes,
        status: newTask.status,
      },
      newSnapshot: newTask,
      entityId: newTask.id,
      canUndo: true,
    });

    return newTask;
  };

  const updateTask = (updated: Task) => {
    const existing = state.tasks.find((t) => t.id === updated.id);
    const historyEntry: TrashItem | null = existing
      ? {
          id: `hist-${Date.now()}-${updated.id}`,
          originalId: updated.id,
          type: 'task',
          title: `نسخة سابقة: ${existing.title}`,
          deletedAt: new Date().toISOString(),
          originalData: existing,
          categoryOrArea: existing.lifeArea,
          reason: 'previous_version',
        }
      : null;

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
      trashItems: historyEntry ? [historyEntry, ...(prev.trashItems || [])] : prev.trashItems || [],
    }));

    const changes: ActionDetailField[] = [];
    if (existing) {
      if (existing.title !== updated.title) changes.push({ label: 'العنوان', oldValue: existing.title, newValue: updated.title });
      if (existing.status !== updated.status) changes.push({ label: 'الحالة', oldValue: existing.status, newValue: updated.status });
      if (existing.priority !== updated.priority) changes.push({ label: 'الأولوية', oldValue: existing.priority, newValue: updated.priority });
      if (existing.estimatedMinutes !== updated.estimatedMinutes) changes.push({ label: 'الوقت المقدر', oldValue: `${existing.estimatedMinutes} دقيقة`, newValue: `${updated.estimatedMinutes} دقيقة` });
    }

    recordAction({
      title: 'تعديل مهمة',
      itemTitle: updated.title,
      category: 'task',
      actionType: 'update',
      description: 'تم تحديث بيانات المهمة مع حفظ النسخة السابقة لإمكانية الاسترجاع.',
      changes,
      metadata: {
        lifeArea: updated.lifeArea,
        priority: updated.priority,
      },
      previousSnapshot: existing,
      newSnapshot: updated,
      entityId: updated.id,
      canUndo: true,
    });
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = state.tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${taskToDelete.id}`,
      originalId: taskToDelete.id,
      type: 'task',
      title: taskToDelete.title,
      deletedAt: new Date().toISOString(),
      originalData: taskToDelete,
      categoryOrArea: taskToDelete.lifeArea,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف مهمة ونقلها للسلة',
      itemTitle: taskToDelete.title,
      category: 'task',
      actionType: 'delete',
      description: 'تم نقل المهمة لسلة المهملات. اضغط "تراجع عن الخطوة" لاسترجاعها فوراً لمكانها الأصلي.',
      metadata: {
        lifeArea: taskToDelete.lifeArea,
        priority: taskToDelete.priority,
      },
      previousSnapshot: taskToDelete,
      entityId: taskToDelete.id,
      canUndo: true,
    });
  };

  const moveTaskToParkingLot = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: task.title,
      problem: 'مهمة تم استبعادها من تركيز اليوم لمنع التشتت',
      targetAudience: 'المستخدم',
      requiredSkill: task.lifeArea,
      notes: `المجال: ${task.lifeArea} — الوقت المتوقع: ${task.estimatedMinutes} دقيقة`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'raw',
    };

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      ideas: [newIdea, ...prev.ideas],
    }));

    recordAction({
      title: 'نقل مهمة إلى Parking Lot',
      itemTitle: task.title,
      category: 'task',
      actionType: 'move',
      description: 'تم تحويل المهمة إلى فكرة في الـ Parking Lot لحماية تركيزك اليومي.',
      previousSnapshot: task,
      entityId: task.id,
      canUndo: true,
    });
  };

  // عمليات المشاريع
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'progress'>): boolean => {
    if (projectData.status === 'active') {
      const currentActiveCount = state.projects.filter((p) => p.status === 'active').length;
      if (currentActiveCount >= 3) {
        setDistractionAlert(
          'أنت تحاول فتح جبهات ومشاريع كثيرة في وقت واحد! قاعدة السماحي OS: حد أقصى 3 مشاريع رئيسية نشطة فقط. تم تحويل هذا المشروع تلقائياً إلى "Next" لحين إتمام أحد المشاريع الحالية.'
        );
        projectData = { ...projectData, status: 'next' };
      }
    }

    const totalMilestones = projectData.milestones.length;
    const completedMilestones = projectData.milestones.filter((m) => m.completed).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      progress,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));

    recordAction({
      title: 'إضافة مشروع جديد',
      itemTitle: newProject.title,
      category: 'project',
      actionType: 'create',
      description: `تم إطلاق المشروع في مجال "${newProject.lifeArea}" بحالة "${newProject.status}".`,
      metadata: {
        lifeArea: newProject.lifeArea,
        status: newProject.status,
        progress: newProject.progress,
      },
      newSnapshot: newProject,
      entityId: newProject.id,
      canUndo: true,
    });

    return true;
  };

  const updateProject = (project: Project) => {
    const existing = state.projects.find((p) => p.id === project.id);
    const historyEntry: TrashItem | null = existing
      ? {
          id: `hist-${Date.now()}-${project.id}`,
          originalId: project.id,
          type: 'project',
          title: `نسخة سابقة من المشروع: ${existing.title}`,
          deletedAt: new Date().toISOString(),
          originalData: existing,
          categoryOrArea: existing.lifeArea,
          reason: 'previous_version',
        }
      : null;

    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter((m) => m.completed).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : project.progress;
    const updatedProject = { ...project, progress };

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? updatedProject : p)),
      trashItems: historyEntry ? [historyEntry, ...(prev.trashItems || [])] : prev.trashItems || [],
    }));

    recordAction({
      title: 'تعديل مشروع',
      itemTitle: project.title,
      category: 'project',
      actionType: 'update',
      description: `تم تحديث تفاصيل المشروع وإعادة حساب نسبة الإنجاز (${progress}%).`,
      changes: existing
        ? [
            { label: 'نسبة الإنجاز', oldValue: `${existing.progress}%`, newValue: `${progress}%` },
            { label: 'الحالة', oldValue: existing.status, newValue: project.status },
          ]
        : undefined,
      metadata: {
        lifeArea: project.lifeArea,
        progress,
        status: project.status,
      },
      previousSnapshot: existing,
      newSnapshot: updatedProject,
      entityId: project.id,
      canUndo: true,
    });
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    const proj = state.projects.find((p) => p.id === projectId);
    const milestone = proj?.milestones.find((m) => m.id === milestoneId);
    const isNowDone = milestone ? !milestone.completed : true;

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const total = updatedMilestones.length;
        const done = updatedMilestones.filter((m) => m.completed).length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          ...p,
          milestones: updatedMilestones,
          progress,
        };
      }),
    }));

    if (proj && milestone) {
      recordAction({
        title: isNowDone ? 'إنجاز مرحلة في مشروع' : 'إعادة فتح مرحلة في مشروع',
        itemTitle: `${proj.title} • ${milestone.title}`,
        category: 'project',
        actionType: 'update',
        description: isNowDone
          ? `أحسنت! تم إتمام المرحلة "${milestone.title}" وتحديث نسبة تقدم المشروع.`
          : `تمت إعادة فتح المرحلة "${milestone.title}".`,
        metadata: {
          lifeArea: proj.lifeArea,
        },
        previousSnapshot: proj,
        entityId: proj.id,
        canUndo: true,
      });
    }
  };

  const deleteProject = (projectId: string) => {
    const projToDelete = state.projects.find((p) => p.id === projectId);
    if (!projToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${projToDelete.id}`,
      originalId: projToDelete.id,
      type: 'project',
      title: projToDelete.title,
      deletedAt: new Date().toISOString(),
      originalData: projToDelete,
      categoryOrArea: projToDelete.lifeArea,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف مشروع ونقله للسلة',
      itemTitle: projToDelete.title,
      category: 'project',
      actionType: 'delete',
      description: 'تم نقل المشروع وسجل مراحله لسلة المهملات، مع إمكانية التراجع أو الاسترجاع في أي وقت.',
      metadata: {
        lifeArea: projToDelete.lifeArea,
      },
      previousSnapshot: projToDelete,
      entityId: projToDelete.id,
      canUndo: true,
    });
  };

  // الأهداف
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));

    recordAction({
      title: 'إضافة هدف سنوي',
      itemTitle: newGoal.title,
      category: 'goal',
      actionType: 'create',
      description: `تمت إضافة الهدف لسنة 2027 (${newGoal.quarter} - ${newGoal.quarterTheme}) في مجال "${newGoal.lifeArea}".`,
      metadata: {
        lifeArea: newGoal.lifeArea,
        quarter: newGoal.quarter,
        progress: newGoal.progress,
      },
      newSnapshot: newGoal,
      entityId: newGoal.id,
      canUndo: true,
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    const existing = state.goals.find((g) => g.id === updatedGoal.id);
    const historyEntry: TrashItem | null = existing
      ? {
          id: `hist-${Date.now()}-${updatedGoal.id}`,
          originalId: updatedGoal.id,
          type: 'goal',
          title: `نسخة سابقة من الهدف: ${existing.title}`,
          deletedAt: new Date().toISOString(),
          originalData: existing,
          categoryOrArea: existing.lifeArea,
          reason: 'previous_version',
        }
      : null;

    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
      trashItems: historyEntry ? [historyEntry, ...(prev.trashItems || [])] : prev.trashItems || [],
    }));

    recordAction({
      title: 'تعديل هدف سنوي',
      itemTitle: updatedGoal.title,
      category: 'goal',
      actionType: 'update',
      description: `تم تحديث بيانات الهدف ونسبة الإنجاز (${updatedGoal.progress}%).`,
      changes: existing
        ? [
            { label: 'نسبة التقدم', oldValue: `${existing.progress}%`, newValue: `${updatedGoal.progress}%` },
            { label: 'الحالة', oldValue: existing.status, newValue: updatedGoal.status },
          ]
        : undefined,
      metadata: {
        lifeArea: updatedGoal.lifeArea,
        progress: updatedGoal.progress,
      },
      previousSnapshot: existing,
      newSnapshot: updatedGoal,
      entityId: updatedGoal.id,
      canUndo: true,
    });
  };

  const deleteGoal = (goalId: string) => {
    const goalToDelete = state.goals.find((g) => g.id === goalId);
    if (!goalToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${goalToDelete.id}`,
      originalId: goalToDelete.id,
      type: 'goal',
      title: goalToDelete.title,
      deletedAt: new Date().toISOString(),
      originalData: goalToDelete,
      categoryOrArea: goalToDelete.lifeArea,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف هدف ونقله للسلة',
      itemTitle: goalToDelete.title,
      category: 'goal',
      actionType: 'delete',
      description: 'تم نقل الهدف لسلة المهملات مع الاحتفاظ بكافة بياناته لإمكانية الاسترجاع في أي لحظة.',
      metadata: {
        lifeArea: goalToDelete.lifeArea,
      },
      previousSnapshot: goalToDelete,
      entityId: goalToDelete.id,
      canUndo: true,
    });
  };

  // الأفكار
  const addIdea = (ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'status'>) => {
    const newIdea: IdeaItem = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      status: 'raw',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      ideas: [newIdea, ...prev.ideas],
    }));

    recordAction({
      title: 'إيداع فكرة في Parking Lot',
      itemTitle: newIdea.title,
      category: 'idea',
      actionType: 'create',
      description: 'تم حفظ الفكرة في مستودع الأفكار لمنع التشتت والتركيز على الأولويات الحالية.',
      newSnapshot: newIdea,
      entityId: newIdea.id,
      canUndo: true,
    });
  };

  const updateIdea = (idea: IdeaItem) => {
    const existing = state.ideas.find((i) => i.id === idea.id);
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === idea.id ? idea : i)),
    }));

    recordAction({
      title: 'تعديل فكرة',
      itemTitle: idea.title,
      category: 'idea',
      actionType: 'update',
      description: 'تم تحديث تفاصيل الفكرة والجمهور المستهدف بنجاح.',
      previousSnapshot: existing,
      newSnapshot: idea,
      entityId: idea.id,
      canUndo: true,
    });
  };

  const deleteIdea = (ideaId: string) => {
    const ideaToDelete = state.ideas.find((i) => i.id === ideaId);
    if (!ideaToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${ideaToDelete.id}`,
      originalId: ideaToDelete.id,
      type: 'idea',
      title: ideaToDelete.title,
      deletedAt: new Date().toISOString(),
      originalData: ideaToDelete,
      categoryOrArea: 'فكرة',
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== ideaId),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف فكرة ونقلها للسلة',
      itemTitle: ideaToDelete.title,
      category: 'idea',
      actionType: 'delete',
      description: 'تم نقل الفكرة إلى سلة المهملات، ويمكنك التراجع لإعادتها.',
      previousSnapshot: ideaToDelete,
      entityId: ideaToDelete.id,
      canUndo: true,
    });
  };

  const convertIdeaToProject = (ideaId: string) => {
    const idea = state.ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: `تجربة: ${idea.title}`,
      description: idea.problem,
      lifeArea: 'التجارة',
      status: 'next',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'تحديد المشكلة والعميل المستهدف بدقة', completed: false },
        { id: `m-${Date.now()}-2`, title: 'إعداد نموذج تجريبي لاختبار الطلب خلال 7 أيام', completed: false },
        { id: `m-${Date.now()}-3`, title: 'التواصل مع 10 عملاء محتملين', completed: false },
        { id: `m-${Date.now()}-4`, title: 'تقييم النتيجة: نجحت أم تحتاج تعديل؟', completed: false },
      ],
    };

    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      ideas: prev.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'converted' } : i)),
    }));

    recordAction({
      title: 'تحويل فكرة إلى مشروع تجريبي',
      itemTitle: idea.title,
      category: 'project',
      actionType: 'create',
      description: 'تم تحويل الفكرة إلى مشروع تنفيذي مع مراحل واضحة في قائمة المشاريع القادمة Next.',
      metadata: {
        lifeArea: 'التجارة',
        status: 'next',
      },
      newSnapshot: newProject,
      entityId: newProject.id,
      canUndo: true,
    });

    setActiveTab('projects');
  };

  // العادات
  const toggleHabitToday = (habitId: string) => {
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const alreadyDone = habit.completedDates.includes(todayStr);
    const updatedDates = alreadyDone
      ? habit.completedDates.filter((d) => d !== todayStr)
      : [todayStr, ...habit.completedDates];
    const updatedStreak = alreadyDone ? Math.max(0, habit.streak - 1) : habit.streak + 1;

    const updatedHabit: Habit = {
      ...habit,
      completedDates: updatedDates,
      streak: updatedStreak,
    };

    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? updatedHabit : h)),
    }));

    recordAction({
      title: !alreadyDone ? 'تسجيل التزام عادة' : 'إلغاء التزام عادة اليوم',
      itemTitle: habit.title,
      category: 'habit',
      actionType: !alreadyDone ? 'complete' : 'uncomplete',
      description: !alreadyDone
        ? `ممتاز! تم تسجيل عادة اليوم وارتفع عداد الاستمرارية إلى ${updatedStreak} يوماً متتالياً.`
        : `تم إلغاء تسجيل العادة لليوم وعاد عداد الالتزام إلى ${updatedStreak} يوماً.`,
      changes: [
        { label: 'عداد الاستمرارية', oldValue: `${habit.streak} يوم`, newValue: `${updatedStreak} يوم` },
        { label: 'حالة اليوم', oldValue: alreadyDone ? 'منجزة' : 'غير منجزة', newValue: !alreadyDone ? 'منجزة' : 'غير منجزة' },
      ],
      metadata: {
        lifeArea: habit.lifeArea,
        streak: updatedStreak,
      },
      previousSnapshot: habit,
      newSnapshot: updatedHabit,
      entityId: habit.id,
      canUndo: true,
    });
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      completedDates: [],
      createdAt: todayStr,
    };
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));

    recordAction({
      title: 'إضافة عادة يومية جديدة',
      itemTitle: newHabit.title,
      category: 'habit',
      actionType: 'create',
      description: `تمت برمجة عادة جديدة في مجال "${newHabit.lifeArea}". الاستمرارية هي سر التغيير الجذري!`,
      metadata: {
        lifeArea: newHabit.lifeArea,
        streak: 0,
      },
      newSnapshot: newHabit,
      entityId: newHabit.id,
      canUndo: true,
    });
  };

  const updateHabit = (habit: Habit) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habit.id ? habit : h)),
    }));
  };

  const deleteHabit = (habitId: string) => {
    const habitToDelete = state.habits.find((h) => h.id === habitId);
    if (!habitToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${habitToDelete.id}`,
      originalId: habitToDelete.id,
      type: 'habit',
      title: habitToDelete.title,
      deletedAt: new Date().toISOString(),
      originalData: habitToDelete,
      categoryOrArea: habitToDelete.lifeArea,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف عادة ونقلها للسلة',
      itemTitle: habitToDelete.title,
      category: 'habit',
      actionType: 'delete',
      description: 'تم نقل العادة لسلة المهملات. يمكنك التراجع لاسترجاعها فوراً.',
      metadata: {
        lifeArea: habitToDelete.lifeArea,
      },
      previousSnapshot: habitToDelete,
      entityId: habitToDelete.id,
      canUndo: true,
    });
  };

  // المراجعة الأسبوعية
  const addWeeklyReview = (reviewData: Omit<WeeklyReviewReport, 'id' | 'createdAt'>) => {
    const newReport: WeeklyReviewReport = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      weeklyReviews: [newReport, ...prev.weeklyReviews],
      lastReviewDate: todayStr,
    }));

    recordAction({
      title: 'حفظ المراجعة الأسبوعية',
      itemTitle: `مراجعة الأسبوع رقم ${newReport.weekNumber}`,
      category: 'review',
      actionType: 'create',
      description: 'تم توثيق المراجعة الأسبوعية بنجاح واعتماد أهداف الأسبوع القادم.',
      newSnapshot: newReport,
      entityId: newReport.id,
      canUndo: false,
    });
  };

  const deleteWeeklyReview = (reviewId: string) => {
    setState((prev) => ({
      ...prev,
      weeklyReviews: prev.weeklyReviews.filter((r) => r.id !== reviewId),
    }));
  };

  // تتبع الوقت الفعلي (Timer)
  const startTimer = (category: TimeCategory, description: string) => {
    setActiveTimer({
      isRunning: true,
      startTime: Date.now(),
      elapsedSeconds: 0,
      category,
      description: description || `جلسة عمل في ${category}`,
    });
  };

  const stopTimer = () => {
    if (activeTimer.elapsedSeconds >= 60) {
      const durationMins = Math.max(1, Math.round(activeTimer.elapsedSeconds / 60));
      const newLog: TimeLog = {
        id: `log-${Date.now()}`,
        category: activeTimer.category,
        description: activeTimer.description,
        durationMinutes: durationMins,
        date: todayStr,
        isDeepWork: ['Programming', 'AI', 'Business'].includes(activeTimer.category),
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        timeLogs: [newLog, ...prev.timeLogs],
      }));

      recordAction({
        title: 'توثيق جلسة عمل عميق',
        itemTitle: `${newLog.description || newLog.category}`,
        category: 'timeLog',
        actionType: 'create',
        description: `تم تسجيل ${durationMins} دقيقة عمل في مجال ${newLog.category}.`,
        metadata: {
          durationMinutes: durationMins,
        },
        newSnapshot: newLog,
        entityId: newLog.id,
        canUndo: true,
      });
    }

    setActiveTimer({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      category: 'Programming',
      description: '',
    });
  };

  const resetTimer = () => {
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: false,
      elapsedSeconds: 0,
      startTime: null,
    }));
  };

  const addManualTimeLog = (log: Omit<TimeLog, 'id' | 'createdAt'>) => {
    const newLog: TimeLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      timeLogs: [newLog, ...prev.timeLogs],
    }));

    recordAction({
      title: 'تسجيل وقت يدوي',
      itemTitle: `${newLog.category} (${newLog.durationMinutes} دقيقة)`,
      category: 'timeLog',
      actionType: 'create',
      description: `تم توثيق سجل وقت يدوي: ${newLog.description || newLog.category}.`,
      metadata: {
        durationMinutes: newLog.durationMinutes,
      },
      newSnapshot: newLog,
      entityId: newLog.id,
      canUndo: true,
    });
  };

  const deleteTimeLog = (id: string) => {
    const logToDelete = state.timeLogs.find((l) => l.id === id);
    if (!logToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${logToDelete.id}`,
      originalId: logToDelete.id,
      type: 'timeLog',
      title: `سجل وقت: ${logToDelete.category} (${logToDelete.durationMinutes} دقيقة)`,
      deletedAt: new Date().toISOString(),
      originalData: logToDelete,
      categoryOrArea: logToDelete.category,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      timeLogs: prev.timeLogs.filter((l) => l.id !== id),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف سجل وقت',
      itemTitle: `${logToDelete.category} (${logToDelete.durationMinutes} د)`,
      category: 'timeLog',
      actionType: 'delete',
      description: 'تم نقل سجل الوقت لسلة المهملات، مع إمكانية التراجع الفوري.',
      previousSnapshot: logToDelete,
      entityId: logToDelete.id,
      canUndo: true,
    });
  };

  // التدفق المالي
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    recordAction({
      title: newTx.type === 'income' ? 'تسجيل إيراد مالي' : newTx.type === 'expense' ? 'تسجيل مصروف' : 'تسجيل ادخار',
      itemTitle: `${newTx.sourceOrPayee} (${newTx.amount.toLocaleString()} ج.م)`,
      category: 'transaction',
      actionType: 'create',
      description: `تم تسجيل المعاملة في قسم "${newTx.category}".`,
      metadata: {
        amount: newTx.amount,
        type: newTx.type,
      },
      newSnapshot: newTx,
      entityId: newTx.id,
      canUndo: true,
    });
  };

  const deleteTransaction = (id: string) => {
    const txToDelete = state.transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${txToDelete.id}`,
      originalId: txToDelete.id,
      type: 'transaction',
      title: `معاملة: ${txToDelete.sourceOrPayee} (${txToDelete.amount} ج.م)`,
      deletedAt: new Date().toISOString(),
      originalData: txToDelete,
      categoryOrArea: txToDelete.category,
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف معاملة مالية',
      itemTitle: txToDelete.sourceOrPayee,
      category: 'transaction',
      actionType: 'delete',
      description: 'تم نقل المعاملة المالية إلى سلة المهملات، مع إمكانية التراجع أو الاسترجاع.',
      metadata: {
        amount: txToDelete.amount,
      },
      previousSnapshot: txToDelete,
      entityId: txToDelete.id,
      canUndo: true,
    });
  };

  // تجارب مصادر الدخل (Income Experiments)
  const addIncomeExperiment = (
    expData: Omit<IncomeExperiment, 'id' | 'createdAt' | 'revenueEarned' | 'actualClientsContacted'>
  ) => {
    const newExp: IncomeExperiment = {
      ...expData,
      id: `exp-${Date.now()}`,
      revenueEarned: 0,
      actualClientsContacted: 0,
      createdAt: todayStr,
    };
    setState((prev) => ({
      ...prev,
      incomeExperiments: [newExp, ...prev.incomeExperiments],
    }));

    recordAction({
      title: 'إطلاق تجربة دخل جديدة',
      itemTitle: newExp.name,
      category: 'experiment',
      actionType: 'create',
      description: `تم تسجيل تجربة الدخل المستهدفة لعميل "${newExp.targetClient}".`,
      newSnapshot: newExp,
      entityId: newExp.id,
      canUndo: true,
    });
  };

  const updateIncomeExperiment = (exp: IncomeExperiment) => {
    const existing = state.incomeExperiments.find((e) => e.id === exp.id);
    setState((prev) => ({
      ...prev,
      incomeExperiments: prev.incomeExperiments.map((e) => (e.id === exp.id ? exp : e)),
    }));

    recordAction({
      title: 'تحديث تجربة دخل',
      itemTitle: exp.name,
      category: 'experiment',
      actionType: 'update',
      description: `تم تحديث بيانات التجربة (العملاء المتواصل معهم: ${exp.actualClientsContacted}، الإيراد: ${exp.revenueEarned} ج.م).`,
      previousSnapshot: existing,
      newSnapshot: exp,
      entityId: exp.id,
      canUndo: true,
    });
  };

  const deleteIncomeExperiment = (id: string) => {
    const expToDelete = state.incomeExperiments.find((e) => e.id === id);
    if (!expToDelete) return;

    const trashEntry: TrashItem = {
      id: `trash-${Date.now()}-${expToDelete.id}`,
      originalId: expToDelete.id,
      type: 'experiment',
      title: `تجربة دخل: ${expToDelete.name}`,
      deletedAt: new Date().toISOString(),
      originalData: expToDelete,
      categoryOrArea: 'تجارب الدخل',
      reason: 'deleted',
    };

    setState((prev) => ({
      ...prev,
      incomeExperiments: prev.incomeExperiments.filter((e) => e.id !== id),
      trashItems: [trashEntry, ...(prev.trashItems || [])],
    }));

    recordAction({
      title: 'حذف تجربة دخل ونقلها للسلة',
      itemTitle: expToDelete.name,
      category: 'experiment',
      actionType: 'delete',
      description: 'تم نقل تجربة الدخل لسلة المهملات ويمكن استرجاعها في أي لحظة.',
      previousSnapshot: expToDelete,
      entityId: expToDelete.id,
      canUndo: true,
    });
  };

  // نظام التعلم والتطبيق (Learning Skills)
  const addLearningSkill = (skillData: Omit<LearningSkill, 'id' | 'createdAt'>) => {
    const newSkill: LearningSkill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      createdAt: todayStr,
    };
    setState((prev) => ({
      ...prev,
      skills: [newSkill, ...(prev.skills || [])],
    }));

    recordAction({
      title: 'إضافة مهارة جديدة للتعلم',
      itemTitle: newSkill.name,
      category: 'learning',
      actionType: 'create',
      description: `تمت جدولة المهارة مع ربطها بالمشروع التطبيقي: ${newSkill.targetProject}`,
      newSnapshot: newSkill,
      entityId: newSkill.id,
      canUndo: true,
    });
  };

  const updateLearningSkill = (skill: LearningSkill) => {
    const existing = (state.skills || []).find((s) => s.id === skill.id);
    setState((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((s) => (s.id === skill.id ? skill : s)),
    }));

    recordAction({
      title: 'تحديث مهارة ومستوى الإتقان',
      itemTitle: skill.name,
      category: 'learning',
      actionType: 'update',
      description: `تم تحديث مستوى الإتقان إلى ${skill.masteryPercentage}% والممارسة إلى ${skill.hoursLogged} ساعة.`,
      previousSnapshot: existing,
      newSnapshot: skill,
      entityId: skill.id,
      canUndo: true,
    });
  };

  const deleteLearningSkill = (skillId: string) => {
    const skillToDelete = (state.skills || []).find((s) => s.id === skillId);
    if (!skillToDelete) return;

    setState((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s.id !== skillId),
    }));

    recordAction({
      title: 'حذف مهارة',
      itemTitle: skillToDelete.name,
      category: 'learning',
      actionType: 'delete',
      description: 'تم حذف المهارة من قائمة التعلم والتطبيق.',
      previousSnapshot: skillToDelete,
      entityId: skillToDelete.id,
      canUndo: true,
    });
  };

  // عمليات سلة المهملات واسترجاع البيانات (Recycle Bin Core)
  const restoreFromTrash = (trashId: string) => {
    const item = (state.trashItems || []).find((t) => t.id === trashId);
    if (!item) return;

    setState((prev) => {
      const remainingTrash = (prev.trashItems || []).filter((t) => t.id !== trashId);
      switch (item.type) {
        case 'task': {
          const filtered = prev.tasks.filter((t) => t.id !== item.originalId);
          return { ...prev, tasks: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'project': {
          const filtered = prev.projects.filter((p) => p.id !== item.originalId);
          return { ...prev, projects: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'goal': {
          const filtered = prev.goals.filter((g) => g.id !== item.originalId);
          return { ...prev, goals: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'idea': {
          const filtered = prev.ideas.filter((i) => i.id !== item.originalId);
          return { ...prev, ideas: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'habit': {
          const filtered = prev.habits.filter((h) => h.id !== item.originalId);
          return { ...prev, habits: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'timeLog': {
          const filtered = prev.timeLogs.filter((l) => l.id !== item.originalId);
          return { ...prev, timeLogs: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'transaction': {
          const filtered = prev.transactions.filter((tx) => tx.id !== item.originalId);
          return { ...prev, transactions: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        case 'experiment': {
          const filtered = prev.incomeExperiments.filter((e) => e.id !== item.originalId);
          return { ...prev, incomeExperiments: [item.originalData, ...filtered], trashItems: remainingTrash };
        }
        default:
          return { ...prev, trashItems: remainingTrash };
      }
    });

    recordAction({
      title: 'استرجاع عنصر لمكانه الأصلي',
      itemTitle: item.title,
      category: item.type as ActionCategory,
      actionType: 'restore',
      description: `تم استرجاع العنصر "${item.title}" بنجاح وإعادته إلى مكانه الأصلي في النظام.`,
      previousSnapshot: item.originalData,
      entityId: item.originalId,
      canUndo: false,
    });
  };

  const deletePermanently = (trashId: string) => {
    setState((prev) => ({
      ...prev,
      trashItems: (prev.trashItems || []).filter((t) => t.id !== trashId),
    }));
  };

  const emptyTrash = () => {
    setState((prev) => ({
      ...prev,
      trashItems: [],
    }));
    setDistractionAlert('تم تفريغ سلة المهملات بالكامل نهائياً.');
  };

  // إدارة تقارير الإنتاجية اليومية (Daily Reports & Manual Overrides)
  const saveDailyReport = (reportData: Omit<DailyReportItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState((prev) => {
      const existing = (prev.dailyReports || []).find((r) => r.date === reportData.date);
      const now = new Date().toISOString();
      if (existing) {
        return {
          ...prev,
          dailyReports: prev.dailyReports.map((r) =>
            r.date === reportData.date
              ? { ...r, ...reportData, updatedAt: now }
              : r
          ),
        };
      } else {
        const newReport: DailyReportItem = {
          ...reportData,
          id: `rep-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        return {
          ...prev,
          dailyReports: [newReport, ...(prev.dailyReports || [])],
        };
      }
    });
  };

  const deleteDailyReport = (reportId: string) => {
    setState((prev) => ({
      ...prev,
      dailyReports: (prev.dailyReports || []).filter((r) => r.id !== reportId),
    }));
  };

  // الكتل الزمنية
  const toggleTimeBlock = (blockId: string) => {
    setState((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.map((b) =>
        b.id === blockId ? { ...b, completed: !b.completed } : b
      ),
    }));
  };

  const addTimeBlock = (block: Omit<TimeBlock, 'id'>) => {
    const newBlock: TimeBlock = {
      ...block,
      id: `tb-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      timeBlocks: [...prev.timeBlocks, newBlock],
    }));
  };

  const resetToDefault = () => {
    const res = resetAppStateToSeed();
    setState(res);
  };

  const resetToCleanSlate = () => {
    const res = resetAppStateToCleanSlate();
    setState(res);
  };

  const exportBackup = () => {
    exportAppStateAsJSON(state);
  };

  const importBackup = (jsonText: string): boolean => {
    const imported = importAppStateFromJSON(jsonText);
    if (imported) {
      setState(imported);
      return true;
    }
    return false;
  };

  // دوال سجل الأخطاء والدروس المستفادة (Error & Bug Codex)
  const errorLogs: ErrorLogItem[] = state.errorLogs || [];

  const addErrorLog = (item: Omit<ErrorLogItem, 'id' | 'createdAt'>) => {
    const newItem: ErrorLogItem = {
      ...item,
      id: 'err-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      errorLogs: [newItem, ...(prev.errorLogs || [])],
    }));
    recordAction({
      title: 'توثيق خطأ/درس مستفاد',
      itemTitle: newItem.title,
      category: 'learning',
      actionType: 'create',
      description: `تم توثيق الخطأ: "${newItem.title}" في سجل الأخطاء والدروس المستفادة.`,
      canUndo: false,
    });
  };

  const updateErrorLog = (updatedItem: ErrorLogItem) => {
    setState((prev) => ({
      ...prev,
      errorLogs: (prev.errorLogs || []).map((e) => (e.id === updatedItem.id ? updatedItem : e)),
    }));
  };

  const deleteErrorLog = (id: string) => {
    setState((prev) => ({
      ...prev,
      errorLogs: (prev.errorLogs || []).filter((e) => e.id !== id),
    }));
  };

  const toggleErrorResolved = (id: string) => {
    setState((prev) => ({
      ...prev,
      errorLogs: (prev.errorLogs || []).map((e) =>
        e.id === id ? { ...e, isResolved: !e.isResolved } : e
      ),
    }));
  };

  const exportErrorLogToMarkdown = (id?: string): string => {
    const list = id ? (state.errorLogs || []).filter((e) => e.id === id) : (state.errorLogs || []);
    if (list.length === 0) return '# لا توجد أخطاء مسجلة حالياً\n';

    let md = '# 🛡️ سجل الأخطاء والدروس المستفادة — السماحي OS\n\n';
    md += `*تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}*\n\n---\n\n`;

    list.forEach((err, idx) => {
      md += `## ${idx + 1}. ${err.title}\n\n`;
      md += `- **التاريخ:** ${err.date}\n`;
      md += `- **التصنيف:** ${err.category}\n`;
      md += `- **الخطورة:** ${err.severity.toUpperCase()}\n`;
      md += `- **الحالة:** ${err.isResolved ? '✅ تم الحل' : '⏳ قيد المتابعة'}\n`;
      md += `- **الوسوم:** ${err.tags.map((t) => `#${t}`).join(' ')}\n\n`;
      md += '### 🔍 الأعراض والمشكلة:\n' + err.symptoms + '\n\n';
      md += '### 🎯 السبب الجذري (Root Cause):\n' + err.rootCause + '\n\n';
      md += '### 💡 الحل المنفذ (Solution):\n' + err.solution + '\n\n';
      md += '### 🏆 القاعدة الذهبية للمستقبل:\n> ' + err.preventionRule + '\n\n';
      md += '---\n\n';
    });

    return md;
  };

  const dismissDistractionAlert = () => setDistractionAlert(null);
  const triggerDistractionAlert = (msg: string) => setDistractionAlert(msg);

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        // سجل الأخطاء والدروس
        errorLogs,
        addErrorLog,
        updateErrorLog,
        deleteErrorLog,
        toggleErrorResolved,
        exportErrorLogToMarkdown,
        isIdeaModalOpen,
        setIsIdeaModalOpen,
        isQuickTaskModalOpen,
        setIsQuickTaskModalOpen,
        editingTask,
        setEditingTask,
        editingProject,
        setEditingProject,
        editingGoal,
        setEditingGoal,
        editingHabit,
        setEditingHabit,
        distractionAlert,
        dismissDistractionAlert,
        triggerDistractionAlert,
        toggleTaskStatus,
        setTaskTodayFocus,
        addTask,
        updateTask,
        deleteTask,
        moveTaskToParkingLot,
        addProject,
        updateProject,
        toggleProjectMilestone,
        deleteProject,
        addGoal,
        updateGoal,
        deleteGoal,
        addIdea,
        updateIdea,
        deleteIdea,
        convertIdeaToProject,
        toggleTimeBlock,
        addTimeBlock,
        toggleHabitToday,
        addHabit,
        updateHabit,
        deleteHabit,
        addWeeklyReview,
        deleteWeeklyReview,
        activeTimer,
        startTimer,
        stopTimer,
        resetTimer,
        addManualTimeLog,
        deleteTimeLog,
        addTransaction,
        deleteTransaction,
        financialSummary,
        addIncomeExperiment,
        updateIncomeExperiment,
        deleteIncomeExperiment,
        learningSkills: state.skills || [],
        addLearningSkill,
        updateLearningSkill,
        deleteLearningSkill,
        resetToDefault,
        resetToCleanSlate,
        exportBackup,
        importBackup,
        theme,
        toggleTheme,
        setTheme,
        todayFocusTasks,
        activeProjects,
        dailyScoreBreakdown,
        executionRate,
        trashItems: state.trashItems || [],
        restoreFromTrash,
        deletePermanently,
        emptyTrash,
        dailyReports: state.dailyReports || [],
        saveDailyReport,
        deleteDailyReport,
        actionHistory: state.actionHistory || [],
        latestAction,
        dismissLatestAction,
        undoAction,
        selectedActionDetails,
        setSelectedActionDetails,
        isManbaDrawerOpen,
        setIsManbaDrawerOpen,
        clearActionHistory,
        recordAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
