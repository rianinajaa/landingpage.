import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site/cta-band";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/page-hero";
import { serviceFaqs } from "@/content/brand";
import { serviceGroups } from "@/content/navigation";
import { services } from "@/content/services";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design, development, SEO and AI search, and AI integration from one studio.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Design, build, grow. One studio"
        lede="Websites, growth and AI from one team, so the work does not get lost between agencies. Start with one discipline or bring the whole product."
      />
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="service-list-title">
        <div className="container-x">
          <h2 id="service-list-title" className="sr-only">
            The four disciplines
          </h2>
          <div className="grid gap-16">
            {serviceGroups.map((group, groupIndex) => (
              <div key={group} className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12" data-reveal style={revealDelay(groupIndex * 0.08)}>
                <p className="font-mono text-sm tracking-[0.14em] text-muted lg:col-span-3">
                  {String(groupIndex + 1).padStart(2, "0")} / {group}
                </p>
                <ul className="grid gap-8 lg:col-span-9">
                  {services
                    .filter((service) => service.group === group)
                    .map((service) => (
                      <li key={service.slug}>
                        <Link href={`/services/${service.slug}`} className="group block">
                          <h3 className="text-3xl tracking-[-0.04em] group-hover:text-accent sm:text-4xl">{service.navLabel}</h3>
                          <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">{service.summary}</p>
                          <p className="mt-3 text-sm text-muted">{service.includes.slice(0, 3).map((item) => item.title).join(" · ")}</p>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-header-theme="light" className="bg-white pb-28" aria-labelledby="service-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="service-faq-title" className="text-4xl tracking-[-0.04em] lg:col-span-4">
            Good questions<span className="text-accent">.</span>
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={serviceFaqs} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
