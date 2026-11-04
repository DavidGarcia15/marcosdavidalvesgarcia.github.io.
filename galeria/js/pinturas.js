/*
 * Galeria Marcos David — pinturas-portal
 * ------------------------------------------
 * Posiciona as quatro molduras, identifica a obra observada pela mira
 * central (raycaster) e conduz a aproximação cinematográfica até o
 * painel curatorial específico de cada pintura.
 */

import { SALA, PINTURAS } from "./config.js";
import { texturaEmPreparacao } from "./texturas.js";

const DURACAO_APROXIMAR = 2.2;
const DURACAO_AFASTAR = 1.1;
const DIST_APROXIMACAO = 2.5;
const LARGURA_TELA = 2.6;
const ALTURA_TELA = 2.08;
const Y_CENTRO = 2.75;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

function montarPainelHTML(p) {
  const observacoes = (p.observar || [])
    .map((item) => "<li>" + escaparHTML(item) + "</li>")
    .join("");

  const contexto = p.contextoHistorico
    ? '<section class="painel-secao"><h3>Contexto histórico</h3><p>' +
      escaparHTML(p.contextoHistorico) + "</p></section>"
    : "";

  const blocoObservacao = observacoes
    ? '<section class="painel-secao"><h3>O que observar</h3><ul class="painel-lista-observacao">' +
      observacoes + "</ul></section>"
    : "";

  const conexao = p.conexaoGaleria
    ? '<aside class="painel-destaque"><span>Por que esta obra está na galeria?</span><p>' +
      escaparHTML(p.conexaoGaleria) + "</p></aside>"
    : "";

  const notaCuratorial = p.creditoCuratorial
    ? '<p class="painel-nota">' + escaparHTML(p.creditoCuratorial) + "</p>"
    : "";

  const linkMuseu = p.linkSaibaMais
    ? '<a class="btn-painel" href="' + escaparHTML(p.linkSaibaMais) +
      '" target="_blank" rel="noopener noreferrer">' +
      escaparHTML(p.linkSaibaMaisTexto || "Consultar fonte do museu") + "</a>"
    : "";

  const linkImagem = p.fonteImagem
    ? '<a class="painel-link-fonte" href="' + escaparHTML(p.fonteImagem) +
      '" target="_blank" rel="noopener noreferrer">Crédito e licença da reprodução</a>'
    : "";

  return [
    '<p class="painel-tema">', escaparHTML(p.tema), "</p>",
    "<h2>", escaparHTML(p.titulo), "</h2>",
    '<p class="painel-artista">', escaparHTML(p.artista), " · ", escaparHTML(p.ano), "</p>",
    '<p class="painel-intro">', escaparHTML(p.textoIntro), "</p>",
    contexto,
    blocoObservacao,
    conexao,
    notaCuratorial,
    '<p class="painel-credito">', escaparHTML(p.creditoImagem || ""), "</p>",
    '<div class="painel-links">', linkMuseu, linkImagem, "</div>",
  ].join("");
}

