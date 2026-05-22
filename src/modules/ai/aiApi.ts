import { apiClient } from "../../api/client";
import type { Scenario } from "../../types";
import { normalizeScenario, scenariosApi, type ServerScenario } from "../scenarios";
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

const hasMediaAttachment = (scenario: Scenario) => {
  const contentAttachments = scenario.content.attachments ?? [];
  const messageAttachments = (scenario.content.messages ?? []).flatMap((message) => [
    message.meta?.attachment,
    message.attachment,
    ...(message.attachments ?? []),
  ]);

  return [...contentAttachments, ...messageAttachments].some((attachment) => {
    if (!attachment) return false;
    if (typeof attachment === "string") return /\.(mp3|mpeg|wav|m4a|aac|ogg|webm|mp4|mov)(\?|#|$)/i.test(attachment);

    const type = `${attachment.type ?? ""} ${attachment.mimeType ?? ""}`.toLowerCase();
    const url = `${attachment.url ?? attachment.src ?? ""}`.toLowerCase();

    return type.includes("voice") || type.includes("audio") || type.includes("video") || /\.(mp3|mpeg|wav|m4a|aac|ogg|webm|mp4|mov)(\?|#|$)/i.test(url);
  });
};

const shouldPreferMediaScenario = (scenario: Scenario) => {
  const text = `${scenario.title} ${scenario.description} ${scenario.type} ${scenario.category ?? ""}`.toLowerCase();
  return !hasMediaAttachment(scenario) && (text.includes("voice") || text.includes("голос") || text.includes("deepfake") || text.includes("ai_deepfake"));
};

const findMediaScenarioFor = async (scenario: Scenario) => {
  if (!shouldPreferMediaScenario(scenario)) return scenario;

  try {
    const candidates = await scenariosApi.getScenariosByType("ai_deepfake");
    return candidates.find(hasMediaAttachment) ?? scenario;
  } catch {
    return scenario;
  }
};

export const aiApi = {
  async generateScenario() {
    const { data } = await apiClient.post<AiScenarioResponse>("/api/ai/generate-scenario");
    return findMediaScenarioFor(normalizeAiScenario(data));
  },

  async getNextScenario() {
    const { data } = await apiClient.get<AiScenarioResponse>("/api/ai/next-scenario");
    return findMediaScenarioFor(normalizeAiScenario(data));
  },
};
