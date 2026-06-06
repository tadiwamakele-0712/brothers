import { useState } from "react";
import ContactForm from "../components/ContactForm";
import ApiMessages from "../components/ApiMessages";

export default function ContactPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="section">
      <h2>Contact</h2>
      <p className="section-intro">
        Form inotumira message ku <strong>POST /api/contact</strong> (Lesson 20).
      </p>
      <ContactForm onSent={() => setRefreshKey((k) => k + 1)} />

      <h3 style={{ marginTop: "28px", marginBottom: "12px", color: "var(--accent)" }}>
        Messages kubva API
      </h3>
      <ApiMessages key={refreshKey} />

      <ul className="contact-list">
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:tadiwamakele@gmail.com">tadiwamakele@gmail.com</a>
        </li>
        <li>
          <strong>Phone:</strong>{" "}
          <a href="tel:+263785092719">+263 785 092 719</a>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/tadiwamakele-0712"
            target="_blank"
            rel="noreferrer"
          >
            github.com/tadiwamakele-0712
          </a>
        </li>
      </ul>
    </section>
  );
}
