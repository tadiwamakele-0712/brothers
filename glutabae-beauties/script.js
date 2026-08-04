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

  /* Gallery — drop more photos in /gallery and add them here */
  const galleryItems = [
    {
      src: "gallery/glow-moment.jpg",
      alt: "Glutabae Beauties glow moment from WhatsApp catalog",
      className: "gallery-item--wide",
    },
    {
      src: "gallery/product-spotlight.jpg",
      alt: "Glutabae Beauties product spotlight",
      className: "gallery-item--tall",
    },
    {
      src: "gallery/brand-portrait.jpg",
      alt: "Glutabae Beauties brand portrait",
      className: "gallery-item--tall",
    },
    {
      src: "gallery/brand-logo.jpg",
      alt: "Glutabae Beauties logo",
      className: "gallery-item--tall",
    },
  ];

  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");

  if (grid) {
    galleryItems.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gallery-item reveal ${item.className || ""}`.trim();
      btn.setAttribute("role", "listitem");
      btn.setAttribute("aria-label", `View larger: ${item.alt}`);

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });

      grid.appendChild(btn);
    });
  }

  const closeLightbox = () => {
    if (lightbox && typeof lightbox.close === "function") lightbox.close();
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  const observeReveals = () => {
    const reveals = document.querySelectorAll(".reveal:not(.is-visible)");
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
  };

  observeReveals();
})();
