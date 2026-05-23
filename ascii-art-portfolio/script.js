const sakuraAscii = document.querySelector('#sakura-ascii');
const gardenAscii = document.querySelector('#garden-ascii');
const waveAscii = document.querySelector('#wave-ascii');
const river = document.querySelector('.river');
const riverTrack = document.querySelector('.river-track');
const navLinks = [...document.querySelectorAll('nav a')];
const petalsCanvas = document.querySelector('#petals');
const petalsContext = petalsCanvas.getContext('2d');
const messageForm = document.querySelector('#message-form');
const themeToggle = document.querySelector('#theme-toggle');
const motionToggle = document.querySelector('#motion-toggle');

let frame = 0;
let petals = [];
let motionPaused = localStorage.getItem('motion-preference') === 'paused';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function glyph(value) {
  const palette = '  ..::--==++**##';
  return palette[Math.max(0, Math.min(palette.length - 1, Math.floor(value * palette.length)))];
}

function paint(char, className) {
  if (char === ' ') return ' ';
  return `<span class="${className}">${char}</span>`;
}

function renderSakura() {
  const width = window.innerWidth < 760 ? 64 : 92;
  const height = window.innerWidth < 760 ? 36 : 46;
  const lines = [];

  for (let y = 0; y < height; y += 1) {
    let line = '';
    for (let x = 0; x < width; x += 1) {
      const nx = x / width;
      const ny = y / height;
      const trunkCenter = width * (0.52 + Math.sin(y * 0.15) * 0.018);
      const trunkWidth = 1.1 + Math.max(0, (y - height * 0.58) / height) * 4.7;
      const trunk = Math.abs(x - trunkCenter) < trunkWidth && y > height * 0.34;
      const rootLeft = y > height * 0.82 && Math.abs(y - (height * 0.92 + (x - width * 0.48) * 0.18)) < 1 && x < width * 0.52 && x > width * 0.25;
      const rootRight = y > height * 0.82 && Math.abs(y - (height * 0.91 - (x - width * 0.53) * 0.14)) < 1 && x > width * 0.52 && x < width * 0.78;
      const branchRight = Math.abs(y - (height * 0.57 - (x - width * 0.52) * 0.22 + Math.sin(x * 0.18) * 0.8)) < 0.9 && x > width * 0.5 && x < width * 0.88;
      const branchLeft = Math.abs(y - (height * 0.55 + (x - width * 0.52) * 0.3 + Math.sin(x * 0.16) * 0.8)) < 0.9 && x > width * 0.12 && x < width * 0.54;
      const branchHigh = Math.abs(y - (height * 0.42 - (x - width * 0.5) * 0.08 + Math.sin(x * 0.22) * 0.7)) < 0.75 && x > width * 0.31 && x < width * 0.7;

      const crownMain = Math.exp(-((nx - 0.5) ** 2 / 0.078 + (ny - 0.31) ** 2 / 0.04));
      const crownLeft = Math.exp(-((nx - 0.29) ** 2 / 0.028 + (ny - 0.42) ** 2 / 0.03));
      const crownRight = Math.exp(-((nx - 0.73) ** 2 / 0.034 + (ny - 0.43) ** 2 / 0.03));
      const crownTop = Math.exp(-((nx - 0.54) ** 2 / 0.043 + (ny - 0.18) ** 2 / 0.02));
      const crownLow = Math.exp(-((nx - 0.49) ** 2 / 0.065 + (ny - 0.52) ** 2 / 0.022));
      const crown = crownMain + crownLeft * 0.95 + crownRight * 0.9 + crownTop * 0.8;
      const shadowCrown = crownLow * 0.7;
      const texture = Math.sin(x * 1.17 + y * 0.41) + Math.cos(x * 0.27 - y * 0.92);

      if (trunk || rootLeft || rootRight || branchRight || branchLeft || branchHigh) {
        const chars = trunk ? ['|', 'I', '/', '\\', 'Y'] : ['/', '\\', '-', '_'];
        let className = 'bark';
        if (trunk && Math.abs(x - trunkCenter) < 0.65) className = 'dark-bark';
        if (!trunk && (x + y) % 5 === 0) className = 'bark-light';
        line += paint(chars[(x + y) % chars.length], className);
      } else if (crown + shadowCrown + texture * 0.055 > 0.34) {
        const value = crown + shadowCrown + texture * 0.08;
        const seed = (x * 7 + y * 11) % 37;
        if (seed === 0 || seed === 19) line += paint('+', seed === 0 ? 'leaf' : 'leaf-light');
        else if (value > 1.12) line += paint('@', 'petal-deep');
        else if (value > 0.9) line += paint('o', 'petal');
        else if (value > 0.63) line += paint('*', seed % 3 === 0 ? 'petal-deep' : 'petal');
        else if (value > 0.45) line += paint(':', 'petal-light');
        else line += paint('.', 'petal-mist');
      } else {
        line += ' ';
      }
    }
    lines.push(line);
  }

  sakuraAscii.innerHTML = lines.join('\n');
}

