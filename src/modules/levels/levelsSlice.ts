import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LEVELS_PER_CATEGORY } from "../../config/levels";
import type { CategoryProgress } from "../../types";
import {
  createEmptyProgress,
  getCompletedCount,
  getNextSubLevel,
  getTotalCompletedLevels,
  isCategoryUnlocked,
  isSubLevelCompleted,
  isSubLevelUnlocked,
  markSubLevelCompleted,
  normalizeProgress,
} from "../../utils/progress";
import { loadLevelsProgress, persistCompletedLevel } from "./levelsThunk";
import type { CompleteLevelPayload, LevelsState } from "./types";

const initialState: LevelsState = {
  levelsPerCategory: LEVELS_PER_CATEGORY,
  activeCategory: null,
  progress: createEmptyProgress(),
  serverSynced: false,
  status: "idle",
  error: null,
};

export const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<number | null>) => {
      state.activeCategory = action.payload;
    },
    setLevelsProgress: (state, action: PayloadAction<CategoryProgress>) => {
      state.progress = normalizeProgress(action.payload);
    },
    completeLevel: (state, action: PayloadAction<CompleteLevelPayload>) => {
      state.progress = markSubLevelCompleted(
        state.progress,
        action.payload.categoryLevel,
        action.payload.subLevel,
      );
    },
    resetLevelsProgress: (state) => {
      state.progress = createEmptyProgress();
      state.activeCategory = null;
      state.serverSynced = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLevelsProgress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadLevelsProgress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.progress = action.payload ? normalizeProgress(action.payload) : createEmptyProgress();
      })
      .addCase(loadLevelsProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load levels progress";
      })
      .addCase(persistCompletedLevel.fulfilled, (state, action) => {
        state.progress = normalizeProgress(action.payload);
      })
      .addCase(persistCompletedLevel.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to save levels progress";
      });
  },
});

export const { completeLevel, resetLevelsProgress, setActiveCategory, setLevelsProgress } = levelsSlice.actions;

export const levelsReducer = levelsSlice.reducer;

export const selectLevelsState = (state: { levels: LevelsState }) => state.levels;

export const selectLevelsPerCategory = createSelector(selectLevelsState, (levels) => levels.levelsPerCategory);

export const selectLevelsServerSynced = createSelector(selectLevelsState, (levels) => levels.serverSynced);

export const selectLevelsProgress = createSelector(selectLevelsState, (levels) => levels.progress);

export const selectActiveCategory = createSelector(selectLevelsState, (levels) => levels.activeCategory);

export const selectTotalCompletedLevels = createSelector(selectLevelsProgress, (progress) =>
  getTotalCompletedLevels(progress),
);

export const selectCategoryCompletedCount = (categoryLevel: number) =>
  createSelector(selectLevelsProgress, (progress) => getCompletedCount(progress, categoryLevel));

export const selectNextSubLevel = (categoryLevel: number) =>
  createSelector(selectLevelsProgress, (progress) => getNextSubLevel(progress, categoryLevel));

export const selectIsCategoryUnlocked = (categoryLevel: number) =>
  createSelector(selectLevelsProgress, (progress) => isCategoryUnlocked(progress, categoryLevel));

export const selectIsSubLevelCompleted = (categoryLevel: number, subLevel: number) =>
  createSelector(selectLevelsProgress, (progress) => isSubLevelCompleted(progress, categoryLevel, subLevel));

export const selectIsSubLevelUnlocked = (categoryLevel: number, subLevel: number) =>
  createSelector(selectLevelsProgress, (progress) => isSubLevelUnlocked(progress, categoryLevel, subLevel));
