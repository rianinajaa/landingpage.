import type { CSSProperties } from "react";

export function revealDelay(seconds: number): CSSProperties {
  return { ["--reveal-delay" as string]: `${seconds}s` };
}
