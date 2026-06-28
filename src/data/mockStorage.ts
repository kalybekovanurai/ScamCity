import type { AnswersByType, CategoryProgress, Theme } from "../types";
import { createEmptyAnswers } from "../utils/progress";

export const isBrowser = typeof window !== "undefined";

export const MOCK_STORAGE_KEYS = {
  user: "shumkar_mock_user",
  progress: "shumkar_mock_progress",
  mistakes: "shumkar_mock_mistakes",
  inventory: "shumkar_mock_inventory",
  friends: "shumkar_mock_friends",
  dailyReward: "shumkar_mock_daily_reward",
} as const;

export type MockUser = {
  id: "demo-user";
  username: string;
  email: string;
  level: number;
  subLevel: number;
  xp: number;
  rank: string;
  correctPercent: number;
};

export type MockInventoryItem = {
  id: string;
  title: string;
  owned: boolean;
  equipped?: boolean;
};

export type MockFriend = {
  id: string;
  name: string;
  xp: number;
  online: boolean;
};

export type MockDailyReward = {
  streak: number;
  claimedToday: boolean;
  rewardXp: number;
};

export type MockProgress = {
  xp: number;
  theme: Theme;
  categoryProgress: CategoryProgress;
  masteredQuestions: string[];
  answers: AnswersByType;
};

export const initialMockUser: MockUser = {
  id: "demo-user",
  username: "Agent #8291",
  email: "demo@scamcity.local",
  level: 1,
  subLevel: 2,
  xp: 100,
  rank: "Новичок",
  correctPercent: 67,
};

export const initialMockProgress: MockProgress = {
  xp: 100,
  theme: "light",
  categoryProgress: {
    1: [1],
    2: [],
    3: [],
    4: [],
    5: [],
  },
  masteredQuestions: ["1001"],
  answers: {
    ...createEmptyAnswers(),
    phishing: { correct: 2, total: 3 },
    ai_deepfake: { correct: 1, total: 1 },
  },
};

export const initialMockInventory: MockInventoryItem[] = [
  { id: "shield-basic", title: "Базовый щит", owned: true, equipped: true },
  { id: "focus-boost", title: "Фокус-буст", owned: true },
  { id: "city-badge", title: "Значок ScamCity", owned: false },
];

export const initialMockFriends: MockFriend[] = [
  { id: "friend-1", name: "Aruuke", xp: 420, online: true },
  { id: "friend-2", name: "Nurai", xp: 380, online: false },
  { id: "friend-3", name: "Demo Agent", xp: 260, online: true },
];

export const initialMockDailyReward: MockDailyReward = {
  streak: 3,
  claimedToday: false,
  rewardXp: 25,
};

const readJson = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const mockStorage = {
  getUser: () => readJson(MOCK_STORAGE_KEYS.user, initialMockUser),
  setUser: (user: MockUser) => writeJson(MOCK_STORAGE_KEYS.user, user),

  getProgress: () => readJson(MOCK_STORAGE_KEYS.progress, initialMockProgress),
  setProgress: (progress: MockProgress) => writeJson(MOCK_STORAGE_KEYS.progress, progress),

  getInventory: () => readJson(MOCK_STORAGE_KEYS.inventory, initialMockInventory),
  setInventory: (inventory: MockInventoryItem[]) => writeJson(MOCK_STORAGE_KEYS.inventory, inventory),

  getFriends: () => readJson(MOCK_STORAGE_KEYS.friends, initialMockFriends),
  setFriends: (friends: MockFriend[]) => writeJson(MOCK_STORAGE_KEYS.friends, friends),

  getDailyReward: () => readJson(MOCK_STORAGE_KEYS.dailyReward, initialMockDailyReward),
  setDailyReward: (reward: MockDailyReward) => writeJson(MOCK_STORAGE_KEYS.dailyReward, reward),
};

export const resetMockData = () => {
  if (!isBrowser) return;
  Object.values(MOCK_STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
  mockStorage.getUser();
  mockStorage.getProgress();
  mockStorage.getInventory();
  mockStorage.getFriends();
  mockStorage.getDailyReward();
};

export const createDemoUser = () => mockStorage.getUser();
