/*
 * Museu-biblioteca — catálogo das salas de conhecimento
 * -------------------------------------------------------
 * Conteúdo compartilhado entre a modelagem 3D, a sinalização e a versão móvel.
 * As salas são módulos independentes: novas entradas podem ser acrescentadas
 * aqui sem alterar a estrutura das salas já existentes.
 */
const SALAS_MUSEU_PT = [
  {
    id: "historia",
    titulo: "Sala de História",
    setor: "Biblioteca do Conhecimento",
    descricao: "Um espaço para investigar sociedades, acontecimentos e transformações ao longo do tempo. A proposta é olhar para o passado com curiosidade, comparar interpretações e entender como diferentes fontes ajudam a construir explicações históricas.",
    temas: ["Fontes históricas", "Civilizações e sociedades", "Tempo e memória", "Mudanças e permanências"],
    convite: "Escolha um acontecimento histórico e pense: quem deixou registros sobre ele? O que esses registros mostram — e o que podem deixar de fora?",
    atividade: {
      titulo: "Oficina de fontes históricas",
      enunciado: "Imagine que você encontrou duas cartas escritas por pessoas que viveram o mesmo acontecimento, mas em posições sociais diferentes. As duas descrevem o que ocorreu de maneiras distintas.",
      desenvolvimento: "Compare quem escreveu cada carta, quando e para quem. Identifique pontos em comum, diferenças de perspectiva e informações que ainda precisariam ser verificadas. Divergência não significa automaticamente que uma fonte seja falsa: contexto e intenção também importam."
    },
    orientacao: "Observe, compare fontes e contextualize antes de chegar a uma conclusão."
  },
  {
    id: "geografia",
    titulo: "Sala de Geografia",
    setor: "Biblioteca do Conhecimento",
    descricao: "Um ambiente dedicado à leitura do espaço geográfico e às relações entre natureza, sociedade, território e poder. Mapas, paisagens e fenômenos ajudam a compreender como o mundo é organizado e transformado.",
    temas: ["Cartografia e orientação", "Rosa dos ventos e pontos cardeais", "Território e geopolítica", "Paisagens e natureza", "População e espaço"],
    convite: "Observe a rosa dos ventos e identifique Norte, Sul, Leste e Oeste. Depois compare essas direções com a legenda, a escala e a orientação de um mapa: como cada recurso ajuda a localizar um lugar?",
    atividade: {
      titulo: "Leitura crítica de mapas",
      enunciado: "Dois mapas representam a mesma região, mas usam escalas, cores e projeções diferentes. Eles parecem contar histórias diferentes sobre o lugar.",
      desenvolvimento: "Confira o título, a legenda, a escala, a data e a projeção de cada mapa. Pergunte qual informação está em destaque e para que finalidade o mapa pode ter sido produzido. Compare apenas dados que usam critérios compatíveis."
    },
    orientacao: "Use a rosa dos ventos para reconhecer pontos cardeais e colaterais. Leia mapas como representações: toda escolha cartográfica destaca algumas informações e deixa outras em segundo plano."
  },
  {
    id: "raciocinio",
    titulo: "Sala de Raciocínio",
    setor: "Centro de Aprendizagem",
    descricao: "Um espaço para explorar problemas, testar estratégias e descobrir que uma solução bem explicada vale tanto quanto chegar ao resultado. A matemática aparece como linguagem de investigação, criatividade e argumentação.",
    temas: ["Padrões e regularidades", "Estratégias de resolução", "Lógica e demonstração", "Mais de um caminho para uma solução"],
    convite: "Antes de procurar uma fórmula, tente representar o problema, identificar relações e explicar por que cada passo faz sentido.",
    atividade: {
      titulo: "Desafio 01 — A sequência",
      enunciado: "Observe a sequência: 2, 6, 12, 20, 30, ... Qual seria o próximo termo? Procure uma regra que explique os números anteriores.",
      desenvolvimento: "Uma regra possível é multiplicar cada número natural pelo seu sucessor: 1 × 2 = 2; 2 × 3 = 6; 3 × 4 = 12; 4 × 5 = 20; 5 × 6 = 30. Seguindo a mesma regra, o próximo termo é 6 × 7 = 42. Em desafios de padrões, sempre vale explicar a regra escolhida: uma sequência curta pode admitir mais de uma continuação possível."
    },
    orientacao: "Experimente caminhos diferentes e justifique suas ideias, em vez de apenas registrar uma resposta."
  },
  {
    id: "investigacao",
    titulo: "Laboratório de Investigação",
    setor: "Centro de Aprendizagem",
    descricao: "Um ambiente inspirado no trabalho científico. Aqui, perguntas viram hipóteses, observações se transformam em evidências e explicações podem ser revistas quando surgem novas informações.",
    temas: ["Observação e perguntas", "Hipóteses e experimentos", "Evidências e interpretação", "Ciências da natureza"],
    convite: "Pense em um fenômeno cotidiano. O que você observaria? Que hipótese poderia explicar o que acontece? Que evidência ajudaria a testá-la?",
    atividade: {
      titulo: "Planeje uma investigação justa",
      enunciado: "Você quer investigar se a quantidade de luz influencia o crescimento de plantas da mesma espécie. Como organizar uma comparação que permita interpretar os resultados?",
      desenvolvimento: "Comece com plantas semelhantes e mantenha constantes o tipo de solo, o recipiente, a quantidade de água e o período de observação. Varie apenas a exposição à luz entre os grupos, registre medidas em intervalos regulares e repita a comparação quando possível. O resultado ainda precisará ser analisado: um experimento bem planejado não garante antecipadamente uma conclusão."
    },
    orientacao: "Diferencie observação, hipótese e conclusão. Uma boa investigação também reconhece seus limites."
  }
];


