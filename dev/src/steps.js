/* ===================== Fit-Gap ERP – widoki: start i kroki analizy ===================== */
const noAreas = () => `<div class="empty"><b>Najpierw wskaż obszary objęte analizą</b>Procesy, ocenę dopasowania i luki prowadzimy dla obszarów w zakresie.<br><a class="btn pri" href="${href(1, '')}">Przejdź do kroku 1</a></div>`;
function nextStep(m) { if (!m.inArea.length) return 1; for (let i = 1; i < NS; i++) if (required(m, i, '').length) return i; return NS; }
const areaFilterChip = m => { const a = V.aid && m.ABY[V.aid]; return a ? `<span class="filt">${tile(a)}${esc(a.n)}<button type="button" data-act="area" data-a="" aria-label="Pokaż wszystkie obszary" title="Pokaż wszystkie obszary">${ic('x')}</button></span>` : ''; };
/* nazwy systemów bez łamania wiersza w środku („AX 2012”, „Symfonia ERP”) */
const nb = s => esc(s).replace(/AX 2012/g, 'AX&nbsp;2012').replace(/Symfonia ERP/g, 'Symfonia&nbsp;ERP');
const sysTags = co => `<span class="src">${esc(sysCC(co))}</span> ${ic('right')} <span class="tgt">${esc(sysCP(co))}</span>`;
const lastBy = x => x && x.ts ? `<span>Zmiana ${esc(fdt(x.ts))}${x.by ? ' · ' + esc(String(x.by).split(' · ')[0]) : ''}</span>` : '';
const moreBtn = (key, n, shown) => n > shown || V.open[key] ? `<div class="tmore noprint"><button type="button" class="lnk" data-act="tog" data-k="${key}">${V.open[key] ? 'Zwiń listę' : 'Pokaż wszystkie (' + n + ')'}</button></div>` : '';
const cap = (key, list, n) => V.open[key] ? list : list.slice(0, n);

/* ---------- strona startowa ---------- */
const CATIC = {F: '<path d="M19 7 9.5 16.5 5 12"/>', P: '<circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 0 1 0 14z" fill="currentColor" stroke="none"/>',
  G: '<path d="M17 7 7 17M7 7l10 10"/>', N: '<path d="M6.5 12h11"/>', O: '<path d="M9.3 9.2a2.8 2.8 0 1 1 3.9 2.6c-.7.3-1.2 1-1.2 1.7v.6"/><path d="M12 17.6h.01"/>'};
function renderStart() {
  const all = analyses();
  const cards = all.map(c => { const m = model(c.k), pr = progress(m, ''), v = verdict(m, ''), last = lastChange(c.k);
    const st = c.sg ? ['ok', 'Zatwierdzona'] : pr.started ? ['acc', 'W toku · ' + pr.pct + '%'] : ['', 'Nie rozpoczęto'];
    return `<a class="cocard an${pr.done ? ' done' : ''}" href="${href(nextStep(m), '', c.k)}" data-key="an-${esc(c.k)}">
      <div class="h"><span class="tile c-navy">${pic('arrows-left-right')}</span><b>${nb(c.n)}</b></div>
      <div class="sysl">${sysTags(c)}<span class="tag ${st[0]}">${esc(st[1])}</span></div>
      <div class="bar" role="progressbar" aria-label="Postęp analizy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pr.pct}"><i style="width:${pr.pct}%"></i></div>
      <div class="kv"><span><b>${m.inArea.length}</b>obszary</span><span><b>${v.tot ? v.done + '/' + v.tot : '–'}</b>ocenione wymagania</span><span><b>${v.fi != null ? fpct(v.fi) : '–'}</b>dopasowanie</span></div>
      <div class="ft"><span>${last ? 'Zmiana ' + esc(fdt(last.ts)) + (last.by ? ' · ' + esc(String(last.by).split(' · ')[0]) : '') : 'Brak danych'}</span><span class="lnk">${pr.started ? 'Kontynuuj' : 'Rozpocznij'}</span></div></a>`; }).join('');
  const add = `<button type="button" class="cocard add" data-act="addan" data-key="an-add">${ic('plus')}Nowa analiza fit-gap</button>`;
  const method = [['Zakres i zespół', 'obszary, liderzy procesu obu stron, uczestnicy, agenda i pytania'], ['Procesy AS-IS', 'procesy, właściciele, narzędzia, wolumeny'], ['Ocena fit-gap', 'praktyka obu jednostek i ocena dopasowania'],
    ['Luki i zmiany', 'rozwiązania, pracochłonność, zmiany w źródłowej jednostce organizacyjnej'], ['Ryzyka', 'ocena, właściciele i działania'], ['Wartość dodana', 'korzyści i szacunek nakładów'], ['Wynik', 'rekomendacja, akceptacje i raport końcowy']];
  const started = all.map(c => ({c, m: model(c.k)})).filter(x => progress(x.m, '').started);
  let overview = '';
  if (started.length) {
    const rows = started.map(({c, m}) => { const v = verdict(m, ''), pr = progress(m, '');
      return `<tr class="click" data-act="go" data-href="${href(nextStep(m), '', c.k)}"><td class="nm">${nb(c.n)}<span class="sub">${nb(c.srcSys)} → ${nb(c.tgtSys)}</span></td><td class="n">${m.inArea.length}</td><td class="n">${v.done}/${v.tot}</td><td class="n">${v.fi != null ? fpct(v.fi) : '–'}</td><td class="n">${v.gaps.length}</td><td class="n">${v.crit.length}</td><td class="n">${v.chg.length}</td><td class="n">${v.rkCrit.length + v.rkHi.length}</td><td>${VERDBY[c.rec] ? `<span class="tag ${c.rec === 'go' ? 'ok' : c.rec === 'cond' ? 'warn' : 'err'}">${esc(VERDBY[c.rec].n)}</span>` : `<span class="tag acc">${pr.pct}%</span>`}</td></tr>`; }).join('');
    overview = `<div class="card"><div class="cardb st-sec"><h2>Przegląd zbiorczy</h2><p class="blk">Analizy w toku. Kliknij wiersz, aby przejść do analizy.</p>
      <div class="tblwrap"><table class="ov sum"><thead><tr><th>Analiza</th><th class="n">Obszary</th><th class="n">Ocenione wymagania</th><th class="n">Indeks dopasowania</th><th class="n">Luki</th><th class="n">Luki krytyczne</th><th class="n">Zmiany procesowe</th><th class="n">Ryzyka wysokie i krytyczne</th><th>Rekomendacja</th></tr></thead><tbody>${rows}</tbody></table></div></div></div>`;
  }
  const flow = method.map((x, i) => `<li><span class="k">${i + 1}</span><b>${esc(x[0])}</b><span>${esc(x[1])}</span></li>`).join('');
  const cats = FIT.map(f => `<li class="${f.k}"><span class="bdg" aria-hidden="true"><svg class="ic" viewBox="0 0 24 24">${CATIC[f.k] || ''}</svg></span><b>${esc(f.l)}</b><span class="d">${esc(ucFirst(f.u || f.d))}</span></li>`).join('');
  return `<div class="card sthero">
    <div class="st-top">
      <div class="st-int"><h1>Analiza Fit-Gap ERP</h1>
        <p>Aplikacja wspiera proces oceny możliwości migracji ze źródłowego do docelowego systemu ERP poprzez porównanie procesów biznesowych źródłowej i docelowej jednostki organizacyjnej. Wspólnie z ekspertami obu systemów identyfikuje różnice procesowe, ryzyka, wymagane dostosowania oraz potencjalne korzyści biznesowe wynikające z wdrożenia wspólnego rozwiązania.</p></div>
      <div class="mig" role="img" aria-label="Źródłowa jednostka organizacyjna: AS-IS – źródłowy system ERP. Docelowa jednostka organizacyjna: model referencyjny – docelowy system ERP.">
        <div class="node s"><span class="tile">${pic('buildings')}</span><small>Źródłowa jednostka organizacyjna</small><b>AS-IS – źródłowy system&nbsp;ERP</b><span>Aktualne procesy biznesowe, wymagania i praktyki operacyjne.</span></div>
        <div class="arr"><i>${ic('right')}</i></div>
        <div class="node t"><span class="tile">${pic('seal-check')}</span><small>Docelowa jednostka organizacyjna</small><b>Model referencyjny – docelowy system&nbsp;ERP</b><span>Obowiązująca konfiguracja systemu, procesy i standardy operacyjne docelowej jednostki organizacyjnej.</span></div>
      </div>
    </div>
    <details class="st-met" data-act="pmore" data-p="met"${V.open['pm-met'] ? ' open' : ''}><summary><h2>Metodyka oceny dopasowania procesów</h2><span class="tgl" aria-hidden="true"><span class="c">Rozwiń</span><span class="o">Zwiń</span>${ic('down')}</span></summary>
      <div class="st-metb"><div class="mtext"><p>Punktem odniesienia dla oceny jest standard procesowy i konfiguracja docelowego systemu ERP funkcjonujące w docelowej jednostce organizacyjnej. Analiza polega na porównaniu rzeczywistych procesów i sposobu pracy źródłowej jednostki organizacyjnej w źródłowym systemie ERP (stan obecny – AS-IS) z rozwiązaniami stosowanymi w docelowej jednostce organizacyjnej (model referencyjny – TO-BE).</p>
        <p>Każde wymaganie biznesowe źródłowej jednostki organizacyjnej podlega indywidualnej ocenie według następującej skali:</p></div>
      <h3>Kategorie oceny dopasowania</h3><ul class="cats">${cats}</ul></div></details>
    <div class="st-flow"><h2>Przebieg analizy</h2><ol class="flow">${flow}</ol></div>
  </div>
  <div class="card"><div class="cardb st-sec"><h2>${all.length ? 'Wybierz analizę' : 'Rozpocznij pierwszą analizę'}</h2><p class="blk">Każda analiza dotyczy jednej jednostki organizacyjnej przenoszonej do docelowego systemu ERP. Zacznij od zakresu i zespołu, potem przejdź kolejne kroki analizy.</p>
    <div class="cogrid">${cards}${add}</div></div></div>
  ${overview}`;
}

