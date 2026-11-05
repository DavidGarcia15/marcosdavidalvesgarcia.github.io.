/*
 * Galeria Marcos David — experiência móvel leve
 * Em celulares, apresenta as exposições sem WebGL/Three.js.
 */
import { PINTURAS } from "./config.js";
import { SALAS_MUSEU } from "./salas.js";
import { responderAtena, PERGUNTAS_ATENA } from "./atena.js";
import { montarPlayerMobile } from "./toca-discos.js";

function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

// Mantém apenas as oito perguntas mais recentes para evitar que uma
// conversa longa transforme a versão móvel em uma lista interminável.
function limitarHistorico(mensagens) {
  while (mensagens.querySelectorAll(".mobile-atena-visitante").length > 8) {
    let atual = mensagens.firstElementChild;
    while (atual) {
      const proximo = atual.nextElementSibling;
      const eraResposta = atual.classList.contains("mobile-atena-resposta") &&
        !atual.classList.contains("mobile-atena-visitante");
      atual.remove();
      if (eraResposta) {
        if (proximo && proximo.classList.contains("mobile-atena-fontes")) proximo.remove();
        break;
      }
      atual = proximo;
    }
  }
}

function imagemLeve(url) {
  return String(url || "").replace(/\/(?:960|1280)px_/, "/640px_");
}

function montarExposicao(p, indice) {
  const observacoes = (p.observar || []).map((item) => "<li>" + escapar(item) + "</li>").join("");
  const linkMuseu = p.linkSaibaMais
    ? '<a class="mobile-link" href="' + escapar(p.linkSaibaMais) + '" target="_blank" rel="noopener noreferrer">' +
      escapar(p.linkSaibaMaisTexto || "Consultar fonte") + "</a>"
    : "";
  const linkImagem = p.fonteImagem
    ? '<a class="mobile-link secundario" href="' + escapar(p.fonteImagem) + '" target="_blank" rel="noopener noreferrer">Crédito e licença da reprodução</a>'
    : "";

  return `
    <article class="mobile-obra">
      <div class="mobile-moldura">
        <img src="${escapar(imagemLeve(p.imagem))}" alt="${escapar(p.titulo)} — pintura de ${escapar(p.artista)}"
          loading="${indice === 0 ? "eager" : "lazy"}" decoding="async" ${indice === 0 ? 'fetchpriority="high"' : ""} width="${Math.round((p.largura || 1) * 100)}" height="${Math.round((p.altura || 1) * 100)}">
      </div>
      <div class="mobile-obra-texto">
        <p class="mobile-tema">${escapar(p.tema)}</p>
        <h2>${escapar(p.titulo)}</h2>
        <p class="mobile-artista">${escapar(p.artista)} · ${escapar(p.ano)}</p>
        <p class="mobile-intro">${escapar(p.textoIntro)}</p>
        <details class="mobile-detalhes">
          <summary>Explorar esta exposição</summary>
          <div class="mobile-detalhes-conteudo">
            <h3>Contexto histórico</h3>
            <p>${escapar(p.contextoHistorico)}</p>
            ${observacoes ? "<h3>O que observar</h3><ul>" + observacoes + "</ul>" : ""}
            ${p.conexaoGaleria ? '<div class="mobile-destaque"><strong>Por que esta obra está na galeria?</strong><p>' + escapar(p.conexaoGaleria) + "</p></div>" : ""}
            ${p.creditoCuratorial ? '<p class="mobile-nota">' + escapar(p.creditoCuratorial) + "</p>" : ""}
            ${p.creditoImagem ? '<p class="mobile-credito">' + escapar(p.creditoImagem) + "</p>" : ""}
            <div class="mobile-links">${linkMuseu}${linkImagem}</div>
          </div>
        </details>
      </div>
    </article>`;
}


function montarSalaMobile(sala, indice) {
  const temas = (sala.temas || []).map((tema) => "<li>" + escapar(tema) + "</li>").join("");
  const rosaDosVentos = sala.id === "geografia" ? `
    <figure class="mobile-rosa">
      <svg viewBox="0 0 320 320" role="img" aria-labelledby="mobile-rosa-titulo">
        <title id="mobile-rosa-titulo">Rosa dos ventos com oito direções</title>
        <circle cx="160" cy="160" r="126" fill="rgba(8,19,34,.48)" stroke="#b8914a" stroke-width="3"/>
        <circle cx="160" cy="160" r="91" fill="none" stroke="rgba(220,187,121,.38)" stroke-width="1.5"/>
        <path d="M160 28 L183 137 L252 68 L183 160 L292 160 L183 183 L252 252 L160 183 L160 292 L137 183 L68 252 L137 160 L28 160 L137 137 L68 68 L160 137 Z" fill="#b8914a" stroke="#ead9b3" stroke-width="2" stroke-linejoin="round"/>
        <path d="M160 70 L174 146 L250 160 L174 174 L160 250 L146 174 L70 160 L146 146 Z" fill="#e9e5db" stroke="#b8914a" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cx="160" cy="160" r="19" fill="#0e2038" stroke="#dcbb79" stroke-width="3"/>
        <g fill="#f1dfb4" font-family="Georgia,serif" font-size="19" font-weight="bold" text-anchor="middle">
          <text x="160" y="19">N</text>
          <text x="302" y="166">L</text>
          <text x="160" y="316">S</text>
          <text x="18" y="166">O</text>
        </g>
        <g fill="#b7c0cc" font-family="Arial,sans-serif" font-size="11" text-anchor="middle">
          <text x="226" y="91">NE</text><text x="229" y="236">SE</text>
          <text x="91" y="236">SO</text><text x="91" y="91">NO</text>
        </g>
      </svg>
      <figcaption>Norte aponta para o fundo do átrio; Sul indica o caminho de volta à Galeria Artística. Leste fica à direita e Oeste à esquerda quando se olha para o Norte.</figcaption>
    </figure>` : "";
  return `
    <article class="mobile-sala">
      <div class="mobile-sala-numero" aria-hidden="true">0${indice + 1}</div>
      <div class="mobile-sala-conteudo">
        <p class="mobile-sala-setor">${escapar(sala.setor)}</p>
        <h3>${escapar(sala.titulo)}</h3>
        <p>${escapar(sala.descricao)}</p>
        ${rosaDosVentos}
        <details>
          <summary>Ver temas e proposta de exploração</summary>
          <ul>${temas}</ul>
          <div class="mobile-sala-convite">
            <strong>Uma pergunta para investigar</strong>
            <p>${escapar(sala.convite)}</p>
          </div>
        </details>
        ${sala.atividade ? `
          <details class="mobile-sala-atividade">
            <summary>${escapar(sala.atividade.titulo)}</summary>
            <p>${escapar(sala.atividade.enunciado)}</p>
            <details class="mobile-sala-solucao">
              <summary>Ver uma abordagem possível</summary>
              <p>${escapar(sala.atividade.desenvolvimento)}</p>
            </details>
          </details>` : ""}
      </div>
    </article>`;
}

