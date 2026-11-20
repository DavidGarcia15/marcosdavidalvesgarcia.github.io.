import * as THREE from "three";
import { playTransform, playVictory } from "./sound.js";

// Friendly farm companions: nearby farmers can be invited to help.
// After joining, each becomes a small animal helper that wanders and plants
// REAL weapon crops around the field (using the seedPlantSystem's plantCrop).
// There is no combat or damage system — a farmer's bar fills from pollen.

const makeMaterial = (color, roughness = 0.88) =>
  new THREE.MeshStandardMaterial({ color, roughness });

const mats = {
  skin: makeMaterial(0xd9a77c),
  skinShade: makeMaterial(0xb98a63),
  nose: makeMaterial(0xc78a6a),
  shirtA: makeMaterial(0x557c54),
  shirtB: makeMaterial(0x9a7049),
  shirtC: makeMaterial(0x8a4646),
  shirtDetail: makeMaterial(0x3a4d38),
  trousers: makeMaterial(0x3e4a43),
  trousersDark: makeMaterial(0x2a3330),
  boot: makeMaterial(0x4a3020),
  hat: makeMaterial(0xb98e4a),
  hatBand: makeMaterial(0x5a3e22),
  dark: makeMaterial(0x352f28),
  hair: makeMaterial(0x4a3020),
  mustache: makeMaterial(0x3a2418),
  fur: makeMaterial(0xa8793f),
  furDark: makeMaterial(0x6a4a2c),
  furLight: makeMaterial(0xc49a6b),
  furCream: makeMaterial(0xd9be95),
  rabbit: makeMaterial(0xe2ddd0),
  rabbitShade: makeMaterial(0xc9c2b0),
  rabbitPink: makeMaterial(0xc98782),
  chicken: makeMaterial(0xf7d978),
  chickenShade: makeMaterial(0xd6c394),
  chickenComb: makeMaterial(0xe8432e),
  beak: makeMaterial(0xe4a63d),
  beakShade: makeMaterial(0xc98a26),
  eyeWhite: makeMaterial(0xf6f0dc),
  eyeBlack: makeMaterial(0x1a1a1a),
};

const sphere = (parent, material, position, scale, geometry = [0.5, 12, 9]) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(...geometry), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const box = (parent, material, position, size) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const cyl = (parent, material, position, rTop, rBot, h, seg = 8) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

