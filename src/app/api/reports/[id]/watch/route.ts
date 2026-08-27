import { NextResponse } from "next/server";
import { addWatcher } from "@/lib/store";

export const dynamic = "force-dynamic";

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { email } = await req.json();

  if (!MAIL.test(String(email ?? "").trim())) {
    return NextResponse.json({ error: "napíš platný mail" }, { status: 400 });
  }

  try {
    await addWatcher(id, String(email));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
