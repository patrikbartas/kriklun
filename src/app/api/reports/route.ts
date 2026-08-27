import { NextResponse } from "next/server";
import { listReports, createReport, addWatcher } from "@/lib/store";
import { notifyNew } from "@/lib/mail";
import { ZONES } from "@/lib/zones";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listReports());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();

    const kind = b.kind === "oznam" ? "oznam" : "problem";
    const text = String(b.text ?? "").trim();
    const zone = ZONES.includes(b.zone) ? b.zone : ZONES[ZONES.length - 1];
    const author = String(b.author ?? "").trim() || "neznámy";
    const photo = typeof b.photoDataUrl === "string" ? b.photoDataUrl : null;

    // Problem potrebuje aspon fotku alebo text. Oznam potrebuje text.
    if (kind === "oznam" && !text) {
      return NextResponse.json({ error: "oznam potrebuje text" }, { status: 400 });
    }
    if (kind === "problem" && !photo && !text) {
      return NextResponse.json({ error: "pridaj fotku alebo text" }, { status: 400 });
    }

    const row = await createReport({
      kind,
      text,
      zone,
      author,
      photoDataUrl: photo,
      expiresAt: b.expiresAt ? String(b.expiresAt) : null,
    });

    // Kto nechal mail, sleduje vlastnu vec automaticky. To je cela slucka
    // "vypocuty": nahlasis a dozvies sa, ked sa nieco pohne.
    const email = String(b.email ?? "").trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        await addWatcher(row.id, email);
      } catch {}
    }

    try {
      await notifyNew(row);
    } catch (e) {
      console.error("notifikacia zlyhala:", e);
    }
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
