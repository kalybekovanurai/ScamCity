import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCategories, selectCategories, selectCategoriesStatus } from "../modules/categories";
import type { AnswersByType, CategoryProgress, Theme } from "../types";
import { CategoryProgressList } from "./progress/CategoryProgressList";
import { IntegrityCard } from "./progress/IntegrityCard";
import { SummaryCard } from "./progress/SummaryCard";

interface ProgressCenterProps {
  theme: Theme;
  xp: number;
  currentLevel: { level: number; subLevel: number };
  categoryProgress: CategoryProgress;
  answers: AnswersByType;
  stats: {
    integrity: number;
    scenariosSolved: number;
    correctPercent: number;
  };
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
  const integrity = Number.isFinite(stats.integrity) ? stats.integrity : 0;

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
      className="mx-auto w-full max-w-4xl space-y-5 sm:space-y-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 px-1 sm:px-2 md:flex-row md:items-center">
        <h3 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Центр прогресса</h3>
        <div className={`rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-400" : "border-slate-200 bg-white text-slate-400"}`}>
          Статус: <span className="text-emerald-500">активен</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IntegrityCard theme={theme} integrity={integrity} />
        <SummaryCard xp={xp} currentLevel={currentLevel} stats={stats} />
      </div>

      <CategoryProgressList
        theme={theme}
        categories={categories}
        categoriesStatus={categoriesStatus}
        categoryProgress={categoryProgress}
        answers={answers}
      />
    </motion.div>
  );
};
