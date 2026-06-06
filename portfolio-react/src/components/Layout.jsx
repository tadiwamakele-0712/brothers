import { NavLink, Outlet } from "react-router-dom";
import { NAME } from "../constants";
import ThemeToggle from "./ThemeToggle.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ApiStatus from "./ApiStatus";

export default function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">{NAME}</div>
        <div className="header-actions">
          <nav className="nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">Nezvangu</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/journey">Journey</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <a href="../lessons.html">My Lessons</a>
            <a href="../portfolio/index.html">HTML Portfolio</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <Outlet />

      <div className="section" style={{ paddingTop: 0, paddingBottom: "20px" }}>
        <ApiStatus />
      </div>

      <ScrollToTop />

      <footer className="footer">
        <p>&copy; 2026 {NAME}. React Portfolio — Lesson 24: Accessibility.</p>
        <div className="footer-links">
          <a href="https://github.com/tadiwamakele-0712" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="../lessons.html">My Lessons</a>
          <a href="../backend-api/public/lesson21.html">Deploy</a>
          <a href="certificate.html">Certificate</a>
          <a href="../index.html">Brothers of Africa</a>
          <a href="../portfolio/index.html">HTML Portfolio</a>
        </div>
      </footer>
    </div>
  );
}
