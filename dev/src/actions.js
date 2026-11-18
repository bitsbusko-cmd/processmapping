/* ===================== Fit-Gap ERP – akcje, nawigacja, start ===================== */
let RENDERING = false, AGAIN = false;
function render() {
  if (RENDERING) { AGAIN = true; return; }
  RENDERING = true;
  try {
    if (V.cid && !analysis(V.cid)) { V.cid = null; V.aid = ''; V.doc = ''; history.replaceState(null, '', '#start'); }
    const c = V.cid ? analysis(V.cid) : null;
    document.title = c ? c.n + ' – ' + (V.doc === 'raport' ? 'Raport końcowy' : V.doc === 'agenda' ? 'Agenda wywiadu' : STEPS[V.step] || '') + ' – Fit-Gap ERP' : 'Analiza Fit-Gap ERP';
    renderTop(); renderSide();
    paint($('#main'), c ? (V.doc ? renderDoc(model(c.k)) : renderAnalysis()) : renderStart());
  } finally { RENDERING = false; }
  if (AGAIN) { AGAIN = false; render(); }
}
/* zmiana pola kończy się przy kliknięciu przycisku (utrata fokusu) – odświeżenie widoku czeka do puszczenia przycisku myszy,
   żeby przesunięcie układu (np. zniknięcie listy braków) nie przechwyciło kliknięcia */
let PDOWN = false, PEND = false;
document.addEventListener('pointerdown', () => { PDOWN = true; }, true);
document.addEventListener('pointerup', () => { PDOWN = false; if (PEND) { PEND = false; setTimeout(render, 0); } }, true);
document.addEventListener('pointercancel', () => { PDOWN = false; if (PEND) { PEND = false; render(); } }, true);
const renderSoon = () => { if (PDOWN) PEND = true; else render(); };
function go(hash) { if (location.hash !== hash) location.hash = hash; else route(); }
function route() {
  const h = location.hash, before = [V.cid, V.step, V.aid, V.doc, V.docA].join('|');
  const md = h.match(/^#c\/([A-Za-z0-9_-]+)\/(raport|agenda)(?:\/([A-Za-z0-9_-]+))?$/), mm = h.match(/^#c\/([A-Za-z0-9_-]+)(?:\/(\d))?(?:\/([A-Za-z0-9_-]+))?$/);
  V.doc = ''; V.docA = '';
  if (md && analysis(md[1])) {
    V.cid = md[1]; V.doc = md[2]; V.docA = md[2] === 'agenda' ? md[3] || '' : ''; V.aid = '';
    if (V.doc === 'agenda' && !model(V.cid).ABY[V.docA]) { V.doc = ''; V.step = 1; history.replaceState(null, '', href(1, '')); }
  } else if (mm && analysis(mm[1])) {
    V.cid = mm[1]; V.step = mm[2] ? Math.min(NS, Math.max(1, +mm[2])) : 1;
    const m = model(V.cid); V.aid = mm[3] && m.ABY[mm[3]] && m.ABY[mm[3]].in ? mm[3] : '';
    // kolejny krok dopiero po uzupełnieniu pól wymaganych w poprzednich (przy filtrze obszaru – tylko dla tego obszaru)
    const g = gate(m, V.aid, V.step); V.miss = 0;
    if (g) { toast('Najpierw uzupełnij wymagane pola w kroku ' + g + ' – ' + STEPS[g] + '.'); V.step = g; V.miss = g; history.replaceState(null, '', href(g, V.aid)); }
    UI.last = {c: V.cid, s: V.step, a: V.aid}; saveUI();
  } else { V.cid = null; V.aid = ''; V.step = 1; }
  V.menu = false; hideTip();
  render();
  if (before !== [V.cid, V.step, V.aid, V.doc, V.docA].join('|')) window.scrollTo(0, 0);
  if (V.miss) focusMiss();
  if (V.jump) { const id = V.jump; V.jump = null; requestAnimationFrame(() => { const el = document.getElementById(id); if (el) { el.scrollIntoView({block: 'center'}); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); } }); }
  if (V.jumpSel) { const sel = V.jumpSel; V.jumpSel = null; requestAnimationFrame(() => gotoMiss(sel, true)); }
  if (SH.ok) sync();
}
const cur = () => model(V.cid);
const focusMiss = () => requestAnimationFrame(() => { const el = $('#miss'); if (!el) return; const t = $('#top'), off = (t ? t.getBoundingClientRect().bottom : 0) + 12;
  window.scrollTo({top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - off), behavior: 'smooth'}); el.focus({preventScroll: true}); });
