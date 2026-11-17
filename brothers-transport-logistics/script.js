(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const year = document.querySelector("#year");
  const form = document.querySelector("#quote-form");
  const status = document.querySelector(".form-status");
  const THEME_KEY = "btl-theme";

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

  const syncThemeToggle = (theme) => {
    if (!themeToggle) return;
    const next = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    themeToggle.setAttribute("title", `Switch to ${next} mode`);
  };

  const setTheme = (theme) => {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {
      /* ignore storage errors */
    }
    syncThemeToggle(next);
  };

  syncThemeToggle(getTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const slider = document.querySelector("[data-rental-slider]");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".rental-slide"));
    const dotsWrap = slider.querySelector("[data-rental-dots]");
    const prevBtn = slider.querySelector("[data-rental-prev]");
    const nextBtn = slider.querySelector("[data-rental-next]");
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timer = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const goTo = (nextIndex) => {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
    };

    if (dotsWrap) {
      slides.forEach((slide, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show vehicle ${i + 1}`);
        if (i === index) {
          dot.classList.add("is-active");
          dot.setAttribute("aria-current", "true");
        }
        dot.addEventListener("click", () => {
          goTo(i);
          restartAutoplay();
        });
        dotsWrap.appendChild(dot);
      });
    }

    const stopAutoplay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const startAutoplay = () => {
      if (reduceMotion || slides.length < 2) return;
      stopAutoplay();
      timer = setInterval(() => goTo(index + 1), 4500);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goTo(index - 1);
        restartAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goTo(index + 1);
        restartAutoplay();
      });
    }

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);

    goTo(index);
    startAutoplay();
  }

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = "Please fill in all fields.";
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const service = String(data.get("service") || "");
      const message = String(data.get("message") || "").trim();

      const serviceLabel = {
        "buy-sell": "Buy or sell a vehicle",
        import: "Vehicle import",
        rental: "Car rental",
        logistics: "Transport & logistics",
      }[service] || service;

      const text = [
        `Hello Brothers Transport & Logistics,`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${serviceLabel}`,
        ``,
        message,
      ].join("\n");

      const whatsappNumber = "263785092719";
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

      status.textContent = "Opening WhatsApp with your enquiry…";
      window.open(url, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
})();
