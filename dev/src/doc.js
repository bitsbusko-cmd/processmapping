/* ===================== Fit-Gap ERP – dokumenty: raport końcowy, agenda i pytania dla uczestników ===================== */
const lines = t => String(t || '').split(/\r?\n/).map(norm).filter(Boolean);
const docTbl = (head, rows, empty) => `<table><thead><tr>${head.map(h => `<th${h[1] ? ' class="n"' : ''}>${esc(h[0])}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td colspan="${head.length}" class="muted">${esc(empty || 'Brak danych.')}</td></tr>`}</tbody></table>`;
function renderDoc(m) {
  const back = V.doc === 'agenda' ? href(1, '') : href(UI.last && UI.last.c === m.cid && UI.last.s ? UI.last.s : NS, '');
  const bar = `<div class="docbar noprint"><a class="btn" href="${back}">${ic('left')}Wróć do analizy</a><span class="grow"></span>
    ${V.doc === 'agenda' ? '<span class="sm muted">Zapisz jako PDF i wyślij uczestnikom w załączniku e-maila.</span>' : ''}<button type="button" class="btn pri" data-act="print">${ic('print')}Drukuj lub zapisz PDF</button>${V.doc === 'raport' ? `<button type="button" class="btn" data-act="xlsx">${ic('sheet')}Raport Excel</button>` : ''}</div>`;
  return bar + (V.doc === 'agenda' ? agendaDoc(m, V.docA) : reportDoc(m));
}

