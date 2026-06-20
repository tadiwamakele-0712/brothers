const welcomeTitle = document.getElementById("welcome-title");
const welcomeBtn = document.getElementById("welcome-btn");

const messages = [
  "Empowering African Communities",
  "Together we grow stronger",
  "Learn. Build. Share.",
  "Your journey starts here",
];

let messageIndex = 0;

welcomeBtn.addEventListener("click", function () {
  messageIndex = (messageIndex + 1) % messages.length;
  welcomeTitle.textContent = messages[messageIndex];
});

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

  helloMessage.textContent =
    "Muraho, " + name + "! Welcome to Brothers Of Africa.";
  helloMessage.style.color = "#1b5e20";
});

const counterEl = document.getElementById("counter");
const countBtn = document.getElementById("count-btn");
let count = 0;

countBtn.addEventListener("click", function () {
  count += 1;
  counterEl.textContent = count;
});
