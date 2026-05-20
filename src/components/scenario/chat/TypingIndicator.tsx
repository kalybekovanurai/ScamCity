import type { Theme } from "../../../types";

interface TypingIndicatorProps {
  sender: string;
  theme: Theme;
}

export const TypingIndicator = ({ sender, theme }: TypingIndicatorProps) => (
  <div className="flex justify-start">
    <div
      className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${
        theme === "dark" ? "border border-slate-700 bg-slate-900 text-slate-300" : "bg-white text-slate-500"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-75" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-150" />
        </div>
        <span>{sender} печатает...</span>
      </div>
    </div>
  </div>
);
