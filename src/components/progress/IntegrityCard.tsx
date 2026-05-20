import { motion } from "motion/react";
import type { Theme } from "../../types";

interface IntegrityCardProps {
  theme: Theme;
  integrity: number;
}

const circleLength = 364;

export const IntegrityCard = ({ theme, integrity }: IntegrityCardProps) => (
  <div
    className={`relative flex flex-col items-center overflow-hidden rounded-[24px] border p-6 text-center sm:rounded-3xl sm:p-8 md:p-10 ${
      theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white shadow-sm"
    }`}
  >
    <span className={`mb-6 block text-[9px] font-black uppercase tracking-[0.3em] ${theme === "dark" ? "text-slate-500" : "text-slate-300"}`}>
      Индекс бдительности
    </span>
    <div className="relative mb-6 h-32 w-32">
      <svg className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r="58" className={`fill-none stroke-[10] ${theme === "dark" ? "stroke-slate-800" : "stroke-slate-100"}`} />
        <motion.circle
          cx="64"
          cy="64"
          r="58"
          className="fill-none stroke-violet-600 stroke-[10]"
          initial={{ strokeDashoffset: circleLength }}
          style={{ strokeDasharray: circleLength, strokeLinecap: "round" }}
          animate={{ strokeDashoffset: circleLength - (integrity / 100) * circleLength }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{integrity}%</span>
        <span className="text-[9px] font-black uppercase text-slate-400">Secure</span>
      </div>
    </div>
    <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} max-w-[240px] text-xs font-medium leading-relaxed`}>
      Показатель растет, когда вы проходите уроки и тренируете внимательность.
    </p>
  </div>
);
