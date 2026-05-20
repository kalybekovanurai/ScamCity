import { apiClient } from "../../api/client";
import { fixMojibake } from "../../utils/text";
import type { ServerSubmitAnswerResponse, SubmitAnswerBody, SubmitAnswerPayload, SubmitAnswerResponse } from "./types";

const normalizeSubmitAnswer = (
  data: ServerSubmitAnswerResponse,
  fallback: SubmitAnswerPayload,
): SubmitAnswerResponse => ({
  scenarioId: String(data.scenarioId ?? data.scenario_id ?? fallback.scenarioId),
  optionId: String(data.optionId ?? data.option_id ?? data.selected_option_id ?? fallback.optionId),
  isCorrect: data.isCorrect ?? data.is_correct ?? data.correct ?? false,
  feedback: data.feedback ? fixMojibake(data.feedback) : undefined,
  explanation: data.explanation ? fixMojibake(data.explanation) : undefined,
  xpAwarded: data.xpAwarded ?? data.xp_awarded ?? data.points ?? 0,
});

export const answersApi = {
  async submitAnswer({ scenarioId, optionId, timeSpent = 15 }: SubmitAnswerPayload) {
    const body: SubmitAnswerBody = {
      option_id: Number(optionId),
      time_spent: timeSpent,
    };
    const { data } = await apiClient.post<ServerSubmitAnswerResponse>(`/api/scenarios/${scenarioId}/answer`, body);
    return normalizeSubmitAnswer(data, { scenarioId, optionId });
  },
};
