# Składa aplikację: dev/src (szablon, CSS, moduły JS, ikony) + dev/data.json -> index.html w katalogu głównym repozytorium.
# Uruchom z dowolnego miejsca: python3 dev/build.py   (czcionki i ExcelJS są już w fonts/ i vendor/).
import os, json, re, datetime, subprocess, sys
base = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(base, *a)
read = lambda n: open(P('src', n), encoding='utf-8').read()
MODULES = ['icons.js', 'core.js', 'ui.js', 'steps.js', 'doc.js', 'report.js', 'actions.js']
data = json.load(open(P('data.json'), encoding='utf-8'))
# kontrola spójności katalogu: klucze obszarów, procesów i pytań, skale
KEY = r'[A-Za-z0-9_-]{1,40}'
areas = {a['k'] for a in data['areas']}
assert all(p['a'] in areas for p in data['procs']), 'proces z nieznanym obszarem'
keys = [a['k'] for a in data['areas']] + [p['k'] for p in data['procs']] + [q['k'] for p in data['procs'] for q in p['q']] + [b['k'] for b in data['benefits']]
assert len(keys) == len(set(keys)), 'zduplikowany klucz w katalogu'
assert all(re.fullmatch(KEY, k) for k in keys), 'niedozwolony znak w kluczu'
assert all(a.get('cd') for a in data['areas']), 'obszar bez kodu'
assert [f['k'] for f in data['fit']] == ['F', 'P', 'G', 'N', 'O'], 'skala dopasowania: oczekiwano F, P, G, N, O'
assert all(q['p'] in data['priW'] for p in data['procs'] for q in p['q']), 'pytanie z nieznanym priorytetem'
assert set(data['critRes']) <= {r['k'] for r in data['res']}, 'nieznany sposób zamknięcia luki krytycznej'
assert len(data['riskP']) == len(data['riskI']) == 4, 'oczekiwano skali ryzyka 1–4'
assert all(b['cat'] in {c['k'] for c in data['benCats']} for b in data['benefits']), 'korzyść z nieznaną kategorią'
assert all(r['cat'] in {c['k'] for c in data['riskCats']} for r in data['sysRisks']), 'ryzyko z nieznaną kategorią'
assert any(r.lower().startswith('key user') for r in data['roles']), 'brak roli key usera (procesy przypisane osobie)'
js = '(() => {\n\'use strict\';\n' + '\n'.join(read(m) for m in MODULES) + '\n/* ---------- start ---------- */\npurgeSgid();\nroute();\nif (!known()) openModal(\'who\');\ndetectShared();\n})();\n'
ver = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1))).strftime('%d.%m.%Y %H:%M')
js = js.replace('{{VER}}', ver)
dj = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = read('index.tpl.html').replace('{{CSS}}', read('app.css')).replace('{{DATA}}', dj).replace('{{JS}}', js)
out = os.path.join(base, '..', 'index.html')
open(out, 'w', encoding='utf-8').write(html)
nq = sum(len(p['q']) for p in data['procs'])
print('index.html', len(html.encode('utf-8')), 'B ·', len(data['areas']), 'obszarów ·', len(data['procs']), 'procesów ·', nq, 'pytań · wersja', ver)
# kontrola składni JS (jeśli dostępny Node.js)
try:
    chk = os.path.join(base, '.check.js'); open(chk, 'w', encoding='utf-8').write(js)
    r = subprocess.run(['node', '--check', chk], capture_output=True, text=True); os.remove(chk)
    if r.returncode: print(r.stderr); sys.exit(1)
    print('składnia JS: OK')
except FileNotFoundError:
    pass
