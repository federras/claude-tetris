'use strict';

// Skins visuales. Sin dependencias de game.js: todo llega por parámetro.
// draw(ctx, x, y, color, size). drawBlock (game.js) envuelve en save/restore
// y fija globalAlpha, así que aquí se puede tocar shadowBlur/alpha libremente.
const SKINS = {
  retro: {
    label: 'Retro',
    colors: [null, '#4dd0e1', '#ffd54f', '#ba68c8', '#81c784', '#e57373', '#ff6d00', '#7986cb', '#ff4081'],
    draw(ctx, x, y, color, size) {
      ctx.fillStyle = color;
      ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(x * size + 1, y * size + 1, size - 2, 4);
    },
  },
  neon: {
    label: 'Neon',
    colors: [null, '#00f0ff', '#ffee00', '#d500f9', '#39ff14', '#ff1744', '#ff9100', '#651fff', '#ff00aa'],
    draw(ctx, x, y, color, size) {
      const px = x * size + 3, py = y * size + 3, s = size - 6;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, s, s);
      ctx.globalAlpha *= 0.35;
      ctx.fillStyle = color;
      ctx.fillRect(px, py, s, s);
    },
  },
  pastel: {
    label: 'Pastel',
    colors: [null, '#a8e6ef', '#fff1b8', '#d9b8f0', '#b9e8bf', '#f7b9b9', '#ffcfa3', '#b8c2f0', '#ffb3d1'],
    draw(ctx, x, y, color, size) {
      const px = x * size + 1, py = y * size + 1, s = size - 2;
      const rr = (a, b, w, h, r) => {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(a, b, w, h, r); else ctx.rect(a, b, w, h);
        ctx.fill();
      };
      ctx.fillStyle = color;
      rr(px, py, s, s, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      rr(px + 4, py + 3, s - 8, 5, 3);
    },
  },
  pixel: {
    label: 'Pixel art',
    colors: [null, '#29b6f6', '#fdd835', '#8e24aa', '#43a047', '#e53935', '#fb8c00', '#3949ab', '#ec407a'],
    draw(ctx, x, y, color, size) {
      const px = x * size, py = y * size, u = size / 6; // rejilla 6x6 de "píxeles"
      ctx.fillStyle = color;
      ctx.fillRect(px, py, size, size);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; // luz arriba/izquierda
      ctx.fillRect(px, py, size, u);
      ctx.fillRect(px, py, u, size);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; // sombra abajo/derecha
      ctx.fillRect(px, py + size - u, size, u);
      ctx.fillRect(px + size - u, py, u, size);
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; // textura de damero
      for (let i = 1; i < 5; i++)
        for (let j = 1; j < 5; j++)
          if ((i + j) % 2) ctx.fillRect(px + i * u, py + j * u, u, u);
    },
  },
};