export function criarGerenciadorPinturas(THREE, { scene, camera, aoMudarBloqueio }) {
  const raycaster = new THREE.Raycaster();
  raycaster.far = 15;
  const centro = new THREE.Vector2(0, 0);

  const matDourado = new THREE.MeshStandardMaterial({ color: 0xb8914a, metalness: 0.65, roughness: 0.3 });
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  const objetosInterativos = [];
  const registros = [];

  PINTURAS.forEach((p, indice) => {
    const ehOeste = p.parede === "oeste";
    const x = ehOeste ? -SALA.meiaLargura + 0.07 : SALA.meiaLargura - 0.07;
    const normal = ehOeste ? 1 : -1;
    const larguraTela = p.largura || LARGURA_TELA;
    const alturaTela = p.altura || ALTURA_TELA;

    const grupo = new THREE.Group();
    grupo.position.set(x, Y_CENTRO, p.z);
    grupo.rotation.y = ehOeste ? Math.PI / 2 : -Math.PI / 2;

    const moldura = new THREE.Mesh(
      new THREE.BoxGeometry(larguraTela + 0.2, alturaTela + 0.2, 0.1),
      matDourado
    );
    moldura.position.z = -0.05;
    grupo.add(moldura);

    let matTela;
    if (p.implementada) {
      matTela = new THREE.MeshStandardMaterial({ color: 0x0c1830, roughness: 0.6 });
      loader.load(
        p.imagem,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          matTela.map = tex;
          matTela.color.set(0xffffff);
          matTela.needsUpdate = true;
        },
        undefined,
        (erro) => {
          console.warn("Não foi possível carregar a reprodução de " + p.titulo, erro);
          matTela.color.set(0x24324a);
          matTela.needsUpdate = true;
        }
      );
    } else {
      matTela = new THREE.MeshStandardMaterial({
        map: texturaEmPreparacao(THREE, p),
        roughness: 0.7,
      });
    }

    const tela = new THREE.Mesh(new THREE.PlaneGeometry(larguraTela, alturaTela), matTela);
    tela.position.z = 0.01;
    grupo.add(tela);

    scene.add(grupo);

    // Cada obra recebe um foco de luz próprio, com temperatura ajustada à paleta.
    const spot = new THREE.SpotLight(
      p.corLuz ?? 0xffe3b0,
      p.intensidadeLuz ?? (p.implementada ? 26 : 14),
      9,
      Math.PI / 7,
      0.45,
      1.6
    );
    spot.position.set(x + normal * 1.1, Y_CENTRO + 2.1, p.z + 0.4);
    spot.target = grupo;
    scene.add(spot);
    scene.add(spot.target);

    // Plano invisível um pouco maior que a moldura para facilitar a mira.
    const alvo = new THREE.Mesh(
      new THREE.PlaneGeometry(larguraTela + 0.5, alturaTela + 0.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    alvo.position.copy(grupo.position);
    alvo.rotation.copy(grupo.rotation);
    alvo.userData.indicePintura = indice;
    scene.add(alvo);
    objetosInterativos.push(alvo);

    const posAproximacao = new THREE.Vector3(x + normal * DIST_APROXIMACAO, Y_CENTRO, p.z);
    const yawAlvo = ehOeste ? Math.PI / 2 : -Math.PI / 2;
    const quatAproximacao = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawAlvo, 0, "YXZ"));

    registros.push({ config: p, posAproximacao, quatAproximacao });
  });

  // ---------- Elementos de UI ----------
  const dica = document.getElementById("dica-interacao");
  const painel = document.getElementById("painel-pintura");
  const painelConteudo = painel ? painel.querySelector(".painel-conteudo") : null;
  const vinheta = document.getElementById("vinheta");
  const aviso = document.getElementById("aviso-temp");
  const botaoFechar = document.getElementById("fechar-painel");

  let estado = "livre"; // livre | aproximando | painel-aberto | afastando
  let alvoAtual = null;
  let tempoTransicao = 0;
  let origemPos = new THREE.Vector3();
  let origemQuat = new THREE.Quaternion();
  let registroAtivo = null;
  let timeoutAviso = null;

  function mostrarAviso(texto) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.add("visivel");
    clearTimeout(timeoutAviso);
    timeoutAviso = setTimeout(() => aviso.classList.remove("visivel"), 2200);
  }

  function tentarInteragir() {
    if (estado !== "livre" || !alvoAtual) return;
    const registro = registros[alvoAtual.userData.indicePintura];

    if (!registro.config.implementada) {
      mostrarAviso('"' + registro.config.titulo + '" — exposição em preparação. Volte em breve.');
      return;
    }

    registroAtivo = registro;
    origemPos.copy(camera.position);
    origemQuat.copy(camera.quaternion);
    estado = "aproximando";
    tempoTransicao = 0;
    if (dica) dica.classList.remove("visivel");
    if (vinheta) vinheta.classList.add("ativa");
    aoMudarBloqueio(true);
  }

  function fechar() {
    if (estado !== "painel-aberto") return;
    estado = "afastando";
    tempoTransicao = 0;
    if (painel) painel.classList.remove("aberto");
  }

  if (botaoFechar) botaoFechar.addEventListener("click", fechar);
  if (painel) {
    painel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fechar();
    });
  }

  function atualizar(dt) {
    if (estado === "livre") {
      raycaster.setFromCamera(centro, camera);
      const hits = raycaster.intersectObjects(objetosInterativos);
      if (hits.length) {
        alvoAtual = hits[0].object;
        const registro = registros[alvoAtual.userData.indicePintura];
        if (dica) {
          dica.textContent = registro.config.implementada
            ? registro.config.titulo + " — toque ou clique para se aproximar"
            : registro.config.titulo + " — em preparação";
          dica.classList.add("visivel");
        }
      } else {
        alvoAtual = null;
        if (dica) dica.classList.remove("visivel");
      }
      return;
    }

    if (estado === "aproximando" || estado === "afastando") {
      tempoTransicao += dt;
      const duracao = estado === "aproximando" ? DURACAO_APROXIMAR : DURACAO_AFASTAR;
      const t = Math.min(1, tempoTransicao / duracao);
      const te = easeInOutCubic(t);

      if (estado === "aproximando") {
        camera.position.lerpVectors(origemPos, registroAtivo.posAproximacao, te);
        camera.quaternion.slerpQuaternions(origemQuat, registroAtivo.quatAproximacao, te);
      } else {
        camera.position.lerpVectors(registroAtivo.posAproximacao, origemPos, te);
        camera.quaternion.slerpQuaternions(registroAtivo.quatAproximacao, origemQuat, te);
      }

      if (t >= 1) {
        if (estado === "aproximando") {
          estado = "painel-aberto";
          if (painelConteudo) painelConteudo.innerHTML = montarPainelHTML(registroAtivo.config);
          if (painel) {
            painel.classList.add("aberto");
            painel.focus();
          }
        } else {
          estado = "livre";
          registroAtivo = null;
          if (vinheta) vinheta.classList.remove("ativa");
          aoMudarBloqueio(false);
        }
      }
    }
  }

  return { atualizar, tentarInteragir, estaOcupado: () => estado !== "livre" };
}
