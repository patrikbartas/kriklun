"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import Wordmark from "@/components/Wordmark";
import type { SlabKey } from "@/components/kampus/Model";
import {
  AKTIVNE,
  BUILDINGS,
  VIEWS,
  levelLabel,
  type View,
} from "@/lib/kampus";

/*
  Model sa nacitava az tu a len tu. Je to zhruba 150 kB gzip, co je viac nez
  cely zvysok appky - a chodba, na ktorej clovek hlasi pokazenu sprchu, o tom
  nemusi vediet. Preto ssr: false a vlastny chunk.
*/
const Model = dynamic(() => import("@/components/kampus/Model"), {
  ssr: false,
  loading: () => null,
});

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => setDark(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return dark;
}

function parse(key: SlabKey) {
  const [id, n] = key.split(":");
  const b = BUILDINGS.find((x) => x.id === id);
  return { label: b?.label ?? id, n: Number(n), id };
}

export default function KampusView() {
  const [view, setView] = useState<View>("skola");
  const [nonce, setNonce] = useState(0);
  const [hovered, setHovered] = useState<SlabKey | null>(null);
  const [selected, setSelected] = useState<SlabKey | null>(null);
  const dark = useDark();

  const shown = hovered ?? selected;
  const info = shown ? parse(shown) : null;
  const isActive =
    info !== null &&
    info.id === AKTIVNE.building &&
    info.n === AKTIVNE.level;

  return (
    <>
      <Wordmark sub="Svieti poschodie, na ktoré sa dá hlásiť." />

      <div className="mb-3 flex items-center gap-4">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            // Klik na uz zapnuty pohlad model preramuje. Je to najlacnejsi
            // sposob, ako sa vratit spat, ked si clovek model zatoci nabok.
            onClick={() => {
              setView(v.id);
              setNonce((x) => x + 1);
            }}
            style={{ color: view === v.id ? "var(--fg)" : "var(--dim)" }}
          >
            <span
              style={{
                borderBottom:
                  view === v.id
                    ? "1px solid var(--fg)"
                    : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {v.label}
            </span>
          </button>
        ))}
      </div>

      <div className="hair h-[56vh] max-h-[520px] min-h-[300px] border">
        <Model
          view={view}
          nonce={nonce}
          dark={dark}
          hovered={hovered}
          selected={selected}
          onHover={setHovered}
          onSelect={setSelected}
        />
      </div>

      {/* Riadok ma pevnu vysku, aby model pri prejdeni mysou nepodskakoval. */}
      <div className="mt-3 flex min-h-[38px] items-start justify-between gap-4">
        <div>
          <p>
            {info
              ? `${info.label} · ${levelLabel(info.n)}`
              : VIEWS.find((v) => v.id === view)!.label}
          </p>
          <p className="text-dim">
            {info
              ? isActive
                ? "sem sa dnes dá hlásiť"
                : "zatiaľ sem nevedie žiadna zóna"
              : "ťahaj – otočíš · dvoma prstami posunieš · štipni – priblížiš"}
          </p>
        </div>
        {isActive && (
          <Link
            href="/"
            className="shrink-0 active:opacity-60"
            style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            nástenka →
          </Link>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <section>
          <p className="text-dim">čo tu vidíš</p>
          <p className="mt-1">
            Dve budovy spojené krčkom. Kriklún zatiaľ počúva na jedinej chodbe
            celého kampusu — na 2NP školy. Preto je to jediné poschodie, ktoré
            svieti, a jediné, ktoré reaguje na klik.
          </p>
        </section>

        <section>
          <p className="text-dim">prečo je tu aj zvyšok</p>
          <p className="mt-1">
            Aby bolo vidieť, aká malá časť to je. Internát a krčok sa dajú
            obzrieť, ale nereagujú — nie je za nimi nič, čo by sa dalo nahlásiť.
            Keď pribudne poschodie, pribudne tu svetlo.
          </p>
        </section>
      </div>
    </>
  );
}
