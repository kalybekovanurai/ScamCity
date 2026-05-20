import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadGameData, saveGameData } from "../../app/storage";
import { createEmptyAnswers } from "../../utils/progress";
import type { CompleteLevelPayload } from "./types";

export const loadLevelsProgress = createAsyncThunk("levels/loadProgress", async () => {
  const saved = loadGameData();
  return saved?.categoryProgress ?? null;
});

export const persistCompletedLevel = createAsyncThunk(
  "levels/persistCompletedLevel",
  async ({ categoryLevel, subLevel }: CompleteLevelPayload, { getState }) => {
    const state = getState() as {
      levels: {
        progress: Record<number, number[]>;
      };
    };
    const saved = loadGameData();
    const currentProgress = state.levels.progress;
    const currentCategoryProgress = currentProgress[categoryLevel] ?? [];
    const nextProgress = {
      ...currentProgress,
      [categoryLevel]: currentCategoryProgress.includes(subLevel)
        ? currentCategoryProgress
        : [...currentCategoryProgress, subLevel].sort((a, b) => a - b),
    };

    saveGameData({
      xp: saved?.xp ?? 0,
      answers: saved?.answers ?? createEmptyAnswers(),
      theme: saved?.theme ?? "light",
      categoryProgress: nextProgress,
      masteredQuestions: saved?.masteredQuestions ?? [],
    });

    return nextProgress;
  },
);
