import type { AnswersByType, CategoryProgress, Theme } from "../types";
import { createEmptyAnswers, normalizeProgress } from "../utils/progress";

const STORAGE_KEY = "scam-city-data";

export interface SavedGameData {
  xp: number;
  answers: AnswersByType;
  theme: Theme;
  categoryProgress: CategoryProgress;
  masteredQuestions: string[];
}

export const loadGameData = (): SavedGameData | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    return {
      xp: parsed.xp || 0,
      answers: { ...createEmptyAnswers(), ...(parsed.answers || {}) },
      theme: parsed.theme || "light",
      categoryProgress: normalizeProgress(parsed.categoryProgress),
      masteredQuestions: Array.isArray(parsed.masteredQuestions) ? parsed.masteredQuestions : [],
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveGameData = (data: SavedGameData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearGameData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

