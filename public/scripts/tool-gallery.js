(function () {
  // Scoped to the .tool-gallery element immediately before this script tag
  // in the DOM (Astro's scoped <style> is extracted at build time, so the
  // rendered markup is always: ...gallery div, then this script, with
  // nothing in between). This replaces the old per-instance uid passed in
  // via define:vars — document.currentScript still resolves correctly for
  // a deferred classic script, and this keeps each ToolGallery instance on
  // a page wired independently without needing a unique id at all.
  var script = document.currentScript;
  var root = script && script.previousElementSibling;
  if (!root || !root.classList || !root.classList.contains('tool-gallery')) return;

  var imgs = root.querySelectorAll('.tool-gallery-img');
  var dots = root.querySelectorAll('.tool-gallery-dot');
  function show(index) {
    imgs.forEach(function (el) { el.classList.toggle('active', el.dataset.index === String(index)); });
    dots.forEach(function (el) { el.classList.toggle('active', el.dataset.index === String(index)); });
  }
  var current = 0;
  root.addEventListener('click', function (e) {
    if (e.target.closest('.tool-gallery-dot')) return;
    current = current === 0 ? 1 : 0;
    show(current);
  });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      current = Number(dot.dataset.index);
      show(current);
    });
  });
})();
