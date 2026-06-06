const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAll");

let todos = loadTodos();

function loadTodos() {
    try {
        const saved = JSON.parse(localStorage.getItem("todos"));
        if (!Array.isArray(saved)) {
            return [];
        }
        return saved.map(normalizeTodo).filter(Boolean);
    } catch {
        return [];
    }
}

function normalizeTodo(item) {
    if (typeof item === "string" && item.trim() !== "") {
        return { id: Date.now() + Math.random(), text: item, done: false };
    }
    if (item && typeof item.text === "string") {
        return {
            id: item.id || Date.now() + Math.random(),
            text: item.text,
            done: Boolean(item.done),
        };
    }
    return null;
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateCount() {
    const remaining = todos.filter(function (t) {
        return !t.done;
    }).length;
    taskCount.textContent = "Une mabasa " + remaining;
}

function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function (todo) {
        const li = document.createElement("li");
        if (todo.done) {
            li.classList.add("done");
        }

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = todo.text;
        textSpan.title = "Dzvanya kuti uwane kuti yapera";

        textSpan.addEventListener("click", function () {
            todo.done = !todo.done;
            saveTodos();
            renderTodos();
        });

        const doneBtn = document.createElement("button");
        doneBtn.className = "done-btn";
        doneBtn.textContent = todo.done ? "Undo" : "Done";
        doneBtn.addEventListener("click", function () {
            todo.done = !todo.done;
            saveTodos();
            renderTodos();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Bvisa";
        deleteBtn.addEventListener("click", function () {
            todos = todos.filter(function (t) {
                return t.id !== todo.id;
            });
            saveTodos();
            renderTodos();
        });

        li.appendChild(textSpan);
        li.appendChild(doneBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });

    updateCount();
}

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = todoInput.value.trim();
    if (text === "") {
        return;
    }

    todos.push({
        id: Date.now(),
        text: text,
        done: false,
    });

    saveTodos();
    renderTodos();
    todoInput.value = "";
    todoInput.focus();
});

clearAllBtn.addEventListener("click", function () {
    if (todos.length === 0) {
        return;
    }

    if (confirm("Unofunga here kuti unoda kubvisa mabasa ese?")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
});

renderTodos();
