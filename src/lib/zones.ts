// Zony su natvrdo v kode, nie v databaze. Zamerne: pilot bezi na jednom
// poschodi, takze admin na spravu zon by bol drahsi nez jeden commit.
// Ked pribudne poschodie alebo miesto, pribudne riadok. Ziadny admin, ziadna tabulka.
export const ZONES = [
  "chodba 2NP",
  "umyváreň",
  "sprcha",
  "WC Ž",
  "WC M",
  "hlavné schodisko",
  "zadné schodisko",
  "výťah",
  "môj ateliér",
  "iné",
] as const;

export type Zone = (typeof ZONES)[number];
