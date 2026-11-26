"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "clip";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={variant} data-shown={shown ? "true" : "false"} className={className}>
      {children}
    </div>
  );
}
