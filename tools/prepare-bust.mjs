import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Document, NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { simplify, weld } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";

const SRC = "/tmp/bust/source.glb";
const OUT = "/workspace/assets/models/head.glb";
const META = "/workspace/assets/models/head-meta.json";

const EPS = 2.5e-5;
const WELD = 1.2e-4;

function mul(a, b) {
  const r = new Array(16);
  for (let c = 0; c < 4; c++) {
    for (let row = 0; row < 4; row++) {
      r[c * 4 + row] =
        a[row] * b[c * 4] +
        a[4 + row] * b[c * 4 + 1] +
        a[8 + row] * b[c * 4 + 2] +
        a[12 + row] * b[c * 4 + 3];
    }
  }
  for (let i = 0; i < 16; i++) a[i] = r[i];
}

function worldMatrix(node) {
  const mats = [];
  let n = node;
  while (n) {
    mats.push(n.getMatrix());
    n = n.getParentNode();
  }
  const out = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (let i = mats.length - 1; i >= 0; i--) mul(out, mats[i]);
  return out;
}

function transformPoint(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

function normalMatrix(m) {
  const c00 = m[0], c01 = m[4], c02 = m[8];
  const c10 = m[1], c11 = m[5], c12 = m[9];
  const c20 = m[2], c21 = m[6], c22 = m[10];
  const n00 = c11 * c22 - c12 * c21;
  const n01 = c12 * c20 - c10 * c22;
  const n02 = c10 * c21 - c11 * c20;
  const n10 = c02 * c21 - c01 * c22;
  const n11 = c00 * c22 - c02 * c20;
  const n12 = c01 * c20 - c00 * c21;
  const n20 = c01 * c12 - c02 * c11;
  const n21 = c02 * c10 - c00 * c12;
  const n22 = c00 * c11 - c01 * c10;
  return [n00, n01, n02, n10, n11, n12, n20, n21, n22];
}

function transformNormal(nm, x, y, z) {
  const nx = nm[0] * x + nm[1] * y + nm[2] * z;
  const ny = nm[3] * x + nm[4] * y + nm[5] * z;
  const nz = nm[6] * x + nm[7] * y + nm[8] * z;
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function scale(a, s) {
  return [a[0] * s, a[1] * s, a[2] * s];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function normalize(a) {
  const len = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / len, a[1] / len, a[2] / len];
}
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function lerp2(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function planeOf(normal, point) {
  const n = normalize(normal);
  return { n, d: -dot(n, point) };
}
function signed(plane, p) {
  return dot(plane.n, p) + plane.d;
}

function resizeTexture(texture, size, quality) {
  const image = texture.getImage();
  const mime = texture.getMimeType() || "image/jpeg";
  const ext = mime.includes("png") ? "png" : "jpg";
  const inPath = `/tmp/bust/tex-in.${ext}`;
  const outPath = `/tmp/bust/tex-out.jpg`;
  fs.writeFileSync(inPath, Buffer.from(image));
  const py = `
from PIL import Image
im = Image.open("${inPath}")
im = im.convert("RGB")
im.thumbnail((${size}, ${size}), Image.Resampling.LANCZOS)
im.save("${outPath}", "JPEG", quality=${quality}, optimize=True)
print(im.size)
`;
  const res = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (res.status !== 0) throw new Error(res.stderr || "texture resize failed");
  const bytes = fs.readFileSync(outPath);
  texture.setImage(bytes);
  texture.setMimeType("image/jpeg");
  console.log("texture", texture.getName(), res.stdout.trim(), "bytes", bytes.length);
}

function polygonToTris(poly) {
  const tris = [];
  if (poly.length < 3) return tris;
  if (poly.length === 3) {
    tris.push(poly);
    return tris;
  }
  for (let i = 1; i < poly.length - 1; i++) tris.push([poly[0], poly[i], poly[i + 1]]);
  return tris;
}

function clipFront(poly) {
  const output = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const aIn = a.d >= -EPS;
    const bIn = b.d >= -EPS;
    if (aIn && bIn) {
      output.push(b);
    } else if (aIn && !bIn) {
      const t = a.d / (a.d - b.d);
      output.push({
        p: lerp(a.p, b.p, t),
        n: normalize(lerp(a.n, b.n, t)),
        uv: lerp2(a.uv, b.uv, t),
        d: 0,
        cut: true,
        mat: a.mat,
      });
    } else if (!aIn && bIn) {
      const t = a.d / (a.d - b.d);
      output.push({
        p: lerp(a.p, b.p, t),
        n: normalize(lerp(a.n, b.n, t)),
        uv: lerp2(a.uv, b.uv, t),
        d: 0,
        cut: true,
        mat: b.mat,
      });
      output.push(b);
    }
  }
  return output;
}

function splitTris(tris, plane) {
  const front = [];
  const back = [];
  const segments = [];
  for (const tri of tris) {
    const poly = tri.map((v) => ({ ...v, d: signed(plane, v.p) }));
    const pos = [];
    const neg = [];
    for (const v of poly) {
      if (v.d >= -EPS) pos.push(v);
      if (v.d <= EPS) neg.push(v);
    }
    if (pos.length === 3 && neg.length === 3) {
      front.push(tri);
      continue;
    }
    const frontPoly = clipFront(poly);
    const backPoly = clipFront(poly.map((v) => ({ ...v, d: -v.d }))).map((v) => ({ ...v, d: -v.d }));
    const frontTris = polygonToTris(frontPoly);
    const backTris = polygonToTris(backPoly);
    for (const t of frontTris) front.push(t.map(({ p, n, uv, mat }) => ({ p, n, uv, mat })));
    for (const t of backTris) back.push(t.map(({ p, n, uv, mat }) => ({ p, n, uv, mat })));
    const cuts = [];
    for (const v of frontPoly) if (v.cut) cuts.push(v.p);
    if (cuts.length >= 2) {
      segments.push([cuts[0], cuts[cuts.length - 1]]);
    }
  }
  return { front, back, segments };
}

function convexHull(points2) {
  const pts = points2.slice().sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  if (pts.length < 3) return pts;
  const cross2 = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const build = (source) => {
    const hull = [];
    for (const pt of source) {
      while (hull.length >= 2 && cross2(hull[hull.length - 2], hull[hull.length - 1], pt) <= 0) hull.pop();
      hull.push(pt);
    }
    return hull;
  };
  const lower = build(pts);
  const upper = build(pts.slice().reverse());
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function capTriangles(segments, plane, facing) {
  if (segments.length < 3) return [];
  const unique = [];
  const seen = new Map();
  for (const [a, b] of segments) {
    for (const p of [a, b]) {
      const key = `${Math.round(p[0] / WELD)}:${Math.round(p[1] / WELD)}:${Math.round(p[2] / WELD)}`;
      if (seen.has(key)) continue;
      seen.set(key, true);
      unique.push(p);
    }
  }
  if (unique.length < 3) return [];
  const desired = normalize(scale(plane.n, facing));
  const ref = Math.abs(plane.n[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  const tangent = normalize(cross(ref, plane.n));
  const bitangent = cross(plane.n, tangent);
  const flat = unique.map((p) => ({ x: dot(p, tangent), y: dot(p, bitangent), p }));
  const hull = convexHull(flat);
  if (hull.length < 3) return [];
  const tris = [];
  const make = (p) => ({ p, n: desired, uv: [0, 0], mat: -1 });
  for (let i = 1; i < hull.length - 1; i++) {
    let a = hull[0].p;
    let b = hull[i].p;
    let c = hull[i + 1].p;
    const area = Math.hypot(...cross(sub(b, a), sub(c, a)));
    if (area < 1e-6) continue;
    const nrm = normalize(cross(sub(b, a), sub(c, a)));
    if (dot(nrm, desired) < 0) {
      const tmp = b;
      b = c;
      c = tmp;
    }
    tris.push([make(a), make(b), make(c)]);
  }
  return tris;
}

function triCount(tris) {
  return tris.length;
}

function centroidOf(tris) {
  let x = 0, y = 0, z = 0, c = 0;
  const step = Math.max(1, Math.floor(tris.length / 400));
  for (let i = 0; i < tris.length; i += step) {
    for (const v of tris[i]) {
      if (v.mat < 0) continue;
      x += v.p[0];
      y += v.p[1];
      z += v.p[2];
      c++;
    }
  }
  if (!c) return [0, 0, 0];
  return [x / c, y / c, z / c];
}

function packPrimitive(doc, buffer, tris, matId, material) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const map = new Map();
  const useUv = matId >= 0;
  function keyOf(v) {
    const p = v.p;
    const n = v.n;
    const u = v.uv;
    return [
      Math.round(p[0] / WELD),
      Math.round(p[1] / WELD),
      Math.round(p[2] / WELD),
      Math.round(n[0] * 200),
      Math.round(n[1] * 200),
      Math.round(n[2] * 200),
      useUv ? Math.round(u[0] * 4000) : 0,
      useUv ? Math.round(u[1] * 4000) : 0,
    ].join(",");
  }
  function add(v) {
    const k = keyOf(v);
    if (map.has(k)) return map.get(k);
    const id = positions.length / 3;
    positions.push(v.p[0], v.p[1], v.p[2]);
    normals.push(v.n[0], v.n[1], v.n[2]);
    uvs.push(v.uv[0], v.uv[1]);
    map.set(k, id);
    return id;
  }
  for (const tri of tris) {
    if (tri[0].mat !== matId) continue;
    const ids = tri.map(add);
    if (ids[0] === ids[1] || ids[1] === ids[2] || ids[0] === ids[2]) continue;
    indices.push(ids[0], ids[1], ids[2]);
  }
  if (!indices.length) return null;
  const prim = doc.createPrimitive();
  prim.setAttribute(
    "POSITION",
    doc.createAccessor().setType("VEC3").setArray(new Float32Array(positions)).setBuffer(buffer),
  );
  prim.setAttribute(
    "NORMAL",
    doc.createAccessor().setType("VEC3").setArray(new Float32Array(normals)).setBuffer(buffer),
  );
  if (useUv) {
    prim.setAttribute(
      "TEXCOORD_0",
      doc.createAccessor().setType("VEC2").setArray(new Float32Array(uvs)).setBuffer(buffer),
    );
  }
  const IndexArray = positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
  prim.setIndices(
    doc.createAccessor().setType("SCALAR").setArray(new IndexArray(indices)).setBuffer(buffer),
  );
  prim.setMaterial(material);
  return prim;
}

async function main() {
  const io = new NodeIO()
    .registerExtensions([KHRDracoMeshCompression])
    .registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule() });
  const src = await io.read(SRC);
  await src.transform(
    weld({ tolerance: 0.00001 }),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.34, error: 0.006, lockBorder: true }),
  );

  const baked = [];
  let vertTotal = 0;
  let triTotal = 0;
  for (const node of src.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    const m = worldMatrix(node);
    const nm = normalMatrix(m);
    node.getMesh().listPrimitives().forEach((prim, matSlot) => {
      const pa = prim.getAttribute("POSITION").getArray();
      const na = prim.getAttribute("NORMAL").getArray();
      const ua = prim.getAttribute("TEXCOORD_0").getArray();
      const ia = prim.getIndices().getArray();
      vertTotal += pa.length / 3;
      triTotal += ia.length / 3;
      const tris = [];
      for (let i = 0; i < ia.length; i += 3) {
        const tri = [];
        for (let k = 0; k < 3; k++) {
          const id = ia[i + k];
          tri.push({
            p: transformPoint(m, pa[id * 3], pa[id * 3 + 1], pa[id * 3 + 2]),
            n: transformNormal(nm, na[id * 3], na[id * 3 + 1], na[id * 3 + 2]),
            uv: [ua[id * 2], ua[id * 2 + 1]],
            mat: matSlot,
          });
        }
        tris.push(tri);
      }
      baked.push({ matSlot, tris });
      const tex = prim.getMaterial()?.getBaseColorTexture();
      const ntex = prim.getMaterial()?.getNormalTexture();
      console.log("prim", matSlot, "tris", ia.length / 3, "color", tex?.getSize(), "normal", ntex?.getSize());
    });
  }
  console.log("after simplify verts", vertTotal, "tris", triTotal);

  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const part of baked) {
    for (const tri of part.tris) {
      for (const v of tri) {
        for (let k = 0; k < 3; k++) {
          min[k] = Math.min(min[k], v.p[k]);
          max[k] = Math.max(max[k], v.p[k]);
        }
      }
    }
  }
  const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const height = max[1] - min[1];
  const fit = 2.25 / height;
  // Shift the face (not the helmet tip) toward the origin: beard and cap are long,
  // so a slight upward bias keeps the eyes near the middle of the frame.
  center[1] -= height * 0.04;
  for (const part of baked) {
    for (const tri of part.tris) {
      for (const v of tri) {
        v.p = [(v.p[0] - center[0]) * fit, (v.p[1] - center[1]) * fit, (v.p[2] - center[2]) * fit];
      }
    }
  }
  console.log("baked bbox before fit", min, max, "scale", fit);

  let soup = baked.flatMap((p) => p.tris);
  // Three cuts only: helmet, beard, and the back of the skull.
  // The face stays one readable mass instead of shattering into slivers.
  const planes = [
    planeOf([0.04, 1, 0], [0, 0.58, 0.02]),
    planeOf([0, 1, 0.08], [0, -0.46, 0.12]),
    planeOf([0.06, 0.04, 1], [0, 0.02, -0.2]),
  ];

  let fragments = [{ tris: soup }];
  for (const plane of planes) {
    const next = [];
    let segTotal = 0;
    for (const frag of fragments) {
      const { front, back, segments } = splitTris(frag.tris, plane);
      segTotal += segments.length;
      const outer = (list) => list.reduce((n, t) => n + (t[0].mat >= 0 ? 1 : 0), 0);
      const fo = outer(front);
      const bo = outer(back);
      const total = Math.max(1, outer(frag.tris));
      if (fo < total * 0.16 || bo < total * 0.16 || fo < 180 || bo < 180) {
        next.push(frag);
        continue;
      }
      const caps = capTriangles(segments, plane, -1);
      const capsBack = capTriangles(segments, plane, 1);
      front.push(...caps);
      back.push(...capsBack);
      next.push({ tris: front }, { tris: back });
    }
    fragments = next;
    console.log(
      "fragments",
      fragments.length,
      "tris",
      fragments.reduce((s, f) => s + f.tris.length, 0),
      "segments",
      segTotal,
      "caps",
      fragments.reduce((s, f) => s + f.tris.filter((t) => t[0].mat < 0).length, 0),
    );
  }

  fragments.sort((a, b) => triCount(b.tris) - triCount(a.tris));
  const meta = fragments.map((frag, index) => {
    const c = centroidOf(frag.tris);
    const dir = normalize(add(c, [0, 0.04, 0]));
    const outerTris = frag.tris.filter((t) => t[0].mat >= 0).length;
    const capTris = frag.tris.length - outerTris;
    return {
      index,
      centroid: c.map((v) => +v.toFixed(4)),
      direction: dir.map((v) => +v.toFixed(4)),
      outerTris,
      capTris,
    };
  });
  console.table(meta.map((m) => ({ i: m.index, outer: m.outerTris, cap: m.capTris, y: m.centroid[1] })));

  const out = new Document();
  const buffer = out.createBuffer("geometry");
  const scene = out.createScene("head");
  out.getRoot().setDefaultScene(scene);

  const materials = [];
  const srcMats = [];
  for (const node of src.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    for (const prim of node.getMesh().listPrimitives()) srcMats.push(prim.getMaterial());
  }
  for (let i = 0; i < srcMats.length; i++) {
    const sm = srcMats[i];
    const mat = out.createMaterial(`stone_${i}`);
    mat.setMetallicFactor(0);
    mat.setRoughnessFactor(sm.getRoughnessFactor() || 0.62);
    mat.setDoubleSided(false);
    const color = sm.getBaseColorTexture();
    const normal = sm.getNormalTexture();
    if (color) {
      resizeTexture(color, 2048, 84);
      const tex = out.createTexture(`color_${i}`);
      tex.setImage(color.getImage());
      tex.setMimeType("image/jpeg");
      mat.setBaseColorTexture(tex);
    }
    if (normal) {
      resizeTexture(normal, 2048, 82);
      const tex = out.createTexture(`normal_${i}`);
      tex.setImage(normal.getImage());
      tex.setMimeType("image/jpeg");
      mat.setNormalTexture(tex);
    }
    materials.push(mat);
  }
  const interior = out.createMaterial("interior");
  interior.setMetallicFactor(0);
  interior.setRoughnessFactor(0.92);
  interior.setBaseColorFactor([0.62, 0.58, 0.52, 1]);
  interior.setDoubleSided(false);

  let outerVerts = 0;
  let outerTris = 0;
  fragments.forEach((frag, index) => {
    const mesh = out.createMesh(`frag_${index}`);
    for (let matId = 0; matId < materials.length; matId++) {
      const prim = packPrimitive(out, buffer, frag.tris, matId, materials[matId]);
      if (!prim) continue;
      mesh.addPrimitive(prim);
      outerVerts += prim.getAttribute("POSITION").getCount();
      outerTris += prim.getIndices().getCount() / 3;
    }
    const cap = packPrimitive(out, buffer, frag.tris, -1, interior);
    if (cap) mesh.addPrimitive(cap);
    const node = out.createNode(`frag_${index}`).setMesh(mesh);
    scene.addChild(node);
  });

  const outIo = new NodeIO();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await outIo.write(OUT, out);
  fs.writeFileSync(META, JSON.stringify({ fragments: meta, scaleNote: "height 2.25, face +Z, Y up" }, null, 2));
  const stat = fs.statSync(OUT);
  console.log("wrote", OUT, (stat.size / 1024 / 1024).toFixed(2), "MB", "outerVerts", outerVerts, "outerTris", outerTris);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
