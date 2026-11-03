/**
 * components/assistant/AssistantView.tsx
 * واجهة المساعد التنفيذي الذكي لنظام "السماحي OS — 2027 سنة البناء"
 * متصل مباشرة ببيانات التطبيق وAppContext لتنفيذ الأوامر الحقيقية
 * يدعم المحادثة بالعامية المصرية والفصحى، تنفيذ الإجراءات المباشرة،
 * وبطاقات تأكيد الحذف وتتبع المنبع مع التراجع التام.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistantMessage, AssistantActionItem, LifeArea, GoalQuarter } from '../../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Target,
  CheckSquare,
  Flame,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Trash2,
  RotateCcw,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'samahy_os_assistant_messages_v1';

export const AssistantView: React.FC = () => {
  const {
    state,
    setActiveTab,
    addTask,
    updateTask,
    deleteTask,
    setTaskTodayFocus,
    addGoal,
    updateGoal,
    deleteGoal,
    addProject,
    updateProject,
    deleteProject,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitToday,
    addLearningSkill,
    updateLearningSkill,
    addErrorLog,
    addIncomeExperiment,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading assistant messages:', e);
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `أهلاً يا محمد! معك مستشارك التنفيذي في «السماحي OS — 2027 سنة البناء».

أنا متصل مباشرة ببياناتك وأهدافك؛ لست مجرد شات دردشة، بل أنفذ ما تطلبه فوراً:
• **إدارة الأهداف والمشاريع:** "ضيف هدف لـ Q1 عن البرمجة"، "حول هدفي لمشروع بـ 3 مراحل".
• **التركيز والمهام:** "سجل مهمة بناء Prototype لتركيز اليوم (90 دقيقة)"، "إيه أهم حاجة أعملها دلوقتي؟"
• **العادات والروتين:** "سجل عادة صلاة الفجر حاضراً واربطها بهدفي"، "راجع التزامي اليوم".
• **التعلم والبزنس:** "سجل مهارة AI واربطها بمشروع حي"، "اقترح تجربة دخل سريعة".

أي إجراء ننفذه يسجل فوراً في قاعدة بياناتك والمنبع مع إمكانية مراجعته والتراجع عنه في أي وقت. بمَ نبدأ؟`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // حفظ المحادثة تلقائياً في التخزين المحلي
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }, [messages]);

  // التمرير التلقائي لأسفل المحادثة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // تجهيز ملخص حي للبيانات لإرساله كـ Context للخادم
  const currentAppContext = useMemo(() => {
    return {
      goals: state.goals.map((g) => ({
        id: g.id,
        title: g.title,
        quarter: g.quarter,
        progress: g.progress,
        lifeArea: g.lifeArea,
        status: g.status,
      })),
      projects: state.projects.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        progress: p.progress,
        lifeArea: p.lifeArea,
        milestonesCount: p.milestones?.length || 0,
      })),
      tasks: state.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        isTodayFocus: t.isTodayFocus,
        priority: t.priority,
        estimatedMinutes: t.estimatedMinutes,
        lifeArea: t.lifeArea,
      })),
      habits: state.habits.map((h) => ({
        id: h.id,
        title: h.title,
        frequency: h.frequency,
        streak: h.streak,
        completedToday: h.completedDates.includes(new Date().toISOString().split('T')[0]),
      })),
      skills: (state.skills || []).map((s) => ({
        id: s.id,
        name: s.name,
        targetProject: s.targetProject,
        masteryPercentage: s.masteryPercentage,
      })),
      incomeExperiments: state.incomeExperiments.map((e) => ({
        id: e.id,
        name: e.name,
        status: e.status,
        revenueEarned: e.revenueEarned,
      })),
    };
  }, [state]);

  // تنفيذ الأدوات محلياً بعد استلام الأوامر من الخادم
  const executeTools = (toolCalls: { name: string; args: any }[]): AssistantActionItem[] => {
    const executedActions: AssistantActionItem[] = [];

    for (const tool of toolCalls) {
      const { name, args } = tool;

      try {
        switch (name) {
          case 'create_goal': {
            const quarter = (args.quarter as GoalQuarter) || 'Q1';
            const lifeArea = (args.lifeArea as LifeArea) || 'البرمجة';
            addGoal({
              title: args.title,
              description: args.description || 'هدف استراتيجي لسنة البناء 2027.',
              year: args.year || 2027,
              quarter,
              quarterTheme: args.quarterTheme || (quarter === 'Q1' ? 'BUILD' : quarter === 'Q2' ? 'APPLY' : 'SCALE'),
              lifeArea,
              progress: 0,
              status: 'in_progress',
            });
            executedActions.push({
              type: 'goal',
              action: 'create',
              title: args.title,
              details: `تمت الإضافة في الربع ${quarter} · مجال ${lifeArea}`,
              data: { tab: 'goals' },
            });
            break;
          }

          case 'update_goal': {
            const existingGoal = state.goals.find((g) => g.id === args.goalId);
            if (existingGoal) {
              updateGoal({
                ...existingGoal,
                title: args.title || existingGoal.title,
                progress: args.progress !== undefined ? args.progress : existingGoal.progress,
                status: args.status || existingGoal.status,
                quarter: args.quarter || existingGoal.quarter,
              });
              executedActions.push({
                type: 'goal',
                action: 'update',
                id: args.goalId,
                title: args.title || existingGoal.title,
                details: `تم تحديث التقدم إلى ${args.progress ?? existingGoal.progress}%`,
                data: { tab: 'goals' },
              });
            }
            break;
          }

          case 'delete_goal': {
            const existingGoal = state.goals.find((g) => g.id === args.goalId);
            if (existingGoal) {
              deleteGoal(args.goalId);
              executedActions.push({
                type: 'goal',
                action: 'delete',
                id: args.goalId,
                title: existingGoal.title,
                details: 'تم الحذف ونقل النسخة إلى سلة المحذوفات',
                data: { tab: 'trash' },
              });
            }
            break;
          }

          case 'create_project': {
            const lifeArea = (args.lifeArea as LifeArea) || 'التجارة';
            const milestones = Array.isArray(args.milestones)
              ? args.milestones.map((m: string, idx: number) => ({
                  id: `ms-${Date.now()}-${idx}`,
                  title: typeof m === 'string' ? m : String(m),
                  completed: false,
                }))
              : [];

            addProject({
              title: args.title,
              description: args.description || 'مشروع تنفيذي مباشر لتحقيق أهداف 2027.',
              lifeArea,
              linkedGoalId: args.linkedGoalId,
              status: args.status || 'active',
              milestones,
              targetDate: args.targetDate || '2027-03-31',
            });

            executedActions.push({
              type: 'project',
              action: 'create',
              title: args.title,
              details: `مشروع نشط (${milestones.length} محطات تنفيذية) · ${lifeArea}`,
              data: { tab: 'projects' },
            });
            break;
          }

          case 'update_project': {
            const existingProject = state.projects.find((p) => p.id === args.projectId);
            if (existingProject) {
              updateProject({
                ...existingProject,
                title: args.title || existingProject.title,
                status: args.status || existingProject.status,
                progress: args.progress !== undefined ? args.progress : existingProject.progress,
                targetDate: args.targetDate || existingProject.targetDate,
              });
              executedActions.push({
                type: 'project',
                action: 'update',
                id: args.projectId,
                title: args.title || existingProject.title,
                details: `تم تحديث الحالة: ${args.status || existingProject.status}`,
                data: { tab: 'projects' },
              });
            }
            break;
          }

          case 'delete_project': {
            const existing = state.projects.find((p) => p.id === args.projectId);
            if (existing) {
              deleteProject(args.projectId);
              executedActions.push({
                type: 'project',
                action: 'delete',
                id: args.projectId,
                title: existing.title,
                details: 'تم النقل لسلة المحذوفات مع حفظ المحطات',
                data: { tab: 'trash' },
              });
            }
            break;
          }

          case 'create_task': {
            const lifeArea = (args.lifeArea as LifeArea) || 'البرمجة';
            const created = addTask({
              title: args.title,
              lifeArea,
              estimatedMinutes: args.estimatedMinutes || 30,
              priority: args.priority || 'normal',
              isTodayFocus: !!args.isTodayFocus,
              status: 'todo',
              linkedGoalId: args.linkedGoalId,
              linkedProjectId: args.linkedProjectId,
            });

            executedActions.push({
              type: 'task',
              action: 'create',
              id: created?.id,
              title: args.title,
              details: `${args.estimatedMinutes || 30} دقيقة · ${args.priority === 'strategic' ? 'أولوية استراتيجية' : 'عالية'}${args.isTodayFocus ? ' · ضمن تركيز اليوم 🎯' : ''}`,
              data: { tab: args.isTodayFocus ? 'today' : 'dashboard', taskId: created?.id },
            });
            break;
          }

          case 'update_task': {
            const existing = state.tasks.find((t) => t.id === args.taskId);
            if (existing) {
              updateTask({
                ...existing,
                title: args.title || existing.title,
                status: args.status || existing.status,
                estimatedMinutes: args.estimatedMinutes || existing.estimatedMinutes,
                priority: args.priority || existing.priority,
              });
              executedActions.push({
                type: 'task',
                action: 'update',
                id: args.taskId,
                title: args.title || existing.title,
                details: `تحديث الحالة إلى: ${args.status || existing.status}`,
                data: { tab: 'today' },
              });
            }
            break;
          }

          case 'set_focus_task': {
            const existing = state.tasks.find((t) => t.id === args.taskId);
            if (existing) {
              setTaskTodayFocus(args.taskId, !!args.isFocus);
              executedActions.push({
                type: 'task',
                action: 'update',
                id: args.taskId,
                title: existing.title,
                details: args.isFocus ? 'تمت إضافتها لأهم 3 مهام لتركيز اليوم' : 'تمت إزالتها من تركيز اليوم',
                data: { tab: 'today' },
              });
            }
            break;
          }

          case 'delete_task': {
            const existing = state.tasks.find((t) => t.id === args.taskId);
            if (existing) {
              deleteTask(args.taskId);
              executedActions.push({
                type: 'task',
                action: 'delete',
                id: args.taskId,
                title: existing.title,
                details: 'تم الحذف ونقل النسخة إلى سلة المحذوفات',
                data: { tab: 'trash' },
              });
            }
            break;
          }

          case 'create_habit': {
            const lifeArea = (args.lifeArea as LifeArea) || 'التطوير الشخصي';
            addHabit({
              title: args.title,
              lifeArea,
              frequency: args.frequency || 'daily',
              linkedGoalId: args.linkedGoalId,
            });
            executedActions.push({
              type: 'habit',
              action: 'create',
              title: args.title,
              details: `عادة ${args.frequency === 'weekly' ? 'أسبوعية' : 'يومية'} في مجال ${lifeArea}`,
              data: { tab: 'habits' },
            });
            break;
          }

          case 'update_habit': {
            const existing = state.habits.find((h) => h.id === args.habitId);
            if (existing) {
              if (args.isCompletedToday !== undefined) {
                toggleHabitToday(args.habitId);
              }
              updateHabit({
                ...existing,
                title: args.title || existing.title,
                frequency: args.frequency || existing.frequency,
              });
              executedActions.push({
                type: 'habit',
                action: 'update',
                id: args.habitId,
                title: args.title || existing.title,
                details: 'تم تحديث بيانات العادة وسجل الاستمرارية',
                data: { tab: 'habits' },
              });
            }
            break;
          }

          case 'delete_habit': {
            const existing = state.habits.find((h) => h.id === args.habitId);
            if (existing) {
              deleteHabit(args.habitId);
              executedActions.push({
                type: 'habit',
                action: 'delete',
                id: args.habitId,
                title: existing.title,
                details: 'تم حذف العادة والاحتفاظ بسجلها في السلة',
                data: { tab: 'trash' },
              });
            }
            break;
          }

          case 'create_learning_skill': {
            addLearningSkill({
              name: args.name,
              category: args.category || 'برمجة وذكاء اصطناعي',
              targetProject: args.targetProject || 'تطبيق عملي مباشر في مشروع حي',
              masteryPercentage: args.masteryPercentage || 15,
              hoursLogged: args.hoursLogged || 0,
              status: 'active',
              notes: 'أضيفت بواسطة المساعد الذكي مع الالتزام بالتطبيق الفوري',
              linkedGoalId: args.linkedGoalId,
              linkedProjectId: args.linkedProjectId,
            });
            executedActions.push({
              type: 'skill',
              action: 'create',
              title: args.name,
              details: `ربطت بالمشروع: ${args.targetProject || 'تطبيق عملي'} · ${args.category || 'برمجة'}`,
              data: { tab: 'learning' },
            });
            break;
          }

          case 'update_learning_skill': {
            const existing = (state.skills || []).find((s) => s.id === args.skillId);
            if (existing) {
              updateLearningSkill({
                ...existing,
                masteryPercentage: args.masteryPercentage ?? existing.masteryPercentage,
                hoursLogged: args.hoursLogged ?? existing.hoursLogged,
                status: args.status || existing.status,
              });
              executedActions.push({
                type: 'skill',
                action: 'update',
                id: args.skillId,
                title: existing.name,
                details: `تم تحديث الإتقان إلى ${args.masteryPercentage ?? existing.masteryPercentage}%`,
                data: { tab: 'learning' },
              });
            }
            break;
          }

          case 'create_income_experiment': {
            addIncomeExperiment({
              name: args.name,
              problem: args.problem || 'حاجة السوق إلى حل تقني سريع وقليل التعقيد.',
              targetClient: args.targetClient || 'أصحاب المتاجر والمشاريع المحلية.',
              requiredSkill: args.requiredSkill || 'تطوير صفحات الهبوط السريعة',
              requiredCapital: args.requiredCapital || 0,
              requiredTimeHours: args.requiredTimeHours || 20,
              monetizationSource: args.monetizationSource || 'باقات مدفوعة مقدماً',
              startDate: new Date().toISOString().split('T')[0],
              testDurationDays: args.testDurationDays || 14,
              targetClientsContacted: args.targetClientsContacted || 20,
              status: 'اختبار جاري (14 يوم)',
              learningsNotes: 'تم إطلاق التجربة عبر المساعد التنفيذي لاختبار الطلب الحقيقي.',
            });
            executedActions.push({
              type: 'experiment',
              action: 'create',
              title: args.name,
              details: `تجربة دخل جديدة (14 يوماً · استهداف ${args.targetClientsContacted || 20} عميل)`,
              data: { tab: 'business' },
            });
            break;
          }


          case 'log_error_lesson': {
            addErrorLog({
              title: args.title,
              category: args.category || 'برمجة وكود',
              severity: args.severity || 'medium',
              date: new Date().toISOString().split('T')[0],
              symptoms: args.symptoms || 'غير محددة',
              rootCause: args.rootCause || 'قيد التحليل',
              solution: args.solution || 'تم التوثيق عبر المساعد الذكي',
              preventionRule: args.preventionRule || 'مراجعة الكود والتوثيق قبل التشغيل',
              tags: Array.isArray(args.tags) ? args.tags : ['ai-logged'],
              isResolved: true,
            });
            executedActions.push({
              type: 'task',
              action: 'create',
              title: args.title,
              details: 'تم توثيق المشكلة في سجل الأخطاء والدروس المستفادة 🛡️',
              data: { tab: 'errors' },
            });
            break;
          }

          case 'link_items': {
            const { sourceType, sourceId, targetType, targetId } = args;
            if (sourceType === 'project' && targetType === 'goal') {
              const proj = state.projects.find((p) => p.id === sourceId);
              if (proj) {
                updateProject({ ...proj, linkedGoalId: targetId });
                executedActions.push({
                  type: 'project',
                  action: 'link',
                  title: proj.title,
                  details: 'تم ربط المشروع بالهدف المحدد بنجاح',
                  data: { tab: 'projects' },
                });
              }
            } else if (sourceType === 'task' && targetType === 'project') {
              const t = state.tasks.find((task) => task.id === sourceId);
              if (t) {
                updateTask({ ...t, linkedProjectId: targetId });
                executedActions.push({
                  type: 'task',
                  action: 'link',
                  title: t.title,
                  details: 'تم ربط المهمة بالمشروع التنفيذي',
                  data: { tab: 'projects' },
                });
              }
            } else if (sourceType === 'habit' && targetType === 'goal') {
              const h = state.habits.find((habit) => habit.id === sourceId);
              if (h) {
                updateHabit({ ...h, linkedGoalId: targetId });
                executedActions.push({
                  type: 'habit',
                  action: 'link',
                  title: h.title,
                  details: 'تم ربط العادة بالهدف الاستراتيجي',
                  data: { tab: 'habits' },
                });
              }
            }
            break;
          }

          default:
            console.log('Unhandled tool execution:', name, args);
        }
      } catch (err) {
        console.error(`Error executing tool ${name}:`, err);
      }
    }

    return executedActions;
  };

  // إرسال الرسالة للمساعد
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // إرسال الرسالة والسياق الحالي وسجل آخر 10 رسائل
      const chatHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          context: currentAppContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.replyText || 'تم استلام طلبك وتنفيذه.';
      const rawToolCalls = Array.isArray(data.toolCalls) ? data.toolCalls : [];

      // التحقق مما إذا كان هناك طلب تأكيد لحذف أو إجراء حساس
      const confirmationTool = rawToolCalls.find((t: any) => t.name === 'request_confirmation');
      const standardTools = rawToolCalls.filter((t: any) => t.name !== 'request_confirmation');

      // تنفيذ الأدوات القياسية مباشرة على بيانات التطبيق
      const executed = executeTools(standardTools);

      const assistantMessage: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        actionsExecuted: executed.length > 0 ? executed : undefined,
        pendingConfirmation: confirmationTool
          ? {
              actionType: confirmationTool.args.actionType,
              description: confirmationTool.args.description,
              payload: confirmationTool.args.payload,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content: 'أهلاً يا محمد، حدث انقطاع مؤقت في الاتصال، ولكن يمكنك الاستمرار في إعطائي الأوامر وسأقوم بتنفيذها وحفظها محلياً فوراً.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // تأكيد الإجراء الحساس (مثل الحذف)
  const handleConfirmAction = (msgId: string, pending: NonNullable<AssistantMessage['pendingConfirmation']>) => {
    try {
      const { actionType, payload } = pending;
      if (actionType === 'delete_goal' && payload?.goalId) {
        deleteGoal(payload.goalId);
      } else if (actionType === 'delete_project' && payload?.projectId) {
        deleteProject(payload.projectId);
      } else if (actionType === 'delete_task' && payload?.taskId) {
        deleteTask(payload.taskId);
      } else if (actionType === 'delete_habit' && payload?.habitId) {
        deleteHabit(payload.habitId);
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                pendingConfirmation: undefined,
                content: `${m.content}\n\n✅ **تم تأكيد وتنفيذ الإجراء بنجاح.**`,
              }
            : m
        )
      );
    } catch (e) {
      console.error('Error confirming action:', e);
    }
  };

  // إلغاء الإجراء الحساس
  const handleCancelAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              pendingConfirmation: undefined,
              content: `${m.content}\n\n❌ **تم إلغاء الإجراء بطلبك.**`,
            }
          : m
      )
    );
  };

  // مسح سجل المحادثة
  const handleClearHistory = () => {
    if (window.confirm('هل تريد مسح سجل المحادثة؟ (بياناتك ومهامك وأهدافك تظل محفوظة كما هي)')) {
      const initial: AssistantMessage[] = [
        {
          id: `msg-cleared-${Date.now()}`,
          role: 'assistant',
          content: 'تم تفريغ المحادثة يا محمد. أنا جاهز لأي خطوة جديدة.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // مقترحات أسئلة سريعة ذكية
  const quickPrompts = [
    { label: '🎯 إيه أهم حاجة أعملها النهارده؟', prompt: 'إيه أهم حاجة أعملها النهارده في تركيز اليوم؟' },
    { label: '🚀 ضيف هدف لـ Q1 وقسمه لمشروع', prompt: 'ضيف هدف استراتيجي لـ Q1 في البرمجة وقسمه لمشروع تنفيذي بـ 3 مراحل ومهام لليوم' },
    { label: '🔥 ضيف عادة برمجة صباحية', prompt: 'ضيف عادة جلسة برمجة وتطبيق عملي يومياً 90 دقيقة واربطها بهدفي' },
    { label: '📊 حلل موقفي وأهدافي الحالية', prompt: 'راجعلي موقفي وأهدافي الحالية وقولي أنا واقف فين وما هو المطلوب؟' },
    { label: '💼 اقترح تجربة دخل سريعة', prompt: 'اقترح تجربة دخل سريعة ومحددة أبدأ فيها خلال 14 يوماً مع 20 عميل' },
  ];

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] overflow-hidden shadow-2xl">
      {/* رأس شاشة المساعد */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 shadow-inner">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">المساعد التنفيذي الذكي</h1>
              <span className="rounded-full bg-[var(--accent-gold)]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
                2027 · سنة البناء
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              متصل ببياناتك الحية: {state.goals.length} أهداف · {state.projects.length} مشاريع · {state.tasks.length} مهام · {state.habits.length} عادات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-primary)] hover:text-red-400 transition"
            title="مسح سجل المحادثة فقط"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">مسح المحادثة</span>
          </button>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* أيقونة المستخدم أو المساعد */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold shadow-md ${
                  isUser
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : 'border-[var(--accent-gold)]/30 bg-[var(--surface-elevated)] text-[var(--accent-gold)]'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* بطاقة الرسالة */}
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tl-sm'
                    : 'border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-tr-sm shadow-lg'
                }`}
              >
                {/* محتوى النص */}
                <div className="whitespace-pre-wrap font-sans text-sm md:text-[14.5px]">
                  {msg.content}
                </div>

                {/* بطاقات الإجراءات المنفذة فعلياً */}
                {msg.actionsExecuted && msg.actionsExecuted.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-gold)]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>إجراءات نُفذت فوراً وحُفظت في بياناتك:</span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.actionsExecuted.map((action, idx) => {
                        let Icon = CheckSquare;
                        if (action.type === 'goal') Icon = Target;
                        else if (action.type === 'project') Icon = FolderGit2;
                        else if (action.type === 'habit') Icon = Flame;
                        else if (action.type === 'skill') Icon = GraduationCap;
                        else if (action.type === 'experiment') Icon = Briefcase;

                        return (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3.5 py-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <div className="font-semibold text-[var(--text-primary)]">
                                  {action.title}
                                </div>
                                {action.details && (
                                  <div className="text-[11px] text-[var(--text-muted)]">
                                    {action.details}
                                  </div>
                                )}
                              </div>
                            </div>

                            {action.data?.tab && (
                              <button
                                onClick={() => setActiveTab(action.data.tab)}
                                className="flex items-center gap-1 rounded-lg bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 hover:bg-[var(--accent-gold)]/15 transition"
                              >
                                <span>الانتقال للعنصر</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* بطاقة تأكيد إجراء حساس إذا طلب */}
                {msg.pendingConfirmation && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-bold mb-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span>تأكيد الإجراء الحساس:</span>
                    </div>
                    <p className="mb-3 text-[var(--text-secondary)]">
                      {msg.pendingConfirmation.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmAction(msg.id, msg.pendingConfirmation!)}
                        className="rounded-lg bg-amber-500 px-3 py-1.5 font-bold text-black hover:bg-amber-400 transition"
                      >
                        نعم، نفّذ الآن
                      </button>
                      <button
                        onClick={() => handleCancelAction(msg.id)}
                        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* وقت الإرسال */}
                <div
                  className={`mt-2 text-[10px] ${
                    isUser ? 'text-blue-200 text-left' : 'text-[var(--text-muted)] text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* حالة التفكير والتنفيذ */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--surface-elevated)] text-[var(--accent-gold)] shadow-md">
              <Sparkles className="h-4 w-4 animate-spin text-[var(--accent-gold)]" />
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-xs text-[var(--text-secondary)] shadow-md flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[var(--accent-gold)] animate-ping" />
              <span>المساعد يحلل بياناتك وينفذ الإجراءات في نظامك...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* شريط المقترحات السريعة */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]/60 px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1">
            <Zap className="h-3 w-3 text-[var(--accent-gold)]" />
            أوامر سريعة:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              disabled={isLoading}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-gold)]/50 hover:text-[var(--text-primary)] transition disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* حقل الإدخال وزر الإرسال */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 md:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب طلبك... (مثال: أضف مهمة برمجة في تركيز اليوم، أو أنشئ هدف Q2 مع مشروع وتاسكات)"
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none transition"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-gold)] text-black font-bold shadow-lg transition hover:bg-[var(--accent-gold)]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            title="إرسال"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
          الأوامر تنفذ فوراً في بياناتك الحقيقية وتوثق في «المنبع» مع إمكانية التراجع الكامل.
        </div>
      </div>
    </div>
  );
};
