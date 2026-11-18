/* ===================== Fit-Gap ERP – rdzeń: konfiguracja, stan, model, ocena, synchronizacja ===================== */
const D = JSON.parse(document.getElementById('data').textContent);
const VER = '{{VER}}';
const APP = 'fitgap-erp';
const LS = 'fitgap:v1', LSK = 'fitgap:key', LSU = 'fitgap:ui';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const store = {get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }};
const now = () => new Date().toISOString();
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const norm = s => String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
const lc = s => norm(s).toLocaleLowerCase('pl');
const LOC = 'pl-PL';
const fdt = iso => iso ? new Date(iso).toLocaleString(LOC, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : '';
const fd = s => { if (!s) return ''; const d = new Date(String(s).length === 10 ? s + 'T12:00:00' : s); return isNaN(d) ? String(s) : d.toLocaleDateString(LOC, {day: '2-digit', month: '2-digit', year: 'numeric'}); };
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const plural = (n, f) => (n === 1 ? f[0] : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? f[1] : f[2]).replace('{n}', n);
const trunc = (x, n) => { x = String(x || ''); return x.length > n ? x.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : x; };
const slug = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[łŁ]/g, 'l').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
const arr = x => Array.isArray(x) ? x : [];
const num = x => { const v = parseFloat(String(x == null ? '' : x).replace(/\s/g, '').replace(',', '.')); return isFinite(v) ? v : 0; };
const fnum = (v, d) => (v == null || !isFinite(v)) ? '–' : v.toLocaleString(LOC, {maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0});
const fpln = v => fnum(Math.round(v)) + ' zł';
const fpct = v => v == null ? '–' : Math.round(v * 100) + '%';

/* ---------- konfiguracja metody (dev/data.json) ---------- */
const by = (list, f) => { const o = {}; list.forEach(x => { o[x[f || 'k']] = x; }); return o; };
const AREAS = D.areas, AREA = by(AREAS);
const CATP = D.procs, CATBY = by(CATP);
const CATQ = {}; CATP.forEach(p => p.q.forEach((q, i) => { CATQ[q.k] = Object.assign({}, q, {p: p.k, i}); }));
const FIT = D.fit, FITBY = by(FIT), RES = D.res, RESBY = by(RES), PRI = D.pri, PRIBY = by(PRI), EFF = D.eff, EFFBY = by(EFF);
const IMP = D.imp, DEC = D.dec, DECBY = by(DEC), HARM = D.harm, HARMBY = by(HARM);
const RCAT = D.riskCats, RCATBY = by(RCAT), BCAT = D.benCats, BCATBY = by(BCAT), BEN = D.benefits, BENBY = by(BEN), SYSR = D.sysRisks, SYSRBY = by(SYSR);
const VERD = D.verd, VERDBY = by(VERD), TEAMS = D.teams, CRITRES = D.critRes, DEF = D.defaults;
const DONE_ST = ['F', 'P', 'G', 'N'];
const RST = {O: 'otwarte', W: 'w realizacji', Z: 'zamknięte'};
const STEPS = [null, 'Zakres i zespół', 'Procesy AS-IS', 'Wywiad fit-gap', 'Luki i zmiany', 'Ryzyka', 'Wartość dodana', 'Wynik'];
const NS = 7, GLOBAL = '_g';
const riskLv = s => { const i = D.riskLv.findIndex(l => s <= l.max); return i < 0 ? D.riskLv.length - 1 : i; };
const fitName = k => (FITBY[k] || {}).n || 'bez oceny';
const resName = k => (RESBY[k] || {}).n || '';
const effMd = k => (EFFBY[k] || {}).md || 0;
const sysCC = co => (co.srcCo || DEF.srcCo) + ' · ' + (co.srcSys || DEF.srcSys);
const sysCP = co => (co.tgtCo || DEF.tgtCo) + ' · ' + (co.tgtSys || DEF.tgtSys);

/* ---------- stan ---------- */
let S = {who: '', name: '', team: '', e: {}};
try { const o = JSON.parse(store.get(LS) || 'null'); if (o && o.e && typeof o.e === 'object') S = o; } catch (e) {}
let UI = {}; try { UI = JSON.parse(store.get(LSU) || '{}') || {}; } catch (e) {}
const saveUI = () => store.set(LSU, JSON.stringify(UI));
const V = {cid: null, step: 1, aid: '', miss: 0, menu: false, modal: null, open: {}, r4: 'gap', f4: {res: '', pri: '', crit: false}, focus: !!UI.focus, fq: '', doc: '', docA: '', jump: null, allAn: false};
let REV = 0;
const saveLocal = () => store.set(LS, JSON.stringify(S));
/* RODO: narzędzie nie przechowuje adresów e-mail – osoby opisuje imię i nazwisko oraz SGID (np. A1234566) */
const SGID_RE = /^[A-Z]\d{7}$/;
const noMail = (id, v) => { if (v && typeof v === 'object' && 'em' in v) { v = Object.assign({}, v); delete v.em; } return v; };
const save = () => { REV++; saveLocal(); if (SH.on && SH.ok) pushSoon(); };
const known = () => !!(S.name && TEAMS.some(t => t.n === S.team));
const mySide = () => S.team === 'Ekspert CC' ? 'cc' : S.team === 'Ekspert CP' ? 'cp' : '';

