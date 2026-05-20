import { createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesApi } from "./categoriesApi";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => categoriesApi.getCategories(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { categories?: { status?: string } };
      return state.categories?.status !== "loading";
    },
  },
);

export const fetchCategoryByLevel = createAsyncThunk("categories/fetchByLevel", async (level: number) => {
  return categoriesApi.getCategoryByLevel(level);
});

export const fetchCategoryByType = createAsyncThunk("categories/fetchByType", async (categoryType: string) => {
  return categoriesApi.getCategoryByType(categoryType);
});
