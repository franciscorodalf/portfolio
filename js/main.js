const username = 'franciscorodalf';
const repoContainer = document.getElementById('repo-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('project-modal');
const ideasAccordion = document.querySelectorAll('.idea-card');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const bootScreen = document.getElementById('boot-screen');
const typedCursor = document.getElementById('typed-cursor');

const EMAILJS_SERVICE_ID = window.EMAILJS_SERVICE_ID || 'service_88ms1x4';
const EMAILJS_TEMPLATE_ID = window.EMAILJS_TEMPLATE_ID || 'template_raefnko';
const EMAILJS_PUBLIC_KEY = window.EMAILJS_PUBLIC_KEY || 'TQsonF9_ymrUuvag7';

const FEATURED_REPOS = {
  safeinvestor: {
    weight: 100,
    type: 'apps',
    description: 'App en Java para gestionar ingresos y gastos de forma sencilla y eficiente.'
  },
  'juego-ahorcado': {
    weight: 90,
    type: 'games',
    description: 'Versión clásica del ahorcado desarrollada en Java con enfoque didáctico.'
  },
  sabelotodo: {
    weight: 85,
    type: 'games',
    description: 'Quiz interactivo inspirado en Preguntados con preguntas personalizadas.'
  },
  powermine: {
    weight: 80,
    type: 'games',
    description: 'Reimaginación del Buscaminas con poderes especiales y HUD retro.'
  },
  'tic-tac-toe': {
    weight: 75,
    type: 'games',
    description: 'Tres en raya como app móvil con modos competitivos.'
  },
  kalku: {
    weight: 70,
    type: 'apps',
    description: 'Calculadora creada en React orientada a dispositivos móviles.'
  }
};

const projectsState = {
  full: [],
  activeFilter: 'all'
};

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initTyped();
  initTheme();
  initCRTGlitch();
  initIdeasAccordion();
  initContactForm();
  initModal();
  initProjectFilters();
  hydrateProjects();
  initAOS();
});

function initBootSequence() {
  if (!bootScreen) return;
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    setTimeout(() => bootScreen.remove(), 600);
  }, 2200);
}

function initTyped() {
  if (window.Typed) {
    typedCursor?.classList.add('active');
    new window.Typed('#typed-text', {
      strings: ['👋 ¡Hola! Soy Francisco Yariel', 'Desarrollador Multiplataforma en formación'],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 2200,
      loop: true,
      showCursor: false,
      smartBackspace: true
    });
  }
}

function initTheme() {
  if (!themeToggle) return;

  const storedTheme = localStorage.getItem('theme-preference');
  if (storedTheme) {
    document.body.classList.toggle('theme-light', storedTheme === 'light');
    document.body.classList.toggle('theme-dark', storedTheme !== 'light');
  } else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    document.body.classList.toggle('theme-light', prefersLight);
    document.body.classList.toggle('theme-dark', !prefersLight);
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    document.body.classList.toggle('theme-dark', !isLight);
    localStorage.setItem('theme-preference', isLight ? 'light' : 'dark');
  });
}

function initCRTGlitch() {
  setInterval(() => {
    document.body.classList.add('glitch');
    setTimeout(() => document.body.classList.remove('glitch'), 550);
  }, 10000);
}

function initIdeasAccordion() {
  ideasAccordion.forEach(card => {
    const toggle = card.querySelector('.idea-toggle');
    const content = card.querySelector('.idea-content');
    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isOpen = card.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0';
    });
  });
}

function initContactForm() {
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.querySelector('.btn-text')?.textContent || 'Enviar mensaje';

  const emailjsInstance = globalThis.emailjs || globalThis.EmailJS || globalThis.window?.emailjs;
  const missingCreds = [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY].some(value => !value || value.startsWith('your_'));

  if (!emailjsInstance) {
    console.error('EmailJS SDK no encontrado. Asegúrate de cargar @emailjs/browser antes del script principal.');
    updateContactStatus('> error: EmailJS no inicializado ⚠️');
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      updateContactStatus('> error: EmailJS no inicializado ⚠️');
    });
    return;
  }

  if (missingCreds) {
    console.error('Credenciales de EmailJS incompletas. Revisa SERVICE_ID, TEMPLATE_ID y PUBLIC_KEY.');
    updateContactStatus('> error: credenciales EmailJS incompletas ⚠️');
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      updateContactStatus('> error: credenciales EmailJS incompletas ⚠️');
    });
    return;
  }

  try {
    emailjsInstance.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (error) {
    console.error('EmailJS init failed:', error);
    updateContactStatus('> error: EmailJS init falló ⚠️');
    return;
  }

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const params = Object.fromEntries(formData.entries());

    updateContactStatus('> sending message...');
    setSubmitting(true);

    try {
      await emailjsInstance.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      updateContactStatus('> message sent ✅');
      contactForm.reset();
    } catch (error) {
      console.error('EmailJS send error:', error);
      updateContactStatus('> error: intenta de nuevo ⚠️');
    } finally {
      setSubmitting(false);
    }
  });

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    if (submitButton.querySelector('.btn-text')) {
      submitButton.querySelector('.btn-text').textContent = isSubmitting ? 'Enviando...' : submitLabel;
    } else {
      submitButton.textContent = isSubmitting ? 'Enviando...' : submitLabel;
    }
  }

}

function updateContactStatus(text) {
  if (!contactStatus) return;
  contactStatus.textContent = text;
}

