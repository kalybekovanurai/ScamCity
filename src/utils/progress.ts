import { CATEGORY_LEVELS, LEVELS_PER_CATEGORY } from "../config/levels";
import type { AnswersByType, CategoryProgress, ScenarioType } from "../types";

export const createEmptyProgress = (): CategoryProgress =>
  Object.fromEntries(CATEGORY_LEVELS.map((level) => [level, []]));

export const createEmptyAnswers = (): AnswersByType => ({
  phishing: { correct: 0, total: 0 },
  social_engineering: { correct: 0, total: 0 },
  infobiz: { correct: 0, total: 0 },
  ai_deepfake: { correct: 0, total: 0 },
  darkweb: { correct: 0, total: 0 },
});

export const normalizeProgress = (raw: unknown): CategoryProgress => {
  const base = createEmptyProgress();
  if (!raw || typeof raw !== "object") return base;

  for (const level of CATEGORY_LEVELS) {
    const value = (raw as Record<string, unknown>)[String(level)] ?? (raw as Record<number, unknown>)[level];
    if (!Array.isArray(value)) continue;

    base[level] = value
      .filter((level): level is number => Number.isInteger(level) && level >= 1 && level <= LEVELS_PER_CATEGORY)
      .filter((level, index, list) => list.indexOf(level) === index)
      .sort((a, b) => a - b);
  }

  return base;
};

export const getCompletedCount = (progress: CategoryProgress, categoryLevel: number) =>
  progress[categoryLevel]?.length ?? 0;

export const isCategoryUnlocked = (progress: CategoryProgress, categoryLevel: number) => {
  if (categoryLevel === 1) return true;
  return getCompletedCount(progress, categoryLevel - 1) >= LEVELS_PER_CATEGORY;
};

export const isSubLevelCompleted = (
  progress: CategoryProgress,
  categoryLevel: number,
  subLevel: number,
) => progress[categoryLevel]?.includes(subLevel) ?? false;

export const getNextSubLevel = (progress: CategoryProgress, categoryLevel: number) => {
  for (let subLevel = 1; subLevel <= LEVELS_PER_CATEGORY; subLevel += 1) {
    if (!isSubLevelCompleted(progress, categoryLevel, subLevel)) return subLevel;
  }
  return LEVELS_PER_CATEGORY;
};

export const isSubLevelUnlocked = (
  progress: CategoryProgress,
  categoryLevel: number,
  subLevel: number,
) => {
  if (!isCategoryUnlocked(progress, categoryLevel)) return false;
  if (isSubLevelCompleted(progress, categoryLevel, subLevel)) return true;
  return subLevel === getNextSubLevel(progress, categoryLevel);
};

export const markSubLevelCompleted = (
  progress: CategoryProgress,
  categoryLevel: number,
  subLevel: number,
) => {
  const next = normalizeProgress(progress);
  if (!next[categoryLevel].includes(subLevel)) {
    next[categoryLevel] = [...next[categoryLevel], subLevel].sort((a, b) => a - b);
  }
  return next;
};

export const getTotalCompletedLevels = (progress: CategoryProgress) =>
  CATEGORY_LEVELS.reduce((total, level) => total + getCompletedCount(progress, level), 0);

export const getCurrentLevelLabel = (progress: CategoryProgress) => {
  const level = CATEGORY_LEVELS.find((item) => isCategoryUnlocked(progress, item) && getCompletedCount(progress, item) < LEVELS_PER_CATEGORY)
    ?? CATEGORY_LEVELS[CATEGORY_LEVELS.length - 1];
  return {
    level,
    subLevel: getNextSubLevel(progress, level),
  };
};

export const getRank = (completedLevels: number) => {
  if (completedLevels >= 45) return "Легенда сетевой безопасности";
  if (completedLevels >= 35) return "Мастер расследований";
  if (completedLevels >= 25) return "AI-аналитик";
  if (completedLevels >= 12) return "Следопыт";
  return "Новичок";
};

export const getAccuracy = (answers: AnswersByType) => {
  const totals = Object.values(answers).reduce(
    (sum, item) => ({ correct: sum.correct + item.correct, total: sum.total + item.total }),
    { correct: 0, total: 0 },
  );
  return totals.total === 0 ? 0 : Math.round((totals.correct / totals.total) * 100);
};

export const updateAnswerStats = (
  answers: AnswersByType,
  type: ScenarioType,
  isCorrect: boolean,
) => ({
  ...answers,
  [type]: {
    correct: answers[type].correct + (isCorrect ? 1 : 0),
    total: answers[type].total + 1,
  },
});
