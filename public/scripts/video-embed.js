(function () {
  // Same scoping convention as tool-gallery.js: this script is always the
  // immediate next sibling of its own .video-embed-facade div in the
  // rendered markup, so document.currentScript resolves the right instance
  // without needing a unique id, even with multiple embeds on one page.
  var script = document.currentScript;
  var root = script && script.previousElementSibling;
  if (!root || !root.classList || !root.classList.contains('video-embed-facade')) return;

  function load() {
    var id = root.getAttribute('data-video-id');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
    iframe.title = root.getAttribute('aria-label') || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.className = 'video-embed-iframe';
    root.replaceWith(iframe);
  }

  root.addEventListener('click', load);
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      load();
    }
  });
})();
