/* ===================== Fit-Gap ERP – komponenty interfejsu ===================== */
const IC = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', check: '<path d="M20 6 9 17l-5-5"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>', plus: '<path d="M12 5v14M5 12h14"/>', left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>', dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  warn: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
  save: '<path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v3h16v-3"/>', load: '<path d="M12 15V3m0 0L8 7m4-4 4 4"/><path d="M4 17v3h16v-3"/>',
  sheet: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>', print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  play: '<path d="M7 4v16l13-8z"/>', bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', doc: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  focus: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="3"/>', swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  xc: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>', minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'
};
const ic = (n, c) => `<svg class="ic${c ? ' ' + c : ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
const pic = (n, c) => `<svg class="pi${c ? ' ' + c : ''}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${PI[n] || PI.briefcase}</svg>`;
const tile = (a, sz) => `<span class="tile ${esc(a.c || 'c-gray')}${sz ? ' ' + sz : ''}">${pic(a.i || 'briefcase')}</span>`;
const MARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h12M12.5 4.5 16 8l-3.5 3.5"/><path d="M20 16H8M11.5 12.5 8 16l3.5 3.5"/></svg>';
const F_PROC = ['{n} proces', '{n} procesy', '{n} procesów'], F_RISK = ['{n} ryzyko', '{n} ryzyka', '{n} ryzyk'], F_REQ = ['{n} wymaganie', '{n} wymagania', '{n} wymagań'];
const F_AREA = ['{n} obszar', '{n} obszary', '{n} obszarów'], F_GAP = ['{n} luka', '{n} luki', '{n} luk'], F_Q = ['{n} pytanie', '{n} pytania', '{n} pytań'];
const F_MD = ['{n} osobodzień', '{n} osobodni', '{n} osobodni'], F_CHG = ['{n} zmiana', '{n} zmiany', '{n} zmian'], F_PER = ['{n} osoba', '{n} osoby', '{n} osób'];

/* ---------- aktualizacja DOM bez utraty fokusu (porównanie drzew) ---------- */
const TPL = document.createElement('template');
const keyOf = n => n.nodeType === 1 ? (n.getAttribute('data-key') || n.id || null) : null;
function syncAttrs(a, b) {
  for (const at of Array.from(a.attributes)) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
  for (const at of Array.from(b.attributes)) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
  const t = a.tagName;
  if (t === 'INPUT') { if (a.type === 'checkbox' || a.type === 'radio') a.checked = b.hasAttribute('checked');
    else if (document.activeElement !== a) { const v = b.getAttribute('value') || ''; if (a.value !== v) a.value = v; } }
  else if (t === 'TEXTAREA') { if (document.activeElement !== a) { const v = b.textContent; if (a.value !== v) a.value = v; } }
  else if (t === 'DETAILS') a.open = b.hasAttribute('open');
}
function morphKids(a, b) {
  if (a.tagName === 'TEXTAREA') return;
  const bc = Array.from(b.childNodes), amap = {}, want = new Set();
  bc.forEach(n => { const k = keyOf(n); if (k) want.add(k); });
  // najpierw usuwamy węzły z kluczem, których nie ma w nowym widoku – zachowane węzły nie są wtedy przenoszone (przeniesienie węzła anuluje rozpoczęte kliknięcie)
  Array.from(a.childNodes).forEach(n => { const k = keyOf(n); if (k) { if (want.has(k)) amap[k] = n; else a.removeChild(n); } });
  bc.forEach((bn, j) => {
    let an = a.childNodes[j]; const k = keyOf(bn);
    if (k) { const m = amap[k]; if (m && m.parentNode === a) { if (m !== an) { a.insertBefore(m, an || null); an = m; } } else an = null; }
    else if (an && keyOf(an)) an = null;
    if (!an) { a.insertBefore(bn, a.childNodes[j] || null); return; }
    if (an.nodeType !== bn.nodeType || an.nodeName !== bn.nodeName) { a.replaceChild(bn, an); return; }
    if (an.nodeType !== 1) { if (an.nodeValue !== bn.nodeValue) an.nodeValue = bn.nodeValue; return; }
    let sel = null; if (an.tagName === 'SELECT') { const o = Array.from(bn.querySelectorAll('option')).find(x => x.hasAttribute('selected')); sel = o ? o.getAttribute('value') : null; }
    syncAttrs(an, bn); morphKids(an, bn);
    if (an.tagName === 'SELECT' && document.activeElement !== an) { const v = sel != null ? sel : (an.options[0] ? an.options[0].value : ''); if (an.value !== v) an.value = v; }
  });
  while (a.childNodes.length > bc.length) a.removeChild(a.lastChild);
}
function paint(el, html) { TPL.innerHTML = html; morphKids(el, TPL.content); }

