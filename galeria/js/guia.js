/* Atena — guia 3D autônoma com patrulha e animações sutis. */
export function criarGuiaIA(THREE, scene) {
  const grupo = new THREE.Group();
  grupo.position.set(0, 0, 2.7);
  const mat = (cor, metalness=0.08, roughness=0.55) => new THREE.MeshStandardMaterial({color:cor,metalness,roughness});
  const azul=mat(0x263f63,0.22), dourado=mat(0xd1aa62,0.72,0.28), claro=mat(0xe8dfca), cabelo=mat(0x382638,0.12,0.72);
  const brilho=new THREE.MeshStandardMaterial({color:0x8fc8e8,emissive:0x28658a,emissiveIntensity:1.2,metalness:0.25,roughness:0.25});
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.56,0.18,28),dourado); pedestal.position.y=0.09; grupo.add(pedestal);
  const corpo=new THREE.Mesh(new THREE.CylinderGeometry(0.27,0.48,1.18,24),azul); corpo.position.y=0.82; grupo.add(corpo);
  const gola=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.035,10,32),dourado); gola.position.y=1.34; gola.rotation.x=Math.PI/2; grupo.add(gola);
  const colar=new THREE.Mesh(new THREE.TorusGeometry(0.19,0.018,8,28),dourado); colar.position.set(0,1.19,0.23); colar.rotation.x=0.18; grupo.add(colar);
  const pingente=new THREE.Mesh(new THREE.OctahedronGeometry(0.075,0),brilho); pingente.position.set(0,1.02,0.29); grupo.add(pingente);
  const faixa=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.035,8,28),dourado); faixa.rotation.x=Math.PI/2; faixa.position.y=0.55; grupo.add(faixa);
  const manto=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.56,0.28,24),mat(0x344e70,0.18,0.62)); manto.position.y=0.3; grupo.add(manto);
  const bordaManto=new THREE.Mesh(new THREE.TorusGeometry(0.49,0.025,8,32),dourado); bordaManto.position.y=0.17; bordaManto.rotation.x=Math.PI/2; grupo.add(bordaManto);
  const cabeca=new THREE.Group(); cabeca.position.y=1.65;
  cabeca.add(new THREE.Mesh(new THREE.SphereGeometry(0.34,24,18),claro));
  // Cabelos longos e presos parcialmente, dando à Atena uma aparência feminina.
  const topoCabelo=new THREE.Mesh(new THREE.SphereGeometry(0.355,24,16),cabelo);
  topoCabelo.scale.set(1.02,0.55,1.02); topoCabelo.position.set(0,0.19,-0.035); cabeca.add(topoCabelo);
  const coque=new THREE.Mesh(new THREE.SphereGeometry(0.19,18,14),cabelo);
  coque.position.set(0,0.12,-0.31); cabeca.add(coque);
  for(const lado of [-1,1]){
    const mecha=new THREE.Mesh(new THREE.CapsuleGeometry(0.085,0.48,5,10),cabelo);
    mecha.position.set(lado*0.27,-0.27,-0.045);
    mecha.rotation.z=lado*-0.12; cabeca.add(mecha);
  }
  // Diadema clássico de rainha, com pequenas pedras azuis.
  const aro=new THREE.Mesh(new THREE.TorusGeometry(0.365,0.027,10,40),dourado); aro.position.y=0.13; aro.rotation.x=Math.PI/2; cabeca.add(aro);
  for(let i=-2;i<=2;i++){
    const joia=new THREE.Mesh(new THREE.SphereGeometry(i===0?0.055:0.032,12,10),i===0?brilho:dourado);
    joia.position.set(i*0.13,0.25-Math.abs(i)*0.025,0.265); cabeca.add(joia);
  }
  // Olhos em par, com íris e pupilas.
  const brancoOlho=mat(0xf4eee2,0.02,0.3), iris=mat(0x426f91,0.2,0.28), pupila=mat(0x172332,0.05,0.2);
  for(const lado of [-1,1]){
    const olhoBase=new THREE.Mesh(new THREE.SphereGeometry(0.057,16,12),brancoOlho); olhoBase.position.set(lado*0.12,0.025,0.296); olhoBase.scale.set(1.08,0.82,0.48); cabeca.add(olhoBase);
    const irisOlho=new THREE.Mesh(new THREE.SphereGeometry(0.031,14,10),iris); irisOlho.position.set(lado*0.12,0.025,0.324); cabeca.add(irisOlho);
    const pupilaOlho=new THREE.Mesh(new THREE.SphereGeometry(0.015,12,8),pupila); pupilaOlho.position.set(lado*0.12,0.025,0.348); cabeca.add(pupilaOlho);
    const brinco=new THREE.Mesh(new THREE.SphereGeometry(0.045,12,10),dourado); brinco.position.set(lado*0.325,-0.12,0.04); cabeca.add(brinco);
    const gota=new THREE.Mesh(new THREE.OctahedronGeometry(0.045,0),brilho); gota.position.set(lado*0.325,-0.2,0.045); cabeca.add(gota);
  }
  const nariz=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,10),claro); nariz.position.set(0,-0.065,0.32); nariz.scale.set(0.7,1,0.65); cabeca.add(nariz);
  const boca=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,8),mat(0x9b6568,0,0.8)); boca.position.set(0,-0.16,0.315); boca.scale.set(1.2,0.42,0.45); cabeca.add(boca);
  grupo.add(cabeca);
  const bracos=[];
  for(const lado of [-1,1]){
    const piv=new THREE.Group(); piv.position.set(lado*0.3,1.22,0);
    const braco=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.12,0.72,12),azul); braco.position.y=-0.28; braco.rotation.z=lado*-0.18; piv.add(braco);
    const mao=new THREE.Mesh(new THREE.SphereGeometry(0.105,12,10),claro); mao.position.set(lado*-0.04,-0.63,0.015); piv.add(mao);
    grupo.add(piv); bracos.push(piv);
  }
  const orb=new THREE.Mesh(new THREE.SphereGeometry(0.13,18,14),brilho); orb.position.set(0,2.18,0); grupo.add(orb);
  const luz=new THREE.PointLight(0x83c9ed,1.4,4); luz.position.set(0,2.15,0.15); grupo.add(luz);
  scene.add(grupo);
  const alvo=new THREE.Mesh(new THREE.BoxGeometry(1.35,2.45,1.05),new THREE.MeshBasicMaterial({visible:false}));
  alvo.position.set(0,1.25,0); alvo.userData.tipoInteracao="guia-ia"; alvo.userData.nome="Atena"; grupo.add(alvo);
  let indiceDestino=0, pausa=2.5, tempo=0, fasePassos=0;
  const direcao=new THREE.Vector3(), velocidade=1.15;
  function atualizar(dt,destinos=[],conversando=false){
    tempo+=dt;
    const destino=destinos.length?destinos[indiceDestino%destinos.length]:null;
    let caminhando=false;
    if(!conversando&&destino){
      const dx=destino.posicao.x-grupo.position.x, dz=destino.posicao.z-grupo.position.z, distancia=Math.hypot(dx,dz);
      if(pausa>0) pausa=Math.max(0,pausa-dt);
      else if(distancia>0.16){
        caminhando=true; direcao.set(dx/distancia,0,dz/distancia);
        const passo=Math.min(distancia,velocidade*dt); grupo.position.x+=direcao.x*passo; grupo.position.z+=direcao.z*passo;
        const yaw=Math.atan2(direcao.x,direcao.z), delta=Math.atan2(Math.sin(yaw-grupo.rotation.y),Math.cos(yaw-grupo.rotation.y));
        grupo.rotation.y+=delta*Math.min(1,dt*4.5);
      }else{
        grupo.position.x=destino.posicao.x; grupo.position.z=destino.posicao.z;
        const delta=Math.atan2(Math.sin(destino.yaw-grupo.rotation.y),Math.cos(destino.yaw-grupo.rotation.y));
        grupo.rotation.y+=delta*Math.min(1,dt*3.5); pausa=5.5; indiceDestino=(indiceDestino+1)%destinos.length;
      }
    }
    fasePassos+=dt*(caminhando?8.5:1.8);
    grupo.position.y=Math.abs(Math.sin(fasePassos))*0.045*(caminhando?1:0.12);
    corpo.position.y=0.82+Math.sin(tempo*1.7)*0.018;
    cabeca.rotation.x=Math.sin(tempo*1.15)*(conversando?0.09:0.035);
    cabeca.rotation.z=Math.sin(tempo*0.8)*0.025; orb.position.y=2.18+Math.sin(tempo*2.1)*0.045;
    const balanco=caminhando?Math.sin(fasePassos)*0.38:Math.sin(tempo*1.4)*0.035;
    bracos[0].rotation.x=balanco; bracos[1].rotation.x=-balanco;
    bracos[0].rotation.z=conversando?0.12+Math.sin(tempo*1.8)*0.08:0;
    bracos[1].rotation.z=conversando?-0.18+Math.sin(tempo*2.4)*0.22:0;
  }
  return {grupo,alvo,atualizar};
}
