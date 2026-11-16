import {
  store,
  money,
  gradeFromScore,
  feeStatus,
  studentName,
  teacherName,
  roleLabel,
  schoolLogoUrl,
} from "./store.js";
import { printFeeReceipt, printReportCard } from "./print.js";

const viewRoot = document.getElementById("view-root");
const viewTitle = document.getElementById("view-title");
const topbarMeta = document.getElementById("topbar-meta");
const loginScreen = document.getElementById("login-screen");
const appEl = document.getElementById("app");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const sidebar = document.querySelector(".sidebar");
const sessionLabel = document.getElementById("session-label");

const titles = {
  dashboard: ["Dashboard", "Term overview"],
  school: ["School", "About, news, events & activities"],
  students: ["Students", "Enrolments & profiles"],
  teachers: ["Teachers", "Staff directory"],
  classes: ["Classes", "Forms & class teachers"],
  fees: ["Fees", "Payments & balances"],
  results: ["Results", "Marks & grades"],
  settings: ["Settings", "School profile & fee templates"],
};

let currentView = "dashboard";
let schoolTab = "about";
let heartbeatTimer = null;
let presenceRefreshTimer = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function byId(list, id) {
  return (list || []).find((item) => item.id === id);
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  modalBody.innerHTML = "";
}

function confirmDelete(message) {
  return window.confirm(message);
}

function syncNav() {
  const allowed = store.allowedViews();
  document.querySelectorAll(".nav-item").forEach((el) => {
    const view = el.dataset.view;
    const ok = allowed.includes(view);
    el.hidden = !ok;
    el.classList.toggle("active", view === currentView);
  });
  const session = store.session();
  if (sessionLabel) {
    sessionLabel.textContent = session
      ? `${session.name} · ${roleLabel(session.role)}`
      : "";
  }
  const data = store.get();
  const logoSrc = schoolLogoUrl(data.settings);
  const topbarLogo = document.getElementById("topbar-logo");
  if (topbarLogo) {
    topbarLogo.src = logoSrc;
    topbarLogo.hidden = false;
  }
  const loginLogo = document.getElementById("login-logo");
  if (loginLogo) {
    loginLogo.src = logoSrc;
    loginLogo.hidden = false;
  }
  const loginTagline = document.getElementById("login-tagline");
  if (loginTagline && data.settings.schoolTagline) {
    loginTagline.textContent = data.settings.schoolTagline;
  }
}

function stopPresenceTimers() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (presenceRefreshTimer) {
    clearInterval(presenceRefreshTimer);
    presenceRefreshTimer = null;
  }
}

function startPresenceTimers() {
  stopPresenceTimers();
  store.heartbeat();
  heartbeatTimer = setInterval(() => store.heartbeat(), 20_000);
  presenceRefreshTimer = setInterval(() => {
    if (store.isAdmin() && currentView === "dashboard") {
      render();
    }
  }, 15_000);
}

function formatWhen(ts) {
  const d = new Date(Number(ts) || Date.now());
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(ts) {
  const sec = Math.max(0, Math.floor((Date.now() - Number(ts)) / 1000));
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  return formatWhen(ts);
}

function showApp() {
  loginScreen.hidden = true;
  appEl.hidden = false;
  syncThemeButtons();
  const allowed = store.allowedViews();
  if (!allowed.includes(currentView)) currentView = allowed[0] || "dashboard";
  startPresenceTimers();
  syncNav();
  render();
}

function showLogin() {
  stopPresenceTimers();
  appEl.hidden = true;
  loginScreen.hidden = false;
  syncThemeButtons();
}

window.addEventListener("beforeunload", () => {
  store.markOffline();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && store.session()) {
    store.heartbeat();
  }
});

document.getElementById("toggle-password")?.addEventListener("click", () => {
  const input = document.getElementById("login-pass");
  const btn = document.getElementById("toggle-password");
  const eyeOpen = btn.querySelector(".eye-open");
  const eyeClosed = btn.querySelector(".eye-closed");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  eyeOpen.hidden = !showing;
  eyeClosed.hidden = showing;
  const label = showing ? "Show password" : "Hide password";
  btn.setAttribute("aria-label", label);
  btn.title = label;
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;
  const err = document.getElementById("login-error");
  if (store.login(user, pass)) {
    err.hidden = true;
    currentView = "dashboard";
    showApp();
  } else {
    err.hidden = false;
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  stopPresenceTimers();
  store.logout();
  showLogin();
});

document.getElementById("sidebar-nav").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-view]");
  if (!btn || btn.hidden) return;
  currentView = btn.dataset.view;
  if (currentView !== "classes") classDrill = { classId: null, studentId: null };
  if (currentView === "school") schoolTab = "about";
  sidebar.classList.remove("open");
  syncNav();
  render();
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-modal]")) closeModal();
});

function render() {
  if (!store.canAccess(currentView)) {
    currentView = store.allowedViews()[0] || "dashboard";
  }
  const [title, meta] = titles[currentView] || ["EduSmart", ""];
  viewTitle.textContent = title;
  topbarMeta.textContent = meta;
  syncNav();

  const data = store.get();
  const map = {
    dashboard: renderDashboard,
    school: renderSchool,
    students: renderStudents,
    teachers: renderTeachers,
    classes: renderClasses,
    fees: renderFees,
    results: renderResults,
    settings: renderSettings,
  };
  (map[currentView] || renderDashboard)(data);
}