/* z listy braków do pola: przy filtrze innego obszaru lub w trybie skupienia najpierw przechodzi do właściwego widoku */
function gotoMiss(sel, again) {
  let el = document.querySelector(sel);
  if (!el && !again && V.cid) {
    const m = cur(), qk = (sel.match(/#q-([A-Za-z0-9_-]+)/) || sel.match(/rq\|[^|]+\|([A-Za-z0-9_-]+)/) || sel.match(/#g-([A-Za-z0-9_-]+)/) || [])[1];
    const pk = (sel.match(/#proc-([A-Za-z0-9_-]+)/) || sel.match(/pr\|[^|]+\|([A-Za-z0-9_-]+)/) || [])[1];
    const ak = qk && m.RBY[qk] ? m.RBY[qk].a : pk && m.PBY[pk] ? m.PBY[pk].a : (sel.match(/data-a="([A-Za-z0-9_-]+)"/) || [])[1];
    if (V.step === 4 && qk && m.RBY[qk] && m.RBY[qk].res === 'proc' && /data-f="(chg)"|g-imp/.test(sel) && V.r4 !== 'chg') V.r4 = 'chg';
    if (V.step === 4 && /g-eff|data-f="ds"/.test(sel)) { V.r4 = 'gap'; V.f4 = {res: '', pri: '', crit: false}; }
    if (qk && V.focus && V.step === 3) V.fq = qk;
    if (ak && ak !== GLOBAL && V.aid !== ak && m.ABY[ak] && m.ABY[ak].in) { V.jumpSel = sel; go(href(V.step, ak)); return; }
    render(); el = document.querySelector(sel);
  }
  if (!el) return;
  const det = el.closest('details'); if (det && !det.open) det.open = true;
  const box = el.closest('.acard, .prow, .qc, .focus, .grow2, .rk, .rkgrp, .bnrow, .fld, .sec, tr') || el;
  el.scrollIntoView({block: 'center', behavior: 'smooth'}); el.focus({preventScroll: true});
  box.classList.add('flash'); setTimeout(() => box.classList.remove('flash'), 1600);
}
const focusSel = sel => requestAnimationFrame(() => { const el = $(sel); if (el) { el.focus(); if (el.select && el.tagName === 'INPUT') el.select(); } });

/* ---------- operacje na danych ---------- */
const TAGF = {'tag-tcc': 'tcc', 'tag-tcp': 'tcp'};
function tagTarget(el) { const f = TAGF[el.dataset.act.replace(/-rm$/, '')]; return f ? {id: ID.pr(V.cid, el.dataset.p), f} : null; }
function addTag(el, raw) {
  const val = norm(raw).replace(/[,;]+$/, ''); el.value = ''; if (!val) return;
  const t = tagTarget(el); if (!t) return;
  const list = arr((ent(t.id) || {})[t.f]).slice();
  if (list.some(x => lc(x) === lc(val))) return;
  list.push(val); put(t.id, {[t.f]: list}); render();
}
function removeTag(el, i) { const t = tagTarget(el); if (!t) return; const list = arr((ent(t.id) || {})[t.f]).slice(); list.splice(i, 1); put(t.id, {[t.f]: list}); render(); }
function setField(t) {
  const id = t.dataset.id, f = t.dataset.f; if (!ID_RE.test(id)) return;
  let v = t.type === 'checkbox' ? t.checked : t.value;
  if (t.dataset.num) { v = String(v).replace(/[^\d,.\s]/g, ''); if (t.value !== v) t.value = v; }
  if (f === 'sgid') { const raw = t.value, p = t.selectionStart; v = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (raw !== v) { t.value = v; try { const q = Math.max(0, (p || 0) - (raw.length - v.length)); t.setSelectionRange(q, q); } catch (e) {} } }
  if (f === 'n' && t.tagName === 'INPUT' && !norm(v) && /^(ar|pr)\|/.test(id)) return;
  put(id, {[f]: v});
}
function setStatus(qk, v) {
  const r = cur().RBY[qk]; if (!r) return;
  const st = r.st === v ? '' : v, patch = {st};
  if ((st === 'P' || st === 'G') && !PRIBY[r.pri]) patch.pri = r.dp || 'S';
  put(ID.rq(V.cid, qk), patch);
}
function focusMove(d) {
  const m = cur(), s = slice(m, V.aid), list = focusList(s), i = list.findIndex(r => r.k === V.fq);
  const j = Math.max(0, Math.min(list.length - 1, (i < 0 ? 0 : i) + d)); if (!list[j]) return;
  if (j === i) { toast(d > 0 ? 'To ostatnie pytanie w obszarze.' : 'To pierwsze pytanie w obszarze.'); return; }
  V.fq = list[j].k; render();
  requestAnimationFrame(() => { const el = $('.focus'); if (el) { const t = $('#top'), off = (t ? t.getBoundingClientRect().bottom : 0) + 70; if (el.getBoundingClientRect().top < off || el.getBoundingClientRect().top > innerHeight * .5) window.scrollTo({top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - off)}); } });
}
function jumpFirst() {
  const m = cur(), s = slice(m, V.aid), list = focusList(s), r = list.find(x => !x.st) || list.find(x => x.open);
  if (!r) { toast('Wszystkie pytania w obszarze mają ocenę.'); return; }
  if (V.focus) { V.fq = r.k; render(); return; }
  const el = document.getElementById('q-' + r.k); if (el) { el.scrollIntoView({block: 'center', behavior: 'smooth'}); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); const b = el.querySelector('.seg.st button'); if (b) b.focus({preventScroll: true}); }
}
function deleteAnalysis() {
  const c = analysis(V.cid); if (!c) return;
  confirmBox('Usunąć analizę „' + c.n + '”?', 'Analiza zniknie razem ze wszystkimi danymi – u wszystkich użytkowników wspólnej bazy. Tej operacji nie można cofnąć.', 'Usuń analizę', () => {
    const k = V.cid; Object.keys(S.e).filter(id => id === 'an|' + k || id.indexOf('|' + k + '|') === 2).forEach(id => { S.e[id] = {del: true, ts: now()}; });
    save(); go('#start'); toast('Usunięto analizę ' + c.n + '.'); });
}

/* ---------- zdarzenia ---------- */
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-act]');
  if (!t) { if (V.menu && !ev.target.closest('.menu')) { V.menu = false; renderTop(); } if (ev.target.id === 'modal') closeModal(); return; }
  const act = t.dataset.act, d = t.dataset;
  if (act === 'tagbox') { if (ev.target === t) { const i = t.querySelector('.tgi'); if (i) i.focus(); } return; }
  if (/^(INPUT|TEXTAREA|SELECT|DETAILS|OPTION)$/.test(t.tagName)) return;
  const m = V.cid ? cur() : null;
  if (/^tag-.*-rm$/.test(act)) { removeTag(t, +d.i); return; }
  switch (act) {
    case 'who': openModal('who', {back: '[data-act="who"]'}); break;
    case 'next': if (m && required(m, V.step, V.aid).length) { ev.preventDefault(); V.miss = V.step; render(); focusMiss(); } break;
    case 'miss': gotoMiss(d.sel); break;
    case 'menu': V.menu = !V.menu; renderTop(); break;
    case 'help': openModal('help', {back: '[data-act="help"]'}); break;
    case 'scales': openModal('scales'); break;
    case 'close': closeModal(); break;
    case 'cfm-ok': { const run = V.modal && V.modal.run; V.modal = null; renderModal(); if (run) run(); break; }
    case 'xlsx': V.menu = false; renderTop(); exportXlsx(V.cid); break;
    case 'print': printView(); break;
    case 'save': V.menu = false; renderTop(); exportJson(); break;
    case 'load': V.menu = false; renderTop(); $('#file-in').click(); break;
    case 'reset': V.menu = false; renderTop(); confirmBox('Wyczyścić dane w tej przeglądarce?', 'Usuniesz wszystkie analizy, osoby, procesy, wymagania, ryzyka i korzyści zapisane lokalnie. Zapisz wcześniej kopię do pliku, jeśli chcesz zachować dane.', 'Wyczyść dane', () => { S = {who: S.who, name: S.name, team: S.team, e: {}}; save(); go('#start'); toast('Dane wyczyszczone.'); }); break;
    case 'sync': if (needKey()) openModal('who'); else if (SH.mode === 'access' && (SH.st === 'auth' || SH.st === 'err')) location.reload(); else sync(); break;
    case 'go': go(d.href); break;
    case 'goto': if (d.r4) V.r4 = d.r4; else if (+d.step === 4) V.r4 = 'gap'; if (+d.step === 4) V.f4 = {res: '', pri: '', crit: false}; if (d.q) V.fq = d.q; V.jump = d.t || null; go(href(+d.step, d.a || '')); break;
    case 'addan': openModal('addan'); break;
    case 'area': go(href(V.step, d.a || '')); break;
    case 'an-del': deleteAnalysis(); break;
    /* krok 1 */
    case 'os-add': { const k = newId(); put(ID.os(V.cid, k), {n: '', cr: now()}); render(); focusSel(`#os-${CSS.escape(k)} input`); break; }
    case 'os-del': { const p = m.OBY[d.o], used = m.areas.filter(a => a.xcc === d.o || a.xcp === d.o).map(a => a.n);
      confirmBox('Usunąć osobę „' + (p.n || 'bez nazwy') + '”?', used.length ? 'Osoba jest ekspertem obszarów: ' + used.join(', ') + '. Po usunięciu trzeba wskazać innego eksperta.' : 'Osoba zniknie z zespołu i z list uczestników wywiadów.', 'Usuń osobę', () => { drop(ID.os(V.cid, d.o)); render(); }); break; }
    case 'area-on': { const a = m.ABY[d.a]; put(ID.ar(V.cid, d.a), {on: a.on === d.v ? '' : d.v}); if (V.aid === d.a && d.v !== 'Y') V.aid = ''; render(); break; }
    case 'area-fssc': m.areas.filter(a => !a.on).forEach(a => put(ID.ar(V.cid, a.k), {on: a.ph === 1 ? 'Y' : 'L'})); render(); toast('Obszary księgowe w zakresie, pozostałe – kolejny etap.'); break;
    case 'area-rest': m.areas.filter(a => !a.on).forEach(a => put(ID.ar(V.cid, a.k), {on: 'L'})); render(); break;
    case 'area-addtog': V.open['area-add'] = !V.open['area-add']; render(); if (V.open['area-add']) focusSel('#na-n'); break;
    case 'area-add': { const n = norm($('#na-n').value); if (!n) { toast('Podaj nazwę obszaru.'); $('#na-n').focus(); break; }
      put(ID.ar(V.cid, newId()), {cus: true, n, d: norm($('#na-d').value), on: 'Y', cr: now()}); V.open['area-add'] = false; render(); toast('Dodano obszar ' + n + '.'); break; }
    case 'area-del': { const a = m.ABY[d.a]; confirmBox('Usunąć obszar „' + a.n + '”?', 'Obszar zniknie z analizy razem z dodanymi w nim procesami. Tej operacji nie można cofnąć.', 'Usuń obszar', () => { drop(ID.ar(V.cid, d.a)); m.procs.filter(p => p.a === d.a && !p.cat).forEach(p => drop(ID.pr(V.cid, p.k))); if (V.aid === d.a) go(href(V.step, '')); else render(); }); break; }
    case 'us-tog': { const a = m.ABY[d.a], us = a.us.includes(d.o) ? a.us.filter(x => x !== d.o) : a.us.concat(d.o); put(ID.ar(V.cid, d.a), {us}); render(); break; }
    case 'ics': downloadIcs(m, d.a); break;
    /* krok 2 */
    case 'proc-on': { const p = m.PBY[d.p]; put(ID.pr(V.cid, d.p), {on: p.on === d.v ? '' : d.v}); render(); break; }
    case 'proc-all': m.procs.filter(p => p.a === d.a && p.on !== 'Y' && p.on !== 'N').forEach(p => put(ID.pr(V.cid, p.k), {on: 'Y'})); render(); break;
    case 'np-tog': V.open['np-' + d.a] = !V.open['np-' + d.a]; render(); if (V.open['np-' + d.a]) focusSel('#np-n-' + CSS.escape(d.a)); break;
    case 'proc-add': { const ni = $('#np-n-' + CSS.escape(d.a)), di = $('#np-d-' + CSS.escape(d.a)), n = norm(ni.value); if (!n) { toast('Podaj nazwę procesu.'); ni.focus(); break; }
      put(ID.pr(V.cid, newId()), {cus: true, a: d.a, n, d: norm(di.value), on: 'Y', cr: now()}); ni.value = ''; di.value = ''; render(); ni.focus(); toast('Dodano proces ' + n + '.'); break; }
    case 'proc-edit': V.open['ed-' + d.p] = !V.open['ed-' + d.p]; render(); break;
    case 'proc-del': { const p = m.PBY[d.p]; confirmBox('Usunąć proces „' + p.n + '”?', 'Proces zniknie z analizy razem z wymaganiami dodanymi w wywiadzie. Tej operacji nie można cofnąć.', 'Usuń proces', () => { p.reqs.forEach(r => drop(ID.rq(V.cid, r.k))); drop(ID.pr(V.cid, p.k)); render(); }); break; }
    case 'harm': { const p = m.PBY[d.p]; put(ID.pr(V.cid, d.p), {hm: p.hm === d.v ? '' : d.v}); render(); break; }
    /* krok 3 */
    case 'mode': V.focus = d.v === 'f'; UI.focus = V.focus; saveUI(); render(); break;
    case 'q-st': setStatus(d.q, d.v); if (V.focus) V.fq = d.q; render(); break;
    case 'q-res': { const r = m.RBY[d.q]; put(ID.rq(V.cid, d.q), {res: r.res === d.v ? '' : d.v}); render(); break; }
    case 'q-pri': { const r = m.RBY[d.q]; put(ID.rq(V.cid, d.q), {pri: r.pri === d.v ? '' : d.v}); render(); break; }
    case 'fq-go': V.fq = d.q; render(); break;
    case 'fq-prev': focusMove(-1); break;
    case 'fq-next': focusMove(1); break;
    case 'jump-first': jumpFirst(); break;
    case 'qa-tog': V.open['qa-' + d.p] = !V.open['qa-' + d.p]; render(); if (V.open['qa-' + d.p]) focusSel('#qa-t-' + CSS.escape(d.p)); break;
    case 'q-add': { const ti = $('#qa-t-' + CSS.escape(d.p)), tx = norm(ti.value); if (!tx) { toast('Wpisz treść wymagania.'); ti.focus(); break; }
      put(ID.rq(V.cid, newId()), {cus: true, p: d.p, t: tx, cr: now()}); ti.value = ''; render(); ti.focus(); toast('Dodano wymaganie.'); break; }
    case 'q-del': confirmBox('Usunąć wymaganie?', 'Wymaganie zniknie z analizy razem z odpowiedziami i oceną. Tej operacji nie można cofnąć.', 'Usuń wymaganie', () => { drop(ID.rq(V.cid, d.q)); render(); }); break;
    /* krok 4 */
    case 'r4': V.r4 = d.v; render(); break;
    case 'flt': { const F = V.f4; if (d.k === 'crit') F.crit = !F.crit; else F[d.k] = F[d.k] === d.v ? '' : d.v; render(); break; }
    case 'g-eff': { const r = m.RBY[d.q]; put(ID.rq(V.cid, d.q), {eff: r.eff === d.v ? '' : d.v}); render(); break; }
    case 'g-dec': put(ID.rq(V.cid, d.q), {dec: d.v}); render(); break;
    case 'g-imp': { const r = m.RBY[d.q]; put(ID.rq(V.cid, d.q), {imp: String(r.imp) === d.v ? '' : +d.v}); render(); break; }
    /* krok 5 */
    case 'tog': V.open[d.k] = !V.open[d.k]; render(); break;
    case 'sug-add': { const x = suggestions(m, V.aid).find(s => s.key === d.k); if (!x) break; const k = newId();
      put(ID.rk(V.cid, k), {a: x.a, q: x.q || '', cat: x.cat, t: x.t, ds: x.ds, ac: x.ac || '', pr: String(x.pr), im: String(x.im), st: 'O', tr: '0', src: x.key, cr: now()});
      V.jump = 'risk-' + k; route(); toast('Dodano ryzyko do rejestru – uzupełnij właściciela i działanie.'); break; }
    case 'sug-skip': put(ID.sg(V.cid, d.k), {x: 1}); render(); break;
    case 'rk-add': { const k = newId(); put(ID.rk(V.cid, k), {a: d.a, pr: '', im: '', st: 'O', tr: '0', cr: now()}); render(); focusSel(`#risk-${CSS.escape(k)} input`); break; }
    case 'rk-del': confirmBox('Usunąć ryzyko?', 'Ryzyko zniknie z rejestru u wszystkich użytkowników. Tej operacji nie można cofnąć.', 'Usuń ryzyko', () => { drop(ID.rk(V.cid, d.k)); render(); }); break;
    case 'rk-pr': case 'rk-im': { const id = ID.rk(V.cid, d.k), r = ent(id) || {}, f = act === 'rk-pr' ? 'pr' : 'im'; put(id, {[f]: String(r[f]) === d.v ? '' : d.v}); render(); break; }
    /* krok 6 */
    case 'bn-on': { const b = m.bens.find(x => x.k === d.b); put(ID.bn(V.cid, d.b), {on: b.on === d.v ? '' : d.v}); render(); break; }
    case 'bn-v': case 'bn-cf': { const b = m.bens.find(x => x.k === d.b), f = act === 'bn-v' ? 'v' : 'cf'; put(ID.bn(V.cid, d.b), {[f]: String(b[f]) === d.v ? '' : +d.v}); render(); break; }
    case 'bn-addtog': V.open['bn-add'] = !V.open['bn-add']; render(); if (V.open['bn-add']) focusSel('#nb-n'); break;
    case 'bn-add': { const n = norm($('#nb-n').value); if (!n) { toast('Podaj nazwę korzyści.'); $('#nb-n').focus(); break; }
      put(ID.bn(V.cid, newId()), {cus: true, n, cat: $('#nb-c').value, on: 'Y', cr: now()}); V.open['bn-add'] = false; render(); toast('Dodano korzyść.'); break; }
    case 'bn-del': confirmBox('Usunąć korzyść?', 'Korzyść zniknie z analizy. Tej operacji nie można cofnąć.', 'Usuń korzyść', () => { drop(ID.bn(V.cid, d.b)); render(); }); break;
    /* krok 7 */
    case 'rec': put(ID.an(V.cid), {rec: m.co.rec === d.v ? '' : d.v}); render(); break;
    case 'sign': { const a = m.ABY[d.a], nm = norm($('#sg-nm').value); if (!nm) { toast('Podaj, kto potwierdza wyniki.'); $('#sg-nm').focus(); break; }
      put(ID.ar(V.cid, d.a), {sg: nm, sgAt: $('#sg-dt').value || today()}); render(); toast('Potwierdzono wyniki obszaru ' + a.n + '.'); break; }
    case 'unsign': put(ID.ar(V.cid, d.a), {sg: '', sgAt: ''}); render(); break;
    case 'sign-an': { const nm = norm($('#sg-nm').value) || norm(m.co.sp); if (!nm) { toast('Podaj, kto zatwierdza wyniki.'); $('#sg-nm').focus(); break; }
      put(ID.an(V.cid), {sg: nm, sgAt: $('#sg-dt').value || today()}); render(); toast('Zatwierdzono wyniki analizy.'); break; }
    case 'unsign-an': put(ID.an(V.cid), {sg: '', sgAt: ''}); render(); break;
  }
});
document.addEventListener('input', ev => {
  const t = ev.target, act = t.dataset && t.dataset.act; if (!act) return;
  if (act === 'f' && t.tagName !== 'SELECT' && t.type !== 'date' && t.type !== 'time' && t.type !== 'checkbox') setField(t);
  else if (/^tag-/.test(act) && ev.inputType === 'insertReplacementText') addTag(t, t.value);
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.closest && (t.closest('#who-form') || t.closest('#addan-form'))) return;
  const act = t.dataset && t.dataset.act; if (!act) return;
  if (act === 'f') { setField(t); renderSoon(); }
  else if (act === 'rv') { if (t.dataset.a === GLOBAL) put(ID.an(V.cid), {rvg: t.checked}); else put(ID.ar(V.cid, t.dataset.a), {rv: t.checked}); render(); }
  else if (act === 'ansel') go(href(1, '', t.value));
  else if (act === 'msel') go(href(V.step, t.value));
});
document.addEventListener('toggle', ev => { const x = ev.target; if (!x.dataset) return; if (x.dataset.act === 'pmore') V.open['pm-' + x.dataset.p] = x.open; }, true);
document.addEventListener('focusout', ev => { const t = ev.target; if (t.classList && t.classList.contains('tgi') && norm(t.value)) addTag(t, t.value); });
const typing = el => el && (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && !/^(checkbox|radio|button)$/.test(el.type)));
document.addEventListener('keydown', ev => {
  const t = ev.target;
  if (ev.key === 'Escape') { if (V.modal) { closeModal(); return; } if (V.menu) { V.menu = false; renderTop(); return; } }
  if (ev.key === 'Tab' && V.modal) {
    const f = $$('#modal .box button, #modal .box input, #modal .box select, #modal .box textarea, #modal .box a[href]').filter(x => !x.disabled && x.offsetParent !== null);
    if (f.length) { const i = f.indexOf(document.activeElement); if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && (i === f.length - 1 || i < 0)) { ev.preventDefault(); f[0].focus(); } }
    return;
  }
  if (t.classList && t.classList.contains('tgi')) {
    if ((ev.key === 'Enter' || ev.key === ',' || ev.key === ';') && !ev.isComposing) { ev.preventDefault(); if (norm(t.value)) addTag(t, t.value); }
    else if (ev.key === 'Backspace' && !t.value) { const btns = t.parentNode.querySelectorAll('.tgx'); if (btns.length) { ev.preventDefault(); removeTag(btns[btns.length - 1], btns.length - 1); } }
    return;
  }
  /* tryb skupienia wywiadu: 1–5 ocena, strzałki – pytania, Ctrl+Enter – dalej z pola tekstowego */
  if (V.cid && !V.doc && V.step === 3 && V.aid && V.focus && !V.modal && !ev.altKey && !ev.metaKey) {
    if (typing(t)) { if (ev.key === 'Enter' && ev.ctrlKey) { ev.preventDefault(); if (t.dataset && t.dataset.act === 'f') { setField(t); } t.blur(); focusMove(1); } return; }
    if (ev.ctrlKey) return;
    const k = /^[1-5]$/.test(ev.key) ? FIT[+ev.key - 1].k : null;
    if (k) { ev.preventDefault(); setStatus(V.fq, k); render(); return; }
    if (ev.key === 'ArrowRight' || ev.key === 'PageDown') { ev.preventDefault(); focusMove(1); return; }
    if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { ev.preventDefault(); focusMove(-1); return; }
  }
  if (t.id === 'na-n' || t.id === 'na-d') { if (ev.key === 'Enter') { ev.preventDefault(); $('[data-act="area-add"]').click(); } return; }
  if (t.id === 'nb-n' && ev.key === 'Enter') { ev.preventDefault(); $('[data-act="bn-add"]').click(); return; }
  if (/^np-[nd]-/.test(t.id || '') && ev.key === 'Enter') { ev.preventDefault(); const b = t.closest('.addbox').querySelector('[data-act="proc-add"]'); if (b) b.click(); return; }
  if (/^qa-t-/.test(t.id || '') && ev.key === 'Enter') { ev.preventDefault(); const b = t.closest('.qadd').querySelector('[data-act="q-add"]'); if (b) b.click(); return; }
});
document.addEventListener('submit', async ev => {
  const f = ev.target; ev.preventDefault();
  if (f.id === 'addan-form') {
    const n = norm(f.nm.value), err = $('#addan-err'), g = x => norm(f[x].value);
    if (!n) { err.textContent = 'Podaj nazwę analizy.'; f.nm.focus(); return; }
    if (analyses().some(c => lc(c.n) === lc(n))) { err.textContent = 'Analiza o tej nazwie już jest na liście.'; f.nm.focus(); return; }
    if (!g('srcCo') || !g('srcSys') || !g('tgtCo') || !g('tgtSys')) { err.textContent = 'Uzupełnij spółki i systemy.'; return; }
    const k = newId(); put(ID.an(k), {n, srcCo: g('srcCo'), srcSys: g('srcSys'), tgtCo: g('tgtCo'), tgtSys: g('tgtSys'), start: today(), cr: now()});
    if (f.fssc.checked) AREAS.forEach(a => put(ID.ar(k, a.k), {on: a.ph === 1 ? 'Y' : 'L'}));
    V.modal = null; renderModal(); go(href(1, '', k)); toast('Utworzono analizę ' + n + '.'); return;
  }
  if (f.id !== 'who-form') return;
  const name = norm(f.nm.value), team = (f.querySelector('input[name="team"]:checked') || {}).value, key = f.key ? f.key.value : '';
  const err = !name && !team ? 'Podaj imię i nazwisko oraz wybierz rolę.' : !name ? 'Podaj imię i nazwisko.' : !team ? 'Wybierz rolę w analizie.' : f.key && !key ? 'Podaj hasło zespołu.' : '';
  if (err) { $('#who-err').textContent = err; (!name ? f.nm : !team ? f.querySelector('input[name="team"]') : f.key).focus(); return; }
  const first = !known(); S.name = name; S.team = team; S.who = name + ' · ' + team; saveLocal();
  if (f.key) {
    const b = f.querySelector('[type=submit]'); b.disabled = true; $('#who-err').textContent = '';
    try { await connect(key); } catch (e) { b.disabled = false; $('#who-err').textContent = e.auth ? 'Nieprawidłowe hasło zespołu.' : 'Brak połączenia z serwerem. Spróbuj ponownie.'; f.key.select(); return; }
  }
  V.modal = null; renderModal(); render(); toast(first ? 'Witaj, ' + name.split(' ')[0] + '!' : 'Zapisano: ' + S.who);
});

/* ---------- dymki ---------- */
document.addEventListener('mouseover', ev => {
  const el = ev.target; if (!el.closest) return;
  const tp = el.closest('[data-tip]');
  if (tp) showTip(tp, tp.dataset.tip, tp.dataset.tip2); else if (!tipEl().hidden) hideTip();
});
document.addEventListener('focusin', ev => { const el = ev.target.closest && ev.target.closest('[data-tip]'); if (el && el.matches(':focus-visible')) showTip(el, el.dataset.tip, el.dataset.tip2); else hideTip(); });
document.addEventListener('scroll', hideTip, true);
window.addEventListener('hashchange', route);
$('#file-in').addEventListener('change', ev => { const f = ev.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => importJson(String(r.result)); r.readAsText(f); ev.target.value = ''; });