/* ---------- wpisy: każdy obiekt to osobny rekord (ostatni zapis wygrywa, usunięcie to trwały znacznik) ---------- */
const ID_RE = /^(an|ar|pr|rq|os|rk|bn|sg)\|[A-Za-z0-9_-]{1,40}(\|[A-Za-z0-9_-]{1,60})?$/;
const ID = {an: c => 'an|' + c, ar: (c, a) => 'ar|' + c + '|' + a, pr: (c, p) => 'pr|' + c + '|' + p, rq: (c, q) => 'rq|' + c + '|' + q,
  os: (c, o) => 'os|' + c + '|' + o, rk: (c, k) => 'rk|' + c + '|' + k, bn: (c, b) => 'bn|' + c + '|' + b, sg: (c, k) => 'sg|' + c + '|' + k};
const ent = id => { const x = S.e[id]; return x && !x.del ? x : null; };
/* znaczniki czasu pól (_t) pozwalają scalić równoległe zmiany różnych pól tego samego rekordu, np. odpowiedzi eksperta CC i CP */
function put(id, patch) { const o = ent(id) || {}, x = Object.assign({}, o, patch), t = now(); x.ts = t; x.by = S.who || ''; x._t = Object.assign({}, o._t); Object.keys(patch).forEach(f => { x._t[f] = t; }); S.e[id] = x; save(); return x; }
function drop(id) { if (S.e[id] && S.e[id].del) return; S.e[id] = {del: true, ts: now()}; save(); }

let IX = null, IXR = -1;
function idx() {
  if (IX && IXR === REV) return IX;
  const o = {an: {}, ar: {}, pr: {}, rq: {}, os: {}, rk: {}, bn: {}, sg: {}};
  Object.keys(S.e).forEach(id => { const v = S.e[id], p = id.split('|'), t = p[0]; if (!o[t] || !v) return;
    if (t === 'an') { o.an[p[1]] = v; return; }
    if (v.del) return;
    (o[t][p[1]] = o[t][p[1]] || {})[p[2]] = v; });
  IX = o; IXR = REV; return o;
}

/* ---------- analizy ---------- */
function analyses() {
  const X = idx(), out = [];
  Object.keys(X.an).forEach(k => { const e = X.an[k]; if (!e || e.del) return;
    out.push(Object.assign({}, DEF, e, {k, n: norm(e.n) || 'Analiza bez nazwy', srcCo: norm(e.srcCo) || DEF.srcCo, srcSys: norm(e.srcSys) || DEF.srcSys, tgtCo: norm(e.tgtCo) || DEF.tgtCo, tgtSys: norm(e.tgtSys) || DEF.tgtSys})); });
  return out.sort((a, b) => String(a.cr || '').localeCompare(String(b.cr || '')));
}
const analysis = cid => analyses().find(c => c.k === cid) || null;

