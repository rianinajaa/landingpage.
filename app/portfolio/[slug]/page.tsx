import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/site/button";
import { CtaBand } from "@/components/site/cta-band";
import { WorkCover } from "@/components/site/work-cover";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <article>
        <header data-header-theme="dark" className="bg-ink text-white">
          <div className="container-x pt-[calc(var(--header-h)+4rem)] pb-12">
            <p className="font-mono text-xs tracking-[0.18em] text-white/50 uppercase">{project.industry}</p>
            <h1 className="page-title mt-4 max-w-4xl">
              {project.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{project.summary}</p>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-white/40 uppercase">Year</dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-white/40 uppercase">Disciplines</dt>
                <dd className="mt-1">{project.disciplines.join(" · ")}</dd>
              </div>
            </dl>
          </div>
        </header>
        <div data-header-theme="light" className="bg-white">
          <div className="container-x py-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem]">
              <WorkCover id={project.cover} />
              {project.sample ? <span className="sample-chip">Sample</span> : null}
            </div>
            {project.sample ? (
              <p className="mt-4 text-sm text-gray-600">Sample project for the studio site.</p>
            ) : null}
            <div className="mt-14 grid gap-12 lg:grid-cols-3">
              {[
                ["Problem", project.problem],
                ["Work", project.work],
                ["Outcome", project.outcome],
              ].map(([label, body]) => (
                <section key={label}>
                  <h2 className="font-mono text-xs tracking-[0.16em] text-muted uppercase">{label}</h2>
                  <p className="mt-3 text-lg leading-relaxed">{body}</p>
                </section>
              ))}
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
              <Button href="/portfolio" variant="outline">All projects</Button>
              {next ? (
                <Link href={`/portfolio/${next.slug}`} className="text-link text-lg">
                  Next: {next.title}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
