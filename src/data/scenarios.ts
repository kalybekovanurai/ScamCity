import type { ContentType, Scenario, ScenarioType } from "../types";

const images: Record<ScenarioType, string[]> = {
  phishing: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=900",
  ],
  social_engineering: [
    "https://images.unsplash.com/photo-1577563908411-5077b6ac7624?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=900",
  ],
  infobiz: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=900",
  ],
  ai_deepfake: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1620712943543-bcc4628c675c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=900",
  ],
  darkweb: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=900",
  ],
};

type ScenarioSeed = {
  type: ScenarioType;
  contentType: ContentType;
  title: string;
  description: string;
  data: Scenario["content"]["data"];
  correct: string;
  distractors: string[];
  feedback: string;
  explanation: string;
};

const seeds: Record<ScenarioType, ScenarioSeed[]> = {
  phishing: [
    {
      type: "phishing",
      contentType: "email",
      title: "Письмо о блокировке аккаунта",
      description: "Сервис просит срочно подтвердить карту, иначе аккаунт якобы заблокируют.",
      data: {
        from: "Netflix Billing <support@netflix-payments.co>",
        subject: "Последнее предупреждение: платеж не прошел",
        body: "Мы не смогли списать оплату. Подтвердите карту по ссылке в течение 2 часов, чтобы сохранить подписку.",
        buttonLabel: "Подтвердить оплату",
      },
      correct: "Проверить домен отправителя и открыть сервис вручную через приложение",
      distractors: ["Ввести карту, чтобы не потерять доступ", "Ответить на письмо и попросить продлить срок"],
      feedback: "Верно: похожий домен и срочность почти всегда требуют отдельной проверки.",
      explanation: "Фишинговые письма давят временем и ведут на похожие домены. Безопаснее открыть официальный сайт вручную.",
    },
    {
      type: "phishing",
      contentType: "website",
      title: "Поддельная страница входа",
      description: "Страница выглядит как банк, но адрес в браузере отличается от официального.",
      data: {
        url: "https://secure-bank-login.kz.verify-session.com",
        headline: "Восстановление доступа",
        body: "Введите логин, пароль и SMS-код, чтобы отменить подозрительный перевод.",
      },
      correct: "Закрыть страницу и позвонить в банк по номеру с карты",
      distractors: ["Ввести SMS-код, ведь это отмена перевода", "Сохранить страницу в закладки на будущее"],
      feedback: "Отлично: банк не просит полный набор данных на странном домене.",
      explanation: "Адрес сайта важнее внешнего сходства. Поддомены мошенников часто прячут слово bank или secure в длинном URL.",
    },
    {
      type: "phishing",
      contentType: "message",
      title: "Сообщение о доставке",
      description: "Курьерская служба просит оплатить небольшую пошлину через короткую ссылку.",
      data: {
        sender: "Post Express",
        text: "Посылка задержана. Оплатите 490 ₸ по ссылке bit.ly/post-check-882 до конца дня.",
      },
      correct: "Проверить трек-номер на официальном сайте службы доставки",
      distractors: ["Оплатить маленькую сумму, чтобы не рисковать посылкой", "Переслать ссылку другу и спросить, открывается ли она"],
      feedback: "Да: короткие ссылки в платежных сообщениях лучше проверять через официальный сайт.",
      explanation: "Маленькая сумма снижает бдительность, а ссылка может украсть карту или данные входа.",
    },
    {
      type: "phishing",
      contentType: "ad",
      title: "QR-код с призом",
      description: "На плакате и в чате предлагают отсканировать QR-код для получения подарка.",
      data: {
        headline: "Вы выиграли бонус",
        body: "Отсканируйте QR-код и войдите через почту, чтобы получить приз до полуночи.",
      },
      correct: "Не вводить логин после QR-кода и проверить акцию на официальном сайте",
      distractors: ["Войти через почту, потому что приз скоро исчезнет", "Отправить QR-код друзьям, чтобы проверить вместе"],
      feedback: "Верно: QR-код может вести на фишинговую страницу, даже если плакат выглядит убедительно.",
      explanation: "QR-фишинг прячет ссылку от глаз. Перед входом в аккаунт всегда проверяйте адрес сайта и источник акции.",
    },
  ],
  social_engineering: [
    {
      type: "social_engineering",
      contentType: "message",
      title: "Просьба от руководителя",
      description: "В мессенджере пишут от имени начальника и требуют срочный перевод поставщику.",
      data: {
        sender: "Директор",
        text: "Я на встрече, звонить нельзя. Срочно переведи 150 000 ₸ на этот номер, документы позже.",
      },
      correct: "Подтвердить просьбу другим каналом связи до любых действий",
      distractors: ["Перевести деньги, потому что пишет руководитель", "Попросить номер карты и сделать перевод частями"],
      feedback: "Верно: другой канал связи ломает сценарий давления авторитетом.",
      explanation: "Социальная инженерия часто имитирует знакомого человека и запрещает звонить, чтобы не дать проверить просьбу.",
    },
    {
      type: "social_engineering",
      contentType: "message",
      title: "Код из SMS",
      description: "Человек представляется поддержкой и просит назвать одноразовый код.",
      data: {
        sender: "Поддержка банка",
        text: "Мы защищаем ваш счет. Назовите код из SMS, чтобы отменить вход мошенника.",
      },
      correct: "Никому не сообщать код и самостоятельно связаться с банком",
      distractors: ["Назвать код, если оператор знает ваше имя", "Попросить оператора прислать еще один код"],
      feedback: "Точно: одноразовый код никогда не нужен настоящему сотруднику.",
      explanation: "Код из SMS подтверждает действие. Если передать его, злоумышленник может войти или провести операцию.",
    },
    {
      type: "social_engineering",
      contentType: "message",
      title: "Друг просит в долг",
      description: "Профиль знакомого пишет странным стилем и просит срочно занять деньги.",
      data: {
        sender: "Аружан",
        text: "Привет срочно надо 30к до вечера, телефон сел, скинь сюда, потом объясню.",
      },
      correct: "Задать личный вопрос или позвонить знакомому напрямую",
      distractors: ["Отправить деньги, если фото профиля совпадает", "Попросить обещание вернуть завтра"],
      feedback: "Да: личная проверка быстро показывает, кто реально пишет.",
      explanation: "Взломанные аккаунты используют доверие к знакомому человеку. Манера речи и срочность являются сигналами риска.",
    },
  ],
  infobiz: [
    {
      type: "infobiz",
      contentType: "ad",
      title: "Гарантированный доход",
      description: "Реклама обещает стабильную прибыль без навыков и риска.",
      data: {
        headline: "Пассивный доход 20% в неделю",
        body: "Мы торгуем за вас. Мест осталось мало, вход сегодня со скидкой 70%.",
      },
      correct: "Искать независимые отзывы, лицензию и прозрачные условия возврата",
      distractors: ["Купить доступ, пока действует скидка", "Внести минимальный депозит, чтобы проверить"],
      feedback: "Верно: гарантированная высокая доходность без риска является красным флагом.",
      explanation: "Инвестскамы продают ощущение упущенной выгоды. Реальные инвестиции не гарантируют высокий доход.",
    },
    {
      type: "infobiz",
      contentType: "website",
      title: "Закрытый клуб трейдеров",
      description: "Лендинг показывает скриншоты прибыли и обещает личного наставника.",
      data: {
        url: "https://fast-crypto-mentor.pro",
        headline: "Сделаем из вас трейдера за 7 дней",
        body: "Оплатите пакет VIP, и куратор будет давать сигналы с точностью 96%.",
      },
      correct: "Попросить договор, методику, риски и проверить юридическое лицо",
      distractors: ["Верить скриншотам прибыли", "Покупать VIP, потому что точность выше"],
      feedback: "Хороший ход: документы и риски важнее красивых скриншотов.",
      explanation: "Скриншоты легко подделать. Прозрачность условий и ответственность продавца важнее обещаний.",
    },
    {
      type: "infobiz",
      contentType: "message",
      title: "Менеджер давит скидкой",
      description: "После вебинара менеджер пишет, что цена вырастет через 15 минут.",
      data: {
        sender: "Куратор курса",
        text: "Вижу, вы сомневаетесь. Сейчас последняя цена. Через 15 минут будет в 3 раза дороже.",
      },
      correct: "Взять паузу и не принимать финансовое решение под давлением",
      distractors: ["Оплатить рассрочку, чтобы закрепить цену", "Попросить скидку больше и купить быстрее"],
      feedback: "Да: давление дедлайном мешает спокойно оценить продукт.",
      explanation: "Искусственный дефицит часто используется, чтобы отключить критическое мышление.",
    },
  ],
  ai_deepfake: [
    {
      type: "ai_deepfake",
      contentType: "video",
      title: "Видеозвонок от родственника",
      description: "На видео похожий человек просит срочно перевести деньги.",
      data: {
        caller: "Мама",
        text: "Я потеряла кошелек, не могу говорить долго. Скинь деньги на этот номер.",
      },
      correct: "Использовать семейное кодовое слово или перезвонить на сохраненный номер",
      distractors: ["Перевести деньги, если лицо и голос похожи", "Попросить показать паспорт в камеру"],
      feedback: "Верно: кодовое слово и звонок на старый номер лучше распознавания на глаз.",
      explanation: "Дипфейки и голосовые клоны могут выглядеть убедительно, поэтому нужна проверка вне текущего звонка.",
    },
    {
      type: "ai_deepfake",
      contentType: "ad",
      title: "Видео знаменитости про инвестиции",
      description: "Известный человек в ролике якобы рекомендует платформу с быстрым доходом.",
      data: {
        headline: "Официальный проект при поддержке звезды",
        body: "Посмотрите, как он лично показывает вывод прибыли за 5 минут.",
      },
      correct: "Проверить заявление в официальных аккаунтах и СМИ",
      distractors: ["Верить ролику, если артикуляция совпадает", "Переходить по ссылке из рекламы"],
      feedback: "Да: внешнее сходство ролика больше не является доказательством.",
      explanation: "AI-видео используют доверие к публичным людям. Подтверждение должно быть в независимых официальных источниках.",
    },
    {
      type: "ai_deepfake",
      contentType: "message",
      title: "Бот службы поддержки",
      description: "Чат-бот уверенно просит загрузить фото документов для ускоренной проверки.",
      data: {
        sender: "AI Support",
        text: "Для безопасности отправьте фото удостоверения и селфи с картой. Проверка займет 30 секунд.",
      },
      correct: "Проверить, что чат открыт внутри официального приложения",
      distractors: ["Отправить документы, если бот отвечает грамотно", "Замазать часть номера карты и отправить"],
      feedback: "Точно: уверенный текст бота не доказывает, что это официальный канал.",
      explanation: "Фейковые AI-боты могут звучать профессионально, но собирают документы для кражи личности.",
    },
  ],
  darkweb: [
    {
      type: "darkweb",
      contentType: "message",
      title: "Письмо с вашим старым паролем",
      description: "Вымогатель показывает пароль из утечки и требует криптовалюту.",
      data: {
        sender: "Security Notice",
        text: "Мы знаем ваш пароль qwerty2019. Заплатите 0.02 BTC, иначе отправим данные всем контактам.",
      },
      correct: "Сменить пароли, включить 2FA и проверить утечки",
      distractors: ["Заплатить, раз пароль настоящий", "Ответить и попросить доказательства"],
      feedback: "Верно: старый пароль из утечки не доказывает новый взлом устройства.",
      explanation: "Вымогатели часто используют базы старых паролей. Главная реакция — смена паролей и защита аккаунтов.",
    },
    {
      type: "darkweb",
      contentType: "email",
      title: "Предложение купить базу клиентов",
      description: "В письме предлагают дешево купить базу с телефонами и картами лояльности.",
      data: {
        from: "market@data-leak.store",
        subject: "Свежая база вашего города",
        body: "Телефоны, адреса, покупки. Можно использовать для рекламы без ограничений.",
      },
      correct: "Не покупать данные и сообщить ответственному за безопасность",
      distractors: ["Купить базу для проверки качества", "Ответить продавцу с рабочей почты"],
      feedback: "Правильно: покупка утекших данных незаконна и опасна для организации.",
      explanation: "Контакт с продавцами утечек создает юридические и репутационные риски.",
    },
    {
      type: "darkweb",
      contentType: "website",
      title: "Форум с инструментом взлома",
      description: "Сайт предлагает скачать архив для проверки чужих паролей.",
      data: {
        url: "https://leak-tools.example",
        headline: "Проверка паролей без регистрации",
        body: "Скачайте архив, запустите файл и загрузите список email.",
      },
      correct: "Не скачивать архив и использовать легальные сервисы проверки утечек",
      distractors: ["Запустить файл в рабочей сети", "Скачать и проверить антивирусом позже"],
      feedback: "Да: такие архивы часто сами являются вредоносными.",
      explanation: "Инструменты с теневых форумов могут заражать устройство или красть данные пользователя.",
    },
  ],
};

