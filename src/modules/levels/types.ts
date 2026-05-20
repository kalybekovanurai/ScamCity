import type { CategoryProgress } from "../../types";

export type LevelStatus = "idle" | "loading" | "succeeded" | "failed";

export interface CompleteLevelPayload {
  categoryLevel: number;
  subLevel: number;
}

export interface LevelsState {
  levelsPerCategory: number;
  activeCategory: number | null;
  progress: CategoryProgress;
  serverSynced: boolean;
  status: LevelStatus;
  error: string | null;
}
