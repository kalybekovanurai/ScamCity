import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMyProgress, resetMyProgress } from "./progressThunk";
import type { ProgressState, UserProgress } from "./types";

const initialState: ProgressState = {
  data: null,
  status: "idle",
  error: null,
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<UserProgress | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProgress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMyProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch progress";
      })
      .addCase(resetMyProgress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetMyProgress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(resetMyProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to reset progress";
      });
  },
});

export const { setProgress } = progressSlice.actions;
export const progressReducer = progressSlice.reducer;

export const selectProgressState = (state: { progress: ProgressState }) => state.progress;
export const selectMyProgress = createSelector(selectProgressState, (progress) => progress.data);
export const selectProgressStatus = createSelector(selectProgressState, (progress) => progress.status);
export const selectProgressError = createSelector(selectProgressState, (progress) => progress.error);
