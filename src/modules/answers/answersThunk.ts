import { createAsyncThunk } from "@reduxjs/toolkit";
import { answersApi } from "./answersApi";
import type { SubmitAnswerPayload } from "./types";

export const submitAnswer = createAsyncThunk("answers/submit", async (payload: SubmitAnswerPayload) => {
  return answersApi.submitAnswer(payload);
});
