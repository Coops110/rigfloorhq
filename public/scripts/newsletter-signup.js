(function () {
  // Delegated listener: covers every .newsletter-form on the page (a page
  // can carry two instances — an inline one plus the Footer's own copy) and
  // survives this script tag being present more than once, since the guard
  // below means only the first occurrence actually attaches anything.
  if (window.__newsletterSignupInit) return;
  window.__newsletterSignupInit = true;
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.newsletter-form');
    if (!form) return;
    // Buttondown's embed pattern: the form's own target="popupwindow"
    // submits it into a named window, and this open() call is what actually
    // creates that window first. Deliberately not preventDefault() — the
    // native form submission is still what delivers the POST.
    window.open('https://buttondown.com/api/emails/embed-subscribe/ccooperh', 'popupwindow');
  });
})();
