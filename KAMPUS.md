# Kampus — ako to funguje a kam by to mohlo ísť

Vrstva k `2026-08-28`, keď vznikla stránka `/kampus`. `ROADMAP.md` je snímka
k `2026-08-27` a zostáva, ako je — toto je to, čo pribudlo navrch.

Nič z druhej polovice tohto dokumentu nie je sľub. Je to kontext, aby sa
nabudúce nezačínalo od nuly.

## Ako model funguje

Žiadny model sa nenačítava. Žiadny `.glb`, žiadny CAD, žiadny loader.

V `src/lib/kampus.ts` má každé podlažie **jeden obrys a jednu výšku**. Obrys je
zoznam rohov v metroch. Three.js ten plochý obrys vytiahne nahor o výšku
podlažia (`ExtrudeGeometry`) a to je celá doska. Dvadsaťsedem dosiek.

```ts
const SKOLA_TRAKT: Point[] = [
  [0, 0], [58.5, 0], [58.5, 17.5], [0, 17.5],
];

level(2, SKOLA_TRAKT)   // 2NP: tento obrys, kóta 6,0 → 9,0
```

Dôsledok: **pridať geometriu neznamená modelovať, znamená pridať riadky.**

Budova nemá časti. Má podlažia. To, čomu sa hovorí telocvičňa, nie je objekt
navyše — je to dôvod, prečo je obrys internátu po 1NP dlhší. Rovnako školské
krídlo končí na 1NP a od 2NP zostane z pôdorysu len trakt.

## Overená geometria

Zdrojové výkresy (kótované pôdorysy a axonometrie zo SketchUpu) boli po prepise
zmazané — repozitár je verejný. Čísla sú overené proti kótam a plochám a žijú
už len tu a v `kampus.ts`.

Počiatok = ľavý dolný roh školského traktu. X doprava, Y hore v pôdoryse, metre.

| objekt | X | Y |
| --- | --- | --- |
| škola — trakt | 0 → 58,5 | 0 → 17,5 |
| škola — krídlo (vstup na juhu) | 46,5 → 64,0 | −6,8 → 58,2 |
| krčok | −23,0 → 0 | 6,9 → 10,6 |
| telocvičňa | −38,0 → −23,0 | 0 → 33,0 |
| internát — zvislé rameno | −38,0 → −23,0 | −11,7 → 0 |
| internát — pozdĺžny trakt | −94,0 → −23,0 | −28,5 → −11,7 |

Výšky, spoločné pre všetky budovy:

| podlažie | −1 | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od → do | −2,5 → 0 | 0 → 3 | 3 → 6 | 6 → 9 | 9 → 12 | 12 → 15 | 15 → 18 |

Obsadenie: škola-trakt `−1…5` (5NP ustúpené o 1,5 m po obvode) · škola-krídlo
`−1…1` · krčok `−1…0` · telocvičňa `−1…1` · internát `−1…4`.

Kontrolné plochy: 2NP školy `1024 m²`, 5NP `805 m²`, krčok `85 m²`.

Dve čísla boli odvodené, nie odčítané, a Patrik ich potvrdil: krčok je
centrovaný na hĺbku traktu (`6,9 / 3,7 / 6,9`) a 5NP je ustúpené presne o tú
vnútornú čiaru z okótovaného pôdorysu.

Zjednodušenie, o ktorom vieme: podzemie má všade 2,5 m. V skutočnosti
telocvičňa podpivničená nie je. Pre pilot to nevadí.

## Čo model dnes vie

Otáčanie, zoom, posun aj na dotyk. Prepínač škola / internát / kampus,
prepnutie preletí kamerou. Sám sa pomaly otáča, kým naň človek nesiahne.
Hover po podlažiach v škole. 2NP je plný atrament, lebo je to jediné podlažie,
na ktoré ukazuje nejaká zóna.

Žiadna nová farba a žiadne obrysové čiary — v pokoji je budova jedna súvislá
hmota, podlažie sa objaví až pod kurzorom.

## Nápady, zoradené podľa toho, či nesú informáciu

### Nesie informáciu

