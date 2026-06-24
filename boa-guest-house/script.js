import { SITE, ROOMS, GALLERY, AMENITIES } from "./data.js";

const BOOKINGS_KEY = "boa-guest-bookings";
const REVIEWS_KEY = "boa-guest-reviews";

function $(id) {
  return document.getElementById(id);
}

function starsHtml(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderAmenities() {
  const list = $("amenity-list");
  list.innerHTML = AMENITIES.map((a) => `<li>${a}</li>`).join("");
}

function renderRooms() {
  const grid = $("room-grid");
  const select = $("room-select");

  grid.innerHTML = ROOMS.map(
    (room) => `
    <article class="room-card">
      <div class="room-img-wrap">
        <img src="${room.image}" alt="${room.name}" loading="lazy" width="400" height="300">
      </div>
      <div class="room-body">
        <h3>${room.name}</h3>
        <p class="room-price">${room.price}</p>
        <div class="room-meta">
          <span>${room.beds}</span>
          <span>Up to ${room.guests} guests</span>
        </div>
        <ul class="room-features">
          ${room.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </article>`
  ).join("");

  select.innerHTML =
    '<option value="">Select a room</option>' +
    ROOMS.map((r) => `<option value="${r.id}">${r.name} — ${r.price}</option>`).join("");
}

function renderGallery() {
  const grid = $("gallery-grid");
  grid.innerHTML = GALLERY.map(
    (item, i) => `
    <button type="button" class="gallery-item" data-index="${i}" data-caption="${item.caption}">
      <img src="${item.src}" alt="${item.caption}" loading="lazy" width="320" height="240">
    </button>`
  ).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-item");
    if (!btn) return;
    openLightbox(Number(btn.dataset.index));
  });
}

function openLightbox(index) {
  const item = GALLERY[index];
  const dialog = $("lightbox");
  $("lightbox-img").src = item.src;
  $("lightbox-img").alt = item.caption;
  $("lightbox-caption").textContent = item.caption;
  dialog.showModal();
}

function setupLightbox() {
  $("lightbox-close").addEventListener("click", () => $("lightbox").close());
  $("lightbox").addEventListener("click", (e) => {
    if (e.target === $("lightbox")) $("lightbox").close();
  });
}