/* ——— Dashboard ——— */
function renderDashboard(data) {
  const session = store.session();
  const students = store.visibleStudents(data);
  const classes = store.visibleClasses(data);
  const studentIds = new Set(students.map((s) => s.id));
  const fees = data.fees.filter((f) => studentIds.has(f.studentId));
  const results = data.results.filter((r) => studentIds.has(r.studentId));
  const currency = data.settings.currency;
  const totalDue = fees.reduce((s, f) => s + Number(f.amountDue || 0), 0);
  const totalPaid = fees.reduce((s, f) => s + Number(f.amountPaid || 0), 0);
  const outstanding = Math.max(0, totalDue - totalPaid);

  const recentFees = [...fees].slice(-5).reverse();
  const recentResults = [...results].slice(-5).reverse();
  const onlineUsers = store.isAdmin() ? store.getOnlineUsers() : [];
  const loginHistory = store.isAdmin() ? store.getLoginHistory().slice(0, 8) : [];

  const roleHint =
    session.role === "admin"
      ? "Only the administrator can add, change, or delete information in this system."
      : session.role === "teacher"
        ? "View-only access to your classes, students, school updates, and results."
        : "View-only access to school updates, fees, and results for your linked child.";

  const presencePanel = store.isAdmin()
    ? `<section class="panel presence-panel">
        <div class="panel-head">
          <h3>Who is logged in</h3>
          <span class="badge badge-ok">${onlineUsers.length} online</span>
        </div>
        <p class="muted-copy">Only admins can see active users. Refreshes automatically while you stay on this page.</p>
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr><th>User</th><th>Role</th><th>Logged in</th><th>Last active</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${
                onlineUsers.length
                  ? onlineUsers
                      .map(
                        (u) => `<tr>
                          <td>
                            <span class="online-dot" aria-hidden="true"></span>
                            ${escapeHtml(u.name)}
                            <span class="muted-inline">@${escapeHtml(u.username)}</span>
                          </td>
                          <td><span class="badge badge-info">${escapeHtml(roleLabel(u.role))}</span></td>
                          <td>${escapeHtml(formatWhen(u.loginAt))}</td>
                          <td>${escapeHtml(timeAgo(u.lastSeen))}</td>
                          <td><span class="badge badge-ok">Online</span></td>
                        </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="5" class="empty">No other users online right now</td></tr>`
              }
            </tbody>
          </table>
        </div>
        <div class="panel-head" style="margin-top:1.1rem"><h3>Recent login activity</h3></div>
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr><th>User</th><th>Role</th><th>Action</th><th>When</th></tr>
            </thead>
            <tbody>
              ${
                loginHistory.length
                  ? loginHistory
                      .map(
                        (h) => `<tr>
                          <td>${escapeHtml(h.name)} <span class="muted-inline">@${escapeHtml(h.username)}</span></td>
                          <td>${escapeHtml(roleLabel(h.role))}</td>
                          <td><span class="badge ${h.action === "login" ? "badge-ok" : "badge-warn"}">${escapeHtml(h.action)}</span></td>
                          <td>${escapeHtml(formatWhen(h.at))}</td>
                        </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="4" class="empty">No login activity yet</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>`
    : "";

  viewRoot.innerHTML = `
    <div class="role-banner">
      Signed in as <strong>${escapeHtml(session.name)}</strong>
      <span class="badge badge-info">${escapeHtml(roleLabel(session.role))}</span>
      <span class="role-hint">${escapeHtml(roleHint)}</span>
    </div>
    ${presencePanel}
    <div class="stat-grid">
      <div class="stat">
        <p class="stat-label">${session.role === "parent" ? "Children" : "Students"}</p>
        <p class="stat-value">${students.length}</p>
      </div>
      <div class="stat">
        <p class="stat-label">${session.role === "teacher" ? "My classes" : "Teachers"}</p>
        <p class="stat-value">${session.role === "teacher" ? classes.length : data.teachers.length}</p>
      </div>
      <div class="stat">
        <p class="stat-label">Classes</p>
        <p class="stat-value">${session.role === "admin" ? data.classes.length : classes.length || "—"}</p>
      </div>
      <div class="stat accent">
        <p class="stat-label">Fees outstanding</p>
        <p class="stat-value">${money(outstanding, currency)}</p>
      </div>
    </div>

    <div class="split-2">
      <section class="panel">
        <div class="panel-head"><h3>Recent fee payments</h3></div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Student</th><th>Term</th><th>Paid</th><th>Status</th></tr></thead>
            <tbody>
              ${
                recentFees.length
                  ? recentFees
                      .map((f) => {
                        const st = byId(data.students, f.studentId);
                        const status = feeStatus(f);
                        const badge =
                          status === "Paid" ? "badge-ok" : status === "Partial" ? "badge-warn" : "badge-danger";
                        return `<tr>
                          <td>${escapeHtml(studentName(st))}</td>
                          <td>${escapeHtml(f.term)}</td>
                          <td>${money(f.amountPaid, currency)}</td>
                          <td><span class="badge ${badge}">${status}</span></td>
                        </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="4" class="empty">No fee records</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><h3>Latest results</h3></div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Student</th><th>Subject</th><th>Score</th><th>Grade</th></tr></thead>
            <tbody>
              ${
                recentResults.length
                  ? recentResults
                      .map((r) => {
                        const st = byId(data.students, r.studentId);
                        const g = gradeFromScore(r.score, r.maxScore);
                        return `<tr>
                          <td>${escapeHtml(studentName(st))}</td>
                          <td>${escapeHtml(r.subject)}</td>
                          <td>${r.score}/${r.maxScore}</td>
                          <td class="grade-${g}">${g}</td>
                        </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="4" class="empty">No results yet</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>

    ${
      store.isAdmin()
        ? `<section class="panel">
      <div class="panel-head">
        <h3>${escapeHtml(data.settings.schoolName)} · ${escapeHtml(data.settings.currentTerm)}</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="reset-data">Reset demo data</button>
      </div>
      <p class="muted-copy">
        Demo accounts: <strong>admin / brothers</strong>, <strong>tmoyo / teacher</strong>, <strong>parent / parent</strong>.
        Data stays in this browser until reset.
      </p>
    </section>`
        : ""
    }
  `;

  document.getElementById("reset-data")?.addEventListener("click", () => {
    if (confirmDelete("Reset all EduSmart data to the Brothers College demo?")) {
      store.reset();
      render();
    }
  });
}

/* ——— School hub ——— */
function renderSchool(data) {
  const canEdit = store.isAdmin();
  const tabs = [
    ["about", "About the school"],
    ["news", "Latest news"],
    ["events", "Events"],
    ["activities", "Activities"],
  ];

  viewRoot.innerHTML = `
    <div class="school-tabs" role="tablist">
      ${tabs
        .map(
          ([id, label]) =>
            `<button type="button" class="school-tab ${schoolTab === id ? "active" : ""}" data-school-tab="${id}" role="tab" aria-selected="${schoolTab === id}">${label}</button>`
        )
        .join("")}
    </div>
    <div id="school-tab-root"></div>
  `;

  viewRoot.querySelectorAll("[data-school-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      schoolTab = btn.dataset.schoolTab;
      renderSchool(store.get());
    });
  });

  const root = document.getElementById("school-tab-root");
  if (schoolTab === "news") renderSchoolNews(root, data, canEdit);
  else if (schoolTab === "events") renderSchoolEvents(root, data, canEdit);
  else if (schoolTab === "activities") renderSchoolActivities(root, data, canEdit);
  else renderSchoolAbout(root, data, canEdit);
}

function renderSchoolAbout(root, data, canEdit) {
  const about = data.schoolAbout || {};
  const values = about.values || [];

  root.innerHTML = `
    <section class="panel school-hero">
      <div class="school-hero__text">
        <p class="eyebrow">Brothers College</p>
        <h3>${escapeHtml(data.settings.schoolTagline || "About our school")}</h3>
        <p class="muted-copy">${escapeHtml(about.history || "")}</p>
      </div>
      <div class="school-hero__meta">
        <div><strong>Established</strong>${escapeHtml(about.established || "—")}</div>
        <div><strong>Principal</strong>${escapeHtml(about.principal || "—")}</div>
        <div><strong>Address</strong>${escapeHtml(data.settings.address || "—")}</div>
        <div><strong>Phone</strong>${escapeHtml(data.settings.phone || "—")}</div>
      </div>
    </section>

    <div class="split-2">
      <section class="panel">
        <div class="panel-head"><h3>Mission</h3></div>
        <p class="muted-copy">${escapeHtml(about.mission || "")}</p>
      </section>
      <section class="panel">
        <div class="panel-head"><h3>Vision</h3></div>
        <p class="muted-copy">${escapeHtml(about.vision || "")}</p>
      </section>
    </div>

    <section class="panel">
      <div class="panel-head">
        <h3>Our values</h3>
        ${canEdit ? `<button type="button" class="btn btn-primary btn-sm" id="edit-about">Edit about</button>` : ""}
      </div>
      <div class="value-chips">
        ${
          values.length
            ? values.map((v) => `<span class="value-chip">${escapeHtml(v)}</span>`).join("")
            : `<p class="empty">No values listed</p>`
        }
      </div>
    </section>
  `;

  document.getElementById("edit-about")?.addEventListener("click", () => openAboutForm(about));
}

function openAboutForm(about) {
  if (!store.isAdmin()) return;
  openModal("Edit about the school", `
    <form id="about-form" class="form-grid">
      <label class="full"><span>Mission</span>
        <textarea name="mission" rows="3" required>${escapeHtml(about.mission || "")}</textarea></label>
      <label class="full"><span>Vision</span>
        <textarea name="vision" rows="3" required>${escapeHtml(about.vision || "")}</textarea></label>
      <label class="full"><span>History / about</span>
        <textarea name="history" rows="4" required>${escapeHtml(about.history || "")}</textarea></label>
      <label><span>Established</span>
        <input name="established" value="${escapeHtml(about.established || "")}" /></label>
      <label><span>Principal</span>
        <input name="principal" value="${escapeHtml(about.principal || "")}" /></label>
      <label class="full"><span>Values (comma-separated)</span>
        <input name="values" value="${escapeHtml((about.values || []).join(", "))}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("about-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.updateSchoolAbout({
      mission: fd.get("mission").toString().trim(),
      vision: fd.get("vision").toString().trim(),
      history: fd.get("history").toString().trim(),
      established: fd.get("established").toString().trim(),
      principal: fd.get("principal").toString().trim(),
      values: fd
        .get("values")
        .toString()
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    });
    closeModal();
    render();
  });
}

function renderSchoolNews(root, data, canEdit) {
  const items = [...(data.news || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  root.innerHTML = `
    <div class="toolbar">
      <p class="muted-copy" style="margin:0;flex:1">Announcements and updates from Brothers College.</p>
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-news">Add news</button>` : ""}
    </div>
    <div class="content-stack">
      ${
        items.length
          ? items
              .map(
                (n) => `<article class="panel content-card">
                  <div class="panel-head">
                    <h3>${escapeHtml(n.title)}</h3>
                    <span class="badge badge-info">${escapeHtml(n.date)}</span>
                  </div>
                  <p class="content-summary">${escapeHtml(n.summary || "")}</p>
                  <p class="muted-copy">${escapeHtml(n.body || "")}</p>
                  ${
                    canEdit
                      ? `<div class="actions" style="margin-top:0.8rem">
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-news="${n.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-news="${n.id}">Delete</button>
                        </div>`
                      : ""
                  }
                </article>`
              )
              .join("")
          : `<section class="panel"><p class="empty">No news yet</p></section>`
      }
    </div>
  `;

  document.getElementById("add-news")?.addEventListener("click", () => openNewsForm());
  root.querySelectorAll("[data-edit-news]").forEach((btn) => {
    btn.addEventListener("click", () => openNewsForm(btn.dataset.editNews));
  });
  root.querySelectorAll("[data-del-news]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this news item?")) return;
      store.remove("news", btn.dataset.delNews);
      render();
    });
  });
}

function openNewsForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const n = id ? byId(data.news, id) : null;
  openModal(n ? "Edit news" : "Add news", `
    <form id="news-form" class="form-grid">
      <label class="full"><span>Title</span>
        <input name="title" required value="${escapeHtml(n?.title || "")}" /></label>
      <label><span>Date</span>
        <input type="date" name="date" required value="${escapeHtml(n?.date || new Date().toISOString().slice(0, 10))}" /></label>
      <label class="full"><span>Summary</span>
        <input name="summary" required value="${escapeHtml(n?.summary || "")}" /></label>
      <label class="full"><span>Full story</span>
        <textarea name="body" rows="4" required>${escapeHtml(n?.body || "")}</textarea></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("news", {
      id: n?.id || store.uid("n"),
      title: fd.get("title").toString().trim(),
      date: fd.get("date").toString(),
      summary: fd.get("summary").toString().trim(),
      body: fd.get("body").toString().trim(),
    });
    closeModal();
    render();
  });
}

