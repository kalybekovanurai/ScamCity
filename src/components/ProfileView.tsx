import React from "react";
import { motion } from "motion/react";
import { RotateCcw, Settings, Shield, User } from "lucide-react";
import type { Theme } from "../types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchMyProgress,
  resetMyProgress,
  selectMyProgress,
  selectProgressStatus,
  selectProgressError,
  type ProgressStatus,
} from "../modules/progress";

interface ProfileViewProps {
  theme: Theme;
  setShowSettings: (val: boolean) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  setShowSettings,
}) => {
  const dispatch = useAppDispatch();

  const progress = useAppSelector(selectMyProgress);
  const status: ProgressStatus = useAppSelector(selectProgressStatus);
  const error = useAppSelector(selectProgressError);

  React.useEffect(() => {
    dispatch(fetchMyProgress());
  }, [dispatch]);

  const handleLevelReset = async () => {
    await dispatch(resetMyProgress());
    dispatch(fetchMyProgress());
  };

  if (status === "loading") {
    return (
      <div className="text-center py-10 font-bold text-slate-400">
        Загрузка профиля...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 font-bold text-rose-500">{error}</div>
    );
  }

  const xp = progress?.xp ?? 0;
  
  // Calculate level from categoryProgress
  const level = progress?.categoryProgress
    ? Math.max(...Object.keys(progress.categoryProgress).map(Number), 0)
    : 1;
  
  // Calculate subLevel (number of completed scenarios in current level)
  const subLevel = progress?.categoryProgress[level]?.length ?? 1;
  
  // Calculate correct percentage from answers
  const totalAnswers = progress?.answers
    ? Object.values(progress.answers).reduce((sum, stats) => sum + stats.total, 0)
    : 0;
  const correctAnswers = progress?.answers
    ? Object.values(progress.answers).reduce((sum, stats) => sum + stats.correct, 0)
    : 0;
  const correctPercent = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  // Determine rank based on level
  const getRank = (lvl: number): string => {
    if (lvl <= 1) return "Новичок";
    if (lvl <= 2) return "Помощник";
    if (lvl <= 3) return "Оперативник";
    if (lvl <= 4) return "Старший агент";
    return "Директор";
  };
  const rank = getRank(level);

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-md mx-auto"
    >
      <div
        className={`p-10 md:p-12 rounded-[40px] border text-center relative overflow-hidden group shadow-sm transition-all ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="absolute inset-0 scam-city-grid opacity-20" />

        <div className="relative inline-block mb-8">
          <div
            className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl flex items-center justify-center overflow-hidden border-4 shadow-xl relative transition-transform duration-500 group-hover:rotate-6 ${
              theme === "dark"
                ? "bg-slate-800 border-violet-900/50"
                : "bg-slate-100 border-violet-100"
            }`}
          >
            <User
              className={`w-16 h-16 ${
                theme === "dark" ? "text-slate-600" : "text-slate-400"
              }`}
            />
          </div>

          <div
            className={`absolute -bottom-2 -right-2 bg-violet-600 text-white p-3 rounded-xl shadow-lg border-4 ${
              theme === "dark" ? "border-slate-900" : "border-white"
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <span
            className={`text-[9px] font-black uppercase tracking-[0.4em] mb-2 block ${
              theme === "dark" ? "text-slate-500" : "text-slate-300"
            }`}
          >
            Профиль агента
          </span>

          <h3
            className={`text-3xl font-black mb-2 uppercase tracking-tighter ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            AGENT <span className="text-violet-600">#8291</span>
          </h3>

          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-1 rounded-full ${
                    i <= level
                      ? "bg-violet-500"
                      : theme === "dark"
                        ? "bg-slate-800"
                        : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p
              className={`font-black uppercase tracking-widest text-[9px] ${
                theme === "dark" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {rank} · урок {level}-{subLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              theme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <span className="text-[9px] font-black text-slate-300 uppercase block mb-1 tracking-widest">
              Опыт
            </span>

            <span
              className={`font-black text-xl ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {xp}{" "}
              <span className="text-[10px] text-slate-400 font-mono">XP</span>
            </span>
          </div>

          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              theme === "dark"
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <span className="text-[9px] font-black text-slate-300 uppercase block mb-1 tracking-widest">
              Точность
            </span>

            <span
              className={`font-black text-xl ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {correctPercent}%
            </span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full py-5 bg-violet-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/10 active:scale-95 flex items-center justify-center gap-3"
          >
            <Settings className="w-4 h-4" />
            Настройки
          </button>

          <button
            onClick={handleLevelReset}
            disabled={status === "loading"}
            className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all border flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50"
                : "bg-white border-slate-200 text-rose-500 hover:bg-rose-50 shadow-sm"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить прогресс
          </button>
        </div>
      </div>
    </motion.div>
  );
};
