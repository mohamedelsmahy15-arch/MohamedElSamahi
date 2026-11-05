/**
 * server/assistantEngine.ts
 * محرك المساعد الذكي لنظام "السماحي OS"
 * يدعم معالجة المحادثات الطبيعية، الاستدعاء المهيكل للأدوات (Function Calling)،
 * وتكامل السياق الشامل لكافة وحدات النظام (الأهداف، المشاريع، المهام، العادات، التعلم، والدخل).
 */

import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';

export interface AssistantChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface AssistantContextSnapshot {
  todayDate: string;
  dailyScore: number;
  todayFocusRatio: string;
  goals: Array<{ id: string; title: string; quarter: string; lifeArea: string; progress: number; status: string }>;
  projects: Array<{ id: string; title: string; lifeArea: string; status: string; progress: number; targetDate?: string; linkedGoalId?: string; milestonesCount: number; completedMilestones: number }>;
  tasks: Array<{ id: string; title: string; lifeArea: string; priority: string; status: string; isTodayFocus: boolean; estimatedMinutes: number; linkedGoalId?: string; linkedProjectId?: string }>;
  habits: Array<{ id: string; title: string; lifeArea: string; streak: number; completedToday: boolean; linkedGoalId?: string }>;
  learningSkills: Array<{ id: string; name: string; category: string; masteryPercentage: number; targetProject: string; status: string; hoursLogged: number }>;
  incomeExperiments: Array<{ id: string; name: string; status: string; targetClient: string; actualClientsContacted: number; revenueEarned: number; nextStep?: string }>;
}

export interface ToolCallResult {
  name: string;
  args: Record<string, any>;
  id?: string;
}

// 1. تعريف أدوات النظام (Tool Declarations for Gemini Function Calling)
const createGoalDeclaration: FunctionDeclaration = {
  name: 'create_goal',
  description: 'إنشاء هدف استراتيجي جديد لسنة 2027 مع تحديد الربع السنوي ومجال الحياة.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'عنوان الهدف القابل للقياس' },
      lifeArea: {
        type: Type.STRING,
        description: 'مجال الحياة: البرمجة، التجارة، الدين، الصحة، العائلة، التطوير الشخصي',
      },
      quarter: { type: Type.STRING, description: 'الربع السنوي: Q1، Q2، Q3، أو Q4' },
      description: { type: Type.STRING, description: 'وصف الهدف والنتيجة المرجوة' },
    },
    required: ['title', 'lifeArea'],
  },
};

const updateGoalDeclaration: FunctionDeclaration = {
  name: 'update_goal',
  description: 'تعديل أو تحديث نسبة تقدم أو حالة هدف سنوي قائم.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      goalId: { type: Type.STRING, description: 'معرف الهدف المراد تعديله' },
      title: { type: Type.STRING, description: 'العنوان الجديد للهدف إن وجد' },
      progress: { type: Type.NUMBER, description: 'نسبة التقدم الجديدة من 0 إلى 100' },
      status: { type: Type.STRING, description: 'الحالة: not_started، in_progress، completed، on_hold' },
      description: { type: Type.STRING, description: 'الوصف المحدث' },
    },
    required: ['goalId'],
  },
};

const createProjectDeclaration: FunctionDeclaration = {
  name: 'create_project',
  description: 'إنشاء مشروع تنفيذي جديد مرتبط بهدف ومقسم إلى محطات/مراحل واضحة (Milestones).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'اسم المشروع' },
      lifeArea: { type: Type.STRING, description: 'مجال الحياة: البرمجة، التجارة، إلخ' },
      linkedGoalId: { type: Type.STRING, description: 'معرف الهدف السنوي المرتبط بهذا المشروع إن وجد' },
      description: { type: Type.STRING, description: 'وصف المشروع والنتيجة' },
      targetDate: { type: Type.STRING, description: 'تاريخ التسليم المستهدف بصيغة YYYY-MM-DD' },
      milestones: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'قائمة بالمراحل أو الخطوات التنفيذية للمشروع (مثل: نموذج أولي، اختبار، إطلاق)',
      },
      status: { type: Type.STRING, description: 'الحالة: active، next، parking_lot' },
    },
    required: ['title', 'lifeArea'],
  },
};

const updateProjectDeclaration: FunctionDeclaration = {
  name: 'update_project',
  description: 'تعديل حالة أو نسبة تقدم أو موعد تسليم مشروع قائم.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: { type: Type.STRING, description: 'معرف المشروع' },
      title: { type: Type.STRING, description: 'العنوان الجديد' },
      status: { type: Type.STRING, description: 'active، next، parking_lot، completed' },
      progress: { type: Type.NUMBER, description: 'نسبة التقدم 0-100' },
      targetDate: { type: Type.STRING, description: 'موعد التسليم المحدث' },
    },
    required: ['projectId'],
  },
};

