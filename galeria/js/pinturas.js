/*
 * Galeria Marcos David — pinturas-portal
 * ------------------------------------------
 * Posiciona as quatro molduras, identifica a obra observada pela mira
 * central (raycaster) e conduz a aproximação cinematográfica até o
 * painel curatorial específico de cada pintura.
 */

import { SALA, PINTURAS } from "./config.js";
import { SALAS_MUSEU } from "./salas.js";
import { texturaEmPreparacao } from "./texturas.js";
import { criarPersonagem } from "./personagens.js";
import { criarGuiaIA } from "./guia.js";
import { responderAtena } from "./atena.js";
import { criarTocaDiscos } from "./toca-discos.js";

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

function montarPainelPersonagem(perfil) {
  return [
    '<p class="painel-tema">Encontro no museu</p>',
    "<h2>", escaparHTML(perfil.nome), "</h2>",
    '<p class="painel-artista">', escaparHTML(perfil.papel), "</p>",
    '<p class="painel-intro">', escaparHTML(perfil.fala), "</p>",
    '<section class="painel-secao"><h3>Uma curiosidade</h3><p>',
    escaparHTML(perfil.curiosidade), "</p></section>",
    '<p class="painel-nota">Esta é uma representação 3D estilizada, criada para a experiência educativa do museu.</p>'
  ].join("");
}

