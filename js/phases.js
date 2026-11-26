export function clamp01(value) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function segment(progress, start, end) {
  if (end === start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

export function windowed(progress, inStart, inEnd, outStart, outEnd) {
  return segment(progress, inStart, inEnd) * (1 - segment(progress, outStart, outEnd));
}

export function smoothstep(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export const copyWindows = {
  hero: [-0.2, 0, 0.1, 0.2],
  edges: [-0.2, 0, 0.12, 0.24],
  hint: [-0.2, 0, 0.06, 0.16],
  work: [0.24, 0.33, 0.46, 0.56],
  belief: [0.58, 0.66, 0.72, 0.78],
  fracture: [0.79, 0.84, 0.88, 0.93],
  close: [0.93, 0.99, 1.2, 1.4],
};

export const anchors = {
  start: 0,
  work: 0.38,
  sculpture: 0.66,
  close: 0.97,
};

export const motion = {
  triangleTumble: [0.08, 0.48],
  triangleFade: [0.5, 0.64],
  orbitsFade: [0.1, 0.28],
  panelsIn: [0.15, 0.36],
  panelsOut: [0.48, 0.63],
  bustIn: [0.52, 0.66],
  fracture: [0.72, 0.9],
  bustOut: [0.86, 0.96],
  closeIn: [0.92, 1],
};
