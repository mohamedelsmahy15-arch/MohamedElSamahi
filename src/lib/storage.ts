/**
 * lib/storage.ts
 * طبقة التخزين المحلي (LocalStorage Layer) المحدثة
 * تضمن قراءة وكتابة ومزامنة كافة بيانات النظام بكل أمان
 */

import { AppState } from '../types';
import { INITIAL_SEED_DATA } from './seedData';

const STORAGE_KEY = 'elsamahy_os_v1_data';

export function loadAppState(): AppState {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      saveAppState(INITIAL_SEED_DATA);
      return INITIAL_SEED_DATA;
    }
    const parsed = JSON.parse(rawData);
    return {
      goals: parsed.goals || INITIAL_SEED_DATA.goals,
      projects: parsed.projects || INITIAL_SEED_DATA.projects,
      tasks: parsed.tasks || INITIAL_SEED_DATA.tasks,
      ideas: parsed.ideas || INITIAL_SEED_DATA.ideas,
      timeBlocks: parsed.timeBlocks || INITIAL_SEED_DATA.timeBlocks,
      habits: parsed.habits || INITIAL_SEED_DATA.habits,
      weeklyReviews: parsed.weeklyReviews || INITIAL_SEED_DATA.weeklyReviews,
      timeLogs: parsed.timeLogs || INITIAL_SEED_DATA.timeLogs,
      transactions: parsed.transactions || INITIAL_SEED_DATA.transactions,
      incomeExperiments: parsed.incomeExperiments || INITIAL_SEED_DATA.incomeExperiments,
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
