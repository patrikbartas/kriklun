// Server-only datova vrstva.
//
// Dva backendy:
//   1. Supabase, ked su nastavene env premenne (produkcia)
//   2. lokalny JSON subor v .data/, ked nie su (aby sa dalo hned klikat)
//
// Klient nikdy nesiaha na Supabase priamo. Vsetko ide cez /api/*,
// takze staci service role kluc na serveri a netreba riesit RLS politiky.

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Report, Kind, Status } from "./types";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "fotky";

export const usingSupabase = Boolean(URL && KEY);

let client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!client) client = createClient(URL!, KEY!, { auth: { persistSession: false } });
  return client;
}

const LOCAL_FILE = path.join(process.cwd(), ".data", "reports.json");

async function readLocal(): Promise<Report[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeLocal(rows: Report[]) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2));
}

/** data URL -> Supabase Storage, vrati verejnu URL. Lokalne vrati data URL tak, ako je. */
async function storePhoto(dataUrl: string | null): Promise<string | null> {
  if (!dataUrl) return null;
  if (!usingSupabase) return dataUrl;

  const m = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!m) return null;
  const [, mime, b64] = m;
  const ext = mime.split("/")[1].replace("jpeg", "jpg");
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await sb()
    .storage.from(BUCKET)
    .upload(name, Buffer.from(b64, "base64"), { contentType: mime, upsert: false });
  if (error) throw new Error(`upload zlyhal: ${error.message}`);

  return sb().storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

export async function listReports(): Promise<Report[]> {
  if (!usingSupabase) {
    const rows = await readLocal();
    return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const { data, error } = await sb()
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Report[];
}

export type NewReport = {
  kind: Kind;
  text: string;
  zone: string;
  author: string;
  photoDataUrl: string | null;
  expiresAt: string | null;
};

export async function createReport(input: NewReport): Promise<Report> {
  const photo_url = await storePhoto(input.photoDataUrl);
  const now = new Date().toISOString();

  const row: Report = {
    id: randomUUID(),
    kind: input.kind,
    text: input.text,
    zone: input.zone,
    author: input.author,
    photo_url,
    status: "nahlasene",
    status_note: null,
    expires_at: input.expiresAt,
    plus_ones: 0,
    created_at: now,
    updated_at: now,
  };

  if (!usingSupabase) {
    const rows = await readLocal();
    rows.push(row);
    await writeLocal(rows);
    return row;
  }

  const { data, error } = await sb().from("reports").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as Report;
}

export async function setStatus(
  id: string,
  status: Status,
  note: string | null,
): Promise<Report | null> {
  const now = new Date().toISOString();

  if (!usingSupabase) {
    const rows = await readLocal();
    const r = rows.find((x) => x.id === id);
    if (!r) return null;
    r.status = status;
    r.status_note = note;
    r.updated_at = now;
    await writeLocal(rows);
    return r;
  }

  const { data, error } = await sb()
    .from("reports")
    .update({ status, status_note: note, updated_at: now })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Report;
}

export async function addPlusOne(id: string): Promise<Report | null> {
  if (!usingSupabase) {
    const rows = await readLocal();
    const r = rows.find((x) => x.id === id);
    if (!r) return null;
    r.plus_ones += 1;
    await writeLocal(rows);
    return r;
  }

  const { data, error } = await sb().rpc("plus_one", { row_id: id }).single();
  if (error) throw new Error(error.message);
  return data as Report;
}

// ---------------------------------------------------------------------------
// Zvoncek: mailova adresa naviazana na jedno hlasenie. Ziadny ucet.
// ---------------------------------------------------------------------------

export type Watcher = { id: string; report_id: string; email: string };

const WATCH_FILE = path.join(process.cwd(), ".data", "watchers.json");

async function readWatch(): Promise<Watcher[]> {
  try {
    return JSON.parse(await fs.readFile(WATCH_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeWatch(rows: Watcher[]) {
  await fs.mkdir(path.dirname(WATCH_FILE), { recursive: true });
  await fs.writeFile(WATCH_FILE, JSON.stringify(rows, null, 2));
}

export async function addWatcher(reportId: string, email: string): Promise<void> {
  const clean = email.trim().toLowerCase();

  if (!usingSupabase) {
    const rows = await readWatch();
    if (rows.some((w) => w.report_id === reportId && w.email === clean)) return;
    rows.push({ id: randomUUID(), report_id: reportId, email: clean });
    await writeWatch(rows);
    return;
  }

  // Duplicitu odchyti unikatny index, opakovane kliknutie teda nie je chyba.
  const { error } = await sb()
    .from("watchers")
    .insert({ id: randomUUID(), report_id: reportId, email: clean });
  if (error && !error.message.includes("duplicate")) throw new Error(error.message);
}

export async function listWatchers(reportId: string): Promise<Watcher[]> {
  if (!usingSupabase) {
    return (await readWatch()).filter((w) => w.report_id === reportId);
  }
  const { data, error } = await sb()
    .from("watchers")
    .select("id, report_id, email")
    .eq("report_id", reportId);
  if (error) throw new Error(error.message);
  return (data ?? []) as Watcher[];
}

export async function removeWatcher(id: string): Promise<boolean> {
  if (!usingSupabase) {
    const rows = await readWatch();
    const next = rows.filter((w) => w.id !== id);
    if (next.length === rows.length) return false;
    await writeWatch(next);
    return true;
  }
  const { error } = await sb().from("watchers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
