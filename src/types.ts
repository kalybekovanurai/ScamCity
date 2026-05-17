export type Theme = "light" | "dark";

export type ScenarioType =
  | "phishing"
  | "social_engineering"
  | "infobiz"
  | "ai_deepfake"
  | "darkweb";

export type ContentType = "email" | "message" | "website" | "video" | "ad";

export interface Scenario {
  id: string;
  level: number;
  subLevel: number;
  type: ScenarioType;
  title: string;
  description: string;
  image: string;
  content: {
    type: ContentType;
    data: {
      from?: string;
      subject?: string;
      body?: string;
      buttonLabel?: string;
      sender?: string;
      text?: string;
      headline?: string;
      url?: string;
      caller?: string;
    };
  };
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  explanation: string;
}

export interface CategoryProgress {
  [categoryLevel: number]: number[];
}

export interface AnswerStats {
  correct: number;
  total: number;
}

export type AnswersByType = Record<ScenarioType, AnswerStats>;

export interface SessionResult {
  id: string;
  title: string;
  correct: boolean;
  selectedText: string;
  correctText: string;
  explanation: string;
}
