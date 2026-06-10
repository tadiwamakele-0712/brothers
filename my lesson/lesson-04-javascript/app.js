const QUESTIONS = [
  {
    question: "What does HTML stand for?",
    answers: [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink Text Making Language",
    ],
    correct: 0,
  },
  {
    question: "Which tag creates a clickable link?",
    answers: ["<link>", "<a>", "<href>", "<url>"],
    correct: 1,
  },
  {
    question: "Which property changes text colour in CSS?",
    answers: ["font-color", "text-style", "color", "background"],
    correct: 2,
  },
  {
    question: "How do you select an element with id=\"menu\" in CSS?",
    answers: [".menu", "#menu", "menu", "*menu"],
    correct: 1,
  },
  {
    question: "Which JavaScript keyword stores a value?",
    answers: ["store", "var / let / const", "save", "hold"],
    correct: 1,
  },
];

const BEST_SCORE_KEY = "quiz-app-best-score";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const homeBtn = document.getElementById("home-btn");

const questionCounter = document.getElementById("question-counter");
const scoreLive = document.getElementById("score-live");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");

const resultsTitle = document.getElementById("results-title");
const resultsMessage = document.getElementById("results-message");
const finalScore = document.getElementById("final-score");
const newRecordEl = document.getElementById("new-record");
const bestScoreText = document.getElementById("best-score-text");

let currentIndex = 0;
let score = 0;
let answered = false;

function showScreen(screen) {
  [startScreen, quizScreen, resultsScreen].forEach(function (el) {
    el.classList.remove("active");
  });
  screen.classList.add("active");
}

function loadBestScore() {
  const best = localStorage.getItem(BEST_SCORE_KEY);
  if (best && bestScoreText) {
    bestScoreText.textContent = "Best score: " + best + " / " + QUESTIONS.length;
  }
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentIndex];
  answered = false;

  questionCounter.textContent =
    "Question " + (currentIndex + 1) + " of " + QUESTIONS.length;
  scoreLive.textContent = "Score: " + score;
  progressBar.style.width =
    ((currentIndex / QUESTIONS.length) * 100).toFixed(0) + "%";

  questionText.textContent = q.question;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.hidden = true;

  q.answers.forEach(function (answer, index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", function () {
      pickAnswer(index);
    });
    answersEl.appendChild(btn);
  });
}

function pickAnswer(index) {
  if (answered) return;
  answered = true;

  const q = QUESTIONS[currentIndex];
  const buttons = answersEl.querySelectorAll(".answer-btn");

  buttons.forEach(function (btn, i) {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && index !== q.correct) btn.classList.add("wrong");
  });

  if (index === q.correct) {
    score += 1;
    scoreLive.textContent = "Score: " + score;
    feedbackEl.textContent = "Correct!";
    feedbackEl.className = "feedback correct";
  } else {
    feedbackEl.textContent = "Not quite — the correct answer is highlighted.";
    feedbackEl.className = "feedback wrong";
  }

  nextBtn.hidden = false;
  nextBtn.textContent =
    currentIndex === QUESTIONS.length - 1 ? "See results" : "Next question";
}

function showResults() {
  showScreen(resultsScreen);
  finalScore.textContent = score + " / " + QUESTIONS.length;

  const best = Number(localStorage.getItem(BEST_SCORE_KEY) || 0);
  const isNewRecord = score > best;

  if (isNewRecord) {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    newRecordEl.hidden = false;
  } else {
    newRecordEl.hidden = true;
  }

  loadBestScore();

  if (score === QUESTIONS.length) {
    resultsTitle.textContent = "Perfect score!";
    resultsMessage.textContent = "You got every question right.";
  } else if (score >= 3) {
    resultsTitle.textContent = "Nice work!";
    resultsMessage.textContent = "Good job — keep practising and try again.";
  } else {
    resultsTitle.textContent = "Keep learning!";
    resultsMessage.textContent = "Review the questions and play again.";
  }
}

startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", function () {
  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
});

retryBtn.addEventListener("click", startQuiz);

homeBtn.addEventListener("click", function () {
  showScreen(startScreen);
});

loadBestScore();
