import type { Theme } from "../../../types";

export type ChatStyle = {
  page: string;
  pageDark: string;
  header: string;
  headerDark: string;
  userBubble: string;
  userBubbleDark: string;
  otherBubble: string;
  otherBubbleDark: string;
  name: string;
  icon: string;
};

const normalizeChatStyle = (value?: string) => {
  if (!value) return "default";

  const key = value.toLowerCase();

  if (key.includes("telegram")) return "telegram";
  if (key.includes("webinar")) return "webinar";
  if (key.includes("instagram")) return "instagram";
  if (key.includes("whatsapp")) return "whatsapp";
  if (key.includes("email")) return "email";
  if (key.includes("marketplace")) return "marketplace";
  if (key.includes("discord")) return "discord";
  if (key.includes("security")) return "security_app";

  return "default";
};

export const chatStyles: Record<string, ChatStyle> = {
  telegram: {
    page: "bg-sky-50",
    pageDark: "bg-slate-950",
    header: "bg-sky-600",
    headerDark: "bg-sky-950",
    userBubble: "bg-sky-600 text-white",
    userBubbleDark: "bg-sky-600 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Telegram",
    icon: "TG",
  },
  webinar: {
    page: "bg-violet-50",
    pageDark: "bg-slate-950",
    header: "bg-violet-700",
    headerDark: "bg-violet-950",
    userBubble: "bg-violet-600 text-white",
    userBubbleDark: "bg-violet-600 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Webinar",
    icon: "WB",
  },
  instagram: {
    page: "bg-pink-50",
    pageDark: "bg-slate-950",
    header: "bg-pink-600",
    headerDark: "bg-pink-950",
    userBubble: "bg-pink-600 text-white",
    userBubbleDark: "bg-pink-600 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Instagram Direct",
    icon: "IG",
  },
  whatsapp: {
    page: "bg-emerald-50",
    pageDark: "bg-slate-950",
    header: "bg-emerald-600",
    headerDark: "bg-emerald-950",
    userBubble: "bg-emerald-600 text-white",
    userBubbleDark: "bg-emerald-600 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "WhatsApp",
    icon: "WA",
  },
  email: {
    page: "bg-slate-100",
    pageDark: "bg-slate-950",
    header: "bg-slate-800",
    headerDark: "bg-slate-950",
    userBubble: "bg-slate-700 text-white",
    userBubbleDark: "bg-slate-700 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Email",
    icon: "EM",
  },
  marketplace: {
    page: "bg-orange-50",
    pageDark: "bg-slate-950",
    header: "bg-orange-500",
    headerDark: "bg-orange-950",
    userBubble: "bg-orange-500 text-white",
    userBubbleDark: "bg-orange-600 text-white",
    otherBubble: "border border-orange-100 bg-white text-slate-900",
    otherBubbleDark: "border border-orange-900/50 bg-slate-900 text-slate-100",
    name: "Marketplace",
    icon: "MP",
  },
  discord: {
    page: "bg-indigo-50",
    pageDark: "bg-slate-950",
    header: "bg-indigo-700",
    headerDark: "bg-indigo-950",
    userBubble: "bg-indigo-600 text-white",
    userBubbleDark: "bg-indigo-600 text-white",
    otherBubble: "bg-slate-800 text-white",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Discord",
    icon: "DC",
  },
  security_app: {
    page: "bg-slate-100",
    pageDark: "bg-slate-950",
    header: "bg-red-700",
    headerDark: "bg-red-950",
    userBubble: "bg-slate-700 text-white",
    userBubbleDark: "bg-slate-700 text-white",
    otherBubble: "border border-red-100 bg-white text-slate-900",
    otherBubbleDark: "border border-red-900/50 bg-slate-900 text-slate-100",
    name: "Security Alert",
    icon: "SC",
  },
  default: {
    page: "bg-slate-100",
    pageDark: "bg-slate-950",
    header: "bg-purple-600",
    headerDark: "bg-violet-950",
    userBubble: "bg-purple-600 text-white",
    userBubbleDark: "bg-violet-600 text-white",
    otherBubble: "bg-white text-slate-900",
    otherBubbleDark: "border border-slate-700 bg-slate-900 text-slate-100",
    name: "Chat",
    icon: "AI",
  },
};

export const getChatStyle = (styleKey?: string, platform?: string) => {
  const key = normalizeChatStyle(styleKey || platform);
  return chatStyles[key] || chatStyles.default;
};

export const getThemedChatClasses = (style: ChatStyle, theme: Theme) => ({
  page: theme === "dark" ? style.pageDark : style.page,
  header: theme === "dark" ? style.headerDark : style.header,
  userBubble: theme === "dark" ? style.userBubbleDark : style.userBubble,
  otherBubble: theme === "dark" ? style.otherBubbleDark : style.otherBubble,
});
