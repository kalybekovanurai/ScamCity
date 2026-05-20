import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Scenario } from "../../types";
import { fetchScenarioById, fetchScenarios, fetchScenariosByLevel, fetchScenariosByType } from "./scenariosThunk";
import type { ScenariosState } from "./types";

const initialState: ScenariosState = {
  items: [],
  selectedScenario: null,
  status: "idle",
  error: null,
};

export const scenariosSlice = createSlice({
  name: "scenarios",
  initialState,
  reducers: {
    setScenarios: (state, action: PayloadAction<Scenario[]>) => {
      state.items = action.payload;
    },
    setSelectedScenario: (state, action: PayloadAction<Scenario | null>) => {
      state.selectedScenario = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScenarios.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchScenarios.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchScenarios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch scenarios";
      })
      .addCase(fetchScenariosByType.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchScenariosByLevel.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchScenarioById.fulfilled, (state, action) => {
        state.selectedScenario = action.payload;
      });
  },
});

export const { setScenarios, setSelectedScenario } = scenariosSlice.actions;
export const scenariosReducer = scenariosSlice.reducer;

export const selectScenariosState = (state: { scenarios: ScenariosState }) => state.scenarios;
export const selectScenarios = createSelector(selectScenariosState, (scenarios) => scenarios.items);
export const selectSelectedScenario = createSelector(selectScenariosState, (scenarios) => scenarios.selectedScenario);
export const selectScenariosStatus = createSelector(selectScenariosState, (scenarios) => scenarios.status);
export const selectScenariosByType = (scenarioType: string) =>
  createSelector(selectScenarios, (scenarios) => scenarios.filter((scenario) => scenario.type === scenarioType));
export const selectScenariosByLevel = (level: number) =>
  createSelector(selectScenarios, (scenarios) => scenarios.filter((scenario) => scenario.level === level));
export const selectScenarioById = (scenarioId: string) =>
  createSelector(selectScenarios, (scenarios) => scenarios.find((scenario) => scenario.id === scenarioId) ?? null);
