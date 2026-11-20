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
const PINTURAS_PT = [
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


// Traduções curatoriais para que os painéis e cartões da galeria também
// acompanhem o idioma selecionado no portfólio.
const TRADUCOES_PINTURAS_EN = {
  "A Noite Estrelada": "The Starry Night",
  "Conquistas acadêmicas": "Academic achievements",
  "Reprodução digital: Google Art Project, via Wikimedia Commons. Obra em domínio público.": "Digital reproduction: Google Art Project, via Wikimedia Commons. Public-domain artwork.",
  "Ver a trajetória completa de conquistas": "View the complete achievements journey",
  "Pintada em 1889, A Noite Estrelada transforma a paisagem noturna em um céu cheio de movimento. Nesta galeria, a obra abre a exposição dedicada à persistência, à curiosidade e ao percurso de aprendizagem.": "Painted in 1889, The Starry Night transforms the night landscape into a sky full of movement. In this gallery, the work opens an exhibition devoted to persistence, curiosity, and the journey of learning.",
  "Vincent van Gogh realizou a pintura durante sua estadia em Saint-Rémy-de-Provence, no sul da França. A composição não é uma cópia literal de uma vista: combina observação, memória e interpretação artística para construir um céu intensamente expressivo.": "Vincent van Gogh created the painting during his stay in Saint-Rémy-de-Provence, in southern France. The composition is not a literal copy of a view: it combines observation, memory, and artistic interpretation to create an intensely expressive sky.",
  "As espirais e curvas fazem o céu parecer estar em movimento.": "The spirals and curves make the sky seem to be moving.",
  "O cipreste escuro conecta o primeiro plano à altura do céu.": "The dark cypress connects the foreground to the height of the sky.",
  "A vila tranquila cria contraste com a energia das estrelas e da lua.": "The quiet village contrasts with the energy of the stars and the moon.",
  "A obra funciona como metáfora visual para uma trajetória feita de esforço e descobertas. Ela não representa uma medalha específica: representa o olhar curioso que acompanha cada nova etapa.": "The painting works as a visual metaphor for a journey shaped by effort and discovery. It does not represent a specific medal; it represents the curiosity that accompanies each new stage.",
  "A pintura é apresentada como referência artística e simbólica, não como ilustração literal das conquistas.": "The painting is presented as an artistic and symbolic reference, not as a literal illustration of the achievements.",
  "Nenúfares": "Water Lilies",
  "Natureza, observação e tempo": "Nature, observation, and time",
  "Reprodução do Google Art Project / Wikimedia Commons. Obra em domínio público (PD-Art).": "Reproduction from Google Art Project / Wikimedia Commons. Public-domain artwork (PD-Art).",
  "Consultar ficha do Museu Nacional de Arte Ocidental": "View the National Museum of Western Art collection record",
  "Esta versão de Nenúfares foi pintada em 1916. Monet voltou repetidamente ao lago de seu jardim para observar como a água, as flores, os reflexos e a luz mudavam ao longo do dia.": "This version of Water Lilies was painted in 1916. Monet repeatedly returned to the pond in his garden to observe how water, flowers, reflections, and light changed throughout the day.",
  "Em Giverny, na França, Monet construiu um jardim com um lago de plantas aquáticas que se tornou tema central de sua produção tardia. A obra de 1916 pertence à série Nenúfares e integra a Coleção Matsukata do Museu Nacional de Arte Ocidental, em Tóquio.": "In Giverny, France, Monet created a garden with a pond of aquatic plants that became a central subject of his later work. The 1916 painting belongs to the Water Lilies series and is part of the Matsukata Collection at the National Museum of Western Art in Tokyo.",
  "A superfície da água ocupa praticamente todo o campo da pintura.": "The surface of the water occupies almost the entire painting.",
  "As flores e folhas aparecem em pinceladas de cores variadas, sem contornos rígidos.": "The flowers and leaves appear in varied brushstrokes, without rigid outlines.",
  "Os reflexos se misturam às plantas e tornam difícil separar o que está sobre a água do que aparece nela.": "Reflections blend with the plants, making it difficult to separate what is above the water from what appears on its surface.",
  "Monet mostra como observar a mesma paisagem muitas vezes pode revelar novas diferenças. Essa atenção à natureza conversa com a curiosidade pelas ciências e pelo mundo vivo.": "Monet shows how observing the same landscape repeatedly can reveal new differences. This attention to nature connects with curiosity about science and the living world.",
  "A ficha do museu registra a obra como óleo sobre tela, datada de 1916, com cerca de 200,5 × 201 cm.": "The museum record identifies the work as oil on canvas, dated 1916, measuring approximately 200.5 × 201 cm.",
  "O Astrônomo": "The Astronomer",
  "Conhecimento, ciência e investigação": "Knowledge, science, and research",
  "Reprodução de obra em domínio público — Wikimedia Commons (PD-Art).": "Reproduction of a public-domain artwork — Wikimedia Commons (PD-Art).",
  "Ler o material educativo do Museu do Louvre": "Read the Louvre Museum educational material",
  "Em O Astrônomo, Vermeer retrata um estudioso concentrado diante de um globo celeste. A cena transforma um momento de pesquisa em um estudo de luz, silêncio e atenção.": "In The Astronomer, Vermeer portrays a scholar concentrating on a celestial globe. The scene turns a moment of research into a study of light, silence, and attention.",
  "A pintura é datada de aproximadamente 1668 e hoje faz parte da coleção do Museu do Louvre, em Paris. O material educativo do próprio museu destaca o globo celeste, o livro de astronomia e a inscrição da data no móvel ao fundo — um detalhe que ajuda a identificar a época da obra.": "The painting dates to around 1668 and is now part of the Louvre Museum collection in Paris. The museum's educational material highlights the celestial globe, the astronomy book, and the date inscription on the cabinet in the background — a detail that helps identify the period of the work.",
  "O estudioso toca o globo celeste enquanto examina sua superfície.": "The scholar touches the celestial globe while examining its surface.",
  "A luz que entra pela janela destaca a figura e os objetos sobre a mesa.": "Light entering through the window highlights the figure and the objects on the table.",
  "O livro aberto e os instrumentos mostram que a cena está ligada ao estudo e à investigação.": "The open book and instruments show that the scene is connected to study and research.",
  "A obra representa a curiosidade que leva alguém a fazer perguntas, observar evidências e buscar explicações. É uma homenagem ao conhecimento e ao prazer de estudar.": "The work represents the curiosity that leads people to ask questions, observe evidence, and seek explanations. It is a tribute to knowledge and the joy of learning.",
  "A identidade do estudioso não é tratada como certa: o foco desta exposição está na atividade de investigação retratada.": "The scholar's identity is not treated as certain: this exhibition focuses on the research activity depicted.",
  "O Caminhante sobre o Mar de Névoa": "Wanderer above the Sea of Fog",
  "Trajetória, escolhas e futuro": "Journey, choices, and the future",
  "Consultar a coleção da Hamburger Kunsthalle": "View the Hamburger Kunsthalle collection",
  "Um viajante, visto de costas, contempla um vasto mar de névoa entre montanhas. A imagem não mostra o que acontecerá depois: convida o visitante a imaginar o que existe além do que consegue enxergar.": "A traveler, seen from behind, looks out over a vast sea of fog between mountains. The image does not show what happens next; it invites visitors to imagine what lies beyond what they can see.",
  "A obra é uma das imagens mais conhecidas do Romantismo alemão. A Hamburger Kunsthalle apresenta a pintura como um trabalho de Caspar David Friedrich de cerca de 1817, em óleo sobre tela, pertencente à sua coleção por empréstimo permanente da Fundação Hamburger Kunstsammlungen.": "The work is one of the best-known images of German Romanticism. The Hamburger Kunsthalle presents the painting as a work by Caspar David Friedrich from around 1817, in oil on canvas, held in its collection on permanent loan from the Hamburger Kunstsammlungen Foundation.",
  "A figura humana aparece de costas, no centro da composição.": "The human figure is seen from behind, at the center of the composition.",
  "O ponto elevado permite olhar para montanhas parcialmente escondidas pela névoa.": "The elevated viewpoint offers a view of mountains partly hidden by fog.",
  "O contraste entre o viajante, as rochas e a paisagem amplia a sensação de escala e mistério.": "The contrast between the traveler, the rocks, and the landscape heightens the sense of scale and mystery.",
  "O caminhante simboliza a experiência de seguir adiante sem conhecer todo o caminho. Nesta galeria, a obra representa a trajetória estudantil e os horizontes que ainda estão por descobrir.": "The wanderer symbolizes moving forward without knowing the entire path. In this gallery, the work represents a student's journey and the horizons still waiting to be discovered.",
  "A névoa e a figura solitária costumam ser interpretadas como imagens do desconhecido e da relação entre indivíduo e natureza.": "The fog and solitary figure are often interpreted as images of the unknown and of the relationship between individuals and nature."
};

function traduzirPintura(pintura) {
  const traduzir = (valor) =>
    typeof valor === "string" ? (TRADUCOES_PINTURAS_EN[valor] || valor) : valor;
  return {
    ...pintura,
    titulo: traduzir(pintura.titulo),
    tema: traduzir(pintura.tema),
    creditoImagem: traduzir(pintura.creditoImagem),
    linkSaibaMaisTexto: traduzir(pintura.linkSaibaMaisTexto),
    textoIntro: traduzir(pintura.textoIntro),
    contextoHistorico: traduzir(pintura.contextoHistorico),
    observar: (pintura.observar || []).map(traduzir),
    conexaoGaleria: traduzir(pintura.conexaoGaleria),
    creditoCuratorial: traduzir(pintura.creditoCuratorial),
  };
}

export const PINTURAS =
  document.documentElement.lang === "en"
    ? PINTURAS_PT.map(traduzirPintura)
    : PINTURAS_PT;