function renderSchoolEvents(root, data, canEdit) {
  const items = [...(data.events || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  root.innerHTML = `
    <div class="toolbar">
      <p class="muted-copy" style="margin:0;flex:1">Upcoming school events and key dates.</p>
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-event">Add event</button>` : ""}
    </div>
    <div class="content-stack">
      ${
        items.length
          ? items
              .map(
                (ev) => `<article class="panel content-card event-card">
                  <div class="event-date">
                    <span class="event-date__day">${escapeHtml(String(ev.date).slice(8, 10) || "—")}</span>
                    <span class="event-date__month">${escapeHtml(formatMonth(ev.date))}</span>
                  </div>
                  <div class="event-body">
                    <div class="panel-head" style="margin-bottom:0.35rem">
                      <h3>${escapeHtml(ev.title)}</h3>
                    </div>
                    <p class="muted-copy" style="margin:0 0 0.35rem">${escapeHtml(ev.time || "")}${ev.time && ev.location ? " · " : ""}${escapeHtml(ev.location || "")}</p>
                    <p class="muted-copy">${escapeHtml(ev.description || "")}</p>
                    ${
                      canEdit
                        ? `<div class="actions" style="margin-top:0.7rem">
                            <button type="button" class="btn btn-ghost btn-sm" data-edit-event="${ev.id}">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm" data-del-event="${ev.id}">Delete</button>
                          </div>`
                        : ""
                    }
                  </div>
                </article>`
              )
              .join("")
          : `<section class="panel"><p class="empty">No events scheduled</p></section>`
      }
    </div>
  `;

  document.getElementById("add-event")?.addEventListener("click", () => openEventForm());
  root.querySelectorAll("[data-edit-event]").forEach((btn) => {
    btn.addEventListener("click", () => openEventForm(btn.dataset.editEvent));
  });
  root.querySelectorAll("[data-del-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this event?")) return;
      store.remove("events", btn.dataset.delEvent);
      render();
    });
  });
}

function formatMonth(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { month: "short" });
}

function openEventForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const ev = id ? byId(data.events, id) : null;
  openModal(ev ? "Edit event" : "Add event", `
    <form id="event-form" class="form-grid">
      <label class="full"><span>Title</span>
        <input name="title" required value="${escapeHtml(ev?.title || "")}" /></label>
      <label><span>Date</span>
        <input type="date" name="date" required value="${escapeHtml(ev?.date || "")}" /></label>
      <label><span>Time</span>
        <input name="time" placeholder="09:00" value="${escapeHtml(ev?.time || "")}" /></label>
      <label class="full"><span>Location</span>
        <input name="location" value="${escapeHtml(ev?.location || "")}" /></label>
      <label class="full"><span>Description</span>
        <textarea name="description" rows="3" required>${escapeHtml(ev?.description || "")}</textarea></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("event-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("events", {
      id: ev?.id || store.uid("e"),
      title: fd.get("title").toString().trim(),
      date: fd.get("date").toString(),
      time: fd.get("time").toString().trim(),
      location: fd.get("location").toString().trim(),
      description: fd.get("description").toString().trim(),
    });
    closeModal();
    render();
  });
}

