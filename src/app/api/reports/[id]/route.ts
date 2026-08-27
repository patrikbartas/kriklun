import { NextResponse } from "next/server";
import { setStatus, listWatchers } from "@/lib/store";
import { notifyStatusChange } from "@/lib/mail";
import { STATUSES, type Status } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const b = await req.json();

  // Ziadny fallback pin. Ked nie je nastaveny OPERATOR_PIN, operator je zavrety.
  // Uhadnutelny default v produkcii by znamenal, ze stavy vie menit ktokolvek.
  const pin = process.env.OPERATOR_PIN;
  if (!pin) {
    return NextResponse.json(
      { error: "operátor nie je nastavený (chýba OPERATOR_PIN)" },
      { status: 503 },
    );
  }
  if (String(b.pin ?? "") !== pin) {
    return NextResponse.json({ error: "zly pin" }, { status: 401 });
  }

  const status = b.status as Status;
  if (!STATUSES.some((s) => s.id === status)) {
    return NextResponse.json({ error: "neznamy stav" }, { status: 400 });
  }

  const note = String(b.note ?? "").trim() || null;
  // Stav "teraz to nejde" bez dovodu je presne to, co vyrabalo frustraciu.
  if (status === "teraz_nejde" && !note) {
    return NextResponse.json({ error: "napíš dôvod" }, { status: 400 });
  }

  try {
    const row = await setStatus(id, status, note);
    if (!row) return NextResponse.json({ error: "nenajdene" }, { status: 404 });

    // Notifikacia je bonus. Ked zlyha, zmena stavu musi aj tak prejst -
    // inak by vypadok mailu zablokoval jedinu vec, na ktorej naozaj zalezi.
    try {
      await notifyStatusChange(row, await listWatchers(id));
    } catch (e) {
      console.error("notifikacia zlyhala:", e);
    }

    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
