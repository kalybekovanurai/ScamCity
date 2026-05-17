import { ArrowLeft } from "lucide-react";
import { LEVELS_PER_CATEGORY } from "../../data/categories";
import type { Theme } from "../../types";

interface MissionHeaderProps {
  theme: Theme;
  title: string;
  activeCategory: number | null;
  completedInActive: number;
  onBack: () => void;
}

export const MissionHeader = ({
  theme,
  title,
  activeCategory,
  completedInActive,
  onBack,
}: MissionHeaderProps) => (
  <div className={`rounded-[28px] border p-4 shadow-sm sm:p-5 md:p-6 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition sm:h-12 sm:w-12 ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
          aria-label="Назад"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h3 className="truncate text-2xl font-black tracking-tight md:text-3xl">{title}</h3>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
            {activeCategory ? "Проходите уроки по порядку. Ошиблись? Урок можно повторить." : "Выберите тему, с которой хотите потренироваться."}
          </p>
        </div>
      </div>
      {activeCategory && (
        <div className={`w-fit rounded-2xl px-4 py-3 text-sm font-black ${theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-violet-50 text-violet-700"}`}>
          {completedInActive}/{LEVELS_PER_CATEGORY} уроков
        </div>
      )}
    </div>
  </div>
);

