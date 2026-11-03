# Galeria Marcos David — Sala 1 (fundação do museu)

O museu virtual 3D possui um salão principal com arquitetura clássica,
iluminação adaptativa, movimentação em primeira pessoa e quatro exposições
interativas: "A Noite Estrelada", "Nenúfares", "O Astrônomo" e "O Caminhante
sobre o Mar de Névoa". Cada obra tem reprodução própria, proporção de moldura,
foco de luz, aproximação cinematográfica e painel curatorial com contexto,
detalhes para observar e ligação temática com a galeria.

As próximas etapas do projeto são um curador com IA, personagens históricos,
mais salas e trilha sonora.

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

- **Novas pinturas / salas**: adicionar uma entrada em `PINTURAS` (em
  `config.js`) com imagem, créditos, proporção, textos curatoriais e fontes.
  `pinturas.js` gera moldura, iluminação, plano de interação e painel a
  partir desses dados. Uma nova sala deve virar uma função em `cena.js`.
- **Curador com IA**: `config.js` concentra os metadados e textos das obras,
  servindo como base para um curador futuro sem duplicar informações.
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

## Créditos das reproduções

- **A Noite Estrelada**: Google Art Project / Wikimedia Commons, obra em
  domínio público.
- **Nenúfares (1916)**: fotografia de Sailko, Wikimedia Commons, CC BY-SA 3.0.
  O crédito e o link da licença são exibidos no painel da obra.
- **O Astrônomo**: reprodução de obra em domínio público, Wikimedia Commons
  (PD-Art).
- **O Caminhante sobre o Mar de Névoa**: reprodução de obra em domínio
  público, Wikimedia Commons (PD-Art).

Os links para as páginas de origem das reproduções e para as fichas dos
museus ficam nos respectivos painéis.

## Limitações atuais

- O salão principal contém quatro exposições; novas salas e pinturas ainda
  podem ser adicionadas.
- A aproximação utiliza uma vinheta escurecida, não um desfoque óptico real.
- O curador com IA, os personagens históricos e a trilha sonora ainda não
  foram implementados.
- Em teclado sem mouse, a mira continua no centro da tela; a exploração foi
  desenhada principalmente para mouse ou controles de toque.