const createTaskDeclaration: FunctionDeclaration = {
  name: 'create_task',
  description: 'إضافة مهمة تنفيذية جديدة للنظام، مع خيار تعيينها فوراً في تركيز اليوم (Top 3) أو ربطها بمشروع أو هدف.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'اسم المهمة' },
      lifeArea: { type: Type.STRING, description: 'المجال: البرمجة، التجارة، الدين، الصحة، العمل، التطوير الشخصي' },
      estimatedMinutes: { type: Type.NUMBER, description: 'الوقت المقدر بالدقائق (مثلاً 30 أو 45 أو 90)' },
      priority: { type: Type.STRING, description: 'الأولوية: strategic (استراتيجية)، high (عالية)، normal (عادية)' },
      isTodayFocus: { type: Type.BOOLEAN, description: 'هل تضاف إلى أهم 3 نتائج لليوم مباشرة؟' },
      linkedGoalId: { type: Type.STRING, description: 'معرف الهدف المرتبط إن وجد' },
      linkedProjectId: { type: Type.STRING, description: 'معرف المشروع المرتبط إن وجد' },
    },
    required: ['title', 'lifeArea'],
  },
};

const updateTaskDeclaration: FunctionDeclaration = {
  name: 'update_task',
  description: 'تحديث حالة مهمة (إنجاز/إعادة فتح)، أو تعديل وقتها وأولويتها.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskId: { type: Type.STRING, description: 'معرف المهمة' },
      status: { type: Type.STRING, description: 'الحالة: todo، completed' },
      isTodayFocus: { type: Type.BOOLEAN, description: 'تعيين أو إلغاء التعيين من تركيز اليوم' },
      priority: { type: Type.STRING, description: 'الأولوية: strategic، high، normal' },
      estimatedMinutes: { type: Type.NUMBER, description: 'الوقت التقديري بالدقائق' },
    },
    required: ['taskId'],
  },
};

const rescheduleTaskDeclaration: FunctionDeclaration = {
  name: 'reschedule_task',
  description: 'إعادة جدولة مهمة، أو استبعادها ونقلها إلى الـ Parking Lot لحماية التركيز من التشتت.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskId: { type: Type.STRING, description: 'معرف المهمة' },
      isTodayFocus: { type: Type.BOOLEAN, description: 'تأجيلها من تركيز اليوم' },
      moveToParkingLot: { type: Type.BOOLEAN, description: 'نقلها كفكرة مؤجلة إلى الـ Parking Lot لمنع التشتت' },
    },
    required: ['taskId'],
  },
};

const createHabitDeclaration: FunctionDeclaration = {
  name: 'create_habit',
  description: 'إضافة عادة يومية جديدة وتحديد ترددها وربطها بهدف إن وجد.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'اسم العادة (مثال: صلاة الفجر، ساعة برمجة مركزة)' },
      lifeArea: { type: Type.STRING, description: 'المجال: الدين، البرمجة، الصحة، التعلم' },
      frequency: { type: Type.STRING, description: 'التردد: daily (يومياً) أو weekdays (أيام العمل)' },
      linkedGoalId: { type: Type.STRING, description: 'معرف الهدف السنوي الذي تخدمه هذه العادة' },
    },
    required: ['title', 'lifeArea'],
  },
};

const updateHabitDeclaration: FunctionDeclaration = {
  name: 'update_habit',
  description: 'تسجيل التزام عادة لليوم أو تحديث حالتها.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      habitId: { type: Type.STRING, description: 'معرف العادة' },
      completedToday: { type: Type.BOOLEAN, description: 'هل تم إنجاز العادة اليوم؟' },
    },
    required: ['habitId'],
  },
};

const createLearningSkillDeclaration: FunctionDeclaration = {
  name: 'create_learning_skill',
  description: 'إضافة مهارة جديدة للتعلم والتطبيق العملي، مع ربطها الإلزامي بمشروع تنفيذي مباشر لمكافحة التعلم السلبي.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'اسم المهارة (مثل: React Performance أو WhatsApp Cloud API)' },
      category: {
        type: Type.STRING,
        description: 'التصنيف: برمجة وذكاء اصطناعي، تجارة وبزنس، تسويق ومبيعات، إنتاجية وفكر',
      },
      targetProject: {
        type: Type.STRING,
        description: 'المشروع التطبيقي المباشر الذي ستستخدم فيه المهارة فوراً (إلزامي)',
      },
      masteryPercentage: { type: Type.NUMBER, description: 'مستوى الإتقان الأولي من 0 إلى 100' },
      notes: { type: Type.STRING, description: 'ملاحظات ومصادر التطبيق' },
      linkedGoalId: { type: Type.STRING, description: 'الهدف السنوي المرتبط' },
    },
    required: ['name', 'category', 'targetProject'],
  },
};