/* ---------- krok 1: zakres i zespół ---------- */
function step1(m) {
  const c = m.co, id = ID.an(m.cid), e = ent(id) || {}, raw = f => e[f] != null ? sysRaw(coRaw(e[f])) : DEF[f];
  const coSec = `<section class="sec"><div class="sech"><h2>${pic('arrows-left-right')}Dane analizy</h2><div class="acts"><button type="button" class="lnk del" data-act="an-del">${ic('trash')} Usuń analizę</button></div></div>
    <div class="secb fgrid">
      ${fld(rq('Nazwa analizy'), inpF(id, 'n', c.n, {max: 90, req: 1}), 'wide')}
      ${fld(rq('Spółka przenoszona'), inpF(id, 'srcCo', raw('srcCo'), {max: 40, req: 1, ph: 'np. ' + DEF.srcCo}), 'cc')}
      ${fld(rq('System źródłowy'), inpF(id, 'srcSys', raw('srcSys'), {max: 60, req: 1, ph: 'np. Symfonia ERP'}), 'cc')}
      ${fld(rq('Spółka z systemem docelowym'), inpF(id, 'tgtCo', raw('tgtCo'), {max: 40, req: 1, ph: 'np. ' + DEF.tgtCo}), 'cp')}
      ${fld(rq('System docelowy'), inpF(id, 'tgtSys', raw('tgtSys'), {max: 60, req: 1, ph: 'np. Axapta (AX 2012)'}), 'cp')}
      ${fld(rq('Sponsor analizy'), inpF(id, 'sp', fval(c, 'sp'), {ph: 'Imię i nazwisko, np. dyrektor generalny ' + c.srcCo, req: 1}))}
      ${fld(rq('Lider analizy'), inpF(id, 'pl', fval(c, 'pl'), {ph: 'Imię i nazwisko', req: 1}))}
      ${fld('Data rozpoczęcia analizy', inpF(id, 'start', fval(c, 'start'), {type: 'date'}))}
      ${fld(rq('Cel i zakres analizy'), txtF(id, 'scope', fval(c, 'scope'), {req: 1, rows: 3, ph: 'np. ocena, czy przeniesienie ' + c.srcCo + ' z systemu ' + c.srcSys + ' do ' + c.tgtSys + ' jest wykonalne i uzasadnione'}), 'wide')}
    </div></section>`;
  const ppl = m.people.map(p => { const pi = ID.os(m.cid, p.k);
    return `<tr data-key="os-${esc(p.k)}" id="os-${esc(p.k)}"><td class="wide">${inpF(pi, 'n', fval(p, 'n'), {ph: 'Imię i nazwisko', label: 'Imię i nazwisko', req: 1, max: 80})}</td>
      <td>${selF(pi, 'co', p.co, D.coTypes.map(x => [x, x]), {empty: '– zespół –', label: 'Zespół', req: 1})}</td>
      <td>${selF(pi, 'role', p.role, D.roles.map(x => [x, x]), {empty: '– rola –', label: 'Rola', req: 1})}</td>
      <td class="ka">${p.ku ? kuSel(m, p) : ''}</td>
      <td class="act"><button type="button" class="btn icon sm ghost" data-act="os-del" data-o="${esc(p.k)}" aria-label="Usuń osobę ${esc(p.n)}" title="Usuń osobę">${ic('trash')}</button></td></tr>`; }).join('');
  const pplSec = `<section class="sec" id="team"><div class="sech"><h2>${pic('users-three')}Zespół i uczestnicy</h2><div class="acts"><span>${esc(plural(m.people.length, F_PER))}</span></div></div>
    <div class="secb"><p class="blk">Dodaj osoby, które biorą udział w analizie: liderów procesu obu spółek (${esc(c.srcCo)} i ${esc(c.tgtCo)}), osoby z FSSC i zespół prowadzący. Key userom przypisz obszary, za które odpowiadają. Narzędzie nie zbiera adresów e-mail.</p>
    ${m.people.length ? `<table class="ptab"><colgroup><col class="cn"><col class="cc"><col class="cr"><col><col class="cx"></colgroup><thead><tr><th>Imię i nazwisko<span class="rq">*</span></th><th>Zespół<span class="rq">*</span></th><th>Rola<span class="rq">*</span></th><th>Obszar<span class="rq">*</span> <small>(key user)</small></th><th></th></tr></thead><tbody>${ppl}</tbody></table>` : ''}
    <div style="margin-top:10px"><button type="button" class="btn dash" data-act="os-add">${ic('plus')}Dodaj osobę</button></div></div></section>`;
  const und = m.areas.filter(a => !a.on).length;
  const cards = m.areas.map(a => areaCard(m, a)).join('');
  const add = V.open['area-add'] ? `<div class="addbox" data-key="area-addbox"><div class="row">${fld('Nazwa obszaru', `<input class="inp" id="na-n" maxlength="80" placeholder="np. Serwis urządzeń u klientów" autocomplete="off">`)}${fld('Krótki opis <small>(opcjonalnie)</small>', `<input class="inp" id="na-d" maxlength="200" placeholder="Jakie procesy obejmuje" autocomplete="off">`)}<button type="button" class="btn pri" data-act="area-add">${ic('plus')}Dodaj obszar</button><button type="button" class="btn ghost" data-act="area-addtog">Anuluj</button></div></div>`
    : `<div data-key="area-addbtn"><button type="button" class="btn dash" data-act="area-addtog">${ic('plus')}Dodaj obszar specyficzny dla ${esc(c.srcCo)}</button></div>`;
  return coSec + pplSec + `<section class="sec"><div class="sech"><h2>${pic('squares-four')}Obszary analizy</h2><div class="acts"><span>w zakresie: ${m.inArea.length} · kolejny etap: ${m.later.length} · bez decyzji: ${und}</span>
      ${und ? `<button type="button" class="btn sm" data-act="area-rest">Pozostałe – kolejny etap (${und})</button>` : ''}</div></div>
    <div class="secb"><p class="blk">Wskaż obszary analizowane teraz, obszary na kolejny etap i obszary poza zakresem. Dla każdego obszaru w zakresie wybierz lidera procesu ${esc(c.srcCo)}, lidera procesu ${esc(c.tgtCo)} i uczestników. Agendę i pytania obszaru zapiszesz jako PDF i wyślesz uczestnikom w załączniku e-maila.</p>
    ${m.people.length ? '' : `<div class="note warn">${ic('warn')}<p>Najpierw dodaj osoby w sekcji „Zespół i uczestnicy” – liderów procesu i uczestników obszarów wybierasz z tej listy.</p></div>`}
    <div class="agrid">${cards}</div><div style="margin-top:12px">${add}</div></div></section>`;
}
/* obszar key usera: lista rozwijana obszarów z wyborem wielokrotnym, w tym samym wierszu co pozostałe pola osoby */
function kuSel(m, p) {
  const pi = ID.os(m.cid, p.k), bad = MISS.has(pi + '#ka'), names = p.kas.map(a => a.n).join(', ');
  const items = m.areas.map(a => `<label data-key="ma-${esc(a.k)}"><input type="checkbox" data-act="ms-tog" data-o="${esc(p.k)}" data-a="${esc(a.k)}"${p.kas.includes(a) ? ' checked' : ''}><span>${esc(a.n)}</span></label>`).join('');
  const sum = names ? `<span class="val">${esc(names)}</span>${p.kas.length > 1 ? `<span class="cnt">${p.kas.length}</span>` : ''}` : '<span class="ph">Wybierz obszar</span>';
  return `<details class="msel" data-act="ms" data-o="${esc(p.k)}"${V.ms === p.k ? ' open' : ''}><summary class="inp"${bad ? ' aria-invalid="true"' : ''} aria-label="Obszar – ${esc(p.n || 'bez nazwy')}"${names ? ` title="${esc(names)}"` : ''}>${sum}</summary><div class="mlist">${items}</div></details>`;
}
function areaCard(m, a) {
  const id = ID.ar(m.cid, a.k), c = m.co, n = m.procs.filter(p => p.a === a.k).length, st = a.in ? 'in' : a.later ? 'later' : a.on === 'N' ? 'out' : 'und';
  const seg = segB('area-on', a.on || '', [['Y', 'W zakresie', 'y'], ['L', 'Kolejny etap', 'l'], ['N', 'Poza zakresem', 'n']], `data-a="${esc(a.k)}"`, 'sm');
  const head = a.std ? `<b>${esc(a.n)}</b>` : `<input class="inp" data-act="f" data-id="${esc(id)}" data-f="n" value="${esc(a.n)}" aria-label="Nazwa obszaru" maxlength="80" style="max-width:240px;height:32px">`;
  let body = '';
  if (a.in) {
    const opts = m.people.map(p => [p.k, (p.n || 'bez nazwy') + (p.co ? ' · ' + p.co : '') + (p.role ? ' · ' + p.role : '')]);
    const kuA = new Set(a.kus.map(p => p.k));
    const chips = m.people.map(p => `<button type="button" class="chipbtn" data-act="us-tog" data-a="${esc(a.k)}" data-o="${esc(p.k)}" aria-pressed="${a.us.includes(p.k)}">${esc(p.n || 'bez nazwy')} <small>${esc([p.co, kuA.has(p.k) ? 'key user' : ''].filter(Boolean).join(' · '))}</small></button>`).join('');
    body = `<div class="af">
      ${fld(rq('Lider procesu ' + esc(c.srcCo) + ' – ' + esc(c.srcSys)), selF(id, 'xcc', a.ecc ? a.xcc : '', opts, {empty: m.people.length ? '– wybierz osobę –' : '– najpierw dodaj osoby –', req: 1, label: 'Lider procesu ' + c.srcCo}), 'cc')}
      ${fld(rq('Lider procesu ' + esc(c.tgtCo) + ' – ' + esc(c.tgtSys)), selF(id, 'xcp', a.ecp ? a.xcp : '', opts, {empty: m.people.length ? '– wybierz osobę –' : '– najpierw dodaj osoby –', req: 1, label: 'Lider procesu ' + c.tgtCo}), 'cp')}</div>
      <div class="parts"><div class="ph2"><span>Uczestnicy${a.us.length ? ` <small>(${a.us.length})</small>` : ''}</span><a class="btn sm" href="${hrefDoc(m.cid, a.k)}" title="Dokument do wysłania uczestnikom w załączniku e-maila">${ic('doc')}Agenda i pytania</a></div>
        ${m.people.length ? `<div class="pchips" role="group" aria-label="Uczestnicy – ${esc(a.n)}">${chips}</div>` : ''}</div>`;
  }
  const meta = `<div class="meta">${a.in ? `<span>${n ? esc(plural(n, F_PROC)) + ' do potwierdzenia w kroku 2' : 'Procesy dodasz w kroku 2'}</span>` : `<span>${esc(a.d || '')}</span>`}${a.sg ? `<span class="tag ok">${ic('check')}wyniki potwierdzone</span>` : ''}${a.std ? '' : `<button type="button" class="lnk del" data-act="area-del" data-a="${esc(a.k)}">${ic('trash')} Usuń</button>`}</div>`;
  return `<div class="acard ${st}${st === 'und' && MISS.has('und') ? ' bad' : ''}" data-key="ac-${esc(a.k)}" id="area-${esc(a.k)}"><div class="ah">${tile(a)}${head}${seg}</div>${a.in && a.d ? `<div class="ad">${esc(a.d)}</div>` : ''}${body}${meta}</div>`;
}