function renderSchoolActivities(root, data, canEdit) {
  const items = data.activities || [];
  root.innerHTML = `
    <div class="toolbar">
      <p class="muted-copy" style="margin:0;flex:1">Clubs, sport, and co-curricular programmes.</p>
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-activity">Add activity</button>` : ""}
    </div>
    <div class="activity-grid">
      ${
        items.length
          ? items
              .map(
                (a) => `<article class="panel activity-card">
                  <div class="panel-head">
                    <h3>${escapeHtml(a.name)}</h3>
                    <span class="badge badge-ok">${escapeHtml(a.category || "General")}</span>
                  </div>
                  <p class="muted-copy"><strong>When:</strong> ${escapeHtml(a.schedule || "—")}</p>
                  <p class="muted-copy"><strong>Coordinator:</strong> ${escapeHtml(a.coordinator || "—")}</p>
                  <p class="muted-copy">${escapeHtml(a.description || "")}</p>
                  ${
                    canEdit
                      ? `<div class="actions" style="margin-top:0.8rem">
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-activity="${a.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-activity="${a.id}">Delete</button>
                        </div>`
                      : ""
                  }
                </article>`
              )
              .join("")
          : `<section class="panel"><p class="empty">No activities listed</p></section>`
      }
    </div>
  `;

  document.getElementById("add-activity")?.addEventListener("click", () => openActivityForm());
  root.querySelectorAll("[data-edit-activity]").forEach((btn) => {
    btn.addEventListener("click", () => openActivityForm(btn.dataset.editActivity));
  });
  root.querySelectorAll("[data-del-activity]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this activity?")) return;
      store.remove("activities", btn.dataset.delActivity);
      render();
    });
  });
}

function openActivityForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const a = id ? byId(data.activities, id) : null;
  openModal(a ? "Edit activity" : "Add activity", `
    <form id="activity-form" class="form-grid">
      <label><span>Name</span>
        <input name="name" required value="${escapeHtml(a?.name || "")}" /></label>
      <label><span>Category</span>
        <select name="category">
          ${["Academic", "Sport", "Culture", "Service", "General"]
            .map((c) => `<option ${a?.category === c ? "selected" : ""}>${c}</option>`)
            .join("")}
        </select></label>
      <label><span>Schedule</span>
        <input name="schedule" placeholder="Wednesdays 15:00" value="${escapeHtml(a?.schedule || "")}" /></label>
      <label><span>Coordinator</span>
        <input name="coordinator" value="${escapeHtml(a?.coordinator || "")}" /></label>
      <label class="full"><span>Description</span>
        <textarea name="description" rows="3" required>${escapeHtml(a?.description || "")}</textarea></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("activity-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("activities", {
      id: a?.id || store.uid("a"),
      name: fd.get("name").toString().trim(),
      category: fd.get("category").toString(),
      schedule: fd.get("schedule").toString().trim(),
      coordinator: fd.get("coordinator").toString().trim(),
      description: fd.get("description").toString().trim(),
    });
    closeModal();
    render();
  });
}

/* ——— Students ——— */
function renderStudents(data, filter = "") {
  const canEdit = store.isAdmin();
  const q = filter.trim().toLowerCase();
  const rows = store.visibleStudents(data).filter((s) => {
    if (!q) return true;
    return `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.guardian}`.toLowerCase().includes(q);
  });

  viewRoot.innerHTML = `
    <div class="toolbar">
      <input class="search" id="student-search" type="search" placeholder="Search students…" value="${escapeHtml(filter)}" />
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-student">Add student</button>` : ""}
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Admission</th><th>Name</th><th>Class</th><th>Guardian</th><th>Status</th>
              ${canEdit ? "<th></th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((s) => {
                      const cls = byId(data.classes, s.classId);
                      return `<tr>
                        <td>${escapeHtml(s.admissionNo)}</td>
                        <td>${escapeHtml(studentName(s))}</td>
                        <td>${escapeHtml(cls?.name || "—")}</td>
                        <td>${escapeHtml(s.guardian || "—")}</td>
                        <td><span class="badge ${s.status === "active" ? "badge-ok" : "badge-warn"}">${escapeHtml(s.status)}</span></td>
                        ${
                          canEdit
                            ? `<td class="actions">
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-student="${s.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-student="${s.id}">Delete</button>
                        </td>`
                            : ""
                        }
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="${canEdit ? 6 : 5}" class="empty">No students found</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("student-search").addEventListener("input", (e) => {
    renderStudents(store.get(), e.target.value);
  });
  document.getElementById("add-student")?.addEventListener("click", () => openStudentForm());
  viewRoot.querySelectorAll("[data-edit-student]").forEach((btn) => {
    btn.addEventListener("click", () => openStudentForm(btn.dataset.editStudent));
  });
  viewRoot.querySelectorAll("[data-del-student]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this student?")) return;
      store.remove("students", btn.dataset.delStudent);
      render();
    });
  });
}

function openStudentForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const s = id ? byId(data.students, id) : null;
  openModal(s ? "Edit student" : "Add student", `
    <form id="student-form" class="form-grid">
      <label><span>Admission no.</span>
        <input name="admissionNo" required value="${escapeHtml(s?.admissionNo || "")}" /></label>
      <label><span>Status</span>
        <select name="status">
          <option value="active" ${s?.status !== "inactive" ? "selected" : ""}>Active</option>
          <option value="inactive" ${s?.status === "inactive" ? "selected" : ""}>Inactive</option>
        </select></label>
      <label><span>First name</span>
        <input name="firstName" required value="${escapeHtml(s?.firstName || "")}" /></label>
      <label><span>Last name</span>
        <input name="lastName" required value="${escapeHtml(s?.lastName || "")}" /></label>
      <label><span>Gender</span>
        <select name="gender">
          <option ${s?.gender === "Male" ? "selected" : ""}>Male</option>
          <option ${s?.gender === "Female" ? "selected" : ""}>Female</option>
        </select></label>
      <label><span>Date of birth</span>
        <input type="date" name="dob" value="${escapeHtml(s?.dob || "")}" /></label>
      <label class="full"><span>Class</span>
        <select name="classId">
          <option value="">— Unassigned —</option>
          ${data.classes
            .map(
              (c) =>
                `<option value="${c.id}" ${s?.classId === c.id ? "selected" : ""}>${escapeHtml(c.name)}</option>`
            )
            .join("")}
        </select></label>
      <label><span>Guardian</span>
        <input name="guardian" value="${escapeHtml(s?.guardian || "")}" /></label>
      <label><span>Phone</span>
        <input name="phone" value="${escapeHtml(s?.phone || "")}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("student-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("students", {
      id: s?.id || store.uid("s"),
      admissionNo: fd.get("admissionNo").toString().trim(),
      firstName: fd.get("firstName").toString().trim(),
      lastName: fd.get("lastName").toString().trim(),
      gender: fd.get("gender").toString(),
      dob: fd.get("dob").toString(),
      classId: fd.get("classId").toString(),
      guardian: fd.get("guardian").toString().trim(),
      phone: fd.get("phone").toString().trim(),
      status: fd.get("status").toString(),
    });
    closeModal();
    render();
  });
}

/* ——— Teachers ——— */
function renderTeachers(data, filter = "") {
  if (!store.isAdmin()) {
    viewRoot.innerHTML = `<section class="panel"><p class="empty">Only the administrator can manage teachers.</p></section>`;
    return;
  }
  const q = filter.trim().toLowerCase();
  const rows = data.teachers.filter((t) => {
    if (!q) return true;
    return `${t.firstName} ${t.lastName} ${t.subject} ${t.email}`.toLowerCase().includes(q);
  });

  viewRoot.innerHTML = `
    <div class="toolbar">
      <input class="search" id="teacher-search" type="search" placeholder="Search teachers…" value="${escapeHtml(filter)}" />
      <button type="button" class="btn btn-primary" id="add-teacher">Add teacher</button>
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Name</th><th>Subject</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (t) => `<tr>
                        <td>${escapeHtml(teacherName(t))}</td>
                        <td>${escapeHtml(t.subject)}</td>
                        <td>${escapeHtml(t.email)}</td>
                        <td>${escapeHtml(t.phone || "—")}</td>
                        <td><span class="badge ${t.status === "active" ? "badge-ok" : "badge-warn"}">${escapeHtml(t.status)}</span></td>
                        <td class="actions">
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-teacher="${t.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-teacher="${t.id}">Delete</button>
                        </td>
                      </tr>`
                    )
                    .join("")
                : `<tr><td colspan="6" class="empty">No teachers found</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("teacher-search").addEventListener("input", (e) => {
    renderTeachers(store.get(), e.target.value);
  });
  document.getElementById("add-teacher").addEventListener("click", () => openTeacherForm());
  viewRoot.querySelectorAll("[data-edit-teacher]").forEach((btn) => {
    btn.addEventListener("click", () => openTeacherForm(btn.dataset.editTeacher));
  });
  viewRoot.querySelectorAll("[data-del-teacher]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this teacher?")) return;
      store.remove("teachers", btn.dataset.delTeacher);
      render();
    });
  });
}

function openTeacherForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const t = id ? byId(data.teachers, id) : null;
  openModal(t ? "Edit teacher" : "Add teacher", `
    <form id="teacher-form" class="form-grid">
      <label><span>First name</span>
        <input name="firstName" required value="${escapeHtml(t?.firstName || "")}" /></label>
      <label><span>Last name</span>
        <input name="lastName" required value="${escapeHtml(t?.lastName || "")}" /></label>
      <label><span>Subject</span>
        <input name="subject" required value="${escapeHtml(t?.subject || "")}" /></label>
      <label><span>Status</span>
        <select name="status">
          <option value="active" ${t?.status !== "inactive" ? "selected" : ""}>Active</option>
          <option value="inactive" ${t?.status === "inactive" ? "selected" : ""}>Inactive</option>
        </select></label>
      <label class="full"><span>Email</span>
        <input type="email" name="email" value="${escapeHtml(t?.email || "")}" /></label>
      <label class="full"><span>Phone</span>
        <input name="phone" value="${escapeHtml(t?.phone || "")}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("teacher-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("teachers", {
      id: t?.id || store.uid("t"),
      firstName: fd.get("firstName").toString().trim(),
      lastName: fd.get("lastName").toString().trim(),
      subject: fd.get("subject").toString().trim(),
      email: fd.get("email").toString().trim(),
      phone: fd.get("phone").toString().trim(),
      status: fd.get("status").toString(),
    });
    closeModal();
    render();
  });
}

/* ——— Classes ——— */
let classDrill = { classId: null, studentId: null };

function renderClasses(data) {
  if (classDrill.studentId) {
    renderClassStudentDetail(data, classDrill.classId, classDrill.studentId);
    return;
  }
  if (classDrill.classId) {
    renderClassStudents(data, classDrill.classId);
    return;
  }
  renderClassList(data);
}

function renderClassList(data) {
  const canEdit = store.isAdmin();
  const rows = store.isTeacher() ? store.visibleClasses(data) : data.classes;

  viewRoot.innerHTML = `
    <div class="toolbar">
      <p class="muted-copy" style="margin:0;flex:1">Click a class to open its students.</p>
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-class">Add class</button>` : ""}
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Class</th><th>Subjects</th><th>Room</th><th>Class teacher</th><th>Students</th>${canEdit ? "<th></th>" : ""}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((c) => {
                      const teacher = byId(data.teachers, c.teacherId);
                      const count = data.students.filter((s) => s.classId === c.id).length;
                      const subjects = (c.subjects || []).join(", ") || "—";
                      return `<tr class="click-row" data-open-class="${c.id}" tabindex="0" role="button">
                        <td><strong class="linkish">${escapeHtml(c.name)}</strong></td>
                        <td class="subjects-cell">${escapeHtml(subjects)}</td>
                        <td>${escapeHtml(c.room || "—")}</td>
                        <td>${escapeHtml(teacherName(teacher))}</td>
                        <td>${count}</td>
                        ${
                          canEdit
                            ? `<td class="actions" data-stop>
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-class="${c.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-class="${c.id}">Delete</button>
                        </td>`
                            : ""
                        }
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="${canEdit ? 6 : 5}" class="empty">No classes yet</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("add-class")?.addEventListener("click", () => openClassForm());
  viewRoot.querySelectorAll("[data-open-class]").forEach((row) => {
    const open = () => {
      classDrill = { classId: row.dataset.openClass, studentId: null };
      renderClasses(store.get());
    };
    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop]")) return;
      open();
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
  viewRoot.querySelectorAll("[data-edit-class]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openClassForm(btn.dataset.editClass);
    });
  });
  viewRoot.querySelectorAll("[data-del-class]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirmDelete("Delete this class?")) return;
      store.remove("classes", btn.dataset.delClass);
      render();
    });
  });
}

function renderClassStudents(data, classId) {
  const cls = byId(data.classes, classId);
  if (!cls) {
    classDrill = { classId: null, studentId: null };
    renderClassList(data);
    return;
  }
  const students = data.students
    .filter((s) => s.classId === classId)
    .sort((a, b) => studentName(a).localeCompare(studentName(b)));
  const subjects = (cls.subjects || []).join(" · ") || "No subjects set";

  viewRoot.innerHTML = `
    <div class="toolbar">
      <button type="button" class="btn btn-ghost" id="back-classes">← All classes</button>
      <div style="flex:1"></div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <h3>${escapeHtml(cls.name)}</h3>
        <span class="badge badge-info">${students.length} students</span>
      </div>
      <p class="muted-copy"><strong>Subjects:</strong> ${escapeHtml(subjects)}</p>
      <p class="muted-copy">Click a student name to view class, term, subject, score and grade.</p>
      <div class="student-name-grid">
        ${
          students.length
            ? students
                .map(
                  (s) => `<button type="button" class="student-name-card" data-open-student="${s.id}">
                    <span class="student-name-card__name">${escapeHtml(studentName(s))}</span>
                    <span class="student-name-card__meta">${escapeHtml(s.admissionNo)}</span>
                  </button>`
                )
                .join("")
            : `<p class="empty">No students in this class</p>`
        }
      </div>
    </section>
  `;

  document.getElementById("back-classes").addEventListener("click", () => {
    classDrill = { classId: null, studentId: null };
    renderClasses(store.get());
  });
  viewRoot.querySelectorAll("[data-open-student]").forEach((btn) => {
    btn.addEventListener("click", () => {
      classDrill = { classId, studentId: btn.dataset.openStudent };
      renderClasses(store.get());
    });
  });
}

function renderClassStudentDetail(data, classId, studentId) {
  const cls = byId(data.classes, classId);
  const student = byId(data.students, studentId);
  if (!cls || !student) {
    classDrill = { classId: classId || null, studentId: null };
    renderClasses(data);
    return;
  }

  const classSubjects = cls.subjects || [];
  const marks = data.results.filter((r) => r.studentId === studentId);
  const term = data.settings.currentTerm;
  const bySubject = new Map(marks.map((r) => [r.subject, r]));

  const rows = classSubjects.length
    ? classSubjects.map((subject) => {
        const r = bySubject.get(subject);
        if (!r) {
          return `<tr>
            <td>${escapeHtml(cls.name)}</td>
            <td>${escapeHtml(term)}</td>
            <td>${escapeHtml(subject)}</td>
            <td>—</td>
            <td>—</td>
          </tr>`;
        }
        const g = gradeFromScore(r.score, r.maxScore);
        return `<tr>
          <td>${escapeHtml(cls.name)}</td>
          <td>${escapeHtml(r.term)}</td>
          <td>${escapeHtml(r.subject)}</td>
          <td>${r.score}/${r.maxScore}</td>
          <td class="grade-${g}">${g}</td>
        </tr>`;
      })
    : marks.map((r) => {
        const g = gradeFromScore(r.score, r.maxScore);
        return `<tr>
          <td>${escapeHtml(cls.name)}</td>
          <td>${escapeHtml(r.term)}</td>
          <td>${escapeHtml(r.subject)}</td>
          <td>${r.score}/${r.maxScore}</td>
          <td class="grade-${g}">${g}</td>
        </tr>`;
      });

  const scored = classSubjects
    .map((sub) => bySubject.get(sub))
    .filter(Boolean);
  const avg =
    scored.length > 0
      ? scored.reduce((s, r) => s + (Number(r.score) / Number(r.maxScore || 100)) * 100, 0) / scored.length
      : null;

  viewRoot.innerHTML = `
    <div class="toolbar">
      <button type="button" class="btn btn-ghost" id="back-class-students">← ${escapeHtml(cls.name)} students</button>
      <div style="flex:1"></div>
      <button type="button" class="btn btn-secondary" id="print-this-report">Print report card</button>
    </div>
    <section class="panel">
      <div class="panel-head">
        <h3>${escapeHtml(studentName(student))}</h3>
        <span class="badge badge-info">${escapeHtml(student.admissionNo)}</span>
      </div>
      <div class="detail-meta">
        <div><strong>Class</strong> ${escapeHtml(cls.name)}</div>
        <div><strong>Term</strong> ${escapeHtml(term)}</div>
        <div><strong>Guardian</strong> ${escapeHtml(student.guardian || "—")}</div>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Class</th><th>Term</th><th>Subject</th><th>Score</th><th>Grade</th></tr>
          </thead>
          <tbody>
            ${rows.length ? rows.join("") : `<tr><td colspan="5" class="empty">No results yet</td></tr>`}
          </tbody>
        </table>
      </div>
      ${
        avg !== null
          ? `<p class="muted-copy" style="margin-top:0.9rem"><strong>Average:</strong> ${avg.toFixed(1)}% · <strong>Overall grade:</strong> <span class="grade-${gradeFromScore(avg, 100)}">${gradeFromScore(avg, 100)}</span></p>`
          : ""
      }
    </section>
  `;

  document.getElementById("back-class-students").addEventListener("click", () => {
    classDrill = { classId, studentId: null };
    renderClasses(store.get());
  });
  document.getElementById("print-this-report").addEventListener("click", () => {
    printReportCard(store.get(), studentId, term);
  });
}

function openClassForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const c = id ? byId(data.classes, id) : null;
  openModal(c ? "Edit class" : "Add class", `
    <form id="class-form" class="form-grid">
      <label><span>Class name</span>
        <input name="name" required placeholder="Form 1A" value="${escapeHtml(c?.name || "")}" /></label>
      <label><span>Level</span>
        <input name="level" required placeholder="Form 1" value="${escapeHtml(c?.level || "")}" /></label>
      <label><span>Room</span>
        <input name="room" value="${escapeHtml(c?.room || "")}" /></label>
      <label><span>Capacity</span>
        <input type="number" min="1" name="capacity" value="${escapeHtml(c?.capacity ?? 40)}" /></label>
      <label class="full"><span>Class teacher</span>
        <select name="teacherId">
          <option value="">— Unassigned —</option>
          ${data.teachers
            .map(
              (t) =>
                `<option value="${t.id}" ${c?.teacherId === t.id ? "selected" : ""}>${escapeHtml(teacherName(t))} (${escapeHtml(t.subject)})</option>`
            )
            .join("")}
        </select></label>
      <label class="full"><span>Subjects (comma-separated)</span>
        <input name="subjects" placeholder="Mathematics, Shona, English, Science, History, Commerce" value="${escapeHtml((c?.subjects || []).join(", "))}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("class-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const subjects = fd
      .get("subjects")
      .toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    store.upsert("classes", {
      id: c?.id || store.uid("c"),
      name: fd.get("name").toString().trim(),
      level: fd.get("level").toString().trim(),
      room: fd.get("room").toString().trim(),
      capacity: Number(fd.get("capacity")) || 0,
      teacherId: fd.get("teacherId").toString(),
      subjects,
    });
    closeModal();
    classDrill = { classId: null, studentId: null };
    render();
  });
}