/* ---------- powiadomienia, dymki, okna ---------- */
function toast(msg) { const t = $('#toast'), d = document.createElement('div'); d.textContent = msg; t.appendChild(d); setTimeout(() => d.remove(), 4200); }
const tipEl = () => $('#tip');
function showTip(el, b, s) {
  const tip = tipEl(); tip.innerHTML = `<b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}`; tip.hidden = false;
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  const x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)); let y = r.top - h - 8; if (y < 8) y = r.bottom + 8;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
const hideTip = () => { tipEl().hidden = true; };
function openModal(kind, arg) { V.modal = Object.assign({kind}, arg || {}); V.menu = false; renderModal(); }
function closeModal() { if (V.modal && V.modal.kind === 'who' && (!known() || needKey())) return; const back = V.modal && V.modal.back; V.modal = null; renderModal(); if (back) { const el = $(back); if (el) el.focus(); } }
function confirmBox(title, text, btn, run) { openModal('confirm', {title, text, btn, run}); }
function syncChip() {
  if (!SH.on) return '';
  const L = {ok: ['Wspólna baza', SH.at ? `Zsynchronizowano ${SH.at.toLocaleTimeString(LOC)}. Kliknij, aby odświeżyć.` : ''],
    busy: ['Synchronizacja…', ''], pending: ['Zapisywanie…', ''], err: ['Brak połączenia', 'Zmiany są zapisane w tej przeglądarce i zostaną wysłane po odzyskaniu połączenia.'],
    auth: SH.mode === 'access' ? ['Zaloguj się ponownie', 'Sesja logowania wygasła. Kliknij, aby odświeżyć stronę.'] : ['Podaj hasło zespołu', 'Bez hasła zespołu dane nie trafiają do wspólnej bazy.'],
    config: ['Serwer nieskonfigurowany', 'Ustaw hasło zespołu w pliku config.php albo bazę D1 w projekcie Cloudflare.']}[SH.st || 'busy'] || ['', ''];
  return `<button type="button" class="btn ghost sync s-${SH.st || 'busy'}" id="sync" data-act="sync" title="${esc(L[1] || L[0])}"><i class="dot" aria-hidden="true"></i><span class="t">${esc(L[0])}</span></button>`;
}

