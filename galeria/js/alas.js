/*
 * Museu Marcos David — átrio e alas do conhecimento
 * ----------------------------------------------------
 * Amplia a galeria artística com um átrio central e quatro salas temáticas.
 * A modelagem fica isolada deste módulo para que novas alas sejam acrescentadas
 * sem reescrever a cena original.
 */
import { SALAS_MUSEU } from "./salas.js";
import { texturaMarmore, texturaCeuEstrelado, texturaParede } from "./texturas.js";

function criarTexturaPlaca(THREE, titulo, subtitulo, pequeno = "") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0c1b30";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#c19a55";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  ctx.strokeStyle = "rgba(220,187,121,.36)";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  ctx.textAlign = "center";
  ctx.fillStyle = "#dfc17e";
  ctx.font = "600 34px Georgia, serif";
  ctx.fillText(pequeno.toLocaleUpperCase("pt-BR"), 512, 112);
  ctx.fillStyle = "#f4efe4";
  const palavras = titulo.split(" ");
  const tituloLinhas = [];
  let linhaAtual = "";
  for (const palavra of palavras) {
    const tentativa = linhaAtual ? linhaAtual + " " + palavra : palavra;
    if (tentativa.length > 22 && linhaAtual) {
      tituloLinhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = tentativa;
    }
  }
  if (linhaAtual) tituloLinhas.push(linhaAtual);
  ctx.font = tituloLinhas.length > 1 ? "600 58px Georgia, serif" : "600 66px Georgia, serif";
  const inicioTitulo = tituloLinhas.length > 1 ? 218 : 260;
  tituloLinhas.slice(0, 2).forEach((linha, i) => ctx.fillText(linha, 512, inicioTitulo + i * 70));
  ctx.fillStyle = "#b9c4d2";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText(subtitulo, 512, 410);

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

