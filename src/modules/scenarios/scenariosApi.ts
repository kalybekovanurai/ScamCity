import { apiClient } from "../../api/client";
import type { ScenarioType } from "../../types";
import { normalizeScenario, normalizeScenarios, type ServerScenario } from "./scenarioMappers";

export const scenariosApi = {
  async getScenarios() {
    const { data } = await apiClient.get<ServerScenario[]>("/api/scenarios");
    return normalizeScenarios(data);
  },

  async getScenariosByType(scenarioType: ScenarioType) {
    const { data } = await apiClient.get<ServerScenario[]>(`/api/scenarios/category/${scenarioType}`);
    return normalizeScenarios(data);
  },

  async getScenariosByLevel(level: number) {
    const { data } = await apiClient.get<ServerScenario[]>(`/api/scenarios/level/${level}`);
    return normalizeScenarios(data);
  },

  async getScenarioById(scenarioId: string) {
    const { data } = await apiClient.get<ServerScenario>(`/api/scenarios/${scenarioId}`);
    return normalizeScenario(data);
  },
};
