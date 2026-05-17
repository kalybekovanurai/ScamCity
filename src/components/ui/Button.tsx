import type { MouseEventHandler, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-500",
  secondary: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

export const Button = ({
  children,
  className = "",
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`${fullWidth ? "w-full" : ""} inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-black transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
