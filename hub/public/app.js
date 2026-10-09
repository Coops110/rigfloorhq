(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const updated = $('#updated');
  const brandTpl = $('#brand-tpl');
  const cardTpl = $('#card-tpl');
  const METRICS = [['views', 'Views'], ['likes', 'Likes'], ['comments', 'Comments'], ['shares', 'Shares']];
  const PROVIDER_ORDER = ['meta', 'tiktok', 'youtube', 'pinterest'];

  const fmt = (n) => {
    if (n === null || n === undefined) return '–';
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
    if (a >= 1e4) return (n / 1e3).toFixed(0) + 'k';
    if (a >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return String(n);
  };
  const signed = (n) => (n > 0 ? '+' : '') + fmt(n);
  const rel = (ts) => {
    if (!ts) return 'never';
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    return `${Math.floor(s / 86400)} d ago`;
  };
  const shortDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };

  async function load() {
    const res = await fetch('/api/stats', { cache: 'no-store' });
    if (res.status === 401) { location.href = '/'; return; }
    render(await res.json());
  }

  function render(snap) {
    app.replaceChildren();
    updated.textContent = snap.generated_at ? `updated ${rel(snap.generated_at)}` : 'no data yet';
    for (const brand of snap.brands || []) {
      const node = brandTpl.content.cloneNode(true);
      $('.brand-name', node).textContent = brand.name;
      const site = $('.brand-site', node);
      if (brand.site) { site.href = brand.site; site.textContent = brand.site.replace(/^https?:\/\//, ''); }
      const btn = $('.brand-refresh', node);
      btn.addEventListener('click', () => refresh([brand.id], btn));
      renderStatusStrip($('.status-strip', node), brand);
      const cards = $('.cards', node);
      if (!brand.networks.length) {
        const p = document.createElement('p');
        p.className = 'muted small';
        p.textContent = brand.generated_at ? 'No networks configured.' : 'Not refreshed yet.';
        cards.append(p);
      }
      for (const n of brand.networks) cards.append(card(n));
      app.append(node);
    }
    renderConnections(snap);
  }

  function card(n) {
    const node = cardTpl.content.cloneNode(true);
    const art = $('.card', node);
    $('.net', node).textContent = n.label;
    const h = $('.handle', node);
    h.textContent = n.handle ? (n.handle.startsWith('@') || n.network === 'facebook' || n.network === 'youtube' ? n.handle : `@${n.handle}`) : 'not set';
    if (n.link) h.href = n.link; else h.removeAttribute('href');

    if (!n.ok) {
      art.classList.add('err');
      $('.followers', node).remove();
      $('.profile-stats', node).remove();
      $('.totals', node).remove();
      $('.posts', node).remove();
      const p = $('.note', node);
      p.className = 'error';
      p.textContent = n.error || 'No data';
      return node;
    }

    $('.big', node).textContent = fmt(n.profile?.followers);
    const d = $('.delta', node);
    if (n.delta && typeof n.delta.followers === 'number') {
      d.textContent = `${signed(n.delta.followers)} in ${n.delta.days}d`;
      d.classList.add(n.delta.followers > 0 ? 'up' : n.delta.followers < 0 ? 'down' : 'flat');
    } else d.remove();

    const profileStats = $('.profile-stats', node);
    for (const { label, value } of n.profile?.extra || []) {
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML = `<span class="v"></span><span class="k"></span>`;
      $('.v', el).textContent = fmt(value);
      $('.k', el).textContent = label;
      profileStats.append(el);
    }

    const totals = $('.totals', node);
    for (const [key, label] of METRICS) {
      const el = document.createElement('div');
      el.className = 'stat';
      const v = n.totals?.[key];
      const dv = n.delta?.[key];
      el.innerHTML = `<span class="v"></span><span class="k"></span><span class="d"></span>`;
      $('.v', el).textContent = fmt(v);
      $('.k', el).textContent = label;
      const dd = $('.d', el);
      if (typeof dv === 'number' && dv !== 0) { dd.textContent = signed(dv); dd.classList.add(dv > 0 ? 'up' : 'down'); }
      el.title = `${label} across the last ${n.totals?.posts ?? 0} posts`;
      totals.append(el);
    }

    const note = $('.note', node);
    note.textContent = (n.notes || []).join(' ');

    const list = $('.post-list', node);
    $('summary', node).textContent = `Recent posts (${n.posts?.length || 0})`;
    for (const p of n.posts || []) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'post';
      a.href = p.url || n.link || '#';
      a.target = '_blank';
      a.rel = 'noopener';
      if (p.thumb) {
        const img = document.createElement('img');
        img.src = p.thumb; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
        a.append(img);
      } else {
        const ph = document.createElement('span'); ph.className = 'ph'; a.append(ph);
      }
      const body = document.createElement('div');
      const t = document.createElement('div');
      t.className = 't';
      t.textContent = p.title || '(no caption)';
      const m = document.createElement('div');
      m.className = 'm';
      m.innerHTML = `<span class="dt"></span>` + METRICS.map(([k, l]) => `<span title="${l}"><b></b> ${l.toLowerCase()}</span>`).join('');
      $('.dt', m).textContent = shortDate(p.date);
      const bs = m.querySelectorAll('b');
      METRICS.forEach(([k], i) => { bs[i].textContent = fmt(p[k]); });
      body.append(t, m);
      a.append(body);
      li.append(a);
      list.append(li);
    }
    return node;
  }

  function renderStatusStrip(el, brand) {
    el.replaceChildren();
    const items = [];
    if (brand.health) {
      const h = brand.health;
      items.push({ cls: h.ok ? 'up' : 'down', text: h.ok ? `Up · ${h.ms}ms` : `Down${h.status ? ' · ' + h.status : ''}` });
    }
    if (brand.search && !brand.search.error) items.push({ cls: 'flat', text: `${fmt(brand.search.clicks)} search clicks/7d` });
    if (brand.analytics && !brand.analytics.error) items.push({ cls: 'flat', text: `${fmt(brand.analytics.sessions)} sessions/7d` });
    if (!items.length) { el.hidden = true; return; }
    el.hidden = false;
    for (const it of items) {
      const span = document.createElement('span');
      span.className = `status-item ${it.cls}`;
      span.textContent = it.text;
      el.append(span);
    }
  }

  async function loadLinks() {
    const grid = $('#links-grid');
    try {
      const links = await (await fetch('/api/links')).json();
      grid.replaceChildren();
      for (const l of links) {
        const a = document.createElement('a');
        a.className = 'link-btn';
        a.href = l.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = l.label;
        grid.append(a);
      }
    } catch (e) {
      grid.textContent = `Could not load links: ${e.message}`;
    }
  }

  function renderConnections(snap) {
    const provs = $('#providers');
    provs.replaceChildren();
    const providers = snap.providers || {};
    for (const id of PROVIDER_ORDER) {
      const p = providers[id] || { label: id, configured: false };
      const row = document.createElement('div');
      row.className = 'prov' + (p.configured ? '' : ' off');
      row.innerHTML = `<div class="pl"><strong></strong><small></small></div><a></a>`;
      $('strong', row).textContent = p.label;
      $('small', row).textContent = p.configured ? 'Connect another account or reconnect an expired one.' : 'App credentials not set on the Worker yet.';
      const a = $('a', row);
      a.textContent = 'Connect';
      a.href = `/auth/${id}`;
      provs.append(row);
    }
    const un = $('#unassigned');
    un.replaceChildren();
    if (snap.unassigned?.length) {
      const box = document.createElement('div');
      box.className = 'unassigned';
      box.innerHTML = `<strong>Connected but not in config.js yet</strong><ul></ul>`;
      const ul = $('ul', box);
      for (const a of snap.unassigned) {
        const li = document.createElement('li');
        li.innerHTML = `<span></span> <code></code>`;
        $('span', li).textContent = `${a.network}: ${a.name || ''}`;
        $('code', li).textContent = a.handle || '';
        ul.append(li);
      }
      un.append(box);
    }
  }

  async function refresh(ids, btn) {
    const buttons = btn ? [btn] : [$('#refresh')];
    for (const b of buttons) { b.disabled = true; b.dataset.label = b.textContent; b.textContent = 'Refreshing…'; }
    try {
      // One request per brand: each Worker invocation gets its own subrequest budget.
      await Promise.all(ids.map((id) => fetch(`/api/refresh?brand=${encodeURIComponent(id)}`, { method: 'POST' })));
      await load();
    } catch (e) {
      updated.textContent = `refresh failed: ${e.message}`;
    } finally {
      for (const b of buttons) { b.disabled = false; b.textContent = b.dataset.label; }
    }
  }

  $('#refresh').addEventListener('click', async () => {
    const brands = await (await fetch('/api/brands')).json();
    refresh(brands.map((b) => b.id));
  });

  load().catch((e) => { $('#loading').textContent = `Could not load: ${e.message}`; });
  loadLinks();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) load().catch(() => {}); });
})();