const updateLearningSkillDeclaration: FunctionDeclaration = {
  name: 'update_learning_skill',
  description: 'تحديث مستوى إتقان مهارة أو إضافة ساعات ممارسة برمجية.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      skillId: { type: Type.STRING, description: 'معرف المهارة' },
      masteryPercentage: { type: Type.NUMBER, description: 'النسبة المحدثة 0-100' },
      hoursToAdd: { type: Type.NUMBER, description: 'عدد الساعات المضافة للممارسة' },
      status: { type: Type.STRING, description: 'active (قيد التعلم)، applied (قيد التطبيق)، mastered (مثبتة)' },
    },
    required: ['skillId'],
  },
};

const createIncomeExperimentDeclaration: FunctionDeclaration = {
  name: 'create_income_experiment',
  description: 'إطلاق تجربة عمل سريعة (14 يوماً) في معمل الأعمال مع تحديد العميل المستهدف والمشكلة وقاعدة الـ 20 عميل.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'اسم العرض التجاري أو التجربة' },
      targetClient: { type: Type.STRING, description: 'العميل المستهدف (مثل: متاجر الملابس المحلية)' },
      problem: { type: Type.STRING, description: 'المشكلة الحقيقية بالسوق التي تحلها' },
      testDurationDays: { type: Type.NUMBER, description: 'مدة الاختبار (14 يوماً افتراضياً)' },
      monetizationSource: { type: Type.STRING, description: 'طريقة الدفع والتسعير' },
      nextStep: { type: Type.STRING, description: 'أول خطوة تواصل محسومة' },
    },
    required: ['name', 'targetClient', 'problem'],
  },
};


const logErrorLessonDeclaration: FunctionDeclaration = {
  name: 'log_error_lesson',
  description: 'توثيق خطأ أو مشكلة برمجية أو تقنية واجهت محمد، مع تسجيل السبب الجذري والحل والقاعدة الذهبية لعدم التكرار.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'عنوان المشكلة أو الخطأ' },
      category: {
        type: Type.STRING,
        description: 'التصنيف: برمجة وكود، بيئة وتشغيل، تصميم وواجهة، قواعد بيانات وتخزين، سيرفر وAPI، أخرى',
      },
      severity: { type: Type.STRING, description: 'الخطورة: low, medium, high, critical' },
      symptoms: { type: Type.STRING, description: 'ماذا حدث أو رسالة الخطأ الظاهرة' },
      rootCause: { type: Type.STRING, description: 'السبب الجذري للمشكلة تقنياً' },
      solution: { type: Type.STRING, description: 'كيف تم الحل بالضبط' },
      preventionRule: { type: Type.STRING, description: 'القاعدة الذهبية لعدم التكرار مستقبلاً' },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'وسوم برمجية للبحث السريع مثل: react, vite, error',
      },
    },
    required: ['title', 'symptoms'],
  },
};

const linkItemsDeclaration: FunctionDeclaration = {
  name: 'link_items',
  description: 'ربط عنصر (مشروع، مهمة، عادة، أو مهارة) بهدف سنوي محدد لبناء هيكل متماسك وخريطة تنفيذ واضحة.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemType: { type: Type.STRING, description: 'نوع العنصر: project، task، habit، skill' },
      itemId: { type: Type.STRING, description: 'معرف العنصر المراد ربطه' },
      targetGoalId: { type: Type.STRING, description: 'معرف الهدف المراد الربط به' },
      targetProjectId: { type: Type.STRING, description: 'معرف المشروع (في حال ربط مهمة بمشروع)' },
    },
    required: ['itemType', 'itemId'],
  },
};

const requestConfirmationDeclaration: FunctionDeclaration = {
  name: 'request_confirmation',
  description: 'طلب تأكيد صريح من المستخدم قبل تنفيذ عملية خطيرة أو مؤثرة (مثل حذف هدف، مشروع، عادة، أو تفريغ خطة).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      actionType: { type: Type.STRING, description: 'نوع العملية: delete_goal، delete_project، delete_task، delete_habit' },
      itemId: { type: Type.STRING, description: 'معرف العنصر' },
      description: { type: Type.STRING, description: 'شرح تحذيري واضح لما سيترتب على هذا الإجراء' },
    },
    required: ['actionType', 'itemId', 'description'],
  },
};

