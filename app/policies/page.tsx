import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Privacy and terms",
  description: `How ${brand.name} handles enquiry data, and what sending a form does and does not agree to.`,
};

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Privacy and terms"
        lede="Short, practical notes for the enquiry form. This is not a finished legal document. Have counsel review it before the site takes real clients."
      />
      <section data-header-theme="light" className="section-y bg-white">
        <div className="container-x grid max-w-3xl gap-12 text-base leading-relaxed text-gray-600">
          <article id="privacy" className="scroll-mt-28">
            <h2 className="text-3xl tracking-[-0.04em] text-ink">Privacy</h2>
            <p className="mt-4">
              The enquiry form collects your name, email, the kind of work you need, an optional budget and the note you write. If you fill the hidden website field, the note is treated as spam and discarded.
            </p>
            <p className="mt-4">
              A valid request is logged on the server so the studio can reply. If email delivery is configured, a copy is sent to {brand.email}. We do not sell the details and we do not add you to a newsletter from this form.
            </p>
            <p className="mt-4">
              This version of the site does not run analytics and does not set a cookie banner. If analytics is added later, the banner and this page should be updated together.
            </p>
            <p className="mt-4">
              To ask about a message you sent, write to {brand.email}.
            </p>
          </article>
          <article id="terms">
            <h2 className="text-3xl tracking-[-0.04em] text-ink">Terms</h2>
            <p className="mt-4">
              Sending the form is a request for a conversation. It is not a contract, a booking or an agreement on price. A project starts only after a written proposal is accepted.
            </p>
            <p className="mt-4">
              Sample projects on this site are layout studies. They are not client results and they are not claims about revenue, rankings or savings.
            </p>
            <p className="mt-4">
              The studio name, the writing and the interface of this site belong to {brand.legalName}. Please do not copy them and present them as another studio.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
