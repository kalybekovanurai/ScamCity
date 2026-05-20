import "dotenv/config";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore, type WriteBatch } from "firebase-admin/firestore";
import { LEVELS_PER_CATEGORY } from "../src/config/levels";
import type { Category } from "../src/modules/categories";
import type { Scenario } from "../src/types";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "scamcity-c2cf1";
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const apiBaseUrl = process.env.VITE_API_BASE_URL ?? "https://nonfissile-pomaceous-anita.ngrok-free.dev";

initializeApp({
  credential: serviceAccountJson ? cert(JSON.parse(serviceAccountJson)) : applicationDefault(),
  projectId,
});

const db = getFirestore();

const commitInBatches = async <T>(items: T[], writeItem: (batch: WriteBatch, item: T) => void) => {
  for (let start = 0; start < items.length; start += 450) {
    const batch = db.batch();
    items.slice(start, start + 450).forEach((item) => writeItem(batch, item));
    await batch.commit();
  }
};

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

const categories = await getJson<Category[]>("/api/categories");
const scenarios = await getJson<Scenario[]>("/api/scenarios");

await commitInBatches(categories, (batch, category) => {
  batch.set(db.collection("categories").doc(String(category.lvl)), {
    ...category,
    levelsPerCategory: LEVELS_PER_CATEGORY,
    updatedAt: new Date().toISOString(),
  });
});

await commitInBatches(scenarios, (batch, scenario) => {
  batch.set(db.collection("scenarios").doc(scenario.id), {
    ...scenario,
    updatedAt: new Date().toISOString(),
  });
});

await db.collection("meta").doc("content").set({
  categoriesCount: categories.length,
  scenariosCount: scenarios.length,
  levelsPerCategory: LEVELS_PER_CATEGORY,
  updatedAt: new Date().toISOString(),
});

console.log(`Seeded ${categories.length} categories and ${scenarios.length} scenarios to Firestore.`);
