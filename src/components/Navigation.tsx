import React from "react";
import { Moon, Shield, Sun, Trophy } from "lucide-react";
import type { Theme } from "../types";

interface NavigationProps {
  theme: Theme;
  gameState: string;
  setGameState: (state: any) => void;
  toggleTheme: () => void;
  level: number;
  xp: number;
  navItems: any[];
}

export const Navigation: React.FC<NavigationProps> = ({
  theme,
  gameState,
  setGameState,
  toggleTheme,
  level,
  xp,
  navItems,
}) => {
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b px-3 py-3 shadow-sm backdrop-blur-md sm:px-4 md:px-8 ${theme === "dark" ? "bg-slate-950/88 border-slate-800" : "bg-white/92 border-slate-200"}`}>
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-2 lg:grid-cols-[1fr_auto_1fr]">
          <button type="button" className="flex min-w-0 items-center gap-3 text-left" onClick={() => setGameState("lobby")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className={`truncate text-lg font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Scam <span className="text-violet-600">City</span>
            </h1>
          </button>

          <div className="hidden items-center justify-center md:flex lg:order-none">
            <div className={`flex items-center gap-1 rounded-2xl border p-1 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGameState(item.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition xl:px-4 ${
                    gameState === item.id
                      ? theme === "dark"
                        ? "bg-slate-800 text-violet-300"
                        : "bg-white text-violet-700 shadow-sm"
                      : theme === "dark"
                        ? "text-slate-400 hover:text-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label="Переключить тему"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="hidden flex-col items-end xl:flex">
              <span className="text-xs font-bold text-slate-400">Текущий раздел</span>
              <span className="text-sm font-black text-violet-600">Уровень {level}</span>
            </div>

            <div
              className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-black shadow-sm ${
                theme === "dark"
                  ? "bg-slate-900 text-white border-slate-800"
                  : "bg-white text-slate-900 border-slate-200"
              }`}
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
      </nav>

      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t p-2 pb-5 md:hidden ${theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGameState(item.id)}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-black ${
                gameState === item.id ? "bg-violet-50 text-violet-700" : theme === "dark" ? "text-slate-500" : "text-slate-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

