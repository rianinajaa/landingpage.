import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { brand, principles } from "@/content/brand";

export const metadata: Metadata = {
  title: "About",
  description: `${brand.name} is a digital design and growth studio. Direct communication, work built to last, and no account layer in between.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={brand.city}
        title="Small studio. Clear standards"
        lede="A focused team, direct conversation and work we are willing to put a name on. Clients can be anywhere. The standard does not change with the time zone."
      />
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="principles-title">
        <div className="container-x">
          <h2 id="principles-title" className="section-title max-w-4xl">
            Four principles. Every project<span className="text-accent">.</span>
          </h2>
          <ol className="mt-16 grid gap-12 sm:grid-cols-2">
            {principles.map((item, index) => (
              <li key={item.title} className="border-t border-line pt-6">
                <p className="font-mono text-sm tracking-[0.14em] text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-3xl tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-16 max-w-2xl text-xl leading-relaxed text-gray-600">
            Calls, reviews and delivery happen online. You write to {brand.email} and a person who does the work reads it.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
