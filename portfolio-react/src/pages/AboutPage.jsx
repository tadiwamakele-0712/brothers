import { useEffect, useState } from "react";
import { NAME, SKILLS } from "../constants";
import ProfilePhoto from "../components/ProfilePhoto";
import { fetchSkills } from "../api/portfolioApi";

export default function AboutPage() {
  const [skills, setSkills] = useState<string[]>(SKILLS);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    fetchSkills()
      .then((data) => {
        setSkills(data);
        setFromApi(true);
      })
      .catch(() => setFromApi(false));
  }, []);

  return (
    <>
      <section className="section">
        <h2>Nezvangu</h2>
        <div className="about-layout">
          <ProfilePhoto name={NAME} />
          <div className="about-text">
            <p>
              Ndiri mutambi we web development kubva muZimbabwe. Ndadzidza kugadzira
              ma-peji anoshanda uye ndiri kudzidza React.
            </p>
            <p>
              Lesson 20: Skills zviri pasi zvinouya kubva{" "}
              <strong>{fromApi ? "Express API (GET /api/skills)" : "local fallback"}</strong>.
            </p>
            <a
              href="https://github.com/tadiwamakele-0712"
              target="_blank"
              rel="noreferrer"
            >
              Ona kodhi yangu pa GitHub →
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Skills {fromApi && <span className="api-badge">from API</span>}</h2>
        <ul className="skills">
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
