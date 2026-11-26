"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.body;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const watching = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "true");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    function watch(node: Element) {
      if (watching.has(node) || node.getAttribute("data-shown") === "true") return;
      watching.add(node);
      if (reduce) {
        node.setAttribute("data-shown", "true");
        return;
      }
      observer.observe(node);
    }

    function scan() {
      root?.querySelectorAll("[data-reveal]").forEach(watch);
    }

    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
