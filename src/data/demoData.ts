import type { Category } from "../modules/categories/types";
import type { ServerScenario } from "../modules/scenarios";

export const isDemoMode = () => import.meta.env.VITE_DEMO_MODE === "true";

export const demoCategories: Category[] = [
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

export const demoDiagnosticScenarios: ServerScenario[] = [
  {
    id: "1001",
    level: 1,
    subLevel: 1,
    type: "phishing",
    title: "Письмо о блокировке аккаунта",
    description: "Сервис просит срочно подтвердить карту, иначе аккаунт якобы заблокируют.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    difficulty: "easy",
    category: "phishing",
    is_scam: true,
    scenario_mode: "quiz",
    content: {
      type: "email",
      data: {
        from: "support@secure-payments.example",
        subject: "Ваш аккаунт будет заблокирован через 30 минут",
        body: "Для сохранения доступа срочно подтвердите карту по ссылке из письма.",
        buttonLabel: "Подтвердить карту",
      },
    },
    options: [
      { id: 1, text: "Проверить домен отправителя и открыть сервис вручную через приложение", action_type: "verify" },
      { id: 2, text: "Ввести карту, чтобы не потерять доступ", action_type: "trust" },
      { id: 3, text: "Ответить на письмо и попросить продлить срок", action_type: "reply" },
    ],
    correct_option_id: 1,
    feedback: "Верно: сначала проверяйте домен отправителя и заходите в сервис вручную.",
    explanation: "Фишинговые письма часто давят срочностью и ведут на похожие домены. Безопаснее открыть официальный сайт или приложение вручную.",
    verification_methods: [
      "Проверить домен отправителя.",
      "Не переходить по срочным ссылкам из письма.",
      "Открыть сервис вручную через приложение или официальный сайт.",
    ],
  },
  {
    id: "1002",
    level: 1,
    subLevel: 1,
    type: "phishing",
    title: "Сообщение о выигрыше",
    description: "Вам пишут, что вы выиграли приз, но нужно оплатить доставку прямо сейчас.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80",
    difficulty: "easy",
    category: "phishing",
    is_scam: true,
    scenario_mode: "quiz",
    content: {
      type: "message",
      data: {
        sender: "Prize Center",
        text: "Поздравляем! Вы выиграли смартфон. Оплатите доставку 299 сом в течение 10 минут.",
      },
    },
    options: [
      { id: 1, text: "Оплатить доставку, сумма небольшая", action_type: "pay" },
      { id: 2, text: "Проверить источник акции и не переводить деньги заранее", action_type: "verify" },
      { id: 3, text: "Отправить свои данные для оформления приза", action_type: "share_data" },
    ],
    correct_option_id: 2,
    feedback: "Верно: неожиданный выигрыш с предоплатой почти всегда требует проверки.",
    explanation: "Мошенники используют радость и ограничение по времени, чтобы пользователь быстрее отправил деньги или данные.",
    verification_methods: [
      "Проверить официальный сайт акции.",
      "Не переводить деньги за неожиданные выигрыши.",
      "Не отправлять паспортные или банковские данные в чат.",
    ],
  },
];

export const demoAdaptiveScenario: ServerScenario = {
  id: "9501",
  level: 1,
  subLevel: 2,
  type: "ai_deepfake",
  title: "Голосовое сообщение от сестры",
  description: "Голос звучит очень похоже на знакомого человека и просит деньги.",
  image: "",
  difficulty: "medium",
  category: "voice_clone",
  is_scam: true,
  scenario_mode: "mixed",
  content: {
    type: "message",
    platform: "Telegram",
    content_type: "chat",
    participants: [
      { id: "sister", name: "Айдана", role: "relative" },
      { id: "user", name: "Вы", role: "user" },
    ],
    messages: [
      { sender: "Айдана", role: "relative", text: "Ты дома? Срочно нужна помощь.", time: "20:11" },
      { sender: "Вы", role: "user", text: "Что случилось?", time: "20:12" },
      { sender: "Айдана", role: "relative", text: "Я не могу говорить долго, переведи 5000 сом на этот номер.", time: "20:13" },
      { sender: "Айдана", role: "relative", text: "Потом всё объясню.", time: "20:14" },
    ],
    attachments: [],
    ui_hints: {
      chat_style: "telegram",
      highlight_message_index: 2,
    },
    data: {},
  },
  options: [
    { id: 1, text: "Позвонить человеку через обычный номер и подтвердить ситуацию.", action_type: "verify" },
    { id: 2, text: "Сразу перевести деньги, потому что голос настоящий.", action_type: "trust" },
    { id: 3, text: "Полностью игнорировать сообщение.", action_type: "ignore" },
  ],
  correct_option_id: 1,
  feedback: "Верно: даже знакомый голос нужно проверять при срочных просьбах.",
  explanation: "AI-клоны голоса могут звучать очень реалистично. Безопаснее подтвердить ситуацию через обычный звонок или личный вопрос.",
  verification_methods: ["Позвонить напрямую.", "Задать личный вопрос.", "Не переводить деньги под давлением срочности."],
};

export const getAllDemoScenarios = () => [...demoDiagnosticScenarios, demoAdaptiveScenario];

export const getDemoScenarioById = (scenarioId: string | number) => {
  const id = String(scenarioId);
  return getAllDemoScenarios().find((scenario) => String(scenario.id) === id);
};

export const getDemoAnswer = (scenarioId: string | number, optionId: string | number) => {
  const scenario = getDemoScenarioById(scenarioId) ?? demoAdaptiveScenario;
  const selectedOptionId = String(optionId);
  const correctOptionId = String(scenario.correct_option_id ?? scenario.correctOptionId ?? scenario.correct_option ?? "");
  const selectedOption = scenario.options?.find((option) => String(option.id ?? option.option_id ?? option.optionId) === selectedOptionId);
  const isCorrect = selectedOptionId === correctOptionId;

  return {
    scenario_id: scenario.id,
    option_id: selectedOptionId,
    correct: isCorrect,
    feedback: selectedOption?.feedback ?? (isCorrect ? scenario.feedback : "Почти. В похожих ситуациях сначала проверяйте источник и не действуйте под давлением."),
    explanation: scenario.explanation,
    points: isCorrect ? 10 : 0,
  };
};

export const demoAnalytics = {
  feedback: "Demo mode: анализ построен локально. Обращайте внимание на срочность, просьбы о переводе денег, подозрительные ссылки и попытки вывести вас из официального канала связи.",
  weakest_category: "phishing",
  strongest_category: "verification",
  recommendations: [
    "Проверяйте домен отправителя и официальный канал связи.",
    "Не переводите деньги под давлением срочности.",
    "Подтверждайте личность собеседника через отдельный звонок.",
  ],
};

