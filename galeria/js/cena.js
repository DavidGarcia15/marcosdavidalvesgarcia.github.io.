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

export function criarCena(THREE) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060b16, 0.028);

  const { meiaLargura: L, meiaProfundidade: P, altura: H, raioColuna, colunasZ } = SALA;

  // ---------- Materiais reutilizados ----------
  const matDourado = new THREE.MeshStandardMaterial({
    color: 0xb8914a,
    metalness: 0.65,
    roughness: 0.32,
  });
  const matPedra = new THREE.MeshStandardMaterial({
    color: 0xd9cdb0,
    roughness: 0.75,
    metalness: 0.05,
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
  const ceu = texturaCeuEstrelado(THREE, { estrelas: 260 });
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

  // norte (fundo, com a inscrição)
  criarParedeLisa(L * 2 + espessura, espessura, 0, -P - espessura / 2);

  // sul (entrada, com vão central para a porta)
  const vaoPorta = 3.6;
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
    criarFaixa(L * 2 + 0.6, 0.34, 0, y, -P - 0.08);
    criarFaixa(L * 2 + 0.6, 0.34, 0, y, P + 0.08);
  });

  // ---------- Colunas (base + fuste + capitel) ----------
  const alturaFuste = H - 1.3;
  const colunas = []; // {x, z, topoY} — usado para os arcos

  function criarColuna(x, z) {
    const grupo = new THREE.Group();

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(raioColuna + 0.14, raioColuna + 0.18, 0.3, 20),
      matDourado
    );
    base.position.y = 0.15;

    const fuste = new THREE.Mesh(
      new THREE.CylinderGeometry(raioColuna, raioColuna * 1.06, alturaFuste, 20),
      matPedra
    );
    fuste.position.y = 0.3 + alturaFuste / 2;
    fuste.castShadow = true;

    const capitel = new THREE.Mesh(
      new THREE.CylinderGeometry(raioColuna + 0.2, raioColuna + 0.05, 0.32, 20),
      matDourado
    );
    capitel.position.y = 0.3 + alturaFuste + 0.16;

    grupo.add(base, fuste, capitel);
    grupo.position.set(x, 0, z);
    scene.add(grupo);

    colunas.push({ x, z, topoY: 0.3 + alturaFuste + 0.32 });
  }

  [-L + 0.75, L - 0.75].forEach((x) => {
    colunasZ.forEach((z) => criarColuna(x, z));
  });

  // ---------- Arcos ornamentais entre colunas consecutivas ----------
  // Cada arco é tracejado por pequenos blocos dourados ao longo de um
  // semicírculo — evita depender de rotações complexas de geometria de
  // toro e já transmite bem a ideia de "arco" visto do chão do salão.
  function criarArco(x, z1, z2, baseY) {
    const centroZ = (z1 + z2) / 2;
    const raio = Math.abs(z2 - z1) / 2;
    const passos = 10;
    for (let i = 0; i <= passos; i++) {
      const t = (i / passos) * Math.PI;
      const y = baseY + raio * Math.sin(t);
      const z = centroZ + raio * Math.cos(t) * Math.sign(z2 - z1 || 1);
      const bloco = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.22), matDourado);
      bloco.position.set(x, y, z);
      scene.add(bloco);
    }
  }

  [-L + 0.75, L - 0.75].forEach((x) => {
    for (let i = 0; i < colunasZ.length - 1; i++) {
      criarArco(x, colunasZ[i], colunasZ[i + 1], 0.3 + alturaFuste + 0.32);
    }
  });

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
  inscricao.position.set(0, 5.6, -P - espessura + 0.02);
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
  luzLustre.castShadow = true;
  luzLustre.shadow.mapSize.set(1024, 1024);
  luzLustre.shadow.bias = -0.002;
  scene.add(luzLustre);

  // ---------- Luz ambiente e de preenchimento ----------
  scene.add(new THREE.AmbientLight(0x1a2744, 0.85));
  const hemi = new THREE.HemisphereLight(0x3a5a8c, 0x05070c, 0.55);
  scene.add(hemi);

  // ---------- Poeira luminosa flutuante ----------
  const qtdParticulas = 160;
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
