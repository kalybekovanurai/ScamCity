import React from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { CATEGORIES, LEVELS_PER_CATEGORY } from "../data/categories";
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
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <h3 className="text-2xl font-black uppercase tracking-tight">Центр прогресса</h3>
        <div className={`px-3 py-1.5 rounded-lg border shadow-sm text-[9px] font-black uppercase tracking-widest ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-400"}`}>
          Статус: <span className="text-emerald-500">активен</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-2 md:mx-0">
        <div className={`p-10 rounded-3xl border relative overflow-hidden flex flex-col items-center text-center ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-6 block ${theme === "dark" ? "text-slate-500" : "text-slate-300"}`}>Индекс бдительности</span>
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" className={`stroke-[10] fill-none ${theme === "dark" ? "stroke-slate-800" : "stroke-slate-100"}`} />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                className="stroke-violet-600 stroke-[10] fill-none"
                style={{ strokeDasharray: "364", strokeLinecap: "round" }}
                animate={{ strokeDashoffset: 364 - (stats.integrity / 100) * 364 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{stats.integrity}%</span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Secure</span>
            </div>
          </div>
          <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-xs font-medium leading-relaxed max-w-[220px]`}>
            Показатель растет, когда вы проходите уроки и отвечаете без ошибок.
          </p>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Trophy size={120} />
          </div>
          <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Сводка</h4>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 relative z-10">
            <div className="space-y-0.5">
              <span className="text-2xl font-black block">{stats.scenariosSolved}</span>
              <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">ответов</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-black block truncate">{stats.correctPercent}%</span>
              <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">точность</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-black block">{xp}</span>
              <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">XP</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-black block">LVL {currentLevel.level}-{currentLevel.subLevel}</span>
              <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">следующий</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-3xl border p-8 shadow-sm mx-2 md:mx-0 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <h4 className="text-lg font-black mb-8 uppercase tracking-tighter">Категории</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CATEGORIES.map((category) => {
            const completed = getCompletedCount(categoryProgress, category.lvl);
            const typeStats = answers[category.type];
            const accuracy = typeStats.total === 0 ? 0 : Math.round((typeStats.correct / typeStats.total) * 100);

            return (
              <div key={category.lvl} className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm ${completed > 0 ? "bg-violet-600 text-white" : theme === "dark" ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-300"}`}>
                  {completed}
                </div>
                <div className="pt-0.5 flex-grow">
                  <div className="flex items-center justify-between gap-3">
                    <h5 className={`font-black text-xs md:text-sm uppercase tracking-tight ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                      {category.label}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-black">{accuracy}%</span>
                  </div>
                  <p className="text-slate-500 text-[10px] md:text-xs mt-1.5 leading-relaxed">
                    {completed}/{LEVELS_PER_CATEGORY} уроков, {typeStats.total} ответов
                  </p>
                  <div className={`mt-3 h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
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

