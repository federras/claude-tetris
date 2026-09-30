'use strict';
// Tabla de records local + pantalla de inicio. Se carga DESPUÉS de game.js.

const RECORDS_KEY = 'tetris.records';
const TOP_N = 5;
const DEFAULT_NAME = 'Anónimo';

const startScreen = document.getElementById('start-screen');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-records-btn');
const startTopEl = document.getElementById('start-top');
const startStatsEl = document.getElementById('start-stats');
const goRecords = document.getElementById('go-records');
const goNameForm = document.getElementById('go-name-form');
const goNameInput = document.getElementById('go-name');
const goSaveBtn = document.getElementById('go-save-btn');
const goMsg = document.getElementById('go-msg');
const goTopEl = document.getElementById('go-top');
const goStatsEl = document.getElementById('go-stats');

let pendingScore = null; // partida terminada aún sin guardar

function emptyRecords() {
  return { top: [], bestCombo: 0, maxLines: 0 };
}

function loadRecords() {
  try {
    const data = JSON.parse(localStorage.getItem(RECORDS_KEY));
    if (!data || typeof data !== 'object') return emptyRecords();
    const top = Array.isArray(data.top)
      ? data.top.filter(t => t && Number.isFinite(t.score))
          .map(t => ({ ...t, name: String(t.name || DEFAULT_NAME).slice(0, 12) })).slice(0, TOP_N)
      : [];
    return {
      top,
      bestCombo: Number.isFinite(data.bestCombo) ? data.bestCombo : 0,
      maxLines: Number.isFinite(data.maxLines) ? data.maxLines : 0,
    };
  } catch (e) {
    return emptyRecords();
  }
}

function saveRecords(rec) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(rec));
  } catch (e) { /* sin almacenamiento: los records no persisten */ }
}

function qualifies(rec, s) {
  return s > 0 && (rec.top.length < TOP_N || s > rec.top[rec.top.length - 1].score);
}

function renderTop(listEl, rec, highlight) {
  listEl.textContent = '';
  if (!rec.top.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Sin records todavía';
    listEl.appendChild(li);
    return;
  }
  rec.top.forEach((t, i) => {
    const li = document.createElement('li');
    if (i === highlight) li.className = 'highlight';
    const n = document.createElement('span');
    n.className = 'rec-name';
    n.textContent = `${i + 1}. ${t.name}`;
    const s = document.createElement('span');
    s.className = 'rec-score';
    s.textContent = Number(t.score).toLocaleString();
    li.append(n, s);
    listEl.appendChild(li);
  });
}

function statsText(rec) {
  return `Mejor combo: ${rec.bestCombo} · Líneas máx: ${rec.maxLines}`;
}

function showStartScreen() {
  const rec = loadRecords();
  renderTop(startTopEl, rec, -1);
  startStatsEl.textContent = statsText(rec);
  startScreen.classList.remove('hidden');
  playBtn.focus();
}

function play() {
  startScreen.classList.add('hidden');
  goRecords.classList.add('hidden');
  pendingScore = null;
  init();
}

// Llamado desde endGame() en game.js
function onGameOver() {
  const rec = loadRecords();
  rec.bestCombo = Math.max(rec.bestCombo, maxCombo);
  rec.maxLines = Math.max(rec.maxLines, lines);
  saveRecords(rec);
  renderTop(goTopEl, rec, -1);
  goStatsEl.textContent = `${statsText(rec)} · Combo de la partida: ${maxCombo}`;
  goRecords.classList.remove('hidden');
  if (qualifies(rec, score)) {
    pendingScore = score;
    goMsg.textContent = '¡Entras al top 5! Escribe tu nombre';
    goNameInput.value = '';
    goNameForm.classList.remove('hidden');
    goNameInput.focus();
  } else {
    pendingScore = null;
    goMsg.textContent = '';
    goNameForm.classList.add('hidden');
  }
}

function submitName() {
  if (pendingScore === null) return;
  const name = goNameInput.value.trim().slice(0, 12) || DEFAULT_NAME;
  const rec = loadRecords();
  const entry = { name, score: pendingScore, date: new Date().toISOString() };
  // empate: la entrada nueva queda debajo de las existentes con igual puntuación
  let idx = rec.top.findIndex(t => t.score < entry.score);
  if (idx === -1) idx = rec.top.length;
  rec.top.splice(idx, 0, entry);
  rec.top = rec.top.slice(0, TOP_N);
  saveRecords(rec);
  pendingScore = null;
  goNameForm.classList.add('hidden');
  goMsg.textContent = idx < TOP_N ? '¡Record guardado!' : '';
  renderTop(goTopEl, rec, idx < TOP_N ? idx : -1);
}

playBtn.addEventListener('click', () => { playBtn.blur(); play(); });

resetBtn.addEventListener('click', () => {
  resetBtn.blur();
  if (!confirm('¿Borrar todos los records?')) return;
  try { localStorage.removeItem(RECORDS_KEY); } catch (e) { /* ignorar */ }
  showStartScreen();
});

goSaveBtn.addEventListener('click', () => { goSaveBtn.blur(); submitName(); });

goNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); submitName(); }
});

// Reiniciar sin guardar: se guarda con el nombre escrito (o "Anónimo")
restartBtn.addEventListener('click', () => {
  submitName();
  goRecords.classList.add('hidden');
  restartBtn.blur();
});

// Enter en la pantalla de inicio arranca (no es tecla de juego)
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !startScreen.classList.contains('hidden')) {
    e.preventDefault();
    play();
  }
});
