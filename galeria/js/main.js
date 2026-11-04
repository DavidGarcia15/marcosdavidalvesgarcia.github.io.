/*
 * Galeria Marcos David — ponto de entrada
 * -------------------------------------------
 * Liga cena.js (arquitetura/iluminação), controles.js (movimento) e
 * pinturas.js (interação com as obras). Também cuida da tela de
 * carregamento, do cartão de introdução/controles, da qualidade gráfica
 * adaptativa e do modo alternativo para quando o 3D realmente não puder
 * ser inicializado.
 *
 * Importante: a mensagem de "sem suporte a 3D" só deve aparecer quando a
 * inicialização de fato falhar — nunca com base no tipo de aparelho
 * (celular vs. computador) ou em hardware modesto. Para hardware modesto,
 * a resposta é reduzir a qualidade gráfica (ver detectarNivelGrafico),
 * não desligar o 3D.
 */

import { criarCena } from "./cena.js";
import { criarControles } from "./controles.js";
import { criarGerenciadorPinturas } from "./pinturas.js";

// ---------- Deteção de suporte a WebGL ----------
// Testa WebGL2 primeiro, depois WebGL1 com os dois nomes de contexto que
// navegadores já usaram ("webgl" e, em versões mais antigas,
// "experimental-webgl"). Cria um canvas descartável só para o teste — não
// interfere com o canvas real da galeria.
function detectarSuporteWebGL() {
  if (!window.WebGLRenderingContext) return false;
  const c = document.createElement("canvas");
  for (const tipo of ["webgl2", "webgl", "experimental-webgl"]) {
    try {
      const gl = c.getContext(tipo);
      if (gl) {
        const ext = gl.getExtension && gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
        return true;
      }
    } catch (e) {
      // segue tentando o próximo tipo de contexto
    }
  }
  return false;
}

// ---------- Nível gráfico adaptativo ----------
// Heurística simples e deliberadamente conservadora: só reduz qualidade
// (sombras, partículas, resolução de textura, pixel ratio). Nunca usa isto
// para decidir SE o 3D roda — só COMO ele roda.
function detectarNivelGrafico() {
  const nucleos = navigator.hardwareConcurrency || 4;
  const memoria = navigator.deviceMemory || 4; // GB — só existe em navegadores Chromium
  const telaPequena = Math.min(window.innerWidth, window.innerHeight) < 480;
  const pontuacao = nucleos + memoria;

  if (pontuacao <= 5 || telaPequena) return "baixo";
  if (pontuacao <= 9) return "medio";
  return "alto";
}

function mostrarFallback(mensagem) {
  const telaCarregamento = document.getElementById("tela-carregamento");
  const fallback = document.getElementById("fallback-sem-webgl");
  if (telaCarregamento) telaCarregamento.hidden = true;
  if (fallback) {
    fallback.hidden = false;
    const p = fallback.querySelector("p");
    if (p && mensagem) p.textContent = mensagem;
  }
}

async function iniciar() {
  // Em telas móveis com toque, não inicializa Three.js nem cria o loop WebGL.
  // A versão 2D mantém as obras e o conteúdo curatorial com custo gráfico baixo.
  const ehCelular = (navigator.maxTouchPoints > 0 || "ontouchstart" in window) &&
    window.matchMedia("(max-width: 760px)").matches;
  if (ehCelular) {
    document.body.classList.add("modo-mobile");
    document.getElementById("canvas-galeria").hidden = true;
    document.getElementById("tela-carregamento").hidden = true;
    document.getElementById("introducao").hidden = true;
    const mobile = document.getElementById("mobile-gallery");
    if (mobile) mobile.hidden = false;
    const { iniciarGaleriaMobile } = await import("./mobile.js");
    iniciarGaleriaMobile();
    return;
  }

  if (!detectarSuporteWebGL()) {
    mostrarFallback(
      "Este navegador ou dispositivo não conseguiu iniciar o WebGL, necessário para a experiência 3D do museu virtual. Você ainda pode explorar todo o conteúdo do portfólio nas páginas abaixo."
    );
    return;
  }

  const nivel = detectarNivelGrafico();
  const telaCarregamento = document.getElementById("tela-carregamento");

  try {
    const THREE = await import("three");

    const canvas = document.getElementById("canvas-galeria");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: nivel !== "baixo",
      powerPreference: "high-performance",
    });
    const tetoPixelRatio = nivel === "alto" ? 2 : nivel === "medio" ? 1.5 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tetoPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = nivel !== "baixo";
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.65, 6.4);
    camera.rotation.y = 0; // apresentação inicial voltada para dentro do salão

    const { scene, atualizarParticulas, colunas } = criarCena(THREE, nivel);

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
    let quadroComErro = false;

    function quadro() {
      try {
        const dt = Math.min(0.1, relogio.getDelta());
        controles.atualizar(dt);
        gerenciadorPinturas.atualizar(dt);
        atualizarParticulas(relogio.elapsedTime, reduzMovimento);
        renderer.render(scene, camera);
      } catch (erro) {
        if (!quadroComErro) {
          quadroComErro = true;
          console.error("Galeria 3D — erro durante a renderização:", erro);
          mostrarFallback(
            "A experiência 3D encontrou um problema durante a exibição e foi interrompida. Você ainda pode explorar todo o conteúdo do portfólio nas páginas abaixo."
          );
        }
        return;
      }
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (erro) {
    // Cobre: falha ao buscar o módulo do Three.js (ex.: sem rede), falha ao
    // criar o WebGLRenderer (contexto negado apesar do teste inicial) ou
    // qualquer erro durante a montagem da cena/controles.
    console.error("Galeria 3D — falha na inicialização:", erro);
    mostrarFallback(
      "Não foi possível carregar a experiência 3D neste momento. Você ainda pode explorar todo o conteúdo do portfólio nas páginas abaixo."
    );
  }
}

iniciar();
