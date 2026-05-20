import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { fetchMyProgress } from "./progressThunk";

import type { ProgressState, UserProgress } from "./types";

const initialState: ProgressState = {
  data: {
    xp: 0,
    categoryProgress: {},
    answers: {},
  },

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

    resetProgressLocal: (state) => {
      state.data = {
        xp: 0,
        categoryProgress: {},
        answers: {},
      };

      state.status = "idle";
      state.error = null;

      localStorage.removeItem("persist:root");
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
      });
  },
});

export const { setProgress, resetProgressLocal } = progressSlice.actions;

export const progressReducer = progressSlice.reducer;

export const selectProgressState = (state: { progress: ProgressState }) =>
  state.progress;

export const selectMyProgress = createSelector(
  selectProgressState,
  (progress) => progress.data,
);

export const selectProgressStatus = createSelector(
  selectProgressState,
  (progress) => progress.status,
);

export const selectProgressError = createSelector(
  selectProgressState,
  (progress) => progress.error,
);
