export type Kind = "problem" | "oznam";

export type Status =
  | "nahlasene"
  | "vidime"
  | "riesi_sa"
  | "teraz_nejde"
  | "hotove";

export type Report = {
  id: string;
  kind: Kind;
  text: string;
  zone: string;
  author: string;
  photo_url: string | null;
  status: Status;
  status_note: string | null;
  expires_at: string | null;
  plus_ones: number;
  created_at: string;
  updated_at: string;
};

export const STATUSES: { id: Status; label: string }[] = [
  { id: "nahlasene", label: "nahlásené" },
  { id: "vidime", label: "vidíme to" },
  { id: "riesi_sa", label: "rieši sa" },
  { id: "teraz_nejde", label: "teraz to nejde" },
  { id: "hotove", label: "hotové" },
];

// Na nastenke je otvorene vsetko, co nie je hotove.
// "teraz to nejde" tam zamerne zostava: vec je stale pokazena, len sa odlozila.
export const OPEN_STATUSES: Status[] = [
  "nahlasene",
  "vidime",
  "riesi_sa",
  "teraz_nejde",
];

// Operatorska fronta je uzsia: co uz dostalo odpoved, sa tam nevracia.
export const QUEUE_STATUSES: Status[] = ["nahlasene", "vidime", "riesi_sa"];

export function statusLabel(s: Status) {
  return STATUSES.find((x) => x.id === s)?.label ?? s;
}
