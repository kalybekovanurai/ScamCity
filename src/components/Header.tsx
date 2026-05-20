import React from "react";
import { Moon, Shield, Sun, Trophy } from "lucide-react";
import type { Theme } from "../types";

interface HeaderProps {
  theme: Theme;
  gameState: string;
  setGameState: (state: any) => void;
  toggleTheme: () => void;
  level: number;
  xp: number;
  navItems: any[];
}

const navButtonClass = (theme: Theme, active: boolean) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition min-[1180px]:px-4 ${
    active
      ? theme === "dark"
        ? "bg-slate-800 text-violet-300"
        : "bg-white text-violet-700 shadow-sm"
      : theme === "dark"
        ? "text-slate-400 hover:text-slate-200"
        : "text-slate-500 hover:text-slate-900"
  }`;

export const Header: React.FC<HeaderProps> = ({
  theme,
  gameState,
  setGameState,
  toggleTheme,
  level,
  xp,
  navItems,
}) => (
  <>
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b px-3 py-3 shadow-sm backdrop-blur-md sm:px-4 md:px-6 ${
        theme === "dark" ? "border-slate-800 bg-slate-950/88" : "border-slate-200 bg-white/92"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[minmax(11rem,1fr)_auto_minmax(15rem,1fr)]">
        <button type="button" className="flex min-w-0 items-center gap-2 text-left sm:gap-3" onClick={() => setGameState("lobby")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200 sm:h-10 sm:w-10">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className={`truncate text-base font-black tracking-tight sm:text-lg ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            Scam <span className="text-violet-600">City</span>
          </h1>
        </button>

        <div className="hidden items-center justify-center md:flex">
          <div className={`flex items-center gap-1 rounded-2xl border p-1 ${theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => setGameState(item.id)} className={navButtonClass(theme, gameState === item.id)}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="hidden min-[1180px]:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition sm:h-11 sm:w-11 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-amber-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            aria-label="Переключить тему"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className={`hidden shrink-0 items-center rounded-2xl px-3 py-2 text-sm font-black xl:flex ${theme === "dark" ? "bg-slate-900 text-violet-300" : "bg-violet-50 text-violet-700"}`}>
            Уровень {level}
          </div>

          <div className={`flex min-w-0 shrink-0 items-center gap-1.5 rounded-2xl border px-2.5 py-2 text-xs font-black shadow-sm sm:gap-2 sm:px-3 sm:text-sm ${theme === "dark" ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
            <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="max-w-[4.75rem] truncate sm:max-w-none">{xp} XP</span>
          </div>
        </div>
      </div>
    </nav>

    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t p-2 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden ${theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"}`}>
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setGameState(item.id)}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black min-[380px]:text-[11px] ${
              gameState === item.id ? "bg-violet-50 text-violet-700" : theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="max-w-full truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  </>
);
