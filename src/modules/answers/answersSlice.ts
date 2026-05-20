import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { submitAnswer } from "./answersThunk";
import type { AnswersState, SubmitAnswerResponse } from "./types";

const initialState: AnswersState = {
  lastSubmission: null,
  status: "idle",
  error: null,
};

export const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    setLastSubmission: (state, action: PayloadAction<SubmitAnswerResponse | null>) => {
      state.lastSubmission = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastSubmission = action.payload;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to submit answer";
      });
  },
});

export const { setLastSubmission } = answersSlice.actions;
export const answersReducer = answersSlice.reducer;

export const selectAnswersState = (state: { answers: AnswersState }) => state.answers;
export const selectLastAnswerSubmission = createSelector(selectAnswersState, (answers) => answers.lastSubmission);
export const selectAnswerSubmissionStatus = createSelector(selectAnswersState, (answers) => answers.status);
export const selectAnswerSubmissionError = createSelector(selectAnswersState, (answers) => answers.error);
