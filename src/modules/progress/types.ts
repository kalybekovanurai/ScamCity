import type { AnswersByType, CategoryProgress } from "../../types";

export type ProgressStatus = "idle" | "loading" | "succeeded" | "failed";

export interface UserProgress {
  xp: number;
  categoryProgress: CategoryProgress;
  answers: AnswersByType;
  masteredQuestions: string[];
}

export interface ProgressState {
  data: UserProgress | null;
  status: ProgressStatus;
  error: string | null;
}
