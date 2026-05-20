export type AnswerStatus = "idle" | "loading" | "succeeded" | "failed";

export interface SubmitAnswerPayload {
  scenarioId: string;
  optionId: string;
  timeSpent?: number | null;
}

export interface SubmitAnswerBody {
  option_id: number;
  time_spent?: number | null;
}

export interface SubmitAnswerResponse {
  scenarioId: string;
  optionId: string;
  isCorrect: boolean;
  feedback?: string;
  explanation?: string;
  xpAwarded?: number;
}

export type ServerSubmitAnswerResponse = Partial<SubmitAnswerResponse> & {
  scenario_id?: string | number;
  option_id?: string | number;
  selected_option_id?: string | number;
  is_correct?: boolean;
  correct?: boolean;
  xp_awarded?: number;
  points?: number;
};

export interface AnswersState {
  lastSubmission: SubmitAnswerResponse | null;
  status: AnswerStatus;
  error: string | null;
}
