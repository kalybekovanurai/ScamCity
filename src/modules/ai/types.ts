import type { ServerScenario } from "../scenarios";

export type AiScenarioResponse =
  | string
  | ServerScenario
  | {
      scenario?: ServerScenario;
      data?: ServerScenario;
      result?: ServerScenario;
    };
