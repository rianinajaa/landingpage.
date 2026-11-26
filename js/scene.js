import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clamp01, motion, segment, smoothstep } from "./phases.js";

const LAYER_STONE = 1;
const _matrix = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pivot = new THREE.Matrix4();
const _rot = new THREE.Matrix4();
const _trans = new THREE.Matrix4();
const _center = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _box = new THREE.Box3();
const _dummy = new THREE.Object3D();
const _ray = new THREE.Vector2();

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function triangleGeometry() {
  const shape = new THREE.Shape();
  const outer = 1.22;
  const inner = 0.74;
  const point = (radius, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / 3;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  };
  const [x0, y0] = point(outer, 0);
  shape.moveTo(x0, y0);
  for (let i = 1; i < 3; i += 1) {
    const [x, y] = point(outer, i);
    shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  const [hx, hy] = point(inner, 0);
  hole.moveTo(hx, hy);
  for (let i = 2; i >= 1; i -= 1) {
    const [x, y] = point(inner, i);
    hole.lineTo(x, y);
  }
  hole.closePath();
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 3,
    curveSegments: 1,
    steps: 1,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function radialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(256, 256, 16, 256, 256, 250);
  gradient.addColorStop(0, "rgba(214, 222, 230, 0.55)");
  gradient.addColorStop(0.28, "rgba(180, 190, 204, 0.16)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeOrbit(rx, ry, tilt, opacity, dotCount, dotGeometry, dotMaterial) {
  const group = new THREE.Group();
  group.rotation.x = tilt;
  const curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(140).map((point) => new THREE.Vector3(point.x, point.y, 0));
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xd7d8d4, transparent: true, opacity, depthWrite: false }),
  );
  group.add(line);
  const dots = [];
  for (let i = 0; i < dotCount; i += 1) {
    const mesh = new THREE.Mesh(dotGeometry, dotMaterial);
    mesh.userData.angle = (i / dotCount) * Math.PI * 2 + tilt;
    mesh.userData.rx = rx;
    mesh.userData.ry = ry;
    group.add(mesh);
    dots.push(mesh);
  }
  group.userData.dots = dots;
  group.userData.line = line;
  group.userData.baseOpacity = opacity;
  return group;
}

function studioEnvironment(renderer) {
  const room = new THREE.Scene();
  const makePanel = (color, intensity, width, height, x, y, z, rx, ry) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, 0);
    room.add(mesh);
  };
  makePanel(0x101216, 0.35, 18, 14, 0, 0, -5, 0, 0);
  makePanel(0xf3efe6, 6.5, 5.5, 2.4, -3.6, 3.6, 1.4, -0.5, 0.55);
  makePanel(0xc5d4e6, 4.2, 1.6, 5.2, 4.4, 1.2, -1.2, 0.1, -0.9);
  makePanel(0x3a342e, 0.8, 8, 3, 0, -3.2, 1.5, 1.15, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(room, 0);
  pmrem.dispose();
  room.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) object.material.dispose();
  });
  return target.texture;
}

function fragmentCenter(root) {
  _box.makeEmpty();
  root.traverse((child) => {
    if (!child.isMesh || child.material?.name === "interior") return;
    const geometry = child.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    _box.union(geometry.boundingBox);
  });
  return _box.getCenter(new THREE.Vector3());
}