/* ---------- model analizy: obszary, procesy, wymagania, luki, ryzyka, korzyści ---------- */
const MC = {};
function model(cid) { const c = MC[cid]; if (c && c.rev === REV) return c.m; const m = build(cid); MC[cid] = {rev: REV, m}; return m; }
const cnt = list => { const c = {F: 0, P: 0, G: 0, N: 0, O: 0, U: 0, t: list.length}; list.forEach(r => { c[FITBY[r.st] ? r.st : 'U']++; }); return c; };
function fitIndex(rs) { let w = 0, s = 0; rs.forEach(r => { if (!(r.st in D.fitW) || r.dec === 'R') return; const pw = D.priW[r.pri0] || 2; w += pw; s += pw * D.fitW[r.st]; }); return w ? s / w : null; }
function build(cid) {
  const X = idx(), co = analysis(cid) || Object.assign({}, DEF, {k: cid});
  const arE = X.ar[cid] || {}, prE = X.pr[cid] || {}, rqE = X.rq[cid] || {}, osE = X.os[cid] || {}, rkE = X.rk[cid] || {}, bnE = X.bn[cid] || {}, sgE = X.sg[cid] || {};
  const byCr = (a, b) => String(a.cr || '').localeCompare(String(b.cr || ''));
  /* osoby (zespół i uczestnicy wywiadów) */
  const people = Object.keys(osE).map(k => Object.assign({}, osE[k], {k})).sort(byCr);
  people.forEach(p => { p.n = norm(p.n); });
  const OBY = {}; people.forEach(p => { OBY[p.k] = p; });
  /* obszary */
  const areas = AREAS.map((a, i) => Object.assign({}, a, arE[a.k] || {}, {k: a.k, i: a.i, c: a.c, cd: a.cd, ph: a.ph, std: true, ord: i}));
  Object.keys(arE).filter(k => !AREA[k] && arE[k].cus).map(k => Object.assign({i: 'briefcase', c: 'c-gray', d: '', ph: 2}, arE[k], {k, std: false})).sort(byCr).forEach((a, i) => { a.ord = 100 + i; a.cd = 'X' + (i + 1); areas.push(a); });
  areas.forEach(a => { a.in = a.on === 'Y'; a.later = a.on === 'L'; a.n = norm(a.n) || (AREA[a.k] ? AREA[a.k].n : 'Obszar');
    a.ecc = OBY[a.xcc] || null; a.ecp = OBY[a.xcp] || null; a.us = arr(a.us).filter(k => OBY[k]); });
  const ABY = {}; areas.forEach(a => { ABY[a.k] = a; });
  /* procesy */
  const procs = [];
  areas.forEach(a => {
    const list = [];
    CATP.filter(p => p.a === a.k).forEach(p => list.push(Object.assign({}, p, prE[p.k] || {}, {k: p.k, a: p.a, cat: true, base: p, q: p.q, n: p.n, d: p.d})));
    Object.keys(prE).filter(k => !CATBY[k] && prE[k].cus && prE[k].a === a.k).map(k => Object.assign({}, prE[k], {k, cat: false, q: []})).sort(byCr).forEach(p => list.push(p));
    list.forEach((p, i) => { p.ai = i + 1; procs.push(p); });
  });
  procs.forEach((p, i) => { p.area = ABY[p.a]; p.act = p.on === 'Y' && !!p.area && p.area.in; p.n = norm(p.n) || 'Proces bez nazwy'; p.no = i + 1; p.cd = (p.area.cd || 'X') + p.ai; });
  const PBY = {}; procs.forEach(p => { PBY[p.k] = p; });
  /* wymagania (pytania wywiadu) */
  const RBY = {}, reqs = [];
  procs.forEach(p => {
    const list = p.q.map(q => Object.assign({}, rqE[q.k] || {}, {k: q.k, t: q.t, h: q.h, dp: q.p, reg: !!q.reg, cat: true}));
    Object.keys(rqE).filter(k => !CATQ[k] && rqE[k].cus && rqE[k].p === p.k).map(k => Object.assign({}, rqE[k], {k, cat: false, dp: 'S', t: norm(rqE[k].t) || 'Wymaganie bez treści', h: ''})).sort(byCr).forEach(r => list.push(r));
    list.forEach((r, i) => {
      r.proc = p; r.a = p.a; r.area = p.area; r.no = i + 1; r.code = p.cd + '.' + (i + 1);
      r.st = FITBY[r.st] ? r.st : ''; r.done = DONE_ST.includes(r.st); r.open = r.st === 'O'; r.gap = r.st === 'P' || r.st === 'G';
      r.pri0 = PRIBY[r.pri] ? r.pri : (r.dp || 'S'); r.wd = r.dec === 'R';
      r.crit = r.st === 'G' && r.pri0 === 'M' && CRITRES.includes(r.res) && !r.wd;
      r.md = r.gap && !r.wd ? effMd(r.eff) : 0;
      RBY[r.k] = r;
    });
    p.reqs = list; p.c = cnt(list);
    if (p.act) list.forEach(r => reqs.push(r));
  });
  /* ryzyka */
  const risks = Object.keys(rkE).map(k => Object.assign({}, rkE[k], {k})).filter(r => r.a === GLOBAL || (ABY[r.a] && ABY[r.a].in)).sort(byCr);
  risks.forEach(r => { r.area = r.a === GLOBAL ? null : ABY[r.a]; r.req = r.q && RBY[r.q] && RBY[r.q].proc.act ? RBY[r.q] : null;
    r.score = (+r.pr || 0) * (+r.im || 0); r.lv = r.score ? riskLv(r.score) : -1; r.t = norm(r.t); });
  /* korzyści */
  const bens = BEN.map((b, i) => Object.assign({}, b, bnE[b.k] || {}, {k: b.k, n: b.n, d: b.d, cat: b.cat, std: true, ord: i}));
  Object.keys(bnE).filter(k => !BENBY[k] && bnE[k].cus).map(k => Object.assign({cat: 'eff', d: ''}, bnE[k], {k, std: false})).sort(byCr).forEach(b => bens.push(b));
  bens.forEach(b => { b.in = b.on === 'Y'; b.n = norm(b.n) || 'Korzyść bez nazwy'; b.score = b.in ? (+b.v || 0) * (+b.cf || 0) : 0; });
  const dis = {}; Object.keys(sgE).forEach(k => { dis[k] = true; });
  return {cid, co, people, OBY, areas, ABY, inArea: areas.filter(a => a.in), later: areas.filter(a => a.later), procs, PBY, reqs, RBY, risks, bens, dis};
}
/* wycinek modelu dla filtra obszaru */
function slice(m, aid) {
  const areas = aid ? m.inArea.filter(a => a.k === aid) : m.inArea, aset = new Set(areas.map(a => a.k));
  const procs = m.procs.filter(p => p.area && p.area.in && aset.has(p.a)), act = procs.filter(p => p.act);
  const reqs = m.reqs.filter(r => aset.has(r.a)), gaps = reqs.filter(r => r.gap);
  const risks = m.risks.filter(r => aid ? r.a === aid : true);
  const groups = aid ? areas.map(a => a.k) : [GLOBAL].concat(areas.map(a => a.k));
  return {areas, aset, procs, act, reqs, gaps, risks, groups};
}
const gapOk = r => r.wd || (!!r.eff && (r.st !== 'G' || !!norm(r.ds)) && (r.res !== 'proc' || (!!norm(r.chg) && !!r.imp)));
const reqOk = r => !!r.st && (!r.gap || (!!r.res && !!PRIBY[r.pri] && !!norm(r.cc)));
const groupOk = (m, s, g) => (g === GLOBAL ? !!m.co.rvg : !!(m.ABY[g] || {}).rv) || s.risks.some(r => r.a === g);
function progress(m, aid) {
  const s = slice(m, aid), ar = s.areas;
  const st = [null,
    {n: ar.filter(a => a.ecc && a.ecp).length, t: ar.length},
    {n: s.procs.filter(p => p.on === 'Y' || p.on === 'N').length, t: s.procs.length},
    {n: s.reqs.filter(r => r.st).length, t: s.reqs.length},
    {n: s.gaps.filter(gapOk).length, t: s.gaps.length},
    {n: s.groups.filter(g => groupOk(m, s, g)).length, t: s.groups.length},
    {n: m.bens.filter(b => b.on === 'Y' || b.on === 'N').length, t: m.bens.length},
    {n: ar.filter(a => a.sg).length, t: ar.length}];
  const s2ok = st[2].t > 0 && st[2].n === st[2].t, s3ok = s2ok && st[3].n === st[3].t, vac = i => (i === 3 && s2ok && !st[3].t) || (i === 4 && s3ok && !st[4].t);
  const fr = i => st[i].t ? st[i].n / st[i].t : vac(i) ? 1 : 0, use = aid ? [2, 3, 4, 5, 7] : [1, 2, 3, 4, 5, 6, 7];
  const p = use.reduce((a, i) => a + fr(i), 0) / use.length;
  const all = use.every(i => (st[i].t > 0 && st[i].n === st[i].t) || vac(i));
  return {st, pct: Math.round(p * 100), started: st.slice(1, 6).some(x => x.n > 0) || !!(norm(m.co.sp) || norm(m.co.pl)), done: all && (aid ? true : !!m.co.sg)};
}

