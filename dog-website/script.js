const breeds = [
  "Labrador retriever",
  "Golden retriever",
  "German shepherd",
  "Poodle",
  "Australian shepherd",
  "Dachshund",
  "Border collie",
  "Chihuahua",
  "Beagle",
  "Pembroke Welsh corgi",
  "Boxer",
  "Shih Tzu",
  "Miniature schnauzer",
  "Pug",
  "Havanese",
  "Cavalier King Charles spaniel",
  "Yorkshire terrier",
  "Great Dane",
  "Greyhound",
  "Boston terrier",
  "Siberian husky",
  "Shetland sheepdog",
  "English springer spaniel",
  "Australian cattle dog",
  "Doberman pinscher",
];

const galleryImages = [
  "WhatsApp Image 2026-09-22 at 22.30.13 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.13 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.13.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.14 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.14.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.15 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.15 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.15.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.16 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.16 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.16.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.17 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.17.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.18 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.18 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.18.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.19 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.19 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.19.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.20 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.20.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.21 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.21.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.22 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.22 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.22.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.23 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.23 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.23.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.24 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.24.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.25.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.26 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.26.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.27.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.40.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.41 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.41.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.42.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.43.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.47.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.48.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.49 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.49 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.49.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.50 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.50 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.50.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.52.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.53.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.55.jpeg",
  "WhatsApp Image 2026-09-22 at 22.30.56.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.01 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.01.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.02.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.04 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.04.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.05 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.05 (2).jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.05.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.06 (1).jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.06.jpeg",
  "WhatsApp Image 2026-09-22 at 22.31.07.jpeg",
  "WhatsApp Image 2026-09-22 at 23.01.24.jpeg",
];

const trainingImages = [
  { file: "dog training/training1.jpeg", alt: "Basic obedience training — sit, down, and shake" },
  { file: "dog training/training2.jpeg", alt: "Dog training session with Chicco Canine Care" },
  { file: "dog training/training3.jpeg", alt: "Agility and skill training" },
  { file: "dog training/training4.jpeg", alt: "Hands-on canine training practice" },
];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const yearEl = document.getElementById("year");
const AUTO_MS = 4500;

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

function encodePath(path) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  pauseAllSliders();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
  resumeAllSliders();
}

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

const sliders = [];

function pauseAllSliders() {
  sliders.forEach((s) => s.pause());
}

function resumeAllSliders() {
  sliders.forEach((s) => s.play());
}

function createSlider({
  rootId,
  slidesId,
  dotsId,
  prevId,
  nextId,
  currentId,
  totalId,
  captionId,
  items,
}) {
  const root = document.getElementById(rootId);
  const slidesEl = document.getElementById(slidesId);
  const dotsEl = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const currentEl = document.getElementById(currentId);
  const totalEl = document.getElementById(totalId);
  const captionEl = captionId ? document.getElementById(captionId) : null;

  if (!root || !slidesEl || !items.length) return null;

  let index = 0;
  let timer = null;

  items.forEach((item, i) => {
    const src = typeof item === "string" ? item.src || item : item.src;
    const alt = item.alt || `Slide ${i + 1}`;
    const caption = item.caption || "";

    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " is-active" : "");
    slide.dataset.caption = caption;
    slide.innerHTML = `<img src="${src}" alt="${alt}" ${i === 0 ? "" : 'loading="lazy"'} />`;
    slide.querySelector("img").addEventListener("click", () => openLightbox(src, alt));
    slidesEl.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i));
    dotsEl?.appendChild(dot);
  });

  if (totalEl) totalEl.textContent = String(items.length);
  if (captionEl) captionEl.textContent = items[0].caption || "";
  if (dotsEl && items.length > 20) dotsEl.classList.add("many-dots");

  function goTo(next) {
    const slides = slidesEl.querySelectorAll(".slide");
    const dots = dotsEl?.querySelectorAll("button") || [];
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    if (currentEl) currentEl.textContent = String(index + 1);
    if (captionEl) captionEl.textContent = slides[index].dataset.caption || "";
    restart();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, AUTO_MS);
  }

  function pause() {
    clearInterval(timer);
    timer = null;
  }

  function play() {
    restart();
  }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);
  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", play);

  let touchStartX = 0;
  root.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  root.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );

  restart();

  return { goTo, next, prev, pause, play, getIndex: () => index };
}

const breedItems = breeds.map((name) => ({
  src: encodePath(`names  of breeds/${name}.jpg`),
  alt: name,
  caption: name,
}));

const galleryItems = galleryImages.map((file, i) => {
  const path = file.includes("/") ? file : `images/${file}`;
  return {
    src: encodePath(path),
    alt: `Chicco Canine Care gallery photo ${i + 1}`,
  };
});

const trainingItems = trainingImages.map((item) => ({
  src: encodePath(item.file),
  alt: item.alt,
}));

const trainingSlider = createSlider({
  rootId: "training-slider",
  slidesId: "training-slides",
  dotsId: "training-dots",
  prevId: "training-prev",
  nextId: "training-next",
  currentId: "training-current",
  totalId: "training-total",
  items: trainingItems,
});

const breedSlider = createSlider({
  rootId: "breed-slider",
  slidesId: "breed-slides",
  dotsId: "breed-dots",
  prevId: "breed-prev",
  nextId: "breed-next",
  currentId: "breed-current",
  totalId: "breed-total",
  captionId: "breed-caption",
  items: breedItems,
});

const gallerySlider = createSlider({
  rootId: "gallery-slider",
  slidesId: "gallery-slides",
  dotsId: "gallery-dots",
  prevId: "gallery-prev",
  nextId: "gallery-next",
  currentId: "gallery-current",
  totalId: "gallery-total",
  items: galleryItems,
});

if (trainingSlider) sliders.push(trainingSlider);
if (breedSlider) sliders.push(breedSlider);
if (gallerySlider) sliders.push(gallerySlider);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

/* Mobile nav */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

/* Header scroll state */
const header = document.querySelector(".site-header");
const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Reveal on scroll */
document.querySelectorAll(".section").forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
