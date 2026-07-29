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
  initCursor();
  initNav();
  initScrollProgress();
  initUptime();
  initNodeScrambler();
  initParticles();
  heroEntrance();
  initTyping();
  initSectorAnimations();
  initSkillBars();
  initTelemBars();
  initProgressBar();
  initPhaseBar();
  initLifeLevels();
  initStatCounters();
  initContactTerminal();
  initGridFlicker();
  initKeyboardA11y();
  consoleGreeting();
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
  const hoverEls = document.querySelectorAll('a,button,.project-card,.contact-card,.achievement-card,.phase-card,.level-card,.skill-category');
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
   7. UPTIME COUNTER
============================================================ */
function initUptime() {
  const el = document.getElementById('uptimeCounter');
  if (!el) return;
  let s = 0;
  const pad = n => String(n).padStart(2,'0');
  setInterval(() => {
    s++;
    el.textContent = `${pad(Math.floor(s/3600))}:${pad(Math.floor((s%3600)/60))}:${pad(s%60)}`;
  }, 1000);
}

/* ============================================================
   8. NODE ID SCRAMBLER
============================================================ */
function initNodeScrambler() {
  const el = document.getElementById('nodeId');
  if (!el) return;
  const chars = '0123456789ABCDEF';
  setInterval(() => {
    if (Math.random() < 0.15) {
      el.textContent = 'VCR-' + Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
      setTimeout(() => { el.textContent = 'VCR-7734'; }, 120);
    }
  }, 3000);
}

