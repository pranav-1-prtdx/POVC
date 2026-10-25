/**
 * POVC — Portfolio Of Vishnu Creator
 * app.js — Complete Final Production JS
 * Pranav Bhatia | v3.0.0-FINAL
 */

/* ─── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  runLoader(() => {
    initGSAP();
  });
});

/* ============================================================
   1. LOADING SCREEN
============================================================ */
function runLoader(onComplete) {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loaderBar');
  const pct      = document.getElementById('loaderPct');
  const status   = document.getElementById('loaderStatus');
  if (!loader) { onComplete(); return; }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    loader.classList.add('hidden');
    onComplete();
  };

  // Safety net: never let the loader stay stuck longer than 4s no matter what
  const hardStop = setTimeout(finish, 4000);

  const msgs = [
    'INITIALISING SYSTEMS...',
    'LOADING NEURAL CORE...',
    'MOUNTING SECTOR GRID...',
    'CALIBRATING TELEMETRY...',
    'BOOTING VISHNU_AI...',
    'POVC_OS READY.'
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    const p = Math.floor(progress);
    if (bar)    bar.style.width = p + '%';
    if (pct)    pct.textContent = p + '%';
    if (status) status.textContent = msgs[Math.min(Math.floor(p / 17), msgs.length - 1)];
    if (p >= 100) {
      clearInterval(interval);
      clearTimeout(hardStop);
      setTimeout(finish, 400);
    }
  }, 80);
}

/* ============================================================
   2. GSAP INIT
============================================================ */
function initGSAP() {
  const waitGSAP = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(waitGSAP, 100); return;
    }
    gsap.registerPlugin(ScrollTrigger);
    bootAll();
  };
  waitGSAP();
}

/* ============================================================
   3. MAIN BOOT
============================================================ */
function bootAll() {
  initThemeToggle();
  initCursor();
  initNav();
  initScrollProgress();
  heroEntrance();
  initSectorAnimations();
  initContactTerminal();
  initActiveNav();
  consoleGreeting();
}

