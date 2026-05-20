import { configureStore } from "@reduxjs/toolkit";
import { analyticsReducer } from "../modules/analytics";
import { answersReducer } from "../modules/answers";
import { categoriesReducer } from "../modules/categories";
import { levelsReducer } from "../modules/levels";
import { progressReducer } from "../modules/progress";
import { scenariosReducer } from "../modules/scenarios";

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    answers: answersReducer,
    categories: categoriesReducer,
    levels: levelsReducer,
    progress: progressReducer,
    scenarios: scenariosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
