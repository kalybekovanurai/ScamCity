import "dotenv/config";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore, type WriteBatch } from "firebase-admin/firestore";
import { CATEGORIES, LEVELS_PER_CATEGORY } from "../src/data/categories";
import { SCENARIOS } from "../src/data/scenarios";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "scamcity-c2cf1";
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

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

await commitInBatches(CATEGORIES, (batch, category) => {
  batch.set(db.collection("categories").doc(String(category.lvl)), {
    ...category,
    levelsPerCategory: LEVELS_PER_CATEGORY,
    updatedAt: new Date().toISOString(),
  });
});

await commitInBatches(SCENARIOS, (batch, scenario) => {
  batch.set(db.collection("scenarios").doc(scenario.id), {
    ...scenario,
    updatedAt: new Date().toISOString(),
  });
});

await db.collection("meta").doc("content").set({
  categoriesCount: CATEGORIES.length,
  scenariosCount: SCENARIOS.length,
  levelsPerCategory: LEVELS_PER_CATEGORY,
  updatedAt: new Date().toISOString(),
});

console.log(`Seeded ${CATEGORIES.length} categories and ${SCENARIOS.length} scenarios to Firestore.`);
