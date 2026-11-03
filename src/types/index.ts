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
  actualMinutes?: number; // الوقت الفعلي المستغرق بالدقائق
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
  linkedGoalId?: string; // ربط العادة بهدف سنوي
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
  | 'Idea'
  | 'Research'
  | 'Testing'
  | 'First Customer'
  | 'Validated'
  | 'Profitable'
  | 'Stopped'
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
  nextStep?: string;
  outcomeNotes?: string;
  createdAt: string;
}

// نظام التعلم والتطبيق (Learning & Practice Lab)
export interface LearningSkill {
  id: string;
  name: string;
  category: 'برمجة وذكاء اصطناعي' | 'تجارة وبزنس' | 'تسويق ومبيعات' | 'إنتاجية وفكر';
  masteryPercentage: number; // 0 to 100
  targetProject: string; // المشروع المباشر لتطبيق المهارة فوراً
  status: 'active' | 'applied' | 'mastered';
  hoursLogged: number;
  notes: string;
  linkedGoalId?: string; // ربط المهارة بهدف سنوي
  linkedProjectId?: string; // ربط المهارة بمشروع حي
  createdAt: string;
}

// رسائل وإجراءات المساعد الذكي (Intelligent Assistant)
export interface AssistantActionItem {
  type: 'goal' | 'project' | 'task' | 'habit' | 'skill' | 'experiment';
  action: 'create' | 'update' | 'delete' | 'link';
  id?: string;
  title: string;
  details?: string;
  data?: any;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionsExecuted?: AssistantActionItem[];
  pendingConfirmation?: {
    actionType: string;
    description: string;
    payload: any;
  };
}

export interface DailyScoreBreakdown {
  score: number; // 0 to 100
  focusTasksRatio: string;
  focusTasksPercent: number;
  habitsRatio: string;
  verdict: string;
  advice: string;
}

// سلة المهملات وسجل التعديلات (Recycle Bin & Revision History)
export type TrashItemType =
  | 'task'
  | 'project'
  | 'goal'
  | 'idea'
  | 'timeLog'
  | 'habit'
  | 'transaction'
  | 'experiment';

export interface TrashItem {
  id: string; // معرف فريد في السلة
  originalId: string;
  type: TrashItemType;
  title: string;
  deletedAt: string; // ISO timestamp
  originalData: any; // النسخة الكاملة لاسترجاع العنصر بدقة
  categoryOrArea?: string;
  reason: 'deleted' | 'previous_version'; // هل هو عنصر محذوف أم نسخة سابقة قبل التعديل
}

// تقرير الإنتاجية اليومي والتقييم الذاتي
export interface DailyReportItem {
  id: string;
  date: string; // YYYY-MM-DD
  userStrengths: string; // نقاط القوة المكتوبة يدوياً أو المعتمدة
  userImprovements: string; // مجالات التحسين والتطوير
  userTomorrowFocus: string; // قرار وتركيز الغد
  aiAnalysis?: string; // نص تحليل Gemini الشامل
  aiStrengths?: string[];
  aiImprovements?: string[];
  overallRating: number; // 1-10
  isManualOverride: boolean; // هل خضع للتعديل والاعتماد الذاتي
  createdAt: string;
  updatedAt: string;
}

// منبع العمليات والإنجازات وسجل الخطوات (Action History & Accomplishments Stream)
export type ActionCategory =
  | 'task'
  | 'habit'
  | 'project'
  | 'goal'
  | 'idea'
  | 'timeLog'
  | 'transaction'
  | 'experiment'
  | 'learning'
  | 'review'
  | 'dailyReport'
  | 'system';

export type ActionType =
  | 'create'
  | 'complete'
  | 'uncomplete'
  | 'update'
  | 'delete'
  | 'restore'
  | 'move'
  | 'focus';

export interface ActionDetailField {
  label: string;
  oldValue?: string | number | boolean;
  newValue?: string | number | boolean;
}

export interface ActionHistoryItem {
  id: string;
  timestamp: string; // ISO string
  title: string; // عنوان الخطوة، مثال: "إكمال مهمة"، "إضافة عادة جديدة"
  itemTitle: string; // اسم العنصر الفعلي، مثال: "برمجة واجهة التطبيق"
  category: ActionCategory;
  actionType: ActionType;
  description: string; // شرح تفصيلي لما تم إنجازه
  changes?: ActionDetailField[];
  metadata?: {
    lifeArea?: string;
    priority?: string;
    durationMinutes?: number;
    streak?: number;
    amount?: number;
    status?: string;
    progress?: number;
    [key: string]: any;
  };
  previousSnapshot?: any; // لاسترجاع العنصر أو الحالة بدقة
  newSnapshot?: any;
  entityId?: string;
  canUndo: boolean;
  undone: boolean;
  undoneAt?: string;
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
  trashItems: TrashItem[]; // سلة المهملات وسجل التعديلات
  dailyReports: DailyReportItem[]; // تقارير الإنتاجية اليومية
  actionHistory: ActionHistoryItem[]; // منبع الإنجازات والأنشطة وسجل الخطوات
  skills?: LearningSkill[]; // مهارات التعلم والتطبيق
  lastReviewDate?: string;
}


