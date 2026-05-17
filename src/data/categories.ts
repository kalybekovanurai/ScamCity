import type { ScenarioType } from "../types";

export const CATEGORIES: {
  lvl: number;
  type: ScenarioType;
  label: string;
  desc: string;
  accent: "emerald" | "blue" | "amber" | "violet" | "rose";
}[] = [
  {
    lvl: 1,
    type: "phishing",
    label: "Фишинг",
    desc: "Письма, ссылки, поддельные сайты и срочные уведомления.",
    accent: "emerald",
  },
  {
    lvl: 2,
    type: "social_engineering",
    label: "Социальная инженерия",
    desc: "Звонки, сообщения от знакомых, давление авторитетом и срочностью.",
    accent: "blue",
  },
  {
    lvl: 3,
    type: "infobiz",
    label: "Инфобизнес и инвестиции",
    desc: "Курсы, трейдинг, крипта, обещания быстрого дохода.",
    accent: "amber",
  },
  {
    lvl: 4,
    type: "ai_deepfake",
    label: "AI-мошенничество",
    desc: "Дипфейки, голосовые клоны, фейковые боты и генеративный контент.",
    accent: "violet",
  },
  {
    lvl: 5,
    type: "darkweb",
    label: "Утечки и Dark Web",
    desc: "Пароли, вымогательство, базы данных и теневые угрозы.",
    accent: "rose",
  },
];

export const LEVELS_PER_CATEGORY = 10;

