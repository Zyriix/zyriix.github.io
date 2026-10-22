(() => {
  document.querySelectorAll('.project-visual').forEach((figure) => {
    const image = figure.querySelector('img[data-animation]');
    const button = figure.querySelector('.animation-toggle');
    if (!image || !button) return;
    let playing = false;
    const setPlaying = (value) => {
      playing = value;
      image.src = playing ? image.dataset.animation : image.dataset.poster;
      button.textContent = playing ? 'Pause' : 'Play';
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} core idea animation`);
      button.setAttribute('aria-pressed', String(playing));
    };
    button.hidden = false;
    setPlaying(true);
    button.addEventListener('click', () => setPlaying(!playing));
  });
})();
