/* Portfolio — Francisco Yariel Rodríguez Alfonso
   Intro, campo de puntos, idioma, formulario, reveals, progreso,
   paneles de proyecto y parallax. Sin dependencias. */
(function () {
  'use strict';

  var CONFIG = {
    defaultLang: 'es',
    showIntro: true,
    fieldIntensity: 9
  };

  var root = document.getElementById('root');
  if (!root) return;

  var lang = 'es';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- intro */
  function initVeil() {
    var veil = root.querySelector('[data-veil]');
    if (!veil) return;
    if (CONFIG.showIntro === false) { veil.remove(); return; }
    var pct = veil.querySelector('[data-veil-pct]');
    var bar = veil.querySelector('[data-veil-bar]');
    var start = performance.now();

    function tick(now) {
      var t = Math.min(1, (now - start) / 1500);
      var e = 1 - Math.pow(1 - t, 3);
      if (pct) pct.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (bar) bar.style.right = (100 - e * 100) + '%';
      if (t < 1) { requestAnimationFrame(tick); return; }
      veil.style.opacity = '0';
      veil.style.visibility = 'hidden';
      setTimeout(function () { if (veil.parentNode) veil.remove(); }, 800);
    }
    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------- campo de puntos */
  function initField() {
    // Oculto por CSS por debajo de 820px (mismo corte que la cabecera
    // compacta): no tiene sentido correr el bucle de dibujo, el
    // ResizeObserver y los listeners de puntero para un canvas invisible
    // en un dispositivo que además no tiene puntero que perseguir.
    if (window.matchMedia('(max-width: 820px)').matches) return;
    var canvas = document.getElementById('field');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Los colores salen de los tokens de la CSS: cambiar la paleta ahí
    // repinta también los puntos, sin tocar este fichero.
    function tokenRgb(name) {
      var hex = getComputedStyle(root).getPropertyValue(name).trim().replace('#', '');
      if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
      var n = parseInt(hex, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
    }
    var inkRgb = tokenRgb('--tx');
    var accentRgb = tokenRgb('--ac');

    var gap = 26;
    var amp = typeof CONFIG.fieldIntensity === 'number' ? CONFIG.fieldIntensity : 9;
    var st = { w: 1, h: 1, dpr: 1, mx: -9999, my: -9999, t: 0, vis: true, mode: 0, target: 0 };

    var ids = ['top', 'stack', 'proyectos', 'trayectoria', 'contacto'];
    var secs = ids.map(function (id) { return root.querySelector('#' + id); }).filter(Boolean);

    function pickMode() {
      var mid = window.innerHeight * 0.45;
      var best = 0;
      secs.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= mid) best = i;
      });
      st.target = best;
    }
    var praf = 0;
    function onScrollMode() {
      if (praf) return;
      praf = requestAnimationFrame(function () { praf = 0; pickMode(); });
    }
    window.addEventListener('scroll', onScrollMode, { passive: true });
    window.addEventListener('resize', onScrollMode);
    pickMode();

    function resize() {
      var r = canvas.getBoundingClientRect();
      st.dpr = Math.min(2, window.devicePixelRatio || 1);
      st.w = Math.max(1, Math.round(r.width));
      st.h = Math.max(1, Math.round(r.height));
      canvas.width = st.w * st.dpr;
      canvas.height = st.h * st.dpr;
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) { st.vis = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    }

    var host = canvas.parentNode;
    host.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      st.mx = e.clientX - r.left;
      st.my = e.clientY - r.top;
    });
    host.addEventListener('pointerleave', function () { st.mx = -9999; st.my = -9999; });

    function draw() {
      requestAnimationFrame(draw);
      if (!st.vis) return;
      st.t += 0.01;
      st.mode += (st.target - st.mode) * 0.045;
      var w = st.w, h = st.h, t = st.t, m = st.mode;
      var cx = w * 0.68, cy = h * 0.42;
      ctx.clearRect(0, 0, w, h);

      // pesos de forma: 0 olas · 1 deriva diagonal · 2 anillos · 3 flujo horizontal · 4 respiración lenta
      var wt = [0, 0, 0, 0, 0];
      var lo = Math.max(0, Math.min(4, Math.floor(m)));
      var hi = Math.min(4, lo + 1);
      var f = Math.max(0, Math.min(1, m - lo));
      wt[lo] += 1 - f;
      wt[hi] += f;

      for (var y = gap * 0.5; y < h; y += gap) {
        for (var x = gap * 0.5; x < w; x += gap) {
          var wave = Math.sin(x * 0.013 + t) + Math.sin(y * 0.019 - t * 0.75) + Math.sin((x + y) * 0.007 + t * 0.5);
          var dx = 0, dy = 0;
          if (wt[0]) { dx += wt[0] * Math.cos(wave * 1.5) * amp; dy += wt[0] * Math.sin(wave * 1.5) * amp; }
          if (wt[1]) {
            var d1 = Math.sin((x + y) * 0.012 + t * 1.1) * amp * 1.5;
            dx += wt[1] * d1 * 0.7; dy += wt[1] * -d1 * 0.7;
          }
          if (wt[2]) {
            var rx = x - cx, ry = y - cy;
            var rr = Math.sqrt(rx * rx + ry * ry) || 1;
            var puls = Math.sin(rr * 0.035 - t * 1.6) * amp * 1.6;
            dx += wt[2] * (rx / rr) * puls; dy += wt[2] * (ry / rr) * puls;
          }
          if (wt[3]) {
            dx += wt[3] * Math.sin(y * 0.04 + t * 1.3) * amp * 2.2;
            dy += wt[3] * Math.sin(x * 0.02 + t * 0.4) * amp * 0.35;
          }
          if (wt[4]) {
            var br = 1 + Math.sin(t * 0.7) * 0.45;
            dx += wt[4] * (x - cx) * 0.012 * br;
            dy += wt[4] * (y - cy) * 0.012 * br;
          }
          var ddx = x - st.mx, ddy = y - st.my;
          var d2 = ddx * ddx + ddy * ddy;
          var near = 0;
          if (d2 < 24000) {
            near = 1 - d2 / 24000;
            var dd = Math.sqrt(d2) || 1;
            dx += (ddx / dd) * near * 22;
            dy += (ddy / dd) * near * 22;
          }
          var s = 1 + (wave + 3) / 6 * 0.95 + near * 1.6;
          var a = 0.17 + (wave + 3) / 6 * 0.26 + near * 0.4;
          ctx.fillStyle = near > 0.05
            ? 'rgba(' + accentRgb + ',' + Math.min(1, a + 0.25) + ')'
            : 'rgba(' + inkRgb + ',' + a.toFixed(3) + ')';
          ctx.fillRect(x + dx - s / 2, y + dy - s / 2, s, s);
        }
      }
    }
    requestAnimationFrame(draw);
  }

  /* --------------------------------------------------------------- idioma */
  var setPanelLabels = function () {};

  function initLang() {
    var btn = root.querySelector('[data-lang]');
    if (!btn) return;
    var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-en]'));
    nodes.forEach(function (n) { n.setAttribute('data-es', n.innerHTML); });

    function apply() {
      var en = lang === 'en';
      nodes.forEach(function (n) {
        var v = en ? n.getAttribute('data-en') : n.getAttribute('data-es');
        if (v != null) n.innerHTML = v;
      });
      var es = btn.querySelector('[data-lang-es]');
      var enEl = btn.querySelector('[data-lang-en]');
      if (es) es.classList.toggle('is-on', !en);
      if (enEl) enEl.classList.toggle('is-on', en);
      btn.setAttribute('aria-label', en ? 'Switch to Spanish' : 'Cambiar a inglés');
      root.setAttribute('lang', en ? 'en' : 'es');
      document.documentElement.setAttribute('lang', en ? 'en' : 'es');
      setPanelLabels();
    }

    if (CONFIG.defaultLang === 'en') { lang = 'en'; apply(); }
    btn.addEventListener('click', function () {
      lang = lang === 'es' ? 'en' : 'es';
      apply();
    });
  }

  /* ---------------------------------------------------------- formulario */
  function initForm() {
    var form = root.querySelector('[data-form]');
    if (!form) return;
    var note = form.querySelector('[data-form-note]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var email = (d.get('email') || '').toString().trim();
      var msg = (d.get('message') || '').toString().trim();
      if (!name || !email || !msg) {
        if (note) {
          note.textContent = lang === 'en'
            ? 'Please fill in the three fields before sending.'
            : 'Completa los tres campos antes de enviar.';
          note.style.color = 'var(--ac)';
        }
        return;
      }
      window.location.href = 'mailto:franciscoyarielrodriguezalfons@gmail.com?subject=' +
        encodeURIComponent('Portfolio — ' + name) + '&body=' +
        encodeURIComponent(msg + '\n\n' + name + ' · ' + email);
      if (note) {
        note.textContent = lang === 'en'
          ? 'Opening your mail client with the message ready.'
          : 'Abriendo tu cliente de correo con el mensaje listo.';
        note.style.color = 'var(--ac)';
      }
    });
  }

  /* ------------------------------------------------------------- reveals */
  function initReveal() {
    var nodes = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
    if (!nodes.length || reduced || !window.IntersectionObserver) return;

    nodes.forEach(function (n) {
      n.style.opacity = '0';
      n.style.transform = 'translateY(26px)';
      n.style.transition = 'opacity 0.85s cubic-bezier(.2,.8,.2,1), transform 0.85s cubic-bezier(.2,.8,.2,1)';
      n.style.willChange = 'opacity, transform';
    });

    var batch = [];
    var flushing = 0;
    function show(n, i) {
      n.style.transitionDelay = Math.min(i, 5) * 0.07 + 's';
      n.style.opacity = '1';
      n.style.transform = 'none';
      setTimeout(function () { n.style.willChange = 'auto'; }, 1400);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        batch.push(e.target);
      });
      if (batch.length && !flushing) {
        flushing = requestAnimationFrame(function () {
          batch.forEach(show);
          batch = [];
          flushing = 0;
        });
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* --------------------------------------------- barra de progreso (nav) */
  function initProgress() {
    var bar = root.querySelector('[data-progress]');
    if (!bar) return;
    var raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.width = (p * 100).toFixed(2) + '%';
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ------------------------------------------- paneles de cada proyecto */
  function initPanels() {
    var rows = Array.prototype.slice.call(root.querySelectorAll('[data-proj]'));
    var labelers = [];

    rows.forEach(function (row) {
      var panel = row.nextElementSibling;
      if (!panel || !panel.hasAttribute('data-panel')) return;

      row.style.cursor = 'pointer';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-expanded', 'false');

      var mark = document.createElement('span');
      mark.className = 'proj-mark';
      mark.setAttribute('aria-hidden', 'true');
      var markText = document.createElement('span');
      var markIcon = document.createElement('span');
      markIcon.className = 'proj-mark__icon';
      markIcon.textContent = '+';
      mark.appendChild(markText);
      mark.appendChild(markIcon);
      row.appendChild(mark);

      var open = false;
      function setLabel() {
        markText.textContent = lang === 'en'
          ? (open ? 'Close' : 'Details')
          : (open ? 'Cerrar' : 'Detalles');
      }
      setLabel();
      labelers.push(setLabel);

      var inner = panel.firstElementChild;
      var ease = 'cubic-bezier(.2,.8,.2,1)';
      var anim = null;

      function setH() { if (open && inner) panel.style.height = inner.offsetHeight + 'px'; }

      function toggle() {
        open = !open;
        var from = panel.offsetHeight + 'px';
        var to = open && inner ? inner.offsetHeight + 'px' : '0px';
        panel.style.height = to;
        if (anim) anim.cancel();
        if (!reduced && panel.animate) {
          anim = panel.animate([{ height: from }, { height: to }], { duration: 520, easing: ease });
        }
        var deg = open ? 135 : 0;
        setLabel();
        markIcon.style.transform = 'rotate(' + deg + 'deg)';
        if (!reduced && markIcon.animate) {
          markIcon.animate(
            [{ transform: 'rotate(' + (open ? 0 : 135) + 'deg)' }, { transform: 'rotate(' + deg + 'deg)' }],
            { duration: 420, easing: ease }
          );
        }
        row.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      row.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a')) return;
        toggle();
      });
      row.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest && e.target.closest('a')) return;
        e.preventDefault();
        toggle();
      });
      window.addEventListener('resize', setH);
    });

    setPanelLabels = function () { labelers.forEach(function (fn) { fn(); }); };
  }

  /* ------------------------------------------------------------ parallax */
  function initParallax() {
    if (reduced) return;
    var frames = Array.prototype.slice.call(root.querySelectorAll('[data-parallax]'));
    if (!frames.length) return;
    var raf = 0;

    function update() {
      raf = 0;
      var vh = window.innerHeight || 1;
      frames.forEach(function (f) {
        var inner = f.querySelector('[data-parallax-inner]');
        if (!inner) return;
        var r = f.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        inner.style.transform = 'translate3d(0,' + (p * -5).toFixed(2) + '%,0)';
      });
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  initVeil();
  initField();
  initPanels();
  initLang();
  initForm();
  initReveal();
  initProgress();
  initParallax();
})();
