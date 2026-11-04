/* Atena — guia 3D autônoma com patrulha e animações sutis. */
export function criarGuiaIA(THREE, scene) {
  const grupo = new THREE.Group();
  grupo.position.set(0, 0, 2.7);
  const mat = (cor, metalness=0.08, roughness=0.55) => new THREE.MeshStandardMaterial({color:cor,metalness,roughness});
  const azul=mat(0x263f63,0.22), dourado=mat(0xd1aa62,0.72,0.28), claro=mat(0xe8dfca);
  const brilho=new THREE.MeshStandardMaterial({color:0x8fc8e8,emissive:0x28658a,emissiveIntensity:1.2,metalness:0.25,roughness:0.25});
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.56,0.18,28),dourado); pedestal.position.y=0.09; grupo.add(pedestal);
  const corpo=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.43,1.15,20),azul); corpo.position.y=0.82; grupo.add(corpo);
  const faixa=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.035,8,28),dourado); faixa.rotation.x=Math.PI/2; faixa.position.y=0.55; grupo.add(faixa);
  const cabeca=new THREE.Group(); cabeca.position.y=1.65;
  cabeca.add(new THREE.Mesh(new THREE.SphereGeometry(0.34,24,18),claro));
  const aro=new THREE.Mesh(new THREE.TorusGeometry(0.46,0.035,10,36),dourado); aro.rotation.x=Math.PI/2.7; cabeca.add(aro);
  const olho=new THREE.Mesh(new THREE.SphereGeometry(0.075,16,12),brilho); olho.position.set(0,0.03,0.29); cabeca.add(olho); grupo.add(cabeca);
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