// =========================================================
// === FARMERS — mais detalhados (bigode, suspensórios, botas)
// =========================================================
function makeFarmer(variant = 0) {
  const group = new THREE.Group();
  const shirt = [mats.shirtA, mats.shirtB, mats.shirtC][variant % 3];

  // Pernas + botas
  for (const side of [-1, 1]) {
    const leg = box(group, mats.trousers, [side * 0.16, 0.42, 0], [0.2, 0.68, 0.23]);
    leg.rotation.z = side * -0.035;
    // Bota
    box(group, mats.boot, [side * 0.16, 0.05, 0.06], [0.22, 0.16, 0.32]);
    box(group, mats.boot, [side * 0.16, 0.14, -0.02], [0.2, 0.12, 0.22]);
  }

  // Corpo (camisa)
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.65, 4, 10), shirt);
  body.position.y = 1.23;
  body.castShadow = true;
  group.add(body);

  // Suspensórios (tiras escuras na frente)
  for (const side of [-1, 1]) {
    box(group, mats.shirtDetail, [side * 0.18, 1.35, -0.29], [0.06, 0.55, 0.02]);
  }
  // Botões
  for (let i = 0; i < 3; i++) {
    sphere(group, mats.shirtDetail, [0, 1.15 - i * 0.15, -0.32], [0.03, 0.03, 0.02]);
  }

  // Cabeça
  sphere(group, mats.skin, [0, 2.05, 0], [0.31, 0.34, 0.3]);
  // Orelhas
  for (const side of [-1, 1]) {
    sphere(group, mats.skin, [side * 0.3, 2.05, 0], [0.06, 0.09, 0.05]);
  }
  // Nariz
  sphere(group, mats.nose, [0, 1.98, -0.31], [0.055, 0.05, 0.06]);

  // Olhos (com pupilas)
  for (const side of [-1, 1]) {
    sphere(group, mats.eyeWhite, [side * 0.1, 2.1, -0.28], [0.045, 0.055, 0.03]);
    sphere(group, mats.eyeBlack, [side * 0.1, 2.1, -0.305], [0.025, 0.032, 0.015]);
  }
  // Sobrancelhas
  for (const side of [-1, 1]) {
    const brow = box(group, mats.hair, [side * 0.1, 2.2, -0.29], [0.09, 0.02, 0.02]);
    brow.rotation.z = side * 0.1;
  }
  // Bigode (variant-dependent)
  if (variant % 2 === 0) {
    box(group, mats.mustache, [0, 1.88, -0.31], [0.18, 0.05, 0.03]);
    box(group, mats.mustache, [-0.1, 1.86, -0.31], [0.05, 0.04, 0.03]);
    box(group, mats.mustache, [0.1, 1.86, -0.31], [0.05, 0.04, 0.03]);
  } else {
    // Barba
    sphere(group, mats.hair, [0, 1.83, -0.28], [0.28, 0.15, 0.15]);
  }

  // Cabelo (lateral + topo)
  sphere(group, mats.hair, [0, 2.28, 0.06], [0.32, 0.16, 0.32]);

  // Chapéu de palha
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16), mats.hat);
  brim.position.y = 2.37;
  brim.castShadow = true;
  group.add(brim);
  // Faixa do chapéu
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.06, 14), mats.hatBand);
  band.position.y = 2.42;
  band.castShadow = true;
  group.add(band);
  // Copo do chapéu
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.31, 12), mats.hat);
  crown.position.y = 2.55;
  crown.castShadow = true;
  group.add(crown);
  // Topo do chapéu
  sphere(group, mats.hat, [0, 2.71, 0], [0.28, 0.05, 0.28], [0.5, 10, 6]);

  // Braços (com mãos)
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.52, 3, 8), shirt);
    arm.position.set(side * 0.43, 1.33, 0);
    arm.rotation.z = side * -0.22;
    arm.castShadow = true;
    group.add(arm);
    // Mão
    sphere(group, mats.skin, [side * 0.52, 1.05, 0], [0.1, 0.11, 0.1]);
  }

  return group;
}