/* ---------- pola wymagane – bez nich nie przejdziesz do kolejnego kroku ----------
   element: {t: opis braku, sel: selektor pola, k: klucz do podświetlenia pola} */
const fsel = (id, f) => `[data-id="${id}"][data-f="${f}"]`;
function required(m, step, aid) {
  const out = [], add = (t, sel, k) => out.push({t, sel, k: k || ''});
  if (step === 1) {
    const c = m.co, id = ID.an(m.cid);
    if (!norm(c.n)) add('Nazwa analizy', fsel(id, 'n'), id + '#n');
    [['srcCo', 'Spółka przenoszona (źródłowa)'], ['srcSys', 'System źródłowy'], ['tgtCo', 'Spółka z systemem docelowym'], ['tgtSys', 'System docelowy']].forEach(([f, t]) => { if (!norm(ent(id) && ent(id)[f] != null ? ent(id)[f] : c[f])) add(t, fsel(id, f), id + '#' + f); });
    if (!norm(c.sp)) add('Sponsor analizy', fsel(id, 'sp'), id + '#sp');
    if (!norm(c.pl)) add('Lider analizy', fsel(id, 'pl'), id + '#pl');
    if (!norm(c.scope)) add('Cel i zakres analizy', fsel(id, 'scope'), id + '#scope');
    m.people.forEach(p => { const pi = ID.os(m.cid, p.k), nm = p.n || 'Nowa osoba';
      if (!p.n) add('Zespół: imię i nazwisko osoby', fsel(pi, 'n'), pi + '#n');
      if (!SGID_RE.test(String(p.sgid || ''))) add(nm + (p.sgid ? ': SGID w formacie A1234566' : ': SGID'), fsel(pi, 'sgid'), pi + '#sgid');
      if (!norm(p.co)) add(nm + ': firma', fsel(pi, 'co'), pi + '#co');
      if (!norm(p.role)) add(nm + ': rola', fsel(pi, 'role'), pi + '#role'); });
    const und = m.areas.filter(a => a.on !== 'Y' && a.on !== 'L' && a.on !== 'N');
    if (und.length) add('Obszary bez decyzji „W zakresie / Kolejny etap / Poza zakresem”: ' + und.length, `#area-${und[0].k} .seg button`, 'und');
    else if (!m.inArea.length) add('Co najmniej jeden obszar w zakresie analizy', `#area-${m.areas[0].k} .seg button`);
    (aid ? m.inArea.filter(a => a.k === aid) : m.inArea).forEach(a => { const ai = ID.ar(m.cid, a.k);
      if (!a.ecc) add(a.n + ': ekspert ' + m.co.srcCo + ' (' + m.co.srcSys + ')', fsel(ai, 'xcc'), ai + '#xcc');
      if (!a.ecp) add(a.n + ': ekspert ' + m.co.tgtCo + ' (' + m.co.tgtSys + ')', fsel(ai, 'xcp'), ai + '#xcp'); });
    return out;
  }
  const s = slice(m, aid);
  if (step === 2) s.areas.forEach(a => {
    const pr = m.procs.filter(p => p.a === a.k), und = pr.filter(p => p.on !== 'Y' && p.on !== 'N');
    if (!pr.length) add(a.n + ': dodaj co najmniej jeden proces', `[data-act="np-tog"][data-a="${a.k}"]`);
    else if (und.length) add(a.n + ': procesy bez decyzji „Dotyczy / Nie dotyczy”: ' + und.length, `#proc-${und[0].k} .seg button`, 'und');
    else if (!pr.some(p => p.on === 'Y')) add(a.n + ': co najmniej jeden proces „Dotyczy”', `#proc-${pr[0].k} .seg button`);
    pr.filter(p => p.act && !norm(p.occ)).forEach(p => { const pi = ID.pr(m.cid, p.k); add(p.n + ': właściciel procesu w ' + m.co.srcCo, fsel(pi, 'occ'), pi + '#occ'); });
  });
  if (step === 3) s.reqs.forEach(r => { const ri = ID.rq(m.cid, r.k), nm = r.code + ' ' + trunc(r.t, 60);
    if (!r.st) { add(nm + ': ocena dopasowania', `#q-${r.k} .seg.st button`, 'st-' + r.k); return; }
    if (!r.gap) return;
    if (!norm(r.cc)) add(nm + ': opis praktyki ' + m.co.srcCo, fsel(ri, 'cc'), ri + '#cc');
    if (!r.res) add(nm + ': sposób zamknięcia luki', `#q-${r.k} [data-act="q-res"]`, 'res-' + r.k);
    if (!PRIBY[r.pri]) add(nm + ': priorytet', `#q-${r.k} [data-act="q-pri"]`, 'pri-' + r.k);
  });
  if (step === 4) s.gaps.forEach(r => { if (r.wd) return; const ri = ID.rq(m.cid, r.k), nm = r.code + ' ' + trunc(r.t, 60);
    if (!r.eff) add(nm + ': pracochłonność', `#g-${r.k} [data-act="g-eff"]`, 'eff-' + r.k);
    if (r.st === 'G' && !norm(r.ds)) add(nm + ': opis rozwiązania luki', fsel(ri, 'ds'), ri + '#ds');
    if (r.res === 'proc') {
      if (!norm(r.chg)) add(nm + ': co zmienia się w ' + m.co.srcCo, fsel(ri, 'chg'), ri + '#chg');
      if (!r.imp) add(nm + ': skala zmiany', `#g-${r.k} [data-act="g-imp"]`, 'imp-' + r.k);
    }
  });
  if (step === 5) {
    s.groups.forEach(g => { if (groupOk(m, s, g)) return; const nm = g === GLOBAL ? 'Ryzyka całego przedsięwzięcia' : m.ABY[g].n;
      add(nm + ': dodaj ryzyko albo zaznacz „Przegląd ryzyk zakończony”', `[data-act="rv"][data-a="${g}"]`, 'rv-' + g); });
    s.risks.forEach(r => { const ri = ID.rk(m.cid, r.k), nm = (r.t || 'Nowe ryzyko') + ' (' + (r.area ? r.area.n : 'całe przedsięwzięcie') + ')';
      if (!RCATBY[r.cat]) add(nm + ': kategoria', fsel(ri, 'cat'), ri + '#cat');
      if (!r.t) add(nm + ': nazwa ryzyka', fsel(ri, 't'), ri + '#t');
      if (!r.pr) add(nm + ': prawdopodobieństwo', `[data-act="rk-pr"][data-k="${r.k}"]`, 'rkpr-' + r.k);
      if (!r.im) add(nm + ': wpływ', `[data-act="rk-im"][data-k="${r.k}"]`, 'rkim-' + r.k);
      if (!norm(r.ow)) add(nm + ': właściciel ryzyka', fsel(ri, 'ow'), ri + '#ow');
      if (String(r.tr || '0') !== '1' && !norm(r.ac)) add(nm + ': działanie (albo postępowanie „akceptacja”)', fsel(ri, 'ac'), ri + '#ac'); });
  }
  if (step === 6 && !aid) m.bens.forEach(b => { const bi = ID.bn(m.cid, b.k);
    if (b.std && b.on !== 'Y' && b.on !== 'N') add(b.n + ': dotyczy / nie dotyczy', `#ben-${b.k} .seg button`, 'bon-' + b.k);
    if (!b.in) return;
    if (!b.v) add(b.n + ': wartość korzyści', `#ben-${b.k} [data-act="bn-v"]`, 'bv-' + b.k);
    if (!b.cf) add(b.n + ': pewność oszacowania', `#ben-${b.k} [data-act="bn-cf"]`, 'bcf-' + b.k);
    if (!b.std && !norm(b.n)) add('Korzyść: nazwa', fsel(bi, 'n'), bi + '#n'); });
  return out;
}
/* pierwszy krok z brakami przed krokiem docelowym (0 – można przejść) */
function gate(m, aid, want) { for (let s = 1; s < Math.min(want, NS); s++) if (required(m, s, aid).length) return s; return 0; }

