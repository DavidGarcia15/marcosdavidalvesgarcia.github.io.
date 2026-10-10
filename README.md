# Portfólio Acadêmico — Marcos David Alves Garcia

Site estático (HTML, CSS e JavaScript puros, sem dependências de build) feito
para ser publicado gratuitamente no GitHub Pages.

```
.
├── index.html            → página inicial
├── conquistas/index.html → linha do tempo completa de conquistas
├── sobre/index.html      → apresentação pessoal
├── style.css              → identidade visual (todas as páginas)
├── script.js               → menu mobile + filtros da página de conquistas
├── robots.txt
├── sitemap.xml
└── assets/                 → onde colocar foto e imagens de certificados (ver assets/README.md)
```

---

## 1. Endereço do site (já configurado)

Todos os arquivos já apontam para a URL real do projeto:
`https://davidgarcia15.github.io/marcosdavidalvesgarcia.github.io/`
(repositório `marcosdavidalvesgarcia.github.io`, conta `DavidGarcia15` — como
o nome do repositório não é exatamente `davidgarcia15.github.io`, o GitHub
publica como site de projeto, com esse caminho mais longo; o site funciona
normalmente nele). Isso já está refletido em:

- `index.html` (tag `<link rel="canonical">`, `og:url` e o JSON-LD)
- `conquistas/index.html` (mesmos campos)
- `sobre/index.html` (mesmos campos)
- `robots.txt` (linha `Sitemap:`)
- `sitemap.xml` (as três tags `<loc>`)

Se um dia renomear o repositório ou trocar de usuário, procure e substitua
`davidgarcia15.github.io/marcosdavidalvesgarcia.github.io` nesses mesmos
cinco arquivos.

---

## 2. Publicar no GitHub Pages

1. Crie uma conta no GitHub, caso ainda não tenha.
2. Crie um repositório novo (botão **New repository**). Pode ser público ou
   privado — o GitHub Pages do plano gratuito funciona com repositórios
   públicos; para repositório privado é necessário um plano pago.
   Sugestão de nome: `portfolio` ou `portfolio-academico`.
3. Envie os arquivos deste projeto para o repositório. Duas formas:
   - **Pela interface web**: em *Add file → Upload files*, arraste os
     arquivos e pastas mantendo a estrutura acima (navegadores baseados em
     Chrome/Edge permitem arrastar pastas inteiras).
   - **Pelo terminal (git)**:
     ```
     git init
     git add .
     git commit -m "Primeira versão do portfólio"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
     git push -u origin main
     ```
4. No repositório, vá em **Settings → Pages**.
5. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
6. Em **Branch**, selecione `main` e a pasta `/ (root)`, depois **Save**.
7. Aguarde alguns minutos. O GitHub mostrará a URL pública, no formato
   `https://davidgarcia15.github.io/marcosdavidalvesgarcia.github.io/`.
8. Abra essa URL (de preferência em uma aba anônima) para confirmar que o
   site está acessível publicamente.

Se quiser que o site fique na raiz do seu usuário (sem `/SEU-REPOSITORIO/`
na URL), o nome do repositório precisa ser exatamente
`SEU-USUARIO.github.io` — nesse caso, os links internos do site (que usam
caminhos relativos) continuam funcionando normalmente.

---

## 3. Checklist antes de tornar o site público

- [x] URL real já configurada em todos os arquivos (seção 1).
- [ ] Revisei a seção **ExpressArte 2015** — ela está marcada como
      "informação a confirmar" até que o certificado seja conferido.
- [ ] Se for adicionar uma foto, ela está autorizada e comprimida (ver
      `assets/README.md`).
- [ ] Se for adicionar imagens de certificados, conferi se não expõem CPF,
      data de nascimento completa, QR Code de verificação ou outros dados
      que não precisam ser públicos.
- [ ] Testei o menu mobile e os filtros da página de Conquistas no celular.
- [ ] Testei a navegação por teclado (Tab) e o foco visível nos links.
- [ ] Testei o site com "reduzir movimento" ativado no sistema — as
      animações devem ser praticamente eliminadas.
- [ ] Abri a URL pública em uma aba anônima para confirmar que carrega.
- [ ] Verifiquei, no celular e no computador, se nenhum texto está cortado
      ou sobreposto.

### Nota sobre privacidade

Como este é o portfólio de um estudante menor de idade, o site **não inclui**
data de nascimento completa, nome da escola, endereço residencial, telefone
ou CPF em nenhum lugar — nem no conteúdo visível, nem nos dados estruturados
(JSON-LD). A localização aparece apenas de forma genérica (Petrolina, PE).
Vale uma conferência final em família antes de publicar — especialmente
sobre incluir ou não uma foto, e sobre quais imagens de certificado (se
houver) serão mostradas.

---

## 4. Google Search Console

Depois que o site estiver no ar:

