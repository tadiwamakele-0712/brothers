const PROGRESS_KEY = "web-dev-lessons-progress";

const LESSONS = [
  { num: 1, title: "HTML Basics", topic: "Structure, tags, headings", link: "lesson-01-html/index.html", phase: "Fundamentals" },
  { num: 2, title: "Semantic HTML", topic: "Forms, tables, semantic tags", link: "lesson-02-semantic/index.html", phase: "Fundamentals" },
  { num: 3, title: "CSS Styling", topic: "Colors, fonts, layout", link: "lesson-03-css/index.html", phase: "Fundamentals" },
  { num: 4, title: "JavaScript", topic: "Variables, functions, events", link: "lesson-04-javascript/index.html", phase: "Fundamentals" },
  { num: 5, title: "Responsive Design", topic: "Media queries, mobile", link: "lesson-05-responsive/index.html", phase: "Fundamentals" },
  { num: 6, title: "Git & GitHub", topic: "Version control, commits", link: "lesson-06-git/index.html", phase: "Fundamentals" },
  { num: 7, title: "GitHub Pages", topic: "Deploy website online", link: "lesson-07-github-pages/index.html", phase: "Fundamentals" },
  { num: 8, title: "Todo App", topic: "localStorage project", link: "lesson-08-todo/todo.html", phase: "Projects" },
  { num: 9, title: "DOM + Calculator", topic: "Events, logic, DOM", link: "lesson-09-calculator/index.html", phase: "Projects" },
  { num: 10, title: "Fetch API", topic: "Weather App, async data", link: "../portfolio/weather-app/index.html", phase: "Projects" },
  { num: 11, title: "Async/Await", topic: "Notes App, JSON", link: "../portfolio/tadie-app/index.html", phase: "Projects" },
  { num: 12, title: "HTML Portfolio", topic: "Final HTML project", link: "../portfolio/index.html", phase: "Projects" },
  { num: 13, title: "React Intro", topic: "Components & props", link: "../portfolio-react/standalone.html", phase: "React" },
  { num: 14, title: "useState + Forms", topic: "Controlled inputs", link: "../portfolio-react/standalone.html#/contact", phase: "React" },
  { num: 15, title: "useEffect", topic: "Draft save, scroll", link: "../portfolio-react/standalone.html#/journey", phase: "React" },
  { num: 16, title: "Capstone", topic: "Certificate, polish", link: "../portfolio-react/certificate.html", phase: "React" },
  { num: 17, title: "React Router", topic: "Multiple pages", link: "../portfolio-react/standalone.html#/projects", phase: "Advanced" },
  { num: 18, title: "TypeScript", topic: "Types, interfaces", link: "../portfolio-react/typescript-demo.html", phase: "Advanced" },
  { num: 19, title: "Node.js + Express", topic: "Backend API", link: "../backend-api/public/index.html", phase: "Advanced" },
  { num: 20, title: "React + API", topic: "Connect frontend", link: "../portfolio-react/standalone.html#/about", phase: "Advanced" },
  { num: 21, title: "Bonus: SQLite", topic: "Database, deploy", link: "../backend-api/public/lesson21.html", phase: "Bonus" },
  { num: 22, title: "Capstone Project", topic: "Build your own app", link: "../portfolio-react/lesson22.html", phase: "Capstone" },
  { num: 23, title: "Git Branches & PRs", topic: "Professional workflow", link: "../portfolio-react/lesson23.html", phase: "Professional" },
  { num: 24, title: "Web Accessibility", topic: "a11y, Lighthouse", link: "../portfolio-react/lesson24.html", phase: "Professional" },
  { num: 25, title: "Performance & SEO", topic: "Core Web Vitals", link: "../portfolio-react/lesson25.html", phase: "Professional" },
];

function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(PROGRESS_KEY);
    }
  }
  return [];
}

function updateProgressBar(doneList) {
  const total = LESSONS.length;
  const count = doneList.length;
  const percent = Math.round((count / total) * 100);

  document.getElementById("progress-count").textContent = count + " / " + total;
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-fill").style.width = percent + "%";
}

function renderLessons() {
  const doneList = loadProgress();
  const container = document.getElementById("lessons-container");
  container.innerHTML = "";

  let currentPhase = "";

  LESSONS.forEach(function (lesson) {
    if (lesson.phase !== currentPhase) {
      currentPhase = lesson.phase;
      const phaseEl = document.createElement("h3");
      phaseEl.className = "phase-title";
      phaseEl.textContent = currentPhase;
      container.appendChild(phaseEl);
    }

    const isDone = doneList.includes(lesson.num);
    const card = document.createElement("article");
    card.className = "lesson-card" + (isDone ? " done" : "");

    card.innerHTML =
      '<span class="lesson-num">' + lesson.num + "</span>" +
      '<div class="lesson-info">' +
      "<h3>" + lesson.title + "</h3>" +
      "<p>" + lesson.topic + "</p>" +
      "</div>" +
      '<a href="' + lesson.link + '" class="lesson-link">Vhura →</a>';

    container.appendChild(card);
  });

  updateProgressBar(doneList);
}

renderLessons();