/* ---------- ocena: pokrycie, indeks dopasowania, luki krytyczne, nakłady, rekomendacja ---------- */
function verdict(m, aid) {
  const s = slice(m, aid), rs = s.reqs, tot = rs.length, c = cnt(rs);
  const done = rs.filter(r => r.done).length, cov = tot ? done / tot : 0, fi = fitIndex(rs);
  const gaps = s.gaps.filter(r => !r.wd), crit = gaps.filter(r => r.crit);
  const md = gaps.reduce((x, r) => x + r.md, 0), noEff = gaps.filter(r => !r.eff).length;
  const chg = gaps.filter(r => r.res === 'proc'), chgHi = chg.filter(r => +r.imp === 3);
  const open = s.risks.filter(r => r.st !== 'Z'), rkCrit = open.filter(r => r.lv === 3), rkHi = open.filter(r => r.lv === 2);
  const rkNo = rkCrit.concat(rkHi).filter(r => !norm(r.ac) && String(r.tr) !== '1');
  const P = D.verdict;
  let k;
  if (!tot || cov < P.minCov) k = 'wait';
  else if (fi != null && fi >= P.goFit && !crit.length && !rkNo.filter(r => r.lv === 3).length) k = 'go';
  else if (fi != null && fi >= P.condFit && crit.length <= P.condCrit) k = 'cond';
  else k = 'nogo';
  const byRes = {}; RES.forEach(x => { byRes[x.k] = {n: 0, md: 0}; }); gaps.forEach(r => { if (byRes[r.res]) { byRes[r.res].n++; byRes[r.res].md += r.md; } });
  return {k, cov, fi, c, tot, done, open: c.O, gaps, crit, md, noEff, chg, chgHi, rkCrit, rkHi, rkNo, byRes};
}
function benefitSum(m) {
  const on = m.bens.filter(b => b.in);
  return {on, hi: on.filter(b => +b.v >= 3), pln: on.reduce((s, b) => s + num(b.pln), 0), fte: on.reduce((s, b) => s + num(b.fte), 0), score: on.reduce((s, b) => s + b.score, 0)};
}
function bcase(m) {
  const c = m.co, rate = num(c.rate), base = num(c.base), other = num(c.oth), symf = num(c.symf), axc = num(c.axc);
  const gapMd = verdict(m, '').md, bs = benefitSum(m);
  const oneOff = (base + gapMd) * rate + other, annual = symf - axc + bs.pln;
  return {rate, base, other, symf, axc, gapMd, oneOff, benPln: bs.pln, annual, payback: annual > 0 && oneOff > 0 ? oneOff / annual : null, any: !!(rate || base || other || symf || axc)};
}
/* lista braków i spraw otwartych – strona Wynik */
function issues(m, aid) {
  const s = slice(m, aid), out = [], add = (step, a, txt, n) => { if (n) out.push({step, a, txt, n}); };
  if (!aid) { add(1, '', 'Nie wskazano obszarów objętych analizą', m.inArea.length ? 0 : 1); add(1, '', 'Obszary bez decyzji o zakresie', m.areas.filter(a => !a.on).length); }
  s.areas.forEach(a => {
    const pr = s.procs.filter(p => p.a === a.k), act = pr.filter(p => p.act), rs = s.reqs.filter(r => r.a === a.k), nm = a.n;
    add(1, a.k, nm + ': brak eksperta ' + m.co.srcCo + ' lub ' + m.co.tgtCo, a.ecc && a.ecp ? 0 : 1);
    add(2, a.k, nm + ': procesy bez decyzji „dotyczy / nie dotyczy”', pr.filter(p => p.on !== 'Y' && p.on !== 'N').length);
    add(2, a.k, nm + ': procesy bez właściciela w ' + m.co.srcCo, act.filter(p => !norm(p.occ)).length);
    add(3, a.k, nm + ': wymagania bez oceny dopasowania', rs.filter(r => !r.st).length);
    add(3, a.k, nm + ': pytania do wyjaśnienia', rs.filter(r => r.open).length);
    add(3, a.k, nm + ': luki bez sposobu zamknięcia, priorytetu lub opisu praktyki ' + m.co.srcCo, rs.filter(r => r.gap && !reqOk(r)).length);
    add(4, a.k, nm + ': luki bez pracochłonności lub opisu rozwiązania', rs.filter(r => r.gap && !gapOk(r)).length);
    add(4, a.k, nm + ': luki krytyczne bez zaakceptowanego rozwiązania', rs.filter(r => r.crit && r.dec !== 'A').length);
    add(5, a.k, nm + ': brak przeglądu ryzyk', groupOk(m, s, a.k) ? 0 : 1);
    add(5, a.k, nm + ': ryzyka wysokie i krytyczne bez właściciela lub działania', s.risks.filter(r => r.a === a.k && r.lv >= 2 && r.st !== 'Z' && (!norm(r.ow) || (!norm(r.ac) && String(r.tr) !== '1'))).length);
    add(7, a.k, nm + ': wyniki niepotwierdzone przez ekspertów obszaru', a.sg ? 0 : 1);
  });
  if (!aid) {
    add(5, '', 'Ryzyka całego przedsięwzięcia: brak przeglądu', groupOk(m, s, GLOBAL) ? 0 : 1);
    add(6, '', 'Korzyści bez decyzji lub oceny', m.bens.filter(b => (b.std && b.on !== 'Y' && b.on !== 'N') || (b.in && (!b.v || !b.cf))).length);
    add(7, '', 'Brak rekomendacji zespołu analizy', VERDBY[m.co.rec] ? 0 : 1);
  }
  return out;
}
/* podpowiedzi ryzyk: ryzyka systemowe migracji, luki krytyczne, duże zmiany procesów w CC */
function suggestions(m, aid) {
  const s = slice(m, aid), out = [], has = src => m.risks.some(r => r.src === src);
  if (!aid) SYSR.forEach(x => { const key = 'sys-' + x.k; if (m.dis[key] || has(key)) return;
    out.push({key, kind: 'sys', a: GLOBAL, q: '', cat: x.cat, t: x.t, ds: x.ds, ac: x.ac, pr: x.pr, im: x.im, sub: (RCATBY[x.cat] || {}).n || ''}); });
  s.reqs.forEach(r => { if (!r.crit) return; const key = 'gap-' + r.k; if (m.dis[key] || has(key)) return;
    out.push({key, kind: 'gap', a: r.a, q: r.k, cat: r.reg ? 'law' : r.res === 'int' ? 'int' : 'func', t: 'Luka krytyczna: ' + trunc(r.t, 80),
      ds: 'Wymaganie ' + r.code + ' (proces „' + r.proc.n + '”) nie jest obsługiwane przez ' + m.co.tgtSys + ' w ' + m.co.tgtCo + '. Planowane zamknięcie: ' + (resName(r.res) || 'do ustalenia').toLowerCase() + '.' + (norm(r.ds) ? ' ' + norm(r.ds) : ''),
      ac: '', pr: 3, im: r.reg ? 4 : 3, sub: r.code + ' · ' + r.proc.n}); });
  s.areas.forEach(a => { const hi = s.reqs.filter(r => r.a === a.k && r.gap && !r.wd && r.res === 'proc' && +r.imp === 3); if (!hi.length) return;
    const key = 'chg-' + a.k; if (m.dis[key] || has(key)) return;
    out.push({key, kind: 'chg', a: a.k, q: '', cat: 'org', t: 'Duże zmiany procesów w ' + m.co.srcCo + ': ' + a.n,
      ds: plural(hi.length, ['{n} zmiana', '{n} zmiany', '{n} zmian']) + ' procesowych o wysokiej skali (' + hi.slice(0, 3).map(r => r.code).join(', ') + (hi.length > 3 ? '…' : '') + '). Wymaga zarządzania zmianą, szkoleń i wsparcia po uruchomieniu.',
      ac: 'Plan zarządzania zmianą i szkoleń dla użytkowników ' + m.co.srcCo + '.', pr: 3, im: 2, sub: a.n}); });
  return out;
}
function lastChange(cid) {
  let best = null; const a = 'an|' + cid, b = '|' + cid + '|';
  Object.keys(S.e).forEach(id => { if (id !== a && id.indexOf(b) !== 2) return; const v = S.e[id]; if (v && v.ts && (!best || v.ts > best.ts)) best = v; });
  return best;
}

