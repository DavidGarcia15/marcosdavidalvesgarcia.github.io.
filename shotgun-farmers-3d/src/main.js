import * as THREE from "three";
import { createCompanionSystem } from "./companions.js";
import { createSeedPlantSystem } from "./seed-plants.js";
import { unlockAudio } from "./sound.js";

// Farmers Field — prototype 009
// Shotgun-Farmers-style sow/harvest loop, adapted to be nonviolent.
// Procedural world, no copyrighted assets.

const canvas = document.querySelector("#game-canvas");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const hud = document.querySelector(".hud");
const pauseHint = document.querySelector("#pause-hint");
const coordinates = document.querySelector("#coordinates");
const toast = document.querySelector("#toast");

function makeSkyTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#4fa8e6");
  grad.addColorStop(0.52, "#aee0ef");
  grad.addColorStop(1, "#f3efd6");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const scene = new THREE.Scene();
scene.background = makeSkyTexture();
scene.fog = new THREE.Fog(0xcfe9e4, 52, 155);

const camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 260);
camera.rotation.order = "YXZ";
camera.position.set(0, 1.72, 27);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const clock = new THREE.Clock();
const colliders = [];
const clouds = [];
const keys = Object.create(null);
let yaw = 0;
let pitch = 0;
let verticalVelocity = 0;
let grounded = true;
let isLocked = false;
let toastTimeout = null;

const material = (color, roughness = 0.9, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra });

const mats = {
  grass: material(0x6fae52),
  soil: material(0x76523b),
  wood: material(0x8a5d38),
  woodDark: material(0x513923),
  barn: material(0xc1472a),
  barnLight: material(0xe0613a),
  roof: material(0x39443b),
  cream: material(0xe7d8ae),
  leaf: material(0x4f9142),
};

function addMesh(geometry, mat, position, options = {}) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  if (options.rotation) mesh.rotation.set(...options.rotation);
  if (options.scale) mesh.scale.set(...options.scale);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  scene.add(mesh);
  return mesh;
}

function addBox(position, scale, mat, rotation = [0, 0, 0]) {
  return addMesh(new THREE.BoxGeometry(...scale), mat, position, { rotation });
}

function addCylinder(position, radiusTop, radiusBottom, height, mat, radialSegments = 10) {
  return addMesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments), mat, position);
}

function addGround() {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240, 48, 48), mats.grass);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  ground.receiveShadow = true;
  scene.add(ground);

  const patchMat = new THREE.MeshStandardMaterial({ color: 0x91a96a, roughness: 1, transparent: true, opacity: 0.26 });
  for (let i = 0; i < 90; i++) {
    const x = (Math.random() - 0.5) * 185;
    const z = (Math.random() - 0.5) * 185;
    const patch = new THREE.Mesh(new THREE.CircleGeometry(1.2 + Math.random() * 3.2, 7), patchMat);
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(x, -0.055, z);
    patch.scale.set(1 + Math.random() * 2, 0.55 + Math.random(), 1);
    scene.add(patch);
  }
}

function addPath() {
  const pathMat = material(0xa98a5d);
  const path = addMesh(new THREE.PlaneGeometry(10, 115), pathMat, [-20, 0.005, 7]);
  path.rotation.x = -Math.PI / 2;
  path.rotation.z = 0.035;
  path.receiveShadow = true;

  const edgeMat = material(0xc2a577);
  for (let i = 0; i < 38; i++) {
    const z = 62 - i * 2.8;
    const xOffset = Math.sin(i * 0.7) * 0.28;
    const pebble = addMesh(new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.18, 0), edgeMat,
      [-24 + xOffset + (Math.random() - 0.5) * 5.5, 0.08, z + Math.random() * 1.4]);
    pebble.rotation.set(Math.random(), Math.random(), Math.random());
  }
}

