import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import type { SubmitAnswerResponse } from "../../modules/answers";
import type { Scenario, SessionResult, Theme } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface AnswerFeedbackModalProps {
  theme: Theme;
  scenario: Scenario;
  isCorrect: boolean | null;
  selectedOption: string | null;
  answerFeedback: SubmitAnswerResponse | null;
  isAdaptiveSession: boolean;
  isLastQuestion: boolean;
  sessionResults: SessionResult[];
  sessionFeedback: string | null;
  isSessionAnalyzed: boolean;
  isLoadingNext?: boolean;
  onNext: () => void;
  onBackToLevels: () => void;
}

export const AnswerFeedbackModal = ({
  theme,
  scenario,
  isCorrect,
  selectedOption,
  answerFeedback,
  isAdaptiveSession,
  isLastQuestion,
  sessionResults,
  sessionFeedback,
  isSessionAnalyzed,
  isLoadingNext = false,
  onNext,
  onBackToLevels,
}: AnswerFeedbackModalProps) => {
  const selectedOptionFeedback = scenario.options.find((option) => option.id === selectedOption)?.feedback;
  const serverFeedbackForCurrentAnswer =
    answerFeedback?.scenarioId === scenario.id && answerFeedback.optionId === selectedOption ? answerFeedback : null;
  const correct = serverFeedbackForCurrentAnswer?.isCorrect ?? isCorrect;
  const feedback = serverFeedbackForCurrentAnswer?.feedback ?? selectedOptionFeedback;
  const explanation = serverFeedbackForCurrentAnswer?.explanation ?? scenario.explanation;
  const correctCount = sessionResults.filter((result) => result.correct).length;
  const levelNumber = scenario.subLevel;
  const nextLabel = isAdaptiveSession ? "Следующая миссия" : isLastQuestion ? "Следующий уровень" : "Следующий вопрос";
  const modalSize = isLastQuestion
    ? "max-w-lg p-5 text-center sm:p-6 lg:max-w-2xl lg:p-6"
    : "max-w-lg p-6 text-center md:p-8";

  return (
    <Modal
      open={isCorrect !== null}
      theme={theme}
      className={modalSize}
      contentClassName={isLastQuestion ? "lg:max-h-none lg:overflow-visible" : ""}
    >
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl sm:h-20 sm:w-20 ${
          correct ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        }`}
      >
        {correct ? <CheckCircle2 className="h-9 w-9 sm:h-10 sm:w-10" /> : <XCircle className="h-9 w-9 sm:h-10 sm:w-10" />}
      </div>

      <h4 className="mb-3 text-2xl font-black">{correct ? "Верно" : "Почти"}</h4>

      {feedback ? (
        <p
          className={`mb-4 rounded-2xl p-3 text-sm font-semibold leading-relaxed sm:p-4 sm:text-base ${
            theme === "dark" ? "bg-slate-800 text-slate-100" : "bg-slate-50 text-slate-700"
          }`}
        >
          {feedback}
        </p>
      ) : null}

      {explanation ? <p className="mb-4 text-sm leading-relaxed text-slate-500">{explanation}</p> : null}

      {scenario.verificationMethods?.length ? (
        <div className={`mb-5 rounded-2xl p-4 text-left ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
          <p className="text-sm font-bold">Как проверить</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {scenario.verificationMethods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {isLastQuestion ? (
        <div
          className={`mb-5 grid gap-3 rounded-2xl p-4 text-left lg:grid-cols-[0.85fr_1.15fr] ${
            theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-violet-50 text-violet-900"
          }`}
        >
          <div>
            <p className="text-sm font-bold">Уровень {levelNumber} пройден</p>
            <p className="mt-1 text-sm opacity-80">
              Правильных ответов: {correctCount} из {sessionResults.length}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">AI-анализ</p>
            <p className="mt-1 text-sm leading-relaxed opacity-80">
              {isSessionAnalyzed ? sessionFeedback || "Анализ пока недоступен." : "Анализируем ответы..."}
            </p>
          </div>
        </div>
      ) : (
        <div className={`mb-5 rounded-2xl p-4 text-left ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-violet-50 text-violet-900"}`}>
          <p className="text-sm font-bold">
            {isAdaptiveSession ? "Следующая миссия подберется по вашим ответам." : "После ответа можно продолжить."}
          </p>
          <p className="mt-1 text-sm opacity-75">Мы учтем ваш выбор и подберем тренировку под моменты, где нужно больше практики.</p>
        </div>
      )}

      <div className={isLastQuestion ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
        {isLastQuestion ? (
          <Button onClick={onBackToLevels} fullWidth variant="ghost" disabled={isLoadingNext}>
            К уровням
          </Button>
        ) : null}
        <Button onClick={onNext} fullWidth disabled={isLoadingNext}>
          <ShieldCheck className="h-5 w-5" />
          {isLoadingNext ? "Загружаем..." : nextLabel}
        </Button>
      </div>
    </Modal>
  );
};