/* ---------- wspólna baza: tryb wieloosobowy, gdy obok aplikacji działa api.php ---------- */
const POLL = 15000;
const SH = {on: false, cfg: true, ok: false, mode: 'key', key: store.get(LSK) || '', seq: 0, synced: {}, st: '', at: null, timer: null, poll: null, busy: false, again: false};
const needKey = () => SH.on && SH.cfg && !SH.ok && SH.mode !== 'access';
const entries = () => Object.keys(S.e).filter(id => S.e[id] && S.e[id].ts && ID_RE.test(id)).map(id => [id, S.e[id]]);
const dirty = () => entries().filter(([id, v]) => !SH.synced[id] || v.ts > SH.synced[id]);
function api(method, q, body) {
  const h = {'X-Team-Key': SH.key}; if (body) h['Content-Type'] = 'application/json';
  return fetch('api.php' + (q || ''), {method, cache: 'no-store', headers: h, body: body ? JSON.stringify(body) : undefined})
    .then(r => r.status === 401 ? Promise.reject(Object.assign(new Error('auth'), {auth: true})) : r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)));
}
function setSync(st) { SH.st = st; if (st === 'ok') SH.at = new Date(); if (RENDERING) { setTimeout(() => setSync(SH.st), 0); return; } const el = $('#sync'); if (el) el.outerHTML = syncChip(); }
/* scalanie rekordu lokalnego i zdalnego pole po polu: wygrywa nowsza zmiana pola; gdy wygrało pole lokalne – rekord wraca do wysłania */
const same = (a, b) => JSON.stringify(a == null ? null : a) === JSON.stringify(b == null ? null : b);
function mergeRec(cur, v) {
  const lt = cur._t || {}, rt = v._t || {}, base = v.ts >= cur.ts ? v : cur, out = Object.assign({}, base), tt = {};
  let local = false;
  uniq(Object.keys(lt).concat(Object.keys(rt))).forEach(f => { const l = lt[f] || '', r = rt[f] || '', w = l > r ? cur : v;
    tt[f] = l > r ? l : r; if (f in w) out[f] = w[f]; else delete out[f];
    if (w === cur && !same(cur[f], v[f])) local = true; });
  out._t = tt;
  if (local) { out.ts = new Date(Math.max(Date.now(), (Date.parse(v.ts) || 0) + 1, (Date.parse(cur.ts) || 0) + 1)).toISOString(); out.by = cur.by || ''; } else { out.ts = v.ts; out.by = v.by || ''; }
  return {rec: out, local};
}
function applyRemote(list) {
  let n = 0;
  list.forEach(([id, v]) => { if (typeof id !== 'string' || !ID_RE.test(id) || !v || !v.ts) return;
    const cur = S.e[id]; SH.synced[id] = v.ts;
    if (cur && cur.del) return;                                             // usunięcie jest trwałe
    if (!cur || !cur.ts || v.del) { if (!cur || !cur.ts || v.ts > cur.ts || v.del) { S.e[id] = noMail(id, v); n++; } return; }
    if (cur.ts === v.ts) return;                                             // ten sam zapis (np. nasz własny)
    const mr = mergeRec(cur, noMail(id, v));
    if (mr.local) SH.remerge = true;
    if (!same(mr.rec, cur)) { S.e[id] = mr.rec; n++; } });
  if (n) REV++;
  return n;
}
async function pull() { const r = await api('GET', '?since=' + SH.seq); const n = applyRemote(r.e || []); SH.seq = r.seq || SH.seq; if (n) { saveLocal(); render(); } if (SH.remerge) { SH.remerge = false; pushSoon(); } return n; }
async function push() { const ch = dirty(); if (!ch.length) return 0; for (let i = 0; i < ch.length; i += 2000) await api('POST', '', {ch: ch.slice(i, i + 2000)}); ch.forEach(([id, v]) => { SH.synced[id] = v.ts; }); return ch.length; }
async function sync() {
  if (!SH.on || !SH.ok) return;
  if (SH.busy) { SH.again = true; return; }
  SH.busy = true; clearTimeout(SH.timer); if (SH.st !== 'pending') setSync('busy');
  try { await push(); await pull(); setSync(dirty().length ? 'pending' : 'ok'); }
  catch (e) { if (e.auth && SH.mode === 'access') setSync('auth'); else if (e.auth) { SH.ok = false; SH.key = ''; store.set(LSK, ''); setSync('auth'); openModal('who'); } else setSync('err'); }
  finally { SH.busy = false; if (SH.again) { SH.again = false; sync(); } }
}
function pushSoon() { clearTimeout(SH.timer); if (SH.st !== 'err') setSync('pending'); SH.timer = setTimeout(sync, 700); }
function startPolling() {
  if (SH.poll) return;
  SH.poll = setInterval(() => { if (!document.hidden) sync(); }, POLL);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  window.addEventListener('online', sync);
}
async function connect(key) {
  SH.key = key; SH.seq = 0; SH.synced = {};
  const r = await api('GET', '?since=0');
  applyRemote(r.e || []); SH.seq = r.seq || 0; SH.ok = true; store.set(LSK, key); saveLocal();
  render(); startPolling(); await sync();
}
async function detectShared() {
  if (location.protocol === 'file:' || /\.github\.io$/.test(location.hostname)) return;
  let j = null;
  try { const r = await fetch('api.php?ping', {cache: 'no-store'}); if (r.ok) j = await r.json(); } catch (e) { return; }
  if (!j || j.app !== 'fitgap') return;
  SH.on = true; SH.cfg = !!j.configured;
  if (!SH.cfg) { SH.st = 'config'; renderTop(); return; }
  SH.st = 'busy'; renderTop();
  if (j.auth === 'access') {
    SH.mode = 'access';
    try { await connect(''); } catch (e) { SH.ok = !e.auth; if (SH.ok) startPolling(); setSync(e.auth ? 'auth' : 'err'); }
    return;
  }
  if (SH.key) {
    try { await connect(SH.key); return; }
    catch (e) { if (!e.auth) { SH.ok = true; startPolling(); setSync('err'); return; } SH.key = ''; store.set(LSK, ''); }
  }
  SH.st = 'auth'; renderTop(); openModal('who');
}

