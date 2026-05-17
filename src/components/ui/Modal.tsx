import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Theme } from "../../types";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  theme: Theme;
  className?: string;
  zIndex?: string;
}

export const Modal = ({ children, open, theme, className = "", zIndex = "z-[100]" }: ModalProps) => (
  <AnimatePresence>
    {open && (
      <div className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md overflow-y-auto`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          className={`relative my-auto w-full overflow-hidden rounded-[32px] border shadow-2xl ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-white"} ${className}`}
        >
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