// =========================================================
// === ANIMALS — muito mais detalhados
// =========================================================
function makeAnimal(kind) {
  const group = new THREE.Group();
  if (kind === "capybara") {
    // Corpo principal
    sphere(group, mats.fur, [0, 0.58, 0.08], [0.72, 0.53, 0.48]);
    // Barriga mais clara
    sphere(group, mats.furLight, [0, 0.38, 0.08], [0.6, 0.28, 0.4]);
    // Cabeça
    sphere(group, mats.furLight, [0, 0.78, -0.43], [0.39, 0.36, 0.38]);
    // Focinho largo (capivara tem rosto achatado)
    sphere(group, mats.furDark, [0, 0.69, -0.76], [0.22, 0.16, 0.18]);
    sphere(group, mats.dark, [0, 0.64, -0.86], [0.14, 0.08, 0.1]);
    // Olhos (pequenos e escuros)
    for (const side of [-1, 1]) {
      sphere(group, mats.eyeBlack, [side * 0.22, 0.86, -0.7], [0.05, 0.06, 0.04]);
      // Orelhas pequenas e arredondadas
      sphere(group, mats.furDark, [side * 0.27, 1.02, -0.48], [0.105, 0.13, 0.09]);
      // Orelha interna
      sphere(group, mats.furLight, [side * 0.27, 1.02, -0.51], [0.06, 0.07, 0.03]);
    }
    // Patas
    for (const x of [-0.39, 0.39]) for (const z of [-0.19, 0.31]) {
      box(group, mats.fur, [x, 0.2, z], [0.15, 0.38, 0.16]);
      // Dedos (pequenas esferas)
      for (let t = -1; t <= 1; t++) {
        sphere(group, mats.furDark, [x + t * 0.04, 0.03, z + 0.06], [0.03, 0.03, 0.04]);
      }
    }
  } else if (kind === "rabbit") {
    // Corpo
    sphere(group, mats.rabbit, [0, 0.48, 0.08], [0.46, 0.43, 0.46]);
    // Barriga mais clara
    sphere(group, mats.rabbitShade, [0, 0.32, 0.08], [0.35, 0.22, 0.35]);
    // Cabeça
    sphere(group, mats.rabbit, [0, 0.84, -0.31], [0.32, 0.31, 0.3]);
    // Bochechas
    for (const side of [-1, 1]) {
      sphere(group, mats.rabbitShade, [side * 0.18, 0.78, -0.42], [0.14, 0.13, 0.1]);
    }
    // Focinho + nariz
    sphere(group, mats.rabbitPink, [0, 0.78, -0.58], [0.045, 0.035, 0.03]);
    // Olhos grandes
    for (const side of [-1, 1]) {
      sphere(group, mats.eyeWhite, [side * 0.15, 0.89, -0.5], [0.07, 0.08, 0.05]);
      sphere(group, mats.eyeBlack, [side * 0.15, 0.89, -0.545], [0.045, 0.05, 0.03]);
      // Brilho do olho
      sphere(group, mats.eyeWhite, [side * 0.135, 0.905, -0.565], [0.018, 0.018, 0.01]);
      // Orelhas compridas
      const ear = sphere(group, mats.rabbit, [side * 0.17, 1.28, -0.31], [0.12, 0.38, 0.1]);
      ear.rotation.z = side * -0.16;
      sphere(group, mats.rabbitPink, [side * 0.17, 1.29, -0.395], [0.055, 0.27, 0.025]);
    }
    // Bigodes
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const w = cyl(group, mats.dark, [side * 0.14, 0.79 + i * 0.01, -0.6], 0.003, 0.003, 0.16, 3);
        w.rotation.z = Math.PI / 2;
        w.rotation.y = side * (i - 1) * 0.2;
      }
    }
    // Rabo fofo
    sphere(group, mats.rabbit, [0, 0.45, 0.55], [0.15, 0.16, 0.15]);
    // Patas traseiras (grandes)
    for (const x of [-0.25, 0.25]) {
      box(group, mats.rabbit, [x, 0.16, 0.2], [0.16, 0.29, 0.2]);
      // Pé
      box(group, mats.rabbitShade, [x, 0.03, 0.24], [0.17, 0.06, 0.24]);
    }
  } else {
    // === Chicken ===
    // Corpo
    sphere(group, mats.chicken, [0, 0.54, 0.05], [0.48, 0.54, 0.48]);
    // Barriga clara
    sphere(group, mats.chickenShade, [0, 0.4, 0.05], [0.4, 0.3, 0.4]);
    // Cabeça
    sphere(group, mats.chicken, [0, 0.91, -0.31], [0.31, 0.31, 0.3]);
    // Crista vermelha no topo
    for (let i = 0; i < 3; i++) {
      const c = sphere(group, mats.chickenComb, [0, 1.22 + (i === 1 ? 0.04 : 0), -0.31 + (i - 1) * 0.08], [0.08, 0.1, 0.08]);
      c.scale.y = 1.2;
    }
    // Barbela (embaixo do bico)
    sphere(group, mats.chickenComb, [0, 0.74, -0.5], [0.05, 0.09, 0.05]);
    // Bico
    sphere(group, mats.beak, [0, 0.83, -0.61], [0.13, 0.09, 0.15]);
    sphere(group, mats.beakShade, [0, 0.79, -0.66], [0.09, 0.03, 0.08]);
    // Olhos
    for (const side of [-1, 1]) {
      sphere(group, mats.eyeWhite, [side * 0.13, 0.97, -0.53], [0.04, 0.045, 0.03]);
      sphere(group, mats.eyeBlack, [side * 0.13, 0.97, -0.555], [0.022, 0.026, 0.015]);
      // Asas
      const wing = sphere(group, mats.chickenShade, [side * 0.42, 0.57, -0.02], [0.16, 0.29, 0.29]);
      wing.rotation.z = side * 0.25;
      // Detalhe de penas nas asas
      for (let f = 0; f < 3; f++) {
        sphere(group, mats.chicken, [side * 0.44, 0.5 + f * 0.05, -0.05 - f * 0.03], [0.08, 0.11, 0.08]);
      }
    }
    // Penas da cauda (viradas para cima)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI - Math.PI / 2;
      const tail = sphere(group, mats.chicken, [0.15 + Math.cos(a) * 0.15, 0.85, 0.38], [0.06, 0.24, 0.14]);
      tail.rotation.z = a * 0.5;
      tail.rotation.x = -0.5;
    }
    // Pernas escamosas
    for (const x of [-0.16, 0.16]) {
      cyl(group, mats.beakShade, [x, 0.15, 0.02], 0.035, 0.04, 0.27, 6);
      // Pés
      for (let t = -1; t <= 1; t++) {
        const toe = box(group, mats.beakShade, [x + t * 0.06, 0.02, 0.06], [0.03, 0.03, 0.08]);
      }
    }
    // Pequena flor decorativa atrás
    sphere(group, mats.chickenComb, [0, 1.05, 0.28], [0.08, 0.08, 0.08]);
  }
  return group;
}

