import React from "react";
import { motion } from "motion/react";
import { APP_ROUTES } from "../app/router";
import { useAppSelector } from "../app/hooks";
import { selectLastAnswerSubmission } from "../modules/answers";
import type { Scenario, SessionResult, Theme } from "../types";
import { AnswerFeedbackModal } from "./scenario/AnswerFeedbackModal";
import { AnswerPanel } from "./scenario/AnswerPanel";
import { ScenarioContentCard } from "./scenario/ScenarioContentCard";
import { ScenarioHeader } from "./scenario/ScenarioHeader";

interface ScenarioViewProps {
  theme: Theme;
  currentScenario: Scenario;
  currentScenarioIndex: number;
  totalScenarios: number;
  isCorrect: boolean | null;
  selectedOption: string | null;
  sessionResults: SessionResult[];
  sessionFeedback: string | null;
  isSessionAnalyzed: boolean;
  handleOptionSelect: (id: string) => void;
  handleNextInSession: () => void;
  handleBackToLevels: () => void;
  setGameState: (state: any) => void;
  isAdaptiveSession: boolean;
  isLoadingNext?: boolean;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  theme,
  currentScenario,
  currentScenarioIndex,
  totalScenarios,
  isCorrect,
  selectedOption,
  sessionResults,
  sessionFeedback,
  isSessionAnalyzed,
  handleOptionSelect,
  handleNextInSession,
  handleBackToLevels,
  setGameState,
  isAdaptiveSession,
  isLoadingNext = false,
}) => {
  const answerFeedback = useAppSelector(selectLastAnswerSubmission);

  return (
    <motion.div
      key="scenario"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-auto w-full max-w-6xl"
    >
      <ScenarioHeader
        theme={theme}
        level={currentScenario.subLevel}
        currentScenarioIndex={currentScenarioIndex}
        totalScenarios={totalScenarios}
        onBack={() => setGameState(APP_ROUTES.levels.id)}
      />

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <ScenarioContentCard theme={theme} scenario={currentScenario} />
        <AnswerPanel
          theme={theme}
          scenario={currentScenario}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          onSelect={handleOptionSelect}
        />
      </div>

      <AnswerFeedbackModal
        theme={theme}
        scenario={currentScenario}
        isCorrect={isCorrect}
        selectedOption={selectedOption}
        answerFeedback={answerFeedback}
        isAdaptiveSession={isAdaptiveSession}
        isLastQuestion={currentScenarioIndex >= totalScenarios - 1}
        sessionResults={sessionResults}
        sessionFeedback={sessionFeedback}
        isSessionAnalyzed={isSessionAnalyzed}
        isLoadingNext={isLoadingNext}
        onNext={handleNextInSession}
        onBackToLevels={handleBackToLevels}
      />
    </motion.div>
  );
};