function renderGarden() {
  if (!gardenAscii) return;
  const width = window.innerWidth < 760 ? 84 : 122;
  const height = window.innerWidth < 760 ? 30 : 42;
  const t = frame * 0.025;
  const lines = [];

  for (let y = 0; y < height; y += 1) {
    let line = '';
    for (let x = 0; x < width; x += 1) {
      const center = width * 0.5;
      const horizon = height * 0.58 + Math.sin(x * 0.09) * 0.9;
      const cloudA = Math.abs(y - (height * 0.14 + Math.sin((x + t * 12) * 0.08))) < 0.8
        && ((x + Math.floor(t * 22)) % width) > width * 0.06
        && ((x + Math.floor(t * 22)) % width) < width * 0.31;
      const cloudB = Math.abs(y - (height * 0.22 + Math.sin((x - t * 9) * 0.08))) < 0.7
        && ((x + width - Math.floor(t * 16)) % width) > width * 0.62
        && ((x + width - Math.floor(t * 16)) % width) < width * 0.91;
      const moon = Math.hypot(x - width * 0.84, y - height * 0.13) < 2.2;

      const roofY = Math.round(height * 0.34);
      const beamY = roofY + 2;
      const lintelY = roofY + 4;
      const leftPost = center - 13;
      const rightPost = center + 13;
      const gateRoof = y === roofY && x > center - 23 && x < center + 23;
      const roofLip = y === roofY + 1 && x > center - 20 && x < center + 20;
      const beam = y === beamY && x > center - 18 && x < center + 18;
      const lintel = y === lintelY && x > center - 15 && x < center + 15;
      const gateLeft = Math.abs(x - leftPost) < 0.8 && y > beamY && y < height * 0.76;
      const gateRight = Math.abs(x - rightPost) < 0.8 && y > beamY && y < height * 0.76;
      const baseLeft = y === Math.round(height * 0.76) && x > leftPost - 4 && x < leftPost + 4;
      const baseRight = y === Math.round(height * 0.76) && x > rightPost - 4 && x < rightPost + 4;

      const path = y > horizon && Math.abs(x - center) < (y - horizon) * 1.25 + 2;
      const grass = y > horizon && !path && (x + y + Math.floor(t * 3)) % 5 < 2;
      const flower = y > horizon + 1 && !path && Math.sin(x * 0.7 + y * 1.4 + t * 2) > 0.93;

      if (cloudA || cloudB) line += paint('~', 'cloud');
      else if (moon) line += paint('o', 'sky');
      else if (gateRoof) line += paint('=', 'roof');
      else if (roofLip) line += paint('-', 'gate-dark');
      else if (beam) line += paint('=', 'gate');
      else if (lintel) line += paint('-', 'gate-light');
      else if (gateLeft || gateRight) line += paint(y % 2 ? '|' : 'I', 'gate');
      else if (baseLeft || baseRight) line += paint('_', 'gate-dark');
      else if (path) line += paint(['.', ':', ',', ';'][(x + y) % 4], 'stone');
      else if (flower) line += paint('*', 'flower');
      else if (grass) line += paint(['"', '\'', '.'][(x + y) % 3], 'grass');
      else if (Math.abs(y - horizon) < 0.6) line += paint('_', 'grass');
      else line += ' ';
    }
    lines.push(line);
  }

  gardenAscii.innerHTML = lines.join('\n');
}

