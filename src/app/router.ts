import { Map, Shield, Trophy, User } from "lucide-react";

export type AppRouteId = "lobby" | "levels" | "scenario" | "progress" | "profile" | "ai-analysis";

export const APP_ROUTES = {
  lobby: { id: "lobby", path: "/", label: "Главная" },
  levels: { id: "levels", path: "/missions", label: "Миссии" },
  scenario: { id: "scenario", path: "/missions/session", label: "Урок" },
  progress: { id: "progress", path: "/progress", label: "Прогресс" },
  profile: { id: "profile", path: "/profile", label: "Профиль" },
  "ai-analysis": { id: "ai-analysis", path: "/analysis", label: "AI-анализ" },
} as const;

export const NAV_ITEMS = [
  { ...APP_ROUTES.lobby, icon: Shield },
  { ...APP_ROUTES.levels, icon: Map },
  { ...APP_ROUTES.progress, icon: Trophy },
  { ...APP_ROUTES.profile, icon: User },
];
