# Źródła aplikacji

- `src/index.tpl.html` – szablon strony; `src/app.css` – style (jasny i ciemny motyw, druk wyników i raportu końcowego).
- Moduły JS składane w jedną funkcję w tej kolejności:
  - `src/icons.js` – ikony Phosphor duotone (wygenerowane z `@phosphor-icons/core` 2.1.1),
  - `src/core.js` – konfiguracja metody, stan, model analizy (obszary, procesy, wymagania, indeks dopasowania, luki krytyczne, pracochłonność, ryzyka, korzyści, business case), pola wymagane, braki, podpowiedzi ryzyk, propozycja rekomendacji, wspólna baza (z scalaniem zmian pole po polu) i wymiana plików JSON,
  - `src/ui.js` – komponenty: nagłówek z krokami, lista obszarów, pola formularzy, paski dopasowania, wykresy, mapa ryzyk, okna,
  - `src/steps.js` – strona startowa i kroki 1–7 (w tym tryb skupienia w ocenie fit-gap i wybór procesów key userów),
  - `src/doc.js` – raport końcowy oraz agenda i pytania dla uczestników obszaru,
  - `src/report.js` – raport Excel (ExcelJS),
  - `src/actions.js` – nawigacja i obsługa zdarzeń.
- `data.json` – parametry metody i katalogi: skala dopasowania, sposoby zamknięcia luk, priorytety, pracochłonność, skala zmiany, skale ryzyka, kategorie i ryzyka typowe, kategorie i katalog korzyści, progi rekomendacji, zespoły i role (rola zaczynająca się od „Key user” ma przypisane procesy), obszary, procesy i pytania z podpowiedziami.
- `build.py` – składa `index.html` w katalogu głównym i sprawdza spójność `data.json` oraz składnię JS (gdy dostępny jest Node.js): `python3 dev/build.py`.

Po zmianie kodu albo `data.json`: zbuduj, sprawdź stronę i wypchnij do `main` – Cloudflare Pages opublikuje ją automatycznie.
Klucze obszarów, procesów i pytań w `data.json` są zapisane w danych analiz – nie zmieniaj ich po rozpoczęciu analizy (treść pytań możesz poprawiać).
Interfejs zapisuje każdy obiekt jako osobny rekord (`an|analiza`, `ar|analiza|obszar`, `pr|analiza|proces`, `rq|analiza|wymaganie`, `os|analiza|osoba`, `rk|analiza|ryzyko`, `bn|analiza|korzyść`, `sg|analiza|podpowiedź`) – ten sam format obsługują `server/api.php` i `_worker.js`.
