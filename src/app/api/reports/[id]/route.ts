import { NextResponse } from "next/server";
import { setStatus, listWatchers, deleteReport } from "@/lib/store";
import { notifyStatusChange } from "@/lib/mail";
import { STATUSES, type Status } from "@/lib/types";

export const dynamic = "force-dynamic";

// Ziadny fallback pin. Ked nie je nastaveny OPERATOR_PIN, operator je zavrety.
// Uhadnutelny default v produkcii by znamenal, ze appku vie menit ktokolvek.
function pinFails(sent: unknown): NextResponse | null {
  const pin = process.env.OPERATOR_PIN;
  if (!pin) {
    return NextResponse.json(
      { error: "operátor nie je nastavený (chýba OPERATOR_PIN)" },
      { status: 503 },
    );
  }
  if (String(sent ?? "") !== pin) {
    return NextResponse.json({ error: "zly pin" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const b = await req.json();

  const bad = pinFails(b.pin);
  if (bad) return bad;

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

/**
 * Zmazanie hlasenia. Docasne riesenie moderacie: kym nie su ucty, je jediny
 * operator a ten vie odstranit vlastny omyl aj cudzi obsah, ktory tam nepatri.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  const bad = pinFails(b.pin);
  if (bad) return bad;

  try {
    const done = await deleteReport(id);
    if (!done) return NextResponse.json({ error: "nenajdene" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
