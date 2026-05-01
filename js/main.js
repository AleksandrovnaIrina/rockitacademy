/* ═══════════════════════════════════════════
   ROCKIT ACADEMY — Main JS
═══════════════════════════════════════════ */

/* ── Preloader ──────────────────────────── */
const preloader = document.getElementById('preloader');
const fill      = document.getElementById('preloaderFill');
let progress = 0;

const loadTimer = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadTimer);
    fill.style.width = '100%';
    setTimeout(() => preloader.classList.add('done'), 350);
  }
  fill.style.width = progress + '%';
}, 60);

window.addEventListener('load', () => {
  progress = 100;
  fill.style.width = '100%';
  clearInterval(loadTimer);
  setTimeout(() => preloader.classList.add('done'), 300);
});

/* ── Custom Cursor ──────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function loopRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loopRing);
})();

const hoverTargets = 'a, button, .persona, .prog, .res, .rev, .fc';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── Nav stuck state ────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 50);
});

/* ── Burger / mobile menu ───────────────── */
const burger     = document.getElementById('burger');
const mobileNav  = document.getElementById('mobileNav');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  const [s1, s2] = burger.querySelectorAll('span');
  s1.style.transform = open ? 'translateY(7.5px) rotate(45deg)' : '';
  s2.style.transform = open ? 'translateY(-7.5px) rotate(-45deg)' : '';
}

burger.addEventListener('click', () => toggleMenu(!menuOpen));
document.querySelectorAll('.m-link').forEach(l => l.addEventListener('click', () => toggleMenu(false)));

/* ── Scroll Reveal ──────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.d || 0);
    setTimeout(() => e.target.classList.add('in'), d);
    io.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.sr').forEach(el => io.observe(el));

/* ── Number counter ─────────────────────── */
function countUp(el) {
  const target = parseInt(el.dataset.count);
  const dur = 1600;
  const fps = 1000 / 60;
  const steps = dur / fps;
  let i = 0;
  const t = setInterval(() => {
    i++;
    const ease = 1 - Math.pow(1 - i / steps, 3);
    el.textContent = Math.round(ease * target);
    if (i >= steps) { el.textContent = target; clearInterval(t); }
  }, fps);
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    counterIO.unobserve(e.target);
  });
}, { threshold: 0.5 });

const metrics = document.querySelector('.hero__metrics');
if (metrics) counterIO.observe(metrics);

/* ── Module "Що всередині?" toggle ─────── */
document.querySelectorAll('.prog-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const details  = document.getElementById(targetId);
    const isOpen   = details.classList.contains('open');

    // close all others
    document.querySelectorAll('.prog__details.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.prog-toggle.active').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      details.classList.add('open');
      btn.classList.add('active');
      setTimeout(() => {
        details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
});

/* ── FAQ accordion ──────────────────────── */
document.querySelectorAll('.faqi__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faqi');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faqi.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Smooth anchor scroll ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'smooth' });
  });
});

/* ── GSAP ───────────────────────────────── */
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance (runs after preloader clears ~1s) */
  const heroTL = gsap.timeline({ delay: 0.9 });

  heroTL
    .to('#heroTag', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .from('.hero__line', {
      y: 90, opacity: 0,
      duration: 0.95, stagger: 0.1, ease: 'power4.out',
    }, '-=0.3')
    .to('#heroDesc',    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .to('#heroBtns',    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
    .to('#heroMetrics', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
    .to('#heroVisual',  { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, '-=0.8');

  /* Curriculum lines — fromTo щоб не конфліктувати з .sr класом */
  gsap.utils.toArray('.curric__item').forEach((el, i) => {
    gsap.fromTo(el,
      { x: -24, opacity: 0 },
      {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        x: 0, opacity: 1,
        duration: 0.65, delay: i * 0.07, ease: 'power3.out',
        onStart() { el.classList.add('in'); },
      }
    );
  });

  /* Parallax on hero glows */
  gsap.to('.hero__glow--purple', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: 120, ease: 'none',
  });
  gsap.to('.hero__glow--lime', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -80, ease: 'none',
  });

  /* CTA section title */
  gsap.from('.cta-block__title', {
    scrollTrigger: { trigger: '.cta-block', start: 'top 75%', once: true },
    y: 50, opacity: 0, duration: 1, ease: 'power4.out',
  });
}
