import type { AxiosError } from "axios";
import { API_BASE_URL } from "../api/client";

export type DataSourceMode = "api" | "mock" | "auto";
export type ActiveDataSource = "api" | "mock";

export type DataSourceState = {
  mode: DataSourceMode;
  activeSource: ActiveDataSource;
  backendAvailable: boolean | null;
};

type EnvMap = Record<string, string | undefined>;
type Subscriber = (state: DataSourceState) => void;

const getEnv = (): EnvMap => ((import.meta as unknown as { env?: EnvMap }).env ?? {});

const normalizeMode = (value: string | undefined): DataSourceMode => {
  if (value === "api" || value === "mock" || value === "auto") return value;
  return "auto";
};

export const getConfiguredDataSourceMode = (): DataSourceMode => {
  const env = getEnv();
  if (env.NEXT_PUBLIC_DATA_SOURCE) return normalizeMode(env.NEXT_PUBLIC_DATA_SOURCE);
  if (env.VITE_DATA_SOURCE) return normalizeMode(env.VITE_DATA_SOURCE);
  if (env.VITE_DEMO_MODE === "true") return "mock";
  return "auto";
};

export const shouldShowDemoBadge = () => {
  const env = getEnv();
  return env.NEXT_PUBLIC_SHOW_DEMO_BADGE === "true" || env.VITE_SHOW_DEMO_BADGE === "true";
};

let dataSourceState: DataSourceState = {
  mode: getConfiguredDataSourceMode(),
  activeSource: getConfiguredDataSourceMode() === "mock" ? "mock" : "api",
  backendAvailable: getConfiguredDataSourceMode() === "mock" ? false : null,
};

let availabilityPromise: Promise<boolean> | null = null;
const subscribers = new Set<Subscriber>();

const notifySubscribers = () => subscribers.forEach((subscriber) => subscriber(dataSourceState));

export const getDataSourceState = () => dataSourceState;

export const subscribeDataSource = (subscriber: Subscriber) => {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
};

export const setDataSourceStateForTests = (nextState: DataSourceState) => {
  dataSourceState = nextState;
  availabilityPromise = null;
  notifySubscribers();
};

const setActiveSource = (activeSource: ActiveDataSource, backendAvailable: boolean | null) => {
  dataSourceState = { ...dataSourceState, activeSource, backendAvailable };
  notifySubscribers();
};

export const resetDataSourceSession = () => {
  const mode = getConfiguredDataSourceMode();
  availabilityPromise = null;
  dataSourceState = {
    mode,
    activeSource: mode === "mock" ? "mock" : "api",
    backendAvailable: mode === "mock" ? false : null,
  };
  notifySubscribers();
};

const buildApiUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
};

export const fetchWithTimeout = async (url: string, init: RequestInit = {}, timeoutMs = 4000) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal, headers: { "ngrok-skip-browser-warning": "true", ...(init.headers ?? {}) } });
  } finally {
    window.clearTimeout(timeout);
  }
};

export const isBackendAvailable = async () => {
  if (typeof window === "undefined") return false;

  const healthPaths = ["/health", "/api/health"];
  for (const path of healthPaths) {
    try {
      const response = await fetchWithTimeout(buildApiUrl(path), { method: "GET" }, 4000);
      if (response.ok) return true;
    } catch {
      // Try the next health endpoint or fall through to unavailable.
    }
  }

  return false;
};

const ensureDataSourceInitialized = async () => {
  if (dataSourceState.mode === "api" || dataSourceState.mode === "mock") return dataSourceState;
  if (dataSourceState.backendAvailable !== null) return dataSourceState;

  availabilityPromise ??= isBackendAvailable();
  const available = await availabilityPromise;

  if (available) {
    setActiveSource("api", true);
  } else {
    console.warn("[DataSource] Backend unavailable. Switched to mock data.");
    setActiveSource("mock", false);
  }

  return dataSourceState;
};

export const activateMockSource = () => {
  if (dataSourceState.mode === "api") return;
  console.warn("[DataSource] Backend request failed. Switched to mock data.");
  setActiveSource("mock", false);
};

const getStatus = (error: unknown) => {
  const axiosError = error as AxiosError | undefined;
  const responseStatus = axiosError?.response?.status;
  if (typeof responseStatus === "number") return responseStatus;

  const genericError = error as { status?: unknown; response?: { status?: unknown } } | undefined;
  if (typeof genericError?.status === "number") return genericError.status;
  if (typeof genericError?.response?.status === "number") return genericError.response.status;

  return null;
};

export const shouldFallbackToMock = (error: unknown) => {
  const status = getStatus(error);
  if (status !== null) return status >= 500;

  const axiosError = error as AxiosError | undefined;
  if (axiosError?.code === "ECONNABORTED" || axiosError?.code === "ERR_NETWORK") return true;
  if (axiosError?.name === "AbortError") return true;
  if (axiosError?.request && !axiosError?.response) return true;

  const genericError = error as { name?: string; code?: string } | undefined;
  return genericError?.name === "AbortError" || genericError?.code === "ETIMEDOUT";
};

export async function executeWithFallback<T>(apiRequest: () => Promise<T>, mockRequest: () => Promise<T> | T): Promise<T> {
  const state = await ensureDataSourceInitialized();

  if (state.mode === "mock" || state.activeSource === "mock") {
    return mockRequest();
  }

  try {
    return await apiRequest();
  } catch (error) {
    if (state.mode === "auto" && shouldFallbackToMock(error)) {
      activateMockSource();
      return mockRequest();
    }

    throw error;
  }
}
