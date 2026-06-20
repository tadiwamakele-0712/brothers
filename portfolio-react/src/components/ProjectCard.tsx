import type { ProjectCardProps } from "../types";

export default function ProjectCard({
  title,
  description,
  link,
  tags,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tags">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <a href={link} className="project-link" target="_blank" rel="noreferrer">
        Vhura project →
      </a>
    </article>
  );
}