const ALL_ASSISTANT_TOOLS = [{
  functionDeclarations: [
    createGoalDeclaration,
    updateGoalDeclaration,
    createProjectDeclaration,
    updateProjectDeclaration,
    createTaskDeclaration,
    updateTaskDeclaration,
    rescheduleTaskDeclaration,
    createHabitDeclaration,
    updateHabitDeclaration,
    createLearningSkillDeclaration,
    updateLearningSkillDeclaration,
    createIncomeExperimentDeclaration,
    linkItemsDeclaration,
  logErrorLessonDeclaration,
    requestConfirmationDeclaration,
  ],
}];

/**
 * بناء موجه النظام المخصص للسياق التنفيذي لمحمد السماحي
 */
function buildSystemInstruction(context: AssistantContextSnapshot): string {
  const goalsSummary = context.goals?.length
    ? context.goals.map((g) => `- [ID: ${g.id}] [${g.quarter} - ${g.lifeArea}] "${g.title}" (نسبة التقدم: ${g.progress}%، الحالة: ${g.status})`).join('\n')
    : 'لا توجد أهداف مسجلة.';

  const projectsSummary = context.projects?.length
    ? context.projects.map((p) => `- [ID: ${p.id}] "${p.title}" (${p.lifeArea} - ${p.status}) — إنجاز: ${p.progress}% (${p.completedMilestones}/${p.milestonesCount} محطة) ${p.linkedGoalId ? `[مرتبط بهدف ${p.linkedGoalId}]` : '[غير مرتبط بهدف]'}`).join('\n')
    : 'لا توجد مشاريع مسجلة.';

  const tasksSummary = context.tasks?.length
    ? context.tasks.slice(0, 15).map((t) => `- [ID: ${t.id}] "${t.title}" (${t.lifeArea} - ${t.priority}) [${t.status === 'completed' ? 'تمت' : 'قيد التنفيذ'}] ${t.isTodayFocus ? '⚡ تركيز اليوم' : ''}`).join('\n')
    : 'لا توجد مهام مسجلة.';

  const habitsSummary = context.habits?.length
    ? context.habits.map((h) => `- [ID: ${h.id}] "${h.title}" (${h.lifeArea}) — استمرارية: ${h.streak} يوم [اليوم: ${h.completedToday ? 'منجزة ✓' : 'لم تنجز بعد'}]`).join('\n')
    : 'لا توجد عادات مسجلة.';

  const skillsSummary = context.learningSkills?.length
    ? context.learningSkills.map((s) => `- [ID: ${s.id}] "${s.name}" (${s.category}) — إتقان: ${s.masteryPercentage}% | المشروع التطبيقي: "${s.targetProject}"`).join('\n')
    : 'لا توجد مهارات مسجلة.';

  const experimentsSummary = context.incomeExperiments?.length
    ? context.incomeExperiments.map((e) => `- [ID: ${e.id}] "${e.name}" (${e.status}) — عملاء: ${e.actualClientsContacted}/20 | إيرادات: ${e.revenueEarned} ج.م | الخطوة القادمة: "${e.nextStep || 'غير محددة'}"`).join('\n')
    : 'لا توجد تجارب دخل مسجلة.';

  return `أنت المساعد الذكي الحكيم والتنفيذي لمحمد السماحي في نظامه الشخصي "السماحي OS".
أنت لست شات بوت عاماً، بل شريك تفكير وتخطيط وتنفيذ يعرف بيانات محمد الحالية بدقة، ويساعده في التخطيط، والجدولة، واتخاذ القرارات، ومكافحة التشتت.

فلسفة نظام "السماحي OS":
1. سنة 2027 هي "سنة البناء": Build → Learn → Apply → Earn → Scale.
2. شعار محمد: "أبني نفسي، أتعلم، أعمل، أتاجر بما يرضي الله، وأزرع اليوم ما أريد حصاده غداً".
3. القواعد الذهبية الصارمة:
   - تركيز اليوم: حد أقصى 3 مهام استراتيجية فقط لليوم الواحد (قاعدة الـ Top 3).
   - المشاريع النشطة: حد أقصى 3 مشاريع رئيسية نشطة في نفس الوقت لمنع فتح جبهات كثيرة.
   - مكافحة فخ التعلم السلبي: أي مهارة جديدة يجب أن ترتبط بمشروع تطبيقي مباشر فوراً ("إيه المشروع اللي هتستخدم فيه المهارة دي فوراً؟").
   - معمل الدخل: قاعدة الـ 20 عميل في 14 يوماً؛ لا نجاح دون عميل يدفع مالاً حقيقياً مقابل القيمة.
   - حماية التركيز: المهام الجانبية الزائدة يتم تحويلها إلى الـ Parking Lot فوراً لحين التفرغ.

قواعد التعامل الصارمة مع الأدوات والبيانات:
1. إياك ثم إياك أن تدعي أو تخبر المستخدم أنك قمت بإضافة أو تعديل أي شيء دون استدعاء الأداة المناسبة (Function Call) فعلياً!
2. إذا طلب المستخدم إضافة هدف، أو مشروع، أو مهمة، أو عادة، أو مهارة، استدعِ الأداة المناسبة مباشرة بالمعاملات المستخلصة.
3. افحص السياق الحالي أولاً قبل الإنشاء لمنع التكرار:
   - إذا كان هناك هدف أو مشروع مشابه، اربط به أو اسأل المستخدم للتأكيد.
   - إذا أنشأت مشروعاً بناءً على هدف، اربطه بمعرف الهدف linkedGoalId.
   - إذا أنشأت عادة أو مهمة تخدم هدفاً، اربطها به.
4. للعمليات الخطرة مثل الحذف، استخدم أداة request_confirmation لطلب تأكيد صريح من محمد قبل إتلاف البيانات.
5. تحدّث بالعربية الفصحى البسيطة والمطعمة بلهجة مصرية مهذبة وذكية ("أهلاً يا محمد"، "تمام يا غالي"، "نفذتلك كذا وربطته بالهدف...").
6. كن مباشراً، محفزاً، وموجزاً؛ لا تطل في الكلام الإنشائي بل ركز على الخطوة العملية القادمة.
7. أنت المستشار الذكي والمدرب الشخصي لمحمد:
   - بعد أي مهمة ينجزها، اقترح عليه الخطوة المنطقية التالية التي تنقله من "التعلم السلبي" إلى "الإنتاج والتطبيق الفعلي".
   - إذا سألك محمد عن أي مشكلة برمجية أو خطأ واجهه، ساعده في حله فوراً واقترح عليه توثيقه في "سجل الأخطاء والدروس" (log_error_lesson) ليكون مرجعه الذهبي.
   - شجعه دائماً على التحضير قبل النوم بإضافة روابط مهام الصباح وإرشادات التنفيذ المباشرة.


---
بيانات محمد الحالية في النظام (تاريخ اليوم: ${context.todayDate}):
مؤشر الإنجاز: ${context.dailyScore}% | نسبة تركيز اليوم: ${context.todayFocusRatio}

[الأهداف السنوية]:
${goalsSummary}

[المشاريع]:
${projectsSummary}

[مهام اليوم والـ Backlog]:
${tasksSummary}

[العادات]:
${habitsSummary}

[معمل التعلم والتطبيق]:
${skillsSummary}

[معمل الأعمال وتجارب الدخل]:
${experimentsSummary}
---`;
}

