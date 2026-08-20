(() => {
  const header = document.getElementById("site-header");
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("main-nav");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else openMenu();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  const hoursBadge = document.getElementById("hours-badge");
  const updateHours = () => {
    if (!hoursBadge) return;
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Harare",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
    const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
    const minutes = hour * 60 + minute;
    const open = minutes >= 8 * 60 && minutes < 22 * 60;
    hoursBadge.textContent = open ? "Open now" : "Closed now";
    hoursBadge.classList.toggle("is-closed", !open);
  };
  updateHours();
  setInterval(updateHours, 60000);

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dotsWrap = document.getElementById("hero-dots");
  const heroPrev = document.getElementById("hero-prev");
  const heroNext = document.getElementById("hero-next");
  const heroSection = document.querySelector(".hero-slider") || document.getElementById("hero");
  let slideIndex = 0;
  let slideTimer = null;
  const SLIDE_MS = 5500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const goToSlide = (index) => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === slideIndex);
    });
    if (dotsWrap) {
      dotsWrap.querySelectorAll(".hero-dot").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === slideIndex);
        dot.setAttribute("aria-current", i === slideIndex ? "true" : "false");
      });
    }
  };

  const nextSlide = () => goToSlide(slideIndex + 1);
  const prevSlide = () => goToSlide(slideIndex - 1);

  const stopSlideshow = () => {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  };

  const startSlideshow = () => {
    if (reduceMotion || slides.length < 2) return;
    stopSlideshow();
    slideTimer = setInterval(nextSlide, SLIDE_MS);
  };

  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `hero-dot${i === 0 ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
      if (i === 0) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => {
        goToSlide(i);
        startSlideshow();
      });
      dotsWrap.appendChild(dot);
    });
  }

  heroPrev?.addEventListener("click", () => {
    prevSlide();
    startSlideshow();
  });

  heroNext?.addEventListener("click", () => {
    nextSlide();
    startSlideshow();
  });

  heroSection?.addEventListener("mouseenter", stopSlideshow);
  heroSection?.addEventListener("mouseleave", startSlideshow);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSlideshow();
    else startSlideshow();
  });

  startSlideshow();

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");
  let galleryIndex = 0;

  const updateLightbox = () => {
    const item = galleryItems[galleryIndex];
    if (!item || !lightboxImg) return;
    const src = item.getAttribute("data-src") || "";
    const thumb = item.querySelector("img");
    lightboxImg.src = src;
    lightboxImg.alt = thumb ? thumb.alt : "Gallery image";
    if (lightboxCounter) {
      lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox || !galleryItems.length) return;
    galleryIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    const onEnd = () => {
      lightbox.hidden = true;
      lightbox.removeEventListener("transitionend", onEnd);
    };
    lightbox.addEventListener("transitionend", onEnd);
  };

  const showPrev = () => {
    galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  };

  const showNext = () => {
    galleryIndex = (galleryIndex + 1) % galleryItems.length;
    updateLightbox();
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", showPrev);
  lightboxNext?.addEventListener("click", showNext);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrev();
    if (event.key === "ArrowRight") showNext();
  });
})();
