/* ═══════════════════════════════════════════════
   CRDF — about.js
   Handles the About page tab navigation:
   Who We Are / Why We Exist / Vision & Mission /
   Governing Body
   ═══════════════════════════════════════════════ */
(function () {
  const nav = document.querySelector(".tabs-nav");
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll(".tab-btn"));
  const indicator = nav.querySelector(".tabs-indicator");
  const panels = document.querySelectorAll(".tab-panel");

  function moveIndicatorTo(tab) {
    if (!indicator) return;
    indicator.style.left = tab.offsetLeft + "px";
    indicator.style.width = tab.offsetWidth + "px";
  }

  function activateTab(tab, { focus = false } = {}) {
    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const shouldShow = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !shouldShow;
      if (shouldShow) {
        // restart the fade-in animation each time a panel is shown
        panel.style.animation = "none";
        // eslint-disable-next-line no-unused-expressions
        panel.offsetHeight;
        panel.style.animation = "";
      }
    });

    moveIndicatorTo(tab);
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (e) => {
      let newIndex = null;
      if (e.key === "ArrowRight") newIndex = (index + 1) % tabs.length;
      if (e.key === "ArrowLeft") newIndex = (index - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") newIndex = 0;
      if (e.key === "End") newIndex = tabs.length - 1;
      if (newIndex !== null) {
        e.preventDefault();
        activateTab(tabs[newIndex], { focus: true });
      }
    });
  });

  // Deep-linking support: #governing-body, #vision-mission, #who-we-are, #why-we-exist
  const hashMap = {
    "#who-we-are": "tab-who",
    "#why-we-exist": "tab-why",
    "#vision-mission": "tab-vm",
    "#governing-body": "tab-gov"
  };
  const initialTabId = hashMap[window.location.hash] || null;
  const initialTab = initialTabId
    ? document.getElementById(initialTabId)
    : tabs.find((t) => t.classList.contains("is-active")) || tabs[0];

  // Position the indicator once layout is ready
  window.requestAnimationFrame(() => activateTab(initialTab));
  window.addEventListener("resize", () => {
    const current = tabs.find((t) => t.classList.contains("is-active"));
    if (current) moveIndicatorTo(current);
  });
})();
