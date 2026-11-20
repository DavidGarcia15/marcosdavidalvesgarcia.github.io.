import * as THREE from "three";
import { 
  playPlant, playDirectHit, playHarvest, 
  playCornShot, playSunflowerShot, playPumpkinShot,
  playPeavolverShot, playHayK47Shot, playWatermeLMGShot,
  playPepperShot, playReload 
} from "./sound.js";

// Shotgun-Farmers-style loop: cada arma vegetal tem seu próprio pente.
// Atire para gastar; um erro planta uma arma no chão.
// Colha com E para recarregar. Quanto mais cresceu, mais munição dá.

const palette = {
  corn: 0xf5c62e, sunflower: 0xffd21e, pumpkin: 0xf4791a,
  peavolver: 0x6ab04c, hayk47: 0xd4a843, watermelon: 0x2e9e34, pepper: 0xd4382e,
  leaf: 0x5d9149, leafLight: 0x8fb85c, stem: 0x48753c,
};

const weaponInfo = {
  corn: { name: "ESPINGARDA DE MILHO", ability: "PÓLEN LEVE", detail: "Cano duplo. Dispara 3 grãos em leque; recarrega rápido.", clipSize: 6, growTime: 9, minYield: 2, maxYield: 6, matureScale: 0.55, recoilKick: 0.18, shotSound: playCornShot, pellets: 3, spread: 0.085 },
  sunflower: { name: "SNIPER DE GIRASSOL", ability: "PÓLEN VIVO", detail: "Preciso e longo. Um tiro forte; mira telescópica (RMB).", clipSize: 2, growTime: 13, minYield: 1, maxYield: 3, matureScale: 0.58, recoilKick: 0.22, shotSound: playSunflowerShot },
  pumpkin: { name: "LANÇADOR DE ABÓBORA", ability: "PÓLEN FORTE", detail: "Tubo largo. Projétil explosivo; recarga lenta.", clipSize: 1, growTime: 18, minYield: 1, maxYield: 2, matureScale: 0.62, recoilKick: 0.32, shotSound: playPumpkinShot },
  peavolver: { name: "PEAVOLVER", ability: "PÓLEN RÁPIDO", detail: "Revólver de ervilha. Tiro rápido e leve; curta distância.", clipSize: 6, growTime: 8, minYield: 2, maxYield: 5, matureScale: 0.5, recoilKick: 0.15, shotSound: playPeavolverShot },
  hayk47: { name: "HAYK-47", ability: "PÓLEN CONSTANTE", detail: "Rifle de feno automático. Segure o clique para rajada contínua.", clipSize: 10, growTime: 14, minYield: 2, maxYield: 10, matureScale: 0.6, recoilKick: 0.12, shotSound: playHayK47Shot, auto: true },
  watermelon: { name: "WATERMELMG", ability: "PÓLEN PESADO", detail: "Metralhadora automática. Segure o clique; cadência altíssima.", clipSize: 16, growTime: 20, minYield: 3, maxYield: 10, matureScale: 0.65, recoilKick: 0.08, shotSound: playWatermeLMGShot, auto: true },
  pepper: { name: "BORRIFO DE PIMENTA", ability: "NÉVOA DE PÓLEN", detail: "Spray automático de curto alcance. Segure o clique sem parar.", clipSize: 40, growTime: 10, minYield: 14, maxYield: 36, matureScale: 0.5, recoilKick: 0.05, shotSound: playPepperShot, auto: true, pellets: 2, spread: 0.1 },
};

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.88, ...extra });
const woodMat = mat(0x6b4a2e, { roughness: 0.95 });
const darkWoodMat = mat(0x4a3320, { roughness: 0.95 });
const metalMat = mat(0x8a8a8a, { roughness: 0.4, metalness: 0.7 });
const darkMetalMat = mat(0x2a2a2a, { roughness: 0.5, metalness: 0.6 });
const goldMat = mat(0xf3d96a, { roughness: 0.5, emissive: 0x3a2e10 });
const brightGoldMat = mat(0xffd700, { roughness: 0.4, emissive: 0x553f00, emissiveIntensity: 0.4 });
const huskMat = mat(0xa8853a, { roughness: 1 });
const greenHuskMat = mat(0x8aaf4c, { roughness: 1 });
const shellMat = mat(0xf0dba0, { roughness: 0.6, metalness: 0.1 }); // cascas ejetadas viram pipoca, referência ao jogo real
const peaMat = mat(0x6ab04c, { roughness: 0.7 });
const peaBrightMat = mat(0x86c968, { roughness: 0.6, emissive: 0x142a0e });
const hayMat = mat(0xd4a843, { roughness: 1 });
const hayBrightMat = mat(0xe4b953, { roughness: 1 });
const ropeMat = mat(0x8b6b3d, { roughness: 1 });
const watermelonRindMat = mat(0x2e7d32, { roughness: 0.6 });
const watermelonStripeMat = mat(0x1b5e20, { roughness: 0.6 });
const watermelonFleshMat = mat(0xe94560, { roughness: 0.7, emissive: 0x3a0a12 });
const seedMat = mat(0x1a1a1a, { roughness: 0.9 });
const pumpkinRibMat = mat(0xb85a1f, { roughness: 0.9 });
const lensMat = new THREE.MeshStandardMaterial({
  color: 0x88ccee, roughness: 0.1, metalness: 0.9, emissive: 0x224466, emissiveIntensity: 0.6,
});
const soilMat = mat(0x5a402f);

