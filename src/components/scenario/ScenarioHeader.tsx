import { ArrowLeft } from "lucide-react";
import type { Theme } from "../../types";

interface ScenarioHeaderProps {
  theme: Theme;
  currentScenarioIndex: number;
  totalScenarios: number;
  onBack: () => void;
}

export const ScenarioHeader = ({
  theme,
  currentScenarioIndex,
  totalScenarios,
  onBack,
}: ScenarioHeaderProps) => (
  <div className={`mb-6 rounded-[28px] border p-4 shadow-sm md:p-5 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
          aria-label="Назад к миссиям"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-bold text-violet-600">Прогресс миссии</p>
          <h3 className={`text-xl font-black tracking-tight md:text-2xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            Вопрос {currentScenarioIndex + 1} из {totalScenarios}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalScenarios }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 flex-1 rounded-full md:w-14 ${i < currentScenarioIndex ? "bg-emerald-500" : i === currentScenarioIndex ? "bg-violet-500" : theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  </div>
);
