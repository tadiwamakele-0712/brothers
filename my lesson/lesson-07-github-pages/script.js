const CHECKLIST_KEY = "lesson07-deploy-checklist";
const SITE_URL = "https://tadiwamakele-0712.github.io/brothers/";

const copyBtn = document.getElementById("copy-url");
const statusMsg = document.getElementById("status-msg");
const checklist = document.getElementById("deploy-checklist");

if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(SITE_URL).then(function () {
      statusMsg.textContent = "Link yakakopiwa!";
      statusMsg.className = "status-msg ok";
    }).catch(function () {
      statusMsg.textContent = "Kopi yakundikana — kopira nemaoko.";
      statusMsg.className = "status-msg wait";
    });
  });
}

// Check if site is live
fetch(SITE_URL, { method: "HEAD", mode: "no-cors" })
  .then(function () {
    statusMsg.textContent = "Site inogona kunge iri live — edza link!";
    statusMsg.className = "status-msg ok";
  })
  .catch(function () {
    statusMsg.textContent = "Site isati yavhurwa — vhura GitHub Pages mu Settings.";
    statusMsg.className = "status-msg wait";
  });

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
