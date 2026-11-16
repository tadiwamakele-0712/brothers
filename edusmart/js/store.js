const STORAGE_KEY = "edusmart-brothers-v3";
const SESSION_KEY = "edusmart-session";
const PRESENCE_KEY = "edusmart-presence-v1";
const ONLINE_MS = 90_000; // considered online if seen within 90s
const HISTORY_LIMIT = 30;

export const FORM_1A_SUBJECTS = [
  "Mathematics",
  "Shona",
  "English",
  "Science",
  "History",
  "Commerce",
];

function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function seedData() {
  const term = "Term 1 2026";
  const form1Subjects = [...FORM_1A_SUBJECTS];

  const teachers = [
    {
      id: "t1",
      firstName: "Tendai",
      lastName: "Moyo",
      email: "t.moyo@brotherscollege.ac.zw",
      phone: "+263 77 111 2201",
      subject: "Mathematics",
      status: "active",
    },
    {
      id: "t2",
      firstName: "Chipo",
      lastName: "Ncube",
      email: "c.ncube@brotherscollege.ac.zw",
      phone: "+263 77 111 2202",
      subject: "English",
      status: "active",
    },
    {
      id: "t3",
      firstName: "Farai",
      lastName: "Dube",
      email: "f.dube@brotherscollege.ac.zw",
      phone: "+263 77 111 2203",
      subject: "Science",
      status: "active",
    },
    {
      id: "t4",
      firstName: "Rudo",
      lastName: "Sibanda",
      email: "r.sibanda@brotherscollege.ac.zw",
      phone: "+263 77 111 2204",
      subject: "History",
      status: "active",
    },
  ];

  const classes = [
    {
      id: "c1",
      name: "Form 1A",
      level: "Form 1",
      room: "B12",
      teacherId: "t2",
      capacity: 40,
      subjects: form1Subjects,
    },
    {
      id: "c2",
      name: "Form 2B",
      level: "Form 2",
      room: "B18",
      teacherId: "t1",
      capacity: 40,
      subjects: ["Mathematics", "English", "Science", "History"],
    },
    {
      id: "c3",
      name: "Form 3A",
      level: "Form 3",
      room: "C04",
      teacherId: "t3",
      capacity: 38,
      subjects: ["Mathematics", "English", "Science", "History"],
    },
    {
      id: "c4",
      name: "Form 4 Science",
      level: "Form 4",
      room: "Lab 1",
      teacherId: "t3",
      capacity: 35,
      subjects: ["Mathematics", "English", "Science", "History"],
    },
  ];

  const form1ARoster = [
    ["Tatenda", "Chirwa", "Male", "Mr Chirwa"],
    ["Nyasha", "Gumbo", "Female", "Mrs Gumbo"],
    ["Takudzwa", "Ndlovu", "Male", "Mr Ndlovu"],
    ["Rumbidzai", "Chikwanha", "Female", "Mrs Chikwanha"],
    ["Panashe", "Moyo", "Male", "Mr Moyo"],
    ["Vimbai", "Dube", "Female", "Mrs Dube"],
    ["Kudakwashe", "Sithole", "Male", "Mr Sithole"],
    ["Tariro", "Mutasa", "Female", "Mrs Mutasa"],
    ["Simbarashe", "Phiri", "Male", "Mr Phiri"],
    ["Chiedza", "Zhou", "Female", "Mrs Zhou"],
  ];

  const students = form1ARoster.map(([firstName, lastName, gender, guardian], i) => ({
    id: `s${i + 1}`,
    admissionNo: `BC2024-${String(i + 1).padStart(3, "0")}`,
    firstName,
    lastName,
    gender,
    dob: `2011-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    classId: "c1",
    guardian,
    phone: `+263 77 200 ${String(1001 + i)}`,
    status: "active",
  }));

  students.push(
    {
      id: "s11",
      admissionNo: "BC2023-014",
      firstName: "Blessing",
      lastName: "Mpofu",
      gender: "Male",
      dob: "2010-01-09",
      classId: "c2",
      guardian: "Mr Mpofu",
      phone: "+263 77 200 1011",
      status: "active",
    },
    {
      id: "s12",
      admissionNo: "BC2022-008",
      firstName: "Tinashe",
      lastName: "Makoni",
      gender: "Male",
      dob: "2009-05-18",
      classId: "c3",
      guardian: "Mr Makoni",
      phone: "+263 77 200 1012",
      status: "active",
    },
    {
      id: "s13",
      admissionNo: "BC2021-033",
      firstName: "Anesu",
      lastName: "Banda",
      gender: "Female",
      dob: "2008-09-02",
      classId: "c4",
      guardian: "Mrs Banda",
      phone: "+263 77 200 1013",
      status: "active",
    }
  );

  const fees = students.slice(0, 10).map((s, i) => ({
    id: `f${i + 1}`,
    studentId: s.id,
    term,
    amountDue: 450,
    amountPaid: i % 3 === 0 ? 450 : i % 3 === 1 ? 200 : 0,
    date: "2026-01-20",
    method: i % 2 === 0 ? "Cash" : "EcoCash",
    note: "",
    receiptNo: `RCP-${1001 + i}`,
  }));

  const scoreMap = {
    s1: [78, 71, 72, 81, 69, 74],
    s2: [65, 80, 88, 70, 76, 68],
    s3: [82, 74, 79, 85, 73, 77],
    s4: [70, 83, 75, 68, 81, 72],
    s5: [91, 66, 84, 88, 70, 79],
    s6: [58, 72, 64, 61, 69, 55],
    s7: [76, 78, 81, 74, 80, 73],
    s8: [84, 69, 77, 82, 75, 80],
    s9: [63, 71, 68, 66, 72, 60],
    s10: [89, 85, 90, 87, 83, 86],
  };

  const results = [];
  let rid = 1;
  for (const student of students.filter((s) => s.classId === "c1")) {
    const scores = scoreMap[student.id] || [70, 70, 70, 70, 70, 70];
    form1Subjects.forEach((subject, idx) => {
      results.push({
        id: `r${rid++}`,
        studentId: student.id,
        term,
        subject,
        score: scores[idx],
        maxScore: 100,
      });
    });
  }

  const feeTemplates = [
    { id: "ft1", level: "Form 1", amount: 450, term: "Term 1 2026", description: "Tuition + levies" },
    { id: "ft2", level: "Form 2", amount: 480, term: "Term 1 2026", description: "Tuition + levies" },
    { id: "ft3", level: "Form 3", amount: 520, term: "Term 1 2026", description: "Tuition + levies" },
    { id: "ft4", level: "Form 4", amount: 550, term: "Term 1 2026", description: "Tuition + exam levy" },
  ];

  const users = [
    {
      id: "u1",
      username: "admin",
      password: "brothers",
      name: "School Administrator",
      role: "admin",
    },
    {
      id: "u2",
      username: "tmoyo",
      password: "teacher",
      name: "Tendai Moyo",
      role: "teacher",
      teacherId: "t1",
    },
    {
      id: "u3",
      username: "parent",
      password: "parent",
      name: "Mr Chirwa",
      role: "parent",
      studentIds: ["s1"],
    },
  ];

  const schoolAbout = {
    mission:
      "To educate and form young people of integrity who lead with wisdom, compassion, and excellence in service to their communities.",
    vision:
      "A distinguished learning community where every learner grows in character, knowledge, and purpose.",
    history:
      "Brothers College is a values-driven school committed to academic achievement and holistic formation. Through disciplined study, sport, culture, and faith-inspired service, students are prepared for further education and responsible citizenship.",
    values: ["Integrity", "Excellence", "Brotherhood", "Discipline", "Service"],
    principal: "Bro. Principal",
    established: "1998",
  };

  const news = [
    {
      id: "n1",
      title: "Term 1 opening assembly",
      date: "2026-01-13",
      summary: "Brothers College welcomed learners back with a focus on excellence and respect.",
      body: "The Term 1 assembly reminded students of our shared values: integrity, diligence, and care for one another. Class teachers outlined academic expectations for the term.",
    },
    {
      id: "n2",
      title: "New science lab equipment",
      date: "2026-02-03",
      summary: "Form 1–4 science classes will benefit from upgraded laboratory resources this term.",
      body: "The college has invested in new apparatus to strengthen practical learning in Science across junior and senior forms.",
    },
    {
      id: "n3",
      title: "Parent–teacher consultation day",
      date: "2026-02-20",
      summary: "Families are invited to meet teachers and review learner progress.",
      body: "Appointments will be scheduled by class. Fee balances and academic reports will also be available for discussion.",
    },
  ];

  const events = [
    {
      id: "e1",
      title: "Inter-house athletics",
      date: "2026-03-07",
      time: "08:00",
      location: "School sports field",
      description: "Track and field finals for all houses. Parents are welcome.",
    },
    {
      id: "e2",
      title: "Career guidance day",
      date: "2026-03-18",
      time: "09:30",
      location: "Main hall",
      description: "Guest speakers from universities and industry meet Forms 3 and 4.",
    },
    {
      id: "e3",
      title: "Founders' Day celebration",
      date: "2026-04-10",
      time: "10:00",
      location: "College grounds",
      description: "A day of thanksgiving, culture, and recognition of student achievement.",
    },
  ];

  const activities = [
    {
      id: "a1",
      name: "Debate Club",
      category: "Academic",
      schedule: "Wednesdays 15:00",
      coordinator: "Ms Ncube",
      description: "Builds confidence, research skills, and public speaking.",
    },
    {
      id: "a2",
      name: "Football",
      category: "Sport",
      schedule: "Tuesdays & Thursdays 15:30",
      coordinator: "Mr Moyo",
      description: "Competitive training for junior and senior teams.",
    },
    {
      id: "a3",
      name: "Choir",
      category: "Culture",
      schedule: "Fridays 14:30",
      coordinator: "Mrs Sibanda",
      description: "Choral practice for assemblies, concerts, and Founders' Day.",
    },
    {
      id: "a4",
      name: "Science Club",
      category: "Academic",
      schedule: "Mondays 15:00",
      coordinator: "Mr Dube",
      description: "Experiments, STEM projects, and science fair preparation.",
    },
  ];

  return {
    teachers,
    classes,
    students,
    fees,
    results,
    feeTemplates,
    users,
    schoolAbout,
    news,
    events,
    activities,
    settings: {
      schoolName: "Brothers College",
      schoolTagline: "Building character. Advancing knowledge. Shaping futures.",
      currency: "USD",
      currentTerm: "Term 1 2026",
      address: "Harare, Zimbabwe",
      phone: "+263 24 000 0000",
      logoDataUrl: "",
      logoPath: "assets/brothers-college-logo.jpg",
      receiptCounter: 1011,
    },
  };
}

/** Resolved logo URL: uploaded data URL first, then bundled school logo */
export function schoolLogoUrl(settings = {}) {
  if (settings.logoDataUrl) return settings.logoDataUrl;
  if (settings.logoPath) return settings.logoPath;
  return "assets/brothers-college-logo.jpg";
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = seedData();
      save(data);
      return data;
    }
    const data = JSON.parse(raw);
    if (!data.feeTemplates) data.feeTemplates = seedData().feeTemplates;
    if (!data.users) data.users = seedData().users;
    if (!data.settings) data.settings = seedData().settings;
    const seeded = seedData();
    let migrated = false;
    if (!data.schoolAbout) {
      data.schoolAbout = seeded.schoolAbout;
      migrated = true;
    }
    if (!data.news) {
      data.news = seeded.news;
      migrated = true;
    }
    if (!data.events) {
      data.events = seeded.events;
      migrated = true;
    }
    if (!data.activities) {
      data.activities = seeded.activities;
      migrated = true;
    }
    const defaultTagline = "Building character. Advancing knowledge. Shaping futures.";
    if (
      !data.settings.schoolTagline ||
      data.settings.schoolTagline === "Excellence in learning"
    ) {
      data.settings.schoolTagline = defaultTagline;
      migrated = true;
    }
    if (!data.settings.logoPath) {
      data.settings.logoPath = "assets/brothers-college-logo.jpg";
      migrated = true;
    }
    if (migrated) save(data);
    return data;
  } catch {
    const data = seedData();
    save(data);
    return data;
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadPresence() {
  try {
    const raw = localStorage.getItem(PRESENCE_KEY);
    if (!raw) return { active: [], history: [] };
    const parsed = JSON.parse(raw);
    return {
      active: Array.isArray(parsed.active) ? parsed.active : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { active: [], history: [] };
  }
}

function savePresence(presence) {
  localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
}

function prunePresence(presence, now = Date.now()) {
  presence.active = (presence.active || []).filter((s) => now - Number(s.lastSeen || 0) < ONLINE_MS * 2);
  presence.history = (presence.history || []).slice(0, HISTORY_LIMIT);
  return presence;
}

function tabId() {
  let id = sessionStorage.getItem("edusmart-tab-id");
  if (!id) {
    id = `tab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem("edusmart-tab-id", id);
  }
  return id;
}

const ROLE_VIEWS = {
  admin: ["dashboard", "school", "students", "teachers", "classes", "fees", "results", "settings"],
  teacher: ["dashboard", "school", "students", "classes", "results"],
  parent: ["dashboard", "school", "fees", "results"],
};

export const store = {
  get() {
    return load();
  },

  set(data) {
    save(data);
  },

  reset() {
    if (!this.requireAdmin("reset demo data")) return load();
    const data = seedData();
    save(data);
    savePresence({ active: [], history: [] });
    return data;
  },

  login(username, password) {
    const data = load();
    const user = (data.users || []).find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!user) return null;
    const now = Date.now();
    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      teacherId: user.teacherId || null,
      studentIds: user.studentIds || [],
      tabId: tabId(),
      at: now,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.markOnline(session);
    return session;
  },

  logout() {
    const session = this.session();
    if (session) this.markOffline(session);
    sessionStorage.removeItem(SESSION_KEY);
  },

  session() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  markOnline(session = this.session()) {
    if (!session) return;
    const now = Date.now();
    const presence = prunePresence(loadPresence(), now);
    const entry = {
      tabId: session.tabId || tabId(),
      userId: session.userId,
      username: session.username,
      name: session.name,
      role: session.role,
      loginAt: session.at || now,
      lastSeen: now,
    };

    const idx = presence.active.findIndex((s) => s.tabId === entry.tabId);
    if (idx >= 0) {
      presence.active[idx] = { ...presence.active[idx], ...entry, loginAt: presence.active[idx].loginAt || entry.loginAt };
    } else {
      presence.active.unshift(entry);
      presence.history.unshift({
        userId: entry.userId,
        username: entry.username,
        name: entry.name,
        role: entry.role,
        at: now,
        action: "login",
      });
    }
    savePresence(prunePresence(presence, now));
  },

  markOffline(session = this.session()) {
    if (!session) return;
    const now = Date.now();
    const presence = prunePresence(loadPresence(), now);
    const tid = session.tabId || tabId();
    const wasOnline = presence.active.some((s) => s.tabId === tid);
    presence.active = presence.active.filter((s) => s.tabId !== tid);
    if (wasOnline) {
      presence.history.unshift({
        userId: session.userId,
        username: session.username,
        name: session.name,
        role: session.role,
        at: now,
        action: "logout",
      });
    }
    savePresence(prunePresence(presence, now));
  },

  heartbeat() {
    const session = this.session();
    if (!session) return;
    this.markOnline(session);
  },

  /** Admin-only: who is currently online */
  getOnlineUsers() {
    const now = Date.now();
    const presence = prunePresence(loadPresence(), now);
    savePresence(presence);
    return presence.active
      .filter((s) => now - Number(s.lastSeen || 0) <= ONLINE_MS)
      .sort((a, b) => Number(b.lastSeen) - Number(a.lastSeen));
  },

  /** Admin-only: recent login/logout activity */
  getLoginHistory() {
    return prunePresence(loadPresence()).history.slice(0, HISTORY_LIMIT);
  },

  canAccess(view) {
    const session = this.session();
    if (!session) return false;
    return (ROLE_VIEWS[session.role] || []).includes(view);
  },

  allowedViews() {
    const session = this.session();
    if (!session) return [];
    return ROLE_VIEWS[session.role] || [];
  },

  isAdmin() {
    return this.session()?.role === "admin";
  },

  isTeacher() {
    return this.session()?.role === "teacher";
  },

  isParent() {
    return this.session()?.role === "parent";
  },

  /** Only administrator may create, change, or delete school data */
  requireAdmin(action = "change data") {
    if (this.isAdmin()) return true;
    console.warn(`Blocked: only administrator can ${action}.`);
    return false;
  },

  /** Students visible for current role */
  visibleStudents(data = load()) {
    const session = this.session();
    if (!session) return [];
    if (session.role === "admin") return data.students;
    if (session.role === "parent") {
      return data.students.filter((s) => session.studentIds.includes(s.id));
    }
    if (session.role === "teacher") {
      const myClassIds = data.classes.filter((c) => c.teacherId === session.teacherId).map((c) => c.id);
      return data.students.filter((s) => myClassIds.includes(s.classId));
    }
    return [];
  },

  visibleClasses(data = load()) {
    const session = this.session();
    if (!session) return [];
    if (session.role === "admin") return data.classes;
    if (session.role === "teacher") {
      return data.classes.filter((c) => c.teacherId === session.teacherId);
    }
    return [];
  },

  upsert(collection, record) {
    if (!this.requireAdmin("add or edit records")) return load();
    const data = load();
    const list = data[collection] || [];
    const idx = list.findIndex((item) => item.id === record.id);
    if (idx >= 0) list[idx] = record;
    else list.push({ ...record, id: record.id || uid(collection.slice(0, 1)) });
    data[collection] = list;
    save(data);
    return data;
  },

  remove(collection, id) {
    if (!this.requireAdmin("delete records")) return load();
    const data = load();
    data[collection] = (data[collection] || []).filter((item) => item.id !== id);
    save(data);
    return data;
  },

  updateSettings(patch) {
    if (!this.requireAdmin("update settings")) return load();
    const data = load();
    data.settings = { ...data.settings, ...patch };
    save(data);
    return data;
  },

  updateSchoolAbout(patch) {
    if (!this.requireAdmin("edit school information")) return load();
    const data = load();
    data.schoolAbout = { ...(data.schoolAbout || {}), ...patch };
    save(data);
    return data;
  },

  nextReceiptNo() {
    if (!this.requireAdmin("create receipts")) {
      return `RCP-${Date.now().toString().slice(-4)}`;
    }
    const data = load();
    const n = Number(data.settings.receiptCounter) || 1000;
    data.settings.receiptCounter = n + 1;
    save(data);
    return `RCP-${n}`;
  },

  applyFeeTemplate(templateId) {
    if (!this.requireAdmin("generate fees from templates")) return { created: 0 };
    const data = load();
    const template = (data.feeTemplates || []).find((t) => t.id === templateId);
    if (!template) return { created: 0 };

    let created = 0;
    const classIds = data.classes.filter((c) => c.level === template.level).map((c) => c.id);
    const targets = data.students.filter((s) => classIds.includes(s.classId) && s.status === "active");

    for (const student of targets) {
      const exists = data.fees.some(
        (f) => f.studentId === student.id && f.term === template.term
      );
      if (exists) continue;
      data.fees.push({
        id: uid("f"),
        studentId: student.id,
        term: template.term,
        amountDue: Number(template.amount),
        amountPaid: 0,
        date: new Date().toISOString().slice(0, 10),
        method: "Cash",
        note: template.description || "Generated from fee template",
        receiptNo: `RCP-${data.settings.receiptCounter++}`,
      });
      created += 1;
    }
    save(data);
    return { created };
  },

  uid,
};

export function money(amount, currency = "USD") {
  const n = Number(amount) || 0;
  return `${currency} ${n.toFixed(2)}`;
}

export function gradeFromScore(score, max = 100) {
  const pct = (Number(score) / Number(max || 100)) * 100;
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  if (pct >= 40) return "E";
  return "U";
}

export function feeStatus(record) {
  const due = Number(record.amountDue) || 0;
  const paid = Number(record.amountPaid) || 0;
  if (paid >= due) return "Paid";
  if (paid > 0) return "Partial";
  return "Unpaid";
}

export function studentName(student) {
  if (!student) return "—";
  return `${student.firstName} ${student.lastName}`;
}

export function teacherName(teacher) {
  if (!teacher) return "Unassigned";
  return `${teacher.firstName} ${teacher.lastName}`;
}

export function roleLabel(role) {
  if (role === "admin") return "Administrator";
  if (role === "teacher") return "Teacher";
  if (role === "parent") return "Parent / Guardian";
  return role || "—";
}
