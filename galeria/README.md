# Galeria Marcos David — Sala 1 (fundação do museu)

Primeira versão do museu virtual 3D descrito no projeto da Galeria. Esta
etapa implementa **apenas o salão principal de entrada**: arquitetura,
iluminação, movimentação em primeira pessoa e a interação completa com a
primeira pintura ("A Noite Estrelada"). As demais funcionalidades descritas
no projeto completo (curador com IA, salas adicionais, personagens
históricos, trilha sonora) ainda não foram implementadas — ver "Próximos
passos" abaixo.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura da página: canvas, overlays de UI (introdução, painel, joystick) |
| `estilo.css` | Toda a aparência dos overlays (reaproveita a paleta de `/style.css`) |
| `js/config.js` | Dados de conteúdo: dimensões da sala, lista de pinturas, conquistas em destaque |
| `js/texturas.js` | Texturas geradas por `<canvas>` (mármore, céu estrelado, inscrição, placas) |
| `js/cena.js` | Arquitetura, iluminação e partículas do salão |
| `js/controles.js` | Movimentação (teclado/mouse/toque) e colisão |
| `js/pinturas.js` | Molduras, mira/raycaster, aproximação cinematográfica e painel |
| `js/main.js` | Liga tudo e roda o loop de renderização |

Tecnologia: Three.js via ES modules, carregado por CDN (import map no
`index.html`, versão fixada em `0.160.0`). Nenhuma dependência externa além
disso — texturas são geradas por código, sem arquivos de imagem, exceto a
reprodução de "A Noite Estrelada" (mesma URL do Wikimedia já usada em
`/style.css`).

## Como estender (próximas salas e funcionalidades)

- **Novas pinturas / salas**: adicionar entradas em `PINTURAS` (em
  `config.js`) com `implementada: true` e os textos reais; `pinturas.js` já
  sabe criar a moldura, o holofote e a interação completa a partir disso.
  Uma nova sala (corredor, segunda sala de exposição) deve virar uma nova
  função em `cena.js` (ex.: `criarCorredorNorte()`), chamada a partir de
  `criarCena()`, reaproveitando os materiais já definidos.
- **Curador com IA**: `config.js` já centraliza os dados reais do
  portfólio (`CONQUISTAS_DESTAQUE`) justamente para servir como fonte de
  conhecimento também do curador, quando essa etapa for implementada —
  evita manter dois lugares com a mesma informação.
- **Personagens históricos**: nenhuma arte de personagem foi criada nesta
  etapa (não há ferramenta de geração de imagem disponível neste ambiente).
  Será necessário encomendar/gerar essas artes separadamente antes de
  integrá-las.
- **Trilha sonora**: ainda não implementada; o ponto de entrada natural é
  `main.js`, após o clique em "Entrar na galeria" (já é o gesto do usuário
  exigido pelos navegadores para liberar áudio).

## Qualidade gráfica adaptativa

`main.js` estima um nível — `"baixo"`, `"medio"` ou `"alto"` — a partir de
`navigator.hardwareConcurrency`, `navigator.deviceMemory` (quando o
navegador expõe) e do tamanho da tela. **Isso só ajusta quanto custa
renderizar** (sombra do lustre, resolução do céu estrelado, quantidade de
partículas, pixel ratio, antialiasing) — nunca decide se o 3D roda. A
decisão de rodar ou não depende só de `detectarSuporteWebGL()`
conseguir criar um contexto WebGL de verdade. Se precisar de mais um
parâmetro adaptativo no futuro, ele entra em `criarCena(THREE, nivel)` do
mesmo jeito que `qtdEstrelas`/`qtdParticulasAlvo`/`sombraLustre`.

### Lição aprendida: `hidden` pode ser silenciosamente ignorado
Um elemento com o atributo HTML `hidden` só fica de fato invisível por uma
regra `[hidden] { display: none }` do navegador — e **qualquer** regra do
nosso CSS que defina `display` para esse elemento (mesmo vindo de uma
classe) tem prioridade sobre ela. Foi exatamente isso que, na primeira
versão, fazia o aviso de "sem suporte a 3D" aparecer sempre, em qualquer
aparelho: `.fallback { display: flex; ... }` ignorava o `hidden`. A
correção foi uma regra `[hidden] { display: none !important; }` logo no
topo de `estilo.css` — **mantenha essa regra** se for mexer na folha de
estilos, e tome cuidado ao criar um novo painel/overlay que use `hidden`
para esconder.

## Limitações conhecidas desta primeira versão

- Apenas a pintura "A Noite Estrelada" tem interação completa; as outras
  três exibem moldura, holofote e uma placa "em preparação".
- Sem efeito de desfoque real no ambiente ao redor durante a aproximação
  (usa uma vinheta escurecida, mais leve para carregar).
- Sem áudio/trilha sonora ainda.
- Em teclado "puro" (sem mouse/toque), dá para entrar e fechar o painel da
  pintura, mas não dá para mirar nela — a mira é sempre o centro da tela.
