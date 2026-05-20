import { createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsApi } from "./analyticsApi";

export const fetchMyAnalytics = createAsyncThunk("analytics/fetchMe", async () => {
  return analyticsApi.getMyAnalytics();
});
