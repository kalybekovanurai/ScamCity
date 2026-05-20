import { apiClient } from "../../api/client";
import { fixMojibake } from "../../utils/text";
import type { Category } from "./types";

const normalizeCategory = (category: Category): Category => ({
  ...category,
  label: fixMojibake(category.label),
  desc: fixMojibake(category.desc),
});

export const categoriesApi = {
  async getCategories() {
    const { data } = await apiClient.get<Category[]>("/api/categories");
    return data.map(normalizeCategory);
  },

  async getCategoryByLevel(level: number) {
    const { data } = await apiClient.get<Category>(`/api/categories/level/${level}`);
    return normalizeCategory(data);
  },

  async getCategoryByType(categoryType: string) {
    const { data } = await apiClient.get<Category>(`/api/categories/${categoryType}`);
    return normalizeCategory(data);
  },
};
