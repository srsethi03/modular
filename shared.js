/* ── CRDF shared.js — loads partials, scroll reveal, navbar scroll ── */
'use strict';

/* ── Load an HTML partial into a selector ── */
async function loadPartial(selector, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    document.querySelector(selector).innerHTML = await res.text();
  } catch (e) {
    console.warn('Partial load failed:', url, e);
  }
}

/* ── Mark the active nav link based on current page filename ── */
function setActiveNavLink() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const page = a.dataset.page || '';
    const isHome = (file === 'index.html' || file === '') && page === 'home';
    const isMatch = file.startsWith(page) && page !== 'home';
    a.classList.toggle('active', isHome || isMatch);
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── Navbar scroll shadow ── */
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('#hamburger');
  if (btn) {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) drawer.classList.toggle('open');
  }
});

/* ── Bootstrap on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', async () => {
  // Load shared partials
  await Promise.all([
    loadPartial('#navbar-slot', 'navbar.html'),
    loadPartial('#footer-slot', 'footer.html'),
  ]);
  setActiveNavLink();
  initReveal();
  // Trigger reveal again after short delay for images/fonts
  setTimeout(initReveal, 200);
});

/* ── Expose for page scripts ── */
window.initReveal = initReveal;