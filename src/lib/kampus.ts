/*
  Kampus je zopar obrysov a sedem cisel. Nenacitava sa ziadny model - ziadne
  .glb, ziadny CAD, ziadny loader. Geometria je tu v subore, lebo su to
  obdlzniky a jeden ohyb, a takto sa da citat, diffovat a opravit jednym
  commitom. Az bude treba miestnosti a dvere, vtedy ma zmysel siahnut po IFC.
  Nie skor.

  Suradnice su podorysne metre, presne ako na vykrese v 3d/rozmery-vsetky.png:
  pociatok v lavom dolnom rohu skolskeho traktu, X doprava, Y hore.
  Do troch.js sa rovina polozi az v komponente (podorysne Y ide dole ako -Z).

  Budova nema casti. Ma podlazia, a podlazie je jeden obrys a jedna vyska.
  Preto tu nenajdes "telocvicnu" ani "kridlo" ako objekt: telocvicna nie je
  vec navyse, je to dovod, preco je obrys internatu po 1NP dlhsi. Rovnako
  skolske kridlo konci na 1NP a od 2NP zostane z podorysu uz len trakt.
*/

export type Point = readonly [number, number];

export type Level = {
  n: number; // podlazie: -1 az 5
  base: number; // spodna hrana nad terenom, m
  height: number; // vyska podlazia, m
  outline: readonly Point[];
};

export type BuildingId = "skola" | "internat" | "krcok";

export type Building = {
  id: BuildingId;
  label: string;
  levels: Level[];
};

const FLOOR = 3;
const BASEMENT = 2.5;

// Podzemie ma vsade 2,5 m a lezi pod terenom, zvysok su tri metre nahor.
// V skutocnosti to take rovne nie je (telocvicna nie je podpivnicena), ale
// pilot to nepotrebuje vediet.
function span(n: number) {
  return n < 0
    ? { base: -BASEMENT, height: BASEMENT }
    : { base: n * FLOOR, height: FLOOR };
}

function level(n: number, outline: readonly Point[]): Level {
  return { n, outline, ...span(n) };
}

// Skola: kriz z traktu (58,5 x 17,5) a kridla (17,5 x 65, vstup na juhu).
const SKOLA_KRIZ: Point[] = [
  [0, 0],
  [46.5, 0],
  [46.5, -6.8],
  [64, -6.8],
  [64, 58.2],
  [46.5, 58.2],
  [46.5, 17.5],
  [0, 17.5],
];

const SKOLA_TRAKT: Point[] = [
  [0, 0],
  [58.5, 0],
  [58.5, 17.5],
  [0, 17.5],
];

// 5NP je ustupene o 1,5 m po celom obvode - je to ta vnutorna ciara
// z okotovaneho podorysu.
const SKOLA_USTUP: Point[] = [
  [1.5, 1.5],
  [57, 1.5],
  [57, 16],
  [1.5, 16],
];

// Internat: L-ko. Po 1NP siaha zvisle rameno az po hornu hranu telocvicne,
// od 2NP konci tam, kde telocvicna zacina.
const INTERNAT_S_TELOCVICNOU: Point[] = [
  [-94, -28.5],
  [-23, -28.5],
  [-23, 33],
  [-38, 33],
  [-38, -11.7],
  [-94, -11.7],
];

const INTERNAT: Point[] = [
  [-94, -28.5],
  [-23, -28.5],
  [-23, 0],
  [-38, 0],
  [-38, -11.7],
  [-94, -11.7],
];

// Krcok je centrovany na hlbku skolskeho traktu: 6,9 / 3,7 / 6,9.
const KRCOK: Point[] = [
  [-23, 6.9],
  [0, 6.9],
  [0, 10.6],
  [-23, 10.6],
];

export const BUILDINGS: Building[] = [
  {
    id: "skola",
    label: "škola",
    levels: [
      level(-1, SKOLA_KRIZ),
      level(0, SKOLA_KRIZ),
      level(1, SKOLA_KRIZ),
      level(2, SKOLA_TRAKT),
      level(3, SKOLA_TRAKT),
      level(4, SKOLA_TRAKT),
      level(5, SKOLA_USTUP),
    ],
  },
  {
    id: "internat",
    label: "internát",
    levels: [
      level(-1, INTERNAT_S_TELOCVICNOU),
      level(0, INTERNAT_S_TELOCVICNOU),
      level(1, INTERNAT_S_TELOCVICNOU),
      level(2, INTERNAT),
      level(3, INTERNAT),
      level(4, INTERNAT),
    ],
  },
  {
    id: "krcok",
    label: "krčok",
    levels: [level(-1, KRCOK), level(0, KRCOK)],
  },
];

/*
  Jedine podlazie, na ktore dnes ukazuje nejaka zona zo zones.ts. Az pribudne
  druhe, pribudne sem riadok - rovnako ako pri zonach ziadny admin a ziadna
  tabulka. Farbenie podla poctu hlaseni tu zamerne este nie je: dnes by kazde
  hlasenie skoncilo na tom istom podlazi, takze by to bola mapa jednej hodnoty.
*/
export const AKTIVNE: { building: BuildingId; level: number } = {
  building: "skola",
  level: 2,
};

export type View = "skola" | "internat" | "kampus";

/*
  Jeden ovladaci prvok, tri stavy. Skryte je skryte - ziadne priesvitne duchy,
  polovicna budova by kazila citatelnost aj radenie priehladnych ploch.
  Krcok sa ukaze len v kampuse: v pohlade na skolu by z nej trcal 23 metrov
  dlhy pahyl do prazdna a citalo by sa to ako chyba.

  Default je skola, nie kampus. Cely kampus je 158 x 87 m pri vyske 20,5 -
  to je placka. Samotna skola je 64 x 65 pri 20,5, teda zhruba 3:1, a to sa
  cita normalne. Navyse hlasenia su v nej.
*/
export const VIEWS: { id: View; label: string; shows: BuildingId[] }[] = [
  { id: "skola", label: "škola", shows: ["skola"] },
  { id: "internat", label: "internát", shows: ["internat"] },
  { id: "kampus", label: "kampus", shows: ["skola", "internat", "krcok"] },
];

export function levelLabel(n: number) {
  return `${n}NP`;
}
