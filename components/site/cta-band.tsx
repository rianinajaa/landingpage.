import { brand } from "@/content/brand";
import { Button } from "./button";
import { CopyEmail } from "./copy-email";
import { EnquiryForm } from "./enquiry-form";

export function CtaBand({ withForm = false, interest }: { withForm?: boolean; interest?: string }) {
  const contactHref = interest ? `/contact?interest=${interest}#enquiry` : "/contact";

  return (
    <section id="get-started" data-header-theme="accent" className="section-y bg-accent text-white" aria-labelledby="cta-title">
      <div className="container-x grid items-start gap-12 lg:grid-cols-12">
        <div className={withForm ? "lg:col-span-5" : "lg:col-span-8"}>
          <h2 id="cta-title" className="wall-title">
            Let&apos;s build the next project
            <span className="text-ink">.</span>
          </h2>
          <p className="mt-6 max-w-md text-2xl leading-snug text-white">
            A digital presence that looks considered, loads quickly and gives better clients a reason to write.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-base">
              <CopyEmail tone="ink" />
            </span>
            {withForm ? null : (
              <Button href={contactHref} variant="on-accent">
                Tell us about the project
              </Button>
            )}
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-ink">
            <span className="size-1.5 rounded-full bg-available" aria-hidden="true" />
            {brand.availability === "available" ? "Available for work" : "Booked"}
          </p>
        </div>
        {withForm ? (
          <div id="enquiry" className="lg:col-span-7">
            <EnquiryForm interest={interest} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