/* ——— Fees ——— */
function renderFees(data, filter = "") {
  const canEdit = store.isAdmin();
  const currency = data.settings.currency;
  const visibleIds = new Set(store.visibleStudents(data).map((s) => s.id));
  const q = filter.trim().toLowerCase();
  const rows = data.fees
    .filter((f) => visibleIds.has(f.studentId))
    .filter((f) => {
      if (!q) return true;
      const st = byId(data.students, f.studentId);
      return `${studentName(st)} ${f.term} ${f.method}`.toLowerCase().includes(q);
    });

  const totalDue = rows.reduce((s, f) => s + Number(f.amountDue || 0), 0);
  const totalPaid = rows.reduce((s, f) => s + Number(f.amountPaid || 0), 0);

  viewRoot.innerHTML = `
    <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr)">
      <div class="stat"><p class="stat-label">Total due</p><p class="stat-value" style="font-size:1.45rem">${money(totalDue, currency)}</p></div>
      <div class="stat"><p class="stat-label">Collected</p><p class="stat-value" style="font-size:1.45rem">${money(totalPaid, currency)}</p></div>
      <div class="stat accent"><p class="stat-label">Outstanding</p><p class="stat-value" style="font-size:1.45rem">${money(totalDue - totalPaid, currency)}</p></div>
    </div>
    <div class="toolbar">
      <input class="search" id="fee-search" type="search" placeholder="Search fees…" value="${escapeHtml(filter)}" />
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-fee">Record payment</button>` : ""}
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Student</th><th>Term</th><th>Due</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((f) => {
                      const st = byId(data.students, f.studentId);
                      const bal = Math.max(0, Number(f.amountDue) - Number(f.amountPaid));
                      const status = feeStatus(f);
                      const badge =
                        status === "Paid" ? "badge-ok" : status === "Partial" ? "badge-warn" : "badge-danger";
                      return `<tr>
                        <td>${escapeHtml(studentName(st))}</td>
                        <td>${escapeHtml(f.term)}</td>
                        <td>${money(f.amountDue, currency)}</td>
                        <td>${money(f.amountPaid, currency)}</td>
                        <td>${money(bal, currency)}</td>
                        <td>${escapeHtml(f.method || "—")}</td>
                        <td><span class="badge ${badge}">${status}</span></td>
                        <td class="actions">
                          <button type="button" class="btn btn-secondary btn-sm" data-print-fee="${f.id}">Receipt</button>
                          ${
                            canEdit
                              ? `<button type="button" class="btn btn-ghost btn-sm" data-edit-fee="${f.id}">Edit</button>
                                 <button type="button" class="btn btn-danger btn-sm" data-del-fee="${f.id}">Delete</button>`
                              : ""
                          }
                        </td>
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="8" class="empty">No fee records</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("fee-search").addEventListener("input", (e) => {
    renderFees(store.get(), e.target.value);
  });
  document.getElementById("add-fee")?.addEventListener("click", () => openFeeForm());
  viewRoot.querySelectorAll("[data-print-fee]").forEach((btn) => {
    btn.addEventListener("click", () => printFeeReceipt(store.get(), btn.dataset.printFee));
  });
  viewRoot.querySelectorAll("[data-edit-fee]").forEach((btn) => {
    btn.addEventListener("click", () => openFeeForm(btn.dataset.editFee));
  });
  viewRoot.querySelectorAll("[data-del-fee]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this fee record?")) return;
      store.remove("fees", btn.dataset.delFee);
      render();
    });
  });
}

function openFeeForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const f = id ? byId(data.fees, id) : null;
  const templates = data.feeTemplates || [];

  openModal(f ? "Edit fee record" : "Record payment", `
    <form id="fee-form" class="form-grid">
      <label class="full"><span>Student</span>
        <select name="studentId" required id="fee-student">
          <option value="">Select student</option>
          ${data.students
            .map(
              (s) =>
                `<option value="${s.id}" ${f?.studentId === s.id ? "selected" : ""}>${escapeHtml(studentName(s))} (${escapeHtml(s.admissionNo)})</option>`
            )
            .join("")}
        </select></label>
      ${
        !f && templates.length
          ? `<label class="full"><span>Apply fee template (optional)</span>
        <select id="fee-template">
          <option value="">— Manual amounts —</option>
          ${templates
            .map(
              (t) =>
                `<option value="${t.id}" data-amount="${t.amount}" data-term="${escapeHtml(t.term)}">${escapeHtml(t.level)} · ${money(t.amount, data.settings.currency)} · ${escapeHtml(t.term)}</option>`
            )
            .join("")}
        </select></label>`
          : ""
      }
      <label><span>Term</span>
        <input name="term" id="fee-term" required value="${escapeHtml(f?.term || data.settings.currentTerm)}" /></label>
      <label><span>Date</span>
        <input type="date" name="date" value="${escapeHtml(f?.date || new Date().toISOString().slice(0, 10))}" /></label>
      <label><span>Amount due</span>
        <input type="number" min="0" step="0.01" name="amountDue" id="fee-due" required value="${escapeHtml(f?.amountDue ?? "")}" /></label>
      <label><span>Amount paid</span>
        <input type="number" min="0" step="0.01" name="amountPaid" required value="${escapeHtml(f?.amountPaid ?? "")}" /></label>
      <label><span>Method</span>
        <select name="method">
          ${["Cash", "EcoCash", "Bank transfer", "Other"]
            .map((m) => `<option ${f?.method === m ? "selected" : ""}>${m}</option>`)
            .join("")}
        </select></label>
      <label class="full"><span>Note</span>
        <input name="note" value="${escapeHtml(f?.note || "")}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("fee-template")?.addEventListener("change", (e) => {
    const opt = e.target.selectedOptions[0];
    if (!opt?.value) return;
    document.getElementById("fee-due").value = opt.dataset.amount || "";
    document.getElementById("fee-term").value = opt.dataset.term || "";
  });

  document.getElementById("fee-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("fees", {
      id: f?.id || store.uid("f"),
      studentId: fd.get("studentId").toString(),
      term: fd.get("term").toString().trim(),
      date: fd.get("date").toString(),
      amountDue: Number(fd.get("amountDue")),
      amountPaid: Number(fd.get("amountPaid")),
      method: fd.get("method").toString(),
      note: fd.get("note").toString().trim(),
      receiptNo: f?.receiptNo || store.nextReceiptNo(),
    });
    closeModal();
    render();
  });
}

