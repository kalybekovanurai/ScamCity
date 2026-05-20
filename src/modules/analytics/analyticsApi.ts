import { apiClient } from "../../api/client";
import { fixMojibake } from "../../utils/text";
import type { UserAnalytics } from "./types";

type CategoryStat = {
  type?: string;
  mistakes?: number;
  correct?: number;
};

type ServerAnalyticsResponse = Partial<UserAnalytics> & {
  user_id?: number;
  weakest_category?: string;
  strongest_category?: string;
  mistakes_by_category?: CategoryStat[];
  correct_by_category?: CategoryStat[];
  ai_recommendation?: string;
  recommendation?: string;
  analysis?: string;
  message?: string;
  result?: string;
};

type AnalyticsResponse = string | ServerAnalyticsResponse;

const getFirstText = (...values: Array<string | undefined>) => {
  const value = values.find((item) => item && item.trim().length > 0);
  return value ? fixMojibake(value) : "";
};

const formatCategoryStat = (item: CategoryStat, field: "mistakes" | "correct") =>
  `${item.type ?? "unknown"}: ${item[field] ?? 0}`;

const normalizeAnalytics = (data: AnalyticsResponse): UserAnalytics => {
  if (typeof data === "string") {
    return { feedback: fixMojibake(data) };
  }

  return {
    feedback: getFirstText(
      data.feedback,
      data.ai_recommendation,
      data.recommendation,
      data.analysis,
      data.message,
      data.result,
    ),
    weakestCategory: data.weakestCategory ?? data.weakest_category,
    strongestCategory: data.strongestCategory ?? data.strongest_category,
    strengths:
      data.strengths?.map(fixMojibake) ??
      data.correct_by_category?.filter((item) => (item.correct ?? 0) > 0).map((item) => formatCategoryStat(item, "correct")),
    weakPoints:
      data.weakPoints?.map(fixMojibake) ??
      data.mistakes_by_category?.filter((item) => (item.mistakes ?? 0) > 0).map((item) => formatCategoryStat(item, "mistakes")),
    recommendations: data.recommendations?.map(fixMojibake),
  };
};

export const analyticsApi = {
  async getMyAnalytics() {
    const { data } = await apiClient.get<AnalyticsResponse>("/api/analytics/me");
    return normalizeAnalytics(data);
  },
};
