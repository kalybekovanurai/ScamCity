import React from "react";
import { motion } from "motion/react";
import { Brain, CheckCircle2, ChevronRight, Shield } from "lucide-react";
import darkLobbyBg from "../assets/images/darkBg.png";
import lightLobbyBg from "../assets/images/lightBg.png";
import type { Theme } from "../types";

interface LobbyProps {
  theme: Theme;
  setGameState: (state: any) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ theme, setGameState }) => {
  const lobbyBg = theme === "dark" ? darkLobbyBg : lightLobbyBg;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <section
        className={`relative mx-2 min-h-[320px] overflow-hidden rounded-3xl shadow-xl md:mx-0 md:h-[420px] ${
          theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
      >
      <img src={lobbyBg} alt="" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10"
            : "bg-gradient-to-t from-white/90 via-white/30 to-white/5"
        }`}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 shadow-xl shadow-violet-900/40"
        >
          <Shield className="h-8 w-8 text-white" />
        </motion.div>

        <h2
          className={`mb-3 text-3xl font-black uppercase leading-tight md:text-5xl ${
            theme === "dark" ? "text-white" : "text-slate-950"
          } font-display`}
        >
          Scam <span className="text-violet-500">City</span>
        </h2>
        <p className={`mb-8 max-w-md text-sm font-medium md:text-base ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Тренажер цифровой бдительности: проходите категории, распознавайте схемы и прокачивайте защитные привычки.
        </p>

        <button
          onClick={() => setGameState("levels")}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-10 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-900/20 transition-all hover:bg-violet-500 active:scale-95"
        >
          Играть
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      </section>

    <div className="grid grid-cols-1 gap-4 px-2 md:grid-cols-2 md:px-0">
      <button
        type="button"
        className={`group rounded-3xl border p-8 text-left shadow-sm transition-all hover:border-violet-300 ${
          theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        }`}
        onClick={() => setGameState("levels")}
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
          <CheckCircle2 size={24} />
        </div>
        <h4 className="mb-2 text-xl font-black uppercase">Практика</h4>
        <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm font-medium leading-relaxed`}>
          Решайте реальные кейсы сетевого мошенничества и зарабатывайте опыт в безопасной среде.
        </p>
      </button>

      <button
        type="button"
        className={`group rounded-3xl border p-8 text-left shadow-sm transition-all hover:border-violet-300 ${
          theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        }`}
        onClick={() => setGameState("progress")}
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
          <Brain size={24} />
        </div>
        <h4 className="mb-2 text-xl font-black uppercase">Разбор прогресса</h4>
        <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm font-medium leading-relaxed`}>
          Смотрите точность, завершенные уроки и категории, где стоит потренироваться еще раз.
        </p>
      </button>
    </div>
    </motion.div>
  );
};
