/* ── CRDF home.js — loads the home page content ── */
'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('home.html');
    if (!res.ok) throw new Error('Failed to load home.html: ' + res.status);
    document.getElementById('page-content').innerHTML = await res.text();
    // Re-trigger reveal after content is injected
    if (typeof window.initReveal === 'function') {
      setTimeout(window.initReveal, 50);
    }
  } catch (e) {
    console.error(e);
    document.getElementById('page-content').innerHTML =
      '<p style="padding:120px 24px;text-align:center;color:#5a6a7a">Unable to load page content.</p>';
  }
});