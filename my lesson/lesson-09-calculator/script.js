const CHECKLIST_KEY = "lesson09-calc-checklist";

// Mini calculator (same logic as portfolio/calculator)
const miniDisplay = document.getElementById("mini-display");
const miniButtons = document.querySelectorAll(".mini-buttons button");
const lastAction = document.getElementById("last-action");

let currentValue = "0";

function updateMiniDisplay() {
  if (miniDisplay) {
    miniDisplay.textContent = currentValue;
  }
}

function calculate(expression) {
  const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/");

  if (!/^[\d.+\-*/\s]+$/.test(sanitized)) {
    return "Error";
  }

  try {
    const result = Function('"use strict"; return (' + sanitized + ")")();
    if (!Number.isFinite(result)) {
      return "Error";
    }
    return String(Math.round(result * 1e10) / 1e10);
  } catch {
    return "Error";
  }
}

miniButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const value = btn.getAttribute("data-value");
    const action = btn.getAttribute("data-action");

    if (currentValue === "Error") {
      currentValue = "0";
    }

    if (value) {
      if (currentValue === "0" && value !== ".") {
        currentValue = value;
      } else {
        currentValue += value;
      }
      if (lastAction) {
        lastAction.textContent = "Wakadzvanya: " + value;
      }
    }

    if (action === "clear") {
      currentValue = "0";
      if (lastAction) lastAction.textContent = "Clear — zvese zvabviswa";
    }

    if (action === "back") {
      currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";
      if (lastAction) lastAction.textContent = "Back — digit yekupedzisira yabviswa";
    }

    if (action === "equals") {
      const before = currentValue;
      currentValue = calculate(currentValue);
      if (lastAction) {
        lastAction.textContent = before + " = " + currentValue;
      }
    }

    updateMiniDisplay();
  });
});

updateMiniDisplay();

// Checklist
const checklist = document.getElementById("calc-checklist");
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
