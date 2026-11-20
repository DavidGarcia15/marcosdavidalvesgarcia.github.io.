/*
 * Preferências do portfólio: idioma e modo Lite.
 * As escolhas ficam salvas neste navegador e são aplicadas em todas as páginas.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var LANG_KEY = "mdag-site-language";
  var LITE_KEY = "mdag-site-lite";

  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      /* O site continua funcional mesmo quando o armazenamento está bloqueado. */
    }
  }

  var language = readPreference(LANG_KEY, "pt");
  var lite = readPreference(LITE_KEY, "0") === "1";

  // Aplica preferências estruturais antes do CSS e dos módulos da página.
  if (lite) root.classList.add("site-lite");
  root.lang = language === "en" ? "en" : "pt-BR";

  var translations = {
    "Pular para o conteúdo": "Skip to content",
    "Início": "Home",
    "Conquistas": "Achievements",
    "Projetos": "Projects",
    "Minha Trajetória": "My Journey",
    "Sobre": "About",
    "Menu": "Menu",
    "Navegação principal": "Main navigation",
    "Portfólio acadêmico": "Academic portfolio",
    "Marcos David Alves Garcia | Portfólio Acadêmico e Medalhas de Olimpíadas": "Marcos David Alves Garcia | Academic Portfolio and Olympiad Awards",
    "Museu-biblioteca virtual Marcos David | Arte e Conhecimento": "Marcos David Virtual Museum-Library | Art and Knowledge",
    "Conquistas de Marcos David Alves Garcia | Medalhas em Olimpíadas Acadêmicas": "Achievements of Marcos David Alves Garcia | Academic Olympiad Awards",
    "Projetos e Produções | Marcos David Alves Garcia": "Projects and Creative Work | Marcos David Alves Garcia",
    "Sobre Marcos David Alves Garcia | Portfólio Acadêmico": "About Marcos David Alves Garcia | Academic Portfolio",
    "Minha Trajetória | Marcos David Alves Garcia": "My Journey | Marcos David Alves Garcia",

    "Estudante, entusiasta do conhecimento, futuro professor de História e Geografia": "Student, knowledge enthusiast, and future History and Geography teacher",
    "Sou estudante do Ensino Médio e, nos últimos anos, venho participando de olimpíadas e desafios acadêmicos em áreas como Geopolítica, Biologia, Geoinformação e Matemática — experiências que foram ampliando minha visão de mundo a cada edição. Entre meus interesses, História e Geografia ocupam um lugar especial: é a área em que pretendo seguir como professor. Mas também gosto de explorar a Matemática, as Ciências e a Tecnologia, sempre em busca de novos desafios. Este portfólio reúne um pouco dessa trajetória.": "I am a high school student who has taken part in academic olympiads and challenges in areas such as Geopolitics, Biology, Geoinformation, and Mathematics. Each experience has broadened the way I see the world. History and Geography hold a special place among my interests, and I hope to become a teacher in these fields. I also enjoy exploring Mathematics, Science, and Technology, always looking for new challenges. This portfolio brings together part of that journey.",
    "Ver conquistas": "View achievements",
    "Sobre mim": "About me",
    "Conhecer projetos": "Explore projects",
    "Explorar o Museu-biblioteca 3D": "Explore the 3D Museum-Library",
    "Um céu de conquistas": "A Sky of Achievements",
    "Cada conquista é uma estrela na minha trajetória": "Every achievement is a star in my journey",
    "Toque ou selecione cada ponto de luz sobre a pintura para conhecer uma conquista ou distinção da trajetória.": "Select each point of light on the painting to discover an achievement or distinction from my journey.",
    "A Noite Estrelada": "The Starry Night",
    ", Vincent van Gogh, 1889 · Museum of Modern Art · reprodução em domínio público (Google Art Project, via Wikimedia Commons)": ", Vincent van Gogh, 1889 · Museum of Modern Art · public-domain reproduction (Google Art Project, via Wikimedia Commons)",
    "Medalha de ouro": "Gold medal",
    "Medalha de prata": "Silver medal",
    "Medalha de bronze": "Bronze medal",
    "Medalha de bronze · 299º lugar": "Bronze medal · 299th place",
    "3º lugar · Bronze": "3rd place · Bronze",
    "1º lugar · ExpressArte 2015": "1st place · ExpressArte 2015",
    "Torneio Nacional de Biologia (TNBio)": "National Biology Tournament (TNBio)",
    "2026 · Organização: Seleta Educação · Área: Biologia e ciências da vida": "2026 · Organizer: Seleta Educação · Field: Biology and life sciences",
    "O TNBio avalia conhecimentos de Biologia que vão da célula aos ecossistemas, passando por biodiversidade, fisiologia humana, genética básica e conservação ambiental. Esta foi minha primeira participação na competição, com resultado em ouro.": "The TNBio assesses Biology knowledge, from cells to ecosystems, including biodiversity, human physiology, basic genetics, and environmental conservation. This was my first time taking part in the competition, and I earned a gold medal.",
    "Página oficial do TNBio": "Official TNBio website",
    "16ª Olimpíada de Literatura (OL)": "16th Literature Olympiad (OL)",
    "12 de novembro de 2026 · Categoria Júnior 29 · Literatura": "November 12, 2026 · Junior 29 category · Literature",
    "Medalha de bronze com a obra": "Bronze medal for the book",
    "A Revolução dos Bichos": "Animal Farm",
    ", de George Orwell. A pontuação foi de": ", by George Orwell. The score was",
    "884/1.000": "884/1,000",
    ", alcançando o": ", earning",
    "299º lugar": "299th place",
    "na classificação da categoria.": "in the category ranking.",
    "Consultar resultado oficial da OL": "Check the official OL results",
    "Olimpíada Brasileira de Geopolítica (OBGP)": "Brazilian Geopolitics Olympiad (OBGP)",
    "2026 · Organização: Seleta Educação · Área: Geopolítica": "2026 · Organizer: Seleta Educação · Field: Geopolitics",
    "A OBGP desafia estudantes a compreender as relações entre países — fatores geográficos, políticos, econômicos e culturais por trás de conflitos, alianças e disputas globais. Minha terceira participação consecutiva na prova, com evolução do bronze (2024) para a prata em 2026.": "The OBGP challenges students to understand relations between countries and the geographic, political, economic, and cultural factors behind conflicts, alliances, and global disputes. This was my third consecutive participation, improving from bronze in 2024 to silver in 2026.",
    "Página oficial da OBGP": "Official OBGP website",
    "Olimpíada Brasileira de Geoinformação (OBGE)": "Brazilian Geoinformation Olympiad (OBGE)",
    "2025 · Área: Geoinformação": "2025 · Field: Geoinformation",
    "Medalha de prata na Olimpíada Brasileira de Geoinformação (OBGE), competição acadêmica relacionada à Geografia e à geoinformação.": "Silver medal in the Brazilian Geoinformation Olympiad (OBGE), an academic competition related to Geography and geoinformation.",
    "Site oficial da OBGE": "Official OBGE website",
    "Menção Honrosa Nacional": "National Honorable Mention",
    "20ª Olimpíada Brasileira de Matemática das Escolas Públicas (OBMEP)": "20th Brazilian Public Schools Mathematics Olympiad (OBMEP)",
    "Edição 2025 · Organização: IMPA, com apoio do MEC e do MCTI · Área: Matemática": "2025 edition · Organized by IMPA, with support from MEC and MCTI · Field: Mathematics",
    "A OBMEP, organizada pelo Instituto Nacional de Matemática Pura e Aplicada (IMPA) com apoio do Ministério da Educação e do Ministério da Ciência, Tecnologia e Inovação, é a maior olimpíada de matemática do Brasil. Na 20ª edição (2025), recebi o Certificado de Menção Honrosa Nacional — uma distinção concedida a estudantes com bom desempenho na prova, distinta das medalhas de ouro, prata e bronze.": "Organized by the Institute of Pure and Applied Mathematics (IMPA), with support from Brazil's education and science ministries, OBMEP is the country's largest mathematics olympiad. In its 20th edition (2025), I received a National Honorable Mention certificate, a distinction separate from the gold, silver, and bronze medals.",
    "Página oficial da OBMEP": "Official OBMEP website",
    "Olimpíada Brasileira de Matemática Financeira (OBMF)": "Brazilian Financial Mathematics Olympiad (OBMF)",
    "2025 · Organização: Seleta Educação · Área: Matemática Financeira": "2025 · Organizer: Seleta Educação · Field: Financial Mathematics",
    "A OBMF une matemática e educação financeira: orçamento, juros, crédito e investimentos aplicados a situações do cotidiano. A prova me rendeu a medalha de prata em 2025.": "The OBMF combines mathematics and financial education, covering budgeting, interest, credit, and investments in everyday situations. I earned a silver medal in 2025.",
    "Página oficial da OBMF": "Official OBMF website",
    "2025 · Organização: Seleta Educação · Área: Geopolítica": "2025 · Organizer: Seleta Educação · Field: Geopolitics",
    "Segunda edição da OBGP da qual participei, com resultado em bronze — um passo na evolução que levaria à medalha de prata no ano seguinte.": "My second OBGP edition, resulting in a bronze medal — one step in the progress that would lead to silver the following year.",
    "2024 · Organização: Seleta Educação · Área: Geopolítica": "2024 · Organizer: Seleta Educação · Field: Geopolitics",
    "Minha primeira participação na OBGP, com resultado em bronze — o ponto de partida de uma sequência de três edições consecutivas na prova, com evolução de resultado a cada ano.": "My first OBGP participation, earning bronze — the starting point of three consecutive editions, with an improved result each year.",
    "3º lugar · Bronze": "3rd place · Bronze",
    "Olimpíada Mandacaru de Matemática": "Mandacaru Mathematics Olympiad",
    "2023 · Área: Matemática": "2023 · Field: Mathematics",
    "Competição de matemática com forte identidade regional nordestina — seus níveis levam nomes como Cajuína, Luiz Gonzaga, Zumbi dos Palmares e Lampião, em referência à cultura do Sertão. Resultado: terceiro lugar, com reconhecimento em bronze, conforme certificado do estudante.": "A mathematics competition with a strong Northeastern Brazilian identity. Its levels are named after figures and symbols such as Cajuína, Luiz Gonzaga, Zumbi dos Palmares, and Lampião, reflecting the culture of the Sertão. The certificate records a third-place finish and bronze recognition.",
    "Página oficial da Olimpíada Mandacaru": "Official Mandacaru Olympiad website",
    "ExpressArte 2015 — “A Luta do Povo Sertanejo”": "ExpressArte 2015 — “The Struggle of the Sertanejo People”",
    "2015 · 1º lugar · Categoria: desenho · Petrolina, Pernambuco": "2015 · 1st place · Drawing category · Petrolina, Pernambuco",
    "Conquistei o primeiro lugar no ExpressArte 2015 com o desenho “A Luta do Povo Sertanejo” e recebi um notebook como prêmio. O concurso foi promovido pela Secretaria de Educação de Petrolina.": "I won first place in ExpressArte 2015 with the drawing “The Struggle of the Sertanejo People” and received a laptop as a prize. The contest was organized by the Petrolina Department of Education.",
    "Ver matéria do Blog do Carlos Britto (20/10/2015)": "Read the Carlos Britto blog article (Oct. 20, 2015)",
    "A matéria registra a seleção do desenho na relação parcial; a classificação em 1º lugar e o notebook recebido como prêmio são informações complementares do meu relato pessoal.": "The article records the drawing's selection in a preliminary list. The first-place result and the laptop prize are additional details from my personal account.",
    "A matéria publicada em 20/10/2015 registra a seleção do desenho na relação parcial. A classificação em 1º lugar e o notebook recebido como prêmio são informações complementares do meu relato pessoal.": "The article published on Oct. 20, 2015 records the drawing's selection in a preliminary list. The first-place result and the laptop prize are additional details from my personal account.",
    "Reconhecimento nacional": "National recognition",
    "Um ano com quatro resultados": "A year with four results",
    "2025 · Geopolítica · Matemática Financeira · Geoinformação · Matemática": "2025 · Geopolitics · Financial Mathematics · Geoinformation · Mathematics",
    "Menção Honrosa Nacional na 20ª OBMEP (IMPA, com apoio do MEC e do MCTI); prata na Olimpíada Brasileira de Matemática Financeira (OBMF); prata na Olimpíada Brasileira de Geoinformação (OBGE); e bronze na segunda participação na OBGP.": "National Honorable Mention in the 20th OBMEP; silver in the Brazilian Financial Mathematics Olympiad (OBMF); silver in the Brazilian Geoinformation Olympiad (OBGE); and bronze in my second OBGP participation.",
    "Ver todos os detalhes na página de Conquistas": "See all details on the Achievements page",
    "Três medalhas em 2026": "Three medals in 2026",
    "Ciência, Geopolítica e Literatura": "Science, Geopolitics, and Literature",
    "2026 · Biologia · Geopolítica · Literatura": "2026 · Biology · Geopolitics · Literature",
    "O ano reúne três medalhas: ouro na primeira participação no Torneio Nacional de Biologia (TNBio), prata na terceira participação consecutiva na OBGP e bronze na 16ª Olimpíada de Literatura. Na OL, categoria Júnior 29, a obra": "This year brought three medals: gold in my first National Biology Tournament (TNBio), silver in my third consecutive OBGP participation, and bronze in the 16th Literature Olympiad. In the OL, Junior 29 category, the book",
    "rendeu 884/1.000 pontos e o 299º lugar. Também houve classificação para a segunda fase da 21ª OBMEP; o resultado final segue aguardando divulgação oficial.": "earned 884/1,000 points and 299th place. I also qualified for the second round of the 21st OBMEP; the final result is still pending official publication.",
    "Resultado da OL": "OL result",
    "Conquistas recentes": "Recent achievements",
    "Últimas edições": "Latest editions",
    "Um recorte das participações mais recentes. A lista completa, com todas as edições desde 2015, está na página de conquistas.": "A selection of my most recent competitions. The complete list, including editions since 2015, is available on the Achievements page.",
    "Ouro": "Gold",
    "Prata": "Silver",
    "Bronze · 299º lugar": "Bronze · 299th place",
    "2026 · Seleta Educação · Biologia": "2026 · Seleta Educação · Biology",
    "Prova nacional sobre biologia, biodiversidade e ciência da vida, voltada a estudantes de todo o país.": "A national competition on Biology, biodiversity, and life sciences, open to students across Brazil.",
    "2026 · Seleta Educação · Geopolítica": "2026 · Seleta Educação · Geopolitics",
    "Terceira participação consecutiva na OBGP, com evolução de bronze (2024) para prata (2026).": "Third consecutive OBGP participation, progressing from bronze in 2024 to silver in 2026.",
    "2026 · Júnior 29 · 884/1000 pontos": "2026 · Junior 29 · 884/1,000 points",
    "Medalha de bronze com a obra": "Bronze medal for the book",
    ", de George Orwell. Resultado: 299º lugar na categoria.": ", by George Orwell. Result: 299th place in the category.",
    "Quatro resultados": "Four results",
    "Um ano de conquistas em 2025": "A year of achievements in 2025",
    "Geopolítica · Geoinformação · Matemática Financeira · Matemática": "Geopolitics · Geoinformation · Financial Mathematics · Mathematics",
    "Medalhas de prata na OBGE e na OBMF, bronze na OBGP e Menção Honrosa Nacional na 20ª OBMEP.": "Silver medals in OBGE and OBMF, bronze in OBGP, and a National Honorable Mention in the 20th OBMEP.",
    "Ver a trajetória completa, de 2015 a 2026": "View the full journey, from 2015 to 2026",
    "Áreas de interesse": "Areas of interest",
    "Onde concentro meus estudos": "Where I focus my studies",
    "História & Geografia": "History & Geography",
    "Minha maior paixão dentro dos estudos — e a área em que pretendo seguir como professor.": "My greatest academic interests, and the fields in which I hope to become a teacher.",
    "Geopolítica & Relações Internacionais": "Geopolitics & International Relations",
    "Entender como geografia, política e economia se cruzam para explicar o mundo atual.": "Understanding how geography, politics, and economics intersect to explain today's world.",
    "Matemática & Raciocínio Lógico": "Mathematics & Logical Reasoning",
    "Desafios que exigem lógica, interpretação e organização de ideias.": "Challenges that call for logic, interpretation, and clear thinking.",
    "Biologia & Ciências": "Biology & Science",
    "Curiosidade pela vida, pela natureza e por como os sistemas biológicos funcionam.": "Curiosity about life, nature, and how biological systems work.",
    "Informática & Tecnologia": "Computing & Technology",
    "Interesse em programação e no desenvolvimento de pequenos projetos.": "An interest in programming and building small projects.",
    "Sobre este portfólio": "About this portfolio",
    "Um registro público da minha trajetória acadêmica": "A public record of my academic journey",
    "Este site reúne, de forma organizada, os registros das olimpíadas e desafios acadêmicos dos quais participei desde 2015. A ideia é simples: ter um espaço público e confiável onde essas conquistas possam ser consultadas — por mim, por professores, por escolas ou por qualquer pessoa interessada em acompanhar essa trajetória.": "This website brings together records of the olympiads and academic challenges I have taken part in since 2015. The goal is to provide an organized and reliable public space where these achievements can be explored by teachers, schools, and anyone interested in following my journey.",
    "Saiba mais sobre mim": "Learn more about me",
    "Fontes e páginas oficiais": "Sources and official websites",
    "Onde conferir cada competição": "Where to find each competition",
    "Páginas oficiais das organizações responsáveis pelas olimpíadas citadas neste portfólio.": "Official websites of the organizations responsible for the olympiads featured in this portfolio.",
    "Olimpíada de Literatura": "Literature Olympiad",
    "ExpressArte 2015 — matéria sobre o resultado parcial": "ExpressArte 2015 — article about the preliminary results",
    "Portfólio acadêmico · Petrolina, PE": "Academic portfolio · Petrolina, Pernambuco, Brazil",
    "Portfólio pessoal e independente, sem vínculo institucional com as organizações das olimpíadas citadas. Medalhas, classificações e anos seguem os certificados e resultados informados pelo próprio estudante e, quando disponíveis, as fontes oficiais de cada competição.": "Independent personal portfolio, not affiliated with the olympiad organizations mentioned. Medals, rankings, and years are based on certificates and results reported by the student and, whenever available, official competition sources.",

    "Conquistas acadêmicas": "Academic Achievements",
    "Linha do tempo com todas as olimpíadas e desafios acadêmicos dos quais participei, da edição mais recente à mais antiga. Cada registro indica a competição, o ano, o resultado obtido e a instituição organizadora.": "A timeline of the olympiads and academic challenges I have taken part in, from the most recent to the oldest edition. Each entry shows the competition, year, result, and organizing institution.",
    "Ano:": "Year:",
    "Todos": "All",
    "Área:": "Field:",
    "Todas": "All",
    "Geopolítica": "Geopolitics",
    "Biologia": "Biology",
    "Matemática": "Mathematics",
    "Matemática Financeira": "Financial Mathematics",
    "Geoinformação": "Geoinformation",
    "Literatura": "Literature",
    "Arte": "Art",
    "11 registros no catálogo. Use os filtros para explorar a lista.": "11 entries in the catalog. Use the filters to explore the list.",
    "Resultado aguardando": "Result pending",
    "21ª Olimpíada Brasileira de Matemática das Escolas Públicas (OBMEP)": "21st Brazilian Public Schools Mathematics Olympiad (OBMEP)",
    "Edição 2026 · Organização: IMPA · Área: Matemática": "2026 edition · Organized by IMPA · Field: Mathematics",
    "Participação na 21ª edição da OBMEP, em 2026, com classificação para a segunda fase. O resultado final ainda aguarda divulgação oficial e este registro será atualizado quando houver publicação.": "I took part in the 21st OBMEP in 2026 and qualified for the second round. The final result is pending official publication, and this entry will be updated when it is released.",
    "Participação registrada · Resultado pendente de divulgação.": "Participation recorded · Final result pending publication.",
    "2026 · Categoria: Júnior 29 · Área: Literatura · Evento em 12 de novembro de 2026": "2026 · Category: Junior 29 · Field: Literature · Event held on November 12, 2026",
    "Resultado individual:": "Individual result:",
    "884 pontos de 1.000": "884 points out of 1,000",
    "299º lugar": "299th place",
    "na classificação da categoria.": "in the category ranking.",
    "Consultar resultado oficial — Júnior 29: A Revolução dos Bichos": "Check official results — Junior 29: Animal Farm",
    "2025 · Organização: Seleta Educação · Área: Geopolítica": "2025 · Organizer: Seleta Educação · Field: Geopolitics",
    "2025 · Organização: Seleta Educação · Área: Matemática Financeira": "2025 · Organizer: Seleta Educação · Field: Financial Mathematics",
    "2025 · Área: Geoinformação": "2025 · Field: Geoinformation",
    "Edição 2025 · Organização: IMPA, com apoio do MEC e do MCTI · Área: Matemática": "2025 edition · Organized by IMPA, with support from MEC and MCTI · Field: Mathematics",
    "2024 · Organização: Seleta Educação · Área: Geopolítica": "2024 · Organizer: Seleta Educação · Field: Geopolitics",
    "2025 · Área: Matemática": "2025 · Field: Mathematics",
    "2015 · 1º lugar · Categoria: desenho · Petrolina, Pernambuco": "2015 · 1st place · Drawing category · Petrolina, Pernambuco",
    
    "Criação, pesquisa e tecnologia": "Creation, Research, and Technology",
    "Projetos e Produções": "Projects and Creative Work",
    "Um espaço para reunir ideias que saíram do papel: experiências com programação, ferramentas digitais, trabalhos acadêmicos e produções desenvolvidas ao longo da minha trajetória.": "A space for ideas brought to life: programming experiments, digital tools, academic work, and creative projects developed throughout my journey.",
    "Tecnologia e programação": "Technology and programming",
    "Projetos digitais": "Digital projects",
    "Experiências em desenvolvimento web, programação e criação de ambientes interativos.": "Experiments in web development, programming, and interactive environments.",
    "Desenvolvimento web · Experiência interativa": "Web development · Interactive experience",
    "Museu-biblioteca virtual": "Virtual Museum-Library",
    "Um ambiente digital que aproxima arte, História e aprendizagem. A proposta reúne uma galeria 3D inspirada em espaços de exposição, salas temáticas e uma experiência de visita com a guia virtual Atena. O projeto também considera uma versão mais leve para celulares.": "A digital environment connecting art, History, and learning. It brings together a 3D gallery inspired by exhibition spaces, themed rooms, and a visitor experience guided by Atena, a virtual guide. The project also includes a lighter version for mobile devices.",
    "Em desenvolvimento contínuo": "In continuous development",
    "Explorar o museu-biblioteca": "Explore the Museum-Library",
    "HTML · CSS · JavaScript · GitHub Pages": "HTML · CSS · JavaScript · GitHub Pages",
    "Este portfólio": "This portfolio",
    "Site criado para organizar e apresentar minha trajetória acadêmica, conquistas em olimpíadas, interesses e projetos. Também é uma experiência prática de desenvolvimento web, organização de conteúdo, acessibilidade e publicação na internet.": "A website created to organize and present my academic journey, olympiad achievements, interests, and projects. It is also a hands-on experience in web development, content organization, accessibility, and publishing online.",
    "Publicado · Em atualização": "Published · Being updated",
    "Visitar a página inicial": "Visit the homepage",
    "Desenvolvimento de jogos · 3D": "Game development · 3D",
    "Farmers Field": "Farmers Field",
    "Projetos digitais": "Digital projects",
    "Além das olimpíadas": "Beyond olympiads",
    "Também desenvolvo projetos de tecnologia. O": "I also develop technology projects. The",
    ", protótipo 3D inspirado em Shotgun Farmers, é voltado para": ", a 3D prototype inspired by Shotgun Farmers is designed for",
    "PC e notebook": "PC and laptops",
    "e usa teclado e mouse. Ainda não possui versão para celular.": "and uses a keyboard and mouse. There is no mobile version yet.",
    "Conhecer o projeto": "Explore the project",
    "Plataforma:": "Platform:",
    "PC e notebook (teclado e mouse). Ainda não há versão para celular.": "PC and laptop (keyboard and mouse). There is no mobile version yet.",
    "Protótipo 3D em primeira pessoa inspirado em Shotgun Farmers, mas sem violência: as sete sementes disponíveis viram \"armas\" que lançam pólen, e cada NPC atingido se transforma em um animal aliado (capivara, coelho ou galinha). O cenário é uma fazenda explorável, com movimentação, corrida, salto, iluminação, sombras e nuvens.": "A non-violent first-person 3D prototype inspired by Shotgun Farmers: seven seeds act as pollen launchers, and each NPC reached by pollen becomes an animal companion (capybara, rabbit, or chicken). Explore a farm with movement, sprinting, jumping, lighting, shadows, and clouds.",
    "Jogável no navegador · Em desenvolvimento": "Playable in a web browser · In development",
    "Jogar agora": "Play now",
    "Ver código no GitHub": "View the code on GitHub",
    "Programação · Desenvolvimento de jogos": "Programming · Game development",
    "Experimentos com jogos": "Game experiments",
    "Estudos e protótipos para explorar lógica de programação, mecânicas de jogo, comportamento de personagens controlados pelo computador e interação entre elementos do cenário. A ideia é transformar esses testes em projetos cada vez mais completos.": "Studies and prototypes exploring programming logic, game mechanics, computer-controlled character behavior, and interactions between elements in a scene. The goal is to turn these experiments into increasingly complete projects.",
    "Em fase experimental": "Experimental stage",
    "Conhecimento em prática": "Knowledge in practice",
    "Produções acadêmicas": "Academic work",
    "Esta área também poderá reunir trabalhos escolares e materiais de estudo que demonstrem pesquisa, interpretação e comunicação de ideias.": "This area may also feature school assignments and study materials that demonstrate research, interpretation, and communication skills.",
    "Geografia · História · Ciências humanas": "Geography · History · Humanities",
    "Pesquisas e trabalhos": "Research and written work",
    "Textos, pesquisas, mapas e análises sobre temas históricos, geográficos, sociais e ambientais, organizados para compartilhar o processo de investigação e os resultados.": "Texts, research, maps, and analyses on historical, geographic, social, and environmental topics, organized to share the research process and its findings.",
    "Espaço para novas publicações": "Space for future publications",
    "Comunicação e criatividade": "Communication and creativity",
    "Apresentações e materiais": "Presentations and materials",
    "Apresentações, materiais visuais, vídeos e outras produções desenvolvidas em atividades escolares ou por iniciativa própria.": "Presentations, visual materials, videos, and other work created for school activities or personal projects.",
    "Novos projetos serão adicionados conforme forem desenvolvidos. Cada publicação poderá incluir uma descrição, as ferramentas utilizadas, o objetivo, imagens ou demonstrações e, quando houver, um link para acessar o resultado.": "New projects will be added as they are developed. Each entry may include a description, tools used, goals, images or demos, and a link to access the result when available.",

    "Sobre mim": "About me",
    "Um pouco mais sobre meus interesses, minha trajetória e o propósito deste portfólio.": "A little more about my interests, my journey, and the purpose of this portfolio.",
    "Quem sou": "Who I am",
    "Sou Marcos David Alves Garcia, estudante do Ensino Médio em Petrolina, interior de Pernambuco. Desde 2015 venho participando, em diferentes momentos, de olimpíadas e desafios acadêmicos — experiências que me ajudaram a desenvolver o hábito de estudar por interesse genuíno, e não apenas por obrigação escolar.": "I am Marcos David Alves Garcia, a high school student from Petrolina, in the state of Pernambuco, Brazil. Since 2015, I have taken part in academic olympiads and challenges at different stages — experiences that helped me develop a habit of learning out of genuine curiosity, not just school requirements.",
    "História e Geografia: meu maior interesse": "History and Geography: my main interests",
    "Entre todas as áreas que já estudei, História e Geografia são as que mais me atraem. É nelas que pretendo seguir carreira como professor no futuro — ensinar é, para mim, uma forma de multiplicar essa curiosidade pelo mundo, pelo tempo e pelos lugares.": "Of all the subjects I have studied, History and Geography attract me the most. I hope to pursue a teaching career in these fields — to me, teaching is a way to share curiosity about the world, time, and places.",
    "Geopolítica e o mundo atual": "Geopolitics and the modern world",
    "A Geopolítica funciona como uma ponte entre a História, a Geografia e a atualidade: entender como fatores geográficos, políticos, econômicos e culturais moldam as relações entre países é algo que acho particularmente interessante. Por isso tenho participado da Olimpíada Brasileira de Geopolítica (OBGP) em edições consecutivas.": "Geopolitics connects History, Geography, and current affairs. I find it especially interesting to understand how geographic, political, economic, and cultural factors shape relations between countries. That is why I have participated in consecutive editions of the Brazilian Geopolitics Olympiad (OBGP).",
    "Matemática, Ciências e Tecnologia": "Mathematics, Science, and Technology",
    "Fora da área de Humanas, também gosto de desafios de raciocínio lógico e de Matemática, de temas de Biologia e ciências da natureza, e tenho interesse crescente em Informática e programação. Gosto de transformar essa curiosidade em experiências práticas, explorando ferramentas digitais e desenvolvimento web.": "Beyond the humanities, I also enjoy logical reasoning and Mathematics challenges, Biology and natural science topics, and I have a growing interest in computing and programming. I like turning this curiosity into practical experiments with digital tools and web development.",
    "Projetos e criação digital": "Digital projects and creation",
    "Este próprio portfólio também é um projeto de tecnologia. Além das páginas sobre minha trajetória, desenvolvi com apoio ferramentas e módulos para um museu-biblioteca virtual: uma galeria 3D para computadores, uma versão leve para celulares e a Atena, uma guia que responde com base em um acervo curado. A proposta é aproximar arte, História, Geografia e investigação em uma experiência interativa.": "This portfolio is also a technology project. Alongside the pages about my journey, I have developed tools and modules for a virtual museum-library: a 3D gallery for computers, a lighter version for mobile devices, and Atena, a guide that answers questions based on a curated collection. The goal is to bring art, History, Geography, and research together in an interactive experience.",
    "Conhecer o museu-biblioteca virtual": "Explore the virtual Museum-Library",
    "Ver a página de projetos e produções": "View projects and creative work",
    "Este portfólio está em construção contínua. Novos certificados, medalhas, participações e projetos de programação serão adicionados conforme forem confirmados — a seção de": "This portfolio is continuously evolving. New certificates, medals, competition entries, and programming projects will be added as they are confirmed — the",
    "conquistas": "achievements",
    "reúne o registro mais atualizado.": "section contains the most up-to-date records.",
    "Sobre este portfólio": "About this portfolio",
    "Criei este site para reunir, em um único lugar, os registros das olimpíadas e desafios acadêmicos dos quais participei. A ideia é ter um espaço público, organizado e confiável — útil para mim, para professores e escolas, e para qualquer pessoa que queira conhecer um pouco dessa trajetória. O museu-biblioteca amplia o projeto com exposições artísticas, salas temáticas e atividades de aprendizagem. As informações sobre resultados seguem os certificados recebidos e, sempre que possível, as páginas oficiais de cada competição; itens ainda não confirmados são sinalizados como tal.": "I created this website to bring together records of the olympiads and academic challenges I have taken part in. The goal is to provide an organized and reliable public space for teachers, schools, and anyone interested in learning about this journey. The virtual museum-library expands the project with art exhibitions, themed rooms, and learning activities. Results are based on certificates and, whenever possible, official competition pages; unconfirmed entries are clearly identified.",

    "Uma caminhada em construção": "A journey in progress",
    "Minha trajetória": "My journey",
    "Dos primeiros reconhecimentos às novas descobertas: cada etapa representa uma experiência, um aprendizado e mais um capítulo dessa caminhada.": "From the first recognitions to new discoveries: each stage represents an experience, a lesson, and another chapter in this journey.",
    "Cada passo abre um novo caminho.": "Every step opens a new path.",
    "Nem toda conquista começa com uma medalha. Algumas começam com um desenho, uma curiosidade ou a vontade de aprender algo novo. Esta é a história de como esses passos foram se conectando.": "Not every achievement begins with a medal. Some begin with a drawing, a question, or the desire to learn something new. This is the story of how those steps came together.",
    "2015": "2015",
    "2026": "2026",
    "Arte, conhecimento e novas descobertas.": "Art, knowledge, and new discoveries.",
    "Capítulos da caminhada": "Chapters of the journey",
    "Selecione um marco para abrir os detalhes ↓": "Select a milestone to see its details ↓",
    "O começo": "The beginning",
    "Arte · Expressão": "Art · Expression",
    "01": "01",
    "O primeiro reconhecimento": "The first recognition",
    "Um desenho sobre a vida do povo sertanejo conquista o primeiro lugar no ExpressArte, em Petrolina.": "A drawing about life in the Sertão earned first place in ExpressArte, in Petrolina.",
    "ExpressArte": "ExpressArte",
    "1º lugar": "1st place",
    "Explorar este capítulo": "Explore this chapter",
    "A primeira medalha": "The first medal",
    "Matemática · Olimpíada": "Mathematics · Olympiad",
    "02": "02",
    "A chegada da primeira medalha": "The first medal arrives",
    "A Olimpíada Mandacaru marca uma nova etapa: o terceiro lugar e a primeira medalha da coleção.": "The Mandacaru Olympiad marked a new stage: third place and the first medal in the collection.",
    "Olimpíada Mandacaru": "Mandacaru Olympiad",
    "Bronze · 3º lugar": "Bronze · 3rd place",
    "Novos horizontes": "New horizons",
    "Geopolítica · Conhecimento": "Geopolitics · Knowledge",
    "03": "03",
    "Um novo interesse ganha espaço": "A new interest takes shape",
    "A primeira participação na OBGP aproxima a trajetória da Geopolítica — e termina com uma medalha de bronze.": "My first OBGP participation brought Geopolitics into my journey and ended with a bronze medal.",
    "Medalha de bronze": "Bronze medal",
    "Reconhecimento nacional": "National recognition",
    "Um ano · Quatro resultados": "One year · Four results",
    "04": "04",
    "A trajetória se amplia": "The journey expands",
    "Quatro reconhecimentos em diferentes áreas: Geopolítica, Geoinformação, Matemática Financeira e Matemática.": "Four recognitions across different fields: Geopolitics, Geoinformation, Financial Mathematics, and Mathematics.",
    "OBGP · Bronze": "OBGP · Bronze",
    "OBGE · Prata": "OBGE · Silver",
    "OBMF · Prata": "OBMF · Silver",
    "OBMEP · Menção Honrosa": "OBMEP · Honorable Mention",
    "Novos patamares": "New milestones",
    "O ano atual · Três medalhas": "The current year · Three medals",
    "05": "05",
    "Ciência, Geopolítica e Literatura": "Science, Geopolitics, and Literature",
    "Ouro no TNBio, prata na OBGP e bronze na Olimpíada de Literatura. A classificação para a segunda fase da OBMEP também faz parte deste capítulo.": "Gold in TNBio, silver in OBGP, and bronze in the Literature Olympiad. Qualifying for the second round of OBMEP is also part of this chapter.",
    "TNBio · Ouro": "TNBio · Gold",
    "OBGP · Prata": "OBGP · Silver",
    "OL · Bronze": "OL · Bronze",
    "OBMEP · 2ª fase": "OBMEP · Second round",
    "O caminho continua.": "The journey continues.",
    "Novos desafios ainda vão escrever os próximos capítulos.": "New challenges will shape the next chapters.",
    "Ver todas as conquistas →": "View all achievements →",
    "1º lugar · ExpressArte 2015": "1st place · ExpressArte 2015",
    "2015 · 1º lugar · Categoria: desenho · Petrolina, Pernambuco": "2015 · 1st place · Drawing category · Petrolina, Pernambuco",
    "3º lugar · Bronze": "3rd place · Bronze",
    "2023 · Área: Matemática": "2023 · Field: Mathematics",
    "2024 · Organização: Seleta Educação · Área: Geopolítica": "2024 · Organizer: Seleta Educação · Field: Geopolitics",
    "2025 · Geopolítica · Matemática Financeira · Geoinformação · Matemática": "2025 · Geopolitics · Financial Mathematics · Geoinformation · Mathematics",
    "Ver todos os detalhes na página de Conquistas": "See all details on the Achievements page",
    "Três medalhas em 2026": "Three medals in 2026",
    "2026 · Biologia · Geopolítica · Literatura": "2026 · Biology · Geopolitics · Literature",
    "O ano reúne três medalhas: ouro na primeira participação no Torneio Nacional de Biologia (TNBio), prata na terceira participação consecutiva na OBGP e bronze na 16ª Olimpíada de Literatura. Na OL, categoria Júnior 29, a obra": "This year brought three medals: gold in my first National Biology Tournament (TNBio), silver in my third consecutive OBGP participation, and bronze in the 16th Literature Olympiad. In the OL, Junior 29 category, the book",
    "rendeu 884/1.000 pontos e o 299º lugar. Também houve classificação para a segunda fase da 21ª OBMEP; o resultado final segue aguardando divulgação oficial.": "earned 884/1,000 points and 299th place. I also qualified for the second round of the 21st OBMEP; the final result is still pending official publication.",

    "Museu-biblioteca virtual": "Virtual Museum-Library",
    "Museu-biblioteca Marcos David — Arte e Conhecimento 3D": "Marcos David Museum-Library — 3D Art and Knowledge",
    "Museu-biblioteca Marcos David": "Marcos David Museum-Library",
    "Bem-vindo ao museu-biblioteca": "Welcome to the Museum-Library",
    "Comece pela galeria artística e atravesse o portal ao fundo para chegar ao átrio central. De lá, explore as primeiras salas do museu-biblioteca: História, Geografia, Raciocínio e Investigação. No átrio, observe a rosa dos ventos: Norte aponta para o fundo do edifício, Sul indica o retorno à galeria, Leste fica à direita e Oeste à esquerda quando se olha para o Norte. Aproxime-se das placas e pressione E para descobrir o conteúdo de cada ambiente.": "Start in the art gallery and walk through the portal at the back to reach the central hall. From there, explore the first rooms of the museum-library: History, Geography, Reasoning, and Research. In the hall, use the compass rose for orientation: North points toward the back of the building, South leads back to the gallery, East is on the right, and West is on the left when facing North. Approach the signs and press E to discover each room.",
    "Computador": "Computer",
    "WASD ou setas para andar, mouse para olhar ao redor, clique para interagir": "WASD or arrow keys to move, mouse to look around, click to interact",
    "Celular": "Mobile",
    "joystick para andar, arraste a tela para olhar, toque no botão para interagir": "Use the joystick to move, drag the screen to look around, and tap the button to interact",
    "Entrar no museu": "Enter the museum",
    "Preparando o museu-biblioteca…": "Preparing the museum-library…",
    "Interagir": "Interact",
    "Portfólio": "Portfolio",
    "Ambiente interativo em primeira pessoa. No computador, use W, A, S e D ou as setas para caminhar, o mouse para olhar e E ou clique para interagir com obras e placas. Em dispositivos móveis, há uma versão leve em formato de exposições.": "First-person interactive environment. On a computer, use W, A, S, or D, or the arrow keys to move; use the mouse to look around; and press E or click to interact with artwork and signs. Mobile devices use a lightweight exhibition format.",
    "Esta página é uma experiência 3D interativa e precisa de JavaScript para funcionar. Enquanto isso, o portfólio completo continua disponível nas páginas abaixo.": "This is an interactive 3D experience and requires JavaScript. In the meantime, the full portfolio remains available on the pages below."
,

    "Medalha de ouro — Torneio Nacional de Biologia, 2026": "Gold medal — National Biology Tournament, 2026",
    "Medalha de bronze — 16ª Olimpíada de Literatura, 2026 · 299º lugar · 884 pontos": "Bronze medal — 16th Literature Olympiad, 2026 · 299th place · 884 points",
    "Medalha de prata — Olimpíada Brasileira de Geopolítica, 2026": "Silver medal — Brazilian Geopolitics Olympiad, 2026",
    "Medalha de prata — Olimpíada Brasileira de Geoinformação, 2025": "Silver medal — Brazilian Geoinformation Olympiad, 2025",
    "Menção Honrosa Nacional — OBMEP, 2025": "National Honorable Mention — OBMEP, 2025",
    "Medalha de prata — Olimpíada Brasileira de Matemática Financeira, 2025": "Silver medal — Brazilian Financial Mathematics Olympiad, 2025",
    "Medalha de bronze — Olimpíada Brasileira de Geopolítica, 2025": "Bronze medal — Brazilian Geopolitics Olympiad, 2025",
    "Medalha de bronze — Olimpíada Brasileira de Geopolítica, 2024": "Bronze medal — Brazilian Geopolitics Olympiad, 2024",
    "3º lugar, bronze — Olimpíada Mandacaru de Matemática, 2023": "3rd place, bronze — Mandacaru Mathematics Olympiad, 2023",
    "Competição de matemática com forte identidade regional nordestina — seus níveis levam nomes como Cajuína, Luiz Gonzaga, Zumbi dos Palmares e Lampião, em referência à cultura do Sertão. Resultado: terceiro lugar, com reconhecimento em bronze — minha primeira medalha.": "A mathematics competition with a strong Northeastern Brazilian identity. Its levels are named after figures and symbols such as Cajuína, Luiz Gonzaga, Zumbi dos Palmares, and Lampião, reflecting the culture of the Sertão. I finished in third place and earned bronze — my first medal.",
    "Minha primeira participação na OBGP — o ponto de partida de uma sequência de três edições consecutivas, com evolução de resultado a cada ano (bronze em 2024, bronze em 2025, prata em 2026).": "My first OBGP participation marked the beginning of three consecutive editions, with an improved result each year (bronze in 2024, bronze in 2025, and silver in 2026).",
    "Medalha de bronze na 16ª edição da Olimpíada de Literatura, na categoria Júnior 29, com a obra": "Bronze medal in the 16th Literature Olympiad, in the Junior 29 category, for the book",
    ", de George Orwell. A competição foi realizada em 12 de novembro de 2026.": ", by George Orwell. The competition took place on November 12, 2026.",
    "Conquistei o primeiro lugar no ExpressArte 2015 com o desenho “A Luta do Povo Sertanejo”, e recebi um notebook como prêmio. O concurso de produção textual e desenho foi promovido pela Secretaria de Educação de Petrolina.": "I won first place in ExpressArte 2015 with the drawing “The Struggle of the Sertanejo People” and received a laptop as a prize. The writing and drawing contest was organized by the Petrolina Department of Education.",
    "Portfólio pessoal e independente. Projetos em desenvolvimento são identificados como tais.": "Independent personal portfolio. Projects under development are identified as such.",
    "Portfólio pessoal e independente, sem vínculo institucional com as organizações das olimpíadas citadas.": "Independent personal portfolio, not affiliated with the olympiad organizations mentioned.",
    "Portfólio pessoal e independente. Os registros desta página acompanham experiências, participações e resultados informados pelo estudante e, quando disponíveis, fontes oficiais.": "Independent personal portfolio. This page records experiences, participation, and results reported by the student and, whenever available, official sources."

  };


    "← Portfólio": "← Portfolio",
    "Este navegador ou dispositivo não suporta a experiência 3D do museu virtual. Você ainda pode explorar todo o conteúdo do portfólio nas páginas abaixo.": "This browser or device cannot run the virtual museum's 3D experience. You can still explore the full portfolio on the pages below.",
    "Galeria Marcos David": "Marcos David Gallery",
    "— WASD ou setas para andar, mouse para olhar ao redor, clique para interagir": "— Use WASD or the arrow keys to move, the mouse to look around, and click to interact",
    "— joystick para andar, arraste a tela para olhar, toque no botão para interagir": "— Use the joystick to move, drag the screen to look, and tap the button to interact",
    "✦ Atena é a guia virtual do museu. Ela responde com base em um acervo curado, apresenta fontes quando disponíveis e avisa quando não encontra uma informação. As quatro salas já contam com temas e atividades.": "✦ Atena is the museum's virtual guide. She answers using a curated collection, provides sources when available, and says when she cannot find an answer. The four rooms already include topics and activities.",
    "Mostrando todos os ": "Showing all ",
    " registros.": " entries.",
    "Nenhum registro encontrado com essa combinação de filtros.": "No entries match this filter combination.",
    "Ano:": "Year:",
    "Área:": "Field:",
    "Marcos David Alves Garcia": "Marcos David Alves Garcia",
    "Olimpíada Brasileira de Matemática das Escolas Públicas (OBMEP)": "Brazilian Public Schools Mathematics Olympiad (OBMEP)"

  };

  var attributeTranslations = {
    "Navegação principal": "Main navigation",
    "Pular para o conteúdo": "Skip to content",
    "Cena interativa do museu-biblioteca": "Interactive museum-library scene",
    "Painel de informações do museu": "Museum information panel",
    "Fechar": "Close",
    "Preferências do site": "Site preferences"
  };

  var metaTranslations = {
    "Portfólio acadêmico de Marcos David Alves Garcia: medalhas em Geopolítica, Biologia, Geoinformação e Matemática, além de distinções, projetos e trajetória artística.": "Academic portfolio of Marcos David Alves Garcia: awards in Geopolitics, Biology, Geoinformation, and Mathematics, alongside distinctions, projects, and creative work.",
    "Medalhas e distinções em olimpíadas acadêmicas de Geopolítica, Biologia, Geoinformação, Matemática e outras áreas.": "Medals and distinctions in academic olympiads covering Geopolitics, Biology, Geoinformation, Mathematics, and other fields.",
    "Linha do tempo com todas as olimpíadas e desafios acadêmicos dos quais participei, da edição mais recente à mais antiga. Cada registro indica a competição, o ano, o resultado obtido e a instituição organizadora.": "A timeline of the academic olympiads and challenges I have taken part in, from newest to oldest. Each entry identifies the competition, year, result, and organizing institution.",
    "Conheça Marcos David Alves Garcia, seus interesses em História, Geografia, Geopolítica, Matemática e Biologia, além do museu-biblioteca virtual que integra seu portfólio.": "Meet Marcos David Alves Garcia and explore his interests in History, Geography, Geopolitics, Mathematics, and Biology, as well as the virtual museum-library featured in his portfolio.",
    "Museu-biblioteca virtual de Marcos David Alves Garcia: galeria 3D no computador e versão leve no celular, com arte, História, Geografia, rosa dos ventos e atividades.": "Marcos David Alves Garcia’s virtual museum-library: a 3D gallery for computers and a lightweight mobile version, featuring art, History, Geography, a compass rose, and learning activities.",
    "Criação, pesquisa e tecnologia": "Creation, research, and technology"
  };

  var originalText = new WeakMap();
  var originalAttributes = new WeakMap();
  var originalTitle = document.title;

  function translateDynamicText(value) {
    var match = value.match(/^Mostrando todos os (\d+) registros\.$/);
    if (match) return "Showing all " + match[1] + " entries.";
    match = value.match(/^Mostrando (\d+) de (\d+) registros\.$/);
    if (match) return "Showing " + match[1] + " of " + match[2] + " entries.";
    if (value === "Nenhum registro encontrado com essa combinação de filtros.") {
      return "No entries match this filter combination.";
    }
    return value;
  }

  function translated(value, dictionary) {
    if (dictionary[value]) return dictionary[value];
    return dictionary === translations ? translateDynamicText(value) : value;
  }

  function translateTextNodes(container, toEnglish) {
    if (!container) return;
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|CODE|PRE)$/.test(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      var original = originalText.get(node);
      if (!toEnglish) {
        node.nodeValue = original;
        continue;
      }
      var trimmed = original.replace(/\s+/g, " ").trim();
      var result = translated(trimmed, translations);
      if (result) {
        var leading = (original.match(/^\s*/) || [""])[0];
        var trailing = (original.match(/\s*$/) || [""])[0];
        node.nodeValue = leading + result + trailing;
      }
    }
  }

  function translateAttributes(toEnglish) {
    var elements = document.querySelectorAll("[aria-label], [title], [placeholder]");
    elements.forEach(function (element) {
      var saved = originalAttributes.get(element) || {};
      ["aria-label", "title", "placeholder"].forEach(function (name) {
        if (!element.hasAttribute(name)) return;
        if (!(name in saved)) saved[name] = element.getAttribute(name);
        element.setAttribute(name, toEnglish
          ? translated(saved[name], attributeTranslations)
          : saved[name]);
      });
      originalAttributes.set(element, saved);
    });
    var meta = document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]');
    meta.forEach(function (element) {
      var saved = originalAttributes.get(element) || {};
      if (!("content" in saved)) saved.content = element.getAttribute("content") || "";
      element.setAttribute("content", toEnglish
        ? translated(saved.content, metaTranslations)
        : saved.content);
      originalAttributes.set(element, saved);
    });
    var locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.setAttribute("content", toEnglish ? "en_US" : "pt_BR");
  }

  function updatePreferenceButtons() {
    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      button.textContent = language === "en" ? "Português" : "English";
      button.setAttribute("aria-label", language === "en" ? "Switch the website to Portuguese" : "Switch the website to English");
      button.setAttribute("aria-pressed", language === "en" ? "true" : "false");
    });
    document.querySelectorAll("[data-lite-toggle]").forEach(function (button) {
      button.textContent = language === "en"
        ? (lite ? "Lite mode: on" : "Lite mode")
        : (lite ? "Modo Lite: ativo" : "Modo Lite");
      button.setAttribute("aria-label", language === "en"
        ? "Toggle Lite mode to reduce visual effects"
        : "Ativar ou desativar o Modo Lite para reduzir efeitos visuais");
      button.setAttribute("aria-pressed", lite ? "true" : "false");
      button.setAttribute("title", language === "en"
        ? "Simplifies visual effects and animations"
        : "Simplifica efeitos visuais e animações");
    });
  }

  function applyLanguage() {
    var english = language === "en";
    root.lang = english ? "en" : "pt-BR";
    translateTextNodes(document.documentElement, english);
    translateAttributes(english);
    document.title = english ? translated(originalTitle, translations) : originalTitle;
    updatePreferenceButtons();
  }

  function initialize() {
    applyLanguage();

    document.addEventListener("click", function (event) {
      var languageButton = event.target.closest("[data-language-toggle]");
      var liteButton = event.target.closest("[data-lite-toggle]");

      if (languageButton) {
        language = language === "en" ? "pt" : "en";
        savePreference(LANG_KEY, language);
        applyLanguage();
      }

      if (liteButton) {
        lite = !lite;
        savePreference(LITE_KEY, lite ? "1" : "0");
        updatePreferenceButtons();
        root.classList.toggle("site-lite", lite);
        // Recarrega a página para inicializar ou encerrar os efeitos decorativos
        // sem deixar observadores e animações da versão completa em execução.
        window.location.reload();
      }
    });

    // Tradução também alcança diálogos e cartões de detalhes inseridos depois
    // do carregamento (por exemplo, ao abrir uma medalha ou marco da trajetória).
    if ("MutationObserver" in window && document.body) {
      var observer = new MutationObserver(function (records) {
        if (language !== "en") return;
        records.forEach(function (record) {
          record.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
              var parent = node.parentElement;
              if (parent && !originalText.has(node)) {
                originalText.set(node, node.nodeValue);
                var trimmed = node.nodeValue.replace(/\s+/g, " ").trim();
                var result = translated(trimmed, translations);
                if (result !== trimmed) node.nodeValue = node.nodeValue.replace(trimmed, result);
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              translateTextNodes(node, true);
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Compatível com cartões e diálogos criados por scripts da própria página.
    document.addEventListener("click", function () {
      if (language === "en") {
        window.setTimeout(function () {
          translateTextNodes(document.body, true);
          translateAttributes(true);
        }, 0);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();