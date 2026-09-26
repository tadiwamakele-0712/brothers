/* Set the store WhatsApp number with country code and no spaces, for example "263771234567". */
const CONTACTS = [
  { label: "+263 77 361 2251", tel: "+263773612251", wa: "263773612251" },
  { label: "+263 78 588 8684", tel: "+263785888684", wa: "263785888684" }
];

const ICONS = {
  pin: "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
  phone: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8z",
  whatsapp: "M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.3 3.8 4.8 4.8 0 0 0 2 .6 2.4 2.4 0 0 0 1.6-.7 2 2 0 0 0 .5-1.4c0-.1 0-.3-.2-.4z"
};

function icon(type) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("icon", `icon-${type}`);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", ICONS[type]);
  svg.append(path);
  return svg;
}

const picture = (file) => `pictures/${file.split("/").map(encodeURIComponent).join("/")}`;

const pieces = [
  {
    id: "olive-garden",
    name: "Olive Garden Peplum Gown",
    category: "dresses",
    file: "lady dress1.jpeg",
    text: "An olive peplum bodice with gold floral embroidery and a full skirt printed in green, amber, and rust leaves. Made for weddings, dinners, and portraits."
  },
  {
    id: "crimson-garden",
    name: "Crimson Garden Peplum Gown",
    category: "dresses",
    file: "lady dress2.jpeg",
    text: "The same peplum silhouette in crimson, with gold embroidery and a warm floral skirt of red, rust, and sage. A strong colour for an evening out."
  },
  {
    id: "marigold-garden",
    name: "Marigold Garden Peplum Gown",
    category: "dresses",
    file: "lady dress3.jpeg",
    text: "A marigold peplum top with silver-blue floral embroidery and a bright skirt of gold, cobalt, and violet leaves."
  },
  {
    id: "rose-sunday",
    name: "Rose Sunday Dress",
    category: "dresses",
    file: "WhatsApp Image 2026-09-26 at 18.05.48 (1).jpeg",
    text: "A rose A-line dress with a stand collar, covered buttons, and softly gathered sleeves. Easy elegance for church, lunch, or a ceremony."
  },
  {
    id: "charcoal-sunday",
    name: "Charcoal Sunday Dress",
    category: "dresses",
    file: "lady dress5.jpeg",
    text: "The button-front Sunday dress in charcoal, with a high neckline and balloon sleeves that narrow at the cuff. Pair it with a bright hat or a quiet heel."
  },
  {
    id: "chocolate-beaded",
    name: "Chocolate Beaded Gown",
    category: "dresses",
    file: "lady dress4.jpeg",
    text: "A floor-sweeping chocolate gown with a sheer, pearl-beaded bodice, long sleeves, and a satin skirt that pools into a train. For the main event."
  },
  {
    id: "crystal-tuxedo-set",
    name: "Crystal Tuxedo Three-Piece",
    category: "suits",
    file: "man suit.jpeg",
    text: "A white evening jacket with a black crystal shawl, a double-breasted waistcoat, black bow tie, and black trousers. Ceremony wear with a sharp contrast."
  },
  {
    id: "crystal-tuxedo-jacket",
    name: "Crystal Tuxedo Jacket",
    category: "suits",
    file: "man suit1.jpeg",
    text: "A single-button white tuxedo jacket edged in black crystal, worn with a bow tie and black trousers. The cuff and hem carry a fine dotted pattern."
  },
  {
    id: "forest-herringbone",
    name: "Forest Herringbone Three-Piece",
    category: "suits",
    file: "man suit 2.jpeg",
    text: "A forest green double-breasted suit with a matching waistcoat, peak lapels, and a checked tie. Textured cloth for meetings and celebrations."
  },
  {
    id: "navy-gold-bar",
    name: "Navy Gold-Bar Double Breaster",
    category: "suits",
    file: "man suit3.jpeg",
    text: "A navy double-breasted jacket with gold-trimmed bar fastenings, a striped tie, and a pocket square. A statement suit that still reads tailored."
  },
  {
    id: "cocoa-herringbone",
    name: "Cocoa Herringbone Three-Piece",
    category: "suits",
    file: "man suit 4.jpeg",
    text: "A cocoa brown double-breasted three-piece in a fine herringbone, finished with a floral tie. Warm, formal, and easy to dress up."
  },
  {
    id: "ivory-shawl",
    name: "Ivory & Cocoa Shawl Suit",
    category: "suits",
    file: "man suit5.jpeg",
    text: "An ivory jacket with a deep cocoa shawl lapel, a matching waistcoat, and a paisley tie. Evening colour without a black tie."
  },
  {
    id: "navy-leather-sleeve",
    name: "Navy Leather-Sleeve Blazer",
    category: "blazers",
    file: "man blazer1.jpeg",
    text: "A navy stand-collar blazer with leather sleeves, leather collar, and a slim chest welt. Smart enough for an event, lighter than a full suit."
  },
  {
    id: "ivory-blazer",
    name: "Ivory Double-Breasted Blazer",
    category: "blazers",
    file: "man blazer2.jpeg",
    text: "An ivory double-breasted blazer with pale bar fastenings, a paisley tie, and a matching pocket square. A clean jacket for warm-weather occasions."
  },
  {
    id: "oxford",
    name: "Oxford",
    category: "shoes",
    file: "shoes/oxford.jpeg",
    fit: "contain",
    text: "The most formal lace-up classic. Ask for your size."
  },
  {
    id: "chelsea",
    name: "Chelsea",
    category: "shoes",
    file: "shoes/chelsea.jpeg",
    fit: "contain",
    text: "Slip-on sophistication with timeless style. Ask for your size."
  },
  {
    id: "loafer",
    name: "Loafer",
    category: "shoes",
    file: "shoes/loafer.jpeg",
    fit: "contain",
    text: "Effortless, versatile, and everyday ready. Ask for your size."
  },
  {
    id: "monk-strap",
    name: "Monk Strap",
    category: "shoes",
    file: "shoes/monk-strap.jpeg",
    fit: "contain",
    text: "Bold, refined, and distinctive. Ask for your size."
  },
  {
    id: "desert-boot",
    name: "Desert Boot",
    category: "shoes",
    file: "shoes/desert-boot.jpeg",
    fit: "contain",
    text: "A casual classic with rugged charm. Ask for your size."
  },
  {
    id: "derby",
    name: "Derby",
    category: "shoes",
    file: "shoes/derby.jpeg",
    fit: "contain",
    text: "Comfortable, stylish, and versatile. Ask for your size."
  },
  {
    id: "boat",
    name: "Boat",
    category: "shoes",
    file: "shoes/boat.jpeg",
    fit: "contain",
    text: "Relaxed, nautical, and laid-back. Ask for your size."
  },
  {
    id: "brogue",
    name: "Brogue",
    category: "shoes",
    file: "shoes/brogue.jpeg",
    fit: "contain",
    text: "Detailed, classic, and timeless. Ask for your size."
  },
  {
    id: "wing-tip",
    name: "Wing Tip",
    category: "shoes",
    file: "shoes/wing-tip.jpeg",
    fit: "contain",
    text: "Statement style with classic flair. Ask for your size."
  }
];

