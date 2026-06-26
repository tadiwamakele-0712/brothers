import { SITE, STATS, SECTORS, CATEGORIES } from "./data.js";

function $(id) {
  return document.getElementById(id);
}

let activeCategory = "all";
let searchQuery = "";

function renderStats() {
  const grid = $("hero-stats");
  if (!grid) return;
  grid.innerHTML = STATS.map(
    (s) => `
    <div class="stat">
      <strong>${s.value}</strong>
      <span>${s.label}</span>
    </div>`
  ).join("");
}

function renderSectors() {
  const grid = $("sectors-grid");
  if (!grid) return;
  grid.innerHTML = SECTORS.map((s) => `<div class="sector-card">${s}</div>`).join("");
}

function renderFilterChips() {
  const chips = $("filter-chips");
  if (!chips) return;

  const allChip = `<button type="button" class="chip active" data-category="all">All Categories</button>`;
  const categoryChips = CATEGORIES.map(
    (c) =>
      `<button type="button" class="chip" data-category="${c.id}">${c.number} ${c.title}</button>`
  ).join("");

  chips.innerHTML = allChip + categoryChips;

  chips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.category;
      chips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderCatalogue();
    });
  });
}

function matchesSearch(product, category) {
  if (!searchQuery) return true;
  const q = searchQuery.toLowerCase();
  const specText = Object.entries(product.specs)
    .map(([k, v]) => `${k} ${v}`)
    .join(" ")
    .toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    category.title.toLowerCase().includes(q) ||
    specText.includes(q)
  );
}

function renderProductCard(product, category) {
  const specsHtml = Object.entries(product.specs)
    .map(
      ([key, value]) =>
        `<tr><th>${key}</th><td>${value}</td></tr>`
    )
    .join("");

  const enquireMsg = encodeURIComponent(
    `Hello ${SITE.name},\n\nI would like to enquire about:\n\nProduct: ${product.name}\nCategory: ${category.title}\n\nPlease send pricing and availability.\n\nThank you.`
  );

  return `
    <article class="product-card" data-product="${product.id}">
      <div class="product-card-header">
        <h4>${product.name}</h4>
      </div>
      <div class="product-card-body">
        <p>${product.description}</p>
        <table class="specs-table">${specsHtml}</table>
      </div>
      <div class="product-card-footer">
        <a href="${SITE.whatsapp}?text=${enquireMsg}" class="btn btn-enquire" target="_blank" rel="noopener noreferrer">
          Enquire via WhatsApp
        </a>
      </div>
    </article>`;
}

function renderCatalogue() {
  const container = $("catalogue");
  const countEl = $("results-count");
  if (!container) return;

  let totalProducts = 0;
  let html = "";

  for (const category of CATEGORIES) {
    if (activeCategory !== "all" && activeCategory !== category.id) continue;

    const products = category.products.filter((p) => matchesSearch(p, category));
    if (products.length === 0) continue;

    totalProducts += products.length;

    html += `
      <section class="category-section" id="${category.id}">
        <div class="category-header">
          <span class="category-number">${category.number}</span>
          <div>
            <h3>${category.title}</h3>
            <p class="category-subtitle">${category.subtitle}</p>
            <p>${category.description}</p>
          </div>
        </div>
        <div class="product-grid">
          ${products.map((p) => renderProductCard(p, category)).join("")}
        </div>
      </section>`;
  }

  if (!html) {
    html = `
      <div class="no-results">
        <h3>No products found</h3>
        <p>Try a different search term or category filter.</p>
      </div>`;
    totalProducts = 0;
  }

  container.innerHTML = html;

  if (countEl) {
    countEl.textContent =
      totalProducts === 0
        ? "No matching products"
        : `Showing ${totalProducts} product${totalProducts !== 1 ? "s" : ""}`;
  }
}

function populateEnquiryCategories() {
  const select = $("enquiry-category");
  if (!select) return;

  select.innerHTML =
    '<option value="">Select category (optional)</option>' +
    CATEGORIES.map((c) => `<option value="${c.title}">${c.title}</option>`).join("");
}

function setupSearch() {
  const input = $("search-input");
  if (!input) return;

  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      searchQuery = input.value.trim();
      renderCatalogue();
    }, 250);
  });
}

function setupEnquiryForm() {
  const form = $("enquiry-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    const lines = [
      `Hello ${SITE.name},`,
      ``,
      `I have a technical sales enquiry:`,
      ``,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      data.category ? `Category: ${data.category}` : null,
      data.product ? `Product: ${data.product}` : null,
      data.message ? `Message: ${data.message}` : null,
      ``,
      `Please contact me with pricing and availability.`,
    ].filter(Boolean);

    window.open(
      `${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );

    const success = $("enquiry-success");
    if (success) {
      success.hidden = false;
      setTimeout(() => {
        success.hidden = true;
      }, 5000);
    }
    form.reset();
  });
}

function setupContact() {
  const phone1 = $("contact-phone-1");
  const phone2 = $("contact-phone-2");
  const email = $("contact-email");
  const whatsapp = $("contact-whatsapp");

  if (phone1) {
    phone1.href = `tel:${SITE.phone1.replace(/\s/g, "")}`;
    phone1.querySelector(".contact-value").textContent = SITE.phone1;
  }
  if (phone2) {
    phone2.href = `tel:${SITE.phone2.replace(/\s/g, "")}`;
    phone2.querySelector(".contact-value").textContent = SITE.phone2;
  }
  if (email) {
    email.href = `mailto:${SITE.email}`;
    email.querySelector(".contact-value").textContent = SITE.email;
  }
  if (whatsapp) {
    whatsapp.href = SITE.whatsapp;
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
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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
  renderFilterChips();
  populateEnquiryCategories();
  renderCatalogue();
  setupSearch();
  setupEnquiryForm();
  setupContact();
  setupMobileNav();
}

init();
