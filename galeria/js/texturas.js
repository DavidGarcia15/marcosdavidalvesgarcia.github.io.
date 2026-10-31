/*
 * Galeria Marcos David — texturas procedurais
 * ---------------------------------------------
 * Todas as texturas são desenhadas em <canvas> em tempo de carregamento,
 * em vez de arquivos de imagem externos. Isso evita dependências de
 * assets pesados e deixa a primeira versão leve e previsível.
 * Cada função recebe THREE (passado de cena.js) para devolver uma
 * THREE.CanvasTexture já pronta para uso.
 */

function canvas2d(largura, altura) {
  const c = document.createElement("canvas");
  c.width = largura;
  c.height = altura;
  return { c, ctx: c.getContext("2d") };
}

// ---------- Piso de mármore escuro ----------
export function texturaMarmore(THREE) {
  const { c, ctx } = canvas2d(512, 512);

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#0b1526");
  grad.addColorStop(0.5, "#0e1b30");
  grad.addColorStop(1, "#091220");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // veios claros e discretos, em curvas suaves
  ctx.lineCap = "round";
  for (let i = 0; i < 26; i++) {
    const startX = Math.random() * 512;
    const startY = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let x = startX;
    let y = startY;
    for (let s = 0; s < 4; s++) {
      const cx = x + (Math.random() - 0.5) * 180;
      const cy = y + (Math.random() - 0.5) * 180;
      const ex = x + (Math.random() - 0.5) * 220;
      const ey = y + (Math.random() - 0.5) * 220;
      ctx.quadraticCurveTo(cx, cy, ex, ey);
      x = ex;
      y = ey;
    }
    ctx.strokeStyle = `rgba(184, 145, 74, ${0.03 + Math.random() * 0.05})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.4;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Teto / janelas: céu noturno com constelações ----------
export function texturaCeuEstrelado(THREE, { largura = 1024, altura = 1024, estrelas = 220, constelacoes = true } = {}) {
  const { c, ctx } = canvas2d(largura, altura);

  const grad = ctx.createRadialGradient(
    largura / 2, altura * 0.3, 10,
    largura / 2, altura * 0.5, largura * 0.75
  );
  grad.addColorStop(0, "#132544");
  grad.addColorStop(0.55, "#0a1528");
  grad.addColorStop(1, "#050a15");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, largura, altura);

  const pontos = [];
  for (let i = 0; i < estrelas; i++) {
    const x = Math.random() * largura;
    const y = Math.random() * altura;
    const r = Math.random() * 1.6 + 0.3;
    pontos.push([x, y]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const brilho = Math.random();
    ctx.fillStyle =
      brilho > 0.82 ? "#ffe9ab" : `rgba(255, 246, 224, ${0.4 + brilho * 0.5})`;
    ctx.fill();
  }

  if (constelacoes) {
    ctx.strokeStyle = "rgba(220, 187, 121, 0.18)";
    ctx.lineWidth = 1;
    for (let grupo = 0; grupo < 7; grupo++) {
      const origem = pontos[Math.floor(Math.random() * pontos.length)];
      let atual = origem;
      ctx.beginPath();
      ctx.moveTo(atual[0], atual[1]);
      const elos = 2 + Math.floor(Math.random() * 3);
      for (let e = 0; e < elos; e++) {
        let candidato = null;
        let menorDist = Infinity;
        for (const p of pontos) {
          const d = Math.hypot(p[0] - atual[0], p[1] - atual[1]);
          if (d > 4 && d < 140 && d < menorDist && p !== atual) {
            menorDist = d;
            candidato = p;
          }
        }
        if (!candidato) break;
        ctx.lineTo(candidato[0], candidato[1]);
        atual = candidato;
      }
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Parede: ruído sutil sobre o tom navy ----------
export function texturaParede(THREE, corBase = "#152a47") {
  const { c, ctx } = canvas2d(256, 256);
  ctx.fillStyle = corBase;
  ctx.fillRect(0, 0, 256, 256);
  const imgData = ctx.getImageData(0, 0, 256, 256);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    imgData.data[i] += n;
    imgData.data[i + 1] += n;
    imgData.data[i + 2] += n;
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Sprite circular suave para partículas de poeira luminosa ----------
export function texturaParticula(THREE) {
  const { c, ctx } = canvas2d(64, 64);
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 233, 171, 0.9)");
  grad.addColorStop(0.4, "rgba(255, 233, 171, 0.35)");
  grad.addColorStop(1, "rgba(255, 233, 171, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

// ---------- Inscrição de entrada, gravada na parede norte ----------
export function texturaInscricao(THREE) {
  const { c, ctx } = canvas2d(1600, 500);
  ctx.textAlign = "center";

  ctx.font = "600 118px Georgia, 'Times New Roman', serif";
  const gradTexto = ctx.createLinearGradient(0, 120, 0, 240);
  gradTexto.addColorStop(0, "#f3dca0");
  gradTexto.addColorStop(1, "#b8914a");
  ctx.fillStyle = gradTexto;
  ctx.fillText("GALERIA MARCOS DAVID", 800, 230);

  ctx.font = "italic 42px Georgia, 'Times New Roman', serif";
  ctx.fillStyle = "rgba(220, 187, 121, 0.85)";
  ctx.fillText("Arte, conhecimento e trajetória", 800, 320);

  ctx.strokeStyle = "rgba(220, 187, 121, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(560, 350);
  ctx.lineTo(1040, 350);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- Placa "em preparação" para as pinturas ainda não implementadas ----------
export function texturaEmPreparacao(THREE, { artista, titulo, tema }) {
  const { c, ctx } = canvas2d(900, 700);

  ctx.fillStyle = "#0c1830";
  ctx.fillRect(0, 0, 900, 700);
  ctx.strokeStyle = "rgba(220, 187, 121, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 840, 640);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(220, 187, 121, 0.8)";
  ctx.font = "italic 34px Georgia, serif";
  ctx.fillText("Exposição em preparação", 450, 300);

  ctx.font = "600 44px Georgia, serif";
  ctx.fillStyle = "#e3c077";
  ctx.fillText(titulo, 450, 380);

  ctx.font = "26px Georgia, serif";
  ctx.fillStyle = "rgba(241, 236, 224, 0.75)";
  ctx.fillText(artista, 450, 425);

  ctx.font = "22px 'Public Sans', sans-serif";
  ctx.fillStyle = "rgba(183, 192, 204, 0.8)";
  ctx.fillText(tema, 450, 470);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
