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

type SessionSource = "regular" | "ai";

const isPlayableScenario = (scenario: Scenario) =>
  scenario.id.trim().length > 0 && scenario.options.length > 0 && scenario.title.trim().length > 0;

export const useGameController = () => {
  const dispatch = useAppDispatch();
  const [gameState, setGameState] = useState<AppRouteId>(APP_ROUTES.lobby.id);
  const [theme, setTheme] = useState<Theme>("light");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
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
    setShowSessionSummary(false);
    startScenario(scenarios[0]);
  };

  const startAiSession = async (level: number, subLevel: number, showError = true) => {
    setIsAnalyzing(true);
    setSessionError(null);

    try {
      const scenario = await aiApi.generateScenario();
      if (!isPlayableScenario(scenario)) {
        throw new Error("AI scenario is incomplete");
      }
      prepareSession([{ ...scenario, level, subLevel }], "ai");
      return true;
    } catch {
      if (showError) {
        setSessionError("Не удалось сгенерировать AI-миссию. Попробуйте открыть следующий урок чуть позже.");
      }
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startLevelSession = async (level: number, subLevel: number) => {
    if (subLevel > 1) {
      const startedAiSession = await startAiSession(level, subLevel);
      if (startedAiSession) return;

      try {
        const fallbackScenarios = (await scenariosApi.getScenariosByLevel(subLevel)).filter(isPlayableScenario);
        if (fallbackScenarios.length === 0) {
          setSessionError("Для этого урока пока нет вопросов на сервере.");
          return;
        }
        prepareSession(fallbackScenarios.map((scenario) => ({ ...scenario, level, subLevel })), "regular");
      } catch {
        setSessionError("Не удалось загрузить вопросы для следующего урока.");
      }
      return;
    }

    try {
      setSessionError(null);
      const levelScenarios = (await scenariosApi.getScenariosByLevel(level)).filter(isPlayableScenario);
      const exactSubLevelScenarios = levelScenarios.filter((scenario) => scenario.subLevel === subLevel);
      const scenarios = exactSubLevelScenarios.length > 0 ? exactSubLevelScenarios : levelScenarios;
      if (scenarios.length === 0) {
        setSessionError("Для этого урока пока нет вопросов на сервере.");
        return;
      }

      prepareSession(scenarios.map((scenario) => ({ ...scenario, level, subLevel })), "regular");
    } catch {
      setSessionError("Не удалось загрузить вопросы с сервера. Проверьте, что API запущен.");
    }
  };

  const analyzeSession = async (results: SessionResult[]) => {
    if (results.length === 0) return;
    setIsAnalyzing(true);

    try {
      await Promise.allSettled(answerSubmitPromisesRef.current);
      const analytics = await analyticsApi.getMyAnalytics();
      setSessionFeedback(analytics.feedback || "Сервер пока не вернул анализ по этой миссии.");
    } catch {
      setSessionFeedback("Не удалось получить анализ с сервера. Попробуйте открыть результат позже.");
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

  const handleNextInSession = async () => {
    const nextIndex = currentScenarioIndex + 1;
    if (nextIndex < currentLevelSession.length) {
      setCurrentScenarioIndex(nextIndex);
      startScenario(currentLevelSession[nextIndex]);
      return;
    }

    const finalResults = sessionResultsRef.current;
    const finishedSession = currentLevelSession[0];
    completeSessionIfNeeded(finalResults);
    setIsCorrect(null);
    setSelectedOption(null);

    setShowSessionSummary(true);
    analyzeSession(finalResults);
  };

  const handleOptionSelect = (optionId: string) => {
    if (isCorrect !== null || !currentScenario) return;

    const option = currentScenario.options.find((item) => item.id === optionId);
    if (!option) return;

    const correctOption = currentScenario.options.find((item) => item.isCorrect) ?? option;
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

    const submitPromise = dispatch(
      submitAnswer({
        scenarioId: currentScenario.id,
        optionId,
        timeSpent: 15,
      }),
    )
      .unwrap()
      .catch(() => undefined);
    answerSubmitPromisesRef.current = [...answerSubmitPromisesRef.current, submitPromise];
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
    sessionError,
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