const labels = {
  dresses: "Dresses",
  suits: "Suits",
  blazers: "Blazers",
  shoes: "Shoes"
};

const categoriesRoot = document.querySelector("#categories");
const orderNote = document.querySelector("#order-note");
const categoryOrder = ["dresses", "suits", "blazers", "shoes"];

function enquiryText(name) {
  return `Hi Meleve Closet, I would like the ${name}. Please share the price, available sizes, and how to order.`;
}

function fillContacts(container, message) {
  container.replaceChildren();
  CONTACTS.forEach((contact) => {
    const row = document.createElement("div");
    row.className = "contact-row";

    const number = document.createElement("span");
    number.textContent = contact.label;

    const call = document.createElement("a");
    call.href = `tel:${contact.tel}`;
    call.className = "icon-btn";
    call.setAttribute("aria-label", `Call ${contact.label}`);
    call.append(icon("phone"));

    const whatsapp = document.createElement("a");
    whatsapp.href = `https://wa.me/${contact.wa}?text=${encodeURIComponent(message)}`;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.className = "icon-btn";
    whatsapp.setAttribute("aria-label", `WhatsApp ${contact.label}`);
    whatsapp.append(icon("whatsapp"));

    row.append(number, call, whatsapp);
    container.append(row);
  });
}

