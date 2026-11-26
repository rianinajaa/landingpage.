import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/site/button";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="That page is not here" lede="The link may be old. The work, the services and the enquiry form are still a click away." />
      <section data-header-theme="light" className="section-y bg-white">
        <div className="container-x flex flex-wrap gap-3">
          <Button href="/" variant="ink">Back home</Button>
          <Button href="/contact" variant="outline">Let&apos;s talk</Button>
        </div>
      </section>
    </>
  );
}
