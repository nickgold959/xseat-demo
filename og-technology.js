
(function() {
  // ── Nav stuck state ──────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });

  // ── Scroll reveal ────────────────────────────────────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  // ── Counter animation for stat numbers ──────────────────────────────
  function animateCounter(el) {
    const text  = el.textContent.trim();
    const num   = parseFloat(text.replace(/[^0-9.]/g, ''));
    const sfx   = text.replace(/[0-9.]/g, '');
    if (isNaN(num) || num === 0) return;
    const dur   = 1800;
    const t0    = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (Number.isInteger(num) ? Math.round(num * e) : (num * e).toFixed(1)) + sfx;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.og-metric-n, .sync-stat-n').forEach(el => cObs.observe(el));

  // ── Stagger og-def-rows on entry ────────────────────────────────────
  const drObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const rows = e.target.querySelectorAll('.og-def-row');
        rows.forEach((r, i) => {
          r.style.opacity = '0';
          r.style.transform = 'translateX(20px)';
          r.style.transition = `opacity 0.5s ease ${i*0.1}s, transform 0.5s ease ${i*0.1}s`;
          setTimeout(() => { r.style.opacity = '1'; r.style.transform = 'none'; }, 50);
        });
        drObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.og-def-block').forEach(el => drObs.observe(el));

  // ── Stagger fpe-comp items ───────────────────────────────────────────
  const fcObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const items = e.target.querySelectorAll('.fpe-comp');
        items.forEach((it, i) => {
          it.style.opacity = '0';
          it.style.transform = 'translateY(16px)';
          it.style.transition = `opacity 0.55s ease ${i*0.12}s, transform 0.55s ease ${i*0.12}s`;
          setTimeout(() => { it.style.opacity = '1'; it.style.transform = 'none'; }, 50);
        });
        fcObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fpe-components').forEach(el => fcObs.observe(el));

  // ── Stagger sync-venue nodes on entry ───────────────────────────────
  const svObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const venues = e.target.querySelectorAll('.sync-venue');
        venues.forEach((v, i) => {
          v.style.opacity = '0';
          v.style.transform = 'scale(0.9)';
          v.style.transition = `opacity 0.4s ease ${i*0.06}s, transform 0.4s ease ${i*0.06}s`;
          setTimeout(() => { v.style.opacity = '1'; v.style.transform = 'scale(1)'; }, 50);
        });
        svObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sync-venues').forEach(el => svObs.observe(el));

})();
