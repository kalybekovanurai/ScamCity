import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ScenarioType } from "../../types";
import { scenariosApi } from "./scenariosApi";

export const fetchScenarios = createAsyncThunk(
  "scenarios/fetchAll",
  async () => scenariosApi.getScenarios(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { scenarios?: { status?: string } };
      return state.scenarios?.status !== "loading";
    },
  },
);

export const fetchScenariosByType = createAsyncThunk("scenarios/fetchByType", async (scenarioType: ScenarioType) => {
  return scenariosApi.getScenariosByType(scenarioType);
});

export const fetchScenariosByLevel = createAsyncThunk("scenarios/fetchByLevel", async (level: number) => {
  return scenariosApi.getScenariosByLevel(level);
});

export const fetchScenarioById = createAsyncThunk("scenarios/fetchById", async (scenarioId: string) => {
  return scenariosApi.getScenarioById(scenarioId);
});
