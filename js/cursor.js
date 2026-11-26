const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

export function createCursor() {
  const root = document.getElementById("cursor");
  if (!root || !finePointer.matches) return { setHot() {}, destroy() {} };

  let visible = false;
  let hot = false;
  let panelHot = false;
  let lastTarget = null;

  function applyHot(target) {
    lastTarget = target || lastTarget;
    const fromDom = Boolean(lastTarget && lastTarget.closest("a, button, input, textarea, .hotspot"));
    hot = panelHot || fromDom;
    root.classList.toggle("is-hot", hot);
  }

  function place(x, y) {
    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
  }

  function show() {
    if (visible) return;
    visible = true;
    root.classList.add("is-on");
    document.documentElement.classList.add("has-cursor");
  }

  function hide() {
    visible = false;
    root.classList.remove("is-on");
    document.documentElement.classList.remove("has-cursor");
  }

  function onMove(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    place(event.clientX, event.clientY);
    show();
    const target = event.target instanceof Element ? event.target : null;
    applyHot(target);
  }

  function onDown() {
    root.classList.add("is-down");
  }

  function onUp() {
    root.classList.remove("is-down");
  }

  function onLeave(event) {
    if (event.relatedTarget || event.toElement) return;
    hide();
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  document.addEventListener("pointerout", onLeave);
  window.addEventListener("blur", hide);
  finePointer.addEventListener("change", () => {
    if (!finePointer.matches) hide();
  });

  return {
    setHot(next) {
      panelHot = next;
      applyHot(lastTarget);
    },
    destroy() {
      hide();
    },
  };
}