function montarPainelSala(sala) {
  const topicos = (sala.temas || [])
    .map((tema) => "<li>" + escaparHTML(tema) + "</li>")
    .join("");
  return [
    '<p class="painel-tema">', escaparHTML(sala.setor), "</p>",
    "<h2>", escaparHTML(sala.titulo), "</h2>",
    '<p class="painel-intro">', escaparHTML(sala.descricao), "</p>",
    '<section class="painel-secao"><h3>Temas desta sala</h3><ul class="painel-lista-observacao">',
    topicos,
    "</ul></section>",
    '<aside class="painel-destaque"><span>Proposta de exploração</span><p>',
    escaparHTML(sala.convite),
    "</p></aside>",
    '<p class="painel-nota">', escaparHTML(sala.orientacao), "</p>",
  ].join("");
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

export function criarGerenciadorPinturas(THREE, { scene, camera, aoMudarBloqueio, alvosSalas = [] }) {
  const raycaster = new THREE.Raycaster();
  raycaster.far = 15;
  const centro = new THREE.Vector2(0, 0);

  const matDourado = new THREE.MeshStandardMaterial({ color: 0xb8914a, metalness: 0.65, roughness: 0.3 });
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  const objetosInterativos = [...alvosSalas];
  const registros = [];
  const destinosGuia = [];
  const guiaIA = criarGuiaIA(THREE, scene);
  objetosInterativos.push(guiaIA.alvo);
  const tocaDiscos = criarTocaDiscos(THREE, scene);
  objetosInterativos.push(tocaDiscos.alvo);

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
      p.intensidadeLuz ?? (p.implementada ? 34 : 19),
      11,
      Math.PI / 6,
      0.58,
      1.6
    );
    spot.position.set(x + normal * 1.35, Y_CENTRO + 2.45, p.z + 0.4);
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
    // Rota independente: pontos internos próximos de cada obra.
    destinosGuia.push({ posicao: new THREE.Vector3(x + normal * 3.8, 0, p.z), yaw: Math.atan2(-normal, 0) });
    const yawAlvo = ehOeste ? Math.PI / 2 : -Math.PI / 2;
    const quatAproximacao = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawAlvo, 0, "YXZ"));

    registros.push({ tipo: "pintura", config: p, posAproximacao, quatAproximacao });

    const personagem = criarPersonagem(THREE, p, scene);
    if (personagem) {
      personagem.alvo.userData.posAproximacao = personagem.posAproximacao;
      personagem.alvo.userData.quatAproximacao = personagem.quatAproximacao;
      registros[indice].personagem = personagem;
    }
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

  function responderGuia(pergunta) {
    return responderAtena(pergunta);
  }

  function adicionarRespostaAtena(mensagens, resultado) {
    const resposta = document.createElement("div");
    resposta.className = "guia-mensagem";
    resposta.textContent = resultado.texto;
    mensagens.appendChild(resposta);

    if (resultado.fontes && resultado.fontes.length) {
      const fontes = document.createElement("div");
      fontes.className = "guia-fontes";
      resultado.fontes.forEach((fonte) => {
        const link = document.createElement("a");
        link.href = fonte.url;
        link.textContent = fonte.texto;
        if (/^https?:/i.test(fonte.url)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        fontes.appendChild(link);
      });
      mensagens.appendChild(fontes);
    }
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  function abrirGuia() {
    if (!painelConteudo) return;
    painelConteudo.innerHTML = [
      '<div class="guia-chat">',
      '<div class="guia-chat-cabecalho"><span class="guia-avatar">A</span><div><strong>Atena</strong><small>Guia virtual · acervo curado</small></div></div>',
      '<div class="guia-mensagens" id="guia-mensagens"><div class="guia-mensagem">Olá! Sou Atena. Agora posso responder sobre a trajetória, as conquistas, os interesses e as obras deste museu. Também posso indicar fontes para você conferir.</div></div>',
      '<div class="guia-sugestoes" aria-label="Sugestões de perguntas"><button type="button" data-pergunta="Onde ficam as novas salas?">Mapa do museu</button><button type="button" data-pergunta="O que posso explorar na Sala de Raciocínio?">Sala de Raciocínio</button><button type="button" data-pergunta="Quem pintou A Noite Estrelada?">As pinturas</button></div>',
      '<form class="guia-form" id="guia-form"><input id="guia-pergunta" type="text" maxlength="240" placeholder="Escreva sua pergunta..." autocomplete="off" required><button type="submit">Enviar</button></form>',
      '<p class="guia-aviso">Respostas baseadas em um acervo curado do próprio portfólio. Não sou uma IA generativa; quando possível, apresento fontes para consulta.</p>',
      '</div>'
    ].join("");
    estado = "painel-aberto";
    if (dica) dica.classList.remove("visivel");
    if (painel) {
      painel.classList.add("aberto");
      painel.focus();
    }
    aoMudarBloqueio(true);
    const form = document.getElementById("guia-form");
    const input = document.getElementById("guia-pergunta");
    const mensagens = document.getElementById("guia-mensagens");
    painelConteudo.querySelectorAll("[data-pergunta]").forEach((botao) => {
      botao.addEventListener("click", () => {
        input.value = botao.getAttribute("data-pergunta");
        form.requestSubmit();
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const pergunta = input.value.trim();
      if (!pergunta) return;
      const visitante = document.createElement("div");
      visitante.className = "guia-mensagem visitante";
      visitante.textContent = pergunta;
      mensagens.appendChild(visitante);
      adicionarRespostaAtena(mensagens, responderGuia(pergunta));
      input.value = "";
      input.focus();
    });
    input.focus();
  }

  function tentarInteragir() {
    if (estado !== "livre" || !alvoAtual) return;
    if (alvoAtual.userData.tipoInteracao === "sala") {
      const sala = SALAS_MUSEU.find((item) => item.id === alvoAtual.userData.salaId);
      if (!sala || !painelConteudo) return;
      painelConteudo.innerHTML = montarPainelSala(sala);
      estado = "painel-aberto";
      if (dica) dica.classList.remove("visivel");
      if (painel) { painel.classList.add("aberto"); painel.focus(); }
      aoMudarBloqueio(true);
      return;
    }
    if (alvoAtual.userData.tipoInteracao === "toca-discos") {
      if (painelConteudo) tocaDiscos.abrir(painelConteudo);
      estado = "painel-aberto";
      if (dica) dica.classList.remove("visivel");
      if (painel) { painel.classList.add("aberto"); painel.focus(); }
      aoMudarBloqueio(true);
      return;
    }
    if (alvoAtual.userData.tipoInteracao === "guia-ia") {
      abrirGuia();
      return;
    }
    const ehPersonagem = alvoAtual.userData.tipoInteracao === "personagem";
    const registro = ehPersonagem
      ? {
          tipo: "personagem",
          perfil: alvoAtual.userData.personagem,
          posAproximacao: alvoAtual.userData.posAproximacao,
          quatAproximacao: alvoAtual.userData.quatAproximacao,
        }
      : registros[alvoAtual.userData.indicePintura];

    if (registro.tipo === "pintura") {
      if (!registro.config.implementada) {
        mostrarAviso('"' + registro.config.titulo + '" — exposição em preparação. Volte em breve.');
        return;
      }

      // Selecionar a pintura revela seu artista, mas mantém a experiência
      // cinematográfica e abre o conteúdo curatorial da própria obra.
      const personagem = registro.personagem;
      if (personagem && !personagem.grupo.visible) {
        personagem.grupo.visible = true;
        personagem.alvo.visible = true;
        objetosInterativos.push(personagem.alvo);
      }
    }

    // O pintor é uma interação direta: o visitante já o encontrou
    // mirando com o mouse. Não movemos nem giramos a câmera ao conversar.
    if (registro.tipo === "personagem") {
      registroAtivo = registro;
      if (painelConteudo) painelConteudo.innerHTML = montarPainelPersonagem(registro.perfil);
      estado = "painel-aberto";
      if (dica) dica.classList.remove("visivel");
      if (painel) {
        painel.classList.add("aberto");
        painel.focus();
      }
      aoMudarBloqueio(true);
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
    // A câmera permanece no ponto da exposição. Assim, após ler sobre a
    // pintura, o visitante pode girar livremente e encontrar o artista ao lado.
    estado = "livre";
    registroAtivo = null;
    if (painel) painel.classList.remove("aberto");
    if (vinheta) vinheta.classList.remove("ativa");
    aoMudarBloqueio(false);
  }

  if (botaoFechar) botaoFechar.addEventListener("click", fechar);
  if (painel) {
    painel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fechar();
    });
  }

  function atualizar(dt) {
    const conversaAtena = estado === "painel-aberto" && !!painelConteudo?.querySelector(".guia-chat");
    guiaIA.atualizar(dt, destinosGuia, conversaAtena);
    tocaDiscos.atualizar(dt);
    if (estado === "livre") {
      // O artista só permanece exposto enquanto o visitante está perto
      // daquela obra. Ao sair da área, ocultamos também sua hitbox.
      for (const registro of registros) {
        const personagem = registro.personagem;
        if (!personagem || !personagem.grupo.visible) continue;
        const dx = camera.position.x - personagem.grupo.position.x;
        const dz = camera.position.z - personagem.grupo.position.z;
        if (Math.hypot(dx, dz) > 6.5) {
          personagem.grupo.visible = false;
          personagem.alvo.visible = false;
          const indice = objetosInterativos.indexOf(personagem.alvo);
          if (indice !== -1) objetosInterativos.splice(indice, 1);
          if (alvoAtual === personagem.alvo) alvoAtual = null;
        }
      }

      raycaster.setFromCamera(centro, camera);
      const hits = raycaster.intersectObjects(objetosInterativos);
      if (hits.length) {
        alvoAtual = hits[0].object;
        const registro = registros[alvoAtual.userData.indicePintura];
        if (dica) {
          const salaAlvo = alvoAtual.userData.tipoInteracao === "sala"
            ? SALAS_MUSEU.find((item) => item.id === alvoAtual.userData.salaId)
            : null;
          dica.textContent = alvoAtual.userData.tipoInteracao === "toca-discos"
            ? "Ouça música clássica — pressione E ou clique"
            : alvoAtual.userData.tipoInteracao === "guia-ia"
            ? "Converse com Atena, a guia virtual — pressione E ou clique"
            : alvoAtual.userData.tipoInteracao === "sala"
              ? (salaAlvo ? salaAlvo.titulo : "Explore esta sala") + " — pressione E ou clique"
              : alvoAtual.userData.tipoInteracao === "personagem"
                ? "Conheça " + alvoAtual.userData.personagem.nome + " — pressione E ou clique"
                : registro.config.implementada
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
          if (painelConteudo) {
            painelConteudo.innerHTML = registroAtivo.tipo === "personagem"
              ? montarPainelPersonagem(registroAtivo.perfil)
              : montarPainelHTML(registroAtivo.config);
          }
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
