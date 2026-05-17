import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, Brain, MessageSquare, Terminal, Trophy } from "lucide-react";
import { APP_ROUTES } from "../app/router";
import { CATEGORIES } from "../data/categories";
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
}

const icons = [AlertTriangle, MessageSquare, Trophy, Brain, Terminal];

export const MissionSelector: React.FC<MissionSelectorProps> = ({
  theme,
  categoryProgress,
  activeCategory,
  setActiveCategory,
  setGameState,
  startLevelSession,
}) => {
  const active = CATEGORIES.find((category) => category.lvl === activeCategory);
  const title = active?.label ?? "Миссии";
  const completedInActive = activeCategory ? getCompletedCount(categoryProgress, activeCategory) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
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
          {CATEGORIES.map((section, index) => (
            <React.Fragment key={section.lvl}>
              <CategoryCard
                theme={theme}
                section={section}
                icon={icons[index]}
                locked={!isCategoryUnlocked(categoryProgress, section.lvl)}
                completed={getCompletedCount(categoryProgress, section.lvl)}
                onSelect={() => setActiveCategory(section.lvl)}
              />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <LessonPath
          theme={theme}
          activeCategory={activeCategory}
          categoryProgress={categoryProgress}
          startLevelSession={startLevelSession}
        />
      )}
    </motion.div>
  );
};