// English edition used by the 3D signs and mobile exhibitions.
const SALAS_MUSEU_EN = [
  {
    id: "historia", titulo: "History Room", setor: "Knowledge Library",
    descricao: "A space to investigate societies, events, and transformations over time. Explore the past with curiosity, compare interpretations, and understand how different sources help build historical explanations.",
    temas: ["Historical sources", "Civilizations and societies", "Time and memory", "Change and continuity"],
    convite: "Choose a historical event and ask: who left records about it? What do those records show — and what might they leave out?",
    atividade: {
      titulo: "Historical Sources Workshop",
      enunciado: "Imagine finding two letters written by people who experienced the same event from different social positions. They describe what happened in different ways.",
      desenvolvimento: "Compare who wrote each letter, when, and for whom. Identify similarities, differences in perspective, and information that still needs to be checked. Different accounts do not automatically mean that one source is false: context and purpose matter too."
    },
    orientacao: "Observe, compare sources, and establish context before reaching a conclusion."
  },
  {
    id: "geografia", titulo: "Geography Room", setor: "Knowledge Library",
    descricao: "An environment dedicated to understanding geographic space and the relationships between nature, society, territory, and power. Maps, landscapes, and natural processes help explain how the world is organized and transformed.",
    temas: ["Cartography and orientation", "Compass rose and cardinal directions", "Territory and geopolitics", "Landscapes and nature", "Population and space"],
    convite: "Look at the compass rose and identify North, South, East, and West. Then compare those directions with a map's legend, scale, and orientation: how does each feature help locate a place?",
    atividade: {
      titulo: "Critical Map Reading",
      enunciado: "Two maps show the same region but use different scales, colors, and projections. They may seem to tell different stories about the place.",
      desenvolvimento: "Check each map's title, legend, scale, date, and projection. Ask which information is emphasized and what purpose the map may have served. Compare only data that use compatible criteria."
    },
    orientacao: "Use the compass rose to identify cardinal and intercardinal directions. Read maps as representations: every cartographic choice highlights some information and places other details in the background."
  },
  {
    id: "raciocinio", titulo: "Reasoning Room", setor: "Learning Center",
    descricao: "A space to explore problems, test strategies, and discover that explaining a solution well matters just as much as reaching the result. Mathematics becomes a language for investigation, creativity, and argument.",
    temas: ["Patterns and regularities", "Problem-solving strategies", "Logic and proof", "More than one path to a solution"],
    convite: "Before looking for a formula, try representing the problem, identifying relationships, and explaining why each step makes sense.",
    atividade: {
      titulo: "Challenge 01 — The Sequence",
      enunciado: "Look at the sequence: 2, 6, 12, 20, 30, ... What could the next term be? Find a rule that explains the previous numbers.",
      desenvolvimento: "One possible rule is to multiply each natural number by its successor: 1 × 2 = 2; 2 × 3 = 6; 3 × 4 = 12; 4 × 5 = 20; 5 × 6 = 30. Following the same rule, the next term is 6 × 7 = 42. In pattern challenges, it is always worth explaining the chosen rule: a short sequence may allow more than one continuation."
    },
    orientacao: "Try different approaches and justify your ideas instead of only writing down an answer."
  },
  {
    id: "investigacao", titulo: "Research Laboratory", setor: "Learning Center",
    descricao: "An environment inspired by scientific work. Here, questions become hypotheses, observations turn into evidence, and explanations can be revised when new information appears.",
    temas: ["Observation and questions", "Hypotheses and experiments", "Evidence and interpretation", "Natural sciences"],
    convite: "Think of an everyday phenomenon. What would you observe? What hypothesis could explain it? What evidence would help test it?",
    atividade: {
      titulo: "Plan a Fair Investigation",
      enunciado: "You want to investigate whether the amount of light affects the growth of plants of the same species. How would you organize a comparison that makes the results meaningful?",
      desenvolvimento: "Start with similar plants and keep the type of soil, container, amount of water, and observation period constant. Vary only the light exposure between groups, record measurements at regular intervals, and repeat the comparison when possible. The results still need analysis: a well-designed experiment does not guarantee a conclusion in advance."
    },
    orientacao: "Distinguish observation, hypothesis, and conclusion. Good research also recognizes its limitations."
  }
];

export const SALAS_MUSEU =
  document.documentElement.lang === "en" ? SALAS_MUSEU_EN : SALAS_MUSEU_PT;
