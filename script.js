
'use strict';
// Cursor
const cur=document.getElementById('cur'),curR=document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx-3.5}px,${my-3.5}px)`});
(function animR(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;curR.style.transform=`translate(${rx-16}px,${ry-16}px)`;requestAnimationFrame(animR)})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{curR.style.width='52px';curR.style.height='52px';curR.style.borderColor='rgba(200,168,75,.85)'});
  el.addEventListener('mouseleave',()=>{curR.style.width='32px';curR.style.height='32px';curR.style.borderColor='rgba(200,168,75,.45)'});
});

// Sticky nav
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>70),{passive:true});

// Scroll reveal
const rvs=document.querySelectorAll('.rv');
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});},{threshold:.08,rootMargin:'0px 0px -44px 0px'});
rvs.forEach(el=>io.observe(el));

// Mobile nav
const ntog=document.getElementById('ntog'),mmenu=document.getElementById('mmenu'),mmx=document.getElementById('mmx');
ntog.addEventListener('click',()=>{const o=mmenu.classList.toggle('open');ntog.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
mmx.addEventListener('click',()=>{mmenu.classList.remove('open');ntog.setAttribute('aria-expanded',false);document.body.style.overflow=''});
mmenu.querySelectorAll('.mm-link').forEach(a=>a.addEventListener('click',()=>{mmenu.classList.remove('open');ntog.setAttribute('aria-expanded',false);document.body.style.overflow=''}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mmenu.classList.contains('open')){mmenu.classList.remove('open');ntog.setAttribute('aria-expanded',false);document.body.style.overflow='';ntog.focus()}});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id==='#')return;
    const t=document.querySelector(id);
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});

// Form
function submitForm(btn){
  if(!document.getElementById('fn').value.trim()||!document.getElementById('em').value.trim()){
    btn.style.background='#bf0a30';setTimeout(()=>btn.style.background='',800);return;
  }
  btn.textContent='Submitted';btn.style.opacity='.5';btn.disabled=true;
  document.getElementById('fc').style.display='block';
}

// ── VIDEO INTRO ──
(function() {
  const vid = document.getElementById('intro-vid');
  const prog = document.getElementById('vid-prog');
  const skipBtn = document.getElementById('vid-skip');
  const scrollCue = document.getElementById('vid-scroll-cue');
  const heroSection = document.getElementById('hero');

  if (!vid) return;

  function scrollToHero() {
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Progress bar
  vid.addEventListener('timeupdate', function() {
    if (vid.duration) {
      const pct = (vid.currentTime / vid.duration) * 100;
      prog.style.width = pct + '%';
      // Show scroll cue in final 2.5s
      if (vid.duration - vid.currentTime < 2.5) {
        scrollCue.classList.add('show');
      }
    }
  });

  // Auto-scroll to hero when video ends
  vid.addEventListener('ended', function() {
    setTimeout(scrollToHero, 400);
  });

  // Skip button
  skipBtn.addEventListener('click', function() {
    vid.pause();
    scrollToHero();
  });

  // Also scroll on any click/tap of the video slide
  document.getElementById('intro').addEventListener('click', function(e) {
    if (e.target === skipBtn || skipBtn.contains(e.target)) return;
    scrollToHero();
  });

  // Handle autoplay failure (mobile restrictions)
  var playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise.catch(function() {
      // Autoplay blocked — show scroll cue immediately
      scrollCue.classList.add('show');
      skipBtn.textContent = 'Enter Site';
    });
  }
})();


// ── ANIMATED COUNTERS ──
(function() {
  const counters = document.querySelectorAll('.pstat-n[data-target]');
  if (!counters.length) return;
  const cio = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
      cio.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(function(el) { cio.observe(el); });
})();

// ── HERO PARALLAX ──
(function() {
  const heroPhoto = document.querySelector('.hero-photo');
  if (!heroPhoto || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.5) {
          heroPhoto.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── ACTIVE NAV SECTION HIGHLIGHTING ──
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav .nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function(a) {
          a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-10% 0px -55% 0px' });
  sections.forEach(function(s) { io.observe(s); });
})();

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── MOBILE NAV ──
(function() {
  const tog = document.getElementById('ntog');
  const menu = document.getElementById('mmenu');
  const mx = document.getElementById('mmx');
  if (!tog || !menu) return;
  function openMenu() { menu.classList.add('open'); tog.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function closeMenu() { menu.classList.remove('open'); tog.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  tog.addEventListener('click', openMenu);
  if (mx) mx.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
})();

// ── STICKY NAV ──
(function() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });
})();

// ── SCROLL REVEAL ──
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rv').forEach(function(el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    return;
  }
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(function(el) { io.observe(el); });
})();

// ── FORM SUBMIT ──
(function() {
  const btn = document.getElementById('form-btn');
  const conf = document.getElementById('form-conf');
  if (!btn) return;
  btn.addEventListener('click', function() {
    const name = document.getElementById('fname');
    const email = document.getElementById('femail');
    if (!name || !name.value.trim() || !email || !email.value.trim()) {
      btn.style.opacity = '0.5';
      setTimeout(function() { btn.style.opacity = ''; }, 600);
      return;
    }
    btn.textContent = 'Submitted';
    btn.style.opacity = '0.5';
    btn.disabled = true;
    if (conf) conf.style.display = 'block';
  });
})();



/* ── CINEMATIC JS — Parallax + Counters + Signals ── */
(function() {
  // ── Parallax on divider images ─────────────────────────────────────────
  const parallaxEls = document.querySelectorAll(
    '.img-divider img, .pbr-divider img, .cinema-divider img, .baseball-divider img, .stadium-aerial-divider img'
  );
  function updateParallax() {
    parallaxEls.forEach(el => {
      const rect = el.closest('[class*="divider"]').getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewH   = window.innerHeight;
      const progress = (centerY - viewH * 0.5) / (viewH * 0.5);
      const offset   = progress * 28;
      el.style.transform = `translateY(${offset}px) scale(1.06)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ── Number counter animation ───────────────────────────────────────────
  function animateCounter(el) {
    const raw   = el.textContent.trim();
    const num   = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    if (isNaN(num) || num === 0) return;
    const duration = 1800;
    const start    = performance.now();
    function tick(now) {
      const p   = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = num * ease;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.fc-n, .vrn, .pstat-n, .ven-stat-n').forEach(el => {
    // Store original and observe
    el.dataset.orig = el.textContent;
    counterObs.observe(el);
  });

  // ── Stagger entry for og-node elements ────────────────────────────────
  const ogNodes = document.querySelectorAll('.og-node');
  const ogObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nodes = e.target.querySelectorAll('.og-node');
        nodes.forEach((n, i) => {
          n.style.opacity = '0';
          n.style.transform = 'translateY(20px)';
          n.style.transition = `opacity 0.6s ease ${i*0.12}s, transform 0.6s ease ${i*0.12}s`;
          setTimeout(() => {
            n.style.opacity = '1';
            n.style.transform = 'translateY(0)';
          }, 50);
        });
        ogObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.og-nodes').forEach(el => ogObs.observe(el));

  // ── Active nav link highlight on scroll ───────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => secObs.observe(s));

  // ── Sport marquee pause on hover ──────────────────────────────────────
  const marquee = document.querySelector('.sport-marquee-track');
  if (marquee) {
    const parent = marquee.closest('.sport-marquee');
    parent.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
    parent.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
  }

})();