/* ---------- krok 2: procesy AS-IS ---------- */
function step2(m) {
  const s = slice(m, V.aid); if (!s.areas.length) return noAreas();
  const c = m.co, names = m.people.map(p => p.n);
  const lists = dl('dl-ppl', names) + dl('dl-tcc', D.toolsCC) + dl('dl-tcp', D.toolsCP) + dl('dl-vol', ['około 100 dokumentów miesięcznie', 'około 500 dokumentów miesięcznie', 'około 1 000 dokumentów miesięcznie']);
  const secs = s.areas.map(a => {
    const pr = m.procs.filter(p => p.a === a.k), und = pr.filter(p => p.on !== 'Y' && p.on !== 'N').length, yes = pr.filter(p => p.on === 'Y').length;
    const add = V.open['np-' + a.k] ? `<div class="prow" data-key="np-${esc(a.k)}"><div class="addbox" style="grid-column:1/-1"><div class="row">${fld('Nazwa procesu', `<input class="inp" id="np-n-${esc(a.k)}" maxlength="160" placeholder="Proces specyficzny dla ${esc(c.srcCo)}" autocomplete="off">`)}${fld('Opis <small>(opcjonalnie)</small>', `<input class="inp" id="np-d-${esc(a.k)}" maxlength="500" placeholder="Co obejmuje" autocomplete="off">`)}<button type="button" class="btn pri" data-act="proc-add" data-a="${esc(a.k)}">${ic('plus')}Dodaj</button><button type="button" class="btn ghost" data-act="np-tog" data-a="${esc(a.k)}">Anuluj</button></div></div></div>`
      : `<div class="prow" data-key="npb-${esc(a.k)}"><div><button type="button" class="btn sm dash" data-act="np-tog" data-a="${esc(a.k)}">${ic('plus')}Dodaj proces specyficzny dla ${esc(c.srcCo)}</button></div></div>`;
    return `<section class="sec" data-key="s2-${esc(a.k)}"><div class="sech"><h2>${tile(a, 's')}${esc(a.n)}<span class="who">${esc([a.ecc ? a.ecc.n : '', a.ecp ? a.ecp.n : ''].filter(Boolean).join(' · ') || 'brak liderów procesu')}</span></h2><div class="acts"><span>dotyczy: ${yes} · bez decyzji: ${und}</span>${und ? `<button type="button" class="btn sm" data-act="proc-all" data-a="${esc(a.k)}">Pozostałe dotyczą (${und})</button>` : ''}</div></div>
      ${pr.map(p => procRow(m, p)).join('')}${add}</section>`;
  }).join('');
  return lists + `<div class="note">${ic('info')}<p>Katalog procesów jest punktem wyjścia. Zaznacz procesy realizowane w ${esc(c.srcCo)}, dodaj procesy specyficzne i dla każdego wskaż właściciela, narzędzia i skalę. Krótki opis praktyki obu spółek ułatwi ocenę dopasowania, a ocena „wspólny standard / specyfika ${esc(c.srcCo)}” pokaże, gdzie procesy można ujednolicić.</p></div>` + secs;
}
function procRow(m, p) {
  const id = ID.pr(m.cid, p.k), c = m.co, on = p.on || '', ed = V.open['ed-' + p.k];
  const seg = segB('proc-on', on, [['Y', 'Dotyczy', 'y'], ['N', 'Nie dotyczy', 'n']], `data-p="${esc(p.k)}"`, 'sm');
  const hasTxt = !!(norm(p.dcc) || norm(p.dcp) || norm(p.pain) || norm(p.nt));
  const f = on === 'Y' ? `<div class="pf2">
      ${fld(rq('Właściciel procesu w ' + esc(c.srcCo)), inpF(id, 'occ', fval(p, 'occ'), {ph: p.o ? 'np. ' + p.o : 'Imię i nazwisko', label: 'Właściciel procesu w ' + c.srcCo + ' – ' + p.n, req: 1, list: 'dl-ppl'}), 'cc')}
      ${fld('Właściciel procesu w ' + esc(c.tgtCo), inpF(id, 'ocp', fval(p, 'ocp'), {ph: 'Imię i nazwisko', label: 'Właściciel procesu w ' + c.tgtCo + ' – ' + p.n, list: 'dl-ppl'}), 'cp')}
      ${fld('Wolumen w ' + esc(c.srcCo), inpF(id, 'vol', fval(p, 'vol'), {ph: 'np. 800 faktur miesięcznie', label: 'Wolumen – ' + p.n, list: 'dl-vol', max: 120}))}
      ${fld('Częstotliwość', selF(id, 'fq', fval(p, 'fq'), D.freq.map(x => [x, x]), {empty: '–', label: 'Częstotliwość – ' + p.n}))}
      ${fld('Narzędzia w ' + esc(c.srcCo), tagsHtml({act: 'tag-tcc', attrs: `data-p="${esc(p.k)}"`, items: arr(p.tcc).map(t => ({t})), ph: 'np. ' + D.toolsCC[0] + ', Enter dodaje', label: 'Narzędzia w ' + c.srcCo + ' – ' + p.n, list: 'dl-tcc'}), 'w2 cc')}
      ${fld('Narzędzia w ' + esc(c.tgtCo), tagsHtml({act: 'tag-tcp', attrs: `data-p="${esc(p.k)}"`, items: arr(p.tcp).map(t => ({t})), ph: 'np. ' + D.toolsCP[0] + ', Enter dodaje', label: 'Narzędzia w ' + c.tgtCo + ' – ' + p.n, list: 'dl-tcp'}), 'w2 cp')}
      <div class="w4 hmseg"><span class="fld"><span>Czy ${esc(c.srcCo)} może pracować według standardu ${esc(c.tgtCo)}?</span></span>${segB('harm', fval(p, 'hm'), HARM.map(h => [h.k, h.n, h.k === 'Y' ? 'y' : h.k === 'N' ? 'e' : 'q']), `data-p="${esc(p.k)}"`, 'sm')}
        ${p.hm === 'N' || p.hm === 'P' ? `<span style="flex:1;min-width:240px">${inpF(id, 'hmj', fval(p, 'hmj'), {ph: 'Uzasadnienie specyfiki ' + c.srcCo + ' (np. produkcja, obsługa klienta)', label: 'Uzasadnienie specyfiki – ' + p.n, max: 400})}</span>` : ''}</div>
      <details class="more" data-act="pmore" data-p="${esc(p.k)}"${V.open['pm-' + p.k] || hasTxt ? ' open' : ''}><summary>Opis AS-IS, problemy i uwagi${hasTxt ? '' : ' <span class="faint" style="font-weight:400">(opcjonalnie)</span>'}</summary><div class="in">
        ${fld('Jak proces działa w ' + esc(c.srcCo) + ' (' + esc(c.srcSys) + ')', txtF(id, 'dcc', fval(p, 'dcc'), {rows: 3, ph: 'Kroki, dokumenty, role, obejścia w Excelu'}), 'cc')}
        ${fld('Jak proces działa w ' + esc(c.tgtCo) + ' (' + esc(c.tgtSys) + ')', txtF(id, 'dcp', fval(p, 'dcp'), {rows: 3, ph: 'Szablon AX 2012: konfiguracja, kroki, raporty'}), 'cp')}
        ${fld('Problemy i oczekiwania ' + esc(c.srcCo), txtF(id, 'pain', fval(p, 'pain'), {rows: 2, ph: 'Co dziś nie działa, czego oczekuje biznes'}))}
        ${fld('Uwagi', txtF(id, 'nt', fval(p, 'nt'), {rows: 2}))}</div></details></div>` : '';
  const edit = !p.cat && ed ? `<div class="edit">${fld('Nazwa procesu', inpF(id, 'n', p.n, {max: 160}))}${fld('Opis', txtF(id, 'd', fval(p, 'd'), {rows: 2}))}</div>` : '';
  const tools = !p.cat ? `<span class="tools2"><button type="button" class="lnk mut" data-act="proc-edit" data-p="${esc(p.k)}">${ic('edit')} ${ed ? 'Gotowe' : 'Edytuj'}</button><button type="button" class="lnk del" data-act="proc-del" data-p="${esc(p.k)}">${ic('trash')} Usuń</button></span>` : '';
  const qn = p.cat ? p.q.length : (m.procs.find(x => x.k === p.k) || {reqs: []}).reqs.length;
  return `<div class="prow${on === 'N' ? ' off' : on === 'Y' ? ' k-y' : ''}${!on && MISS.has('und') ? ' bad' : ''}" data-key="pr-${esc(p.k)}" id="proc-${esc(p.k)}">
    <div><div class="pn"><span class="qcode">${esc(p.cd)}</span>${esc(p.n)}${!p.cat ? ' <span class="custq">specyficzny dla ' + esc(c.srcCo) + '</span>' : ''}${tools}</div>${p.d ? `<div class="pd">${esc(p.d)}</div>` : ''}${on === 'Y' ? `<div class="pd">${esc(plural(qn, F_Q))} do oceny</div>` : ''}</div>
    <div>${seg}</div>${edit}${f}</div>`;
}

