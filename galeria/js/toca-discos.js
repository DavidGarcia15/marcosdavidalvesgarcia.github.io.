/*
 * Toca-discos do Museu — modelos 3D e reprodução de música clássica.
 * As composições são de domínio público; cada gravação mantém sua licença e atribuição.
 */
export const FAIXAS = [
  {
    titulo: "Sonata ao Luar — I. Adagio sostenuto",
    compositor: "Ludwig van Beethoven",
    arquivo: "Moonlight_Sonata.ogg",
    licenca: "Domínio público · gravação Mutopia",
    fonte: "https://commons.wikimedia.org/wiki/File:Moonlight_Sonata.ogg"
  },
  {
    titulo: "Partita nº 3 — Preludio",
    compositor: "Johann Sebastian Bach",
    arquivo: "Johann_Sebastian_Bach_-_partita_no._3_in_e_major,_bwv_1006_-_1._preludio.ogg",
    licenca: "Domínio público · gravação Musopen",
    fonte: "https://commons.wikimedia.org/wiki/File:Johann_Sebastian_Bach_-_partita_no._3_in_e_major,_bwv_1006_-_1._preludio.ogg"
  },
  {
    titulo: "Prelúdio e Fuga em Lá menor",
    compositor: "Johann Sebastian Bach",
    arquivo: "Bach_Prelude_and_Fugue_in_A_Minor.ogg",
    licenca: "CC BY-SA 2.5 · Samuel Cormier-Iijima",
    fonte: "https://commons.wikimedia.org/wiki/File:Bach_Prelude_and_Fugue_in_A_Minor.ogg"
  }
];

function urlFaixa(faixa) {
  return "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + encodeURIComponent(faixa.arquivo).replace(/%2F/g, "/");
}

function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function criarInterface(container, audio, getIndice, setIndice) {
  container.innerHTML = `
    <section class="vinil-player" aria-label="Toca-discos do museu">
      <p class="painel-tema">Música no salão</p>
      <h2>O toca-discos</h2>
      <p class="vinil-descricao">Escolha uma peça clássica e deixe a música acompanhar sua visita.</p>
      <label class="vinil-label" for="vinil-faixa">Disco selecionado</label>
      <select class="vinil-select" id="vinil-faixa">
        ${FAIXAS.map((f, i) => '<option value="' + i + '">' + escapar(f.titulo) + ' — ' + escapar(f.compositor) + '</option>').join("")}
      </select>
      <div class="vinil-controles">
        <button type="button" data-vinil="anterior" aria-label="Faixa anterior">⏮</button>
        <button type="button" class="vinil-play" data-vinil="play">▶ Reproduzir</button>
        <button type="button" data-vinil="proxima" aria-label="Próxima faixa">⏭</button>
      </div>
      <p class="vinil-status" aria-live="polite">Pronto para tocar</p>
      <p class="vinil-credito" id="vinil-credito"></p>
      <audio preload="none"></audio>
    </section>`;
  const select = container.querySelector("#vinil-faixa");
  const play = container.querySelector('[data-vinil="play"]');
  const status = container.querySelector(".vinil-status");
  const credito = container.querySelector("#vinil-credito");
  const audioEl = container.querySelector("audio");
  audioEl.src = urlFaixa(FAIXAS[getIndice()]);
  function atualizarCredito() {
    const f = FAIXAS[getIndice()];
    credito.innerHTML = escapar(f.licenca) + ' · <a href="' + escapar(f.fonte) + '" target="_blank" rel="noopener noreferrer">Ver gravação e licença</a>';
  }
  function carregar(indice, tocar) {
    const n = (indice + FAIXAS.length) % FAIXAS.length;
    setIndice(n);
    select.value = String(n);
    audioEl.src = urlFaixa(FAIXAS[n]);
    audioEl.load();
    atualizarCredito();
    if (tocar) {
      audioEl.play().then(() => {
        play.textContent = "Ⅱ Pausar";
        status.textContent = "Reproduzindo agora";
      }).catch(() => {
        play.textContent = "▶ Reproduzir";
        status.textContent = "Toque em reproduzir para iniciar o áudio";
      });
    } else {
      play.textContent = "▶ Reproduzir";
      status.textContent = "Disco selecionado";
    }
  }
  play.addEventListener("click", () => {
    if (audioEl.paused) {
      audioEl.play().then(() => {
        play.textContent = "Ⅱ Pausar";
        status.textContent = "Reproduzindo agora";
      }).catch(() => { status.textContent = "Não foi possível carregar esta gravação. Tente outra faixa."; });
    } else {
      audioEl.pause();
      play.textContent = "▶ Reproduzir";
      status.textContent = "Pausado";
    }
  });
  container.querySelector('[data-vinil="anterior"]').addEventListener("click", () => carregar(getIndice() - 1, !audioEl.paused));
  container.querySelector('[data-vinil="proxima"]').addEventListener("click", () => carregar(getIndice() + 1, !audioEl.paused));
  select.addEventListener("change", () => carregar(Number(select.value), !audioEl.paused));
  audioEl.addEventListener("ended", () => carregar(getIndice() + 1, true));
  audioEl.addEventListener("error", () => {
    status.textContent = "Esta gravação não carregou. Experimente outra faixa.";
    play.textContent = "▶ Reproduzir";
  });
  atualizarCredito();
  return audioEl;
}

