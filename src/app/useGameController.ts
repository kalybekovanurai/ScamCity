import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "./hooks";
import { APP_ROUTES, type AppRouteId } from "./router";
import { clearGameData, loadGameData, saveGameData } from "./storage";
import { aiApi } from "../modules/ai";
import { analyticsApi } from "../modules/analytics";
import { submitAnswer } from "../modules/answers";
import { scenariosApi } from "../modules/scenarios";
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
const AI_QUESTION_XP = 25;
const AI_LESSON_XP = 160;

type SessionSource = "regular" | "ai";

const isPlayableScenario = (scenario: Scenario) =>
  scenario.id.trim().length > 0 && scenario.options.length > 0 && scenario.title.trim().length > 0;

export const useGameController = () => {
  const dispatch = useAppDispatch();
  const [gameState, setGameState] = useState<AppRouteId>(APP_ROUTES.lobby.id);
  const [theme, setTheme] = useState<Theme>("light");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubLevel, setActiveSubLevel] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>(() => createEmptyProgress());
  const [answers, setAnswers] = useState<AnswersByType>(() => createEmptyAnswers());
  const [masteredQuestions, setMasteredQuestions] = useState<string[]>([]);

  const [currentLevelSession, setCurrentLevelSession] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentSessionSource, setCurrentSessionSource] = useState<SessionSource>("regular");
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const sessionResultsRef = useRef<SessionResult[]>([]);
  const answerSubmitPromisesRef = useRef<Promise<unknown>[]>([]);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<string | null>(null);
  const [isSessionAnalyzed, setIsSessionAnalyzed] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

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

  const prepareSession = (scenarios: Scenario[], source: SessionSource) => {
    setCurrentLevelSession(scenarios);
    setCurrentSessionSource(source);
    setCurrentScenarioIndex(0);
    setSessionResults([]);
    sessionResultsRef.current = [];
    answerSubmitPromisesRef.current = [];
    setSessionFeedback(null);
    setIsSessionAnalyzed(false);
    setShowSessionSummary(false);
    startScenario(scenarios[0]);
  };

  const startAdaptiveMission = async (
    level = activeCategory ?? currentLevel.level,
    subLevel = activeSubLevel ?? currentLevel.subLevel,
  ) => {
    setIsAnalyzing(true);
    setSessionError(null);
    setIsCorrect(null);
    setSelectedOption(null);

    try {
      const scenario = await aiApi.generateScenario();
      if (!isPlayableScenario(scenario)) {
        throw new Error("Adaptive scenario is incomplete");
      }

      prepareSession([{ ...scenario, level, subLevel }], "ai");
      return true;
    } catch {
      setSessionError("Не удалось открыть адаптивную миссию. Попробуйте еще раз чуть позже.");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startChatbotSession = async () => {
    const started = await startAdaptiveMission(currentLevel.level, currentLevel.subLevel);
    if (!started) {
      setGameState(APP_ROUTES.levels.id);
    }
  };

  const startLevelSession = async (level: number, subLevel: number) => {
    setActiveCategory(level);
    setActiveSubLevel(subLevel);

    if (subLevel > 1) {
      await startAdaptiveMission(level, subLevel);
      return;
    }

    try {
      setSessionError(null);
      const levelScenarios = (await scenariosApi.getScenariosByLevel(level)).filter(isPlayableScenario);
      const exactSubLevelScenarios = levelScenarios.filter((scenario) => scenario.subLevel === subLevel);
      const scenarios = exactSubLevelScenarios.length > 0 ? exactSubLevelScenarios : levelScenarios;

      if (scenarios.length === 0) {
        setSessionError("Для первого уровня пока нет вопросов на сервере.");
        return;
      }

      prepareSession(scenarios.map((scenario) => ({ ...scenario, level, subLevel })), "regular");
    } catch {
      setSessionError("Не удалось загрузить вопросы первого уровня с сервера.");
    }
  };

  const analyzeSession = async (results: SessionResult[]) => {
    if (results.length === 0) return;
    setIsAnalyzing(true);
    setIsSessionAnalyzed(false);

    try {
      await Promise.allSettled(answerSubmitPromisesRef.current);
      const analytics = await analyticsApi.getMyAnalytics();
      setSessionFeedback(analytics.feedback || "Сервер пока не вернул анализ по этой миссии.");
    } catch {
      setSessionFeedback("Не удалось получить анализ с сервера. Попробуйте открыть результат позже.");
    } finally {
      setIsSessionAnalyzed(true);
      setIsAnalyzing(false);
    }
  };

  const completeSessionIfNeeded = (results: SessionResult[]) => {
    const session = currentLevelSession[0];
    if (results.length === 0 || !session) {
      persistGame(xp, answers, theme, categoryProgress, masteredQuestions);
      return;
    }

    const sessionLevel = activeCategory ?? session.level;
    const sessionSubLevel = activeSubLevel ?? session.subLevel;
    const alreadyCompleted = categoryProgress[sessionLevel]?.includes(sessionSubLevel);
    const nextProgress = markSubLevelCompleted(categoryProgress, sessionLevel, sessionSubLevel);
    const lessonXp = currentSessionSource === "ai" ? AI_LESSON_XP : LESSON_XP;
    const nextXp = alreadyCompleted ? xp : xp + lessonXp;

    setCategoryProgress(nextProgress);
    setXp(nextXp);
    persistGame(nextXp, answers, theme, nextProgress, masteredQuestions);
  };

  const handleNextInSession = async () => {
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
    await Promise.allSettled(answerSubmitPromisesRef.current);

    const nextLevel = activeCategory ?? currentLevel.level;
    const nextSubLevel = (activeSubLevel ?? currentLevel.subLevel) + 1;
    setActiveSubLevel(nextSubLevel);
    await startAdaptiveMission(nextLevel, nextSubLevel);
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption !== null || !currentScenario) return;

    const option = currentScenario.options.find((item) => item.id === optionId);
    if (!option) return;

    const correctOption = currentScenario.options.find((item) => item.isCorrect) ?? option;
    const localIsCorrect = Boolean(option.isCorrect);
    const nextAnswers = updateAnswerStats(answers, currentScenario.type, localIsCorrect);
    const isFirstCorrect = localIsCorrect && !masteredQuestions.includes(currentScenario.id);
    const nextMasteredQuestions = isFirstCorrect ? [...masteredQuestions, currentScenario.id] : masteredQuestions;
    const questionXp = currentSessionSource === "ai" ? AI_QUESTION_XP : QUESTION_XP;
    const nextXp = xp + (isFirstCorrect ? questionXp : 0);
    const nextResults = [
      ...sessionResults,
      {
        id: currentScenario.id,
        title: currentScenario.title,
        correct: localIsCorrect,
        selectedText: option.text,
        correctText: correctOption.text,
        explanation: currentScenario.explanation,
      },
    ];

    setSelectedOption(optionId);
    setIsCorrect(localIsCorrect);
    setAnswers(nextAnswers);
    setMasteredQuestions(nextMasteredQuestions);
    setXp(nextXp);
    sessionResultsRef.current = nextResults;
    setSessionResults(nextResults);
    persistGame(nextXp, nextAnswers, theme, categoryProgress, nextMasteredQuestions);

    const submitPromise = dispatch(
      submitAnswer({
        scenarioId: currentScenario.id,
        optionId,
        timeSpent: 12,
      }),
    )
      .unwrap()
      .catch(() => undefined);
    answerSubmitPromisesRef.current = [...answerSubmitPromisesRef.current, submitPromise];

    const isLastQuestion = currentScenarioIndex >= currentLevelSession.length - 1;
    if (isLastQuestion) {
      void analyzeSession(nextResults);
    }
  };

  const closeSessionSummary = () => {
    const finishedCategory = currentLevelSession[0]?.level ?? activeCategory;
    const isLastQuestion = currentScenarioIndex >= currentLevelSession.length - 1;
    if (selectedOption !== null && isLastQuestion) {
      completeSessionIfNeeded(sessionResultsRef.current);
    }
    setShowSessionSummary(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setCurrentScenario(null);
    setCurrentLevelSession([]);
    setActiveCategory(finishedCategory);
    setGameState(APP_ROUTES.levels.id);
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
    currentSessionSource,
    gameState,
    handleLevelReset,
    handleNextInSession,
    handleOptionSelect,
    isAnalyzing,
    isSessionAnalyzed,
    isCorrect,
    selectedOption,
    sessionFeedback,
    sessionError,
    sessionResults,
    setActiveCategory,
    setGameState,
    setShowSettings,
    showSessionSummary,
    showSettings,
    startLevelSession,
    startChatbotSession,
    stats,
    theme,
    toggleTheme,
    xp,
  };
};