/* ---------- krok 3: ocena fit-gap ---------- */
function step3(m) {
  const s = slice(m, V.aid); if (!s.areas.length) return noAreas();
  if (!V.aid) return step3overview(m, s);
  const a = s.areas[0], act = s.act;
  if (!act.length) return `<div class="empty"><b>W obszarze „${esc(a.n)}” nie ma procesów oznaczonych „Dotyczy”</b>Ocenę prowadzimy dla procesów potwierdzonych w kroku 2.<br><a class="btn pri" href="${href(2, a.k)}">Przejdź do kroku 2</a></div>`;
  const c = cnt(s.reqs), done = s.reqs.filter(r => r.st).length;
  const tools = `<div class="ivtools noprint">${segB('mode', V.focus ? 'f' : 'l', [['l', ic('list') + 'Lista pytań'], ['f', ic('focus') + 'Tryb skupienia']], '', 'sm')}
    <span class="prog">${fbarHtml(c, true)}<span>${done}/${s.reqs.length}</span></span><span class="grow"></span>
    <a class="btn sm" href="${hrefDoc(m.cid, a.k)}">${ic('doc')}Agenda i pytania</a>${V.focus ? '' : `<button type="button" class="btn sm" data-act="jump-first">${ic('play')}Pierwsze bez oceny</button>`}</div>`;
  const lists = dl('dl-ppl', m.people.map(p => p.n));
  if (V.focus) return lists + tools + focusView(m, s);
  return lists + tools + `<div class="note">${ic('info')}<p>Dla każdego pytania zapisz, jak to robi ${esc(m.co.srcCo)} w ${esc(m.co.srcSys)} i jak ${esc(m.co.tgtCo)} w ${esc(m.co.tgtSys)}, a potem oceń dopasowanie. Przy ocenie „Częściowe” lub „Luka” wskaż sposób zamknięcia i priorytet. Lider procesu widzi wyróżnioną kolumnę swojej jednostki organizacyjnej.</p></div>` + act.map(p => procBlock(m, p)).join('');
}
function step3overview(m, s) {
  const tot = cnt(s.reqs), done = s.reqs.filter(r => r.done).length;
  const cards = s.areas.map(a => { const rs = s.reqs.filter(r => r.a === a.k), c = cnt(rs), fi = fitIndex(rs), dn = rs.filter(r => r.done).length, any = rs.filter(r => r.st).length;
    return `<a class="ovcard" href="${href(3, a.k)}" data-key="ov-${esc(a.k)}"><div class="h">${tile(a)}<b>${esc(a.n)}</b></div>${fbarHtml(c, true)}
      <div class="kv"><span><b>${dn}/${rs.length}</b>ocenione</span><span><b>${c.P + c.G}</b>luki</span><span><b>${c.O}</b>do wyjaśnienia</span><span><b>${fi != null ? fpct(fi) : '–'}</b>dopasowanie</span></div>
      <div class="ft"><span>${esc([a.ecc ? a.ecc.n : '', a.ecp ? a.ecp.n : ''].filter(Boolean).join(' · ') || 'brak liderów procesu')}</span><span class="lnk">${any ? (any === rs.length ? 'Przejrzyj' : 'Kontynuuj ocenę') : 'Rozpocznij ocenę'}</span></div></a>`; }).join('');
  return `<div class="note">${ic('info')}<p>Ocenę prowadzimy osobno dla każdego obszaru. Wybierz obszar – zobaczysz jego procesy i pytania. Ocena ostateczna: ${done} z ${esc(plural(s.reqs.length, F_REQ))}${tot.O ? `, do wyjaśnienia: ${tot.O}` : ''}.</p></div>
    <div style="margin:0 0 14px">${fbarHtml(tot, true)}<div style="margin-top:8px">${fleg()}</div></div><div class="ovgrid">${cards}</div>`;
}
function procBlock(m, p) {
  const c = p.c, co = m.co, open = V.open['qa-' + p.k];
  const asis = norm(p.dcc) || norm(p.dcp) ? `<div class="asis">${norm(p.dcc) ? `<p><span class="src">${esc(co.srcCo)}</span>${esc(trunc(p.dcc, 260))}</p>` : '<p></p>'}${norm(p.dcp) ? `<p><span class="tgt">${esc(co.tgtCo)}</span>${esc(trunc(p.dcp, 260))}</p>` : ''}</div>` : '';
  const add = open ? `<div class="qadd" data-key="qa-${esc(p.k)}"><div class="row">${fld('Nowe wymaganie lub pytanie specyficzne dla ' + esc(co.srcCo), `<input class="inp" id="qa-t-${esc(p.k)}" maxlength="400" placeholder="np. Czy faktury dla jednej budowy można łączyć w fakturę zbiorczą?" autocomplete="off">`)}<button type="button" class="btn pri" data-act="q-add" data-p="${esc(p.k)}">${ic('plus')}Dodaj</button><button type="button" class="btn ghost" data-act="qa-tog" data-p="${esc(p.k)}">Anuluj</button></div></div>`
    : `<div class="qadd" data-key="qab-${esc(p.k)}"><button type="button" class="btn sm dash" data-act="qa-tog" data-p="${esc(p.k)}">${ic('plus')}Dodaj wymaganie specyficzne dla ${esc(co.srcCo)}</button></div>`;
  return `<section class="pblk" data-key="pb-${esc(p.k)}" id="pb-${esc(p.k)}"><div class="ph"><div><h2><span class="qcode">${esc(p.cd)}</span>${esc(p.n)}</h2><div class="pm">${esc(co.srcCo)}: ${esc(norm(p.occ) || '–')} · ${esc(co.tgtCo)}: ${esc(norm(p.ocp) || '–')}${p.vol ? ' · ' + esc(p.vol) : ''}${HARMBY[p.hm] ? ' · ' + esc(HARMBY[p.hm].s) : ''}</div></div>
    <div class="pr">${fbarHtml(c)}<span>${c.t - c.U}/${c.t}</span></div>${asis}</div>
    ${p.reqs.map(r => qCard(m, r)).join('')}${add}</section>`;
}
const MINE = '<span class="mineb">Twoja kolumna</span>';
function qCols(m, r, rows) {
  const ri = ID.rq(m.cid, r.k), co = m.co, side = mySide(co), need = r.gap && MISS.has(ri + '#cc');
  return `<div class="qcols"><label class="qcol cc"><span><span class="src">${esc(co.srcCo)} · ${esc(co.srcSys)}</span>${r.gap ? '<span class="rq" aria-hidden="true">*</span>' : ''}${side === 'cc' ? MINE : ''}</span>${txtF(ri, 'cc', fval(r, 'cc'), {rows, ph: 'Jak to robi ' + co.srcCo + ' dziś?', label: co.srcCo + ' – ' + r.code, req: r.gap, bad: need})}</label>
    <label class="qcol cp"><span><span class="tgt">${esc(co.tgtCo)} · ${esc(co.tgtSys)}</span>${side === 'cp' ? MINE : ''}</span>${txtF(ri, 'cp', fval(r, 'cp'), {rows, ph: 'Jak to robi ' + co.tgtCo + ' w AX 2012?', label: co.tgtCo + ' – ' + r.code})}</label></div>`;
}
function qRes(m, r) {
  if (!r.gap) return '';
  const ri = ID.rq(m.cid, r.k), badR = MISS.has('res-' + r.k), badP = MISS.has('pri-' + r.k);
  const chips = RES.map(x => `<button type="button" class="chipbtn ${x.k}" data-act="q-res" data-q="${esc(r.k)}" data-v="${x.k}" aria-pressed="${r.res === x.k}" title="${esc(x.d)}">${esc(x.n)}</button>`).join('');
  return `<div class="qres"><div class="r1"><div><span class="lb">${rq('Sposób zamknięcia luki')}</span><div class="chips${badR ? ' bad' : ''}" role="group" aria-label="Sposób zamknięcia luki">${chips}</div></div>
    <div><span class="lb">${rq('Priorytet')}</span>${segB('q-pri', PRIBY[r.pri] ? r.pri : '', PRI.map(x => [x.k, x.n, x.k, x.d]), `data-q="${esc(r.k)}"`, 'sm pri' + (badP ? ' bad' : ''))}</div></div>
    ${fld('Opis luki i proponowane rozwiązanie' + (r.st === 'G' ? ' <small>(wymagane w kroku 4)</small>' : ''), txtF(ri, 'ds', fval(r, 'ds'), {rows: 2, ph: 'Czego brakuje w szablonie ' + m.co.tgtCo + ' i jak to rozwiązać'}))}</div>`;
}
function qCard(m, r) {
  const ri = ID.rq(m.cid, r.k), e = ent(ri), bad = !r.st && MISS.has('st-' + r.k);
  const hint = r.h ? `<div class="qhint">${ic('bulb')}<span>${esc(r.h)}</span></div>` : '';
  const tools = !r.cat ? `<button type="button" class="lnk del" data-act="q-del" data-q="${esc(r.k)}">${ic('trash')} Usuń wymaganie</button>` : '';
  return `<div class="qc k-${r.st || 'U'}${bad ? ' bad' : ''}" id="q-${esc(r.k)}" data-key="q-${esc(r.k)}">
    <div class="qh"><div><div class="qt"><span class="qcode">${esc(r.code)}</span>${esc(r.t)} ${regTag(r)}${!r.cat ? ' <span class="custq">specyficzne</span>' : ''}</div>${hint}</div>
      ${segB('q-st', r.st, FIT.map(f => [f.k, esc(f.n), f.k, f.l + ' – ' + f.d]), `data-q="${esc(r.k)}"`, 'st sm' + (bad ? ' bad' : ''))}</div>
    ${qCols(m, r, 2)}${qRes(m, r)}
    ${(e && e.ts) || tools ? `<div class="qmeta">${lastBy(e)}${tools}</div>` : ''}</div>`;
}
/* tryb skupienia: jedno pytanie na ekranie, nawigacja klawiaturą */
function focusList(s) { return s.act.reduce((x, p) => x.concat(p.reqs), []); }
function focusView(m, s) {
  const list = focusList(s); if (!list.length) return '<div class="empty"><b>Brak pytań w procesach tego obszaru</b>Dodaj wymagania specyficzne w trybie listy.</div>';
  let i = list.findIndex(r => r.k === V.fq); if (i < 0) { i = list.findIndex(r => !r.st); if (i < 0) i = 0; V.fq = list[i].k; }
  const r = list[i], p = r.proc, co = m.co, ri = ID.rq(m.cid, r.k), e = ent(ri);
  let prev = null; const dots = list.map(x => { const sep = prev && prev !== x.proc ? '<span class="sep"></span>' : ''; prev = x.proc;
    return sep + `<button type="button" class="${x.st || ''}" data-act="fq-go" data-q="${esc(x.k)}" data-tip="${esc(x.code + ' · ' + fitName(x.st))}" data-tip2="${esc(trunc(x.t, 120))}" aria-label="${esc(x.code + ': ' + fitName(x.st))}"${x.k === r.k ? ' aria-current="true"' : ''}></button>`; }).join('');
  const big = FIT.map((f, j) => `<button type="button" class="${f.k}" data-act="q-st" data-q="${esc(r.k)}" data-v="${f.k}" aria-pressed="${r.st === f.k}" title="${esc(f.l + ' – ' + f.d)}"><b>${esc(f.n)}<span class="kb">${j + 1}</span></b><small>${esc(trunc(f.d, 70))}</small></button>`).join('');
  return `<div class="qdots" role="group" aria-label="Pytania w obszarze">${dots}</div>
    <div class="focus" id="q-${esc(r.k)}" data-key="fq-${esc(r.k)}"><div class="fh"><span class="where">${tile(p.area, 's')}<b>${esc(p.area.n)}</b>${ic('right')}<span class="qcode">${esc(p.cd)}</span><b>${esc(p.n)}</b></span><span class="cnt">${i + 1} / ${list.length}</span></div>
      <div class="fb"><div><div class="fq"><span class="qcode">${esc(r.code)}</span>${esc(r.t)} ${regTag(r)}</div>${r.h ? `<div class="qhint" style="margin-top:6px">${ic('bulb')}<span>${esc(r.h)}</span></div>` : ''}</div>
        ${qCols(m, r, 4)}<div class="stbig" role="group" aria-label="Ocena dopasowania">${big}</div>${qRes(m, r)}${e && e.ts ? `<div class="qmeta">${lastBy(e)}</div>` : ''}</div>
      <div class="ff"><button type="button" class="btn" data-act="fq-prev"${i === 0 ? ' disabled' : ''}>${ic('left')}Poprzednie</button><button type="button" class="btn pri" data-act="fq-next"${i === list.length - 1 ? ' disabled' : ''}>Następne${ic('right')}</button>
        <button type="button" class="btn ghost" data-act="jump-first">${ic('play')}Pierwsze bez oceny</button><span class="grow"></span>
        <span class="keys"><span><span class="kbd">1</span>–<span class="kbd">5</span> ocena</span><span><span class="kbd">←</span> <span class="kbd">→</span> pytania</span><span><span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> dalej z pola tekstowego</span></span></div></div>`;
}