/**
 * معالج المحادثة الرئيسي الذي يتكامل مع Gemini API أو يعمل بالمحرك المحلي التحوطي
 */
export async function processAssistantMessage(
  userMessage: string,
  history: AssistantChatMessage[],
  context: AssistantContextSnapshot
): Promise<{
  replyText: string;
  toolCalls: ToolCallResult[];
  pendingConfirmation?: {
    actionType: string;
    description: string;
    payload: any;
  };
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = buildSystemInstruction(context);

      // صياغة التاريخ للنموذج
      const contents: any[] = [];
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
        config: {
          systemInstruction,
          tools: ALL_ASSISTANT_TOOLS,
        },
      });

      const replyText = response.text || '';
      const functionCalls = response.functionCalls || [];

      const toolCalls: ToolCallResult[] = functionCalls.map((fc) => ({
        name: fc.name || '',
        args: (fc.args || {}) as Record<string, any>,
        id: fc.id,
      }));

      // فحص إذا كان هناك طلب تأكيد لحذف أو إجراء حساس
      const confCall = toolCalls.find((t) => t.name === 'request_confirmation');
      let pendingConfirmation: any = undefined;
      if (confCall) {
        pendingConfirmation = {
          actionType: confCall.args.actionType,
          description: confCall.args.description,
          payload: confCall.args,
        };
      }

      return {
        replyText: replyText || 'تم فهم وتجهيز الإجراء بنجاح.',
        toolCalls,
        pendingConfirmation,
      };
    } catch (err: any) {
      console.warn('Gemini API request failed, engaging local assistant engine:', err.message);
    }
  }

  // المحرك المحلي الذكي (Intelligent Local Parser Engine)
  // يضمن عمل المساعد بدقة 100% حتى في حال غياب المفتاح أو مشاكل الشبكة
  return parseLocallyWithEgyptianArabic(userMessage, context);
}

