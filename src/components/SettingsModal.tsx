import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun, XCircle } from "lucide-react";
import type { Theme } from "../types";

interface SettingsModalProps {
  theme: Theme;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  showSettings,
  setShowSettings,
  toggleTheme,
}) => (
  <AnimatePresence>
    {showSettings && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSettings(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative max-h-[calc(100dvh-1.5rem)] w-full max-w-sm overflow-y-auto rounded-[28px] border p-5 shadow-2xl sm:rounded-[36px] sm:p-8 ${
            theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"
          }`}
        >
          <div className="mb-7 flex items-center justify-between gap-4 sm:mb-8">
            <h4 className="text-lg font-black uppercase tracking-tighter sm:text-xl">Настройки</h4>
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-full p-2 transition-colors hover:bg-slate-100"
              aria-label="Закрыть"
            >
              <XCircle className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-slate-50"}`}>
              <div className="flex min-w-0 items-center gap-3">
                {theme === "dark" ? <Moon className="h-5 w-5 shrink-0 text-violet-400" /> : <Sun className="h-5 w-5 shrink-0 text-amber-500" />}
                <span className="text-xs font-bold uppercase tracking-wider">Темная тема</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`h-6 w-12 shrink-0 rounded-full p-1 transition-all ${theme === "dark" ? "bg-violet-600" : "bg-slate-200"}`}
                aria-label="Переключить тему"
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-all ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            <div className={`rounded-2xl border p-4 ${theme === "dark" ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-slate-50"}`}>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Системный статус</p>
              <p className="text-xs font-medium leading-relaxed">
                Прогресс сохраняется локально в браузере. Урок засчитывается только если все вопросы решены верно.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-7 w-full rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition-all hover:bg-violet-600 sm:mt-8 sm:tracking-[0.3em]"
          >
            Готово
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
