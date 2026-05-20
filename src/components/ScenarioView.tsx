import React from "react";
import { motion } from "motion/react";
import { APP_ROUTES } from "../app/router";
import { useAppSelector } from "../app/hooks";
import { selectLastAnswerSubmission } from "../modules/answers";
import type { Scenario, Theme } from "../types";
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
  handleOptionSelect: (id: string) => void;
  handleNextInSession: () => void;
  setGameState: (state: any) => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  theme,
  currentScenario,
  currentScenarioIndex,
  totalScenarios,
  isCorrect,
  selectedOption,
  handleOptionSelect,
  handleNextInSession,
  setGameState,
}) => {
  const answerFeedback = useAppSelector(selectLastAnswerSubmission);

  return (
    <motion.div
      key="scenario"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-auto max-w-6xl"
    >
      <ScenarioHeader
        theme={theme}
        currentScenarioIndex={currentScenarioIndex}
        totalScenarios={totalScenarios}
        onBack={() => setGameState(APP_ROUTES.levels.id)}
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
        isLastQuestion={currentScenarioIndex >= totalScenarios - 1}
        onNext={handleNextInSession}
      />
    </motion.div>
  );
};
