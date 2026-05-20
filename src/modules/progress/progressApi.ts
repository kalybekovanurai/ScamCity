import { apiClient } from "../../api/client";
import type { UserProgress } from "./types";

export const progressApi = {
  async getMyProgress() {
    const { data } = await apiClient.get<UserProgress>("/api/progress/me");
    return data;
  },

  async resetMyProgress() {
    const { data } = await apiClient.post<UserProgress>("/api/progress/reset");
    return data;
  },
};
