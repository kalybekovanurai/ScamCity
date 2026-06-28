import type { AnswersByType, CategoryProgress, Theme } from "../types";
import { getConfiguredDataSourceMode } from "../data/dataSource";
import { initialMockProgress, mockStorage, resetMockData } from "../data/mockStorage";
import { createEmptyAnswers, normalizeProgress } from "../utils/progress";

const STORAGE_KEY = "scam-city-data";
const isBrowser = typeof window !== "undefined";

export interface SavedGameData {
  xp: number;
  answers: AnswersByType;
  theme: Theme;
  categoryProgress: CategoryProgress;
  masteredQuestions: string[];
}

const normalizeSavedData = (parsed: Partial<SavedGameData>): SavedGameData => ({
  xp: parsed.xp || 0,
  answers: { ...createEmptyAnswers(), ...(parsed.answers || {}) },
  theme: parsed.theme || "light",
  categoryProgress: normalizeProgress(parsed.categoryProgress),
  masteredQuestions: Array.isArray(parsed.masteredQuestions) ? parsed.masteredQuestions : [],
});

const getInitialDemoProgress = (): SavedGameData => {
  const progress = mockStorage.getProgress();
  return normalizeSavedData(progress || initialMockProgress);
};

const shouldUseInitialMockProgress = () => getConfiguredDataSourceMode() !== "api";

export const loadGameData = (): SavedGameData | null => {
  if (!isBrowser) return shouldUseInitialMockProgress() ? getInitialDemoProgress() : null;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return shouldUseInitialMockProgress() ? getInitialDemoProgress() : null;

  try {
    return normalizeSavedData(JSON.parse(saved));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return shouldUseInitialMockProgress() ? getInitialDemoProgress() : null;
  }
};

export const saveGameData = (data: SavedGameData) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  if (getConfiguredDataSourceMode() !== "api") {
    mockStorage.setProgress(data);
  }
};

export const clearGameData = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(STORAGE_KEY);

  if (getConfiguredDataSourceMode() !== "api") {
    resetMockData();
  }
};
