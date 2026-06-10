const CHECKLIST_KEY = "lesson06-git-checklist";

// Copy command buttons
const copyMsg = document.getElementById("copy-msg");

document.querySelectorAll(".copy-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const text = btn.getAttribute("data-copy").replace(/&#10;/g, "\n");

    navigator.clipboard.writeText(text).then(function () {
      copyMsg.textContent = "Yakakopiwa! Paste mu Terminal.";
      setTimeout(function () {
        copyMsg.textContent = "";
      }, 2500);
    }).catch(function () {
      copyMsg.textContent = "Kopi yakundikana — kopira nemaoko.";
    });
  });
});

// Checklist saved in browser
const checklist = document.getElementById("git-checklist");
const resetBtn = document.getElementById("reset-checklist");

function loadChecklist() {
  const saved = localStorage.getItem(CHECKLIST_KEY);
  if (!saved || !checklist) return;

  try {
    const state = JSON.parse(saved);
    checklist.querySelectorAll("input[type=checkbox]").forEach(function (box) {
      box.checked = !!state[box.id];
    });
  } catch {
    localStorage.removeItem(CHECKLIST_KEY);
  }
}

function saveChecklist() {
  if (!checklist) return;
  const state = {};
  checklist.querySelectorAll("input[type=checkbox]").forEach(function (box) {
    state[box.id] = box.checked;
  });
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}

if (checklist) {
  checklist.addEventListener("change", saveChecklist);
  loadChecklist();
}

if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    checklist.querySelectorAll("input[type=checkbox]").forEach(function (box) {
      box.checked = false;
    });
    localStorage.removeItem(CHECKLIST_KEY);
  });
}
