/*
 * Galeria Marcos David — salão principal
 * -----------------------------------------
 * Constrói o ambiente 3D: arquitetura clássica (colunas, arcos, cornijas),
 * identidade celestial (teto estrelado, partículas, janelas) e a
 * iluminação do salão. As pinturas e seus holofotes ficam em pinturas.js;
 * o movimento do visitante fica em controles.js — mantendo cada
 * responsabilidade em seu próprio módulo.
 */

import { SALA } from "./config.js";
import {
  texturaMarmore,
  texturaCeuEstrelado,
  texturaParede,
  texturaParticula,
  texturaInscricao,
} from "./texturas.js";

export function criarCena(THREE, nivel = "alto") {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060b16, 0.019);

  // Qualidade adaptativa: hardware modesto reduz custo, nunca recursos —
  // ver detectarNivelGrafico() em main.js.
  const qtdEstrelas = nivel === "baixo" ? 110 : nivel === "medio" ? 180 : 260;
  const resolucaoCeu = nivel === "baixo" ? 512 : 1024;
  const qtdParticulasAlvo = nivel === "baixo" ? 60 : nivel === "medio" ? 110 : 160;
  const sombraLustre = nivel !== "baixo";

  const { meiaLargura: L, meiaProfundidade: P, altura: H, raioColuna, colunasZ } = SALA;

  // ---------- Materiais reutilizados ----------
  const matDourado = new THREE.MeshStandardMaterial({
    color: 0xb8914a,
    metalness: 0.65,
    roughness: 0.32,
  });
  // Mármore branco-marfim, com acabamento acetinado de edifício clássico.
  const matPedra = new THREE.MeshStandardMaterial({
    color: 0xf1efe8,
    roughness: 0.42,
    metalness: 0.025,
  });
  const matDetalhePedra = new THREE.MeshStandardMaterial({
    color: 0xd8d4ca,
    roughness: 0.5,
    metalness: 0.02,
  });
  const matParede = new THREE.MeshStandardMaterial({
    map: texturaParede(THREE),
    roughness: 0.9,
    metalness: 0,
  });

  // ---------- Piso ----------
  const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(L * 2, P * 2),
    new THREE.MeshStandardMaterial({
      map: texturaMarmore(THREE),
      roughness: 0.28,
      metalness: 0.2,
    })
  );
  piso.rotation.x = -Math.PI / 2;
  piso.receiveShadow = true;
  scene.add(piso);

  // ---------- Teto (céu estrelado) ----------
  const ceu = texturaCeuEstrelado(THREE, {
    estrelas: qtdEstrelas,
    largura: resolucaoCeu,
    altura: resolucaoCeu,
  });
  const teto = new THREE.Mesh(
    new THREE.PlaneGeometry(L * 2, P * 2),
    new THREE.MeshStandardMaterial({
      map: ceu,
      roughness: 1,
      emissive: 0x0d1d38,
      emissiveMap: ceu,
      emissiveIntensity: 0.55,
    })
  );
  teto.rotation.x = Math.PI / 2;
  teto.position.y = H;
  scene.add(teto);

  // ---------- Paredes ----------
  const espessura = 0.5;

  function criarParedeLisa(largura, profundidade, x, z) {
    const parede = new THREE.Mesh(
      new THREE.BoxGeometry(largura, H, profundidade),
      matParede
    );
    parede.position.set(x, H / 2, z);
    parede.receiveShadow = true;
    scene.add(parede);
    return parede;
  }

  // oeste e leste (paredes das pinturas)
  criarParedeLisa(espessura, P * 2 + espessura, -L - espessura / 2, 0);
  criarParedeLisa(espessura, P * 2 + espessura, L + espessura / 2, 0);

  // norte (passagem interna para o átrio central)
  // Mantém a parede em dois segmentos e deixa um portal central de 7,2 m.
  const vaoNorte = 7.2;
  const segNorte = (L * 2 - vaoNorte) / 2;
  criarParedeLisa(segNorte, espessura, -(vaoNorte / 2 + segNorte / 2), -P - espessura / 2);
  criarParedeLisa(segNorte, espessura, vaoNorte / 2 + segNorte / 2, -P - espessura / 2);
  const vergaNorte = new THREE.Mesh(
    new THREE.BoxGeometry(vaoNorte, H - 7.45, espessura),
    matParede
  );
  vergaNorte.position.set(0, (H + 7.45) / 2, -P - espessura / 2);
  scene.add(vergaNorte);

  // sul (entrada, com vão central para a porta)
  const vaoPorta = 5.2;
  const segSul = (L * 2 - vaoPorta) / 2;
  criarParedeLisa(segSul, espessura, -(vaoPorta / 2 + segSul / 2), P + espessura / 2);
  criarParedeLisa(segSul, espessura, vaoPorta / 2 + segSul / 2, P + espessura / 2);

  // ---------- Cornija e rodapé dourados (perímetro) ----------
  function criarFaixa(largura, profundidade, x, y, z) {
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.18, profundidade), matDourado);
    faixa.position.set(x, y, z);
    scene.add(faixa);
  }
  [0.3, H - 0.25].forEach((y) => {
    criarFaixa(0.34, P * 2 + 0.6, -L - 0.08, y, 0);
    criarFaixa(0.34, P * 2 + 0.6, L + 0.08, y, 0);
    if (y < 1) {
      const comprimentoLateral = (L * 2 - vaoNorte) / 2 + 0.3;
      criarFaixa(comprimentoLateral, 0.34, -(vaoNorte / 2 + comprimentoLateral / 2 - 0.15), y, -P - 0.08);
      criarFaixa(comprimentoLateral, 0.34, vaoNorte / 2 + comprimentoLateral / 2 - 0.15, y, -P - 0.08);
    } else {
      criarFaixa(L * 2 + 0.6, 0.34, 0, y, -P - 0.08);
    }
    criarFaixa(L * 2 + 0.6, 0.34, 0, y, P + 0.08);
  });

  // ---------- Colunata monumental em mármore branco ----------
  // Proporções inspiradas na ordem coríntia: plinto escalonado,
  // fuste estriado, capitel folhado e entablamento contínuo.
  const alturaFuste = H - 2.15;
  const raioFuste = raioColuna + 0.17;
  const topoColuna = 0.42 + alturaFuste + 0.82;
  const colunas = []; // {x, z, topoY} — referência arquitetônica

  function geometriaFusteEstriado(raio, altura, segmentos = 96, anéis = 8) {
    const vertices = [];
    const indices = [];
    for (let j = 0; j <= anéis; j++) {
      const v = j / anéis;
      for (let i = 0; i <= segmentos; i++) {
        const a = (i / segmentos) * Math.PI * 2;
        // 24 estrias rasas e contínuas, esculpidas diretamente na malha.
        const estria = 1 - 0.035 * (0.5 + 0.5 * Math.cos(a * 24));
        const afunilamento = 1.035 - 0.035 * v;
        const r = raio * estria * afunilamento;
        vertices.push(Math.cos(a) * r, v * altura, Math.sin(a) * r);
      }
    }
    for (let j = 0; j < anéis; j++) {
      for (let i = 0; i < segmentos; i++) {
        const a = j * (segmentos + 1) + i;
        const b = a + segmentos + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function criarColuna(x, z) {
    const grupo = new THREE.Group();
    const baseY = 0;

    // Plinto e molduras da base em mármore claro.
    const plinto = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.22, 1.55),
      matPedra
    );
    plinto.position.y = 0.11;
    const baseInferior = new THREE.Mesh(
      new THREE.CylinderGeometry(raioFuste + 0.28, raioFuste + 0.34, 0.18, 48),
      matDetalhePedra
    );
    baseInferior.position.y = 0.31;
    const baseSuperior = new THREE.Mesh(
      new THREE.CylinderGeometry(raioFuste + 0.16, raioFuste + 0.28, 0.16, 48),
      matPedra
    );
    baseSuperior.position.y = 0.48;

    const fuste = new THREE.Mesh(
      geometriaFusteEstriado(raioFuste, alturaFuste),
      matPedra
    );
    fuste.position.y = 0.56;
    fuste.castShadow = true;
    fuste.receiveShadow = true;

    // Anéis discretos separam o fuste do capitel.
    const astragalo = new THREE.Mesh(
      new THREE.CylinderGeometry(raioFuste + 0.07, raioFuste + 0.07, 0.12, 48),
      matDetalhePedra
    );
    astragalo.position.y = 0.56 + alturaFuste + 0.06;
    const gola = new THREE.Mesh(
      new THREE.CylinderGeometry(raioFuste + 0.14, raioFuste + 0.08, 0.16, 48),
      matPedra
    );
    gola.position.y = 0.56 + alturaFuste + 0.19;

    // Capitel coríntio estilizado: duas coroas de folhas de acanto.
    const capitelGrupo = new THREE.Group();
    const yCapitel = 0.56 + alturaFuste + 0.25;
    const folhas = 12;
    for (let nivelFolha = 0; nivelFolha < 2; nivelFolha++) {
      for (let i = 0; i < folhas; i++) {
        const ang = (i / folhas) * Math.PI * 2 + (nivelFolha * Math.PI / folhas);
        const folha = new THREE.Mesh(
          new THREE.SphereGeometry(1, 10, 8),
          nivelFolha === 0 ? matPedra : matDetalhePedra
        );
        folha.scale.set(0.15, 0.34, 0.12);
        const r = raioFuste + (nivelFolha === 0 ? 0.1 : 0.2);
        folha.position.set(Math.cos(ang) * r, nivelFolha * 0.28 + 0.25, Math.sin(ang) * r);
        folha.rotation.z = -Math.cos(ang) * 0.28;
        folha.rotation.x = Math.sin(ang) * 0.28;
        capitelGrupo.add(folha);
      }
    }
    const equino = new THREE.Mesh(
      new THREE.CylinderGeometry(raioFuste + 0.25, raioFuste + 0.2, 0.18, 48),
      matPedra
    );
    equino.position.y = 0.67;
    capitelGrupo.add(equino);
    const abaco = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.22, 1.55),
      matPedra
    );
    abaco.position.y = 0.86;
    capitelGrupo.add(abaco);
    capitelGrupo.position.y = yCapitel;

    grupo.add(plinto, baseInferior, baseSuperior, fuste, astragalo, gola, capitelGrupo);
    grupo.position.set(x, baseY, z);
    scene.add(grupo);
    colunas.push({ x, z, topoY: topoColuna });
  }

  const posicoesColunas = [-L + 1.15, L - 1.15];
  posicoesColunas.forEach((x) => {
    colunasZ.forEach((z) => criarColuna(x, z));
  });

  // ---------- Entablamento clássico ----------
  // Em vez de pequenos blocos suspensos, uma arquitrave de mármore
  // contínua une os capitéis e dá à sala a leitura de um templo/museu.
  posicoesColunas.forEach((x) => {
    const arquitrave = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.48, P * 2 + 0.2),
      matPedra
    );
    arquitrave.position.set(x, H - 0.78, 0);
    arquitrave.castShadow = true;
    scene.add(arquitrave);

    const friso = new THREE.Mesh(
      new THREE.BoxGeometry(1.62, 0.18, P * 2 + 0.28),
      matDetalhePedra
    );
    friso.position.set(x, H - 0.42, 0);
    scene.add(friso);

    const cornijaSuperior = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 0.16, P * 2 + 0.42),
      matPedra
    );
    cornijaSuperior.position.set(x, H - 0.18, 0);
    scene.add(cornijaSuperior);

    // Dentículos discretos sob a cornija, detalhe típico da arquitetura clássica.
    for (let i = 0; i < 17; i++) {
      const denticulo = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 0.12, 0.16),
        matDetalhePedra
      );
      denticulo.position.set(x, H - 0.57, -P + 0.55 + i * ((P * 2 - 1.1) / 16));
      scene.add(denticulo);
    }
  });


  // ---------- Grande portal de entrada e pórtico exterior ----------
  // A entrada sul ganha moldura monumental, frontão neoclássico,
  // colunas externas e uma escadaria de chegada.
  const portalZ = P + 0.28;
  const portalLargura = 7.2;
  const portalAltura = 8.2;

  [-1, 1].forEach((lado) => {
    const pilastra = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, portalAltura, 0.48),
      matPedra
    );
    pilastra.position.set(lado * (vaoPorta / 2 + 0.36), portalAltura / 2, portalZ);
    scene.add(pilastra);

    const capitelPortal = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.32, 0.72),
      matDetalhePedra
    );
    capitelPortal.position.set(lado * (vaoPorta / 2 + 0.36), portalAltura - 0.16, portalZ);
    scene.add(capitelPortal);

    const basePortal = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.34, 0.72),
      matDetalhePedra
    );
    basePortal.position.set(lado * (vaoPorta / 2 + 0.36), 0.17, portalZ);
    scene.add(basePortal);
  });

  const lintelPortal = new THREE.Mesh(
    new THREE.BoxGeometry(portalLargura, 0.55, 0.62),
    matPedra
  );
  lintelPortal.position.set(0, portalAltura - 0.12, portalZ);
  scene.add(lintelPortal);

  // Frontão triangular clássico e tímpano azul profundo.
  const formaFrontao = new THREE.Shape();
  formaFrontao.moveTo(-4.25, 0);
  formaFrontao.lineTo(4.25, 0);
  formaFrontao.lineTo(0, 1.9);
  formaFrontao.closePath();
  const frontao = new THREE.Mesh(
    new THREE.ExtrudeGeometry(formaFrontao, { depth: 0.42, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: 0xf1efe8, roughness: 0.42, side: THREE.DoubleSide })
  );
  frontao.position.set(0, portalAltura + 0.18, portalZ - 0.18);
  scene.add(frontao);

  const timpano = new THREE.Mesh(
    new THREE.ShapeGeometry(formaFrontao),
    new THREE.MeshStandardMaterial({
      color: 0x182944,
      roughness: 0.8,
      emissive: 0x101d32,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  timpano.position.set(0, portalAltura + 0.3, portalZ + 0.255);
  scene.add(timpano);

  // Colunas livres do pórtico, em escala menor que as da nave principal.
  [-3.45, 3.45].forEach((x) => {
    const basePortico = new THREE.Mesh(
      new THREE.CylinderGeometry(0.86, 0.96, 0.32, 32),
      matDetalhePedra
    );
    basePortico.position.set(x, 0.16, P + 2.8);
    const fustePortico = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.64, 7.35, 32),
      matPedra
    );
    fustePortico.position.set(x, 3.99, P + 2.8);
    fustePortico.castShadow = true;
    const capitelPortico = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 0.64, 0.48, 32),
      matPedra
    );
    capitelPortico.position.set(x, 7.9, P + 2.8);
    scene.add(basePortico, fustePortico, capitelPortico);
    colunas.push({ x, z: P + 2.8, topoY: 8.2 });
  });

  const coberturaPortico = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 0.55, 3.8),
    matPedra
  );
  coberturaPortico.position.set(0, 8.25, P + 2.8);
  scene.add(coberturaPortico);

  const faixaPortico = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 0.2, 4.05),
    matDetalhePedra
  );
  faixaPortico.position.set(0, 8.62, P + 2.8);
  scene.add(faixaPortico);

  // Escadaria larga, patamar de chegada e caminho exterior.
  for (let i = 0; i < 4; i++) {
    const degrau = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 0.24, 0.82),
      i % 2 === 0 ? matPedra : matDetalhePedra
    );
    degrau.position.set(0, -0.06 - i * 0.13, P + 0.75 + i * 0.82);
    scene.add(degrau);
  }

  const patamarExterior = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.24, 8),
    new THREE.MeshStandardMaterial({ map: texturaMarmore(THREE), roughness: 0.48, metalness: 0.08 })
  );
  patamarExterior.position.set(0, -0.62, P + 6.2);
  scene.add(patamarExterior);

  for (let i = 0; i < 5; i++) {
    const placa = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.08, 1.15),
      matDetalhePedra
    );
    placa.position.set(0, -0.46, P + 10.2 + i * 1.2);
    scene.add(placa);
  }

  const horizonte = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 12),
    new THREE.MeshBasicMaterial({ color: 0x081326 })
  );
  horizonte.position.set(0, 5.4, P + 17.5);
  scene.add(horizonte);

  // ---------- Inscrição de entrada, na parede norte ----------
  const inscricao = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 2),
    new THREE.MeshStandardMaterial({
      map: texturaInscricao(THREE),
      transparent: true,
      emissive: 0x8a6a2e,
      emissiveIntensity: 0.25,
    })
  );
  inscricao.position.set(0, 8.55, -P + 0.02);
  inscricao.scale.y = 0.72;
  scene.add(inscricao);

  // ---------- Janelas (parede sul, ladeando a entrada) ----------
  const texturaJanela = texturaCeuEstrelado(THREE, { estrelas: 90, constelacoes: false });
  [-(vaoPorta / 2 + segSul / 2), vaoPorta / 2 + segSul / 2].forEach((x) => {
    const janela = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 3.4),
      new THREE.MeshStandardMaterial({
        map: texturaJanela,
        emissive: 0x3c5f99,
        emissiveIntensity: 0.65,
      })
    );
    janela.position.set(x, 3.6, P + espessura - 0.02);
    janela.rotation.y = Math.PI;
    scene.add(janela);

    const moldura = new THREE.Mesh(new THREE.BoxGeometry(1.74, 3.64, 0.08), matDourado);
    moldura.position.set(x, 3.6, P + espessura - 0.05);
    scene.add(moldura);

    const luzJanela = new THREE.PointLight(0x6f9bdc, 7, 6, 2);
    luzJanela.position.set(x, 3.6, P - 0.6);
    scene.add(luzJanela);
  });

  // ---------- Lustre central ----------
  const grupoLustre = new THREE.Group();
  const haste = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, H - 5.6, 8),
    matDourado
  );
  haste.position.y = H - (H - 5.6) / 2;
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 10, 28), matDourado);
  anel.rotation.x = Math.PI / 2;
  anel.position.y = 5.55;
  grupoLustre.add(haste, anel);

  const matVela = new THREE.MeshStandardMaterial({
    color: 0xffdca0,
    emissive: 0xffb366,
    emissiveIntensity: 1.4,
  });
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const vela = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), matVela);
    vela.position.set(Math.cos(ang) * 0.85, 5.6, Math.sin(ang) * 0.85);
    grupoLustre.add(vela);
  }
  scene.add(grupoLustre);

  const luzLustre = new THREE.PointLight(0xffd9a0, 42, 17, 2);
  luzLustre.position.set(0, 5.5, 0);
  luzLustre.castShadow = sombraLustre;
  if (sombraLustre) {
    const tamanhoSombra = nivel === "alto" ? 1024 : 512;
    luzLustre.shadow.mapSize.set(tamanhoSombra, tamanhoSombra);
    luzLustre.shadow.bias = -0.002;
  }
  scene.add(luzLustre);

  // ---------- Luz ambiente e de preenchimento ----------
  // A sala continua noturna, mas com leitura confortável das obras,
  // do piso e das colunas. Estas luzes não projetam sombras para poupar GPU.
  scene.add(new THREE.AmbientLight(0x34415d, 1.05));
  const hemi = new THREE.HemisphereLight(0x7892b8, 0x17131a, 0.78);
  scene.add(hemi);

  // Luzes amplas e suaves no eixo central: preenchem os corredores sem
  // apagar o contraste do teto estrelado.
  const intensidadePreenchimento = nivel === "baixo" ? 9 : nivel === "medio" ? 12 : 15;
  [-5, 0, 5].forEach((z) => {
    const luzCorredor = new THREE.PointLight(0xffd9aa, intensidadePreenchimento, 13, 2);
    luzCorredor.position.set(0, 6.7, z);
    scene.add(luzCorredor);
  });

  // Arandelas discretas nas laterais: dão volume às colunas e deixam
  // a arquitetura legível sem transformar as paredes em superfícies claras.
  [-5, 0, 5].forEach((z) => {
    [-1, 1].forEach((lado) => {
      const arandela = new THREE.PointLight(0xd9b77d, 4.5, 6.5, 2);
      arandela.position.set(lado * (L - 1.1), 3.2, z);
      scene.add(arandela);
    });
  });

  // ---------- Poeira luminosa flutuante ----------
  const qtdParticulas = qtdParticulasAlvo;
  const posicoes = new Float32Array(qtdParticulas * 3);
  const fases = new Float32Array(qtdParticulas);
  for (let i = 0; i < qtdParticulas; i++) {
    posicoes[i * 3] = (Math.random() - 0.5) * (L * 2 - 1);
    posicoes[i * 3 + 1] = Math.random() * (H - 1) + 0.3;
    posicoes[i * 3 + 2] = (Math.random() - 0.5) * (P * 2 - 1);
    fases[i] = Math.random() * Math.PI * 2;
  }
  const geomParticulas = new THREE.BufferGeometry();
  geomParticulas.setAttribute("position", new THREE.BufferAttribute(posicoes, 3));
  const particulas = new THREE.Points(
    geomParticulas,
    new THREE.PointsMaterial({
      size: 0.06,
      map: texturaParticula(THREE),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(particulas);

  const alturasBase = posicoes.slice();

  function atualizarParticulas(tempo, movimentoReduzido) {
    if (movimentoReduzido) return;
    const pos = geomParticulas.attributes.position;
    for (let i = 0; i < qtdParticulas; i++) {
      pos.array[i * 3 + 1] =
        alturasBase[i * 3 + 1] + Math.sin(tempo * 0.4 + fases[i]) * 0.35;
      pos.array[i * 3] = alturasBase[i * 3] + Math.sin(tempo * 0.2 + fases[i]) * 0.2;
    }
    pos.needsUpdate = true;
  }

  return { scene, atualizarParticulas, colunas };
}
