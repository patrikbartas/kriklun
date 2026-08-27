"use client";

import { useState } from "react";
import StatusDot, { statusColor } from "./StatusDot";
import { BellIcon } from "@/components/ui/bell";
import { CigaretteIcon } from "@/components/ui/cigarette";
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
  // Oznam nema stav, tak nema ani bodku. Odsadenie textu si necha, nech ma
  // nastenka jednu lavu hranu textu a nevyzera roztrhane.
  const dot = !oznam;
  // Bodka patri k textu hlasenia. Ked text nie je (hola fotka), nema kde visiet,
  // tak sa vrati do hlavicky.
  const dotInHeader = dot && !r.text;

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
        {dotInHeader && <StatusDot status={r.status} />}
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
          className="photo hair mb-3 aspect-square w-full border object-cover"
          style={
            dot
              ? ({ "--accent": statusColor(r.status) } as React.CSSProperties)
              : undefined
          }
        />
      )}

      {/*
        Bodka visi v lavom stlpci pred textom, nie inline - inak by druhy riadok
        textu zacal inde ako prvy. Stav tak hovori "tato vec je v stave X",
        nie "operator povedal X", a na nastenke z toho vznikne jeden citatelny
        stlpec bodiek po lavej hrane textov.
      */}
      {r.text && (
        <div className="relative pl-6">
          {dot && (
            <span className="absolute left-0 top-0 flex h-[1.5em] w-6 items-center justify-center">
              <StatusDot status={r.status} />
            </span>
          )}
          <p className="whitespace-pre-wrap">{r.text}</p>
        </div>
      )}

      {/* Paticka patri hlaseniu, tak stoji pod nim - nie pod odpovedou. */}
      <footer className="mt-4 flex items-center gap-4 text-dim">
        {operator && (
          <button onClick={remove} className="active:opacity-60">
            zmazať
          </button>
        )}

        {/*
          Pred klikom je to veta, ktorou sa clovek pridava. Po klike uz je v tom
          cisle zaratany, tak cislo znamena "a este tolkoto dalsich" - preto
          count - 1, nie count.
        */}
        <button
          onClick={plus}
          disabled={plused}
          className="ml-auto shrink-0 active:opacity-60"
          style={{ color: plused ? "var(--fg)" : "var(--dim)" }}
        >
          {plused
            ? `✓ aj mňa${count > 1 ? ` + ${count - 1}` : ""}`
            : `aj mňa to trápi${count > 0 ? ` · ${count}` : ""}`}
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

      {/*
        Druhy hlas. Hlasenie a odpoved su dvaja rozni hovoriaci, tak maju dva
        bloky. Ked odpoved neprisla, blok to povie nahlas - prazdne miesto je
        tu ta najdolezitejsia informacia.
      */}
      {!oznam && (
        /*
          Linka je zapustena zlava a ikona operatora visi na jej lavom konci.
          Keby siahala cez celu sirku, citala by sa rovnako ako linka medzi
          kartami a odpoved by vyzerala ako dalsie hlasenie, nie ako reakcia
          na to nad nou.
        */
        <div className="hair mt-7 ml-6 flex border-t pt-3">
          {/*
            Operator je neutralny. Ikona nikdy nedostane farbu stavu a animuje
            sa len na hover - inak by sutazila s bodkou o pozornost.
          */}
          <span
            title="operátor"
            className="-ml-6 flex h-[1.5em] w-6 shrink-0 items-center justify-center text-dim"
            style={{ opacity: r.status === "nahlasene" ? 0.45 : 1 }}
          >
            <CigaretteIcon size={14} aria-hidden />
            <span className="sr-only">operátor</span>
          </span>

          {r.status === "nahlasene" ? (
            <p className="text-dim">zatiaľ bez odpovede</p>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <p>{statusLabel(r.status)}</p>
                {r.status_note && <p className="text-dim">{r.status_note}</p>}
              </div>
              <span className="shrink-0 pl-2 text-dim">
                {ageLabel(r.updated_at)}
              </span>
            </>
          )}
        </div>
      )}
    </article>
  );
}