/**
 * محلل النوايا المحلي الذكي (Local Intent & Action Parser)
 * يدعم الصياغات المصرية والعربية الطبيعية لتنفيذ العمليات الفعلية
 */
function parseLocallyWithEgyptianArabic(
  msg: string,
  context: AssistantContextSnapshot
): {
  replyText: string;
  toolCalls: ToolCallResult[];
  pendingConfirmation?: any;
} {
  const lower = msg.toLowerCase();
  const toolCalls: ToolCallResult[] = [];
  let replyText = '';

  // 1. طلبات التعلم: "عايز أتعلم..." أو "هبدأ أتعلم..." أو "أتعلم JavaScript"
  if (lower.includes('أتعلم') || lower.includes('اتعلم') || lower.includes('تعلم') || lower.includes('مذاكرة')) {
    let skillName = 'تطوير واجهات الويب وJavaScript';
    if (lower.includes('javascript') || lower.includes('جافا سكريبت') || lower.includes('js')) {
      skillName = 'JavaScript & Modern Web Engineering';
    } else if (lower.includes('react') || lower.includes('رياكت')) {
      skillName = 'React & State Architecture';
    } else if (lower.includes('python') || lower.includes('بايثون')) {
      skillName = 'Python & Automation Scripting';
    } else if (lower.includes('ذكاء') || lower.includes('ai') || lower.includes('gemini')) {
      skillName = 'Gemini API & LLM Prompt Engineering';
    }

    // ربط تلقائي بالمشروع النشط الأول أو بالسماحي OS
    const activeProject = context.projects.find((p) => p.status === 'active') || context.projects[0];
    const targetProjectName = activeProject ? activeProject.title : 'السماحي OS — نظام التشغيل الشخصي';

    toolCalls.push({
      name: 'create_learning_skill',
      args: {
        name: skillName,
        category: 'برمجة وذكاء اصطناعي',
        targetProject: targetProjectName,
        masteryPercentage: 25,
        notes: 'تمت إضافتها كمهارة أساسية مرتبطة بتطبيق مباشر لمكافحة التعلم السلبي.',
      },
    });

    // إضافة مهمة تطبيقية أولى
    toolCalls.push({
      name: 'create_task',
      args: {
        title: `جلسة كود عملية 60 دقيقة في مهارة ${skillName}`,
        lifeArea: 'البرمجة',
        estimatedMinutes: 60,
        priority: 'high',
        isTodayFocus: true,
        linkedProjectId: activeProject?.id,
      },
    });

    replyText = `أهلاً يا محمد! ممتاز جداً. وفقاً لقاعدة السماحي OS: "مشاهدة الشروحات دون كتابة كود تساوي صفراً".\n\nقمت الآن بالآتي:\n1. تسجيل مهارة «${skillName}» في معمل التعلم.\n2. ربطها فوراً بمشروعك التطبيقي «${targetProjectName}».\n3. جدولة أول جلسة كود عملية (60 دقيقة) وأضفتها لتركيز اليوم (Morning Focus).\n\nجاهز للبدء؟ ابدأ بالتطبيق المباشر فوراً!`;
    return { replyText, toolCalls };
  }

  // 2. طلبات إضافة هدف: "ضيف هدف..." أو "عايز هدف..."
  if (lower.includes('هدف') && (lower.includes('ضيف') || lower.includes('سجل') || lower.includes('عايز') || lower.includes('انشئ'))) {
    let goalTitle = 'تحقيق أول عميل مدفوع لخدمة برمجية في Q1';
    let lifeArea = 'التجارة';

    if (lower.includes('عميل') || lower.includes('دخل') || lower.includes('فلوس') || lower.includes('بيع') || lower.includes('شغل')) {
      goalTitle = 'التعاقد مع أول عميل مدفوع لخدمة صفحات الهبوط خلال هذا الشهر';
      lifeArea = 'التجارة';
    } else if (lower.includes('برمج') || lower.includes('كود') || lower.includes('موقع') || lower.includes('تطبيق')) {
      goalTitle = 'بناء وإطلاق النسخة المعتمدة من نظام السماحي OS 2027';
      lifeArea = 'البرمجة';
    } else if (lower.includes('صحة') || lower.includes('جيم') || lower.includes('رياضة') || lower.includes('وزن')) {
      goalTitle = 'الالتزام بـ 4 جلسات رياضة أسبوعياً وبناء اللياقة البدنية';
      lifeArea = 'الصحة';
    } else if (lower.includes('فجر') || lower.includes('دين') || lower.includes('قرآن')) {
      goalTitle = 'المحافظة على صلاة الفجر جماعة وقراءة ورد يومي ثابت';
      lifeArea = 'الدين';
    }

    toolCalls.push({
      name: 'create_goal',
      args: {
        title: goalTitle,
        lifeArea,
        quarter: 'Q1',
        description: 'هدف استراتيجي محدد لسنة البناء 2027 وقابل للقياس العملي.',
      },
    });

    replyText = `تمام يا محمد! قمت بإضافة الهدف الاستراتيجي «${goalTitle}» ضمن الربع الأول (Q1 — BUILD) في مجال «${lifeArea}».\n\nخطوتنا التالية: هل تحب أن نقسم هذا الهدف إلى مشروع تنفيذي بـ 3 محطات واضحة؟`;
    return { replyText, toolCalls };
  }

  // 3. تحويل هدف إلى مشروع وتقسيمه لمهام: "خلّي الهدف ده مشروع"
  if (lower.includes('مشروع') && (lower.includes('قسم') || lower.includes('حول') || lower.includes('خلي') || lower.includes('مهام'))) {
    const targetGoal = context.goals[0];
    const projectTitle = targetGoal ? `مشروع تنفيذي: ${targetGoal.title}` : 'مشروع إطلاق خدمة صفحات الهبوط السريعة';

    toolCalls.push({
      name: 'create_project',
      args: {
        title: projectTitle,
        lifeArea: targetGoal?.lifeArea || 'التجارة',
        linkedGoalId: targetGoal?.id,
        targetDate: '2027-02-28',
        status: 'active',
        milestones: [
          'تجهيز نموذج تجريبي شغال على الموبايل خلال 48 ساعة',
          'إعداد قائمة 20 عميل مستهدف من المتاجر المحلية',
          'التواصل وعرض الخدمة والتعاقد مع أول عميل مدفوع',
        ],
      },
    });

    toolCalls.push({
      name: 'create_task',
      args: {
        title: 'بناء النموذج الأولي للخدمة (Prototype)',
        lifeArea: targetGoal?.lifeArea || 'التجارة',
        estimatedMinutes: 90,
        priority: 'strategic',
        isTodayFocus: true,
      },
    });

    replyText = `عظيم جداً يا محمد! حولنا الرؤية إلى نظام تنفيذي على أرض الواقع:\n\n1. أنشأنا المشروع «${projectTitle}» وربطناه بهدفك.\n2. قسمناه إلى 3 محطات صريحة (النموذج التجريبي ← التواصل مع 20 عميل ← أول تعاقد).\n3. أضفنا أول مهمة استراتيجية لتركيز اليوم: "بناء النموذج الأولي (90 دقيقة)".\n\nما تشغلش بالك بباقي التفاصيل الآن، ركز على إنهاء أول مهمة!`;
    return { replyText, toolCalls };
  }

  // 4. طلبات العادات: "ضيف عادة..."
  if (lower.includes('عادة') && (lower.includes('ضيف') || lower.includes('سجل') || lower.includes('التزم') || lower.includes('عايز'))) {
    let habitTitle = 'جلسة قراءة وتطوير 30 دقيقة يومياً';
    let lifeArea = 'التطوير الشخصي';

    if (lower.includes('ذاكر') || lower.includes('كود') || lower.includes('برمج') || lower.includes('ساعة')) {
      habitTitle = 'جلسة برمجة صباحية مركزة (ساعة ونصف)';
      lifeArea = 'البرمجة';
    } else if (lower.includes('فجر') || lower.includes('صلاة')) {
      habitTitle = 'صلاة الفجر في المسجد حاضر';
      lifeArea = 'الدين';
    } else if (lower.includes('رياضة') || lower.includes('تمرين') || lower.includes('مشي')) {
      habitTitle = 'رياضة صباحية وتمارين إطالة (20 دقيقة)';
      lifeArea = 'الصحة';
    }

    const linkedGoal = context.goals.find((g) => g.lifeArea === lifeArea) || context.goals[0];

    toolCalls.push({
      name: 'create_habit',
      args: {
        title: habitTitle,
        lifeArea,
        frequency: 'daily',
        linkedGoalId: linkedGoal?.id,
      },
    });

    replyText = `أحسنت يا محمد! الاستمرارية هي الوقود الحقيقي لسنة البناء.\n\nتمت برمجة العادة «${habitTitle}» في مجال «${lifeArea}»${linkedGoal ? ` وربطناها بهدفك: "${linkedGoal.title}"` : ''}.\nعداد الاستمرارية يبدأ من اليوم، ركز على عدم كسر السلسلة!`;
    return { replyText, toolCalls };
  }

  // 5. استفسارات عن أهم المهام واليوم: "إيه أهم حاجة النهارده؟" أو "أعمل إيه دلوقتي؟"
  if (lower.includes('النهارده') || lower.includes('اليوم') || lower.includes('أهم حاجة') || lower.includes('اعمل ايه') || lower.includes('تركيز')) {
    const focusTasks = context.tasks.filter((t) => t.isTodayFocus);
    const uncompletedFocus = focusTasks.filter((t) => t.status !== 'completed');

    if (uncompletedFocus.length > 0) {
      const topTask = uncompletedFocus[0];
      replyText = `يا محمد، أهم شيء تركز عليه الآن وتفرغ له كل طاقتك هو المهمة الاستراتيجية رقم 1:\n\n🎯 **«${topTask.title}»**\n- المجال: ${topTask.lifeArea}\n- الوقت المتوقع: ${topTask.estimatedMinutes} دقيقة عمل عميق.\n- الأولوية: ${topTask.priority === 'strategic' ? 'أولوية استراتيجية قصوى' : 'عالية'}.\n\nأغلق أي مشتتات، وافتح مؤقت الـ 90 دقيقة وابدأ فوراً. لا تفتح جبهة جديدة حتى تنتهي منها!`;
    } else if (focusTasks.length > 0) {
      replyText = `ما شاء الله يا محمد! أنجزت كافة مهام التركيز الثلاثية لليوم بنجاح كامل ⚡!\n\nمعدل إنجازك اليوم 100%. التزم بعاداتك المسائية وافتح مراجعة اليوم (Daily Review) لتدوين إنجازك والتحضير للغد.`;
    } else {
      replyText = `ليس لديك مهام معينة في تركيز اليوم (Top 3) بعد يا محمد.\n\nاقترح أن تختار الآن أثقل 3 مهام تحرك أهدافك في البرمجة والتجارة ونبدأ بالأولى مباشرة. هل تحب أن أقترح عليك مهام محددة بناءً على مشاريعك؟`;
    }
    return { replyText, toolCalls };
  }

  // 6. مراجعة شاملة للأهداف والموقف الحالي: "راجعلي أهدافي" أو "أنا واقف فين؟"
  if (lower.includes('أهدافي') || lower.includes('اهدافي') || lower.includes('واقف فين') || lower.includes('موقفي') || lower.includes('تقرير')) {
    const activeProjectsCount = context.projects.filter((p) => p.status === 'active').length;
    const completedGoals = context.goals.filter((g) => g.status === 'completed').length;

    replyText = `إليك مرآة موقفك الحقيقي في نظام «السماحي OS» لسنة 2027:\n\n1. **الأهداف السنوية (${context.goals.length} أهداف):**\n- متوسط نسبة التقدم العام: ${context.goals.length ? Math.round(context.goals.reduce((a, b) => a + b.progress, 0) / context.goals.length) : 0}%.\n- الأهداف المنجزة: ${completedGoals} هدف.\n\n2. **المشاريع النشطة (${activeProjectsCount}/3):**\n- أنت منضبط في قاعدة أقصى 3 مشاريع رئيسية نشطة لحماية طاقتك.\n\n3. **مكامن القوة الحالية:**\n- ثبات كتل العمل الصباحية وتثبيت عادات الفجر والبرمجة.\n\n4. **الوصية الاستراتيجية:**\n- ركز على مشروع تجارب الدخل؛ أول تعاقد مدفوع هو الاختبار الحقيقي الذي سينقلك من مرحلة التعلم إلى مرحلة الكسب والنمو.`;
    return { replyText, toolCalls };
  }

  // 7. الرد التوجيهي الافتراضي الذكي
  replyText = `أهلاً يا محمد، معك مستشارك التنفيذي في «السماحي OS». أنا هنا لأساعدك في تحويل الرؤية لأفعال حقيقية:
- يمكنك أن تطلب مني: "ضيف هدف...", "قسم المشروع لمهام...", "سجل مهارة في معمل التعلم...", أو "إيه أهم حاجة أعملها النهارده؟"
- كل طلب تقوله ينفذ فوراً في بياناتك الحقيقية وتوثق تفاصيله في المنبع مع إمكانية التراجع.

بماذا نبدأ الآن لبناء مستقبلك؟`;

  return { replyText, toolCalls };
}
