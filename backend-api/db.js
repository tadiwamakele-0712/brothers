import { createRequire } from "module";

const require = createRequire(import.meta.url);

let store;

try {
  const Database = require("better-sqlite3");
  const test = new Database(":memory:");
  test.close();
  store = await import("./db-sqlite.js");
} catch {
  console.warn("SQLite unavailable — using JSON file storage (data/messages.json)");
  store = await import("./db-json.js");
}

export const getSkills = store.getSkills;
export const getProjects = store.getProjects;
export const getMessages = store.getMessages;
export const addMessage = store.addMessage;
export const deleteMessage = store.deleteMessage;
export const getStats = store.getStats;
export const db = store.db;
