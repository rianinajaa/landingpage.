"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/content/brand";
import { footerNav, headerNav, serviceGroups, serviceNav } from "@/content/navigation";
import { Button } from "./button";

type Theme = "dark" | "light" | "accent";

const talkVariant: Record<Theme, "light" | "ink" | "on-accent"> = {
  dark: "light",
  light: "ink",
  accent: "on-accent",
};

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const shown = open ? "dark" : theme;

  function toggleMenu() {
    setOpenPath(open ? null : pathname);
  }

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const probe = window.requestAnimationFrame(() => {
      const marker = 80;
      let next: Theme = "dark";
      document.querySelectorAll<HTMLElement>("[data-header-theme]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          const value = node.getAttribute("data-header-theme");
          if (value === "dark" || value === "light" || value === "accent") next = value;
        }
      });
      setTheme(next);
      setScrolled(window.scrollY > 12);
    });
    function onScroll() {
      const marker = 80;
      let next: Theme = "dark";
      document.querySelectorAll<HTMLElement>("[data-header-theme]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          const value = node.getAttribute("data-header-theme");
          if (value === "dark" || value === "light" || value === "accent") next = value;
        }
      });
      setTheme(next);
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(probe);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    if (main) main.inert = open;
    if (footer instanceof HTMLElement) footer.inert = open;
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPath(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (main) main.inert = false;
      if (footer instanceof HTMLElement) footer.inert = false;
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header className="site-header" data-theme={shown} data-scrolled={scrolled ? "true" : "false"}>
        <div className="container-x flex w-full items-center justify-between gap-6">
          <Link href="/" className="wordmark" aria-label={`${brand.name} home`}>
            {brand.name}
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {headerNav.map((item) =>
              item.href === "/services" ? (
                <div key={item.href} className="nav-item relative">
                  <Link href={item.href} className="nav-link" aria-current={pathname.startsWith("/services") ? "page" : undefined}>
                    {item.label}
                  </Link>
                  <div className="mega">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {serviceGroups.map((group) => (
                        <div key={group}>
                          <p className="font-mono text-[0.68rem] tracking-[0.16em] text-muted uppercase">{group}</p>
                          <ul className="mt-2">
                            {serviceNav
                              .filter((service) => service.group === group)
                              .map((service) => (
                                <li key={service.href}>
                                  <Link href={service.href} className="text-link text-base">
                                    {service.label}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <Link href="/services" className="mt-4 inline-block text-sm text-gray-600">
                      All services
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button href="/contact" variant={talkVariant[shown]} className="talk-btn">
              Let&apos;s talk
            </Button>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              data-open={open ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="menu-bars" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div id="site-menu" className="site-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <nav aria-label="Menu">
            <ul className="grid gap-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="page-title block" onClick={() => setOpenPath(null)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid content-start gap-8">
            <Button href="/contact" variant="light" className="w-fit lg:hidden">
              Let&apos;s talk
            </Button>
            {serviceGroups.map((group) => (
              <div key={group}>
                <p className="font-mono text-xs tracking-[0.16em] text-white/50 uppercase">{group}</p>
                <ul className="mt-2 grid gap-1">
                  {serviceNav
                    .filter((service) => service.group === group)
                    .map((service) => (
                      <li key={service.href}>
                        <Link href={service.href} className="text-lg text-white/85" onClick={() => setOpenPath(null)}>
                          {service.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
