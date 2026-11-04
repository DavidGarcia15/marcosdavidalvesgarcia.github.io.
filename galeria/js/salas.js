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
    orientacao: "Observe, compare fontes e contextualize antes de chegar a uma conclusão."
  },
  {
    id: "geografia",
    titulo: "Sala de Geografia",
    setor: "Biblioteca do Conhecimento",
    descricao: "Um ambiente dedicado à leitura do espaço geográfico e às relações entre natureza, sociedade, território e poder. Mapas, paisagens e fenômenos ajudam a compreender como o mundo é organizado e transformado.",
    temas: ["Cartografia e orientação", "Território e geopolítica", "Paisagens e natureza", "População e espaço"],
    convite: "Observe um mapa: o que foi escolhido para aparecer nele? A escala, a legenda e a projeção mudam a maneira como interpretamos o mundo?",
    orientacao: "Leia mapas como representações: toda escolha cartográfica destaca algumas informações e deixa outras em segundo plano."
  },
  {
    id: "raciocinio",
    titulo: "Sala de Raciocínio",
    setor: "Centro de Aprendizagem",
    descricao: "Um espaço para explorar problemas, testar estratégias e descobrir que uma solução bem explicada vale tanto quanto chegar ao resultado. A matemática aparece como linguagem de investigação, criatividade e argumentação.",
    temas: ["Padrões e regularidades", "Estratégias de resolução", "Lógica e demonstração", "Mais de um caminho para uma solução"],
    convite: "Antes de procurar uma fórmula, tente representar o problema, identificar relações e explicar por que cada passo faz sentido.",
    orientacao: "Experimente caminhos diferentes e justifique suas ideias, em vez de apenas registrar uma resposta."
  },
  {
    id: "investigacao",
    titulo: "Laboratório de Investigação",
    setor: "Centro de Aprendizagem",
    descricao: "Um ambiente inspirado no trabalho científico. Aqui, perguntas viram hipóteses, observações se transformam em evidências e explicações podem ser revistas quando surgem novas informações.",
    temas: ["Observação e perguntas", "Hipóteses e experimentos", "Evidências e interpretação", "Ciências da natureza"],
    convite: "Pense em um fenômeno cotidiano. O que você observaria? Que hipótese poderia explicar o que acontece? Que evidência ajudaria a testá-la?",
    orientacao: "Diferencie observação, hipótese e conclusão. Uma boa investigação também reconhece seus limites."
  }
];
