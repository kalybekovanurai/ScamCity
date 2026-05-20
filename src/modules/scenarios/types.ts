import type { Scenario } from "../../types";

export type ScenariosStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ScenariosState {
  items: Scenario[];
  selectedScenario: Scenario | null;
  status: ScenariosStatus;
  error: string | null;
}
