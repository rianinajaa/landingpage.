import * as THREE from "three";
import { anchors, copyWindows, windowed } from "./phases.js";
import { projects } from "./projects.js";
import { createScroll } from "./scroll.js";
import { createCursor } from "./cursor.js";
import { createDialogs } from "./dialogs.js";
import { createScene } from "./scene.js";

const root = document.documentElement;
const stage = document.getElementById("stage");
const canvas = document.getElementById("webgl");
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderNote = document.getElementById("loader-note");
const hotspots = document.getElementById("hotspots");
const pieceLabel = document.getElementById("piece-label");
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let reduced = reducedQuery.matches;
reducedQuery.addEventListener("change", () => {
  reduced = reducedQuery.matches;
});

function hasWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

function showLoader() {
  loader.hidden = false;
}

function hideLoader() {
  loader.hidden = true;
}

function useFallback(message) {
  root.classList.remove("is-webgl", "is-loading");
  root.classList.add("is-fallback");
  hideLoader();
  if (message && loaderNote) {
    const note = document.getElementById("fallback-note");
    if (note) note.hidden = false;
  }
}

function applyCopy(progress) {
  document.querySelectorAll("[data-plate]").forEach((plate) => {
    const key = plate.getAttribute("data-plate");
    const range = copyWindows[key];
    if (!range) return;
    const opacity = windowed(progress, range[0], range[1], range[2], range[3]);
    plate.style.opacity = opacity.toFixed(3);
    const quiet = opacity < 0.04;
    plate.style.visibility = quiet ? "hidden" : "visible";
    if (quiet) plate.setAttribute("inert", "");
    else plate.removeAttribute("inert");
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const key = link.getAttribute("data-nav");
    const anchor = anchors[key];
    if (anchor === undefined) return;
    const current =
      (key === "start" && progress < 0.2) ||
      (key === "work" && progress >= 0.2 && progress < 0.52) ||
      (key === "sculpture" && progress >= 0.52 && progress < 0.86) ||
      (key === "close" && progress >= 0.86);
    if (current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function markSettled(event) {
  event.currentTarget.classList.add("is-settled");
}

document.querySelectorAll(".rise").forEach((element) => {
  element.addEventListener("animationend", markSettled);
});

const dialogs = createDialogs({ projects });
const cursor = createCursor();

const menu = dialogs.menu;
let scrollController = null;

function navigate(progress) {
  if (menu?.open) menu.close();
  const behavior = reduced ? "auto" : "smooth";
  requestAnimationFrame(() => scrollController?.toProgress(progress, behavior));
}

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const key = link.getAttribute("data-nav");
    if (!(key in anchors) || !root.classList.contains("is-webgl")) return;
    event.preventDefault();
    navigate(anchors[key]);
  });
});

document.getElementById("again")?.addEventListener("click", () => navigate(0));

const point = new THREE.Vector3();

function playIntro() {
  document.querySelectorAll(".rise").forEach((element) => {
    element.classList.remove("is-settled");
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "";
  });
}

function placeHotspots(sceneApi, progress) {
  const active = progress > 0.3 && progress < 0.5;
  hotspots.classList.toggle("is-live", active);
  if (!active) {
    pieceLabel.hidden = true;
    return;
  }
  const buttons = hotspots.querySelectorAll(".hotspot");
  buttons.forEach((button, index) => {
    const visible = sceneApi.projectPanel(index, point);
    button.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
    button.classList.toggle("is-hidden", !visible);
  });
}

function buildHotspots() {
  projects.forEach((project) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.textContent = project.title;
    button.setAttribute("aria-label", `Open ${project.title}`);
    button.addEventListener("click", () => dialogs.openProject(project.slug, button));
    button.addEventListener("pointerenter", () => {
      pieceLabel.hidden = false;
      pieceLabel.textContent = `${project.title} — ${project.kicker}`;
    });
    hotspots.appendChild(button);
  });
  hotspots.addEventListener("pointerleave", () => {
    pieceLabel.hidden = true;
  });
}

async function boot() {
  if (!hasWebGL()) {
    useFallback(true);
    return;
  }

  showLoader();
  root.classList.add("is-webgl", "is-loading");
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  buildHotspots();

  let sceneApi;
  try {
    sceneApi = await createScene(canvas, {
      projects,
      onProgress(value) {
        if (loaderBar) loaderBar.style.transform = `scaleX(${Math.max(0.05, value)})`;
      },
    });
  } catch (error) {
    console.error(error);
    useFallback(true);
    return;
  }

  applyCopy(0);
  playIntro();
  root.classList.remove("is-loading");
  hideLoader();
  let target = 0;
  let smooth = 0;
  let pointerX = 0;
  let pointerY = 0;
  let hover = -1;
  let last = performance.now();
  let running = false;

  const onPointer = (event) => {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    pointerX = (event.clientX / width) * 2 - 1;
    pointerY = (event.clientY / height) * 2 - 1;
    if (!sceneApi) return;
    const next = sceneApi.pick(event.clientX, event.clientY);
    if (next !== hover) {
      hover = next;
      sceneApi.setHover(hover);
      cursor.setHot(hover >= 0);
      root.classList.toggle("is-panel", hover >= 0);
      if (hover >= 0) {
        pieceLabel.hidden = false;
        const project = projects[hover];
        pieceLabel.textContent = `${project.title} — ${project.kicker}`;
      }
    }
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  canvas.addEventListener("click", (event) => {
    const index = sceneApi.pick(event.clientX, event.clientY);
    if (index < 0) return;
    const trigger = hotspots.querySelectorAll(".hotspot")[index];
    dialogs.openProject(projects[index].slug, trigger || canvas);
  });

  scrollController = createScroll(stage, (progress) => {
    target = progress;
  });

  const frame = (now) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const follow = reduced ? 1 : 1 - Math.exp(-7 * dt);
    smooth += (target - smooth) * follow;
    if (Math.abs(target - smooth) < 0.0004) smooth = target;
    sceneApi.update({
      progress: smooth,
      pointerX,
      pointerY,
      dt,
      reduced,
    });
    sceneApi.render();
    applyCopy(smooth);
    placeHotspots(sceneApi, smooth);
    if (smooth < 0.3 || smooth > 0.5) pieceLabel.hidden = true;
    requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  window.addEventListener("resize", () => sceneApi.resize());
  start();
}

boot();
