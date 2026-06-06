import type { Lesson, Project } from "./types";

export const DRAFT_KEY = "portfolio-contact-draft";
export const THEME_KEY = "portfolio-theme";
export const NAME = "Tadiwa Makele";

export const LESSONS: Lesson[] = [
  { num: 1, title: "HTML Basics", topic: "Structure & tags", link: "../beginner-website/index.html" },
  { num: 2, title: "Semantic HTML", topic: "Forms & tables", link: "../login-fold.html" },
  { num: 3, title: "CSS Styling", topic: "Colors, layout, fonts", link: "../background-color-demo.html" },
  { num: 4, title: "JavaScript", topic: "Variables, functions, events", link: "../quiz-app/index.html" },
  { num: 5, title: "Responsive Design", topic: "Media queries", link: "../index.html" },
  { num: 6, title: "Git & GitHub", topic: "Version control", link: "https://github.com/tadiwamakele-0712", external: true },
  { num: 7, title: "GitHub Pages", topic: "Deploy online", link: "../lessons.html" },
  { num: 8, title: "Todo App", topic: "localStorage project", link: "../portfolio/todo-tadie/todo.html" },
  { num: 9, title: "DOM + Calculator", topic: "Events & logic", link: "../portfolio/calculator/index.html" },
  { num: 10, title: "Fetch API", topic: "Weather App", link: "../portfolio/weather-app/index.html" },
  { num: 11, title: "Async/Await", topic: "Notes App", link: "../portfolio/tadie-app/index.html" },
  { num: 12, title: "HTML Portfolio", topic: "Final project", link: "../portfolio/index.html" },
  { num: 13, title: "React Intro", topic: "Components & props", link: "standalone.html" },
  { num: 14, title: "useState + Forms", topic: "Controlled inputs", link: "standalone.html#/contact" },
  { num: 15, title: "useEffect", topic: "Side effects & deploy", link: "standalone.html#/journey" },
  { num: 16, title: "Capstone", topic: "Polish & certificate", link: "certificate.html" },
  { num: 17, title: "React Router", topic: "Multiple pages, NavLink", link: "standalone.html#/projects" },
  { num: 18, title: "TypeScript", topic: "Types, interfaces, props", link: "typescript-demo.html" },
  { num: 19, title: "Node.js + Express", topic: "Backend API, REST", link: "../backend-api/public/index.html" },
  { num: 20, title: "React + API", topic: "Fetch data, POST contact", link: "standalone.html#/about" },
  { num: 21, title: "Bonus: SQLite + Deploy", topic: "Database, admin, deploy", link: "../backend-api/public/lesson21.html" },
  { num: 22, title: "Capstone Project", topic: "Build & ship your own app", link: "lesson22.html" },
  { num: 23, title: "Git Branches & PRs", topic: "Branches, pull requests, profile", link: "lesson23.html" },
  { num: 24, title: "Web Accessibility", topic: "a11y, keyboard, Lighthouse", link: "lesson24.html" },
  { num: 25, title: "Performance & SEO", topic: "Core Web Vitals, meta tags", link: "lesson25.html" },
];

export const SKILLS: string[] = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "React Router",
  "Node.js",
  "Express",
  "SQLite",
  "DOM",
  "Fetch API",
  "localStorage",
  "Git & GitHub",
];

export const PROJECTS: Project[] = [
  {
    title: "Todo App",
    description: "List yemabasa — wedzera, mark done, bvisa. Data inochengetwa ne localStorage.",
    link: "../portfolio/todo-tadie/todo.html",
    tags: ["JavaScript", "localStorage"],
  },
  {
    title: "Calculator",
    description: "Calculator inoshanda — kuverenga ne DOM events.",
    link: "../portfolio/calculator/index.html",
    tags: ["HTML", "CSS Grid", "JavaScript"],
  },
  {
    title: "Weather App",
    description: "Tsvaga mamiriro ekosi neguta ne Fetch API.",
    link: "../portfolio/weather-app/index.html",
    tags: ["Fetch API", "async/await"],
  },
  {
    title: "Notes App",
    description: "Nyora notes, chengeta, bvisa — zvinoramba after refresh.",
    link: "../portfolio/tadie-app/index.html",
    tags: ["localStorage", "JSON"],
  },
  {
    title: "Quiz App",
    description: "Quiz interactive — dzidza ne kutamba.",
    link: "../quiz-app/index.html",
    tags: ["HTML", "CSS"],
  },
  {
    title: "Shopping List",
    description: "List yezvinhu zvekutenga.",
    link: "../shopping-list-app/index.html",
    tags: ["JavaScript"],
  },
];
