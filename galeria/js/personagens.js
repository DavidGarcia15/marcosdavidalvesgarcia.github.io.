/*
 * Personagens históricos — esculturas 3D estilizadas
 * Modelos leves construídos com geometrias do Three.js, sem downloads externos.
 * As figuras são interpretações artísticas, não réplicas fotorrealistas.
 */

const PERFIS = {
  "noite-estrelada": {
    nome: "Vincent van Gogh",
    papel: "Pintor pós-impressionista",
    roupa: 0x243d62, pele: 0xd5a078, cabelo: 0xc8793f, barba: 0xc8793f,
    cabeloEstilo: "barba",
    fala: "Sou Vincent van Gogh. Em Saint-Rémy, em 1889, transformei a paisagem que observava em uma composição de memória, cor e movimento. A Noite Estrelada não é uma fotografia do céu: é uma interpretação pessoal dele.",
    curiosidade: "Van Gogh realizou esta pintura enquanto estava internado no hospital de Saint-Paul-de-Mausole, em Saint-Rémy-de-Provence."
  },
  "nenufares": {
    nome: "Claude Monet",
    papel: "Pintor impressionista",
    roupa: 0x52634f, pele: 0xd7b18e, cabelo: 0xc7c2ae, barba: 0xb9b5a6,
    cabeloEstilo: "barba",
    fala: "Sou Claude Monet. Passei anos observando o lago do meu jardim em Giverny. A luz nunca permanece igual, e por isso voltei tantas vezes ao mesmo tema: cada instante revelava cores e reflexos diferentes.",
    curiosidade: "O jardim de Giverny foi uma fonte central de inspiração para a série de pinturas Nenúfares."
  },
  "astronomo": {
    nome: "Johannes Vermeer",
    papel: "Pintor holandês do Século de Ouro",
    roupa: 0x493b36, pele: 0xd8b18e, cabelo: 0x302a27, barba: 0x302a27,
    cabeloEstilo: "chapeu",
    fala: "Sou Johannes Vermeer. Em O Astrônomo, a luz conduz o olhar até um estudioso e seu globo celeste. Gosto de transformar cenas silenciosas do cotidiano em momentos de concentração e descoberta.",
    curiosidade: "O Astrônomo forma um par temático com O Geógrafo, outra obra conhecida de Vermeer."
  },
  "caminhante": {
    nome: "Caspar David Friedrich",
    papel: "Pintor do Romantismo alemão",
    roupa: 0x34463e, pele: 0xd6b18f, cabelo: 0x4b3b30, barba: 0x4b3b30,
    cabeloEstilo: "cabelo",
    fala: "Sou Caspar David Friedrich. Nas minhas paisagens, a natureza pode ser grandiosa e misteriosa. O viajante diante da névoa contempla algo que não consegue conhecer por inteiro — e é justamente isso que convida à reflexão.",
    curiosidade: "A figura vista de costas é um recurso recorrente na pintura romântica conhecido como Rückenfigur."
  }
};

function material(THREE, cor, roughness = 0.82) {
  return new THREE.MeshStandardMaterial({ color: cor, roughness, metalness: 0.02 });
}

