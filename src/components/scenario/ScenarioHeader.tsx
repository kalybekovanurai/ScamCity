import { ArrowLeft } from "lucide-react";
import type { Theme } from "../../types";

interface ScenarioHeaderProps {
  theme: Theme;
  level: number;
  currentScenarioIndex: number;
  totalScenarios: number;
  onBack: () => void;
}

export const ScenarioHeader = ({
  theme,
  level,
  currentScenarioIndex,
  totalScenarios,
  onBack,
}: ScenarioHeaderProps) => (
  <div
    className={`mb-4 rounded-[24px] border p-4 shadow-sm sm:mb-6 sm:rounded-[28px] md:p-5 ${
      theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
    }`}
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition sm:h-12 sm:w-12 ${
            theme === "dark"
              ? "border-slate-700 bg-slate-800 text-slate-300"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
          aria-label="Назад к миссиям"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-bold text-violet-600 sm:text-sm">Уровень {level}</p>
          <h3 className={`truncate text-lg font-black tracking-tight sm:text-xl md:text-2xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            Вопрос {currentScenarioIndex + 1} из {totalScenarios}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(1.75rem,1fr))] gap-2 md:flex md:min-w-56 md:items-center">
        {Array.from({ length: totalScenarios }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full md:w-14 ${
              i < currentScenarioIndex ? "bg-emerald-500" : i === currentScenarioIndex ? "bg-violet-500" : theme === "dark" ? "bg-slate-800" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);
