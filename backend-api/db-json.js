import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MESSAGES_PATH = path.join(__dirname, "data", "messages.json");

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

function readMessages() {
  if (!fs.existsSync(MESSAGES_PATH)) {
    fs.mkdirSync(path.dirname(MESSAGES_PATH), { recursive: true });
    fs.writeFileSync(MESSAGES_PATH, "[]");
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(MESSAGES_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeMessages(messages) {
  fs.mkdirSync(path.dirname(MESSAGES_PATH), { recursive: true });
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2));
}

export function getSkills() {
  return SKILLS;
}

export function getProjects() {
  return PROJECTS;
}

export function getMessages() {
  return readMessages().sort((a, b) => b.id - a.id);
}

export function addMessage({ name, email, message }) {
  const messages = readMessages();
  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString(),
  };
  messages.push(entry);
  writeMessages(messages);
  return entry;
}

export function deleteMessage(id) {
  const messages = readMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  writeMessages(next);
  return true;
}

export function getStats() {
  const messages = readMessages();
  return {
    messages: messages.length,
    skills: SKILLS.length,
    projects: PROJECTS.length,
    database: "json",
  };
}

export const db = null;