export function criarPersonagem(THREE, pintura, scene) {
  const perfil = PERFIS[pintura.id];
  if (!perfil) return null;

  const ehOeste = pintura.parede === "oeste";
  const normal = ehOeste ? 1 : -1;
  const paredeX = ehOeste ? -11.93 : 11.93;
  const x = paredeX + normal * 1.9;
  const z = pintura.z + (pintura.z < 0 ? 1.55 : -1.55);
  const grupo = new THREE.Group();
  grupo.position.set(x, 0, z);
  grupo.rotation.y = ehOeste ? Math.PI / 2 : -Math.PI / 2;

  const dourado = material(THREE, 0xb8914a, 0.3);
  const pedra = material(THREE, 0x26334a);
  const roupa = material(THREE, perfil.roupa);
  const pele = material(THREE, perfil.pele);
  const cabelo = material(THREE, perfil.cabelo);
  const escuro = material(THREE, 0x171b24);
  const esfera = new THREE.SphereGeometry(1, 18, 14);

  // Pedestal clássico com frisos metálicos.
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.5, 0.72, 24), pedra);
  base.position.y = 0.36;
  grupo.add(base);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 8, 28), dourado);
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.69;
  grupo.add(aro);
  const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.43, 0.09, 24), dourado);
  topo.position.y = 0.77;
  grupo.add(topo);

  // Corpo, braços e mãos.
  const tronco = new THREE.Mesh(esfera, roupa);
  tronco.position.set(0, 1.42, 0);
  tronco.scale.set(0.43, 0.63, 0.29);
  grupo.add(tronco);
  for (const lado of [-1, 1]) {
    const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.14, 0.72, 12), roupa);
    braco.position.set(lado * 0.43, 1.47, 0.015);
    braco.rotation.z = lado * -0.18;
    grupo.add(braco);
    const mao = new THREE.Mesh(esfera, pele);
    mao.position.set(lado * 0.49, 1.08, 0.04);
    mao.scale.set(0.12, 0.14, 0.12);
    grupo.add(mao);
  }

  // Pescoço e cabeça.
  const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.25, 12), pele);
  pescoco.position.y = 1.98;
  grupo.add(pescoco);
  const cabeca = new THREE.Mesh(esfera, pele);
  cabeca.position.set(0, 2.31, 0.015);
  cabeca.scale.set(0.31, 0.4, 0.29);
  grupo.add(cabeca);

  // Cabelo e silhuetas individuais.
  if (perfil.cabeloEstilo === "chapeu") {
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.26, 0.2, 16), escuro);
    copa.position.set(0, 2.69, 0);
    grupo.add(copa);
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.055, 20), escuro);
    aba.position.set(0, 2.59, 0);
    grupo.add(aba);
  } else {
    const cabeloTopo = new THREE.Mesh(esfera, cabelo);
    cabeloTopo.position.set(0, 2.54, -0.045);
    cabeloTopo.scale.set(0.32, 0.22, 0.3);
    grupo.add(cabeloTopo);
    for (const lado of [-1, 1]) {
      const costeleta = new THREE.Mesh(esfera, cabelo);
      costeleta.position.set(lado * 0.27, 2.34, -0.015);
      costeleta.scale.set(0.09, 0.2, 0.13);
      grupo.add(costeleta);
    }
  }

  if (perfil.cabeloEstilo === "barba") {
    const barba = new THREE.Mesh(esfera, cabelo);
    barba.position.set(0, 2.03, 0.12);
    barba.scale.set(0.22, 0.23, 0.19);
    grupo.add(barba);
  }

  // Traços faciais simples voltados para a frente do personagem.
  for (const lado of [-1, 1]) {
    const olho = new THREE.Mesh(esfera, escuro);
    olho.position.set(lado * 0.115, 2.35, 0.276);
    olho.scale.set(0.035, 0.045, 0.025);
    grupo.add(olho);
  }
  const nariz = new THREE.Mesh(esfera, pele);
  nariz.position.set(0, 2.27, 0.3);
  nariz.scale.set(0.055, 0.09, 0.075);
  grupo.add(nariz);

  // Gola dourada discreta para integrar a figura à identidade do museu.
  const gola = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 18), dourado);
  gola.position.set(0, 1.91, 0.015);
  grupo.add(gola);

  scene.add(grupo);

  // Volume invisível para mirar e conversar com a figura.
  const alvo = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 2.35, 0.95),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  alvo.position.set(x, 1.85, z);
  alvo.userData.tipoInteracao = "personagem";
  alvo.userData.personagem = perfil;
  scene.add(alvo);

  const posAproximacao = new THREE.Vector3(x + normal * 2.35, 1.65, z);
  const cameraTemporaria = new THREE.Object3D();
  cameraTemporaria.position.copy(posAproximacao);
  cameraTemporaria.lookAt(x, 1.85, z);
  const quatAproximacao = cameraTemporaria.quaternion.clone();

  return { alvo, posAproximacao, quatAproximacao, perfil };
}
