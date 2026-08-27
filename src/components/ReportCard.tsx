"use client";

import { useState } from "react";
import StatusDot from "./StatusDot";
import { BellIcon } from "@/components/ui/bell";
import { ageLabel } from "@/lib/time";
import { statusLabel, type Report } from "@/lib/types";
import { hasPlused, markPlused, getMail, setMail, isWatching, markWatching } from "@/lib/me";

export default function ReportCard({
  r,
  onChange,
}: {
  r: Report;
  onChange?: (r: Report) => void;
}) {
  const [plused, setPlused] = useState(() => hasPlused(r.id));
  const [count, setCount] = useState(r.plus_ones);
  const [watching, setWatching] = useState(() => isWatching(r.id));
  const [asking, setAsking] = useState(false);
  const [mail, setMailInput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const oznam = r.kind === "oznam";

  async function plus() {
    if (plused) return;
    setPlused(true);
    setCount((c) => c + 1);
    markPlused(r.id);
    const res = await fetch(`/api/reports/${r.id}/plus`, { method: "POST" });
    if (res.ok) onChange?.(await res.json());
  }

  async function subscribe(email: string) {
    setErr(null);
    const res = await fetch(`/api/reports/${r.id}/watch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setErr((await res.json()).error ?? "nepodarilo sa");
      return;
    }
    setMail(email);
    markWatching(r.id);
    setWatching(true);
    setAsking(false);
  }

  function bell() {
    if (watching) return;
    const known = getMail();
    if (known) {
      subscribe(known);
    } else {
      setMailInput("");
      setAsking(true);
    }
  }

  return (
    <article className="hair border-t py-4">
      <header className="mb-2 flex items-center gap-2">
        {oznam ? <span className="text-dim">oznam</span> : <StatusDot status={r.status} />}
        <span className="text-dim">{r.zone}</span>
        <span className="ml-auto text-dim">{ageLabel(r.created_at)}</span>
      </header>

      {r.photo_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={r.photo_url}
          alt=""
          className="hair mb-3 w-full border object-cover"
          style={{ maxHeight: 340 }}
        />
      )}

      {r.text && <p className="whitespace-pre-wrap">{r.text}</p>}

      {!oznam && r.status !== "nahlasene" && (
        <p className="mt-2 text-dim">
          {statusLabel(r.status)}
          {r.status_note ? ` — ${r.status_note}` : ""}
        </p>
      )}

      <footer className="mt-3 flex items-center gap-4 text-dim">
        <span>{r.author}</span>

        <button
          onClick={plus}
          disabled={plused}
          className="ml-auto active:opacity-60"
          style={{ color: plused ? "var(--fg)" : "var(--dim)" }}
        >
          {plused ? "✓ " : ""}aj mňa{count > 0 ? ` · ${count}` : ""}
        </button>

        {!oznam && (
          <button
            onClick={bell}
            aria-label={watching ? "sleduješ" : "sledovať zmeny"}
            title={watching ? "sleduješ" : "dať vedieť, keď sa zmení stav"}
            className="shrink-0 active:opacity-60"
            style={{ color: watching ? "var(--fg)" : "var(--dim)" }}
          >
            <BellIcon size={16} />
          </button>
        )}
      </footer>

      {asking && (
        <div className="mt-3">
          <input
            autoFocus
            type="email"
            inputMode="email"
            value={mail}
            onChange={(e) => setMailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && subscribe(mail)}
            placeholder="tvoj mail, príde ti zmena stavu"
            className="hair w-full border-b pb-2 placeholder:text-dim"
          />
          <div className="mt-2 flex gap-4 text-dim">
            <button onClick={() => subscribe(mail)} style={{ color: "var(--fg)" }}>
              sledovať
            </button>
            <button onClick={() => setAsking(false)}>zrušiť</button>
          </div>
        </div>
      )}

      {err && (
        <p className="mt-2" style={{ color: "var(--s-nahlasene)" }}>
          {err}
        </p>
      )}
    </article>
  );
}
