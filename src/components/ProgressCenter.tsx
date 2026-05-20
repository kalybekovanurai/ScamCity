import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { LEVELS_PER_CATEGORY } from "../config/levels";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCategories, selectCategories, selectCategoriesStatus } from "../modules/categories";
import type { AnswersByType, CategoryProgress, Theme } from "../types";
import { getCompletedCount } from "../utils/progress";

interface ProgressCenterProps {
  theme: Theme;
  xp: number;
  currentLevel: { level: number; subLevel: number };
  categoryProgress: CategoryProgress;
  answers: AnswersByType;
  stats: any;
}

export const ProgressCenter: React.FC<ProgressCenterProps> = ({
  theme,
  xp,
  currentLevel,
  categoryProgress,
  answers,
  stats,
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      void dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <div className="flex flex-col items-center justify-between gap-6 px-2 md:flex-row">
        <h3 className="text-2xl font-black uppercase tracking-tight">Центр прогресса</h3>
        <div className={`rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-400"}`}>
          Статус: <span className="text-emerald-500">активен</span>
        </div>
      </div>

      <div className="mx-2 grid grid-cols-1 gap-4 md:mx-0 md:grid-cols-2">
        <div className={`relative flex flex-col items-center overflow-hidden rounded-3xl border p-10 text-center ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <span className={`mb-6 block text-[9px] font-black uppercase tracking-[0.3em] ${theme === "dark" ? "text-slate-500" : "text-slate-300"}`}>Индекс бдительности</span>
          <div className="relative mb-6 h-32 w-32">
            <svg className="h-full w-full -rotate-90">
              <circle cx="64" cy="64" r="58" className={`fill-none stroke-[10] ${theme === "dark" ? "stroke-slate-800" : "stroke-slate-100"}`} />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                className="fill-none stroke-violet-600 stroke-[10]"
                style={{ strokeDasharray: "364", strokeLinecap: "round" }}
                animate={{ strokeDashoffset: 364 - (stats.integrity / 100) * 364 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{stats.integrity}%</span>
              <span className="text-[9px] font-black uppercase text-slate-400">Secure</span>
            </div>
          </div>
          <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} max-w-[220px] text-xs font-medium leading-relaxed`}>
            Показатель растёт, когда вы проходите уроки и тренируете внимательность.
          </p>
        </div>

        <div className="relative space-y-6 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 p-6 opacity-5">
            <Trophy size={120} />
          </div>
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Сводка</h4>
          <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8">
            <div className="space-y-0.5">
              <span className="block text-2xl font-black">{stats.scenariosSolved}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">ответов</span>
            </div>
            <div className="space-y-0.5">
              <span className="block truncate text-2xl font-black">{stats.correctPercent}%</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">точность</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black">{xp}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">XP</span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black">LVL {currentLevel.level}-{currentLevel.subLevel}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">следующий</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mx-2 rounded-3xl border p-8 shadow-sm md:mx-0 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <h4 className="mb-8 text-lg font-black uppercase tracking-tighter">Категории</h4>

        {categoriesStatus === "loading" && <p className="text-sm font-bold text-slate-500">Загружаем категории...</p>}
        {categoriesStatus === "failed" && categories.length === 0 && <p className="text-sm font-bold text-rose-500">Не удалось загрузить категории с сервера.</p>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {categories.map((category) => {
            const completed = getCompletedCount(categoryProgress, category.lvl);
            const typeStats = answers[category.type];
            const accuracy = typeStats.total === 0 ? 0 : Math.round((typeStats.correct / typeStats.total) * 100);

            return (
              <div key={category.lvl} className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black ${completed > 0 ? "bg-violet-600 text-white" : theme === "dark" ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-300"}`}>
                  {completed}
                </div>
                <div className="flex-grow pt-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <h5 className={`text-xs font-black uppercase tracking-tight md:text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                      {category.label}
                    </h5>
                    <span className="text-[10px] font-black text-slate-400">{accuracy}%</span>
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
    </motion.div>
  );
};