function addPart(root, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

// === World plant models ===
function makePlant(kind) {
  const root = new THREE.Group();
  const stem = mat(palette.stem);
  const leaf = mat(palette.leaf);
  const light = mat(palette.leafLight);
  if (kind === "corn") {
    addPart(root, new THREE.CylinderGeometry(0.08, 0.12, 1.5, 7), stem, [0, 0.75, 0]);
    for (const side of [-1, 1]) addPart(root, new THREE.SphereGeometry(0.38, 9, 7), leaf, [side * 0.28, 0.65, 0], [0.8, 0.18, 0.4]);
    addPart(root, new THREE.CapsuleGeometry(0.12, 0.4, 3, 7), mat(palette.corn), [0.18, 1.05, -0.1]);
  } else if (kind === "sunflower") {
    addPart(root, new THREE.CylinderGeometry(0.07, 0.1, 1.5, 7), stem, [0, 0.75, 0]);
    for (const side of [-1, 1]) addPart(root, new THREE.SphereGeometry(0.3, 9, 7), light, [side * 0.27, 0.55, 0], [0.9, 0.18, 0.48]);
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI * 2 / 10;
      addPart(root, new THREE.SphereGeometry(0.18, 8, 6), mat(palette.sunflower), [Math.cos(a) * 0.34, 1.62 + Math.sin(a) * 0.34, 0], [0.75, 1.1, 0.55]);
    }
    addPart(root, new THREE.SphereGeometry(0.27, 10, 8), mat(0x65452d), [0, 1.62, 0.03]);
  } else if (kind === "pumpkin") {
    addPart(root, new THREE.SphereGeometry(0.56, 12, 9), mat(palette.pumpkin), [0, 0.5, 0], [1.1, 0.9, 1]);
    addPart(root, new THREE.CylinderGeometry(0.04, 0.06, 0.25, 6), stem, [0, 1.05, 0]);
    addPart(root, new THREE.SphereGeometry(0.25, 8, 6), light, [0.3, 0.98, 0], [1, 0.18, 0.5]);
  } else if (kind === "peavolver") {
    addPart(root, new THREE.CylinderGeometry(0.05, 0.08, 1.2, 6), stem, [0, 0.6, 0]);
    for (const side of [-1, 1]) addPart(root, new THREE.SphereGeometry(0.22, 8, 6), leaf, [side * 0.22, 0.45, 0], [0.9, 0.18, 0.4]);
    for (let i = 0; i < 3; i++) addPart(root, new THREE.CapsuleGeometry(0.06, 0.25, 3, 6), peaMat, [0.15, 0.8 + i * 0.15, 0], [1, 1, 1], [0, 0, 0.2]);
    addPart(root, new THREE.SphereGeometry(0.12, 8, 6), light, [0, 1.15, 0]);
  } else if (kind === "hayk47") {
    for (let i = 0; i < 5; i++) addPart(root, new THREE.CylinderGeometry(0.03, 0.03, 1.4, 4), hayMat, [(i - 2) * 0.1, 0.7, 0]);
    addPart(root, new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8), ropeMat, [0, 0.5, 0]);
    addPart(root, new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8), ropeMat, [0, 1.0, 0]);
    addPart(root, new THREE.SphereGeometry(0.15, 6, 4), hayMat, [0, 1.4, 0]);
  } else if (kind === "watermelon") {
    addPart(root, new THREE.SphereGeometry(0.6, 12, 9), watermelonRindMat, [0, 0.55, 0], [1.2, 0.9, 1]);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      addPart(root, new THREE.BoxGeometry(0.03, 0.8, 0.03), watermelonStripeMat, [Math.cos(a) * 0.55, 0.55, Math.sin(a) * 0.55], [1, 1, 1], [0, 0, a]);
    }
    addPart(root, new THREE.CylinderGeometry(0.06, 0.08, 0.2, 6), stem, [0, 1.1, 0]);
    addPart(root, new THREE.SphereGeometry(0.2, 8, 6), light, [0.4, 0.8, 0], [0.8, 0.18, 0.5]);
  } else if (kind === "pepper") {
    addPart(root, new THREE.CylinderGeometry(0.07, 0.1, 1.3, 7), stem, [0, 0.65, 0]);
    for (const side of [-1, 1]) addPart(root, new THREE.SphereGeometry(0.26, 8, 6), leaf, [side * 0.24, 0.55, 0], [0.85, 0.16, 0.42]);
    addPart(root, new THREE.CapsuleGeometry(0.14, 0.42, 3, 8), mat(palette.pepper), [0.1, 1.05, 0], [1, 1, 0.82], [0.15, 0, 0.35]);
    addPart(root, new THREE.CylinderGeometry(0.03, 0.04, 0.12, 5), stem, [0.02, 1.32, -0.02]);
  }
  return root;
}

