# Ako sa zapojiť

Kriklún je malý nástroj pre jedno poschodie jednej budovy. Nesnaží sa byť
platformou a väčšina dobrých príspevkov bude preto skôr o tom, čo **ubrať**,
než o tom, čo pridať.

## Nemusíš vedieť programovať

Dobre položená otázka je tiež príspevok. Ak si v podobnej budove a niečo z toho
u vás nefunguje alebo funguje inak, napíš to do issue — to je cennejšie než
väčšina pull requestov.

## Keď našiel chybu

Založ issue a napíš, čo si robil, čo si čakal a čo sa stalo. Ak je to na mobile,
napíš aký. Fotku obrazovky priloži pokojne aj rozmazanú.

Pozor na jednu vec: **pokazená vec v budove nie je chyba appky.** Tie patria do
samotného Kriklúna, nie sem.

## Keď chceš niečo doprogramovať

```bash
npm install
npm run dev
```

Bez Supabase kľúčov beží appka lokálne do `.data/reports.json` a fotky drží ako
data URL. Netreba nastavovať nič a nepotrebuješ prístup k žiadnej databáze.
Reset je `rm -rf .data`.

Predtým, než pošleš pull request, pozri sa do `ROADMAP.md` — hlavne do sekcie
*Čo tu zámerne nebude*. Nie je to zoznam vecí, na ktoré sa nedostalo. Je to
zoznam vecí, ktoré boli zvážené a odmietnuté, a každá má dôvod.

## Čo sa skoro určite nezlúči

- **Vlákna a komentáre pod hlásením.** Jedno hlásenie, jedna odpoveď. Diskusia
  pod fotkou robí z Kriklúna sociálnu sieť, ktorú má nahradzať.
- **Účty a prihlasovanie pre nahlasovanie.** Prihlasovanie v chodbe s mobilom
  v ruke zabije adopciu spoľahlivejšie než čokoľvek iné.
- **Pôdorysy, 2D a 3D mapy, register prvkov budovy.** Fotka je popis problému
  aj jeho lokalizácia zároveň.
- **Menovanie vinníkov.** Evidujú sa veci a miesta, nie ľudia. Rozbité dvere sú
  problém, sused nie.

## Štýl

Kód číta ako okolitý kód. Komentáre sa píšu k tomu, **prečo** je niečo tak, nie
čo robí riadok. Rozhodnutia, ktoré niečo stáli, patria do `CHANGELOG.md`.
