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
let rainParticles = [];
let ripples = [];
let splashes = [];
let motionPaused = localStorage.getItem('motion-preference') === 'paused';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let gardenVisible = false;
let waveVisible = false;

if ('IntersectionObserver' in window) {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'garden-ascii') {
        gardenVisible = entry.isIntersecting;
      } else if (entry.target.id === 'wave-ascii') {
        waveVisible = entry.isIntersecting;
      }
    });
  }, observerOptions);

  if (gardenAscii) observer.observe(gardenAscii);
  if (waveAscii) observer.observe(waveAscii);
} else {
  gardenVisible = true;
  waveVisible = true;
}

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
  const width = window.innerWidth < 760 ? 84 : 140;
  const height = window.innerWidth < 760 ? 32 : 44;
  const t = frame * 0.045;
  const lines = [];

  const maxRain = window.innerWidth < 760 ? 32 : 72;
  if (rainParticles.length !== maxRain) {
    rainParticles = [];
    for (let i = 0; i < maxRain; i++) {
      rainParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.4 + Math.random() * 1.6,
        wind: -0.3 - Math.random() * 0.5
      });
    }
  }

  const horizon = Math.floor(height * 0.72);
  const buffer = Array.from({ length: height }, () => Array.from({ length: width }, () => ({ char: ' ', class: 'sky' })));

  // 1. Pintar Cielo, Estrellas y Nubes
  const isDark = document.documentElement.dataset.theme === 'dark';
  for (let y = 0; y < horizon; y++) {
    for (let x = 0; x < width; x++) {
      buffer[y][x] = { char: ' ', class: 'sky' };
      if (isDark) {
        const starSeed = (x * 17 + y * 23) % 199;
        if (starSeed === 0) {
          buffer[y][x] = { char: '.', class: 'sky' };
        } else if (starSeed === 99 && Math.sin(t + x) > 0.8) {
          buffer[y][x] = { char: '*', class: 'sky' };
        }
      }

      const targetX = Math.floor(width * 0.76);
      const targetY = Math.floor(height * 0.16);
      const distToLight = Math.hypot(x - targetX, y - targetY);
      if (distToLight < 2.5) {
        buffer[y][x] = { char: isDark ? 'o' : 'O', class: isDark ? 'sky' : 'flower' };
      } else if (distToLight < 4.8 && isDark) {
        if ((x + y) % 2 === 0) buffer[y][x] = { char: '.', class: 'cloud' };
      }

      const cloudY1 = Math.floor(height * 0.12);
      const cloudY2 = Math.floor(height * 0.22);
      const cloudA = Math.abs(y - (cloudY1 + Math.sin((x + t * 4) * 0.08))) < 0.8
        && ((x + Math.floor(t * 8)) % width) < width * 0.28;
      const cloudB = Math.abs(y - (cloudY2 + Math.sin((x - t * 3) * 0.07))) < 0.8
        && ((x + width - Math.floor(t * 6)) % width) > width * 0.6
        && ((x + width - Math.floor(t * 6)) % width) < width * 0.88;

      if (cloudA || cloudB) {
        buffer[y][x] = { char: '~', class: 'cloud' };
      }
    }
  }

  // 2. Montañas al fondo
  for (let y = 0; y < horizon; y++) {
    for (let x = 0; x < width; x++) {
      const mHeight = horizon - Math.round(7 + Math.sin((x - width * 0.5) * 0.05) * 6 + Math.cos(x * 0.03) * 3);
      if (x > width * 0.34 && y >= mHeight) {
        const chars = ['.', ':', '"', '`'];
        buffer[y][x] = { char: chars[(x + y) % chars.length], class: 'grass' };
      }
    }
  }

  // 3. Pintar Pagoda
  const PAGODA = [
    "               ||               ",
    "               *                ",
    "              (O)               ",
    "               |                ",
    "              _|_               ",
    "             (   )              ",
    "             |___|              ",
    "            /_____\             ",
    "            |  o  |             ",
    "         .-'======='-.          ",
    "         |  [] []  |          ",
    "       .-'========='-.          ",
    "       |   _   _   |          ",
    "     .-'==========='-.          ",
    "     |   []  [] []   |          ",
    "   .-'============='-.          ",
    "   |    _  _  _  _   |          ",
    " .-'==============='-.          ",
    " |   []  []  [] []   |          ",
    ".-'================='-.         ",
    "|   _  _  _  _  _  _  |         ",
    "|  [I]  [I]  [I]  [I]  |         ",
    "=======================         "
  ];

  const pagodaX = Math.floor(width * 0.22);
  const pagodaYStart = horizon - PAGODA.length;
  for (let py = 0; py < PAGODA.length; py++) {
    const row = PAGODA[py];
    const y = pagodaYStart + py;
    if (y < 0 || y >= horizon) continue;
    for (let px = 0; px < row.length; px++) {
      const char = row[px];
      if (char === ' ') continue;
      const x = pagodaX - 16 + px;
      if (x < 0 || x >= width) continue;

      let className = 'roof';
      if (char === '|' || char === '_' || char === '(' || char === ')' || char === '/' || char === '\\') {
        className = 'gate';
      }
      if (char === '[' || char === ']' || char === 'I') {
        className = 'gate-light';
      }
      if (char === '*' || char === 'O' || char === 'o') {
        className = 'flower';
      }
      if (char === '=') {
        className = 'roof';
      }
      buffer[y][x] = { char: char, class: className };
    }
  }

  // 4. Suelo a la derecha
  for (let y = horizon; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x >= width * 0.75) {
        if (y === horizon) {
          buffer[y][x] = { char: '=', class: 'stone' };
          continue;
        }
        const distToPath = Math.abs(x - width * 0.86);
        if (distToPath < (y - horizon) * 0.6 + 2.5) {
          buffer[y][x] = { char: ['.', ':', 'o'][(x + y) % 3], class: 'stone' };
        } else {
          buffer[y][x] = { char: ['"', '\'', '.'][(x + y) % 3], class: 'grass' };
        }
      }
    }
  }

  // 5. Estanque con reflejo deformado
  for (let y = horizon; y < height; y++) {
    for (let x = 0; x < width * 0.75; x++) {
      if (y === horizon) {
        buffer[y][x] = { char: '=', class: 'stone' };
        continue;
      }

      const ySrc = horizon - 1 - (y - horizon);
      let cellReflected = null;
      if (ySrc >= 0) {
        const dx = Math.round(Math.sin(y * 0.6 + t * 6) * 1.8 + Math.cos(x * 0.25 - t * 4) * 0.8);
        const xSrc = Math.max(0, Math.min(width - 1, x + dx));
        cellReflected = buffer[ySrc][xSrc];
      }

      if (cellReflected && cellReflected.char !== ' ' && cellReflected.class !== 'sky') {
        let reflectedChar = cellReflected.char;
        if (reflectedChar === '=' || reflectedChar === '#' || reflectedChar === '|') {
          reflectedChar = '~';
        }
        buffer[y][x] = { char: reflectedChar, class: 'water-deep' };
      } else {
        const isWave = Math.sin(x * 0.4 - y * 0.2 + t * 3) > 0.8;
        buffer[y][x] = isWave 
          ? { char: '~', class: 'water' } 
          : { char: '=', class: 'water-light' };
      }
    }
  }

  // 6. Actualizar y procesar lluvia, salpicaduras y ripples
  splashes.forEach(s => s.age += 1);
  splashes = splashes.filter(s => s.age < 3);

  ripples.forEach(rp => {
    rp.r += 0.7;
    rp.age += 1;
  });
  ripples = ripples.filter(rp => rp.age < 12);

  if (!reduceMotion && !motionPaused) {
    rainParticles.forEach(p => {
      p.y += p.speed;
      p.x += p.wind;

      const rx = Math.floor(p.x);
      const ry = Math.floor(p.y);

      if (ry >= horizon) {
        if (rx >= 0 && rx < width) {
          if (rx < width * 0.75) {
            if (Math.random() < 0.18) {
              ripples.push({
                x: rx,
                y: horizon + Math.floor(Math.random() * (height - horizon - 1)) + 1,
                r: 0.5,
                age: 0
              });
            }
          } else {
            if (Math.random() < 0.25) {
              splashes.push({ x: rx, y: horizon - 1, age: 0 });
            }
          }
        }
        p.y = 0;
        p.x = Math.random() * width;
      } else if (ry >= 0 && rx >= 0 && rx < width) {
        const cell = buffer[ry][rx];
        if (cell && cell.char !== ' ' && cell.class !== 'sky' && cell.class !== 'cloud') {
          splashes.push({ x: rx, y: ry - 1, age: 0 });
          p.y = 0;
          p.x = Math.random() * width;
        }
      }
    });
  }

  // Pintar lluvia en el buffer
  rainParticles.forEach(p => {
    const rx = Math.floor(p.x);
    const ry = Math.floor(p.y);
    if (rx >= 0 && rx < width && ry >= 0 && ry < height) {
      const cell = buffer[ry][rx];
      if (cell && (cell.char === ' ' || cell.class === 'sky' || cell.class === 'cloud')) {
        buffer[ry][rx] = { char: '/', class: 'sky' };
      }
    }
  });

  // Pintar salpicaduras en el buffer
  splashes.forEach(s => {
    if (s.x >= 0 && s.x < width && s.y >= 0 && s.y < height) {
      const chars = ['.', 'v', '*'];
      const char = chars[Math.min(s.age, chars.length - 1)];
      buffer[s.y][s.x] = { char: char, class: 'sky' };
    }
  });

  // Pintar ripples en el estanque
  for (let y = horizon + 1; y < height; y++) {
    for (let x = 0; x < width * 0.75; x++) {
      ripples.forEach(rp => {
        const dist = Math.hypot(x - rp.x, y - rp.y);
        if (Math.abs(dist - rp.r) < 0.8) {
          const intensity = 1 - (rp.age / 12);
          if (intensity > 0.15) {
            buffer[y][x] = { char: '°', class: 'crest' };
          }
        }
      });
    }
  }

  // Generar string final
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const cell = buffer[y][x];
      line += paint(cell.char, cell.class);
    }
    lines.push(line);
  }

  gardenAscii.innerHTML = lines.join('\n');
}