// === FIRST-PERSON WEAPON MODELS ===
function makeWeaponModel(kind) {
  const root = new THREE.Group();

  // =========================================================
  // === ESPINGARDA DE MILHO ===
  // =========================================================
  if (kind === "corn") {
    for (const side of [-1, 1]) {
      const x = side * 0.085;
      addPart(root, new THREE.CylinderGeometry(0.075, 0.09, 0.7, 12), mat(palette.corn),
        [x, 0.03, -0.35], [1, 1, 1], [-Math.PI / 2, 0, 0]);
      for (let i = 0; i < 8; i++) {
        const z = -0.08 - i * 0.075;
        for (let j = 0; j < 6; j++) {
          const a = (j / 6) * Math.PI * 2 + i * 0.35;
          addPart(root, new THREE.SphereGeometry(0.022, 6, 5), brightGoldMat,
            [x + Math.cos(a) * 0.085, 0.03 + Math.sin(a) * 0.085, z]);
        }
      }
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        addPart(root, new THREE.ConeGeometry(0.06, 0.22, 5), greenHuskMat,
          [x + Math.cos(a) * 0.1, 0.03 + Math.sin(a) * 0.1, -0.05], [1, 1, 1], [Math.PI / 2, a, 0]);
      }
      addPart(root, new THREE.CylinderGeometry(0.065, 0.07, 0.08, 12), darkMetalMat,
        [x, 0.03, -0.72], [1, 1, 1], [-Math.PI / 2, 0, 0]);
      addPart(root, new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12), mat(0x050505),
        [x, 0.03, -0.77], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    }
    addPart(root, new THREE.BoxGeometry(0.24, 0.16, 0.28), woodMat, [0, 0.02, 0.06]);
    addPart(root, new THREE.BoxGeometry(0.26, 0.04, 0.3), brightGoldMat, [0, 0.1, 0.06]);
    addPart(root, new THREE.CylinderGeometry(0.045, 0.055, 0.22, 10), woodMat, [0, -0.13, 0.15], [1, 1, 1], [0.4, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.05, 0.05, 0.015, 10), brightGoldMat, [0, -0.24, 0.18], [1, 1, 1], [0.4, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.16, 0.16, 0.5), woodMat, [0, -0.03, 0.32]);
    addPart(root, new THREE.BoxGeometry(0.11, 0.05, 0.4), darkWoodMat, [0, 0.05, 0.32]);
    for (let i = 0; i < 4; i++) addPart(root, new THREE.SphereGeometry(0.02, 6, 4), brightGoldMat, [0, 0.02, 0.15 + i * 0.1]);
    addPart(root, new THREE.TorusGeometry(0.045, 0.015, 6, 14), darkMetalMat, [0, -0.1, 0.02], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.018, 0.06, 0.018), metalMat, [0, -0.06, 0.02]);
    for (let i = 0; i < 4; i++) {
      addPart(root, new THREE.CylinderGeometry(0.022, 0.022, 0.09, 8), shellMat, [0.14, 0.04, -0.02 + i * 0.07], [1, 1, 1], [0, 0, Math.PI / 2]);
      addPart(root, new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), brightGoldMat, [0.14, 0.04, -0.06 + i * 0.07], [1, 1, 1], [0, 0, Math.PI / 2]);
    }
    addPart(root, new THREE.ConeGeometry(0.03, 0.08, 4), greenHuskMat, [0, 0.14, -0.15]);
  }

  // =========================================================
  // === SNIPER DE GIRASSOL ===
  // =========================================================
  else if (kind === "sunflower") {
    addPart(root, new THREE.CylinderGeometry(0.032, 0.05, 1.05, 12), mat(palette.stem), [0, 0.02, -0.55], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    for (let i = 0; i < 4; i++) addPart(root, new THREE.TorusGeometry(0.045, 0.015, 6, 12), mat(palette.leafLight), [0, 0.02, -0.15 - i * 0.22], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.055, 0.055, 0.09, 12), darkMetalMat, [0, 0.02, -1.08], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12), mat(0x050505), [0, 0.02, -1.13], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.045, 0.045, 0.4, 12), darkMetalMat, [0, 0.12, -0.18], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.08, 10, 8), mat(0x65452d), [0, 0.12, 0.02], [1, 1, 0.8]);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      addPart(root, new THREE.SphereGeometry(0.038, 6, 5), mat(palette.sunflower), [Math.cos(a) * 0.1, 0.12 + Math.sin(a) * 0.1, 0.02], [1.3, 0.4, 1]);
    }
    addPart(root, new THREE.SphereGeometry(0.08, 10, 8), mat(0x65452d), [0, 0.12, -0.38], [1, 1, 0.8]);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      addPart(root, new THREE.SphereGeometry(0.038, 6, 5), mat(palette.sunflower), [Math.cos(a) * 0.1, 0.12 + Math.sin(a) * 0.1, -0.38], [1.3, 0.4, 1]);
    }
    addPart(root, new THREE.CircleGeometry(0.04, 14), lensMat, [0, 0.12, 0.04]);
    for (const z of [-0.28, -0.08]) addPart(root, new THREE.BoxGeometry(0.08, 0.07, 0.025), metalMat, [0, 0.07, z]);
    for (const side of [-1, 1]) {
      addPart(root, new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6), metalMat, [side * 0.07, -0.06, -0.65], [1, 1, 1], [0.5, 0, side * 0.35]);
      addPart(root, new THREE.CylinderGeometry(0.02, 0.02, 0.02, 6), darkMetalMat, [side * 0.14, -0.19, -0.72]);
    }
    addPart(root, new THREE.BoxGeometry(0.14, 0.14, 0.38), woodMat, [0, 0, 0.18]);
    addPart(root, new THREE.BoxGeometry(0.11, 0.16, 0.55), woodMat, [0, -0.03, 0.45]);
    addPart(root, new THREE.BoxGeometry(0.08, 0.04, 0.4), darkWoodMat, [0, 0.06, 0.45]);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      addPart(root, new THREE.SphereGeometry(0.025, 6, 4), brightGoldMat, [Math.cos(a) * 0.03, -0.02 + Math.sin(a) * 0.03, 0.35 + (i % 2) * 0.05], [1.5, 0.4, 1]);
    }
    addPart(root, new THREE.CylinderGeometry(0.035, 0.045, 0.2, 8), woodMat, [0, -0.11, 0.22], [1, 1, 1], [0.4, 0, 0]);
    addPart(root, new THREE.TorusGeometry(0.035, 0.011, 6, 12), darkMetalMat, [0, -0.07, 0.12], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.012, 0.04, 0.012), metalMat, [0, -0.05, 0.12]);
    addPart(root, new THREE.BoxGeometry(0.06, 0.12, 0.14), darkMetalMat, [0, -0.15, 0.05]);
    for (let i = 0; i < 3; i++) addPart(root, new THREE.SphereGeometry(0.018, 6, 4), seedMat, [0, -0.18 + i * 0.04, 0.05]);
  }

  // =========================================================
  // === LANÇADOR DE ABÓBORA ===
  // =========================================================
  else if (kind === "pumpkin") {
    addPart(root, new THREE.SphereGeometry(0.24, 16, 12), mat(palette.pumpkin), [0, 0, -0.22], [1.15, 1, 1.15]);
    addPart(root, new THREE.SphereGeometry(0.22, 16, 12), mat(0xd86f2a), [0, 0, -0.22], [1.25, 1.05, 0.9]);
    addPart(root, new THREE.SphereGeometry(0.2, 16, 12), mat(0xc6611f), [0, 0, -0.22], [1.35, 1.1, 0.75]);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      addPart(root, new THREE.BoxGeometry(0.02, 0.48, 0.55), pumpkinRibMat, [Math.cos(a) * 0.23, Math.sin(a) * 0.21, -0.22], [1, 1, 1], [0, 0, a]);
    }
    addPart(root, new THREE.CylinderGeometry(0.15, 0.17, 0.14, 16), mat(0xa0561c), [0, 0, -0.48], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.125, 0.145, 0.04, 16), darkMetalMat, [0, 0, -0.56], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.11, 0.11, 0.02, 16), mat(0x050505), [0, 0, -0.57], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.03, 0.045, 0.14, 8), mat(palette.stem), [0, 0.22, -0.18], [1, 1, 1], [0.15, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.06, 6, 4), mat(palette.leafLight), [0.02, 0.3, -0.18], [0.4, 0.15, 1.3], [0, 0, 0.3]);
    for (let i = 0; i < 6; i++) {
      const t = i / 6 * Math.PI * 3;
      addPart(root, new THREE.TorusGeometry(0.26, 0.015, 6, 12, Math.PI / 2), mat(palette.stem), [0, 0, -0.22], [1, 1, 1], [t, Math.PI / 2, 0]);
    }
    addPart(root, new THREE.BoxGeometry(0.12, 0.1, 0.18), woodMat, [0, -0.2, 0.02]);
    addPart(root, new THREE.BoxGeometry(0.06, 0.05, 0.12), darkWoodMat, [0, -0.27, 0.02]);
    addPart(root, new THREE.TorusGeometry(0.05, 0.014, 6, 14), darkMetalMat, [0, -0.25, -0.02], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.018, 0.07, 0.018), metalMat, [0, -0.21, -0.02]);
    addPart(root, new THREE.CylinderGeometry(0.055, 0.065, 0.3, 10), woodMat, [0, -0.24, 0.15], [1, 1, 1], [0.35, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.03, 8, 6), mat(palette.pumpkin), [0, -0.32, 0.22]);
    for (let i = 0; i < 3; i++) {
      addPart(root, new THREE.SphereGeometry(0.055, 10, 8), mat(palette.pumpkin), [-0.2, -0.06, -0.02 + i * 0.07], [1, 0.9, 1]);
      addPart(root, new THREE.CylinderGeometry(0.008, 0.012, 0.03, 5), mat(palette.stem), [-0.2, 0.02, -0.02 + i * 0.07]);
    }
    for (const side of [-1, 1]) addPart(root, new THREE.SphereGeometry(0.06, 8, 6), mat(palette.leafLight), [side * 0.18, 0.16, -0.32], [0.4, 0.9, 1.3], [0, side * 0.3, 0]);
  }

  // =========================================================
  // === PEAVOLVER — REFORMULADO ===
  // Revólver clássico: cano octogonal, corpo curvo de vagem,
  // cilindro giratório com 6 ervilhas grandes, martelo traseiro.
  // =========================================================
  else if (kind === "peavolver") {
    // Corpo central (receiver) — um pouco curvo, em vagem achatada
    addPart(root, new THREE.CapsuleGeometry(0.07, 0.28, 4, 10), peaMat,
      [0, 0.01, -0.02], [1.2, 1.1, 1], [0, 0, Math.PI / 2]);

    // Detalhes da casca da vagem (leve costura)
    for (let i = -2; i <= 2; i++) {
      addPart(root, new THREE.SphereGeometry(0.03, 6, 4), peaBrightMat,
        [0, 0.06, i * 0.08], [1.4, 0.7, 1]);
    }

    // Cilindro giratório do revólver — bem visível e característico
    addPart(root, new THREE.CylinderGeometry(0.11, 0.11, 0.15, 12), darkMetalMat,
      [0, 0.01, 0.04], [1, 1, 1], [0, 0, Math.PI / 2]);
    // Anel externo do cilindro (detalhe metálico)
    for (const z of [-0.08, 0.08]) {
      addPart(root, new THREE.TorusGeometry(0.11, 0.012, 6, 14), metalMat,
        [0, 0.01, 0.04 + z * 0.5], [1, 1, 1], [0, Math.PI / 2, 0]);
    }
    // 6 câmaras com ervilhas gigantes brilhantes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      // Câmara escura
      addPart(root, new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8), mat(0x111111),
        [Math.cos(a) * 0.085, 0.01 + Math.sin(a) * 0.085, 0.09], [1, 1, 1], [Math.PI / 2, 0, 0]);
      // Ervilha dentro
      addPart(root, new THREE.SphereGeometry(0.04, 10, 8), peaBrightMat,
        [Math.cos(a) * 0.085, 0.01 + Math.sin(a) * 0.085, 0.09], [1, 1, 0.7]);
    }

    // Cano octogonal (revólver clássico) — 8 lados visíveis
    addPart(root, new THREE.CylinderGeometry(0.045, 0.055, 0.42, 8), peaMat,
      [0, 0.01, -0.42], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    // Nervura superior do cano
    addPart(root, new THREE.BoxGeometry(0.02, 0.02, 0.4), peaBrightMat, [0, 0.06, -0.42]);
    // Boca metálica
    addPart(root, new THREE.CylinderGeometry(0.055, 0.055, 0.05, 8), darkMetalMat,
      [0, 0.01, -0.63], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.035, 0.035, 0.02, 8), mat(0x050505),
      [0, 0.01, -0.655], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    // Ervilha em cima do cano (mira frontal)
    addPart(root, new THREE.SphereGeometry(0.02, 8, 6), brightGoldMat, [0, 0.08, -0.55]);

    // Martelo traseiro (assinatura do revólver) — em forma de pequena ervilha
    addPart(root, new THREE.BoxGeometry(0.04, 0.09, 0.03), darkMetalMat, [0, 0.09, 0.14], [1, 1, 1], [-0.3, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.028, 8, 6), peaMat, [0, 0.13, 0.11]);

    // Guarda do gatilho — arco metálico curvado
    addPart(root, new THREE.TorusGeometry(0.045, 0.011, 6, 16, Math.PI), darkMetalMat,
      [0, -0.06, 0.05], [1, 1, 1], [Math.PI / 2, 0, 0]);
    // Gatilho metálico
    addPart(root, new THREE.BoxGeometry(0.015, 0.05, 0.015), metalMat, [0, -0.04, 0.05]);

    // Punho — curva de revólver, com madeira e detalhe de vagem
    const grip = addPart(root, new THREE.CylinderGeometry(0.045, 0.06, 0.24, 8), woodMat,
      [0, -0.14, 0.13], [1, 1, 1], [0.45, 0, 0]);
    // Enchimento do punho (vagem verde)
    addPart(root, new THREE.BoxGeometry(0.05, 0.16, 0.08), peaMat,
      [0, -0.13, 0.18], [1, 1, 1], [0.45, 0, 0]);
    // Base do punho (metal)
    addPart(root, new THREE.CylinderGeometry(0.05, 0.055, 0.02, 8), brightGoldMat,
      [0, -0.26, 0.22], [1, 1, 1], [0.45, 0, 0]);

    // Detalhes: 2 ervilhas soltas na lateral (munição de reserva)
    for (let i = 0; i < 2; i++) {
      addPart(root, new THREE.SphereGeometry(0.028, 8, 6), peaBrightMat,
        [0.1, -0.05, -0.15 + i * 0.06]);
    }
  }

  // =========================================================
  // === HAYK-47 — REFORMULADO ===
  // AK-47 de feno: pente curvo característico, corpo de fardo,
  // alça de mira traseira, maçaneta lateral, fios soltos.
  // =========================================================
  else if (kind === "hayk47") {
    // Corpo principal (fardo retangular alongado)
    addPart(root, new THREE.BoxGeometry(0.16, 0.15, 0.55), hayMat, [0, 0, -0.2]);

    // Cordas de feno visíveis — 5 voltas
    for (let i = 0; i < 5; i++) {
      addPart(root, new THREE.TorusGeometry(0.11, 0.013, 6, 10), ropeMat,
        [0, 0, -0.02 - i * 0.1], [1, 1, 1], [Math.PI / 2, 0, 0]);
    }

    // Fios soltos característicos (bem visíveis saindo do fardo)
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.08 + Math.random() * 0.06;
      addPart(root, new THREE.CylinderGeometry(0.004, 0.004, 0.1, 3), hayBrightMat,
        [Math.cos(a) * r, Math.sin(a) * r * 0.7, -0.15 - Math.random() * 0.4],
        [1, 1, 1], [Math.random() * 2, Math.random() * 2, Math.random() * 2]);
    }

    // Cano enrolado em feno (com a costura visível)
    addPart(root, new THREE.CylinderGeometry(0.038, 0.048, 0.62, 10), hayMat,
      [0, 0.02, -0.62], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    // Anéis de corda no cano
    for (let i = 0; i < 4; i++) {
      addPart(root, new THREE.TorusGeometry(0.05, 0.011, 5, 10), ropeMat,
        [0, 0.02, -0.42 - i * 0.14], [1, 1, 1], [Math.PI / 2, 0, 0]);
    }
    // Bucha do cano (metal)
    addPart(root, new THREE.CylinderGeometry(0.05, 0.05, 0.02, 10), darkMetalMat,
      [0, 0.02, -0.94], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    // Boca metálica (freio de boca típico de AK)
    addPart(root, new THREE.CylinderGeometry(0.055, 0.055, 0.06, 10), darkMetalMat,
      [0, 0.02, -0.97], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.04, 0.04, 0.02, 10), mat(0x050505),
      [0, 0.02, -1.0], [1, 1, 1], [-Math.PI / 2, 0, 0]);

    // Mira frontal em V (feno dobrado)
    addPart(root, new THREE.BoxGeometry(0.02, 0.06, 0.02), hayBrightMat, [0, 0.1, -0.88]);
    addPart(root, new THREE.BoxGeometry(0.06, 0.015, 0.02), hayBrightMat, [0, 0.13, -0.88]);

    // Alça de mira traseira (feno dobrado em U invertido)
    addPart(root, new THREE.BoxGeometry(0.015, 0.05, 0.02), hayBrightMat, [-0.04, 0.1, -0.15]);
    addPart(root, new THREE.BoxGeometry(0.015, 0.05, 0.02), hayBrightMat, [0.04, 0.1, -0.15]);
    addPart(root, new THREE.BoxGeometry(0.1, 0.012, 0.02), hayBrightMat, [0, 0.13, -0.15]);

    // PENTE CURVO (assinatura da AK-47) — feito de feno enrolado em ângulo
    const magGroup = new THREE.Group();
    magGroup.position.set(0, -0.17, -0.12);
    // Fardo em arco (3 segmentos em ângulo)
    for (let i = 0; i < 3; i++) {
      const seg = addPart(magGroup, new THREE.BoxGeometry(0.1, 0.08, 0.11), hayMat,
        [0, -i * 0.08, -i * 0.03], [1, 1, 1], [0.35 * i, 0, 0]);
      addPart(magGroup, new THREE.TorusGeometry(0.06, 0.008, 4, 8), ropeMat,
        [0, -i * 0.08, -i * 0.03], [1, 1, 1], [Math.PI / 2 + 0.35 * i, 0, 0]);
    }
    root.add(magGroup);

    // Coronha reta (fardo alongado)
    addPart(root, new THREE.BoxGeometry(0.12, 0.14, 0.4), hayMat, [0, -0.02, 0.32]);
    // Cordas na coronha
    addPart(root, new THREE.TorusGeometry(0.085, 0.011, 5, 10), ropeMat,
      [0, -0.02, 0.2], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.TorusGeometry(0.085, 0.011, 5, 10), ropeMat,
      [0, -0.02, 0.48], [1, 1, 1], [Math.PI / 2, 0, 0]);

    // Maçaneta de armar lateral (característica de AK)
    const cocking = addPart(root, new THREE.BoxGeometry(0.06, 0.02, 0.02), darkMetalMat,
      [0.11, 0.03, -0.1]);
    addPart(root, new THREE.SphereGeometry(0.02, 6, 5), metalMat, [0.15, 0.03, -0.1]);

    // Maçaneta/punho
    addPart(root, new THREE.CylinderGeometry(0.04, 0.05, 0.22, 8), ropeMat,
      [0, -0.14, 0.1], [1, 1, 1], [0.4, 0, 0]);
    // Base do punho (metal)
    addPart(root, new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8), darkMetalMat,
      [0, -0.25, 0.15], [1, 1, 1], [0.4, 0, 0]);

    // Guarda do gatilho (arco)
    addPart(root, new THREE.TorusGeometry(0.038, 0.01, 6, 12), darkMetalMat,
      [0, -0.09, 0.04], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.013, 0.05, 0.013), metalMat, [0, -0.06, 0.04]);

    // Pequeno detalhe de fita adesiva/atadura (bem fazendeiro)
    addPart(root, new THREE.TorusGeometry(0.105, 0.008, 4, 10), mat(0x8a7a5a),
      [0, 0, -0.35], [1, 1, 1], [Math.PI / 2, 0, 0]);
  }

  // =========================================================
  // === WATERMELMG — REFORMULADO ===
  // Metralhadora: melancia gigante, pente de tambor com sementes,
  // cano duplo grosso, bipé aberto, alça de mira.
  // =========================================================
  else if (kind === "watermelon") {
    // Corpo: melancia principal com casca listrada bem visível
    addPart(root, new THREE.SphereGeometry(0.32, 18, 14), watermelonRindMat,
      [0, 0, -0.25], [1.2, 1, 1.2]);

    // Listras escuras em ZIGUE-ZAGUE (10 listras onduladas)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const stripe = addPart(root, new THREE.BoxGeometry(0.028, 0.58, 0.028), watermelonStripeMat,
        [Math.cos(a) * 0.31, 0, -0.25 + Math.sin(a) * 0.31], [1, 1, 1], [0, 0, a]);
      // Pequenas "ondulações" da listra
      addPart(root, new THREE.BoxGeometry(0.03, 0.08, 0.03), watermelonStripeMat,
        [Math.cos(a + 0.15) * 0.31, 0.15, -0.25 + Math.sin(a + 0.15) * 0.31], [1, 1, 1], [0, 0, a]);
    }

    // Carne exposta na frente (onde o cano sai)
    addPart(root, new THREE.SphereGeometry(0.18, 14, 12), watermelonFleshMat,
      [0, 0, -0.54], [1.05, 0.9, 0.5]);
    // 12 sementes espalhadas na carne (bem visíveis, brilham)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 0.05 + (i % 3) * 0.035;
      addPart(root, new THREE.SphereGeometry(0.02, 6, 5), seedMat,
        [Math.cos(a) * r, Math.sin(a) * r * 0.8, -0.6], [1, 1, 0.6]);
    }

    // === CANO DUPLO GROSSO (metralhadora) ===
    for (const side of [-1, 1]) {
      const bx = side * 0.065;
      addPart(root, new THREE.CylinderGeometry(0.05, 0.055, 0.6, 12), darkMetalMat,
        [bx, 0, -0.85], [1, 1, 1], [-Math.PI / 2, 0, 0]);
      // Anéis de refrigeração (3 por cano, bem visíveis)
      for (let i = 0; i < 4; i++) {
        addPart(root, new THREE.TorusGeometry(0.062, 0.01, 6, 14), metalMat,
          [bx, 0, -0.65 - i * 0.13], [1, 1, 1], [Math.PI / 2, 0, 0]);
      }
      // Boca
      addPart(root, new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12), darkMetalMat,
        [bx, 0, -1.15], [1, 1, 1], [-Math.PI / 2, 0, 0]);
      addPart(root, new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12), mat(0x050505),
        [bx, 0, -1.18], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    }
    // Tampa traseira dos canos (união)
    addPart(root, new THREE.BoxGeometry(0.22, 0.1, 0.08), metalMat, [0, 0, -0.55]);

    // === PENTE DE TAMBOR (drum magazine) — bem característico ===
    // Pente redondo preso embaixo, feito de fatia de melancia
    addPart(root, new THREE.CylinderGeometry(0.19, 0.19, 0.12, 16), watermelonRindMat,
      [0, -0.28, -0.15], [1, 1, 1], [Math.PI / 2, 0, 0]);
    // Carne interna visível (círculo rosa no centro do tambor)
    addPart(root, new THREE.CylinderGeometry(0.14, 0.14, 0.13, 16), watermelonFleshMat,
      [0, -0.28, -0.15], [1, 1, 1], [Math.PI / 2, 0, 0]);
    // Sementes organizadas em círculo no tambor
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      addPart(root, new THREE.SphereGeometry(0.02, 6, 5), seedMat,
        [Math.cos(a) * 0.09, -0.28 + Math.sin(a) * 0.09, -0.23], [1, 1, 0.6]);
    }
    // Listras do tambor (casca)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      addPart(root, new THREE.BoxGeometry(0.02, 0.38, 0.13), watermelonStripeMat,
        [Math.cos(a) * 0.19, -0.28 + Math.sin(a) * 0.19, -0.15], [1, 1, 1], [0, Math.PI / 2, a]);
    }

    // === BIPÉ ABERTO (bem visível) ===
    for (const side of [-1, 1]) {
      addPart(root, new THREE.CylinderGeometry(0.018, 0.025, 0.42, 6), mat(palette.stem),
        [side * 0.22, -0.28, -0.72], [1, 1, 1], [0.3, 0, side * 0.55]);
      // Pé do bipé (pequena folha)
      addPart(root, new THREE.SphereGeometry(0.035, 6, 5), mat(palette.leafLight),
        [side * 0.34, -0.48, -0.85], [0.4, 0.4, 0.5]);
    }
    // Dobradiça do bipé
    addPart(root, new THREE.BoxGeometry(0.08, 0.05, 0.05), metalMat, [0, -0.08, -0.7]);

    // === CORONHA (vinha grossa retorcida) ===
    addPart(root, new THREE.CylinderGeometry(0.07, 0.08, 0.5, 10), woodMat,
      [0, -0.08, 0.28], [1, 1, 1], [0.2, 0, 0]);
    // Detalhe de vinha enrolada na coronha
    for (let i = 0; i < 3; i++) {
      addPart(root, new THREE.TorusGeometry(0.075, 0.012, 5, 12), mat(palette.stem),
        [0, -0.05 - i * 0.04, 0.15 + i * 0.1], [1, 1, 1], [Math.PI / 2 + 0.2, 0, 0]);
    }
    // Almofada da coronha (fatia de melancia)
    addPart(root, new THREE.CylinderGeometry(0.09, 0.09, 0.05, 12), watermelonRindMat,
      [0, -0.15, 0.52], [1, 1, 1], [Math.PI / 2 + 0.2, 0, 0]);

    // Maçaneta (madeira escura)
    addPart(root, new THREE.CylinderGeometry(0.05, 0.06, 0.24, 8), darkWoodMat,
      [0, -0.24, 0.08], [1, 1, 1], [0.4, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.03, 6, 5), brightGoldMat, [0, -0.37, 0.13]);

    // Guarda do gatilho (arco) + gatilho
    addPart(root, new THREE.TorusGeometry(0.045, 0.012, 6, 14), darkMetalMat,
      [0, -0.17, 0.02], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.015, 0.06, 0.015), metalMat, [0, -0.14, 0.02]);

    // === ALÇA DE MIRA TRASEIRA + FRONTAL ===
    // Traseira (anel de metal)
    addPart(root, new THREE.TorusGeometry(0.03, 0.008, 6, 12), metalMat,
      [0, 0.16, -0.35], [1, 1, 1], [0, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.012, 0.08, 0.012), metalMat, [0, 0.22, -0.35]);
    // Frontal (poste)
    addPart(root, new THREE.BoxGeometry(0.015, 0.08, 0.015), metalMat, [0, 0.1, -0.9]);
    addPart(root, new THREE.SphereGeometry(0.02, 6, 5), brightGoldMat, [0, 0.15, -0.9]);

    // === FITA DE MUNIÇÃO (sementes penduradas na lateral) ===
    for (let i = 0; i < 6; i++) {
      addPart(root, new THREE.SphereGeometry(0.025, 6, 5), seedMat,
        [0.2, -0.05 - i * 0.03, -0.3 + i * 0.06], [1, 1, 0.7]);
      addPart(root, new THREE.CylinderGeometry(0.008, 0.008, 0.06, 4), brightGoldMat,
        [0.19, -0.06 - i * 0.03, -0.32 + i * 0.06], [1, 1, 1], [0, 0, 0.3]);
    }

    // Folhas na parte superior (mira auxiliar)
    for (const side of [-1, 1]) {
      addPart(root, new THREE.SphereGeometry(0.08, 8, 6), mat(palette.leafLight),
        [side * 0.24, 0.22, -0.45], [0.4, 0.9, 1.3]);
    }

    // Caule no topo da melancia
    addPart(root, new THREE.CylinderGeometry(0.03, 0.045, 0.14, 6), mat(palette.stem),
      [0, 0.34, -0.25], [1, 1, 1], [0.2, 0, 0]);
    // Folha pequena no caule
    addPart(root, new THREE.SphereGeometry(0.06, 6, 4), mat(palette.leaf),
      [0.06, 0.4, -0.25], [0.4, 0.15, 1.2]);
  } else if (kind === "pepper") {
    // === BORRIFO DE PIMENTA: pulverizador manual em forma de pimenta ===
    const pepperBodyMat = mat(palette.pepper, { roughness: 0.55 });
    addPart(root, new THREE.CapsuleGeometry(0.17, 0.62, 4, 10), pepperBodyMat, [0, 0, -0.3], [1, 1, 0.92], [0.1, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.04, 0.05, 0.14, 6), mat(palette.stem), [0, 0.33, -0.5]);
    addPart(root, new THREE.SphereGeometry(0.05, 6, 5), mat(palette.leaf), [0.06, 0.37, -0.42], [0.5, 0.2, 1.1]);
    // Bomba manual de latão
    addPart(root, new THREE.CylinderGeometry(0.045, 0.06, 0.3, 8), metalMat, [0, 0.1, 0.1], [1, 1, 1], [1.3, 0, 0]);
    addPart(root, new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), darkMetalMat, [0, -0.02, 0.32], [1, 1, 1], [1.3, 0, 0]);
    addPart(root, new THREE.SphereGeometry(0.035, 6, 5), brightGoldMat, [0, -0.08, 0.42]);
    // Bico difusor frontal
    addPart(root, new THREE.CylinderGeometry(0.03, 0.055, 0.2, 8), darkMetalMat, [0, -0.02, -0.72]);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      addPart(root, new THREE.CylinderGeometry(0.006, 0.006, 0.03, 4), metalMat,
        [Math.cos(a) * 0.025, -0.02 + Math.sin(a) * 0.025, -0.83]);
    }
    // Guarda do gatilho
    addPart(root, new THREE.TorusGeometry(0.05, 0.012, 6, 12), darkMetalMat, [0, -0.2, -0.1], [1, 1, 1], [Math.PI / 2, 0, 0]);
    addPart(root, new THREE.BoxGeometry(0.015, 0.07, 0.015), metalMat, [0, -0.16, -0.1]);
    // Folhinhas decorativas no corpo
    for (const side of [-1, 1]) {
      addPart(root, new THREE.SphereGeometry(0.1, 7, 5), mat(palette.leaf), [side * 0.17, 0.08, -0.55], [0.6, 0.18, 0.45]);
    }
  }

  return root;
}

