(function () {
  "use strict";

  const track = document.getElementById("hero-track");
  const dotsWrap = document.getElementById("hero-dots");
  const heroLabel = document.getElementById("hero-label");
  const heroTitle = document.getElementById("hero-title");
  const heroDesc = document.getElementById("hero-desc");
  const productGrid = document.getElementById("product-grid");
  const categoryTabs = document.getElementById("category-tabs");
  const capabilitiesGrid = document.getElementById("capabilities-grid");
  const sectorsGrid = document.getElementById("sectors-grid");
  const valuesRow = document.getElementById("values-row");
  const footerLinks = document.getElementById("footer-product-links");
  const footerBrandLinks = document.getElementById("footer-brand-links");
  const brandsGrid = document.getElementById("brands-grid");
  const formCategory = document.getElementById("form-category");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  let slideIndex = 0;
  let slideTimer;

  function picUrl(filename) {
    return PIC_BASE + encodeURIComponent(filename);
  }

  function brandLogoUrl(filename) {
    return BRAND_LOGO_BASE + encodeURIComponent(filename);
  }

  function socialIconUrl(filename) {
    return SOCIAL_ICON_BASE + encodeURIComponent(filename);
  }

  function buildSocialLinks() {
    ["social-links", "social-links-footer", "footer-social-icons"].forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;

      SOCIAL_LINKS.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.className = "social-icon-btn";
        a.setAttribute("aria-label", "Kunfre on " + link.name);
        if (link.external !== false) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        a.innerHTML =
          '<img src="' + socialIconUrl(link.icon) + '" alt="' + link.name + '" width="44" height="44" loading="lazy">';
        container.appendChild(a);
      });
    });
  }

  function buildHeroSlides() {
    CATEGORIES.forEach((cat, i) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide" + (i === 0 ? " active" : "");
      slide.style.backgroundImage = "url('" + picUrl(cat.image) + "')";
      slide.dataset.index = String(i);
      track.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", cat.name);
      dot.addEventListener("click", () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slideIndex = (index + CATEGORIES.length) % CATEGORIES.length;
    const slides = track.querySelectorAll(".hero-slide");
    const dots = dotsWrap.querySelectorAll(".hero-dot");
    const cat = CATEGORIES[slideIndex];

    slides.forEach((s, i) => s.classList.toggle("active", i === slideIndex));
    dots.forEach((d, i) => d.classList.toggle("active", i === slideIndex));

    heroLabel.textContent = cat.label;
    heroTitle.textContent = cat.heroTitle;
    heroDesc.textContent = cat.heroDesc;
  }

  function startSlider() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(slideIndex + 1), 5500);
  }

  document.getElementById("hero-prev").addEventListener("click", () => {
    goToSlide(slideIndex - 1);
    startSlider();
  });

  document.getElementById("hero-next").addEventListener("click", () => {
    goToSlide(slideIndex + 1);
    startSlider();
  });

  function renderProducts(filter) {
    productGrid.innerHTML = "";
    const list = filter === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === filter);

    list.forEach((cat) => {
      const galleryHtml = (cat.gallery || [])
        .slice(0, 4)
        .map((file) => '<img src="' + picUrl(file) + '" alt="" loading="lazy">')
        .join("");

      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML =
        '<div class="product-image">' +
        '<img src="' + picUrl(cat.image) + '" alt="' + cat.name + '" loading="lazy">' +
        '<span class="product-badge"><img src="' + KUNFRE_LOGO + '" alt="Kunfre" width="28" height="28"></span>' +
        "</div>" +
        (galleryHtml ? '<div class="product-gallery">' + galleryHtml + "</div>" : "") +
        '<div class="product-body">' +
        "<h3>" + cat.name + "</h3>" +
        "<p>" + cat.description + "</p>" +
        "<ul>" + cat.services.map((s) => "<li>" + s + "</li>").join("") + "</ul>" +
        '<a href="' + CONTACT.whatsapp + '?text=' + encodeURIComponent("Hello Kunfre Enterprise,\n\nI would like a quote for: " + cat.name + "\n\nPlease send pricing and availability.") + '" class="product-link" target="_blank" rel="noopener noreferrer">Request Quote on WhatsApp →</a>' +
        "</div>";
      productGrid.appendChild(card);
    });
  }

  function buildBrands() {
    BRANDS.forEach((brand) => {
      const card = document.createElement("article");
      card.className = "brand-card";
      card.style.setProperty("--brand-color", brand.color);
      card.innerHTML =
        '<div class="brand-logo-wrap">' +
        '<img src="' + brandLogoUrl(brand.logo) + '" alt="' + brand.name + ' logo" loading="lazy">' +
        "</div>" +
        '<p class="brand-tagline">' + brand.tagline + "</p>" +
        "<p>" + brand.description + "</p>" +
        '<div class="brand-cats">' +
        brand.categories.map((c) => '<span class="brand-cat">' + c + "</span>").join("") +
        "</div>" +
        '<a href="' + CONTACT.whatsapp + "?text=" + encodeURIComponent("Hello Kunfre Enterprise,\n\nI am enquiring about " + brand.name + " products.\n\nPlease send availability and pricing.") +
        '" class="brand-enquire" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp →</a>';
      brandsGrid.appendChild(card);

      const opt = document.createElement("option");
      opt.value = brand.name;
      opt.textContent = brand.name;
      formCategory.appendChild(opt);

      const li = document.createElement("li");
      li.innerHTML = '<a href="#brands">' + brand.name + "</a>";
      footerBrandLinks.appendChild(li);
    });
  }

  function buildCategoryTabs() {
    const allTab = document.createElement("button");
    allTab.type = "button";
    allTab.className = "category-tab active";
    allTab.textContent = "All Categories";
    allTab.addEventListener("click", () => {
      categoryTabs.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
      allTab.classList.add("active");
      renderProducts("all");
    });
    categoryTabs.appendChild(allTab);

    CATEGORIES.forEach((cat) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "category-tab";
      tab.textContent = cat.name;
      tab.addEventListener("click", () => {
        categoryTabs.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderProducts(cat.id);
      });
      categoryTabs.appendChild(tab);

      const opt = document.createElement("option");
      opt.value = cat.name;
      opt.textContent = cat.name;
      formCategory.appendChild(opt);

      const li = document.createElement("li");
      li.innerHTML = '<a href="#products">' + cat.name + "</a>";
      footerLinks.appendChild(li);
    });
  }

  function buildCapabilities() {
    CATEGORIES.forEach((cat, i) => {
      const item = document.createElement("article");
      item.className = "capability-card";
      item.innerHTML =
        '<div class="capability-thumb"><img src="' + picUrl(cat.image) + '" alt="' + cat.name + '" loading="lazy"></div>' +
        '<span class="cap-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + cat.name + "</h3>" +
        "<p>" + cat.description + "</p>";
      capabilitiesGrid.appendChild(item);
    });
  }

  SECTORS.forEach((s) => {
    const el = document.createElement("span");
    el.className = "sector-tag";
    el.textContent = s;
    sectorsGrid.appendChild(el);
  });

  VALUES.forEach((v) => {
    const el = document.createElement("span");
    el.className = "value-tag";
    el.textContent = v;
    valuesRow.appendChild(el);
  });

  menuToggle.addEventListener("click", () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.getElementById("enquiry-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const company = data.get("company") || "N/A";
    const category = data.get("category") || "General";
    const message = data.get("message");

    const lines = [
      "Hello Kunfre Enterprise,",
      "",
      "I have an enquiry:",
      "",
      "Company: " + company,
      "Name: " + name,
      "Phone: " + phone,
      email ? "Email: " + email : null,
      "Category: " + category,
      "",
      "Message:",
      message,
      "",
      "Please contact me with pricing and availability."
    ].filter(Boolean);

    window.open(
      CONTACT.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener,noreferrer"
    );

    const note = document.getElementById("form-note");
    note.hidden = false;
    note.textContent = "WhatsApp should open with your enquiry. If not, message us at +263 719 333 422.";
    form.reset();
  });

  buildHeroSlides();
  buildSocialLinks();
  buildBrands();
  buildCategoryTabs();
  buildCapabilities();
  renderProducts("all");
  startSlider();
})();
