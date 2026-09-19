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
  initPhaseBar();
  initStatCounters();
  initContactTerminal();
  initKeyboardA11y();
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
  const hoverEls = document.querySelectorAll('a,button,.project-card,.contact-card,.achievement-card,.phase-card,.build-card');
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
  // Helper: animate section header
  const animHeader = (trigger) => {
    gsap.fromTo(`${trigger} .sector-header`,
      { opacity:0, x:-28 },
      { opacity:1, x:0, duration:0.8, ease:'power3.out',
        scrollTrigger:{ trigger, start:'top 80%', toggleActions:'play none none none' }
      }
    );
  };

  ['#about','#skills','#sector-01','#sector-04','#sector-02','#sector-03','#sector-05','#achievements','#contact']
    .forEach(animHeader);

  // About cards
  gsap.fromTo(['.about-identity-card','.about-bio'],
    { opacity:0, y:30 },
    { opacity:1, y:0, duration:0.8, stagger:0.15, ease:'power2.out',
      scrollTrigger:{ trigger:'#about', start:'top 72%', toggleActions:'play none none none' }
    }
  );

  // Quick fact items
  gsap.fromTo('.aqf-item',
    { opacity:0, x:-18 },
    { opacity:1, x:0, duration:0.55, stagger:0.1, ease:'power2.out',
      scrollTrigger:{ trigger:'.about-quick-facts', start:'top 82%', toggleActions:'play none none none' }
    }
  );

  // Skill categories
  gsap.fromTo('.skill-category',
    { opacity:0, y:24 },
    { opacity:1, y:0, duration:0.6, stagger:0.12, ease:'power2.out',
      scrollTrigger:{ trigger:'.skills-grid', start:'top 78%', toggleActions:'play none none none' }
    }
  );

  // Tech pills
  gsap.fromTo('.tech-pill',
    { opacity:0, scale:0.88 },
    { opacity:1, scale:1, duration:0.4, stagger:0.04, ease:'back.out(1.4)',
      scrollTrigger:{ trigger:'.tech-stack', start:'top 85%', toggleActions:'play none none none' }
    }
  );

  // Project cards
  gsap.fromTo('.project-card',
    { opacity:0, y:36 },
    { opacity:1, y:0, duration:0.7, stagger:0.14, ease:'power2.out',
      scrollTrigger:{ trigger:'#sector-01', start:'top 75%', toggleActions:'play none none none' }
    }
  );

  // Vishnu AI Force — architecture flow steps
  gsap.fromTo('.arch-step',
    { opacity:0, x:-16 },
    { opacity:1, x:0, duration:0.45, stagger:0.09, ease:'power2.out',
      scrollTrigger:{ trigger:'.arch-flow', start:'top 82%', toggleActions:'play none none none' }
    }
  );

  // Vishnu AI Force — feature cards
  gsap.fromTo('.arch-feature-card',
    { opacity:0, y:20 },
    { opacity:1, y:0, duration:0.55, stagger:0.1, ease:'power2.out',
      scrollTrigger:{ trigger:'.arch-features-grid', start:'top 85%', toggleActions:'play none none none' }
    }
  );

  // Phase cards
  gsap.fromTo('.phase-track-line',
    { scaleX:0, transformOrigin:'left center' },
    { scaleX:1, duration:1, ease:'power2.out',
      scrollTrigger:{ trigger:'#sector-04', start:'top 72%', toggleActions:'play none none none' }
    }
  );
  gsap.fromTo('.phase-card',
    { opacity:0, y:28 },
    { opacity:1, y:0, duration:0.65, stagger:0.12, ease:'power2.out',
      scrollTrigger:{ trigger:'.phases-grid', start:'top 78%', toggleActions:'play none none none' }
    }
  );

  // Timeline track
  gsap.fromTo('.timeline-track',
    { scaleY:0, transformOrigin:'top center' },
    { scaleY:1, duration:1.2, ease:'power2.out',
      scrollTrigger:{ trigger:'.timeline', start:'top 75%', toggleActions:'play none none none' }
    }
  );

  // Milestones
  document.querySelectorAll('.milestone').forEach((ms, i) => {
    gsap.fromTo(ms,
      { opacity:0, x:-28 },
      { opacity:1, x:0, duration:0.7, delay:i*0.12, ease:'power3.out',
        scrollTrigger:{ trigger:ms, start:'top 86%', toggleActions:'play none none none' }
      }
    );
  });

  // Achievement cards
  gsap.fromTo('.achievement-card',
    { opacity:0, y:24 },
    { opacity:1, y:0, duration:0.6, stagger:0.1, ease:'power2.out',
      scrollTrigger:{ trigger:'.achievements-grid', start:'top 78%', toggleActions:'play none none none' }
    }
  );

  // Contact cards
  gsap.fromTo('.contact-card',
    { opacity:0, y:22 },
    { opacity:1, y:0, duration:0.6, stagger:0.12, ease:'power2.out',
      scrollTrigger:{ trigger:'.contact-grid', start:'top 80%', toggleActions:'play none none none' }
    }
  );

  // Contact terminal
  gsap.fromTo('.contact-terminal',
    { opacity:0, x:-18 },
    { opacity:1, x:0, duration:0.7, ease:'power3.out',
      scrollTrigger:{ trigger:'.contact-terminal', start:'top 88%', toggleActions:'play none none none' }
    }
  );

  // Life quote
  gsap.fromTo('.life-footer-quote',
    { opacity:0, x:-18 },
    { opacity:1, x:0, duration:0.8, ease:'power3.out',
      scrollTrigger:{ trigger:'.life-footer-quote', start:'top 90%', toggleActions:'play none none none' }
    }
  );
}

/* ============================================================
   13. SKILL BARS
============================================================ */
/* ============================================================
   16. VISHNU AI V.FORCE BAR
============================================================ */
function initPhaseBar() {
  ScrollTrigger.create({
    trigger: '.phase-active',
    start: 'top 80%',
    onEnter: () => {
      const fill = document.getElementById('vforceFill');
      if (fill) { setTimeout(() => { fill.style.width = (fill.getAttribute('data-target') || '94') + '%'; }, 300); }
    }
  });
}

/* ============================================================
   18. ANIMATED STAT COUNTERS
============================================================ */
function initStatCounters() {
  ScrollTrigger.create({
    trigger: '#statsRow',
    start: 'top 80%',
    onEnter: () => {
      document.querySelectorAll('.sc-val[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const dur = 1800, start = performance.now();
        const ease = t => 1 - Math.pow(1 - t, 3);
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.floor(ease(p) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  });
}

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
   21. KEYBOARD ACCESSIBILITY
============================================================ */
function initKeyboardA11y() {
  document.querySelectorAll('.project-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.card-link');
        if (link) link.click();
      }
    });
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

  // Maps section id -> nav label. Sections not listed here (skills,
  // achievements) intentionally don't own a top-level nav item.
  const sectionMap = {
    'home':      'HOME',
    'sector-01': 'PROJECTS',
    'about':     'ABOUT',
    'sector-03': 'JOURNEY',
    'contact':   'CONTACT'
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
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}