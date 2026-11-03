/**
 * server.ts
 * الخادم الخلفي المتكامل (Full-Stack Express + Vite)
 * يوفر مسار Gemini API الآمن لتحليل إنتاجية محمد السماحي
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { processAssistantMessage } from './server/assistantEngine.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// مسار المساعد الذكي لمحمد السماحي (SAMAHY OS Intelligent Life Assistant)
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    const result = await processAssistantMessage(message, history || [], context || {});
    return res.json(result);
  } catch (error: any) {
    console.error('Assistant API Error:', error);
    return res.status(500).json({
      replyText: 'عذراً يا محمد، حدث خطأ تقني أثناء معالجة طلبك، لكن يمكنك إعادة المحاولة وسأنفذ الإجراء فوراً.',
      toolCalls: [],
      error: error.message,
    });
  }
});

// مسار تحليل سجل الإنتاجية اليومي عبر Gemini API
app.post('/api/analyze-productivity', async (req: Request, res: Response) => {
  try {
    const {
      todayDate,
      focusTasks,
      timeLogs,
      plannedVsActual,
      dailyScore,
      habitsStatus,
      userManualNotes,
    } = req.body;

    // صياغة البيانات التنفيذية لسجل اليوم
    const tasksSummary = Array.isArray(focusTasks) && focusTasks.length > 0
      ? focusTasks
          .map(
            (t: any, idx: number) =>
              `${idx + 1}. [${t.status === 'completed' ? 'منجزة ✓' : 'قيد التنفيذ'}] ${t.title} (${t.lifeArea}) — المخطط: ${t.estimatedMinutes} دقيقة، الفعلي: ${t.actualMinutes || t.estimatedMinutes || 30} دقيقة.`
          )
          .join('\n')
      : 'لم يتم تحديد مهام تركيز اليوم بعد.';

    const timeSummary = Array.isArray(timeLogs) && timeLogs.length > 0
      ? timeLogs
          .map(
            (l: any) =>
              `- ${l.category}: ${l.durationMinutes} دقيقة (${l.isDeepWork ? 'عمل عميق Deep Work' : 'مهام عامة'}) — ${l.description || 'بدون وصف'}`
          )
          .join('\n')
      : 'لا توجد جلسات عمل مسجلة بالمؤقت اليوم.';

    const plannedHours = plannedVsActual?.plannedHours ?? 0;
    const actualHours = plannedVsActual?.actualHours ?? 0;
    const accuracy = plannedVsActual?.accuracy ?? 100;
    const habitsDone = habitsStatus?.done ?? 0;
    const habitsTotal = habitsStatus?.total ?? 0;

    const prompt = `أنت المستشار التنفيذي الشخصي الحكيم لمحمد السماحي في نظامه "السماحي OS".
السياق العام: سنة 2027 هي "سنة البناء" (Build → Learn → Apply → Earn → Scale). الشعار: "أبني نفسي، أتعلم، أعمل، أتاجر بما يرضي الله، وأزرع اليوم ما أريد حصاده غداً".
القواعد الأساسية لمحمد: أقصى 3 مهام تركيز يومية، حماية ساعات العمل العميق الصباحية، مكافحة التشتت، والاقتراب العملي من أول عميل وتحقيق الدخل بالقيمة الحقيقية.

إليك سجل يوم ${todayDate || 'اليوم'}:
1. مهام التركيز الثلاثية:
${tasksSummary}

2. سجل الوقت الفعلي:
${timeSummary}

3. المقارنة الزمنية ودقة التقدير:
- الوقت المخطط: ${plannedHours} ساعة
- الوقت الفعلي المنفذ: ${actualHours} ساعة
- دقة التقدير الزمني: ${accuracy}%
- مؤشر إنجاز اليوم العام: ${dailyScore || 75}%
- العادات المنجزة: ${habitsDone} من ${habitsTotal}

${userManualNotes ? `ملاحظات وانطباع محمد الشخصي: "${userManualNotes}"` : ''}

المطلوب:
اكتب تقريراً نصياً يومياً مكثفاً ومباشراً لمحمد السماحي بدون حشو إنشائي، مقسماً إلى ثلاثة أقسام دقيقة:
🌟 أولاً: نقاط القوة والإنجاز الحقيقي اليوم (أبرز ما حققه محمد على أرض الواقع والتزامه بالبناء).
⚠️ ثانياً: مجالات التحسين ونقاط الهدر/التشتت (كن صريحاً جداً وبناءً: أين ذهب الوقت الضائع أو التردد؟).
🎯 ثالثاً: التوجيه والقرار العملي الحاسم للغد (خطوة واحدة استراتيجية يجب أن يبدأ بها محمد صباح الغد فوراً).

اجعل النبرة رفيعة، مشجعة، وعملية، وتخاطب محمد السماحي مباشرة باسمه.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // رد بديل استرشادي غني في حال عدم وجود المفتاح لضمان عدم توقف النظام
      return res.json({
        report: `🌟 **نقاط القوة والإنجاز اليوم:**\n- نجحت يا محمد في التركيز على المهام الاستراتيجية الصباحية وحماية وقت العمل العميق.\n- بلغت دقة التقدير الزمني لديك ${accuracy}%، وهو مؤشر قوي على وعيك الزمني الواقعي.\n\n⚠️ **مجالات التحسين:**\n- احذر من المماطلة في تسليم المهام بعد الظهر؛ إنهاء المهمة بنسبة 80% وطرحها خير من البحث عن الكمال الزائف.\n- تجنب فتح أكثر من جبهة عمل في نفس الساعة.\n\n🎯 **التوجيه العملي للغد:**\n- ابدأ غداً بكتلة عمل عميق غير قابلة للتفاوض لمدة 90 دقيقة في أول مهمة استراتيجية قبل فتح أي وسيلة تواصل.`,
        isFallback: true,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const reportText = response.text || 'تم فحص السجل بنجاح.';
    res.json({ report: reportText, isFallback: false });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // إرجاع رسالة واضحة مع تحليل تحوطي
    res.json({
      report: `🌟 **نقاط القوة والإنجاز:**\n- تم تسجيل الساعات الاستثمارية بنجاح ومتابعة المهام في نظام السماحي OS.\n\n⚠️ **مجالات التحسين:**\n- راقب الفارق بين الساعات المخططة والفعلية واحرص على تسجيل فترات الاستراحة بدقة.\n\n🎯 **قرار الغد:**\n- ثبت أهم 3 نتائج ليوم الغد من الليلة، وركز طاقتك على المهمة الأولى فقط.`,
      isFallback: true,
      error: error.message,
    });
  }
});

// تهيئة خادم Vite في وضع التطوير أو تقديم الملفات في الإنتاج
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`السماحي OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
