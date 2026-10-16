(function () {
  // These two values come from src/lib/site.js (CONSENT_STORAGE_KEY,
  // CONSENT_BANNER_SCOPE) and are build-time constants, not per-request
  // data, so they are safe to hardcode here rather than pass in via
  // define:vars. If either changes in src/lib/site.js, update this file
  // to match.
  var CONSENT_STORAGE_KEY = 'rigfloorhq_consent_v1';
  var CONSENT_BANNER_SCOPE = 'eu';

  var banner = document.getElementById('consent-banner');
  if (!banner) return;

  // Everything below was running synchronously the moment this deferred
  // script executed — right in the DOMContentLoaded window where the audit
  // measured a long task up to 188ms. None of it is needed before the
  // visitor can actually interact with the page, so it's wrapped in init()
  // and scheduled on idle instead. The pointerdown/keydown/touchstart/scroll
  // listeners below still catch an immediate interaction (e.g. clicking the
  // footer's "Cookie settings" link fires pointerdown before click, so
  // window.rigFloorHQOpenConsent exists by the time the click handler reads
  // it) — same deferral pattern BaseLayout.astro uses for gtag.js.
  if (window.__consentBannerInit) return;
  function init() {
    if (window.__consentBannerInit) return;
    window.__consentBannerInit = true;
    runConsentBanner();
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(init, { timeout: 1500 });
  } else {
    setTimeout(init, 150);
  }
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
    window.addEventListener(evt, init, { once: true, passive: true });
  });

  function runConsentBanner() {
  var mainView = document.getElementById('consent-view-main');
  var settingsView = document.getElementById('consent-view-settings');
  var acceptBtn = document.getElementById('consent-accept');
  var rejectBtn = document.getElementById('consent-reject');
  var openSettingsBtn = document.getElementById('consent-open-settings');
  var backBtn = document.getElementById('consent-back');
  var saveBtn = document.getElementById('consent-save');
  var toggle = document.getElementById('consent-analytics-toggle');
  var lastFocused = null;

  function setToggle(on) {
    toggle.setAttribute('aria-checked', on ? 'true' : 'false');
  }
  function toggleIsOn() {
    return toggle.getAttribute('aria-checked') === 'true';
  }
  // <label for> already forwards a click to a <button> natively
  // (button is a labelable element) — no separate listener needed on
  // the label itself.
  if (toggle) {
    toggle.addEventListener('click', function () { setToggle(!toggleIsOn()); });
  }

  function showMainView() {
    settingsView.hidden = true;
    mainView.hidden = false;
    if (openSettingsBtn) openSettingsBtn.setAttribute('aria-expanded', 'false');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-body');
  }

  // The Analytics toggle always reflects the last saved choice (or the
  // off-by-default state for a first-time visitor) when settings opens.
  function showSettingsView() {
    var saved = read();
    setToggle(!!(saved && saved.choice === 'accepted'));
    mainView.hidden = true;
    settingsView.hidden = false;
    if (openSettingsBtn) openSettingsBtn.setAttribute('aria-expanded', 'true');
    banner.setAttribute('aria-labelledby', 'consent-settings-title');
    banner.removeAttribute('aria-describedby');
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || 'null');
    } catch (e) { return null; }
  }

  function save(choice) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        choice: choice,
        at: new Date().toISOString(),
      }));
    } catch (e) { /* private mode — choice applies to this page view only */ }
  }

  // Rough client-side region check, used only to decide whether to SHOW
  // the banner. Whether storage is actually allowed is handled by Consent
  // Mode's server-side region matching, so a wrong guess here cannot
  // cause a consent violation.
  function probablyNeedsBanner() {
    if (CONSENT_BANNER_SCOPE === 'all') return true;
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return /^(Europe|Atlantic\/(Canary|Madeira|Faroe|Azores)|Arctic\/Longyearbyen)/.test(tz);
    } catch (e) {
      return true; // uncertain → show it
    }
  }

  // Consent Mode stops sending identifiers but does NOT remove cookies
  // already written. Withdrawing consent should actually clear them, so
  // wipe Google's analytics cookies on decline. They are set on the
  // registrable domain, so expire against both host and .domain.
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var parent = host.replace(/^www\./, '');
    var domains = [host, '.' + parent, parent];
    document.cookie.split(';').forEach(function (raw) {
      var name = raw.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  function apply(choice) {
    var state = choice === 'accepted' ? 'granted' : 'denied';
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
        analytics_storage: state,
      });
    }
    if (state === 'denied') clearAnalyticsCookies();
  }

  // takeFocus is true only when the visitor deliberately reopens this
  // from the footer. On the automatic first-visit show we deliberately
  // do NOT move focus: yanking a keyboard user out of the page they just
  // opened is hostile, and nothing here is urgent enough to justify it.
  function show(view, takeFocus) {
    lastFocused = document.activeElement;
    banner.hidden = false;
    if (view === 'settings') showSettingsView(); else showMainView();
    // Force a reflow so the transition still runs from the hidden state,
    // then reveal synchronously. requestAnimationFrame would be cleaner,
    // but it is paused while the tab is in the background — a page opened
    // in a background tab would leave the banner permanently at opacity 0
    // while still being exposed to assistive tech as an open dialog.
    void banner.offsetWidth;
    banner.classList.add('is-visible');
    if (takeFocus) {
      var focusTarget = view === 'settings' ? backBtn : acceptBtn;
      if (focusTarget) focusTarget.focus();
    }
  }

  function hide() {
    banner.classList.remove('is-visible');
    var done = function () {
      banner.hidden = true;
      banner.removeEventListener('transitionend', done);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };
    banner.addEventListener('transitionend', done);
    setTimeout(done, 400); // fallback if transitions are disabled
  }

  function choose(choice) {
    save(choice);
    apply(choice);
    hide();
  }

  if (acceptBtn) acceptBtn.addEventListener('click', function () { choose('accepted'); });
  if (rejectBtn) rejectBtn.addEventListener('click', function () { choose('declined'); });
  if (saveBtn) saveBtn.addEventListener('click', function () { choose(toggleIsOn() ? 'accepted' : 'declined'); });

  // The banner is already visible for these two, so a direct focus()
  // is fine — reopening from the footer is the only case that needs
  // the reflow-safe deferral show() handles above.
  if (openSettingsBtn) openSettingsBtn.addEventListener('click', function () {
    showSettingsView();
    if (backBtn) backBtn.focus();
  });
  if (backBtn) backBtn.addEventListener('click', function () {
    showMainView();
    if (acceptBtn) acceptBtn.focus();
  });

  // Esc dismisses without consenting — same effect as leaving Analytics
  // off for this visit, but deliberately not saved, so we ask again
  // next time.
  banner.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { apply('declined'); hide(); }
  });

  // Right to withdraw consent — the footer link calls this. Reopening is
  // a deliberate action, so here we do move focus into the dialog,
  // straight into settings since that's what the footer link is for.
  window.rigFloorHQOpenConsent = function () { show('settings', true); };

  if (!read() && probablyNeedsBanner()) show('main', false);
  } // end runConsentBanner
})();
