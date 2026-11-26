import { clamp01 } from "./phases.js";

export function createScroll(stage, onProgress) {
  let frame = 0;

  function read() {
    const start = stage.offsetTop;
    const span = Math.max(1, stage.offsetHeight - window.innerHeight);
    const progress = clamp01((window.scrollY - start) / span);
    onProgress(progress);
  }

  function requestRead() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      read();
    });
  }

  function toProgress(progress, behavior = "smooth") {
    const start = stage.offsetTop;
    const span = Math.max(1, stage.offsetHeight - window.innerHeight);
    const top = start + clamp01(progress) * span;
    window.scrollTo({ top, behavior });
  }

  window.addEventListener("scroll", requestRead, { passive: true });
  window.addEventListener("resize", requestRead);
  read();

  return { read, toProgress };
}
