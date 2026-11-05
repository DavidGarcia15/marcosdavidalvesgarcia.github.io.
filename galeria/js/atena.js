/* Atena Responde — acervo curado do portfólio e do museu.
   As respostas são determinísticas e usam apenas informações publicadas no site. */

export const PERGUNTAS_ATENA = [
  "Quais são as principais conquistas de Marcos?",
  "Por que Marcos gosta de Geopolítica?",
  "Quem pintou A Noite Estrelada?",
  "Onde ficam as novas salas?",
  "O que posso explorar na Sala de Raciocínio?",
];

function normalizar(valor) {
  return String(valor || "")
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const respostas = [
  {
    id: "identidade",
    termos: ["quem e marcos", "quem e david", "quem criou o museu", "criador do site", "sobre marcos", "quem sou"],
    texto: "Marcos David Alves Garcia é o estudante que criou este portfólio e o museu virtual. Ele estuda em Petrolina, Pernambuco, participa de olimpíadas acadêmicas e reúne aqui registros de sua trajetória, interesses e projetos.",
    fontes: [{ texto: "Conheça a trajetória", url: "../sobre/" }]
  },
  {
    id: "expressarte",
    termos: ["expressarte", "a luta do povo sertanejo", "concurso de desenho de petrolina", "notebook como premio em 2015"],
    texto: "Em 2015, Marcos relata ter conquistado o 1º lugar no ExpressArte com o desenho “A Luta do Povo Sertanejo” e recebido um notebook como prêmio. A matéria do Blog do Carlos Britto, publicada em 20/10/2015, confirma que o desenho apareceu na relação parcial de selecionados, mas não registra a classificação final nem o prêmio. Por isso, esses dois detalhes são apresentados como relato pessoal, não como algo comprovado pela matéria.",
    fontes: [
      { texto: "Matéria do Blog do Carlos Britto (20/10/2015)", url: "https://www.carlosbritto.com/secretaria-de-educacao-de-petrolina-divulga-resultado-do-concurso-expressarte-2015/" },
      { texto: "Registro no portfólio", url: "../conquistas/" }
    ]
  },
  {
    id: "conquistas",
    termos: ["principais conquistas", "quais medalhas", "lista de medalhas", "resultados", "premios", "olimpiadas", "conquistas"],
    texto: "Entre os resultados registrados estão ouro no TNBio 2026; prata na OBGP 2026; prata na OBGE e na OBMF 2025; bronze na OBGP em 2024 e 2025; e terceiro lugar/bronze na Olimpíada Mandacaru de Matemática 2023. Na OBMEP 2025, Marcos recebeu Menção Honrosa Nacional — uma distinção diferente de medalha.",
    fontes: [
      { texto: "Consultar a página de Conquistas", url: "../conquistas/" },
      { texto: "Página oficial da OBMEP", url: "https://www.obmep.org.br/" }
    ]
  },
  {
    id: "obgp",
    termos: ["obgp", "geopolitica", "medalhas de geopolitica"],
    texto: "Marcos participou da Olimpíada Brasileira de Geopolítica em três edições consecutivas: bronze em 2024, bronze em 2025 e prata em 2026. A competição combina conhecimentos geográficos, políticos, econômicos e históricos para compreender relações entre países e acontecimentos mundiais.",
    fontes: [
      { texto: "Página oficial da OBGP", url: "https://www.seletaeducacao.com.br/obgp" },
      { texto: "Resultados e trajetória", url: "../conquistas/" }
    ]
  },
  {
    id: "obmep",
    termos: ["obmep", "mencao honrosa", "menção honrosa", "matematica das escolas publicas"],
    texto: "Na 20ª OBMEP, edição de 2025, Marcos recebeu Menção Honrosa Nacional. É importante distinguir essa certificação das medalhas de ouro, prata e bronze. A OBMEP é organizada pelo IMPA, com apoio do MEC e do MCTI.",
    fontes: [
      { texto: "Site oficial da OBMEP", url: "https://www.obmep.org.br/" },
      { texto: "Registro no portfólio", url: "../conquistas/" }
    ]
  },
  {
    id: "tnbio",
    termos: ["tnbio", "torneio nacional de biologia", "ouro em biologia", "biologia"],
    texto: "Em 2026, Marcos conquistou medalha de ouro no Torneio Nacional de Biologia (TNBio), organizado pela Seleta Educação. Foi sua primeira participação nessa competição, que aborda temas das ciências da vida.",
    fontes: [
      { texto: "Página oficial do TNBio", url: "https://www.seletaeducacao.com.br/tnbio" },
      { texto: "Detalhes da conquista", url: "../conquistas/" }
    ]
  },
  {
    id: "obmf",
    termos: ["obmf", "matematica financeira", "juros", "educacao financeira"],
    texto: "Marcos conquistou medalha de prata na Olimpíada Brasileira de Matemática Financeira (OBMF), em 2025. A competição relaciona matemática a situações como orçamento, juros, crédito e investimentos.",
    fontes: [
      { texto: "Página oficial da OBMF", url: "https://www.seletaeducacao.com.br/obmf" },
      { texto: "Detalhes da conquista", url: "../conquistas/" }
    ]
  },
  {
    id: "obge",
    termos: ["obge", "geoinformacao", "geoinformacao", "olimpiada de geoinformacao"],
    texto: "Em 2025, Marcos conquistou medalha de prata na Olimpíada Brasileira de Geoinformação (OBGE), uma competição relacionada à Geografia e à geoinformação.",
    fontes: [
      { texto: "Site da OBGE", url: "https://olimpiadadegeoinformacao.com.br/" },
      { texto: "Detalhes da conquista", url: "../conquistas/" }
    ]
  },
  {
    id: "mandacaru",
    termos: ["mandacaru", "primeira medalha", "2023", "terceiro lugar"],
    texto: "Em 2023, Marcos conquistou o terceiro lugar, com reconhecimento em bronze, na Olimpíada Mandacaru de Matemática. É uma conquista especial em sua trajetória e uma competição com identidade cultural nordestina.",
    fontes: [
      { texto: "Site da Olimpíada Mandacaru", url: "https://olimpiadamandacaru.com.br/" },
      { texto: "Registro no portfólio", url: "../conquistas/" }
    ]
  },
  {
    id: "geopolitica-interesse",
    termos: ["por que marcos gosta de geopolitica", "gosta de geopolitica", "por que geopolitica", "interesse por geopolitica"],
    texto: "O portfólio destaca a Geopolítica porque ela conecta áreas que Marcos gosta de estudar: História, Geografia, política e economia. Esse campo ajuda a entender como os territórios, os recursos, as relações de poder e os acontecimentos históricos influenciam o mundo.",
    fontes: [{ texto: "Conheça as áreas de interesse", url: "../sobre/" }]
  },
  {
    id: "interesses",
    termos: ["o que marcos gosta", "interesses", "materias favoritas", "o que estuda", "areas de interesse"],
    texto: "História e Geografia ocupam um lugar especial nos interesses de Marcos, sobretudo a Geopolítica. Ele também gosta de Matemática e raciocínio lógico, Biologia, Ciências e Tecnologia, incluindo programação.",
    fontes: [{ texto: "Áreas de interesse", url: "../sobre/" }]
  },
  {
    id: "professor",
    termos: ["quer ser", "futuro professor", "profissao", "carreira", "professor de historia", "professor de geografia"],
    texto: "Marcos pretende seguir como professor de História e Geografia. O portfólio apresenta esse objetivo como parte de sua trajetória em construção, junto à curiosidade por diferentes áreas do conhecimento.",
    fontes: [{ texto: "Sobre Marcos", url: "../sobre/" }]
  },
  {
    id: "objetivo",
    termos: ["objetivo do site", "por que criou", "porque criou", "para que serve", "portfolio"],
    texto: "O portfólio foi criado para reunir, em um espaço público e organizado, os registros das olimpíadas, conquistas, interesses e experiências acadêmicas de Marcos. O museu virtual amplia essa proposta ao aproximar arte, história e conhecimento.",
    fontes: [
      { texto: "Página inicial", url: "../" },
      { texto: "Sobre o portfólio", url: "../sobre/" }
    ]
  },
  {
    id: "vangogh",
    termos: ["van gogh", "noite estrelada", "starry night"],
    texto: "Vincent van Gogh pintou A Noite Estrelada em 1889, durante sua estadia em Saint-Rémy-de-Provence, na França. A composição combina observação e interpretação artística. No museu, a obra simboliza persistência, curiosidade e aprendizagem.",
    fontes: [
      { texto: "Crédito da obra no Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" },
      { texto: "Crédito da reprodução", url: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg" }
    ]
  },
  {
    id: "monet",
    termos: ["monet", "nenufares", "nenufar", "water lilies"],
    texto: "Claude Monet voltou muitas vezes ao tema dos Nenúfares, observando como a luz, as plantas e os reflexos mudavam no lago de seu jardim em Giverny. A exposição relaciona essa observação cuidadosa à curiosidade pelas ciências e pela natureza.",
    fontes: [{ texto: "Consultar a ficha do museu", url: "https://collection.nmwa.go.jp/en/P.1959-0151.html" }]
  },
  {
    id: "vermeer",
    termos: ["vermeer", "astronomo", "o astronomo"],
    texto: "Em O Astrônomo, Johannes Vermeer retrata um estudioso diante de um globo celeste. O livro, os instrumentos e a luz da janela ajudam a construir uma cena ligada à investigação e ao conhecimento. A obra é datada de cerca de 1668.",
    fontes: [{ texto: "Material educativo do Louvre", url: "https://api-www.louvre.fr/sites/default/files/2025-11/Dossier_pedagogique_Louvre%20en%20classe.pdf" }]
  },
  {
    id: "friedrich",
    termos: ["friedrich", "caminhante", "mar de nevoa"],
    texto: "O Caminhante sobre o Mar de Névoa é uma obra do Romantismo alemão, de Caspar David Friedrich, geralmente datada de cerca de 1817–1818. A figura diante da paisagem pode convidar à reflexão sobre escolhas, natureza e o desconhecido.",
    fontes: [{ texto: "Coleção da Hamburger Kunsthalle", url: "https://www.hamburger-kunsthalle.de/en/nineteenth-century" }]
  },
  {
    id: "museu-biblioteca",
    termos: ["museu biblioteca", "museu-biblioteca", "atrio central", "novas salas", "onde ficam as salas", "como chegar as salas"],
    texto: "O museu-biblioteca começa pela Galeria Artística. Uma passagem ao fundo leva ao Átrio Central, que distribui o visitante entre quatro salas: História e Geografia, na Biblioteca do Conhecimento; Raciocínio e Laboratório de Investigação, no Centro de Aprendizagem. Cada ambiente tem placas próprias: mire em uma delas e pressione E ou clique para abrir a explicação.",
    fontes: []
  },
  {
    id: "sala-historia",
    termos: ["sala de historia", "sala historia", "fontes historicas", "o que tem na sala de historia"],
    texto: "A Sala de História faz parte da Biblioteca do Conhecimento. Ela propõe investigar sociedades e acontecimentos por meio de fontes históricas, considerando contexto, memória, mudanças e permanências. A ideia é comparar registros antes de construir uma interpretação.",
    fontes: []
  },
  {
    id: "rosa-dos-ventos",
    termos: ["rosa dos ventos", "pontos cardeais", "norte sul leste oeste", "onde fica o norte", "como me orientar no atrio", "direcoes do museu", "o que significam l e o", "letra l na rosa dos ventos", "letra o na rosa dos ventos", "leste oeste"],
    texto: "A rosa dos ventos fica no piso do Átrio Central. Ela usa N para Norte, L para Leste, S para Sul e O para Oeste, além das diagonais NE, SE, SO e NO. No mapa do museu, o Norte aponta para o fundo do átrio (eixo -Z), o Sul aponta de volta para a Galeria Artística (+Z), o Leste fica à direita (+X) e o Oeste à esquerda (-X) quando se olha em direção ao Norte.",
    fontes: [{ texto: "Explorar a Sala de Geografia", url: "../galeria/" }]
  },
  {
    id: "sala-geografia",
    termos: ["sala de geografia", "sala geografia", "o que tem na sala de geografia", "cartografia na sala"],
    texto: "A Sala de Geografia integra a Biblioteca do Conhecimento. O espaço aborda cartografia, território, geopolítica, paisagens e relações entre sociedade e natureza. Um dos convites é perceber que mapas são representações feitas a partir de escolhas de escala, projeção, legenda e informação.",
    fontes: []
  },
  {
    id: "sala-raciocinio",
    termos: ["sala de raciocinio", "sala raciocinio", "o que tem na sala de raciocinio", "problemas de logica"],
    texto: "A Sala de Raciocínio pertence ao Centro de Aprendizagem. Ela é dedicada a padrões, lógica, estratégias e demonstrações. Um dos primeiros desafios apresenta a sequência 2, 6, 12, 20, 30 e convida o visitante a justificar o próximo termo. Uma regra possível leva a 42: cada termo é o produto de um número natural pelo seu sucessor. A proposta é experimentar caminhos e explicar por que cada etapa funciona — não apenas chegar a um resultado.",
    fontes: []
  },
  {
    id: "laboratorio-investigacao",
    termos: ["laboratorio de investigacao", "sala de investigacao", "o que tem no laboratorio", "investigacao cientifica"],
    texto: "O Laboratório de Investigação é uma das salas do Centro de Aprendizagem. Ele apresenta o processo de investigação: formular perguntas, observar fenômenos, propor hipóteses, buscar evidências e revisar conclusões. A proposta é valorizar o raciocínio científico e o cuidado com as explicações.",
    fontes: []
  },
  {
    id: "controles",
    termos: ["como andar", "controles", "teclas", "como jogar", "como interagir"],
    texto: "Na versão 3D para computador, use W, A, S e D ou as setas para caminhar. Mova o mouse para olhar ao redor e mire em uma pintura ou personagem; depois pressione E ou clique para interagir. No celular, o museu apresenta uma versão leve em formato de exposições.",
    fontes: [{ texto: "Voltar ao portfólio", url: "../" }]
  },
  {
    id: "atena",
    termos: ["quem e voce", "quem e atena", "atena", "guia virtual"],
    texto: "Sou Atena, a guia virtual do museu. Minhas respostas vêm de um acervo de informações selecionadas e publicadas neste portfólio. Não sou uma IA generativa: respondo de forma controlada, com base no conteúdo disponível, e indico fontes quando possível.",
    fontes: [{ texto: "Conhecer o portfólio", url: "../" }]
  }
];

export function responderAtena(pergunta) {
  const q = normalizar(pergunta);
  if (!q) return {
    texto: "Escreva uma pergunta para começarmos. Você pode perguntar sobre conquistas, olimpíadas, interesses, trajetória ou obras do museu.",
    fontes: []
  };

  let melhor = null;
  let maiorPontuacao = 0;
  for (const item of respostas) {
    let pontos = 0;
    for (const termo of item.termos) {
      const chave = normalizar(termo);
      if (chave && q.includes(chave)) pontos += chave.includes(" ") ? 3 : 1;
    }
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhor = item;
    }
  }

  if (melhor) return { texto: melhor.texto, fontes: melhor.fontes, id: melhor.id };
  return {
    texto: "Ainda não encontrei essa informação no acervo publicado. Posso responder sobre a trajetória, as obras, as quatro novas salas e os temas abordados no museu-biblioteca. Experimente uma das sugestões abaixo.",
    fontes: [{ texto: "Consultar o portfólio completo", url: "../" }]
  };
}
