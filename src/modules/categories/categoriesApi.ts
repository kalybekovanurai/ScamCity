import { apiClient } from "../../api/client";
import { demoCategories, isDemoMode } from "../../data/demoData";
import { fixMojibake } from "../../utils/text";
import type { Category } from "./types";

const normalizeCategory = (category: Category): Category => ({
  ...category,
  label: fixMojibake(category.label),
  desc: fixMojibake(category.desc),
});

const getDemoCategoryByLevel = (level: number) => demoCategories.find((category) => category.lvl === level) ?? demoCategories[0];
const getDemoCategoryByType = (categoryType: string) => demoCategories.find((category) => category.type === categoryType) ?? demoCategories[0];

export const categoriesApi = {
  async getCategories() {
    if (isDemoMode()) return demoCategories.map(normalizeCategory);

    try {
      const { data } = await apiClient.get<Category[]>("/api/categories");
      return data.map(normalizeCategory);
    } catch {
      return demoCategories.map(normalizeCategory);
    }
  },

  async getCategoryByLevel(level: number) {
    if (isDemoMode()) return normalizeCategory(getDemoCategoryByLevel(level));

    try {
      const { data } = await apiClient.get<Category>(`/api/categories/level/${level}`);
      return normalizeCategory(data);
    } catch {
      return normalizeCategory(getDemoCategoryByLevel(level));
    }
  },

  async getCategoryByType(categoryType: string) {
    if (isDemoMode()) return normalizeCategory(getDemoCategoryByType(categoryType));

    try {
      const { data } = await apiClient.get<Category>(`/api/categories/${categoryType}`);
      return normalizeCategory(data);
    } catch {
      return normalizeCategory(getDemoCategoryByType(categoryType));
    }
  },
};
