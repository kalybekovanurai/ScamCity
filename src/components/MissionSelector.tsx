import React, { useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Brain, MessageSquare, Terminal, Trophy } from "lucide-react";
import { APP_ROUTES } from "../app/router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCategories, selectCategories, selectCategoriesStatus } from "../modules/categories";
import type { CategoryProgress, Theme } from "../types";
import { getCompletedCount, isCategoryUnlocked } from "../utils/progress";
import { CategoryCard } from "./missions/CategoryCard";
import { LessonPath } from "./missions/LessonPath";
import { MissionHeader } from "./missions/MissionHeader";

interface MissionSelectorProps {
  theme: Theme;
  categoryProgress: CategoryProgress;
  activeCategory: number | null;
  setActiveCategory: (lvl: number | null) => void;
  setGameState: (state: any) => void;
  startLevelSession: (lvl: number, sLvl: number) => void;
  sessionError: string | null;
}

const icons = [AlertTriangle, MessageSquare, Trophy, Brain, Terminal];

export const MissionSelector: React.FC<MissionSelectorProps> = ({
  theme,
  categoryProgress,
  activeCategory,
  setActiveCategory,
  setGameState,
  startLevelSession,
  sessionError,
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const active = categories.find((category) => category.lvl === activeCategory);
  const title = active?.label ?? "Миссии";
  const completedInActive = activeCategory ? getCompletedCount(categoryProgress, activeCategory) : 0;

  useEffect(() => {
    if (categoriesStatus === "idle") {
      void dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-5 sm:space-y-6"
    >
      <MissionHeader
        theme={theme}
        title={title}
        activeCategory={activeCategory}
        completedInActive={completedInActive}
        onBack={() => (activeCategory ? setActiveCategory(null) : setGameState(APP_ROUTES.lobby.id))}
      />

      {!activeCategory ? (
        <div className="grid grid-cols-1 gap-4">
          {categoriesStatus === "loading" && (
            <div className={`rounded-[24px] border p-5 text-sm font-bold sm:rounded-[28px] sm:p-6 ${theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}>
              Загружаем категории...
            </div>
          )}

          {categoriesStatus === "failed" && categories.length === 0 && (
            <div className={`rounded-[24px] border p-5 text-sm font-bold sm:rounded-[28px] sm:p-6 ${theme === "dark" ? "border-rose-900 bg-rose-950 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
              Не удалось загрузить категории с сервера.
            </div>
          )}

          {categories.map((section, index) => (
            <CategoryCard
              key={section.lvl}
              theme={theme}
              section={section}
              icon={icons[index] ?? AlertTriangle}
              locked={!isCategoryUnlocked(categoryProgress, section.lvl)}
              completed={getCompletedCount(categoryProgress, section.lvl)}
              onSelect={() => setActiveCategory(section.lvl)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessionError && (
            <div className={`rounded-2xl border p-4 text-sm font-bold ${theme === "dark" ? "border-amber-900 bg-amber-950 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {sessionError}
            </div>
          )}
          <LessonPath
            theme={theme}
            activeCategory={activeCategory}
            categoryProgress={categoryProgress}
            startLevelSession={startLevelSession}
          />
        </div>
      )}
    </motion.div>
  );
};