function addBarn() {
  const x = -33, z = -25;
  addBox([x, 5.3, z], [18, 10.6, 15], mats.barn);
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-9, 0);
  gableShape.lineTo(9, 0);
  gableShape.lineTo(0, 6.2);
  gableShape.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.35, bevelEnabled: false });
  const gable = new THREE.Mesh(gableGeo, mats.barnLight);
  gable.position.set(x, 10.55, z + 7.5);
  gable.castShadow = true;
  scene.add(gable);

  addBox([x - 4.8, 13.15, z], [11.2, 0.55, 16.5], mats.roof, [0, 0, 0.48]);
  addBox([x + 4.8, 13.15, z], [11.2, 0.55, 16.5], mats.roof, [0, 0, -0.48]);
  addBox([x, 6.3, z + 7.62], [5.3, 7.5, 0.22], mats.woodDark);
  addBox([x - 1.28, 6.3, z + 7.78], [2.5, 7.15, 0.13], mats.barnLight);
  addBox([x + 1.28, 6.3, z + 7.78], [2.5, 7.15, 0.13], mats.barnLight);
  addBox([x, 6.3, z + 7.9], [0.12, 7.2, 0.12], mats.cream);
  addBox([x, 10.25, z + 7.9], [5.5, 0.15, 0.15], mats.cream);
  addBox([x - 6.7, 7.4, z + 7.7], [1.25, 1.5, 0.15], mats.cream);
  addBox([x + 6.7, 7.4, z + 7.7], [1.25, 1.5, 0.15], mats.cream);
  addBox([x - 6.7, 7.4, z + 7.82], [0.95, 1.2, 0.1], material(0x7fb1b0));
  addBox([x + 6.7, 7.4, z + 7.82], [0.95, 1.2, 0.1], material(0x7fb1b0));
  addBox([x, 2.2, z + 7.82], [18.2, 0.35, 0.35], mats.cream);
  for (const side of [-1, 1]) {
    const brace = addBox([x + side * 1.25, 6.3, z + 7.92], [0.16, 6.4, 0.16], mats.cream);
    brace.rotation.z = side * -0.36;
  }
  addBox([x + 9.12, 7.4, z - 1], [0.14, 2.1, 2.1], mats.cream);
  addBox([x + 9.22, 7.4, z - 1], [0.09, 1.7, 1.7], material(0x6e9b99));
  addBox([x + 9.28, 7.4, z - 1], [0.1, 0.12, 1.9], mats.cream);
  addBox([x + 9.28, 7.4, z - 1], [0.1, 1.9, 0.12], mats.cream);
  colliders.push({ minX: x - 9.8, maxX: x + 9.8, minZ: z - 8, maxZ: z + 8 });
}

function addSilo(x, z) {
  addCylinder([x, 5.4, z], 3.2, 3.2, 10.8, material(0xb9b9a0), 16);
  addMesh(new THREE.ConeGeometry(3.45, 2.5, 16), mats.roof, [x, 12, z]);
  addCylinder([x, 10.9, z], 0.13, 0.13, 1, mats.woodDark, 8);
  addBox([x, 1.5, z + 3.22], [1.5, 2.8, 0.15], mats.woodDark);
  for (let y = 2.4; y < 9.4; y += 1.5) addBox([x, y, z + 3.29], [1.4, 0.08, 0.08], mats.cream);
  colliders.push({ minX: x - 3.5, maxX: x + 3.5, minZ: z - 3.5, maxZ: z + 3.5 });
}

function addFenceLine(start, end, fixed, axis = "x", spacing = 3) {
  const distance = Math.abs(end - start);
  const count = Math.floor(distance / spacing);
  for (let i = 0; i <= count; i++) {
    const along = start + (end - start) * (i / count);
    const p = axis === "x" ? [along, 0, fixed] : [fixed, 0, along];
    addBox([p[0], 0.9, p[2]], [0.22, 1.8, 0.22], mats.woodDark);
    for (const y of [0.55, 1.22]) {
      addBox([p[0], y, p[2]], [axis === "x" ? spacing + 0.12 : 0.16, 0.16, axis === "x" ? 0.16 : spacing + 0.12], mats.wood);
    }
  }
}

function addFence() {
  addFenceLine(-5, 39, -52, "x", 3.2);
  addFenceLine(-5, 39, 9, "x", 3.2);
  addFenceLine(-52, 9, -5, "z", 3.2);
  addFenceLine(-52, 9, 39, "z", 3.2);
}

function addTree(x, z, size = 1) {
  addCylinder([x, 2.3 * size, z], 0.35 * size, 0.55 * size, 4.6 * size, mats.wood, 7);
  const greens = [0x527b42, 0x628b48, 0x779b52, 0x4a713c];
  for (let i = 0; i < 5; i++) {
    const angle = i * 2.4;
    const radius = (0.6 + (i % 2) * 0.3) * size;
    const crown = addMesh(new THREE.IcosahedronGeometry((1.55 + (i % 3) * 0.22) * size, 1),
      material(greens[i % greens.length]),
      [x + Math.cos(angle) * radius, (4.9 + (i % 2) * 0.72) * size, z + Math.sin(angle) * radius]);
    crown.scale.y = 0.83;
  }
}

