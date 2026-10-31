/*
 * Galeria Marcos David — controles de movimentação
 * ----------------------------------------------------
 * Primeira pessoa com aceleração/desaceleração suaves e colisão simples
 * contra as paredes e colunas do salão (ver cena.js / config.js).
 * Computador: WASD/setas + mouse (Pointer Lock). Celular: joystick virtual
 * + arraste para olhar. "bloquear(true)" pausa o input durante a
 * aproximação cinematográfica de uma pintura (ver pinturas.js).
 */

import { SALA } from "./config.js";

const VELOCIDADE_MAX = 3.3;
const ACELERACAO = 9;
const SENSIBILIDADE_MOUSE = 0.0022;
const SENSIBILIDADE_TOQUE = 0.0045;
const LIMITE_PITCH = Math.PI / 2 - 0.08;

export function criarControles(THREE, { camera, domElement, colunas, aoInteragir }) {
  const margemParede = SALA.raioJogador + 0.35;
  const minDistColuna = SALA.raioColuna + SALA.raioJogador + 0.08;

  let yaw = 0;
  let pitch = 0;
  let bloqueado = false;
  const vel = new THREE.Vector2(0, 0);

  // ---------- Teclado ----------
  const teclas = { w: false, a: false, s: false, d: false };
  const MAPA_TECLAS = {
    KeyW: "w", ArrowUp: "w",
    KeyA: "a", ArrowLeft: "a",
    KeyS: "s", ArrowDown: "s",
    KeyD: "d", ArrowRight: "d",
  };

  function aoApertarTecla(e) {
    const t = MAPA_TECLAS[e.code];
    if (t) teclas[t] = true;
    if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && !bloqueado) {
      aoInteragir();
    }
  }
  function aoSoltarTecla(e) {
    const t = MAPA_TECLAS[e.code];
    if (t) teclas[t] = false;
  }
  window.addEventListener("keydown", aoApertarTecla);
  window.addEventListener("keyup", aoSoltarTecla);

  // ---------- Mouse / Pointer Lock ----------
  function aoMoverMouse(e) {
    if (bloqueado || document.pointerLockElement !== domElement) return;
    yaw -= e.movementX * SENSIBILIDADE_MOUSE;
    pitch -= e.movementY * SENSIBILIDADE_MOUSE;
    pitch = Math.max(-LIMITE_PITCH, Math.min(LIMITE_PITCH, pitch));
  }
  document.addEventListener("mousemove", aoMoverMouse);

  function solicitarPointerLock() {
    if (domElement.requestPointerLock) domElement.requestPointerLock();
  }

  domElement.addEventListener("click", () => {
    if (bloqueado) return;
    if (document.pointerLockElement !== domElement) {
      solicitarPointerLock();
    } else {
      aoInteragir();
    }
  });

  // ---------- Toque (joystick + olhar) ----------
  const ehToque = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const joyBase = document.getElementById("joystick-base");
  const joyNub = document.getElementById("joystick-nub");
  const areaOlhar = document.getElementById("camada-olhar");
  const botaoInteragir = document.getElementById("botao-interagir");

  let joyAtivo = false;
  let joyId = null;
  let joyInput = { x: 0, y: 0 };
  let olharId = null;
  let olharUltimo = { x: 0, y: 0 };

  if (ehToque && joyBase && joyNub && areaOlhar) {
    const RAIO_MAX = 42;

    joyBase.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      joyId = t.identifier;
      joyAtivo = true;
      e.preventDefault();
    });

    window.addEventListener(
      "touchmove",
      (e) => {
        for (const t of e.changedTouches) {
          if (t.identifier === joyId) {
            const rect = joyBase.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            let dx = t.clientX - cx;
            let dy = t.clientY - cy;
            const dist = Math.min(RAIO_MAX, Math.hypot(dx, dy));
            const ang = Math.atan2(dy, dx);
            dx = Math.cos(ang) * dist;
            dy = Math.sin(ang) * dist;
            joyNub.style.transform = `translate(${dx}px, ${dy}px)`;
            joyInput.x = dx / RAIO_MAX;
            joyInput.y = -dy / RAIO_MAX;
          } else if (t.identifier === olharId && !bloqueado) {
            const dx = t.clientX - olharUltimo.x;
            const dy = t.clientY - olharUltimo.y;
            yaw -= dx * SENSIBILIDADE_TOQUE;
            pitch -= dy * SENSIBILIDADE_TOQUE;
            pitch = Math.max(-LIMITE_PITCH, Math.min(LIMITE_PITCH, pitch));
            olharUltimo = { x: t.clientX, y: t.clientY };
          }
        }
      },
      { passive: true }
    );

    window.addEventListener("touchend", (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === joyId) {
          joyAtivo = false;
          joyId = null;
          joyInput = { x: 0, y: 0 };
          joyNub.style.transform = "translate(0px, 0px)";
        }
        if (t.identifier === olharId) olharId = null;
      }
    });

    areaOlhar.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      if (olharId === null) {
        olharId = t.identifier;
        olharUltimo = { x: t.clientX, y: t.clientY };
      }
    });
  }

  if (botaoInteragir) {
    botaoInteragir.addEventListener("click", () => {
      if (!bloqueado) aoInteragir();
    });
  }

  document.addEventListener("pointerlockchange", () => {
    document.body.classList.toggle("ponteiro-travado", document.pointerLockElement === domElement);
  });

  // ---------- Colisão ----------
  function resolverColisao(pos) {
    pos.x = Math.max(-SALA.meiaLargura + margemParede, Math.min(SALA.meiaLargura - margemParede, pos.x));
    pos.z = Math.max(-SALA.meiaProfundidade + margemParede, Math.min(SALA.meiaProfundidade - margemParede, pos.z));
    for (const col of colunas) {
      const dx = pos.x - col.x;
      const dz = pos.z - col.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.0001 && dist < minDistColuna) {
        const falta = minDistColuna - dist;
        pos.x += (dx / dist) * falta;
        pos.z += (dz / dist) * falta;
      }
    }
  }

  // ---------- Atualização por quadro ----------
  function atualizar(dt) {
    // Enquanto bloqueado (aproximação cinematográfica ou painel aberto),
    // quem comanda a câmera é pinturas.js — não tocar em rotation aqui.
    if (bloqueado) return;

    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch, yaw, 0);

    let ix = joyAtivo ? joyInput.x : (teclas.d ? 1 : 0) - (teclas.a ? 1 : 0);
    let iz = joyAtivo ? joyInput.y : (teclas.w ? 1 : 0) - (teclas.s ? 1 : 0);
    const len = Math.hypot(ix, iz);
    if (len > 1) {
      ix /= len;
      iz /= len;
    }

    const fx = -Math.sin(yaw);
    const fz = -Math.cos(yaw);
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);

    const desejadoX = (fx * iz + rx * ix) * VELOCIDADE_MAX;
    const desejadoZ = (fz * iz + rz * ix) * VELOCIDADE_MAX;

    const k = Math.min(1, ACELERACAO * dt);
    vel.x += (desejadoX - vel.x) * k;
    vel.y += (desejadoZ - vel.y) * k;

    camera.position.x += vel.x * dt;
    camera.position.z += vel.y * dt;
    resolverColisao(camera.position);
  }

  function bloquear(sim) {
    bloqueado = sim;
    if (!sim) {
      // evita salto de câmera: realinha yaw/pitch com a posição em que a
      // câmera ficou ao final da animação cinematográfica.
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      yaw = euler.y;
      pitch = euler.x;
      vel.set(0, 0);
    }
  }

  return { atualizar, bloquear, solicitarPointerLock, ehToque };
}