const rotateOptions = (options: Scenario["options"], offset: number) => [
  ...options.slice(offset % options.length),
  ...options.slice(0, offset % options.length),
];

const makeScenario = (seed: ScenarioSeed, level: number, subLevel: number, index: number): Scenario => {
  const options: Scenario["options"] = [
    {
      id: "correct",
      text: seed.correct,
      isCorrect: true,
      feedback: seed.feedback,
    },
    ...seed.distractors.map((text, distractorIndex) => ({
      id: `wrong-${distractorIndex + 1}`,
      text,
      isCorrect: false,
      feedback: "Это рискованное действие: мошенники как раз рассчитывают на спешку, доверие или страх.",
    })),
  ];

  return {
    id: `l${level}-s${subLevel}-q${index + 1}`,
    level,
    subLevel,
    type: seed.type,
    title: seed.title,
    description: seed.description,
    image: images[seed.type][(subLevel + index) % images[seed.type].length],
    content: {
      type: seed.contentType,
      data: seed.data,
    },
    options: rotateOptions(options, subLevel + index),
    explanation: seed.explanation,
  };
};

export const SCENARIOS: Scenario[] = Object.entries(seeds).flatMap(([, categorySeeds], categoryIndex) => {
  const level = categoryIndex + 1;
  return Array.from({ length: 10 }).flatMap((_, subIndex) =>
    categorySeeds.map((seed, questionIndex) => makeScenario(seed, level, subIndex + 1, questionIndex)),
  );
});
