import { LEVELS_PER_CATEGORY } from "../../config/levels";
import type { Category } from "../../modules/categories/types";
import type { AnswersByType, CategoryProgress, Theme } from "../../types";
import { getCompletedCount } from "../../utils/progress";

interface CategoryProgressListProps {
  theme: Theme;
  categories: Category[];
  categoriesStatus: string;
  categoryProgress: CategoryProgress;
  answers: AnswersByType;
}

export const CategoryProgressList = ({
  theme,
  categories,
  categoriesStatus,
  categoryProgress,
  answers,
}: CategoryProgressListProps) => (
  <div className={`rounded-[24px] border p-5 shadow-sm sm:rounded-3xl sm:p-8 ${theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
    <h4 className="mb-6 text-lg font-black uppercase tracking-tighter sm:mb-8">Категории</h4>

    {categoriesStatus === "loading" && <p className="text-sm font-bold text-slate-500">Загружаем категории...</p>}
    {categoriesStatus === "failed" && categories.length === 0 && <p className="text-sm font-bold text-rose-500">Не удалось загрузить категории с сервера.</p>}

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
      {categories.map((category) => {
        const completed = getCompletedCount(categoryProgress, category.lvl);
        const typeStats = answers[category.type];
        const accuracy = typeStats.total === 0 ? 0 : Math.round((typeStats.correct / typeStats.total) * 100);

        return (
          <div key={category.lvl} className="flex min-w-0 items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black ${completed > 0 ? "bg-violet-600 text-white" : theme === "dark" ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-300"}`}>
              {completed}
            </div>
            <div className="min-w-0 flex-grow pt-0.5">
              <div className="flex items-center justify-between gap-3">
                <h5 className={`min-w-0 break-words text-xs font-black uppercase tracking-tight md:text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  {category.label}
                </h5>
                <span className="shrink-0 text-[10px] font-black text-slate-400">{accuracy}%</span>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 md:text-xs">
                {completed}/{LEVELS_PER_CATEGORY} уроков, {typeStats.total} ответов
              </p>
              <div className={`mt-3 h-2 overflow-hidden rounded-full ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                <div className="h-full bg-violet-600" style={{ width: `${(completed / LEVELS_PER_CATEGORY) * 100}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
