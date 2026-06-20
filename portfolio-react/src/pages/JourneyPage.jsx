import { LESSONS, NAME } from "../constants";

export default function JourneyPage() {
  return (
    <section className="section">
      <h2>Mufambiro Wangu — {LESSONS.length} Lessons</h2>
      <p className="section-intro">
        24 lessons — kubva HTML kusvika accessibility!
      </p>
      <p className="section-intro">
        <a href="../lessons.html">→ Vhura full progress page</a>
      </p>
      <div className="journey-grid">
        {LESSONS.map((lesson) => (
          <a
            key={lesson.num}
            href={lesson.link}
            className="journey-item done"
            target={lesson.external ? "_blank" : undefined}
            rel={lesson.external ? "noreferrer" : undefined}
          >
            <span className="journey-num">{lesson.num}</span>
            <div>
              <strong>{lesson.title}</strong>
              <span>{lesson.topic} — Vhura →</span>
            </div>
          </a>
        ))}
      </div>
      <div className="certificate-box">
        <h3>🎓 Makorokoto, {NAME}!</h3>
        <p>
          Wakapedza Web Development Course — 24 lessons.
        </p>
        <a href="certificate.html" className="btn-cert" target="_blank" rel="noreferrer">
          Vhura Certificate →
        </a>
      </div>
      <div className="next-steps">
        <h3>Lessons 22–24</h3>
        <ul>
          <li>
            <a href="lesson24.html">Web accessibility (a11y)</a>
          </li>
          <li>
            <a href="lesson23.html">Git branches &amp; pull requests</a>
          </li>
          <li>
            <a href="lesson22.html">Capstone — plan &amp; build your app</a>
          </li>
          <li>
            <a href="../backend-api/public/lesson21.html">Deploy guide + live API setup</a>
          </li>
          <li>
            <a href="../backend-api/public/admin.html">Admin panel — delete messages</a>
          </li>
          <li>
            <a href="../DEPLOY-BONUS.md">DEPLOY-BONUS.md — Render + GitHub Pages</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
