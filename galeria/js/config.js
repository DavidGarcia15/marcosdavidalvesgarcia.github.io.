/*
 * Galeria Marcos David — dados de conteúdo
 * -----------------------------------------
 * Textos curatoriais, obras, imagens, créditos e fontes ficam centralizados
 * aqui para que a cena 3D e os painéis usem a mesma informação.
 */

// Limites da sala principal — compartilhados por cena, controles e pinturas.
export const SALA = {
  meiaLargura: 14,
  meiaProfundidade: 10,
  altura: 10,
  raioColuna: 0.46,
  colunasZ: [-7.5, -2.5, 2.5, 7.5],
  raioJogador: 0.4,
};

// As obras estão em domínio público; os créditos específicos das reproduções
// fotográficas aparecem nos painéis e nos links de fonte de cada exposição.
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
    largura: 2.6,
    altura: 2.08,
    corLuz: 0xffe3b0,
    intensidadeLuz: 26,
    creditoImagem:
      "Reprodução digital: Google Art Project, via Wikimedia Commons. Obra em domínio público.",
    fonteImagem:
      "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    linkSaibaMais: "../conquistas/",
    linkSaibaMaisTexto: "Ver a trajetória completa de conquistas",
    textoIntro:
      "Pintada em 1889, A Noite Estrelada transforma a paisagem noturna em um céu cheio de movimento. Nesta galeria, a obra abre a exposição dedicada à persistência, à curiosidade e ao percurso de aprendizagem.",
    contextoHistorico:
      "Vincent van Gogh realizou a pintura durante sua estadia em Saint-Rémy-de-Provence, no sul da França. A composição não é uma cópia literal de uma vista: combina observação, memória e interpretação artística para construir um céu intensamente expressivo.",
    observar: [
      "As espirais e curvas fazem o céu parecer estar em movimento.",
      "O cipreste escuro conecta o primeiro plano à altura do céu.",
      "A vila tranquila cria contraste com a energia das estrelas e da lua."
    ],
    conexaoGaleria:
      "A obra funciona como metáfora visual para uma trajetória feita de esforço e descobertas. Ela não representa uma medalha específica: representa o olhar curioso que acompanha cada nova etapa.",
    creditoCuratorial:
      "A pintura é apresentada como referência artística e simbólica, não como ilustração literal das conquistas."
  },
  {
    id: "nenufares",
    parede: "oeste",
    z: 4,
    artista: "Claude Monet",
    titulo: "Nenúfares",
    ano: "1916",
    tema: "Natureza, observação e tempo",
    implementada: true,
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Claude_Monet_-_Water_Lilies_-_Google_Art_Project_%28462013%29.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project_%28462013%29.jpg",
    largura: 2.22,
    altura: 2.2,
    corLuz: 0xc6dcff,
    intensidadeLuz: 22,
    creditoImagem:
      "Reprodução do Google Art Project / Wikimedia Commons. Obra em domínio público (PD-Art).",
    fonteImagem:
      "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_Google_Art_Project_(462013).jpg",
    linkSaibaMais: "https://collection.nmwa.go.jp/en/P.1959-0151.html",
    linkSaibaMaisTexto: "Consultar ficha do Museu Nacional de Arte Ocidental",
    textoIntro:
      "Esta versão de Nenúfares foi pintada em 1916. Monet voltou repetidamente ao lago de seu jardim para observar como a água, as flores, os reflexos e a luz mudavam ao longo do dia.",
    contextoHistorico:
      "Em Giverny, na França, Monet construiu um jardim com um lago de plantas aquáticas que se tornou tema central de sua produção tardia. A obra de 1916 pertence à série Nenúfares e integra a Coleção Matsukata do Museu Nacional de Arte Ocidental, em Tóquio.",
    observar: [
      "A superfície da água ocupa praticamente todo o campo da pintura.",
      "As flores e folhas aparecem em pinceladas de cores variadas, sem contornos rígidos.",
      "Os reflexos se misturam às plantas e tornam difícil separar o que está sobre a água do que aparece nela."
    ],
    conexaoGaleria:
      "Monet mostra como observar a mesma paisagem muitas vezes pode revelar novas diferenças. Essa atenção à natureza conversa com a curiosidade pelas ciências e pelo mundo vivo.",
    creditoCuratorial:
      "A ficha do museu registra a obra como óleo sobre tela, datada de 1916, com cerca de 200,5 × 201 cm."
  },
  {
    id: "astronomo",
    parede: "leste",
    z: -4,
    artista: "Johannes Vermeer",
    titulo: "O Astrônomo",
    ano: "c. 1668",
    tema: "Conhecimento, ciência e investigação",
    implementada: true,
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Johannes_Vermeer_-_The_Astronomer_-_1668.jpg/960px-Johannes_Vermeer_-_The_Astronomer_-_1668.jpg",
    largura: 1.92,
    altura: 2.18,
    corLuz: 0xffd39a,
    intensidadeLuz: 25,
    creditoImagem:
      "Reprodução de obra em domínio público — Wikimedia Commons (PD-Art).",
    fonteImagem:
      "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_The_Astronomer_-_1668.jpg",
    linkSaibaMais:
      "https://api-www.louvre.fr/sites/default/files/2025-11/Dossier_pedagogique_Louvre%20en%20classe.pdf",
    linkSaibaMaisTexto: "Ler o material educativo do Museu do Louvre",
    textoIntro:
      "Em O Astrônomo, Vermeer retrata um estudioso concentrado diante de um globo celeste. A cena transforma um momento de pesquisa em um estudo de luz, silêncio e atenção.",
    contextoHistorico:
      "A pintura é datada de aproximadamente 1668 e hoje faz parte da coleção do Museu do Louvre, em Paris. O material educativo do próprio museu destaca o globo celeste, o livro de astronomia e a inscrição da data no móvel ao fundo — um detalhe que ajuda a identificar a época da obra.",
    observar: [
      "O estudioso toca o globo celeste enquanto examina sua superfície.",
      "A luz que entra pela janela destaca a figura e os objetos sobre a mesa.",
      "O livro aberto e os instrumentos mostram que a cena está ligada ao estudo e à investigação."
    ],
    conexaoGaleria:
      "A obra representa a curiosidade que leva alguém a fazer perguntas, observar evidências e buscar explicações. É uma homenagem ao conhecimento e ao prazer de estudar.",
    creditoCuratorial:
      "A identidade do estudioso não é tratada como certa: o foco desta exposição está na atividade de investigação retratada."
  },
  {
    id: "caminhante",
    parede: "leste",
    z: 4,
    artista: "Caspar David Friedrich",
    titulo: "O Caminhante sobre o Mar de Névoa",
    ano: "c. 1817–1818",
    tema: "Trajetória, escolhas e futuro",
    implementada: true,
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg/960px-Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg",
    largura: 1.72,
    altura: 2.2,
    corLuz: 0xc9d9f4,
    intensidadeLuz: 20,
    creditoImagem:
      "Reprodução de obra em domínio público — Wikimedia Commons (PD-Art).",
    fonteImagem:
      "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg",
    linkSaibaMais: "https://www.hamburger-kunsthalle.de/en/nineteenth-century",
    linkSaibaMaisTexto: "Consultar a coleção da Hamburger Kunsthalle",
    textoIntro:
      "Um viajante, visto de costas, contempla um vasto mar de névoa entre montanhas. A imagem não mostra o que acontecerá depois: convida o visitante a imaginar o que existe além do que consegue enxergar.",
    contextoHistorico:
      "A obra é uma das imagens mais conhecidas do Romantismo alemão. A Hamburger Kunsthalle apresenta a pintura como um trabalho de Caspar David Friedrich de cerca de 1817, em óleo sobre tela, pertencente à sua coleção por empréstimo permanente da Fundação Hamburger Kunstsammlungen.",
    observar: [
      "A figura humana aparece de costas, no centro da composição.",
      "O ponto elevado permite olhar para montanhas parcialmente escondidas pela névoa.",
      "O contraste entre o viajante, as rochas e a paisagem amplia a sensação de escala e mistério."
    ],
    conexaoGaleria:
      "O caminhante simboliza a experiência de seguir adiante sem conhecer todo o caminho. Nesta galeria, a obra representa a trajetória estudantil e os horizontes que ainda estão por descobrir.",
    creditoCuratorial:
      "A névoa e a figura solitária costumam ser interpretadas como imagens do desconhecido e da relação entre indivíduo e natureza."
  }
];
