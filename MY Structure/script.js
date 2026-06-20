// --- Change hero title (Lesson: click events) ---
const mainTitle = document.getElementById("main-title");
const changeTitleBtn = document.getElementById("change-title-btn");

if (mainTitle && changeTitleBtn) {
  const titles = [
    "Farming for a Better Future",
    "Grow Crops, Feed the Nation",
    "Care for Animals, Care for Life",
    "MY Structure — Learn & Grow",
  ];

  let titleIndex = 0;

  changeTitleBtn.addEventListener("click", function () {
    titleIndex = (titleIndex + 1) % titles.length;
    mainTitle.textContent = titles[titleIndex];
  });
}

// --- Mobile menu (Lesson: classList toggle) ---
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Crop info cards (Lesson: objects + click) ---
const cropData = {
  maize: "Maize grows well in warm weather. Plant after rains, weed often, and harvest when cobs are dry.",
  wheat: "Wheat likes cooler seasons. Needs good drainage and nitrogen-rich soil for strong grain.",
  tomato: "Tomatoes need sun, water, and support sticks. Watch for pests on leaves and fruit.",
  beans: "Beans fix nitrogen in soil. Plant in rows, keep moist, and pick pods when firm and full.",
};

const cropInfo = document.getElementById("crop-info");
const cropCards = document.querySelectorAll(".crop-card");

if (cropInfo && cropCards.length) {
  cropCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const crop = card.dataset.crop;

      cropCards.forEach(function (c) {
        c.classList.remove("active");
      });
      card.classList.add("active");

      cropInfo.textContent = cropData[crop];
    });
  });
}

// --- Season tabs ---
const seasonInfo = {
  rainy:
    "Rainy season: Best for maize, beans, and tomatoes. Prepare land early, plant when soil is moist, and weed regularly.",
  dry:
    "Dry season: Focus on irrigation, wheat, and stored crops. Conserve water, mulch soil, and protect animals from heat.",
};

const seasonInfoEl = document.getElementById("season-info");
const seasonTabs = document.querySelectorAll(".season-tab");

if (seasonInfoEl && seasonTabs.length) {
  seasonTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const season = tab.dataset.season;

      seasonTabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");

      seasonInfoEl.innerHTML =
        "<strong>" +
        tab.textContent +
        ":</strong> " +
        seasonInfo[season].replace(/^[^:]+:\s*/, "");
    });
  });
}

// --- Harvest calculator (Lesson: numbers + if/else) ---
const fieldSizeInput = document.getElementById("field-size");
const cropTypeSelect = document.getElementById("crop-type");
const calcBtn = document.getElementById("calc-btn");
const calcResult = document.getElementById("calc-result");

const yieldPerHectare = {
  maize: 3000,
  wheat: 2500,
  tomato: 18000,
  beans: 1200,
};

if (calcBtn && fieldSizeInput && cropTypeSelect && calcResult) {
  calcBtn.addEventListener("click", function () {
    const size = Number(fieldSizeInput.value);
    const crop = cropTypeSelect.value;

    if (!size || size <= 0) {
      calcResult.textContent = "Please enter a field size greater than 0.";
      calcResult.style.color = "#c62828";
      return;
    }

    const total = Math.round(size * yieldPerHectare[crop]);
    calcResult.style.color = "#1b5e20";
    calcResult.textContent =
      "Estimated harvest: about " + total.toLocaleString() + " kg of " + crop + ".";
  });
}

// --- Checklist with localStorage (Lesson: saving data) ---
function setupChecklist(listId, storageKey) {
  const list = document.getElementById(listId);
  if (!list) return;

  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

  list.querySelectorAll("input[type=checkbox]").forEach(function (box) {
    if (saved[box.id]) box.checked = true;

    box.addEventListener("change", function () {
      const state = {};
      list.querySelectorAll("input[type=checkbox]").forEach(function (b) {
        state[b.id] = b.checked;
      });
      localStorage.setItem(storageKey, JSON.stringify(state));
    });
  });
}

setupChecklist("farm-checklist", "my-structure-farm-checklist");
setupChecklist("animal-checklist", "my-structure-animal-checklist");

const resetChecklistBtn = document.getElementById("reset-checklist");
if (resetChecklistBtn) {
  resetChecklistBtn.addEventListener("click", function () {
    const list = document.getElementById("farm-checklist");
    if (!list) return;

    list.querySelectorAll("input[type=checkbox]").forEach(function (box) {
      box.checked = false;
    });
    localStorage.removeItem("my-structure-farm-checklist");
  });
}

