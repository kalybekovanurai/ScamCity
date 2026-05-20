import { createAsyncThunk } from "@reduxjs/toolkit";
import { progressApi } from "./progressApi";

export const fetchMyProgress = createAsyncThunk(
  "progress/fetchMe",
  async () => progressApi.getMyProgress(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { progress?: { status?: string } };
      return state.progress?.status !== "loading";
    },
  },
);

export const resetMyProgress = createAsyncThunk("progress/resetMe", async () => {
  return progressApi.resetMyProgress();
});
