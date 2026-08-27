"use client";

import { useState } from "react";
import StatusDot from "./StatusDot";
import { BellIcon } from "@/components/ui/bell";
import { ageLabel } from "@/lib/time";
import { statusLabel, type Report } from "@/lib/types";
import {
  hasPlused,
  markPlused,
  getMail,
  setMail,
  isWatching,
  markWatching,
  getPin,
} from "@/lib/me";

export default function ReportCard({
  r,
  onChange,
  onDelete,
}: {
  r: Report;
  onChange?: (r: Report) => void;
  onDelete?: (id: string) => void;
}) {
  const [plused, setPlused] = useState(() => hasPlused(r.id));
  const [count, setCount] = useState(r.plus_ones);
  const [watching, setWatching] = useState(() => isWatching(r.id));
  const [asking, setAsking] = useState(false);
  const [mail, setMailInput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  // Tlacidlo vidi len ten, kto ma v prehliadaci pin. Pravo overuje az server.
  const [operator] = useState(() => Boolean(getPin()));
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

  async function remove() {
    if (!confirm("zmazať natrvalo, aj s fotkou?")) return;
    setErr(null);
    const res = await fetch(`/api/reports/${r.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: getPin() }),
    });
    if (!res.ok) {
      setErr((await res.json()).error ?? "nepodarilo sa zmazať");
      return;
    }
    onDelete?.(r.id);
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
      {/* Kto to nahlasil, patri nad text, nie pod odpoved operatora. */}
      <header className="mb-2 flex items-center gap-2 text-dim">
        <span className="min-w-0 truncate">
          {oznam ? "oznam · " : ""}
          {r.author} · {r.zone}
        </span>
        <span className="ml-auto shrink-0">{ageLabel(r.created_at)}</span>
      </header>

      {r.photo_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={r.photo_url}
          alt=""
          className="hair mb-3 aspect-square w-full border object-cover"
        />
      )}

      {r.text && <p className="whitespace-pre-wrap">{r.text}</p>}

      {/*
        Druhy hlas. Hlasenie a odpoved su dvaja rozni hovoriaci, tak maju dva
        bloky. Ked odpoved neprisla, blok to povie nahlas - prazdne miesto je
        tu ta najdolezitejsia informacia.
      */}
      {!oznam && (
        /*
          Linka je zapustena zlava a bodka visi vedla nej. Keby siahala cez celu
          sirku, citala by sa rovnako ako linka medzi kartami a odpoved by
          vyzerala ako dalsie hlasenie, nie ako reakcia na to nad nou.
        */
        <div className="hair relative ml-[17px] flex gap-2 border-t pt-3">
          <span className="absolute left-[-17px] top-[calc(0.75rem+5px)]">
            <StatusDot status={r.status} />
          </span>

          {r.status === "nahlasene" ? (
            <p className="text-dim">zatiaľ bez odpovede</p>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <p>
                  <span className="text-dim">operátor · </span>
                  {statusLabel(r.status)}
                </p>
                {r.status_note && <p className="text-dim">{r.status_note}</p>}
              </div>
              <span className="shrink-0 text-dim">{ageLabel(r.updated_at)}</span>
            </>
          )}
        </div>
      )}

      {/* Paticka patri tomu, kto sa pozera - nie ani jednemu z dvoch hlasov. */}
      <footer className="mt-3 flex items-center gap-4 text-dim">
        {operator && (
          <button onClick={remove} className="active:opacity-60">
            zmazať
          </button>
        )}

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
