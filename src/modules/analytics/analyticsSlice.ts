import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMyAnalytics } from "./analyticsThunk";
import type { AnalyticsState, UserAnalytics } from "./types";

const initialState: AnalyticsState = {
  data: null,
  status: "idle",
  error: null,
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalytics: (state, action: PayloadAction<UserAnalytics | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAnalytics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMyAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch analytics";
      });
  },
});

export const { setAnalytics } = analyticsSlice.actions;
export const analyticsReducer = analyticsSlice.reducer;

export const selectAnalyticsState = (state: { analytics: AnalyticsState }) => state.analytics;
export const selectMyAnalytics = createSelector(selectAnalyticsState, (analytics) => analytics.data);
export const selectAnalyticsStatus = createSelector(selectAnalyticsState, (analytics) => analytics.status);
export const selectAnalyticsError = createSelector(selectAnalyticsState, (analytics) => analytics.error);
