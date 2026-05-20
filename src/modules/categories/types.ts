import type { ScenarioType } from "../../types";

export type CategoriesStatus = "idle" | "loading" | "succeeded" | "failed";

export interface Category {
  lvl: number;
  type: ScenarioType;
  label: string;
  desc: string;
  accent: "emerald" | "blue" | "amber" | "violet" | "rose";
}

export interface CategoriesState {
  items: Category[];
  selectedCategory: Category | null;
  status: CategoriesStatus;
  error: string | null;
}
