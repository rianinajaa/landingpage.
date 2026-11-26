import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/cta-band";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { brand } from "@/content/brand";
import { getService, services } from "@/content/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.navLabel,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.navLabel,
          description: service.summary,
          url: `${brand.siteUrl}/services/${service.slug}`,
          provider: { "@type": "Organization", name: brand.name, url: brand.siteUrl },
        }}
      />
      <PageHero eyebrow={service.group} title={service.title} lede={service.promise} />
      <section data-header-theme="light" className="border-b border-line bg-white" aria-label="Project facts">
        <dl className="container-x grid gap-6 py-8 sm:grid-cols-3">
          {service.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">{fact.label}</dt>
              <dd className="mt-1 text-2xl tracking-[-0.03em]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="includes-title">
        <div className="container-x">
          <h2 id="includes-title" className="section-title max-w-4xl">
            What you leave with<span className="text-accent">.</span>
          </h2>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2">
            {service.includes.map((item, index) => (
              <li key={item.title} className="border-t border-line pt-5">
                <p className="font-mono text-xs tracking-[0.14em] text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-2xl tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-gray-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section data-header-theme="light" className="bg-mist" aria-labelledby="fit-title">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <h2 id="fit-title" className="text-3xl tracking-[-0.04em]">
              This is for you if
            </h2>
            <ul className="mt-6 grid gap-3 text-base leading-relaxed text-gray-600">
              {service.fit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl tracking-[-0.04em]">Probably not for you if</h2>
            <ul className="mt-6 grid gap-3 text-base leading-relaxed text-gray-600">
              {service.notFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="service-detail-faq">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="service-detail-faq" className="text-4xl tracking-[-0.04em] lg:col-span-4">
            Good questions<span className="text-accent">.</span>
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={service.faqs} />
          </div>
        </div>
      </section>
      <CtaBand interest={service.interest} />
    </>
  );
}