/* ============================================================
   9. PARTICLE CANVAS
============================================================ */
function initParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive:true });

  const N = 55;
  particles = Array.from({length:N}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.5 + 0.5,
    a: Math.random() * 0.5 + 0.1
  }));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,204,255,${p.a})`;
      ctx.fill();
    });
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,159,${(1 - dist/120) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
}

/* ============================================================
   10. HERO ENTRANCE (GSAP)
============================================================ */
function heroEntrance() {
  gsap.set(['#heroStatusBar','.hero-pre-label','#heroName','.hero-real-name','#heroSubtitle','#heroTerminal','#heroCta','.hero-hud-stats','.hero-scroll-indicator'], { opacity:0, y:20 });

  const tl = gsap.timeline({ defaults:{ ease:'power3.out' }, delay:0.1 });
  tl.to('#heroStatusBar',      { opacity:1, y:0, duration:0.7 })
    .to('.hero-pre-label',     { opacity:1, y:0, duration:0.5 }, '-=0.4')
    .to('#heroName',           { opacity:1, y:0, duration:0.9, ease:'expo.out' }, '-=0.3')
    .to('.hero-real-name',     { opacity:1, y:0, duration:0.5 }, '-=0.5')
    .to('#heroSubtitle',       { opacity:1, y:0, duration:0.5 }, '-=0.4')
    .to('#heroTerminal',       { opacity:1, y:0, duration:0.5 }, '-=0.3')
    .to('#heroCta',            { opacity:1, y:0, duration:0.5 }, '-=0.3')
    .to(['.hero-hud-stats','.hero-scroll-indicator'], { opacity:1, y:0, duration:0.6, stagger:0.15 }, '-=0.2');
}

/* ============================================================
   11. TYPING ANIMATION
============================================================ */
function initTyping() {
  const el = document.getElementById('terminalText');
  if (!el) return;

  const phrases = [
    'AI Builder & Developer',
    'Vishnu AI Creator',
    'Frontend Engineer',
    'Systems Optimizer',
    'Motorsport Competitor',
    'Future MIT Engineer'
  ];

  let pi = 0, ci = 0, deleting = false, delay = 100;

  const type = () => {
    const phrase = phrases[pi];
    el.textContent = deleting
      ? phrase.substring(0, --ci)
      : phrase.substring(0, ++ci);

    delay = deleting ? 52 : 105;

    if (!deleting && ci === phrase.length) { delay = 2000; deleting = true; }
    if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 450; }
    setTimeout(type, delay);
  };
  setTimeout(type, 1800);
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

  // Telemetry board
  gsap.fromTo('.telemetry-board',
    { opacity:0, y:28 },
    { opacity:1, y:0, duration:0.9, ease:'power3.out',
      scrollTrigger:{ trigger:'#sector-02', start:'top 70%', toggleActions:'play none none none' }
    }
  );

  // Sector time cards
  gsap.fromTo('.sector-time-card',
    { opacity:0, scale:0.94 },
    { opacity:1, scale:1, duration:0.5, stagger:0.1, ease:'back.out(1.4)',
      scrollTrigger:{ trigger:'.board-sectors', start:'top 82%', toggleActions:'play none none none' }
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

  // Life XP header
  gsap.fromTo('.life-xp-header',
    { opacity:0, y:16 },
    { opacity:1, y:0, duration:0.7, ease:'power3.out',
      scrollTrigger:{ trigger:'.life-xp-header', start:'top 85%', toggleActions:'play none none none' }
    }
  );

  // Level cards
  gsap.fromTo('.level-card',
    { opacity:0, y:22, scale:0.97 },
    { opacity:1, y:0, scale:1, duration:0.5, stagger:{ amount:0.9 }, ease:'power2.out',
      scrollTrigger:{ trigger:'.level-grid', start:'top 80%', toggleActions:'play none none none',
        onComplete: () => {
          // Restore locked card opacity after animation
          setTimeout(() => {
            document.querySelectorAll('.lc-locked').forEach(c => { c.style.opacity = '0.42'; });
          }, 950);
        }
      }
    }
  );

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
function initSkillBars() {
  ScrollTrigger.create({
    trigger: '.skills-grid',
    start: 'top 75%',
    onEnter: () => {
      document.querySelectorAll('.sb-fill[data-target]').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.getAttribute('data-target') + '%'; }, i * 80);
      });
    }
  });
}

/* ============================================================
   14. TELEMETRY BARS + LAPTIME COUNTER
============================================================ */
function initTelemBars() {
  ScrollTrigger.create({
    trigger: '.board-telemetry-bars',
    start: 'top 80%',
    onEnter: () => {
      document.querySelectorAll('.telem-bar-fill[data-value]').forEach(bar => {
        bar.style.width = bar.getAttribute('data-value') + '%';
      });
    }
  });

  // Laptime count-up
  ScrollTrigger.create({
    trigger: '.telemetry-board',
    start: 'top 70%',
    onEnter: () => {
      const el = document.getElementById('laptimeDisplay');
      if (!el) return;
      const target = (6 * 60 + 38) * 1000 + 330;
      const dur = 1400, start = performance.now();
      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const pad2 = n => String(n).padStart(2,'0');
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const cur = Math.floor(easeOutExpo(p) * target);
        el.innerHTML = `${Math.floor(cur/60000)}:${pad2(Math.floor((cur%60000)/1000))}.${pad2(Math.floor((cur%1000)/10))}<span class="laptime-delta">▲ PB</span>`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
}

/* ============================================================
   15. SPRINT PROGRESS BAR
============================================================ */
function initProgressBar() {
  ScrollTrigger.create({
    trigger: '.milestone-active',
    start: 'top 80%',
    onEnter: () => {
      const fill = document.getElementById('progressFill');
      const pct  = document.getElementById('progressPct');
      if (!fill) return;
      const target = parseInt(fill.getAttribute('data-target') || '67');
      const dur = 1600, start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const v = Math.floor(ease(p) * target);
        fill.style.width = v + '%';
        fill.setAttribute('aria-valuenow', v);
        if (pct) pct.textContent = v + '%';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
}

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
   17. LIFE LEVEL BARS + OVERALL XP
============================================================ */
function initLifeLevels() {
  ScrollTrigger.create({
    trigger: '.life-xp-header',
    start: 'top 80%',
    onEnter: () => {
      const xp = document.getElementById('lifeXpFill');
      if (xp) xp.style.width = (xp.getAttribute('data-target') || '40') + '%';
    }
  });

  ScrollTrigger.create({
    trigger: '.level-grid',
    start: 'top 75%',
    onEnter: () => {
      document.querySelectorAll('.lc-bar-fill[data-target]').forEach((bar, i) => {
        const t = parseInt(bar.getAttribute('data-target') || '0');
        if (t > 0) setTimeout(() => { bar.style.width = t + '%'; }, i * 85);
      });
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
   20. GRID FLICKER
============================================================ */
function initGridFlicker() {
  const el = document.querySelector('.hero-grid-bg');
  if (!el) return;
  setInterval(() => {
    if (Math.random() < 0.03) {
      el.style.opacity = '0.5';
      setTimeout(() => { el.style.opacity = '1'; }, 80);
    }
  }, 200);
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
  console.log('%c[POVC_OS v3.0] Boot complete. Welcome to Pranav\'s cockpit.', s1);
  console.log('%cAKA: VISHNU | Node: VCR-7734 | Build: v3.0.0-FINAL', s2);
  console.log('%cBuilt with Claude AI | linkedin.com/in/pranavbhatia', s3);
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

  const sectionMap = {
    'hero':         'HOME',
    'about':        'ABOUT',
    'skills':       'SKILLS',
    'sector-01':    'PROJECTS',
    'sector-04':    'VISHNU_AI',
    'sector-02':    'TELEMETRY',
    'sector-05':    'LIFE_LOG',
    'achievements': 'AWARDS',
    'contact':      'CONTACT'
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
    if (sectionMap[section.id] !== undefined || section.id === 'hero') {
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

/**
 * Conditionally run particles — skip on reduced motion or low-power devices
 */
function initParticlesSafe() {
  if (prefersReducedMotion()) return;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return;
  initParticles(); // already defined in main app.js
}

// Attach active nav to boot sequence
const _originalBootAll = bootAll;

// Re-run active nav after all animations settle
setTimeout(initActiveNav, 2500);

// Also init on every scroll refresh
window.addEventListener('scroll', () => {}, { passive: true }); // keep passive listener registered