export async function createScene(canvas, { projects, onProgress }) {
  const narrow = () => window.innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x191b1e, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow() ? 1.35 : 1.7));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.08, 60);
  camera.position.set(0, 0.06, 6.45);
  camera.layers.enable(LAYER_STONE);

  scene.environment = studioEnvironment(renderer);

  const key = new THREE.DirectionalLight(0xf4f1ea, 1.35);
  key.position.set(-3.4, 4.2, 4.6);
  const rim = new THREE.DirectionalLight(0xb9c7d8, 0.85);
  rim.position.set(4.2, 1.8, -2.6);
  const fill = new THREE.AmbientLight(0x2a2e34, 0.55);
  scene.add(key, rim, fill);

  const bustKey = new THREE.DirectionalLight(0xfff7f0, 3.15);
  bustKey.position.set(-2.4, 3.6, 4.8);
  bustKey.layers.set(LAYER_STONE);
  const bustRim = new THREE.DirectionalLight(0xd5e2f2, 2.45);
  bustRim.position.set(3.6, 1.6, -3.2);
  bustRim.layers.set(LAYER_STONE);
  const bustFill = new THREE.DirectionalLight(0x9aa3ae, 0.38);
  bustFill.position.set(0, -2.2, 3.4);
  bustFill.layers.set(LAYER_STONE);
  scene.add(bustKey, bustRim, bustFill);

  const world = new THREE.Group();
  scene.add(world);

  const hero = new THREE.Group();
  world.add(hero);

  const metal = new THREE.MeshPhysicalMaterial({
    color: 0x23262b,
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.12,
    clearcoat: 0.18,
    clearcoatRoughness: 0.45,
  });
  const triangle = new THREE.Mesh(triangleGeometry(), metal);
  triangle.rotation.x = 0.22;
  hero.add(triangle);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.42,
    }),
  );
  halo.scale.set(5.4, 5.4, 1);
  halo.position.z = -0.85;
  hero.add(halo);

  const dotGeometry = new THREE.SphereGeometry(0.032, 12, 8);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xf4f5f2, transparent: true, opacity: 0.85, depthWrite: false });
  const orbitA = makeOrbit(2.15, 1.28, 1.15, 0.28, 3, dotGeometry, dotMaterial);
  const orbitB = makeOrbit(2.65, 1.62, 0.72, 0.16, 2, dotGeometry, dotMaterial);
  orbitB.rotation.z = 0.4;
  hero.add(orbitA, orbitB);
  const orbits = [orbitA, orbitB];

  const panelsGroup = new THREE.Group();
  world.add(panelsGroup);
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const textureLoader = new THREE.TextureLoader();
  const panels = [];
  const panelGeometry = new THREE.PlaneGeometry(2.16, 1.425);
  const frameGeometry = new THREE.PlaneGeometry(2.24, 1.505);

  await Promise.all(
    projects.map(
      (project, index) =>
        new Promise((resolve, reject) => {
          const url = new URL(`../assets/art/${project.image}`, import.meta.url).href;
          textureLoader.load(
            url,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = anisotropy;
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.magFilter = THREE.LinearFilter;
              const group = new THREE.Group();
              const frame = new THREE.Mesh(
                frameGeometry,
                new THREE.MeshStandardMaterial({
                  color: 0x101114,
                  roughness: 0.55,
                  metalness: 0.18,
                  transparent: true,
                }),
              );
              frame.position.z = -0.03;
              const face = new THREE.Mesh(
                panelGeometry,
                new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
              );
              face.userData.index = index;
              group.add(frame, face);
              panelsGroup.add(group);
              panels[index] = {
                group,
                face,
                frame,
                index,
                baseX: 0,
                baseY: 0,
                baseZ: 0,
                baseRot: 0,
                baseScale: 1,
                scaleNow: 1,
                pull: 0,
              };
              resolve();
            },
            undefined,
            reject,
          );
        }),
    ),
  );

  onProgress?.(0.35);

  const head = new THREE.Group();
  head.layers.set(LAYER_STONE);
  world.add(head);
  const loader = new GLTFLoader();
  const modelUrl = new URL("../assets/models/head.glb", import.meta.url).href;
  const gltf = await new Promise((resolve, reject) => {
    loader.load(modelUrl, resolve, (event) => {
      if (event.total) onProgress?.(0.35 + 0.6 * (event.loaded / event.total));
    }, reject);
  });

  const fragments = [];
  let interiorMaterial = null;
  gltf.scene.traverse((child) => {
    child.layers.set(LAYER_STONE);
    if (!child.isMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      material.side = THREE.FrontSide;
      if (material.name === "interior") {
        material.transparent = true;
        material.opacity = 0;
        material.depthWrite = false;
        material.polygonOffset = true;
        material.polygonOffsetFactor = 1;
        material.polygonOffsetUnits = 1;
        material.color.set(0x4a433c);
        material.roughness = 1;
        material.metalness = 0;
        material.envMapIntensity = 0.04;
        interiorMaterial = material;
      } else {
        material.roughness = 0.68;
        material.metalness = 0;
        material.envMapIntensity = 0.32;
        if (material.normalMap) material.normalScale?.set(0.65, 0.65);
        const maps = [material.map, material.normalMap];
        maps.forEach((texture) => {
          if (!texture) return;
          texture.anisotropy = anisotropy;
        });
      }
    });
  });

  gltf.scene.children.forEach((node, index) => {
    const center = fragmentCenter(node);
    const direction = center.clone();
    if (direction.lengthSq() < 0.04) direction.set(0, 1, 0);
    direction.normalize();
    const axis = new THREE.Vector3(-direction.y, direction.x, 0.35).normalize();
    node.matrixAutoUpdate = false;
    fragments.push({
      node,
      center,
      direction,
      axis,
      distance: 1.85 + (index % 3) * 0.34,
      spin: 0.35 + (index % 4) * 0.18,
      delay: index * 0.035,
    });
  });
  head.add(gltf.scene);

  const random = seeded(26);
  const chipCount = 16;
  const chipMesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.05, 0),
    new THREE.MeshStandardMaterial({ color: 0xcfc6b8, roughness: 0.8, metalness: 0.02 }),
    chipCount,
  );
  chipMesh.layers.set(LAYER_STONE);
  chipMesh.frustumCulled = false;
  chipMesh.visible = false;
  const chips = [];
  for (let i = 0; i < chipCount; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 0.72 + random() * 0.55;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi) * 0.85,
      Math.sin(phi) * Math.sin(theta),
    ).normalize();
    chips.push({
      origin: dir.clone().multiplyScalar(radius),
      dir,
      axis: new THREE.Vector3(random(), random(), random()).normalize(),
      spin: 0.8 + random() * 1.4,
      delay: random() * 0.18,
      scale: 0.45 + random() * 1.15,
    });
  }
  head.add(chipMesh);

  const closeGroup = new THREE.Group();
  world.add(closeGroup);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 0),
    metal.clone(),
  );
  core.material.color.set(0x2a2e33);
  core.material.roughness = 0.24;
  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8e949c,
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1,
    transparent: true,
  });
  const rings = [
    new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.011, 12, 96), ringMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.008, 10, 120), ringMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.006, 8, 140), ringMaterial),
  ];
  rings[0].rotation.x = 1.15;
  rings[1].rotation.x = 0.45;
  rings[1].rotation.z = 0.7;
  rings[2].rotation.y = 0.4;
  rings[2].rotation.x = 1.7;
  closeGroup.add(core, ...rings);
  closeGroup.visible = false;

  const clock = { time: 0 };
  let hoverIndex = -1;

  function layout() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const small = width < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.35 : 1.7));
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.fov = small ? 40 : 32;
    camera.position.z = small ? 7.55 : 6.45;
    camera.updateProjectionMatrix();

    const arc = small ? 0.98 : 1.32;
    const radius = small ? 3.55 : 5.2;
    panels.forEach((panel, index) => {
      const t = panels.length === 1 ? 0 : index / (panels.length - 1) - 0.5;
      const angle = t * arc;
      panel.baseX = Math.sin(angle) * radius;
      panel.baseY = small ? -0.08 : -0.02;
      panel.baseZ = -0.72 - (1 - Math.cos(angle)) * (small ? 0.85 : 1.55);
      panel.baseRot = angle * 0.9;
      panel.baseScale = small ? 0.58 : 1;
    });
    hero.scale.setScalar(small ? 0.72 : 1);
    head.scale.setScalar(small ? 0.86 : 1.16);
    closeGroup.scale.setScalar(small ? 0.72 : 1);
    chipMesh.count = small ? 8 : chipCount;
  }

  function setGroupOpacity(object, value) {
    object.traverse((child) => {
      const material = child.material;
      if (!material || !material.transparent) return;
      material.opacity = value;
    });
  }

  function update(state) {
    const { progress, pointerX, pointerY, dt, reduced } = state;
    clock.time += dt;
    const small = narrow();

    const parallax = reduced ? 0 : 1 - segment(progress, 0.04, 0.3);
    world.rotation.y = pointerX * 0.07 * parallax;
    world.rotation.x = pointerY * -0.045 * parallax;

    const tumble = smoothstep(segment(progress, motion.triangleTumble[0], motion.triangleTumble[1]));
    const triFade = 1 - smoothstep(segment(progress, motion.triangleFade[0], motion.triangleFade[1]));
    triangle.rotation.x = 0.24 + tumble * 1.05 + pointerY * 0.05 * parallax;
    triangle.rotation.y = 0.16 + tumble * Math.PI * 0.95 + pointerX * 0.08 * parallax;
    triangle.rotation.z = tumble * 0.22;
    triangle.visible = triFade > 0.02;
    metal.opacity = triFade;
    metal.transparent = triFade < 0.995;
    metal.depthWrite = triFade > 0.4;

    const orbitFade = triFade * (1 - smoothstep(segment(progress, motion.orbitsFade[0], motion.orbitsFade[1])));
    halo.material.opacity = 0.4 * orbitFade;
    halo.visible = orbitFade > 0.02;
    orbits.forEach((orbit) => {
      orbit.visible = orbitFade > 0.02;
      orbit.userData.line.material.opacity = orbit.userData.baseOpacity * orbitFade;
      orbit.userData.dots.forEach((dot) => {
        const angle = dot.userData.angle;
        dot.position.set(Math.cos(angle) * dot.userData.rx, Math.sin(angle) * dot.userData.ry, 0);
      });
    });
    dotMaterial.opacity = 0.9 * orbitFade;

    const rise = smoothstep(segment(progress, motion.panelsIn[0], motion.panelsIn[1]));
    const leave = smoothstep(segment(progress, motion.panelsOut[0], motion.panelsOut[1]));
    const panelsLive = rise > 0.01 && leave < 0.995;
    panelsGroup.visible = panelsLive;
    panels.forEach((panel) => {
      const hovered = panel.index === hoverIndex && rise > 0.8 && leave < 0.15;
      const follow = 1 - Math.exp(-10 * dt);
      panel.scaleNow += ((hovered ? 1.045 : 1) - panel.scaleNow) * (reduced ? 1 : follow);
      panel.pull += ((hovered ? 0.24 : 0) - panel.pull) * (reduced ? 1 : follow);
      panel.group.position.set(
        panel.baseX * (1 + leave * 1.7),
        panel.baseY + (1 - rise) * (small ? -2.4 : -3.15) - leave * 0.35,
        panel.baseZ - leave * 1.7 + panel.pull,
      );
      panel.group.rotation.set(0, panel.baseRot, 0);
      panel.group.scale.setScalar(panel.baseScale * panel.scaleNow);
      const opacity = rise * (1 - leave);
      panel.face.material.opacity = opacity;
      panel.frame.material.opacity = opacity;
    });

    const bustIn = smoothstep(segment(progress, motion.bustIn[0], motion.bustIn[1]));
    const fracture = smoothstep(segment(progress, motion.fracture[0], motion.fracture[1]));
    const bustOut = smoothstep(segment(progress, motion.bustOut[0], motion.bustOut[1]));
    head.visible = bustIn > 0.01 && bustOut < 0.995;
    head.position.y = -2.7 * (1 - bustIn) - 0.02;
    head.rotation.y = -0.18 + pointerX * 0.06 * (reduced ? 0 : 1 - bustOut);

    fragments.forEach((fragment) => {
      const local = clamp01((fracture - fragment.delay) / 0.78);
      const open = local + bustOut * 0.9;
      _offset.copy(fragment.direction).multiplyScalar(open * fragment.distance);
      _quat.setFromAxisAngle(fragment.axis, open * fragment.spin);
      _pivot.makeTranslation(-fragment.center.x, -fragment.center.y, -fragment.center.z);
      _rot.makeRotationFromQuaternion(_quat);
      _center.copy(fragment.center).add(_offset);
      _trans.makeTranslation(_center.x, _center.y, _center.z);
      fragment.node.matrix.copy(_trans).multiply(_rot).multiply(_pivot);
    });

    if (interiorMaterial) {
      const cap = clamp01(fracture * 5);
      interiorMaterial.opacity = cap * (1 - bustOut);
      interiorMaterial.depthWrite = cap > 0.85 && bustOut < 0.2;
    }

    const chipShow = fracture > 0.04 && bustOut < 0.98 && head.visible;
    chipMesh.visible = chipShow;
    if (chipShow) {
      const active = chipMesh.count;
      for (let i = 0; i < active; i += 1) {
        const chip = chips[i];
        const local = clamp01((fracture - chip.delay) / 0.62);
        _dummy.position.copy(chip.origin).addScaledVector(chip.dir, local * 1.25 + bustOut * 2.4);
        _dummy.quaternion.setFromAxisAngle(chip.axis, local * chip.spin);
        _dummy.scale.setScalar(chip.scale);
        _dummy.updateMatrix();
        chipMesh.setMatrixAt(i, _dummy.matrix);
      }
      chipMesh.instanceMatrix.needsUpdate = true;
    }

    const closeIn = smoothstep(segment(progress, motion.closeIn[0], motion.closeIn[1]));
    closeGroup.visible = closeIn > 0.02;
    closeGroup.position.y = (1 - closeIn) * -0.4;
    const spin = progress * 2.4;
    core.rotation.y = spin;
    core.rotation.x = 0.4 + spin * 0.2;
    core.scale.setScalar(0.82 + closeIn * 0.18);
    rings[0].rotation.y = spin * 0.7;
    rings[1].rotation.z = 0.7 + spin * 0.45;
    rings[2].rotation.y = 0.4 + spin * 0.9;
    setGroupOpacity(closeGroup, closeIn);
    core.material.opacity = closeIn;
    core.material.transparent = closeIn < 0.995;
  }

  function pick(clientX, clientY) {
    if (!panelsGroup.visible) return -1;
    const rect = canvas.getBoundingClientRect();
    _ray.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    _ray.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = pick.raycaster || (pick.raycaster = new THREE.Raycaster());
    raycaster.setFromCamera(_ray, camera);
    const hits = raycaster.intersectObjects(
      panels.map((panel) => panel.face),
      false,
    );
    if (!hits.length) return -1;
    if (hits[0].object.material.opacity < 0.65) return -1;
    return hits[0].object.userData.index;
  }

  function projectPanel(index, target) {
    const panel = panels[index];
    if (!panel || !panelsGroup.visible) return false;
    panel.group.getWorldPosition(target);
    target.project(camera);
    if (target.z > 1) return false;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    target.x = (target.x * 0.5 + 0.5) * width;
    target.y = (-target.y * 0.5 + 0.5) * height;
    return panel.face.material.opacity > 0.55;
  }

  function render() {
    renderer.render(scene, camera);
  }

  layout();
  onProgress?.(1);

  return {
    update,
    render,
    resize: layout,
    pick,
    projectPanel,
    setHover(index) {
      hoverIndex = index;
    },
    panelCount: panels.length,
  };
}