/* ---------- nawigacja ---------- */
const href = (step, aid, cid) => '#c/' + (cid || V.cid) + '/' + step + (aid ? '/' + aid : '');
const hrefDoc = (cid, aid) => '#c/' + (cid || V.cid) + (aid ? '/agenda/' + aid : '/raport');
function stepSub(i, x) {
  if (i === 1) return x.t ? `eksperci: ${x.n}/${x.t}` : 'wybierz obszary';
  if (i === 4) return x.t ? `uzupełnione: ${x.n}/${x.t}` : 'brak luk';
  if (i === 6) return `ocenione: ${x.n}/${x.t}`;
  if (!x.t) return '–';
  return {2: 'potwierdzone', 3: 'ocenione', 5: 'przejrzane', 7: 'potwierdzone'}[i] + `: ${x.n}/${x.t}`;
}
function renderTop() {
  const c = V.cid ? analysis(V.cid) : null;
  let bar = '';
  if (c) {
    const m = model(c.k), pr = progress(m, V.aid);
    const steps = [1, 2, 3, 4, 5, 6, 7].map(i => { const x = pr.st[i], lock = i > 1 ? gate(m, V.aid, i) : 0;
      const ok = i < NS ? !lock && (x.t > 0 || (i === 4 && pr.st[3].t > 0 && pr.st[3].n === pr.st[3].t)) && !required(m, i, V.aid).length : x.t > 0 && x.n === x.t;
      return `<a class="stp${ok ? ' ok' : ''}${lock ? ' lk' : ''}" href="${href(i, V.aid)}"${!V.doc && V.step === i ? ' aria-current="step"' : ''}${lock ? ` title="Najpierw uzupełnij wymagane pola w kroku ${lock}"` : ''}><span class="k">${ok ? ic('check') : i}</span><span class="l"><b>${esc(STEPS[i])}</b><small>${esc(stepSub(i, x))}</small></span></a>`; }).join('');
    bar = `<div class="cbar"><nav class="crumb" aria-label="Ścieżka"><a href="#start" class="root" title="Analizy" aria-label="Analizy">${pic('arrows-left-right')}<span>Analizy</span></a>${ic('right')}<label class="cosel" title="Zmień analizę"><b>${esc(c.n)}</b>${ic('down')}<select data-act="ansel" aria-label="Zmień analizę">${analyses().map(x => `<option value="${esc(x.k)}"${x.k === c.k ? ' selected' : ''}>${esc(x.n)}</option>`).join('')}</select></label></nav>
      <nav class="stepper" aria-label="Etapy analizy fit-gap">${steps}</nav></div>`;
  }
  paint($('#top'), `<div class="topin">
    <a class="brand" href="#start"><span class="mk">${MARK}</span><span><b>Analiza Fit-Gap ERP</b><span>dopasowanie procesów do systemu docelowego · wersja ${esc(VER)}</span></span></a>
    <span class="grow"></span>
    <div class="tools">
      ${syncChip()}
      ${known() ? `<button type="button" class="btn ghost user" data-act="who" title="${esc(S.who)} – zmień imię lub rolę">${ic('user')}<span class="t">${esc(S.name)} <small>${esc(S.team)}</small></span></button>` : ''}
      ${c ? `<a class="btn pri" href="${hrefDoc(c.k)}">${ic('doc')}<span class="t">Raport końcowy</span></a>` : ''}
      <div class="menu"><button type="button" class="btn icon" data-act="menu" aria-expanded="${V.menu}" aria-label="Dane i ustawienia" title="Dane i ustawienia">${ic('dots')}</button>
        <div class="pop"${V.menu ? '' : ' hidden'}>
          ${c ? `<button type="button" data-act="xlsx">${ic('sheet')}<span>Raport Excel<small>Wymagania, luki, zmiany, ryzyka i wartość – ${esc(trunc(c.n, 40))}</small></span></button><hr>` : ''}
          <button type="button" data-act="save">${ic('save')}<span>Zapisz dane do pliku<small>Kopia zapasowa lub przekazanie innej osobie</small></span></button>
          <button type="button" data-act="load">${ic('load')}<span>Wczytaj dane z pliku<small>Nowsze wpisy zastępują starsze</small></span></button>
          <hr>
          <button type="button" data-act="scales">${ic('grid')}<span>Skale oceny<small>Dopasowanie, sposób zamknięcia luki, priorytet, pracochłonność</small></span></button>
          ${SH.on ? '' : `<hr><button type="button" data-act="reset">${ic('trash')}<span>Wyczyść dane w tej przeglądarce<small>Usuwa wszystkie wpisy zapisane lokalnie</small></span></button>`}
        </div></div>
      <button type="button" class="btn icon ghost" data-act="help" aria-label="Pomoc" title="Pomoc">${ic('help')}</button>
    </div></div>${bar}`);
}
function renderSide() {
  const wrap = $('#wrap'), side = $('#side');
  if (!V.cid || V.doc) { wrap.classList.add('full'); paint(side, ''); return; }
  wrap.classList.remove('full');
  const m = model(V.cid), all = progress(m, '');
  const items = m.inArea.map(a => { const pr = progress(m, a.k), cur = V.aid === a.k, exp = [a.ecc ? a.ecc.n : '', a.ecp ? a.ecp.n : ''].filter(Boolean).join(' · ');
    return `<li data-key="a-${esc(a.k)}"><a href="${href(V.step, a.k)}"${cur ? ' aria-current="true"' : ''}>${tile(a, 's')}<span class="nm">${esc(a.n)}</span><span class="ow${exp ? '' : ' nobody'}">${esc(exp || 'brak ekspertów')}</span><span class="st${a.sg ? ' ok' : ''}" title="${a.sg ? 'Wyniki potwierdzone' : 'Postęp: ' + pr.pct + '%'}">${a.sg ? ic('checkc') : `<span class="ring" style="--p:${pr.pct}" aria-label="Postęp ${pr.pct}%"></span>`}</span></a></li>`; }).join('');
  const later = m.later.length, out = m.areas.filter(a => a.on === 'N').length;
  paint(side, `<h2>Obszary</h2><div class="sub">${m.inArea.length ? `W zakresie: ${m.inArea.length} z ${m.areas.length}` : 'Wskaż obszary w kroku 1'}</div>
    <ul class="alist" aria-label="Filtr obszaru">
      <li data-key="a-all"><a href="${href(V.step, '')}" class="all"${!V.aid ? ' aria-current="true"' : ''}><span class="tile s c-navy">${pic('squares-four')}</span><span class="nm">Wszystkie obszary</span><span class="ow">${esc(m.co.srcCo)} → ${esc(m.co.tgtCo)}</span><span class="st"><span class="ring" style="--p:${all.pct}" aria-label="Postęp ${all.pct}%"></span></span></a></li>
      ${items}</ul>
    ${(later || out) && m.inArea.length ? `<div class="sfoot">${later ? 'Kolejny etap: ' + later : ''}${later && out ? ' · ' : ''}${out ? 'Poza zakresem: ' + out : ''} · <a href="${href(1, '')}">zmień</a></div>` : ''}`);
}
function mobileSelect(m) {
  return `<select class="inp mselect" data-act="msel" aria-label="Obszar"><option value="">Wszystkie obszary</option>${m.inArea.map(a => `<option value="${esc(a.k)}"${V.aid === a.k ? ' selected' : ''}>${esc(a.n)}</option>`).join('')}</select>`;
}

