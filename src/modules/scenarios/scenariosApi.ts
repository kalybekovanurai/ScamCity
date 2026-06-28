import { apiClient } from "../../api/client";
import { demoAdaptiveScenario, demoDiagnosticScenarios, getAllDemoScenarios, getDemoScenarioById, isDemoMode } from "../../data/demoData";
import type { ScenarioType } from "../../types";
import { normalizeScenario, normalizeScenarios, type ServerScenario } from "./scenarioMappers";

const getDemoScenariosByType = (scenarioType: ScenarioType) =>
  getAllDemoScenarios().filter((scenario) => scenario.type === scenarioType);

export const scenariosApi = {
  async getScenarios() {
    if (isDemoMode()) return normalizeScenarios(getAllDemoScenarios());

    try {
      const { data } = await apiClient.get<ServerScenario[]>("/api/scenarios");
      return normalizeScenarios(data);
    } catch {
      return normalizeScenarios(getAllDemoScenarios());
    }
  },

  async getScenariosByType(scenarioType: ScenarioType) {
    if (isDemoMode()) return normalizeScenarios(getDemoScenariosByType(scenarioType));

    try {
      const { data } = await apiClient.get<ServerScenario[]>(`/api/scenarios/category/${scenarioType}`);
      return normalizeScenarios(data);
    } catch {
      return normalizeScenarios(getDemoScenariosByType(scenarioType));
    }
  },

  async getScenariosByLevel(level: number) {
    const demoScenarios = level === 1 ? demoDiagnosticScenarios : [demoAdaptiveScenario];
    if (isDemoMode()) return normalizeScenarios(demoScenarios);

    try {
      const { data } = await apiClient.get<ServerScenario[]>(`/api/scenarios/level/${level}`);
      return normalizeScenarios(data);
    } catch {
      return normalizeScenarios(demoScenarios);
    }
  },

  async getScenarioById(scenarioId: string) {
    const demoScenario = getDemoScenarioById(scenarioId) ?? demoAdaptiveScenario;
    if (isDemoMode()) return normalizeScenario(demoScenario);

    try {
      const { data } = await apiClient.get<ServerScenario>(`/api/scenarios/${scenarioId}`);
      return normalizeScenario(data);
    } catch {
      return normalizeScenario(demoScenario);
    }
  },
};
