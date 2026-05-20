export interface AnswerStats {
  correct: number;
  total: number;
}

export interface UserProgress {
  xp: number;
  categoryProgress: Record<number, string[]>;
  answers: Record<string, AnswerStats>;
}

export type ProgressStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProgressState {
  data: UserProgress | null;
  status: ProgressStatus;
  error: string | null;
}
