# Changelog — Kriklún

Formát: `Added`, `Changed`, `Fixed`, `Notes`.
Prehľad zámeru je v `README.md`.

Beží na `https://kriklun.com`.

## [0.2.3] — 2026-08-27

Karta hlásenia bola jeden odsek, hoci sú v nej dvaja hovoriaci. Podpis autora
stál pod odpoveďou operátora, takže to čítalo tak, že si autor odpovedá sám.

### Changed
- Podpis autora sa presunul nad text, do hlavičky ku zóne: `patrik · WC M`.
  Tým zmizne zámena, kto čo povedal.
- Odpoveď operátora je samostatný blok za vlasovou linkou, s vlastným časom
  (`updated_at`) a s vlastným podpisom `operátor`. Bodka stavu sa presunula
  z hlavičky sem — bodka *je* tá reakcia.
- Linka nad odpoveďou je zapustená zľava a bodka visí vedľa nej. Keby siahala
  cez celú šírku, čítala by sa rovnako ako linka medzi kartami a odpoveď by
  vyzerala ako ďalšie hlásenie namiesto reakcie na to nad ňou.
- Pätička nesie už len akcie čitateľa (`aj mňa`, zvonček, `zmazať`).
- Operátorská fronta má rovnakú hlavičku: `patrik · WC M · +3` a `otvorené 4h`.
  Duplicitný riadok s autorom pod textom zmizol.

### Added
- Keď odpoveď ešte neprišla, blok to povie nahlas: `zatiaľ bez odpovede`.
  Prázdne miesto je na tejto karte tá najdôležitejšia informácia, tak nemá byť
  prázdne, ale pomenované.

### Notes
- Formát času sa **nemenil**. `4h` a `2d` zostávajú, lebo relatívny vek je tlak,
  kým dátum je archív — čitateľ by si musel rozdiel odpočítať sám. Presný čas
  nahlásenia je stále v databáze, keby bol raz potrebný ako dôkaz.
- Dva bloky sú strop, nie začiatok vlákna. Vo chvíli, keď pod fotkou pribudne
  piata replika, je z Kriklúna Facebook — čiže presne to, čo nahrádza.

## [0.2.2] — 2026-08-27

Prvý deň naostro ukázal dve diery: nedá sa opraviť vlastný omyl a nedá sa
odstrániť obsah, ktorý tam nepatrí.

### Added
- Mazanie hlásenia. Tlačidlo `zmazať` je na karte na nástenke aj v denníčku,
  ale vidí ho len ten, kto má v prehliadači uložený operátorský pin. Právo
  overuje server, `DELETE /api/reports/[id]` s tým istým pinom ako zmena stavu.
- `deleteReport()` maže aj zvončeky a fotku v úložisku. Bucket je verejný, takže
  samotné zmazanie riadku by URL fotky nechalo živú — a pri obsahu, ktorý tam
  nemá byť, je práve fotka to podstatné.

### Changed
- Fotky sa zobrazujú štvorcovo (`aspect-square`, orezanie na stred). Nástenka má
  tým rovnaký rytmus kariet bez ohľadu na to, či niekto fotil na výšku alebo na
  šírku. Orezanie je len v zobrazení, v úložisku zostáva celá fotka.

### Notes
- Mazanie je natvrdo, bez koša. Pri pilote na jednom poschodí je jednoduchosť
  cennejšia než história — kôš by znamenal ďalší stĺpec, ďalší filter a ďalšiu
  obrazovku, kde ho vysypať.
- Je to dočasné riešenie moderácie. Kým nie sú účty, drží ho jediný pin, ktorý
  pozná operátor. Kto pin má, vie zmazať čokoľvek.

## [0.2.1] — 2026-08-27

Prvé ostré nasadenie. Databáza, úložisko fotiek, doména aj maily overené
proti produkcii, nie len lokálne.

### Added
- Nasadenie na Vercel napojené na GitHub. Push do `main` spustí produkčný build.
- Doména `kriklun.com`.

### Notes
- Vercel na Hobby pláne odmietne buildovať commit, ktorého autora nevie priradiť
  ku GitHub účtu. Mail v `git config user.email` sa musí presne zhodovať
  s adresou registrovanou na GitHube — Gmail ignoruje bodky v adrese, GitHub nie.
- **Ak heslo obsahuje `#`, musí byť v `.env` v úvodzovkách.** Neuvedený `#` sa
  berie ako začiatok komentára a hodnota sa ticho useknie. Prejaví sa to ako
  `535 authentication failed`, pričom `transporter.verify()` môže prejsť.
  Vo Verceli sa naopak úvodzovky nepíšu — hodnota sa ukladá surová.
- Operátorská rola zatiaľ nie je odovzdaná. `NOTIFY_EMAIL` je nastavený na autora
  projektu; keď rolu prevezme niekto z prevádzky, mení sa len táto premenná.

## [0.2.0] — 2026-08-27

### Added
- Zvonček: pri každom probléme sa dá prihlásiť na mailovú notifikáciu o zmene
  stavu. Mail sa napíše raz a zapamätá si ho prehliadač, žiadny účet.
  Odhlásenie je odkaz priamo v správe.
- Nepovinné mailové pole vo formulári — kto ho vyplní, sleduje svoje hlásenie
  automaticky.
- Tabuľka `watchers` a migrácia `supabase-002-watchers.sql`.
- `/info`: sekcia o zvončeku, odkazy na mail a na repozitár.

### Changed
- Odosielanie mailov prepísané z Resendu na SMTP (`nodemailer`), aby sa dala
  použiť vlastná schránka na doméne. Port 465 aj 587.
- Aplikácia má vlastný repozitár oddelený od projektových dokumentov.
  V repozitári nie sú žiadne osobné údaje — hlásenia, fotky a mailové adresy
  žijú v databáze.
- README prepísaný tak, aby stál samostatne.

### Fixed
- Zlyhanie notifikácie zhodilo celú zmenu stavu. Notifikácie sú teraz zabalené
  tak, že výpadok mailu nezablokuje zápis hlásenia ani zmenu stavu.

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