/* ============================================================
   THEME TOGGLE (light default, dark opt-in, persisted)
   The saved theme is already applied by the inline script in
   <head> before first paint — this only wires up the button.
============================================================ */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const meta = document.getElementById('themeColorMeta');
  const root = document.documentElement;
  const KEY  = 'povc-theme';

  const isDark = () => root.getAttribute('data-theme') === 'dark';

  const sync = () => {
    const dark = isDark();
    if (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(dark));
    }
    if (meta) meta.setAttribute('content', dark ? '#0a0a0a' : '#fbfbfc');
  };

  sync();
  if (!btn) return;

  btn.addEventListener('click', () => {
    const goingDark = !isDark();
    if (goingDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(KEY, goingDark ? 'dark' : 'light');
    } catch (e) { /* storage blocked — choice just won't persist */ }
    sync();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

/* ============================================================
   4. CUSTOM CURSOR
============================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  const tick = () => {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  };
  tick();

  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });

  // Expand ring on hoverable elements
  const hoverEls = document.querySelectorAll('a,button,.contact-card,.achievement-card,.build-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ============================================================
   5. NAVIGATION
============================================================ */
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

/* ============================================================
   6. SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
}

/* ============================================================
   10. HERO ENTRANCE (GSAP)
============================================================ */
function heroEntrance() {
  gsap.set(['#heroStatusBar','.hero-kicker','#heroName','#heroRealName','#heroSubtitle','#heroTerminal','#heroCta','.hero-scroll-indicator'], { opacity:0, y:20 });

  const tl = gsap.timeline({ defaults:{ ease:'power3.out' }, delay:0.1 });
  tl.to('.hero-kicker',        { opacity:1, y:0, duration:0.6 })
    .to('#heroName',           { opacity:1, y:0, duration:0.9, ease:'expo.out' }, '-=0.3')
    .to('#heroRealName',       { opacity:1, y:0, duration:0.5 }, '-=0.5')
    .to('#heroSubtitle',       { opacity:1, y:0, duration:0.6 }, '-=0.4')
    .to('#heroTerminal',       { opacity:1, y:0, duration:0.6 }, '-=0.4')
    .to('#heroCta',            { opacity:1, y:0, duration:0.5 }, '-=0.3')
    .to('#heroStatusBar',      { opacity:1, y:0, duration:0.5 }, '-=0.2')
    .to('.hero-scroll-indicator', { opacity:1, y:0, duration:0.6 }, '-=0.2');
}

/* ============================================================
   12. SCROLLTRIGGER SECTOR ANIMATIONS
============================================================ */
function initSectorAnimations() {
  const reveal = (targets, from, to, trigger, start = 'top 80%') => {
    if (!document.querySelector(Array.isArray(targets) ? targets[0] : targets)) return;
    gsap.fromTo(targets, from, {
      ...to,
      scrollTrigger: { trigger, start, toggleActions: 'play none none none' }
    });
  };

  // Section headers
  ['#about', '#skills', '#projects', '#achievements', '#contact'].forEach(id => {
    reveal(`${id} .sector-header`, { opacity: 0, x: -28 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, id);
  });

  // About
  reveal(['.about-identity-card', '.about-bio'], { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '#about', 'top 72%');
  reveal('.aqf-item', { opacity: 0, x: -18 },
    { opacity: 1, x: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out' }, '.about-quick-facts', 'top 82%');

  // What I build
  reveal('.build-card', { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '.build-grid', 'top 80%');
  reveal('.tech-pill', { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.4)' }, '.tech-stack', 'top 85%');
  reveal('.now-block', { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '.now-block', 'top 88%');

  // Projects (under construction)
  reveal('.wip', { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '.wip', 'top 82%');

  // Recognition
  reveal('.achievement-card', { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '.achievements-grid', 'top 80%');

  // Contact
  reveal('.contact-card', { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '.contact-grid', 'top 82%');
  reveal('.contact-terminal', { opacity: 0, x: -18 },
    { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '.contact-terminal', 'top 90%');
}

/* ============================================================
   13. SKILL BARS
============================================================ */
/* ============================================================
   19. CONTACT TERMINAL TYPEOUT
============================================================ */
function initContactTerminal() {
  ScrollTrigger.create({
    trigger: '.contact-terminal',
    start: 'top 85%',
    onEnter: () => {
      const lines = document.querySelectorAll('.ct-response');
      lines.forEach((line, i) => {
        line.style.opacity = '0';
        setTimeout(() => {
          gsap.to(line, { opacity:1, x:0, duration:0.5, ease:'power2.out' });
        }, 600 + i * 400);
      });
    }
  });
}

/* ============================================================
   22. CONSOLE GREETING
============================================================ */
function consoleGreeting() {
  const s1 = 'color:#00ff9f;font-size:15px;font-family:monospace;font-weight:900';
  const s2 = 'color:#00ccff;font-size:11px;font-family:monospace';
  const s3 = 'color:rgba(0,204,255,0.45);font-size:10px;font-family:monospace';
  console.log('%cPOVC 2.0 — Portfolio of Pranav Bhatia', s1);
  console.log('%cBuilt from scratch — HTML, CSS, JS, GSAP. No frameworks.', s2);
  console.log('%clinkedin.com/in/pranavkbhatia · github.com/pranav-1-prtdx', s3);
}

/* ══════════════════════════════════════════════════════════════
   POVC v1.0 ADDITIONS — Active Nav, Reduced Motion, Polish
   ══════════════════════════════════════════════════════════════ */

/**
 * Active navigation link on scroll
 * Highlights the correct nav item based on which section is in view
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  // Sections listed here own a nav item; skills/achievements intentionally don't.
  const sectionMap = {
    'home':     'HOME',
    'about':    'ABOUT',
    'projects': 'PROJECTS',
    'contact':  'CONTACT'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) + 10}px 0px -60% 0px`,
    threshold: 0
  });

  sections.forEach(section => {
    if (sectionMap[section.id] !== undefined) {
      observer.observe(section);
    }
  });
}

/**
 * Check if user prefers reduced motion
 * Used to skip heavy animations gracefully
 */

