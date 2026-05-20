import type { Scenario, Theme } from "../../types";

interface AnswerPanelProps {
  theme: Theme;
  scenario: Scenario;
  selectedOption: string | null;
  isCorrect: boolean | null;
  onSelect: (id: string) => void;
}

export const AnswerPanel = ({ theme, scenario, selectedOption, isCorrect, onSelect }: AnswerPanelProps) => {
  const isAnswered = selectedOption !== null;

  return (
    <aside
      className={`rounded-[24px] border p-4 shadow-sm sm:rounded-[30px] sm:p-5 lg:sticky lg:top-24 ${
        theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-5">
        <h4 className="text-lg font-black tracking-tight sm:text-xl">Что безопаснее сделать?</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Выберите один вариант. После ответа появится объяснение.
        </p>
      </div>

      {scenario.options.length === 0 ? (
        <div className={`rounded-2xl border p-4 text-sm font-bold ${theme === "dark" ? "border-amber-900 bg-amber-950 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
          Сервер пока не прислал варианты ответа для этой миссии.
        </div>
      ) : (
        <div className="space-y-3">
          {scenario.options.map((option, idx) => {
            const selected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                disabled={isAnswered}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition sm:items-center sm:gap-4 sm:p-4 ${
                  selected
                    ? option.isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-rose-500 bg-rose-50 text-rose-900"
                    : isAnswered
                      ? "border-slate-100 opacity-50"
                      : theme === "dark"
                        ? "border-slate-800 hover:border-violet-500 hover:bg-slate-800"
                        : "border-slate-100 hover:border-violet-300 hover:bg-violet-50/50"
                } disabled:cursor-not-allowed`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black sm:h-10 sm:w-10 ${
                    selected ? (option.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white") : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {["A", "B", "C", "D"][idx] ?? idx + 1}
                </div>
                <span className="min-w-0 break-words text-sm font-bold leading-snug sm:text-base">{option.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
};
