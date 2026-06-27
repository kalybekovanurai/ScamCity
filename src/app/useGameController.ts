import { useRef, useState } from "react";
import { useAppDispatch } from "./hooks";
import { APP_ROUTES, type AppRouteId } from "./router";
import { usePlayerProgress } from "./usePlayerProgress";
import { aiApi } from "../modules/ai";
import { analyticsApi } from "../modules/analytics";
import { submitAnswer } from "../modules/answers";
import { scenariosApi } from "../modules/scenarios";
import type { Scenario, SessionResult } from "../types";
import { markSubLevelCompleted, updateAnswerStats } from "../utils/progress";

const QUESTION_XP = 10;
const LESSON_XP = 80;
const AI_QUESTION_XP = 25;
const AI_LESSON_XP = 160;

type SessionSource = "regular" | "ai";

const isPlayableScenario = (scenario: Scenario) =>
  scenario.id.trim().length > 0 && scenario.options.length > 0 && scenario.title.trim().length > 0;

export const useGameController = () => {
  const dispatch = useAppDispatch();
  const player = usePlayerProgress();
  const [gameState, setGameState] = useState<AppRouteId>(APP_ROUTES.lobby.id);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubLevel, setActiveSubLevel] = useState<number | null>(null);
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

  const startGeneratedMission = async (
    level = activeCategory ?? player.currentLevel.level,
    subLevel = activeSubLevel ?? player.currentLevel.subLevel,
    source: SessionSource = "ai",
  ) => {
    setIsAnalyzing(true);
    setSessionError(null);
    setIsCorrect(null);
    setSelectedOption(null);

    try {
      const scenario = await aiApi.generateScenario();
      if (!isPlayableScenario(scenario)) {
        throw new Error("Generated scenario is incomplete");
      }

      prepareSession([{ ...scenario, level, subLevel }], source);
      return true;
    } catch {
      setSessionError("Не удалось открыть миссию. Попробуйте еще раз чуть позже.");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startDiagnosticSession = async (level: number, subLevel: number) => {
    setIsAnalyzing(true);
    setSessionError(null);
    setIsCorrect(null);
    setSelectedOption(null);

    try {
      const scenarios = await scenariosApi.getScenariosByLevel(level);
      const playableScenarios = scenarios
        .filter(isPlayableScenario)
        .map((scenario) => ({ ...scenario, level, subLevel }));

      if (playableScenarios.length === 0) {
        throw new Error("Diagnostic level has no playable scenarios");
      }

      prepareSession(playableScenarios, "regular");
      return true;
    } catch {
      setSessionError("Не удалось открыть диагностический уровень. Проверьте сервер и попробуйте еще раз.");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startChatbotSession = async () => {
    const started = await startGeneratedMission(player.currentLevel.level, player.currentLevel.subLevel, "ai");
    if (!started) {
      setGameState(APP_ROUTES.levels.id);
    }
  };

  const startLevelSession = async (level: number, subLevel: number) => {
    setActiveCategory(level);
    setActiveSubLevel(subLevel);

    if (subLevel === 1) {
      await startDiagnosticSession(level, subLevel);
      return;
    }

    await startGeneratedMission(level, subLevel, "ai");
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
      player.persistGame();
      return;
    }

    const sessionLevel = activeCategory ?? session.level;
    const sessionSubLevel = activeSubLevel ?? session.subLevel;
    const alreadyCompleted = player.categoryProgress[sessionLevel]?.includes(sessionSubLevel);
    const nextProgress = markSubLevelCompleted(player.categoryProgress, sessionLevel, sessionSubLevel);
    const lessonXp = currentSessionSource === "ai" ? AI_LESSON_XP : LESSON_XP;
    const nextXp = alreadyCompleted ? player.xp : player.xp + lessonXp;

    player.setCategoryProgress(nextProgress);
    player.setXp(nextXp);
    player.persistGame(nextXp, player.answers, player.theme, nextProgress, player.masteredQuestions);
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

    const nextLevel = activeCategory ?? player.currentLevel.level;
    const nextSubLevel = (activeSubLevel ?? player.currentLevel.subLevel) + 1;
    setActiveSubLevel(nextSubLevel);
    await startGeneratedMission(nextLevel, nextSubLevel, "ai");
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption !== null || !currentScenario) return;

    const option = currentScenario.options.find((item) => item.id === optionId);
    if (!option) return;

    const correctOption = currentScenario.options.find((item) => item.isCorrect) ?? option;
    const localIsCorrect = Boolean(option.isCorrect);
    const nextAnswers = updateAnswerStats(player.answers, currentScenario.type, localIsCorrect);
    const isFirstCorrect = localIsCorrect && !player.masteredQuestions.includes(currentScenario.id);
    const nextMasteredQuestions = isFirstCorrect ? [...player.masteredQuestions, currentScenario.id] : player.masteredQuestions;
    const questionXp = currentSessionSource === "ai" ? AI_QUESTION_XP : QUESTION_XP;
    const nextXp = player.xp + (isFirstCorrect ? questionXp : 0);
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
    player.setAnswers(nextAnswers);
    player.setMasteredQuestions(nextMasteredQuestions);
    player.setXp(nextXp);
    sessionResultsRef.current = nextResults;
    setSessionResults(nextResults);
    player.persistGame(nextXp, nextAnswers, player.theme, player.categoryProgress, nextMasteredQuestions);

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

  const handleLevelReset = () => {
    if (!confirm("Вы уверены, что хотите сбросить весь прогресс?")) return;

    player.resetProgress();
    setGameState(APP_ROUTES.lobby.id);
  };

  return {
    activeCategory,
    answers: player.answers,
    categoryProgress: player.categoryProgress,
    closeSessionSummary,
    currentLevel: player.currentLevel,
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
    stats: player.stats,
    theme: player.theme,
    toggleTheme: player.toggleTheme,
    xp: player.xp,
  };
};
