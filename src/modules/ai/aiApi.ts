import { apiClient } from "../../api/client";
import type { Scenario } from "../../types";
import { normalizeScenario, type ServerScenario } from "../scenarios";
import type { AiScenarioResponse } from "./types";

const getScenarioFromResponse = (data: AiScenarioResponse): ServerScenario => {
  if (typeof data === "string") {
    return JSON.parse(data) as ServerScenario;
  }

  if ("scenario" in data && data.scenario) return data.scenario;
  if ("data" in data && data.data) return data.data;
  if ("result" in data && data.result) return data.result;

  return data as ServerScenario;
};

const normalizeAiScenario = (data: AiScenarioResponse): Scenario => normalizeScenario(getScenarioFromResponse(data));

export const aiApi = {
  async generateScenario() {
    const { data } = await apiClient.post<AiScenarioResponse>("/api/ai/generate-scenario");
    return normalizeAiScenario(data);
  },

  async getNextScenario() {
    const { data } = await apiClient.get<AiScenarioResponse>("/api/ai/next-scenario");
    return normalizeAiScenario(data);
  },
};
