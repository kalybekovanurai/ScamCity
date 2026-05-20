import { ChevronRight, Lock, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { LEVELS_PER_CATEGORY } from "../../config/levels";
import type { Theme } from "../../types";
import { accentClasses } from "./missionStyles";

interface CategoryCardProps {
  theme: Theme;
  section: {
    lvl: number;
    label: string;
    desc: string;
    accent: keyof typeof accentClasses;
  };
  icon: LucideIcon;
  locked: boolean;
  completed: number;
  onSelect: () => void;
}

export const CategoryCard = ({ theme, section, icon: Icon, locked, completed, onSelect }: CategoryCardProps) => {
  const accent = accentClasses[section.accent];

  return (
    <motion.button
      type="button"
      whileHover={!locked ? { y: -2 } : {}}
      className={`group rounded-[28px] border p-5 text-left shadow-sm transition disabled:cursor-not-allowed ${
        locked
          ? theme === "dark"
            ? "border-slate-800 bg-slate-900/70 opacity-55"
            : "border-slate-200 bg-slate-100 opacity-70"
          : theme === "dark"
            ? "border-slate-800 bg-slate-900 hover:border-violet-500"
            : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-md"
      }`}
      disabled={locked}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${locked ? "bg-slate-200 text-slate-400" : `${accent.bg} ${accent.text} ring-8 ${accent.ring}`}`}>
          <Icon size={30} />
        </div>

        <div className="min-w-0 flex-grow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h4 className={`break-words text-xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {section.label}
            </h4>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${locked ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-600"}`}>
              {locked ? "Закрыто" : `${completed}/${LEVELS_PER_CATEGORY} пройдено`}
            </span>
          </div>
          <p className={`mt-2 text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{section.desc}</p>
          <div className={`mt-4 h-2.5 overflow-hidden rounded-full ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
            <div className={`h-full ${accent.bar}`} style={{ width: `${(completed / LEVELS_PER_CATEGORY) * 100}%` }} />
          </div>
        </div>

        <div className="hidden sm:block">
          {locked ? <Lock className="h-6 w-6 text-slate-300" /> : <ChevronRight className="h-7 w-7 text-slate-300 transition group-hover:text-violet-500" />}
        </div>
      </div>
    </motion.button>
  );
};