1. Acesse [search.google.com/search-console](https://search.google.com/search-console).
2. Adicione uma propriedade do tipo **"Prefixo do URL"** com o endereço
   completo do site (ex.: `https://davidgarcia15.github.io/marcosdavidalvesgarcia.github.io/`).
3. Verifique a propriedade pelo método **"Tag HTML"**: o Search Console
   fornecerá uma tag `<meta name="google-site-verification" ...>` — adicione
   essa tag dentro do `<head>` de `index.html`, publique a alteração e
   clique em "Verificar".
4. Em **Sitemaps**, envie o endereço `sitemap.xml` (ex.:
   `https://davidgarcia15.github.io/marcosdavidalvesgarcia.github.io/sitemap.xml`).
5. Em **Inspeção de URL**, cole a URL da página inicial e clique em
   **"Solicitar indexação"**.
6. Repita a inspeção/solicitação para `/conquistas/` e `/sobre/`.
7. Acompanhe periodicamente:
   - **Cobertura/Páginas**: mostra o que já foi indexado e eventuais erros.
   - **Desempenho**: impressões, cliques e as consultas que levam ao site.
   - **Melhorias/Dados estruturados**: confirma se o Google leu o JSON-LD
     corretamente.

Solicitar indexação **não obriga** o Google a indexar a página, e o processo
pode levar de alguns dias a algumas semanas, dependendo da autoridade do
domínio e de outros fatores. Isso é normal.

Referências oficiais usadas neste projeto:
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=pt-br)
- [Search Console: primeiros passos](https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=pt-BR)
- [Structured data: ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

---

## 5. Checklist técnico de SEO já aplicado

- [x] Título e meta description únicos em cada página.
- [x] Um único `<h1>` por página, refletindo o conteúdo.
- [x] Nome completo em texto HTML real (não em imagem) no título, H1 e corpo.
- [x] Conteúdo principal presente no HTML, sem depender de JavaScript — os
      filtros da página de Conquistas apenas ocultam visualmente com
      `[hidden]`; nada é removido do HTML.
- [x] Tags `canonical` em todas as páginas.
- [x] `robots.txt` liberando o rastreamento e apontando para o sitemap.
- [x] `sitemap.xml` com as três URLs públicas.
- [x] Dados estruturados JSON-LD (`Person` dentro de `ProfilePage`) na
      página inicial, com apenas informações verificadas.
- [x] Open Graph básico para compartilhamento em redes sociais.
- [x] Favicon original (SVG embutido, sem dependência externa).
- [x] HTML semântico (`header`, `nav`, `main`, `section`, `article`, `footer`).
- [x] Responsivo (menu mobile, grades fluidas, texto legível em telas pequenas).
- [x] Foco de teclado visível e link "Pular para o conteúdo".
- [x] `prefers-reduced-motion` respeitado.
- [x] Sem bibliotecas pesadas, vídeos automáticos ou dependências externas
      além das fontes do Google Fonts.
- [x] URL real configurada em todos os arquivos (seção 1).
- [ ] **Pendente do seu lado:** depois que o site estiver no ar, validar o
      JSON-LD em [validator.schema.org](https://validator.schema.org)
      colando `https://davidgarcia15.github.io/marcosdavidalvesgarcia.github.io/`.

---

## 6. Informações já publicadas vs. pendentes de confirmação

### Publicadas (a partir do que foi informado)
- OBGP 2026 — medalha de prata
- TNBio 2026 — medalha de ouro
- OBGP 2025 — medalha de bronze
- OBMF 2025 — medalha de prata
- 20ª OBMEP 2025 — Menção Honrosa Nacional (não é medalha)
- OBGP 2024 — medalha de bronze
- Olimpíada Mandacaru de Matemática 2023 — 3º lugar / bronze

### Pendentes (não publicadas como fato definitivo)
- **ExpressArte 2015** (Petrolina): categoria, modalidade e natureza exata do
  reconhecimento — aguardando conferência do certificado.
- Classificação para a 2ª fase da OBMEP 2026 (se desejar incluir).
- Classificação no processo seletivo do IFSertãoPE (Técnico em
  Agropecuária, Campus Petrolina Zona Rural) — só deve ser publicada
  mediante confirmação e comprovante, sem afirmar matrícula ou frequência.
- Cursos de Administração Inicial e Informática Avançado — estado exato
  (inscrição, andamento ou conclusão) a confirmar.
- Links públicos para projetos de programação e perfis profissionais.
- Foto de perfil (opcional).

Assim que tiver os certificados ou confirmações, me envie (ou peça para
adicionar) que atualizo a página de Conquistas e, se for o caso, o JSON-LD.

---

## 7. Fontes consultadas nesta pesquisa

- Seleta Educação — [OBGP](https://www.seletaeducacao.com.br/obgp), [TNBio](https://www.seletaeducacao.com.br/tnbio), [OBMF](https://www.seletaeducacao.com.br/obmf)
- [OBMEP — regulamento da 20ª edição](https://20a.obmep.org.br/regulamento.htm)
- [Olimpíada Mandacaru de Matemática — provas anteriores](https://olimpiadamandacaru.com.br/provas-anteriores/)

Uma busca pelo nome completo do estudante não retornou páginas públicas que
já o mencionem associado a essas competições — o que é esperado, já que
listas de resultados nominais nem sempre ficam publicamente acessíveis.
Nenhuma afirmação de "lista oficial encontrada" foi feita neste portfólio.
Também não foi localizada, nesta pesquisa, uma página pública específica
sobre o evento "ExpressArte" em Petrolina — por isso esse registro permanece
como pendente até a conferência do certificado.

---

## 8. Limitações conhecidas

- O JSON-LD usa apenas o distrito/cidade (Petrolina, PE) como localização,
  nunca endereço completo.
- Não há imagens de certificados incluídas por padrão — a pasta `assets/`
  está pronta para recebê-las quando forem revisadas.
- O domínio/URL do site precisa ser configurado manualmente (seção 1) antes
  da publicação, pois a URL real só existe depois da criação do repositório.
- Como não há como verificar de forma independente o conteúdo de
  certificados que não foram enviados, as conquistas foram registradas tal
  como informadas, sinalizando com clareza o que ainda depende de
  confirmação (seção 6).
