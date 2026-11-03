/**
 * types/index.ts
 * تعريف كافة النماذج والبيانات لنظام "السماحي OS" الشامل
 * يحتوي على نماذج الأهداف، المشاريع، المهام، العادات، تتبع الوقت، المال، وتجارب الدخل
 */

// مجالات الحياة الأساسية
export type LifeArea =
  | 'الدين'
  | 'الصحة'
  | 'التعلم'
  | 'البرمجة'
  | 'العمل'
  | 'المال'
  | 'التجارة'
  | 'المشروع'
  | 'العائلة'
  | 'العلاقات'
  | 'التطوير الشخصي';

export type GoalQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Goal {
  id: string;
  title: string;
  description: string;
  year: number; // 2027
  quarter: GoalQuarter;
  quarterTheme: string; // BUILD, APPLY, EARN, SCALE
  month?: string;
  lifeArea: LifeArea;
  progress: number; // 0 - 100
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  createdAt: string;
}

export type ProjectStatus = 'active' | 'next' | 'parking_lot' | 'completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  lifeArea: LifeArea;
  linkedGoalId?: string;
  status: ProjectStatus; // حد أقصى 3 مشاريع نشطة
  progress: number;
  milestones: ProjectMilestone[];
  targetDate?: string;
  createdAt: string;
}

export type TaskPriority = 'high' | 'strategic' | 'normal';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'deferred';

export interface Task {
  id: string;
  title: string;
  lifeArea: LifeArea;
  estimatedMinutes: number;
  priority: TaskPriority;
  linkedGoalId?: string;
  linkedProjectId?: string;
  status: TaskStatus;
  isTodayFocus: boolean; // هل هي ضمن أهم 3 مهام؟
  completedAt?: string;
  createdAt: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  problem: string;
  targetAudience: string;
  requiredSkill: string;
  notes: string;
  createdAt: string;
  status: 'raw' | 'converted' | 'archived';
}

export interface TimeBlock {
  id: string;
  timeRange: string;
  title: string;
  category: string;
  completed: boolean;
}

// العادات اليومية (Habits)
export interface Habit {
  id: string;
  title: string;
  lifeArea: LifeArea;
  frequency: 'daily' | 'weekdays';
  targetTime?: string;
  streak: number; // عدد الأيام المتتالية
  completedDates: string[]; // تواريخ بصيغة YYYY-MM-DD
  createdAt: string;
}

// المراجعة الأسبوعية (Weekly Review)
export interface WeeklyReviewReport {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  q1_biggestAchievement: string; // إيه أهم حاجة أنجزتها؟
  q2_missedThings: string;        // إيه اللي معملتهوش؟
  q3_reasonForMissed: string;     // إيه السبب؟
  q4_biggestTimeWaster: string;   // أكتر حاجة ضيعت وقتي؟
  q5_whatBroughtResults: string;  // إيه اللي جاب نتيجة؟
  q6_incomeProximity: string;     // هل قربت من مصدر دخل؟
  q7_learnedOrApplied: string;    // هل تعلمت أم طبقت؟
  q8_nextWeekTop3: string;        // أهم 3 أهداف للأسبوع القادم؟
  overallSatisfaction: number;    // 1-10
  createdAt: string;
}

// تتبع الوقت (Time Tracking)
export type TimeCategory =
  | 'Programming'
  | 'AI'
  | 'Business'
  | 'Work'
  | 'Learning'
  | 'Exercise'
  | 'Family'
  | 'Rest'
  | 'Social Media'
  | 'Wasted Time';

export interface TimeLog {
  id: string;
  category: TimeCategory;
  description: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  isDeepWork: boolean;
  createdAt: string;
}

export interface ActiveTimer {
  isRunning: boolean;
  startTime: number | null; // timestamp
  elapsedSeconds: number;
  category: TimeCategory;
  description: string;
}

// التدفق المالي (Money Ledger)
export type TransactionType = 'income' | 'expense' | 'savings';
export type MoneyCategory =
  | 'خدمات ومستقل (Services)'
  | 'مشاريع وبزنس (Business)'
  | 'عمل أساسي (Work)'
  | 'أدوات واشتراكات (Tools & Tech)'
  | 'معيشة ومصاريف شخصية (Personal)'
  | 'تعليم وتطوير (Education)'
  | 'ادخار واستثمار (Savings)';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: MoneyCategory;
  sourceOrPayee: string;
  notes: string;
  isBusiness: boolean;
}

// تجارب مصادر الدخل (Income Experiments)
export type ExperimentStatus =
  | 'فكرة'
  | 'بحث ودراسة'
  | 'اختبار جاري (14 يوم)'
  | 'أول عميل تحقق'
  | 'مربح ومستمر'
  | 'متوقف';

export interface IncomeExperiment {
  id: string;
  name: string;
  problem: string;
  targetClient: string;
  requiredSkill: string;
  requiredCapital: number;
  requiredTimeHours: number;
  monetizationSource: string;
  startDate: string;
  testDurationDays: number; // 14 يوم افتراضياً
  targetClientsContacted: number; // الهدف 20 عميل
  actualClientsContacted: number;
  revenueEarned: number;
  status: ExperimentStatus;
  resultVerdict?: 'نجحت' | 'تحتاج تعديل' | 'أوقفها' | 'اختبر نسخة جديدة';
  learningsNotes: string;
  createdAt: string;
}

export interface DailyScoreBreakdown {
  score: number; // 0 to 100
  focusTasksRatio: string;
  focusTasksPercent: number;
  habitsRatio: string;
  verdict: string;
  advice: string;
}

export interface AppState {
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  ideas: IdeaItem[];
  timeBlocks: TimeBlock[];
  habits: Habit[];
  weeklyReviews: WeeklyReviewReport[];
  timeLogs: TimeLog[];
  transactions: Transaction[];
  incomeExperiments: IncomeExperiment[];
  lastReviewDate?: string;
}
