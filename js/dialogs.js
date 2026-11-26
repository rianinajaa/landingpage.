let locks = 0;
let restoreFocus = null;

const stage = () => document.getElementById("stage");
const header = () => document.querySelector(".header");
const scrim = () => document.getElementById("scrim");

function lockScroll() {
  locks += 1;
  document.documentElement.classList.add("is-locked");
}

function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.documentElement.classList.remove("is-locked");
}

function setPageInert(inert) {
  if (inert) {
    stage()?.setAttribute("inert", "");
    header()?.setAttribute("inert", "");
    if (scrim()) scrim().hidden = false;
  } else if (locks === 0) {
    stage()?.removeAttribute("inert");
    header()?.removeAttribute("inert");
    if (scrim()) scrim().hidden = true;
  }
}

function focusables(dialog) {
  return [...dialog.querySelectorAll("a, button, input, textarea")].filter(
    (element) => !element.disabled && element.tabIndex !== -1,
  );
}

function bindDialog(dialog) {
  dialog.addEventListener("close", () => {
    unlockScroll();
    setPageInert(false);
    const back = restoreFocus;
    restoreFocus = null;
    if (back && typeof back.focus === "function") back.focus();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusables(dialog);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });
}

function openDialog(dialog, trigger, focusSelector) {
  if (dialog.open) return;
  restoreFocus = trigger || document.activeElement;
  if (trigger?.setAttribute) trigger.setAttribute("aria-expanded", "true");
  dialog.addEventListener(
    "close",
    () => trigger?.setAttribute?.("aria-expanded", "false"),
    { once: true },
  );
  lockScroll();
  setPageInert(true);
  dialog.show();
  const focusTarget = dialog.querySelector(focusSelector) || focusables(dialog)[0];
  focusTarget?.focus();
}

export function createDialogs({ projects }) {
  const menu = document.getElementById("nav-dialog");
  const talk = document.getElementById("talk-dialog");
  const projectDialog = document.getElementById("project-dialog");
  const menuButton = document.getElementById("menu-open");

  [menu, talk, projectDialog].forEach(bindDialog);

  scrim()?.addEventListener("click", () => {
    document.querySelector("dialog[open]")?.close();
  });

  menuButton?.addEventListener("click", () => {
    openDialog(menu, menuButton, "[data-nav]");
  });

  document.querySelectorAll("[data-talk]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (menu.open) menu.close();
      openDialog(talk, link, "input");
    });
  });

  talk.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const note = String(data.get("note") || "").trim();
    const body = [`Name: ${name}`, `Email: ${email}`, "", note].join("\n");
    window.location.href = `mailto:hello@forma.studio?subject=${encodeURIComponent("Let's talk possibilities")}&body=${encodeURIComponent(body)}`;
  });

  const image = projectDialog.querySelector("img");
  const fields = Object.fromEntries(
    [...projectDialog.querySelectorAll("[data-field]")].map((node) => [node.getAttribute("data-field"), node]),
  );

  function openProject(slug, trigger) {
    const project = projects.find((item) => item.slug === slug);
    if (!project) return;
    image.src = new URL(`../assets/art/${project.image}`, import.meta.url).href;
    image.alt = project.alt;
    fields.kicker.textContent = project.kicker;
    fields.title.textContent = project.title;
    fields.meta.textContent = `${project.year}  ·  ${project.services}`;
    fields.summary.textContent = project.summary;
    fields.body.textContent = project.body;
    if (menu.open) menu.close();
    openDialog(projectDialog, trigger, "[data-close]");
  }

  return { openProject, menu };
}
