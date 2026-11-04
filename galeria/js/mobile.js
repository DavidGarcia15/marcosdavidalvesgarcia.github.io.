/*
 * Galeria Marcos David — experiência móvel leve
 * Em celulares, apresenta as exposições sem WebGL/Three.js.
 */
import { PINTURAS } from "./config.js";
import { responderAtena, PERGUNTAS_ATENA } from "./atena.js";
import { montarPlayerMobile } from "./toca-discos.js";

function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
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
  mensagens.scrollTop = mensagens.scrollHeight;
}

export function iniciarGaleriaMobile() {
  const raiz = document.getElementById("mobile-gallery");
  if (!raiz) return;

  raiz.innerHTML = `
    <header class="mobile-cabecalho">
      <p class="mobile-eyebrow">Galeria Marcos David</p>
      <h1>Um céu de conquistas</h1>
      <p>Arte, conhecimento e trajetória. Explore as quatro exposições no seu próprio ritmo.</p>
      <div class="mobile-linha-ornamental" aria-hidden="true">✦ ━━━━━━━━━ ✦</div>
    </header>
    <main class="mobile-lista-obras">
      ${PINTURAS.filter((p) => p.implementada).map(montarExposicao).join("")}
    </main>
    <section class="mobile-atena" aria-labelledby="mobile-atena-title">
      <p class="mobile-eyebrow">Guia do museu</p>
      <h2 id="mobile-atena-title">Pergunte à Atena</h2>
      <p class="mobile-atena-intro">Explore as conquistas, os interesses e as histórias por trás das obras. As respostas vêm de um acervo curado e incluem fontes quando disponíveis.</p>
      <div class="mobile-atena-sugestoes" aria-label="Sugestões de perguntas">
        ${PERGUNTAS_ATENA.map((pergunta) => '<button type="button" data-atena-pergunta="' + escapar(pergunta) + '">' + escapar(pergunta) + '</button>').join("")}
      </div>
      <div class="mobile-atena-mensagens" id="mobile-atena-mensagens" aria-live="polite">
        <p class="mobile-atena-resposta">Olá! Sou Atena. O que gostaria de descobrir?</p>
      </div>
      <form class="mobile-atena-form" id="mobile-atena-form">
        <label class="sr-only" for="mobile-atena-pergunta">Sua pergunta para Atena</label>
        <input id="mobile-atena-pergunta" type="text" maxlength="240" placeholder="Digite sua pergunta..." autocomplete="off" required>
        <button type="submit">Perguntar</button>
      </form>
      <p class="mobile-atena-aviso">Não sou uma IA generativa. Se uma informação não estiver no acervo, vou avisar em vez de inventar.</p>
    </section>
    <footer class="mobile-rodape">Galeria Marcos David <span>·</span> Arte, conhecimento e trajetória</footer>
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
