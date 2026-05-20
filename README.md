# Scam City

Крошечный обучающий веб‑приложение на React + TypeScript с бэкенд-интеграцией через Firebase.

## Краткое описание

Scam City — клиентское приложение, состоящее из сценариев и миссий, аналитики и модулей AI. Проект использует Vite для разработки, Firebase (Firestore + Hosting) для хранения и хостинга и содержит отдельные API-эндпойнты в `api/`.

## Быстрый старт

1. Клонируйте репозиторий и установите зависимости:

```bash
git clone <repo-url>
cd Scam-City
npm install
```

2. Локальная разработка:

```bash
npm run dev
```

Откройте `http://localhost:5173` (по умолчанию для Vite).

3. Сборка для продакшна:

```bash
npm run build
npm run preview   # опционально - посмотреть собранную версию локально
```

## Конфигурация окружения

Проект использует Firebase и, возможно, другие секреты/ключи. Создайте файл окружения (например `.env`) и добавьте необходимые переменные (пример):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Проверьте `src/lib/firebase.ts` и `firebase.json` для дополнительных настроек.

## Структура проекта (основное)

- `src/` — исходники клиентской части
  - `app/` — глобальные хранилища, роутер, хуки
  - `components/` — UI и страницы (Lobby, ScenarioView, ProfileView и др.)
  - `modules/` — доменные модули (ai, analytics, scenarios и т.д.)
  - `api/` — клиентские обёртки для API
  - `lib/` — интеграции (например `firebase.ts`)

- `api/` — serverless-эндпойнты (если используются в проекте)
- `scripts/seed-firestore.ts` — скрипт заполнения Firestore тестовыми данными

## Развертывание

В этом репозитории присутствуют конфигурации для Firebase Hosting (`firebase.json`) и Vercel (`vercel.json`). Используйте тот провайдер, который подходит вам.

Пример деплоя на Firebase Hosting:

```bash
firebase deploy --only hosting
```

Если вы используете Vercel, подключите репозиторий в дашборде Vercel и укажите переменные окружения.

## Команды npm (из `package.json`)

- `npm run dev` — запуск разработки (Vite)
- `npm run build` — сборка
- `npm run preview` — просмотр собранной сборки
- `npm run lint` — (если есть) запуск линтинга
- `npm run test` — (если есть) запуск тестов


