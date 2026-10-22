(() => {
  const root = document.documentElement;
  let manualTheme = null;
  let manualUntil = 0;
  let timer;

  // Date uses the visitor's device timezone, including daylight-saving time.
  const scheduledTheme = (now) => now.getHours() >= 7 && now.getHours() < 19 ? 'light' : 'dark';
  const nextBoundary = (now) => {
    const next = new Date(now.getTime());
    const hour = now.getHours();
    next.setHours(hour < 7 ? 7 : hour < 19 ? 19 : 31, 0, 0, 0);
    return next.getTime();
  };
  const update = () => {
    const now = new Date();
    if (now.getTime() >= manualUntil) manualTheme = null;
    const theme = manualTheme || scheduledTheme(now);
    root.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const action = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      button.setAttribute('aria-label', action);
      button.setAttribute('title', `${action}. Automatic: light 07:00–19:00, dark otherwise (your local time). Manual choice lasts until the next boundary or page load.`);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    clearTimeout(timer);
    // Wake at the boundary, and check clock/timezone changes at least every minute.
    timer = setTimeout(update, Math.max(1, Math.min(60000, nextBoundary(now) - now.getTime())));
  };

  // Runs before the stylesheet is painted; previous saved themes do not override time.
  update();
  const connectButton = () => {
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      manualTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      manualUntil = nextBoundary(new Date());
      update();
    });
    update();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectButton, { once: true });
  } else {
    connectButton();
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) update();
  });
  window.addEventListener('focus', update);
  window.addEventListener('pageshow', update);
})();
