'use strict';
// Menú de pausa. Depende de globales de game.js (startLevel, paused, init, togglePause).

const pauseMenu = document.getElementById('pause-menu');
const pauseMain = document.getElementById('pause-main');
const pauseControlsView = document.getElementById('pause-controls-view');
const startLevelSelect = document.getElementById('start-level');

for (let i = 1; i <= 10; i++) startLevelSelect.add(new Option(i, i));
startLevelSelect.value = startLevel;

function showPauseView(controls) {
  pauseMain.classList.toggle('hidden', controls);
  pauseControlsView.classList.toggle('hidden', !controls);
}

// Llamada desde togglePause() en game.js
function setPauseMenu(open) {
  pauseMenu.classList.toggle('hidden', !open);
  if (open) showPauseView(false);
}

function menuClick(id, fn) {
  document.getElementById(id).addEventListener('click', e => {
    fn();
    e.currentTarget.blur(); // evita que Espacio/flechas reactiven el botón
  });
}

menuClick('pause-resume', () => { if (paused) togglePause(); });
menuClick('pause-restart', () => init());
menuClick('pause-controls', () => showPauseView(true));
menuClick('pause-back', () => showPauseView(false));

startLevelSelect.addEventListener('change', () => {
  startLevel = Number(startLevelSelect.value);
  startLevelSelect.blur();
});
