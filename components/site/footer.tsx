import Link from "next/link";
import { brand } from "@/content/brand";
import { footerNav, serviceNav } from "@/content/navigation";
import { CopyEmail } from "./copy-email";

export function Footer() {
  const available = brand.availability === "available";

  return (
    <footer data-header-theme="dark" className="bg-ink text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        {brand.name}
      </h2>
      <div className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="wordmark text-3xl">{brand.name}</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">{brand.description}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm">
              <span className={`size-1.5 rounded-full ${available ? "bg-available" : "bg-gray-400"}`} aria-hidden="true" />
              {available ? "Available for work" : "Booked"}
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.16em] text-white/45 uppercase">Navigation</p>
              <ul className="mt-4 grid gap-2">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.16em] text-white/45 uppercase">Services</p>
              <ul className="mt-4 grid gap-2">
                {serviceNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/85">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.16em] text-white/45 uppercase">Connect</p>
              <div className="mt-4 grid gap-2 text-white/85">
                <CopyEmail />
                <Link href="/contact" className="text-link">
                  Book a discovery call
                </Link>
                <p className="text-sm text-white/50">{brand.city}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/55">
          <p>
            © {brand.copyrightYear} {brand.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/policies" className="text-link">
              Privacy and terms
            </Link>
            <a href="#main" className="text-link">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
