# Museu-biblioteca Marcos David

O museu virtual é organizado como um edifício modular com uma Galeria Artística,
um Átrio Central e quatro salas temáticas iniciais. A galeria preserva suas
quatro exposições interativas — "A Noite Estrelada", "Nenúfares", "O Astrônomo"
e "O Caminhante sobre o Mar de Névoa" — e se conecta ao novo núcleo do edifício.

O Átrio Central distribui o visitante entre a Biblioteca do Conhecimento
(Sala de História e Sala de Geografia) e o Centro de Aprendizagem
(Sala de Raciocínio e Laboratório de Investigação). Cada sala possui uma
identidade arquitetônica, sinalização interativa e conteúdo curatorial próprio.

A estrutura foi pensada para receber novas salas sem reconstruir o museu:
dados, geometria, colisões, interações e apresentação móvel ficam separados
em módulos com responsabilidades definidas.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura da página: canvas, overlays de UI (introdução, painel, joystick) |
| `estilo.css` | Toda a aparência dos overlays (reaproveita a paleta de `/style.css`) |
| `js/config.js` | Dimensões da galeria artística e dados das pinturas |
| `js/salas.js` | Catálogo de salas: textos, temas e propostas de exploração |
| `js/alas.js` | Modelagem do átrio central, portais, sinalização e quatro salas temáticas |
| `js/texturas.js` | Texturas geradas por `<canvas>` (mármore, céu estrelado, inscrição, placas) |
| `js/cena.js` | Arquitetura, iluminação e partículas do salão |
| `js/controles.js` | Movimentação (teclado/mouse/toque) e colisões entre galeria, átrio e alas |
| `js/pinturas.js` | Pinturas, personagens, toca-discos, mira/raycaster e painéis de pinturas/salas |
| `js/main.js` | Liga a galeria e as alas, controla qualidade gráfica e loop de renderização |
| `js/mobile.js` | Experiência editorial leve para telas móveis, com exposições e diretório das salas |
| `museu.css` | Estilos do diretório móvel do museu-biblioteca |

Tecnologia: Three.js via ES modules, carregado por CDN (import map no
`index.html`, versão fixada em `0.160.0`). Nenhuma dependência externa além
disso — texturas são geradas por código, sem arquivos de imagem, exceto a
reprodução de "A Noite Estrelada" (mesma URL do Wikimedia já usada em
`/style.css`).

## Como estender o museu-biblioteca

A arquitetura separa o conteúdo do desenho físico. Para criar uma nova sala:

1. Acrescente o registro em `js/salas.js`, com `id`, `titulo`, `setor`,
   `descricao`, `temas`, `convite`, `orientacao` e, quando houver, `atividade`.
2. Acrescente a posição, o portal, a geometria e a decoração em
   `js/alas.js`. Use os helpers existentes para pisos, paredes, caixas,
   placas e luzes.
3. Atualize os limites e os corredores em `js/controles.js`, para que a
   circulação permita entrar e sair sem atravessar paredes ou colunas.
4. A interação dos letreiros e os painéis de conteúdo são gerados a partir do
   catálogo em `salas.js` e já são tratados por `pinturas.js`.
5. Inclua a sala no diretório móvel, que lê automaticamente o catálogo
   `SALAS_MUSEU` em `mobile.js`.

As salas atuais são módulos independentes. Não é necessário adicionar fotos,
medalhas ou certificados para criar uma nova área: texto curatorial,
elementos arquitetônicos e experiências interativas já podem dar identidade
ao espaço.

## Organização espacial atual

- **Galeria Artística:** salão original; preserva o ponto de entrada e as quatro
  exposições existentes. O novo portal fica no fundo da sala.
- **Átrio Central:** distribui o visitante entre as alas e funciona como núcleo
  de orientação do edifício.
- **Biblioteca do Conhecimento:** ala oeste, com História e Geografia.
- **Centro de Aprendizagem:** ala leste, com Raciocínio e Investigação.

A versão 3D é usada em telas maiores. Em dispositivos com toque e largura
de até 760 px, a página oferece uma experiência editorial leve, com as quatro
exposições, o diretório das salas, o player de música e Atena. O diretório
móvel não simula a caminhada 3D.

## Qualidade gráfica adaptativa

`main.js` estima um nível — `"baixo"`, `"medio"` ou `"alto"` — a partir de
`navigator.hardwareConcurrency`, `navigator.deviceMemory` (quando o
navegador expõe) e do tamanho da tela. **Isso só ajusta quanto custa
renderizar** (sombra do lustre, resolução do céu estrelado, quantidade de
partículas, pixel ratio e antialiasing) — nunca decide se o 3D roda. A
resolução de tela fica limitada a 1×, 1,2× ou 1,5× conforme o nível, e
sombras/antialiasing ficam reservados ao nível alto. A
decisão de rodar ou não depende só de `detectarSuporteWebGL()`
conseguir criar um contexto WebGL de verdade. Se precisar de mais um
parâmetro adaptativo no futuro, ele entra em `criarCena(THREE, nivel)` do
mesmo jeito que `qtdEstrelas`/`qtdParticulasAlvo`/`sombraLustre`.
O loop de renderização também pausa quando a aba fica em segundo plano,
retoma ao voltar e apresenta uma alternativa textual se o navegador perder
o contexto WebGL.

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
- **Nenúfares (1916)**: reprodução do Google Art Project, via Wikimedia
  Commons, identificada como domínio público (PD-Art). A página de origem
  está ligada no painel da obra.
- **O Astrônomo**: reprodução de obra em domínio público, Wikimedia Commons
  (PD-Art).
- **O Caminhante sobre o Mar de Névoa**: reprodução de obra em domínio
  público, Wikimedia Commons (PD-Art).

Os links para as páginas de origem das reproduções e para as fichas dos
museus ficam nos respectivos painéis.

## Limitações atuais

- A primeira expansão do museu-biblioteca contém quatro salas temáticas. A
  arquitetura permite ampliar o catálogo, mas a adição de uma nova sala ainda
  exige modelagem física e atualização dos limites de circulação.
- A aproximação das pinturas utiliza uma vinheta escurecida, não um desfoque
  óptico real.
- Atena usa um acervo curado com respostas determinísticas; não é uma IA
  generativa. O histórico de conversa mantém as oito perguntas mais recentes.
- Em teclado sem mouse, a mira continua no centro da tela; a exploração foi
  desenhada principalmente para mouse ou controles de toque.