function initModal() {
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  const closeModal = () => modal.classList.add('hidden');

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function openModal(repo) {
  if (!modal) return;
  modal.classList.remove('hidden');

  modal.querySelector('#modal-title').textContent = repo.name;
  modal.querySelector('#modal-description').textContent = repo.description || 'Proyecto sin descripción.';
  modal.querySelector('#modal-stars').textContent = `★ ${repo.stars}`;

  const meta = modal.querySelector('#modal-meta');
  meta.innerHTML = '';
  const details = [
    `Lenguaje: ${repo.language || 'N/A'}`,
    `Actualizado: ${formatDate(repo.updatedAt)}`,
    `Tipo: ${formatType(repo.type)}`
  ];

  if (repo.topics?.length) {
    details.push(`Topics: ${repo.topics.slice(0, 4).join(', ')}`);
  }

  details.forEach(info => {
    const span = document.createElement('span');
    span.textContent = info;
    meta.appendChild(span);
  });

  const repoLink = modal.querySelector('#modal-repo-link');
  repoLink.href = repo.htmlUrl;

  const demoLink = modal.querySelector('#modal-demo-link');
  if (repo.homepage) {
    demoLink.href = repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`;
    demoLink.classList.remove('hidden');
  } else {
    demoLink.classList.add('hidden');
  }
}

function initProjectFilters() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      projectsState.activeFilter = filter;
      filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      renderProjectCards();
    });
  });
}

async function hydrateProjects() {
  if (!repoContainer) return;
  repoContainer.setAttribute('data-state', 'loading');
  repoContainer.textContent = 'Cargando proyectos...';

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    projectsState.full = repos
      .filter(repo => !repo.fork && repo.description)
      .map(mapRepo)
      .sort((a, b) => (b.weight - a.weight) || (b.stars - a.stars))
      .slice(0, 9);

    renderProjectCards();
  } catch (error) {
    console.error(error);
    repoContainer.textContent = 'No se pudieron cargar los proyectos 😢';
  }
}

function renderProjectCards() {
  if (!repoContainer) return;

  const repos = getFilteredRepos();

  repoContainer.innerHTML = '';
  repoContainer.removeAttribute('data-state');

  if (!repos.length) {
    repoContainer.textContent = 'Nada por aquí aún. Vuelve pronto.';
    return;
  }

  repos.forEach(repo => {
    const card = createRepoCard(repo);
    repoContainer.appendChild(card);
  });
}

function getFilteredRepos() {
  if (projectsState.activeFilter === 'all') {
    return projectsState.full;
  }
  return projectsState.full.filter(repo => repo.type === projectsState.activeFilter);
}

function mapRepo(repo) {
  const type = inferType(repo);
  const key = repo.name.toLowerCase();
  const featured = FEATURED_REPOS[key];
  return {
    id: repo.id,
    name: repo.name.replace(/-/g, '_'),
    description: featured?.description || repo.description,
    language: repo.language,
    htmlUrl: repo.html_url,
    homepage: featured?.homepage || repo.homepage,
    stars: repo.stargazers_count,
    updatedAt: repo.pushed_at || repo.updated_at,
    topics: repo.topics || [],
    type: featured?.type || type,
    color: getColorByLanguage(repo.language),
    watchers: repo.watchers_count,
    forks: repo.forks_count,
    weight: featured?.weight || 0
  };
}

function createRepoCard(repo) {
  const card = document.createElement('article');
  card.className = 'repo-card';
  card.dataset.type = repo.type;

  const thumb = document.createElement('div');
  thumb.className = 'repo-thumb';
  thumb.style.background = `linear-gradient(135deg, ${repo.color}, rgba(6, 12, 18, 0.85))`;
  thumb.innerHTML = `<span>${repo.language || 'multi'}</span>`;

  const content = document.createElement('div');
  content.className = 'repo-content';

  const title = document.createElement('h3');
  title.textContent = repo.name;

  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = repo.description;

  const meta = document.createElement('div');
  meta.className = 'repo-meta';
  meta.innerHTML = `
    <span>★ ${repo.stars}</span>
    <span>⌛ ${formatDate(repo.updatedAt)}</span>
    <span>⚙ ${formatType(repo.type)}</span>
  `;

  const actions = document.createElement('div');
  actions.className = 'repo-actions';
  actions.innerHTML = `
    <button class="open-modal" type="button">Detalle</button>
    <a class="btn ghost" href="${repo.htmlUrl}" target="_blank" rel="noopener">GitHub</a>
  `;

  const modalBtn = actions.querySelector('.open-modal');
  modalBtn.addEventListener('click', () => openModal(repo));

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(meta);
  content.appendChild(actions);

  card.appendChild(thumb);
  card.appendChild(content);
  return card;
}

function formatDate(date) {
  if (!date) return 'N/A';
  const formatter = new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return formatter.format(new Date(date));
}

function formatType(type) {
  const map = {
    apps: 'Apps',
    games: 'Juegos',
    tools: 'Utilidades',
    other: 'Otros'
  };
  return map[type] || 'Otros';
}

function inferType(repo) {
  const source = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  if (includesAny(source, ['game', 'juego', 'unity', '2d', '3d', 'arcade'])) {
    return 'games';
  }
  if (includesAny(source, ['app', 'mobile', 'flutter', 'android', 'ios'])) {
    return 'apps';
  }
  if (includesAny(source, ['tool', 'cli', 'automation', 'bot', 'util', 'plugin'])) {
    return 'tools';
  }
  return 'other';
}

function includesAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function getColorByLanguage(lang) {
  const colors = {
    Java: '#f89820',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    C: '#555555',
    'C#': '#178600',
    Dart: '#00B4AB',
    Flutter: '#02569B',
    SQL: '#4479A1',
    MySQL: '#4479A1',
    Unity: '#555555'
  };
  return colors[lang] || '#3cff8f';
}

function initAOS() {
  if (!window.AOS) return;
  window.AOS.init({
    once: true,
    duration: 900,
    easing: 'ease-out-cubic',
    offset: 80
  });
}
