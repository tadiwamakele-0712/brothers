import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {
  addMessage,
  deleteMessage,
  getMessages,
  getProjects,
  getSkills,
  getStats,
} from "./db.js";
import { requireAdmin, verifyAdminKey } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

app.use(
  cors({
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN.split(","),
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  const stats = getStats();
  const label = stats.database === "sqlite" ? "SQLite" : "JSON file";
  res.json({
    ok: true,
    message: `API inoshanda — ${label} storage!`,
    database: stats.database,
  });
});

app.get("/api/skills", (_req, res) => {
  res.json({ skills: getSkills() });
});

app.get("/api/projects", (_req, res) => {
  res.json({ projects: getProjects() });
});

app.get("/api/messages", (_req, res) => {
  res.json({ messages: getMessages() });
});

app.get("/api/stats", (_req, res) => {
  res.json(getStats());
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Zadza zvese — zita, email, uye message." });
  }

  const entry = addMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  });

  const { database } = getStats();
  const storeLabel = database === "sqlite" ? "SQLite database" : "JSON file";
  res.status(201).json({
    success: true,
    message: `Message yachengetwa mu ${storeLabel}!`,
    entry,
  });
});

app.post("/api/admin/verify", (req, res) => {
  const { key } = req.body;

  if (!verifyAdminKey(key)) {
    return res.status(401).json({ ok: false, error: "Admin key haisi kukodza." });
  }

  res.json({ ok: true, message: "Welcome admin!" });
});

app.delete("/api/messages/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "ID haisi kukodza." });
  }

  if (!deleteMessage(id)) {
    return res.status(404).json({ error: "Message haina kuwanikwa." });
  }

  res.json({ success: true, message: "Message yabviswa." });
});

app.listen(PORT, () => {
  const { database } = getStats();
  console.log(`API server: http://localhost:${PORT}`);
  console.log(`Demo page:   http://localhost:${PORT}/`);
  console.log(`Lesson 21:   http://localhost:${PORT}/lesson21.html`);
  console.log(`Admin page:  http://localhost:${PORT}/admin.html`);
  console.log(`Database:    ${database}`);
});
