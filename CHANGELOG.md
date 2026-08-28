# Changelog — Kriklún

Formát: `Added`, `Changed`, `Fixed`, `Notes`.
Prehľad zámeru je v `README.md`.

Beží na `https://kriklun.com`.

## [0.3.0] — 2026-08-28

Kriklun pocuva na jedinej chodbe jednej budovy a nikde to nebolo vidiet. Kto
pride prvykrat, netusi, ci je jeho poschodie vnutri alebo mimo. `/kampus` je
odpoved: hmota oboch budov, v ktorej svieti jedine podlazie, na ktore sa dnes
da hlasit. Nie je to ozdoba, je to odpoved na najcastejsiu prvu otazku.

### Added
- `/kampus` — model kampusa (three.js + react-three-fiber). Ortograficka
  kamera, otacanie, zoom a posun aj na dotyk. Prepinac ma tri stavy: skola,
  internat, kampus. Prepnutie preleti kamerou na uhol, ktory tomu stavu sedi:
  na budovu nizsie, na cely kampus vyssie.
- Default je skola, nie kampus. Cely kampus je 158 x 87 m pri vyske 20,5 —
  to je placka. Samotna skola je 64 x 65 pri 20,5, zhruba 3:1, a cita sa
  normalne. Navyse hlasenia su v nej.
- Tretia ikona v hlavicke vedie na `/kampus`. Zajac zostal uplne vpravo — je
  jediny z tych troch, na ktory clovek chodi opakovane, a pravy okraj je na
  telefone najlepsie dosiahnutelny palcom.
- `src/lib/kampus.ts` — geometria ako data, nie ako model. Budova nema casti,
  ma podlazia, a podlazie je jeden obrys a jedna vyska. Ziadny .glb, ziadny
  CAD, ziadny loader. Telocvicna nie je objekt navyse, je to dovod, preco je
  obrys internatu po 1NP dlhsi.

### Notes
- Model je zhruba 233 kB gzip a nacita sa az na `/kampus` (`ssr: false`,
  vlastny chunk). Cesta k nahlaseniu problemu o nom nevie.
- Ziadna nova farba. Aktivne podlazie je plny atrament, zvysok bleda seda —
  pravidlo z `globals.css` (farbu nesie jedine stav hlasenia) plati aj tu.
  Az sa budu podlazia farbit podla poctu hlaseni, bude to sila toho isteho
  atramentu, nie novy odtien.
- Ziadne obrysove ciary a ziadne medzery medzi doskami. V pokoji je budova
  jedna suvisla hmota; podlazie sa objavi az pod kurzorom a zase zmizne.
- Interaktivna je zatial len skola. Internat a krcok sa daju obzriet, ale
  nereaguju — nevedie k nim ziadna zona. Krcok sa ukaze len v pohlade
  `kampus`: v pohlade na skolu by z nej trcal 23 metrov dlhy pahyl do prazdna.

## [0.2.10] — 2026-08-28

