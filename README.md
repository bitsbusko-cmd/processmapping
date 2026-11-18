# Analiza Fit-Gap ERP

**PL** · [EN](#english)

Narzędzie do analizy dopasowania (fit-gap) przy migracji ERP. Pierwsze zastosowanie: przeniesienie spółki CC z systemu Symfonia do Axapta (AX 2012) używanego w spółce CP. Analizę prowadzimy w formie wywiadów z ekspertami obu systemów i centrum usług księgowych (FSSC). Aplikacja prowadzi przez nie krok po kroku i na końcu daje raport, który odpowiada na cztery pytania: czy migracja jest wykonalna, jakie są ryzyka, jakie zmiany procesów musi wprowadzić CC i jaką wartość da przejście na wspólny system.

Punktem odniesienia jest **szablon AX w CP** – to, jak CP faktycznie pracuje w systemie, a nie standard producenta.

## Przebieg analizy

Przy pierwszym wejściu podajesz imię i nazwisko oraz rolę (zespół analizy, ekspert CC, ekspert CP, FSSC). Nowa analiza ma podpowiedziane spółki i systemy (CC · Symfonia → CP · Axapta (AX 2012)) i domyślnie zaczyna od procesów księgowych; pozostałe obszary trafiają na kolejny etap. Potem przechodzisz siedem kroków:

1. **Zakres i zespół** – dane analizy (sponsor, lider, cel i zakres, wariant terminu uruchomienia), osoby biorące udział (imię i nazwisko, SGID, firma, rola), obszary: w zakresie / kolejny etap / poza zakresem, eksperci obu stron i plan wywiadu. Dla każdego obszaru narzędzie przygotuje **zaproszenie do kalendarza (.ics)** i **agendę z pytaniami** do druku.
2. **Procesy AS-IS** – procesy z katalogu realizowane w CC i procesy specyficzne, właściciele po obu stronach, wolumen, częstotliwość, narzędzia, opis praktyki obu spółek i ocena, czy CC może pracować według standardu CP (wspólny standard / częściowo / specyfika CC).
3. **Wywiad fit-gap** – dla każdego pytania praktyka CC (Symfonia) i CP (AX) oraz ocena: Fit, Częściowe, Luka, N/D, Do wyjaśnienia. Przy lukach: sposób zamknięcia (konfiguracja AX, zmiana procesu w CC, rozwój AX, raport, integracja, migracja danych, obejście poza ERP) i priorytet MoSCoW. **Tryb skupienia** pokazuje jedno pytanie naraz – wygodny do prowadzenia wywiadu na wspólnym ekranie: klawisze 1–5 ustawiają ocenę, strzałki przechodzą między pytaniami, Ctrl+Enter w polu tekstowym przechodzi dalej. Ekspert CC i ekspert CP widzą swoją kolumnę wyróżnioną.
4. **Luki i zmiany** – rejestr luk z pracochłonnością (S/M/L/XL), opisem rozwiązania, odpowiedzialnym i decyzją (do decyzji / rozwiązanie przyjęte / wymaganie wycofane) oraz lista **zmian procesowych w CC**: co się zmienia, skala zmiany, kogo dotyczy, szkolenia, etap.
5. **Ryzyka** – rejestr ryzyk migracji (prawdopodobieństwo × wpływ 1–4, właściciel, działanie, termin). Podpowiedzi: ryzyka typowe dla tej migracji (m.in. AX 2012 bez wsparcia producenta, integracja z ARA MES, KSeF i JPK dla nowego podmiotu, termin uruchomienia), luki krytyczne i duże zmiany procesów.
6. **Wartość dodana** – katalog korzyści (wartość, pewność, horyzont, kwota rocznie, etaty) i szacunek nakładów: stawka, nakład bazowy, pracochłonność luk, koszty jednorazowe, roczne koszty Symfonii i AX, efekt roczny i prosty okres zwrotu.
7. **Wynik** – wskaźniki, propozycja rekomendacji wynikająca z danych, mapa dopasowania obszarów, luki według sposobu zamknięcia, mapa ryzyk, luki krytyczne, zmiany procesowe, pytania do wyjaśnienia, braki, **rekomendacja zespołu** (z uzasadnieniem, warunkami i następnymi krokami), potwierdzenie wyników przez ekspertów obszaru i zatwierdzenie przez sponsora.

Lista obszarów po lewej działa jak filtr we wszystkich krokach – wywiad z jednym obszarem przeprowadzisz do końca bez czekania na pozostałe. Pola oznaczone gwiazdką są wymagane – bez nich nie przejdziesz do kolejnego kroku; przycisk „Dalej” pokaże listę braków, a kliknięcie pozycji przenosi do pola (także w innym obszarze i w trybie skupienia).

## Metoda

- **Indeks dopasowania** – średnia ocen wymagań (Fit = 1, Częściowe = 0,5, Luka = 0) ważona priorytetem (Must ×3, Should ×2, Could ×1). „N/D”, „Do wyjaśnienia” i wymagania wycofane nie wchodzą do indeksu.
- **Luka krytyczna** – ocena „Luka”, priorytet Must i zamknięcie przez rozwój AX, integrację albo obejście poza ERP.
- **Propozycja rekomendacji** – *migracja rekomendowana*: indeks co najmniej 80%, brak luk krytycznych i krytycznych ryzyk bez działań; *możliwa pod warunkami*: indeks co najmniej 60% i najwyżej 5 luk krytycznych; w pozostałych przypadkach *niezalecana w obecnym kształcie*. Przy ocenie mniej niż 80% wymagań narzędzie nie proponuje rekomendacji. Ostateczną rekomendację wpisuje zespół analizy.
- **Pracochłonność** – S do 5, M 5–15, L 15–40, XL powyżej 40 osobodni (w szacunku 3, 10, 25 i 50 osobodni).

Wszystkie parametry i katalogi są w `dev/data.json`. Ustal je przed pierwszym wywiadem – zmiana skal w trakcie analizy zmienia interpretację zapisanych ocen.

## Katalog pytań

15 obszarów, 59 procesów, 183 pytania z podpowiedziami dla prowadzącego. Etap 1 – procesy księgowe obsługiwane przez FSSC: księga główna i zamknięcie (z raportowaniem), podatki (VAT, CIT, JPK, KSeF), banki i płatności, należności, zobowiązania (faktury zakupowe). Kolejne obszary: kontroling i koszty, kontrola kredytowa, zakupy, sprzedaż i obsługa klienta, magazyn, transport i logistyka, produkcja i jakość (w tym integracja z ARA MES), dane podstawowe i migracja, raportowanie i BI, integracje i utrzymanie. W aplikacji można dodać obszary, procesy i wymagania specyficzne dla CC.

## Raporty

- **Raport końcowy** (druk lub PDF, A4 pionowo): podsumowanie dla zarządu z rekomendacją i warunkami, zakres i metoda, wyniki według obszarów, rejestr luk, zmiany procesowe w CC, ryzyka, wartość dodana i szacunek nakładów, sprawy otwarte i następne kroki, akceptacja.
- **Agenda wywiadu** dla obszaru (druk) i **zaproszenie .ics** – bez adresów e-mail; uczestników dodajesz w Outlooku.
- **Raport Excel**: Podsumowanie, Zespół, Procesy AS-IS, Wymagania fit-gap, Rejestr luk, Zmiany procesowe CC, Ryzyka, Wartość dodana, Skale.

## Zapisywanie danych

- **Wersja lokalna** (plik `index.html` albo dowolny hosting statyczny): dane zapisują się w przeglądarce. Menu „…” → Zapisz dane do pliku tworzy plik JSON; druga osoba wczytuje go przez Wczytaj dane z pliku (nowsze wpisy zastępują starsze).
- **Wersja wieloosobowa**: wspólna baza dla wszystkich uczestników analizy – aplikacja sama wykrywa serwer, wysyła zmiany od razu i co 15 sekund pobiera zmiany innych osób. Każdy obiekt (analiza, obszar, proces, wymaganie, osoba, ryzyko, korzyść) to osobny rekord; nowszy zapis wygrywa, a usunięcie jest trwałe. Równoczesne zmiany różnych pól tego samego rekordu – np. odpowiedź eksperta CC i eksperta CP w tym samym pytaniu – są scalane pole po polu, więc żadna nie ginie.
  - Cloudflare Pages: [`_worker.js`](_worker.js) z bazą D1 i logowaniem przez Cloudflare Access albo hasłem zespołu – instrukcja niżej,
  - hosting z PHP: pliki z folderu [`server/`](server/) – instrukcja w [`server/WDROZENIE.txt`](server/WDROZENIE.txt).

## Wdrożenie na Cloudflare

Tak samo jak Businessimpact (BIA) i wd-data-mapping: projekt Pages połączony z tym repozytorium, baza D1 i Cloudflare Access. Każdy push do `main` publikuje nową wersję.

1. **Baza D1** – Storage & Databases → D1 SQL Database → Create database: nazwa `fitgap`, Data location → Specify jurisdiction → **EU** (jurysdykcję można ustawić tylko przy tworzeniu bazy). Tabela `fg_e` powstaje sama przy pierwszym zapisie.
2. **Projekt Pages** – Workers & Pages → Create application → Pages → Import an existing Git repository → to repozytorium (jeśli nie jest widoczne, dodaj je w uprawnieniach aplikacji Cloudflare na GitHubie). Production branch `main`, Framework preset `None`, Build command – puste, Build output directory `/` → Save and Deploy.
3. **Powiązanie z bazą** – projekt → Settings → Bindings → Add → D1 database: Variable name `DB`, baza `fitgap`.
4. **Cloudflare Access** – Zero Trust → Access controls → Applications → Create new application → Self-hosted and private: nazwa np. `Fit-Gap ERP`; hostname `<projekt>.pages.dev` i `*.<projekt>.pages.dev`; polityka **Allow** dla uczestników analizy (adresy, domena firmowa albo grupa) – metody logowania jak w BIA; po zapisaniu skopiuj Application Audience (AUD) Tag.
5. **Zmienne** – projekt → Settings → Variables and Secrets: `TEAM_DOMAIN` = `https://<zespół>.cloudflareaccess.com` (ten sam co w projektach BIA i wd-data-mapping), `POLICY_AUD` = skopiowany AUD Tag.
6. **Ponowne wdrożenie** – Deployments → ostatnie wdrożenie → Retry deployment (powiązanie i zmienne działają od następnego wdrożenia).
7. **Sprawdzenie** – po zalogowaniu `https://<projekt>.pages.dev/api.php?ping` zwraca `"app":"fitgap"`, `"configured":true`, `"db":true` i `"result":"ok"`; w nagłówku aplikacji widać „Wspólna baza”.

Bez Access zamiast `TEAM_DOMAIN` i `POLICY_AUD` można ustawić sekret `TEAM_KEY` (co najmniej 10 znaków) – aplikacja poprosi wtedy o hasło zespołu.

**Poufność i RODO.** Repozytorium nie zawiera danych z analiz – tylko metodę i katalog pytań. Narzędzie nie zbiera adresów e-mail: osoby opisuje imię i nazwisko oraz SGID (np. A1234566); zaproszenia .ics nie zawierają adresów. Wyniki analizy (luki, ryzyka, koszty) są informacją wewnętrzną: trzymaj je w przeglądarce lub na serwerze z ograniczonym dostępem, a pliki JSON i raporty chroń jak inne dokumenty projektu.

---

<a id="english"></a>
## English

A tool for running an ERP fit-gap analysis through interviews with experts of both systems – first used for moving company CC from Symfonia to Axapta (AX 2012) as used by company CP (UI in Polish). The reference point is CP's AX template, i.e. how CP actually works in the system. Seven steps: scope and team (people identified by name and SGID, areas in scope / next phase / out of scope, experts of both sides, interview planning with .ics invitations and printable interview guides); AS-IS processes; fit-gap interview (CC and CP practice per question, rating Fit / Partial / Gap / N/A / To clarify, gap resolution and MoSCoW priority, with a keyboard-driven focus mode); gap register and CC process changes; migration risk register with suggestions; added value and a simple business case; results with a data-driven recommendation proposal, the team's final recommendation, sign-offs, a printable final report and an Excel workbook. Data stays in the browser (JSON export/import) or, for teams, in a shared database on Cloudflare Pages with D1 and Cloudflare Access (`_worker.js`) or on PHP hosting (`server/`); concurrent edits of different fields of the same record are merged field by field. Method parameters and the question catalogue (15 areas, 59 processes, 183 questions) live in `dev/data.json`. The repository holds no analysis data and the tool stores no e-mail addresses.

## Biblioteki · Libraries

[ExcelJS](https://github.com/exceljs/exceljs) 4.4.0 (`vendor/exceljs.min.js`, MIT) · ikony / icons [Phosphor Icons](https://phosphoricons.com) 2.1.1 duotone (MIT, `vendor/LICENSE-phosphor-icons.txt`) · krój / typeface Atkinson Hyperlegible Next & Mono (`fonts/`, SIL OFL 1.1).
