import type { Status } from "@/lib/types";

const COLOR: Record<Status, string> = {
  nahlasene: "var(--s-nahlasene)",
  vidime: "var(--s-vidime)",
  riesi_sa: "var(--s-riesi)",
  teraz_nejde: "var(--s-nejde)",
  hotove: "var(--s-hotove)",
};

// Farbu stavu potrebuje aj ramik fotky, tak zije mimo komponenty.
export function statusColor(status: Status) {
  return COLOR[status];
}

// "vidime to" je prstenec, "riesi sa" je plny.
// Rovnaka farba, iny stav vyplne. Tak zostane paleta mala.
export default function StatusDot({ status }: { status: Status }) {
  const c = COLOR[status];
  const hollow = status === "vidime";
  return (
    <span
      aria-hidden
      className="inline-block h-[9px] w-[9px] shrink-0 rounded-full"
      style={
        hollow
          ? { border: `2px solid ${c}`, background: "transparent" }
          : { background: c }
      }
    />
  );
}
