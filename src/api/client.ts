import axios, { AxiosError, type AxiosInstance } from "axios";

type AppLanguage = "ru" | "ky";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configuredApiUrl ||
  (import.meta.env.DEV ? "" : configuredApiBaseUrl || "https://nonfissile-pomaceous-anita.ngrok-free.dev");

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 7000,
});

const getStoredLanguage = (): AppLanguage => {
  try {
    const language = localStorage.getItem("scam-city-language");
    return language === "ky" ? "ky" : "ru";
  } catch {
    return "ru";
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const { auth } = await import("../lib/firebase");
    const token = await auth?.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const language = getStoredLanguage();
    config.headers["Accept-Language"] = language;
    config.params = {
      ...(config.params || {}),
      lang: language,
    };

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