export function criarAlasMuseu(THREE, scene, nivel = "alto") {
  const colunas = [];
  const alvosSalas = [];

  const pedra = new THREE.MeshStandardMaterial({ color: 0xe9e5db, roughness: 0.43, metalness: 0.02 });
  const pedraClara = new THREE.MeshStandardMaterial({ color: 0xf4f0e7, roughness: 0.38, metalness: 0.02 });
  const pedraSombra = new THREE.MeshStandardMaterial({ color: 0xcac5ba, roughness: 0.54 });
  const ouro = new THREE.MeshStandardMaterial({ color: 0xb8914a, metalness: 0.68, roughness: 0.3 });
  const madeira = new THREE.MeshStandardMaterial({ color: 0x4a3021, roughness: 0.74 });
  const madeiraClara = new THREE.MeshStandardMaterial({ color: 0x765236, roughness: 0.68 });
  const azul = new THREE.MeshStandardMaterial({ color: 0x142947, roughness: 0.7 });
  const vidro = new THREE.MeshStandardMaterial({ color: 0x9bc4d8, transparent: true, opacity: 0.46, roughness: 0.18, metalness: 0.08 });
  const livroCores = [0x7b3d34, 0x315b69, 0x9a7841, 0x3c4b3c, 0x6a4d7d];

  const texturaPiso = texturaMarmore(THREE);
  const texturaParedeSala = texturaParede(THREE);
  const texturaTeto = texturaCeuEstrelado(THREE, {
    estrelas: nivel === "baixo" ? 90 : 150,
    largura: nivel === "baixo" ? 512 : 1024,
    altura: nivel === "baixo" ? 512 : 1024,
  });

  const matPiso = new THREE.MeshStandardMaterial({ map: texturaPiso, roughness: 0.34, metalness: 0.12 });
  const matParede = new THREE.MeshStandardMaterial({ map: texturaParedeSala, color: 0x9eabc0, roughness: 0.88 });
  const matTeto = new THREE.MeshStandardMaterial({
    map: texturaTeto,
    emissive: 0x0d1d38,
    emissiveMap: texturaTeto,
    emissiveIntensity: 0.42,
    roughness: 1,
  });

  function caixa(largura, altura, profundidade, material, x, y, z, rotY = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, profundidade), material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function criarPisoETeto(largura, profundidade, centroX, centroZ) {
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(largura, profundidade), matPiso);
    piso.rotation.x = -Math.PI / 2;
    piso.position.set(centroX, 0.012, centroZ);
    piso.receiveShadow = true;
    scene.add(piso);

    const teto = new THREE.Mesh(new THREE.PlaneGeometry(largura, profundidade), matTeto);
    teto.rotation.x = Math.PI / 2;
    teto.position.set(centroX, 10, centroZ);
    scene.add(teto);
  }

  function paredeY(largura, altura, profundidade, x, y, z) {
    return caixa(largura, altura, profundidade, matParede, x, y, z);
  }

  function criarPlaca(grupo, largura, altura, titulo, subtitulo, setor) {
    const moldura = new THREE.Mesh(
      new THREE.BoxGeometry(largura + 0.28, altura + 0.28, 0.2),
      ouro
    );
    moldura.position.z = -0.02;
    grupo.add(moldura);

    const painel = new THREE.Mesh(
      new THREE.PlaneGeometry(largura, altura),
      new THREE.MeshStandardMaterial({
        map: criarTexturaPlaca(THREE, titulo, subtitulo, setor),
        roughness: 0.5,
        metalness: 0.08,
      })
    );
    painel.position.z = 0.091;
    grupo.add(painel);

    const alvo = new THREE.Mesh(
      new THREE.PlaneGeometry(largura, altura),
      new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
    );
    alvo.position.z = 0.105;
    alvo.userData.tipoInteracao = "sala";
    alvo.userData.salaId = grupo.userData.salaId;
    grupo.add(alvo);
    alvosSalas.push(alvo);
  }

  function criarPlacaParede(sala, x, z, rotY) {
    const grupo = new THREE.Group();
    grupo.position.set(x, 4.05, z);
    grupo.rotation.y = rotY;
    grupo.userData.salaId = sala.id;
    criarPlaca(grupo, 5.8, 2.75, sala.titulo, sala.temas.slice(0, 2).join(" · "), sala.setor);
    scene.add(grupo);
  }

  function criarPortalLateral(x, z, lado, sala) {
    const sinal = lado < 0 ? Math.PI / 2 : -Math.PI / 2;
    [-2.55, 2.55].forEach((offset) => {
      caixa(0.58, 7.15, 0.62, pedraClara, x, 3.575, z + offset);
      caixa(0.88, 0.28, 0.82, pedraSombra, x, 7.18, z + offset);
      caixa(0.9, 0.28, 0.86, pedraSombra, x, 0.14, z + offset);
      colunas.push({ x, z: z + offset, topoY: 7.4 });
    });

    caixa(0.62, 0.48, 5.55, pedraClara, x, 7.26, z);
    const letreiro = new THREE.Group();
    letreiro.position.set(x + (lado < 0 ? 0.34 : -0.34), 4.75, z);
    letreiro.rotation.y = sinal;
    letreiro.userData.salaId = sala.id;
    criarPlaca(letreiro, 5.0, 1.55, sala.titulo, "Entre para explorar", sala.setor);
    scene.add(letreiro);
  }

  // ---------- Ligação com a galeria artística ----------
  // A passagem fica ao norte do salão original; o acesso externo e o spawn
  // da galeria permanecem exatamente onde já estavam.
  caixa(0.52, 7.45, 0.62, pedraClara, -3.35, 3.725, -10.05);
  caixa(0.52, 7.45, 0.62, pedraClara, 3.35, 3.725, -10.05);
  caixa(0.82, 0.3, 0.82, pedraSombra, -3.35, 7.48, -10.05);
  caixa(0.82, 0.3, 0.82, pedraSombra, 3.35, 7.48, -10.05);
  caixa(7.25, 0.56, 0.72, pedraClara, 0, 7.62, -10.05);
  colunas.push({ x: -3.35, z: -10.05, topoY: 7.8 }, { x: 3.35, z: -10.05, topoY: 7.8 });

  // Letreiro no lado do átrio, voltado para quem chega da galeria artística.
  const placaGaleria = new THREE.Group();
  placaGaleria.position.set(0, 8.55, -10.52);
  placaGaleria.rotation.y = Math.PI;
  const molduraGaleria = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.35, 0.2), ouro);
  placaGaleria.add(molduraGaleria);
  const textoGaleria = new THREE.Mesh(
    new THREE.PlaneGeometry(7.15, 1.1),
    new THREE.MeshStandardMaterial({
      map: criarTexturaPlaca(THREE, "Galeria Artística", "Van Gogh • Monet • Vermeer • Friedrich", "Ala de entrada"),
      roughness: 0.5,
    })
  );
  textoGaleria.position.z = 0.11;
  placaGaleria.add(textoGaleria);
  scene.add(placaGaleria);

  // ---------- Átrio central ----------
  const atrioZ = -24;
  criarPisoETeto(28, 28, 0, atrioZ);

  // Paredes laterais segmentadas: duas portas por ala, uma para cada sala.
  const centrosPortas = [-16.5, -29.6];
  [-14, 14].forEach((x) => {
    const lado = x < 0 ? -1 : 1;
    const portas = lado < 0
      ? [{ centro: -29.6, sala: SALAS_MUSEU[1] }, { centro: -16.5, sala: SALAS_MUSEU[0] }]
      : [{ centro: -29.6, sala: SALAS_MUSEU[3] }, { centro: -16.5, sala: SALAS_MUSEU[2] }];
    let limite = -38;
    for (const porta of portas) {
      const inicio = porta.centro - 2.8;
      const fim = porta.centro + 2.8;
      const antes = inicio - limite;
      if (antes > 0.1) paredeY(0.5, 10, antes, x, 5, (limite + inicio) / 2);
      caixa(0.56, 2.8, 5.75, pedraClara, x, 8.6, porta.centro);
      criarPortalLateral(x, porta.centro, lado, porta.sala);
      limite = fim;
    }
    const depois = -10 - limite;
    if (depois > 0.1) paredeY(0.5, 10, depois, x, 5, (limite - 10) / 2);
  });

  // Parede norte do átrio e molduras contínuas de piso e teto.
  paredeY(28, 10, 0.5, 0, 5, -38);
  caixa(28.5, 0.18, 0.42, ouro, 0, 0.32, atrioZ);
  caixa(28.5, 0.18, 0.42, ouro, 0, 9.7, atrioZ);
  caixa(0.42, 0.18, 28.5, ouro, -13.85, 0.32, atrioZ);
  caixa(0.42, 0.18, 28.5, ouro, 13.85, 0.32, atrioZ);

  // Rosa dos ventos em mármore e bronze no centro do átrio.
  const aro = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.055, 8, 64), ouro);
  aro.rotation.x = Math.PI / 2;
  aro.position.set(0, 0.055, atrioZ);
  scene.add(aro);
  caixa(0.12, 0.045, 4.5, ouro, 0, 0.065, atrioZ);
  caixa(4.5, 0.045, 0.12, ouro, 0, 0.065, atrioZ);
  const losango = new THREE.Mesh(new THREE.OctahedronGeometry(0.72, 0), pedraClara);
  losango.position.set(0, 0.42, atrioZ);
  losango.scale.y = 1.35;
  scene.add(losango);

  // Luzes suaves e econômicas no átrio e nas entradas.
  scene.add(new THREE.AmbientLight(0x65718d, 0.58));
  const luzAtrio = new THREE.PointLight(0xffd9a0, nivel === "baixo" ? 17 : 24, 25, 2);
  luzAtrio.position.set(0, 7, atrioZ);
  scene.add(luzAtrio);
  [-16.5, -29.6].forEach((z) => {
    [-1, 1].forEach((lado) => {
      const luzPorta = new THREE.PointLight(0xffd7a0, nivel === "baixo" ? 5 : 8, 8, 2);
      luzPorta.position.set(lado * 12.7, 5.4, z);
      scene.add(luzPorta);
    });
  });

  // ---------- Quatro salas temáticas ----------
  const configuracoes = [
    { sala: SALAS_MUSEU[0], lado: -1, zCentro: -16.5, xCentro: -28 },
    { sala: SALAS_MUSEU[1], lado: -1, zCentro: -29.6, xCentro: -28 },
    { sala: SALAS_MUSEU[2], lado: 1, zCentro: -16.5, xCentro: 28 },
    { sala: SALAS_MUSEU[3], lado: 1, zCentro: -29.6, xCentro: 28 },
  ];

  configuracoes.forEach(({ sala, lado, zCentro, xCentro }) => {
    const xExterno = lado * 42;
    const zFrente = zCentro + 6.3;
    const zFundo = zCentro - 6.3;

    criarPisoETeto(28, 12.6, lado * 28, zCentro);
    paredeY(0.5, 10, 12.6, xExterno, 5, zCentro);
    paredeY(28, 10, 0.5, lado * 28, 5, zFrente);
    paredeY(28, 10, 0.5, lado * 28, 5, zFundo);

    // O letreiro curatorial fica na parede externa, voltado para o interior.
    criarPlacaParede(sala, lado < 0 ? -41.62 : 41.62, zCentro, lado < 0 ? Math.PI / 2 : -Math.PI / 2);

    // Rodapés e faixas superiores em bronze reforçam a unidade arquitetônica.
    caixa(0.16, 0.16, 12.4, ouro, xExterno - lado * 0.28, 0.3, zCentro);
    caixa(0.16, 0.16, 12.4, ouro, xExterno - lado * 0.28, 9.68, zCentro);

    if (sala.id === "historia") {
      // Estante de madeira e volumes de livros — formas simples e leves.
      const estanteX = -36.6;
      const estanteZ = zCentro - 5.1;
      caixa(5.8, 3.6, 0.48, madeira, estanteX, 1.9, estanteZ);
      for (let nivelPrateleira = 0; nivelPrateleira < 4; nivelPrateleira++) {
        const y = 0.72 + nivelPrateleira * 0.88;
        caixa(5.55, 0.12, 0.62, madeiraClara, estanteX, y, estanteZ + 0.12);
        for (let i = 0; i < 13; i++) {
          const altura = 0.48 + ((i * 7) % 4) * 0.06;
          const livro = new THREE.Mesh(
            new THREE.BoxGeometry(0.26, altura, 0.38),
            new THREE.MeshStandardMaterial({ color: livroCores[(i + nivelPrateleira) % livroCores.length], roughness: 0.82 })
          );
          livro.position.set(estanteX - 2.45 + i * 0.4, y + 0.06 + altura / 2, estanteZ + 0.08);
          scene.add(livro);
        }
      }
      caixa(3.5, 0.22, 1.8, madeiraClara, xCentro, 0.95, zCentro + 1.3);
      [-1.35, 1.35].forEach((dx) => caixa(0.18, 0.9, 0.18, madeira, xCentro + dx, 0.45, zCentro + 1.3));
      const livroAberto = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.09, 0.9), pedraClara);
      livroAberto.position.set(xCentro, 1.12, zCentro + 1.3);
      scene.add(livroAberto);
    }

    if (sala.id === "geografia") {
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.9, 1.4, 24), madeiraClara);
      pedestal.position.set(xCentro, 0.7, zCentro);
      scene.add(pedestal);
      const globo = new THREE.Mesh(
        new THREE.SphereGeometry(1.15, 24, 18),
        new THREE.MeshStandardMaterial({ color: 0x3d7891, roughness: 0.58, metalness: 0.12 })
      );
      globo.position.set(xCentro, 2.15, zCentro);
      scene.add(globo);
      const meridiano = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.035, 8, 48), ouro);
      meridiano.rotation.x = Math.PI / 2.4;
      meridiano.position.copy(globo.position);
      scene.add(meridiano);
      const equador = new THREE.Mesh(new THREE.TorusGeometry(1.17, 0.025, 8, 48), pedraClara);
      equador.rotation.x = Math.PI / 2;
      equador.position.copy(globo.position);
      scene.add(equador);
      caixa(3.6, 0.18, 1.7, madeiraClara, xCentro + 4.2, 0.95, zCentro + 1.4);
    }

    if (sala.id === "raciocinio") {
      // Mesa de estudo e sólidos geométricos em escala de exposição.
      caixa(4.2, 0.22, 2.1, madeiraClara, xCentro, 0.95, zCentro + 1.1);
      [-1.7, 1.7].forEach((dx) => [-0.7, 0.7].forEach((dz) => {
        caixa(0.16, 0.9, 0.16, madeira, xCentro + dx, 0.45, zCentro + 1.1 + dz);
      }));
      const cubo = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), ouro);
      cubo.position.set(xCentro - 1.0, 1.62, zCentro + 1.1);
      cubo.rotation.set(0.3, 0.55, 0.2);
      scene.add(cubo);
      const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 16), pedraClara);
      esfera.position.set(xCentro + 0.8, 1.55, zCentro + 1.1);
      scene.add(esfera);
      const quadro = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.8, 0.18), azul);
      quadro.position.set(41.6, 4.2, zCentro - 4.8);
      scene.add(quadro);
      for (let i = 0; i < 3; i++) {
        caixa(0.08, 0.08, 3.8, ouro, 41.48, 3.3 + i * 0.8, zCentro - 4.8);
      }
    }

    if (sala.id === "investigacao") {
      caixa(4.5, 0.22, 2.3, madeiraClara, xCentro, 0.95, zCentro + 1.0);
      [-1.8, 1.8].forEach((dx) => [-0.8, 0.8].forEach((dz) => {
        caixa(0.16, 0.9, 0.16, madeira, xCentro + dx, 0.45, zCentro + 1.0 + dz);
      }));
      [-1.1, 0, 1.1].forEach((dx, i) => {
        const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.35 + i * 0.25, 16), vidro);
        tubo.position.set(xCentro + dx, 1.8 + i * 0.12, zCentro + 1.0);
        scene.add(tubo);
        const liquido = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.24, 0.44, 16),
          new THREE.MeshStandardMaterial({ color: [0x6b9d9b, 0xc59d57, 0x8b729f][i], transparent: true, opacity: 0.78 })
        );
        liquido.position.set(xCentro + dx, 1.35 + i * 0.12, zCentro + 1.0);
        scene.add(liquido);
      });
      const esferaVidro = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), vidro);
      esferaVidro.position.set(xCentro + 3.0, 1.45, zCentro + 1.0);
      scene.add(esferaVidro);
    }

    // Luz própria discreta para que cada sala tenha leitura clara sem pesar.
    const luzSala = new THREE.PointLight(0xffd8a0, nivel === "baixo" ? 5 : 8, 13, 2);
    luzSala.position.set(xCentro, 6.2, zCentro);
    scene.add(luzSala);
  });

  // Placa de orientação no fundo do átrio: assinala a lógica modular do edifício.
  const orientacao = new THREE.Group();
  orientacao.position.set(0, 5.2, -37.55);
  const molduraOrientacao = new THREE.Mesh(new THREE.BoxGeometry(7.8, 3.0, 0.22), ouro);
  orientacao.add(molduraOrientacao);
  const painelOrientacao = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 2.7),
    new THREE.MeshStandardMaterial({
      map: criarTexturaPlaca(THREE, "Museu-biblioteca", "Arte • conhecimento • investigação", "Átrio central"),
      roughness: 0.55,
    })
  );
  painelOrientacao.position.z = 0.13;
  orientacao.add(painelOrientacao);
  scene.add(orientacao);

  return { colunas, alvosSalas };
}
