import { Trophy } from "lucide-react";

interface SummaryCardProps {
  xp: number;
  currentLevel: { level: number; subLevel: number };
  stats: {
    scenariosSolved: number;
    correctPercent: number;
  };
}

export const SummaryCard = ({ xp, currentLevel, stats }: SummaryCardProps) => (
  <div className="relative space-y-6 overflow-hidden rounded-[24px] bg-slate-900 p-6 text-white shadow-xl sm:rounded-3xl sm:p-8">
    <div className="absolute right-0 top-0 p-6 opacity-5">
      <Trophy size={120} />
    </div>
    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Сводка</h4>
    <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-y-8">
      <div className="space-y-0.5">
        <span className="block text-2xl font-black">{stats.scenariosSolved}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">ответов</span>
      </div>
      <div className="space-y-0.5">
        <span className="block truncate text-2xl font-black">{stats.correctPercent}%</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">точность</span>
      </div>
      <div className="space-y-0.5">
        <span className="block truncate text-2xl font-black">{xp}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">XP</span>
      </div>
      <div className="space-y-0.5">
        <span className="block truncate text-2xl font-black">
          LVL {currentLevel.level}-{currentLevel.subLevel}
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">следующий</span>
      </div>
    </div>
  </div>
);