const weaponGrip = {
  corn: [0, 0.02, -0.35],
  sunflower: [0, 0.02, -0.5],
  pumpkin: [0, -0.1, -0.15],
  peavolver: [0, 0, -0.25],
  hayk47: [0, 0, -0.4],
  watermelon: [0, -0.08, -0.3],
  pepper: [0, -0.02, -0.1],
};

function makeGrowthRing(kind) {
  const ringMat = new THREE.MeshBasicMaterial({
    color: palette[kind], transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false,
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.56, 24, 1, -Math.PI / 2, 0.001), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.035;
  return ring;
}

function cropYield(crop) {
  const info = weaponInfo[crop.kind];
  const eased = crop.growth * crop.growth * (3 - 2 * crop.growth);
  const amount = Math.max(1, Math.round(info.minYield + (info.maxYield - info.minYield) * eased));
  const quality = 0.4 + 0.6 * eased;
  return { amount, quality };
}

export function createSeedPlantSystem(scene, camera, showToast, addPollenCloud, tryDirectHit) {
  const choices = document.querySelector("#seed-choices");
  const nameEl = document.querySelector("#seed-name");
  const abilityEl = document.querySelector("#seed-ability");
  const detailEl = document.querySelector("#seed-detail");
  const ammoLabel = document.querySelector("#ammo-count");
  const plantCountLabel = document.querySelector("#plant-count");
  const stockLabel = document.querySelector("#seed-stock");
  const harvestPrompt = document.querySelector("#harvest-prompt");
  const harvestPromptText = document.querySelector("#harvest-prompt-text");
  const scopeOverlay = document.querySelector("#scope-overlay");

  const growingCrops = [];
  const projectiles = [];
  const pickups = [];
  const ammo = { corn: 6, sunflower: 2, pumpkin: 1, peavolver: 3, hayk47: 4, watermelon: 4, pepper: 18 };

  let selected = "corn";
  let shotCooldown = 0;
  let handMotion = 0;
  let elapsed = 0;
  let firing = false;

  let reloadActive = false;
  let reloadProgress = 0;

  // Estado do zoom da sniper (right mouse button)
  let aiming = false;
  const baseFov = 76;
  const scopedFov = 26;
  let currentFov = baseFov;

  const heldRoot = new THREE.Group();
  const sleeveMat = mat(0x557c54);
  const gloveMat = mat(0xc49a72);
  const restX = 0.32;
  const restY = -0.30;
  const restZ = -0.62;

  function makeHand() {
    const hand = new THREE.Group();
    addPart(hand, new THREE.CylinderGeometry(0.13, 0.17, 0.43, 9), sleeveMat,
      [0.02, -0.31, 0.16], [1, 1, 0.9], [0.2, 0, -0.2]);
    addPart(hand, new THREE.SphereGeometry(0.16, 10, 8), gloveMat,
      [0.015, -0.075, -0.015], [1.08, 0.78, 0.82]);
    for (let finger = 0; finger < 3; finger++) {
      addPart(hand, new THREE.CapsuleGeometry(0.043, 0.12, 3, 6), gloveMat,
        [-0.09 + finger * 0.085, -0.13, -0.105], [1, 1, 1],
        [0.28, 0, (finger - 1) * 0.16]);
    }
    addPart(hand, new THREE.CapsuleGeometry(0.05, 0.12, 3, 6), gloveMat,
      [0.13, -0.045, -0.035], [1, 1, 1], [0.15, 0, -0.72]);
    return hand;
  }

  const rearHand = makeHand();
  const frontHand = makeHand();
  frontHand.scale.setScalar(0.88);
  frontHand.rotation.y = 0.15;
  heldRoot.add(rearHand, frontHand);

  const heldPlantSlot = new THREE.Group();
  heldRoot.add(heldPlantSlot);
  heldRoot.position.set(restX, restY, restZ);
  heldRoot.rotation.set(0.06, -0.14, -0.08);
  heldRoot.renderOrder = 999;
  heldPlantSlot.renderOrder = 999;
  camera.add(heldRoot);

  function setAiming(v) {
    aiming = !!v;
  }
  function isAiming() {
    return aiming && selected === "sunflower";
  }

  function triggerReloadAnimation() {
    reloadActive = true;
    reloadProgress = 0;
  }

  function updateAmmoDisplay() {
    if (ammoLabel) ammoLabel.textContent = `${ammo[selected]} / ${weaponInfo[selected].clipSize}`;
  }

  function updateStock() {
    if (stockLabel) stockLabel.textContent =
      `🌽 ${ammo.corn}  🌻 ${ammo.sunflower}  🎃 ${ammo.pumpkin}  🫛 ${ammo.peavolver}  🌾 ${ammo.hayk47}  🍉 ${ammo.watermelon}  🌶️ ${ammo.pepper}`;
  }

  function setFiring(v) {
    firing = !!v;
  }

  function updateHeldPlant() {
    heldPlantSlot.clear();
    const model = makeWeaponModel(selected);
    heldPlantSlot.add(model);
    rearHand.position.set(0, 0, 0);
    rearHand.rotation.set(0, 0, 0);
    const grip = weaponGrip[selected];
    frontHand.position.set(grip[0], grip[1], grip[2]);
  }

  function selectType(kind) {
    if (!weaponInfo[kind]) return;
    selected = kind;
    aiming = false;
    if (nameEl) nameEl.textContent = weaponInfo[kind].name;
    if (abilityEl) abilityEl.textContent = weaponInfo[kind].ability;
    if (detailEl) detailEl.textContent = weaponInfo[kind].detail;
    if (choices) choices.querySelectorAll("[data-seed]").forEach(item =>
      item.classList.toggle("selected", item.dataset.seed === kind));
    updateHeldPlant();
    updateAmmoDisplay();
    showToast(weaponInfo[kind].name + " selecionada · " + ammo[kind] + " munição");
  }

  function makePickup(kind, x, z) {
    const root = new THREE.Group();
    const plant = makePlant(kind);
    plant.scale.setScalar(0.55);
    plant.position.y = 0.08;
    root.add(plant);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.045, 6, 24),
      new THREE.MeshBasicMaterial({ color: palette[kind], transparent: true, opacity: 0.8 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    root.add(ring);
    root.position.set(x, 0, z);
    scene.add(root);
    pickups.push({ root, kind, baseY: 0, phase: Math.random() * Math.PI * 2 });
  }

  function plantCrop(x, z, kind, silent = false) {
    if (growingCrops.length >= 22) {
      const oldest = growingCrops.shift();
      scene.remove(oldest.group);
    }
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.07, 10), soilMat);
    soil.position.y = 0.015;
    soil.receiveShadow = true;
    group.add(soil);
    const ring = makeGrowthRing(kind);
    group.add(ring);
    const plantModel = makePlant(kind);
    plantModel.position.y = 0.02;
    plantModel.scale.setScalar(0.06);
    group.add(plantModel);
    scene.add(group);
    growingCrops.push({ group, ring, plantModel, kind, growth: 0, ringDrawnAt: -1, matured: false });
    if (plantCountLabel) plantCountLabel.textContent = String(growingCrops.length);
    if (!silent) {
      playPlant();
      showToast("Arma plantada — volte com E quando crescer!");
    }
  }

  function spawnMuzzleFlash() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const flash = new THREE.PointLight(palette[selected], 3.5, 4.5);
    flash.position.copy(camera.position).addScaledVector(dir, 1.3);
    scene.add(flash);
    window.setTimeout(() => scene.remove(flash), 55);
  }

  function shoot() {
    if (shotCooldown > 0 || reloadActive || projectiles.length > 24) return;
    if (ammo[selected] <= 0) {
      showToast("Sem munição! Colha uma planta para recarregar.");
      shotCooldown = 0.6;
      return;
    }
    ammo[selected] -= 1;
    updateAmmoDisplay();
    updateStock();

    const info = weaponInfo[selected];
    const pelletCount = info.pellets || 1;
    const spread = info.spread || 0;
    const baseDirection = new THREE.Vector3();
    camera.getWorldDirection(baseDirection);
    const color = palette[selected];
    const size = selected === "pumpkin" ? 0.19 : pelletCount > 1 ? 0.095 : 0.13;

    for (let p = 0; p < pelletCount; p++) {
      const direction = baseDirection.clone();
      if (spread) {
        direction.x += (Math.random() - 0.5) * spread;
        direction.y += (Math.random() - 0.5) * spread * 0.5;
        direction.z += (Math.random() - 0.5) * spread;
        direction.normalize();
      }
      const origin = camera.position.clone().addScaledVector(direction, 0.72);
      const velocity = direction.multiplyScalar(12.5).add(new THREE.Vector3(0, 2.2, 0));
      const mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        new THREE.MeshStandardMaterial({ color, roughness: 0.65, emissive: color, emissiveIntensity: 0.1 })
      );
      mesh.position.copy(origin);
      scene.add(mesh);
      projectiles.push({ mesh, velocity, age: 0, kind: selected });
    }

    shotCooldown = info.recoilKick * 1.2;
    handMotion = 1;
    info.shotSound();
    spawnMuzzleFlash();
  }

  function nearestHarvestable(position) {
    let best = null;
    let bestKind = "pickup";
    let bestDistance = 3.25;
    for (const pickup of pickups) {
      const distance = Math.hypot(position.x - pickup.root.position.x, position.z - pickup.root.position.z);
      if (distance < bestDistance) { bestDistance = distance; best = pickup; bestKind = "pickup"; }
    }
    for (const crop of growingCrops) {
      const distance = Math.hypot(position.x - crop.group.position.x, position.z - crop.group.position.z);
      if (distance < bestDistance) { bestDistance = distance; best = crop; bestKind = "crop"; }
    }
    return best ? { target: best, kind: bestKind } : null;
  }

  function interact(playerPosition) {
    const found = nearestHarvestable(playerPosition);
    if (!found) {
      showToast("Procure uma planta brilhando ou uma arma crescida para colher.");
      return false;
    }
    if (found.kind === "crop") {
      const crop = found.target;
      const { amount, quality } = cropYield(crop);
      ammo[crop.kind] = Math.min(weaponInfo[crop.kind].clipSize, ammo[crop.kind] + amount);
      updateAmmoDisplay();
      updateStock();
      scene.remove(crop.group);
      growingCrops.splice(growingCrops.indexOf(crop), 1);
      if (plantCountLabel) plantCountLabel.textContent = String(growingCrops.length);
      addPollenCloud(new THREE.Vector3(crop.group.position.x, 0.15, crop.group.position.z), crop.kind, quality);
      playHarvest(quality);
      if (crop.kind === selected) triggerReloadAnimation();
      playReload();
      showToast(`Você recarregou ${weaponInfo[crop.kind].name}: +${amount} munição!`);
      return true;
    }
    const pickup = found.target;
    const spotX = pickup.root.position.x;
    const spotZ = pickup.root.position.z;
    ammo[pickup.kind] = Math.min(weaponInfo[pickup.kind].clipSize, ammo[pickup.kind] + 4);
    scene.remove(pickup.root);
    pickups.splice(pickups.indexOf(pickup), 1);
    plantCrop(spotX, spotZ, pickup.kind, true);
    updateAmmoDisplay();
    updateStock();
    playHarvest(1);
    if (pickup.kind === selected) triggerReloadAnimation();
    playReload();
    showToast(`Você colheu ${weaponInfo[pickup.kind].name}: +4 munição! O canteiro vai crescer de novo aqui.`);
    return true;
  }

  makePickup("corn", -3, -14);
  makePickup("sunflower", 22, -28);
  makePickup("pumpkin", 35, -7);
  makePickup("corn", -19, 13);
  makePickup("sunflower", 44, -43);
  makePickup("pumpkin", -43, -2);
  makePickup("peavolver", 10, 5);
  makePickup("hayk47", -12, 30);
  makePickup("watermelon", 5, -50);
  makePickup("pepper", 25, 30);

  function update(delta, active = false) {
    elapsed += delta;
    shotCooldown = Math.max(0, shotCooldown - delta);
    if (firing && active && !isAiming() && weaponInfo[selected]?.auto) shoot();

    // === Zoom da sniper (FOV lerp) ===
    const scopedNow = isAiming();
    const targetFov = scopedNow ? scopedFov : baseFov;
    currentFov = THREE.MathUtils.lerp(currentFov, targetFov, 1 - Math.exp(-delta * 12));
    if (Math.abs(camera.fov - currentFov) > 0.01) {
      camera.fov = currentFov;
      camera.updateProjectionMatrix();
    }
    if (scopeOverlay) scopeOverlay.classList.toggle("visible", scopedNow);

    // Esconde a arma quando mira com a sniper (para simular a luneta)
    heldRoot.visible = active && !scopedNow;

    if (reloadActive) {
      reloadProgress += delta * 2.6;
      if (reloadProgress >= 2) {
        reloadProgress = 0;
        reloadActive = false;
      }
    }
    const reloadCurve = reloadActive
      ? (reloadProgress < 1 ? reloadProgress : 2 - reloadProgress)
      : 0;

    const sway = Math.sin(elapsed * 2.3) * 0.018;
    const recoil = weaponInfo[selected]?.recoilKick ?? 0.18;

    heldRoot.position.x = restX + reloadCurve * 0.06;
    heldRoot.position.y = restY + sway - handMotion * 0.045 - reloadCurve * 0.18;
    heldRoot.position.z = restZ + handMotion * 0.07 + reloadCurve * 0.05;
    heldRoot.rotation.x = 0.06 + handMotion * recoil + reloadCurve * 0.55;
    heldRoot.rotation.y = -0.14 - reloadCurve * 0.1;
    heldRoot.rotation.z = -0.08 + reloadCurve * 0.25;

    handMotion = Math.max(0, handMotion - delta * 3.8);

    for (const pickup of pickups) {
      pickup.root.position.y = pickup.baseY + Math.sin(elapsed * 2 + pickup.phase) * 0.12;
      pickup.root.rotation.y += delta * 0.55;
    }

    for (const crop of growingCrops) {
      const info = weaponInfo[crop.kind];
      if (crop.growth < 1) {
        crop.growth = Math.min(1, crop.growth + delta / info.growTime);
        const eased = crop.growth * crop.growth * (3 - 2 * crop.growth);
        crop.plantModel.scale.setScalar(0.06 + eased * (info.matureScale - 0.06));
        if (Math.abs(crop.growth - crop.ringDrawnAt) > 0.025 || crop.growth >= 1) {
          crop.ring.geometry.dispose();
          crop.ring.geometry = new THREE.RingGeometry(0.4, 0.56, 24, 1, -Math.PI / 2, Math.max(0.001, crop.growth * Math.PI * 2));
          crop.ringDrawnAt = crop.growth;
        }
        if (crop.growth >= 1) crop.matured = true;
      } else {
        const pulse = 1 + Math.sin(elapsed * 2.4 + crop.group.position.x) * 0.035;
        crop.plantModel.scale.setScalar(info.matureScale * pulse);
        crop.ring.material.opacity = 0.75 + Math.sin(elapsed * 2.4 + crop.group.position.x) * 0.2;
      }
    }

    const found = active ? nearestHarvestable(camera.position) : null;
    if (harvestPrompt) {
      harvestPrompt.classList.toggle("visible", !!found);
      if (found && harvestPromptText) {
        if (found.kind === "crop") {
          const { amount } = cropYield(found.target);
          const early = found.target.growth < 1 ? " · AINDA CRESCENDO" : "";
          harvestPromptText.textContent = `COLHER ${weaponInfo[found.target.kind].name} · +${amount}${early}`;
        } else {
          harvestPromptText.textContent = `COLHER ${weaponInfo[found.target.kind].name} · +4`;
        }
      }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const seed = projectiles[i];
      seed.age += delta;
      seed.velocity.y -= 7.2 * delta;
      seed.mesh.position.addScaledVector(seed.velocity, delta);
      seed.mesh.rotation.x += delta * 5;
      seed.mesh.rotation.z += delta * 3;

      if (tryDirectHit && seed.mesh.position.y < 2.5 && tryDirectHit(seed.mesh.position, seed.kind)) {
        scene.remove(seed.mesh);
        projectiles.splice(i, 1);
        playDirectHit();
        continue;
      }

      if (seed.mesh.position.y <= 0.12 || seed.age >= 4.4) {
        const x = THREE.MathUtils.clamp(seed.mesh.position.x, -75, 75);
        const z = THREE.MathUtils.clamp(seed.mesh.position.z, -75, 75);
        scene.remove(seed.mesh);
        plantCrop(x, z, seed.kind);
        projectiles.splice(i, 1);
      }
    }
  }

  selectType("corn");
  updateStock();
  updateAmmoDisplay();
  return {
    update, shoot, selectType, interact,
    getPlantCount: () => growingCrops.length,
    plantCrop, setAiming, isAiming, setFiring,
  };
              }
