/*
 * Atena — guia virtual 3D em fase de testes.
 * Modelo leve feito com geometrias nativas do Three.js.
 */
export function criarGuiaIA(THREE, scene) {
  const grupo = new THREE.Group();
  grupo.position.set(0, 0, 2.7);
  grupo.rotation.y = 0; // voltada para quem entra no salão

  const material = (cor, metalness = 0.08, roughness = 0.55) =>
    new THREE.MeshStandardMaterial({ color: cor, metalness, roughness });

  const azul = material(0x263f63, 0.22);
  const dourado = material(0xd1aa62, 0.72, 0.28);
  const claro = material(0xe8dfca);
  const brilho = new THREE.MeshStandardMaterial({
    color: 0x8fc8e8, emissive: 0x28658a, emissiveIntensity: 1.2,
    metalness: 0.25, roughness: 0.25
  });

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 0.18, 28), dourado);
  pedestal.position.y = 0.09;
  grupo.add(pedestal);

  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.43, 1.15, 20), azul);
  corpo.position.y = 0.82;
  grupo.add(corpo);

  const faixa = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 28), dourado);
  faixa.rotation.x = Math.PI / 2;
  faixa.position.y = 0.55;
  grupo.add(faixa);

  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 18), claro);
  cabeca.position.y = 1.65;
  grupo.add(cabeca);

  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 10, 36), dourado);
  aro.position.set(0, 1.68, 0);
  aro.rotation.x = Math.PI / 2.7;
  grupo.add(aro);

  const olho = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), brilho);
  olho.position.set(0, 1.68, 0.29);
  grupo.add(olho);

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), brilho);
  orb.position.set(0, 2.18, 0);
  grupo.add(orb);

  const luz = new THREE.PointLight(0x83c9ed, 1.4, 4);
  luz.position.set(0, 2.15, 0.15);
  grupo.add(luz);

  scene.add(grupo);

  const alvo = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 2.45, 1.05),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  alvo.position.set(0, 1.25, 2.7);
  alvo.userData.tipoInteracao = "guia-ia";
  alvo.userData.nome = "Atena";
  scene.add(alvo);

  return { grupo, alvo };
}
