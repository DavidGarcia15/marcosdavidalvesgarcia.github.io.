/*
 * Galeria Marcos David — dados de conteúdo
 * -----------------------------------------
 * Nenhuma conquista é inventada aqui: os textos abaixo vêm do mesmo
 * conteúdo já publicado em "/" e em "/conquistas/". Centralizar os dados
 * nesta configuração também prepara terreno para o curador com IA
 * (etapa futura, ver README da galeria) usar a mesma fonte de verdade.
 */

// Limites da sala principal (ver cena.js) — usados também em controles.js
// (colisão) e pinturas.js (posição das molduras nas paredes).
export const SALA = {
  meiaLargura: 12, // parede oeste em x = -12, parede leste em x = +12
  meiaProfundidade: 8, // entrada em z = +8, parede norte (fundo) em z = -8
  altura: 9,
  raioColuna: 0.42,
  colunasZ: [-6, -2, 2, 6],
  raioJogador: 0.4,
};

// Três conquistas de destaque, reaproveitadas tal como aparecem na seção
// "Últimas edições" da página inicial — usadas no painel da primeira pintura.
export const CONQUISTAS_DESTAQUE = [
  {
    medalha: "Ouro",
    titulo: "Torneio Nacional de Biologia (TNBio)",
    meta: "2026 · Biologia",
  },
  {
    medalha: "Prata",
    titulo: "Olimpíada Brasileira de Geopolítica (OBGP)",
    meta: "2026 · terceira edição consecutiva",
  },
  {
    medalha: "Menção Honrosa",
    titulo: "20ª OBMEP",
    meta: "2025 · IMPA / MEC / MCTI",
  },
];

// As quatro pinturas-portal descritas no projeto. Apenas a primeira
// ("implementada: true") tem interação completa nesta primeira versão;
// as demais já ocupam seu lugar na parede, com moldura e luz própria,
// mas abrem apenas um aviso de "em preparação" — nada de ação falsa.
export const PINTURAS = [
  {
    id: "noite-estrelada",
    parede: "oeste",
    z: -4,
    artista: "Vincent van Gogh",
    titulo: "A Noite Estrelada",
    ano: "1889",
    tema: "Conquistas acadêmicas",
    implementada: true,
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    creditoImagem:
      "Museum of Modern Art · reprodução em domínio público (Google Art Project, via Wikimedia Commons)",
    // Nunca sugerir que Van Gogh venceu olimpíadas — a pintura representa o
    // tema por persistência e dedicação, não por conquista literal.
    textoIntro:
      "Van Gogh pintou este céu em turbilhão durante um momento de intensa dedicação pessoal — persistência e expressão que também marcam esta parte do portfólio.",
    linkSaibaMais: "../conquistas/",
    linkSaibaMaisTexto: "Ver a trajetória completa de conquistas",
  },
  {
    id: "nenufares",
    parede: "oeste",
    z: 4,
    artista: "Claude Monet",
    titulo: "Nenúfares",
    ano: "1916",
    tema: "Interesses pessoais",
    implementada: false,
  },
  {
    id: "astronomo",
    parede: "leste",
    z: -4,
    artista: "Johannes Vermeer",
    titulo: "O Astrônomo",
    ano: "1668",
    tema: "Conhecimento e estudos",
    implementada: false,
  },
  {
    id: "caminhante",
    parede: "leste",
    z: 4,
    artista: "Caspar David Friedrich",
    titulo: "O Caminhante sobre o Mar de Névoa",
    ano: "1818",
    tema: "Trajetória e futuro",
    implementada: false,
  },
];
