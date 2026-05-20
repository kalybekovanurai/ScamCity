import { CheckCircle2, Lock, Play } from "lucide-react";
import { LEVELS_PER_CATEGORY } from "../../config/levels";
import type { CategoryProgress, Theme } from "../../types";
import { getNextSubLevel, isSubLevelCompleted, isSubLevelUnlocked } from "../../utils/progress";

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
  if (!active) return theme === "dark" ? "bg-slate-700 shadow-slate-950" : "bg-slate-300 shadow-slate-200";
  return theme === "dark" ? "bg-violet-400 shadow-violet-950" : "bg-violet-600 shadow-violet-200";
};

const ThreeDotConnector = ({ direction, active, theme }: ThreeDotConnectorProps) => {
  const dots =
    direction === "right"
      ? [
          "left-1/2 -translate-x-20 top-[5rem]",
          "left-1/2 -translate-x-1/2 top-[6.35rem]",
          "left-1/2 translate-x-16 top-[7.7rem]",
        ]
      : [
          "left-1/2 translate-x-16 top-[5rem]",
          "left-1/2 -translate-x-1/2 top-[6.35rem]",
          "left-1/2 -translate-x-20 top-[7.7rem]",
        ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden sm:block">
      {dots.map((position, index) => (
        <span key={index} className={`absolute h-5 w-5 rounded-full ${position} ${dotTheme(theme, active)} shadow-lg`} />
      ))}
    </div>
  );
};

const MobileConnector = ({ active, theme }: { active: boolean; theme: Theme }) => (
  <div className="pointer-events-none absolute -left-9 top-[5.8rem] z-0 flex flex-col gap-2 sm:hidden">
    {[0, 1, 2].map((dot) => (
      <span
        key={dot}
        className={`block h-3.5 w-3.5 rounded-full ${dot === 1 ? "translate-x-3" : ""} ${dotTheme(theme, active)} shadow-md`}
      />
    ))}
  </div>
);

export const LessonPath = ({ theme, activeCategory, categoryProgress, startLevelSession }: LessonPathProps) => (
  <div className="relative mx-auto w-full max-w-4xl py-2 sm:px-2">
    <div className="space-y-12 sm:space-y-14">
      {Array.from({ length: LEVELS_PER_CATEGORY }).map((_, i) => {
        const subLevel = i + 1;
        const completed = isSubLevelCompleted(categoryProgress, activeCategory, subLevel);
        const unlocked = isSubLevelUnlocked(categoryProgress, activeCategory, subLevel);
        const nextUnlocked = isSubLevelUnlocked(categoryProgress, activeCategory, subLevel + 1);
        const current = getNextSubLevel(categoryProgress, activeCategory) === subLevel && unlocked && !completed;
        const isLeft = i % 2 === 0;
        const desktopSide = isLeft ? "sm:justify-start sm:pr-[58%]" : "sm:justify-end sm:pl-[58%]";

        return (
          <div
            key={`${activeCategory}-${subLevel}`}
            className={`relative flex min-h-28 justify-start pl-14 sm:min-h-32 sm:pl-0 ${desktopSide}`}
          >
            {i < LEVELS_PER_CATEGORY - 1 && (
              <ThreeDotConnector active={nextUnlocked} theme={theme} direction={isLeft ? "right" : "left"} />
            )}

            <div className="relative z-10 w-full max-w-[20rem] sm:max-w-xs">
              {i < LEVELS_PER_CATEGORY - 1 && <MobileConnector active={nextUnlocked} theme={theme} />}

              <button
                type="button"
                disabled={!unlocked}
                onClick={() => startLevelSession(activeCategory, subLevel)}
                className={`relative z-10 w-full rounded-[26px] border p-4 text-left shadow-sm transition ${
                  completed
                    ? theme === "dark"
                      ? "bg-emerald-950 border-emerald-700 text-emerald-100"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : current
                      ? "bg-violet-600 border-violet-500 text-white shadow-xl shadow-violet-200"
                      : unlocked
                        ? theme === "dark"
                          ? "bg-slate-900 border-slate-700 text-slate-100 hover:border-violet-500"
                          : "bg-white border-slate-200 text-slate-800 hover:border-violet-300"
                        : theme === "dark"
                          ? "bg-slate-900 border-slate-800 text-slate-600 opacity-70"
                          : "bg-white border-slate-100 text-slate-300 opacity-75"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      completed
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="h-7 w-7" /> : unlocked ? <Play className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold opacity-70">Урок {subLevel}</p>
                    <p className="truncate text-xl font-black">
                      {completed ? "Повторить" : current ? "Начать" : unlocked ? "Открыто" : "Закрыто"}
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
