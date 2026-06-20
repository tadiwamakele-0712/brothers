import { Link } from "react-router-dom";
import { NAME } from "../constants";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="hero-label">Lesson 24 — Accessibility</p>
        <h1>Mhoro, Ndini {NAME}</h1>
        <p>Sites zvinoshanda kune vanhu vese — keyboard, screen readers, contrast.</p>
        <div className="hero-links">
          <a href="lesson24.html" className="btn">
            Lesson 24 →
          </a>
          <Link to="/contact" className="btn btn-outline">
            Test portfolio
          </Link>
        </div>
      </section>

      <section className="section router-demo">
        <h2>Lesson 24: Web Accessibility (a11y)</h2>
        <p className="section-intro">
          Semantic HTML, alt text, form labels, focus styles, uye Lighthouse audit
          pa portfolio yako.
        </p>
        <p className="section-intro">
          <a href="lesson24.html">Vhura guide →</a>
          {" · "}
          <a href="lesson23.html">Lesson 23 (Git)</a>
        </p>
      </section>
    </>
  );
}
