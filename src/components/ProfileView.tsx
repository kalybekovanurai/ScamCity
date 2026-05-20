import React from "react";
import { motion } from "motion/react";
import { RotateCcw, Settings, Shield, User } from "lucide-react";
import type { Theme } from "../types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyProgress, selectMyProgress, selectProgressError } from "../modules/progress";
import { resetProgressLocal } from "../modules/progress/progressSlice";

interface ProfileViewProps {
  theme: Theme;
  setShowSettings: (val: boolean) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ theme, setShowSettings }) => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(selectMyProgress);
  const error = useAppSelector(selectProgressError);

  React.useEffect(() => {
    dispatch(fetchMyProgress());
  }, [dispatch]);

  const xp = progress?.xp ?? 0;
  const level = progress?.categoryProgress ? Math.max(...Object.keys(progress.categoryProgress).map(Number), 1) : 1;
  const subLevel = progress?.categoryProgress?.[level]?.length ?? 1;
  const totalAnswers = progress?.answers ? Object.values(progress.answers).reduce((sum, stats) => sum + stats.total, 0) : 0;
  const correctAnswers = progress?.answers ? Object.values(progress.answers).reduce((sum, stats) => sum + stats.correct, 0) : 0;
  const correctPercent = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const getRank = (lvl: number): string => {
    if (lvl <= 1) return "Новичок";
    if (lvl <= 2) return "Помощник";
    if (lvl <= 3) return "Оперативник";
    if (lvl <= 4) return "Старший агент";
    return "Директор";
  };

  if (error) {
    return <div className="py-10 text-center font-bold text-rose-500">{error}</div>;
  }

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="mx-auto w-full max-w-md"
    >
      <div
        className={`group relative overflow-hidden rounded-[28px] border p-5 text-center shadow-sm transition-all sm:rounded-[40px] sm:p-10 md:p-12 ${
          theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        }`}
      >
        <div className="scam-city-grid absolute inset-0 opacity-20" />

        <div className="relative mb-7 inline-block sm:mb-8">
          <div
            className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 shadow-xl transition-transform duration-500 group-hover:rotate-6 sm:h-28 sm:w-28 md:h-32 md:w-32 ${
              theme === "dark" ? "border-violet-900/50 bg-slate-800" : "border-violet-100 bg-slate-100"
            }`}
          >
            <User className={`h-14 w-14 sm:h-16 sm:w-16 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`} />
          </div>

          <div className={`absolute -bottom-2 -right-2 rounded-xl bg-violet-600 p-3 text-white shadow-lg border-4 ${theme === "dark" ? "border-slate-900" : "border-white"}`}>
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="relative z-10 mb-7 sm:mb-8">
          <span className={`mb-2 block text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.4em] ${theme === "dark" ? "text-slate-500" : "text-slate-300"}`}>
            Профиль агента
          </span>

          <h3 className={`mb-2 text-2xl font-black uppercase tracking-tighter sm:text-3xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            AGENT <span className="text-violet-600">#8291</span>
          </h3>

          <div className="flex flex-col items-center justify-center gap-2 min-[420px]:flex-row min-[420px]:gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-1 w-3 rounded-full ${i <= level ? "bg-violet-500" : theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
              ))}
            </div>

            <p className={`text-[9px] font-black uppercase tracking-widest ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>
              {getRank(level)} · урок {level}-{subLevel}
            </p>
          </div>
        </div>

        <div className="relative z-10 mb-7 grid grid-cols-2 gap-3 sm:mb-8">
          <div className={`rounded-2xl border p-4 text-center transition-all sm:p-6 ${theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
            <span className="mb-1 block text-[9px] font-black uppercase tracking-widest text-slate-300">Опыт</span>
            <span className={`text-lg font-black sm:text-xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {xp} <span className="font-mono text-[10px] text-slate-400">XP</span>
            </span>
          </div>

          <div className={`rounded-2xl border p-4 text-center transition-all sm:p-6 ${theme === "dark" ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
            <span className="mb-1 block text-[9px] font-black uppercase tracking-widest text-slate-300">Точность</span>
            <span className={`text-lg font-black sm:text-xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{correctPercent}%</span>
          </div>
        </div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <button
            onClick={() => setShowSettings(true)}
            className="flex w-full items-center justify-center gap-3 rounded-3xl bg-violet-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-violet-900/10 transition-all hover:bg-violet-500 active:scale-95 sm:py-5 sm:tracking-[0.3em]"
          >
            <Settings className="h-4 w-4" />
            Настройки
          </button>

          <button
            onClick={() => dispatch(resetProgressLocal())}
            className={`flex w-full items-center justify-center gap-3 rounded-3xl border py-4 text-xs font-black uppercase tracking-[0.2em] transition-all sm:py-5 sm:tracking-[0.3em] ${
              theme === "dark"
                ? "border-slate-700 bg-slate-800 text-rose-400 hover:border-rose-500/50 hover:bg-rose-500/10"
                : "border-slate-200 bg-white text-rose-500 shadow-sm hover:bg-rose-50"
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            Сбросить прогресс
          </button>
        </div>
      </div>
    </motion.div>
  );
};
