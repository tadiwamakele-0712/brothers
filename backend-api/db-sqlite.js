import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "portfolio.db");
const LEGACY_JSON = path.join(__dirname, "data", "messages.json");

const SKILLS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "SQLite",
  "Fetch API",
  "Git & GitHub",
];

const PROJECTS = [
  { title: "Todo App", tags: ["JavaScript", "localStorage"] },
  { title: "Calculator", tags: ["DOM", "Events"] },
  { title: "Weather App", tags: ["Fetch API"] },
  { title: "Notes App", tags: ["localStorage"] },
  { title: "React Portfolio", tags: ["React", "Router"] },
  { title: "Backend API", tags: ["Node.js", "Express", "SQLite"] },
];

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    tags TEXT NOT NULL
  );
`);

function seedSkillsAndProjects() {
  const insertSkill = db.prepare("INSERT OR IGNORE INTO skills (name) VALUES (?)");
  const insertProject = db.prepare(
    "INSERT OR IGNORE INTO projects (title, tags) VALUES (?, ?)"
  );

  for (const skill of SKILLS) {
    insertSkill.run(skill);
  }

  for (const project of PROJECTS) {
    insertProject.run(project.title, JSON.stringify(project.tags));
  }
}

function migrateLegacyJson() {
  const count = db.prepare("SELECT COUNT(*) AS total FROM messages").get().total;
  if (count > 0 || !fs.existsSync(LEGACY_JSON)) {
    return;
  }

  try {
    const legacy = JSON.parse(fs.readFileSync(LEGACY_JSON, "utf8"));
    const insert = db.prepare(
      "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)"
    );

    for (const row of legacy) {
      insert.run(
        row.name,
        row.email,
        row.message,
        row.date ?? new Date().toISOString()
      );
    }
  } catch {
    // ignore bad legacy file
  }
}

seedSkillsAndProjects();
migrateLegacyJson();

export function getSkills() {
  return db
    .prepare("SELECT name FROM skills ORDER BY id")
    .all()
    .map((row) => row.name);
}

export function getProjects() {
  return db
    .prepare("SELECT title, tags FROM projects ORDER BY id")
    .all()
    .map((row) => ({
      title: row.title,
      tags: JSON.parse(row.tags),
    }));
}

export function getMessages() {
  return db
    .prepare(
      "SELECT id, name, email, message, created_at AS date FROM messages ORDER BY id DESC"
    )
    .all();
}

export function addMessage({ name, email, message }) {
  const result = db
    .prepare(
      "INSERT INTO messages (name, email, message, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(name, email, message, new Date().toISOString());

  return {
    id: Number(result.lastInsertRowid),
    name,
    email,
    message,
    date: new Date().toISOString(),
  };
}

export function deleteMessage(id) {
  const result = db.prepare("DELETE FROM messages WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getStats() {
  const messages = db.prepare("SELECT COUNT(*) AS total FROM messages").get().total;
  const skills = db.prepare("SELECT COUNT(*) AS total FROM skills").get().total;
  const projects = db.prepare("SELECT COUNT(*) AS total FROM projects").get().total;
  return { messages, skills, projects, database: "sqlite" };
}

export { db };
