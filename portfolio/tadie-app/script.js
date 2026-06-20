const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");
const clearAllBtn = document.getElementById("clearAll");

let notes = loadNotes();

function loadNotes() {
    try {
        const saved = JSON.parse(localStorage.getItem("notes"));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
    notesList.innerHTML = "";

    notes.forEach(function (note, index) {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = note;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Bvisa";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function () {
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    if (text === "") {
        return;
    }

    notes.push(text);
    saveNotes();
    renderNotes();
    noteInput.value = "";
    noteInput.focus();
});

clearAllBtn.addEventListener("click", function () {
    if (notes.length === 0) {
        return;
    }

    if (confirm("Unofunga here kuti unoda kubvisa notes dzese?")) {
        notes = [];
        saveNotes();
        renderNotes();
    }
});

renderNotes();