1. **Intenzita atramentu podľa počtu hlásení.** Podlažie s desiatimi
   hláseniami je plný atrament, s jedným bledý. Žiadna nová farba, len sila
   tej istej.
2. **Pulz na nezodpovedaných.** Podlažie, kde leží hlásenie, ktoré nikto
   nevzal, veľmi pomaly dýcha; v momente, keď operátor odpovie, prestane. Je to
   téza Kriklúna preložená do 3D — *nejde o opravu, ide o odpoveď*. Pohyb tam
   nie je ozdoba, ale význam. **Toto je z celého zoznamu prvé na rade.**
3. **Rez pri výbere.** Klik na podlažie, tie nad ním sa nadvihnú a stlmia. Je
   to tá medzera medzi doskami, ktorú sme zámerne zrušili — ale ako prechod,
   nie ako pokojový stav.
4. **Časová os** cez posledných 30 dní. Rozlíši „chronicky pokazené poschodie"
   od „mali jeden zlý týždeň".
5. **Bodky hlásení v priestore.** Tu sa model prestáva byť diagramom a stáva sa
   mapou. Vyžaduje súradnice zón, pozri *Strop*.

### Lacné a zlepší čitateľnosť

6. **Kontaktný tieň / ambient occlusion.** Pri bielom hmotovom modeli
   jednoznačne najväčší vizuálny skok za najmenej práce.
7. **Obrys len na tom, čo je pod kurzorom.** Trvalé obrysy sme zrušili správne,
   ale ostrá hrana na jedinom zvýraznenom podlaží by výber zostrila.
8. **Hmla vo farbe pozadia.** Tá 158-metrová placka tým dostane hĺbku.

### Čo sme zavrhli a prečo

- **Bloom** — potrebuje svietiace veci na tmavom podklade. Kriklún je biely
  papier. Bloom okolo čiernej dosky je sivá šmuha a celý postprocessing pass
  za nulovú informáciu.
- **Textúry (tehla, sklo, betón)** — sila modelu je v tom, že je abstraktný.
  Tehla sľúbi budovu a v tej sekunde si každý všimne, že nemá okná ani dvere.
  Z dobrého diagramu sa stane zlý model.
- **Slnečné tiene** — potrebujú terén, okolie a odpoveď na „o ktorej hodine".
  Bez kontextu vyzerajú ako chyba.

## Strop: zóny sú reťazce

Nie je v three.js. Je v tom, že `zones.ts` drží desať reťazcov bez súradníc a
bez podlažia. **Model pozná poschodia, ale nepozná miesta.**

V deň, keď zóna dostane `{ budova, podlažie, x, y }`, sa otvorí bod 1, 2 aj 5
naraz. Je to tá istá natvrdo písaná tabuľka ako dnes, pár riadkov na zónu.
Žiadny admin, žiadna migrácia.

**Ak sa má urobiť jedna vec, tak táto.** Vizuálne sa ňou nezmení nič.

## Komunikačné jadrá

Jadro je len ďalší obrys, ale vytiahnutý raz od −2,5 po 18,0 namiesto siedmich
dosiek. Jeden riadok dát, jedna vlastná farba. Potrebné vstupy: polohy a
rozmery dvoch schodísk a výťahu — tri obdĺžniky, zhruba desať čísel — a po
ktoré podlažie idú.

**Sklo je pasca.** Priehľadnosť vo WebGL nemá riešené poradie: kreslí sa odzadu
dopredu podľa vzdialenosti a pri tridsiatich vnorených kvádroch to začne miešať.
Keďže sa model sám otáča, tie artefakty by pulzovali.

Riešenie, ktoré odporúčame: **nerobiť sklo, ale klietku.** Budova sa zmení na
drôtený obrys — len vlasové hrany, žiadna výplň — a jadro ostane plnou hmotou.
Číta sa to ako „vidím cez steny", je to čistý architektonický jazyk, sedí do
čiernobielej a problém s poradím vôbec nevznikne.

## Rozdelenie 2NP na miestnosti

