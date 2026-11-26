"use client";

import { useState } from "react";
import type { Testimonial } from "@/content/testimonials";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  const item = items[index] ?? items[0];
  const count = items.length;

  function step(direction: number) {
    setIndex((current) => (current + direction + count) % count);
  }

  return (
    <div>
      {item.sample ? (
        <p className="font-mono text-[0.72rem] tracking-[0.16em] text-white/50 uppercase">Sample</p>
      ) : null}
      <blockquote className="mt-4 max-w-4xl text-3xl leading-tight tracking-[-0.04em] text-white sm:text-5xl">
        {item.quote}
      </blockquote>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-lg">{item.name}</p>
          <p className="text-white/60">{item.role}</p>
          <p className="mt-1 text-sm text-white/50">
            {item.source} · {item.rating} / 5
          </p>
        </div>
        {count > 1 ? (
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm tracking-[0.12em] text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <button type="button" className="grid size-11 place-items-center rounded-full border border-white/30" onClick={() => step(-1)} aria-label="Previous review">
              ←
            </button>
            <button type="button" className="grid size-11 place-items-center rounded-full border border-white/30" onClick={() => step(1)} aria-label="Next review">
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