Prvy ostry oznam („sme online!") dostal kliky na `aj mňa to trápi`. Ludia
nemali co ine stlacit, tak stlacili to, co tam bolo — a povedali tym vetu,
ktora na oznam nesadne. Chyba nebola v nich. Karta oznamu bola dovtedy karta
hlasenia, z ktorej sa odobrali casti: bez bodky, bez zvonceka, bez odpovede —
ale s odsadenim po chybajucej bodke a so stitkom `oznam · ` pred menom, ktory
mal to chybanie vysvetlit. Oznam ma odteraz vlastny tvar, nie tvar hlasenia
bez casti.

### Changed
- `aj mňa to trápi` na ozname uz nie je. To cislo nikdy nebolo hlas, bolo to
  poradie vo fronte: hovori operatorovi, ktora pokazena vec pali poschodie
  najviac. Oznamy sa do operatorskej fronty nedostanu — filtruje ich hned
  prvy riadok `/operator` — takze na ozname to cislo nema kto precitat.
  Cislo, ktore nikto necita, uz nie je signal, ale pacik. Z rovnakeho dovodu
  tam nie je zvoncek: nie je co sledovat, ked nie je stav.
- Stitok `oznam · ` pred menom autora je prec. Bodkovy retazec v hlavicke je
  zoznam rovnocennych faktov o veci (`kto · kde`); druh zaznamu medzi ne
  nepatri a stal tam prvy — pred tym, kto hovori.
- Podpis oznamu ide pod rec, nie nad nu: `patrik oznamuje · chodba 2NP ·
  platí do 30. 8.` Na hlaseni je hlavicka navigacia — co je pokazene a kde,
  este nez zacnes citat. Oznam nikto neriesi, tak je jeho obsahom sama veta
  a podpis je poznamka pod nou. Sloveso `oznamuje` robi to, co robil stitok,
  len bez stitku.
- Namiesto veku stoji v podpise platnost, ked ju oznam ma. Vpravo zarovnany
  cas na hlaseni znamena „tolkoto sa nan nikto nepozrel" — na ozname sa nema
  co zanedbat. Hlasenie starne, oznam odpocitava. Bez datumu ostava vek.
- Text oznamu uz nie je odsadeny. Odsadenie vyrabala bodka stavu a od 0.2.4
  sme ho drzali kvoli jednej lavej hrane textu na nastenke; lenze prazdny
  stlpec po bodke sa necital ako iny druh zaznamu, ale ako bodka, ktora sa
  nenacitala. Rovna hrana bola kupena dierou. Oznam odteraz zo stlpca bodiek
  vystupuje zamerne — a prave to je ten signal.
- Paticka sa na ozname nevykresluje vobec, uz nie je prazdna. Operatorovi
  v nej ostava `zmazať`.

### Fixed
- `platí do 30. 8.` teraz naozaj znamena vratane 30. 8. Holy datum z pola sa
  parsoval ako polnoc v UTC, takze oznam mizol na zaciatku toho dna. Dokial
  sa platnost nikde nezobrazovala, bol to len posun o den; odkedy ju karta
  hovori nahlas, bola by to nepravda.

### Notes
- Uz nazbierane `plus_ones` na oznamoch ostavaju v databaze, len ich nema kto
  zobrazit. Nic sa nemaze.
- `/info` v sekcii `aj mňa` hovori, preco to na oznamoch nie je. Sekcia uz
  predtym tvrdila „nie je to pacik" — na ozname to prestavalo byt pravda.

## [0.2.9] — 2026-08-28

Odpoved operatora sa zlievala s hlasenim pod nou. Nebolo to tym, ze by bola
prislabo oznacena — bolo to tym, ze mala presne tvar zaciatku novej karty:
vodorovna vlasova linka nad sebou, mala ikona vlavo, cas zarovnany doprava.
Tri signaly, ktore v tejto appke znamenaju „tu zacina nova polozka", pouzite
na veci, ktora je reakciou na tu predchadzajucu.

### Changed
- Odpoved uz nema vlastnu vodorovnu linku. Vodorovna linka odteraz znamena
  v celej appke jedinu vec: tu zacina nova karta.
- Namiesto nej je konektor `└─`. Visi na lavej hrane karty, kde uz stoji
  vsetko sluzobne — hlavicka aj paticka — a text odpovede zacina v tom istom
  stlpci ako text hlasenia. Rec pod recou, sluzobne veci vedla.
- Ikonu cigarety nahradil podpis `operátor:`. Ikona bola hadanka; slovo nie.
- Stav a dovod su jedna veta, jedno pismo, jedna farba: `operátor: teraz to
  nejde. Náhradný diel príde o tri týždne.` Predtym bol stav plnou farbou na
  prvom riadku a dovod sedy na druhom — co je tvrdenie, ze dovod je vedlajsi.
  Pri stave `teraz to nejde` je dovod cela odpoved.
- Cas ide na koniec vety, uz nie doprava. Prave ten vpravo zarovnany cas mal
  rovnaky tvar ako cas v hlavicke karty.
- Odstup nad odpovedou je z `28px` na `12px`. Predtym bola odpoved priblizne
  rovnako daleko od hlasenia, na ktore odpoveda, ako od cudzej karty pod nou.
- Riadok pod menom `KRIKLUN` zije v `Wordmark`, nie na kazdej stranke zvlast.
  Claim na nastenke, `denníček — meno` v `moje`, veta o com to je v `info` —
  vsetky odteraz sedia rovnako vysoko. Predtym bol claim `8px` pod logom
  a ostatne `20px`.

### Notes
- `zatiaľ bez odpovede` ostava bez podpisu `operátor:`. Operator este
  nepovedal nic, tak sa pod to nema kto podpisat.
- `src/components/ui/cigarette.tsx` je zmazany, uz ho nema kto volat.

## [0.2.8] — 2026-08-28

Dole stali tri rovnako hlasne odkazy vedla seba a nahlasenie — jediny dovod,
preco appka existuje — bolo jednou tretinou listy. Kto pride k rozbitej
sprche, ma vidiet jedno tlacidlo, nie menu.

### Changed
- Dole je uz len nahlasenie. Jedna invertovana plocha cez celu sirku, s
  pixelovou ikonou fotoaparatu a textom `nahlásiť problém`. Je to jediné
  miesto v appke, kde je pozadie a text naopak — plna plocha odteraz znamena
  jedinu vec: toto odosle.
- Odosielacie tlacidlo vo formulari je invertovane rovnako. Inak by cesta
  koncila tichsie, nez zacala.
- Nastenka je na mene `KRIKLUN` v hlavicke. Bolo tam odjakziva, len to
  prekryvala lista.
- `moje` a `info` su ikony vpravo hore. Kluc uz nie je easter egg vedla loga —
  stoji vpravo ako otvoreny odkaz, vedla neho zajac z klobuka na `moje`.
- Na `/nahlasit` sa spodne tlacidlo skryva. Ukazovalo by na stranku, na ktorej
  uz stojis, a nad odosielacim tlacidlom by sa dalo pomylit s nim.

### Notes
- Ikony su pixelove (Streamline), rovnaka rec ako wordmark. Zdrojove `.svg`
  maju farbu zapecatenu na cierno, tak ich nesieme ako cesty vo `currentColor`
  v `src/components/ui/pixel.tsx` — inak by v tmavom mode zmizli. Povodne
  `.svg` lezia v `assets/icons/` ako zdroj; appka ich necita.
- Animovany `WrenchIcon` na `motion` sme zmazali, uz ho nema kto volat.

## [0.2.7] — 2026-08-27

`www.kriklun.com` končilo na varovaní prehliadača. DNS síce ukazovalo na Vercel,
ale certifikát bol vystavený len na apex, lebo `www` nebolo pridané v projekte.
Odkaz s `www` by teda posadil suseda na červenú stránku „Vaše pripojenie nie je
súkromné" — a to pri nástroji, kde je prvý dojem celá adopcia.

### Fixed
- `www` je pridané v projekte na Verceli, takže má certifikát.
- `www` presmerúva na apex (308). Jedna appka, jedna adresa. Pravidlo je
  napísané bez mena domény, nech platí aj keby sa raz zmenila.

## [0.2.6] — 2026-08-27

Odkedy bodka stavu stojí pri texte a tvorí na nástenke stĺpec, dá sa nástenka
skenovať očami bez čítania. `Teraz to nejde` v tom stĺpci mizlo — bolo šedé,
čiže presne `--dim`, farba odmlčaného textu.

### Changed
- `teraz to nejde` je fialové: `#6e56cf` v svetlom, `#8b78e6` v tmavom režime.
  Červená – oranžová – zelená je jedna os: nikto sa na to nepozrel, už sa to
  hýbe, hotovo. `Teraz to nejde` na tej osi neleží — vec je stále pokazená, len
  sa odložila — tak má vlastný odtieň mimo nej.

### Notes
- Modrá bola druhý kandidát a vypadla z dvoch dôvodov. Svieti viac než červená
  (kontrast 7.52 : 7.24 na čiernej), takže odložené hlásenie by kričalo hlasnejšie
  než to, na ktoré sa ešte nikto nepozrel. A modrá v rozhraní znamená „informácia"
  — čo tento stav podceňuje. Nie je to poznámka, vec je stále pokazená.
- Fialová sedí aj pri farbosleposti: pri deuteranopii a protanopii, ktoré sú
  zďaleka najčastejšie, sa červená so zelenou zbiehajú, ale fialová ostáva
  oddelená od oboch.

## [0.2.5] — 2026-08-27

Fronta bola jednosmerná. Keď operátor kartu raz odpovedal, zmizla mu z očí —
aj keď sa `teraz to nejde` medzitým stalo `hotové`. Odpoveď sa dá zmýliť a
svet sa medzitým zmení, tak musí existovať cesta späť.

### Fixed
- Operátor sa vie prepnúť medzi `fronta` a `všetko`. `fronta` ostáva úzka a
  nemenná: čo dostalo odpoveď, sa do nej nevracia. `všetko` ukáže všetky
  hlásenia vrátane odpovedaných, takže sa stav dá zmeniť aj dodatočne.
  Serveru to vadilo nikdy — blokoval to len filter na klientovi.
- V režime `všetko` sa radí podľa dátumu nahlásenia, nie podľa stavu. Keby sa
  radilo podľa stavu, karta by po zmene odskočila inam a operátor by sa zrazu
  pozeral na cudziu vec.
- Operátor vidí pri karte dôvod, ktorý na ňu sám napísal. Bez toho by v režime
  `všetko` prepisoval vlastnú odpoveď naslepo.
- Rozpísaná poznámka sa už neprenáša na ďalšiu kartu. Patrí hláseniu, nie
  obrazovke — inak sa dôvod priradil k cudziemu problému.

### Changed
- `← späť` a `preskočiť →` sú `← predchádzajúce` a `nasledujúce →`. `späť`
  vyzeralo ako návrat z obrazovky a `preskočiť` ako rozhodnutie kartu obísť,
  hoci oboje je len listovanie.
- `aj mňa` je `aj mňa to trápi` — veta, ktorou sa človek pridáva, nie štítok.
  Po kliknutí sa zmení na `✓ aj mňa + 4`: v tom čísle už je klikajúci
  započítaný, tak číslo znamená „a ešte toľkoto ďalších".

## [0.2.4] — 2026-08-27

Karta mala od 0.2.3 dva hlasy, ale pätička s `aj mňa` a zvončekom stála pod
odpoveďou operátora — čiže akcie čitateľa vyzerali ako súčasť odpovede.
A bodka stavu visela pri operátorovi, hoci hovorí o veci, nie o ňom.

### Changed
- Bodka stavu sa presunula z odpovede pred text hlásenia. Hovorí tým „táto vec
  je v stave X", nie „operátor povedal X". Na nástenke z toho vznikne jeden
  čitateľný stĺpec bodiek po ľavej hrane textov — dá sa skenovať bez čítania.
  Visí v ľavom stĺpci, nie inline, aby druhý riadok textu začal tam, čo prvý.
  Keď hlásenie nemá text (holá fotka), bodka sa vráti do hlavičky.
- Pätička sa presunula spod odpovede pod text hlásenia, kam patrí. Odpoveď
  operátora je teraz posledná a je jasne oddelená — 28 px nad linkou proti
  16 px pod textom.
- Podpis `operátor` nahradila ikonka cigarety, ktorá visí na ľavom konci
  zapustenej linky. Ostáva neutrálna: nikdy nedostane farbu stavu a animuje sa
  len na hover, aby nesúťažila s bodkou o pozornosť.
- `oznam` nemá stav, tak nemá ani bodku — odsadenie textu si však necháva, aby
  nástenka mala jednu ľavú hranu textu.

### Added
- Fotka dostane na hover rámik vo farbe stavu (dve vlásočnice, druhá zvnútra,
  aby sa mriežka neposunula). Je to zosilnenie, nie nosič — na dotykovom
  displeji hover neexistuje, tak farbu nesie bodka pri texte.

### Fixed
- Pod textom hlásenia chýbal vzduch, linka odpovede naň nadväzovala natesno.
  Na `/operator` tá medzera bola, na nástenke vypadla.

### Notes
- `package.json` bol na `0.2.1`, hoci changelog bol na `0.2.3`. Zrovnané
  na `0.2.4`.

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