/* ---------- wymiana danych (JSON) ---------- */
/* pobieranie plików: w podglądzie osadzonym w claude.ai pliki zapisuje funkcja „downloads” strony; na własnym hostingu – zwykły link */
let DLCAP;
const dlCap = () => { if (DLCAP === undefined) DLCAP = window.claude && typeof window.claude.use === 'function' ? Promise.resolve(window.claude.use('downloads')).catch(() => null) : Promise.resolve(null); return DLCAP; };
async function download(name, blob) {
  const cap = await dlCap();
  if (cap) {
    try { await cap.save({filename: name, data: blob}); return true; }
    catch (e) { const c = e && e.code; if (c !== 'declined') toast(c === 'rejected_extension' || c === 'extension_not_enabled' ? 'Ten rodzaj pliku można pobrać tylko w wersji wdrożonej aplikacji.' : 'Nie udało się zapisać pliku w tym widoku.'); return false; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); return true;
}
function exportJson() {
  const body = {app: APP, v: 1, at: now(), by: S.who, e: S.e};
  download(`FitGap_dane_${slug(S.name) || 'zespol'}_${today()}.json`, new Blob([JSON.stringify(body)], {type: 'application/json'}))
    .then(ok => { if (ok) toast('Zapisano plik z danymi analizy. Plik zawiera informacje wewnętrzne – przechowuj go zgodnie z zasadami bezpieczeństwa informacji.'); });
}
function importJson(text) {
  let o; try { o = JSON.parse(text); } catch (e) { toast('To nie jest plik z danymi tego narzędzia.'); return; }
  if (!o || o.app !== APP || !o.e || typeof o.e !== 'object') { toast('To nie jest plik z danymi tego narzędzia.'); return; }
  let n = 0;
  Object.keys(o.e).forEach(id => { const b = o.e[id], a = S.e[id]; if (!ID_RE.test(id) || !b || !b.ts) return;
    if (a && a.del && !b.del) return;
    if (!a || (b.del && !a.del) || (b.ts || '') > (a.ts || '')) { S.e[id] = noMail(id, b); n++; } });
  save(); render(); toast(`Wczytano dane${o.by ? ' – ' + o.by : ''}. Zaktualizowane wpisy: ${n}.`);
}
