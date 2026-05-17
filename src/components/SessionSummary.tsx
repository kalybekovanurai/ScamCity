import React from "react";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { SessionResult, Theme } from "../types";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

interface SessionSummaryProps {
  theme: Theme;
  showSessionSummary: boolean;
  sessionResults: SessionResult[];
  isAnalyzing: boolean;
  sessionFeedback: string | null;
  onClose: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  theme,
  showSessionSummary,
  sessionResults,
  isAnalyzing,
  sessionFeedback,
  onClose,
}) => {
  const correctCount = sessionResults.filter((result) => result.correct).length;
  const wrongResults = sessionResults.filter((result) => !result.correct);
  const allCorrect = sessionResults.length > 0 && correctCount === sessionResults.length;

  return (
    <Modal open={showSessionSummary} theme={theme} className="max-w-2xl" zIndex="z-[120]">
      <div className={`px-6 py-7 md:px-8 ${allCorrect ? "bg-emerald-600" : "bg-amber-500"} text-white`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold opacity-85">
              {allCorrect ? "Урок засчитан" : "Урок можно повторить"}
            </p>
            <h4 className="text-2xl md:text-3xl font-black tracking-tight">Миссия завершена</h4>
          </div>
          <div className="flex gap-2">
            {sessionResults.map((result, i) => (
              <div key={i} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/25">
                {result.correct ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        <div className={`rounded-3xl border p-5 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h5 className="text-lg font-black">Итог урока</h5>
              <p className="text-sm text-slate-500">Правильных ответов: {correctCount} из {sessionResults.length}</p>
            </div>
            <div className={`rounded-2xl px-4 py-2 text-sm font-black ${allCorrect ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {allCorrect ? "Отлично" : "Повторить"}
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 text-sm font-semibold text-slate-500">
              <RotateCcw className="h-5 w-5 animate-spin text-violet-500" />
              Анализируем ответы...
            </div>
          ) : (
            <p className={`rounded-2xl p-4 text-base font-semibold leading-relaxed ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-700"}`}>
              {sessionFeedback}
            </p>
          )}
        </div>

        {wrongResults.length > 0 && (
          <div className={`rounded-3xl border p-5 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h5 className="mb-4 text-lg font-black">На что обратить внимание</h5>
            <div className="space-y-3">
              {wrongResults.map((result) => (
                <div key={result.id} className={`rounded-2xl p-4 ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}>
                  <p className="font-black">{result.title}</p>
                  <p className="mt-2 text-sm text-slate-500">Ваш ответ: {result.selectedText}</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600">Безопаснее: {result.correctText}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{result.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onClose} fullWidth>
          Вернуться к уровням
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Modal>
  );
};

