/*
 * Galeria Marcos David — experiência móvel leve
 * -----------------------------------------------
 * Em celulares, apresenta as mesmas exposições sem WebGL/Three.js.
 * Isso evita renderização 3D contínua e reduz consumo de GPU e memória.
 */
import { PINTURAS } from "./config.js";

function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function imagemLeve(url) {
  // As miniaturas de 640 px são suficientes para a visualização no celular.
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
    <footer class="mobile-rodape">Galeria Marcos David <span>·</span> Arte, conhecimento e trajetória</footer>
  `;
}
