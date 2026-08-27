# Kriklún

> Krič sem, nie na stenu.

Nahlasovanie pokazených vecí a lokálne oznamy pre jednu chodbu v budove
s viacerými nájomníkmi.

Vzniklo to zdola, na jednom poschodí, po tom, čo sa neporiadok počas stavebných
prác skončil hádkou na Facebooku a nápismi sprejom na spoločnej stene. Obe tie
potreby sú legitímne — označiť, čo je pokazené, a povedať, čo je čie. Chýbala len
vrstva, ktorá sa dá zmazať.

## Čo to robí

Odfotíš pokazenú vec, napíšeš, čo je zle, odošleš. Objaví sa to na nástenke,
kde je pri každej veci vidieť, ako dlho už čaká. Ten, kto to má na starosti,
prejde frontu a odpovie.

Podstatné je, že hodnota nie je v oprave, ale v odpovedi. Oprava trvá týždne
a závisí od peňazí a dielov. Odpoveď trvá tri sekundy. Frustrácia nevzniká z
toho, že sa vec nedá opraviť — vzniká z toho, že nevieš, či o nej vôbec niekto vie.

Preto má stav `teraz to nejde` povinný dôvod. „Vieme o tom, náhradný diel príde
o tri týždne“ je plnohodnotná odpoveď.

## Obrazovky

- `/` — nástenka: čo je otvorené a ako dlho
- `/nahlasit` — odfotiť, napísať, odoslať
- `/moje` — denníček: moje hlásenia a čo sa s nimi deje
- `/info` — vysvetlenie v civilnom jazyku
- `/operator` — fronta kariet pre toho, kto odpovedá (chránené pinom)

## Spustenie

```bash
npm install
npm run dev
```

Bez Supabase kľúčov beží appka lokálne do `.data/reports.json` a fotky drží
ako data URL. Nič netreba nastavovať. Reset: zmaž `.data/`.

## Nastavenie

1. V Supabase SQL editore spusti `supabase.sql`, potom `supabase-002-watchers.sql`.
2. `cp .env.example .env.local` a vyplň premenné.
3. `npm run dev`.

| premenná | povinná | na čo |
|---|---|---|
| `SUPABASE_URL` | áno v produkcii | databáza a úložisko fotiek |
| `SUPABASE_SERVICE_ROLE_KEY` | áno v produkcii | server pristupuje k databáze |
| `OPERATOR_PIN` | áno pre `/operator` | bez nej je operátor zavretý |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | nie | odosielanie mailov |
| `NOTIFY_EMAIL` | nie | kam chodia nové hlásenia |
| `SITE_URL` | nie | odkazy v mailoch |

Bez SMTP premenných sa maily ticho preskočia a nič sa nerozbije.

## Ako to je poskladané

Klient nikdy nesiaha na Supabase priamo — všetko ide cez `/api/*` so service role
kľúčom na serveri. Preto je RLS zapnuté a zámerne bez politík: anon kľúč sa
nikde nepoužíva, takže nie je čo povoľovať.

Fotka sa zmenší v prehliadači na 1600 px / JPEG 0.82 ešte pred odoslaním. Bez
toho by fotky z mobilu narazili na limit veľkosti requestu.

Notifikácie sú vždy zabalené v `try/catch`. Výpadok mailov nesmie zablokovať
zápis hlásenia ani zmenu stavu.

## V repozitári nie sú žiadne osobné údaje

Hlásenia, fotky, mená autorov aj mailové adresy žijú v databáze a v úložisku,
nie v kóde. Kľúče sú v `.env.local`, ktorý je v `.gitignore`.

## Čo tu zámerne nie je

Žiadny pôdorys, 2D ani 3D. Žiadny register prvkov budovy. Žiadne nájmy a zmluvy.
Žiadny login pre nahlasovanie. Žiadne AI.

Fotka je popis problému aj jeho lokalizácia zároveň. V budove, kde sa všetci
poznajú, povie fotka pokazenej kľučky viac a rýchlejšie než akákoľvek súradnica.
