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
}) => {
  return (
    <AnimatePresence>
      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
            className={`relative w-full max-w-sm p-8 rounded-[40px] border shadow-2xl ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black uppercase tracking-tighter">Настройки</h4>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Закрыть">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <span className="text-xs font-bold uppercase tracking-wider">Темная тема</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${theme === "dark" ? "bg-violet-600" : "bg-slate-200"}`}
                  aria-label="Переключить тему"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className={`p-4 rounded-2xl border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Системный статус</p>
                <p className="text-xs font-medium leading-relaxed">Прогресс сохраняется локально в браузере. Урок засчитывается только если все вопросы решены верно.</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-600 transition-all"
            >
              Готово
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

