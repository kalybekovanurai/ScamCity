import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "./types";
import { getCurrentUser } from "./profileThunk";

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileProgress: (state) => {
      if (state.user) {
        state.user.level = 1;
        state.user.subLevel = 1;
        state.user.xp = 0;
        state.user.rank = "Новичок";
        state.user.correctPercent = 0;
      }
    },

    updateProfileProgress: (state, action) => {
      if (state.user) {
        state.user.level = action.payload.level ?? state.user.level;
        state.user.subLevel = action.payload.subLevel ?? state.user.subLevel;
        state.user.xp = action.payload.xp ?? state.user.xp;
        state.user.rank = action.payload.rank ?? state.user.rank;
        state.user.correctPercent =
          action.payload.correctPercent ?? state.user.correctPercent;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки профиля";
      });
  },
});

export const { resetProfileProgress, updateProfileProgress } =
  profileSlice.actions;

export default profileSlice.reducer;
