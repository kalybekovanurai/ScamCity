import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserProfile } from "./types";
import { axiosInstance } from "@/src/api/client";

export const getCurrentUser = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("profile/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/api/users/me");

    if (typeof data === "string") {
      return {
        username: data,
        level: 1,
        subLevel: 1,
        xp: 0,
        rank: "Новичок",
        correctPercent: 0,
      };
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      level: data.level ?? 1,
      subLevel: data.subLevel ?? 1,
      xp: data.xp ?? 0,
      rank: data.rank ?? "Новичок",
      correctPercent: data.correctPercent ?? 0,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не удалось загрузить профиль",
    );
  }
});
