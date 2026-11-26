import Link from "next/link";
import type { Project } from "@/content/projects";
import { revealDelay } from "@/lib/reveal";
import { WorkCover } from "./work-cover";

export function WorkList({ projects }: { projects: Project[] }) {
  return (
    <ul className="mt-16 grid gap-16 sm:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
      {projects.map((project, index) => (
        <li key={project.slug} className={index % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-24"} data-reveal style={revealDelay(index * 0.12)}>
          <Link href={`/portfolio/${project.slug}`} className="work-card group block">
            <div className="relative aspect-[16/10] max-h-[72svh] overflow-hidden rounded-[1.25rem] bg-ink/5" data-reveal="clip" style={revealDelay(index * 0.12)}>
              <div className="cover-zoom absolute inset-0">
                <WorkCover id={project.cover} />
              </div>
              {project.sample ? <span className="sample-chip">Sample</span> : null}
            </div>
            <p className="mt-5 font-mono text-xs tracking-[0.14em] text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-2xl tracking-[-0.03em] sm:text-3xl">{project.title}</h3>
            <p className="mt-1 text-muted">{project.industry}</p>
            <p className="mt-1 text-sm text-gray-600">{project.disciplines.join(" · ")}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
