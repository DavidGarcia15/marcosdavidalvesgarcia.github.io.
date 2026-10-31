/*
 * Galeria Marcos David — ponto de entrada
 * -------------------------------------------
 * Liga cena.js (arquitetura/iluminação), controles.js (movimento) e
 * pinturas.js (interação com as obras). Também cuida da tela de
 * carregamento, do cartão de introdução/controles e do modo alternativo
 * para dispositivos sem suporte a WebGL.
 */

import { criarCena } from "./cena.js";
import { criarControles } from "./controles.js";
import { criarGerenciadorPinturas } from "./pinturas.js";

function suportaWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

async function iniciar() {
  const telaCarregamento = document.getElementById("tela-carregamento");
  const fallback = document.getElementById("fallback-sem-webgl");

  if (!suportaWebGL()) {
    if (telaCarregamento) telaCarregamento.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  const THREE = await import("three");

  const canvas = document.getElementById("canvas-galeria");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.65, 6.4);

  const { scene, atualizarParticulas, colunas } = criarCena(THREE);

  // referência preenchida após a criação do gerenciador de pinturas —
  // os controles precisam do callback de interação antes dele existir.
  let gerenciadorPinturas = null;

  const controles = criarControles(THREE, {
    camera,
    domElement: renderer.domElement,
    colunas,
    aoInteragir: () => gerenciadorPinturas && gerenciadorPinturas.tentarInteragir(),
  });

  gerenciadorPinturas = criarGerenciadorPinturas(THREE, {
    scene,
    camera,
    aoMudarBloqueio: (bloqueado) => controles.bloquear(bloqueado),
  });

  document.body.classList.toggle("modo-toque", controles.ehToque);

  // ---------- Overlay de introdução ----------
  const introducao = document.getElementById("introducao");
  const botaoEntrar = document.getElementById("botao-entrar");
  if (botaoEntrar) {
    botaoEntrar.addEventListener("click", () => {
      if (introducao) introducao.classList.add("escondido");
      if (!controles.ehToque) controles.solicitarPointerLock();
    });
  }

  if (telaCarregamento) telaCarregamento.hidden = true;

  // ---------- Loop de renderização ----------
  const reduzMovimento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const relogio = new THREE.Clock();

  function quadro() {
    const dt = Math.min(0.1, relogio.getDelta());
    controles.atualizar(dt);
    gerenciadorPinturas.atualizar(dt);
    atualizarParticulas(relogio.elapsedTime, reduzMovimento);
    renderer.render(scene, camera);
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

iniciar();
