import type { Metadata } from "next";
import { Suspense } from "react";
import { CopyEmail } from "@/components/site/copy-email";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/page-hero";
import { brand, contactFaqs, contactSteps } from "@/content/brand";
import { isInterest } from "@/lib/enquiry";
import { revealDelay } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell us about a website, product or AI project. ${brand.name} replies within ${brand.responseWindow}.`,
};

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <>
      <PageHero
        eyebrow={brand.availability === "available" ? "Available for work" : "Booked"}
        title="Let's talk"
        lede="Tell us about the project, or send a short note. Every message is read by the people who would do the work."
      />
      <section data-header-theme="light" className="section-y bg-white" aria-labelledby="contact-steps-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <h2 id="contact-steps-title" className="text-4xl tracking-[-0.04em]">
              Start with a few details<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Prefer email? <CopyEmail tone="ink" />
            </p>
            <ol className="mt-10 grid gap-6">
              {contactSteps.map((step, index) => (
                <li key={step.title} data-reveal style={revealDelay(0.08 + index * 0.08)}>
                  <p className="font-mono text-xs tracking-[0.14em] text-muted">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-2xl tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div id="enquiry" className="lg:col-span-7" data-reveal style={revealDelay(0.12)}>
            <Suspense fallback={<div className="min-h-80 rounded-3xl bg-mist" />}>
              <ContactForm searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
      <section data-header-theme="light" className="bg-white pb-28" aria-labelledby="contact-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="contact-faq-title" className="text-4xl tracking-[-0.04em] lg:col-span-4">
            Good questions<span className="text-accent">.</span>
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={contactFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}

async function ContactForm({
  searchParams,
}: {
  searchParams: PageProps<"/contact">["searchParams"];
}) {
  const params = await searchParams;
  const interest = typeof params.interest === "string" && isInterest(params.interest) ? params.interest : undefined;
  return <EnquiryForm interest={interest} />;
}