/* ---------- elementy formularzy ---------- */
const fval = (x, k) => x && x[k] != null ? x[k] : '';
/* pola wymagane: gwiazdka przy etykiecie, aria-required; po próbie przejścia dalej – podświetlenie braków (MISS) */
let MISS = new Set();
const rq = t => t + '<span class="rq" aria-hidden="true">*</span>';
const reqA = (id, f, o) => `${o.req ? ' aria-required="true"' : ''}${o.bad || MISS.has(id + '#' + f) ? ' aria-invalid="true"' : ''}`;
const inpF = (id, f, val, o = {}) => `<input class="inp${o.num ? ' num' : ''}${o.cls ? ' ' + o.cls : ''}" ${o.type ? `type="${o.type}"` : ''} data-act="f" data-id="${esc(id)}" data-f="${f}"${o.num ? ' data-num="1" inputmode="decimal"' : ''} value="${esc(val)}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.list ? ` list="${o.list}"` : ''}${o.label ? ` aria-label="${esc(o.label)}"` : ''}${o.id ? ` id="${o.id}"` : ''}${reqA(id, f, o)}${o.attrs || ''} maxlength="${o.max || 300}" autocomplete="off">`;
const txtF = (id, f, val, o = {}) => `<textarea class="inp" data-act="f" data-id="${esc(id)}" data-f="${f}" rows="${o.rows || 2}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.label ? ` aria-label="${esc(o.label)}"` : ''}${o.id ? ` id="${o.id}"` : ''}${reqA(id, f, o)} maxlength="${o.max || 4000}">${esc(val)}</textarea>`;
const selF = (id, f, val, opts, o = {}) => `<select class="inp" data-act="f" data-id="${esc(id)}" data-f="${f}"${o.label ? ` aria-label="${esc(o.label)}"` : ''}${reqA(id, f, o)}>${o.empty != null ? `<option value=""${val === '' || val == null ? ' selected' : ''}>${esc(o.empty)}</option>` : ''}${opts.map(([v, l]) => `<option value="${esc(v)}"${String(val) === String(v) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
const fld = (label, inner, cls) => `<label class="fld${cls ? ' ' + cls : ''}"><span>${label}</span>${inner}</label>`;
const segB = (act, cur, opts, attrs, cls) => `<div class="seg${cls ? ' ' + cls : ''}" role="group">${opts.map(([v, l, c, tip]) => `<button type="button" class="${c || ''}" data-act="${act}" data-v="${esc(v)}" ${attrs || ''} aria-pressed="${String(cur) === String(v)}"${tip ? ` title="${esc(tip)}"` : ''}>${l}</button>`).join('')}</div>`;
function tagsHtml(o) {
  const key = 'tgi-' + o.act + '-' + (o.ctx || (o.attrs || '').replace(/[^A-Za-z0-9_-]/g, ''));
  return `<div class="tags${o.bad ? ' bad' : ''}" data-act="tagbox">${o.items.map((x, i) => `<span class="tg" data-key="tg-${i}-${esc(slug(x.t))}"><span>${esc(x.t)}</span><button type="button" class="tgx" data-act="${o.act}-rm" data-i="${i}" ${o.attrs || ''} aria-label="Usuń: ${esc(x.t)}">${ic('x')}</button></span>`).join('')}<input class="tgi" data-key="${esc(key)}" data-act="${o.act}" ${o.attrs || ''}${o.list ? ` list="${o.list}"` : ''} placeholder="${esc(o.items.length ? (o.ph2 || '') : o.ph || '')}" aria-label="${esc(o.label)}"${o.req ? ' aria-required="true"' : ''}${o.bad ? ' aria-invalid="true"' : ''} autocomplete="off" enterkeyhint="done" maxlength="120"></div>`;
}
const dl = (id, items) => `<datalist id="${id}">${uniq(items.filter(Boolean)).map(x => `<option value="${esc(x)}"></option>`).join('')}</datalist>`;

/* ---------- status dopasowania, paski, znaczniki ---------- */
const fsTag = st => FITBY[st] ? `<span class="fs ${st}"><i></i>${esc(FITBY[st].n)}</span>` : '<span class="fs"><i></i>bez oceny</span>';
const FORD = ['F', 'P', 'G', 'O', 'N'];
function fbarHtml(c, lg) {
  const t = c.t || 1, segs = FORD.filter(k => c[k]).map(k => `<i class="${k}" style="width:${(c[k] / t * 100).toFixed(2)}%"></i>`).join('');
  return `<span class="fbar${lg ? ' lg' : ''}" role="img" aria-label="${esc(FORD.map(k => FITBY[k].n + ': ' + c[k]).join(', ') + ', bez oceny: ' + c.U)}">${segs}</span>`;
}
const fleg = () => `<div class="fleg">${FORD.map(k => `<span><i class="${k}"></i>${esc(FITBY[k].n)}</span>`).join('')}<span><i class="U"></i>bez oceny</span></div>`;
const priTag = k => PRIBY[k] ? `<span class="tag ${k === 'M' ? 'err' : k === 'S' ? 'warn' : ''}" title="${esc(PRIBY[k].d)}">${esc(PRIBY[k].n)}</span>` : '';
const resTag = k => RESBY[k] ? `<span class="tag${k === 'proc' ? ' sig' : k === 'dev' || k === 'int' || k === 'wa' ? ' err' : ' acc'}" title="${esc(RESBY[k].d)}">${esc(RESBY[k].n)}</span>` : '';
const critTag = r => r.crit ? `<span class="critb" title="Luka krytyczna: Must, wymaga rozwoju AX, integracji albo obejścia">${ic('warn')}krytyczna</span>` : '';
const regTag = r => r.reg ? '<span class="regb" title="Wymaganie wynikające z przepisów">przepisy</span>' : '';
const pname = (m, k) => (m.OBY[k] || {}).n || '';

/* ---------- wykresy: mapa dopasowania obszarów, nakłady wg sposobu zamknięcia, mapa ryzyk ---------- */
function areaMap(m, s) {
  const rows = s.areas.map(a => { const rs = s.reqs.filter(r => r.a === a.k), c = cnt(rs), fi = fitIndex(rs);
    return `<div class="ar click" data-act="goto" data-step="3" data-a="${esc(a.k)}" data-tip="${esc(a.n)}" data-tip2="${esc(FORD.map(k => FITBY[k].n + ' ' + c[k]).join(' · ') + ' · bez oceny ' + c.U)}"><span class="nm">${esc(a.n)}</span>${fbarHtml(c, true)}<span class="v">${fi != null ? fpct(fi) : '–'}</span></div>`; }).join('');
  return `<div class="chart"><h3>Mapa dopasowania obszarów</h3><p class="cs">Rozkład ocen wymagań i indeks dopasowania (ważony priorytetem)</p><div class="amap">${rows || '<p class="muted sm">Brak obszarów w zakresie.</p>'}</div><div style="margin-top:10px">${fleg()}</div></div>`;
}
function effortBars(v) {
  const list = RES.map(x => Object.assign({k: x.k, n: x.n}, v.byRes[x.k])).filter(x => x.n);
  const mx = Math.max(1, ...list.map(x => x.md || 0));
  const rows = list.map(x => `<div class="hb${x.k === 'proc' ? ' proc' : ''}" data-tip="${esc(RESBY[x.k].n)}" data-tip2="${esc(plural(x.n, F_GAP) + ' · ' + plural(x.md, F_MD))}"><span>${esc(RESBY[x.k].n)} <small class="muted">(${x.n})</small></span><span class="t"><i style="width:${(x.md / mx * 100).toFixed(1)}%"></i></span><span class="v">${fnum(x.md)} md</span></div>`).join('');
  return `<div class="chart"><h3>Luki według sposobu zamknięcia</h3><p class="cs">Liczba luk i szacowana pracochłonność (osobodni)${v.noEff ? ` · bez oszacowania: ${v.noEff}` : ''}</p><div class="hbars">${rows || '<p class="muted sm" style="margin:0">Brak luk.</p>'}</div></div>`;
}
function heatMap(risks, title) {
  const open = risks.filter(r => r.score && r.st !== 'Z');
  let cells = '';
  for (let p = 4; p >= 1; p--) {
    cells += `<span class="yl">${esc(D.riskP[p - 1].n)}</span>`;
    for (let s = 1; s <= 4; s++) { const list = open.filter(r => +r.pr === p && +r.im === s), z = riskLv(p * s);
      const t = list.length ? plural(list.length, F_RISK) + ' · ' + D.riskLv[z].n : 'Brak ryzyk · ' + D.riskLv[z].n;
      cells += `<button type="button" class="hc z${z}${list.length ? ' has' : ''}" data-tip="${esc(t)}" data-tip2="${esc(list.length ? list.slice(0, 4).map(r => trunc(r.t || 'Ryzyko', 50)).join(' · ') + (list.length > 4 ? ' …' : '') : 'Prawdopodobieństwo: ' + D.riskP[p - 1].n + ', wpływ: ' + D.riskI[s - 1].n)}" aria-label="${esc(t)}">${list.length ? `<i>${list.length}</i>` : ''}</button>`; }
  }
  return `<div class="chart"><h3>${esc(title || 'Mapa ryzyk')}</h3><p class="cs">Otwarte ryzyka: ${open.length} · prawdopodobieństwo × wpływ</p>
    <div class="heat">${cells}<span></span>${[1, 2, 3, 4].map(s => `<span class="xl">${s}<br>${esc(D.riskI[s - 1].n)}</span>`).join('')}<span></span><span class="ax">Wpływ na migrację i działanie ${esc(analysis(V.cid) ? analysis(V.cid).srcCo : DEF.srcCo)}</span></div>
    <div class="hleg">${D.riskLv.map((l, i) => `<span><i class="sw v${i + 1}"></i>${esc(l.n)}</span>`).join('')}</div></div>`;
}

/* ---------- okna dialogowe ---------- */
function renderModal() {
  const m = $('#modal'), M = V.modal;
  if (!M) { m.hidden = true; m.innerHTML = ''; return; }
  m.hidden = false;
  const box = (title, body, cls) => `<div class="box${cls ? ' ' + cls : ''}" role="dialog" aria-modal="true" aria-labelledby="m-h"><div class="mh"><h2 id="m-h">${esc(title)}</h2><button type="button" class="btn icon ghost" data-act="close" aria-label="Zamknij">${ic('x')}</button></div><div class="mb">${body}</div></div>`;
  if (M.kind === 'who') {
    const req = !known() || needKey(), old = $('#who-form');
    const nm = old ? old.nm.value : S.name || '', tm = old ? (old.querySelector('input[name="team"]:checked') || {}).value : TEAMS.some(t => t.n === S.team) ? S.team : '';
    m.innerHTML = `<div class="box sm whobox" role="dialog" aria-modal="true" aria-labelledby="m-h"><form id="who-form" novalidate>
      <div class="mh"><h2 id="m-h">${req ? 'Kto pracuje w narzędziu?' : 'Zmień imię lub rolę'}</h2>${req ? '' : `<button type="button" class="btn icon ghost" data-act="close" aria-label="Zamknij">${ic('x')}</button>`}</div>
      <div class="mb">
        <label class="fl" for="who-nm">Imię i nazwisko</label><input id="who-nm" class="inp" name="nm" autocomplete="name" maxlength="60" value="${esc(nm)}" placeholder="np. Anna Kowalska">
        <fieldset><legend class="fl">Rola w analizie</legend><div class="teams" style="grid-template-columns:repeat(2,minmax(0,1fr))">${TEAMS.map(t => `<label><input type="radio" name="team" value="${esc(t.n)}"${tm === t.n ? ' checked' : ''}><span>${esc(t.n)}<small style="display:block;font-weight:400;font-size:.75rem;color:var(--muted)">${esc(t.d)}</small></span></label>`).join('')}</div></fieldset>
        ${needKey() ? `<label class="fl" for="who-key" style="margin-top:14px">Hasło zespołu</label><input id="who-key" class="inp" name="key" type="password" autocomplete="current-password" maxlength="200">` : ''}
        <div class="note">${ic('info')}<p>${SH.on ? 'Imię i rolę zapisujemy przy każdej zmianie. Dane trafiają do wspólnej bazy – widzą je wszyscy uczestnicy analizy.' : 'Imię i rolę zapisujemy przy każdej zmianie. Dane zostają w tej przeglądarce – możesz je zapisać do pliku i przekazać dalej.'} Ekspert ${esc(DEF.srcCo)} lub ${esc(DEF.tgtCo)} zobaczy swoją kolumnę wyróżnioną w ocenie fit-gap.</p></div>
        <p class="err" id="who-err" role="alert"></p>
        <div class="mf"><button type="submit" class="btn pri">${req ? 'Rozpocznij' : 'Zapisz'}</button></div>
      </div></form></div>`;
    const inp = old && known() && $('#who-key') ? $('#who-key') : $('#who-nm'); inp.focus();
    return;
  }
  if (M.kind === 'addan') {
    m.innerHTML = `<div class="box sm" role="dialog" aria-modal="true" aria-labelledby="m-h"><form id="addan-form" novalidate><div class="mh"><h2 id="m-h">Nowa analiza fit-gap</h2><button type="button" class="btn icon ghost" data-act="close" aria-label="Zamknij">${ic('x')}</button></div>
      <div class="mb" style="display:grid;gap:12px"><label class="fld"><span>Nazwa analizy</span><input class="inp" id="addan-nm" name="nm" maxlength="90" value="${esc(DEF.n)}" autocomplete="off"></label>
      <div class="fgrid">${fld('Spółka przenoszona', `<input class="inp" name="srcCo" maxlength="40" value="${esc(DEF.srcCo)}">`)}${fld('System źródłowy', `<input class="inp" name="srcSys" maxlength="60" value="${esc(DEF.srcSys)}">`)}
        ${fld('Spółka z systemem docelowym', `<input class="inp" name="tgtCo" maxlength="40" value="${esc(DEF.tgtCo)}">`)}${fld('System docelowy', `<input class="inp" name="tgtSys" maxlength="60" value="${esc(DEF.tgtSys)}">`)}</div>
      <p class="err" id="addan-err" role="alert"></p><div class="mf" style="margin-top:4px"><button type="button" class="btn" data-act="close">Anuluj</button><button type="submit" class="btn pri">${ic('plus')}Utwórz analizę</button></div></div></form></div>`;
    $('#addan-nm').focus(); $('#addan-nm').select(); return;
  }
  if (M.kind === 'confirm') {
    m.innerHTML = box(M.title, `<p style="margin:0;color:var(--ink2)">${esc(M.text)}</p><div class="mf"><button type="button" class="btn" data-act="close" id="cfm-no">Anuluj</button><button type="button" class="btn danger" data-act="cfm-ok">${ic('trash')}${esc(M.btn)}</button></div>`, 'sm');
    $('#cfm-no').focus(); return;
  }
  if (M.kind === 'scales') {
    const row = (a, b) => `<tr><td style="white-space:nowrap;font-weight:700">${a}</td><td>${b}</td></tr>`;
    m.innerHTML = box('Skale oceny', `<div class="help">
      <h3>Ocena dopasowania wymagania</h3><table class="mtx"><tbody>${FIT.map(f => row(fsTag(f.k), esc(f.d))).join('')}</tbody></table>
      <h3>Sposób zamknięcia luki</h3><table class="mtx"><tbody>${RES.map(r => row(esc(r.n), esc(r.d))).join('')}</tbody></table>
      <p class="sm muted">Luka krytyczna: ocena „Luka”, priorytet Must i zamknięcie przez ${CRITRES.map(k => resName(k).toLowerCase()).join(', ')}.</p>
      <h3>Priorytet (MoSCoW) i pracochłonność</h3><table class="mtx"><tbody>${PRI.map(p => row(esc(p.n), esc(p.d))).join('')}${EFF.map(e => row(esc(e.n), esc(e.d) + ' · w szacunku ' + plural(e.md, F_MD))).join('')}</tbody></table>
      <h3>Skala zmiany procesu w ${esc(DEF.srcCo)}</h3><table class="mtx"><tbody>${IMP.map(x => row(x.v + ' – ' + esc(x.n), esc(x.d))).join('')}</tbody></table>
      <h3>Indeks dopasowania i rekomendacja</h3><p>Indeks to średnia ocen wymagań (Fit = 1, Częściowe = ${D.fitW.P}, Luka = 0) ważona priorytetem (Must ×${D.priW.M}, Should ×${D.priW.S}, Could ×${D.priW.C}); „Nie dotyczy”, „Do wyjaśnienia” i wymagania wycofane nie wchodzą do indeksu.
      Propozycja rekomendacji: <b>${esc(VERDBY.go.n)}</b> – indeks co najmniej ${fpct(D.verdict.goFit)}, brak luk krytycznych i krytycznych ryzyk bez działań; <b>${esc(VERDBY.cond.n)}</b> – indeks co najmniej ${fpct(D.verdict.condFit)} i najwyżej ${D.verdict.condCrit} luk krytycznych; w pozostałych przypadkach – <b>${esc(VERDBY.nogo.n)}</b>. Przy ocenie mniej niż ${fpct(D.verdict.minCov)} wymagań narzędzie nie proponuje rekomendacji. Ostateczną rekomendację wpisuje zespół analizy.</p>
      <h3>Ocena ryzyka</h3><table class="mtx"><thead><tr><th>Prawdopodobieństwo</th><th>Wpływ</th></tr></thead><tbody>${D.riskP.map((p, i) => `<tr><td><b>${p.v} – ${esc(p.n)}</b><br><span class="muted">${esc(p.d)}</span></td><td><b>${D.riskI[i].v} – ${esc(D.riskI[i].n)}</b><br><span class="muted">${esc(D.riskI[i].d)}</span></td></tr>`).join('')}</tbody></table>
      <p class="sm muted">Poziom ryzyka = prawdopodobieństwo × wpływ: ${D.riskLv.map((l, i) => esc(l.n) + ' do ' + l.max).join(', ')}.</p></div>`);
    $('#modal [data-act="close"]').focus(); return;
  }
  if (M.kind === 'help') { m.innerHTML = box('Jak prowadzić analizę fit-gap w narzędziu', helpHtml()); $('#modal [data-act="close"]').focus(); return; }
}
function helpHtml() {
  return `<div class="help">
    <h3>Po co jest analiza fit-gap</h3><p>Analiza odpowiada na pytania: czy ${esc(DEF.srcCo)} może przejść z systemu ${esc(DEF.srcSys)} na ${esc(DEF.tgtSys)} używany w ${esc(DEF.tgtCo)}, jakie zmiany procesów musi wprowadzić ${esc(DEF.srcCo)}, co trzeba dobudować w systemie docelowym, jakie są ryzyka i jaką wartość da migracja. Punktem odniesienia jest szablon AX w ${esc(DEF.tgtCo)} – to, jak ${esc(DEF.tgtCo)} faktycznie pracuje w systemie, a nie standard producenta.</p>
    <h3>Przebieg analizy</h3><ol>
      <li><b>Zakres i zespół</b> – dane analizy, osoby (imię i nazwisko, zespół, rola; key userom przypisujesz obszary), obszary w zakresie, eksperci obu stron i uczestnicy. Dla każdego obszaru narzędzie przygotuje agendę i pytania do wysłania uczestnikom w załączniku e-maila.</li>
      <li><b>Procesy AS-IS</b> – które procesy z katalogu występują w ${esc(DEF.srcCo)}, właściciele, wolumeny, narzędzia, opis praktyki w obu spółkach i możliwość wspólnego standardu.</li>
      <li><b>Ocena fit-gap</b> – pytania z katalogu dla każdego procesu: praktyka ${esc(DEF.srcCo)}, praktyka ${esc(DEF.tgtCo)} w AX i ocena dopasowania. Tryb skupienia pokazuje jedno pytanie naraz – wygodny podczas spotkania z ekspertami.</li>
      <li><b>Luki i zmiany</b> – rejestr luk z pracochłonnością i decyzją oraz lista zmian procesowych w ${esc(DEF.srcCo)} (skala, kogo dotyczą, szkolenia).</li>
      <li><b>Ryzyka</b> – rejestr ryzyk z podpowiedziami: ryzyka typowe dla tej migracji, luki krytyczne i duże zmiany procesów.</li>
      <li><b>Wartość dodana</b> – korzyści migracji i szacunek nakładów (business case).</li>
      <li><b>Wynik</b> – indeks dopasowania, propozycja rekomendacji, rekomendacja zespołu, potwierdzenia ekspertów i zatwierdzenie sponsora. Raport końcowy do druku lub PDF i raport Excel.</li></ol>
    <h3>Ocena krok po kroku</h3><p>Wybierz obszar na liście po lewej – kolejne kroki pokażą tylko jego procesy, a ocenę jednego obszaru zakończysz bez czekania na pozostałe. W trybie skupienia klawisze <span class="kbd">1</span>–<span class="kbd">5</span> ustawiają ocenę (Fit, Częściowe, Luka, N/D, Do wyjaśnienia), <span class="kbd">←</span> <span class="kbd">→</span> przechodzą między pytaniami, a <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> w polu tekstowym przechodzi do następnego pytania.</p>
    <h3>Pola wymagane</h3><p>Pola z gwiazdką (*) trzeba uzupełnić przed przejściem do kolejnego kroku. Przycisk „Dalej” pokaże listę braków – kliknij pozycję, aby przejść do pola.</p>
    <h3>Słownik</h3><dl>
      <dt>Fit</dt><dd>Szablon AX w ${esc(DEF.tgtCo)} obsługuje wymaganie bez zmian.</dd>
      <dt>Luka (gap)</dt><dd>Wymaganie, którego szablon nie obsługuje – zamykane zmianą procesu w ${esc(DEF.srcCo)}, konfiguracją, rozwojem AX, integracją, raportem, migracją danych albo obejściem.</dd>
      <dt>Luka krytyczna</dt><dd>Luka z priorytetem Must, która wymaga rozwoju AX, integracji albo obejścia poza ERP.</dd>
      <dt>MoSCoW</dt><dd>Priorytet wymagania: Must, Should, Could.</dd>
      <dt>AS-IS</dt><dd>Obecny sposób realizacji procesu.</dd>
      <dt>FSSC</dt><dd>Centrum Usług Księgowych obsługujące obie spółki.</dd></dl>
    <h3>Zapisywanie danych i RODO</h3><p>${SH.on ? 'Dane zapisują się we wspólnej bazie i widzą je wszyscy uczestnicy analizy; zmiany innych osób pojawiają się co kilkanaście sekund. Plik z menu „…” służy jako kopia zapasowa.' : 'Dane zapisują się automatycznie w tej przeglądarce. Aby przekazać je innej osobie, użyj menu „…” → Zapisz dane do pliku; druga osoba wczytuje plik tym samym menu. Do pracy zespołowej uruchom wersję wieloosobową (instrukcja w README repozytorium).'} Narzędzie nie zbiera adresów e-mail – osoby opisuje imię i nazwisko. Agendę i pytania wysyłasz uczestnikom samodzielnie, w załączniku e-maila.</p>
  </div>`;
}
