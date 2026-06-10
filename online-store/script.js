const CART_KEY = "tadiwa-store-cart";

const PRODUCTS = [
  { id: 1, name: "Classic T-Shirt", category: "fashion", price: 19.99, emoji: "👕", desc: "Comfortable cotton tee, all sizes." },
  { id: 2, name: "Running Sneakers", category: "fashion", price: 59.99, emoji: "👟", desc: "Lightweight shoes for everyday wear." },
  { id: 3, name: "Leather Handbag", category: "fashion", price: 45.00, emoji: "👜", desc: "Stylish bag for work and weekends." },
  { id: 4, name: "Wireless Earbuds", category: "tech", price: 34.99, emoji: "🎧", desc: "Bluetooth 5.0, 24hr battery life." },
  { id: 5, name: "Smart Watch", category: "tech", price: 89.99, emoji: "⌚", desc: "Track steps, heart rate, and sleep." },
  { id: 6, name: "Phone Stand", category: "tech", price: 12.50, emoji: "📱", desc: "Adjustable desk stand for any phone." },
  { id: 7, name: "Coffee Mug Set", category: "home", price: 24.00, emoji: "☕", desc: "Set of 4 ceramic mugs." },
  { id: 8, name: "Desk Lamp", category: "home", price: 29.99, emoji: "💡", desc: "LED lamp with warm & cool modes." },
  { id: 9, name: "Throw Pillow", category: "home", price: 18.00, emoji: "🛋️", desc: "Soft decorative pillow for your sofa." },
];

let cart = loadCart();
let activeFilter = "all";

const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutModal = document.getElementById("checkout-modal");

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

function getCartCount() {
  return cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
}

function getCartTotal() {
  return cart.reduce(function (sum, item) {
    const product = PRODUCTS.find(function (p) {
      return p.id === item.id;
    });
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderProducts() {
  productGrid.innerHTML = "";

  const filtered = activeFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(function (p) {
        return p.category === activeFilter;
      });

  filtered.forEach(function (product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = product.category;

    card.innerHTML =
      '<div class="product-image">' + product.emoji + "</div>" +
      '<div class="product-body">' +
      '<span class="product-category">' + product.category + "</span>" +
      "<h3>" + product.name + "</h3>" +
      "<p>" + product.desc + "</p>" +
      '<div class="product-footer">' +
      '<span class="product-price">' + formatPrice(product.price) + "</span>" +
      '<button type="button" class="add-btn" data-id="' + product.id + '">Add to Cart</button>' +
      "</div></div>";

    productGrid.appendChild(card);
  });

  productGrid.querySelectorAll(".add-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(Number(btn.dataset.id));
    });
  });
}

function addToCart(productId) {
  const existing = cart.find(function (item) {
    return item.id === productId;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();
}

function updateQty(productId, delta) {
  const item = cart.find(function (i) {
    return i.id === productId;
  });

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(function (i) {
      return i.id !== productId;
    });
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(function (i) {
    return i.id !== productId;
  });
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  checkoutTotal.textContent = formatPrice(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Cart is empty — add some products!</p>';
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(function (item) {
    const product = PRODUCTS.find(function (p) {
      return p.id === item.id;
    });

    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML =
      '<span class="cart-item-emoji">' + product.emoji + "</span>" +
      '<div class="cart-item-info">' +
      "<h4>" + product.name + "</h4>" +
      "<p>" + formatPrice(product.price) + " each</p>" +
      "</div>" +
      '<div class="cart-item-controls">' +
      '<button type="button" class="qty-btn" data-action="minus" data-id="' + product.id + '">−</button>' +
      '<span class="cart-item-qty">' + item.qty + "</span>" +
      '<button type="button" class="qty-btn" data-action="plus" data-id="' + product.id + '">+</button>' +
      '<button type="button" class="remove-btn" data-id="' + product.id + '">Remove</button>' +
      "</div>";

    cartItems.appendChild(row);
  });

  cartItems.querySelectorAll(".qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = Number(btn.dataset.id);
      const delta = btn.dataset.action === "plus" ? 1 : -1;
      updateQty(id, delta);
    });
  });

  cartItems.querySelectorAll(".remove-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      removeFromCart(Number(btn.dataset.id));
    });
  });
}

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartOverlay.hidden = false;
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

// Cart toggle
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("clear-cart").addEventListener("click", function () {
  if (cart.length === 0) return;
  if (confirm("Clear all items from cart?")) {
    cart = [];
    saveCart();
    updateCartUI();
  }
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty — add products first!");
    return;
  }
  checkoutModal.showModal();
});

document.getElementById("cancel-checkout").addEventListener("click", function () {
  checkoutModal.close();
});

document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("ship-name").value.trim();
  alert("Thank you, " + name + "! Order placed (demo). Total: " + formatPrice(getCartTotal()));
  cart = [];
  saveCart();
  updateCartUI();
  checkoutModal.close();
  closeCart();
  document.getElementById("checkout-form").reset();
});

// Contact form
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("contact-msg").textContent = "Message sent! We will reply soon (demo).";
  document.getElementById("contact-form").reset();
});

// Mobile menu
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");

menuBtn.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// Init
renderProducts();
updateCartUI();
