/*
 * Galeria Marcos David — pinturas-portal
 * ------------------------------------------
 * Posiciona as quatro molduras, identifica a obra observada pela mira
 * central (raycaster) e conduz a aproximação cinematográfica até o
 * painel curatorial específico de cada pintura.
 */

import { SALA, PINTURAS } from "./config.js";
import { texturaEmPreparacao } from "./texturas.js";
import { criarPersonagem } from "./personagens.js";
import { criarGuiaIA } from "./guia.js";

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
  const destinosGuia = [];
  const guiaIA = criarGuiaIA(THREE, scene);
  objetosInterativos.push(guiaIA.alvo);

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
    const q = pergunta.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
    const tem = (...termos) => termos.some((termo) => q.includes(termo));

    // Reconhece as diferentes formas de perguntar pela identidade do criador.
    // "David", "Marcos" e "Marcos David" apontam para a mesma pessoa.
    const perguntaIdentidade = /^(quem e|quem seria|me fale sobre|fale sobre|sobre|identifique)\\s+(o\\s+)?(marcos(\\s+david(\\s+alves(\\s+garcia)?)?)?|david)(\\s+garcia)?[?.! ]*$/.test(q)
      || /^(quem e|quem seria)\\s+(o\\s+)?criador( do museu)?[?.! ]*$/.test(q)
      || /^(quem sou eu|quem e ele|quem e o dono do museu)[?.! ]*$/.test(q)
      || /^(marcos|david|marcos david|marcos david alves garcia)[?.! ]*$/.test(q);
    if (perguntaIdentidade || tem("quem e marcos", "quem e david", "quem e o david", "quem e o marcos", "quem e marcos david", "quem e marcos david alves garcia", "quem e o criador", "quem criou", "dono do museu", "sobre marcos", "sobre david", "sobre marcos david", "quem sou"))
      return "Marcos David Alves Garcia é o criador deste museu. Ele é estudante do Ensino Médio em Petrolina, Pernambuco, e participa de olimpíadas e desafios acadêmicos desde 2015. No site, você pode conhecer sua trajetória, seus interesses e suas conquistas.";
    if (tem("onde marcos", "onde ele mora", "cidade", "petrolina", "pernambuco"))
      return "O site apresenta Marcos como estudante do Ensino Médio em Petrolina, interior de Pernambuco.";
    if (tem("profissao", "professor", "carreira", "futuro", "quer ser"))
      return "Segundo a página Sobre mim, Marcos pretende seguir carreira como professor de História e Geografia. Ele vê o ensino como uma forma de compartilhar a curiosidade pelo mundo, pelo tempo e pelos lugares.";
    if (tem("interesse", "materia favorita", "materias", "gosta de estudar", "areas"))
      return "O site destaca o interesse de Marcos por História e Geografia, especialmente Geopolítica. Ele também gosta de desafios de Matemática e raciocínio lógico, Biologia, ciências da natureza, Informática e programação.";
    if (tem("por que criou", "porque criou", "objetivo do site", "objetivo do portfolio", "para que serve"))
      return "Marcos criou o portfólio para reunir, em um só lugar, registros de olimpíadas e desafios acadêmicos. A proposta é manter um espaço público, organizado e confiável para ele, professores, escolas e visitantes conhecerem sua trajetória.";

    // Conquistas — dados publicados na página /conquistas/.
    if (tem("ouro", "medalha de ouro"))
      return "Entre os resultados publicados, Marcos conquistou medalha de ouro no Torneio Nacional de Biologia (TNBio), em 2026. Foi sua primeira participação nessa competição.";
    if (tem("menção honrosa", "mencao honrosa"))
      return "Na 20ª OBMEP, em 2025, Marcos recebeu Menção Honrosa Nacional. O próprio site esclarece que essa distinção é diferente das medalhas de ouro, prata e bronze.";
    if (tem("mandacaru", "2023", "terceiro lugar", "3 lugar"))
      return "Em 2023, Marcos conquistou o terceiro lugar, com reconhecimento em bronze, na Olimpíada Mandacaru de Matemática. O site destaca a identidade regional nordestina da competição.";
    if (tem("obgp", "geopolitica"))
      return "Marcos participou da Olimpíada Brasileira de Geopolítica em três edições consecutivas: bronze em 2024, bronze em 2025 e prata em 2026. A página Sobre também explica que Geopolítica é uma das áreas que mais despertam seu interesse.";
    if (tem("obmep"))
      return "O site registra Menção Honrosa Nacional na 20ª OBMEP, em 2025. Também registra a participação na edição de 2026, cujo resultado aparece como aguardando divulgação na página de conquistas.";
    if (tem("tnbio", "biologia"))
      return "Em 2026, Marcos conquistou medalha de ouro no Torneio Nacional de Biologia (TNBio), organizado pela Seleta Educação. A prova aborda temas que vão da célula aos ecossistemas, incluindo biodiversidade, genética e conservação ambiental.";
    if (tem("obmf", "matematica financeira", "juros", "investimento"))
      return "Marcos conquistou medalha de prata na Olimpíada Brasileira de Matemática Financeira (OBMF), em 2025. A competição aborda temas como orçamento, juros, crédito e investimentos.";
    if (tem("obge", "geoinformacao", "geoinformação"))
      return "Em 2025, Marcos conquistou medalha de prata na Olimpíada Brasileira de Geoinformação (OBGE), competição relacionada à Geografia e à geoinformação.";
    if (tem("medalha", "conquista", "resultado", "premio", "prêmio", "certificado", "olimpiada", "olimpíada"))
      return "A página de conquistas registra, entre outros resultados: ouro no TNBio 2026; prata na OBGP 2026; bronze na OBGP 2025; prata na OBMF e na OBGE 2025; Menção Honrosa Nacional na OBMEP 2025; bronze na OBGP 2024; e terceiro lugar/bronze na Olimpíada Mandacaru de Matemática 2023. Há também participações cujo resultado está pendente ou cuja informação ainda está sendo confirmada. Você pode consultar a linha do tempo completa na página Conquistas do portfólio.";

    // Museu e funcionamento.
    if (tem("oi", "ola", "bom dia", "boa tarde", "boa noite"))
      return "Olá! Sou Atena, guia deste museu. Agora também posso responder perguntas sobre Marcos usando as informações publicadas no portfólio. O que gostaria de conhecer?";
    if (tem("van gogh", "noite estrelada"))
      return "Van Gogh pintou A Noite Estrelada em 1889, durante sua estadia em Saint-Rémy. No museu, a obra representa persistência, curiosidade e trajetória de aprendizagem.";
    if (tem("monet", "nenufar"))
      return "Claude Monet voltou muitas vezes ao tema dos Nenúfares, observando como a luz e os reflexos mudavam no lago de seu jardim em Giverny.";
    if (tem("vermeer", "astronomo"))
      return "Em O Astrônomo, Vermeer retrata um estudioso diante de um globo celeste. A luz, os livros e os instrumentos ajudam a construir o clima de investigação.";
    if (tem("friedrich", "caminhante", "nevoa"))
      return "Caspar David Friedrich é um dos nomes do Romantismo alemão. O caminhante diante da névoa convida a pensar sobre escolhas, descobertas e o que ainda não conhecemos.";
    if (tem("pintura", "obra", "quadro", "galeria", "sala", "museu"))
      return "Temos quatro exposições: A Noite Estrelada, de Van Gogh; Nenúfares, de Monet; O Astrônomo, de Vermeer; e O Caminhante sobre o Mar de Névoa, de Caspar David Friedrich. Mire em uma pintura e pressione E para explorar.";
    if (tem("controle", "andar", "moviment", "tecla", "mouse", "interagir"))
      return "No computador, use W, A, S e D ou as setas para caminhar. Mova o mouse para olhar, mire numa pintura ou personagem e pressione E ou clique para interagir.";
    if (tem("atena", "quem e voce", "sobre voce", "guia"))
      return "Sou Atena, a guia virtual do museu. Minhas respostas sobre Marcos são baseadas nos textos publicados nas páginas Sobre mim e Conquistas. Quando uma informação não está no site, não devo inventá-la.";
    return "Ainda não encontrei essa informação nos textos do portfólio. Posso falar sobre a trajetória de Marcos, seus interesses, as olimpíadas e medalhas registradas ou as obras deste museu. Tente perguntar de outro jeito.";
  }

  function abrirGuia() {
    if (!painelConteudo) return;
    painelConteudo.innerHTML = [
      '<div class="guia-chat">',
      '<div class="guia-chat-cabecalho"><span class="guia-avatar">A</span><div><strong>Atena</strong><small>Guia virtual · protótipo em teste</small></div></div>',
      '<div class="guia-mensagens" id="guia-mensagens"><div class="guia-mensagem">Olá! Sou Atena. Posso ajudar você a explorar o museu. Pergunte sobre as pinturas, os artistas, os controles ou as conquistas.</div></div>',
      '<form class="guia-form" id="guia-form"><input id="guia-pergunta" type="text" maxlength="240" placeholder="Escreva sua pergunta..." autocomplete="off" required><button type="submit">Enviar</button></form>',
      '<p class="guia-aviso">Minhas respostas sobre Marcos usam informações publicadas nas páginas Sobre mim e Conquistas. Ainda sou um protótipo local, sem conexão a uma IA externa.</p>',
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
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const pergunta = input.value.trim();
      if (!pergunta) return;
      const mensagens = document.getElementById("guia-mensagens");
      const visitante = document.createElement("div");
      visitante.className = "guia-mensagem visitante";
      visitante.textContent = pergunta;
      mensagens.appendChild(visitante);
      const resposta = document.createElement("div");
      resposta.className = "guia-mensagem";
      resposta.textContent = responderGuia(pergunta);
      mensagens.appendChild(resposta);
      mensagens.scrollTop = mensagens.scrollHeight;
      input.value = "";
      input.focus();
    });
    input.focus();
  }

  function tentarInteragir() {
    if (estado !== "livre" || !alvoAtual) return;
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
          dica.textContent = alvoAtual.userData.tipoInteracao === "guia-ia"
            ? "Converse com Atena, a guia virtual — pressione E ou clique"
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
