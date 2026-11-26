import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { WorkList } from "@/components/site/work-list";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Sample case studies in web design, development and AI. Real client work replaces these when it ships.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Our work"
        lede={`${projects.length} studies across design, development and AI. Each sample is labeled. Nothing here is presented as a client result.`}
      />
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="portfolio-grid-title">
        <div className="container-x">
          <h2 id="portfolio-grid-title" className="sr-only">
            Projects
          </h2>
          <WorkList projects={projects} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