function setupMobileNav() {
  const toggle = $("menu-toggle");
  const nav = $("mobile-nav");

  toggle.addEventListener("click", () => {
    const open = nav.hidden;
    nav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
}

function setupContact() {
  $("phone-display").textContent = SITE.phoneDisplay;
  $("email-display").textContent = SITE.email;
  $("contact-phone").href = `tel:${SITE.phone.replace(/\s/g, "")}`;
  $("contact-email").href = `mailto:${SITE.email}`;
  $("contact-whatsapp").href = SITE.whatsapp;
}

function buildWhatsAppMessage(data) {
  const room = ROOMS.find((r) => r.id === data.room);
  const lines = [
    `Hello ${SITE.shortName}! I'd like to book a stay.`,
    ``,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    `Room: ${room?.name ?? data.room}`,
    `Check-in: ${data.checkin}`,
    `Check-out: ${data.checkout}`,
    `Adults: ${data.adults}`,
    `Children: ${data.children}`,
    data.notes ? `Notes: ${data.notes}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}

function updateWhatsAppLink() {
  const form = $("booking-form");
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  const link = $("whatsapp-book");
  if (data.name && data.phone && data.room && data.checkin && data.checkout) {
    link.href = `${SITE.whatsapp}?text=${buildWhatsAppMessage(data)}`;
  } else {
    link.href = SITE.whatsapp;
  }
}

function setupBooking() {
  const form = $("booking-form");
  const checkin = $("checkin");
  const checkout = $("checkout");
  const today = new Date().toISOString().split("T")[0];

  checkin.min = today;
  checkout.min = today;

  checkin.addEventListener("change", () => {
    checkout.min = checkin.value || today;
    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
    updateSummary();
    updateWhatsAppLink();
  });

  checkout.addEventListener("change", () => {
    updateSummary();
    updateWhatsAppLink();
  });

  form.addEventListener("input", () => {
    updateSummary();
    updateWhatsAppLink();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    if (!data.name || !data.phone || !data.room || !data.checkin || !data.checkout) {
      form.reportValidity();
      return;
    }

    if (data.checkout <= data.checkin) {
      checkout.setCustomValidity("Check-out must be after check-in");
      checkout.reportValidity();
      return;
    }
    checkout.setCustomValidity("");

    const bookings = loadJson(BOOKINGS_KEY, []);
    bookings.push({ ...data, submittedAt: new Date().toISOString() });
    saveJson(BOOKINGS_KEY, bookings);

    $("booking-success").hidden = false;
    form.reset();
    $("booking-summary").hidden = true;
    setTimeout(() => {
      $("booking-success").hidden = true;
    }, 5000);
  });
}

function updateSummary() {
  const form = $("booking-form");
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  const summary = $("booking-summary");

  if (data.checkin && data.checkout && data.checkout > data.checkin) {
    const nights = Math.ceil(
      (new Date(data.checkout) - new Date(data.checkin)) / (1000 * 60 * 60 * 24)
    );
    const room = ROOMS.find((r) => r.id === data.room);
    summary.textContent = room
      ? `${nights} night${nights !== 1 ? "s" : ""} · ${room.name}`
      : `${nights} night${nights !== 1 ? "s" : ""} selected`;
    summary.hidden = false;
  } else {
    summary.hidden = true;
  }
}

function getReviews() {
  return loadJson(REVIEWS_KEY, []);
}

function renderReviews() {
  const reviews = getReviews();
  const list = $("review-list");

  if (!reviews.length) {
    list.innerHTML = '<p class="review-empty">No reviews yet — be the first to share your stay!</p>';
  } else {
    list.innerHTML = reviews
      .slice()
      .reverse()
      .map(
        (r) => `
      <article class="review-card">
        <div class="review-card-header">
          <div>
            <strong>${escapeHtml(r.reviewer)}</strong>
            <div class="review-stars">${starsHtml(r.rating)}</div>
          </div>
          <span class="review-date">${formatDate(r.date)}</span>
        </div>
        ${r.comment ? `<p>${escapeHtml(r.comment)}</p>` : ""}
      </article>`
      )
      .join("");
  }

  updateRatingSummary(reviews);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateRatingSummary(reviews) {
  const count = reviews.length;
  const avgEl = $("avg-rating");
  const starsEl = $("avg-stars");
  const countEl = $("review-count");
  const heroRating = $("hero-rating");
  const barsEl = $("rating-bars");

  if (!count) {
    avgEl.textContent = "0.0";
    starsEl.textContent = starsHtml(0);
    countEl.textContent = "No reviews yet";
    heroRating.textContent = "New";
    barsEl.innerHTML = [5, 4, 3, 2, 1]
      .map(
        (n) => `
      <div class="rating-bar-row">
        <span>${n} ★</span>
        <div class="rating-bar-track"><div class="rating-bar-fill" style="width:0%"></div></div>
        <span>0</span>
      </div>`
      )
      .join("");
    return;
  }

  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  const avg = sum / count;
  const rounded = Math.round(avg * 10) / 10;

  avgEl.textContent = rounded.toFixed(1);
  starsEl.textContent = starsHtml(Math.round(avg));
  countEl.textContent = `${count} review${count !== 1 ? "s" : ""}`;
  heroRating.textContent = rounded.toFixed(1);

  const dist = [0, 0, 0, 0, 0];
  reviews.forEach((r) => dist[r.rating - 1]++);

  barsEl.innerHTML = [5, 4, 3, 2, 1]
    .map((n) => {
      const c = dist[n - 1];
      const pct = Math.round((c / count) * 100);
      return `
      <div class="rating-bar-row">
        <span>${n} ★</span>
        <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${pct}%"></div></div>
        <span>${c}</span>
      </div>`;
    })
    .join("");
}

function setupReviewForm() {
  const form = $("review-form");
  const starBtns = document.querySelectorAll(".star-btn");
  const ratingInput = $("rating-value");
  let hover = 0;

  function paint(val) {
    starBtns.forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.value) <= val);
    });
  }

  starBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingInput.value = btn.dataset.value;
      paint(Number(btn.dataset.value));
    });
    btn.addEventListener("mouseenter", () => paint(Number(btn.dataset.value)));
    btn.addEventListener("mouseleave", () => paint(hover || Number(ratingInput.value)));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const rating = Number(ratingInput.value);
    const reviewer = fd.get("reviewer")?.trim();
    const comment = fd.get("comment")?.trim();

    if (!rating) {
      alert("Please select a star rating.");
      return;
    }
    if (!reviewer) {
      form.reportValidity();
      return;
    }

    const reviews = getReviews();
    reviews.push({ rating, reviewer, comment, date: new Date().toISOString() });
    saveJson(REVIEWS_KEY, reviews);

    form.reset();
    ratingInput.value = "0";
    hover = 0;
    paint(0);
    renderReviews();
  });
}

function init() {
  renderAmenities();
  renderRooms();
  renderGallery();
  setupLightbox();
  setupMobileNav();
  setupContact();
  setupBooking();
  setupReviewForm();
  renderReviews();
  updateWhatsAppLink();
}

init();
