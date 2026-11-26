"use client";

import { useState } from "react";
import { brand } from "@/content/brand";

export function CopyEmail({ tone = "inherit" }: { tone?: "inherit" | "ink" }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(brand.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`text-link text-left ${tone === "ink" ? "text-ink" : ""}`}
    >
      {copied ? "Copied" : brand.email}
      <span className="sr-only">{copied ? " Email copied" : " Copy email address"}</span>
    </button>
  );
}
