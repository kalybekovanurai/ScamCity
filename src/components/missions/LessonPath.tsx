import { CheckCircle2, Lock, Play } from "lucide-react";
import { LEVELS_PER_CATEGORY } from "../../config/levels";
import type { CategoryProgress, Theme } from "../../types";
import {
  getNextSubLevel,
  isSubLevelCompleted,
  isSubLevelUnlocked,
} from "../../utils/progress";

interface LessonPathProps {
  theme: Theme;
  activeCategory: number;
  categoryProgress: CategoryProgress;
  startLevelSession: (lvl: number, sLvl: number) => void;
}

interface ThreeDotConnectorProps {
  direction: "right" | "left";
  active: boolean;
  theme: Theme;
}

const dotTheme = (theme: Theme, active: boolean) => {
  if (!active) {
    return theme === "dark"
      ? "bg-slate-700 shadow-slate-950"
      : "bg-slate-300 shadow-slate-200";
  }

  return theme === "dark"
    ? "bg-violet-400 shadow-violet-950"
    : "bg-violet-600 shadow-violet-200";
};

const ThreeDotConnector = ({
  direction,
  active,
  theme,
}: ThreeDotConnectorProps) => {
  const dots =
    direction === "right"
      ? [
          "left-1/2 -translate-x-10 sm:-translate-x-20 top-[5rem] sm:top-[5.8rem]",
          "left-1/2 -translate-x-1/2 top-[6.1rem] sm:top-[7.05rem]",
          "left-1/2 translate-x-8 sm:translate-x-16 top-[7.1rem] sm:top-[8.45rem]",
        ]
      : [
          "left-1/2 translate-x-8 sm:translate-x-16 top-[5rem] sm:top-[5.8rem]",
          "left-1/2 -translate-x-1/2 top-[6.1rem] sm:top-[7.05rem]",
          "left-1/2 -translate-x-10 sm:-translate-x-20 top-[7.1rem] sm:top-[8.45rem]",
        ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {dots.map((position, index) => (
        <span
          key={index}
          className={`absolute h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full ${position} ${dotTheme(
            theme,
            active,
          )} shadow-lg`}
        />
      ))}
    </div>
  );
};

export const LessonPath = ({
  theme,
  activeCategory,
  categoryProgress,
  startLevelSession,
}: LessonPathProps) => (
  <div className="relative mx-auto w-full max-w-4xl py-2">
    <div className="space-y-8 sm:space-y-14">
      {Array.from({ length: LEVELS_PER_CATEGORY }).map((_, i) => {
        const subLevel = i + 1;

        const completed = isSubLevelCompleted(
          categoryProgress,
          activeCategory,
          subLevel,
        );

        const unlocked = isSubLevelUnlocked(
          categoryProgress,
          activeCategory,
          subLevel,
        );

        const nextUnlocked = isSubLevelUnlocked(
          categoryProgress,
          activeCategory,
          subLevel + 1,
        );

        const current =
          getNextSubLevel(categoryProgress, activeCategory) === subLevel &&
          unlocked &&
          !completed;

        const isLeft = i % 2 === 0;

        return (
          <div
            key={`${activeCategory}-${subLevel}`}
            className={`relative flex min-h-[8rem] sm:min-h-32 ${
              isLeft
                ? "justify-start pr-[22%] sm:pr-[58%]"
                : "justify-end pl-[22%] sm:pl-[58%]"
            }`}
          >
            {i < LEVELS_PER_CATEGORY - 1 && (
              <ThreeDotConnector
                active={nextUnlocked}
                theme={theme}
                direction={isLeft ? "right" : "left"}
              />
            )}

            <div className="relative z-10 w-[17rem] sm:w-full sm:max-w-xs">
              <button
                type="button"
                disabled={!unlocked}
                onClick={() =>
                  startLevelSession(activeCategory, subLevel)
                }
                className={`relative z-10 w-full rounded-[18px] border p-3 text-left shadow-sm transition sm:rounded-[26px] sm:p-4 ${
                  completed
                    ? theme === "dark"
                      ? "border-emerald-700 bg-emerald-950 text-emerald-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : current
                      ? "border-violet-500 bg-violet-600 text-white shadow-xl shadow-violet-200"
                      : unlocked
                        ? theme === "dark"
                          ? "border-slate-700 bg-slate-900 text-slate-100 hover:border-violet-500"
                          : "border-slate-200 bg-white text-slate-800 hover:border-violet-300"
                        : theme === "dark"
                          ? "border-slate-800 bg-slate-900 text-slate-600 opacity-70"
                          : "border-slate-100 bg-white text-slate-300 opacity-75"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${
                      completed
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
                    ) : unlocked ? (
                      <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold opacity-70 sm:text-sm">
                      Урок {subLevel}
                    </p>

                    <p className="truncate text-sm font-black sm:text-xl">
                      {completed
                        ? "Повторить"
                        : current
                          ? "Начать"
                          : unlocked
                            ? "Открыто"
                            : "Закрыто"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);