/* ---------- krok 4: luki i zmiany procesowe ---------- */
function step4(m) {
  const s = slice(m, V.aid); if (!s.areas.length) return noAreas();
  const v = verdict(m, V.aid), co = m.co, gaps = s.gaps, chg = gaps.filter(r => r.res === 'proc');
  const kpi = (lb, val, sub, cls) => `<div class="stat${cls ? ' ' + cls : ''}"><span class="lb">${esc(lb)}</span><b>${esc(val)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const sum = `<div class="gsum">${kpi('Luki i dopasowania częściowe', String(gaps.length), gaps.filter(r => r.wd).length ? 'w tym wycofane: ' + gaps.filter(r => r.wd).length : '')}${kpi('Luki krytyczne', String(v.crit.length), 'Must + rozwój, integracja lub obejście', v.crit.length ? 'crit' : '')}
    ${kpi('Zmiany procesowe w ' + co.srcCo, String(chg.length), v.chgHi.length ? 'wysoka skala: ' + v.chgHi.length : '', v.chgHi.length ? 'warn' : '')}${kpi('Szacowana pracochłonność', fnum(v.md) + ' md', v.noEff ? 'bez oszacowania: ' + v.noEff : 'osobodni', '')}</div>`;
  const tabs = `<div class="tabs noprint">${segB('r4', V.r4, [['gap', 'Rejestr luk (' + gaps.length + ')'], ['chg', 'Zmiany procesowe w ' + esc(co.srcCo) + ' (' + chg.length + ')']])}</div>`;
  if (!gaps.length) return sum + `<div class="empty"><b>Brak luk w ocenionych wymaganiach</b>Luki powstają z ocen „Częściowe” i „Luka” w kroku 3.${s.reqs.some(r => !r.st) ? `<br><a class="btn" href="${href(3, V.aid)}">Wróć do oceny</a>` : ''}</div>`;
  return sum + tabs + (V.r4 === 'chg' ? chgView(m, s, chg) : gapView(m, s, gaps));
}
function gapView(m, s, gaps) {
  const F = V.f4, chip = (k, v, l) => `<button type="button" class="chipbtn" data-act="flt" data-k="${k}" data-v="${esc(v)}" aria-pressed="${k === 'crit' ? !!F.crit : F[k] === v}">${l}</button>`;
  const flt = `<div class="fltr noprint"><span>Filtr:</span>${chip('crit', '1', ic('warn') + 'Tylko krytyczne')}${PRI.map(p => chip('pri', p.k, esc(p.n))).join('')}<span style="width:8px"></span>${RES.map(r => chip('res', r.k, esc(r.n))).join('')}</div>`;
  const show = gaps.filter(r => (!F.crit || r.crit) && (!F.pri || r.pri0 === F.pri) && (!F.res || r.res === F.res));
  const secs = s.areas.map(a => { const list = show.filter(r => r.a === a.k); if (!list.length) return '';
    return `<section class="sec" data-key="g4-${esc(a.k)}"><div class="sech"><h2>${tile(a, 's')}${esc(a.n)}</h2><div class="acts"><span>${esc(plural(list.length, F_GAP))} · ${fnum(list.reduce((x, r) => x + r.md, 0))} md</span></div></div>${list.map(r => gapRow(m, r)).join('')}</section>`; }).join('');
  return flt + (secs || '<div class="empty"><b>Żadna luka nie spełnia filtra</b></div>');
}
function gapRow(m, r) {
  const ri = ID.rq(m.cid, r.k), co = m.co, bad = MISS.has('eff-' + r.k) || MISS.has(ri + '#ds');
  return `<div class="grow2${r.crit ? ' crit' : ''}${r.wd ? ' off' : ''}" id="g-${esc(r.k)}" data-key="g-${esc(r.k)}">
    <div class="gh"><div class="gt"><span class="qcode">${esc(r.code)}</span>${esc(r.t)}<small>${esc(r.proc.n)}</small></div><div class="chips">${fsTag(r.st)}${critTag(r)}${regTag(r)}${r.wd ? '<span class="tag">wycofane</span>' : ''}</div></div>
    <div class="gans"><p><span class="src">${esc(co.srcCo)}</span>${esc(trunc(r.cc, 280) || '–')}</p><p><span class="tgt">${esc(co.tgtCo)}</span>${esc(trunc(r.cp, 280) || '–')}</p></div>
    <div class="gf"><div><span class="lb">Sposób zamknięcia</span>${selF(ri, 'res', r.res || '', RES.map(x => [x.k, x.n]), {empty: '– wybierz –', label: 'Sposób zamknięcia – ' + r.code})}</div>
      <div><span class="lb">Priorytet</span>${segB('q-pri', PRIBY[r.pri] ? r.pri : '', PRI.map(x => [x.k, x.n, x.k, x.d]), `data-q="${esc(r.k)}"`, 'sm pri')}</div>
      <div><span class="lb">${rq('Pracochłonność')}</span>${segB('g-eff', r.eff || '', EFF.map(x => [x.k, x.n, '', x.d]), `data-q="${esc(r.k)}"`, 'sm' + (MISS.has('eff-' + r.k) ? ' bad' : ''))}</div>
      <div><span class="lb">Decyzja</span>${segB('g-dec', r.dec || 'P', DEC.map(x => [x.k, x.k === 'P' ? 'Do decyzji' : x.k === 'A' ? 'Rozwiązanie przyjęte' : 'Wymaganie wycofane', x.k === 'A' ? 'y' : x.k === 'R' ? 'n' : '']), `data-q="${esc(r.k)}"`, 'sm')}</div></div>
    <div class="gf2">${fld(r.st === 'G' ? rq('Opis rozwiązania') : 'Opis rozwiązania', txtF(ri, 'ds', fval(r, 'ds'), {rows: 2, req: r.st === 'G', ph: 'Jak zamkniemy lukę: konfiguracja, zmiana procesu, modyfikacja, raport…'}))}${fld('Odpowiedzialny', inpF(ri, 'ow', fval(r, 'ow'), {ph: 'Imię i nazwisko', list: 'dl-ppl'}))}</div></div>`;
}
function chgView(m, s, chg) {
  const co = m.co;
  if (!chg.length) return `<div class="empty"><b>Brak zmian procesowych w ${esc(co.srcCo)}</b>Zmiana procesowa powstaje, gdy lukę zamykamy sposobem „${esc(RESBY.proc.n)}”.</div>`;
  const secs = s.areas.map(a => { const list = chg.filter(r => r.a === a.k); if (!list.length) return '';
    return `<section class="sec" data-key="c4-${esc(a.k)}"><div class="sech"><h2>${tile(a, 's')}${esc(a.n)}</h2><div class="acts"><span>${esc(plural(list.length, F_CHG))}</span></div></div>${list.map(r => chgRow(m, r)).join('')}</section>`; }).join('');
  return `<div class="note">${ic('info')}<p>Zmiany, które ${esc(co.srcCo)} wprowadzi, przyjmując sposób pracy ${esc(co.tgtCo)} w ${esc(co.tgtSys)}. Opis zmiany, jej skala i grupy użytkowników to wejście do planu zarządzania zmianą i szkoleń.</p></div>` + secs;
}
function chgRow(m, r) {
  const ri = ID.rq(m.cid, r.k), co = m.co;
  return `<div class="grow2 chg${r.wd ? ' off' : ''}" id="g-${esc(r.k)}" data-key="c-${esc(r.k)}">
    <div class="gh"><div class="gt"><span class="qcode">${esc(r.code)}</span>${esc(r.t)}<small>${esc(r.proc.n)}</small></div><div class="chips">${fsTag(r.st)}${priTag(r.pri0)}${r.wd ? '<span class="tag">wycofane</span>' : ''}</div></div>
    <div class="gans"><p><span class="src">${esc(co.srcCo)} dziś</span>${esc(trunc(r.cc, 280) || '–')}</p><p><span class="tgt">${esc(co.tgtCo)} w AX 2012</span>${esc(trunc(r.cp, 280) || '–')}</p></div>
    <div class="cf">${fld(rq('Co zmienia się w ' + esc(co.srcCo)), txtF(ri, 'chg', fval(r, 'chg'), {rows: 2, req: 1, ph: 'Nowy sposób pracy, dokumenty, role i odpowiedzialności'}))}${fld('Kogo dotyczy', inpF(ri, 'who', fval(r, 'who'), {ph: 'np. FSSC – zobowiązania, zakupy ' + co.srcCo + ', magazyn', max: 200}))}</div>
    <div class="cf2"><div><span class="lb">${rq('Skala zmiany')}</span>${segB('g-imp', r.imp || '', IMP.map(x => [x.v, x.v + ' – ' + x.n, x.v === 3 ? 'e' : x.v === 2 ? 'q' : 'y', x.d]), `data-q="${esc(r.k)}"`, 'sm' + (MISS.has('imp-' + r.k) ? ' bad' : ''))}</div>
      ${fld('Etap', selF(ri, 'ph', fval(r, 'ph'), D.phase.map(x => [x, x]), {empty: '–'}))}
      <label class="chk"><input type="checkbox" data-act="f" data-id="${esc(ri)}" data-f="tr"${r.tr ? ' checked' : ''}><span>Wymaga szkolenia</span></label>
      ${r.eff ? `<span class="tag">pracochłonność ${esc(r.eff)}</span>` : `<span class="tag warn">bez pracochłonności – uzupełnij w rejestrze luk</span>`}</div></div>`;
}

/* ---------- krok 5: ryzyka ---------- */
function step5(m) {
  const s = slice(m, V.aid); if (!s.areas.length) return noAreas();
  const sug = suggestions(m, V.aid), shown = V.open.sugAll ? sug : sug.slice(0, 6);
  const sugBox = sug.length ? `<div class="sugg"><h3>${ic('bulb')}Podpowiedzi ryzyk (${sug.length})</h3><p class="s">Ryzyka typowe dla tej migracji, luki krytyczne i duże zmiany procesów. Dodaj ryzyko do rejestru albo pomiń podpowiedź.</p>
    ${shown.map(x => `<div class="sgrow" data-key="sg-${esc(x.key)}"><span class="t"><b>${esc(x.t)}</b><span>${esc(x.sub)}</span></span><button type="button" class="btn sm" data-act="sug-add" data-k="${esc(x.key)}">${ic('plus')}Dodaj</button><button type="button" class="btn sm ghost" data-act="sug-skip" data-k="${esc(x.key)}">Pomiń</button></div>`).join('')}
    ${sug.length > shown.length ? `<div class="more"><button type="button" class="lnk" data-act="tog" data-k="sugAll">Pokaż wszystkie (${sug.length})</button></div>` : ''}</div>` : `<div class="note ok">${ic('checkc')}<p>Brak nowych podpowiedzi – wszystkie zostały dodane do rejestru albo pominięte.</p></div>`;
  const groups = s.groups.map(g => riskGroup(m, s, g)).join('');
  return `<div class="rsk-top">${heatMap(s.risks)}<div>${sugBox}</div></div>` + groups;
}
function riskGroup(m, s, g) {
  const a = g === GLOBAL ? null : m.ABY[g], rs = s.risks.filter(r => r.a === g), rv = g === GLOBAL ? !!m.co.rvg : !!a.rv, bad = MISS.has('rv-' + g) && !rv && !rs.length;
  const t = a ? tile(a, 's') + esc(a.n) : pic('shield-warning') + 'Ryzyka całego przedsięwzięcia';
  return `<section class="sec" data-key="rg-${esc(g)}"><div class="sech"><h2>${t}</h2><div class="acts"><span>${esc(plural(rs.length, F_RISK))}</span></div></div>
    <div class="rkgrp"><div class="gh"><b>${a ? 'Ryzyka obszaru' : 'Platforma, harmonogram, koszty, organizacja'}</b><label class="rv${bad ? ' bad' : ''}"><input type="checkbox" data-act="rv" data-a="${esc(g)}"${rv ? ' checked' : ''}><span>Przegląd ryzyk zakończony</span></label></div>
      ${rs.map(r => riskRow(m, s, r)).join('')}
      <button type="button" class="btn sm dash" data-act="rk-add" data-a="${esc(g)}">${ic('plus')}Dodaj ryzyko</button></div></section>`;
}
function riskRow(m, s, r) {
  const ri = ID.rk(m.cid, r.k), lvl = r.score ? D.riskLv[r.lv].n : '';
  const prSeg = segB('rk-pr', String(r.pr || ''), [1, 2, 3, 4].map(v => [String(v), String(v), '', D.riskP[v - 1].n + ' – ' + D.riskP[v - 1].d]), `data-k="${esc(r.k)}"`, 'sm lv' + (MISS.has('rkpr-' + r.k) ? ' bad' : ''));
  const imSeg = segB('rk-im', String(r.im || ''), [1, 2, 3, 4].map(v => [String(v), String(v), 'v' + v, D.riskI[v - 1].n + ' – ' + D.riskI[v - 1].d]), `data-k="${esc(r.k)}"`, 'sm lv' + (MISS.has('rkim-' + r.k) ? ' bad' : ''));
  const gaps = (r.a === GLOBAL ? s.reqs : s.reqs.filter(x => x.a === r.a)).filter(x => x.gap);
  return `<div class="rk${r.score ? ' l' + (r.lv + 1) : ''}" id="risk-${esc(r.k)}" data-key="rk-${esc(r.k)}">
    <div class="r1">${fld(rq('Ryzyko'), inpF(ri, 't', fval(r, 't'), {ph: 'Krótka nazwa ryzyka', req: 1, max: 160}))}${fld(rq('Kategoria'), selF(ri, 'cat', fval(r, 'cat'), RCAT.map(x => [x.k, x.n]), {empty: '– kategoria –', req: 1}))}
      <div class="fld"><span>${rq('Prawdopodob.')}</span>${prSeg}</div><div class="fld"><span>${rq('Wpływ')}</span>${imSeg}</div><div class="fld"><span>Poziom</span><span class="score l${r.lv}">${r.score ? r.score + ' · ' + esc(lvl) : '–'}</span></div></div>
    <div class="r2">${fld('Opis i przyczyna', txtF(ri, 'ds', fval(r, 'ds'), {rows: 2}))}${fld('Powiązane wymaganie', selF(ri, 'q', r.req ? r.q : '', gaps.map(x => [x.k, x.code + ' · ' + trunc(x.t, 70)]), {empty: '– brak –'}))}</div>
    <div class="r3">${fld(rq('Właściciel'), inpF(ri, 'ow', fval(r, 'ow'), {ph: 'Imię i nazwisko', req: 1, list: 'dl-ppl'}))}${fld(String(r.tr || '0') === '1' ? 'Działanie <small>(akceptacja)</small>' : rq('Działanie ograniczające'), txtF(ri, 'ac', fval(r, 'ac'), {rows: 2, req: String(r.tr || '0') !== '1'}))}
      ${fld('Postępowanie', selF(ri, 'tr', String(r.tr || '0'), D.treat.map((x, i) => [String(i), x])))}${fld('Termin', inpF(ri, 'due', fval(r, 'due'), {type: 'date'}))}${fld('Status', selF(ri, 'st', r.st || 'O', Object.keys(RST).map(k => [k, RST[k]])))}</div>
    <div style="display:flex;justify-content:flex-end"><button type="button" class="lnk del" data-act="rk-del" data-k="${esc(r.k)}">${ic('trash')} Usuń ryzyko</button></div></div>`;
}

/* ---------- krok 6: wartość dodana ---------- */
function step6(m) {
  const co = m.co, id = ID.an(m.cid), bc = bcase(m), bs = benefitSum(m);
  const rows = m.bens.map(b => benRow(m, b)).join('');
  const add = V.open['bn-add'] ? `<div class="bnrow" data-key="bn-addbox"><div class="addbox" style="grid-column:1/-1"><div class="row">${fld('Korzyść', `<input class="inp" id="nb-n" maxlength="160" placeholder="np. Wspólne zakupy surowców ${esc(co.tgtCo)} i ${esc(co.srcCo)}" autocomplete="off">`)}<label class="fld" style="flex:0 0 220px"><span>Kategoria</span><select class="inp" id="nb-c">${BCAT.map(x => `<option value="${esc(x.k)}">${esc(x.n)}</option>`).join('')}</select></label><button type="button" class="btn pri" data-act="bn-add">${ic('plus')}Dodaj</button><button type="button" class="btn ghost" data-act="bn-addtog">Anuluj</button></div></div></div>`
    : `<div class="bnrow" data-key="bn-addbtn"><div><button type="button" class="btn sm dash" data-act="bn-addtog">${ic('plus')}Dodaj korzyść</button></div></div>`;
  const out = (l, v, sub, cls) => `<div class="bco${cls ? ' ' + cls : ''}"><span>${esc(l)}${sub ? `<small>${esc(sub)}</small>` : ''}</span><b>${v}</b></div>`;
  const bcSec = `<section class="sec"><div class="sech"><h2>${pic('calculator')}Szacunek nakładów i business case</h2><div class="acts"><span>szacunek orientacyjny – do weryfikacji z partnerem wdrożeniowym</span></div></div>
    <div class="secb bcase"><div class="in">
      ${fld('Stawka (zł za osobodzień)', inpF(id, 'rate', fval(co, 'rate'), {num: 1, ph: 'np. 1 400', max: 12}))}
      ${fld('Nakład bazowy wdrożenia (osobodni)', inpF(id, 'base', fval(co, 'base'), {num: 1, ph: 'np. 180', max: 8}))}
      ${fld('Inne koszty jednorazowe (zł)', inpF(id, 'oth', fval(co, 'oth'), {num: 1, ph: 'licencje AX 2012, infrastruktura, archiwum', max: 14}))}
      <p class="sm muted" style="grid-column:1/-1;margin:0">Nakład bazowy: utworzenie firmy ${esc(co.srcCo)} w AX 2012, migracja danych, testy, szkolenia, uruchomienie i wsparcie powdrożeniowe – bez luk z kroku 4.</p>
      ${fld('Roczny koszt ' + esc(co.srcSys) + ' (zł)', inpF(id, 'symf', fval(co, 'symf'), {num: 1, ph: 'licencje, utrzymanie, wsparcie', max: 14}))}
      ${fld('Roczny koszt AX 2012 dla ' + esc(co.srcCo) + ' (zł)', inpF(id, 'axc', fval(co, 'axc'), {num: 1, ph: 'licencje i utrzymanie po migracji', max: 14}))}
    </div><div class="out">
      ${out('Pracochłonność luk', fnum(bc.gapMd) + ' md', 'z rejestru luk (krok 4)')}
      ${out('Nakład jednorazowy', bc.rate ? fpln(bc.oneOff) : '–', bc.rate ? '(' + fnum(bc.base) + ' + ' + fnum(bc.gapMd) + ' md) × ' + fnum(bc.rate) + ' zł + inne koszty' : 'podaj stawkę za osobodzień')}
      ${out('Roczna zmiana kosztów IT', bc.symf || bc.axc ? fpln(bc.symf - bc.axc) : '–', 'koszt ' + co.srcSys + ' minus koszt AX 2012 dla ' + co.srcCo)}
      ${out('Korzyści wycenione', fpln(bc.benPln) + ' / rok', plural(bs.on.filter(b => num(b.pln)).length, ['{n} korzyść z kwotą', '{n} korzyści z kwotą', '{n} korzyści z kwotą']))}
      ${out('Efekt roczny razem', bc.any || bc.benPln ? fpln(bc.annual) : '–', '', 'tot')}
      ${out('Prosty okres zwrotu', bc.payback != null ? fnum(bc.payback, 1) + ' lat' : '–', bc.payback != null ? 'nakład jednorazowy ÷ efekt roczny' : 'wymaga nakładu i dodatniego efektu rocznego')}
    </div></div></section>`;
  return `<div class="note">${ic('info')}<p>Oceń korzyści migracji ${esc(co.srcCo)} do ${esc(co.tgtSys)}: zaznacz, które dotyczą, oceń wartość i pewność oszacowania, a gdzie się da – podaj kwotę rocznie lub etaty. Szacunek nakładów łączy luki z kroku 4 z kosztami wdrożenia.</p></div>
    <section class="sec"><div class="sech"><h2>${pic('trend-up')}Korzyści z migracji</h2><div class="acts"><span>dotyczy: ${bs.on.length} · wysoka wartość: ${bs.hi.length}${bs.pln ? ' · ' + esc(fpln(bs.pln)) + ' rocznie' : ''}</span></div></div>${rows}${add}</section>` + bcSec;
}
function benRow(m, b) {
  const bi = ID.bn(m.cid, b.k), bad = MISS.has('bon-' + b.k) && !b.on;
  const head = b.std ? `<div class="bt">${esc(b.n)} <span class="tag">${esc((BCATBY[b.cat] || {}).n || '')}</span></div><div class="bd">${esc(b.d)}</div>`
    : `<div class="bt" style="gap:8px">${inpF(bi, 'n', b.n === 'Korzyść bez nazwy' ? '' : b.n, {ph: 'Nazwa korzyści', max: 160, label: 'Nazwa korzyści'})}<span style="width:200px">${selF(bi, 'cat', b.cat, BCAT.map(x => [x.k, x.n]), {label: 'Kategoria'})}</span><button type="button" class="lnk del" data-act="bn-del" data-b="${esc(b.k)}">${ic('trash')} Usuń</button></div>`;
  const f = b.in ? `<div class="bf"><div class="fld"><span>${rq('Wartość')}</span>${segB('bn-v', String(b.v || ''), D.benV.map(x => [String(x.v), esc(x.n), x.v >= 3 ? 'y' : '']), `data-b="${esc(b.k)}"`, 'sm' + (MISS.has('bv-' + b.k) ? ' bad' : ''))}</div>
      <div class="fld"><span>${rq('Pewność')}</span>${segB('bn-cf', String(b.cf || ''), D.benCf.map(x => [String(x.v), esc(x.n)]), `data-b="${esc(b.k)}"`, 'sm' + (MISS.has('bcf-' + b.k) ? ' bad' : ''))}</div>
      ${fld('Horyzont', selF(bi, 'hz', fval(b, 'hz'), D.benHz.map(x => [x, x]), {empty: '–'}))}${fld('Kwota rocznie (zł)', inpF(bi, 'pln', fval(b, 'pln'), {num: 1, ph: 'opcjonalnie', max: 14}))}${fld('Etaty (FTE)', inpF(bi, 'fte', fval(b, 'fte'), {num: 1, ph: 'np. 0,5', max: 6}))}</div>
    <div class="bf2">${fld('Uzasadnienie i sposób pomiaru', txtF(bi, 'j', fval(b, 'j'), {rows: 2, ph: 'Skąd wynika korzyść i jak ją zmierzymy'}))}${fld('Właściciel korzyści', inpF(bi, 'ow', fval(b, 'ow'), {ph: 'Imię i nazwisko', list: 'dl-ppl'}))}</div>` : '';
  return `<div class="bnrow${b.in ? ' on' : b.on === 'N' ? ' off' : ''}${bad ? ' bad' : ''}" id="ben-${esc(b.k)}" data-key="bn-${esc(b.k)}"><div>${head}</div><div>${segB('bn-on', b.on || '', [['Y', 'Dotyczy', 'y'], ['N', 'Nie dotyczy', 'n']], `data-b="${esc(b.k)}"`, 'sm')}</div>${f}</div>`;
}

/* ---------- krok 7: wynik ---------- */
const VICON = {go: 'seal-check', cond: 'flag-banner', nogo: 'warning-circle', wait: 'hourglass'};
function verdictPanel(m, v, opt) {
  const co = m.co, P = D.verdict, o = opt || {};
  const k = o.k || v.k, def = VERDBY[k] || {n: 'Za mało danych do rekomendacji', d: `Oceniono ${fpct(v.cov)} wymagań – propozycja pojawi się po ocenie co najmniej ${fpct(P.minCov)} wymagań.`};
  const li = (cls, icn, t) => `<li class="${cls}">${ic(icn)}<span>${t}</span></li>`;
  const crit = [
    li(v.cov >= P.minCov ? 'ok' : 'wn', v.cov >= P.minCov ? 'checkc' : 'clock', `Pokrycie oceny: <b>${fpct(v.cov)}</b> – ocena ostateczna dla ${v.done} z ${esc(plural(v.tot, F_REQ))}${v.open ? `, do wyjaśnienia: ${v.open}` : ''}`),
    li(v.fi == null ? 'wn' : v.fi >= P.goFit ? 'ok' : v.fi >= P.condFit ? 'wn' : 'er', v.fi != null && v.fi >= P.goFit ? 'checkc' : 'warn', `Indeks dopasowania: <b>${fpct(v.fi)}</b> (rekomendacja od ${fpct(P.goFit)}, warunkowa od ${fpct(P.condFit)})`),
    li(!v.crit.length ? 'ok' : v.crit.length <= P.condCrit ? 'wn' : 'er', !v.crit.length ? 'checkc' : 'warn', `Luki krytyczne: <b>${v.crit.length}</b> (Must, wymagające rozwoju AX 2012, integracji albo obejścia)`),
    li(!v.rkNo.length ? 'ok' : 'er', !v.rkNo.length ? 'checkc' : 'warn', `Ryzyka krytyczne i wysokie bez działań: <b>${v.rkNo.length}</b> · krytyczne: ${v.rkCrit.length}, wysokie: ${v.rkHi.length}`),
    li(v.chgHi.length ? 'wn' : 'ok', v.chgHi.length ? 'info' : 'checkc', `Zmiany procesowe w ${esc(co.srcCo)}: <b>${v.chg.length}</b>${v.chgHi.length ? `, w tym o wysokiej skali: ${v.chgHi.length}` : ''}`),
    li('ok', 'info', `Szacowana pracochłonność luk: <b>${fnum(v.md)} osobodni</b>${v.noEff ? ` (bez oszacowania: ${v.noEff})` : ''}`)];
  return `<div class="verd ${k}"><span class="vi">${pic(VICON[k] || 'hourglass')}</span><span class="vk">${esc(o.kick || 'Propozycja narzędzia')}</span><h2>${esc(def.n)}</h2><p>${esc(o.text || def.d)}</p>${o.noCrit ? '' : `<ul class="crit-list">${crit.join('')}</ul>`}</div>`;
}
function step7(m) {
  const s = slice(m, V.aid), v = verdict(m, V.aid), a1 = V.aid ? m.ABY[V.aid] : null, co = m.co, bs = benefitSum(m), bc = bcase(m);
  if (!s.areas.length) return noAreas();
  const kpi = (lb, val, sub, cls) => `<div class="stat${cls ? ' ' + cls : ''}"><span class="lb">${esc(lb)}</span><b>${esc(val)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const kpis = `<div class="kpis">${kpi('Pokrycie oceny', fpct(v.cov), v.done + ' z ' + v.tot + ' wymagań')}${kpi('Indeks dopasowania', fpct(v.fi), 'ważony priorytetem', v.fi == null ? '' : v.fi >= D.verdict.goFit ? 'okk' : v.fi >= D.verdict.condFit ? 'warn' : 'crit')}
    ${kpi('Luki krytyczne', String(v.crit.length), 'luki razem: ' + v.gaps.length, v.crit.length ? 'crit' : '')}${kpi('Zmiany procesowe w ' + co.srcCo, String(v.chg.length), v.chgHi.length ? 'wysoka skala: ' + v.chgHi.length : 'bez zmian o wysokiej skali', v.chgHi.length ? 'warn' : '')}
    ${kpi('Pracochłonność luk', fnum(v.md) + ' md', bc.rate ? '≈ ' + fpln(v.md * bc.rate) : 'osobodni')}${kpi('Ryzyka wysokie i krytyczne', String(v.rkCrit.length + v.rkHi.length), plural(s.risks.length, F_RISK) + ' w rejestrze', v.rkCrit.length ? 'crit' : v.rkHi.length ? 'warn' : '')}</div>`;
  const benChart = !a1 ? `<div class="chart"><h3>Wartość dodana</h3><p class="cs">Korzyści oznaczone „dotyczy”: ${bs.on.length}${bs.pln ? ' · wycenione: ' + esc(fpln(bs.pln)) + ' rocznie' : ''}</p>
    ${bs.on.length ? `<div class="hbars ben">${bs.on.slice().sort((x, y) => y.score - x.score).slice(0, 6).map(b => `<div class="hb" data-tip="${esc(b.n)}" data-tip2="${esc('wartość: ' + ((D.benV[b.v - 1] || {}).n || '–') + ' · pewność: ' + ((D.benCf[b.cf - 1] || {}).n || '–'))}"><span class="nm">${esc(b.n)}</span><span class="t"><i style="width:${(b.score / 12 * 100).toFixed(0)}%;background:var(--ok)"></i></span><span class="v">${esc((D.benV[b.v - 1] || {}).n || '–')}</span></div>`).join('')}</div>` : '<p class="muted sm" style="margin:0">Oceń korzyści w kroku 6.</p>'}
    ${bc.payback != null ? `<p class="sm" style="margin:10px 0 0">Prosty okres zwrotu: <b>${fnum(bc.payback, 1)} lat</b> (nakład ${esc(fpln(bc.oneOff))}, efekt roczny ${esc(fpln(bc.annual))})</p>` : ''}</div>` : '';
  const charts = `<div class="charts3">${areaMap(m, s)}${effortBars(v)}${heatMap(s.risks)}${benChart}</div>`;
  const gl = v.gaps.filter(r => r.crit || r.pri0 === 'M').sort((x, y) => (y.crit - x.crit) || (effMd(y.eff) - effMd(x.eff)));
  const gapT = `<h2 class="blk">Luki krytyczne i luki „Must”</h2><p class="blk">Kliknij wiersz, aby przejść do rejestru luk.</p><div class="tblwrap"><table class="ov"><thead><tr><th>Kod</th><th>Wymaganie</th><th>Ocena</th><th>Zamknięcie</th><th>Pracochł.</th><th>Decyzja</th></tr></thead><tbody>
    ${cap('r7g', gl, 10).map(r => `<tr class="click" data-act="goto" data-step="4" data-a="${esc(r.a)}" data-t="g-${esc(r.k)}"><td class="sm mono">${esc(r.code)}</td><td><span class="nm">${esc(trunc(r.t, 110))}</span><span class="sub">${esc(r.proc.n)}${r.crit ? ' · luka krytyczna' : ''}</span></td><td>${fsTag(r.st)}</td><td>${resTag(r.res) || '<span class="faint">–</span>'}</td><td class="sm">${esc(r.eff || '–')}</td><td class="sm">${esc((DECBY[r.dec || 'P'] || {}).n || '')}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">Brak luk o priorytecie Must.</td></tr>'}</tbody></table></div>${moreBtn('r7g', gl.length, 10)}`;
  const chT = `<h2 class="blk">Zmiany procesowe w ${esc(co.srcCo)}</h2><div class="tblwrap"><table class="ov"><thead><tr><th>Kod</th><th>Zmiana</th><th>Skala</th><th>Kogo dotyczy</th><th>Szkolenie</th></tr></thead><tbody>
    ${cap('r7c', v.chg.slice().sort((x, y) => (+y.imp || 0) - (+x.imp || 0)), 8).map(r => `<tr class="click" data-act="goto" data-step="4" data-a="${esc(r.a)}" data-t="g-${esc(r.k)}" data-r4="chg"><td class="sm mono">${esc(r.code)}</td><td><span class="nm">${esc(trunc(norm(r.chg) || r.t, 120))}</span><span class="sub">${esc(r.proc.n)}</span></td><td>${r.imp ? `<span class="tag ${+r.imp === 3 ? 'err' : +r.imp === 2 ? 'warn' : 'ok'}">${esc(IMP[r.imp - 1].n)}</span>` : '<span class="faint">–</span>'}</td><td class="sm">${esc(r.who || '–')}</td><td class="sm">${r.tr ? 'tak' : '–'}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">Brak zmian procesowych.</td></tr>'}</tbody></table></div>${moreBtn('r7c', v.chg.length, 8)}`;
  const kord = s.risks.slice().sort((x, y) => y.score - x.score);
  const rkT = `<h2 class="blk">Rejestr ryzyk</h2><div class="tblwrap"><table class="ov"><thead><tr><th>Poziom</th><th>Ryzyko</th><th>Obszar</th><th>Właściciel</th><th>Działanie</th><th>Status</th></tr></thead><tbody>
    ${cap('r7r', kord, 8).map(r => `<tr class="click" data-act="goto" data-step="5" data-a="${esc(r.a === GLOBAL ? '' : r.a)}" data-t="risk-${esc(r.k)}"><td><span class="score l${r.lv}" style="min-width:0;height:26px">${r.score ? r.score + ' · ' + esc(D.riskLv[r.lv].n) : '–'}</span></td><td><span class="nm">${esc(r.t || 'Ryzyko bez nazwy')}</span><span class="sub">${esc((RCATBY[r.cat] || {}).n || '')}</span></td><td class="sm">${esc(r.area ? r.area.n : 'całe przedsięwzięcie')}</td><td class="sm">${esc(norm(r.ow) || '–')}</td><td class="sm">${esc(trunc(r.ac, 80) || '–')}</td><td class="sm">${esc(RST[r.st || 'O'])}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">Brak ryzyk w rejestrze.</td></tr>'}</tbody></table></div>${moreBtn('r7r', kord.length, 8)}`;
  const oq = s.reqs.filter(r => r.open);
  const oqT = oq.length ? `<h2 class="blk">Pytania do wyjaśnienia</h2><div class="tblwrap"><table class="ov"><thead><tr><th>Kod</th><th>Pytanie</th><th>Notatki</th></tr></thead><tbody>${cap('r7o', oq, 8).map(r => `<tr class="click" data-act="goto" data-step="3" data-a="${esc(r.a)}" data-t="q-${esc(r.k)}" data-q="${esc(r.k)}"><td class="sm mono">${esc(r.code)}</td><td><span class="nm">${esc(trunc(r.t, 120))}</span><span class="sub">${esc(r.proc.n)}</span></td><td class="sm">${esc(trunc([r.cc, r.cp].filter(x => norm(x)).join(' · '), 120) || '–')}</td></tr>`).join('')}</tbody></table></div>${moreBtn('r7o', oq.length, 8)}` : '';
  const iss = issues(m, V.aid);
  const issT = `<h2 class="blk">Do uzupełnienia</h2>${iss.length ? `<ul class="issues">${cap('r7i', iss, 8).map(x => `<li data-key="is-${x.step}-${esc(x.a)}-${esc(slug(x.txt))}">${ic('warn')}<span class="t">${esc(x.txt)}${x.n > 1 ? ` <b>(${x.n})</b>` : ''}</span><button type="button" class="btn sm noprint" data-act="goto" data-step="${x.step}" data-a="${esc(x.a)}">Przejdź do kroku ${x.step}</button></li>`).join('')}</ul>${moreBtn('r7i', iss.length, 8)}` : `<ul class="issues"><li class="ok">${ic('checkc')}<span class="t">Wszystkie dane są kompletne.</span></li></ul>`}`;
  const id = ID.an(m.cid);
  const rec = a1 ? '' : `<h2 class="blk">Rekomendacja zespołu analizy</h2><div class="recbox"><p class="sm muted" style="margin:0">Propozycja narzędzia jest punktem wyjścia. Zespół analizy wpisuje ostateczną rekomendację z uzasadnieniem i warunkami – trafią one do raportu końcowego.</p>
    <div>${segB('rec', co.rec || '', VERD.map(x => [x.k, esc(x.n), x.k]), '', 'sm wr')}</div>
    <div class="r2">${fld('Uzasadnienie', txtF(id, 'recJ', fval(co, 'recJ'), {rows: 4, ph: 'Najważniejsze argumenty: dopasowanie, luki, ryzyka, wartość dodana'}))}${fld('Warunki migracji', txtF(id, 'recC', fval(co, 'recC'), {rows: 4, ph: 'Każdy warunek w osobnej linii, np. decyzja o integracji z ARA MES przed startem projektu'}))}</div>
    ${fld('Następne kroki', txtF(id, 'next', fval(co, 'next'), {rows: 3, ph: 'Każdy krok w osobnej linii: kto, co, do kiedy'}))}</div>`;
  let sign;
  if (a1) {
    const exp = [a1.ecc ? a1.ecc.n : '', a1.ecp ? a1.ecp.n : ''].filter(Boolean).join(', ');
    sign = a1.sg ? `<div class="sign done"><h3>${ic('checkc')}Wyniki obszaru potwierdzone</h3><p class="sm" style="margin:0">${esc(a1.sg)} · ${esc(fd(a1.sgAt))}</p><div><button type="button" class="btn sm noprint" data-act="unsign" data-a="${esc(a1.k)}">${ic('undo')}Cofnij potwierdzenie</button></div></div>`
      : `<div class="sign"><h3>Potwierdzenie wyników obszaru</h3><p class="sm muted" style="margin:0">Po omówieniu wyników z liderami procesu potwierdź, że odpowiedzi, oceny, luki i zmiany procesowe są zgodne z ustaleniami.</p><div class="sr2 noprint">${fld('Potwierdzają', `<input class="inp" id="sg-nm" value="${esc(exp)}" placeholder="Liderzy procesu obszaru" maxlength="160">`)}${fld('Data', `<input class="inp" id="sg-dt" type="date" value="${today()}">`)}<button type="button" class="btn pri" data-act="sign" data-a="${esc(a1.k)}">${ic('check')}Potwierdź wyniki obszaru</button></div></div>`;
  } else {
    sign = `<div class="sign${co.sg ? ' done' : ''}"><h3>${co.sg ? ic('checkc') : ''}Zatwierdzenie wyników analizy</h3>
      <div class="alsign">${s.areas.map(a => `<span class="${a.sg ? '' : 'no'}">${ic(a.sg ? 'checkc' : 'clock')}${esc(a.n)}${a.sg ? ' – ' + esc(a.sg) : ' – niepotwierdzony'}</span>`).join('')}</div>
      ${co.sg ? `<p class="sm" style="margin:0">Zatwierdził(a): <b>${esc(co.sg)}</b> · ${esc(fd(co.sgAt))}</p><div><button type="button" class="btn sm noprint" data-act="unsign-an">${ic('undo')}Cofnij zatwierdzenie</button></div>`
        : `<div class="sr2 noprint">${fld('Zatwierdza', `<input class="inp" id="sg-nm" value="${esc(norm(co.sp))}" placeholder="Sponsor analizy" maxlength="80">`)}${fld('Data', `<input class="inp" id="sg-dt" type="date" value="${today()}">`)}<button type="button" class="btn pri" data-act="sign-an">${ic('check')}Zatwierdź wyniki analizy</button></div>`}</div>`;
  }
  const fin = !a1 && VERDBY[co.rec] ? verdictPanel(m, v, {k: co.rec, kick: 'Rekomendacja zespołu analizy', text: norm(co.recJ) || VERDBY[co.rec].d, noCrit: true}) : '';
  return kpis + fin + verdictPanel(m, v) + charts + gapT + chT + rkT + oqT + issT + rec + `<h2 class="blk">${a1 ? 'Potwierdzenie' : 'Zatwierdzenie'}</h2>` + sign;
}

/* ---------- ramka kroku ---------- */
const STEP_LEAD = [null,
  'Opisz analizę, dodaj osoby biorące udział, wskaż obszary w zakresie, liderów procesu obu stron i uczestników, przygotuj agendę i pytania.',
  'Potwierdź procesy realizowane w spółce przenoszonej, ich właścicieli, narzędzia i skalę oraz możliwość wspólnego standardu.',
  'Razem z liderami procesu opisz praktykę obu spółek dla każdego pytania i oceń dopasowanie do szablonu systemu docelowego.',
  'Uzupełnij rejestr luk: sposób zamknięcia, pracochłonność i decyzję, a dla zmian procesowych – opis i skalę zmiany.',
  'Zbuduj rejestr ryzyk migracji z właścicielami i działaniami. Narzędzie podpowiada ryzyka typowe i wynikające z luk.',
  'Oceń korzyści migracji i oszacuj nakłady – to podstawa oceny, czy migracja jest uzasadniona biznesowo.',
  'Zestawienie wyników: dopasowanie, luki, zmiany procesowe, ryzyka, wartość dodana, rekomendacja i akceptacje.'];
function renderAnalysis() {
  const m = model(V.cid), st = V.step, a = V.aid && m.ABY[V.aid];
  const need = st < NS ? required(m, st, V.aid) : [];
  if (V.miss === st && !need.length) V.miss = 0;
  MISS = new Set(V.miss === st ? need.map(x => x.k).filter(Boolean) : []);
  const body = [null, step1, step2, step3, step4, step5, step6, step7][st](m);
  MISS = new Set();
  const summary = V.miss === st ? `<div class="miss noprint" id="miss" tabindex="-1" role="alert" aria-labelledby="miss-h"><h2 id="miss-h">${ic('warn')}Uzupełnij wymagane pola, aby przejść dalej</h2>
    <ul>${need.slice(0, 12).map(x => `<li><button type="button" class="lnk" data-act="miss" data-sel="${esc(x.sel)}">${esc(x.t)}</button></li>`).join('')}</ul>${need.length > 12 ? `<p class="sm" style="margin:6px 0 0">…oraz ${need.length - 12} kolejnych.</p>` : ''}</div>` : '';
  const fmiss = need.length ? `<span class="fmiss" data-key="fmiss">Do uzupełnienia: ${need.length}</span>` : '';
  const prev = st > 1 ? `<a class="btn" data-key="prev" href="${href(st - 1, V.aid)}">${ic('left')}${esc(STEPS[st - 1])}</a>` : '<a class="btn" data-key="prev" href="#start">' + ic('left') + 'Wszystkie analizy</a>';
  const next = st < NS ? `<a class="btn pri" data-key="next" href="${href(st + 1, V.aid)}" data-act="next">Dalej: ${esc(STEPS[st + 1])}${ic('right')}</a>` : `<a class="btn pri" data-key="next" href="${hrefDoc(m.cid)}">${ic('doc')}Raport końcowy</a>`;
  const acts = st === NS ? `<div class="acts noprint"><a class="btn pri" href="${hrefDoc(m.cid)}">${ic('doc')}Raport końcowy</a><button type="button" class="btn" data-act="xlsx">${ic('sheet')}Raport Excel</button><button type="button" class="btn" data-act="print">${ic('print')}Drukuj tę stronę</button></div>` : '';
  const title = st === NS ? 'Wynik analizy – ' + (a ? a.n : m.co.n) : STEPS[st];
  return `<div class="card">${m.inArea.length && st > 1 ? `<div style="padding:14px 28px 0" class="noprint">${mobileSelect(m)}</div>` : ''}
    <div class="phead"><div class="kick">Krok ${st} z ${NS} · ${esc(m.co.n)}${a ? areaFilterChip(m) : ''}</div><h1>${esc(title)}</h1><p class="lead">${esc(STEP_LEAD[st])}</p>${st < NS ? `<p class="reqnote noprint">Pola oznaczone <span class="rq" aria-hidden="true">*</span> gwiazdką są wymagane – bez nich nie przejdziesz do kolejnego kroku.</p>` : ''}${st === NS ? `<p class="printonly sm muted">Stan na ${esc(fdt(now()))} · przygotował(a): ${esc(S.who || '–')} · dokument wewnętrzny</p>` : ''}${acts}</div>
    <div class="pane">${summary}${body}</div><div class="foot">${prev}<span class="fnext">${fmiss}${next}</span></div></div>`;
}
