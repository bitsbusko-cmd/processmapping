/* ===================== Fit-Gap ERP – raport Excel (ExcelJS) ===================== */
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = () => window.ExcelJS ? res(window.ExcelJS) : rej(new Error('ExcelJS')); s.onerror = () => { s.remove(); rej(new Error('ExcelJS')); }; document.head.appendChild(s); }); }
function loadExcelJS() {
  if (window.ExcelJS) return Promise.resolve(window.ExcelJS);
  return loadScript('vendor/exceljs.min.js').catch(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'));
}
const XA = {name: 'Arial', size: 10}, XINK = 'FF15233A', XGREY = 'FF5F6D7E', XLINE = {style: 'thin', color: {argb: 'FFD8DEE6'}};
const xfill = argb => ({type: 'pattern', pattern: 'solid', fgColor: {argb}});
const G1 = 'FF1F3864', G2 = 'FF2F5597', G3 = 'FF44546A', G4 = 'FF9A4A0B', G5 = 'FF1B7446';
const XFIT = {F: ['FFE1F2E8', 'FF1B7446'], P: ['FFFDF3DC', 'FF8A5A06'], G: ['FFFCEDEC', 'FFB3261E'], N: ['FFEEF1F4', 'FF5F6D7E'], O: ['FFEFE8FA', 'FF6A3FB5']};
const XLV = [['FFE3F1E4', 'FF2C6A30'], ['FFFBF2CF', 'FF6E5300'], ['FFFBE5D5', 'FF94420E'], ['FFF6DCDC', 'FF9A2125']];
let XTITLE = '';
function xsheet(wb, name, title, groups, xs) {
  const cols = [].concat(...groups.map(g => g[2])), HR = 5;
  const ws = wb.addWorksheet(name, {views: [{state: 'frozen', ySplit: HR, xSplit: xs || 0, showGridLines: false, zoomScale: 90}],
    pageSetup: {orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9, printTitlesRow: '4:5', margins: {left: .4, right: .4, top: .5, bottom: .5, header: .3, footer: .3}},
    headerFooter: {oddFooter: '&L' + title + ' – analiza fit-gap&RStrona &P z &N'}});
  ws.columns = cols.map(c => ({width: c[1]}));
  ws.getCell(1, 1).value = title; ws.getCell(1, 1).font = Object.assign({}, XA, {size: 15, bold: true, color: {argb: XINK}}); ws.getRow(1).height = 24;
  ws.getCell(2, 1).value = `${XTITLE} · wygenerowano ${new Date().toLocaleString(LOC, {dateStyle: 'medium', timeStyle: 'short'})} · przygotował(a): ${S.who || '–'} · dokument wewnętrzny`;
  ws.getCell(2, 1).font = Object.assign({}, XA, {color: {argb: XGREY}});
  let c0 = 1; const first = new Set();
  groups.forEach(([gn, col, cs]) => { const c1 = c0 + cs.length - 1; first.add(c0); if (c1 > c0) ws.mergeCells(4, c0, 4, c1);
    const cell = ws.getCell(4, c0); cell.value = gn; for (let i = c0; i <= c1; i++) ws.getCell(4, i).fill = xfill(col);
    cell.font = Object.assign({}, XA, {bold: true, color: {argb: 'FFFFFFFF'}}); cell.alignment = {vertical: 'middle', horizontal: 'left', indent: 1};
    cs.forEach((c, k) => { const h = ws.getCell(HR, c0 + k); h.value = c[0]; h.font = Object.assign({}, XA, {bold: true, color: {argb: XINK}}); h.fill = xfill('FFEEF2F8');
      h.alignment = {vertical: 'middle', wrapText: true}; h.border = {bottom: {style: 'medium', color: {argb: col}}, left: k === 0 ? {style: 'thin', color: {argb: 'FFC1CAD5'}} : undefined}; });
    c0 = c1 + 1; });
  ws.getRow(4).height = 20; ws.getRow(HR).height = 42;
  return {ws, cols, HR, first, r: HR + 1};
}
function xrow(sh, vals, style) {
  const row = sh.ws.getRow(sh.r++); row.values = vals;
  row.eachCell({includeEmpty: true}, (c, ci) => { if (ci > sh.cols.length) return; c.font = Object.assign({}, XA); c.alignment = {vertical: 'top', wrapText: true};
    c.border = {bottom: XLINE, left: sh.first.has(ci) ? {style: 'thin', color: {argb: 'FFC1CAD5'}} : undefined}; if (style) style(c, ci); });
  return row;
}
function xend(sh, empty) {
  if (sh.r === sh.HR + 1) { const c = sh.ws.getCell(sh.r++, 1); c.value = empty || 'Brak danych.'; c.font = Object.assign({}, XA, {italic: true, color: {argb: XGREY}}); }
  sh.ws.autoFilter = {from: {row: sh.HR, column: 1}, to: {row: Math.max(sh.r - 1, sh.HR + 1), column: sh.cols.length}};
}
const xfit = (c, st) => { const f = XFIT[st]; if (!f) return; c.fill = xfill(f[0]); c.font = Object.assign({}, XA, {bold: true, color: {argb: f[1]}}); c.alignment = {vertical: 'top', horizontal: 'center'}; };
const xlvl = (c, lv) => { const f = XLV[lv]; if (!f) return; c.fill = xfill(f[0]); c.font = Object.assign({}, XA, {bold: true, color: {argb: f[1]}}); };
const xbold = c => { c.font = Object.assign({}, XA, {bold: true}); };
function xblock(sh, title, rows) {
  sh.r++; const t = sh.ws.getCell(sh.r++, 1); t.value = title; t.font = Object.assign({}, XA, {bold: true, size: 12, color: {argb: XINK}});
  rows.forEach(([k, v]) => { const a = sh.ws.getCell(sh.r, 1), b = sh.ws.getCell(sh.r, 2); a.value = k; a.font = Object.assign({}, XA, {bold: true, color: {argb: XGREY}}); a.alignment = {vertical: 'top', wrapText: true};
    sh.ws.mergeCells(sh.r, 2, sh.r, Math.min(sh.cols.length, 8)); b.value = v == null || v === '' ? '–' : v; b.font = Object.assign({}, XA); b.alignment = {vertical: 'top', wrapText: true};
    const ln = String(b.value).split('\n').length; if (ln > 1 || String(b.value).length > 110) sh.ws.getRow(sh.r).height = Math.min(160, 14 * Math.max(ln, Math.ceil(String(b.value).length / 110)));
    sh.r++; });
}
const dTxt = ts => ts ? new Date(ts).toLocaleDateString(LOC) : '';
const who0 = x => x ? String(x).split(' · ')[0] : '';

async function exportXlsx(cid) {
  if (!cid) { toast('Otwórz analizę, aby przygotować raport Excel.'); return; }
  let X; try { X = await loadExcelJS(); } catch (e) { toast('Nie udało się wczytać modułu Excel. Sprawdź połączenie i spróbuj ponownie.'); return; }
  const m = model(cid), co = m.co, s = slice(m, ''), v = verdict(m, ''), bs = benefitSum(m), bc = bcase(m);
  XTITLE = 'Analiza fit-gap · ' + co.n;
  const wb = new X.Workbook(); wb.creator = S.who || 'Analiza Fit-Gap ERP'; wb.created = new Date();
  /* 1. Podsumowanie */
  let sh = xsheet(wb, 'Podsumowanie', 'Podsumowanie analizy fit-gap', [
    ['Obszar', G1, [['Obszar', 30], ['Zakres', 13], ['Lider procesu ' + co.srcCo, 24], ['Lider procesu ' + co.tgtCo, 24]]],
    ['Wymagania', G2, [['Procesy', 9], ['Wymagania', 11], ['Ocenione', 10], ['Fit', 7], ['Częściowe', 10], ['Luka', 7], ['N/D', 7], ['Do wyjaśnienia', 11], ['Indeks dopasowania', 12]]],
    ['Luki i ryzyka', G3, [['Luki krytyczne', 10], ['Pracochłonność luk (md)', 13], ['Zmiany procesowe ' + co.srcCo, 13], ['Ryzyka wysokie i krytyczne', 12]]],
    ['Status', G5, [['Potwierdzenie wyników', 26]]]], 1);
  m.areas.filter(a => a.in || a.later).forEach(a => { const rs = s.reqs.filter(r => r.a === a.k), c = cnt(rs), fi = fitIndex(rs), vv = a.in ? verdict(m, a.k) : null;
    xrow(sh, [a.n, a.in ? 'w zakresie' : 'kolejny etap', a.ecc ? a.ecc.n : '', a.ecp ? a.ecp.n : '', a.in ? m.procs.filter(p => p.a === a.k && p.act).length : '', a.in ? rs.length : '',
      a.in ? rs.filter(r => r.done).length : '', a.in ? c.F : '', a.in ? c.P : '', a.in ? c.G : '', a.in ? c.N : '', a.in ? c.O : '', fi != null ? fi : '',
      vv ? vv.crit.length : '', vv ? vv.md : '', vv ? vv.chg.length : '', vv ? vv.rkCrit.length + vv.rkHi.length : '', a.in ? (a.sg ? a.sg + ', ' + fd(a.sgAt) : 'niepotwierdzone') : ''],
      (c, ci) => { if (ci === 1) xbold(c); if (ci === 13) c.numFmt = '0%'; if (ci >= 5 && ci <= 17) c.alignment = {vertical: 'top', horizontal: 'center'}; if (!a.in) c.font = Object.assign({}, XA, {color: {argb: XGREY}}); }); });
  xend(sh, 'Nie wskazano obszarów.');
  const rec = VERDBY[co.rec], prop = VERDBY[v.k];
  xblock(sh, 'Analiza i rekomendacja', [['Analiza', co.n], ['Systemy', sysCC(co) + ' → ' + sysCP(co)], ['Sponsor', co.sp], ['Lider analizy', co.pl], ['Cel i zakres', co.scope],
    ['Pokrycie oceny', fpct(v.cov) + ' (' + v.done + ' z ' + v.tot + ' wymagań)'], ['Indeks dopasowania', fpct(v.fi)], ['Luki / krytyczne', v.gaps.length + ' / ' + v.crit.length], ['Pracochłonność luk', fnum(v.md) + ' osobodni'],
    ['Zmiany procesowe w ' + co.srcCo, v.chg.length + (v.chgHi.length ? ' (wysoka skala: ' + v.chgHi.length + ')' : '')], ['Ryzyka krytyczne / wysokie', v.rkCrit.length + ' / ' + v.rkHi.length],
    ['Propozycja narzędzia', prop ? prop.n : 'za mało danych do rekomendacji'], ['Rekomendacja zespołu', rec ? rec.n : 'nie wpisano'], ['Uzasadnienie', co.recJ], ['Warunki migracji', co.recC], ['Następne kroki', co.next],
    ['Zatwierdzenie', co.sg ? co.sg + ', ' + fd(co.sgAt) : 'niezatwierdzone']]);
  /* 2. Zespół */
  sh = xsheet(wb, 'Zespół', 'Zespół i uczestnicy', [['Osoba', G1, [['Imię i nazwisko', 26], ['Zespół', 22], ['Rola', 24], ['Obszary key usera', 36]]], ['Udział', G2, [['Lider procesu w obszarach', 36], ['Uczestnik obszarów', 36]]]], 1);
  m.people.forEach(p => xrow(sh, [p.n, p.co || '', p.role || '', p.kas.map(x => x.n).join('\n'), m.inArea.filter(a => a.xcc === p.k || a.xcp === p.k).map(a => a.n).join(', '), m.inArea.filter(a => a.us.includes(p.k)).map(a => a.n).join(', ')], (c, ci) => { if (ci === 1) xbold(c); }));
  xend(sh, 'Brak osób.');
  /* 3. Procesy AS-IS */
  sh = xsheet(wb, 'Procesy AS-IS', 'Procesy AS-IS', [
    ['Proces', G1, [['Obszar', 22], ['Kod', 7], ['Proces', 30], ['Dotyczy', 9]]],
    ['Właściciele i skala', G2, [['Właściciel ' + co.srcCo, 18], ['Właściciel ' + co.tgtCo, 18], ['Wolumen', 18], ['Częstotliwość', 13], ['Narzędzia ' + co.srcCo, 24], ['Narzędzia ' + co.tgtCo, 24]]],
    ['Harmonizacja', G4, [['Wspólny standard', 16], ['Uzasadnienie specyfiki', 28]]],
    ['Opis', G3, [['Praktyka ' + co.srcCo, 40], ['Praktyka ' + co.tgtCo, 40], ['Problemy i oczekiwania', 32], ['Uwagi', 24]]],
    ['Wynik', G5, [['Wymagania', 10], ['Indeks dopasowania', 11]]]], 3);
  m.procs.filter(p => p.area.in).forEach(p => xrow(sh, [p.area.n, p.cd, p.n, p.on === 'Y' ? 'Tak' : p.on === 'N' ? 'Nie' : '', p.occ || '', p.ocp || '', p.vol || '', p.fq || '', arr(p.tcc).join(', '), arr(p.tcp).join(', '),
    HARMBY[p.hm] ? HARMBY[p.hm].n : '', p.hmj || '', p.dcc || '', p.dcp || '', p.pain || '', p.nt || '', p.act ? p.reqs.length : '', p.act && fitIndex(p.reqs) != null ? fitIndex(p.reqs) : ''],
    (c, ci) => { if (ci === 3 && p.act) xbold(c); if (ci === 18) c.numFmt = '0%'; if (p.on === 'N') c.font = Object.assign({}, XA, {color: {argb: XGREY}}); }));
  xend(sh);
  /* 4. Wymagania fit-gap */
  sh = xsheet(wb, 'Wymagania fit-gap', 'Wymagania – wyniki oceny fit-gap', [
    ['Wymaganie', G1, [['Obszar', 20], ['Proces', 24], ['Kod', 8], ['Wymaganie / pytanie', 48], ['Przepisy', 9]]],
    ['Praktyka', G2, [['Praktyka ' + co.srcCo + ' (' + co.srcSys + ')', 44], ['Praktyka ' + co.tgtCo + ' (' + co.tgtSys + ')', 44]]],
    ['Ocena', G4, [['Ocena dopasowania', 13], ['Sposób zamknięcia', 18], ['Priorytet', 9], ['Luka krytyczna', 9], ['Pracochłonność', 10], ['Osobodni', 9], ['Decyzja', 14], ['Opis luki i rozwiązania', 40], ['Odpowiedzialny', 16]]],
    ['Zmiana', G3, [['Ostatnia zmiana', 11], ['Kto', 16]]]], 4);
  s.reqs.forEach(r => { const e = ent(ID.rq(m.cid, r.k)) || {};
    xrow(sh, [r.area.n, r.proc.n, r.code, r.t, r.reg ? 'tak' : '', r.cc || '', r.cp || '', r.st ? fitName(r.st) : 'bez oceny', r.gap ? resName(r.res) : '', r.gap ? (PRIBY[r.pri0] || {}).n : '', r.crit ? 'tak' : '', r.gap ? r.eff || '' : '', r.gap ? r.md : '', r.gap ? (DECBY[r.dec || 'P'] || {}).n : '', r.ds || '', r.ow || '', dTxt(e.ts), who0(e.by)],
      (c, ci) => { if (ci === 8) { if (r.st) xfit(c, r.st); else c.fill = xfill('FFFFF6BF'); } if (ci === 11 && r.crit) c.font = Object.assign({}, XA, {bold: true, color: {argb: 'FFB3261E'}}); if (ci === 4) xbold(c); }); });
  xend(sh, 'Brak wymagań w procesach w zakresie.');
  /* 5. Rejestr luk */
  sh = xsheet(wb, 'Rejestr luk', 'Rejestr luk', [
    ['Luka', G1, [['Kod', 8], ['Obszar', 18], ['Proces', 22], ['Wymaganie', 44], ['Ocena', 11], ['Luka krytyczna', 9]]],
    ['Zamknięcie', G4, [['Sposób zamknięcia', 18], ['Priorytet', 9], ['Pracochłonność', 10], ['Osobodni', 9], ['Decyzja', 16], ['Opis rozwiązania', 44], ['Odpowiedzialny', 16]]],
    ['Praktyka', G2, [['Praktyka ' + co.srcCo, 36], ['Praktyka ' + co.tgtCo, 36]]]], 1);
  s.gaps.slice().sort((x, y) => (y.crit - x.crit) || ((D.priW[y.pri0] || 0) - (D.priW[x.pri0] || 0)) || (effMd(y.eff) - effMd(x.eff))).forEach(r => xrow(sh, [r.code, r.area.n, r.proc.n, r.t, fitName(r.st), r.crit ? 'tak' : '', resName(r.res), (PRIBY[r.pri0] || {}).n, r.eff || '', r.md, (DECBY[r.dec || 'P'] || {}).n, r.ds || '', r.ow || '', r.cc || '', r.cp || ''],
    (c, ci) => { if (ci === 5) xfit(c, r.st); if (ci === 6 && r.crit) c.font = Object.assign({}, XA, {bold: true, color: {argb: 'FFB3261E'}}); if (r.wd) c.font = Object.assign({}, XA, {color: {argb: XGREY}, strike: ci === 4}); }));
  xend(sh, 'Brak luk.');
  if (s.gaps.length) { const tr = sh.ws.getRow(sh.r++); tr.getCell(9).value = 'Razem'; tr.getCell(10).value = v.md; tr.getCell(9).font = tr.getCell(10).font = Object.assign({}, XA, {bold: true}); }
  /* 6. Zmiany procesowe */
  sh = xsheet(wb, 'Zmiany procesowe', 'Zmiany procesowe w ' + co.srcCo, [
    ['Zmiana', G1, [['Kod', 8], ['Obszar', 18], ['Proces', 22], ['Wymaganie', 36], ['Co zmienia się w ' + co.srcCo, 48]]],
    ['Wdrożenie zmiany', G4, [['Skala zmiany', 12], ['Kogo dotyczy', 26], ['Szkolenie', 10], ['Etap', 16], ['Pracochłonność', 10], ['Decyzja', 16]]]], 1);
  v.chg.slice().sort((x, y) => (+y.imp || 0) - (+x.imp || 0)).forEach(r => xrow(sh, [r.code, r.area.n, r.proc.n, r.t, r.chg || '', r.imp ? r.imp + ' – ' + IMP[r.imp - 1].n : '', r.who || '', r.tr ? 'tak' : '', r.ph || '', r.eff || '', (DECBY[r.dec || 'P'] || {}).n],
    (c, ci) => { if (ci === 6 && +r.imp === 3) c.font = Object.assign({}, XA, {bold: true, color: {argb: 'FFB3261E'}}); }));
  xend(sh, 'Brak zmian procesowych.');
  /* 7. Ryzyka */
  sh = xsheet(wb, 'Ryzyka', 'Rejestr ryzyk migracji', [
    ['Ryzyko', G1, [['Poziom', 14], ['Ryzyko', 32], ['Kategoria', 24], ['Obszar', 20], ['Powiązane wymaganie', 18], ['Opis i przyczyna', 40]]],
    ['Ocena', G4, [['Prawdopodobieństwo', 16], ['Wpływ', 14], ['Wynik', 8]]],
    ['Postępowanie', G5, [['Właściciel', 18], ['Działanie', 40], ['Postępowanie', 14], ['Termin', 11], ['Status', 12]]]], 2);
  s.risks.slice().sort((x, y) => y.score - x.score).forEach(r => xrow(sh, [r.score ? D.riskLv[r.lv].n : '', r.t || '', (RCATBY[r.cat] || {}).n || '', r.area ? r.area.n : 'całe przedsięwzięcie', r.req ? r.req.code : '', r.ds || '',
    r.pr ? r.pr + ' – ' + D.riskP[r.pr - 1].n : '', r.im ? r.im + ' – ' + D.riskI[r.im - 1].n : '', r.score || '', r.ow || '', r.ac || '', D.treat[+r.tr || 0], fd(r.due), RST[r.st || 'O']],
    (c, ci) => { if (ci === 1 && r.score) xlvl(c, r.lv); if (ci === 2) xbold(c); if (ci === 9) c.alignment = {vertical: 'top', horizontal: 'center'}; }));
  xend(sh, 'Brak ryzyk w rejestrze.');
  /* 8. Wartość dodana */
  sh = xsheet(wb, 'Wartość dodana', 'Wartość dodana migracji', [
    ['Korzyść', G1, [['Korzyść', 40], ['Kategoria', 22], ['Dotyczy', 9]]],
    ['Ocena', G5, [['Wartość', 13], ['Pewność', 11], ['Horyzont', 15], ['zł rocznie', 13], ['Etaty (FTE)', 10]]],
    ['Opis', G3, [['Uzasadnienie i pomiar', 44], ['Właściciel', 18]]]], 1);
  m.bens.forEach(b => xrow(sh, [b.n, (BCATBY[b.cat] || {}).n || '', b.on === 'Y' ? 'Tak' : b.on === 'N' ? 'Nie' : '', b.in && b.v ? D.benV[b.v - 1].n : '', b.in && b.cf ? D.benCf[b.cf - 1].n : '', b.in ? b.hz || '' : '', b.in && num(b.pln) ? num(b.pln) : '', b.in && num(b.fte) ? num(b.fte) : '', b.j || '', b.ow || ''],
    (c, ci) => { if (ci === 1 && b.in) xbold(c); if (ci === 7) c.numFmt = '#,##0'; if (!b.in) c.font = Object.assign({}, XA, {color: {argb: XGREY}}); }));
  xend(sh);
  xblock(sh, 'Szacunek nakładów (orientacyjny)', [['Stawka za osobodzień (zł)', bc.rate || ''], ['Nakład bazowy wdrożenia (md)', bc.base], ['Pracochłonność luk (md)', bc.gapMd], ['Inne koszty jednorazowe (zł)', bc.other],
    ['Nakład jednorazowy (zł)', bc.rate ? Math.round(bc.oneOff) : ''], ['Roczny koszt ' + co.srcSys + ' (zł)', bc.symf], ['Roczny koszt AX 2012 dla ' + co.srcCo + ' (zł)', bc.axc], ['Korzyści wycenione (zł rocznie)', bc.benPln],
    ['Efekt roczny razem (zł)', Math.round(bc.annual)], ['Prosty okres zwrotu (lata)', bc.payback != null ? Math.round(bc.payback * 10) / 10 : '']]);
  /* 9. Skale */
  sh = xsheet(wb, 'Skale', 'Skale oceny', [['Skala', G3, [['Skala', 26], ['Wartość', 24], ['Opis', 80]]]]);
  FIT.forEach(f => xrow(sh, ['Ocena dopasowania', f.l, ucFirst(f.d)], (c, ci) => { if (ci === 2) xfit(c, f.k); }));
  RES.forEach(x => xrow(sh, ['Sposób zamknięcia luki', x.n, x.d]));
  PRI.forEach(x => xrow(sh, ['Priorytet (MoSCoW)', x.n, x.d]));
  EFF.forEach(x => xrow(sh, ['Pracochłonność', x.n, x.d + ' (w szacunku ' + x.md + ' md)']));
  IMP.forEach(x => xrow(sh, ['Skala zmiany procesu', x.v + ' – ' + x.n, x.d]));
  D.riskP.forEach(x => xrow(sh, ['Prawdopodobieństwo ryzyka', x.v + ' – ' + x.n, x.d]));
  D.riskI.forEach(x => xrow(sh, ['Wpływ ryzyka', x.v + ' – ' + x.n, x.d]));
  xrow(sh, ['Indeks dopasowania', 'Fit 1 · Częściowe ' + D.fitW.P + ' · Luka 0', 'Średnia ważona priorytetem: Must ×' + D.priW.M + ', Should ×' + D.priW.S + ', Could ×' + D.priW.C + '. Bez ocen „N/D”, „Do wyjaśnienia” i wymagań wycofanych.']);
  xend(sh);
  const buf = await wb.xlsx.writeBuffer();
  if (await download(`FitGap_${slug(co.n) || 'analiza'}_${today()}.xlsx`, new Blob([buf], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})))
    toast('Zapisano raport Excel. Raport zawiera informacje wewnętrzne – chroń go jak inne dokumenty projektu.');
}
