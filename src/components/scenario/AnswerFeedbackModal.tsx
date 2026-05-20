import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import type { SubmitAnswerResponse } from "../../modules/answers";
import type { Scenario, Theme } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface AnswerFeedbackModalProps {
  theme: Theme;
  scenario: Scenario;
  isCorrect: boolean | null;
  selectedOption: string | null;
  answerFeedback: SubmitAnswerResponse | null;
  isLastQuestion: boolean;
  onNext: () => void;
}

export const AnswerFeedbackModal = ({
  theme,
  scenario,
  isCorrect,
  selectedOption,
  answerFeedback,
  isLastQuestion,
  onNext,
}: AnswerFeedbackModalProps) => {
  const selectedOptionFeedback = scenario.options.find((option) => option.id === selectedOption)?.feedback;
  const serverFeedbackForCurrentAnswer =
    answerFeedback?.scenarioId === scenario.id && answerFeedback.optionId === selectedOption ? answerFeedback : null;
  const correct = serverFeedbackForCurrentAnswer?.isCorrect ?? isCorrect;
  const feedback = serverFeedbackForCurrentAnswer?.feedback ?? selectedOptionFeedback;
  const explanation = serverFeedbackForCurrentAnswer?.explanation ?? scenario.explanation;

  return (
    <Modal open={isCorrect !== null} theme={theme} className="max-w-lg p-6 text-center md:p-8">
      <div
        className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl ${correct ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
      >
        {correct ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
      </div>
      <h4 className="mb-3 text-2xl font-black">{correct ? "Верно" : "Почти"}</h4>
      <p
        className={`mb-4 rounded-2xl p-4 text-base font-semibold leading-relaxed ${theme === "dark" ? "bg-slate-800 text-slate-100" : "bg-slate-50 text-slate-700"}`}
      >
        {feedback}
      </p>
      <p className="mb-4 text-sm leading-relaxed text-slate-500">{explanation}</p>

      {serverFeedbackForCurrentAnswer?.xpAwarded ? (
        <p className="mb-5 text-sm font-black text-emerald-600">+{serverFeedbackForCurrentAnswer.xpAwarded} XP</p>
      ) : null}

      <div className={`mb-6 rounded-2xl p-4 text-left ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-violet-50 text-violet-900"}`}>
        <p className="text-sm font-bold">Разбор появится в конце миссии.</p>
        <p className="mt-1 text-sm opacity-75">Мы получим аналитику по вашим ответам и подскажем, на что обращать внимание.</p>
      </div>

      <Button onClick={onNext} fullWidth>
        <ShieldCheck className="h-5 w-5" />
        {isLastQuestion ? "Завершить миссию" : "Следующий вопрос"}
      </Button>
    </Modal>
  );
};