export function createCompanionSystem(scene, showToast, plantWeaponAt) {
  const panel = document.querySelector("#interaction-panel");
  const title = document.querySelector("#interaction-title");
  const hint = document.querySelector("#interaction-hint");
  const progress = document.querySelector("#interaction-progress");
  const allyCount = document.querySelector("#ally-count");
  const labels = { capybara: "Capivara", rabbit: "Coelho", chicken: "Galinha" };
  // Escolha das armas que os animais plantam — variedade garante munição útil.
  const plantKinds = ["corn", "peavolver", "hayk47", "sunflower", "pumpkin", "watermelon", "pepper"];
  const npcs = [];
  let recruitedCount = 0;
  let victoryShown = false;
  let closest = null;

  const spawnData = [
    { x: -8, z: 4, variant: 0, kind: "capybara" },
    { x: 13, z: -13, variant: 1, kind: "rabbit" },
    { x: -27, z: -8, variant: 2, kind: "chicken" },
    { x: 34, z: 20, variant: 1, kind: "capybara" },
    { x: -40, z: -5, variant: 2, kind: "rabbit" },
    { x: 15, z: 33, variant: 0, kind: "chicken" },
  ];

  spawnData.forEach((data, index) => {
    const root = new THREE.Group();
    root.position.set(data.x, 0, data.z);
    const farmer = makeFarmer(data.variant);
    root.add(farmer);
    scene.add(root);
    const barRoot = new THREE.Group();
    barRoot.position.set(0, 3.05, 0);
    const barBack = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.12),
      new THREE.MeshBasicMaterial({ color: 0x263226, side: THREE.DoubleSide })
    );
    const barFill = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 0.07),
      new THREE.MeshBasicMaterial({ color: 0xe6b94f, side: THREE.DoubleSide })
    );
    barFill.position.z = 0.01;
    barFill.position.x = -0.54;
    barFill.geometry.translate(0.54, 0, 0);
    barRoot.add(barBack, barFill);
    root.add(barRoot);
    npcs.push({
      root, barRoot, barFill, farmer, animal: null,
      kind: data.kind, recruited: false, bond: 0,
      patrolCenter: new THREE.Vector3(data.x, 0, data.z),
      target: new THREE.Vector3(data.x, 0, data.z),
      speed: 1.05 + index * 0.15,
      wait: 1 + index,
      plantTimer: 7 + index * 2,
      bob: Math.random() * Math.PI * 2,
    });
  });

  function chooseTarget(npc) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * (npc.recruited ? 10 : 7);
    npc.target.set(
      THREE.MathUtils.clamp(npc.patrolCenter.x + Math.cos(angle) * radius, -48, 48),
      0,
      THREE.MathUtils.clamp(npc.patrolCenter.z + Math.sin(angle) * radius, -48, 42)
    );
    npc.wait = 1.5 + Math.random() * 3;
  }

  // Agora os animais plantam ARMAS reais e colhíveis no mundo,
  // em vez de sprites decorativos. Usa plantCrop do seed-plants.
  function plantWeapon(npc) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 2.2;
    const x = THREE.MathUtils.clamp(npc.root.position.x + Math.cos(angle) * radius, -50, 50);
    const z = THREE.MathUtils.clamp(npc.root.position.z + Math.sin(angle) * radius, -50, 45);
    const kind = plantKinds[Math.floor(Math.random() * plantKinds.length)];
    if (typeof plantWeaponAt === "function") {
      plantWeaponAt(x, z, kind, true);
      showToast(labels[npc.kind] + " plantou uma " + kind.toUpperCase() + " colhível!");
    }
  }

  const pollenClouds = [];

  function addPollenCloud(position, kind, quality = 1, options = {}) {
    const strengths = { corn: 0.18, sunflower: 0.32, pumpkin: 0.48, peavolver: 0.15, hayk47: 0.22, watermelon: 0.28 };
    const colors = { corn: 0xe9c34f, sunflower: 0xf2cf55, pumpkin: 0xe98239, peavolver: 0x6ab04c, hayk47: 0xd4a843, watermelon: 0x2e7d32 };
    const cloud = new THREE.Group();
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: colors[kind] || 0xe9c34f, transparent: true, opacity: 0.34,
      depthWrite: false,
    });
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.72 + Math.random() * 0.28, 9, 7), cloudMaterial);
      puff.position.set((Math.random() - 0.5) * 1.4, 0.8 + Math.random() * 1.2, (Math.random() - 0.5) * 1.4);
      cloud.add(puff);
    }
    cloud.position.copy(position);
    cloud.position.y = 0.15;
    scene.add(cloud);
    pollenClouds.push({
      root: cloud, age: 0,
      duration: options.duration ?? 2.8,
      radius: options.radius ?? 5.2,
      strength: (strengths[kind] || 0.18) * quality,
      affected: new Set(),
    });
  }

  function tryDirectHit(position, kind) {
    let nearest = null;
    let nearestDistance = 1.15;
    for (const npc of npcs) {
      if (npc.recruited) continue;
      const head = new THREE.Vector3(npc.root.position.x, npc.root.position.y + 1.15, npc.root.position.z);
      const distance = position.distanceTo(head);
      if (distance < nearestDistance) { nearestDistance = distance; nearest = npc; }
    }
    if (!nearest) return false;
    addPollenCloud(
      new THREE.Vector3(nearest.root.position.x, 0.15, nearest.root.position.z),
      kind, 1, { radius: 1.6, duration: 0.5 }
    );
    return true;
  }

  function setInteractionVisible(visible) {
    if (panel) panel.classList.toggle("visible", visible);
  }

  function update(delta, playerPosition, keys, active) {
    let nearest = null;
    let nearestDistance = Infinity;
    for (const npc of npcs) {
      if (npc.recruited) continue;
      const distance = Math.hypot(
        playerPosition.x - npc.root.position.x,
        playerPosition.z - npc.root.position.z
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = npc;
      }
    }

    closest = nearestDistance < 4.8 ? nearest : null;
    if (closest && active) {
      setInteractionVisible(true);
      if (title) title.textContent = "PÓLEN: " + labels[closest.kind].toUpperCase();
      if (progress) progress.style.width = (closest.bond * 100).toFixed(0) + "%";
      if (hint) hint.textContent = "APROXIME UMA NUVEM DE PÓLEN";
    } else {
      setInteractionVisible(false);
    }

    for (let i = pollenClouds.length - 1; i >= 0; i--) {
      const cloud = pollenClouds[i];
      cloud.age += delta;
      const fade = Math.max(0, 1 - cloud.age / cloud.duration);
      cloud.root.scale.setScalar(0.65 + (1 - fade) * 0.65);
      cloud.root.children.forEach((puff) => { puff.material.opacity = 0.34 * fade; });
      for (const npc of npcs) {
        if (npc.recruited || cloud.affected.has(npc)) continue;
        const distance = Math.hypot(
          npc.root.position.x - cloud.root.position.x,
          npc.root.position.z - cloud.root.position.z
        );
        if (distance < cloud.radius) {
          npc.bond = THREE.MathUtils.clamp(npc.bond + cloud.strength, 0, 1);
          cloud.affected.add(npc);
          if (npc.bond >= 1) {
            npc.recruited = true;
            npc.root.remove(npc.farmer);
            npc.animal = makeAnimal(npc.kind);
            npc.root.add(npc.animal);
            npc.barRoot.visible = false;
            npc.patrolCenter.copy(npc.root.position);
            npc.plantTimer = 3.5;
            recruitedCount += 1;
            if (allyCount) allyCount.textContent = String(recruitedCount);
            playTransform();
            showToast(npc.kind === "chicken"
              ? "🐔 CAPTURE THAT CHICKEN — galinha aliada conquistada!"
              : labels[npc.kind] + " virou um animal aliado!");
            if (recruitedCount >= npcs.length && !victoryShown) {
              victoryShown = true;
              playVictory();
              window.setTimeout(() => showToast("🌾 FAZENDA 100% CONVERTIDA — todos os fazendeiros são seus aliados!"), 900);
            }
          }
        }
      }
      if (cloud.age >= cloud.duration) {
        scene.remove(cloud.root);
        pollenClouds.splice(i, 1);
      }
    }

    for (const npc of npcs) {
      if (!npc.recruited) {
        npc.barRoot.lookAt(playerPosition.x, playerPosition.y + 1.2, playerPosition.z);
        npc.barFill.scale.x = Math.max(0.001, npc.bond);
        npc.barFill.position.x = -0.54 + 0.54 * npc.bond;
      }
    }

    for (const npc of npcs) {
      npc.bob += delta * (npc.recruited ? 5.5 : 3.4);
      if (npc.wait > 0) npc.wait -= delta;
      const dx = npc.target.x - npc.root.position.x;
      const dz = npc.target.z - npc.root.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 0.3 && npc.wait <= 0) {
        const step = Math.min(distance, npc.speed * (npc.recruited ? 1.2 : 0.65) * delta);
        npc.root.position.x += (dx / distance) * step;
        npc.root.position.z += (dz / distance) * step;
        npc.root.rotation.y = Math.atan2(dx, dz);
      } else if (distance <= 0.3 && npc.wait <= 0) {
        chooseTarget(npc);
      }
      if (npc.wait <= 0 && distance <= 0.3) chooseTarget(npc);
      npc.root.position.y = Math.sin(npc.bob) * (npc.recruited ? 0.035 : 0.018);
      if (npc.recruited) {
        npc.plantTimer -= delta;
        if (npc.plantTimer <= 0) {
          plantWeapon(npc);
          npc.plantTimer = 13 + Math.random() * 6;
          chooseTarget(npc);
        }
      }
    }
  }

  return { update, addPollenCloud, tryDirectHit };
           }