function buildSlides() {
  categoryOrder.forEach((category) => {
    const items = pieces.filter((piece) => piece.category === category);
    if (!items.length) return;

    const section = document.createElement("section");
    section.className = "category";
    section.id = category;

    const heading = document.createElement("div");
    heading.className = "category-head";
    const title = document.createElement("h2");
    title.textContent = labels[category];
    heading.append(title);

    const frame = document.createElement("div");
    frame.className = "slide";
    frame.tabIndex = 0;
    frame.setAttribute("aria-roledescription", "carousel");
    frame.setAttribute("aria-label", `${labels[category]} pictures`);

    const viewport = document.createElement("div");
    viewport.className = "slide-frame";

    const image = document.createElement("img");
    image.alt = "";
    viewport.append(image);

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "slide-arrow slide-prev";
    prev.setAttribute("aria-label", `Previous ${labels[category].toLowerCase()} picture`);
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "slide-arrow slide-next";
    next.setAttribute("aria-label", `Next ${labels[category].toLowerCase()} picture`);
    next.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "slide-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", `${labels[category]} pictures`);

    const info = document.createElement("div");
    info.className = "slide-info";
    const name = document.createElement("h3");
    const text = document.createElement("p");
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = "Price on request";
    const position = document.createElement("p");
    position.className = "slide-count";
    const contacts = document.createElement("div");
    contacts.className = "contacts";
    info.append(name, text, price, position, contacts);

    frame.append(viewport, prev, next);
    section.append(heading, frame, dots, info);
    categoriesRoot.append(section);

    let index = 0;
    let pointerStart = null;
    let timer = null;

    function arm() {
      clearInterval(timer);
      if (items.length < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(() => show(index + 1), 2000);
    }

    function show(nextIndex) {
      index = (nextIndex + items.length) % items.length;
      const piece = items[index];
      image.src = picture(piece.file);
      image.alt = piece.name;
      image.classList.toggle("is-wide", piece.fit === "contain");
      name.textContent = piece.name;
      text.textContent = piece.text;
      position.textContent = `${index + 1} of ${items.length}`;
      fillContacts(contacts, enquiryText(piece.name));
      dots.querySelectorAll("button").forEach((dot, dotIndex) => {
        const on = dotIndex === index;
        dot.classList.toggle("is-on", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
      arm();
    }

    items.forEach((piece, dotIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", piece.name);
      dot.addEventListener("click", () => show(dotIndex));
      dots.append(dot);
    });

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));
    frame.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
    viewport.addEventListener("pointerdown", (event) => {
      pointerStart = event.clientX;
    });
    viewport.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const delta = event.clientX - pointerStart;
      pointerStart = null;
      if (delta > 40) show(index - 1);
      if (delta < -40) show(index + 1);
    });

    show(0);
  });
}

function setupTheme() {
  const button = document.querySelector("#theme-btn");
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function paint(theme) {
    const dark = theme === "dark";
    root.setAttribute("data-theme", dark ? "dark" : "light");
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#12090c" : "#5c1524");
  }

  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    paint(next);
    try { localStorage.setItem("meleve-theme", next); } catch (e) {}
  });

  media.addEventListener("change", (event) => {
    let saved = null;
    try { saved = localStorage.getItem("meleve-theme"); } catch (e) {}
    if (saved) return;
    paint(event.matches ? "dark" : "light");
  });

  paint(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
}

function setupMenu() {
  const button = document.querySelector("#menu-btn");
  const nav = document.querySelector("#nav");
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function setupOrderNote() {
  fillContacts(orderNote, "Hi Meleve Closet, I would like to place an order.");
  fillContacts(document.querySelector("#footer-contacts"), "Hi Meleve Closet, I would like to place an order.");
}

window.addEventListener("scroll", () => {
  document.querySelector("#header").classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

setupTheme();
setupMenu();
setupOrderNote();
buildSlides();
