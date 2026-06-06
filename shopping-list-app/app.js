/**
 * Shopping list — plain JavaScript (no frameworks)
 * - Items are saved in the browser (localStorage) so they stay after refresh
 */

const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const imageInput = document.getElementById("item-image");
const imageFileName = document.getElementById("image-file-name");
const imagePreview = document.getElementById("image-preview");
const imagePreviewImg = document.getElementById("image-preview-img");
const clearImageBtn = document.getElementById("clear-image");
const list = document.getElementById("shopping-list");
const emptyState = document.getElementById("empty-state");
const itemCount = document.getElementById("item-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");

/** @type {{ id: string, text: string, done: boolean, image?: string }[]} */
let items = [];

/** Max edge length after resize; keeps localStorage small */
const IMAGE_MAX_EDGE = 160;

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
function fileToResizedDataUrl(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target && e.target.result;
      if (typeof dataUrl !== "string") {
        reject(new Error("read"));
        return;
      }
      const img = new Image();
      img.onload = function () {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const scale = Math.min(IMAGE_MAX_EDGE / w, IMAGE_MAX_EDGE / h, 1);
        const cw = Math.round(w * scale);
        const ch = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, cw, ch);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () {
        reject(new Error("img"));
      };
      img.src = dataUrl;
    };
    reader.onerror = function () {
      reject(new Error("read"));
    };
    reader.readAsDataURL(file);
  });
}

let pendingImageDataUrl = null;

function setPendingImagePreview(dataUrl) {
  pendingImageDataUrl = dataUrl;
  if (dataUrl) {
    imagePreviewImg.src = dataUrl;
    imagePreview.hidden = false;
  } else {
    imagePreviewImg.removeAttribute("src");
    imagePreview.hidden = true;
  }
}

function resetImageField() {
  imageInput.value = "";
  imageFileName.textContent = "";
  setPendingImagePreview(null);
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.filter(function (i) {
        if (!i || typeof i.id !== "string" || typeof i.text !== "string" || typeof i.done !== "boolean") {
          return false;
        }
        if (i.image != null && typeof i.image !== "string") {
          return false;
        }
        return true;
      });
    }
  } catch {
    items = [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function newId() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

function updateEmptyState() {
  const isEmpty = items.length === 0;
  emptyState.classList.toggle("visible", isEmpty);
  list.hidden = isEmpty;
  clearAllBtn.hidden = isEmpty;
  const checkedCount = items.filter((i) => i.done).length;
  clearCompletedBtn.hidden = checkedCount === 0;
}

function updateCount() {
  const n = items.length;
  const checked = items.filter((i) => i.done).length;
  if (n === 0) {
    itemCount.textContent = "0 items";
  } else if (n === 1) {
    itemCount.textContent = "1 item" + (checked ? " (1 done)" : "");
  } else {
    itemCount.textContent = n + " items" + (checked ? " (" + checked + " done)" : "");
  }
}

function createListItemElement(item) {
  const li = document.createElement("li");
  li.className = "list-item" + (item.done ? " checked" : "");
  li.dataset.id = item.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.done;
  checkbox.setAttribute(
    "aria-label",
    "Mark as bought: " + item.text + (item.image ? " (with photo)" : "")
  );

  let thumb = null;
  if (item.image) {
    thumb = document.createElement("img");
    thumb.className = "item-thumb";
    thumb.src = item.image;
    thumb.alt = "";
    thumb.width = 48;
    thumb.height = 48;
    thumb.decoding = "async";
  }

  const label = document.createElement("label");
  label.className = "item-label";
  label.htmlFor = "cb-" + item.id;
  label.textContent = item.text;

  checkbox.id = "cb-" + item.id;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "btn btn-delete";
  del.setAttribute("aria-label", "Remove " + item.text);
  del.textContent = "Remove";

  checkbox.addEventListener("change", function () {
    const id = li.dataset.id;
    const found = items.find((i) => i.id === id);
    if (found) {
      found.done = checkbox.checked;
      li.classList.toggle("checked", found.done);
      saveItems();
      updateCount();
      updateEmptyState();
    }
  });

  del.addEventListener("click", function () {
    const id = li.dataset.id;
    items = items.filter((i) => i.id !== id);
    li.remove();
    saveItems();
    render();
  });

  li.appendChild(checkbox);
  if (thumb) {
    li.appendChild(thumb);
  }
  li.appendChild(label);
  li.appendChild(del);
  return li;
}

function render() {
  list.innerHTML = "";
  for (const item of items) {
    list.appendChild(createListItemElement(item));
  }
  updateCount();
  updateEmptyState();
}

imageInput.addEventListener("change", function () {
  const file = imageInput.files && imageInput.files[0];
  if (!file) {
    imageFileName.textContent = "";
    setPendingImagePreview(null);
    return;
  }
  if (!file.type.startsWith("image/")) {
    imageFileName.textContent = "Not an image";
    setPendingImagePreview(null);
    return;
  }
  imageFileName.textContent = file.name;
  fileToResizedDataUrl(file)
    .then(function (dataUrl) {
      setPendingImagePreview(dataUrl);
    })
    .catch(function () {
      imageFileName.textContent = "Could not read image";
      setPendingImagePreview(null);
    });
});

clearImageBtn.addEventListener("click", function () {
  resetImageField();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const item = { id: newId(), text, done: false };
  if (pendingImageDataUrl) {
    item.image = pendingImageDataUrl;
  }
  items.push(item);
  input.value = "";
  resetImageField();
  saveItems();
  render();
  input.focus();
});

clearCompletedBtn.addEventListener("click", function () {
  items = items.filter((i) => !i.done);
  saveItems();
  render();
});

clearAllBtn.addEventListener("click", function () {
  if (items.length && confirm("Remove all items from the list?")) {
    items = [];
    saveItems();
    render();
  }
});

loadItems();
render();
input.focus();