function addHayBale(x, y, z, rotation = 0) {
  const bale = addMesh(new THREE.CylinderGeometry(1.05, 1.05, 1.5, 12),
    material(0xc1a05b), [x, y + 1.05, z], { rotation: [0, 0, Math.PI / 2] });
  bale.rotation.y = rotation;
  for (let i = -2; i <= 2; i++) {
    const band = addMesh(new THREE.TorusGeometry(1.055, 0.025, 4, 16),
      material(0xe0c17b), [x + i * 0.26, y + 1.05, z], { rotation: [0, 0, Math.PI / 2] });
    band.rotation.x = Math.PI / 2;
  }
}

function addCrops() {
  const stalkGeo = new THREE.CylinderGeometry(0.09, 0.16, 1.75, 5);
  const leafGeo = new THREE.BoxGeometry(0.13, 0.95, 0.24);
  const cobGeo = new THREE.CapsuleGeometry(0.13, 0.52, 3, 6);
  const stalkMat = material(0x4d783a);
  const leafMat = material(0x6c9846);
  const cobMat = material(0xe8c84f);
  const stalks = new THREE.InstancedMesh(stalkGeo, stalkMat, 240);
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, 480);
  const cobs = new THREE.InstancedMesh(cobGeo, cobMat, 190);
  const dummy = new THREE.Object3D();
  let stemCount = 0, leafCount = 0, cobCount = 0;

  for (let row = 0; row < 10; row++) {
    const z = -7 - row * 4.1;
    for (let col = 0; col < 19; col++) {
      const x = 5 + col * 1.72 + (row % 2) * 0.45;
      const height = 1.35 + Math.random() * 0.7;
      dummy.position.set(x, height / 2, z + (Math.random() - 0.5) * 0.35);
      dummy.scale.set(0.8 + Math.random() * 0.35, height / 1.75, 0.8 + Math.random() * 0.35);
      dummy.rotation.set(0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.1);
      dummy.updateMatrix();
      stalks.setMatrixAt(stemCount++, dummy.matrix);

      for (let side = 0; side < 2; side++) {
        dummy.position.set(x + (side ? 0.2 : -0.2), 0.65 + Math.random() * 0.2, z + (side ? 0.12 : -0.12));
        dummy.scale.set(1, 0.7 + Math.random() * 0.45, 1);
        dummy.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, side ? -0.6 : 0.6);
        dummy.updateMatrix();
        leaves.setMatrixAt(leafCount++, dummy.matrix);
      }
      if (Math.random() > 0.2) {
        dummy.position.set(x + 0.16, 1.05 + Math.random() * 0.35, z);
        dummy.scale.set(1, 0.75 + Math.random() * 0.5, 1);
        dummy.rotation.set(0, 0, 0.35);
        dummy.updateMatrix();
        cobs.setMatrixAt(cobCount++, dummy.matrix);
      }
    }
  }
  stalks.count = stemCount;
  leaves.count = leafCount;
  cobs.count = cobCount;
  stalks.castShadow = leaves.castShadow = cobs.castShadow = true;
  stalks.receiveShadow = leaves.receiveShadow = cobs.receiveShadow = true;
  scene.add(stalks, leaves, cobs);
}

function addFlowerPatch(x, z, count = 12) {
  for (let i = 0; i < count; i++) {
    const px = x + (Math.random() - 0.5) * 7;
    const pz = z + (Math.random() - 0.5) * 7;
    addCylinder([px, 0.35, pz], 0.035, 0.045, 0.7, mats.leaf, 5);
    const flower = addMesh(new THREE.SphereGeometry(0.16, 7, 5),
      material(i % 3 ? 0xe5c64e : 0xf2e2b6), [px, 0.72, pz]);
    flower.scale.set(1, 0.55, 1);
  }
}

