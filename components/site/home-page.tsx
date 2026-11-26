import Link from "next/link";
import { brand, logoRows, offerings, principles, processSteps, toolGroups } from "@/content/brand";
import { featuredProjects } from "@/content/projects";
import { services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { revealDelay } from "@/lib/reveal";
import { Button } from "./button";
import { CtaBand } from "./cta-band";
import { JsonLd } from "./json-ld";
import { Testimonials } from "./testimonials";
import { WorkList } from "./work-list";

const heroWords = brand.tagline.replace(/\.$/, "").split(". ");

export function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Selected work",
          itemListElement: featuredProjects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: `${brand.siteUrl}/portfolio/${project.slug}`,
          })),
        }}
      />
      <section data-header-theme="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[55%] -z-10 h-[40%] bg-[radial-gradient(50%_50%_at_50%_40%,rgb(255_255_255/0.06),transparent)]"
        />
        <div className="container-x flex flex-1 flex-col items-center justify-center py-[calc(var(--header-h)+2.5rem)] text-center">
          <p className="intro flex items-center gap-2.5 text-xs tracking-[0.18em] text-white/55 uppercase" style={{ ["--d" as string]: "0.1s" }}>
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {brand.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-title mt-6 flex flex-wrap justify-center gap-x-[0.28em]">
            {heroWords.map((word, index) => (
              <span key={word} className="line-mask">
                <span className="intro-line" style={{ ["--d" as string]: `${index * 0.1}s` }}>
                  {word}
                  {index === heroWords.length - 1 ? <span className="text-accent">.</span> : "."}
                </span>
              </span>
            ))}
          </h1>
          <p className="intro mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg" style={{ ["--d" as string]: "0.55s" }}>
            Websites, product interfaces and AI systems for companies that are finished looking interchangeable.
          </p>
          <div className="intro mt-9 flex flex-col items-center gap-3 sm:flex-row" style={{ ["--d" as string]: "0.7s" }}>
            <Button href="/#get-started" variant="light" size="lg">Get a free quote</Button>
            <Button href="/portfolio" variant="outline-light" size="lg">View our work</Button>
          </div>
        </div>
        <div className="container-x grid gap-8 pb-8 sm:grid-cols-[1.2fr_auto_1fr] sm:items-end" data-reveal style={revealDelay(0.75)}>
          <dl className="flex flex-wrap gap-x-8 gap-y-5">
            {brand.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-white/50 uppercase">{stat.label}</dt>
                <dd className="mt-1 text-3xl tracking-[-0.04em]">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="hidden flex-col items-center gap-3 sm:flex">
            <span className="font-mono text-[0.68rem] tracking-[0.18em] text-white/50 uppercase">Scroll</span>
            <span className="scroll-line" aria-hidden="true" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/55 sm:justify-self-end sm:text-right">{brand.trustLine}</p>
        </div>
      </section>

      <section data-header-theme="dark" className="section-y bg-ink text-white" aria-labelledby="disciplines-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal>
            <div className="lg:col-span-8">
              <p className="font-mono text-xs tracking-[0.18em] text-white/50 uppercase">What we do</p>
              <h2 id="disciplines-title" className="section-title mt-4">
                Four disciplines. One studio<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="max-w-xs text-base leading-relaxed text-white/65 lg:col-span-4 lg:justify-self-end lg:text-right">
              Every project is built around one outcome: a digital presence that pays you back.
            </p>
          </div>
          <div className="mt-12">
            {services.map((service, index) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="discipline" data-reveal style={revealDelay(index * 0.1)}>
                <span className="discipline__index font-mono text-sm text-white/45">{String(index + 1).padStart(2, "0")}</span>
                <span className="discipline__head">
                  <span className="block text-3xl tracking-[-0.04em] sm:text-4xl">{service.navLabel}</span>
                  <span className="mt-2 block max-w-xl text-white/60">{service.summary}</span>
                </span>
                <span className="discipline__arrow" aria-hidden="true">↗</span>
                <span className="discipline__items text-sm text-white/45">
                  {service.includes.slice(0, 4).map((item) => item.title).join(" · ")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="section-y bg-white text-ink" aria-labelledby="work-title">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end" data-reveal>
            <h2 id="work-title" className="section-title lg:col-span-8">
              Selected work<span className="text-accent">.</span>
            </h2>
            <p className="max-w-xs text-base leading-relaxed text-gray-600 lg:col-span-4 lg:justify-self-end lg:text-right">
              Recent studies across design, development and AI. Samples are labeled until client work replaces them.
            </p>
          </div>
          <WorkList projects={featuredProjects} />
          <div className="mt-14" data-reveal>
            <Button href="/portfolio" variant="outline">View all projects</Button>
          </div>
        </div>
      </section>

      <section data-header-theme="dark" className="section-y bg-ink text-white" aria-labelledby="how-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-white/50 uppercase">How we work</p>
              <h2 id="how-title" className="section-title mt-4">
                From idea to launch<span className="text-accent">.</span>
              </h2>
            </div>
            <Button href="/contact" variant="outline-light">Book a strategy call</Button>
          </div>
          <div className="mt-16 grid min-w-0 gap-16 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-12" data-reveal>
              <p className="font-mono text-xs tracking-[0.16em] text-white/45 uppercase">01 What we build</p>
              <div className="marquee mt-6 border-y border-white/10 py-4">
                <div className="marquee-track text-2xl tracking-[-0.03em] sm:text-4xl" aria-hidden="true">
                  {[...offerings, ...offerings].map((item, index) => (
                    <span key={`${item}-${index}`} className="inline-flex items-center gap-3 pr-3">
                      {item}
                      <span className="text-accent">·</span>
                    </span>
                  ))}
                </div>
              </div>
              <p className="sr-only">{offerings.join(", ")}</p>
            </div>
            <div className="lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.16em] text-white/45 uppercase">02 Our process</p>
              <ol className="mt-6 grid gap-6">
                {processSteps.map((step, index) => (
                  <li key={step.title} data-reveal style={revealDelay(index * 0.1)}>
                    <p className="font-mono text-xs text-white/40">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-2xl tracking-[-0.03em]">{step.title}</h3>
                    <p className="mt-2 max-w-md text-white/65">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-mono text-xs tracking-[0.16em] text-white/45 uppercase">03 How we build it</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {toolGroups.map((group) => (
                  <div key={group.label} data-reveal style={revealDelay(0.08)}>
                    <h3 className="text-lg">{group.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{group.items.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="section-y bg-white text-ink" aria-labelledby="why-title">
        <div className="container-x">
          <h2 id="why-title" className="section-title max-w-4xl" data-reveal>
            Why brands choose us<span className="text-accent">.</span>
          </h2>
          <ol className="mt-16 grid gap-12 sm:grid-cols-2">
            {principles.map((item, index) => (
              <li key={item.title} data-reveal style={revealDelay((index % 2) * 0.12)}>
                <p className="font-mono text-sm tracking-[0.14em] text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-3xl tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-header-theme="accent" className="section-y bg-accent text-white" aria-labelledby="wall-title">
        <div className="container-x">
          <h2 id="wall-title" className="wall-title max-w-5xl" data-reveal>
            One standard for every project<span className="text-ink">.</span>
          </h2>
          <p className="mt-8 max-w-md text-2xl leading-snug" data-reveal style={revealDelay(0.12)}>
            Websites, platforms and dashboards, each one designed for the business in front of us.
          </p>
          <div className="mt-10" data-reveal style={revealDelay(0.22)}>
            <Button href="/portfolio" variant="on-accent">View all projects</Button>
          </div>
        </div>
      </section>

      {testimonials.length > 0 ? (
        <section data-header-theme="dark" className="section-y bg-ink text-white" aria-labelledby="testimonials-title">
          <div className="container-x">
            <h2 id="testimonials-title" className="section-title" data-reveal>
              In their words<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-md text-white/60" data-reveal style={revealDelay(0.1)}>
              Sample cards show the layout. Real reviews replace them after a project ships.
            </p>
            <div className="mt-12" data-reveal style={revealDelay(0.16)}>
              <Testimonials items={testimonials} />
            </div>
            <div className="mt-16 grid gap-8 border-t border-white/10 pt-10">
              {logoRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8" data-reveal>
                  <p className="w-28 font-mono text-[0.68rem] tracking-[0.16em] text-white/40 uppercase">{row.label}</p>
                  <p className="text-lg tracking-[-0.03em] text-white/80">{row.names.join("   ·   ")}</p>
                </div>
              ))}
              <p className="text-sm text-white/45">Placeholder names until real work is listed.</p>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand withForm />
    </>
  );
}
