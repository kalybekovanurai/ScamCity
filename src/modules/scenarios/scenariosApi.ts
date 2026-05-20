import { apiClient } from "../../api/client";
import type { ContentType, Scenario, ScenarioChatMessage, ScenarioType } from "../../types";
import { normalizeScenarioType } from "../../utils/progress";
import { fixMojibake } from "../../utils/text";

type ServerChatMessage = Omit<ScenarioChatMessage, "meta"> & {
  meta?: ScenarioChatMessage["meta"];
};

export type ServerScenario = Omit<Partial<Scenario>, "content" | "options"> & {
  id: string | number;
  lvl?: number;
  sub_level?: number;
  is_scam?: boolean;
  scenario_mode?: string;
  correct_option_id?: string | number;
  correctOptionId?: string | number;
  correct_option?: string | number;
  feedback?: string;
  verification_methods?: string[];
  content?: {
    type?: ContentType;
    data?: Record<string, unknown>;
    platform?: string;
    content_type?: string;
    contentType?: string;
    participants?: unknown[];
    messages?: ServerChatMessage[];
    attachments?: unknown[];
    ui_hints?: {
      chat_style?: string;
      highlight_message_index?: number | null;
    };
    uiHints?: Scenario["content"]["uiHints"];
  };
  options?: {
    id?: string | number;
    option_id?: string | number;
    optionId?: string | number;
    text?: string;
    label?: string;
    title?: string;
    action_type?: string;
    actionType?: string;
    isCorrect?: boolean;
    is_correct?: boolean;
    correct?: boolean;
    feedback?: string;
  }[];
};

const normalizeTextRecord = (data: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? fixMojibake(value) : value]));

const normalizeMessage = (message: ServerChatMessage): ScenarioChatMessage => ({
  sender: fixMojibake(message.sender ?? ""),
  role: message.role ? fixMojibake(message.role) : undefined,
  text: fixMojibake(message.text ?? ""),
  time: message.time ? fixMojibake(message.time) : undefined,
  meta: message.meta
    ? {
        edited: message.meta.edited,
        reply_to: message.meta.reply_to ? fixMojibake(message.meta.reply_to) : message.meta.reply_to,
        attachment: message.meta.attachment ? fixMojibake(message.meta.attachment) : message.meta.attachment,
      }
    : undefined,
});

export const normalizeScenario = (scenario: ServerScenario): Scenario => {
  const correctOptionId = scenario.correct_option_id ?? scenario.correctOptionId ?? scenario.correct_option;
  const normalizedCorrectOptionId = correctOptionId !== undefined && correctOptionId !== null ? String(correctOptionId) : null;
  const contentData = normalizeTextRecord(scenario.content?.data ?? {});
  const uiHints = scenario.content?.uiHints ?? {
    chatStyle: scenario.content?.ui_hints?.chat_style,
    highlightMessageIndex: scenario.content?.ui_hints?.highlight_message_index,
  };

  return {
    id: String(scenario.id),
    level: scenario.level ?? scenario.lvl ?? 1,
    subLevel: scenario.subLevel ?? scenario.sub_level ?? 1,
    type: normalizeScenarioType(scenario.type),
    title: fixMojibake(scenario.title ?? ""),
    description: fixMojibake(scenario.description ?? ""),
    image: scenario.image ?? "",
    difficulty: scenario.difficulty ? fixMojibake(scenario.difficulty) : undefined,
    category: scenario.category ? fixMojibake(scenario.category) : undefined,
    isScam: scenario.isScam ?? scenario.is_scam,
    scenarioMode: scenario.scenarioMode ?? scenario.scenario_mode,
    content: {
      type: scenario.content?.type ?? "message",
      platform: scenario.content?.platform ? fixMojibake(scenario.content.platform) : undefined,
      contentType: scenario.content?.contentType ?? scenario.content?.content_type,
      participants: scenario.content?.participants ?? [],
      messages: scenario.content?.messages?.map(normalizeMessage) ?? [],
      attachments: scenario.content?.attachments ?? [],
      uiHints,
      data: contentData,
    },
    options: (scenario.options ?? []).map((option, index) => {
      const rawOptionId = option.id ?? option.option_id ?? option.optionId ?? index + 1;
      const optionId = String(rawOptionId);
      const isCorrect = option.isCorrect ?? option.is_correct ?? option.correct ?? optionId === normalizedCorrectOptionId;
      const text = option.text ?? option.label ?? option.title ?? `Вариант ${index + 1}`;

      return {
        id: optionId,
        text: fixMojibake(text),
        actionType: option.actionType ?? option.action_type,
        isCorrect,
        feedback: fixMojibake(
          option.feedback ??
            (isCorrect ? scenario.feedback ?? "" : "Это рискованное действие. Сначала проверьте источник и детали сообщения."),
        ),
      };
    }),
    explanation: fixMojibake(scenario.explanation ?? scenario.feedback ?? ""),
    verificationMethods: (scenario.verificationMethods ?? scenario.verification_methods)?.map(fixMojibake),
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
