import { useEffect, useMemo, useState } from "react";
import type { AnswersByType, CategoryProgress, Theme } from "../types";
import {
  createEmptyAnswers,
  createEmptyProgress,
  getAccuracy,
  getCurrentLevelLabel,
  getRank,
  getTotalCompletedLevels,
} from "../utils/progress";
import { clearGameData, loadGameData, saveGameData } from "./storage";

export const usePlayerProgress = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [xp, setXp] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>(() => createEmptyProgress());
  const [answers, setAnswers] = useState<AnswersByType>(() => createEmptyAnswers());
  const [masteredQuestions, setMasteredQuestions] = useState<string[]>([]);

  const currentLevel = getCurrentLevelLabel(categoryProgress);
  const totalCompletedLevels = getTotalCompletedLevels(categoryProgress);
  const accuracy = getAccuracy(answers);

  const stats = useMemo(
    () => ({
      scenariosSolved: (Object.values(answers) as { total: number }[]).reduce((total, item) => total + item.total, 0),
      rank: getRank(totalCompletedLevels),
      integrity: Math.min(100, 55 + totalCompletedLevels + Math.round(accuracy / 3)),
      correctPercent: accuracy,
      totalPoints: xp,
    }),
    [accuracy, answers, totalCompletedLevels, xp],
  );

  useEffect(() => {
    const saved = loadGameData();
    if (!saved) return;

    setXp(saved.xp);
    setTheme(saved.theme);
    setAnswers(saved.answers);
    setCategoryProgress(saved.categoryProgress);
    setMasteredQuestions(saved.masteredQuestions);
  }, []);

  const persistGame = (
    nextXp = xp,
    nextAnswers = answers,
    nextTheme = theme,
    nextCategoryProgress = categoryProgress,
    nextMasteredQuestions = masteredQuestions,
  ) => {
    saveGameData({
      xp: nextXp,
      answers: nextAnswers,
      theme: nextTheme,
      categoryProgress: nextCategoryProgress,
      masteredQuestions: nextMasteredQuestions,
    });
  };

  const resetProgress = () => {
    const emptyProgress = createEmptyProgress();
    const emptyAnswers = createEmptyAnswers();

    setXp(0);
    setCategoryProgress(emptyProgress);
    setAnswers(emptyAnswers);
    setMasteredQuestions([]);
    clearGameData();
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    persistGame(xp, answers, nextTheme, categoryProgress, masteredQuestions);
  };

  return {
    accuracy,
    answers,
    categoryProgress,
    currentLevel,
    masteredQuestions,
    persistGame,
    resetProgress,
    setAnswers,
    setCategoryProgress,
    setMasteredQuestions,
    setXp,
    stats,
    theme,
    toggleTheme,
    totalCompletedLevels,
    xp,
  };
};
