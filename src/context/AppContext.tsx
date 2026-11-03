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
  DailyScoreBreakdown,
  TimeCategory,
} from '../types';
import {
  loadAppState,
  saveAppState,
  resetAppStateToSeed,
  exportAppStateAsJSON,
  importAppStateFromJSON,
} from '../lib/storage';

interface AppContextType {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;

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

  // التصدير والاستيراد
  resetToDefault: () => void;
  exportBackup: () => void;
  importBackup: (jsonText: string) => boolean;

  // المؤشرات الحسابية
  todayFocusTasks: Task[];
  activeProjects: Project[];
  dailyScoreBreakdown: DailyScoreBreakdown;
  executionRate: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // نوافذ سريعة
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isQuickTaskModalOpen, setIsQuickTaskModalOpen] = useState(false);
  const [distractionAlert, setDistractionAlert] = useState<string | null>(null);

  // حالات التعديل الفردية (Editing state modals)
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

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
    const habitsPercent = totalHabits > 0 ? (habitsDone / totalHabits) * 100 : 50;

    // كتل الوقت
    const blocksTotal = state.timeBlocks.length;
    const blocksDone = state.timeBlocks.filter((b) => b.completed).length;
    const blocksPercent = blocksTotal > 0 ? (blocksDone / blocksTotal) * 100 : 50;

    // الوزن: 50% لمهام التركيز الثلاثية + 25% للعادات + 25% للكتل الزمنية
    const finalScore = Math.round(focusPercent * 0.5 + habitsPercent * 0.25 + blocksPercent * 0.25);

    let verdict = 'في بداية اليوم — حدد ونفّذ أول خطوة';
    let advice = 'ركز على المهمة الاستراتيجية رقم 1 وعاداتك الأساسية.';

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
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }),
    }));
  };

  const setTaskTodayFocus = (taskId: string, isFocus: boolean): boolean => {
    if (isFocus) {
      const currentFocusCount = state.tasks.filter((t) => t.isTodayFocus && t.id !== taskId).length;
      if (currentFocusCount >= 3) {
        setDistractionAlert(
          'قاعدة التركيز الذهبية: أهم 3 مهام فقط لليوم! هل هذه المهمة تقربك فعلاً من هدفك؟ اقترح وضعها في الـ Parking Lot بدلاً من تشتيت تركيزك.'
        );
        return false;
      }
    }

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, isTodayFocus: isFocus } : t)),
    }));
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

    return newTask;
  };

  const updateTask = (updated: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
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

    setDistractionAlert('تم نقل المهمة بنجاح إلى الـ Parking Lot لحماية تركيزك اليومي.');
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

    return true;
  };

  const updateProject = (project: Project) => {
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter((m) => m.completed).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : project.progress;

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? { ...project, progress } : p)),
    }));
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedMilestones = proj.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const total = updatedMilestones.length;
        const done = updatedMilestones.filter((m) => m.completed).length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          ...proj,
          milestones: updatedMilestones,
          progress,
        };
      }),
    }));
  };

  const deleteProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
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
  };

  const updateGoal = (updatedGoal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
    }));
  };

  const deleteGoal = (goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
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
  };

  const updateIdea = (idea: IdeaItem) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === idea.id ? idea : i)),
    }));
  };

  const deleteIdea = (ideaId: string) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== ideaId),
    }));
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

    setActiveTab('projects');
    setDistractionAlert('تم تحويل الفكرة إلى مشروع تجريبي مدروس في قائمة "المشاريع القادمة Next".');
  };

  // العادات
  const toggleHabitToday = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const alreadyDone = h.completedDates.includes(todayStr);
        let updatedDates: string[];
        let updatedStreak = h.streak;

        if (alreadyDone) {
          updatedDates = h.completedDates.filter((d) => d !== todayStr);
          updatedStreak = Math.max(0, h.streak - 1);
        } else {
          updatedDates = [todayStr, ...h.completedDates];
          updatedStreak = h.streak + 1;
        }

        return {
          ...h,
          completedDates: updatedDates,
          streak: updatedStreak,
        };
      }),
    }));
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
  };

  const updateHabit = (habit: Habit) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habit.id ? habit : h)),
    }));
  };

  const deleteHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
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
  };

  const deleteTimeLog = (id: string) => {
    setState((prev) => ({
      ...prev,
      timeLogs: prev.timeLogs.filter((l) => l.id !== id),
    }));
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
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
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
  };

  const updateIncomeExperiment = (exp: IncomeExperiment) => {
    setState((prev) => ({
      ...prev,
      incomeExperiments: prev.incomeExperiments.map((e) => (e.id === exp.id ? exp : e)),
    }));
  };

  const deleteIncomeExperiment = (id: string) => {
    setState((prev) => ({
      ...prev,
      incomeExperiments: prev.incomeExperiments.filter((e) => e.id !== id),
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

  const dismissDistractionAlert = () => setDistractionAlert(null);
  const triggerDistractionAlert = (msg: string) => setDistractionAlert(msg);

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
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
        resetToDefault,
        exportBackup,
        importBackup,
        todayFocusTasks,
        activeProjects,
        dailyScoreBreakdown,
        executionRate,
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
