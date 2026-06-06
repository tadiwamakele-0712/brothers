// Lesson 5 — Responsive Design (JavaScript helpers)

// Show current screen width (updates on resize)
const screenWidthEl = document.getElementById("screen-width");

function updateScreenWidth() {
  if (screenWidthEl) {
    screenWidthEl.textContent = window.innerWidth;
  }
}

updateScreenWidth();
window.addEventListener("resize", updateScreenWidth);

// Mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });
}

// Practice layout buttons
const practiceGrid = document.getElementById("practice-grid");
const layoutButtons = document.querySelectorAll("[data-layout]");

layoutButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const layout = btn.getAttribute("data-layout");
    practiceGrid.classList.remove("layout-stack", "layout-row");
    practiceGrid.classList.add("layout-" + layout);
  });
});
