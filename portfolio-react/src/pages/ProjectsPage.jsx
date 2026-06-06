import { useEffect, useState } from "react";
import { PROJECTS } from "../constants";
import ProjectCard from "../components/ProjectCard";
import { fetchApiProjects } from "../api/portfolioApi";
import type { ApiProjectSummary } from "../api/client";

export default function ProjectsPage() {
  const [apiProjects, setApiProjects] = useState<ApiProjectSummary[]>([]);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    fetchApiProjects()
      .then((data) => {
        setApiProjects(data);
        setFromApi(true);
      })
      .catch(() => setFromApi(false));
  }, []);

  return (
    <>
      <section className="section">
        <h2>Projects Zvangu</h2>
        <p className="section-intro">
          Static projects (local links) + data kubva API kana server iri online.
        </p>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              link={project.link}
              tags={project.tags}
            />
          ))}
        </div>
      </section>

      {fromApi && (
        <section className="section">
          <h2>
            From API <span className="api-badge">GET /api/projects</span>
          </h2>
          <div className="project-grid">
            {apiProjects.map((project) => (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p>Project data kubva Express backend.</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