/* ——— Results ——— */
function renderResults(data, filter = "") {
  const canEdit = store.isAdmin();
  const visibleIds = new Set(store.visibleStudents(data).map((s) => s.id));
  const q = filter.trim().toLowerCase();
  const rows = data.results
    .filter((r) => visibleIds.has(r.studentId))
    .filter((r) => {
      if (!q) return true;
      const st = byId(data.students, r.studentId);
      return `${studentName(st)} ${r.subject} ${r.term}`.toLowerCase().includes(q);
    });

  const students = store.visibleStudents(data);

  viewRoot.innerHTML = `
    <div class="toolbar">
      <input class="search" id="result-search" type="search" placeholder="Search results…" value="${escapeHtml(filter)}" />
      <button type="button" class="btn btn-secondary" id="print-report">Print report card</button>
      ${canEdit ? `<button type="button" class="btn btn-primary" id="add-result">Add result</button>` : ""}
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Student</th><th>Class</th><th>Term</th><th>Subject</th><th>Score</th><th>Grade</th>${canEdit ? "<th></th>" : ""}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((r) => {
                      const st = byId(data.students, r.studentId);
                      const cls = st ? byId(data.classes, st.classId) : null;
                      const g = gradeFromScore(r.score, r.maxScore);
                      return `<tr>
                        <td>${escapeHtml(studentName(st))}</td>
                        <td>${escapeHtml(cls?.name || "—")}</td>
                        <td>${escapeHtml(r.term)}</td>
                        <td>${escapeHtml(r.subject)}</td>
                        <td>${r.score}/${r.maxScore}</td>
                        <td class="grade-${g}">${g}</td>
                        ${
                          canEdit
                            ? `<td class="actions">
                          <button type="button" class="btn btn-ghost btn-sm" data-edit-result="${r.id}">Edit</button>
                          <button type="button" class="btn btn-danger btn-sm" data-del-result="${r.id}">Delete</button>
                        </td>`
                            : ""
                        }
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="${canEdit ? 7 : 6}" class="empty">No results yet</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("result-search").addEventListener("input", (e) => {
    renderResults(store.get(), e.target.value);
  });
  document.getElementById("add-result")?.addEventListener("click", () => openResultForm());
  document.getElementById("print-report").addEventListener("click", () => {
    openModal("Print report card", `
      <form id="report-form" class="form-grid">
        <label class="full"><span>Student</span>
          <select name="studentId" required>
            ${students
              .map((s) => `<option value="${s.id}">${escapeHtml(studentName(s))} (${escapeHtml(s.admissionNo)})</option>`)
              .join("")}
          </select></label>
        <label class="full"><span>Term</span>
          <input name="term" required value="${escapeHtml(data.settings.currentTerm)}" /></label>
        <div class="form-actions full">
          <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
          <button type="submit" class="btn btn-primary">Print</button>
        </div>
      </form>
    `);
    document.getElementById("report-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      printReportCard(store.get(), fd.get("studentId").toString(), fd.get("term").toString());
      closeModal();
    });
  });
  viewRoot.querySelectorAll("[data-edit-result]").forEach((btn) => {
    btn.addEventListener("click", () => openResultForm(btn.dataset.editResult));
  });
  viewRoot.querySelectorAll("[data-del-result]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this result?")) return;
      store.remove("results", btn.dataset.delResult);
      render();
    });
  });
}

function openResultForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const r = id ? byId(data.results, id) : null;
  const students = store.visibleStudents(data);
  const subjects = [
    "Mathematics",
    "Shona",
    "English",
    "Science",
    "History",
    "Commerce",
    "Geography",
    "Computer Science",
  ];

  openModal(r ? "Edit result" : "Add result", `
    <form id="result-form" class="form-grid">
      <label class="full"><span>Student</span>
        <select name="studentId" required>
          <option value="">Select student</option>
          ${students
            .map(
              (s) =>
                `<option value="${s.id}" ${r?.studentId === s.id ? "selected" : ""}>${escapeHtml(studentName(s))}</option>`
            )
            .join("")}
        </select></label>
      <label><span>Term</span>
        <input name="term" required value="${escapeHtml(r?.term || data.settings.currentTerm)}" /></label>
      <label><span>Subject</span>
        <select name="subject">
          ${subjects
            .map((sub) => `<option ${r?.subject === sub ? "selected" : ""}>${sub}</option>`)
            .join("")}
        </select></label>
      <label><span>Score</span>
        <input type="number" min="0" step="0.5" name="score" required value="${escapeHtml(r?.score ?? "")}" /></label>
      <label><span>Max score</span>
        <input type="number" min="1" step="0.5" name="maxScore" required value="${escapeHtml(r?.maxScore ?? 100)}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("result-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("results", {
      id: r?.id || store.uid("r"),
      studentId: fd.get("studentId").toString(),
      term: fd.get("term").toString().trim(),
      subject: fd.get("subject").toString(),
      score: Number(fd.get("score")),
      maxScore: Number(fd.get("maxScore")),
    });
    closeModal();
    render();
  });
}

/* ——— Settings ——— */
function renderSettings(data) {
  if (!store.isAdmin()) {
    viewRoot.innerHTML = `<section class="panel"><p class="empty">Only the administrator can change school settings.</p></section>`;
    return;
  }
  const s = data.settings;
  const templates = data.feeTemplates || [];

  viewRoot.innerHTML = `
    <div class="split-2">
      <section class="panel">
        <div class="panel-head"><h3>School profile</h3></div>
        <form id="settings-form" class="form-grid">
          <label class="full"><span>School name</span>
            <input name="schoolName" required value="${escapeHtml(s.schoolName || "")}" /></label>
          <label class="full"><span>Tagline</span>
            <input name="schoolTagline" value="${escapeHtml(s.schoolTagline || "")}" /></label>
          <label><span>Current term</span>
            <input name="currentTerm" required value="${escapeHtml(s.currentTerm || "")}" /></label>
          <label><span>Currency</span>
            <input name="currency" required value="${escapeHtml(s.currency || "USD")}" /></label>
          <label class="full"><span>Address</span>
            <input name="address" value="${escapeHtml(s.address || "")}" /></label>
          <label class="full"><span>Phone</span>
            <input name="phone" value="${escapeHtml(s.phone || "")}" /></label>
          <label class="full"><span>School logo</span>
            <input type="file" id="logo-file" accept="image/*" />
            <div class="logo-preview-wrap">
              <img id="logo-preview" class="logo-preview" src="${escapeHtml(schoolLogoUrl(s))}" alt="Logo preview" />
              ${s.logoDataUrl ? `<button type="button" class="btn btn-ghost btn-sm" id="clear-logo">Use default logo</button>` : `<span class="muted-copy">Default: Brothers College crest</span>`}
            </div>
          </label>
          <div class="form-actions full">
            <button type="submit" class="btn btn-primary">Save settings</button>
          </div>
        </form>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h3>Term fee templates</h3>
          <button type="button" class="btn btn-primary btn-sm" id="add-template">Add template</button>
        </div>
        <p class="muted-copy">Generate unpaid fee records for all students in a level for a given term.</p>
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr><th>Level</th><th>Term</th><th>Amount</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              ${
                templates.length
                  ? templates
                      .map(
                        (t) => `<tr>
                          <td>${escapeHtml(t.level)}</td>
                          <td>${escapeHtml(t.term)}</td>
                          <td>${money(t.amount, s.currency)}</td>
                          <td>${escapeHtml(t.description || "—")}</td>
                          <td class="actions">
                            <button type="button" class="btn btn-secondary btn-sm" data-apply-template="${t.id}">Generate</button>
                            <button type="button" class="btn btn-ghost btn-sm" data-edit-template="${t.id}">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm" data-del-template="${t.id}">Delete</button>
                          </td>
                        </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="5" class="empty">No fee templates</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  let pendingLogo = s.logoDataUrl || "";

  document.getElementById("logo-file").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800_000) {
      alert("Please use a logo under 800KB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      pendingLogo = String(reader.result || "");
      const preview = document.getElementById("logo-preview");
      preview.src = pendingLogo;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("clear-logo")?.addEventListener("click", () => {
    pendingLogo = "";
    const preview = document.getElementById("logo-preview");
    preview.removeAttribute("src");
    preview.hidden = true;
  });

  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.updateSettings({
      schoolName: fd.get("schoolName").toString().trim(),
      schoolTagline: fd.get("schoolTagline").toString().trim(),
      currentTerm: fd.get("currentTerm").toString().trim(),
      currency: fd.get("currency").toString().trim(),
      address: fd.get("address").toString().trim(),
      phone: fd.get("phone").toString().trim(),
      logoDataUrl: pendingLogo,
    });
    syncNav();
    render();
  });

  document.getElementById("add-template").addEventListener("click", () => openTemplateForm());
  viewRoot.querySelectorAll("[data-edit-template]").forEach((btn) => {
    btn.addEventListener("click", () => openTemplateForm(btn.dataset.editTemplate));
  });
  viewRoot.querySelectorAll("[data-del-template]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirmDelete("Delete this fee template?")) return;
      store.remove("feeTemplates", btn.dataset.delTemplate);
      render();
    });
  });
  viewRoot.querySelectorAll("[data-apply-template]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const result = store.applyFeeTemplate(btn.dataset.applyTemplate);
      alert(
        result.created
          ? `Created ${result.created} fee record(s) for students missing this term.`
          : "No new fee records created (students may already have this term)."
      );
      render();
    });
  });
}

function openTemplateForm(id) {
  if (!store.isAdmin()) return;
  const data = store.get();
  const t = id ? byId(data.feeTemplates, id) : null;
  openModal(t ? "Edit fee template" : "Add fee template", `
    <form id="template-form" class="form-grid">
      <label><span>Level</span>
        <input name="level" required placeholder="Form 1" value="${escapeHtml(t?.level || "")}" /></label>
      <label><span>Amount</span>
        <input type="number" min="0" step="0.01" name="amount" required value="${escapeHtml(t?.amount ?? "")}" /></label>
      <label class="full"><span>Term</span>
        <input name="term" required value="${escapeHtml(t?.term || data.settings.currentTerm)}" /></label>
      <label class="full"><span>Description</span>
        <input name="description" value="${escapeHtml(t?.description || "")}" /></label>
      <div class="form-actions full">
        <button type="button" class="btn btn-ghost" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `);

  document.getElementById("template-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.upsert("feeTemplates", {
      id: t?.id || store.uid("ft"),
      level: fd.get("level").toString().trim(),
      amount: Number(fd.get("amount")),
      term: fd.get("term").toString().trim(),
      description: fd.get("description").toString().trim(),
    });
    closeModal();
    render();
  });
}

/* ——— Theme ——— */
const THEME_KEY = "edusmart-theme";

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  const label = next === "dark" ? "Switch to light mode" : "Switch to dark mode";
  document.querySelectorAll("#theme-toggle-login, #theme-toggle-app").forEach((btn) => {
    btn.setAttribute("aria-label", label);
    btn.title = label;
  });
}

function syncThemeButtons() {
  const loginFab = document.getElementById("theme-toggle-login");
  if (loginFab) loginFab.hidden = !appEl.hidden;
}

function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}

document.getElementById("theme-toggle-login")?.addEventListener("click", toggleTheme);
document.getElementById("theme-toggle-app")?.addEventListener("click", toggleTheme);

/* ——— Boot ——— */
applyTheme(getTheme());
if (store.session()) showApp();
else showLogin();