function responderNoCelular(pergunta, mensagens) {
  const visitante = document.createElement("p");
  visitante.className = "mobile-atena-visitante";
  visitante.textContent = pergunta;
  mensagens.appendChild(visitante);

  const resultado = responderAtena(pergunta);
  const resposta = document.createElement("p");
  resposta.className = "mobile-atena-resposta";
  resposta.textContent = resultado.texto;
  mensagens.appendChild(resposta);

  if (resultado.fontes && resultado.fontes.length) {
    const fontes = document.createElement("div");
    fontes.className = "mobile-atena-fontes";
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
  limitarHistorico(mensagens);
  mensagens.scrollTop = mensagens.scrollHeight;
}

export function iniciarGaleriaMobile() {
  const raiz = document.getElementById("mobile-gallery");
  if (!raiz) return;

  raiz.innerHTML = `
    <header class="mobile-cabecalho">
      <p class="mobile-eyebrow">Galeria Marcos David</p>
      <h1>Museu-biblioteca</h1>
      <p>Arte, conhecimento e trajetória. Conheça a galeria artística e consulte o mapa das novas alas do museu-biblioteca.</p>
      <div class="mobile-linha-ornamental" aria-hidden="true">✦ ━━━━━━━━━ ✦</div>
    </header>
    <main class="mobile-lista-obras">
      ${PINTURAS.filter((p) => p.implementada).map(montarExposicao).join("")}
    </main>
    <section class="mobile-salas" aria-labelledby="mobile-salas-title">
      <p class="mobile-eyebrow">Mapa do museu</p>
      <h2 id="mobile-salas-title">Átrio e salas do conhecimento</h2>
      <p class="mobile-salas-intro">A partir da galeria artística, uma passagem leva ao átrio central. De lá, quatro salas temáticas formam as primeiras alas da biblioteca.</p>
      <div class="mobile-salas-lista">
        ${SALAS_MUSEU.map(montarSalaMobile).join("")}
      </div>
    </section>
    <section class="mobile-atena" aria-labelledby="mobile-atena-title">
      <p class="mobile-eyebrow">Guia do museu</p>
      <h2 id="mobile-atena-title">Pergunte à Atena</h2>
      <p class="mobile-atena-intro">Explore as obras, as quatro salas temáticas, a trajetória e os interesses de Marcos. As respostas vêm de um acervo curado e incluem fontes quando disponíveis.</p>
      <div class="mobile-atena-sugestoes" aria-label="Sugestões de perguntas">
        ${PERGUNTAS_ATENA.map((pergunta) => '<button type="button" data-atena-pergunta="' + escapar(pergunta) + '">' + escapar(pergunta) + '</button>').join("")}
      </div>
      <div class="mobile-atena-mensagens" id="mobile-atena-mensagens" role="log" aria-live="polite" aria-relevant="additions">
        <p class="mobile-atena-resposta">Olá! Sou Atena. O que gostaria de descobrir?</p>
      </div>
      <form class="mobile-atena-form" id="mobile-atena-form">
        <label class="sr-only" for="mobile-atena-pergunta">Sua pergunta para Atena</label>
        <input id="mobile-atena-pergunta" type="text" maxlength="240" placeholder="Digite sua pergunta..." autocomplete="off" required>
        <button type="submit">Perguntar</button>
      </form>
      <p class="mobile-atena-aviso">Não sou uma IA generativa. Se uma informação não estiver no acervo, vou avisar em vez de inventar.</p>
    </section>
    <footer class="mobile-rodape">Museu-biblioteca Marcos David <span>·</span> Arte, conhecimento e investigação</footer>
  `;

  montarPlayerMobile(raiz);

  const form = document.getElementById("mobile-atena-form");
  const input = document.getElementById("mobile-atena-pergunta");
  const mensagens = document.getElementById("mobile-atena-mensagens");
  if (form && input && mensagens) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const pergunta = input.value.trim();
      if (!pergunta) return;
      responderNoCelular(pergunta, mensagens);
      input.value = "";
    });
    raiz.querySelectorAll("[data-atena-pergunta]").forEach((botao) => {
      botao.addEventListener("click", () => responderNoCelular(botao.getAttribute("data-atena-pergunta"), mensagens));
    });
  }
}
