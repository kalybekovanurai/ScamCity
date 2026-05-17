import type { Scenario, Theme } from "../../types";

interface AnswerPanelProps {
  theme: Theme;
  scenario: Scenario;
  selectedOption: string | null;
  isCorrect: boolean | null;
  onSelect: (id: string) => void;
}

export const AnswerPanel = ({ theme, scenario, selectedOption, isCorrect, onSelect }: AnswerPanelProps) => (
  <aside className={`rounded-[30px] border p-5 shadow-sm lg:sticky lg:top-24 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
    <div className="mb-5">
      <h4 className="text-xl font-black tracking-tight">Что безопаснее сделать?</h4>
      <p className="mt-1 text-sm text-slate-500">Выберите один вариант. После ответа появится объяснение.</p>
    </div>

    <div className="space-y-3">
      {scenario.options.map((option, idx) => {
        const selected = selectedOption === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            disabled={isCorrect !== null}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
              selected
                ? option.isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-rose-500 bg-rose-50 text-rose-900"
                : isCorrect !== null
                  ? "border-slate-100 opacity-50"
                  : theme === "dark"
                    ? "border-slate-800 hover:border-violet-500 hover:bg-slate-800"
                    : "border-slate-100 hover:border-violet-300 hover:bg-violet-50/50"
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${selected ? option.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"}`}>
              {["A", "B", "C", "D"][idx]}
            </div>
            <span className="text-base font-bold leading-snug">{option.text}</span>
          </button>
        );
      })}
    </div>
  </aside>
);