function renderWave() {
  if (!waveAscii) return;
  const width = window.innerWidth < 760 ? 92 : 132;
  const height = window.innerWidth < 760 ? 28 : 42;
  const t = frame * 0.026;
  const lines = [];

  for (let y = 0; y < height; y += 1) {
    let line = '';
    for (let x = 0; x < width; x += 1) {
      const swell = height * 0.28 + Math.sin(x * 0.12 + t) * 5.5 + Math.cos(x * 0.055 - t) * 6.8;
      const foam = Math.abs(y - swell);
      const deep = y > swell;
      const shore = y > height * 0.73 + Math.sin(x * 0.08) * 1.4;
      if (foam < 0.55) line += paint('~', 'crest');
      else if (shore) line += paint(['.', ':', '-'][(x + y) % 3], 'sand');
      else if (deep) {
        const depth = (y - swell) / (height * 0.5);
        const char = glyph(depth);
        const className = depth > 0.62 ? 'water-deep' : depth > 0.32 ? 'water' : 'water-light';
        line += paint(char, className);
      } else {
        line += ' ';
      }
    }
    lines.push(line);
  }

  waveAscii.innerHTML = lines.join('\n');
}

function resizePetals() {
  const ratio = window.devicePixelRatio || 1;
  petalsCanvas.width = window.innerWidth * ratio;
  petalsCanvas.height = window.innerHeight * ratio;
  petalsCanvas.style.width = `${window.innerWidth}px`;
  petalsCanvas.style.height = `${window.innerHeight}px`;
  petalsContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = window.innerWidth < 760 ? 18 : 34;
  petals = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 3 + Math.random() * 5,
    drift: 0.25 + Math.random() * 0.45,
    speed: 0.055 + Math.random() * 0.12,
    phase: index * 0.8
  }));
}

function drawPetals() {
  petalsContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  petalsContext.fillStyle = 'rgba(198, 116, 132, 0.26)';

  petals.forEach(petal => {
    petal.y += petal.speed;
    petal.x += Math.sin(frame * 0.018 + petal.phase) * petal.drift;

    if (petal.y > window.innerHeight + 12) {
      petal.y = -12;
      petal.x = Math.random() * window.innerWidth;
    }

    petalsContext.save();
    petalsContext.translate(petal.x, petal.y);
    petalsContext.rotate(Math.sin(frame * 0.02 + petal.phase) * 0.9);
    petalsContext.beginPath();
    petalsContext.ellipse(0, 0, petal.size * 0.6, petal.size, 0, 0, Math.PI * 2);
    petalsContext.fill();
    petalsContext.restore();
  });
}

function updateRiver() {
  if (!riverTrack) return;

  riverTrack.style.setProperty('--track-x', '0px');
  const activePanel = [...riverTrack.children].find(panel => {
    const rect = panel.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45;
  });

  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${activePanel?.id}`));
}

function initNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.toggle('active', item === link));
    });
  });
}

function initMessageForm() {
  if (!messageForm) return;
  messageForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(messageForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const message = data.get('message') || '';
    const body = [
      `Nombre: ${name}`,
      `Correo: ${email}`,
      '',
      String(message)
    ].join('\n');
    window.location.href = `mailto:francuban1278@gmail.com?subject=${encodeURIComponent('Mensaje desde portfolio')}&body=${encodeURIComponent(body)}`;
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme-preference', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Dia' : 'Noche';
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}

function initControls() {
  const savedTheme = localStorage.getItem('theme-preference');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  document.body.classList.toggle('motion-paused', motionPaused || reduceMotion);
  if (motionToggle) {
    motionToggle.textContent = motionPaused || reduceMotion ? 'Reanudar' : 'Pausar';
    motionToggle.setAttribute('aria-pressed', String(motionPaused || reduceMotion));
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const update = () => applyTheme(nextTheme);
    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  });

  motionToggle?.addEventListener('click', () => {
    motionPaused = !motionPaused;
    localStorage.setItem('motion-preference', motionPaused ? 'paused' : 'running');
    document.body.classList.toggle('motion-paused', motionPaused);
    motionToggle.textContent = motionPaused ? 'Reanudar' : 'Pausar';
    motionToggle.setAttribute('aria-pressed', String(motionPaused));
  });
}

function tick() {
  if (!reduceMotion && !motionPaused) {
    frame += 1;
    if (frame % 8 === 0) renderGarden();
    if (frame % 5 === 0) renderWave();
    drawPetals();
  }

  requestAnimationFrame(tick);
}

window.addEventListener('scroll', updateRiver, { passive: true });
window.addEventListener('resize', () => {
  resizePetals();
  renderSakura();
  renderGarden();
  renderWave();
  updateRiver();
});

resizePetals();
renderSakura();
renderGarden();
renderWave();
initNavigation();
initMessageForm();
initControls();
updateRiver();
tick();
