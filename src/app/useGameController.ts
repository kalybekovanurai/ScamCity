import { useEffect, useMemo, useRef, useState } from "react";
import { APP_ROUTES, type AppRouteId } from "./router";
import { clearGameData, loadGameData, saveGameData } from "./storage";
import { SCENARIOS } from "../data/scenarios";
import type { AnswersByType, CategoryProgress, Scenario, SessionResult, Theme } from "../types";
import {
  createEmptyAnswers,
  createEmptyProgress,
  getAccuracy,
  getCurrentLevelLabel,
  getRank,
  getTotalCompletedLevels,
  markSubLevelCompleted,
  updateAnswerStats,
} from "../utils/progress";

const QUESTION_XP = 10;
const LESSON_XP = 80;

export const useGameController = () => {
  const [gameState, setGameState] = useState<AppRouteId>(APP_ROUTES.lobby.id);
  const [theme, setTheme] = useState<Theme>("light");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>(() => createEmptyProgress());
  const [answers, setAnswers] = useState<AnswersByType>(() => createEmptyAnswers());
  const [masteredQuestions, setMasteredQuestions] = useState<string[]>([]);

  const [currentLevelSession, setCurrentLevelSession] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const sessionResultsRef = useRef<SessionResult[]>([]);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<string | null>(null);

  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleLevelReset = () => {
    if (!confirm("Вы уверены, что хотите сбросить весь прогресс?")) return;

    const emptyProgress = createEmptyProgress();
    const emptyAnswers = createEmptyAnswers();
    setXp(0);
    setCategoryProgress(emptyProgress);
    setAnswers(emptyAnswers);
    setMasteredQuestions([]);
    clearGameData();
    setGameState(APP_ROUTES.lobby.id);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    persistGame(xp, answers, nextTheme, categoryProgress, masteredQuestions);
  };

  const startScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowSessionSummary(false);
    setGameState(APP_ROUTES.scenario.id);
  };

  const startLevelSession = (level: number, subLevel: number) => {
    const scenarios = SCENARIOS.filter((scenario) => scenario.level === level && scenario.subLevel === subLevel);
    if (scenarios.length === 0) return;

    setCurrentLevelSession(scenarios);
    setCurrentScenarioIndex(0);
    setSessionResults([]);
    sessionResultsRef.current = [];
    setSessionFeedback(null);
    setShowSessionSummary(false);
    startScenario(scenarios[0]);
  };

  const analyzeSession = async (results: SessionResult[]) => {
    if (results.length === 0) return;
    setIsAnalyzing(true);

    try {
      const wrongResults = results.filter((result) => !result.correct);
      const feedback =
        wrongResults.length === 0
          ? "Отлично: все ответы верные. Вы проверяли источник, не поддавались срочности и выбирали безопасный способ подтверждения."
          : `Ошибок: ${wrongResults.length}. Обратите внимание на: ${wrongResults
              .map((result) => result.title.replace(/: урок .*/, ""))
              .join(", ")}. В похожих ситуациях сначала проверяйте адрес сайта, отправителя и официальный канал связи.`;

      setSessionFeedback(feedback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completeSessionIfNeeded = (results: SessionResult[]) => {
    const session = currentLevelSession[0];
    if (results.length === 0 || !session) {
      persistGame(xp, answers, theme, categoryProgress, masteredQuestions);
      return;
    }

    const alreadyCompleted = categoryProgress[session.level]?.includes(session.subLevel);
    const nextProgress = markSubLevelCompleted(categoryProgress, session.level, session.subLevel);
    const nextXp = alreadyCompleted ? xp : xp + LESSON_XP;

    setCategoryProgress(nextProgress);
    setXp(nextXp);
    persistGame(nextXp, answers, theme, nextProgress, masteredQuestions);
  };

  const handleNextInSession = () => {
    const nextIndex = currentScenarioIndex + 1;
    if (nextIndex < currentLevelSession.length) {
      setCurrentScenarioIndex(nextIndex);
      startScenario(currentLevelSession[nextIndex]);
      return;
    }

    const finalResults = sessionResultsRef.current;
    completeSessionIfNeeded(finalResults);
    setIsCorrect(null);
    setSelectedOption(null);
    setShowSessionSummary(true);
    analyzeSession(finalResults);
  };

  const handleOptionSelect = (optionId: string) => {
    if (isCorrect !== null || !currentScenario) return;

    const option = currentScenario.options.find((item) => item.id === optionId);
    const correctOption = currentScenario.options.find((item) => item.isCorrect);
    if (!option || !correctOption) return;

    const nextAnswers = updateAnswerStats(answers, currentScenario.type, option.isCorrect);
    const isFirstCorrect = option.isCorrect && !masteredQuestions.includes(currentScenario.id);
    const nextMasteredQuestions = isFirstCorrect ? [...masteredQuestions, currentScenario.id] : masteredQuestions;
    const nextXp = xp + (isFirstCorrect ? QUESTION_XP : 0);
    const nextResults = [
      ...sessionResults,
      {
        id: currentScenario.id,
        title: currentScenario.title,
        correct: option.isCorrect,
        selectedText: option.text,
        correctText: correctOption.text,
        explanation: currentScenario.explanation,
      },
    ];

    setSelectedOption(optionId);
    setIsCorrect(option.isCorrect);
    setAnswers(nextAnswers);
    setMasteredQuestions(nextMasteredQuestions);
    setXp(nextXp);
    sessionResultsRef.current = nextResults;
    setSessionResults(nextResults);
    persistGame(nextXp, nextAnswers, theme, categoryProgress, nextMasteredQuestions);
  };

  const closeSessionSummary = () => {
    const finishedCategory = currentLevelSession[0]?.level ?? activeCategory;
    setShowSessionSummary(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setCurrentScenario(null);
    setCurrentLevelSession([]);
    setGameState(APP_ROUTES.levels.id);
    setActiveCategory(finishedCategory);
  };

  return {
    activeCategory,
    answers,
    categoryProgress,
    closeSessionSummary,
    currentLevel,
    currentLevelSession,
    currentScenario,
    currentScenarioIndex,
    gameState,
    handleLevelReset,
    handleNextInSession,
    handleOptionSelect,
    isAnalyzing,
    isCorrect,
    selectedOption,
    sessionFeedback,
    sessionResults,
    setActiveCategory,
    setGameState,
    setShowSettings,
    showSessionSummary,
    showSettings,
    startLevelSession,
    stats,
    theme,
    toggleTheme,
    xp,
  };
};
