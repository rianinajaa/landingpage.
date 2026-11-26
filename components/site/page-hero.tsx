import { revealDelay } from "@/lib/reveal";

export function PageHero({
  eyebrow,
  title,
  lede,
  id = "page-title",
}: {
  eyebrow: string;
  title: string;
  lede: string;
  id?: string;
}) {
  return (
    <section data-header-theme="dark" className="bg-ink text-white" aria-labelledby={id}>
      <div className="container-x flex flex-col justify-end pt-[calc(var(--header-h)+4rem)] pb-20 sm:pb-28">
        <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.18em] text-white/55 uppercase" data-reveal>
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 id={id} className="page-title mt-6 max-w-5xl" data-reveal style={revealDelay(0.08)}>
          {title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70" data-reveal style={revealDelay(0.18)}>{lede}</p>
      </div>
    </section>
  );
}
