/**
 * lib/storage.ts
 * طبقة التخزين المحلي (LocalStorage Layer) المحدثة
 * تضمن قراءة وكتابة ومزامنة كافة بيانات النظام بكل أمان
 */

import { AppState } from '../types';
import { INITIAL_SEED_DATA } from './seedData';

const STORAGE_KEY = 'elsamahy_os_v1_data';

export const CLEAN_SLATE_DATA: AppState = {
  goals: [],
  projects: [],
  tasks: [],
  ideas: [],
  timeBlocks: [],
  habits: [
    {
      id: 'habit-fajr',
      title: 'صلاة الفجر وبداية اليوم بهدوء وذكر',
      lifeArea: 'الدين',
      frequency: 'daily',
      targetTime: '05:30',
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 'habit-deepwork',
      title: 'جلسة تعلم وتطبيق عملي حقيقي (Deep Work)',
      lifeArea: 'البرمجة',
      frequency: 'daily',
      targetTime: '10:00',
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 'habit-night-prep',
      title: 'التحضير المسائي لمهام الغد وإضافة الروابط قبل النوم',
      lifeArea: 'المشروع',
      frequency: 'daily',
      targetTime: '23:00',
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    },
  ],
  weeklyReviews: [],
  timeLogs: [],
  transactions: [],
  incomeExperiments: [],
  trashItems: [],
  dailyReports: [],
  actionHistory: [],
  skills: [],
  errorLogs: [],
};

export function resetAppStateToCleanSlate(): AppState {
  try {
    saveAppState(CLEAN_SLATE_DATA);
    return CLEAN_SLATE_DATA;
  } catch (error) {
    console.error('فشل بدء الصفحة البيضاء:', error);
    return CLEAN_SLATE_DATA;
  }
}

export function loadAppState(): AppState {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      saveAppState(INITIAL_SEED_DATA);
      return INITIAL_SEED_DATA;
    }
    const parsed = JSON.parse(rawData);
    return {
      goals: Array.isArray(parsed.goals) ? parsed.goals : INITIAL_SEED_DATA.goals,
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_SEED_DATA.projects,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : INITIAL_SEED_DATA.tasks,
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : INITIAL_SEED_DATA.ideas,
      timeBlocks: Array.isArray(parsed.timeBlocks) ? parsed.timeBlocks : INITIAL_SEED_DATA.timeBlocks,
      habits: Array.isArray(parsed.habits) ? parsed.habits : INITIAL_SEED_DATA.habits,
      weeklyReviews: Array.isArray(parsed.weeklyReviews) ? parsed.weeklyReviews : INITIAL_SEED_DATA.weeklyReviews,
      timeLogs: Array.isArray(parsed.timeLogs) ? parsed.timeLogs : INITIAL_SEED_DATA.timeLogs,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_SEED_DATA.transactions,
      incomeExperiments: Array.isArray(parsed.incomeExperiments) ? parsed.incomeExperiments : INITIAL_SEED_DATA.incomeExperiments,
      trashItems: Array.isArray(parsed.trashItems) ? parsed.trashItems : [],
      dailyReports: Array.isArray(parsed.dailyReports) ? parsed.dailyReports : [],
      actionHistory: Array.isArray(parsed.actionHistory) ? parsed.actionHistory : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      errorLogs: Array.isArray(parsed.errorLogs) ? parsed.errorLogs : [],
      lastReviewDate: parsed.lastReviewDate,
    };
  } catch (error) {
    console.error('حدث خطأ أثناء قراءة البيانات من LocalStorage:', error);
    return INITIAL_SEED_DATA;
  }
}

export function saveAppState(state: AppState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ البيانات في LocalStorage:', error);
    return false;
  }
}

export function resetAppStateToSeed(): AppState {
  try {
    saveAppState(INITIAL_SEED_DATA);
    return INITIAL_SEED_DATA;
  } catch (error) {
    console.error('فشل إعادة ضبط البيانات:', error);
    return INITIAL_SEED_DATA;
  }
}

export function exportAppStateAsJSON(state: AppState): void {
  try {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(state, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `elsamahy-os-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (error) {
    console.error('فشل تصدير البيانات:', error);
  }
}

export function importAppStateFromJSON(jsonText: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed.goals || !parsed.projects || !parsed.tasks) {
      throw new Error('ملف البيانات غير مطابق لبنية السماحي OS');
    }
    saveAppState(parsed);
    return parsed;
  } catch (error) {
    console.error('فشل استيراد البيانات:', error);
    return null;
  }
}