export function criarTocaDiscos(THREE, scene) {
  const grupo = new THREE.Group();
  grupo.position.set(0, 0, 0.25);
  const madeira = new THREE.MeshStandardMaterial({ color: 0x49301f, roughness: 0.48, metalness: 0.12 });
  const madeiraClara = new THREE.MeshStandardMaterial({ color: 0x765033, roughness: 0.42 });
  const ouro = new THREE.MeshStandardMaterial({ color: 0xc49a51, metalness: 0.78, roughness: 0.24 });
  const preto = new THREE.MeshStandardMaterial({ color: 0x101318, roughness: 0.34, metalness: 0.22 });
  const disco = new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.38, metalness: 0.28 });
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.18, 1.65), madeira);
  tampo.position.y = 0.92;
  grupo.add(tampo);
  const borda = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.7), ouro);
  borda.position.y = 0.82;
  grupo.add(borda);
  for (const x of [-0.94, 0.94]) for (const z of [-0.62, 0.62]) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.82, 0.13), madeiraClara);
    pe.position.set(x, 0.41, z);
    grupo.add(pe);
  }
  const prato = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.63, 0.055, 64), ouro);
  prato.position.set(-0.28, 1.045, 0);
  grupo.add(prato);
  const vinil = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.035, 64), disco);
  vinil.position.set(-0.28, 1.09, 0);
  grupo.add(vinil);
  const etiqueta = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 32), new THREE.MeshStandardMaterial({ color: 0xb8914a, roughness: 0.6 }));
  etiqueta.position.set(-0.28, 1.115, 0);
  grupo.add(etiqueta);
  const pino = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 16), ouro);
  pino.position.set(-0.28, 1.15, 0);
  grupo.add(pino);
  const baseBraco = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.07, 24), ouro);
  baseBraco.position.set(0.68, 1.06, -0.48);
  grupo.add(baseBraco);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.035, 0.045), ouro);
  braco.position.set(0.38, 1.13, -0.25);
  braco.rotation.y = -0.62;
  grupo.add(braco);
  const agulha = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.12), madeiraClara);
  agulha.position.set(0.08, 1.12, -0.02);
  grupo.add(agulha);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.36), preto);
  painel.position.set(0.78, 1.04, 0.42);
  grupo.add(painel);
  const alvo = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 1.9), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
  alvo.position.set(0, 1.38, 0.88);
  alvo.userData.tipoInteracao = "toca-discos";
  grupo.add(alvo);
  grupo.traverse((obj) => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
  scene.add(grupo);
  const luz = new THREE.PointLight(0xd7b36d, 1.7, 5);
  luz.position.set(0, 2.4, 1.0);
  scene.add(luz);
  let faixaAtual = 0;
  let audioPlayer = null;
  const atualizar = (dt) => { if (audioPlayer && !audioPlayer.paused) vinil.rotation.y += dt * 2.2; };
  function abrir(container) {
    audioPlayer = criarInterface(container, null, () => faixaAtual, (n) => { faixaAtual = n; });
  }
  return { alvo, atualizar, abrir };
}

export function montarPlayerMobile(raiz) {
  const secao = document.createElement("section");
  secao.className = "mobile-atena mobile-vinil";
  secao.innerHTML = '<p class="mobile-eyebrow">Trilha sonora do museu</p><h2>O toca-discos</h2><p class="mobile-atena-intro">Escolha uma música clássica para acompanhar sua visita.</p><div class="vinil-mobile-player"></div>';
  raiz.insertBefore(secao, raiz.querySelector(".mobile-atena"));
  criarInterface(secao.querySelector(".vinil-mobile-player"), null, () => secao._faixa || 0, (n) => { secao._faixa = n; });
}