function addScarecrow(x, z) {
  addCylinder([x, 1.85, z], 0.1, 0.1, 3.7, mats.woodDark, 7);
  addCylinder([x, 2.6, z], 0.08, 0.08, 2.5, mats.wood, 7).rotation.z = Math.PI / 2;
  addMesh(new THREE.SphereGeometry(0.53, 8, 7), material(0xc7a77a), [x, 4.05, z]);
  addMesh(new THREE.ConeGeometry(0.9, 0.65, 4), mats.woodDark, [x, 4.66, z], { rotation: [0, Math.PI / 4, 0] });
  addBox([x, 2.75, z], [1.25, 1.45, 0.48], material(0x76543b));
}

function addCloud(x, y, z, scale) {
  const group = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.88 });
  for (let i = 0; i < 5; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), cloudMat);
    puff.position.set((i - 2) * 1.15, Math.sin(i * 1.4) * 0.38, Math.cos(i) * 0.35);
    puff.scale.set(1.6, 0.72 + (i % 2) * 0.16, 0.9);
    group.add(puff);
  }
  group.position.set(x, y, z);
  group.scale.setScalar(scale);
  scene.add(group);
  clouds.push(group);
}

function addWorldDetails() {
  addBarn();
  addSilo(-18, -37);
  addHayBale(-15, 0, -9);
  addHayBale(-10, 0, -12, 0.4);
  addHayBale(-42, 0, -8, 0.7);
  addTree(-53, -20, 1.4);
  addTree(-55, 2, 1.1);
  addTree(49, -15, 1.4);
  addTree(52, 15, 1.2);
  addTree(-47, 33, 1.2);
  addTree(29, -62, 1.15);
  addScarecrow(3, -19);
  addScarecrow(36, -39);
  addFlowerPatch(-4, 8, 20);
  addFlowerPatch(43, -6, 15);
  addFence();
  addCrops();
}

function addLighting() {
  const hemi = new THREE.HemisphereLight(0xeaf8f2, 0x6c593e, 2.3);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe29a, 3.35);
  sun.position.set(-35, 55, 28);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -85;
  sun.shadow.camera.right = 85;
  sun.shadow.camera.top = 85;
  sun.shadow.camera.bottom = -85;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 180;
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.025;
  scene.add(sun);

  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(4.5, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe8ad }));
  sunDisc.position.set(-70, 65, -100);
  scene.add(sunDisc);

  const fill = new THREE.DirectionalLight(0xb5d8e2, 0.55);
  fill.position.set(45, 20, -30);
  scene.add(fill);
}

function buildWorld() {
  addGround();
  addPath();
  addWorldDetails();
  addLighting();
  addCloud(-35, 34, -60, 3.2);
  addCloud(18, 39, -80, 4.1);
  addCloud(65, 31, -35, 2.8);
}

const player = {
  eyeHeight: 1.72,
  walkSpeed: 8.2,
  runSpeed: 12.4,
  acceleration: 13.5,
  velocity: new THREE.Vector3(),
};

