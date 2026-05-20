export type AnalyticsStatus = "idle" | "loading" | "succeeded" | "failed";

export interface UserAnalytics {
  feedback: string;
  weakestCategory?: string;
  strongestCategory?: string;
  strengths?: string[];
  weakPoints?: string[];
  recommendations?: string[];
}

export interface AnalyticsState {
  data: UserAnalytics | null;
  status: AnalyticsStatus;
  error: string | null;
}