// --- FAQ accordion ---
document.querySelectorAll(".faq-question").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(function (faq) {
      faq.classList.remove("open");
      faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// --- Stats counter animation ---
const statNumbers = document.querySelectorAll(".stat-number");

if (statNumbers.length) {
  statNumbers.forEach(function (el) {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 40);
  });
}

// --- Animal filter (animals.html) ---
const filterBtns = document.querySelectorAll(".filter-btn");
const filterMessage = document.getElementById("filter-message");

const filterText = {
  all: "Showing all animals. Scroll to read each section.",
  cattle: "Cattle — scroll to the Cattle section for feed, shelter, and health tips.",
  goats: "Goats — scroll to the Goats section for milk and housing advice.",
  chickens: "Chickens — scroll to the Chickens section for coop and egg tips.",
  pigs: "Pigs — scroll to the Pigs section for pen and feed management.",
};

if (filterBtns.length && filterMessage) {
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.dataset.filter;

      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      filterMessage.textContent = filterText[filter];

      if (filter !== "all") {
        const section = document.getElementById(filter);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

// --- Back to top button ---
const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Tip of the day ---
const dailyTip = document.getElementById("daily-tip");
const newTipBtn = document.getElementById("new-tip-btn");

const farmTips = [
  "Water crops early in the morning to reduce evaporation.",
  "Rotate crops each season to keep soil healthy.",
  "Collect rainwater in drums for dry weeks.",
  "Check animals for signs of illness every day.",
  "Mulch around tomatoes to keep moisture in the soil.",
  "Dry maize fully before storing to prevent mould.",
  "Keep chicken coops clean to reduce disease.",
  "Test soil with compost before planting season starts.",
];

if (dailyTip && newTipBtn) {
  newTipBtn.addEventListener("click", function () {
    let next = farmTips[Math.floor(Math.random() * farmTips.length)];
    while (farmTips.length > 1 && next === dailyTip.textContent) {
      next = farmTips[Math.floor(Math.random() * farmTips.length)];
    }
    dailyTip.textContent = next;
  });
}

// --- Crop search on home page ---
const cropSearch = document.getElementById("crop-search");
const cropGrid = document.getElementById("crop-grid");

if (cropSearch && cropGrid) {
  cropSearch.addEventListener("input", function () {
    const query = cropSearch.value.toLowerCase().trim();

    cropGrid.querySelectorAll(".crop-card").forEach(function (card) {
      const name = card.dataset.crop || "";
      const text = card.textContent.toLowerCase();
      const match = query === "" || name.includes(query) || text.includes(query);
      card.classList.toggle("hidden", !match);
    });
  });
}

// --- Crop search on crops.html ---
const cropSearchPage = document.getElementById("crop-search-page");
const cropSearchResult = document.getElementById("crop-search-result");
const cropDetails = document.querySelectorAll(".crop-detail");

if (cropSearchPage && cropDetails.length) {
  cropSearchPage.addEventListener("input", function () {
    const query = cropSearchPage.value.toLowerCase().trim();
    let visible = 0;

    cropDetails.forEach(function (section) {
      const name = section.dataset.cropName || "";
      const text = section.textContent.toLowerCase();
      const match = query === "" || name.includes(query) || text.includes(query);
      section.classList.toggle("hidden", !match);
      if (match) visible += 1;
    });

    if (cropSearchResult) {
      cropSearchResult.textContent =
        query === ""
          ? "Showing all crops."
          : "Showing " + visible + " crop(s) matching \"" + query + "\".";
    }
  });
}

// --- Newsletter subscribe (localStorage demo) ---
const subscribeName = document.getElementById("subscribe-name");
const subscribeBtn = document.getElementById("subscribe-btn");
const subscribeMsg = document.getElementById("subscribe-msg");
const SUBSCRIBE_KEY = "my-structure-subscriber";

if (subscribeBtn && subscribeName && subscribeMsg) {
  const savedName = localStorage.getItem(SUBSCRIBE_KEY);
  if (savedName) {
    subscribeName.value = savedName;
    subscribeMsg.textContent = "Welcome back, " + savedName + "! You are subscribed.";
    subscribeMsg.style.color = "#1b5e20";
  }

  subscribeBtn.addEventListener("click", function () {
    const name = subscribeName.value.trim();

    if (name === "") {
      subscribeMsg.textContent = "Please enter your name first.";
      subscribeMsg.style.color = "#c62828";
      return;
    }

    localStorage.setItem(SUBSCRIBE_KEY, name);
    subscribeMsg.textContent = "Thanks, " + name + "! You joined farm updates.";
    subscribeMsg.style.color = "#1b5e20";
  });
}

// --- Dark mode toggle ---
const themeToggle = document.getElementById("theme-toggle");
const THEME_KEY = "my-structure-theme";

if (localStorage.getItem(THEME_KEY) === "dark") {
  document.body.classList.add("dark-mode");
}

if (themeToggle) {
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";

  themeToggle.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  });
}