function collidesAt(x, z) {
  const radius = 0.48;
  for (const box of colliders) {
    const nearestX = THREE.MathUtils.clamp(x, box.minX, box.maxX);
    const nearestZ = THREE.MathUtils.clamp(z, box.minZ, box.maxZ);
    const dx = x - nearestX, dz = z - nearestZ;
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  return false;
}

function updatePlayer(delta) {
  const forwardInput = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
  const sideInput = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const inputLength = Math.hypot(forwardInput, sideInput) || 1;
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const desired = new THREE.Vector3()
    .addScaledVector(forward, forwardInput / inputLength)
    .addScaledVector(right, sideInput / inputLength);
  const speed = keys.ShiftLeft || keys.ShiftRight ? player.runSpeed : player.walkSpeed;
  desired.multiplyScalar(speed);

  const blend = 1 - Math.exp(-player.acceleration * delta);
  player.velocity.x = THREE.MathUtils.lerp(player.velocity.x, desired.x, blend);
  player.velocity.z = THREE.MathUtils.lerp(player.velocity.z, desired.z, blend);

  const nextX = THREE.MathUtils.clamp(camera.position.x + player.velocity.x * delta, -82, 82);
  const nextZ = THREE.MathUtils.clamp(camera.position.z + player.velocity.z * delta, -82, 82);
  if (!collidesAt(nextX, camera.position.z)) camera.position.x = nextX;
  else player.velocity.x = 0;
  if (!collidesAt(camera.position.x, nextZ)) camera.position.z = nextZ;
  else player.velocity.z = 0;

  verticalVelocity -= 21 * delta;
  camera.position.y += verticalVelocity * delta;
  if (camera.position.y <= player.eyeHeight) {
    camera.position.y = player.eyeHeight;
    verticalVelocity = 0;
    grounded = true;
  }
  camera.rotation.set(pitch, yaw, 0, "YXZ");
  coordinates.textContent = "X " + String(Math.round(camera.position.x)).padStart(3, "0") +
    " · Z " + String(Math.round(camera.position.z)).padStart(3, "0");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

// Ordem de criação ajustada: seedPlantSystem primeiro (com referências
// indiretas aos métodos do companion), depois o companion, que recebe
// plantWeaponAt do seedPlantSystem para plantar armas reais no mundo.
let companionSystem;
const seedPlantSystem = createSeedPlantSystem(
  scene, camera, showToast,
  (...args) => companionSystem.addPollenCloud(...args),
  (...args) => companionSystem.tryDirectHit(...args)
);
companionSystem = createCompanionSystem(scene, showToast, seedPlantSystem.plantCrop);

function lockPointer() {
  if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
}

startButton.addEventListener("click", () => { unlockAudio(); lockPointer(); });
startScreen.addEventListener("click", (event) => {
  if (event.target === startScreen) { unlockAudio(); lockPointer(); }
});

document.addEventListener("pointerlockchange", () => {
  isLocked = document.pointerLockElement === canvas;
  startScreen.classList.toggle("hidden", isLocked);
  hud.classList.toggle("visible", isLocked);
  pauseHint.classList.toggle("visible", !isLocked && camera.position.z !== 27);
  if (isLocked) {
    pauseHint.classList.remove("visible");
    showToast("Welcome to Sunflower Valley");
  } else {
    seedPlantSystem.setAiming(false);
  }
});

document.addEventListener("pointerlockerror", () => {
  showToast("Pointer lock unavailable — try clicking ENTER THE FARM");
});

document.addEventListener("mousemove", (event) => {
  if (!isLocked) return;
  // Sensibilidade reduzida ao mirar (zoom da sniper).
  const sensitivity = seedPlantSystem.isAiming() ? 0.00075 : 0.0021;
  yaw -= event.movementX * sensitivity;
  pitch -= event.movementY * sensitivity;
  pitch = THREE.MathUtils.clamp(pitch, -Math.PI / 2 + 0.08, Math.PI / 2 - 0.08);
});

const WEAPON_KEYS = {
  Digit1: "corn",
  Digit2: "sunflower",
  Digit3: "pumpkin",
  Digit4: "peavolver",
  Digit5: "hayk47",
  Digit6: "watermelon",
  Digit7: "pepper",
};

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (WEAPON_KEYS[event.code]) seedPlantSystem.selectType(WEAPON_KEYS[event.code]);
  if (event.code === "KeyE" && !event.repeat && isLocked) seedPlantSystem.interact(camera.position);
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
  if (event.code === "Space" && grounded && isLocked) {
    verticalVelocity = 7.2;
    grounded = false;
  }
  if (event.code === "Escape") pauseHint.classList.add("visible");
});

document.addEventListener("keyup", (event) => { keys[event.code] = false; });
document.addEventListener("mousedown", (event) => {
  if (event.button === 0 && isLocked) { seedPlantSystem.shoot(); seedPlantSystem.setFiring(true); }
  if (event.button === 2 && isLocked) seedPlantSystem.setAiming(true);
});
document.addEventListener("mouseup", (event) => {
  if (event.button === 0) seedPlantSystem.setFiring(false);
  if (event.button === 2) seedPlantSystem.setAiming(false);
});
document.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("blur", () => {
  for (const key of Object.keys(keys)) keys[key] = false;
  seedPlantSystem.setAiming(false);
  seedPlantSystem.setFiring(false);
});

function animate() {
  const delta = Math.min(clock.getDelta(), 0.04);
  if (isLocked) updatePlayer(delta);
  companionSystem.update(delta, camera.position, keys, isLocked);
  seedPlantSystem.update(delta, isLocked);
  clouds.forEach((cloud, index) => {
    cloud.position.x += delta * (0.3 + index * 0.07);
    if (cloud.position.x > 115) cloud.position.x = -115;
  });
  renderer.render(scene, camera);
}

buildWorld();
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

showToast("Field loaded — press ENTER THE FARM");
