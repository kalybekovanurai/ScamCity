import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCategories, fetchCategoryByLevel, fetchCategoryByType } from "./categoriesThunk";
import type { CategoriesState, Category } from "./types";

const initialState: CategoriesState = {
  items: [],
  selectedCategory: null,
  status: "idle",
  error: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch categories";
      })
      .addCase(fetchCategoryByLevel.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryByType.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      });
  },
});

export const { setCategories, setSelectedCategory } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;

export const selectCategoriesState = (state: { categories: CategoriesState }) => state.categories;
export const selectCategories = createSelector(selectCategoriesState, (categories) => categories.items);
export const selectSelectedCategory = createSelector(selectCategoriesState, (categories) => categories.selectedCategory);
export const selectCategoriesStatus = createSelector(selectCategoriesState, (categories) => categories.status);
export const selectCategoryByLevel = (level: number) =>
  createSelector(selectCategories, (categories) => categories.find((category) => category.lvl === level) ?? null);
export const selectCategoryByType = (categoryType: string) =>
  createSelector(selectCategories, (categories) => categories.find((category) => category.type === categoryType) ?? null);
