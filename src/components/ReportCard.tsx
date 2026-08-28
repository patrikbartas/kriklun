"use client";

import { useState } from "react";
import StatusDot, { statusColor } from "./StatusDot";
import { BellIcon } from "@/components/ui/bell";
import { ageLabel, untilLabel } from "@/lib/time";
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
  // Oznam nema stav, tak nema ani bodku - a uz ani odsadenie. Odsadenie
  // vyrabala bodka; prazdny stlpec po nej sa necital ako "iny druh zaznamu",
  // ale ako bodka, ktora sa nenacitala. Rovna lava hrana textu bola kupena
  // dierou. Oznam ma odteraz vlastny tvar, nie tvar hlasenia bez casti.
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
      {/*
        Kto to nahlasil, patri nad text, nie pod odpoved operatora. Na hlaseni
        je hlavicka navigacia: co je pokazene a kde, este predtym, nez zacnes
        citat. Oznam ju nema - tam je obsahom sama veta.
      */}
      {!oznam && (
        <header className="mb-2 flex items-center gap-2 text-dim">
          {dotInHeader && <StatusDot status={r.status} />}
          <span className="min-w-0 truncate">
            {r.author} · {r.zone}
          </span>
          <span className="ml-auto shrink-0">{ageLabel(r.created_at)}</span>
        </header>
      )}

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
      {r.text &&
        (oznam ? (
          <p className="whitespace-pre-wrap">{r.text}</p>
        ) : (
          <div className="relative pl-6">
            <span className="absolute left-0 top-0 flex h-[1.5em] w-6 items-center justify-center">
              <StatusDot status={r.status} />
            </span>
            <p className="whitespace-pre-wrap">{r.text}</p>
          </div>
        ))}

      {/*
        Podpis oznamu ide pod rec, nie nad nu. Sloveso robi to, co predtym
        stitok "oznam · " pred menom - povie, ze toto nie je pokazena vec -
        len bez toho, aby druh zaznamu stal pred tym, kto hovori.

        Vpravo zarovnany cas je znak hlasenia: hovori, ako dlho sa nan nikto
        nepozrel. Oznam nikto neriesi, tak sa tu nema co zanedbat; namiesto
        veku stoji vo vete platnost, ked ju oznam ma.
      */}
      {oznam && (
        <p className="mt-2 text-dim">
          {r.author} oznamuje · {r.zone} ·{" "}
          {r.expires_at ? untilLabel(r.expires_at) : ageLabel(r.created_at)}
        </p>
      )}

      {/*
        Paticka patri hlaseniu, tak stoji pod nim - nie pod odpovedou. Na
        ozname nie je co robit, tak tam nie je vobec; ostane len operatorske
        mazanie.
      */}
      {(!oznam || operator) && (
        <footer className="mt-4 flex items-center gap-4 text-dim">
          {operator && (
            <button onClick={remove} className="active:opacity-60">
              zmazať
            </button>
          )}

          {/*
            Pred klikom je to veta, ktorou sa clovek pridava. Po klike uz je
            v tom cisle zaratany, tak cislo znamena "a este tolkoto dalsich" -
            preto count - 1, nie count.

            Na ozname tlacidlo nie je. To cislo nie je hlas, je to poradie vo
            fronte: hovori operatorovi, ktora pokazena vec pali poschodie
            najviac. Oznamy sa do operatorskej fronty nikdy nedostanu, takze
            na nich ho nema kto precitat - a cislo, ktore nikto necita, uz
            nie je signal, ale pacik.
          */}
          {!oznam && (
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
          )}

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
      )}

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
        Druhy hlas. Hlasenie a odpoved su dvaja rozni hovoriaci - ale nie dve
        polozky. Preto uz odpoved nema vlastnu vodorovnu linku: mala rovnaku
        hrubku aj smer ako linka medzi kartami, tak sa citala ako zaciatok
        dalsieho hlasenia. Vodorovna linka tu odteraz znamena jedine "tu
        zacina nova karta".

        Namiesto nej je konektor. Visi na lavej hrane karty, kde uz stoji
        vsetko sluzobne - hlavicka aj paticka - a text odpovede zacina v tom
        istom stlpci ako text hlasenia. Rec pod recou, sluzobne veci vedla.
      */}
      {!oznam && (
        <div className="relative mt-3 pl-6">
          <span aria-hidden className="absolute left-0 top-0 text-dim">
            └─
          </span>

          {r.status === "nahlasene" ? (
            /* Prazdne miesto je tu ta najdolezitejsia informacia. */
            <p className="text-dim">zatiaľ bez odpovede</p>
          ) : (
            /*
              Jedna veta, jedno pismo, jedna farba. Stav a dovod su ta ista
              vypoved - "teraz to nejde" bez toho, preco, nie je odpoved.
              Rozdelit ich na dva riadky a dovod stlmit do sedej znamenalo
              povedat, ze je vedlajsi. Je hlavny.

              Cas ide na koniec vety, nie doprava. Vpravo zarovnany cas mal
              rovnaky tvar ako cas v hlavicke karty, a prave to davalo
              odpovedi siluetu novej polozky.
            */
            <p>
              <span className="text-dim">operátor: </span>
              {statusLabel(r.status)}.
              {r.status_note ? ` ${r.status_note}` : ""}
              <span className="text-dim"> · {ageLabel(r.updated_at)}</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
