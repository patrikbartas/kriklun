# Roadmap

Snímka k `2026-08-27`. Kriklún beží na jednom poschodí jednej budovy a zatiaľ
nemá dosť reálnych používateľov na to, aby sa dalo tvrdiť, že sa uchytil.
Preto je toto zámerne krátke: čo beží, čo je na rade, a čo zvažujeme bez toho,
aby sme to sľubovali.

## Beží

- Nahlásiť pokazenú vec fotkou a jednou vetou. Bez registrácie.
- Stavy `vidíme to`, `rieši sa`, `teraz to nejde`, `hotové`.
  Stav `teraz to nejde` má **povinný dôvod** — to je celý zmysel nástroja.
- Oznamy s platnosťou (`dnes vŕtam medzi 15:00 a 16:00`).
- Zvonček: mail, keď sa stav pohne. Žiadny účet, odhlásenie je odkaz v správe.
- `aj mňa` — počítadlo tých, ktorým tá istá vec vadí.
- Operátorská fronta chránená pinom, vrátane mazania obsahu.
- Karta je dialóg: hlásenie s podpisom autora, pod ním odpoveď s podpisom
  operátora. Keď odpoveď neprišla, karta to povie nahlas.

## Na rade

- **Táto roadmapa priamo v aplikácii**, na stránke `/info`, aby ju videl aj ten,
  kto nikdy neotvorí GitHub.
- **Odovzdanie operátorskej roly.** Dnes odpovedá autor projektu. Keď rolu
  prevezme niekto z prevádzky budovy, mení sa jediná premenná prostredia.
  Nie je to technická úloha, je to dohoda medzi ľuďmi.

## Zvažujeme

Veci, o ktorých vieme, že by dávali zmysel, ale ešte nie je dokázané, že sú
naozaj potrebné. Nič z toho nie je sľub.

- **Tretí druh záznamu: vec na chodbe.** Dva scenáre — *„vyložil som pred ateliér
  starý gauč, ber si"* a *„patrí niekomu tá knižnica pred dverami?"*. Vyzerá to
  ako jedna funkcia, ale prvé je ponuka a druhé je otázka o veci bez menovky.
  Zámerne to **nie je bazár**: žiadne pole s cenou, žiadne platby. Cena patrí do
  voľného textu. Podstatné je, že na takýto záznam odpovedá sused, nie operátor —
  a že vec, ku ktorej sa nikto neprihlási, po čase prejde medzi problémy.
  Tým sa zo skladovania na chodbe stane niečo, čo má expiráciu.
- **Účty namiesto jedného pinu.** Dnes stojí právo mazať na jednom pine, ktorý
  pozná operátor. Na jedno poschodie, kde sa všetci poznajú, to stačí. Na viac
  poschodí to stačiť nebude.
- **Viac poschodí.** Zóny sú natvrdo v kóde, lebo pilot beží na jednej chodbe.
  Pribudnutie poschodia je dnes jeden commit, nie admin rozhranie.

## Čo tu zámerne nebude

Je to v `README.md` a platí to aj naďalej: žiadny pôdorys, žiadny register prvkov
budovy, žiadne nájmy a zmluvy, žiadny login pre nahlasovanie, žiadne AI.

A jedna vec navyše, ktorá platí pre všetko vyššie: **karta nikdy nebude vlákno.**
Jedno hlásenie, jedna odpoveď, jeden klik. Vo chvíli, keď sa pod fotkou dá
diskutovať, je z Kriklúna presne tá sociálna sieť, ktorú má nahradiť.
