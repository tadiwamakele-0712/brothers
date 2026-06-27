import { SITE, STATS, SECTORS, CATEGORIES } from "./data.js";

function $(id) {
  return document.getElementById(id);
}

function renderStats() {
  const grid = $("stats-grid");
  if (!grid) return;
  grid.innerHTML = STATS.map(
    (s) => `
    <article class="stat-card">
      <strong>${s.value}</strong>
      <span>${s.label}</span>
    </article>`
  ).join("");
}

function renderSectors() {
  const grid = $("sectors-grid");
  if (!grid) return;
  grid.innerHTML = SECTORS.map((s) => `<div class="sector-pill">${s}</div>`).join("");
}

function renderCapabilities() {
  const grid = $("capabilities-grid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <article class="capability-card">
      <span class="capability-num">${c.number}</span>
      <h3>${c.title}</h3>
      <p>${c.subtitle}</p>
      <span class="capability-count">${c.products.length} product lines</span>
    </article>`
  ).join("");
}

function renderHighlights() {
  const grid = $("highlights-grid");
  if (!grid) return;

  const highlights = [
    {
      icon: "🔩",
      title: "Industrial Fasteners & Bolting",
      text: "Hex bolts, stainless steel fasteners, stud bolts, and anchor systems with mill certification and full traceability.",
    },
    {
      icon: "⚙️",
      title: "Seals, Hoses & Mechanical Spares",
      text: "PTFE tape, hydraulic and mining hose, bearings, packings, and rubber sheeting for plant maintenance.",
    },
    {
      icon: "💧",
      title: "Borehole & Water Solutions",
      text: "End-to-end borehole survey, drilling, pump supply, rising mains, and rehabilitation across Zimbabwe.",
    },
    {
      icon: "📡",
      title: "Instrumentation & Control",
      text: "VSD drives, process sensors, panel meters, and field consumables for accurate process control.",
    },
    {
      icon: "🔒",
      title: "Security & Automation",
      text: "CCTV systems, gate motors, intercoms, and pump repair services for industrial and residential sites.",
    },
    {
      icon: "🔧",
      title: "Valves & Gaskets",
      text: "Gate, ball, butterfly, and check valves plus spiral-wound, ring joint, and sheet gaskets.",
    },
  ];

  grid.innerHTML = highlights
    .map(
      (h) => `
    <article class="highlight-card">
      <span class="highlight-icon">${h.icon}</span>
      <h3>${h.title}</h3>
      <p>${h.text}</p>
    </article>`
    )
    .join("");
}

function setupContact() {
  const email = $("contact-email");
  const phone1 = $("contact-phone-1");
  const phone2 = $("contact-phone-2");
  const whatsapp = $("contact-whatsapp");
  const website = $("contact-website");

  if (email) {
    email.href = `mailto:${SITE.email}`;
    email.textContent = SITE.email;
  }
  if (phone1) {
    phone1.href = `tel:${SITE.phone1.replace(/\s/g, "")}`;
    phone1.textContent = SITE.phone1;
  }
  if (phone2) {
    phone2.href = `tel:${SITE.phone2.replace(/\s/g, "")}`;
    phone2.textContent = SITE.phone2;
  }
  if (whatsapp) whatsapp.href = SITE.whatsapp;
  if (website) {
    website.href = `https://${SITE.website}`;
    website.textContent = SITE.website;
  }
}

function setupMobileNav() {
  const toggle = $("menu-toggle");
  const nav = $("mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.hidden;
    nav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function init() {
  renderStats();
  renderSectors();
  renderCapabilities();
  renderHighlights();
  setupContact();
  setupMobileNav();
}

init();
