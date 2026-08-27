# Changelog — Kriklún

Formát: `Added`, `Changed`, `Fixed`, `Notes`.
Prehľad zámeru je v `README.md`.

## [0.1.3] — 2026-08-27

### Added
- `/info`: sekcia `zatiaľ len naša chodba` — Kriklún beží pre 2NP, jedenásť
  ateliérov, zóny sedia len na naše poschodie. Vysvetlené, že prístup vznikol
  zdola a ďalšie priestory pribudnú, až keď sa to tu osvedčí.
- `/info`: sekcia `našiel si chybu v appke` — chyby softvéru nepatria na nástenku,
  patria na mail alebo do GitHub issues.
- `/info`: sekcia `chceš sa zapojiť` — prečo je repozitár súkromný a ako sa dá
  získať prístup.

### Changed
- `/info`: `dve pravidlá` rozšírené na `ako sa tu správame`. Pribudlo, že toto nie
  je miesto na osobné spory ani na účtovanie s nadáciou, a že odpoveď je dobrá
  vôľa, nie záväzok.

### Fixed
- Operátorský pin už nemá uhádnuteľný fallback. Keď nie je nastavený
  `OPERATOR_PIN`, endpoint vráti `503` namiesto toho, aby prijal zabudnutý default.
  V produkcii by to znamenalo, že stavy vie meniť ktokoľvek.

## [0.1.2] — 2026-08-27

### Added
- Stránka `/info` — vysvetlenie v civilnom jazyku: čo to je, prečo to vzniklo,
  čo znamenajú farby, dve pravidlá a čo toto nie je. Nie je v navigácii,
  dá sa nájsť kliknutím na kľúčik pri wordmarku.
- Animovaný kľúčik (`lucide-animated` wrench) pred wordmarkom. Kľúčik vedie
  na `/info`, text `KRIKLUN` vedie na `/`.

### Changed
- Zóny: `chodba pred WC` nahradené `umyváreň`, pribudla `sprcha`,
  `bočné schodisko` premenované na `zadné schodisko`.
- Veľkosti písma zredukované z piatich na dve: 13 px na všetko a 22 px na wordmark.
  Hierarchiu drží farba, nie veľkosť. Tretia veľkosť (16 px vo vstupoch) nie je
  dizajnové rozhodnutie — pod 16 px Safari na iOS pri fokuse zoomuje stránku.
- Pixel font sa používa jedine na wordmark. Odznak `OZNAM` prepísaný na obyčajné
  sivé `oznam`, čím zmizol druhý font aj tretia veľkosť z tela stránky.
- Operátorská hlavička používa spoločný `Wordmark` so suffixom namiesto vlastného
  zlepenca.

### Notes
- Komponent kľúčika je prevzatý z registry `lucide-animated.com` doslovne,
  ale bez `shadcn init` — ten by prepísal `globals.css`. Pribudla závislosť
  `motion` a minimálne `lib/utils.ts` s `cn`.

## [0.1.1] — 2026-08-27

### Changed
- Zóny nahradené reálnymi miestami na poschodí: `chodba 2NP`, `chodba pred WC`,
  `WC Ž`, `WC M`, `hlavné schodisko`, `bočné schodisko`, `výťah`, `môj ateliér`, `iné`.
- `+1 · 1` premenované na `aj mňa · 3`. Pôvodný zápis nikto neprečítal správne.
  Po kliknutí sa zobrazí `✓ aj mňa` v plnej farbe.
- Záložka v spodnej navigácii premenovaná z `nahlásiť` na `pridať`, aby sa nebila
  s odosielacím tlačidlom formulára.
- Wordmark `KRIKLUN` je odkaz na `/` na každej obrazovke vrátane operátorskej.
- Viac vzduchu medzi filtrom a počtom otvorených na nástenke.

### Fixed
- Operátor: po kliknutí na stav nebolo vidieť žiadnu zmenu. Aktuálny stav je
  teraz označený inverzným tlačidlom s `✓`.
- Formulár: v režime `chcem niečo oznámiť` sa v spodnej časti obrazovky
  javili dve súperiace tlačidlá (`nahlásiť` z navigácie a `oznámiť` z formulára).
  Vyriešené premenovaním záložky.

## [0.1.0] — 2026-08-27

Prvá funkčná verzia. Next.js 16, React 19, Tailwind 4, Supabase.

### Added
- Nástenka `/` — otvorené hlásenia, vek každého, filter `všetko / problémy / oznamy`,
  prepínač `aj hotové`.
- Formulár `/nahlasit` — odfotiť, popísať, vybrať zónu, odoslať. Bez loginu.
- Denníček `/moje` — vlastné hlásenia a ich aktuálny stav.
- Operátorský režim `/operator` — fronta kariet, najstaršie neodpovedané hore,
  chránená pinom.
- Stavy `nahlásené → vidíme to → rieši sa → teraz to nejde → hotové`,
  pri `teraz to nejde` je dôvod povinný.
- Oznamy s nepovinnou platnosťou, po dátume sa prestanú zobrazovať.
- `+1` ako signál priority pre operátora, jeden na zariadenie.
- Nepovinná mailová notifikácia pri novom hlásení (Resend).
- Zmenšovanie fotiek v prehliadači na 1600 px / JPEG 0.82 pred odoslaním.
- `supabase.sql` — celá databáza, bucket na fotky a atomická funkcia `plus_one`.
- Lokálny fallback do `.data/reports.json`, keď nie sú nastavené Supabase kľúče.

### Notes
- Klient nikdy nesiaha na Supabase priamo, všetko ide cez `/api/*` so service role
  kľúčom. RLS je preto zapnuté a zámerne bez politík.
- Dizajn: čierna a biela podľa systému, Geist Mono, pixel wordmark.
  Farba existuje jedine na označenie stavu.