function renderWave() {
  if (!waveAscii) return;
  const width = window.innerWidth < 760 ? 90 : 150;
  const height = window.innerWidth < 760 ? 30 : 45;
  const t = frame * 0.045;
  const lines = [];

  const buffer = Array.from({ length: height }, () => Array.from({ length: width }, () => ({ char: ' ', class: '' })));

  const fov = 75;
  const centerX = width / 2;
  const centerY = height / 2;

  // 1. Balanceo de cámara ultra suave y lento para evitar vibración caótica del lienzo
  const cameraRoll = Math.sin(t * 0.2) * 0.4;
  const cameraPitch = Math.cos(t * 0.1) * 0.2;
  const currentCenterX = centerX + cameraRoll;
  const currentCenterY = centerY + cameraPitch;

  const zMax = 44;
  const zMin = 11;
  const zStep = window.innerWidth < 760 ? 0.95 : 0.65;
  const xStep = window.innerWidth < 760 ? 0.85 : 0.55;

  // Definición de coordenadas del faro
  const lightX = -18;
  const lightZ = 38;
  const yCliffBase = 3.5;
  const lightY = yCliffBase + 9;

  // Ángulo de giro de luz ralentizado majestuosamente (t * 0.12 en lugar de t * 0.8)
  const lightAngle3d = (t * 0.12) % (Math.PI * 2);

  // Proyección 2D de la linterna del faro en pantalla para el haz del cielo
  const lightScreenX = Math.floor(currentCenterX + (lightX * 1.62 * fov) / lightZ);
  const lightScreenY = Math.floor(currentCenterY - (lightY * fov) / lightZ + (lightZ * 0.74) - 9);

  // 2. Renderizar escena 3D (atrás hacia adelante - algoritmo del pintor)
  for (let z = zMax; z >= zMin; z -= zStep) {
    const xMax = 38;
    for (let x = -xMax; x <= xMax; x += xStep) {
      // 2.1. Comprobar si estamos en la zona del acantilado y el faro
      const isNearFaroX = x >= -23 && x <= -13;
      const isNearFaroZ = z >= 36 && z <= 42;

      if (isNearFaroX && isNearFaroZ) {
        const yCliff = yCliffBase + Math.sin(x * 0.3) * 0.8;
        const isTower = Math.abs(x - lightX) < 1.8 && Math.abs(z - lightZ) < 1.8;
        
        if (isTower) {
          for (let fy = 0; fy < 10; fy++) {
            const y3d = yCliff + fy * 0.9;
            const projX = Math.floor(currentCenterX + (x * 1.62 * fov) / z);
            const projY = Math.floor(currentCenterY - (y3d * fov) / z + (z * 0.74) - 9);
            
            if (projX >= 0 && projX < width && projY >= 0 && projY < height) {
              let char = '|';
              let className = 'stone';
              
              if (fy === 8 || fy === 9) {
                char = 'O';
                className = 'flower';
              } else if (fy === 0 || fy === 7) {
                char = '=';
                className = 'gate-dark';
              } else {
                char = (px => (px % 2 === 0 ? '#' : 'H'))(Math.round(x + fy));
                className = 'gate';
              }
              buffer[projY][projX] = { char: char, class: className };
            }
          }
        } else {
          const projX = Math.floor(currentCenterX + (x * 1.62 * fov) / z);
          const projY = Math.floor(currentCenterY - (yCliff * fov) / z + (z * 0.74) - 9);
          if (projX >= 0 && projX < width && projY >= 0 && projY < height) {
            buffer[projY][projX] = { char: ['[', ']', '#', '*'][(Math.round(x + z)) % 4], class: 'stone' };
          }
        }
        continue;
      }

      // 2.2. Simulación de olas normales (Gerstner suavizado y ralentizado drásticamente)
      const y1 = Math.sin(x * 0.18 + t * 0.6) * Math.cos(z * 0.14 - t * 0.4) * 1.4;
      const y2 = Math.sin(x * 0.08 - t * 0.3) * 0.7;
      const y3 = Math.cos((x * 0.06 + z * 0.1) + t * 0.2) * 0.8;
      let y = (y1 + y2 + y3) * 0.85;

      if (y > 0) {
        y = Math.pow(y, 1.18);
      }

      const projX = Math.floor(currentCenterX + (x * 1.62 * fov) / z);
      const projY = Math.floor(currentCenterY - (y * fov) / z + (z * 0.74) - 9);

      if (projX >= 0 && projX < width && projY >= 0 && projY < height) {
        // 2.3. Comprobar iluminación del haz de luz en 3D
        const dx3d = x - lightX;
        const dz3d = z - lightZ;
        const angle3d = Math.atan2(dz3d, dx3d);
        const diff3d = Math.abs((angle3d - lightAngle3d + Math.PI * 3) % (Math.PI * 2) - Math.PI);
        const isIlluminated = diff3d < 0.22 && dx3d > 0;

        let char = ' ';
        let className = 'water';

        if (isIlluminated) {
          if (y > 1.0) {
            char = '@';
            className = 'crest';
          } else if (y > 0.2) {
            char = '%';
            className = 'crest';
          } else {
            char = '#';
            className = 'water-light';
          }
        } else {
          if (y > 1.2) {
            char = '~';
            className = 'crest';
          } else if (y > 0.3) {
            char = '+';
            className = 'water-light';
          } else if (y > -0.5) {
            char = '=';
            className = 'water';
          } else {
            char = '.';
            className = 'water-deep';
          }
        }

        buffer[projY][projX] = { char: char, class: className };
      }
    }
  }

  // 3. Dibujar haz de luz en el aire (2D)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (buffer[y][x].char === ' ') {
        const dx = x - lightScreenX;
        const dy = y - lightScreenY;
        const dist = Math.hypot(dx, dy);

        if (dist > 2 && dist < width * 0.65) {
          const angle = Math.atan2(dy, dx);
          const diff = Math.abs((angle - lightAngle3d + Math.PI * 3) % (Math.PI * 2) - Math.PI);
          if (diff < 0.16 && dx > 0) {
            const chars = ['.', ':', '-', '~'];
            const densityIdx = Math.floor((1 - (diff / 0.16)) * chars.length);
            const char = chars[Math.max(0, Math.min(chars.length - 1, densityIdx))];
            buffer[y][x] = { char: char, class: 'sky' };
          }
        }
      }
    }
  }

  // 4. Dibujar la orilla de arena abajo
  for (let x = 0; x < width; x++) {
    const shoreY = height - 1 - Math.round(2.5 + Math.sin(x * 0.08 + t * 0.2) * 1.2);
    for (let y = shoreY; y < height; y++) {
      buffer[y][x] = { char: ['.', ':', '-'][(x + y) % 3], class: 'sand' };
    }
  }

  // 5. Renderizar a HTML
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const cell = buffer[y][x];
      line += paint(cell.char, cell.class);
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

  const formNote = messageForm.querySelector('.form-note');
  const submitButton = messageForm.querySelector('button[type="submit"]');

  if (window.emailjs) {
    window.emailjs.init('TQsonF9_ymrUuvag7');
  }

  messageForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!window.emailjs) {
      if (formNote) {
        formNote.textContent = 'Error: El modulo de correo no esta disponible.';
        formNote.style.color = '#b34d45';
      }
      return;
    }

    const data = new FormData(messageForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const message = data.get('message') || '';

    const params = {
      from_name: name,
      from_email: email,
      message: message
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
      }
      if (formNote) {
        formNote.textContent = 'Enviando mensaje...';
        formNote.style.color = 'var(--muted)';
      }

      await window.emailjs.send('service_zwlnbki', 'template_raefnko', params);

      if (formNote) {
        formNote.textContent = '¡Mensaje enviado con exito! Me pondre en contacto pronto.';
        formNote.style.color = 'var(--moss)';
      }
      messageForm.reset();
    } catch (err) {
      console.error('EmailJS Error:', err);
      if (formNote) {
        formNote.textContent = 'Error al enviar. Por favor, intentalo de nuevo.';
        formNote.style.color = '#b34d45';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar mensaje';
      }
    }
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
    if (frame % 8 === 0 && gardenVisible) renderGarden();
    if (frame % 5 === 0 && waveVisible) renderWave();
    drawPetals();
  }

  requestAnimationFrame(tick);
}

function initProjectModal() {
  const modal = document.querySelector('#hermnet-modal');
  const trigger = document.querySelector('#hermnet-trigger');
  const closeButton = document.querySelector('#close-modal');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const contactBtn = document.querySelector('#modal-contact-btn');
  let previousActiveElement = null;

  if (!modal || !trigger) return;

  function openModal(event) {
    if (event) event.preventDefault();
    previousActiveElement = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (closeButton) closeButton.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (previousActiveElement) previousActiveElement.focus();
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
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
initProjectModal();
updateRiver();
tick();
