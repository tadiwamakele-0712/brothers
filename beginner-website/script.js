// ============================================
// MY FIRST JAVASCRIPT FILE
// ============================================
// The DOM = the page as objects JavaScript can change.
// document.getElementById("id") finds one element by its id.

// --- 1. Change greeting button ---
const greetingEl = document.getElementById("greeting");
const changeGreetingBtn = document.getElementById("change-greeting-btn");

const greetings = [
  "Hello, web Tadiwa!",
  "You are doing great!",
  "Keep learning HTML, CSS & JS!",
  "JavaScript is working!",
];

let greetingIndex = 0;

changeGreetingBtn.addEventListener("click", function () {
  greetingIndex = greetingIndex + 1;
  if (greetingIndex >= greetings.length) {
    greetingIndex = 0;
  }
  greetingEl.textContent = greetings[greetingIndex];
});

// --- 2. Say hello with your name ---
const nameInput = document.getElementById("name-input");
const sayHelloBtn = document.getElementById("say-hello-btn");
const helloMessage = document.getElementById("hello-message");

sayHelloBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();

  if (name === "") {
    helloMessage.textContent = "Please type your name first.";
    helloMessage.style.color = "#c62828";
    return;
  }

  helloMessage.textContent = "Hello, " + name + "! Welcome to your website.";
  helloMessage.style.color = "#2e7d32";
});

// --- 3. Click counter ---
const counterEl = document.getElementById("counter");
const countBtn = document.getElementById("count-btn");
let count = 0;

countBtn.addEventListener("click", function () {
  count = count + 1;
  counterEl.textContent = count;
});

// --- 4. Change background color ---
const colorButtons = document.querySelectorAll(".color-btn");

colorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const color = button.getAttribute("data-color");
    document.body.style.backgroundColor = color;
  });
});

// --- 5. Add a topic to the list ---
const addTopicBtn = document.getElementById("add-topic-btn");
const topicsList = document.getElementById("topics-list");

const extraTopics = [
  "Forms and user input",
  "Flexbox for layout",
  "Debugging in the browser",
];

let topicIndex = 0;

addTopicBtn.addEventListener("click", function () {
  if (topicIndex >= extraTopics.length) {
    addTopicBtn.textContent = "No more topics to add";
    addTopicBtn.disabled = true;
    return;
  }

  const newItem = document.createElement("li");
  newItem.textContent = extraTopics[topicIndex];
  topicsList.appendChild(newItem);
  topicIndex = topicIndex + 1;
});