Interakcia je z veľkej časti napísaná — miestnosť je len ďalšia doska, hover a
klik už existujú, a „vysunutie hornej časti" je tá istá funkcia zmäkčenia, akú
používa prelet kamery. **Celá cena sedí v geometrii:** 11 ateliérov + 2 chodby
+ WC M + WC Ž + 2 schodiská + výťah + sprcha + umyváreň ≈ 20 obrysov.

### Ak je zdroj ArchiCAD alebo Revit

**Pošli IFC toho jedného podlažia a preskoč zvyšok tejto sekcie.** Každý
`IfcSpace` nesie meno, obrys aj podlažie — odpadá vrstva s popismi, počiatok
aj jednotky. O triedu lepší vstup a práca navyše nulová.

### Ak je zdroj čistý CAD

**DXF, nie DWG.** DWG je uzavretý binárny formát a potrebuje knižnicu. DXF je
obyčajný text a prečíta sa priamo.

Tri vrstvy, **nie jedna na miestnosť** — bolo by ich dvadsať a meno vrstvy by sa
stalo dátami:

| vrstva | obsah |
| --- | --- |
| `MIESTNOSTI` | uzavreté polyliny, jedna na miestnosť, všetky spolu |
| `POPIS` | jeden text vnútri každej polyliny (`ateliér 5`, `WC Ž`, `výťah`…) |
| `OBRYS` | obrys celého traktu 2NP, jedna polylina |

Meno nesie ten text — skript spraví point-in-polygon. Popis musí ležať **vnútri**
miestnosti; pri MTEXTe je vzťažný bod roh rámu, takže dlhý presahujúci popis by
ušiel.

`OBRYS` rieši dve veci naraz. Jeho ľavý dolný roh je počiatok modelu, takže
netreba nič presúvať. A zároveň povie jednotky: ak vyjde široký `58500`, sú to
milimetre, ak `58,5`, metre.

Pravidlá na polyliny: uzavreté (nie čiary, ktoré sa len opticky stretávajú);
kresliť **vnútornú hranu** miestnosti, nie osi stien (je to použiteľný priestor,
presne to, čo je `IfcSpace`, a miestnosti sa nebudú prekrývať); žiadne oblúky,
splajny, šrafy ani bloky; **len 2NP**, jeden súbor, jedno podlažie.

Schodiská, výťah, chodby aj WC sú len ďalšie miestnosti na tej istej vrstve.
Ktoré sa majú vykresliť iným odtieňom, sa označí podľa mena.

Späť príde TypeScript priamo do dátového súboru plus tabuľka plôch v m² na
kontrolu — súčet miestností musí sedieť s `1024 m²`.

Skript (zhruba päťdesiat riadkov, jednorazový) sa napíše, až keď súbor bude
existovať. Písať parser proti predstave výkresu nemá zmysel.

## Dve otvorené otázky, ktoré nie sú technické

**Miestnosti sú zóny.** Tých dvadsať obrysov je skoro presne dnešný zoznam v
`zones.ts`. Boli by to dva zoznamy toho istého, ktoré sa časom rozídu. Malo by
to byť jedno miesto, kde zóna má meno, obrys aj podlažie.

**„Môj ateliér" je jedenásť rôznych miestností.** Dnes je to jedna zóna, lebo to
nikto nepotreboval rozlíšiť. Ak sa ateliéry stanú klikateľnými kvádrikmi, musia
dostať mená — a to znamená, že ľudia začnú hlásiť po miestnostiach a operátor
ich tak uvidí. To je zmena produktu, nie grafiky.

## Napätie s tým, čo sme sľúbili

`README.md` aj `ROADMAP.md` hovoria: **žiadny pôdorys, žiadny register prvkov
budovy.** Hmotový model sedem kvádrov to neporušuje — je to diagram, nie pôdorys.

Rozdelenie 2NP na dvadsať pomenovaných miestností už áno. V tej chvíli je to
pôdorys aj register a je to presne to, čo Kastelan sľuboval vedeniu budovy
a Kriklún zámerne nie.

Neznamená to, že sa to nesmie. Znamená to, že sa to nesmie stať nechtiac —
a že ak sa to urobí, prepíše sa aj ten sľub, nahlas a naraz s tým.
