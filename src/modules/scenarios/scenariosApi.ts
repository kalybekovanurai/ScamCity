import { apiClient } from "../../api/client";
import type { Scenario, ScenarioType } from "../../types";
import { fixMojibake } from "../../utils/text";

export type ServerScenario = Omit<Partial<Scenario>, "options"> & {
  id: string | number;
  lvl?: number;
  sub_level?: number;
  correct_option_id?: string | number;
  feedback?: string;
  options?: {
    id: string | number;
    text: string;
    isCorrect?: boolean;
    is_correct?: boolean;
    correct?: boolean;
    feedback?: string;
  }[];
};

export const normalizeScenario = (scenario: ServerScenario): Scenario => {
  const correctOptionId = scenario.correct_option_id ? String(scenario.correct_option_id) : null;
  const contentData = Object.fromEntries(
    Object.entries(scenario.content?.data ?? {}).map(([key, value]) => [
      key,
      typeof value === "string" ? fixMojibake(value) : value,
    ]),
  );

  return {
    id: String(scenario.id),
    level: scenario.level ?? scenario.lvl ?? 1,
    subLevel: scenario.subLevel ?? scenario.sub_level ?? 1,
    type: scenario.type ?? "phishing",
    title: fixMojibake(scenario.title ?? ""),
    description: fixMojibake(scenario.description ?? ""),
    image: scenario.image ?? "",
    content: {
      type: scenario.content?.type ?? "message",
      data: contentData,
    },
    options: (scenario.options ?? []).map((option) => {
      const optionId = String(option.id);
      const isCorrect = option.isCorrect ?? option.is_correct ?? option.correct ?? optionId === correctOptionId;

      return {
        id: optionId,
        text: fixMojibake(option.text),
        isCorrect,
        feedback: fixMojibake(
          option.feedback ??
            (isCorrect ? scenario.feedback ?? "" : "Это рискованное действие. Сначала проверьте источник и детали сообщения."),
        ),
      };
    }),
    explanation: fixMojibake(scenario.explanation ?? scenario.feedback ?? ""),
  };
};

const normalizeScenarios = (scenarios: ServerScenario[]) => scenarios.map(normalizeScenario);

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
