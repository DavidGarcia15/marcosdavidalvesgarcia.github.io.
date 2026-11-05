/*
 * Museu-biblioteca — catálogo das salas de conhecimento
 * -------------------------------------------------------
 * Conteúdo compartilhado entre a modelagem 3D, a sinalização e a versão móvel.
 * As salas são módulos independentes: novas entradas podem ser acrescentadas
 * aqui sem alterar a estrutura das salas já existentes.
 */
export const SALAS_MUSEU = [
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
