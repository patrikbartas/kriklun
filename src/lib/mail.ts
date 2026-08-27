// Odosielanie mailov cez SMTP. Ked nie su premenne, ticho sa preskoci.
// Notifikacia je bonus a nikdy nesmie zhodit zapis hlasenia.

import nodemailer, { type Transporter } from "nodemailer";
import type { Report } from "./types";
import { statusLabel } from "./types";

let tx: Transporter | null = null;

function transport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  if (!tx) {
    const port = Number(process.env.SMTP_PORT || 587);
    tx = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = implicitne TLS, 587 = STARTTLS
      auth: { user, pass },
    });
  }
  return tx;
}

function siteUrl() {
  return process.env.SITE_URL || "https://kriklun.com";
}

async function send(to: string[], subject: string, text: string) {
  const t = transport();
  if (!t || to.length === 0) return;
  const from = process.env.SMTP_FROM || `Kriklún <${process.env.SMTP_USER}>`;
  try {
    await t.sendMail({ from, to, subject, text });
  } catch (e) {
    console.error("mail zlyhal:", e);
  }
}

/** Operatorovi, ked pribudne nove hlasenie. */
export async function notifyNew(r: Report) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  const what = r.kind === "oznam" ? "oznam" : "problém";

  await send(
    [to],
    `[kriklún] nový ${what} — ${r.zone}`,
    [
      `${r.author} pridal ${what}.`,
      ``,
      `zóna: ${r.zone}`,
      `text: ${r.text || "(bez textu)"}`,
      r.photo_url ? `foto: ${r.photo_url}` : `foto: (žiadne)`,
      ``,
      siteUrl(),
    ].join("\n"),
  );
}

/** Vsetkym, co maju na tejto veci zvoncek, ked sa zmeni stav. */
export async function notifyStatusChange(
  r: Report,
  watchers: { email: string; id: string }[],
) {
  const label = statusLabel(r.status);
  const what = r.text ? `„${r.text.slice(0, 60)}“` : r.zone;

  await Promise.all(
    watchers.map((w) =>
      send(
        [w.email],
        `[kriklún] ${label} — ${r.zone}`,
        [
          `Zmenil sa stav veci, ktorú sleduješ.`,
          ``,
          `${what}`,
          `zóna: ${r.zone}`,
          `nový stav: ${label}`,
          r.status_note ? `dôvod: ${r.status_note}` : ``,
          ``,
          siteUrl(),
          ``,
          `Nechceš to už sledovať? ${siteUrl()}/api/odhlasit?id=${w.id}`,
        ]
          .filter((l) => l !== "")
          .join("\n"),
      ),
    ),
  );
}