/* ---------- raport końcowy analizy fit-gap ---------- */
function reportDoc(m) {
  const co = m.co, s = slice(m, ''), v = verdict(m, ''), bs = benefitSum(m), bc = bcase(m), pr = progress(m, '');
  const rec = VERDBY[co.rec];
  const kpi = (lb, val, sub) => `<div class="stat"><span class="lb">${esc(lb)}</span><b>${esc(val)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const cover = `<div class="cover"><div class="k">Analiza Fit-Gap ERP · raport końcowy</div><h1>${esc(co.n)}</h1><p class="sub">${esc(sysCC(co))} → ${esc(sysCP(co))}</p>
    <div class="meta"><div><span>Sponsor</span>${esc(co.sp || '–')}</div><div><span>Lider analizy</span>${esc(co.pl || '–')}</div><div><span>Stan na</span>${esc(fdt(now()))}</div>
      <div><span>Okres analizy</span>${esc(co.start ? fd(co.start) + ' – ' + fd(today()) : 'w toku')}</div><div><span>Status</span>${co.sg ? 'zatwierdzona – ' + esc(co.sg) + ', ' + esc(fd(co.sgAt)) : 'w toku · postęp ' + pr.pct + '%'}</div><div><span>Przygotował(a)</span>${esc(S.who || '–')}</div></div></div>`;
  /* 1. podsumowanie */
  const topBen = bs.on.slice().sort((x, y) => y.score - x.score).slice(0, 3);
  const bul = [
    `Oceniono <b>${v.done} z ${esc(plural(v.tot, F_REQ))}</b> (${fpct(v.cov)}) w ${esc(plural(s.areas.length, F_AREA))}${v.open ? `; do wyjaśnienia pozostaje ${esc(plural(v.open, F_Q))}` : ''}.`,
    `Indeks dopasowania do szablonu ${esc(co.tgtSys)} w ${esc(co.tgtCo)}: <b>${fpct(v.fi)}</b>. Pełne dopasowanie: ${v.c.F}, częściowe: ${v.c.P}, luki: ${v.c.G}, nie dotyczy: ${v.c.N}.`,
    `Luki do zamknięcia: <b>${v.gaps.length}</b>, w tym krytyczne: <b>${v.crit.length}</b>. Szacowana pracochłonność: <b>${fnum(v.md)} osobodni</b>${v.noEff ? ` (bez oszacowania: ${v.noEff})` : ''}.`,
    `Zmiany procesowe w ${esc(co.srcCo)}: <b>${v.chg.length}</b>${v.chgHi.length ? `, w tym ${v.chgHi.length} o wysokiej skali` : ''}.`,
    `Ryzyka krytyczne: <b>${v.rkCrit.length}</b>, wysokie: <b>${v.rkHi.length}</b>${v.rkNo.length ? ` – bez zaplanowanych działań: ${v.rkNo.length}` : ''}.`,
    bs.on.length ? `Wartość dodana: ${esc(plural(bs.on.length, ['{n} korzyść', '{n} korzyści', '{n} korzyści']))}${bs.pln ? ', wycenione na ' + esc(fpln(bs.pln)) + ' rocznie' : ''}; najważniejsze: ${topBen.map(b => esc(b.n)).join('; ')}.` : 'Korzyści nie zostały jeszcze ocenione.',
    bc.rate ? `Szacowany nakład jednorazowy: <b>${esc(fpln(bc.oneOff))}</b>${bc.payback != null ? `; prosty okres zwrotu: <b>${fnum(bc.payback, 1)} lat</b>` : ''}.` : ''].filter(Boolean);
  const conds = lines(co.recC), nexts = lines(co.next);
  const sum = `<h2>Podsumowanie dla zarządu</h2>
    ${rec ? verdictPanel(m, v, {k: co.rec, kick: 'Rekomendacja zespołu analizy', text: norm(co.recJ) || rec.d, noCrit: true}) : `<div class="note warn">${ic('info')}<p>Zespół analizy nie wpisał jeszcze rekomendacji. Poniżej propozycja wynikająca z danych.</p></div>`}
    ${verdictPanel(m, v, rec ? {kick: 'Propozycja wynikająca z danych'} : {})}
    <div class="kpis">${kpi('Indeks dopasowania', fpct(v.fi), 'ważony priorytetem')}${kpi('Luki krytyczne', String(v.crit.length), 'luki razem: ' + v.gaps.length)}${kpi('Zmiany procesowe w ' + co.srcCo, String(v.chg.length), v.chgHi.length ? 'wysoka skala: ' + v.chgHi.length : '')}${kpi('Pracochłonność luk', fnum(v.md) + ' md', bc.rate ? '≈ ' + fpln(v.md * bc.rate) : '')}</div>
    <h3>Najważniejsze ustalenia</h3><ul>${bul.map(x => `<li>${x}</li>`).join('')}</ul>
    ${conds.length ? `<h3>Warunki migracji</h3><ol>${conds.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}`;
  /* 2. zakres i metoda */
  const arRows = m.areas.filter(a => a.in || a.later).map(a => { const rs = s.reqs.filter(r => r.a === a.k);
    return `<tr><td><b>${esc(a.n)}</b></td><td>${a.in ? 'w zakresie' : 'kolejny etap'}</td><td>${esc(a.ecc ? a.ecc.n : '–')}</td><td>${esc(a.ecp ? a.ecp.n : '–')}</td><td class="n">${a.in ? m.procs.filter(p => p.a === a.k && p.act).length : '–'}</td><td class="n">${a.in ? rs.length : '–'}</td></tr>`; });
  const scope = `<h2>Zakres i metoda</h2>${norm(co.scope) ? lines(co.scope).map(x => `<p>${esc(x)}</p>`).join('') : ''}
    <h3>Obszary analizy</h3>${docTbl([['Obszar'], ['Zakres'], ['Ekspert ' + co.srcCo], ['Ekspert ' + co.tgtCo], ['Procesy', 1], ['Wymagania', 1]], arRows, 'Nie wskazano obszarów.')}
    ${m.areas.filter(a => a.on === 'N').length ? `<p class="sm muted">Poza zakresem: ${esc(m.areas.filter(a => a.on === 'N').map(a => a.n).join(', '))}.</p>` : ''}
    <h3>Zespół i uczestnicy</h3>${docTbl([['Imię i nazwisko'], ['Zespół'], ['Rola'], ['Obszary key usera']], m.people.map(p => `<tr><td>${esc(p.n)}</td><td>${esc(p.co || '')}</td><td>${esc(p.role || '')}</td><td class="sm">${esc(p.kas.map(x => x.n).join('; ') || '–')}</td></tr>`), 'Brak osób.')}
    <h3>Metoda oceny</h3><p>Punktem odniesienia jest szablon ${esc(co.tgtSys)} w ${esc(co.tgtCo)} – sposób, w jaki ${esc(co.tgtCo)} faktycznie pracuje w systemie. Dla każdego pytania z katalogu zapisano praktykę ${esc(co.srcCo)} i ${esc(co.tgtCo)} oraz ocenę dopasowania:</p>
    <ul>${FIT.map(f => `<li><b>${esc(f.n)}</b> – ${esc(f.d)}</li>`).join('')}</ul>
    <p>Indeks dopasowania to średnia ocen (Fit = 1, Częściowe = ${D.fitW.P}, Luka = 0) ważona priorytetem MoSCoW (Must ×${D.priW.M}, Should ×${D.priW.S}, Could ×${D.priW.C}). Luka krytyczna to luka o priorytecie Must, która wymaga rozwoju AX, integracji albo obejścia poza ERP.</p>`;
  /* 3. wyniki według obszarów */
  const byArea = `<h2>Wyniki według obszarów</h2>` + s.areas.map(a => { const rs = s.reqs.filter(r => r.a === a.k), c = cnt(rs), fi = fitIndex(rs), act = m.procs.filter(p => p.a === a.k && p.act);
    const keyG = rs.filter(r => r.gap && !r.wd && (r.crit || r.pri0 === 'M')).slice(0, 6);
    return `<h3>${esc(a.n)} – indeks ${fpct(fi)}</h3><div style="max-width:420px;margin:4px 0 8px">${fbarHtml(c, true)}</div>
      <p class="sm">Fit: ${c.F} · częściowe: ${c.P} · luki: ${c.G} · nie dotyczy: ${c.N} · do wyjaśnienia: ${c.O}${c.U ? ' · bez oceny: ' + c.U : ''}${a.sg ? ' · wyniki potwierdzone: ' + esc(a.sg) : ''}</p>
      ${docTbl([['Proces'], ['Wspólny standard'], ['Indeks', 1], ['Luki', 1], ['Właściciel ' + co.srcCo]], act.map(p => { const pc = p.c; return `<tr><td><span class="mono sm">${esc(p.cd)}</span> ${esc(p.n)}</td><td>${esc(HARMBY[p.hm] ? HARMBY[p.hm].s : '–')}${p.hm === 'N' && norm(p.hmj) ? '<br><span class="sm muted">' + esc(p.hmj) + '</span>' : ''}</td><td class="n">${fpct(fitIndex(p.reqs))}</td><td class="n">${pc.P + pc.G}</td><td>${esc(p.occ || '–')}</td></tr>`; }), 'Brak procesów.')}
      ${keyG.length ? `<p class="sm"><b>Kluczowe luki:</b> ${keyG.map(r => esc(r.code + ' ' + trunc(r.t, 90))).join('; ').replace(/([^…])$/, '$1.')}</p>` : ''}`; }).join('');
  /* 4. rejestr luk */
  const gl = v.gaps.slice().sort((x, y) => (y.crit - x.crit) || ((D.priW[y.pri0] || 0) - (D.priW[x.pri0] || 0)) || (effMd(y.eff) - effMd(x.eff)));
  const wd = s.gaps.filter(r => r.wd);
  const gaps = `<h2>Rejestr luk</h2><p>Luki i dopasowania częściowe wraz ze sposobem zamknięcia, priorytetem, pracochłonnością i decyzją. Pracochłonność w szacunku: ${EFF.map(e => e.n + ' = ' + e.md + ' md').join(', ')}.</p>
    ${docTbl([['Kod'], ['Wymaganie i rozwiązanie'], ['Ocena'], ['Zamknięcie'], ['Prior.'], ['Pracochł.'], ['Decyzja']], gl.map(r => `<tr><td class="mono sm">${esc(r.code)}</td><td><b>${esc(r.t)}</b>${r.crit ? ' <span class="critb">krytyczna</span>' : ''}${norm(r.ds) ? `<br><span class="sm">${esc(r.ds)}</span>` : ''}${norm(r.ow) ? `<br><span class="sm muted">Odpowiedzialny: ${esc(r.ow)}</span>` : ''}</td><td>${esc(fitName(r.st))}</td><td>${esc(resName(r.res) || '–')}</td><td>${esc((PRIBY[r.pri0] || {}).n || '')}</td><td>${esc(r.eff || '–')}</td><td>${esc((DECBY[r.dec || 'P'] || {}).n)}</td></tr>`), 'Brak luk.')}
    ${wd.length ? `<p class="sm muted">Wymagania wycofane przez ${esc(co.srcCo)}: ${wd.map(r => esc(r.code)).join(', ')}.</p>` : ''}`;
  /* 5. zmiany procesowe */
  const chg = `<h2>Zmiany procesowe w ${esc(co.srcCo)}</h2><p>Zmiany, które ${esc(co.srcCo)} wprowadzi, przyjmując sposób pracy ${esc(co.tgtCo)} w ${esc(co.tgtSys)} – wejście do planu zarządzania zmianą i szkoleń.</p>
    ${docTbl([['Kod'], ['Proces i zmiana'], ['Skala'], ['Kogo dotyczy'], ['Szkolenie'], ['Etap']], v.chg.slice().sort((x, y) => (+y.imp || 0) - (+x.imp || 0)).map(r => `<tr><td class="mono sm">${esc(r.code)}</td><td><b>${esc(r.proc.n)}</b><br>${esc(norm(r.chg) || r.t)}</td><td>${r.imp ? esc(IMP[r.imp - 1].n) : '–'}</td><td>${esc(r.who || '–')}</td><td>${r.tr ? 'tak' : '–'}</td><td>${esc(r.ph || '–')}</td></tr>`), 'Brak zmian procesowych.')}`;
  /* 6. ryzyka */
  const rk = `<h2>Ryzyka</h2>${docTbl([['Poziom'], ['Ryzyko'], ['Kategoria'], ['Właściciel'], ['Działanie'], ['Termin'], ['Status']], s.risks.slice().sort((x, y) => y.score - x.score).map(r => `<tr><td>${r.score ? r.score + ' · ' + esc(D.riskLv[r.lv].n) : '–'}</td><td><b>${esc(r.t || '–')}</b>${norm(r.ds) ? `<br><span class="sm">${esc(trunc(r.ds, 260))}</span>` : ''}<br><span class="sm muted">${esc(r.area ? r.area.n : 'całe przedsięwzięcie')}</span></td><td>${esc((RCATBY[r.cat] || {}).n || '–')}</td><td>${esc(r.ow || '–')}</td><td>${esc(r.ac || (String(r.tr) === '1' ? 'akceptacja' : '–'))}</td><td>${esc(fd(r.due) || '–')}</td><td>${esc(RST[r.st || 'O'])}</td></tr>`), 'Brak ryzyk w rejestrze.')}`;
  /* 7. wartość dodana i nakłady */
  const val = `<h2>Wartość dodana i szacunek nakładów</h2>${docTbl([['Korzyść'], ['Kategoria'], ['Wartość'], ['Pewność'], ['Horyzont'], ['zł / rok', 1]], bs.on.slice().sort((x, y) => y.score - x.score).map(b => `<tr><td><b>${esc(b.n)}</b>${norm(b.j) ? `<br><span class="sm">${esc(trunc(b.j, 240))}</span>` : ''}</td><td>${esc((BCATBY[b.cat] || {}).n || '')}</td><td>${esc((D.benV[b.v - 1] || {}).n || '–')}</td><td>${esc((D.benCf[b.cf - 1] || {}).n || '–')}</td><td>${esc(b.hz || '–')}</td><td class="n">${num(b.pln) ? esc(fnum(num(b.pln))) : '–'}</td></tr>`), 'Korzyści nie zostały ocenione.')}
    ${bc.any || bc.gapMd ? `<h3>Szacunek nakładów (orientacyjny)</h3>${docTbl([['Pozycja'], ['Wartość', 1]], [
      `<tr><td>Nakład bazowy wdrożenia</td><td class="n">${fnum(bc.base)} md</td></tr>`, `<tr><td>Pracochłonność luk (rejestr luk)</td><td class="n">${fnum(bc.gapMd)} md</td></tr>`,
      `<tr><td>Stawka za osobodzień</td><td class="n">${bc.rate ? esc(fpln(bc.rate)) : '–'}</td></tr>`, `<tr><td>Inne koszty jednorazowe</td><td class="n">${esc(fpln(bc.other))}</td></tr>`,
      `<tr><td><b>Nakład jednorazowy</b></td><td class="n"><b>${bc.rate ? esc(fpln(bc.oneOff)) : '–'}</b></td></tr>`, `<tr><td>Roczna zmiana kosztów IT (${esc(co.srcSys)} minus AX dla ${esc(co.srcCo)})</td><td class="n">${esc(fpln(bc.symf - bc.axc))}</td></tr>`,
      `<tr><td>Korzyści wycenione rocznie</td><td class="n">${esc(fpln(bc.benPln))}</td></tr>`, `<tr><td><b>Efekt roczny razem</b></td><td class="n"><b>${esc(fpln(bc.annual))}</b></td></tr>`,
      `<tr><td>Prosty okres zwrotu</td><td class="n">${bc.payback != null ? fnum(bc.payback, 1) + ' lat' : '–'}</td></tr>`])}<p class="sm muted">Szacunek do weryfikacji z partnerem wdrożeniowym i właścicielami kosztów.</p>` : ''}`;
  /* 8. pytania otwarte i następne kroki */
  const oq = s.reqs.filter(r => r.open), iss = issues(m, '');
  const open = `<h2>Sprawy otwarte i następne kroki</h2>${oq.length ? `<h3>Pytania do wyjaśnienia</h3>${docTbl([['Kod'], ['Pytanie'], ['Notatki']], oq.map(r => `<tr><td class="mono sm">${esc(r.code)}</td><td>${esc(r.t)}</td><td class="sm">${esc([r.cc, r.cp].filter(x => norm(x)).join(' · ') || '–')}</td></tr>`))}` : '<p>Brak pytań do wyjaśnienia.</p>'}
    ${nexts.length ? `<h3>Następne kroki</h3><ol>${nexts.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
    ${iss.length ? `<h3>Braki w danych analizy</h3><ul>${iss.slice(0, 15).map(x => `<li>${esc(x.txt)}${x.n > 1 ? ' (' + x.n + ')' : ''}</li>`).join('')}${iss.length > 15 ? `<li>…oraz ${iss.length - 15} kolejnych</li>` : ''}</ul>` : ''}`;
  /* 9. akceptacja */
  const acc = `<h2>Akceptacja</h2><p>Potwierdzenie wyników przez ekspertów obszarów i zatwierdzenie analizy przez sponsora.</p>
    ${docTbl([['Obszar'], ['Potwierdzenie'], ['Data']], s.areas.map(a => `<tr><td>${esc(a.n)}</td><td>${esc(a.sg || 'niepotwierdzone')}</td><td>${esc(a.sgAt ? fd(a.sgAt) : '–')}</td></tr>`), 'Brak obszarów.')}
    <div class="sigs"><div><b>${esc(co.sg || co.sp || 'Sponsor analizy')}</b>${co.sg ? 'zatwierdził(a) ' + esc(fd(co.sgAt)) : 'sponsor – data i podpis'}</div><div><b>${esc(co.pl || 'Lider analizy')}</b>lider analizy – data i podpis</div></div>
    <div class="foot2">Dokument wewnętrzny · ${esc(co.n)} · wygenerowano ${esc(fdt(now()))} w narzędziu Analiza Fit-Gap ERP (wersja ${esc(VER)})</div>`;
  return `<article class="doc">${cover}${sum}${scope}${byArea}${gaps}${chg}${rk}${val}${open}${acc}</article>`;
}

/* ---------- agenda i pytania dla uczestników obszaru (PDF w załączniku e-maila) ---------- */
function agendaDoc(m, aid) {
  const co = m.co, a = m.ABY[aid];
  if (!a) return '<div class="empty"><b>Nie znaleziono obszaru</b></div>';
  const procs = m.procs.filter(p => p.a === a.k && p.on !== 'N'), parts = a.us.map(k => m.OBY[k]).filter(Boolean);
  const nq = procs.reduce((x, p) => x + p.reqs.length, 0);
  const meta = `<div class="meta"><div><span>Ekspert ${esc(co.srcCo)}</span>${esc(a.ecc ? a.ecc.n : '–')}</div><div><span>Ekspert ${esc(co.tgtCo)}</span>${esc(a.ecp ? a.ecp.n : '–')}</div><div><span>Key user</span>${esc(a.kus.map(x => x.n).join(', ') || '–')}</div>
    <div><span>Zakres</span>${esc(plural(procs.length, F_PROC))} · ${esc(plural(nq, F_Q))}</div><div><span>Lider analizy</span>${esc(co.pl || '–')}</div><div><span>Przygotowano</span>${esc(fd(today()))}</div></div>`;
  const plan = [`Cel, skala oceny i sposób pracy (5 min)`, ...procs.map(p => `${p.cd} ${p.n} – ${plural(p.reqs.length, F_Q)}`), 'Podsumowanie: luki, pytania otwarte, kolejne kroki (10 min)'];
  const qs = procs.map(p => `<h3><span class="mono">${esc(p.cd)}</span> ${esc(p.n)}</h3>${p.d ? `<p class="sm muted">${esc(p.d)}</p>` : ''}
    <ol class="qlist">${p.reqs.map(r => `<li data-c="${esc(r.code)}"><div><b>${esc(r.t)}</b>${r.h ? `<div class="sm muted">${esc(r.h)}</div>` : ''}
      <div class="ans"><div><span class="src">${esc(co.srcCo)}</span> ${esc(r.cc || '')}</div><div><span class="tgt">${esc(co.tgtCo)}</span> ${esc(r.cp || '')}</div></div></div></li>`).join('')}</ol>`).join('');
  return `<article class="doc"><div class="cover"><div class="k">Analiza Fit-Gap ERP · agenda i pytania</div><h1>${esc(a.n)}</h1><p class="sub">${esc(co.n)} · ${esc(sysCC(co))} → ${esc(sysCP(co))}</p>${meta}</div>
    <h2>Cel</h2><p>Porównujemy procesy obszaru „${esc(a.n)}” w ${esc(co.srcCo)} (${esc(co.srcSys)}) z szablonem ${esc(co.tgtCo)} w systemie ${esc(co.tgtSys)} i oceniamy, czy szablon pokryje wymagania ${esc(co.srcCo)}. Każde pytanie dostaje ocenę: ${FIT.map(f => esc(f.n)).join(', ')}.</p>
    <p>Prosimy o zapoznanie się z pytaniami przed spotkaniem i przygotowanie przykładów: dokumentów, raportów, zestawień z systemu i plików Excel używanych w procesach. Odpowiedzi można wpisać w ramkach przy pytaniach.</p>
    ${parts.length ? `<h3>Uczestnicy</h3><ul>${parts.map(p => `<li>${esc(p.n)}${p.co || p.role ? ' – ' + esc([p.co, p.role].filter(Boolean).join(', ')) : ''}</li>`).join('')}</ul>` : ''}
    <h2>Agenda</h2><ol>${plan.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
    <h2>Pytania</h2>${qs || '<p>Brak procesów w obszarze – potwierdź je w kroku 2.</p>'}
    <h2>Skala oceny</h2><ul>${FIT.map(f => `<li><b>${esc(f.n)}</b> – ${esc(f.d)}</li>`).join('')}</ul>
    <div class="foot2">Dokument wewnętrzny · przygotowano ${esc(fdt(now()))} w narzędziu Analiza Fit-Gap ERP</div></article>`;
}

async function printView() {
  if (!(await dlCap())) { window.print(); return; }
  const css = (document.querySelector('style') || {}).textContent || '', main = $('#main').cloneNode(true);
  $$('.noprint, .docbar, .foot, .mselect', main).forEach(x => x.remove());
  const title = document.title, html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${css}</style></head><body style="background:#fff"><div class="wrap full"><main class="main">${main.innerHTML}</main></div></body></html>`;
  if (await download(slug(title).slice(0, 80) + '.html', new Blob([html], {type: 'text/html'}))) toast('Zapisano widok jako plik HTML – otwórz go w przeglądarce i wydrukuj albo zapisz jako PDF.');
}
