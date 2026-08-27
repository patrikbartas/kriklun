"use client";

import { useEffect, useMemo, useState } from "react";
import StatusDot from "@/components/StatusDot";
import { useReports } from "@/lib/useReports";
import { ageLabel } from "@/lib/time";
import { QUEUE_STATUSES, type Report, type Status } from "@/lib/types";
import { getPin, setPin } from "@/lib/me";
import Wordmark from "@/components/Wordmark";

const ACTIONS: { id: Status; label: string }[] = [
  { id: "vidime", label: "vidíme to" },
  { id: "riesi_sa", label: "rieši sa" },
  { id: "teraz_nejde", label: "teraz to nejde" },
  { id: "hotove", label: "hotové" },
];

export default function Operator() {
  const { rows, replace, reload } = useReports();
  const [pin, setPinState] = useState("");
  const [ok, setOk] = useState(false);
  const [i, setI] = useState(0);
  const [note, setNote] = useState("");
  const [asking, setAsking] = useState<Status | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Fronta je uzka zamerne. Ale odpoved sa da zmylit a "teraz to nejde" sa raz
  // stane "hotove", tak musi existovat cesta spat k uz odpovedanej karte.
  const [vsetko, setVsetko] = useState(false);

  useEffect(() => {
    const p = getPin();
    if (p) {
      setPinState(p);
      setOk(true);
    }
  }, []);

  // Najstarsie neodpovedane hore. Kto caka najdlhsie, ide prvy.
  //
  // V rezime "vsetko" sa radi podla datumu nahlasenia, nie podla stavu. Keby
  // sa radilo podla stavu, karta by po zmene odskocila inam a operator by sa
  // zrazu pozeral na cudziu vec.
  const queue = useMemo(() => {
    const all = (rows ?? []).filter((r) => r.kind === "problem");
    if (vsetko) {
      return all.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return all
      .filter((r) => QUEUE_STATUSES.includes(r.status))
      .sort((a, b) => {
        const un = (r: Report) => (r.status === "nahlasene" ? 0 : 1);
        return un(a) - un(b) || a.created_at.localeCompare(b.created_at);
      });
  }, [rows, vsetko]);

  const card = queue[i];

  // Poznamka patri karte, nie obrazovke. Bez tohto by sa rozpisany dovod
  // preniesol na dalsiu kartu a priradil sa k cudziemu hlaseniu.
  function go(n: number) {
    setI(n);
    setNote("");
    setAsking(null);
    setErr(null);
  }

  async function act(status: Status) {
    if (!card) return;
    if (status === "teraz_nejde" && !note.trim()) {
      setAsking("teraz_nejde");
      return;
    }
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/reports/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: note.trim() || null, pin }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json()).error ?? "nepodarilo sa");
      return;
    }
    replace(await res.json());
    setNote("");
    setAsking(null);
  }

  if (!ok) {
    return (
      <>
        <Wordmark suffix="OPERÁTOR" />
        <input
          value={pin}
          onChange={(e) => setPinState(e.target.value)}
          placeholder="pin"
          className="hair mb-6 w-full border-b pb-2 placeholder:text-dim"
        />
        <button
          onClick={() => {
            setPin(pin);
            setOk(true);
          }}
          className="hair w-full border py-4"
        >
          ďalej
        </button>
      </>
    );
  }

  return (
    <>
      <Wordmark suffix="OPERÁTOR" />

      <div className="mb-4 flex items-center gap-4">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            onClick={() => {
              setVsetko(v);
              go(0);
            }}
            style={{ color: vsetko === v ? "var(--fg)" : "var(--dim)" }}
          >
            <span
              style={{
                borderBottom:
                  vsetko === v ? "1px solid var(--fg)" : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {v ? "všetko" : "fronta"}
            </span>
          </button>
        ))}
        <span className="ml-auto text-dim">
          {queue.length ? `${i + 1}/${queue.length}` : "0"}
        </span>
      </div>

      {!card && (
        <p className="hair border-t py-6 text-dim">
          {vsetko
            ? "zatiaľ nič nie je nahlásené."
            : "fronta je prázdna. všetko odpovedané."}
        </p>
      )}

      {card && (
        <>
          {/* Rovnaka hlavicka ako na nastenke: kto a odkial, nie co uz odpovedal. */}
          <div className="mb-2 flex items-center gap-2 text-dim">
            <StatusDot status={card.status} />
            <span className="min-w-0 truncate">
              {card.author} · {card.zone}
              {card.plus_ones > 0 ? ` · +${card.plus_ones}` : ""}
            </span>
            <span className="ml-auto shrink-0">otvorené {ageLabel(card.created_at)}</span>
          </div>

          {card.photo_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={card.photo_url}
              alt=""
              className="hair mb-3 aspect-square w-full border object-cover"
            />
          )}

          {card.text && <p className="mb-5 whitespace-pre-wrap">{card.text}</p>}

          {/*
            V rezime "vsetko" sa operator pozera na uz odpovedanu kartu. Bez
            tohto by nevidel dovod, ktory sam napisal, a prepisoval by vlastnu
            odpoved naslepo.
          */}
          {card.status_note && (
            <p className="mb-5 text-dim">{card.status_note}</p>
          )}

          {asking && (
            <input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="prečo to teraz nejde"
              className="hair mb-4 w-full border-b pb-2 placeholder:text-dim"
            />
          )}

          <div className="grid grid-cols-2 gap-2">
            {ACTIONS.map((a) => {
              const on = card.status === a.id;
              return (
                <button
                  key={a.id}
                  disabled={busy}
                  onClick={() => act(a.id)}
                  className="hair border py-4 active:opacity-60"
                  style={
                    on
                      ? { background: "var(--fg)", color: "var(--bg)", borderColor: "var(--fg)" }
                      : undefined
                  }
                >
                  {on ? "✓ " : ""}
                  {a.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex text-dim">
            <button onClick={() => go(Math.max(0, i - 1))}>
              ← predchádzajúce
            </button>
            <button
              className="ml-auto"
              onClick={() => go(Math.min(queue.length - 1, i + 1))}
            >
              nasledujúce →
            </button>
          </div>
        </>
      )}

      {err && (
        <p className="mt-4" style={{ color: "var(--s-nahlasene)" }}>
          {err}
        </p>
      )}

      <button onClick={reload} className="mt-8 text-dim">
        obnoviť
      </button>
    </>
  );
}
